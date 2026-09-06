"use client";

import React, { useState } from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { sanitize } from '../../utils/security.utils';
import VoicePlayer from './VoicePlayer';

interface MessageBubbleProps {
  message: any;
  isMine: boolean;
  showAvatar?: boolean;
  avatarUrl?: string | null;
  senderName?: string;
  onImageClick?: (url: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isMine, 
  showAvatar = false, 
  avatarUrl, 
  senderName,
  onImageClick 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatTime = (ts: string | number | undefined) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { 
      return ""; 
    }
  };

  const isImage = message.type === 'IMAGE' || (message.mediaUrl && (message.mediaType?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(message.mediaUrl)));
  const isAudio = message.type === 'AUDIO' || (message.mediaUrl && (message.mediaType?.startsWith('audio/') || /\.(webm|mp3|ogg|wav|m4a|aac)$/i.test(message.mediaUrl)));

  return (
    <div className={`flex items-end gap-2 mb-3.5 ${isMine ? "justify-end" : "justify-start"} group`}>
      {/* Partner avatar on the left for receiver messages */}
      {!isMine && showAvatar && (
        <img 
          src={avatarUrl || "/default-avatar.png"} 
          alt={senderName || "User"} 
          className="h-7 w-7 rounded-full object-cover border border-[#ecdcd5] flex-shrink-0 mb-0.5 shadow-xs" 
        />
      )}

      {/* Chat Bubble Container */}
      <div 
        className={`max-w-[82%] sm:max-w-[70%] rounded-2xl relative transition-all ${
          isImage 
            ? isMine 
              ? "p-1.5 bg-gradient-to-br from-[#421d0f] to-[#74351b] text-white rounded-br-xs shadow-[0_4px_14px_rgba(116,53,27,0.22)]" 
              : "p-1.5 bg-white text-[#2d1810] border border-[#ecdcd5] rounded-bl-xs shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            : isMine 
              ? "px-4 py-2.5 bg-gradient-to-br from-[#421d0f] via-[#74351b] to-[#994d2c] text-white rounded-br-xs shadow-[0_4px_14px_rgba(116,53,27,0.22)]" 
              : "px-4 py-2.5 bg-[#ffffff] text-[#2d1810] border border-[#ecdcd5] rounded-bl-xs shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Render Image Message */}
        {isImage && (
          <div className="flex flex-col gap-1.5">
            <div 
              className="relative overflow-hidden rounded-xl cursor-pointer group/img max-h-[280px] sm:max-h-[340px] bg-black/5"
              onClick={() => onImageClick && onImageClick(message.mediaUrl)}
            >
              <img 
                src={message.mediaUrl} 
                alt="Shared attachment" 
                className={`w-full max-h-[280px] sm:max-h-[340px] object-cover rounded-xl transition-transform duration-300 group-hover/img:scale-[1.02] ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="h-44 w-full flex items-center justify-center bg-[#fdf5f0] text-[#9a7060]">
                  <ImageIcon className="animate-pulse" size={24} />
                </div>
              )}
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/60 text-white text-[0.7rem] px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-xs">
                  <ExternalLink size={11} /> View
                </span>
              </div>
            </div>

            {/* Optional caption under image */}
            {message.content && message.content !== 'Image' && (
              <p 
                className={`px-2 text-[0.86rem] leading-snug break-words ${isMine ? "text-white" : "text-[#2d1810]"}`}
                dangerouslySetInnerHTML={{ __html: sanitize(message.content) }}
              />
            )}
          </div>
        )}

        {/* Render Voice / Audio Message */}
        {isAudio && (
          <VoicePlayer audioUrl={message.mediaUrl} isMine={isMine} />
        )}

        {/* Render Plain Text Message */}
        {!isImage && !isAudio && (
          <p 
            className={`text-[0.88rem] sm:text-[0.91rem] leading-relaxed break-words font-normal select-text ${
              isMine ? "text-white" : "text-[#2d1810]"
            }`}
            dangerouslySetInnerHTML={{ __html: sanitize(message.content || "") }}
          />
        )}

        {/* Message Timestamp (Clean timestamp without read receipts) */}
        <div className={`mt-1 flex items-center ${isImage ? "px-2 pb-0.5" : ""} ${isMine ? "justify-end text-white/70" : "justify-start text-[#9a7060]"}`}>
          <span className="text-[0.66rem] font-medium tracking-tight">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
