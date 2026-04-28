import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  MessageCircleIcon,
  UserPlusIcon,
  StarIcon,
  ShieldCheckIcon,
  CheckIcon,
  BellIcon,
  ChevronRightIcon,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .nd-root * { box-sizing: border-box; }

  .nd-root {
    font-family: 'DM Sans', sans-serif;
    position: absolute;
    right: 0;
    top: calc(100% + 0.6rem);
    width: 340px;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 16px 48px rgba(30,8,2,0.16), 0 4px 12px rgba(0,0,0,0.08);
    overflow: hidden;
    z-index: 200;
    animation: nd-fade-in 0.15s ease;
  }
  @keyframes nd-fade-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Header ── */
  .nd-header {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1rem 1.25rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nd-header-left {
    display: flex; align-items: center; gap: 0.5rem;
  }
  .nd-header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #fff;
  }
  .nd-unread-badge {
    background: linear-gradient(135deg, #e07a30, #c93a1a);
    color: #fff; font-size: 0.62rem; font-weight: 700;
    padding: 0.15rem 0.5rem; border-radius: 99px;
    min-width: 18px; text-align: center;
  }
  .nd-mark-all-btn {
    font-size: 0.72rem; font-weight: 500;
    color: rgba(255,255,255,0.75);
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 99px; padding: 0.25rem 0.7rem;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .nd-mark-all-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* ── List ── */
  .nd-list {
    max-height: 380px;
    overflow-y: auto;
  }

  /* ── Notification item ── */
  .nd-item {
    display: flex; align-items: flex-start; gap: 0.75rem;
    padding: 0.85rem 1.1rem;
    border-bottom: 1px solid #faf3ef;
    text-decoration: none;
    transition: background 0.15s;
    position: relative;
    cursor: pointer;
  }
  .nd-item:last-child { border-bottom: none; }
  .nd-item:hover { background: #fdf5f0; }
  .nd-item.unread { background: #fffbf8; }
  .nd-item.unread:hover { background: #fdf5f0; }

  /* Avatar / icon */
  .nd-avatar-wrap { position: relative; flex-shrink: 0; }
  .nd-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0ddd5;
  }
  .nd-avatar-placeholder {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .nd-type-badge {
    position: absolute; bottom: -2px; right: -2px;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff;
  }

  /* Content */
  .nd-content { flex: 1; min-width: 0; }
  .nd-message {
    font-size: 0.81rem; color: #2d1810; line-height: 1.5;
    margin: 0 0 3px;
  }
  .nd-message strong { font-weight: 500; color: #3d1f12; }
  .nd-time { font-size: 0.69rem; color: #b09080; }

  /* Unread dot */
  .nd-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    flex-shrink: 0; margin-top: 5px;
  }

  /* ── Empty state ── */
  .nd-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 2.5rem 1rem; text-align: center;
  }
  .nd-empty-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.75rem;
  }
  .nd-empty p { font-size: 0.81rem; color: #9a7060; }

  /* ── Footer ── */
  .nd-footer {
    padding: 0.75rem 1.1rem;
    border-top: 1px solid #f5ede8;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
  }
  .nd-view-all {
    display: flex; align-items: center; justify-content: center; gap: 0.3rem;
    width: 100%;
    font-size: 0.79rem; font-weight: 500;
    color: #8b4e2e; text-decoration: none;
    transition: color 0.15s;
  }
  .nd-view-all:hover { color: #3d1f12; }
`;

/* ─── Notification type config ─────────────────────────────────────────── */
const TYPE_CONFIG = {
  like: {
    icon: HeartIcon,
    badgeBg: "#fde8ef",
    badgeColor: "#c03060",
    placeholderBg: "#fde8ef",
  },
  message: {
    icon: MessageCircleIcon,
    badgeBg: "#e0eaf8",
    badgeColor: "#3a6ea8",
    placeholderBg: "#e0eaf8",
  },
  connection: {
    icon: UserPlusIcon,
    badgeBg: "#f0e8fd",
    badgeColor: "#6a40a8",
    placeholderBg: "#f0e8fd",
  },
  match: {
    icon: StarIcon,
    badgeBg: "#fef3d0",
    badgeColor: "#b07a10",
    placeholderBg: "#fef3d0",
  },
  system: {
    icon: ShieldCheckIcon,
    badgeBg: "#e0f5e8",
    badgeColor: "#3a7a5a",
    placeholderBg: "#e0f5e8",
  },
};

/* ─── Dummy data ─────────────────────────────────────────────────────────── */
const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    type: "like",
    message: "Nirmala Silva liked your profile",
    timestamp: "10 minutes ago",
    read: false,
    profileId: "profile1",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=60",
    profileName: "Nirmala Silva",
  },
  {
    id: "n2",
    type: "message",
    message: "Priyanka Jayawardena sent you a message",
    timestamp: "1 hour ago",
    read: false,
    profileId: "profile5",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=60",
    profileName: "Priyanka Jayawardena",
  },
  {
    id: "n3",
    type: "connection",
    message: "Dinesh Rajapaksa sent you a connection request",
    timestamp: "3 hours ago",
    read: false,
    profileId: "profile2",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=60",
    profileName: "Dinesh Rajapaksa",
  },
  {
    id: "n4",
    type: "match",
    message: "You matched with Kumari Bandara! You can now message each other.",
    timestamp: "1 day ago",
    read: true,
    profileId: "profile3",
    profileImage: "https://images.unsplash.com/photo-1664575599736-c5197c684de0?auto=format&fit=crop&w=800&q=60",
    profileName: "Kumari Bandara",
  },
  {
    id: "n5",
    type: "system",
    message: "Your profile verification was successful! Your profile now has a verified badge.",
    timestamp: "2 days ago",
    read: true,
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="nd-root">

        {/* Header */}
        <div className="nd-header">
          <div className="nd-header-left">
            <BellIcon size={15} style={{ color: "rgba(255,255,255,0.8)" }} />
            <span className="nd-header-title">Notifications</span>
            {unreadCount > 0 && (
              <span className="nd-unread-badge">{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="nd-mark-all-btn" onClick={handleMarkAllAsRead}>
              <CheckIcon size={10} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="nd-list">
          {notifications.length === 0 ? (
            <div className="nd-empty">
              <div className="nd-empty-icon">
                <BellIcon size={20} style={{ color: "#c9856a" }} />
              </div>
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
              const Icon = cfg.icon;

              return (
                <Link
                  key={notification.id}
                  to={notification.profileId ? `/profile/${notification.profileId}` : "#"}
                  className={`nd-item${!notification.read ? " unread" : ""}`}
                  onClick={() => handleMarkRead(notification.id)}
                >
                  {/* Avatar or placeholder */}
                  <div className="nd-avatar-wrap">
                    {notification.profileImage ? (
                      <>
                        <img
                          src={notification.profileImage}
                          alt={notification.profileName || ""}
                          className="nd-avatar"
                        />
                        {/* Type badge on avatar */}
                        <div
                          className="nd-type-badge"
                          style={{ background: cfg.badgeBg }}
                        >
                          <Icon size={9} style={{ color: cfg.badgeColor }} />
                        </div>
                      </>
                    ) : (
                      <div
                        className="nd-avatar-placeholder"
                        style={{ background: cfg.placeholderBg }}
                      >
                        <Icon size={18} style={{ color: cfg.badgeColor }} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="nd-content">
                    <p className="nd-message">{notification.message}</p>
                    <span className="nd-time">{notification.timestamp}</span>
                  </div>

                  {/* Unread dot */}
                  {!notification.read && <div className="nd-dot" />}
                </Link>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="nd-footer">
          <Link to="/notifications" className="nd-view-all">
            View all notifications
            <ChevronRightIcon size={13} />
          </Link>
        </div>

      </div>
    </>
  );
};

export default NotificationsDropdown;