"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Send, Mic, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onRecordingComplete: (audioFile: File, durationSeconds: number) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, onCancel }) => {
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startRecording();

    return () => {
      stopTracks();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Audio recording is not supported in this browser.");
        onCancel();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Select supported mimeType
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/aac'
      ];
      const selectedMime = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) || '';

      const options = selectedMime ? { mimeType: selectedMime } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error("Microphone access error:", err);
      toast.error("Microphone access was denied or not available.");
      onCancel();
    }
  };

  const handleSend = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

    if (recordingSeconds < 1) {
      toast.info("Voice message too short");
      handleDiscard();
      return;
    }

    if (timerRef.current) clearInterval(timerRef.current);

    mediaRecorderRef.current.onstop = () => {
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      const extension = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
      const audioFile = new File([audioBlob], `voice-message-${Date.now()}.${extension}`, { type: mimeType });

      stopTracks();
      onRecordingComplete(audioFile, recordingSeconds);
    };

    mediaRecorderRef.current.stop();
  };

  const handleDiscard = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopTracks();
    onCancel();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center justify-between w-full bg-[#fdf5f0] border border-[#f0ddd5] rounded-full px-4 py-2 animate-in fade-in duration-200">
      {/* Left: Recording Indicator and Live Counter */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.85rem] font-medium text-[#74351b]">
          <Mic size={14} className="text-red-500" />
          <span>{formatTimer(recordingSeconds)}</span>
        </div>
        <span className="hidden sm:inline-block text-[0.74rem] text-[#9a7060]">
          Recording voice note…
        </span>
      </div>

      {/* Right: Discard and Send Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDiscard}
          className="h-8 w-8 rounded-full flex items-center justify-center text-[#9a7060] hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Discard recording"
          aria-label="Discard recording"
        >
          <Trash2 size={16} />
        </button>

        <button
          type="button"
          onClick={handleSend}
          className="h-8 px-3.5 rounded-full bg-gradient-to-r from-[#74351b] to-[#994d2c] text-white flex items-center gap-1.5 text-[0.8rem] font-semibold shadow-sm hover:opacity-95 transition-transform active:scale-95"
          title="Send voice note"
          aria-label="Send voice note"
        >
          <Send size={13} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
