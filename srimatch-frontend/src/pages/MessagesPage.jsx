// MessagesPage.jsx - Redesigned to match SriMatch luxury aesthetic
import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { dummyMessages, dummyProfiles } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";
import {
  Search, Send, Smile, Paperclip, Image, Mic,
  MessageCircle, Phone, Video, UserPlus, Check,
  X, Info, Lock, Crown, Zap, Heart, ChevronRight,
} from "lucide-react";

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
    .mp-root { padding: 1.25rem 0.75rem 4rem; }
    .mp-bubble { max-width: 85%; }
    .mp-chat-head { padding: 0.75rem 1rem; }
    .mp-messages { padding: 1rem; }
    .mp-input-bar { padding: 0.75rem 1rem; }
    .mp-banner { padding: 0.6rem 1rem; }
  }
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

  const [conversations, setConversations] = useState(dummyMessages);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messagesBeforeConnect, setMessagesBeforeConnect] = useState(0);
  const messageEndRef = useRef(null);

  /* seed online status once per mount */
  const [onlineMap] = useState(() => {
    const map = {};
    dummyMessages.forEach(c => { map[c.id] = Math.random() > 0.5; });
    return map;
  });

  useEffect(() => {
    if (initialUserId) {
      const conv = conversations.find(c => c.userId === initialUserId);
      if (conv) {
        setActiveConversation(conv);
      } else {
        const profile = dummyProfiles.find(p => p.id === initialUserId);
        if (profile) {
          const newConv = {
            id: `conv-${Date.now()}`,
            userId: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            messages: [],
            unread: 0,
            lastMessageTime: "Just now",
            avatar: profile.profileImage,
          };
          setConversations(prev => [...prev, newConv]);
          setActiveConversation(newConv);
        }
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [initialUserId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages?.length]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;

    const isConnected = connections.includes(activeConversation.userId);
    const isPremium = subscription?.plan === "premium";

    if (!isConnected && !isPremium) return;
    if (!isConnected && isPremium) {
      if (messagesBeforeConnect >= (subscription?.features?.messageBeforeAccept || 3)) return;
      setMessagesBeforeConnect(n => n + 1);
    }

    const newMsg = {
      id: `m${Date.now()}`,
      sender: user?.id,
      content: message,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setConversations(prev => prev.map(c =>
      c.id === activeConversation.id
        ? { ...c, messages: [...c.messages, newMsg], lastMessageTime: "Just now" }
        : c
    ));
    setActiveConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
    setMessage("");
  };

  const selectConversation = (conv) => {
    setActiveConversation(conv);
    setMessagesBeforeConnect(0);
    /* mark as read */
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c));
  };

  const formatTime = (ts) => {
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isConnected = activeConversation ? connections.includes(activeConversation.userId) : false;
  const hasSentRequest = activeConversation ? sentRequests.includes(activeConversation.userId) : false;
  const activeProfile = activeConversation ? dummyProfiles.find(p => p.id === activeConversation.userId) : null;
  const isPremium = subscription?.plan === "premium";
  const canCall = subscription?.features?.canVoiceVideoCall;
  const msgsLeft = (subscription?.features?.messageBeforeAccept || 3) - messagesBeforeConnect;
  const canType = isConnected || isPremium;

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
                {filtered.length > 0 ? filtered.map(conv => {
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  const isOnline = onlineMap[conv.id];
                  const isActive = activeConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      className={`mp-conv-item${isActive ? " active" : ""}${conv.unread > 0 ? " unread" : ""}`}
                      onClick={() => selectConversation(conv)}
                    >
                      <div className="mp-conv-avatar-wrap">
                        <img src={conv.avatar} alt={conv.name} className={`mp-conv-avatar${isActive ? " active-border" : ""}`} />
                        <div className={`mp-conv-online ${isOnline ? "online" : "offline"}`} />
                      </div>
                      <div className="mp-conv-body">
                        <div className="mp-conv-top">
                          <span className="mp-conv-name">{conv.name}</span>
                          <span className="mp-conv-time">{conv.lastMessageTime}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.3rem" }}>
                          <span className={`mp-conv-preview${conv.unread > 0 ? " bold" : ""}`}>
                            {lastMsg?.content || "Start a conversation…"}
                          </span>
                          {conv.unread > 0 && <span className="mp-conv-badge">{conv.unread}</span>}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="mp-conv-empty">
                    <MessageCircle size={28} style={{ color: "#e8c9b8" }} />
                    <p>No conversations found</p>
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
                    <img src={activeConversation.avatar} alt={activeConversation.name} className="mp-chat-avatar" />
                    <div className="mp-chat-info">
                      <div className="mp-chat-name">{activeConversation.name}</div>
                      <div className="mp-chat-status">
                        {onlineMap[activeConversation.id]
                          ? <><span className="mp-chat-status-dot" />Online</>
                          : "Last seen recently"}
                      </div>
                    </div>
                    <div className="mp-chat-actions">
                      <button
                        className={`mp-chat-btn${canCall ? "" : ""}`}
                        title={canCall ? "Voice Call" : "Upgrade for voice calls"}
                        disabled={!canCall}
                        onClick={() => !canCall && alert("Voice calls are a Premium feature.")}
                      >
                        <Phone size={15} />
                      </button>
                      <button
                        className="mp-chat-btn"
                        title={canCall ? "Video Call" : "Upgrade for video calls"}
                        disabled={!canCall}
                        onClick={() => !canCall && alert("Video calls are a Premium feature.")}
                      >
                        <Video size={15} />
                      </button>
                      {!isConnected && (
                        <button
                          className={`mp-chat-btn${hasSentRequest ? " active" : ""}`}
                          title={hasSentRequest ? "Request Sent" : "Send Connection Request"}
                          onClick={() => toggleFriendRequest(activeConversation.userId)}
                        >
                          <UserPlus size={15} />
                        </button>
                      )}
                      {isConnected && (
                        <button className="mp-chat-btn active" title="Connected" style={{ cursor: "default" }}>
                          <Check size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Premium upsell bar */}
                  {!isPremium && !isConnected && !hasSentRequest && (
                    <div className="mp-premium-bar">
                      <div className="mp-premium-bar-left">
                        <Crown size={13} style={{ color: "#e8c97a" }} />
                        Upgrade to Premium to message before connecting
                      </div>
                      <Link to="/subscription" className="mp-premium-bar-btn" style={{ textDecoration: "none" }}>Upgrade ✦</Link>
                    </div>
                  )}

                  {/* Connection status banner */}
                  {!isConnected && (hasSentRequest || isPremium) && (
                    <div className={`mp-banner ${hasSentRequest ? "info" : "warning"}`}>
                      <div className="mp-banner-left">
                        {hasSentRequest
                          ? <><Info size={13} />Request sent · waiting for {activeProfile?.firstName} to accept</>
                          : <><Zap size={13} style={{ color: "#c07030" }} />{msgsLeft} free message{msgsLeft !== 1 ? "s" : ""} remaining before connection</>}
                      </div>
                      {!hasSentRequest && (
                        <button className="mp-banner-btn" onClick={() => toggleFriendRequest(activeConversation.userId)}>
                          Connect
                        </button>
                      )}
                    </div>
                  )}

                  {/* Messages */}
                  <div className="mp-messages">
                    {activeConversation.messages.length === 0 ? (
                      <div className="mp-chat-empty" style={{ flex: 1 }}>
                        <div className="mp-chat-empty-icon">
                          <Heart size={26} style={{ color: "#c9856a" }} />
                        </div>
                        <h3>Say hello to {activeProfile?.firstName || "them"}</h3>
                        <p>Be the first to break the ice ✦</p>
                      </div>
                    ) : (
                      <>
                        <div className="mp-date-sep">Today</div>
                        {activeConversation.messages.map(msg => {
                          const isMine = msg.sender === user?.id;
                          return (
                            <div key={msg.id} className={`mp-bubble-row ${isMine ? "mine" : "theirs"}`}>
                              <div className={`mp-bubble ${isMine ? "mine" : "theirs"}`}>
                                <span className="mp-bubble-text">{msg.content}</span>
                                <span className={`mp-bubble-time ${isMine ? "mine" : "theirs"}`}>
                                  {formatTime(msg.timestamp)}
                                </span>
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
                        placeholder={canType ? `Message ${activeProfile?.firstName || ""}…` : "Connect to send messages"}
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
    </>
  );
};

export default MessagesPage;