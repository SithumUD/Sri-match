import React, { useState, useEffect, useRef } from "react";
import {
  SearchIcon, SendIcon, XIcon, MessageCircleIcon,
  ChevronDownIcon, Loader2Icon, RefreshCwIcon,
  ClockIcon, AlertCircleIcon, CheckCircle2Icon,
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .as-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .as-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .as-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
  .as-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .as-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .as-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .as-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── STAT CHIPS ── */
  .as-chips { display: flex; gap: 0.85rem; flex-wrap: wrap; }
  .as-chip {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 12px; padding: 0.65rem 1.1rem;
    display: flex; flex-direction: column; gap: 1px;
    min-width: 100px;
  }
  .as-chip-label { font-size: 0.68rem; color: #9a7060; }
  .as-chip-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #2d1810; line-height: 1;
  }
  .as-chip-val.warn { color: #d97706; }
  .as-chip-val.red  { color: #dc2626; }

  /* ── LAYOUT ── */
  .as-layout {
    display: grid; grid-template-columns: 340px 1fr; gap: 1.25rem;
  }
  @media (max-width: 1024px) { .as-layout { grid-template-columns: 1fr; } }

  /* ── LEFT PANEL ── */
  .as-left { display: flex; flex-direction: column; gap: 0.85rem; }

  .as-tabs { display: flex; gap: 4px; background: #fdf5ee; padding: 4px; border-radius: 10px; border: 1px solid #f0ddd5; }
  .as-tab {
    flex: 1; padding: 0.45rem 0.3rem; border: none; border-radius: 7px;
    font-size: 0.7rem; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; color: #9a7060;
    background: transparent; transition: all 0.2s;
    text-transform: uppercase; letter-spacing: 0.03em;
  }
  .as-tab.active {
    background: #fff; color: #2d1810;
    box-shadow: 0 1px 4px rgba(139,78,46,0.12);
    border: 1px solid #f0ddd5;
  }

  .as-search { position: relative; }
  .as-search svg { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #c9856a; pointer-events: none; }
  .as-search-input {
    width: 100%; padding: 0.55rem 1rem 0.55rem 2.4rem;
    border-radius: 99px; border: 1.5px solid #f0ddd5;
    background: #fff; font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif; color: #2d1810;
    outline: none; transition: all 0.2s;
  }
  .as-search-input::placeholder { color: #c4a898; }
  .as-search-input:focus { border-color: #c9856a; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  /* ── TICKET LIST ── */
  .as-ticket-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 580px; overflow-y: auto; padding-right: 4px; }
  .as-ticket-list::-webkit-scrollbar { width: 4px; }
  .as-ticket-list::-webkit-scrollbar-thumb { background: #f0ddd5; border-radius: 10px; }

  .as-ticket-card {
    padding: 0.9rem 1rem; border-radius: 12px; border: 1px solid #f0ddd5;
    background: #fff; cursor: pointer; transition: all 0.15s;
    position: relative;
  }
  .as-ticket-card:hover { border-color: #e8c9b8; background: #fdf8f4; }
  .as-ticket-card.selected {
    border-color: #c9856a; background: #fdf5ee;
    box-shadow: 0 0 0 2px rgba(201,133,106,0.15);
  }
  .as-ticket-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.4rem; }
  .as-ticket-subject { font-weight: 500; font-size: 0.82rem; color: #2d1810; line-height: 1.35; flex: 1; }
  .as-ticket-meta { display: flex; justify-content: space-between; align-items: center; }
  .as-ticket-email { font-size: 0.71rem; color: #9a7060; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
  .as-ticket-time { font-size: 0.68rem; color: #c4a898; margin-top: 0.25rem; }
  .as-empty-list { text-align: center; padding: 3rem 1rem; color: #9a7060; font-size: 0.82rem; font-style: italic; opacity: 0.7; }

  /* ── BADGES ── */
  .as-badge {
    display: inline-flex; align-items: center; gap: 0.2rem;
    padding: 0.18rem 0.6rem; border-radius: 99px;
    font-size: 0.67rem; font-weight: 600; white-space: nowrap;
    text-transform: capitalize;
  }
  .as-badge.red    { background: #fef2f2; color: #dc2626; }
  .as-badge.orange { background: #fff7ed; color: #c2410c; }
  .as-badge.yellow { background: #fffbeb; color: #d97706; }
  .as-badge.green  { background: #f0fdf4; color: #16a34a; }
  .as-badge.gray   { background: #f8f8f8; color: #6b7280; }
  .as-badge.brown  { background: #fdf5ee; color: #8b4e2e; }

  /* ── CONVERSATION PANEL ── */
  .as-panel {
    background: #fff; border-radius: 16px; border: 1px solid #f0ddd5;
    overflow: hidden; display: flex; flex-direction: column;
    min-height: 550px; position: relative;
  }

  .as-panel-empty {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; align-items: center; gap: 0.65rem;
  }
  .as-panel-empty-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border: 1px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
  }
  .as-panel-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: #2d1810;
  }
  .as-panel-empty-sub { font-size: 0.79rem; color: #9a7060; }

  /* Panel header */
  .as-panel-hdr {
    padding: 1.1rem 1.4rem; border-bottom: 1px solid #f5ede5;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
  }
  .as-panel-hdr-top {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.6rem;
  }
  .as-panel-subject {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.15rem;
  }
  .as-panel-meta { font-size: 0.72rem; color: #9a7060; }
  .as-panel-hdr-btm { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }

  /* Status select */
  .as-select-wrap { position: relative; display: inline-flex; align-items: center; }
  .as-select-wrap svg { position: absolute; right: 0.6rem; pointer-events: none; color: #9a7060; }
  .as-status-select {
    padding: 0.3rem 1.8rem 0.3rem 0.7rem;
    border-radius: 99px; border: 1.5px solid #f0ddd5;
    background: #fff; font-size: 0.75rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; color: #2d1810;
    outline: none; cursor: pointer; -webkit-appearance: none;
    transition: all 0.2s;
  }
  .as-status-select:focus { border-color: #c9856a; }

  /* Messages */
  .as-messages {
    flex: 1; overflow-y: auto; padding: 1.1rem 1.4rem;
    display: flex; flex-direction: column; gap: 1rem;
    max-height: 400px;
    background: #fafafa;
  }
  .as-messages::-webkit-scrollbar { width: 5px; }
  .as-messages::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 10px; }

  .as-msg-row { display: flex; gap: 0.65rem; }
  .as-msg-row.admin { flex-direction: row-reverse; }

  .as-msg-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 600;
  }
  .as-msg-avatar.user {
    background: linear-gradient(135deg, #fdf5ee, #f0ddd5);
    color: #8b4e2e; border: 1px solid #f0ddd5;
  }
  .as-msg-avatar.admin {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #e8c97a;
  }

  .as-msg-bubble { max-width: 80%; }
  .as-msg-text {
    padding: 0.7rem 0.95rem; border-radius: 12px;
    font-size: 0.82rem; line-height: 1.55;
  }
  .as-msg-text.user {
    background: #fff; color: #2d1810;
    border: 1px solid #f0ddd5; border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }
  .as-msg-text.admin {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fdf5ee; border-bottom-right-radius: 4px;
  }
  .as-msg-time { font-size: 0.67rem; color: #c4a898; margin-top: 0.3rem; }
  .as-msg-time.right { text-align: right; }

  /* Reply box */
  .as-reply-box {
    padding: 1rem 1.4rem; border-top: 1px solid #f5ede5; background: #fdf8f4;
  }
  .as-reply-textarea {
    width: 100%; padding: 0.7rem 0.95rem;
    border: 1.5px solid #f0ddd5; border-radius: 12px;
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    color: #2d1810; background: #fff; outline: none; resize: none;
    transition: all 0.2s; margin-bottom: 0.6rem;
  }
  .as-reply-textarea:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .as-reply-footer { display: flex; justify-content: space-between; align-items: center; }
  .as-reply-hint { font-size: 0.72rem; color: #c4a898; }
  .as-reply-hint strong { color: #9a7060; font-weight: 500; }

  /* Buttons */
  .as-btn-primary {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(200,160,80,0.3); transition: all 0.2s;
  }
  .as-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,160,80,0.42); }
  .as-btn-primary:disabled { opacity: 0.45; cursor: default; transform: none; box-shadow: none; }

  .as-resolved-note {
    padding: 1.2rem 1.4rem; border-top: 1px solid #f5ede5;
    text-align: center; font-size: 0.82rem; color: #8b4e2e;
    background: #fff8f4; font-style: italic;
  }

  .as-ornament { color: #e8c9b8; font-size: 0.6rem; letter-spacing: 0.2em; }

  .animate-spin { animation: as-spin 1.2s linear infinite; }
  @keyframes as-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

/* ─── Config ─────────────────────────────────────────────────────────────── */
const PRIORITY_CFG = {
  CRITICAL: { cls: "red",    label: "Critical" },
  HIGH:     { cls: "orange", label: "High"     },
  MEDIUM:   { cls: "yellow", label: "Medium"   },
  LOW:      { cls: "green",  label: "Low"      },
};

const STATUS_CFG = {
  OPEN:        { cls: "orange", label: "Open"        },
  IN_PROGRESS: { cls: "yellow", label: "In Progress"  },
  RESOLVED:    { cls: "green",  label: "Resolved"     },
  CLOSED:      { cls: "gray",   label: "Closed"       },
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
  });
};

/* ─── Component ───────────────────────────────────────────────────────────── */
const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selId, setSelId] = useState(null);
  const [reply, setReply] = useState("");
  const msgEndRef = useRef(null);

  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selId) {
      fetchMessages(selId);
    } else {
      setMessages([]);
    }
  }, [selId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAllTickets();
      setTickets(res.data || []);
    } catch (err) {
      console.error("Fetch tickets error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (id) => {
    try {
      setMsgLoading(true);
      const res = await AdminService.getTicketMessages(id);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setMsgLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selId) return;
    try {
      await AdminService.updateTicketStatus(selId, newStatus);
      setTickets(prev => prev.map(t => t.id === selId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selId) return;
    try {
      const res = await AdminService.replyToTicketAsAdmin(selId, reply);
      setMessages(prev => [...prev, res.data]);
      setReply("");

      // Update local ticket status if it was OPEN
      const ticket = tickets.find(t => t.id === selId);
      if (ticket && ticket.status === "OPEN") {
        setTickets(prev => prev.map(t => t.id === selId ? { ...t, status: "IN_PROGRESS" } : t));
      }
    } catch (err) {
      console.error("Reply error:", err);
      alert("Failed to send reply. Please try again.");
    }
  };

  const selected = tickets.find((t) => t.id === selId) ?? null;

  const filtered = tickets.filter((t) => {
    const tabMatch = tab === "ALL" || t.status === tab;
    const q = search.toLowerCase();
    const email = t.userEmail || "";
    const subject = t.subject || "";
    return tabMatch && (!q || (email + subject).toLowerCase().includes(q));
  });

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const progressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  const isClosed = selected && (selected.status === "RESOLVED" || selected.status === "CLOSED");

  return (
    <>
      <style>{styles}</style>
      <div className="as-root">

        {/* ── PAGE HEADER ── */}
        <div className="as-header">
          <div>
            <div className="as-eyebrow"><span className="as-ornament">✦</span> Admin Panel</div>
            <h1 className="as-page-title">Support <span>Centre</span></h1>
            <p className="as-page-sub">Manage member support requests and respond to incoming tickets.</p>
          </div>
          <div className="as-chips">
            <div className="as-chip">
              <span className="as-chip-label">Open Tickets</span>
              <span className={`as-chip-val${openCount > 0 ? " warn" : ""}`}>{openCount}</span>
            </div>
            <div className="as-chip">
              <span className="as-chip-label">In Progress</span>
              <span className="as-chip-val">{progressCount}</span>
            </div>
            <div className="as-chip">
              <span className="as-chip-label">Resolved</span>
              <span className="as-chip-val">{resolvedCount}</span>
            </div>
          </div>
        </div>

        <div className="as-layout">

          {/* ── LEFT: TICKET LIST ── */}
          <div className="as-left">
            <div className="as-tabs">
              {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map((t) => (
                <button
                  key={t}
                  className={`as-tab${tab === t ? " active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t === "IN_PROGRESS" ? "Active" : t.charAt(0) + t.slice(1).toLowerCase().replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="as-search">
              <SearchIcon size={14} />
              <input
                className="as-search-input"
                type="text"
                placeholder="Search email or subject…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="as-ticket-list">
              {loading ? (
                <div className="as-empty-list"><Loader2Icon size={18} className="animate-spin" /> Loading tickets...</div>
              ) : filtered.length === 0 ? (
                <div className="as-empty-list">No tickets found.</div>
              ) : filtered.map((t) => {
                const p = PRIORITY_CFG[t.priority] || PRIORITY_CFG.LOW;
                const s = STATUS_CFG[t.status] || STATUS_CFG.OPEN;
                return (
                  <div
                    key={t.id}
                    className={`as-ticket-card${selId === t.id ? " selected" : ""}`}
                    onClick={() => setSelId(t.id)}
                  >
                    <div className="as-ticket-card-top">
                      <span className="as-ticket-subject">{t.subject}</span>
                      <span className={`as-badge ${p.cls}`}>{p.label}</span>
                    </div>
                    <div className="as-ticket-meta">
                      <span className="as-ticket-email">{t.userEmail}</span>
                      <span className={`as-badge ${s.cls}`}>{s.label}</span>
                    </div>
                    <div className="as-ticket-time">{fmtTime(t.createdAt)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: CONVERSATION PANEL ── */}
          <div className="as-panel">
            {!selected ? (
              <div className="as-panel-empty">
                <div className="as-panel-empty-icon">
                  <MessageCircleIcon size={22} color="#c9856a" />
                </div>
                <div className="as-panel-empty-title">No Ticket Selected</div>
                <div className="as-panel-empty-sub">Pick a ticket from the list to view the conversation.</div>
              </div>
            ) : (
              <>
                {/* Panel Header */}
                <div className="as-panel-hdr">
                  <div className="as-panel-hdr-top">
                    <div>
                      <div className="as-panel-subject">{selected.subject}</div>
                      <div className="as-panel-meta">Ticket #{selected.id} · {selected.userEmail}</div>
                    </div>
                    <span className={`as-badge ${PRIORITY_CFG[selected.priority]?.cls || 'gray'}`}>
                      {PRIORITY_CFG[selected.priority]?.label || selected.priority}
                    </span>
                  </div>
                  <div className="as-panel-hdr-btm">
                    <span className={`as-badge ${STATUS_CFG[selected.status]?.cls || 'gray'}`}>
                      {STATUS_CFG[selected.status]?.label || selected.status}
                    </span>
                    <div className="as-select-wrap">
                      <select
                        className="as-status-select"
                        value={selected.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      <ChevronDownIcon size={11} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#c4a898" }}>· Created: {fmtTime(selected.createdAt)}</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="as-messages">
                  {msgLoading ? (
                    <div className="as-empty-list"><Loader2Icon size={18} className="animate-spin" /> Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="as-empty-list">No messages in this ticket.</div>
                  ) : messages.map((m) => (
                    <div key={m.id} className={`as-msg-row${m.adminReply ? " admin" : ""}`}>
                      <div className={`as-msg-avatar ${m.adminReply ? "admin" : "user"}`}>
                        {m.adminReply ? "A" : (m.senderEmail ? m.senderEmail[0].toUpperCase() : "?")}
                      </div>
                      <div className="as-msg-bubble">
                        <div className={`as-msg-text ${m.adminReply ? "admin" : "user"}`}>
                          {m.message}
                        </div>
                        <div className={`as-msg-time${m.adminReply ? " right" : ""}`}>
                          {m.adminReply ? "Support Admin" : m.senderEmail} · {fmtTime(m.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={msgEndRef} />
                </div>

                {/* Reply / Closed note */}
                {isClosed ? (
                  <div className="as-resolved-note">
                    <CheckCircle2Icon size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    This ticket is {selected.status.toLowerCase().replace("_", " ")}. Change the status above to reply.
                  </div>
                ) : (
                  <div className="as-reply-box">
                    <textarea
                      className="as-reply-textarea"
                      rows={3}
                      placeholder="Type your reply to the member…"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                    <div className="as-reply-footer">
                      <span className="as-reply-hint">
                        Replying as <strong>Support Admin</strong>
                        {selected.status === "OPEN" && " · will auto-set to In Progress"}
                      </span>
                      <button
                        className="as-btn-primary"
                        disabled={!reply.trim() || msgLoading}
                        onClick={handleSendReply}
                      >
                        <SendIcon size={12} /> Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminSupport;