"use client";

import React, { useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, Image as ImageIcon, 
  Flag, Phone, Video, Crown, Heart, Loader2, MessageCircle, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import MessageBubble from './MessageBubble';

interface ChatPaneProps {
  activeConversation: any;
  messages: any[];
  loadingMessages: boolean;
  message: string;
  setMessage: (val: string) => void;
  onSend: () => void;
  onReport: () => void;
  isPremium: boolean;
  currentUserId: string | number;
  onBack?: () => void;
}

const ChatPane = ({ 
  activeConversation, 
  messages, 
  loadingMessages, 
  message, 
  setMessage, 
  onSend, 
  onReport, 
  isPremium, 
  currentUserId,
  onBack
}: ChatPaneProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!activeConversation) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-gradient-to-br from-[#fdf5ee] to-[#faf0f8]">
        <div className="h-[72px] w-[72px] rounded-full bg-gradient-to-br from-[#fdf0e8] to-[#f5ddd0] flex items-center justify-center mb-4">
          <MessageCircle size={30} className="text-[#c9856a]" />
        </div>
        <h3 className="font-['Cormorant_Garamond'] text-[1.4rem] font-semibold text-[#2d1810] mb-1">No conversation selected</h3>
        <p className="text-[0.83rem] text-[#9a7060]">Pick a conversation from the list to start chatting ✦</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-white">
      {/* Header */}
      <header className="flex items-center gap-2.5 px-3 py-3 sm:px-6 sm:py-4 border-b border-[#f5ede8] bg-gradient-to-br from-[#fdf5ee] to-[#faf0f8] flex-shrink-0">
        {/* Mobile Back Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-[#8b4e2e] hover:bg-[#f0ddd5] transition-colors"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <Link href={`/profile/${activeConversation.otherUser.id || activeConversation.otherUser.userId}`} className="flex-shrink-0">
          <img 
            src={activeConversation.otherUser.profileImageUrl || "/default-avatar.png"} 
            alt={activeConversation.otherUser.name} 
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-[#f0ddd5]" 
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${activeConversation.otherUser.id || activeConversation.otherUser.userId}`} className="block">
            <h3 className="text-[0.88rem] sm:text-[0.92rem] font-semibold text-[#2d1810] truncate hover:text-[#8b4e2e] transition-colors">
              {activeConversation.otherUser.name}
            </h3>
            <p className="text-[0.7rem] sm:text-[0.72rem] text-[#9a7060] truncate">
              {activeConversation.otherUser.profession ? `${activeConversation.otherUser.profession} · ` : ""}{activeConversation.otherUser.district || "Sri Lanka"}
            </p>
          </Link>
        </div>

        <div className="flex gap-1">
          <button 
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-[#9a7060] border border-[#f0ddd5] hover:border-[#c9856a] hover:text-[#8b4e2e] hover:bg-[#fdf0e8] transition-all cursor-pointer"
            onClick={onReport}
            title="Report User"
          >
            <Flag size={14} />
          </button>
        </div>
      </header>

      {/* Premium Banner */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-[#3d1f12] to-[#6b3526] px-4 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between gap-3 text-white/90 text-[0.74rem] sm:text-[0.77rem] flex-shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Crown size={12} className="text-[#e8c97a] flex-shrink-0" />
            <span className="truncate">Get Premium to enjoy unlimited messaging & perks</span>
          </div>
          <Link href="/subscription" className="bg-gradient-to-br from-[#e8c97a] to-[#c9a050] text-[#3d1f12] px-3 py-1 rounded-full font-semibold text-[0.72rem] sm:text-[0.74rem] no-underline shrink-0">
            Upgrade ✦
          </Link>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 bg-[#fdf8f4]">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-[#8b4e2e]" size={28} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#9a7060]">
            <Heart size={28} className="text-[#f4a0a0] mb-2" />
            <p className="font-['Cormorant_Garamond'] text-[1.2rem] text-[#2d1810] font-semibold">You're matched!</p>
            <p className="text-[0.8rem] max-w-xs mt-0.5">Send a warm greeting to break the ice and start a wonderful conversation.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={msg.id || index}>
                <MessageBubble message={msg} isMine={msg.senderId === currentUserId} />
              </div>
            ))}
          </>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <div className="p-2.5 sm:p-4 border-t border-[#f5ede8] bg-white flex-shrink-0 pb-safe">
        <form 
          onSubmit={(e) => { e.preventDefault(); onSend(); }} 
          className="flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 rounded-full border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-2 px-4 sm:py-2.5 sm:px-5 text-[0.86rem] sm:text-[0.88rem] text-[#2d1810] outline-none transition-all focus:border-[#c9856a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.1)] placeholder:text-[#c4b0a5]"
            placeholder={`Message ${activeConversation.otherUser.firstName || activeConversation.otherUser.name}…`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] text-white shadow-[0_4px_12px_rgba(139,78,46,0.28)] transition-all hover:scale-105 hover:shadow-[0_6px_16px_rgba(139,78,46,0.36)] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
            disabled={!message.trim()}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPane;
