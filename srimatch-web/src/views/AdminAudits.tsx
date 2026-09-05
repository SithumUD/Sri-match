"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  HistoryIcon, SearchIcon, EyeIcon,
  CalendarIcon, ActivityIcon,
  RefreshCwIcon, Loader2Icon, XIcon,
  ChevronLeftIcon, ChevronRightIcon,
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
  .aa-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
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
    margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap;
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
  .aa-table td { padding: 0.95rem 1.25rem; border-bottom: 1px solid #fdf5ee; vertical-align: middle; }
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

  /* ── PAGINATION BAR ── */
  .aa-pagination-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 1.5rem; background: #fffaf7; border-top: 1px solid #f0ddd5;
    flex-wrap: wrap; gap: 1rem; font-size: 0.82rem; color: #8b4e2e;
  }
  .aa-page-info { display: flex; align-items: center; gap: 0.5rem; }
  .aa-page-size-select {
    padding: 0.3rem 0.6rem; border-radius: 8px; border: 1px solid #f0ddd5;
    background: #fff; font-size: 0.8rem; color: #2d1810; outline: none;
    font-family: inherit; cursor: pointer;
  }
  .aa-page-nav { display: flex; align-items: center; gap: 0.35rem; }
  .aa-page-btn {
    min-width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid #f0ddd5; background: #fff; color: #8b4e2e;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.15s;
    padding: 0 0.4rem;
  }
  .aa-page-btn:hover:not(:disabled) { background: #fdf5ee; border-color: #e8c9b8; }
  .aa-page-btn.active {
    background: #8b4e2e; color: #fff; border-color: #8b4e2e; font-weight: 600;
  }
  .aa-page-btn:disabled {
    opacity: 0.4; cursor: not-allowed;
  }

  /* ── MODAL ── */
  .aa-overlay {
    position: fixed; inset: 0; background: rgba(30,8,2,0.45);
    display: flex; align-items: center; justify-content: center; z-index: 1000;
    padding: 1.5rem; backdrop-filter: blur(4px);
  }
  .aa-modal {
    background: #fff; width: 100%; max-width: 650px; border-radius: 20px;
    border: 1px solid #f0ddd5; box-shadow: 0 20px 50px rgba(45,24,16,0.15);
    overflow: hidden;
    animation: aa-slide-up 0.3s ease-out;
  }
  @keyframes aa-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .aa-modal-hdr {
    padding: 1.25rem 1.5rem; background: #fdf8f4; border-bottom: 1px solid #f0ddd5;
    display: flex; justify-content: space-between; align-items: center;
  }
  .aa-modal-close { background: none; border: none; color: #9a7060; cursor: pointer; }
  .aa-modal-body { padding: 1.5rem; max-height: 75vh; overflow-y: auto; }
  
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

  // Pagination State
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLogs = useCallback(async (targetPage = page, targetPageSize = pageSize, searchTerm = search) => {
    try {
      setLoading(true);
      const res = await AdminService.getAuditLogs({
        page: targetPage,
        size: targetPageSize,
        search: searchTerm.trim() || undefined
      });

      if (res && res.data) {
        if (res.data.content) {
          setLogs(res.data.content);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        } else if (Array.isArray(res.data)) {
          setLogs(res.data);
          setTotalPages(1);
          setTotalElements(res.data.length);
        }
      } else if (Array.isArray(res)) {
        setLogs(res);
        setTotalPages(1);
        setTotalElements(res.length);
      }
    } catch (err) {
      console.error("Fetch audit logs error:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      fetchLogs(0, pageSize, search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchLogs(page, pageSize, search);
  }, [page, pageSize]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(0, page - 2);
      let end = Math.min(totalPages - 1, page + 2);
      if (start === 0) end = maxVisible - 1;
      if (end === totalPages - 1) start = totalPages - maxVisible;
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const startRecord = totalElements === 0 ? 0 : page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

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
            <button className="aa-btn-icon" onClick={() => fetchLogs(page, pageSize, search)} title="Refresh Logs">
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
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="aa-empty">No audit logs found matching your query.</td>
                  </tr>
                ) : logs.map((log) => (
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

          {/* ── PAGINATION BAR ── */}
          {totalElements > 0 && (
            <div className="aa-pagination-bar">
              <div className="aa-page-info">
                <span>Showing <strong>{startRecord}</strong> - <strong>{endRecord}</strong> of <strong>{totalElements}</strong> audit logs</span>
                <span style={{ margin: "0 0.5rem", color: "#e8c9b8" }}>|</span>
                <span>Per page:</span>
                <select
                  className="aa-page-size-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="aa-page-nav">
                <button
                  className="aa-page-btn"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  title="Previous Page"
                >
                  <ChevronLeftIcon size={14} />
                </button>

                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`aa-page-btn ${pageNum === page ? "active" : ""}`}
                    onClick={() => setPage(pageNum)}
                    disabled={loading}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                <button
                  className="aa-page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1 || loading}
                  title="Next Page"
                >
                  <ChevronRightIcon size={14} />
                </button>
              </div>
            </div>
          )}
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