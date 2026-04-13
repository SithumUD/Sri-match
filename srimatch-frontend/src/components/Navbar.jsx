// Navbar.jsx - Updated with ConnectionRequests and Notifications
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConnectionRequests from "./ConnectionRequests";
import NotificationsDropdown from "./NotificationsDropdown";
import {
  Bell, MessageCircle, User, Menu, X, Heart,
  Search, Users, Crown, Settings, LogOut, ChevronDown,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .nb-root * { box-sizing: border-box; }

  .nb-root {
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    box-shadow: 0 4px 24px rgba(30,8,2,0.18);
    position: sticky; top: 0; z-index: 100;
  }

  .nb-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 64px;
  }

  /* ── Logo ── */
  .nb-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600; letter-spacing: 0.03em;
    text-decoration: none; display: flex; align-items: center; gap: 0;
    transition: opacity 0.2s; flex-shrink: 0;
  }
  .nb-logo:hover { opacity: 0.88; }
  .nb-logo .gold { color: #e8c97a; }
  .nb-logo .white { color: #fff; }
  .nb-logo .heart { color: #f4a0a0; font-size: 1.2rem; }

  /* ── Desktop nav links ── */
  .nb-links {
    display: flex; align-items: center; gap: 0.25rem;
  }
  @media (max-width: 768px) { .nb-links { display: none; } }

  .nb-link {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.45rem 0.85rem; border-radius: 10px;
    font-size: 0.83rem; font-weight: 500; color: rgba(255,255,255,0.75);
    text-decoration: none; transition: all 0.2s;
    position: relative;
  }
  .nb-link:hover { color: #fff; background: rgba(255,255,255,0.1); }
  .nb-link.active { color: #fff; background: rgba(255,255,255,0.15); }
  .nb-link.active::after {
    content: ''; position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
    width: 20px; height: 2px; border-radius: 99px;
    background: linear-gradient(90deg, #e8c97a, #c9856a);
  }

  /* ── Right cluster ── */
  .nb-right {
    display: flex; align-items: center; gap: 0.35rem;
  }

  /* Icon buttons */
  .nb-icon-btn {
    position: relative; width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.8);
    cursor: pointer; transition: all 0.2s; text-decoration: none;
  }
  .nb-icon-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }

  .nb-badge {
    position: absolute; top: -3px; right: -3px;
    background: linear-gradient(135deg, #e07a30, #c93a1a);
    color: #fff; font-size: 0.6rem; font-weight: 700;
    width: 16px; height: 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid #6b3526;
  }

  /* Connection Requests wrapper */
  .nb-connection-wrapper {
    position: relative;
  }
  @media (max-width: 768px) { 
    .nb-connection-wrapper { display: none; }
  }

  /* Notifications wrapper */
  .nb-notifications-wrapper {
    position: relative;
  }
  @media (max-width: 768px) { 
    .nb-notifications-wrapper { display: none; }
  }

  /* ── Avatar / dropdown ── */
  .nb-avatar-wrap { position: relative; }
  .nb-avatar-btn {
    display: flex; align-items: center; gap: 0.4rem;
    background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 22px; padding: 0.28rem 0.55rem 0.28rem 0.28rem;
    cursor: pointer; transition: all 0.2s; color: #fff;
  }
  .nb-avatar-btn:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.35); }
  .nb-avatar-img {
    width: 30px; height: 30px; border-radius: 50%;
    object-fit: cover; border: 1.5px solid rgba(255,255,255,0.4);
    flex-shrink: 0;
  }
  .nb-avatar-placeholder {
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .nb-avatar-name {
    font-size: 0.78rem; font-weight: 500; color: #fff;
    max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  @media (max-width: 900px) { .nb-avatar-name { display: none; } }

  /* Dropdown */
  .nb-dropdown {
    position: absolute; right: 0; top: calc(100% + 0.6rem);
    width: 200px;
    background: #fff; border-radius: 14px;
    box-shadow: 0 16px 48px rgba(30,8,2,0.18), 0 4px 12px rgba(0,0,0,0.08);
    overflow: hidden; z-index: 200;
    animation: nb-fade-in 0.15s ease;
  }
  @keyframes nb-fade-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

  .nb-dropdown-header {
    padding: 0.9rem 1rem 0.65rem;
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border-bottom: 1px solid #f0ddd5;
  }
  .nb-dropdown-name { font-size: 0.85rem; font-weight: 500; color: #2d1810; }
  .nb-dropdown-sub { font-size: 0.71rem; color: #9a7060; margin-top: 1px; }

  .nb-dropdown-item {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.65rem 1rem; font-size: 0.82rem; color: #4a3028;
    text-decoration: none; cursor: pointer; transition: background 0.15s;
    border: none; background: none; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .nb-dropdown-item:hover { background: #fdf5f0; color: #8b4e2e; }
  .nb-dropdown-item.danger { color: #a84a4a; }
  .nb-dropdown-item.danger:hover { background: #fdf0f0; }
  .nb-dropdown-divider { height: 1px; background: #f5ede8; margin: 0.2rem 0; }

  .nb-dropdown-premium {
    margin: 0.5rem 0.75rem 0.75rem;
    padding: 0.6rem 0.85rem; border-radius: 10px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; gap: 0.45rem;
    font-size: 0.75rem; font-weight: 500; color: #fff;
    text-decoration: none; transition: opacity 0.2s;
  }
  .nb-dropdown-premium:hover { opacity: 0.88; }

  /* ── Auth buttons (logged out) ── */
  .nb-auth { display: flex; align-items: center; gap: 0.6rem; }
  .nb-login {
    font-size: 0.83rem; font-weight: 500; color: rgba(255,255,255,0.85);
    text-decoration: none; padding: 0.4rem 0.75rem; border-radius: 8px;
    transition: all 0.2s;
  }
  .nb-login:hover { color: #fff; background: rgba(255,255,255,0.1); }
  .nb-join {
    font-size: 0.83rem; font-weight: 500; color: #3d1f12;
    text-decoration: none; padding: 0.45rem 1.1rem; border-radius: 99px;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    box-shadow: 0 4px 12px rgba(200,160,80,0.3);
    transition: all 0.2s;
  }
  .nb-join:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(200,160,80,0.4); }

  /* Subscription badge */
  .nb-sub-badge {
    display: flex; align-items: center; gap: 0.4rem;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    padding: 0.4rem 0.85rem; border-radius: 99px;
    text-decoration: none; transition: all 0.2s;
    margin-right: 0.25rem;
  }
  .nb-sub-badge:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
  .nb-sub-text {
    font-size: 0.7rem; font-weight: 600; color: #3d1f12;
    letter-spacing: 0.3px;
  }
  @media (max-width: 768px) { 
    .nb-sub-badge { display: none; }
  }

  /* ── Hamburger ── */
  .nb-hamburger {
    display: none; width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,0.12); border: none; color: #fff;
    align-items: center; justify-content: center; cursor: pointer;
    transition: background 0.2s;
  }
  .nb-hamburger:hover { background: rgba(255,255,255,0.22); }
  @media (max-width: 768px) { .nb-hamburger { display: flex; } }

  /* ── Mobile drawer ── */
  .nb-drawer {
    position: fixed; inset: 0; z-index: 90;
  }
  .nb-drawer-overlay {
    position: absolute; inset: 0; background: rgba(20,6,2,0.55);
    backdrop-filter: blur(2px);
  }
  .nb-drawer-panel {
    position: absolute; top: 0; right: 0; bottom: 0; width: 280px;
    background: #fff; display: flex; flex-direction: column;
    box-shadow: -8px 0 32px rgba(30,8,2,0.18);
    animation: nb-slide-in 0.22s ease;
  }
  @keyframes nb-slide-in { from { transform: translateX(100%); } to { transform: none; } }

  .nb-drawer-head {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.25rem 1.25rem 1rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nb-drawer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600; color: #fff;
  }
  .nb-drawer-logo .gold { color: #e8c97a; }
  .nb-drawer-logo .heart { color: #f4a0a0; }

  .nb-drawer-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255,255,255,0.15); border: none;
    color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .nb-drawer-close:hover { background: rgba(255,255,255,0.28); }

  .nb-drawer-user {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 1rem 1.25rem; background: #fdf5ee;
    border-bottom: 1px solid #f0ddd5;
  }
  .nb-drawer-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    object-fit: cover; border: 2px solid #f0ddd5;
  }
  .nb-drawer-avatar-ph {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #f0ddd5; flex-shrink: 0;
  }
  .nb-drawer-uname { font-size: 0.88rem; font-weight: 500; color: #2d1810; }
  .nb-drawer-usub { font-size: 0.72rem; color: #9a7060; margin-top: 1px; }

  .nb-drawer-links { flex: 1; overflow-y: auto; padding: 0.75rem 0; }

  .nb-drawer-link {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.8rem 1.25rem; font-size: 0.86rem; font-weight: 500;
    color: #4a3028; text-decoration: none; transition: all 0.15s;
    border-left: 3px solid transparent;
  }
  .nb-drawer-link:hover { background: #fdf5f0; color: #8b4e2e; border-left-color: #c9856a; }
  .nb-drawer-link.active { background: #fdf5f0; color: #8b4e2e; border-left-color: #8b4e2e; }

  .nb-drawer-divider { height: 1px; background: #f5ede8; margin: 0.4rem 1.25rem; }

  .nb-drawer-footer { padding: 1rem 1.25rem; border-top: 1px solid #f5ede8; }
  .nb-drawer-premium {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 1rem; border-radius: 10px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; font-size: 0.8rem; font-weight: 500;
    text-decoration: none; margin-bottom: 0.75rem; transition: opacity 0.2s;
  }
  .nb-drawer-premium:hover { opacity: 0.88; }
  .nb-drawer-logout {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.6rem 0; font-size: 0.82rem; font-weight: 500;
    color: #a84a4a; background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; width: 100%; transition: color 0.15s;
  }
  .nb-drawer-logout:hover { color: #7a2a2a; }

  /* ── Progress bar ── */
  .nb-progress {
    height: 2px;
    background: linear-gradient(90deg, #e8c97a, #c9856a, #8b4e2e);
    position: absolute; bottom: 0; left: 0; right: 0;
  }
`;

/* ─── Nav links config ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: "/home",        icon: Search,        label: "Browse"      },
  { to: "/messages",    icon: MessageCircle, label: "Messages"    },
  { to: "/connections", icon: Users,         label: "Connections" },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const Navbar = () => {
  const { isAuthenticated, logout, user, subscription = {} } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const isPremium = subscription?.plan === "premium";

  const handleLogout = () => {
    setIsDrawerOpen(false);
    setIsDropdownOpen(false);
    logout();
    navigate("/");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  /* close drawer on route change */
  useEffect(() => { setIsDrawerOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{styles}</style>
      <nav className="nb-root">
        <div className="nb-inner">

          {/* Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="nb-logo">
            <span className="gold">Sri</span>
            <span className="white">Match</span>
            <span className="heart"> ♥</span>
          </Link>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <div className="nb-links">
              {NAV_LINKS.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className={`nb-link${isActive(to) ? " active" : ""}`}>
                  <Icon size={14} />{label}
                </Link>
              ))}
            </div>
          )}

          {/* Right cluster */}
          <div className="nb-right">
            {isAuthenticated ? (
              <>
                {/* Subscription Status */}
                <Link to="/subscription" className="nb-sub-badge">
                  <Crown size={12} style={{ color: "#3d1f12" }} />
                  <span className="nb-sub-text">
                    {isPremium ? 'Premium' : 'Upgrade'}
                  </span>
                </Link>

                {/* Connection Requests */}
                <div className="nb-connection-wrapper">
                  <ConnectionRequests />
                </div>

                {/* Notifications */}
                <div className="nb-notifications-wrapper" ref={notificationsRef}>
                  <button 
                    className="nb-icon-btn" 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    title="Notifications"
                  >
                    <Bell size={17} />
                    <span className="nb-badge">3</span>
                  </button>
                  {isNotificationsOpen && <NotificationsDropdown />}
                </div>

                {/* Avatar / dropdown */}
                <div className="nb-avatar-wrap" ref={dropdownRef}>
                  <button
                    className="nb-avatar-btn"
                    onClick={() => setIsDropdownOpen(v => !v)}
                    aria-expanded={isDropdownOpen}
                  >
                    {user?.profileImage
                      ? <img src={user.profileImage} alt="Profile" className="nb-avatar-img" />
                      : <div className="nb-avatar-placeholder"><User size={15} color="#fff" /></div>}
                    <span className="nb-avatar-name">{user?.firstName || "You"}</span>
                    <ChevronDown size={13} style={{ opacity: 0.7, transform: isDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>

                  {isDropdownOpen && (
                    <div className="nb-dropdown">
                      <div className="nb-dropdown-header">
                        <div className="nb-dropdown-name">{user?.firstName} {user?.lastName}</div>
                        <div className="nb-dropdown-sub">{user?.email || "Manage your account"}</div>
                      </div>

                      {!isPremium && (
                        <Link to="/subscription" className="nb-dropdown-premium" onClick={() => setIsDropdownOpen(false)}>
                          <Crown size={13} style={{ color: "#e8c97a" }} />
                          Upgrade to Premium ✦
                        </Link>
                      )}

                      <Link to="/my-profile" className="nb-dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <User size={14} style={{ color: "#8b4e2e" }} /> My Profile
                      </Link>
                      <Link to="/verification" className="nb-dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <Heart size={14} style={{ color: "#8b4e2e" }} /> Verification
                      </Link>
                      <Link to="/settings" className="nb-dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <Settings size={14} style={{ color: "#8b4e2e" }} /> Settings
                      </Link>

                      <div className="nb-dropdown-divider" />

                      <button className="nb-dropdown-item danger" onClick={handleLogout}>
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>

                {/* Hamburger — mobile */}
                <button className="nb-hamburger" onClick={() => setIsDrawerOpen(true)} aria-label="Open menu">
                  <Menu size={20} />
                </button>
              </>
            ) : (
              <div className="nb-auth">
                <Link to="/login" className="nb-login">Sign In</Link>
                <Link to="/register" className="nb-join">Join Free ✦</Link>
              </div>
            )}
          </div>

        </div>

        {/* Active route underline bar */}
        {isAuthenticated && <div className="nb-progress" style={{ opacity: 0.6 }} />}
      </nav>

      {/* ── Mobile Drawer ── */}
      {isAuthenticated && isDrawerOpen && (
        <div className="nb-drawer">
          <div className="nb-drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
          <div className="nb-drawer-panel">

            <div className="nb-drawer-head">
              <span className="nb-drawer-logo">
                <span className="gold">Sri</span>Match<span className="heart"> ♥</span>
              </span>
              <button className="nb-drawer-close" onClick={() => setIsDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* User info */}
            <div className="nb-drawer-user">
              {user?.profileImage
                ? <img src={user.profileImage} alt="Profile" className="nb-drawer-avatar" />
                : <div className="nb-drawer-avatar-ph"><User size={20} style={{ color: "#9a7060" }} /></div>}
              <div>
                <div className="nb-drawer-uname">{user?.firstName} {user?.lastName}</div>
                <div className="nb-drawer-usub">{isPremium ? "✦ Premium Member" : "Free Account"}</div>
              </div>
            </div>

            {/* Links */}
            <div className="nb-drawer-links">
              {NAV_LINKS.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className={`nb-drawer-link${isActive(to) ? " active" : ""}`}>
                  <Icon size={16} style={{ color: isActive(to) ? "#8b4e2e" : "#c4a99a" }} />
                  {label}
                </Link>
              ))}

              <div className="nb-drawer-divider" />

              <Link to="/my-profile" className={`nb-drawer-link${isActive("/my-profile") ? " active" : ""}`}>
                <User size={16} style={{ color: "#c4a99a" }} /> My Profile
              </Link>
              <Link to="/verification" className={`nb-drawer-link${isActive("/verification") ? " active" : ""}`}>
                <Heart size={16} style={{ color: "#c4a99a" }} /> Verification
              </Link>
              <Link to="/settings" className={`nb-drawer-link${isActive("/settings") ? " active" : ""}`}>
                <Settings size={16} style={{ color: "#c4a99a" }} /> Settings
              </Link>
            </div>

            {/* Footer */}
            <div className="nb-drawer-footer">
              {!isPremium && (
                <Link to="/subscription" className="nb-drawer-premium">
                  <Crown size={14} style={{ color: "#e8c97a" }} />
                  Upgrade to Premium ✦
                </Link>
              )}
              <button className="nb-drawer-logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;