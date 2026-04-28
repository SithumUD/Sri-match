import React from 'react';
import { Check, Clock } from 'lucide-react';
import { sanitize } from '../../utils/security.utils';

const MessageBubble = ({ message, isMine }) => {
  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
      <div 
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm relative ${
          isMine 
            ? "bg-gradient-to-br from-[#3d1f12] to-[#8b4e2e] text-white rounded-br-none" 
            : "bg-white text-[#2d1810] border border-[#f0ddd5] rounded-bl-none"
        }`}
      >
        <p 
          className="text-[0.88rem] leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: sanitize(message.content) }}
        />
        <div className={`mt-1 flex items-center gap-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
          <span className={`text-[0.65rem] ${isMine ? "text-white/60" : "text-[#b09080]"}`}>
            {formatTime(message.createdAt)}
          </span>
          {isMine && (
            message.read 
              ? <Check size={11} className="text-white" /> 
              : <Clock size={11} className="text-white/60" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
