"use client";

import React, { useRef, useEffect } from 'react';
import { 
  Send, Smile, Paperclip, Image as ImageIcon, 
  Flag, Phone, Video, Crown, Heart, Loader2, MessageCircle 
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
  currentUserId 
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
      <header className="flex items-center gap-3.5 px-6 py-4 border-b border-[#f5ede8] bg-gradient-to-br from-[#fdf5ee] to-[#faf0f8] flex-shrink-0">
        <img 
          src={activeConversation.otherUser.profileImageUrl || "/default-avatar.png"} 
          alt={activeConversation.otherUser.name} 
          className="h-11 w-11 rounded-full object-cover border-2 border-[#f0ddd5]" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-[0.92rem] font-semibold text-[#2d1810] truncate">{activeConversation.otherUser.name}</h3>
          <p className="text-[0.72rem] text-[#9a7060] truncate">
            {activeConversation.otherUser.profession} · {activeConversation.otherUser.district}
          </p>
        </div>
        <div className="flex gap-1">
          <button 
            className="h-9 w-9 rounded-full flex items-center justify-center text-[#9a7060] border border-[#f0ddd5] hover:border-[#c9856a] hover:text-[#8b4e2e] hover:bg-[#fdf0e8] transition-all cursor-pointer"
            onClick={onReport}
            title="Report User"
          >
            <Flag size={15} />
          </button>
          <button className="h-9 w-9 rounded-full flex items-center justify-center text-[#b09080] border border-[#f0ddd5] opacity-40 cursor-not-allowed" title="Coming Soon">
            <Phone size={15} />
          </button>
          <button className="h-9 w-9 rounded-full flex items-center justify-center text-[#b09080] border border-[#f0ddd5] opacity-40 cursor-not-allowed" title="Coming Soon">
            <Video size={15} />
          </button>
        </div>
      </header>

      {/* Premium Banner */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-[#3d1f12] to-[#6b3526] px-6 py-2.5 flex items-center justify-between gap-4 text-white/90 text-[0.77rem] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Crown size={13} className="text-[#e8c97a]" />
            Get Premium to enjoy unlimited features and boost your profile
          </div>
          <Link href="/subscription" className="bg-gradient-to-br from-[#e8c97a] to-[#c9a050] text-[#3d1f12] px-3.5 py-1 rounded-full font-semibold text-[0.74rem] no-underline">
            Upgrade ✦
          </Link>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-[#fdf8f4]">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={32} className="animate-spin text-[#e8c9b8]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#fdf0e8] to-[#f5ddd0] flex items-center justify-center mb-4">
              <Heart size={26} className="text-[#c9856a]" />
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-[1.3rem] font-semibold text-[#2d1810] mb-1">Say hello to {activeConversation.otherUser.name}</h3>
            <p className="text-[0.82rem] text-[#9a7060]">Be the first to break the ice ✦</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#f0ddd5]" />
              <span className="text-[0.69rem] text-[#b09080] uppercase tracking-wider">Chat Started</span>
              <div className="flex-1 h-px bg-[#f0ddd5]" />
            </div>
            {messages.map(msg => (
              <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                <MessageBubble message={msg} isMine={String(msg.senderId) === String(currentUserId)} />
              </div>
            ))}
          </>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#f5ede8] bg-white flex-shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); onSend(); }} 
          className="flex items-center gap-2"
        >
          <div className="flex gap-0.5">
            <button type="button" className="h-9 w-9 flex items-center justify-center text-[#b09080] hover:text-[#8b4e2e] hover:bg-[#fdf0e8] rounded-full transition-all cursor-pointer">
              <Smile size={18} />
            </button>
            <button type="button" className="h-9 w-9 flex items-center justify-center text-[#b09080] hover:text-[#8b4e2e] hover:bg-[#fdf0e8] rounded-full transition-all cursor-pointer">
              <Paperclip size={18} />
            </button>
            <button type="button" className="h-9 w-9 flex items-center justify-center text-[#b09080] hover:text-[#8b4e2e] hover:bg-[#fdf0e8] rounded-full transition-all cursor-pointer">
              <ImageIcon size={18} />
            </button>
          </div>
          <input
            type="text"
            className="flex-1 rounded-full border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-2.5 px-5 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:border-[#c9856a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.1)] placeholder:text-[#c4b0a5]"
            placeholder={`Message ${activeConversation.otherUser.firstName || activeConversation.otherUser.name}…`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            type="submit" 
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] text-white shadow-[0_4px_12px_rgba(139,78,46,0.28)] transition-all hover:scale-105 hover:shadow-[0_6px_16px_rgba(139,78,46,0.36)] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
            disabled={!message.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPane;
