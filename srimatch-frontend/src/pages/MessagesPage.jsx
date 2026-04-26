// MessagesPage.jsx - Redesigned to match SriMatch luxury aesthetic
import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { dummyMessages, dummyProfiles } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";
import {
  Search, Send, Smile, Paperclip, Image as ImageIcon, Mic,
  MessageCircle, Phone, Video, UserPlus, Check,
  X, Info, Lock, Crown, Zap, Heart, ChevronRight, Loader2, Clock, Flag,
} from "lucide-react";
import ChatService from "../services/chat.service";
import MatchService from "../services/match.service";
import ReportService from "../services/report.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .mp-root * { box-sizing: border-box; }

  .mp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2rem 1.5rem 4rem;
  }

  .mp-inner { max-width: 1100px; margin: 0 auto; }

  /* ── Page header ── */
  .mp-page-header { margin-bottom: 1.75rem; }
  .mp-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #2d1810; line-height: 1.1;
  }
  .mp-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .mp-page-sub { font-size: 0.83rem; color: #9a7060; margin-top: 0.2rem; }

  /* ── Shell ── */
  .mp-shell {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 680px;
  }
  @media (max-width: 768px) {
    .mp-shell { grid-template-columns: 1fr; height: auto; }
    .mp-sidebar { display: none; }
    .mp-sidebar.show { display: flex; }
    .mp-chat { min-height: 600px; }
  }

  /* ── Sidebar ── */
  .mp-sidebar {
    border-right: 1px solid #f5ede8;
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  .mp-sidebar-head {
    padding: 1.25rem 1.25rem 0.9rem;
    border-bottom: 1px solid #f5ede8;
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
  }
  .mp-sidebar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #fff;
    margin-bottom: 0.75rem;
  }

  /* Search inside sidebar */
  .mp-search-wrap { position: relative; }
  .mp-search-icon { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #c4a99a; pointer-events: none; }
  .mp-search {
    width: 100%; padding: 0.55rem 0.9rem 0.55rem 2.4rem;
    border: none; border-radius: 10px;
    font-size: 0.82rem; color: #2d1810; background: rgba(255,255,255,0.15);
    font-family: 'DM Sans', sans-serif; outline: none; color: #fff;
  }
  .mp-search::placeholder { color: rgba(255,255,255,0.5); }
  .mp-search:focus { background: rgba(255,255,255,0.25); }

  /* Conversation list */
  .mp-conv-list { flex: 1; overflow-y: auto; }
  .mp-conv-list::-webkit-scrollbar { width: 3px; }
  .mp-conv-list::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 99px; }

  .mp-conv-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid #fdf5f0; cursor: pointer;
    transition: background 0.15s;
  }
  .mp-conv-item:hover { background: #fdf5f0; }
  .mp-conv-item.active { background: linear-gradient(135deg, #fdf0e8, #faf0f8); }
  .mp-conv-item.unread { background: #fffbf8; }

  .mp-conv-avatar-wrap { position: relative; flex-shrink: 0; }
  .mp-conv-avatar {
    width: 46px; height: 46px; border-radius: 50%; object-fit: cover;
    border: 2px solid #f0ddd5;
  }
  .mp-conv-avatar.active-border { border-color: #c9856a; }
  .mp-conv-online {
    position: absolute; bottom: 1px; right: 1px;
    width: 11px; height: 11px; border-radius: 50%;
    border: 2px solid #fff;
  }
  .mp-conv-online.online { background: #5aaa7a; }
  .mp-conv-online.offline { background: #ccc; }

  .mp-conv-body { flex: 1; min-width: 0; }
  .mp-conv-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
  .mp-conv-name { font-size: 0.84rem; font-weight: 500; color: #2d1810; }
  .mp-conv-time { font-size: 0.69rem; color: #b09080; flex-shrink: 0; }
  .mp-conv-preview { font-size: 0.76rem; color: #9a7060; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
  .mp-conv-preview.bold { color: #2d1810; font-weight: 500; }
  .mp-conv-badge {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    color: #fff; font-size: 0.65rem; font-weight: 600;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .mp-conv-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem 1rem; text-align: center; flex: 1;
  }
  .mp-conv-empty p { font-size: 0.8rem; color: #b09080; margin-top: 0.5rem; }

  /* ── Chat pane ── */
  .mp-chat {
    display: flex; flex-direction: column; overflow: hidden;
  }

  /* Chat header */
  .mp-chat-head {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 0.9rem 1.5rem;
    border-bottom: 1px solid #f5ede8;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    flex-shrink: 0;
  }
  .mp-chat-avatar {
    width: 42px; height: 42px; border-radius: 50%; object-fit: cover;
    border: 2px solid #f0ddd5; flex-shrink: 0;
  }
  .mp-chat-info { flex: 1; min-width: 0; }
  .mp-chat-name { font-size: 0.92rem; font-weight: 500; color: #2d1810; }
  .mp-chat-status { font-size: 0.72rem; color: #9a7060; display: flex; align-items: center; gap: 4px; }
  .mp-chat-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #5aaa7a; display: inline-block; }

  .mp-chat-actions { display: flex; gap: 0.25rem; }
  .mp-chat-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: none; border: 1.5px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #9a7060; transition: all 0.2s;
  }
  .mp-chat-btn:hover:not(:disabled) { border-color: #c9856a; color: #8b4e2e; background: #fdf0e8; }
  .mp-chat-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .mp-chat-btn.active { background: #fdf0e8; border-color: #c9856a; color: #8b4e2e; }

  /* Connection banner */
  .mp-banner {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.6rem 1.5rem; font-size: 0.78rem; flex-shrink: 0;
    gap: 0.5rem;
  }
  .mp-banner.warning { background: #fffbf0; color: #7a6010; border-bottom: 1px solid #f0e090; }
  .mp-banner.info { background: #f0f4fd; color: #3a5ea8; border-bottom: 1px solid #d0dcf4; }
  .mp-banner-left { display: flex; align-items: center; gap: 0.5rem; }
  .mp-banner-btn {
    padding: 0.3rem 0.85rem; border-radius: 99px; font-size: 0.74rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    white-space: nowrap; transition: opacity 0.2s;
  }
  .mp-banner-btn:hover { opacity: 0.88; }

  /* Messages area */
  .mp-messages {
    flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.85rem;
    background: #fdf8f4;
  }
  .mp-messages::-webkit-scrollbar { width: 3px; }
  .mp-messages::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 99px; }

  /* Date separator */
  .mp-date-sep {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 0.69rem; color: #b09080; letter-spacing: 0.06em; text-transform: uppercase;
    margin: 0.5rem 0;
  }
  .mp-date-sep::before, .mp-date-sep::after { content: ''; flex: 1; height: 1px; background: #f0ddd5; }

  /* Bubbles */
  .mp-bubble-row { display: flex; }
  .mp-bubble-row.mine { justify-content: flex-end; }
  .mp-bubble-row.theirs { justify-content: flex-start; }

  .mp-bubble {
    max-width: 68%; padding: 0.65rem 0.95rem;
    border-radius: 18px; position: relative;
  }
  .mp-bubble.mine {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff;
    border-bottom-right-radius: 5px;
    box-shadow: 0 4px 12px rgba(139,78,46,0.22);
  }
  .mp-bubble.theirs {
    background: #fff; color: #2d1810;
    border-bottom-left-radius: 5px;
    border: 1px solid #f0ddd5;
    box-shadow: 0 2px 8px rgba(120,60,30,0.05);
  }
  .mp-bubble-text { font-size: 0.87rem; line-height: 1.55; }
  .mp-bubble-time {
    font-size: 0.66rem; margin-top: 0.3rem; display: block;
  }
  .mp-bubble-time.mine { color: rgba(255,255,255,0.6); text-align: right; }
  .mp-bubble-time.theirs { color: #b09080; }

  /* Empty chat */
  .mp-chat-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex: 1; text-align: center; padding: 2rem;
  }
  .mp-chat-empty-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }
  .mp-chat-empty h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #2d1810; margin-bottom: 0.3rem;
  }
  .mp-chat-empty p { font-size: 0.82rem; color: #9a7060; }

  /* No conversation selected */
  .mp-no-conv {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex: 1; text-align: center; padding: 3rem 2rem;
    background: linear-gradient(135deg, #fdf5ee 0%, #faf0f8 100%);
  }
  .mp-no-conv-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }
  .mp-no-conv h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600; color: #2d1810; margin-bottom: 0.35rem;
  }
  .mp-no-conv p { font-size: 0.83rem; color: #9a7060; }

  /* Input bar */
  .mp-input-bar {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.9rem 1.25rem;
    border-top: 1px solid #f5ede8;
    background: #fff; flex-shrink: 0;
  }
  .mp-input-action {
    width: 34px; height: 34px; border-radius: 50%; border: none;
    background: none; color: #b09080; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .mp-input-action:hover { color: #8b4e2e; background: #fdf0e8; }
  .mp-input {
    flex: 1; padding: 0.6rem 1rem;
    border: 1.5px solid #e8ddd8; border-radius: 22px;
    font-size: 0.87rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s;
  }
  .mp-input:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .mp-input::placeholder { color: #c4b0a5; }
  .mp-input:disabled { background: #f5f0ed; color: #b09080; cursor: not-allowed; }

  .mp-send-btn {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(139,78,46,0.28);
    transition: all 0.2s; flex-shrink: 0;
  }
  .mp-send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 6px 16px rgba(139,78,46,0.36); }
  .mp-send-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

  /* Premium upsell */
  .mp-premium-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.65rem 1.5rem;
    background: linear-gradient(135deg, #3d1f12, #6b3526);
    color: rgba(255,255,255,0.9); font-size: 0.77rem;
    flex-shrink: 0; gap: 0.5rem;
  }
  .mp-premium-bar-left { display: flex; align-items: center; gap: 0.4rem; }
  .mp-premium-bar-btn {
    padding: 0.3rem 0.85rem; border-radius: 99px; font-size: 0.74rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  @media (max-width: 600px) {
    .mp-banner { padding: 0.6rem 1rem; }
  }

  .mp-spin { animation: mp-spin 1s linear infinite; }
  @keyframes mp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
const MessagesPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialUserId = queryParams.get("user");

  const {
    user,
    connections = [],
    subscription = {},
    sentRequests = [],
    acceptFriendRequest,
    toggleFriendRequest,
  } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const messageEndRef = useRef(null);
  const pollingInterval = useRef(null);

  useEffect(() => {
    fetchConversations();
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
      
      // Start polling for new messages (fallback for WebSockets)
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      pollingInterval.current = setInterval(() => {
        fetchMessages(activeConversation.id, true);
      }, 5000);
    } else {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await MatchService.getMyMatches();
      if (response.success) {
        setConversations(response.data.content || []);
        if (response.data.content?.length > 0 && !activeConversation && !initialUserId) {
          setActiveConversation(response.data.content[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId, isPolling = false) => {
    try {
      if (!isPolling) setLoadingMessages(true);
      const response = await ChatService.getChatHistory(matchId);
      if (response.success) {
        // Only update if new messages arrived to avoid jitter
        setMessages(prev => {
          const newMessages = response.data.content || [];
          if (newMessages.length !== prev.length) return newMessages.reverse();
          return prev;
        });
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      if (!isPolling) setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    const payload = {
      matchId: activeConversation.id,
      receiverId: activeConversation.otherUser.id,
      content: message,
      type: "TEXT"
    };

    try {
      const response = await ChatService.sendMessage(payload);
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason || !reportDesc || !activeConversation) return;
    try {
      setReportLoading(true);
      await ReportService.submitReport({
        reportedUserId: activeConversation.otherUser.id,
        reason: reportReason,
        description: reportDesc
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason("");
        setReportDesc("");
      }, 2000);
    } catch (err) {
      alert(err.message || "Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  const selectConversation = (conv) => {
    setActiveConversation(conv);
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  const filtered = conversations.filter(c =>
    c.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPremium = user?.premium;
  const canCall = isPremium && (subscription?.daysRemaining > 0);
  const canType = true; // Based on match status

  return (
    <>
      <style>{styles}</style>
      <div className="mp-root">
        <div className="mp-inner">

          {/* Page header */}
          <div className="mp-page-header">
            <h1 className="mp-page-title">Your <span>Messages</span></h1>
            <p className="mp-page-sub">Connect and converse with your potential matches</p>
          </div>

          <div className="mp-shell">

            {/* ── Sidebar ── */}
            <div className="mp-sidebar">
              <div className="mp-sidebar-head">
                <div className="mp-sidebar-title">Conversations</div>
                <div className="mp-search-wrap">
                  <Search className="mp-search-icon" size={14} />
                  <input
                    type="text"
                    className="mp-search"
                    placeholder="Search…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mp-conv-list">
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#9a7060' }}>
                    <Loader2 size={24} className="mp-spin" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ fontSize: '0.8rem' }}>Loading conversations...</p>
                  </div>
                ) : filtered.length > 0 ? filtered.map(conv => {
                  const isActive = activeConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      className={`mp-conv-item${isActive ? " active" : ""}`}
                      onClick={() => selectConversation(conv)}
                    >
                      <div className="mp-conv-avatar-wrap">
                        <img src={conv.otherUser.profileImageUrl || "/default-avatar.png"} alt={conv.otherUser.name} className={`mp-conv-avatar${isActive ? " active-border" : ""}`} />
                        {/* Status could be added here if available */}
                      </div>
                      <div className="mp-conv-body">
                        <div className="mp-conv-top">
                          <span className="mp-conv-name">{conv.otherUser.name}</span>
                          <span className="mp-conv-time">{new Date(conv.matchedAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.3rem" }}>
                          <span className="mp-conv-preview">
                            Click to chat with {conv.otherUser.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="mp-conv-empty">
                    <MessageCircle size={28} style={{ color: "#e8c9b8" }} />
                    <p>No matches yet</p>
                    <Link to="/" style={{ fontSize: '0.75rem', color: '#8b4e2e', marginTop: '0.5rem' }}>Find your match ✦</Link>
                  </div>
                )}
              </div>
            </div>

            {/* ── Chat pane ── */}
            <div className="mp-chat">
              {activeConversation ? (
                <>
                  {/* Chat header */}
                  <div className="mp-chat-head">
                    <img src={activeConversation.otherUser.profileImageUrl || "/default-avatar.png"} alt={activeConversation.otherUser.name} className="mp-chat-avatar" />
                    <div className="mp-chat-info">
                      <div className="mp-chat-name">{activeConversation.otherUser.name}</div>
                      <div className="mp-chat-status">
                        {activeConversation.otherUser.profession} · {activeConversation.otherUser.district}
                      </div>
                    </div>
                    <div className="mp-chat-actions">
                      <button
                        className="mp-chat-btn"
                        title="Report User"
                        onClick={() => setShowReportModal(true)}
                      >
                        <Flag size={15} />
                      </button>
                      <button
                        className="mp-chat-btn"
                        title={canCall ? "Voice Call" : "Coming Soon"}
                        disabled={!canCall}
                        onClick={() => !canCall ? alert("Voice calls are coming soon!") : alert("Voice call feature is coming soon!")}
                      >
                        <Phone size={15} />
                      </button>
                      <button
                        className="mp-chat-btn"
                        title={canCall ? "Video Call" : "Coming Soon"}
                        disabled={!canCall}
                        onClick={() => !canCall ? alert("Video calls are coming soon!") : alert("Video call feature is coming soon!")}
                      >
                        <Video size={15} />
                      </button>
                    </div>
                  </div>

                  {!isPremium && (
                    <div className="mp-premium-bar">
                      <div className="mp-premium-bar-left">
                        <Crown size={13} style={{ color: "#e8c97a" }} />
                        Get Premium to enjoy unlimited features and boost your profile
                      </div>
                      <Link to="/subscription" className="mp-premium-bar-btn" style={{ textDecoration: "none" }}>Upgrade ✦</Link>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="mp-messages">
                    {loadingMessages ? (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Loader2 size={32} className="mp-spin" color="#e8c9b8" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="mp-chat-empty" style={{ flex: 1 }}>
                        <div className="mp-chat-empty-icon">
                          <Heart size={26} style={{ color: "#c9856a" }} />
                        </div>
                        <h3>Say hello to {activeConversation.otherUser.name}</h3>
                        <p>Be the first to break the ice ✦</p>
                      </div>
                    ) : (
                      <>
                        <div className="mp-date-sep">Chat Started</div>
                        {messages.map(msg => {
                          const isMine = msg.senderId === user?.id;
                          return (
                            <div key={msg.id} className={`mp-bubble-row ${isMine ? "mine" : "theirs"}`}>
                              <div className={`mp-bubble ${isMine ? "mine" : "theirs"}`}>
                                <span className="mp-bubble-text">{msg.content}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                                    <span className={`mp-bubble-time ${isMine ? "mine" : "theirs"}`}>
                                    {formatTime(msg.createdAt)}
                                    </span>
                                    {isMine && (
                                        msg.read ? <Check size={10} color="#fff" /> : <Clock size={10} color="rgba(255,255,255,0.6)" />
                                    )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                    <div ref={messageEndRef} />
                  </div>

                  {/* Input bar */}
                  <div className="mp-input-bar">
                    <button type="button" className="mp-input-action"><Smile size={17} /></button>
                    <button type="button" className="mp-input-action"><Paperclip size={17} /></button>
                    <button type="button" className="mp-input-action"><Image size={17} /></button>
                    <form onSubmit={handleSendMessage} style={{ flex: 1, display: "flex", gap: "0.4rem", alignItems: "center" }}>
                      <input
                        type="text"
                        className="mp-input"
                        placeholder={`Message ${activeConversation.otherUser.name}…`}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={!canType}
                      />
                      <button type="submit" className="mp-send-btn" disabled={!message.trim() || !canType}>
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="mp-no-conv">
                  <div className="mp-no-conv-icon">
                    <MessageCircle size={30} style={{ color: "#c9856a" }} />
                  </div>
                  <h3>No conversation selected</h3>
                  <p>Pick a conversation from the list or visit a profile to start chatting</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {showReportModal && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(30,8,2,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem', backdropFilter: 'blur(4px)' }}
          onClick={() => !reportLoading && setShowReportModal(false)}
        >
          <div 
            style={{ background: '#fff', borderRadius: '22px', width: '100%', maxWidth: '450px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.3s ease-out', position: 'relative', margin: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Report {activeConversation?.otherUser.name}</h3>
                <button 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#f5ede5', color: '#8b4e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => setShowReportModal(false)}
                >
                  <X size={15} />
                </button>
              </div>

              {reportSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Check size={24} />
                  </div>
                  <p style={{ fontWeight: 600, color: '#2d1810' }}>Report Submitted</p>
                  <p style={{ fontSize: '0.85rem', color: '#9a7060', marginTop: '0.25rem' }}>Our team will investigate this user shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleReport}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b4e2e', marginBottom: '0.4rem', display: 'block' }}>Reason for report</label>
                    <select 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #f0ddd5', fontSize: '0.85rem', outline: 'none', background: '#fdfaf8' }}
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
                  <div style={{ marginBottom: '1.75rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b4e2e', marginBottom: '0.4rem', display: 'block' }}>Description</label>
                    <textarea 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #f0ddd5', fontSize: '0.85rem', outline: 'none', resize: 'none', minHeight: '110px', background: '#fdfaf8' }}
                      placeholder="Please provide details about the issue..."
                      value={reportDesc}
                      onChange={e => setReportDesc(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={reportLoading}
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '99px', border: 'none', background: 'linear-gradient(135deg, #3d1f12, #8b4e2e)', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 20px rgba(139,78,46,0.25)' }}
                  >
                    {reportLoading ? <Loader2 size={16} className="mp-spin" /> : <Flag size={14} />}
                    Submit Report
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default MessagesPage;