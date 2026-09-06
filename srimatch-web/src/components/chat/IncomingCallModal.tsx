"use client";

import React from "react";
import { Phone, PhoneOff, Video, Sparkles, Volume2 } from "lucide-react";
import { useCall } from "../../context/CallContext";

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, acceptCall, rejectCall } = useCall();

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#2a130a] via-[#1a0c06] to-[#0d0603] p-6 sm:p-8 text-center text-white shadow-2xl border border-[#c9856a]/30 animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 h-44 w-44 rounded-full bg-[#c9856a]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-[#8b4e2e]/20 blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#e8c97a] text-[0.75rem] font-semibold tracking-wider uppercase mb-5 border border-white/10">
          <Sparkles size={13} />
          Incoming {incomingCall.callType === "VIDEO" ? "HD Video" : "Voice"} Call
        </div>

        {/* Animated Avatar with Ringing Pulses */}
        <div className="relative mx-auto mb-5 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#c9856a]/40 animate-ping" />
          <span className="absolute -inset-2.5 rounded-full bg-[#c9856a]/20 animate-pulse" />
          
          <img
            src={incomingCall.senderAvatar || "/default-avatar.png"}
            alt={incomingCall.senderName}
            className="relative h-full w-full rounded-full object-cover border-4 border-[#c9856a] shadow-2xl z-10"
          />
        </div>

        {/* Caller Details */}
        <h3 className="font-['Cormorant_Garamond'] text-[1.85rem] sm:text-[2.1rem] font-bold text-white leading-tight mb-1">
          {incomingCall.senderName}
        </h3>
        <p className="text-[0.85rem] text-[#e8c9b8]/80 mb-8 flex items-center justify-center gap-1.5">
          <Volume2 size={14} className="text-[#e8c97a] animate-pulse" />
          SriMatch Match Calling…
        </p>

        {/* Call Actions: Decline (Red) & Accept (Green) */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 pt-2">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={rejectCall}
              className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 transition-all"
              aria-label="Decline Call"
            >
              <PhoneOff size={28} />
            </button>
            <span className="text-[0.75rem] font-medium text-white/70">Decline</span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={acceptCall}
              className="h-16 w-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all animate-bounce"
              aria-label="Accept Call"
            >
              {incomingCall.callType === "VIDEO" ? (
                <Video size={28} />
              ) : (
                <Phone size={28} />
              )}
            </button>
            <span className="text-[0.75rem] font-medium text-white/70">Accept</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncomingCallModal;
