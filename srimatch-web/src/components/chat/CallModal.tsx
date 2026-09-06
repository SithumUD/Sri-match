"use client";

import React, { useState, useEffect } from 'react';
import { Phone, Video, PhoneOff, Mic, MicOff, VideoOff, Volume2, Sparkles, Crown, X } from 'lucide-react';
import Link from 'next/link';

interface CallModalProps {
  type: 'VOICE' | 'VIDEO';
  partner: any;
  isPremium: boolean;
  onClose: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ type, partner, isPremium, onClose }) => {
  const [callStatus, setCallStatus] = useState<'RINGING' | 'CONNECTED'>('RINGING');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // If not premium, show upgrade prompt
  if (!isPremium) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl p-6 sm:p-7 text-center overflow-hidden border border-[#f0ddd5] animate-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#fdf5f0] text-[#8b4e2e] flex items-center justify-center hover:bg-[#f5ede5] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#fdf0e8] to-[#fce4d6] flex items-center justify-center mx-auto mb-4 border border-[#eddcd2] shadow-sm">
            {type === 'VIDEO' ? (
              <Video size={30} className="text-[#8b4e2e]" />
            ) : (
              <Phone size={30} className="text-[#8b4e2e]" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[0.75rem] font-bold tracking-wide uppercase mb-3 border border-amber-200">
            <Crown size={12} className="text-amber-600" />
            Premium Feature
          </div>

          <h3 className="font-['Cormorant_Garamond'] text-[1.6rem] font-bold text-[#2d1810] leading-tight mb-2">
            {type === 'VIDEO' ? 'HD Video Calling' : 'Private Voice Calling'}
          </h3>

          <p className="text-[0.85rem] text-[#9a7060] mb-6 leading-relaxed">
            Upgrade to <strong className="text-[#74351b]">SriMatch Premium</strong> to make unlimited, secure HD Voice and Video calls with <strong className="text-[#2d1810]">{partner?.name || 'your match'}</strong>.
          </p>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/subscription"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#3d1f12] via-[#74351b] to-[#994d2c] text-white font-semibold text-[0.92rem] shadow-lg shadow-[#74351b]/25 hover:shadow-xl hover:shadow-[#74351b]/35 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-[#e8c97a]" />
              Upgrade to Premium ✦
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-[0.82rem] font-medium text-[#9a7060] hover:text-[#2d1810] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Call Simulation / WebRTC Room for Premium Users
  useEffect(() => {
    // Simulate call connecting after 3 seconds
    const ringTimer = setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 2800);

    return () => clearTimeout(ringTimer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callStatus === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#2a130a] via-[#1a0c06] to-[#0d0603] rounded-[32px] p-6 sm:p-8 text-center text-white overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center justify-between min-h-[480px]">
        
        {/* Top Header */}
        <div className="w-full flex items-center justify-between text-white/70 text-[0.8rem]">
          <span className="flex items-center gap-1.5 font-medium">
            <Crown size={14} className="text-[#e8c97a]" />
            SriMatch {type === 'VIDEO' ? 'Video' : 'Voice'} Call
          </span>
          <span className="bg-white/10 px-2.5 py-0.5 rounded-full font-mono text-[0.75rem]">
            {callStatus === 'RINGING' ? 'Ringing…' : formatDuration(callDuration)}
          </span>
        </div>

        {/* Center: Partner Details & Animated Avatar */}
        <div className="my-auto flex flex-col items-center">
          <div className="relative mb-5">
            {callStatus === 'RINGING' && (
              <>
                <span className="absolute inset-0 rounded-full bg-[#c9856a]/30 animate-ping" />
                <span className="absolute -inset-3 rounded-full bg-[#c9856a]/15 animate-pulse" />
              </>
            )}
            <img 
              src={partner?.profileImageUrl || "/default-avatar.png"} 
              alt={partner?.name || "User"} 
              className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-[#c9856a] shadow-2xl" 
            />
          </div>

          <h3 className="font-['Cormorant_Garamond'] text-[1.8rem] sm:text-[2rem] font-bold text-white leading-tight">
            {partner?.name || "Partner"}
          </h3>
          <p className="text-[0.85rem] text-[#e8c9b8] mt-1">
            {callStatus === 'RINGING' ? 'Calling partner…' : 'Encrypted Connection Active'}
          </p>
        </div>

        {/* Call Controls */}
        <div className="w-full flex items-center justify-center gap-4 sm:gap-6 pt-4">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
              isMuted ? "bg-red-500/80 text-white" : "bg-white/15 text-white hover:bg-white/25"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Video Toggle (for Video Calls) */}
          {type === 'VIDEO' && (
            <button
              type="button"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                isVideoOff ? "bg-red-500/80 text-white" : "bg-white/15 text-white hover:bg-white/25"
              }`}
              title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          )}

          {/* End Call Button */}
          <button
            type="button"
            onClick={onClose}
            className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 transition-all"
            title="End Call"
            aria-label="End Call"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
