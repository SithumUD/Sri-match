"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  VideoIcon, CheckIcon, XIcon, Loader2Icon, ExternalLinkIcon,
  ClockIcon, UserIcon, ImageIcon, RefreshCwIcon, EyeIcon,
  SendIcon, AlertCircleIcon,
} from "lucide-react";
import TikTokService from "../services/tiktok.service";

/* ─── Styles ────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .atp-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .atp-root { font-family: 'DM Sans', sans-serif; color: #2d1810; background: transparent; }

  .atp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .atp-eyebrow { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem; }
  .atp-page-title { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem; }
  .atp-page-title span { background: linear-gradient(135deg, #6b21a8, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .atp-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* Tabs */
  .atp-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
  .atp-tab { padding: 0.5rem 1.1rem; border-radius: 99px; font-size: 0.82rem; font-weight: 500; cursor: pointer; color: #9a7060; transition: all 0.2s; border: 1px solid transparent; }
  .atp-tab:hover { color: #8b4e2e; background: #fdf5ee; }
  .atp-tab.active { background: #2d1810; color: #fff; border-color: #2d1810; }

  /* Grid */
  .atp-grid { display: flex; flex-direction: column; gap: 1rem; }

  /* Card */
  .atp-card { background: #fff; border: 1px solid #f0ddd5; border-radius: 16px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.25rem; transition: all 0.2s; flex-wrap: wrap; }
  .atp-card:hover { box-shadow: 0 8px 24px rgba(139,78,46,0.1); border-color: #e8c9b8; }

  .atp-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #6b21a8, #9333ea); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }

  .atp-card-info { flex: 1; min-width: 200px; }
  .atp-card-name { font-weight: 600; font-size: 0.95rem; color: #2d1810; }
  .atp-card-meta { font-size: 0.78rem; color: #9a7060; margin-top: 2px; }
  .atp-card-pkg { font-size: 0.78rem; color: #8b4e2e; margin-top: 3px; font-weight: 500; }

  .atp-card-dates { display: flex; flex-direction: column; gap: 2px; font-size: 0.75rem; color: #9a7060; min-width: 140px; }

  .atp-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.65rem; border-radius: 99px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .atp-badge.pending { background: #fef9c3; color: #854d0e; }
  .atp-badge.processing { background: #dbeafe; color: #1e40af; }
  .atp-badge.published { background: #f0fdf4; color: #166534; }
  .atp-badge.rejected { background: #fef2f2; color: #991b1b; }
  .atp-badge.expired { background: #f3f4f6; color: #6b7280; }

  .atp-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .atp-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 1rem; border-radius: 99px; font-size: 0.78rem; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
  .atp-btn.primary { background: #2d1810; color: #fff; }
  .atp-btn.primary:hover { background: #3d2820; }
  .atp-btn.success { background: #166534; color: #fff; }
  .atp-btn.success:hover { background: #15803d; }
  .atp-btn.danger { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
  .atp-btn.danger:hover { background: #fee2e2; }
  .atp-btn.secondary { background: #fdf5ee; color: #8b4e2e; border: 1px solid #f0ddd5; }
  .atp-btn.secondary:hover { background: #f5ede5; }
  .atp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Modal */
  .atp-overlay { position: fixed; inset: 0; background: rgba(30,8,2,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1.5rem; }
  .atp-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; border: 1px solid #f0ddd5; }
  .atp-modal-hdr { padding: 1.25rem 1.5rem; background: #fdf8f4; border-bottom: 1px solid #f5ede5; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 1; }
  .atp-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: #2d1810; }
  .atp-modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .atp-modal-footer { padding: 1rem 1.5rem; background: #fdf8f4; border-top: 1px solid #f5ede5; display: flex; justify-content: flex-end; gap: 0.75rem; }

  .atp-form-group { display: flex; flex-direction: column; gap: 0.35rem; }
  .atp-label { font-size: 0.75rem; font-weight: 600; color: #6b4a3a; }
  .atp-input { width: 100%; padding: 0.65rem 0.9rem; border: 1.5px solid #f0ddd5; border-radius: 12px; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; background: #fdfaf8; transition: all 0.2s; }
  .atp-input:focus { border-color: #c9856a; background: #fff; outline: none; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .atp-textarea { resize: vertical; min-height: 80px; }

  /* Review section */
  .atp-review-section { background: #fdf5ee; border-radius: 12px; padding: 1rem; }
  .atp-review-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #9a7060; margin-bottom: 0.5rem; }
  .atp-review-value { font-size: 0.88rem; color: #2d1810; }
  .atp-slip-img { width: 100%; border-radius: 10px; margin-top: 0.5rem; border: 1px solid #f0ddd5; max-height: 260px; object-fit: contain; }

  /* Empty */
  .atp-empty { text-align: center; padding: 4rem 2rem; color: #9a7060; }
  .atp-empty-icon { margin: 0 auto 1rem; opacity: 0.3; }

  /* Refresh btn */
  .atp-refresh { background: none; border: 1px solid #f0ddd5; border-radius: 99px; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.82rem; color: #9a7060; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s; }
  .atp-refresh:hover { background: #fdf5ee; color: #8b4e2e; }

  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const STATUS_FILTERS = ["ALL", "PENDING", "PROCESSING", "PUBLISHED", "REJECTED", "EXPIRED"];

const fmtDate = (dt) => dt ? new Date(dt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const fmtCountdown = (expiresAt) => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt) - Date.now();
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${d}d ${h}h ${m}m remaining`;
};

const StatusBadge = ({ status }) => (
  <span className={`atp-badge ${status?.toLowerCase()}`}>
    {status === "PUBLISHED" && "🟢 "}{status}
  </span>
);

/* ─── Component ─────────────────────────────────────────────────────────── */
const AdminTikTokPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [reviewModal, setReviewModal] = useState(null);
  const [publishModal, setPublishModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);

  const [publishUrl, setPublishUrl] = useState("");
  const [publishNotes, setPublishNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await TikTokService.adminListPromotions(activeFilter === "ALL" ? null : activeFilter);
      setPromotions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch TikTok promotions:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  const handleProcess = async (id) => {
    try {
      setActionLoading(true);
      await TikTokService.adminSetProcessing(id);
      await fetchPromotions();
      setReviewModal(null);
    } catch (err) {
      alert("Failed to mark as processing: " + (err?.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!publishUrl.trim()) { alert("Please enter the TikTok post URL"); return; }
    try {
      setActionLoading(true);
      await TikTokService.adminPublish(publishModal.id, publishUrl.trim(), publishNotes);
      setPublishModal(null);
      setPublishUrl(""); setPublishNotes("");
      await fetchPromotions();
    } catch (err) {
      alert("Failed to publish: " + (err?.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await TikTokService.adminReject(rejectModal.id, rejectReason);
      setRejectModal(null);
      setRejectReason("");
      await fetchPromotions();
    } catch (err) {
      alert("Failed to reject: " + (err?.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (p) => {
    const first = p?.userFirstName?.[0] || "";
    const last = p?.userLastName?.[0] || "";
    return (first + last).toUpperCase() || "?";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="atp-root">

        {/* ── HEADER ── */}
        <div className="atp-header">
          <div>
            <div className="atp-eyebrow">✦ Admin Panel</div>
            <h1 className="atp-page-title">TikTok <span>Promotions</span></h1>
            <p className="atp-page-sub">Review, process, and publish user TikTok spotlight requests.</p>
          </div>
          <button className="atp-refresh" onClick={fetchPromotions}>
            <RefreshCwIcon size={14} /> Refresh
          </button>
        </div>

        {/* ── FILTER TABS ── */}
        <div className="atp-tabs">
          {STATUS_FILTERS.map(f => (
            <div
              key={f}
              className={`atp-tab ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </div>
          ))}
        </div>

        {/* ── LIST ── */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem" }}>
            <Loader2Icon size={32} className="animate-spin" color="#8b4e2e" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="atp-empty">
            <VideoIcon size={48} className="atp-empty-icon" />
            <p>No promotions found for filter: <strong>{activeFilter}</strong></p>
          </div>
        ) : (
          <div className="atp-grid">
            {promotions.map(p => (
              <div key={p.id} className="atp-card">
                <div className="atp-avatar">{getInitials(p)}</div>

                <div className="atp-card-info">
                  <div className="atp-card-name">{p.userFirstName} {p.userLastName}</div>
                  <div className="atp-card-meta">{p.userEmail}</div>
                  <div className="atp-card-pkg">
                    📦 {p.packageName} · {p.durationDays} {p.durationDays === 1 ? "Day" : "Days"} · Rs {Number(p.paidAmount || 0).toLocaleString()}
                  </div>
                </div>

                <div className="atp-card-dates">
                  <span>Submitted: {fmtDate(p.submittedAt)}</span>
                  {p.publishedAt && <span>Published: {fmtDate(p.publishedAt)}</span>}
                  {p.expiresAt && <span>{fmtCountdown(p.expiresAt)}</span>}
                </div>

                <StatusBadge status={p.status} />

                <div className="atp-actions">
                  <button className="atp-btn secondary" onClick={() => setReviewModal(p)}>
                    <EyeIcon size={13} /> Review
                  </button>
                  {(p.status === "PENDING" || p.status === "PROCESSING") && (
                    <button className="atp-btn success" onClick={() => { setPublishModal(p); setPublishUrl(""); setPublishNotes(""); }}>
                      <SendIcon size={13} /> Publish
                    </button>
                  )}
                  {(p.status === "PENDING" || p.status === "PROCESSING") && (
                    <button className="atp-btn danger" onClick={() => { setRejectModal(p); setRejectReason(""); }}>
                      <XIcon size={13} /> Reject
                    </button>
                  )}
                  {p.tiktokPostUrl && (
                    <a href={p.tiktokPostUrl} target="_blank" rel="noreferrer" className="atp-btn primary">
                      <ExternalLinkIcon size={13} /> TikTok
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── REVIEW MODAL ── */}
        {reviewModal && (
          <div className="atp-overlay" onClick={e => e.target === e.currentTarget && setReviewModal(null)}>
            <div className="atp-modal">
              <div className="atp-modal-hdr">
                <span className="atp-modal-title">Promotion Review</span>
                <button className="atp-btn secondary" style={{ padding: "0.35rem 0.75rem" }} onClick={() => setReviewModal(null)}>
                  <XIcon size={14} />
                </button>
              </div>
              <div className="atp-modal-body">
                <div className="atp-review-section">
                  <div className="atp-review-label">User</div>
                  <div className="atp-review-value">{reviewModal.userFirstName} {reviewModal.userLastName} — {reviewModal.userEmail}</div>
                </div>
                <div className="atp-review-section">
                  <div className="atp-review-label">Package</div>
                  <div className="atp-review-value">{reviewModal.packageName} · {reviewModal.durationDays} Day(s) · Rs {Number(reviewModal.paidAmount || 0).toLocaleString()}</div>
                </div>
                <div className="atp-review-section">
                  <div className="atp-review-label">Status</div>
                  <StatusBadge status={reviewModal.status} />
                </div>
                {reviewModal.submittedAt && (
                  <div className="atp-review-section">
                    <div className="atp-review-label">Submitted</div>
                    <div className="atp-review-value">{fmtDate(reviewModal.submittedAt)}</div>
                  </div>
                )}
                {reviewModal.receiptUrl && (
                  <div className="atp-review-section">
                    <div className="atp-review-label">Payment Slip</div>
                    <img src={reviewModal.receiptUrl} alt="Payment receipt" className="atp-slip-img" />
                  </div>
                )}
                {reviewModal.tiktokPostUrl && (
                  <div className="atp-review-section">
                    <div className="atp-review-label">TikTok Post URL</div>
                    <a href={reviewModal.tiktokPostUrl} target="_blank" rel="noreferrer" style={{ color: "#9333ea", fontSize: "0.85rem", wordBreak: "break-all" }}>
                      {reviewModal.tiktokPostUrl}
                    </a>
                  </div>
                )}
                {reviewModal.rejectionReason && (
                  <div className="atp-review-section">
                    <div className="atp-review-label">Rejection Reason</div>
                    <div className="atp-review-value" style={{ color: "#dc2626" }}>{reviewModal.rejectionReason}</div>
                  </div>
                )}
                {reviewModal.adminNotes && (
                  <div className="atp-review-section">
                    <div className="atp-review-label">Admin Notes</div>
                    <div className="atp-review-value">{reviewModal.adminNotes}</div>
                  </div>
                )}
              </div>
              <div className="atp-modal-footer">
                {reviewModal.status === "PENDING" && (
                  <button className="atp-btn primary" onClick={() => handleProcess(reviewModal.id)} disabled={actionLoading}>
                    {actionLoading ? <Loader2Icon size={13} className="animate-spin" /> : <CheckIcon size={13} />}
                    Mark Processing
                  </button>
                )}
                <button className="atp-btn secondary" onClick={() => setReviewModal(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── PUBLISH MODAL ── */}
        {publishModal && (
          <div className="atp-overlay" onClick={e => e.target === e.currentTarget && setPublishModal(null)}>
            <div className="atp-modal">
              <div className="atp-modal-hdr">
                <span className="atp-modal-title">🎉 Publish TikTok Post</span>
                <button className="atp-btn secondary" style={{ padding: "0.35rem 0.75rem" }} onClick={() => setPublishModal(null)}>
                  <XIcon size={14} />
                </button>
              </div>
              <div className="atp-modal-body">
                <div className="atp-review-section">
                  <div className="atp-review-label">User</div>
                  <div className="atp-review-value">{publishModal.userFirstName} {publishModal.userLastName}</div>
                </div>
                <div className="atp-review-section">
                  <div className="atp-review-label">Package</div>
                  <div className="atp-review-value">{publishModal.packageName} · {publishModal.durationDays} Day(s)</div>
                  <div style={{ fontSize: "0.75rem", color: "#9a7060", marginTop: "4px" }}>
                    ⏱ Expiry will be calculated from now: <strong>now + {publishModal.durationDays} day(s)</strong>
                  </div>
                </div>
                <div className="atp-form-group">
                  <label className="atp-label">TikTok Post URL *</label>
                  <input
                    className="atp-input"
                    placeholder="https://www.tiktok.com/@srimatch/video/..."
                    value={publishUrl}
                    onChange={e => setPublishUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="atp-form-group">
                  <label className="atp-label">Admin Notes (optional)</label>
                  <textarea
                    className="atp-input atp-textarea"
                    placeholder="Any notes about this post..."
                    value={publishNotes}
                    onChange={e => setPublishNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="atp-modal-footer">
                <button className="atp-btn secondary" onClick={() => setPublishModal(null)}>Cancel</button>
                <button className="atp-btn success" onClick={handlePublish} disabled={actionLoading || !publishUrl.trim()}>
                  {actionLoading ? <Loader2Icon size={13} className="animate-spin" /> : <SendIcon size={13} />}
                  Publish & Start Timer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── REJECT MODAL ── */}
        {rejectModal && (
          <div className="atp-overlay" onClick={e => e.target === e.currentTarget && setRejectModal(null)}>
            <div className="atp-modal">
              <div className="atp-modal-hdr">
                <span className="atp-modal-title">Reject Promotion</span>
                <button className="atp-btn secondary" style={{ padding: "0.35rem 0.75rem" }} onClick={() => setRejectModal(null)}>
                  <XIcon size={14} />
                </button>
              </div>
              <div className="atp-modal-body">
                <div className="atp-review-section">
                  <div className="atp-review-label">User</div>
                  <div className="atp-review-value">{rejectModal.userFirstName} {rejectModal.userLastName}</div>
                </div>
                <div className="atp-form-group">
                  <label className="atp-label">Rejection Reason (optional)</label>
                  <textarea
                    className="atp-input atp-textarea"
                    placeholder="e.g. Bank slip is unclear, please resubmit..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="atp-modal-footer">
                <button className="atp-btn secondary" onClick={() => setRejectModal(null)}>Cancel</button>
                <button className="atp-btn danger" onClick={handleReject} disabled={actionLoading}>
                  {actionLoading ? <Loader2Icon size={13} className="animate-spin" /> : <XIcon size={13} />}
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminTikTokPromotions;
