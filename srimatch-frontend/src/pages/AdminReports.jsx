import React, { useState, useEffect } from "react";
import {
  SearchIcon, EyeIcon, XIcon, FlagIcon,
  CheckIcon, ShieldOffIcon, AlertTriangleIcon,
  Loader2Icon, RefreshCwIcon, AlertCircleIcon,
  ChevronRightIcon, FilterIcon,
} from "lucide-react";
import AdminService from "../services/admin.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .ar-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ar-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .ar-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
  .ar-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .ar-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .ar-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .ar-page-sub { font-size: 0.83rem; color: #9a7060; }

  /* ── STAT CHIPS ── */
  .ar-chips { display: flex; gap: 0.85rem; flex-wrap: wrap; }
  .ar-chip {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 12px; padding: 0.65rem 1.1rem;
    display: flex; flex-direction: column; gap: 1px;
  }
  .ar-chip-label { font-size: 0.68rem; color: #9a7060; }
  .ar-chip-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #2d1810; line-height: 1;
  }
  .ar-chip-val.warn { color: #d97706; }
  .ar-chip-val.red  { color: #dc2626; }

  /* ── TOOLBAR ── */
  .ar-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin: 1.5rem 0; gap: 1rem; flex-wrap: wrap;
  }
  .ar-search-wrap { position: relative; flex: 1; max-width: 350px; }
  .ar-search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #c9856a; }
  .ar-search-input {
    width: 100%; padding: 0.6rem 1rem 0.6rem 2.4rem; border-radius: 99px;
    border: 1.5px solid #f0ddd5; background: #fff; font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif; transition: 0.2s;
  }
  .ar-search-input:focus { border-color: #c9856a; outline: none; }

  .ar-filters { display: flex; gap: 0.65rem; }
  .ar-filter-btn {
    padding: 0.5rem 1rem; border-radius: 99px; border: 1px solid #f0ddd5;
    background: #fff; color: #6b4a3a; font-size: 0.75rem; font-weight: 500;
    cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem;
  }
  .ar-filter-btn:hover { background: #fdf5ee; border-color: #e8c9b8; }
  .ar-filter-btn.active { background: #2d1810; color: #fff; border-color: #2d1810; }

  /* ── TABLE ── */
  .ar-table-card { background: #fff; border: 1px solid #f0ddd5; border-radius: 16px; overflow: hidden; }
  .ar-table-wrap { overflow-x: auto; }
  .ar-table { width: 100%; border-collapse: collapse; min-width: 800px; }
  .ar-table th {
    text-align: left; padding: 1rem 1.25rem; background: #fdf8f4;
    font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    color: #8b4e2e; border-bottom: 1px solid #f5ede5;
  }
  .ar-table td { padding: 1rem 1.25rem; border-bottom: 1px solid #fdf5ee; vertical-align: middle; }
  .ar-table tr:last-child td { border-bottom: none; }
  .ar-table tr:hover td { background: #fdfaf8; }

  .ar-ref { font-family: monospace; font-size: 0.78rem; font-weight: 600; color: #8b4e2e; }
  .ar-ref-date { font-size: 0.65rem; color: #9a7060; }

  .ar-severity {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.65rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .ar-severity.high { background: #fef2f2; color: #dc2626; }
  .ar-severity.med  { background: #fffbeb; color: #d97706; }
  .ar-severity.low  { background: #eff6ff; color: #2563eb; }

  .ar-badge {
    display: inline-block; padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.65rem; font-weight: 600;
  }
  .ar-badge.pending { background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; }
  .ar-badge.review  { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
  .ar-badge.resolved { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
  .ar-badge.dismissed { background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb; }

  .ar-row-actions { display: flex; justify-content: flex-end; }
  .ar-act-btn {
    display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem;
    border-radius: 6px; border: 1px solid #f0ddd5; background: #fff;
    color: #6b4a3a; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: 0.2s;
  }
  .ar-act-btn:hover { background: #fdf5ee; border-color: #c9856a; color: #8b4e2e; }

  /* ── MODAL ── */
  .ar-overlay {
    position: fixed; inset: 0; background: rgba(30,8,2,0.45);
    display: flex; align-items: center; justify-content: center; z-index: 100;
    padding: 1.5rem; backdrop-filter: blur(4px);
  }
  .ar-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 580px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden;
    animation: ar-slide-up 0.3s ease-out;
  }
  @keyframes ar-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .ar-modal-hdr {
    padding: 1.25rem 1.75rem; background: #fdf8f4; border-bottom: 1px solid #f5ede5;
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .ar-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 700; color: #2d1810; line-height: 1; margin-bottom: 0.25rem; }
  .ar-modal-sub { font-size: 0.78rem; color: #9a7060; }
  .ar-modal-close {
    width: 28px; height: 28px; border-radius: 50%; border: none; background: #f5ede5;
    color: #8b4e2e; display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .ar-modal-body { padding: 1.75rem; }

  .ar-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; }
  .ar-detail-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #c4a898; margin-bottom: 0.2rem; }
  .ar-detail-value { font-size: 0.9rem; color: #2d1810; font-weight: 500; }

  .ar-desc-box {
    background: #fdfaf8; border: 1px dashed #e8c9b8; border-radius: 12px;
    padding: 1rem; font-size: 0.85rem; color: #6b4a3a; line-height: 1.6;
    font-style: italic; margin-bottom: 1.5rem; position: relative;
  }
  .ar-desc-by { position: absolute; bottom: -0.7rem; right: 1rem; background: #fff; padding: 0 0.5rem; font-size: 0.65rem; font-style: normal; font-weight: 600; color: #8b4e2e; }

  .ar-form-group { margin-bottom: 1rem; }
  .ar-form-label { font-size: 0.78rem; font-weight: 600; color: #2d1810; margin-bottom: 0.4rem; display: block; }
  .ar-form-textarea {
    width: 100%; border: 1.5px solid #f0ddd5; border-radius: 10px; padding: 0.75rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; background: #fff;
    transition: 0.2s; outline: none; resize: none;
  }
  .ar-form-textarea:focus { border-color: #c9856a; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .ar-form-textarea:disabled { background: #fdfaf8; color: #9a7060; cursor: not-allowed; }

  .ar-modal-footer {
    padding: 1.25rem 1.75rem; background: #fdf8f4; border-top: 1px solid #f5ede5;
    display: flex; justify-content: flex-end; gap: 0.75rem;
  }
  .ar-btn-ghost {
    padding: 0.55rem 1.1rem; border-radius: 99px; border: 1px solid #f0ddd5;
    background: transparent; color: #6b4a3a; font-size: 0.8rem; font-weight: 500;
    cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem;
  }
  .ar-btn-ghost:hover { background: #f5ede5; }
  .ar-btn-warn {
    padding: 0.55rem 1.1rem; border-radius: 99px; border: none;
    background: #fffbeb; color: #b45309; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem;
    box-shadow: 0 2px 8px rgba(217,119,6,0.1);
  }
  .ar-btn-warn:hover { background: #fef3c7; }
  .ar-btn-danger {
    padding: 0.55rem 1.1rem; border-radius: 99px; border: none;
    background: #ef4444; color: #fff; font-size: 0.8rem; font-weight: 600;
    cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem;
    box-shadow: 0 4px 12px rgba(239,68,68,0.25);
  }
  .ar-btn-danger:hover { background: #dc2626; transform: translateY(-1px); }

  .animate-spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .ar-empty { padding: 4rem; text-align: center; color: #9a7060; font-size: 0.9rem; }
`;

const SEVERITY_MAP = {
  FAKE_PROFILE: "MED",
  INAPPROPRIATE_CONTENT: "HIGH",
  HARASSMENT: "HIGH",
  SPAM: "LOW",
  FRAUD: "HIGH",
  UNDERAGE: "HIGH",
  COPYRIGHT_INFRINGEMENT: "MED",
  OTHER: "LOW",
};

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [notes, setNotes] = useState("");
  const [action, setAction] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await AdminService.getAdminReports();
      setReports(res.data || []);
    } catch (err) {
      console.error("Fetch reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (r) => {
    setModal(r);
    setNotes(r.adminNotes || "");
    setAction(r.actionTaken || "");
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setNotes("");
    setAction("");
  };

  const doAction = async (status, actionStr) => {
    try {
      setSaving(true);
      await AdminService.takeReportAction(modal.id, {
        status,
        adminNotes: notes,
        actionTaken: actionStr || action
      });
      fetchReports();
      closeModal();
    } catch (err) {
      alert("Failed to update report");
    } finally {
      setSaving(false);
    }
  };

  const filtered = reports.filter((r) => {
    const matchesFilter = filter === "ALL" || r.status === filter;
    const matchesSearch =
      r.reportedUserEmail?.toLowerCase().includes(search.toLowerCase()) ||
      r.reporterEmail?.toLowerCase().includes(search.toLowerCase()) ||
      r.reason?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "PENDING").length,
    review: reports.filter((r) => r.status === "UNDER_REVIEW").length,
    urgent: reports.filter((r) => r.status === "PENDING" && SEVERITY_MAP[r.reason] === "HIGH").length,
  };

  const badgeClass = (s) => {
    if (s === "PENDING") return "pending";
    if (s === "UNDER_REVIEW") return "review";
    if (s === "RESOLVED") return "resolved";
    return "dismissed";
  };

  const badgeLabel = (s) => s?.replace("_", " ");

  const severityClass = (r) => {
    const s = SEVERITY_MAP[r] ?? "LOW";
    return s === "HIGH" ? "high" : s === "MED" ? "med" : "low";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ar-root">
        {/* ── HEADER ── */}
        <div className="ar-header">
          <div>
            <div className="ar-eyebrow"><span style={{ color: "#e8c9b8" }}>✦</span> Security & Safety</div>
            <h1 className="ar-page-title">Moderation <span>Queue</span></h1>
            <p className="ar-page-sub">Review community reports, handle policy violations, and maintain platform integrity.</p>
          </div>
          <div className="ar-chips">
            <div className="ar-chip">
              <span className="ar-chip-label">Total Reports</span>
              <span className="ar-chip-val">{stats.total}</span>
            </div>
            <div className="ar-chip">
              <span className="ar-chip-label">Pending</span>
              <span className="ar-chip-val warn">{stats.pending}</span>
            </div>
            <div className="ar-chip">
              <span className="ar-chip-label">Critical Cases</span>
              <span className="ar-chip-val red">{stats.urgent}</span>
            </div>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="ar-toolbar">
          <div className="ar-search-wrap">
            <SearchIcon size={15} className="ar-search-icon" />
            <input
              type="text"
              className="ar-search-input"
              placeholder="Search by user email or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ar-filters">
            {["ALL", "PENDING", "UNDER_REVIEW", "RESOLVED"].map((f) => (
              <button
                key={f}
                className={`ar-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" && <FilterIcon size={12} />}
                {f.replace("_", " ")}
              </button>
            ))}
            <button className="ar-act-btn" onClick={fetchReports} title="Refresh Data">
              <RefreshCwIcon size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="ar-table-card">
          <table className="ar-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Users Involved</th>
                <th>Reason</th>
                <th>Severity</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="ar-empty">
                    <Loader2Icon size={30} className="animate-spin" style={{ margin: "0 auto 1rem", display: "block" }} />
                    Loading reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="ar-empty">No reports found matching your criteria.</td>
                </tr>
              ) : filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="ar-ref">R-{r.id}</div>
                    <div className="ar-ref-date">{formatDate(r.createdAt)}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#2d1810" }}>{r.reportedUserEmail}</div>
                    <div style={{ fontSize: "0.69rem", color: "#c4a898" }}>Reported by {r.reporterEmail}</div>
                  </td>
                  <td style={{ fontSize: "0.79rem", color: "#6b4a3a" }}>{r.reason?.replace("_", " ")}</td>
                  <td>
                    <span className={`ar-severity ${severityClass(r.reason)}`}>
                      {(SEVERITY_MAP[r.reason] ?? "LOW")}
                    </span>
                  </td>
                  <td>
                    <span className={`ar-badge ${badgeClass(r.status)}`}>
                      {badgeLabel(r.status)}
                    </span>
                  </td>
                  <td>
                    <div className="ar-row-actions">
                      <button className="ar-act-btn" onClick={() => openModal(r)}>
                        <EyeIcon size={13} /> {r.status === "PENDING" ? "Review" : "Details"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── REVIEW MODAL ── */}
        {modal && (
          <div className="ar-overlay" onClick={closeModal}>
            <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ar-modal-hdr">
                <div>
                  <div className="ar-modal-title">Case #R-{modal.id}</div>
                  <div className="ar-modal-sub">{formatDate(modal.createdAt)} · {modal.reason?.replace("_", " ")}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span className={`ar-badge ${badgeClass(modal.status)}`}>{badgeLabel(modal.status)}</span>
                  <button className="ar-modal-close" onClick={closeModal}><XIcon size={14} /></button>
                </div>
              </div>

              <div className="ar-modal-body">
                <div className="ar-detail-grid">
                  <div>
                    <div className="ar-detail-label">Reported User</div>
                    <div className="ar-detail-value">{modal.reportedUserName}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9a7060" }}>{modal.reportedUserEmail}</div>
                  </div>
                  <div>
                    <div className="ar-detail-label">Reporter</div>
                    <div className="ar-detail-value" style={{ fontSize: "0.8rem" }}>{modal.reporterEmail}</div>
                  </div>
                  <div>
                    <div className="ar-detail-label">Category</div>
                    <div className="ar-detail-value">{modal.reason?.replace("_", " ")}</div>
                  </div>
                  <div>
                    <div className="ar-detail-label">Calculated Severity</div>
                    <div className="ar-detail-value">
                      <span className={`ar-severity ${severityClass(modal.reason)}`}>
                        {SEVERITY_MAP[modal.reason] ?? "LOW"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ar-desc-box">
                  "{modal.description}"
                  <div className="ar-desc-by">— Reporter's Statement</div>
                </div>

                <div className="ar-form-group">
                  <label className="ar-form-label">Internal Admin Notes</label>
                  <textarea
                    className="ar-form-textarea"
                    rows={3}
                    disabled={modal.status === "RESOLVED" || modal.status === "DISMISSED" || saving}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Document your investigation findings here..."
                  />
                </div>

                {(modal.status === "RESOLVED" || modal.status === "DISMISSED") && (
                  <div className="ar-form-group">
                    <label className="ar-form-label">Final Action Taken</label>
                    <div style={{ fontSize: "0.85rem", color: "#8b4e2e", fontWeight: 500 }}>
                      {modal.actionTaken || "Case closed without specific action notes."}
                    </div>
                  </div>
                )}
              </div>

              <div className="ar-modal-footer">
                <button className="ar-btn-ghost" onClick={closeModal} disabled={saving}>
                  {modal.status === "PENDING" ? "Cancel" : "Close"}
                </button>
                {modal.status === "PENDING" && (
                  <>
                    <button className="ar-btn-ghost" onClick={() => doAction("DISMISSED", "Dismissed - No violation found.")} disabled={saving}>
                      <ShieldOffIcon size={13} /> Dismiss
                    </button>
                    <button className="ar-btn-warn" onClick={() => doAction("RESOLVED", "Resolved - User warned.")} disabled={saving}>
                      <AlertTriangleIcon size={13} /> Warn User
                    </button>
                    <button className="ar-btn-danger" onClick={() => doAction("RESOLVED", "Resolved - Account locked permanently.")} disabled={saving}>
                      <CheckIcon size={13} /> Lock User
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

export default AdminReports;