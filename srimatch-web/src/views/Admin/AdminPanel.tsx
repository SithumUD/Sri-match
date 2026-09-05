"use client";

import React, { useState, useEffect } from "react";
import {
  UsersIcon, CrownIcon, TrendingUpIcon, HeartIcon,
  TicketIcon, ClockIcon, FlagIcon, ActivityIcon,
  ChevronUpIcon, ChevronDownIcon, ArrowRightIcon,
  ServerIcon, DatabaseIcon, ZapIcon, MailIcon,
  CloudIcon, BellIcon, StarIcon, ShieldCheckIcon,
  DownloadIcon, MegaphoneIcon, SettingsIcon, RefreshCwIcon,
  Loader2Icon, TrendingDownIcon,
} from "lucide-react";
import AdminService from "../../services/admin.service";
import Link from 'next/link';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .ap-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ap-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .ap-page-header { margin-bottom: 2rem; }
  .ap-page-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.35rem;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .ap-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #2d1810; line-height: 1.15;
    margin-bottom: 0.3rem;
  }
  .ap-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .ap-page-sub { font-size: 0.85rem; color: #9a7060; }

  /* ── KPI GRID ── */
  .ap-kpi-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;
  }
  @media (max-width: 1100px) { .ap-kpi-grid { grid-template-columns: repeat(2, 1fr); } }

  .ap-kpi-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 16px; padding: 1.25rem;
    transition: all 0.2s;
  }
  .ap-kpi-card:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(139,78,46,0.09); border-color: #e8c9b8; }

  .ap-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.85rem; }
  .ap-kpi-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  .ap-kpi-badge {
    display: flex; align-items: center; gap: 0.2rem;
    font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 99px;
  }
  .ap-kpi-badge.up { background: #f0fdf4; color: #16a34a; }
  .ap-kpi-badge.down { background: #fef2f2; color: #dc2626; }
  .ap-kpi-badge.warn { background: #fffbeb; color: #d97706; }

  .ap-kpi-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1;
    margin-bottom: 0.2rem;
  }
  .ap-kpi-label { font-size: 0.76rem; color: #9a7060; }

  /* ── CHARTS ROW ── */
  .ap-charts-row {
    display: grid; grid-template-columns: 1fr 260px 300px; gap: 1.25rem; margin-bottom: 1.5rem;
  }
  @media (max-width: 1100px) { .ap-charts-row { grid-template-columns: 1fr; } }

  .ap-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 16px; overflow: hidden;
  }
  .ap-card-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.1rem 1.4rem; border-bottom: 1px solid #f5ede5;
  }
  .ap-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #2d1810;
  }
  .ap-card-sub { font-size: 0.73rem; color: #9a7060; margin-top: 1px; }
  .ap-card-body { padding: 1.2rem 1.4rem; }

  /* Revenue Bar Chart */
  .ap-bar-chart {
    display: flex; align-items: flex-end; gap: 8px; height: 130px;
  }
  .ap-bar-col {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px;
  }
  .ap-bar-val { font-size: 0.65rem; font-weight: 500; color: #9a7060; }
  .ap-bar {
    width: 100%; border-radius: 5px 5px 0 0;
    background: #f5ede5;
    transition: all 0.3s;
  }
  .ap-bar.current {
    background: linear-gradient(to top, #3d1f12, #c9856a);
  }
  .ap-bar-month { font-size: 0.65rem; color: #c4a898; }

  /* Donut */
  .ap-donut-wrap { display: flex; justify-content: center; padding: 1rem 0 0.5rem; }
  .ap-donut-legend { display: flex; flex-direction: column; gap: 0.65rem; padding: 0 1.4rem 1.2rem; }
  .ap-donut-legend-item {
    display: flex; justify-content: space-between; align-items: center;
  }
  .ap-donut-dot-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.79rem; color: #6b4a3a; }
  .ap-donut-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .ap-donut-val { font-size: 0.82rem; font-weight: 600; color: #2d1810; }
  .ap-donut-pct { font-size: 0.71rem; color: #9a7060; margin-left: 0.3rem; }

  /* Activity Feed */
  .ap-feed { display: flex; flex-direction: column; gap: 0.85rem; padding: 1rem 1.4rem; max-height: 300px; overflow-y: auto; }
  .ap-feed-item { display: flex; gap: 0.75rem; align-items: flex-start; }
  .ap-feed-icon {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border: 1px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
  }
  .ap-feed-msg { font-size: 0.79rem; color: #4a3028; line-height: 1.45; margin-bottom: 2px; }
  .ap-feed-time { font-size: 0.69rem; color: #c4a898; }

  /* ── TABLES ROW ── */
  .ap-tables-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;
  }
  @media (max-width: 900px) { .ap-tables-row { grid-template-columns: 1fr; } }

  .ap-table { width: 100%; border-collapse: collapse; }
  .ap-table th {
    padding: 0.6rem 1rem; font-size: 0.67rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.07em; color: #9a7060;
    background: #fdf8f4; text-align: left; border-bottom: 1px solid #f5ede5;
  }
  .ap-table td {
    padding: 0.75rem 1rem; font-size: 0.8rem; color: #4a3028;
    border-bottom: 1px solid #fdf5ee;
    vertical-align: middle;
  }
  .ap-table tr:last-child td { border-bottom: none; }
  .ap-table tr:hover td { background: #fdf8f4; }

  .ap-avatar {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #c9856a);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 600; color: #e8c97a;
  }

  .ap-view-all {
    display: inline-flex; align-items: center; gap: 0.25rem;
    font-size: 0.75rem; font-weight: 500; color: #8b4e2e;
    cursor: pointer; transition: color 0.2s; background: none; border: none;
    font-family: 'DM Sans', sans-serif; text-decoration: none;
  }
  .ap-view-all:hover { color: #3d1f12; }

  /* ── STATUS BADGES ── */
  .ap-status {
    display: inline-flex; align-items: center;
    padding: 0.18rem 0.6rem; border-radius: 99px;
    font-size: 0.69rem; font-weight: 600; white-space: nowrap;
  }
  .ap-status.green  { background: #f0fdf4; color: #16a34a; }
  .ap-status.yellow { background: #fffbeb; color: #d97706; }
  .ap-status.red    { background: #fef2f2; color: #dc2626; }
  .ap-status.gray   { background: #f8f8f8; color: #6b7280; }
  .ap-status.purple { background: #faf5ff; color: #7c3aed; }
  .ap-status.brown  { background: #fdf5ee; color: #8b4e2e; }

  /* ── BOTTOM ROW ── */
  .ap-bottom-row {
    display: grid; grid-template-columns: 1fr 1fr 280px; gap: 1.25rem;
  }
  @media (max-width: 1100px) { .ap-bottom-row { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 700px)  { .ap-bottom-row { grid-template-columns: 1fr; } }

  /* System Health */
  .ap-health-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.65rem 1.4rem; border-bottom: 1px solid #fdf5ee;
  }
  .ap-health-item:last-child { border-bottom: none; }
  .ap-health-left { display: flex; align-items: center; gap: 0.65rem; }
  .ap-health-icon {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border: 1px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
  }
  .ap-health-name { font-size: 0.79rem; font-weight: 500; color: #4a3028; }
  .ap-health-right { display: flex; align-items: center; gap: 0.6rem; }
  .ap-health-ping { font-size: 0.69rem; color: #c4a898; }

  /* Quick Actions */
  .ap-actions-list { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem 1.4rem; }
  .ap-action-btn {
    display: flex; align-items: center; gap: 0.7rem;
    padding: 0.7rem 0.9rem; border-radius: 10px;
    border: 1px solid #f0ddd5; background: #fdf8f4;
    cursor: pointer; text-align: left;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500;
    color: #4a3028; transition: all 0.2s; text-decoration: none;
  }
  .ap-action-btn:hover {
    background: #fff; border-color: #e8c9b8; color: #2d1810;
    transform: translateX(3px);
    box-shadow: 0 4px 12px rgba(139,78,46,0.08);
  }
  .ap-action-btn.active {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border-color: transparent;
  }
  .ap-action-icon {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(139,78,46,0.1); transition: background 0.2s;
  }
  .ap-action-btn.active .ap-action-icon { background: rgba(255,255,255,0.15); }
  .ap-action-btn:hover:not(.active) .ap-action-icon { background: #fdf0e8; }
  .ap-action-hint {
    margin: 0.5rem 1.4rem 1rem;
    font-size: 0.73rem; color: #9a7060; text-align: center;
    padding: 0.6rem; background: #fdf8f4; border-radius: 8px;
    border: 1px solid #f5ede5;
  }

  /* Ornament divider */
  .ap-ornament { color: #e8c9b8; font-size: 0.6rem; letter-spacing: 0.2em; }
  
  .animate-spin { animation: ap-spin 1.2s linear infinite; }
  @keyframes ap-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const statusClass = (s) => {
  if (!s) return "brown";
  const map = {
    Active: "green", APPROVED: "green", Operational: "green", RESOLVED: "gray",
    UP: "green",
    Pending: "yellow", PENDING: "yellow", Degraded: "yellow",
    Locked: "red", REJECTED: "red", Down: "red", DOWN: "red",
    ADMIN: "purple", SUPER_ADMIN: "dark",
  };
  return map[s.toUpperCase()] || "brown";
};

const getIcon = (name) => {
  const icons = {
    'users': <UsersIcon size={18} />,
    'crown': <CrownIcon size={18} />,
    'trending-up': <TrendingUpIcon size={18} />,
    'heart': <HeartIcon size={18} />,
    'ticket': <TicketIcon size={18} />,
    'clock': <ClockIcon size={18} />,
    'flag': <FlagIcon size={18} />,
    'activity': <ActivityIcon size={18} />,
    'server': <ServerIcon size={13} />,
    'database': <DatabaseIcon size={13} />,
    'zap': <ZapIcon size={13} />,
    'mail': <MailIcon size={13} />,
    'cloud': <CloudIcon size={13} />,
    'bell': <BellIcon size={13} />,
    'shield': <ShieldCheckIcon size={13} />,
    'settings': <SettingsIcon size={13} />,
  };
  return icons[name.toLowerCase()] || <ZapIcon size={18} />;
};

/* ─── Component ───────────────────────────────────────────────────────────── */
const AdminPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getDashboardData();
      setData(res || null);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#9a7060' }}>
        <Loader2Icon size={40} className="animate-spin" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Analyzing platform metrics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ap-root">
        <div className="ap-page-header">
          <h1 className="ap-page-title">Connection <span>Error</span></h1>
          <p className="ap-page-sub">Failed to load dashboard data. Please check your network.</p>
          <button className="ap-view-all" onClick={fetchDashboard} style={{ marginTop: '1rem' }}>
            <RefreshCwIcon size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const MAX_REV = data.revenueTrend?.length > 0 ? Math.max(...data.revenueTrend.map(d => d.value)) : 1;

  return (
    <>
      <style>{styles}</style>
      <div className="ap-root">

        {/* ── PAGE HEADER ── */}
        <div className="ap-page-header">
          <div className="ap-page-eyebrow">
            <span className="ap-ornament">✦</span> Admin Dashboard
          </div>
          <h1 className="ap-page-title">
            Platform <span>Overview</span>
          </h1>
          <p className="ap-page-sub">Welcome back, Admin. Here's what's happening on SriMatch today.</p>
        </div>

        {/* ── KPI GRID ── */}
        <div className="ap-kpi-grid">
          {data.kpis?.map((k, i) => (
            <div key={i} className="ap-kpi-card">
              <div className="ap-kpi-top">
                <div className="ap-kpi-icon" style={{ background: k.bg }}>
                  <span style={{ color: k.color }}>{getIcon(k.icon)}</span>
                </div>
                <span className={`ap-kpi-badge ${k.up ? "up" : k.change.startsWith("+") ? "warn" : "down"}`}>
                  {k.up ? <ChevronUpIcon size={10} /> : <ChevronDownIcon size={10} />}
                  {k.change}
                </span>
              </div>
              <div className="ap-kpi-value">{k.value}</div>
              <div className="ap-kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="ap-charts-row">

          {/* Revenue Bar Chart */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div>
                <div className="ap-card-title">Revenue Trend</div>
                <div className="ap-card-sub">Monthly growth in financial metrics</div>
              </div>
              <span className="ap-status green">Live Status</span>
            </div>
            <div className="ap-card-body">
              <div className="ap-bar-chart">
                {data.revenueTrend?.map((d, i) => (
                  <div key={i} className="ap-bar-col">
                    <span className="ap-bar-val">{d.value > 1000 ? `${(d.value/1000).toFixed(1)}K` : d.value}</span>
                    <div
                      className={`ap-bar${i === data.revenueTrend.length - 1 ? " current" : ""}`}
                      style={{ height: `${(d.value / MAX_REV) * 130}px` }}
                    />
                    <span className="ap-bar-month">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Distribution Donut */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div className="ap-card-title">Member Split</div>
            </div>
            <div className="ap-donut-wrap">
              <div style={{ position: "relative", width: 110, height: 110 }}>
                <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f5ede5" strokeWidth="3.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#c9856a" strokeWidth="3.8"
                    strokeDasharray={`${data.userDistribution?.freePercent} ${100 - data.userDistribution?.freePercent}`} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3d1f12" strokeWidth="3.8"
                    strokeDasharray={`${data.userDistribution?.premiumPercent} ${100 - data.userDistribution?.premiumPercent}`}
                    strokeDashoffset={`-${data.userDistribution?.freePercent}`} strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "#2d1810" }}>
                    {data.userDistribution?.total > 1000 ? `${(data.userDistribution.total / 1000).toFixed(1)}K` : data.userDistribution?.total}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "#9a7060" }}>Total</span>
                </div>
              </div>
            </div>
            <div className="ap-donut-legend">
              <div className="ap-donut-legend-item">
                <div className="ap-donut-dot-label">
                  <div className="ap-donut-dot" style={{ background: "#c9856a" }} />
                  Free Members
                </div>
                <div>
                  <span className="ap-donut-val">{data.userDistribution?.freeCount.toLocaleString()}</span>
                  <span className="ap-donut-pct">({data.userDistribution?.freePercent}%)</span>
                </div>
              </div>
              <div className="ap-donut-legend-item">
                <div className="ap-donut-dot-label">
                  <div className="ap-donut-dot" style={{ background: "#3d1f12" }} />
                  Premium Members
                </div>
                <div>
                  <span className="ap-donut-val">{data.userDistribution?.premiumCount.toLocaleString()}</span>
                  <span className="ap-donut-pct">({data.userDistribution?.premiumPercent}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div className="ap-card-title">Live Activity</div>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px rgba(22,163,74,0.5)", display: "inline-block" }} />
            </div>
            <div className="ap-feed">
              {data.activityFeed?.map((f, i) => (
                <div key={i} className="ap-feed-item">
                  <div className="ap-feed-icon">{getIcon(f.icon)}</div>
                  <div>
                    <div className="ap-feed-msg">{f.msg}</div>
                    <div className="ap-feed-time">{f.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABLES ROW ── */}
        <div className="ap-tables-row">

          {/* Recent Members */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div>
                <div className="ap-card-title">Recent Registrations</div>
                <div className="ap-card-sub">Newest members on the platform</div>
              </div>
              <Link href="/admin/users" className="ap-view-all">View All <ArrowRightIcon size={12} /></Link>
            </div>
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentRegistrations?.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div className="ap-avatar">{u.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: "0.82rem", color: "#2d1810", marginBottom: 1 }}>{u.name}</div>
                          <div style={{ fontSize: "0.69rem", color: "#c4a898" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "#9a7060", fontSize: "0.75rem" }}>{u.joined}</td>
                    <td>
                      <span className={`ap-status ${statusClass(u.role)}`}>{u.role}</span>
                      {u.premium && <CrownIcon size={11} style={{ color: "#7c3aed", marginLeft: 4, verticalAlign: "middle" }} />}
                    </td>
                    <td><span className={`ap-status ${statusClass(u.status)}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Payments */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div>
                <div className="ap-card-title">Recent Payments</div>
                <div className="ap-card-sub">Latest payment activity</div>
              </div>
              <Link href="/admin/payments" className="ap-view-all">View All <ArrowRightIcon size={12} /></Link>
            </div>
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments?.map((p) => (
                  <tr key={p.ref}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: "0.8rem", color: "#2d1810" }}>{p.ref}</div>
                      <div style={{ fontSize: "0.68rem", color: "#c4a898" }}>{p.method} · {p.date}</div>
                    </td>
                    <td style={{ fontSize: "0.77rem", color: "#6b4a3a" }}>{p.email}</td>
                    <td style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 600, color: "#2d1810" }}>{p.amount}</td>
                    <td><span className={`ap-status ${statusClass(p.status)}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="ap-bottom-row">

          {/* Reports */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div>
                <div className="ap-card-title">Recent Reports</div>
                <div className="ap-card-sub">User-submitted content flags</div>
              </div>
              <span className="ap-status red">{data.recentReports?.length || 0} Open</span>
            </div>
            {data.recentReports?.map((r, i) => (
              <div key={r.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "0.8rem 1.4rem",
                borderBottom: i < data.recentReports.length - 1 ? "1px solid #fdf5ee" : "none"
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.82rem", color: "#2d1810", marginBottom: 2 }}>{r.reason}</div>
                  <div style={{ fontSize: "0.69rem", color: "#c4a898" }}>{r.reported} · {r.date}</div>
                </div>
                <span className={`ap-status ${statusClass(r.status)}`}>{r.status}</span>
              </div>
            ))}
          </div>

          {/* System Health */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div className="ap-card-title">System Health</div>
              <button className="ap-view-all" onClick={fetchDashboard}><RefreshCwIcon size={12} /> Refresh</button>
            </div>
            {data.systemHealth?.map((s, i) => (
              <div key={i} className="ap-health-item">
                <div className="ap-health-left">
                  <div className="ap-health-icon">{getIcon(s.icon)}</div>
                  <span className="ap-health-name">{s.name}</span>
                </div>
                <div className="ap-health-right">
                  {s.ping !== "—" && <span className="ap-health-ping">{s.ping}</span>}
                  <span className={`ap-status ${statusClass(s.status)}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="ap-card">
            <div className="ap-card-header">
              <div className="ap-card-title">Quick Actions</div>
            </div>
            <div className="ap-actions-list">
              <Link href="/admin/payments" className="ap-action-btn">
                <div className="ap-action-icon"><span style={{ color: "#d97706" }}><ClockIcon size={14} /></span></div>
                Review Payments
              </Link>
              <Link href="/admin/reports" className="ap-action-btn">
                <div className="ap-action-icon"><span style={{ color: "#ef4444" }}><FlagIcon size={14} /></span></div>
                Moderate Reports
              </Link>
              <Link href="/admin/support" className="ap-action-btn">
                <div className="ap-action-icon"><span style={{ color: "#f97316" }}><TicketIcon size={14} /></span></div>
                Support Tickets
              </Link>
              <Link href="/admin/settings" className="ap-action-btn">
                <div className="ap-action-icon"><span style={{ color: "#7c3aed" }}><SettingsIcon size={14} /></span></div>
                Platform Settings
              </Link>
            </div>
            <div className="ap-action-hint">
              Use the sidebar to navigate to other management sections.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;