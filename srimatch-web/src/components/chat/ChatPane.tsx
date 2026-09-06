"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Send, Image as ImageIcon, 
  Flag, Crown, Heart, Loader2, MessageCircle, ArrowLeft,
  Mic, X
} from 'lucide-react';
import Link from 'next/link';
import MessageBubble from './MessageBubble';
import VoiceRecorder from './VoiceRecorder';
import { toast } from 'sonner';

interface ChatPaneProps {
  activeConversation: any;
  messages: any[];
  loadingMessages: boolean;
  message: string;
  setMessage: (val: string) => void;
  onSend: () => void;
  onSendMedia: (file: File, type: 'IMAGE' | 'AUDIO', caption?: string, duration?: number) => Promise<void>;
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
  onSendMedia, 
  onReport, 
  isPremium, 
  currentUserId,
  onBack
}: ChatPaneProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Controlled, container-only scroll to bottom without page jumping
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant',
      });
    }
  }, []);

  useEffect(() => {
    // If conversation changed or message was added, scroll container
    if (messages.length !== prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
      scrollToBottom(true);
    }
  }, [messages.length, scrollToBottom]);

  // Initial scroll when conversation loads
  useEffect(() => {
    if (!loadingMessages && messages.length > 0) {
      scrollToBottom(false);
    }
  }, [loadingMessages, activeConversation?.id, scrollToBottom]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP, GIF).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image file size must be under 20MB.");
      return;
    }

    setSelectedImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  };

  const cancelImageAttachment = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendImage = async () => {
    if (!selectedImageFile) return;
    try {
      setIsUploadingMedia(true);
      await onSendMedia(selectedImageFile, 'IMAGE', message.trim() || undefined);
      setMessage("");
      cancelImageAttachment();
    } catch (err) {
      console.error("Error sending image:", err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleVoiceRecordingComplete = async (audioFile: File, durationSeconds: number) => {
    try {
      setIsUploadingMedia(true);
      setIsRecordingVoice(false);
      await onSendMedia(audioFile, 'AUDIO', undefined, durationSeconds);
    } catch (err) {
      console.error("Error sending voice message:", err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 h-full text-center p-8 bg-gradient-to-br from-[#fdfaf7] to-[#faf0ea]">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#fdf0e8] to-[#f5ddd0] flex items-center justify-center mb-4 shadow-sm border border-[#eddcd2]">
          <MessageCircle size={36} className="text-[#c9856a]" />
        </div>
        <h3 className="font-['Cormorant_Garamond'] text-[1.6rem] font-bold text-[#2d1810] mb-1">
          Select a Conversation
        </h3>
        <p className="text-[0.85rem] text-[#9a7060] max-w-xs">
          Choose a matched partner from the list to begin messaging, sharing photos, and voice notes.
        </p>
      </div>
    );
  }

  const otherUser = activeConversation.otherUser || {};
  const otherUserId = otherUser.id || otherUser.userId;

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-[#fdfaf7] relative">
      {/* 1. Header (Sticky Top, Never hides) */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-3 py-2.5 sm:px-5 sm:py-3.5 bg-white/95 backdrop-blur-md border-b border-[#f0ddd5] shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-[#8b4e2e] bg-[#fdf5f0] hover:bg-[#f5ede5] transition-colors shrink-0"
              aria-label="Back to messages list"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <Link href={`/profile/${otherUserId}`} className="relative shrink-0">
            <img 
              src={otherUser.profileImageUrl || "/default-avatar.png"} 
              alt={otherUser.name || "User"} 
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-[#f0ddd5] shadow-xs" 
            />
            {otherUser.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link href={`/profile/${otherUserId}`} className="block">
              <h3 className="text-[0.92rem] sm:text-[0.98rem] font-bold text-[#2d1810] truncate hover:text-[#8b4e2e] transition-colors leading-tight">
                {otherUser.name || "User"}
              </h3>
              <p className="text-[0.72rem] sm:text-[0.75rem] text-[#9a7060] truncate mt-0.5">
                {otherUser.profession ? `${otherUser.profession} · ` : ""}{otherUser.district || "Sri Lanka"}
              </p>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-[#9a7060] border border-[#f0ddd5] hover:border-[#c9856a] hover:text-[#8b4e2e] hover:bg-[#fdf0e8] transition-all cursor-pointer"
            onClick={onReport}
            title="Report User"
            aria-label="Report User"
          >
            <Flag size={14} />
          </button>
        </div>
      </header>

      {/* 2. Premium Status Banner (Shrink-0) */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-[#3d1f12] via-[#653224] to-[#8b4e2e] px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-between gap-3 text-white text-[0.75rem] shrink-0 shadow-xs">
          <div className="flex items-center gap-1.5 truncate">
            <Crown size={13} className="text-[#e8c97a] shrink-0" />
            <span className="truncate">Unlock unlimited messaging & contact details</span>
          </div>
          <Link 
            href="/subscription" 
            className="bg-gradient-to-r from-[#e8c97a] to-[#c9a050] text-[#3d1f12] px-3 py-1 rounded-full font-bold text-[0.72rem] hover:brightness-105 shrink-0 shadow-xs"
          >
            Upgrade ✦
          </Link>
        </div>
      )}

      {/* 3. Messages Feed (Flex-1, Scrollable, Internal scrolling only) */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-5 space-y-2.5 bg-[#fdfaf7]"
        style={{ overflowAnchor: 'auto' }}
      >
        {loadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full text-[#9a7060]">
            <Loader2 className="animate-spin text-[#8b4e2e] mb-2" size={28} />
            <p className="text-[0.8rem]">Loading chat history…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#9a7060]">
            <div className="h-14 w-14 rounded-full bg-[#fcefe8] flex items-center justify-center mb-3">
              <Heart size={26} className="text-[#c9856a] animate-pulse" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-[1.35rem] text-[#2d1810] font-bold">You are matched!</p>
            <p className="text-[0.82rem] max-w-xs mt-1 text-[#9a7060]">
              Break the ice by sending a warm greeting, an image, or a voice message.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOther = otherUserId != null && (String(msg.senderId) === String(otherUserId));
            const isMine = !isOther;

            return (
              <MessageBubble 
                key={msg.id || index}
                message={msg} 
                isMine={isMine}
                showAvatar={!isMine}
                avatarUrl={otherUser.profileImageUrl}
                senderName={otherUser.name}
                onImageClick={(url) => setLightboxImageUrl(url)}
              />
            );
          })
        )}
      </div>

      {/* 4. Pre-send Image Preview Attachment Drawer */}
      {selectedImageFile && imagePreviewUrl && (
        <div className="px-4 py-2.5 bg-[#fcf4ee] border-t border-[#f0ddd5] flex items-center justify-between gap-3 shrink-0 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-[#e8c9b8] bg-black/5 shrink-0 shadow-xs">
              <img src={imagePreviewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[0.8rem] font-medium text-[#2d1810] truncate">
                {selectedImageFile.name}
              </p>
              <p className="text-[0.68rem] text-[#9a7060]">
                {(selectedImageFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to send
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelImageAttachment}
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#9a7060] hover:bg-[#f0ddd5] hover:text-[#74351b] transition-colors shrink-0"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 5. Sticky Bottom Action Bar (Never clips, Safe Area Aware) */}
      <div className="sticky bottom-0 z-20 bg-white border-t border-[#f0ddd5] px-3 py-2.5 sm:px-5 sm:py-3 shrink-0 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-lg shadow-black/5">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageFileChange} 
          accept="image/jpeg,image/png,image/webp,image/gif" 
          className="hidden" 
        />

        {isRecordingVoice ? (
          <VoiceRecorder 
            onRecordingComplete={handleVoiceRecordingComplete}
            onCancel={() => setIsRecordingVoice(false)}
          />
        ) : (
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              if (selectedImageFile) {
                handleSendImage();
              } else {
                onSend(); 
              }
            }} 
            className="flex items-center gap-2"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingMedia}
              className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-[#8b4e2e] bg-[#fdf5f0] border border-[#f0ddd5] hover:bg-[#f5ede5] hover:border-[#c9856a] transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
              title="Attach Image"
              aria-label="Attach Image"
            >
              <ImageIcon size={18} />
            </button>

            {/* Voice Record Button */}
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              disabled={isUploadingMedia}
              className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-[#8b4e2e] bg-[#fdf5f0] border border-[#f0ddd5] hover:bg-[#f5ede5] hover:border-[#c9856a] transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
              title="Record Voice Note"
              aria-label="Record Voice Note"
            >
              <Mic size={18} />
            </button>

            {/* Message / Caption Input */}
            <input
              type="text"
              className="flex-1 rounded-full border-[1.5px] border-[#e8ddd8] bg-[#fdfaf7] py-2.5 px-4 sm:px-5 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:border-[#c9856a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5]"
              placeholder={selectedImageFile ? "Add a caption for this photo…" : `Message ${otherUser.firstName || otherUser.name || 'match'}…`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isUploadingMedia}
            />

            {/* Send Button */}
            <button 
              type="submit" 
              className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#3d1f12] via-[#74351b] to-[#994d2c] text-white shadow-[0_4px_12px_rgba(116,53,27,0.25)] transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
              disabled={isUploadingMedia || (!message.trim() && !selectedImageFile)}
              aria-label="Send message"
            >
              {isUploadingMedia ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </form>
        )}
      </div>

      {/* 6. Fullscreen Image Lightbox Modal */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>
            <img 
              src={lightboxImageUrl} 
              alt="Enlarged view" 
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPane;
