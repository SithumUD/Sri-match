"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  HeartIcon,
  MessageCircleIcon,
  UserPlusIcon,
  StarIcon,
  ShieldCheckIcon,
  CheckIcon,
  BellIcon,
  CrownIcon,
  SparklesIcon,
  VideoIcon,
  AlertCircleIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useClearNotification,
} from "../hooks/useNotifications";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  .nd-root * { box-sizing: border-box; }

  .nd-root {
    font-family: var(--font-dm-sans), sans-serif;
    position: absolute;
    right: 0;
    top: calc(100% + 0.6rem);
    width: 360px;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 16px 48px rgba(30,8,2,0.18), 0 4px 12px rgba(0,0,0,0.08);
    border: 1px solid #f0ddd5;
    overflow: hidden;
    z-index: 300;
    animation: nd-fade-in 0.18s ease-out;
  }
  @keyframes nd-fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .nd-header {
    background: linear-gradient(135deg, #2d1810 0%, #4a2618 50%, #6b3526 100%);
    padding: 1rem 1.25rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nd-header-left {
    display: flex; align-items: center; gap: 0.55rem;
  }
  .nd-header-title {
    font-family: var(--font-cormorant), serif;
    font-size: 1.15rem; font-weight: 600; color: #fff;
  }
  .nd-unread-badge {
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #2d1810; font-size: 0.65rem; font-weight: 700;
    padding: 0.12rem 0.5rem; border-radius: 99px;
    min-width: 18px; text-align: center;
  }
  .nd-mark-all-btn {
    font-size: 0.72rem; font-weight: 500;
    color: rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 99px; padding: 0.25rem 0.75rem;
    cursor: pointer; font-family: var(--font-dm-sans), sans-serif;
    transition: all 0.2s;
  }
  .nd-mark-all-btn:hover { background: rgba(255,255,255,0.22); color: #fff; }

  /* ── List ── */
  .nd-list {
    max-height: 400px;
    overflow-y: auto;
  }

  /* ── Notification item ── */
  .nd-item {
    display: flex; align-items: flex-start; gap: 0.8rem;
    padding: 0.9rem 1.15rem;
    border-bottom: 1px solid #f9f0ea;
    text-decoration: none;
    transition: background 0.15s;
    position: relative;
    cursor: pointer;
  }
  .nd-item:last-child { border-bottom: none; }
  .nd-item:hover { background: #fdf6f2; }
  .nd-item.unread { background: #fffcf9; }
  .nd-item.unread:hover { background: #fdf5ee; }

  /* Avatar / icon */
  .nd-icon-wrap {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* Content */
  .nd-content { flex: 1; min-width: 0; }
  .nd-title {
    font-size: 0.82rem; font-weight: 600; color: #2d1810;
    margin: 0 0 2px; line-height: 1.3;
  }
  .nd-message {
    font-size: 0.78rem; color: #6b4a3a; line-height: 1.4;
    margin: 0 0 4px; word-break: break-word;
  }
  .nd-time { font-size: 0.68rem; color: #b09080; }

  /* Actions */
  .nd-actions {
    display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; flex-shrink: 0;
  }
  .nd-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #8b4e2e;
  }
  .nd-del-btn {
    border: none; background: transparent; color: #c4a898;
    cursor: pointer; padding: 2px; border-radius: 4px;
    opacity: 0; transition: all 0.15s;
  }
  .nd-item:hover .nd-del-btn { opacity: 1; }
  .nd-del-btn:hover { color: #dc2626; background: #fee2e2; }

  /* ── Empty & Loading state ── */
  .nd-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 3rem 1.5rem; text-align: center;
  }
  .nd-empty-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.75rem; color: #8b4e2e;
  }
  .nd-empty p { font-size: 0.83rem; color: #8b4e2e; font-weight: 500; margin-bottom: 2px; }
  .nd-empty span { font-size: 0.75rem; color: #9a7060; }
`;

/* ─── Type Visual Resolver ─────────────────────────────────────────────────── */
const resolveNotificationVisuals = (type: string) => {
  switch (type) {
    case "LIKE_RECEIVED":
    case "STAR_LIKE_RECEIVED":
      return {
        icon: HeartIcon,
        bg: "#fde8ef",
        color: "#c03060",
      };
    case "LIKE_ACCEPTED":
    case "MATCH_CREATED":
      return {
        icon: StarIcon,
        bg: "#fef3d0",
        color: "#b07a10",
      };
    case "NEW_MESSAGE":
      return {
        icon: MessageCircleIcon,
        bg: "#e0eaf8",
        color: "#2563eb",
      };
    case "ACCOUNT_VERIFIED":
      return {
        icon: ShieldCheckIcon,
        bg: "#e0f5e8",
        color: "#16a34a",
      };
    case "PAYMENT_STATUS_UPDATE":
    case "PREMIUM_ACTIVATED":
    case "PREMIUM_EXPIRING":
      return {
        icon: CrownIcon,
        bg: "#fef3d0",
        color: "#d97706",
      };
    case "BOOST_EXPIRED":
      return {
        icon: SparklesIcon,
        bg: "#f3e8ff",
        color: "#9333ea",
      };
    case "TIKTOK_PROMOTION_PUBLISHED":
    case "TIKTOK_PROMOTION_REJECTED":
    case "TIKTOK_PROMOTION_EXPIRED":
      return {
        icon: VideoIcon,
        bg: "#fae8ff",
        color: "#c026d3",
      };
    default:
      return {
        icon: BellIcon,
        bg: "#fdf5ee",
        color: "#8b4e2e",
      };
  }
};

/* ─── Relative Time Helper ─────────────────────────────────────────────────── */
const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const NotificationsDropdown = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const { data: notifications = [], isLoading } = useNotifications(0, 30);
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();
  const clearMutation = useClearNotification();

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllMutation.mutate();
  };

  const handleItemClick = (notification: any) => {
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
    if (onClose) onClose();

    const targetUrl = notification.actionUrl || "/home";
    if (targetUrl.startsWith("http")) {
      window.open(targetUrl, "_blank");
    } else {
      router.push(targetUrl);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    clearMutation.mutate(id);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="nd-root" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="nd-header">
          <div className="nd-header-left">
            <BellIcon size={16} style={{ color: "#e8c97a" }} />
            <span className="nd-header-title">Notifications</span>
            {unreadCount > 0 && (
              <span className="nd-unread-badge">{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button className="nd-mark-all-btn" onClick={handleMarkAllAsRead}>
              <CheckIcon size={11} style={{ display: "inline", marginRight: 3, verticalAlign: "middle" }} />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="nd-list">
          {isLoading && notifications.length === 0 ? (
            <div className="nd-empty">
              <Loader2Icon size={24} className="animate-spin" style={{ color: "#8b4e2e", marginBottom: 8 }} />
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="nd-empty">
              <div className="nd-empty-icon">
                <BellIcon size={22} />
              </div>
              <p>No notifications yet</p>
              <span>We will notify you when someone interacts with you.</span>
            </div>
          ) : (
            notifications.map((notification: any) => {
              const visuals = resolveNotificationVisuals(notification.type);
              const Icon = visuals.icon;

              return (
                <div
                  key={notification.id}
                  className={`nd-item${!notification.read ? " unread" : ""}`}
                  onClick={() => handleItemClick(notification)}
                >
                  {/* Visual Icon */}
                  <div
                    className="nd-icon-wrap"
                    style={{ background: visuals.bg, color: visuals.color }}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div className="nd-content">
                    {notification.title && (
                      <div className="nd-title">{notification.title}</div>
                    )}
                    <p className="nd-message">{notification.message}</p>
                    <span className="nd-time">{formatRelativeTime(notification.createdAt)}</span>
                  </div>

                  {/* Actions & Unread Indicator */}
                  <div className="nd-actions">
                    {!notification.read && <div className="nd-dot" />}
                    <button
                      className="nd-del-btn"
                      onClick={(e) => handleDelete(e, notification.id)}
                      title="Dismiss notification"
                    >
                      <Trash2Icon size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </>
  );
};

export default NotificationsDropdown;