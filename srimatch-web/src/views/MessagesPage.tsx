"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import MatchService from "../services/match.service";
import ChatService from "../services/chat.service";
import ReportService from "../services/report.service";
import wsService from "../services/websocket.service";
import { toast } from "sonner";
import { X, Flag, Check, Loader2 } from "lucide-react";

// Modular Components
import ConversationList from "../components/chat/ConversationList";
import ChatPane from "../components/chat/ChatPane";

const MessagesPage = () => {
  const pathname = usePathname();
  const { user, accessToken } = useAuth();
  
  const [initialUserId, setInitialUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setInitialUserId(params.get("user"));
    }
  }, []);

  /* ─── Fetch Conversations ────────────────────────────────────────────── */
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await MatchService.getMyMatches();
      if (response.success) {
        const convs = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];
        setConversations(convs);
        
        // Handle initial user from query param or auto-select first
        if (initialUserId) {
          const target = convs.find((c: any) => 
            String(c.otherUser?.id) === String(initialUserId) || 
            String(c.otherUser?.userId) === String(initialUserId)
          );
          if (target) {
            setActiveConversation(target);
          } else if (convs.length > 0) {
            setActiveConversation((prev: any) => prev || convs[0]);
          }
        } else if (convs.length > 0) {
          setActiveConversation((prev: any) => prev || convs[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [initialUserId]);

  /* ─── Event Handlers ─────────────────────────────────────────────────── */
  const handleIncomingMessage = useCallback((incomingMsg: any) => {
    // If message is for the current active chat, add it to state
    if (activeConversation && String(incomingMsg.senderId) === String(activeConversation.otherUser?.id)) {
      setMessages(prev => [...prev, incomingMsg]);
      // Mark as read via HTTP
      ChatService.markAsRead(incomingMsg.id);
    } else {
      // Show notification if it's from someone else
      toast.info(`New message from ${incomingMsg.senderName || 'someone'}`);
      // Refresh conversations list to update order/previews
      fetchConversations();
    }
  }, [activeConversation, fetchConversations]);

  /* ─── WebSocket Lifecycle ─────────────────────────────────────────────── */
  useEffect(() => {
    if (accessToken) {
      wsService.connect(accessToken, () => {
        // Subscribe to private messages queue
        wsService.subscribe('/user/queue/messages', (incomingMsg) => {
          handleIncomingMessage(incomingMsg);
        });
      });
    }

    fetchConversations();

    return () => {
      wsService.disconnect();
    };
  }, [accessToken, fetchConversations, handleIncomingMessage]);

  /* ─── Fetch Message History ──────────────────────────────────────────── */
  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation?.id]);

  const fetchMessages = async (matchId: number | string) => {
    try {
      setLoadingMessages(true);
      const response = await ChatService.getChatHistory(matchId);
      if (response.success) {
        const raw = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];
        // Reverse because backend sends newest first
        setMessages([...raw].reverse());
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversation) return;

    const payload = {
      matchId: activeConversation.id,
      receiverId: activeConversation.otherUser.id,
      content: message.trim(),
      type: "TEXT"
    };
    
    try {
      const response = await ChatService.sendMessage(payload);
      
      if (response.success) {
        // Add to our own list for instant feedback
        const newMsg = response.data;
        setMessages(prev => [...prev, newMsg]);
        setMessage("");
      } else {
        toast.error(response.message || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      toast.error(err.message || "Message delivery failed");
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason || !activeConversation) return;
    try {
      setReportLoading(true);
      await ReportService.submitReport({
        reportedUserId: activeConversation.otherUser.id,
        reason: reportReason,
        description: reportDesc || ""
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason("");
        setReportDesc("");
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(c =>
      (c.otherUser?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  return (
    <div className="min-h-screen bg-[#fdf8f4] px-4 py-8 sm:px-6 lg:px-8 font-['DM_Sans']">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-7">
          <h1 className="font-['Cormorant_Garamond'] text-[2rem] font-semibold text-[#2d1810] leading-tight">
            Your <span className="bg-gradient-to-br from-[#8b4e2e] to-[#c9856a] bg-clip-text text-transparent">Messages</span>
          </h1>
          <p className="text-[0.83rem] text-[#9a7060] mt-1">Connect and converse with your potential matches</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[680px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(120,60,30,0.1),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <ConversationList 
            conversations={filteredConversations}
            activeConversation={activeConversation}
            onSelect={setActiveConversation}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <ChatPane 
            activeConversation={activeConversation}
            messages={messages}
            loadingMessages={loadingMessages}
            message={message}
            setMessage={setMessage}
            onSend={handleSendMessage}
            onReport={() => setShowReportModal(true)}
            isPremium={Boolean(user?.premium || user?.isPremium || user?.role === 'PREMIUM')}
            currentUserId={user?.id}
          />
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[22px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] font-bold text-[#2d1810]">Report {activeConversation?.otherUser?.name}</h3>
                <button 
                  onClick={() => !reportLoading && setShowReportModal(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-[#f5ede5] text-[#8b4e2e] hover:bg-[#ebdccf] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {reportSuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <Check size={24} />
                  </div>
                  <p className="font-semibold text-[#2d1810]">Report Submitted</p>
                  <p className="text-[0.85rem] text-[#9a7060] mt-1">Our team will investigate this user shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleReport}>
                  <div className="mb-5">
                    <label className="mb-1.5 block text-[0.75rem] font-semibold text-[#8b4e2e] uppercase tracking-wide">Reason for report</label>
                    <select 
                      className="w-full rounded-xl border-[1.5px] border-[#f0ddd5] bg-[#fdfaf8] p-3 text-[0.85rem] text-[#2d1810] outline-none focus:border-[#c9856a] transition-all"
                      value={reportReason}
                      onChange={e => setReportReason(e.target.value)}
                      required
                    >
                      <option value="">Select a reason</option>
                      <option value="FAKE_PROFILE">Fake Profile / Identity</option>
                      <option value="HARASSMENT">Harassment or Abuse</option>
                      <option value="INAPPROPRIATE_CONTENT">Inappropriate Content</option>
                      <option value="SPAM">Spam or Scamming</option>
                      <option value="FRAUD">Fraudulent Activity</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="mb-7">
                    <label className="mb-1.5 block text-[0.75rem] font-semibold text-[#8b4e2e] uppercase tracking-wide">
                      Description <span className="font-normal text-[#9a7060] normal-case">(optional)</span>
                    </label>
                    <textarea 
                      className="w-full rounded-xl border-[1.5px] border-[#f0ddd5] bg-[#fdfaf8] p-3 text-[0.85rem] text-[#2d1810] outline-none focus:border-[#c9856a] transition-all min-h-[110px] resize-none"
                      placeholder="Please provide any additional details (optional)..."
                      value={reportDesc}
                      onChange={e => setReportDesc(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={reportLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#3d1f12] to-[#8b4e2e] py-3.5 text-[0.9rem] font-semibold text-white shadow-lg shadow-[#8b4e2e]/20 hover:shadow-xl hover:shadow-[#8b4e2e]/30 disabled:opacity-50 transition-all"
                  >
                    {reportLoading ? <Loader2 size={18} className="animate-spin" /> : <Flag size={14} />}
                    Submit Report
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;