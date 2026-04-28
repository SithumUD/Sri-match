import React from 'react';
import { Search, MessageCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConversationItem = React.memo(({ conv, isActive, onSelect }) => {
  return (
    <div
      className={`flex items-center gap-3 p-4 border-b border-[#fdf5f0] cursor-pointer transition-all ${
        isActive ? "bg-gradient-to-br from-[#fdf0e8] to-[#faf0f8]" : "hover:bg-[#fdf8f5]"
      }`}
      onClick={() => onSelect(conv)}
    >
      <div className="relative flex-shrink-0">
        <img 
          src={conv.otherUser.profileImageUrl || "/default-avatar.png"} 
          alt={conv.otherUser.name} 
          className={`h-11 w-11 rounded-full object-cover border-2 ${isActive ? "border-[#c9856a]" : "border-[#f0ddd5]"}`} 
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between mb-0.5">
          <span className="text-[0.84rem] font-semibold text-[#2d1810] truncate">{conv.otherUser.name}</span>
          <span className="text-[0.68rem] text-[#b09080] flex-shrink-0">
            {new Date(conv.matchedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <p className="text-[0.76rem] text-[#9a7060] truncate">
          Click to chat with {conv.otherUser.firstName || conv.otherUser.name}
        </p>
      </div>
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem';

const ConversationList = ({ 
  conversations, 
  activeConversation, 
  onSelect, 
  loading, 
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="flex flex-col border-r border-[#f5ede8] bg-white h-full">
      <div className="bg-gradient-to-br from-[#3d1f12] via-[#6b3526] to-[#8b4e2e] p-5">
        <h2 className="mb-4 font-['Cormorant_Garamond'] text-[1.2rem] font-semibold text-white">Conversations</h2>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50" size={14} />
          <input
            type="text"
            className="w-full rounded-lg bg-white/15 py-2 pr-4 pl-9 font-['DM_Sans'] text-[0.82rem] text-white outline-none transition-all focus:bg-white/25 placeholder:text-white/50"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 text-[#9a7060]">
            <Loader2 size={24} className="animate-spin mb-2" />
            <p className="text-[0.8rem]">Loading conversations...</p>
          </div>
        ) : conversations.length > 0 ? (
          conversations.map(conv => (
            <ConversationItem 
              key={conv.id} 
              conv={conv} 
              isActive={activeConversation?.id === conv.id} 
              onSelect={onSelect} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle size={28} className="text-[#e8c9b8] mb-2" />
            <p className="text-[0.8rem] text-[#b09080]">No matches yet</p>
            <Link to="/home" className="mt-2 text-[0.75rem] font-medium text-[#8b4e2e] hover:underline">Find your match ✦</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
