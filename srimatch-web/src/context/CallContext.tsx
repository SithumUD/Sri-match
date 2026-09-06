"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import wsService from "../services/websocket.service";
import ChatService from "../services/chat.service";
import { toast } from "sonner";

interface CallPartner {
  id: number | string;
  name: string;
  profileImageUrl?: string;
}

interface IncomingCallData {
  senderId: number | string;
  senderName: string;
  senderAvatar?: string;
  callType: "VOICE" | "VIDEO";
  sdp: any;
  timestamp: number;
}

interface ActiveCallData {
  partner: CallPartner;
  callType: "VOICE" | "VIDEO";
  isCaller: boolean;
}

type CallStatus = "IDLE" | "RINGING" | "CONNECTING" | "CONNECTED" | "ENDED";

interface CallContextType {
  activeCall: ActiveCallData | null;
  incomingCall: IncomingCallData | null;
  callStatus: CallStatus;
  callDuration: number;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  startCall: (partner: CallPartner, type: "VOICE" | "VIDEO") => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

/* ─── Web Audio Tone Generator for Clean In-App Ringing ─────────────────── */
class TonePlayer {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private intervalId: any = null;

  startRingtone() {
    this.stop();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      const playBurst = () => {
        if (!this.ctx || this.ctx.state === "closed") return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 1.2);
      };

      playBurst();
      this.intervalId = setInterval(playBurst, 2500);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx && this.ctx.state !== "closed") {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

const tonePlayer = new TonePlayer();

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, accessToken, isAuthenticated } = useAuth();
  const [activeCall, setActiveCall] = useState<ActiveCallData | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("IDLE");
  const [callDuration, setCallDuration] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const candidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const durationTimerRef = useRef<any>(null);
  const autoTimeoutRef = useRef<any>(null);
  const activeCallRef = useRef<ActiveCallData | null>(null);
  activeCallRef.current = activeCall;

  // Cleanup helper
  const cleanUpCall = useCallback(() => {
    tonePlayer.stop();
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    candidateQueueRef.current = [];
    setActiveCall(null);
    setIncomingCall(null);
    setCallStatus("IDLE");
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
  }, [localStream, remoteStream]);

  // Duration Timer
  useEffect(() => {
    if (callStatus === "CONNECTED") {
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [callStatus]);

  // Initialize WebRTC Peer Connection
  const createPeerConnection = useCallback((partnerId: number | string) => {
    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    pcRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ChatService.sendCallSignal({
          receiverId: partnerId,
          signalType: "CANDIDATE",
          candidate: event.candidate.toJSON(),
        }).catch((err) => console.warn("Error sending ICE candidate:", err));
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        tonePlayer.stop();
        setCallStatus("CONNECTED");
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        cleanUpCall();
      }
    };

    return pc;
  }, [cleanUpCall]);

  // WebSocket Call Signal Listener
  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect WS if not active
    wsService.connect(accessToken, () => {
      wsService.subscribe("/user/queue/call-signal", async (signal: any) => {
        if (!signal || !signal.signalType) return;

        const currentActive = activeCallRef.current;

        switch (signal.signalType) {
          case "OFFER": {
            if (currentActive) {
              // Already busy on another call
              ChatService.sendCallSignal({
                receiverId: signal.senderId,
                signalType: "BUSY",
                reason: "User is currently busy on another call",
              });
              return;
            }

            tonePlayer.startRingtone();
            setIncomingCall({
              senderId: signal.senderId,
              senderName: signal.senderName || "Caller",
              senderAvatar: signal.senderAvatar,
              callType: signal.callType || "VOICE",
              sdp: signal.sdp,
              timestamp: Date.now(),
            });

            // 30 second unanswered auto-timeout
            if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
            autoTimeoutRef.current = setTimeout(() => {
              tonePlayer.stop();
              setIncomingCall(null);
            }, 30000);
            break;
          }

          case "ANSWER": {
            if (pcRef.current && currentActive) {
              tonePlayer.stop();
              setCallStatus("CONNECTING");
              try {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                // Process any queued candidates
                while (candidateQueueRef.current.length > 0) {
                  const candidate = candidateQueueRef.current.shift();
                  if (candidate) await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
              } catch (e) {
                console.error("Error setting remote description from answer:", e);
              }
            }
            break;
          }

          case "CANDIDATE": {
            if (signal.candidate) {
              if (pcRef.current && pcRef.current.remoteDescription) {
                try {
                  await pcRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
                } catch (e) {
                  console.warn("Error adding ICE candidate:", e);
                }
              } else {
                candidateQueueRef.current.push(signal.candidate);
              }
            }
            break;
          }

          case "REJECT": {
            tonePlayer.stop();
            toast.error(signal.reason || "Call declined");
            cleanUpCall();
            break;
          }

          case "BUSY": {
            tonePlayer.stop();
            toast.info("User is busy on another call.");
            cleanUpCall();
            break;
          }

          case "END": {
            tonePlayer.stop();
            toast.info("Call ended");
            cleanUpCall();
            break;
          }

          default:
            break;
        }
      });
    });

    return () => {
      wsService.unsubscribe("/user/queue/call-signal");
    };
  }, [isAuthenticated, accessToken, cleanUpCall]);

  // 1. Start Outgoing Call
  const startCall = async (partner: CallPartner, type: "VOICE" | "VIDEO") => {
    try {
      tonePlayer.startRingtone();
      setActiveCall({ partner, callType: type, isCaller: true });
      setCallStatus("RINGING");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "VIDEO",
      });
      setLocalStream(stream);

      const pc = createPeerConnection(partner.id);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: type === "VIDEO",
      });
      await pc.setLocalDescription(offer);

      // Send OFFER signal to recipient
      await ChatService.sendCallSignal({
        receiverId: partner.id,
        signalType: "OFFER",
        callType: type,
        sdp: offer,
      });

      // 35-second unanswered timeout
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = setTimeout(() => {
        toast.info("No answer from partner.");
        endCall();
      }, 35000);
    } catch (err: any) {
      console.error("Failed to start call:", err);
      tonePlayer.stop();
      if (err.name === "NotAllowedError") {
        toast.error("Microphone/Camera permission denied. Please allow access in browser settings.");
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to initiate call.");
      }
      cleanUpCall();
    }
  };

  // 2. Accept Incoming Call
  const acceptCall = async () => {
    if (!incomingCall) return;
    tonePlayer.stop();
    if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);

    const caller: CallPartner = {
      id: incomingCall.senderId,
      name: incomingCall.senderName,
      profileImageUrl: incomingCall.senderAvatar,
    };

    try {
      setActiveCall({ partner: caller, callType: incomingCall.callType, isCaller: false });
      setCallStatus("CONNECTING");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incomingCall.callType === "VIDEO",
      });
      setLocalStream(stream);

      const pc = createPeerConnection(caller.id);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.sdp));

      // Process queued candidates
      while (candidateQueueRef.current.length > 0) {
        const candidate = candidateQueueRef.current.shift();
        if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await ChatService.sendCallSignal({
        receiverId: caller.id,
        signalType: "ANSWER",
        callType: incomingCall.callType,
        sdp: answer,
      });

      setIncomingCall(null);
    } catch (err: any) {
      console.error("Failed to accept call:", err);
      toast.error("Failed to establish audio/video stream.");
      rejectCall();
    }
  };

  // 3. Reject Incoming Call
  const rejectCall = async () => {
    if (incomingCall) {
      tonePlayer.stop();
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
      try {
        await ChatService.sendCallSignal({
          receiverId: incomingCall.senderId,
          signalType: "REJECT",
          reason: "Call declined",
        });
      } catch (e) {}
      setIncomingCall(null);
    }
  };

  // 4. End Active Call
  const endCall = async () => {
    if (activeCall) {
      try {
        await ChatService.sendCallSignal({
          receiverId: activeCall.partner.id,
          signalType: "END",
        });
      } catch (e) {}
    }
    cleanUpCall();
  };

  // 5. Toggle Mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  // 6. Toggle Video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff((prev) => !prev);
    }
  };

  return (
    <CallContext.Provider
      value={{
        activeCall,
        incomingCall,
        callStatus,
        callDuration,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

export default CallContext;
