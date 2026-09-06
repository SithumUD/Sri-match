import { create } from 'zustand';
import CallService from '../services/call.service';
import { Alert } from 'react-native';

export interface CallPartner {
  id: number | string;
  name: string;
  avatar?: string;
}

export interface IncomingCallInfo {
  senderId: number | string;
  senderName: string;
  senderAvatar?: string;
  callType: 'VOICE' | 'VIDEO';
  timestamp: number;
}

export interface ActiveCallInfo {
  partner: CallPartner;
  callType: 'VOICE' | 'VIDEO';
  isCaller: boolean;
}

export type CallStatus = 'IDLE' | 'RINGING' | 'CONNECTING' | 'CONNECTED' | 'ENDED';

interface CallStoreState {
  activeCall: ActiveCallInfo | null;
  incomingCall: IncomingCallInfo | null;
  callStatus: CallStatus;
  callDuration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoOff: boolean;

  startCall: (partner: CallPartner, type: 'VOICE' | 'VIDEO', isPremium?: boolean) => Promise<void>;
  setIncomingCall: (incoming: IncomingCallInfo | null) => void;
  acceptCall: () => Promise<void>;
  rejectCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
  incrementDuration: () => void;
  resetCall: () => void;
}

export const useCallStore = create<CallStoreState>((set, get) => ({
  activeCall: null,
  incomingCall: null,
  callStatus: 'IDLE',
  callDuration: 0,
  isMuted: false,
  isSpeakerOn: false,
  isVideoOff: false,

  setIncomingCall: (incomingCall) => set({ incomingCall }),

  startCall: async (partner, type, isPremium = true) => {
    if (!isPremium) {
      set({
        activeCall: { partner, callType: type, isCaller: true },
        callStatus: 'IDLE',
      });
      return;
    }

    set({
      activeCall: { partner, callType: type, isCaller: true },
      callStatus: 'RINGING',
      callDuration: 0,
      isMuted: false,
      isVideoOff: false,
    });

    try {
      // Send OFFER signal to recipient
      await CallService.sendSignal({
        receiverId: partner.id,
        signalType: 'OFFER',
        callType: type,
      });
    } catch (e: any) {
      console.warn('Call start signaling error:', e);
    }
  },

  acceptCall: async () => {
    const { incomingCall } = get();
    if (!incomingCall) return;

    const partner: CallPartner = {
      id: incomingCall.senderId,
      name: incomingCall.senderName,
      avatar: incomingCall.senderAvatar,
    };

    set({
      activeCall: { partner, callType: incomingCall.callType, isCaller: false },
      incomingCall: null,
      callStatus: 'CONNECTED',
      callDuration: 0,
    });

    try {
      await CallService.sendSignal({
        receiverId: partner.id,
        signalType: 'ANSWER',
        callType: incomingCall.callType,
      });
    } catch (e) {
      console.warn('Call accept signaling error:', e);
    }
  },

  rejectCall: async () => {
    const { incomingCall } = get();
    if (incomingCall) {
      try {
        await CallService.sendSignal({
          receiverId: incomingCall.senderId,
          signalType: 'REJECT',
          reason: 'Call declined',
        });
      } catch (e) {}
    }
    set({ incomingCall: null });
  },

  endCall: async () => {
    const { activeCall } = get();
    if (activeCall) {
      try {
        await CallService.sendSignal({
          receiverId: activeCall.partner.id,
          signalType: 'END',
        });
      } catch (e) {}
    }
    get().resetCall();
  },

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleSpeaker: () => set((state) => ({ isSpeakerOn: !state.isSpeakerOn })),
  toggleVideo: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
  incrementDuration: () => set((state) => ({ callDuration: state.callDuration + 1 })),

  resetCall: () =>
    set({
      activeCall: null,
      incomingCall: null,
      callStatus: 'IDLE',
      callDuration: 0,
      isMuted: false,
      isSpeakerOn: false,
      isVideoOff: false,
    }),
}));

export default useCallStore;
