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
  ShieldCheck
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .admin-layout * { box-sizing: border-box; }

  .admin-layout {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    height: 100vh;
    background: #f8fafc;
    overflow: hidden;
  }

  /* Sidebar */
  .admin-sidebar {
    width: 260px;
    background: #1e293b;
    color: #f8fafc;
    display: flex;
    flex-direction: column;
    transition: all 0.3s;
    z-index: 20;
  }

  .admin-brand {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .admin-nav {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .admin-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: #cbd5e1;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.2s;
  }

  .admin-nav-item:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
  }

  .admin-nav-item.active {
    background: #3b82f6;
    color: #fff;
  }

  /* Sidebar footer */
  .admin-sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin-top: auto;
  }

  .admin-logout {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: #fca5a5;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
  }
  .admin-logout:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  /* Main content area */
  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; 
  }

  /* Top Navbar */
  .admin-topbar {
    height: 70px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    flex-shrink: 0;
  }

  .admin-topbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .admin-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
  }

  .admin-topbar-title {
    font-weight: 600;
    color: #1e293b;
    font-size: 1.1rem;
  }

  .admin-topbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .admin-user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .admin-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  /* Content area */
  .admin-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .admin-sidebar {
      position: absolute;
      left: -260px;
      height: 100%;
    }
    .admin-sidebar.open {
      left: 0;
    }
    .admin-menu-toggle {
      display: block;
    }
  }
`;

const AdminLayout = () => {
  const { adminUser, adminLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "User Management", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
    { name: "Payment Management", path: "/admin/payments", icon: <CreditCard size={20} /> },
    { name: "User Reports", path: "/admin/reports", icon: <FileText size={20} /> },
    { name: "Contact & Support", path: "/admin/support", icon: <LifeBuoy size={20} /> }
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <Link to="/admin" className="admin-brand">
            <ShieldCheck size={24} color="#3b82f6" />
            <span>SriMatch Admin</span>
          </Link>
          
          <nav className="admin-nav">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button className="admin-logout" onClick={handleLogout}>
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar-left">
              <button 
                className="admin-menu-toggle" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={24} />
              </button>
              <h1 className="admin-topbar-title">Admin Portal</h1>
            </div>
            <div className="admin-topbar-right">
              <div style={{ marginRight: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} &nbsp; | &nbsp; 
                {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="admin-user-profile">
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {adminUser?.email || "admin@srimatch.com"}
                </span>
                <div className="admin-avatar">
                  {adminUser?.email ? adminUser.email.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            </div>
          </header>

          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
