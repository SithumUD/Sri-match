"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings, Bell, Shield, Eye, CreditCard, HelpCircle,
  MessageCircleIcon, CheckCircle, ChevronDown, ChevronUp,
  UserIcon, Lock, Smartphone, Globe, Download, LogOut,
  AlertTriangle, Crown, Mail, Check, Info,
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

  .set-grid {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 1.25rem;
    align-items: start;
  }
  @media (max-width: 700px) {
    .set-grid { grid-template-columns: 1fr; }
  }

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

  .set-main {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.07), 0 2px 6px rgba(0,0,0,0.03);
    overflow: hidden;
  }

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
  .set-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .set-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  @media (max-width: 500px) { .set-input-row { grid-template-columns: 1fr; } }

  select.set-input {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239a7060' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2rem;
  }

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
  .set-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(139,78,46,0.3); }
  .set-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .set-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: none; border: 1.5px solid #e8ddd8; color: #6b4a3a;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; text-decoration: none;
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

  .set-subsection-title {
    font-size: 0.72rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #8b4e2e; margin-bottom: 0.65rem; margin-top: 0.25rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .set-divider { height: 1px; background: #f0ddd5; margin: 1.1rem 0; }

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

  .set-faq-item {
    padding: 0.85rem 1rem;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border-radius: 10px;
    border-left: 3px solid #c9856a;
  }
  .set-faq-q { font-size: 0.84rem; font-weight: 500; color: #2d1810; margin-bottom: 4px; }
  .set-faq-a { font-size: 0.76rem; color: #6b4a3a; line-height: 1.55; }

  .set-action-group { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; }

  .set-danger-area {
    border-top: 1px solid #f0ddd5; padding-top: 0.85rem; margin-top: 0.1rem;
  }
  .set-danger-title { font-size: 0.84rem; font-weight: 500; color: #a84a4a; margin-bottom: 4px; }
  .set-danger-sub { font-size: 0.76rem; color: #9a7060; margin-bottom: 0.5rem; }

  .set-ornament {
    text-align: center; font-size: 0.72rem; color: #d4b8a8;
    letter-spacing: 0.15em;
    padding: 0.75rem 0 0.25rem;
    border-top: 1px solid #f5ede8; margin-top: 0.5rem;
  }

  .set-save-msg { font-size: 0.78rem; margin-left: 8px; }
  .set-save-msg.ok { color: #5aaa7a; }
  .set-save-msg.err { color: #c0392b; }

  @media (max-width: 700px) {
    .set-root { padding: 1rem 0.75rem 6rem; }
    .set-grid { grid-template-columns: 1fr; gap: 1rem; }
    .set-sidebar {
      position: static;
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      padding: 0.4rem;
      border-radius: 14px;
      gap: 0.35rem;
    }
    .set-sidebar::-webkit-scrollbar { display: none; }
    .set-nav-btn {
      width: auto;
      white-space: nowrap;
      border-left: none;
      border-radius: 10px;
      padding: 0.5rem 0.85rem;
      font-size: 0.76rem;
    }
    .set-nav-btn.active {
      border-left: none;
      background: linear-gradient(135deg, #3d1f12, #8b4e2e);
      color: #fff;
    }
    .set-card-head { padding: 1rem 1.25rem; }
    .set-body { padding: 1.25rem 1rem; }
  }
`;

/* ─── Toggle component ─────────────────────────────────────────────────── */
const Toggle = ({ value = false, onChange }: { value?: boolean; onChange?: (v: boolean) => void }) => (
  <label className="set-toggle">
    <input type="checkbox" checked={value} onChange={e => onChange?.(e.target.checked)} />
    <span className="set-toggle-slider" />
  </label>
);

/* ─── Accordion section ─────────────────────────────────────────────────── */
const AccordionSection = ({ title, icon, children, defaultOpen = false }: any) => {
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
  const { logout, user, profile, subscription = {}, token, setUser, setProfile } = useAuth() as any;
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("account");
  const isPremium = user?.premium || subscription?.plan === "premium";

  // ── Account state ──
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName]   = useState(user?.lastName  ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMsg, setAccountMsg] = useState("");

  // ── Password state ──
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew]         = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwMsg, setPwMsg]         = useState("");

  // ── Privacy state ──
  const initPrivacy = (p: any) => ({
    profileVisibility:      p?.profileVisibility      ?? "EVERYONE",
    showInSearchResults:    p?.showInSearchResults    ?? true,
    showOnlineStatus:       p?.showOnlineStatus       ?? true,
    showExactLocation:      p?.showExactLocation      ?? true,
    incognitoMode:          p?.incognitoMode          ?? false,
    photoVisibility:        p?.photoVisibility        ?? "PUBLIC",
    showIncomeRange:        p?.showIncomeRange        ?? false,
    showFamilyDetails:      p?.showFamilyDetails      ?? true,
    showPartnerPreferences: p?.showPartnerPreferences ?? true,
    showQuizAnswers:        p?.showQuizAnswers        ?? true,
    visibleToVerifiedOnly:  p?.visibleToVerifiedOnly  ?? false,
    whoCanMessage:          p?.whoCanMessage          ?? "EVERYONE",
    readReceiptsEnabled:    p?.readReceiptsEnabled    ?? true,
    showHoroscope:          p?.showHoroscope          ?? true,
  });
  const [privacy, setPrivacy]           = useState<Record<string, any>>(() => initPrivacy(profile?.privacySettings));
  const [privacySaving, setPrivacySaving] = useState(false);
  const [privacyMsg, setPrivacyMsg]       = useState("");

  // ── Notifications state ──
  const initNotif = (n: any) => ({
    emailNewMessages:  n?.emailNewMessages  ?? true,
    emailNewMatches:   n?.emailNewMatches   ?? true,
    emailProfileViews: n?.emailProfileViews ?? false,
    emailConnections:  n?.emailConnections  ?? true,
    emailPromotions:   n?.emailPromotions   ?? false,
    pushNewMessages:   n?.pushNewMessages   ?? true,
    pushNewMatches:    n?.pushNewMatches    ?? true,
    pushProfileViews:  n?.pushProfileViews  ?? true,
    pushConnections:   n?.pushConnections   ?? true,
    pushPromotions:    n?.pushPromotions    ?? false,
  });
  const [notif, setNotif]           = useState<Record<string, any>>(() => initNotif(user?.notificationPreferences));
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifMsg, setNotifMsg]       = useState("");

  // Keep state in sync if user/profile changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName   ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setNotif(initNotif(user.notificationPreferences));
    }
  }, [user?.id]);

  useEffect(() => {
    if (profile?.privacySettings) setPrivacy(initPrivacy(profile.privacySettings));
  }, [profile?.id]);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api$/, "");
  const authHeader = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  // ── Handlers ──
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleRequestPhoneOtp = async () => {
    if (!phoneNumber) { setOtpMsg("Please enter a phone number"); return; }
    setOtpSending(true); setOtpMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/users/me/request-phone-otp`, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ phoneNumber }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpMsg("✓ Verification code sent via SMS (Notify.lk)");
      } else {
        setOtpMsg(data.message || "Failed to send OTP");
      }
    } catch {
      setOtpMsg("Network error sending OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) { setOtpMsg("Please enter the 6-digit OTP code"); return; }
    setOtpVerifying(true); setOtpMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/users/me/verify-phone`, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ otp: phoneOtp }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOtpMsg("✓ Phone number verified successfully!");
        setOtpSent(false);
        setPhoneOtp("");
        setUser?.(data.data);
      } else {
        setOtpMsg(data.message || "Invalid or expired OTP");
      }
    } catch {
      setOtpMsg("Network error verifying OTP");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your SriMatch account? All your photos, messages, and matches will be permanently removed.");
    if (!confirmed) return;
    setDeletingAccount(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/users/me`, {
        method: "DELETE", headers: authHeader,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        logout();
        router.push("/login");
      } else {
        alert(data.message || "Failed to delete account");
      }
    } catch {
      alert("Network error deleting account");
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleSaveAccount = async () => {
    setAccountSaving(true); setAccountMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/users/me`, {
        method: "PUT", headers: authHeader,
        body: JSON.stringify({ firstName, lastName, phoneNumber }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) { setAccountMsg("✓ Saved successfully"); setUser?.(data.data); }
      else setAccountMsg(data.message ?? "Error saving");
    } catch { setAccountMsg("Network error"); }
    finally { setAccountSaving(false); }
  };

  const handleSavePassword = async () => {
    if (pwNew !== pwConfirm) { setPwMsg("Passwords don't match"); return; }
    setPwSaving(true); setPwMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/auth/change-password`, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
        credentials: "include",
      });
      const data = await res.json();
      setPwMsg(data.success ? "✓ Password updated" : (data.message ?? "Error"));
      if (data.success) { setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
    } catch { setPwMsg("Network error"); }
    finally { setPwSaving(false); }
  };

  const handleSavePrivacy = async () => {
    setPrivacySaving(true); setPrivacyMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/profile/privacy`, {
        method: "PATCH", headers: authHeader,
        body: JSON.stringify(privacy),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPrivacyMsg("✓ Privacy settings saved");
        setProfile?.({ ...profile, privacySettings: data.data?.privacySettings ?? privacy });
      } else setPrivacyMsg(data.message ?? "Error saving");
    } catch { setPrivacyMsg("Network error"); }
    finally { setPrivacySaving(false); }
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true); setNotifMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/users/me/notifications`, {
        method: "PATCH", headers: authHeader,
        body: JSON.stringify(notif),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifMsg("✓ Notification preferences saved");
        setUser?.({ ...user, notificationPreferences: data.data?.notificationPreferences ?? notif });
      } else setNotifMsg(data.message ?? "Error saving");
    } catch { setNotifMsg("Network error"); }
    finally { setNotifSaving(false); }
  };

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

                    <AccordionSection title="Personal Information" icon={<UserIcon size={14} />} defaultOpen>
                      <div className="set-input-row">
                        <div>
                          <label className="set-label">Email Address</label>
                          <input className="set-input" type="email" value={user?.email ?? ""} readOnly />
                        </div>
                        <div>
                          <label className="set-label">
                            Phone Number
                            {user?.phoneVerified ? (
                              <span style={{ marginLeft: 6, fontSize: "0.7rem", color: "#5aaa7a" }}>✓ Verified (SMS via Notify.lk)</span>
                            ) : (
                              <span style={{ marginLeft: 6, fontSize: "0.7rem", color: "#c9856a" }}>Not Verified</span>
                            )}
                          </label>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input
                              className="set-input"
                              type="tel"
                              placeholder="07XXXXXXXX or 947XXXXXXXX"
                              value={phoneNumber}
                              onChange={e => setPhoneNumber(e.target.value)}
                            />
                            {!user?.phoneVerified && (
                              <button
                                type="button"
                                className="set-btn-ghost"
                                style={{ fontSize: "0.72rem", padding: "0.4rem 0.75rem", whiteSpace: "nowrap" }}
                                onClick={handleRequestPhoneOtp}
                                disabled={otpSending || !phoneNumber}
                              >
                                {otpSending ? "Sending..." : (otpSent ? "Resend OTP" : "Verify SMS")}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Phone OTP Verification Box */}
                      {otpSent && !user?.phoneVerified && (
                        <div style={{ background: "#fdf5ee", border: "1px solid #f0ddd5", borderRadius: 10, padding: "0.85rem 1rem", marginTop: "0.5rem", marginBottom: "0.75rem" }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8b4e2e", marginBottom: "0.35rem" }}>
                            Enter SMS Verification Code
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "#6b4a3a", marginBottom: "0.5rem" }}>
                            A 6-digit code was dispatched to <strong>{phoneNumber}</strong> via Notify.lk SMS Gateway.
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              className="set-input"
                              type="text"
                              maxLength={6}
                              placeholder="6-digit code"
                              style={{ width: "140px", letterSpacing: "2px", fontWeight: 600, textAlign: "center" }}
                              value={phoneOtp}
                              onChange={e => setPhoneOtp(e.target.value)}
                            />
                            <button
                              type="button"
                              className="set-btn-primary"
                              style={{ fontSize: "0.75rem", padding: "0.45rem 0.9rem" }}
                              onClick={handleVerifyPhoneOtp}
                              disabled={otpVerifying || !phoneOtp}
                            >
                              {otpVerifying ? "Verifying..." : "Confirm OTP"}
                            </button>
                          </div>
                        </div>
                      )}
                      {otpMsg && (
                        <div style={{ fontSize: "0.76rem", color: otpMsg.startsWith("✓") ? "#5aaa7a" : "#c0392b", margin: "4px 0 8px" }}>
                          {otpMsg}
                        </div>
                      )}

                      <div className="set-input-row">
                        <div>
                          <label className="set-label">First Name</label>
                          <input className="set-input" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                        </div>
                        <div>
                          <label className="set-label">Last Name</label>
                          <input className="set-input" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                        </div>
                      </div>
                      <div className="set-action-group">
                        <button className="set-btn-primary" onClick={handleSaveAccount} disabled={accountSaving}>
                          {accountSaving ? "Saving..." : "Update Information"}
                        </button>
                        {accountMsg && <span className={`set-save-msg ${accountMsg.startsWith("✓") ? "ok" : "err"}`}>{accountMsg}</span>}
                      </div>
                    </AccordionSection>

                    <AccordionSection title="Change Password" icon={<Lock size={14} />} defaultOpen>
                      <div>
                        <label className="set-label">Current Password</label>
                        <input className="set-input" type="password" placeholder="Current password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} />
                      </div>
                      <div>
                        <label className="set-label">New Password</label>
                        <input className="set-input" type="password" placeholder="New password" value={pwNew} onChange={e => setPwNew(e.target.value)} />
                      </div>
                      <div>
                        <label className="set-label">Confirm New Password</label>
                        <input className="set-input" type="password" placeholder="Confirm new password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} />
                      </div>
                      <div className="set-action-group">
                        <button className="set-btn-primary" onClick={handleSavePassword} disabled={pwSaving}>
                          {pwSaving ? "Updating..." : "Update Password"}
                        </button>
                        {pwMsg && <span className={`set-save-msg ${pwMsg.startsWith("✓") ? "ok" : "err"}`}>{pwMsg}</span>}
                      </div>
                    </AccordionSection>

                    <AccordionSection title="Account Actions" icon={<AlertTriangle size={14} />}>
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
                        <button className="set-btn-danger" onClick={handleDeleteAccount} disabled={deletingAccount}>
                          <AlertTriangle size={13} /> {deletingAccount ? "Deleting Account..." : "Delete My Account"}
                        </button>
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
                      <select
                        className="set-input"
                        style={{ width: "auto", fontSize: "0.78rem" }}
                        value={privacy.profileVisibility}
                        onChange={e => setPrivacy(p => ({ ...p, profileVisibility: e.target.value }))}
                      >
                        <option value="EVERYONE">Everyone</option>
                        <option value="CONNECTIONS_ONLY">Only members I liked</option>
                        <option value="MATCHES_ONLY">Only matches</option>
                      </select>
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show in search results</p>
                        <span>Allow your profile to appear in discovery feeds</span>
                      </div>
                      <Toggle value={!!privacy.showInSearchResults} onChange={v => setPrivacy(p => ({ ...p, showInSearchResults: v }))} />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show online status</p>
                        <span>Let others know when you're active on the platform</span>
                      </div>
                      <Toggle value={!!privacy.showOnlineStatus} onChange={v => setPrivacy(p => ({ ...p, showOnlineStatus: v }))} />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show approximate location</p>
                        <span>Display city/area on your profile (exact coordinates are never shared)</span>
                      </div>
                      <Toggle value={!!privacy.showExactLocation} onChange={v => setPrivacy(p => ({ ...p, showExactLocation: v }))} />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>
                          Incognito browsing
                          {!isPremium && <Crown size={11} style={{ display: "inline", color: "#c9856a", marginLeft: 5, verticalAlign: "middle" }} />}
                        </p>
                        <span>Browse profiles without appearing in their visitors list{!isPremium ? " — Premium feature" : ""}</span>
                      </div>
                      {isPremium
                        ? <Toggle value={!!privacy.incognitoMode} onChange={v => setPrivacy(p => ({ ...p, incognitoMode: v }))} />
                        : <Link href="/subscription" className="set-btn-ghost" style={{ fontSize: "0.72rem", padding: "0.3rem 0.7rem" }}><Crown size={11} /> Upgrade</Link>
                      }
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><MessageCircleIcon size={11} />Communication Privacy</div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Who can message me</p>
                        <span>Control who can send you direct messages</span>
                      </div>
                      <select
                        className="set-input"
                        style={{ width: "auto", fontSize: "0.78rem" }}
                        value={privacy.whoCanMessage}
                        onChange={e => setPrivacy(p => ({ ...p, whoCanMessage: e.target.value }))}
                      >
                        <option value="EVERYONE">Everyone</option>
                        <option value="CONNECTIONS_ONLY">Only members I liked</option>
                        <option value="MATCHES_ONLY">Only matches</option>
                      </select>
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Read receipts</p>
                        <span>Let others know when you've read their messages</span>
                      </div>
                      <Toggle value={!!privacy.readReceiptsEnabled} onChange={v => setPrivacy(p => ({ ...p, readReceiptsEnabled: v }))} />
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><UserIcon size={11} />Personal Information</div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show income range</p>
                        <span>Display your income range to other members</span>
                      </div>
                      <Toggle value={!!privacy.showIncomeRange} onChange={v => setPrivacy(p => ({ ...p, showIncomeRange: v }))} />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show family details</p>
                        <span>Display family background information on your profile</span>
                      </div>
                      <Toggle value={!!privacy.showFamilyDetails} onChange={v => setPrivacy(p => ({ ...p, showFamilyDetails: v }))} />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show horoscope details</p>
                        <span>Make your detailed horoscope information visible to matches</span>
                      </div>
                      <Toggle value={!!privacy.showHoroscope} onChange={v => setPrivacy(p => ({ ...p, showHoroscope: v }))} />
                    </div>

                    <div className="set-toggle-row">
                      <div className="set-toggle-info">
                        <p>Show partner preferences</p>
                        <span>Allow others to see what you're looking for in a partner</span>
                      </div>
                      <Toggle value={!!privacy.showPartnerPreferences} onChange={v => setPrivacy(p => ({ ...p, showPartnerPreferences: v }))} />
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Shield size={11} />Blocking</div>
                    <p style={{ fontSize: "0.78rem", color: "#9a7060", marginBottom: "0.6rem" }}>Manage users you've blocked from contacting you</p>
                    <button className="set-btn-ghost">Manage Blocked Users</button>

                    <div style={{ marginTop: "1.25rem" }}>
                      <button className="set-btn-primary" onClick={handleSavePrivacy} disabled={privacySaving}>
                        {privacySaving ? "Saving..." : "Save Privacy Settings"}
                      </button>
                      {privacyMsg && <span className={`set-save-msg ${privacyMsg.startsWith("✓") ? "ok" : "err"}`}>{privacyMsg}</span>}
                    </div>

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

                    {([
                      ["emailNewMessages",  "New messages",        "When you receive a new message"],
                      ["emailNewMatches",   "New matches",         "When you have a new match"],
                      ["emailProfileViews", "Profile views",       "When someone views your profile"],
                      ["emailConnections",  "Connection requests", "When someone sends you a request"],
                      ["emailPromotions",   "Promotions & tips",   "Special offers and Sri Lankan matrimony tips"],
                    ] as const).map(([key, label, sub]) => (
                      <div key={key} className="set-toggle-row">
                        <div className="set-toggle-info"><p>{label}</p><span>{sub}</span></div>
                        <Toggle value={!!notif[key]} onChange={v => setNotif(n => ({ ...n, [key]: v }))} />
                      </div>
                    ))}

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Bell size={11} />Push Notifications</div>

                    {([
                      ["pushNewMessages",  "New messages",        "When you receive a new message"],
                      ["pushNewMatches",   "New matches",         "When you have a new match"],
                      ["pushProfileViews", "Profile views",       "When someone views your profile"],
                      ["pushConnections",  "Connection requests", "When someone sends you a request"],
                      ["pushPromotions",   "Promotions & tips",   "Special offers and Sri Lankan matrimony tips"],
                    ] as const).map(([key, label, sub]) => (
                      <div key={key + "-push"} className="set-toggle-row">
                        <div className="set-toggle-info"><p>{label}</p><span>{sub}</span></div>
                        <Toggle value={!!notif[key]} onChange={v => setNotif(n => ({ ...n, [key]: v }))} />
                      </div>
                    ))}

                    <div style={{ marginTop: "1.1rem" }}>
                      <button className="set-btn-primary" onClick={handleSaveNotifications} disabled={notifSaving}>
                        {notifSaving ? "Saving..." : "Save Notification Settings"}
                      </button>
                      {notifMsg && <span className={`set-save-msg ${notifMsg.startsWith("✓") ? "ok" : "err"}`}>{notifMsg}</span>}
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

                    <div className="set-toggle-row" style={{ marginBottom: "0.75rem" }}>
                      <div className="set-toggle-info">
                        <p>Two-Factor Authentication (MFA)</p>
                        <span>Protect your account with an extra verification step</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: (user?.totpEnabled || user?.mfaEnabled) ? "#5aaa7a" : "#9a7060" }}>
                        {(user?.totpEnabled || user?.mfaEnabled) ? "ENABLED" : "DISABLED"}
                      </div>
                    </div>

                    <div className="set-info-box" style={{ marginBottom: "0.75rem" }}>
                      <Shield size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>We use industry-standard TOTP (Time-based One-Time Password) for MFA. You'll need an authenticator app like Google Authenticator or Microsoft Authenticator.</span>
                    </div>

                    <div style={{ marginBottom: "1.25rem" }}>
                      <button className="set-btn-primary" onClick={() => router.push("/security/mfa-setup")}>
                        {(user?.totpEnabled || user?.mfaEnabled) ? "Manage MFA Settings" : "Enable MFA Protection"}
                      </button>
                    </div>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Lock size={11} />Session Security</div>
                    <div className="set-info-box" style={{ marginBottom: "0.75rem", background: "#f0fdf4", borderColor: "#d0f4dc", color: "#2e7d32" }}>
                      <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>Your session is protected by HttpOnly &amp; Secure cookies, mitigating risks from XSS (Cross-Site Scripting) attacks.</span>
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
                          <div className="set-session-name">This Device · Current Browser</div>
                          <div className="set-session-sub">Current session</div>
                        </div>
                      </div>
                      <span className="set-session-active"><CheckCircle size={12} /> Active now</span>
                    </div>

                    <button style={{ background: "none", border: "none", color: "#a84a4a", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: "0.25rem", padding: 0 }}>
                      Log Out From All Devices
                    </button>

                    <div className="set-divider" />
                    <div className="set-subsection-title"><Info size={11} />Login History</div>

                    {[
                      ["Successful login", "This Device · Current Browser", "Today"],
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
                    <div className="set-card-head-title">Billing &amp; Subscription</div>
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
                        {isPremium && (user?.premiumExpiryDate || subscription?.expiresAt) && (
                          <div style={{ fontSize: "0.72rem", color: "#8b4e2e", marginTop: 4 }}>
                            Expires: {new Date(user?.premiumExpiryDate ?? subscription.expiresAt).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
                          </div>
                        )}
                      </div>
                      {!isPremium && (
                        <Link href="/subscription" className="set-btn-primary" style={{ textDecoration: "none" }}>
                          <Crown size={13} /> Upgrade to Premium ✦
                        </Link>
                      )}
                    </div>

                    {!isPremium && (
                      <div className="set-info-box">
                        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>Premium members find matches 3× faster. Unlock unlimited likes, voice &amp; video calls, advanced filters, and detailed horoscope compatibility — starting from just $20/month.</span>
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
                    <div className="set-card-head-title">Help &amp; Support</div>
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