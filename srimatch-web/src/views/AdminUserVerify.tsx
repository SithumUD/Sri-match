"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck, ShieldAlert, Eye, CheckCircle, XCircle, 
  User, Mail, Calendar, Clock, Image as ImageIcon,
  Search, Filter, RefreshCw, Loader2, X, ChevronRight, AlertCircle, Trash2
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .av-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .av-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .av-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .av-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .av-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .av-page-title span {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .av-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── TOOLBAR ── */
  .av-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
  }
  .av-search-wrap { position: relative; flex: 1; max-width: 400px; }
  .av-search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #c9856a; }
  .av-search-input {
    width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem; border-radius: 99px;
    border: 1.5px solid #f0ddd5; background: #fff; font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .av-search-input:focus { border-color: #c9856a; outline: none; box-shadow: 0 0 0 3px rgba(201,133,106,0.08); }

  .av-actions { display: flex; gap: 0.75rem; }
  .av-btn-icon {
    width: 38px; height: 38px; border-radius: 50%; border: 1px solid #f0ddd5;
    background: #fff; color: #8b4e2e; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.2s;
  }
  .av-btn-icon:hover { border-color: #c9856a; background: #fdf5ee; }

  /* ── CARD/TABLE ── */
  .av-card { background: #fff; border: 1px solid #f0ddd5; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(139,78,46,0.04); }
  .av-table-wrap { overflow-x: auto; }
  .av-table { width: 100%; border-collapse: collapse; min-width: 800px; }
  .av-table th {
    text-align: left; padding: 1rem 1.25rem; background: #fdf8f4;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    color: #8b4e2e; border-bottom: 1px solid #f5ede5;
  }
  .av-table td { padding: 1.1rem 1.25rem; border-bottom: 1px solid #fdf5ee; vertical-align: middle; }
  .av-table tr:hover td { background: #fdfaf8; }

  .av-user-cell { display: flex; align-items: center; gap: 0.75rem; }
  .av-user-avatar { width: 34px; height: 34px; border-radius: 50%; background: #f5ede5; display: flex; align-items: center; justify-content: center; color: #8b4e2e; font-size: 0.85rem; font-weight: 600; }
  .av-user-info { display: flex; flex-direction: column; }
  .av-user-name { font-size: 0.88rem; font-weight: 600; color: #2d1810; }
  .av-user-email { font-size: 0.72rem; color: #9a7060; }

  .av-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.3rem 0.75rem; border-radius: 99px; font-size: 0.72rem; font-weight: 600;
  }
  .av-badge-type { background: #f0f4fd; color: #3a5ea8; border: 1px solid #d0dcf4; }
  .av-badge-status.pending { background: #f0f4f8; color: #5a6b7d; border: 1px solid #d1d9e2; }
  .av-badge-status.under_review { background: #fffbf0; color: #8a6010; border: 1px solid #f0e090; }

  .av-time { font-size: 0.75rem; color: #9a7060; display: flex; align-items: center; gap: 0.4rem; }

  .av-view-btn {
    padding: 0.45rem 0.9rem; border-radius: 8px; border: 1px solid #f0ddd5;
    background: #fff; color: #6b4a3a; font-size: 0.75rem; font-weight: 600;
    cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem;
  }
  .av-view-btn:hover { border-color: #c9856a; color: #8b4e2e; background: #fdf5ee; }

  /* ── MODAL ── */
  .av-overlay {
    position: fixed; inset: 0; background: rgba(30,8,2,0.45);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
    padding: 1.5rem; backdrop-filter: blur(4px);
  }
  .av-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 900px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden;
    animation: av-slide-up 0.3s ease-out; display: flex; flex-direction: column; max-height: 90vh;
  }
  @keyframes av-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .av-modal-hdr {
    padding: 1.25rem 1.75rem; background: #fdf8f4; border-bottom: 1px solid #f5ede5;
    display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
  }
  .av-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: #2d1810; }
  .av-modal-close {
    width: 32px; height: 32px; border-radius: 50%; border: none; background: #f5ede5;
    color: #8b4e2e; display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  
  .av-modal-body { padding: 1.75rem; overflow-y: auto; display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
  @media (max-width: 800px) { .av-modal-body { grid-template-columns: 1fr; } }

  /* Image gallery in modal */
  .av-gallery { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  .av-img-card { background: #fdfaf8; border: 1px solid #f0ddd5; border-radius: 12px; overflow: hidden; }
  .av-img-label { padding: 0.65rem 1rem; background: #fdf5ee; font-size: 0.72rem; font-weight: 700; color: #8b4e2e; text-transform: uppercase; border-bottom: 1px solid #f0ddd5; }
  .av-img-wrap { padding: 0.5rem; position: relative; }
  .av-img { width: 100%; max-height: 400px; object-fit: contain; display: block; border-radius: 4px; }
  
  .av-info-side { display: flex; flex-direction: column; gap: 1.5rem; }
  .av-info-sec { }
  .av-info-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #c4a898; margin-bottom: 0.4rem; }
  .av-info-val { font-size: 0.88rem; font-weight: 500; color: #2d1810; }

  .av-modal-ftr {
    padding: 1.25rem 1.75rem; background: #fdfaf8; border-top: 1px solid #f5ede5;
    display: flex; justify-content: flex-end; gap: 0.75rem; flex-shrink: 0;
  }
  
  .av-btn-approve {
    padding: 0.65rem 1.5rem; border-radius: 99px; border: none;
    background: #16a34a; color: #fff; font-weight: 600; font-size: 0.85rem;
    cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s;
  }
  .av-btn-approve:hover { background: #15803d; transform: translateY(-1px); }
  
  .av-btn-reject {
    padding: 0.65rem 1.5rem; border-radius: 99px; border: 1px solid #dc2626;
    background: transparent; color: #dc2626; font-weight: 600; font-size: 0.85rem;
    cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.2s;
  }
  .av-btn-reject:hover { background: #fef2f2; }

  .av-empty { padding: 4rem; text-align: center; color: #9a7060; }
  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const AdminUserVerify = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getPendingVerifications();
      setRequests(res.data || []);
    } catch (err) {
      console.error("Fetch verification requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReq || actionLoading) return;
    if (!window.confirm("Are you sure you want to verify this user? This will permanently delete the encrypted document files.")) return;
    
    try {
      setActionLoading(true);
      await AdminService.approveVerification(selectedReq.id);
      setSelectedReq(null);
      fetchRequests();
    } catch (err) {
      alert("Approval failed: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReq || actionLoading || !rejectReason) return;
    try {
      setActionLoading(true);
      await AdminService.rejectVerification(selectedReq.id, rejectReason);
      setSelectedReq(null);
      setShowRejectInput(false);
      setRejectReason("");
      fetchRequests();
    } catch (err) {
      alert("Rejection failed: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = requests.filter(req => 
    req.userName?.toLowerCase().includes(search.toLowerCase()) ||
    req.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="av-root">
        {/* ── HEADER ── */}
        <div className="av-header">
          <div>
            <div className="av-eyebrow"><ShieldCheck size={12} /> Trust & Safety</div>
            <h1 className="av-page-title">Identity <span>Verification</span></h1>
            <p className="av-page-sub">Review government-issued documents and live selfies to grant the verified trust badge.</p>
          </div>
          <div className="av-actions">
            <button className="av-btn-icon" onClick={fetchRequests} title="Refresh Requests">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="av-toolbar">
          <div className="av-search-wrap">
            <Search size={15} className="av-search-icon" />
            <input
              type="text"
              className="av-search-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="av-card">
          <div className="av-table-wrap">
            <table className="av-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>ID Type</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="av-empty">
                      <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 1rem", display: "block" }} />
                      Loading pending verifications...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="av-empty">No pending verification requests found.</td>
                  </tr>
                ) : filtered.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="av-user-cell">
                        <div className="av-user-avatar">{req.userName?.charAt(0).toUpperCase()}</div>
                        <div className="av-user-info">
                          <span className="av-user-name">{req.userName}</span>
                          <span className="av-user-email">{req.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="av-badge av-badge-type">{req.type?.replace(/_/g, ' ')}</span>
                    </td>
                    <td>
                      <div className="av-time"><Calendar size={12} /> {new Date(req.createdAt).toLocaleDateString()}</div>
                      <div className="av-time" style={{ fontSize: '0.65rem' }}><Clock size={10} /> {new Date(req.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td>
                      <span className={`av-badge av-badge-status ${req.status.toLowerCase()}`}>
                        {req.status === 'PENDING' ? 'Waiting for Selfie' : req.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        className="av-view-btn" 
                        onClick={() => { setSelectedReq(req); setShowRejectInput(false); }}
                        disabled={req.status === 'PENDING'}
                        title={req.status === 'PENDING' ? "Cannot review until user uploads selfie" : "Review Documents"}
                      >
                        <Eye size={12} /> {req.status === 'PENDING' ? 'Waiting' : 'Review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── REVIEW MODAL ── */}
        {selectedReq && (
          <div className="av-overlay" onClick={() => !actionLoading && setSelectedReq(null)}>
            <div className="av-modal" onClick={e => e.stopPropagation()}>
              <div className="av-modal-hdr">
                <h3 className="av-modal-title">Review Verification <span>#{selectedReq.id}</span></h3>
                <button className="av-modal-close" onClick={() => setSelectedReq(null)}><X size={16} /></button>
              </div>
              
              <div className="av-modal-body">
                <div className="av-gallery">
                  <div className="av-img-card">
                    <div className="av-img-label">Front of {selectedReq.type?.replace(/_/g, ' ')}</div>
                    <div className="av-img-wrap">
                      <img src={AdminService.getVerificationImage(selectedReq.id, 'front')} alt="ID Front" className="av-img" />
                    </div>
                  </div>
                  {selectedReq.type !== 'PASSPORT' && (
                    <div className="av-img-card">
                      <div className="av-img-label">Back of {selectedReq.type?.replace(/_/g, ' ')}</div>
                      <div className="av-img-wrap">
                        <img src={AdminService.getVerificationImage(selectedReq.id, 'back')} alt="ID Back" className="av-img" />
                      </div>
                    </div>
                  )}
                  <div className="av-img-card">
                    <div className="av-img-label">Live Selfie</div>
                    <div className="av-img-wrap">
                      <img src={AdminService.getVerificationImage(selectedReq.id, 'selfie')} alt="Live Selfie" className="av-img" />
                    </div>
                  </div>
                </div>

                <div className="av-info-side">
                  <div className="av-info-sec">
                    <p className="av-info-label">User Information</p>
                    <p className="av-info-val" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedReq.userName}</p>
                    <p className="av-info-val" style={{ color: '#9a7060' }}>{selectedReq.userEmail}</p>
                  </div>
                  
                  <div className="av-info-sec">
                    <p className="av-info-label">Document Type</p>
                    <p className="av-info-val">{selectedReq.type?.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="av-info-sec">
                    <p className="av-info-label">Submission Date</p>
                    <p className="av-info-val">{new Date(selectedReq.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="av-info-sec" style={{ marginTop: 'auto', background: '#fef2f2', padding: '1rem', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', color: '#dc2626' }}>
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Security Policy</p>
                        <p style={{ fontSize: '0.7rem', marginTop: '0.2rem', lineHeight: 1.4 }}>Verification images are encrypted. Approving or rejecting will permanently delete these files from the server.</p>
                      </div>
                    </div>
                  </div>

                  {showRejectInput && (
                    <div className="av-info-sec">
                      <p className="av-info-label">Rejection Reason</p>
                      <textarea 
                        className="av-search-input" 
                        style={{ borderRadius: '12px', height: '100px', padding: '0.75rem', fontSize: '0.8rem' }}
                        placeholder="Explain why the verification was rejected..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="av-modal-ftr">
                {showRejectInput ? (
                  <>
                    <button className="av-view-btn" onClick={() => setShowRejectInput(false)}>Cancel</button>
                    <button className="av-btn-reject" style={{ background: '#dc2626', color: '#fff' }} onClick={handleReject} disabled={actionLoading || !rejectReason}>
                      {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />} 
                      Confirm Rejection
                    </button>
                  </>
                ) : (
                  <>
                    <button className="av-btn-reject" onClick={() => setShowRejectInput(true)} disabled={actionLoading}>
                      <XCircle size={16} /> Reject Request
                    </button>
                    <button className="av-btn-approve" onClick={handleApprove} disabled={actionLoading}>
                      {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} 
                      Verify User
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

export default AdminUserVerify;