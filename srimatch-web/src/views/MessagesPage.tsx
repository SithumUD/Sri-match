"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import MatchService from "../services/match.service";
import ChatService from "../services/chat.service";
import ProfileService from "../services/profile.service";
import ReportService from "../services/report.service";
import wsService from "../services/websocket.service";
import { toast } from "sonner";
import { X, Flag, Check, Loader2 } from "lucide-react";

// Modular Components
import ConversationList from "../components/chat/ConversationList";
import ChatPane from "../components/chat/ChatPane";

const MessagesPage = () => {
  const [initialUserId, setInitialUserId] = useState<string | null>(null);
  const [initialMatchId, setInitialMatchId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const userParam = queryParams.get("user") || queryParams.get("userId") || queryParams.get("recipient");
      const matchParam = queryParams.get("matchId");
      if (userParam) setInitialUserId(userParam);
      if (matchParam) setInitialMatchId(matchParam);
    }
  }, []);

  const { user, accessToken } = useAuth();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Refs to prevent dependency-cycle re-renders
  const activeConversationRef = useRef<any | null>(null);
  activeConversationRef.current = activeConversation;

  const conversationsRef = useRef<any[]>([]);
  conversationsRef.current = conversations;

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  /* ─── Fetch Conversations ────────────────────────────────────────────── */
  const fetchConversations = useCallback(async (silent = false) => {
    try {
      if (!silent && conversationsRef.current.length === 0) {
        setLoading(true);
      }
      const response = await MatchService.getMyMatches();
      if (response.success) {
        const convs = Array.isArray(response.data) ? response.data : (response.data?.content || []);
        
        let foundTarget: any = null;

        if (initialMatchId) {
          foundTarget = convs.find((c: any) => String(c.id) === String(initialMatchId));
        }
        
        if (!foundTarget && initialUserId) {
          foundTarget = convs.find((c: any) => 
            String(c.otherUser?.id) === String(initialUserId) || 
            String(c.otherUser?.userId) === String(initialUserId)
          );
        }

        if (foundTarget) {
          setConversations(convs);
          setActiveConversation(foundTarget);
        } else if (initialUserId) {
          // Fetch target profile if not currently in matches list
          try {
            const pRes = await ProfileService.getPublicProfile(initialUserId);
            const prof = pRes.data || pRes;
            if (prof) {
              const directConv = {
                id: initialMatchId ? Number(initialMatchId) : null,
                status: 'ACTIVE',
                otherUser: {
                  id: prof.userId || prof.id,
                  name: `${prof.firstName || ''} ${prof.lastName || ''}`.trim() || 'User',
                  profileImageUrl: prof.primaryImageUrl || (prof.profileImages && prof.profileImages[0]) || null,
                  age: prof.age,
                  profession: prof.profession,
                  district: prof.district || prof.city,
                }
              };
              setConversations([directConv, ...convs]);
              setActiveConversation(directConv);
            } else {
              setConversations(convs);
            }
          } catch (e) {
            console.error("Error loading target user profile:", e);
            setConversations(convs);
          }
        } else {
          setConversations(convs);
          if (convs.length > 0 && !activeConversationRef.current && typeof window !== 'undefined' && window.innerWidth >= 768) {
            setActiveConversation(convs[0]);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      if (!silent) {
        toast.error("Failed to load conversations");
      }
    } finally {
      setLoading(false);
    }
  }, [initialUserId, initialMatchId]);

  /* ─── Fetch Message History ──────────────────────────────────────────── */
  const fetchMessages = useCallback(async (convId: number | string | null) => {
    if (!convId) {
      setMessages([]);
      return;
    }
    try {
      setLoadingMessages(true);
      const response = await ChatService.getChatHistory(convId);
      if (response.success) {
        const content = response.data?.content || response.data || [];
        setMessages(Array.isArray(content) ? [...content].reverse() : []);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const activeConvId = activeConversation?.id;
  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    } else {
      setMessages([]);
    }
  }, [activeConvId, fetchMessages]);

  /* ─── Event Handlers ─────────────────────────────────────────────────── */
  const handleIncomingMessage = useCallback((incomingMsg: any) => {
    const currentActive = activeConversationRef.current;
    if (currentActive && (
      String(incomingMsg.senderId) === String(currentActive.otherUser?.id) ||
      String(incomingMsg.senderId) === String(currentActive.otherUser?.userId)
    )) {
      setMessages(prev => [...prev, incomingMsg]);
      ChatService.markAsRead(incomingMsg.id);
    } else {
      toast.info(`New message from ${incomingMsg.senderName || 'someone'}`);
      fetchConversations(true);
    }
  }, [fetchConversations]);

  /* ─── WebSocket Lifecycle ─────────────────────────────────────────────── */
  useEffect(() => {
    if (accessToken) {
      wsService.connect(accessToken, () => {
        wsService.subscribe('/user/queue/messages', (incomingMsg: any) => {
          handleIncomingMessage(incomingMsg);
        });
      });
    }

    return () => {
      wsService.unsubscribe('/user/queue/messages');
    };
  }, [accessToken, handleIncomingMessage]);

  /* ─── Initial Conversations Fetch ─────────────────────────────────────── */
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversation) return;

    const payload = {
      matchId: activeConversation.id || null,
      receiverId: activeConversation.otherUser.id || activeConversation.otherUser.userId,
      content: message,
      type: "TEXT"
    };
    
    try {
      const response = await ChatService.sendMessage(payload);
      
      if (response.success) {
        const newMsg = response.data;
        setMessages(prev => [...prev, newMsg]);
        setMessage("");

        // If activeConversation was missing an ID and backend returned matchId, update it
        if (!activeConversation.id && newMsg.matchId) {
          setActiveConversation((prev: any) => prev ? { ...prev, id: newMsg.matchId } : prev);
          setConversations(prev => prev.map(c => 
            (c.otherUser?.id === activeConversation.otherUser?.id) ? { ...c, id: newMsg.matchId } : c
          ));
        }
      } else {
        toast.error(response.message || "Failed to send message");
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      const errMsg = err?.response?.data?.message || err.message || "Message delivery failed";
      toast.error(errMsg);
    }
  };

  const handleSendMedia = async (file: File, type: 'IMAGE' | 'AUDIO', caption?: string, duration?: number) => {
    if (!activeConversation) return;

    try {
      const uploadRes = await ChatService.uploadMedia(file);
      if (!uploadRes || !uploadRes.success || !uploadRes.data?.url) {
        toast.error(uploadRes?.message || "Failed to upload media");
        return;
      }

      const mediaUrl = uploadRes.data.url;
      const mediaType = uploadRes.data.mediaType || file.type;
      const mediaSize = uploadRes.data.size || file.size;

      const payload = {
        matchId: activeConversation.id || null,
        receiverId: activeConversation.otherUser.id || activeConversation.otherUser.userId,
        content: caption || (type === 'AUDIO' ? 'Voice Message' : 'Image'),
        type: type,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        mediaSize: mediaSize
      };

      const response = await ChatService.sendMessage(payload);
      if (response.success) {
        const newMsg = response.data;
        setMessages(prev => [...prev, newMsg]);

        if (!activeConversation.id && newMsg.matchId) {
          setActiveConversation((prev: any) => prev ? { ...prev, id: newMsg.matchId } : prev);
          setConversations(prev => prev.map(c => 
            (c.otherUser?.id === activeConversation.otherUser?.id) ? { ...c, id: newMsg.matchId } : c
          ));
        }
      } else {
        toast.error(response.message || "Failed to deliver media message");
      }
    } catch (err: any) {
      console.error("Failed to upload/send media:", err);
      const errMsg = err?.response?.data?.message || err.message || "Failed to send media";
      toast.error(errMsg);
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
      c.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#fdf8f4] flex flex-col p-0 md:p-3 lg:p-5 font-['DM_Sans']">
      <div className="mx-auto w-full max-w-[1240px] flex-1 flex flex-col h-full min-h-0">
        
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-2.5 px-2 shrink-0">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[1.6rem] lg:text-[1.8rem] font-bold text-[#2d1810] leading-tight">
              Your <span className="bg-gradient-to-br from-[#8b4e2e] to-[#c9856a] bg-clip-text text-transparent">Messages</span>
            </h1>
            <p className="text-[0.78rem] text-[#9a7060]">Connect, share photos & voice notes with your matches</p>
          </div>
        </div>

        {/* Chat Container (Locked Viewport on Mobile & Desktop) */}
        <div className="flex-1 min-h-0 bg-white md:rounded-[24px] md:shadow-[0_16px_50px_rgba(120,60,30,0.08)] md:border md:border-[#f0ddd5] overflow-hidden flex flex-col md:grid md:grid-cols-[340px_1fr] relative">
          
          {/* Conversation List: full screen on mobile when no active chat, or left column on desktop */}
          <div className={`h-full overflow-hidden ${activeConversation ? "hidden md:flex flex-col" : "flex flex-col w-full"}`}>
            <ConversationList 
              conversations={filteredConversations}
              activeConversation={activeConversation}
              onSelect={setActiveConversation}
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          
          {/* Chat Pane: full screen on mobile when active chat is chosen, or right column on desktop */}
          <div className={`h-full overflow-hidden ${!activeConversation ? "hidden md:flex flex-col" : "flex flex-col w-full"}`}>
            <ChatPane 
              activeConversation={activeConversation}
              messages={messages}
              loadingMessages={loadingMessages}
              message={message}
              setMessage={setMessage}
              onSend={handleSendMessage}
              onSendMedia={handleSendMedia}
              onReport={() => setShowReportModal(true)}
              isPremium={user?.premium}
              currentUserId={user?.id}
              onBack={() => setActiveConversation(null)}
            />
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[22px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-['Cormorant_Garamond'] text-[1.4rem] sm:text-[1.5rem] font-bold text-[#2d1810]">
                  Report {activeConversation?.otherUser?.name}
                </h3>
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
                  <div className="mb-4">
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
                  <div className="mb-6">
                    <label className="mb-1.5 block text-[0.75rem] font-semibold text-[#8b4e2e] uppercase tracking-wide">
                      Description <span className="font-normal text-[#9a7060] normal-case">(optional)</span>
                    </label>
                    <textarea 
                      className="w-full rounded-xl border-[1.5px] border-[#f0ddd5] bg-[#fdfaf8] p-3 text-[0.85rem] text-[#2d1810] outline-none focus:border-[#c9856a] transition-all min-h-[90px] resize-none"
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