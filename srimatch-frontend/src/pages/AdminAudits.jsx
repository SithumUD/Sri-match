import React, { useState, useEffect } from "react";
import {
  HistoryIcon, SearchIcon, FilterIcon, EyeIcon,
  ShieldCheckIcon, ShieldAlertIcon, GlobeIcon,
  UserIcon, CalendarIcon, ActivityIcon,
  RefreshCwIcon, Loader2Icon, XIcon,
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .aa-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .aa-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .aa-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
  .aa-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .aa-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .aa-page-title span {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .aa-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── TOOLBAR ── */
  .aa-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap;
  }
  .aa-search-wrap { position: relative; flex: 1; max-width: 400px; }
  .aa-search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #c9856a; }
  .aa-search-input {
    width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem; border-radius: 99px;
    border: 1.5px solid #f0ddd5; background: #fff; font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .aa-search-input:focus { border-color: #c9856a; outline: none; box-shadow: 0 0 0 3px rgba(201,133,106,0.08); }

  .aa-actions { display: flex; gap: 0.75rem; }
  .aa-btn-icon {
    width: 38px; height: 38px; border-radius: 50%; border: 1px solid #f0ddd5;
    background: #fff; color: #8b4e2e; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.2s;
  }
  .aa-btn-icon:hover { border-color: #c9856a; background: #fdf5ee; }

  /* ── TABLE ── */
  .aa-card { background: #fff; border: 1px solid #f0ddd5; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(139,78,46,0.04); }
  .aa-table-wrap { overflow-x: auto; }
  .aa-table { width: 100%; border-collapse: collapse; min-width: 900px; }
  .aa-table th {
    text-align: left; padding: 1rem 1.25rem; background: #fdf8f4;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    color: #8b4e2e; border-bottom: 1px solid #f5ede5;
  }
  .aa-table td { padding: 1rem 1.25rem; border-bottom: 1px solid #fdf5ee; vertical-align: middle; }
  .aa-table tr:hover td { background: #fdfaf8; }

  .aa-user-cell { display: flex; align-items: center; gap: 0.75rem; }
  .aa-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: #f5ede5; display: flex; align-items: center; justify-content: center; color: #8b4e2e; font-size: 0.8rem; font-weight: 600; }
  .aa-user-email { font-size: 0.85rem; font-weight: 500; color: #2d1810; }
  .aa-user-role { font-size: 0.65rem; color: #9a7060; }

  .aa-action-badge {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.25rem 0.65rem; border-radius: 99px; font-size: 0.7rem; font-weight: 600;
    background: #fdf5ee; color: #8b4e2e; border: 1px solid #f0ddd5;
  }
  .aa-status-dot { width: 6px; height: 6px; border-radius: 50%; }
  .aa-status-dot.success { background: #16a34a; }
  .aa-status-dot.fail { background: #dc2626; }

  .aa-time { font-size: 0.75rem; color: #9a7060; display: flex; align-items: center; gap: 0.4rem; }
  .aa-ip { font-size: 0.7rem; color: #c4a898; font-family: monospace; margin-top: 0.2rem; }

  .aa-view-btn {
    padding: 0.4rem 0.85rem; border-radius: 6px; border: 1px solid #f0ddd5;
    background: #fff; color: #6b4a3a; font-size: 0.75rem; font-weight: 500;
    cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem;
  }
  .aa-view-btn:hover { border-color: #c9856a; color: #8b4e2e; background: #fdf5ee; }

  /* ── MODAL ── */
  .aa-overlay {
    position: fixed; inset: 0; background: rgba(30,8,2,0.45);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
    padding: 1.5rem; backdrop-filter: blur(4px);
  }
  .aa-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 650px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden;
    animation: aa-slide-up 0.3s ease-out;
  }
  @keyframes aa-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .aa-modal-hdr {
    padding: 1.25rem 1.75rem; background: #fdf8f4; border-bottom: 1px solid #f5ede5;
    display: flex; justify-content: space-between; align-items: center;
  }
  .aa-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: #2d1810; }
  .aa-modal-close {
    width: 32px; height: 32px; border-radius: 50%; border: none; background: #f5ede5;
    color: #8b4e2e; display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .aa-modal-body { padding: 1.75rem; max-height: 70vh; overflow-y: auto; }

  .aa-detail-row { margin-bottom: 1.25rem; display: grid; grid-template-columns: 140px 1fr; gap: 1rem; }
  .aa-detail-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #c4a898; }
  .aa-detail-val { font-size: 0.88rem; color: #2d1810; font-weight: 500; }
  
  .aa-diff-box {
    margin-top: 1.5rem; background: #fdfaf8; border: 1px solid #f0ddd5; border-radius: 12px; overflow: hidden;
  }
  .aa-diff-hdr { padding: 0.75rem 1rem; background: #fdf5ee; font-size: 0.75rem; font-weight: 600; color: #8b4e2e; border-bottom: 1px solid #f0ddd5; }
  .aa-diff-content { padding: 1rem; font-family: monospace; font-size: 0.78rem; color: #4a3028; white-space: pre-wrap; word-break: break-all; }

  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .aa-empty { padding: 4rem; text-align: center; color: #9a7060; }
`;

const AdminAudits = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAuditLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error("Fetch audit logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(log => 
    log.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.details?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="aa-root">
        {/* ── HEADER ── */}
        <div className="aa-header">
          <div>
            <div className="aa-eyebrow"><HistoryIcon size={12} /> System Integrity</div>
            <h1 className="aa-page-title">Administrative <span>Audits</span></h1>
            <p className="aa-page-sub">Permanent records of all critical actions performed by system administrators.</p>
          </div>
          <div className="aa-actions">
            <button className="aa-btn-icon" onClick={fetchLogs} title="Refresh Logs">
              <RefreshCwIcon size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="aa-toolbar">
          <div className="aa-search-wrap">
            <SearchIcon size={15} className="aa-search-icon" />
            <input
              type="text"
              className="aa-search-input"
              placeholder="Search by admin email, action or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="aa-card">
          <div className="aa-table-wrap">
            <table className="aa-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Administrator</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {loading && logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="aa-empty">
                      <Loader2Icon size={24} className="animate-spin" style={{ margin: "0 auto 1rem", display: "block" }} />
                      Loading audit trails...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="aa-empty">No audit logs found.</td>
                  </tr>
                ) : filtered.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="aa-time"><CalendarIcon size={12} /> {formatDate(log.createdAt)}</div>
                      <div className="aa-ip">{log.ipAddress}</div>
                    </td>
                    <td>
                      <div className="aa-user-cell">
                        <div className="aa-user-avatar">{log.userEmail?.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="aa-user-email">{log.userEmail || "System"}</div>
                          <div className="aa-user-role">ID: #{log.userId || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="aa-action-badge">
                        <ActivityIcon size={11} /> {log.action?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8rem", color: "#6b4a3a", fontWeight: 600 }}>{log.entityType || "SYSTEM"}</div>
                      <div style={{ fontSize: "0.65rem", color: "#9a7060" }}>{log.entityId ? `Ref: #${log.entityId}` : "Global Action"}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 600, color: log.success ? "#16a34a" : "#dc2626" }}>
                        <div className={`aa-status-dot ${log.success ? "success" : "fail"}`} />
                        {log.success ? "SUCCESS" : "FAILED"}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="aa-view-btn" onClick={() => setSelectedLog(log)}>
                          <EyeIcon size={12} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── LOG DETAILS MODAL ── */}
        {selectedLog && (
          <div className="aa-overlay" onClick={() => setSelectedLog(null)}>
            <div className="aa-modal" onClick={e => e.stopPropagation()}>
              <div className="aa-modal-hdr">
                <h3 className="aa-page-title" style={{ fontSize: '1.4rem', margin: 0 }}>Log <span>Entry #{selectedLog.id}</span></h3>
                <button className="aa-modal-close" onClick={() => setSelectedLog(null)}><XIcon size={16} /></button>
              </div>
              <div className="aa-modal-body">
                <div className="aa-detail-row">
                  <div className="aa-detail-label">Action Performed</div>
                  <div className="aa-detail-val" style={{ color: '#8b4e2e', fontWeight: 700 }}>{selectedLog.action?.replace(/_/g, ' ')}</div>
                </div>
                <div className="aa-detail-row">
                  <div className="aa-detail-label">Timestamp</div>
                  <div className="aa-detail-val">{formatDate(selectedLog.createdAt)}</div>
                </div>
                <div className="aa-detail-row">
                  <div className="aa-detail-label">Administrator</div>
                  <div className="aa-detail-val">{selectedLog.userEmail} (ID: {selectedLog.userId || "System"})</div>
                </div>
                <div className="aa-detail-row">
                  <div className="aa-detail-label">Network Info</div>
                  <div className="aa-detail-val">{selectedLog.ipAddress} <span style={{ color: '#c4a898', marginLeft: '0.5rem', fontSize: '0.7rem' }}>{selectedLog.userAgent?.substring(0, 50)}...</span></div>
                </div>
                
                <div className="aa-detail-row" style={{ marginTop: '1.5rem' }}>
                  <div className="aa-detail-label">Target Entity</div>
                  <div className="aa-detail-val">{selectedLog.entityType || "N/A"} {selectedLog.entityId ? `(#${selectedLog.entityId})` : ""}</div>
                </div>

                <div className="aa-detail-row">
                  <div className="aa-detail-label">Action Summary</div>
                  <div className="aa-detail-val" style={{ fontStyle: 'italic' }}>"{selectedLog.details || "No additional details provided."}"</div>
                </div>

                {selectedLog.oldValue && (
                  <div className="aa-diff-box">
                    <div className="aa-diff-hdr">Original Value (Before Action)</div>
                    <div className="aa-diff-content">{selectedLog.oldValue}</div>
                  </div>
                )}

                {selectedLog.newValue && (
                  <div className="aa-diff-box">
                    <div className="aa-diff-hdr" style={{ background: '#f0fdf4', color: '#16a34a' }}>Modified Value (After Action)</div>
                    <div className="aa-diff-content">{selectedLog.newValue}</div>
                  </div>
                )}
                
                <div className="aa-diff-box" style={{ marginTop: '1.5rem', borderStyle: 'dashed' }}>
                  <div className="aa-diff-hdr" style={{ background: '#f8fafc', color: '#64748b' }}>Request Technical Info</div>
                  <div className="aa-diff-content" style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {selectedLog.requestMethod} {selectedLog.requestUrl} <br/>
                    Response Time: {selectedLog.responseTimeMs}ms | Status Code: {selectedLog.statusCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAudits;