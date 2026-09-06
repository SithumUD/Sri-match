"use client";

import React, { useRef, useEffect, useState } from 'react';
import { 
  Send, Paperclip, Image as ImageIcon, 
  Flag, Crown, Heart, Loader2, MessageCircle, ArrowLeft,
  Mic, X, ZoomIn
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

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
      <div className="flex flex-col items-center justify-center flex-1 text-center p-8 bg-gradient-to-br from-[#fdf5ee] to-[#faf0f8]">
        <div className="h-[72px] w-[72px] rounded-full bg-gradient-to-br from-[#fdf0e8] to-[#f5ddd0] flex items-center justify-center mb-4 shadow-sm">
          <MessageCircle size={30} className="text-[#c9856a]" />
        </div>
        <h3 className="font-['Cormorant_Garamond'] text-[1.4rem] font-semibold text-[#2d1810] mb-1">No conversation selected</h3>
        <p className="text-[0.83rem] text-[#9a7060]">Pick a conversation from the list to start chatting ✦</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-white relative">
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
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-[#f0ddd5] shadow-xs" 
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

        <div className="flex items-center gap-1.5">
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
            <span className="truncate">Get Premium for unlimited messages & verified contact unlocks</span>
          </div>
          <Link href="/subscription" className="bg-gradient-to-br from-[#e8c97a] to-[#c9a050] text-[#3d1f12] px-3 py-1 rounded-full font-semibold text-[0.72rem] sm:text-[0.74rem] no-underline shrink-0">
            Upgrade ✦
          </Link>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 bg-[#fdf8f4]">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-[#8b4e2e]" size={28} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#9a7060]">
            <Heart size={28} className="text-[#f4a0a0] mb-2 animate-pulse" />
            <p className="font-['Cormorant_Garamond'] text-[1.2rem] text-[#2d1810] font-semibold">You're matched!</p>
            <p className="text-[0.8rem] max-w-xs mt-0.5">Send a warm greeting, share photos, or record a voice note to start talking.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const otherId = activeConversation?.otherUser?.id || activeConversation?.otherUser?.userId;
              const isOtherUser = otherId != null && (String(msg.senderId) === String(otherId));
              const isMine = !isOtherUser;

              return (
                <div key={msg.id || index}>
                  <MessageBubble 
                    message={msg} 
                    isMine={isMine}
                    showAvatar={!isMine}
                    avatarUrl={activeConversation?.otherUser?.profileImageUrl}
                    senderName={activeConversation?.otherUser?.name}
                    onImageClick={(url) => setLightboxImageUrl(url)}
                  />
                </div>
              );
            })}
          </>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Image Attachment Preview Popup (Above Input Bar) */}
      {selectedImageFile && imagePreviewUrl && (
        <div className="px-4 py-2.5 bg-[#fbf3ee] border-t border-[#f0ddd5] flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-[#e8c9b8] bg-black/5 shadow-xs">
              <img src={imagePreviewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div className="text-left">
              <p className="text-[0.78rem] font-medium text-[#2d1810] truncate max-w-[200px] sm:max-w-xs">
                {selectedImageFile.name}
              </p>
              <p className="text-[0.68rem] text-[#9a7060]">
                {(selectedImageFile.size / 1024 / 1024).toFixed(2)} MB · Ready to send
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={cancelImageAttachment}
            className="h-7 w-7 rounded-full flex items-center justify-center text-[#9a7060] hover:bg-[#f0ddd5] hover:text-[#74351b] transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Input / Voice Bar */}
      <div className="p-2.5 sm:p-4 border-t border-[#f5ede8] bg-white flex-shrink-0 pb-safe">
        {/* Hidden Image File Input */}
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
            {/* Attachment Button (Photo / Image) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingMedia}
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 flex items-center justify-center rounded-full text-[#8b4e2e] bg-[#fdf5f0] border border-[#f0ddd5] hover:bg-[#f5ede5] hover:border-[#c9856a] transition-all disabled:opacity-50"
              title="Attach Image"
              aria-label="Attach Image"
            >
              <ImageIcon size={17} />
            </button>

            {/* Voice Message Record Button */}
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              disabled={isUploadingMedia}
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 flex items-center justify-center rounded-full text-[#8b4e2e] bg-[#fdf5f0] border border-[#f0ddd5] hover:bg-[#f5ede5] hover:border-[#c9856a] transition-all disabled:opacity-50"
              title="Record Voice Note"
              aria-label="Record Voice Note"
            >
              <Mic size={17} />
            </button>

            {/* Text / Caption Input */}
            <input
              type="text"
              className="flex-1 rounded-full border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-2 px-4 sm:py-2.5 sm:px-5 text-[0.86rem] sm:text-[0.88rem] text-[#2d1810] outline-none transition-all focus:border-[#c9856a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.1)] placeholder:text-[#c4b0a5]"
              placeholder={selectedImageFile ? "Add an optional caption…" : `Message ${activeConversation.otherUser.firstName || activeConversation.otherUser.name}…`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isUploadingMedia}
            />

            {/* Send Button */}
            <button 
              type="submit" 
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] text-white shadow-[0_4px_12px_rgba(139,78,46,0.28)] transition-all hover:scale-105 hover:shadow-[0_6px_16px_rgba(139,78,46,0.36)] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
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

      {/* Fullscreen Image Lightbox Modal */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImageUrl(null)}
              className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
            <img 
              src={lightboxImageUrl} 
              alt="Enlarged preview" 
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
