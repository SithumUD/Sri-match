"use client";

import React, { useState, useEffect } from "react";
import {
  SearchIcon, CheckIcon, XIcon, EyeIcon,
  ClockIcon, TrendingUpIcon, ChevronDownIcon, Loader2Icon,
  AlertCircleIcon,
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .apm-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .apm-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .apm-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
  .apm-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .apm-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .apm-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .apm-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── STAT CHIPS ── */
  .apm-stat-chips { display: flex; gap: 0.85rem; flex-wrap: wrap; }
  .apm-chip {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 12px; padding: 0.65rem 1.1rem;
    display: flex; flex-direction: column; gap: 1px;
  }
  .apm-chip-label { font-size: 0.68rem; color: #9a7060; }
  .apm-chip-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #2d1810; line-height: 1;
  }
  .apm-chip-val.warn { color: #d97706; }

  /* ── TOOLBAR ── */
  .apm-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.85rem; }
  .apm-tabs { display: flex; gap: 4px; background: #fdf5ee; padding: 4px; border-radius: 10px; border: 1px solid #f0ddd5; }
  .apm-tab {
    padding: 0.4rem 0.9rem; border: none; border-radius: 7px;
    font-size: 0.76rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; color: #9a7060;
    background: transparent; transition: all 0.2s;
  }
  .apm-tab.active {
    background: #fff; color: #2d1810;
    box-shadow: 0 1px 4px rgba(139,78,46,0.12);
    border: 1px solid #f0ddd5;
  }
  .apm-search { position: relative; }
  .apm-search svg { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #c9856a; pointer-events: none; }
  .apm-search-input {
    padding: 0.55rem 1rem 0.55rem 2.4rem;
    border-radius: 99px; border: 1.5px solid #f0ddd5;
    background: #fff; font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif; color: #2d1810;
    width: 250px; outline: none; transition: all 0.2s;
  }
  .apm-search-input::placeholder { color: #c4a898; }
  .apm-search-input:focus { border-color: #c9856a; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  /* ── TABLE CARD ── */
  .apm-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 16px; overflow: hidden;
  }
  .apm-table { width: 100%; border-collapse: collapse; text-align: left; }
  .apm-table th {
    padding: 0.7rem 1.25rem; font-size: 0.66rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.08em; color: #9a7060;
    background: #fdf8f4; border-bottom: 1px solid #f5ede5;
  }
  .apm-table td {
    padding: 0.85rem 1.25rem; font-size: 0.81rem; color: #4a3028;
    border-bottom: 1px solid #fdf5ee; vertical-align: middle;
  }
  .apm-table tbody tr:last-child td { border-bottom: none; }
  .apm-table tbody tr { transition: background 0.15s; }
  .apm-table tbody tr:hover td { background: #fdf8f4; }

  .apm-ref { font-weight: 600; font-size: 0.82rem; color: #2d1810; }
  .apm-ref-date { font-size: 0.68rem; color: #c4a898; margin-top: 1px; }
  .apm-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 600; color: #2d1810;
  }
  .apm-method-pill {
    display: inline-flex; padding: 0.18rem 0.65rem; border-radius: 99px;
    font-size: 0.69rem; font-weight: 500;
    background: #fdf5ee; color: #8b4e2e; border: 1px solid #f0ddd5;
  }

  /* ── STATUS BADGES ── */
  .apm-badge {
    display: inline-flex; align-items: center; gap: 0.25rem;
    padding: 0.18rem 0.65rem; border-radius: 99px;
    font-size: 0.69rem; font-weight: 600; white-space: nowrap;
  }
  .apm-badge.green  { background: #f0fdf4; color: #16a34a; }
  .apm-badge.yellow { background: #fffbeb; color: #d97706; }
  .apm-badge.red    { background: #fef2f2; color: #dc2626; }
  .apm-badge.gray   { background: #f8f8f8; color: #6b7280; }

  /* ── ROW ACTIONS ── */
  .apm-row-actions { display: flex; gap: 0.4rem; justify-content: flex-end; }
  .apm-act-btn {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.32rem 0.7rem; border-radius: 99px;
    font-size: 0.71rem; font-weight: 500;
    border: 1px solid #f0ddd5; background: #fdf8f4;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    color: #6b4a3a; transition: all 0.18s;
  }
  .apm-act-btn:hover { background: #fff; border-color: #e8c9b8; color: #2d1810; }
  .apm-act-btn.approve { color: #16a34a; border-color: #bbf7d0; background: #f0fdf4; }
  .apm-act-btn.approve:hover { background: #dcfce7; border-color: #86efac; }
  .apm-act-btn.reject  { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
  .apm-act-btn.reject:hover  { background: #fee2e2; border-color: #fca5a5; }

  /* ── EMPTY STATE ── */
  .apm-empty { text-align: center; padding: 3rem 1.5rem; color: #9a7060; font-size: 0.83rem; }

  /* ── MODAL ── */
  .apm-overlay {
    position: fixed; inset: 0; background: rgba(30,8,2,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 1.5rem;
  }
  .apm-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 480px;
    overflow: hidden; box-shadow: 0 24px 64px rgba(61,31,18,0.25);
    border: 1px solid #f0ddd5;
  }
  .apm-modal-hdr {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.3rem 1.6rem; border-bottom: 1px solid #f5ede5;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
  }
  .apm-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 600; color: #2d1810;
  }
  .apm-modal-sub { font-size: 0.73rem; color: #9a7060; margin-top: 2px; }
  .apm-modal-close {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid #f0ddd5; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #9a7060; transition: all 0.2s;
    font-size: 0; /* use icon only */
  }
  .apm-modal-close:hover { background: #fdf0e8; color: #4a3028; border-color: #e8c9b8; }
  .apm-modal-body { padding: 1.4rem 1.6rem; display: flex; flex-direction: column; gap: 1rem; }

  .apm-detail-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;
    background: #fdf8f4; padding: 1rem; border-radius: 12px;
    border: 1px dashed #f0ddd5;
  }
  .apm-detail-label {
    font-size: 0.65rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.08em; color: #c4a898;
    margin-bottom: 0.2rem;
  }
  .apm-detail-value { font-size: 0.85rem; font-weight: 500; color: #2d1810; }
  .apm-detail-value.amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600;
  }

  .apm-slip-box {
    height: 110px; background: #fdf5ee; border-radius: 10px;
    border: 1.5px dashed #e8c9b8;
    display: flex; align-items: center; justify-content: center;
    color: #c4a898; font-size: 0.78rem;
  }

  .apm-form-group { display: flex; flex-direction: column; gap: 0.3rem; }
  .apm-form-label { font-size: 0.75rem; font-weight: 500; color: #6b4a3a; }
  .apm-form-textarea {
    width: 100%; padding: 0.65rem 0.9rem;
    border: 1.5px solid #f0ddd5; border-radius: 10px;
    font-size: 0.82rem; font-family: 'DM Sans', sans-serif;
    color: #2d1810; background: #fdf8f4; outline: none; resize: none;
    transition: all 0.2s;
  }
  .apm-form-textarea:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .apm-form-textarea:disabled { opacity: 0.65; cursor: not-allowed; }

  .apm-modal-footer {
    display: flex; justify-content: flex-end; gap: 0.65rem;
    padding: 1rem 1.6rem; border-top: 1px solid #f5ede5;
    background: #fdf8f4;
  }

  /* ── BUTTONS ── */
  .apm-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1rem; border-radius: 99px;
    font-size: 0.8rem; font-weight: 500;
    background: transparent; color: #9a7060;
    border: 1px solid #f0ddd5; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .apm-btn-ghost:hover { background: #fdf5ee; color: #4a3028; border-color: #e8c9b8; }

  .apm-btn-primary {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(200,160,80,0.3);
    transition: all 0.2s;
  }
  .apm-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,160,80,0.42); }

  .apm-btn-danger {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: #fef2f2; color: #b91c1c;
    border: 1px solid #fecaca; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .apm-btn-danger:hover { background: #fee2e2; border-color: #fca5a5; }

  .apm-ornament { color: #e8c9b8; font-size: 0.6rem; letter-spacing: 0.2em; }
`;

const badgeClass = (s) =>
  s === "APPROVED" || s === "COMPLETED" ? "green" : s === "REJECTED" || s === "FAILED" ? "red" : "yellow";

const statusLabel = (s) => {
  if (s === "COMPLETED") return "APPROVED";
  if (s === "FAILED") return "REJECTED";
  return s;
};

/* ─── Component ───────────────────────────────────────────────────────────── */
const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab,   setTab]   = useState("PENDING");
  const [search, setSearch] = useState("");
  const [modal,  setModal]  = useState(null);
  const [notes,  setNotes]  = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAdminPayments();
      setPayments(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter((p) => {
    const status = statusLabel(p.paymentStatus);
    const matchTab    = tab === "ALL" || status === tab;
    const matchSearch = (p.userEmail + (p.transactionId || "")).toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const pending  = payments.filter((p) => p.paymentStatus === "PENDING").length;
  const approved = payments.filter((p) => p.paymentStatus === "COMPLETED").length;
  const revenue  = payments
    .filter((p) => p.paymentStatus === "COMPLETED")
    .reduce((s, p) => s + p.amount, 0);

  const openModal = (p) => { 
    setModal({ ...p }); 
    setNotes(p.rejectionReason || ""); 
  };
  const closeModal = () => { setModal(null); setNotes(""); };

  const doReview = async (approve) => {
    try {
      const reviewData = {
        approved: approve,
        rejectionReason: approve ? null : notes,
        transactionId: approve ? `TXN-${Date.now()}` : null // Simplified transaction ID if not provided
      };
      await AdminService.reviewPayment(modal.id, reviewData);
      fetchPayments();
      closeModal();
    } catch (err) {
      alert(err.message || "Failed to review payment");
    }
  };

  const quickUpdate = async (id, approve) => {
    try {
      const reviewData = {
        approved: approve,
        rejectionReason: approve ? null : "Quick rejected by admin",
        transactionId: approve ? `TXN-${Date.now()}` : null
      };
      await AdminService.reviewPayment(id, reviewData);
      fetchPayments();
    } catch (err) {
      alert(err.message || "Failed to update payment status");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="apm-root">

        {/* ── PAGE HEADER ── */}
        <div className="apm-header">
          <div>
            <div className="apm-eyebrow"><span className="apm-ornament">✦</span> Admin Panel</div>
            <h1 className="apm-page-title">Payment <span>Management</span></h1>
            <p className="apm-page-sub">Verify bank slips and manage subscription payments across the platform.</p>
          </div>
          <div className="apm-stat-chips">
            <div className="apm-chip">
              <span className="apm-chip-label">Pending Review</span>
              <span className="apm-chip-val warn">{pending}</span>
            </div>
            <div className="apm-chip">
              <span className="apm-chip-label">Approved</span>
              <span className="apm-chip-val">{approved}</span>
            </div>
            <div className="apm-chip">
              <span className="apm-chip-label">Revenue Collected</span>
              <span className="apm-chip-val">Rs {revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="apm-toolbar">
          <div className="apm-tabs">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((t) => (
              <button
                key={t}
                className={`apm-tab${tab === t ? " active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="apm-search">
            <SearchIcon size={14} />
            <input
              className="apm-search-input"
              type="text"
              placeholder="Search email or ref no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="apm-card">
          <table className="apm-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="apm-empty">
                      <div className="apm-empty-icon" style={{ marginBottom: "1rem" }}>
                        <Loader2Icon size={24} className="animate-spin" style={{ color: "#c9856a" }} />
                      </div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6">
                    <div className="apm-empty">
                      <div className="apm-empty-icon" style={{ marginBottom: "1rem" }}>
                        <AlertCircleIcon size={24} style={{ color: "#dc2626" }} />
                      </div>
                      {error}
                      <button className="apm-btn-ghost" onClick={fetchPayments} style={{ marginTop: "1rem" }}>Retry</button>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="apm-empty">
                    No payments found for this filter.
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="apm-ref">{p.transactionId || `#${p.id}`}</div>
                    <div className="apm-ref-date">{formatDate(p.submittedAt)}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: "0.82rem", color: "#2d1810" }}>{p.userEmail}</div>
                    <div style={{ fontSize: "0.69rem", color: "#c4a898", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {p.packageName} 
                      <span style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: "4px", background: p.paymentType === "BOOST" ? "#fdf4ff" : "#f0f9ff", color: p.paymentType === "BOOST" ? "#701a75" : "#075985", fontWeight: 600 }}>
                        {p.paymentType}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="apm-amount">Rs {p.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="apm-method-pill">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className={`apm-badge ${badgeClass(p.paymentStatus)}`}>{statusLabel(p.paymentStatus)}</span>
                  </td>
                  <td>
                    <div className="apm-row-actions">
                      <button className="apm-act-btn" onClick={() => openModal(p)}>
                        <EyeIcon size={11} /> {p.paymentStatus === "PENDING" ? "Review" : "View"}
                      </button>
                      {p.paymentStatus === "PENDING" && (
                        <>
                          <button className="apm-act-btn approve" onClick={() => quickUpdate(p.id, true)}>
                            <CheckIcon size={11} /> Approve
                          </button>
                          <button className="apm-act-btn reject" onClick={() => quickUpdate(p.id, false)}>
                            <XIcon size={11} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── REVIEW MODAL ── */}
        {modal && (
          <div className="apm-overlay" onClick={closeModal}>
            <div className="apm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="apm-modal-hdr">
                <div>
                  <div className="apm-modal-title">Transaction Details</div>
                  <div className="apm-modal-sub">{modal.transactionId || `#${modal.id}`} · {formatDate(modal.submittedAt)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span className={`apm-badge ${badgeClass(modal.paymentStatus)}`}>{statusLabel(modal.paymentStatus)}</span>
                  <button className="apm-modal-close" onClick={closeModal}>
                    <XIcon size={14} />
                  </button>
                </div>
              </div>

              <div className="apm-modal-body">
                <div className="apm-detail-grid">
                  <div>
                    <div className="apm-detail-label">Reference No</div>
                    <div className="apm-detail-value">{modal.transactionId || "N/A"}</div>
                  </div>
                  <div>
                    <div className="apm-detail-label">Amount</div>
                    <div className="apm-detail-value amount">Rs {modal.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="apm-detail-label">Member</div>
                    <div className="apm-detail-value" style={{ fontSize: "0.78rem" }}>{modal.userEmail}</div>
                  </div>
                  <div>
                    <div className="apm-detail-label">Package</div>
                    <div className="apm-detail-value" style={{ fontSize: "0.78rem" }}>{modal.packageName}</div>
                  </div>
                  <div>
                    <div className="apm-detail-label">Method</div>
                    <div className="apm-detail-value">{modal.paymentMethod}</div>
                  </div>
                  <div>
                    <div className="apm-detail-label">Submitted</div>
                    <div className="apm-detail-value">{formatDate(modal.submittedAt)}</div>
                  </div>
                  <div>
                    <div className="apm-detail-label">Type</div>
                    <div className="apm-detail-value">
                      <span className={`apm-badge ${modal.paymentType === 'BOOST' ? 'gray' : 'green'}`} style={{ fontSize: '0.65rem' }}>
                        {modal.paymentType}
                      </span>
                    </div>
                  </div>
                </div>

                {modal.receiptUrl && (
                  <div className="apm-slip-box" style={{ height: "auto", minHeight: "110px" }}>
                    <img 
                      src={modal.receiptUrl} 
                      alt="Payment Receipt" 
                      style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
                      onClick={() => window.open(modal.receiptUrl, '_blank')}
                    />
                  </div>
                )}
                {!modal.receiptUrl && modal.paymentMethod === "BANK_TRANSFER" && (
                  <div className="apm-slip-box">
                    Payment slip preview unavailable
                  </div>
                )}

                <div className="apm-form-group">
                  <label className="apm-form-label">
                    Admin Notes {modal.paymentStatus === "PENDING" ? "(optional — reason for rejection)" : "(read-only)"}
                  </label>
                  <textarea
                    className="apm-form-textarea"
                    rows={3}
                    disabled={modal.paymentStatus !== "PENDING"}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Slip does not match the amount stated…"
                  />
                </div>
              </div>

                <div className="apm-modal-footer">
                <button className="apm-btn-ghost" onClick={closeModal}>
                  {modal.paymentStatus === "PENDING" ? "Cancel" : "Close"}
                </button>
                {modal.paymentStatus === "PENDING" && (
                  <>
                    <button className="apm-btn-danger" onClick={() => doReview(false)}>
                      <XIcon size={12} /> Reject
                    </button>
                    <button className="apm-btn-primary" onClick={() => doReview(true)}>
                      <CheckIcon size={12} /> Approve Payment
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminPayments;