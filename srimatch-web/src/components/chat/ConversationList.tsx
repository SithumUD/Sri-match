"use client";

import React, { useState } from 'react';
import { Search, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ConversationItemProps {
  conv: any;
  isActive: boolean;
  onSelect: (conv: any) => void;
}

const ConversationItem = React.memo(({ conv, isActive, onSelect }: ConversationItemProps) => {
  const other = conv.otherUser || {};
  const formattedDate = conv.matchedAt 
    ? new Date(conv.matchedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : 'Active';

  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 border-b border-[#f9f0ea] cursor-pointer transition-all ${
        isActive 
          ? "bg-gradient-to-r from-[#fbf1ea] to-[#f7e8df] border-l-4 border-l-[#8b4e2e]" 
          : "hover:bg-[#fdfaf7] border-l-4 border-l-transparent"
      }`}
      onClick={() => onSelect(conv)}
    >
      {/* User Avatar with status badge */}
      <div className="relative flex-shrink-0">
        <img 
          src={other.profileImageUrl || "/default-avatar.png"} 
          alt={other.name || "User"} 
          className={`h-12 w-12 rounded-full object-cover border-2 shadow-xs transition-transform ${
            isActive ? "border-[#c9856a] scale-105" : "border-[#f0ddd5]"
          }`} 
        />
        {other.online && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        )}
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between mb-0.5">
          <span className="text-[0.88rem] font-semibold text-[#2d1810] truncate">
            {other.name || "User"}
          </span>
          <span className="text-[0.68rem] font-medium text-[#b09080] flex-shrink-0 ml-2">
            {formattedDate}
          </span>
        </div>
        <p className="text-[0.76rem] text-[#9a7060] truncate flex items-center gap-1">
          {other.profession ? (
            <span>{other.profession} · {other.district || "Sri Lanka"}</span>
          ) : (
            <span>Click to start conversation</span>
          )}
        </p>
      </div>
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem';

interface ConversationListProps {
  conversations: any[];
  activeConversation: any;
  onSelect: (conv: any) => void;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

const ConversationList = ({ 
  conversations, 
  activeConversation, 
  onSelect, 
  loading, 
  searchTerm, 
  onSearchChange 
}: ConversationListProps) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-[#f0ddd5] select-none">
      {/* Header with Search */}
      <div className="bg-gradient-to-br from-[#3d1f12] via-[#653224] to-[#8b4e2e] p-4 sm:p-5 shrink-0">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <h2 className="font-['Cormorant_Garamond'] text-[1.3rem] font-bold text-white tracking-wide">
              Conversations
            </h2>
            <span className="bg-white/20 text-white text-[0.7rem] font-semibold px-2 py-0.5 rounded-full">
              {conversations.length}
            </span>
          </div>
          <Sparkles size={16} className="text-[#e8c97a]" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-white/60" size={14} />
          <input
            type="text"
            className="w-full rounded-xl bg-white/15 py-2 pr-4 pl-9 font-['DM_Sans'] text-[0.82rem] text-white outline-none transition-all focus:bg-white/25 placeholder:text-white/60 border border-white/10 focus:border-white/30"
            placeholder="Search matches by name…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Conversation Items List */}
      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-[#f9f0ea] overscroll-contain">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#9a7060]">
            <Loader2 size={24} className="animate-spin text-[#8b4e2e] mb-2" />
            <p className="text-[0.8rem]">Loading conversations…</p>
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conv, idx) => (
            <ConversationItem 
              key={conv.id || conv.otherUser?.id || idx} 
              conv={conv} 
              isActive={
                (activeConversation?.id && activeConversation?.id === conv.id) ||
                (activeConversation?.otherUser?.id && String(activeConversation?.otherUser?.id) === String(conv.otherUser?.id))
              } 
              onSelect={onSelect} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center h-56">
            <div className="h-12 w-12 rounded-full bg-[#fdf5f0] flex items-center justify-center mb-3 text-[#c9856a]">
              <MessageCircle size={24} />
            </div>
            <p className="text-[0.85rem] font-semibold text-[#2d1810]">No matches yet</p>
            <p className="text-[0.75rem] text-[#9a7060] mt-0.5 max-w-[200px]">
              Explore profiles and like your ideal partner to start chatting!
            </p>
            <Link 
              href="/home" 
              className="mt-3.5 inline-flex items-center gap-1 text-[0.78rem] font-semibold text-white bg-gradient-to-r from-[#74351b] to-[#994d2c] px-4 py-1.5 rounded-full shadow-xs hover:opacity-95"
            >
              Find matches ✦
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
