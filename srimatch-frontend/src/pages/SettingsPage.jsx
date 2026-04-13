import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Settings, Bell, Shield, Eye, CreditCard, HelpCircle,
  MessageCircleIcon, CheckCircle, ChevronDown, ChevronUp,
  UserIcon, Lock, Smartphone, Globe, Download, LogOut,
  AlertTriangle, Crown, Mail, Check, Info, Star,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .set-root * { box-sizing: border-box; }

  .set-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2rem 1.5rem 5rem;
  }

  .set-inner { max-width: 960px; margin: 0 auto; }

  /* ── Page header ── */
  .set-page-header { margin-bottom: 1.75rem; }
  .set-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #2d1810; line-height: 1.1;
  }
  .set-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .set-page-sub { font-size: 0.83rem; color: #9a7060; margin-top: 0.2rem; }

  /* ── Grid layout ── */
  .set-grid {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 1.25rem;
    align-items: start;
  }
  @media (max-width: 700px) {
    .set-grid { grid-template-columns: 1fr; }
  }

  /* ── Sidebar ── */
  .set-sidebar {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.07), 0 2px 6px rgba(0,0,0,0.03);
    overflow: hidden;
    position: sticky;
    top: 80px;
  }

  .set-nav-btn {
    width: 100%; text-align: left;
    padding: 0.75rem 1.1rem;
    display: flex; align-items: center; gap: 0.55rem;
    font-size: 0.82rem; font-weight: 500;
    color: #6b4a3a; background: none; border: none;
    border-left: 3px solid transparent;
    cursor: pointer; transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .set-nav-btn:hover { background: #fdf5f0; color: #8b4e2e; }
  .set-nav-btn.active {
    background: linear-gradient(135deg, #fdf0e8, #faf0f8);
    color: #8b4e2e;
    border-left-color: #8b4e2e;
  }
  .set-nav-btn svg { flex-shrink: 0; }

  /* ── Main content card ── */
  .set-main {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.07), 0 2px 6px rgba(0,0,0,0.03);
    overflow: hidden;
  }

  /* Card gradient header */
  .set-card-head {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.25rem 1.75rem;
  }
  .set-card-head-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #fff;
  }
  .set-card-head-sub { font-size: 0.75rem; color: rgba(255,255,255,0.65); margin-top: 2px; }

  .set-body { padding: 1.5rem 1.75rem; }

  /* ── Accordion sections ── */
  .set-section {
    border: 1px solid #f0ddd5;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 0.85rem;
  }
  .set-section-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.9rem 1.1rem;
    cursor: pointer; background: #fdf8f5;
    transition: background 0.15s;
  }
  .set-section-header:hover { background: #fdf0e8; }
  .set-section-header-left {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; font-weight: 500; color: #2d1810;
  }
  .set-section-header-left svg { color: #8b4e2e; }
  .set-section-body {
    padding: 1.1rem 1.1rem;
    border-top: 1px solid #f0ddd5;
    display: flex; flex-direction: column; gap: 0.75rem;
  }

  /* ── Form elements ── */
  .set-label {
    display: block;
    font-size: 0.71rem; font-weight: 500;
    color: #6b4a3a;
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 0.3rem;
  }
  .set-input {
    width: 100%; padding: 0.6rem 0.9rem;
    border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.84rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .set-input:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .set-input::placeholder { color: #c4b0a5; }
  .set-input:read-only { opacity: 0.7; cursor: default; }

  .set-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  @media (max-width: 500px) { .set-input-row { grid-template-columns: 1fr; } }

  select.set-input {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239a7060' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2rem;
  }

  /* ── Buttons ── */
  .set-btn-primary {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(139,78,46,0.22);
    transition: all 0.2s;
  }
  .set-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(139,78,46,0.3); }

  .set-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: none; border: 1.5px solid #e8ddd8; color: #6b4a3a;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .set-btn-ghost:hover { border-color: #c9856a; color: #8b4e2e; }

  .set-btn-danger {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: none; border: 1.5px solid #f0c0c0; color: #a84a4a;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .set-btn-danger:hover { background: #fdf0f0; border-color: #a84a4a; }

  /* ── Toggle switch ── */
  .set-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.6rem 0;
    border-bottom: 1px solid #faf3ef;
  }
  .set-toggle-row:last-child { border-bottom: none; }
  .set-toggle-info p { font-size: 0.84rem; color: #2d1810; margin: 0 0 2px; }
  .set-toggle-info span { font-size: 0.72rem; color: #9a7060; }

  .set-toggle { position: relative; display: inline-flex; width: 44px; height: 24px; cursor: pointer; flex-shrink: 0; }
  .set-toggle input { opacity: 0; width: 0; height: 0; }
  .set-toggle-slider {
    position: absolute; inset: 0;
    background: #e8ddd8; border-radius: 99px; transition: 0.3s;
  }
  .set-toggle-slider::after {
    content: ''; position: absolute;
    height: 18px; width: 18px; left: 3px; top: 3px;
    background: #fff; border-radius: 50%; transition: 0.3s;
  }
  .set-toggle input:checked + .set-toggle-slider { background: linear-gradient(135deg, #8b4e2e, #c9856a); }
  .set-toggle input:checked + .set-toggle-slider::after { transform: translateX(20px); }

  /* ── Section heading inside body ── */
  .set-subsection-title {
    font-size: 0.72rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #8b4e2e; margin-bottom: 0.65rem; margin-top: 0.25rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .set-divider { height: 1px; background: #f0ddd5; margin: 1.1rem 0; }

  /* ── Warning & info boxes ── */
  .set-warning-box {
    background: #fffbf0; border: 1px solid #f0e090;
    border-radius: 10px; padding: 0.75rem 1rem;
    font-size: 0.77rem; color: #7a6010;
    display: flex; gap: 0.5rem; align-items: flex-start;
    line-height: 1.55;
  }
  .set-info-box {
    background: #f0f4fd; border: 1px solid #d0dcf4;
    border-radius: 10px; padding: 0.75rem 1rem;
    font-size: 0.77rem; color: #3a5ea8;
    display: flex; gap: 0.5rem; align-items: flex-start;
    line-height: 1.55;
  }

  /* ── Sessions ── */
  .set-session-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 0.9rem;
    border: 1px solid #f0ddd5; border-radius: 10px;
    margin-bottom: 0.5rem;
  }
  .set-session-left { display: flex; align-items: center; gap: 0.65rem; }
  .set-session-name { font-size: 0.83rem; font-weight: 500; color: #2d1810; }
  .set-session-sub { font-size: 0.71rem; color: #9a7060; }
  .set-session-active { font-size: 0.72rem; color: #5aaa7a; display: flex; align-items: center; gap: 3px; }

  /* ── Plan card ── */
  .set-plan-card {
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border: 1px solid #f0ddd5; border-radius: 12px;
    padding: 1rem 1.1rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .set-plan-name { font-size: 0.9rem; font-weight: 500; color: #2d1810; }
  .set-plan-badge {
    font-size: 0.69rem; font-weight: 600;
    padding: 0.2rem 0.65rem; border-radius: 99px;
    background: #e8ddd8; color: #6b4a3a;
    margin-left: 0.4rem;
  }

  /* ── FAQ items ── */
  .set-faq-item {
    padding: 0.85rem 1rem;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border-radius: 10px;
    border-left: 3px solid #c9856a;
  }
  .set-faq-q { font-size: 0.84rem; font-weight: 500; color: #2d1810; margin-bottom: 4px; }
  .set-faq-a { font-size: 0.76rem; color: #6b4a3a; line-height: 1.55; }

  /* Safety tips */
  .set-safety-list { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.79rem; color: #3a5ea8; }
  .set-safety-item { display: flex; align-items: flex-start; gap: 0.4rem; }

  /* ── Action group inside section ── */
  .set-action-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }

  /* Destructive area separator */
  .set-danger-area {
    border-top: 1px solid #f0ddd5; padding-top: 0.85rem; margin-top: 0.1rem;
  }
  .set-danger-title { font-size: 0.84rem; font-weight: 500; color: #a84a4a; margin-bottom: 4px; }
  .set-danger-sub { font-size: 0.76rem; color: #9a7060; margin-bottom: 0.5rem; }

  /* ── Ornament ── */
  .set-ornament {
    text-align: center; font-size: 0.72rem; color: #d4b8a8;
    letter-spacing: 0.15em;
    padding: 0.75rem 0 0.25rem;
    border-top: 1px solid #f5ede8; margin-top: 0.5rem;
  }

  @media (max-width: 640px) {
    .set-root { padding: 1.25rem 1rem 4rem; }
    .set-body { padding: 1.25rem; }
    .set-card-head { padding: 1.25rem; }
  }
`;

/* ─── Toggle component ─────────────────────────────────────────────────── */
const Toggle = ({ defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="set-toggle">
      <input type="checkbox" checked={checked} onChange={() => setChecked(v => !v)} />
      <span className="set-toggle-slider" />
    </label>
  );
};

/* ─── Accordion section ─────────────────────────────────────────────────── */
const AccordionSection = ({ title, icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="set-section">
      <div className="set-section-header" onClick={() => setOpen(v => !v)}>
        <span className="set-section-header-left">
          {icon}
          {title}
        </span>
        {open ? <ChevronUp size={15} style={{ color: "#9a7060" }} /> : <ChevronDown size={15} style={{ color: "#9a7060" }} />}
      </div>
      {open && <div className="set-section-body">{children}</div>}
    </div>
  );
};

/* ─── SettingsPage ────────────────────────────────────────────────────────── */
const SettingsPage = () => {
  const { logout, user, subscription = {} } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const isPremium = subscription?.plan === "premium";

  const NAV = [
    { key: "account",       label: "Account",        icon: Settings },
    { key: "privacy",       label: "Privacy",         icon: Eye },
    { key: "notifications", label: "Notifications",   icon: Bell },
    { key: "security",      label: "Security",        icon: Shield },
    { key: "billing",       label: "Billing",         icon: CreditCard },
    { key: "help",          label: "Help & Support",  icon: HelpCircle },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="set-root">
        <div className="set-inner">

          {/* Page header */}
          <div className="set-page-header">
            <h1 className="set-page-title">Your <span>Settings</span></h1>
            <p className="set-page-sub">Manage your account, privacy, and preferences</p>
          </div>

          <div className="set-grid">

            {/* ── Sidebar ── */}
            <div className="set-sidebar">
              {NAV.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`set-nav-btn${activeSection === key ? " active" : ""}`}
                  onClick={() => setActiveSection(key)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* ── Main content ── */}
            <div className="set-main">

              {/* ════ ACCOUNT ════ */}
              {activeSection === "account" && (
                <>
                  <div className="set-card-head">
                    <div className="set-card-head-title">Account Settings</div>
                    <div className="set-card-head-sub">Manage your personal information and account</div>
                  </div>
                  <div className="set-body">

                    <AccordionSection
                      title="Personal Information"
                      icon={<UserIcon size={14} />}
                      defaultOpen
                    >
                      <div className="set-input-row">
                        <div>
                          <label className="set-label">Email Address</label>
                          <input className="set-input" type="email" defaultValue={user?.email} readOnly />
                        </div>
                        <div>
                          <label className="set-label">Phone Number</label>
                          <input className="set-input" type="tel" placeholder="Add phone number" />
                        </div>
                      </div>
                      <div className="set-input-row">
                        <div>
                          <label className="set-label">First Name</label>
                          <input className="set-input" type="text" defaultValue={user?.firstName} placeholder="First name" />
                        </div>
                        <div>
                          <label className="set-label">Last Name</label>
                          <input className="set-input" type="text" defaultValue={user?.lastName} placeholder="Last name" />
                        </div>
                      </div>
                      <div className="set-input-row">
                        <div>
                          <label className="set-label">Default Language</label>
                          <select className="set-input">
                            <option>English</option>
                            <option>සිංහල (Sinhala)</option>
                            <option>தமிழ் (Tamil)</option>
                          </select>
                        </div>
                        <div>
                          <label className="set-label">Location</label>
                          <select className="set-input">
                            <option>Colombo</option>
                            <option>Kandy</option>
                            <option>Galle</option>
                            <option>Negombo</option>
                            <option>Jaffna</option>
                            <option>Matara</option>
                            <option>Kurunegala</option>
                            <option>Ratnapura</option>
                          </select>
                        </div>
                      </div>
                      <div className="set-action-group">
                        <button className="set-btn-primary">Update Information</button>
                      </div>
                    </AccordionSection>

                    <AccordionSection
                      title="Change Password"
                      icon={<Lock size={14} />}
                      defaultOpen
                    >
                      <div>
                        <label className="set-label">Current Password</label>
                        <input className="set-input" type="password" placeholder="Current password" />
                      </div>
                      <div>
                        <label className="set-label">New Password</label>
                        <input className="set-input" type="password" placeholder="New password" />
                      </div>
                      <div>
                        <label className="set-label">Confirm New Password</label>
                        <input className="set-input" type="password" placeholder="Confirm new password" />
                      </div>
                      <div className="set-action-group">
                        <button className="set-btn-primary">Update Password</button>
                      </div>
                    </AccordionSection>

                    <AccordionSection
                      title="Account Actions"
                      icon={<AlertTriangle size={14} />}
                    >
                      <div>
                        <div className="set-subsection-title"><Download size={11} />Download Your Data</div>
                        <p style={{ fontSize: "0.78rem", color: "#9a7060", margin: "0 0 0.5rem" }}>Request a copy of all your personal data stored with us</p>
                        <button className="set-btn-ghost"><Download size={13} /> Request Download</button>
                      </div>

                      <div className="set-danger-area">
                        <div className="set-danger-title">Log Out</div>
                        <div className="set-danger-sub">Sign out of your account on this device</div>
                        <button className="set-btn-primary" onClick={logout}><LogOut size={13} /> Log Out</button>
                      </div>

                      <div className="set-danger-area">
                        <div className="set-danger-title">Delete Account</div>
                        <div className="set-danger-sub">Permanently delete your account and all associated data. This cannot be undone.</div>
                        <button className="set-btn-danger"><AlertTriangle size={13} /> Delete My Account</button>
                      </div>
                    </AccordionSection>

                    <div className="set-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </div>
                </>
              )}

              {/* ════ PRIVACY ════ */}
              {activeSection === "privacy" && (
                <>
                  <div className="set-card-head">
                    <div className="set-card-head-title">Privacy Settings</div>
                    <div className="set-card-head-sub">Control who can see you and your information</div>
                  </div>
                  <div className="set-body">

                    <div className="set-subsection-title"><Eye size={11} />Profile Visibility</div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Who can see my profile</p>
                        <span>Control who can view your full profile details</span>
                      </div>
                      <select className="set-input" style={{ width: "auto", fontSize: "0.78rem" }}>
                        <option>Everyone</option>
                        <option>Only members I liked</option>
                        <option>Only matches</option>
                      </select>
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show online status</p>
                        <span>Let others know when you're active on the platform</span>
                      </div>
                      <Toggle defaultChecked />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show approximate distance</p>
                        <span>Display distance between you and other users</span>
                      </div>
                      <Toggle defaultChecked />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Incognito browsing</p>
                        <span>Browse profiles without appearing in their visitors list</span>
                      </div>
                      <Toggle />
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><MessageCircleIcon size={11} />Communication Privacy</div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Who can message me</p>
                        <span>Control who can send you direct messages</span>
                      </div>
                      <select className="set-input" style={{ width: "auto", fontSize: "0.78rem" }}>
                        <option>Everyone</option>
                        <option>Only members I liked</option>
                        <option>Only matches</option>
                      </select>
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Read receipts</p>
                        <span>Let others know when you've read their messages</span>
                      </div>
                      <Toggle defaultChecked />
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><UserIcon size={11} />Personal Information</div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show income range</p>
                        <span>Display your income range to other members</span>
                      </div>
                      <Toggle />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show horoscope details</p>
                        <span>Make your detailed horoscope information visible to matches</span>
                      </div>
                      <Toggle defaultChecked />
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Shield size={11} />Blocking</div>
                    <p style={{ fontSize: "0.78rem", color: "#9a7060", marginBottom: "0.6rem" }}>Manage users you've blocked from contacting you</p>
                    <button className="set-btn-ghost">Manage Blocked Users</button>

                    <div className="set-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </div>
                </>
              )}

              {/* ════ NOTIFICATIONS ════ */}
              {activeSection === "notifications" && (
                <>
                  <div className="set-card-head">
                    <div className="set-card-head-title">Notification Settings</div>
                    <div className="set-card-head-sub">Choose what you want to be notified about</div>
                  </div>
                  <div className="set-body">

                    <div className="set-subsection-title"><Mail size={11} />Email Notifications</div>

                    {[
                      ["New messages", "When you receive a new message", true],
                      ["New matches", "When you have a new match", true],
                      ["Profile views", "When someone views your profile", false],
                      ["Connection requests", "When someone sends you a request", true],
                      ["Promotions & tips", "Special offers and Sri Lankan matrimony tips", false],
                    ].map(([label, sub, def]) => (
                      <div key={label} className="set-toggle-row">
                        <div className="set-toggle-info"><p>{label}</p><span>{sub}</span></div>
                        <Toggle defaultChecked={def} />
                      </div>
                    ))}

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Bell size={11} />Push Notifications</div>

                    {[
                      ["New messages", "When you receive a new message", true],
                      ["New matches", "When you have a new match", true],
                      ["Profile views", "When someone views your profile", true],
                      ["Connection requests", "When someone sends you a request", true],
                      ["Promotions & tips", "Special offers and Sri Lankan matrimony tips", false],
                    ].map(([label, sub, def]) => (
                      <div key={label + "-push"} className="set-toggle-row">
                        <div className="set-toggle-info"><p>{label}</p><span>{sub}</span></div>
                        <Toggle defaultChecked={def} />
                      </div>
                    ))}

                    <div style={{ marginTop: "1.1rem" }}>
                      <button className="set-btn-primary">Save Notification Settings</button>
                    </div>
                    <div className="set-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </div>
                </>
              )}

              {/* ════ SECURITY ════ */}
              {activeSection === "security" && (
                <>
                  <div className="set-card-head">
                    <div className="set-card-head-title">Security Settings</div>
                    <div className="set-card-head-sub">Protect your account and manage active sessions</div>
                  </div>
                  <div className="set-body">

                    <div className="set-subsection-title"><Shield size={11} />Two-Factor Authentication</div>

                    <div className="set-toggle-row" style={{ marginBottom: "0.75rem" }}>
                      <div className="set-toggle-info">
                        <p>Enable two-factor authentication</p>
                        <span>Add an extra layer of security to your account</span>
                      </div>
                      <Toggle />
                    </div>

                    <div className="set-warning-box" style={{ marginBottom: "0.75rem" }}>
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1, color: "#c07030" }} />
                      <span>Two-factor authentication requires a code from your phone on each login, in addition to your password.</span>
                    </div>

                    <div style={{ marginBottom: "1.25rem" }}>
                      <button className="set-btn-ghost">Set Up Two-Factor Authentication</button>
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Smartphone size={11} />Active Sessions</div>

                    <p style={{ fontSize: "0.78rem", color: "#9a7060", marginBottom: "0.75rem" }}>
                      These are the devices currently logged into your account
                    </p>

                    <div className="set-session-item">
                      <div className="set-session-left">
                        <Smartphone size={18} style={{ color: "#8b4e2e" }} />
                        <div>
                          <div className="set-session-name">iPhone · Colombo, Sri Lanka</div>
                          <div className="set-session-sub">Current session</div>
                        </div>
                      </div>
                      <span className="set-session-active"><CheckCircle size={12} /> Active now</span>
                    </div>

                    <div className="set-session-item">
                      <div className="set-session-left">
                        <Globe size={18} style={{ color: "#9a7060" }} />
                        <div>
                          <div className="set-session-name">Chrome · Windows · Kandy, Sri Lanka</div>
                          <div className="set-session-sub">Last active: 2 days ago</div>
                        </div>
                      </div>
                      <button className="set-btn-danger" style={{ padding: "0.3rem 0.75rem", fontSize: "0.74rem" }}>Log out</button>
                    </div>

                    <button style={{ background: "none", border: "none", color: "#a84a4a", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: "0.25rem", padding: 0 }}>
                      Log Out From All Devices
                    </button>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Info size={11} />Login History</div>

                    {[
                      ["Successful login", "iPhone · Colombo, Sri Lanka", "Today, 10:23 AM"],
                      ["Successful login", "Chrome · Windows · Kandy, Sri Lanka", "2 days ago, 8:45 PM"],
                    ].map(([status, device, time]) => (
                      <div key={time} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "0.65rem 0.85rem", border: "1px solid #f0ddd5", borderRadius: "10px", marginBottom: "0.5rem" }}>
                        <div>
                          <div style={{ fontSize: "0.83rem", fontWeight: 500, color: "#2d1810" }}>{status}</div>
                          <div style={{ fontSize: "0.73rem", color: "#9a7060" }}>{device}</div>
                          <div style={{ fontSize: "0.69rem", color: "#b09080", marginTop: 2 }}>{time}</div>
                        </div>
                        <CheckCircle size={15} style={{ color: "#5aaa7a", flexShrink: 0, marginTop: 2 }} />
                      </div>
                    ))}

                    <div className="set-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </div>
                </>
              )}

              {/* ════ BILLING ════ */}
              {activeSection === "billing" && (
                <>
                  <div className="set-card-head">
                    <div className="set-card-head-title">Billing & Subscription</div>
                    <div className="set-card-head-sub">Manage your plan and payment details</div>
                  </div>
                  <div className="set-body">

                    <div className="set-subsection-title"><Crown size={11} />Current Plan</div>

                    <div className="set-plan-card">
                      <div>
                        <div className="set-plan-name">
                          {isPremium ? "Premium Plan" : "Free Plan"}
                          <span className="set-plan-badge">Current</span>
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "#9a7060", marginTop: 3 }}>
                          {isPremium
                            ? "Unlimited likes, voice calls, advanced filters, and more"
                            : "Basic features with limited daily likes and matches"}
                        </div>
                        {isPremium && subscription?.expiresAt && (
                          <div style={{ fontSize: "0.72rem", color: "#8b4e2e", marginTop: 4 }}>
                            Expires: {new Date(subscription.expiresAt).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
                          </div>
                        )}
                      </div>
                      {!isPremium && (
                        <Link to="/subscription" className="set-btn-primary" style={{ textDecoration: "none" }}>
                          <Crown size={13} /> Upgrade to Premium ✦
                        </Link>
                      )}
                    </div>

                    {!isPremium && (
                      <div className="set-info-box">
                        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>Premium members find matches 3× faster. Unlock unlimited likes, voice & video calls, advanced filters, and detailed horoscope compatibility — starting from just $20/month.</span>
                      </div>
                    )}

                    <div className="set-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </div>
                </>
              )}

              {/* ════ HELP ════ */}
              {activeSection === "help" && (
                <>
                  <div className="set-card-head">
                    <div className="set-card-head-title">Help & Support</div>
                    <div className="set-card-head-sub">Find answers or reach our support team</div>
                  </div>
                  <div className="set-body">

                    <div className="set-subsection-title"><HelpCircle size={11} />Frequently Asked Questions</div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
                      {[
                        ["How do I edit my profile?", "Go to My Profile and tap the Edit button on any section to update your information."],
                        ["How does horoscope matching work?", "We use traditional Sri Lankan astrological principles to calculate compatibility scores between horoscope charts."],
                        ["How can I get verified?", "Visit the Verification page and submit your NIC or passport for a trusted green badge on your profile."],
                        ["How does matching work?", "Our algorithm considers preferences, interests, location, and compatibility factors — including horoscope — to suggest potential matches."],
                      ].map(([q, a]) => (
                        <div key={q} className="set-faq-item">
                          <div className="set-faq-q">{q}</div>
                          <div className="set-faq-a">{a}</div>
                        </div>
                      ))}
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><MessageCircleIcon size={11} />Contact Support</div>

                    <p style={{ fontSize: "0.78rem", color: "#9a7060", marginBottom: "0.75rem" }}>
                      Our support team is available 7 days a week to help you.
                    </p>
                    <div className="set-action-group" style={{ marginBottom: "1.25rem" }}>
                      <button className="set-btn-ghost"><Mail size={13} /> Email Support</button>
                      <button className="set-btn-ghost"><MessageCircleIcon size={13} /> Live Chat</button>
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Shield size={11} />Safety Tips</div>

                    <div className="set-info-box" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.35rem" }}>
                      {[
                        "Always meet in public places for your first few meetings",
                        "Tell a family member or trusted friend about your plans",
                        "Trust your instincts — if something feels wrong, it probably is",
                        "Never share financial information with someone you haven't met",
                        "Report suspicious behaviour to our support team immediately",
                      ].map(tip => (
                        <div key={tip} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                          <Check size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>

                    <div className="set-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;