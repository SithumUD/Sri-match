import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  FileText,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  HeartHandshake,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .al-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .al-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    height: 100vh;
    background: #fdf5ee;
    overflow: hidden;
  }

  /* ── SIDEBAR ── */
  .al-sidebar {
    width: 256px;
    background: #2d1810;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: transform 0.3s ease;
    z-index: 30;
  }

  /* ── BRAND ── */
  .al-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.4rem 1.3rem;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .al-brand-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .al-brand-text {}
  .al-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
    letter-spacing: 0.01em;
  }
  .al-brand-sub {
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #c9856a;
  }

  /* ── NAV ── */
  .al-nav {
    flex: 1;
    overflow-y: auto;
    padding: 1.2rem 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .al-nav::-webkit-scrollbar { width: 0; }

  .al-nav-label {
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(201,133,106,0.55);
    padding: 0.9rem 0.75rem 0.4rem;
  }

  .al-nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.85rem;
    border-radius: 10px;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    font-size: 0.83rem;
    font-weight: 500;
    transition: all 0.18s;
    position: relative;
  }
  .al-nav-link:hover {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.85);
  }
  .al-nav-link.active {
    background: linear-gradient(135deg, rgba(232,201,122,0.18), rgba(201,133,106,0.12));
    color: #e8c97a;
    border: 1px solid rgba(232,201,122,0.2);
  }
  .al-nav-link.active .al-nav-icon { color: #e8c97a; }
  .al-nav-icon { color: rgba(255,255,255,0.35); flex-shrink: 0; transition: color 0.18s; }
  .al-nav-link:hover .al-nav-icon { color: rgba(255,255,255,0.7); }

  /* ── SIDEBAR FOOTER ── */
  .al-sidebar-footer {
    padding: 1rem 0.9rem;
    border-top: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .al-admin-info {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.6rem 0.85rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 0.5rem;
  }
  .al-admin-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 600;
    color: #e8c97a;
    flex-shrink: 0;
    font-family: 'Cormorant Garamond', serif;
  }
  .al-admin-email {
    font-size: 0.73rem;
    color: rgba(255,255,255,0.5);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .al-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.55rem 0.85rem;
    border-radius: 10px;
    background: transparent;
    border: none;
    color: rgba(252,165,165,0.65);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    text-align: left;
  }
  .al-logout-btn:hover {
    background: rgba(239,68,68,0.1);
    color: #fca5a5;
  }

  /* ── MAIN AREA ── */
  .al-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  /* ── TOPBAR ── */
  .al-topbar {
    height: 64px;
    background: #fff;
    border-bottom: 1px solid #f0ddd5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.75rem;
    flex-shrink: 0;
    gap: 1rem;
  }
  .al-topbar-left { display: flex; align-items: center; gap: 0.85rem; }

  .al-menu-toggle {
    display: none;
    background: none;
    border: 1px solid #f0ddd5;
    border-radius: 8px;
    padding: 0.4rem;
    cursor: pointer;
    color: #9a7060;
    transition: all 0.18s;
  }
  .al-menu-toggle:hover { background: #fdf5ee; border-color: #e8c9b8; color: #4a3028; }

  .al-topbar-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .al-breadcrumb-root {
    font-size: 0.75rem;
    color: #c4a898;
    font-weight: 500;
    letter-spacing: 0.04em;
  }
  .al-breadcrumb-sep { color: #e8c9b8; font-size: 0.75rem; }
  .al-breadcrumb-current {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2d1810;
  }

  .al-topbar-right { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }

  .al-clock {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.4rem 0.9rem;
    border-radius: 99px;
    border: 1px solid #f0ddd5;
    background: #fdf8f4;
  }
  .al-clock-date { font-size: 0.73rem; color: #9a7060; }
  .al-clock-divider { width: 1px; height: 12px; background: #f0ddd5; }
  .al-clock-time { font-size: 0.73rem; font-weight: 500; color: #6b4a3a; font-variant-numeric: tabular-nums; }

  .al-topbar-profile {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.35rem 0.75rem 0.35rem 0.35rem;
    border-radius: 99px;
    border: 1px solid #f0ddd5;
    background: #fff;
    cursor: default;
  }
  .al-topbar-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    font-weight: 600;
    color: #e8c97a;
    font-family: 'Cormorant Garamond', serif;
    flex-shrink: 0;
  }
  .al-topbar-email { font-size: 0.75rem; color: #6b4a3a; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* ── PAGE CONTENT ── */
  .al-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    background: #fdf5ee;
  }
  .al-content::-webkit-scrollbar { width: 5px; }
  .al-content::-webkit-scrollbar-track { background: transparent; }
  .al-content::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 99px; }

  /* ── MOBILE OVERLAY ── */
  .al-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(30,8,2,0.5);
    z-index: 25;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .al-sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      transform: translateX(-100%);
    }
    .al-sidebar.open { transform: translateX(0); }
    .al-overlay.open { display: block; }
    .al-menu-toggle { display: flex; }
    .al-clock { display: none; }
    .al-content { padding: 1.25rem; }
  }
`;

/* ─── Nav items ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { name: "Dashboard",          path: "/admin",           icon: <LayoutDashboard size={16} /> },
  { name: "User Management",    path: "/admin/users",     icon: <Users size={16} /> },
  { name: "Payment Management", path: "/admin/payments",  icon: <CreditCard size={16} /> },
  { name: "Moderation Queue",   path: "/admin/reports",   icon: <FileText size={16} /> },
  { name: "Support Centre",     path: "/admin/support",   icon: <LifeBuoy size={16} /> },
  { name: "Platform Settings",  path: "/admin/settings",  icon: <Settings size={16} /> },
  { name: "Packages",           path: "/admin/packages",  icon: <Settings size={16} /> },
  { name: "Locations",          path: "/admin/locations", icon: <Settings size={16} /> },
  { name: "Audits",             path: "/admin/audits",    icon: <Settings size={16} /> },
  { name: "User Verification",   path: "/admin/user-verify", icon: <Settings size={16} /> },
];

/* ─── Page title map ──────────────────────────────────────────────────────── */
const PAGE_TITLES = {
  "/admin":           "Dashboard",
  "/admin/users":     "User Management",
  "/admin/payments":  "Payment Management",
  "/admin/reports":   "Moderation Queue",
  "/admin/support":   "Support Centre",
  "/admin/settings":  "Platform Settings",
  "/admin/packages":  "Packages",
  "/admin/locations": "Locations",
  "/admin/audits":    "Audits",
  "/admin/user-verify": "User Verification",
};

/* ─── Component ───────────────────────────────────────────────────────────── */
const AdminLayout = () => {
  const { adminUser, adminLogout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const email      = adminUser?.email || "admin@srimatch.lk";
  const initials   = email.charAt(0).toUpperCase();
  const pageTitle  = PAGE_TITLES[location.pathname] ?? "Admin Panel";

  const dateStr = currentTime.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
  const timeStr = currentTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <>
      <style>{styles}</style>
      <div className="al-root">

        {/* ── MOBILE OVERLAY ── */}
        <div
          className={`al-overlay${sidebarOpen ? " open" : ""}`}
          onClick={closeSidebar}
        />

        {/* ── SIDEBAR ── */}
        <aside className={`al-sidebar${sidebarOpen ? " open" : ""}`}>

          {/* Brand */}
          <Link to="/admin" className="al-brand" onClick={closeSidebar}>
            <div className="al-brand-icon">
              <HeartHandshake size={18} color="#3d1f12" />
            </div>
            <div className="al-brand-text">
              <div className="al-brand-name">SriMatch</div>
              <div className="al-brand-sub">Admin Portal</div>
            </div>
          </Link>

          {/* Nav */}
          <nav className="al-nav">
            <div className="al-nav-label">Navigation</div>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`al-nav-link${isActive ? " active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="al-nav-icon">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="al-sidebar-footer">
            <div className="al-admin-info">
              <div className="al-admin-avatar">{initials}</div>
              <span className="al-admin-email">{email}</span>
            </div>
            <button className="al-logout-btn" onClick={handleLogout}>
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

        </aside>

        {/* ── MAIN ── */}
        <main className="al-main">

          {/* Topbar */}
          <header className="al-topbar">
            <div className="al-topbar-left">
              <button
                className="al-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="al-topbar-breadcrumb">
                <span className="al-breadcrumb-root">SriMatch</span>
                <span className="al-breadcrumb-sep">›</span>
                <span className="al-breadcrumb-current">{pageTitle}</span>
              </div>
            </div>

            <div className="al-topbar-right">
              <div className="al-clock">
                <span className="al-clock-date">{dateStr}</span>
                <div className="al-clock-divider" />
                <span className="al-clock-time">{timeStr}</span>
              </div>
              <div className="al-topbar-profile">
                <div className="al-topbar-avatar">{initials}</div>
                <span className="al-topbar-email">{email}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="al-content">
            <Outlet />
          </div>

        </main>
      </div>
    </>
  );
};

export default AdminLayout;