import React, { useState, useEffect } from "react";
import {
  SearchIcon, UserPlusIcon, Trash2Icon, ShieldIcon,
  LockIcon, UnlockIcon, EyeIcon, XIcon, ChevronDownIcon,
  UsersIcon, AlertCircleIcon, CrownIcon, SparklesIcon,
  CheckIcon, Loader2Icon,
} from "lucide-react";
import AdminService from "../services/admin.service";
import UserRow from "../components/admin/UserRow";
import UserRowSkeleton from "../components/skeletons/UserRowSkeleton";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .au2-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .au2-root {
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: transparent;
  }

  /* ── PAGE HEADER ── */
  .au2-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem; }
  .au2-header-left {}
  .au2-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.3rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .au2-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 600; color: #2d1810; line-height: 1.15; margin-bottom: 0.25rem;
  }
  .au2-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .au2-page-sub { font-size: 0.83rem; color: #9a7060; }
  .au2-header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

  /* Buttons */
  .au2-btn-primary {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.6rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(200,160,80,0.3);
    transition: all 0.2s;
  }
  .au2-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(200,160,80,0.42); }

  .au2-btn-danger {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.6rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: #fef2f2; color: #b91c1c;
    border: 1px solid #fecaca; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .au2-btn-danger:hover { background: #fee2e2; border-color: #fca5a5; }

  .au2-btn-ghost {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1rem; border-radius: 99px;
    font-size: 0.8rem; font-weight: 500;
    background: transparent; color: #9a7060;
    border: 1px solid #f0ddd5; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .au2-btn-ghost:hover { background: #fdf5ee; color: #4a3028; border-color: #e8c9b8; }

  /* ── STATS + SEARCH ROW ── */
  .au2-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem; }
  .au2-stats { display: flex; gap: 0.85rem; }

  .au2-stat-chip {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 12px; padding: 0.65rem 1.1rem;
    display: flex; flex-direction: column; gap: 1px;
  }
  .au2-stat-chip-label { font-size: 0.68rem; color: #9a7060; }
  .au2-stat-chip-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #2d1810; line-height: 1;
  }
  .au2-stat-chip-value.red { color: #dc2626; }

  .au2-search-field { position: relative; }
  .au2-search-field svg { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #c9856a; pointer-events: none; }
  .au2-search-input {
    padding: 0.6rem 1rem 0.6rem 2.4rem;
    border-radius: 99px; border: 1.5px solid #f0ddd5;
    background: #fff; font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif; color: #2d1810;
    width: 280px; outline: none; transition: all 0.2s;
  }
  .au2-search-input::placeholder { color: #c4a898; }
  .au2-search-input:focus { border-color: #c9856a; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  /* ── TABLE CARD ── */
  .au2-table-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 16px; overflow: hidden;
  }

  .au2-table { width: 100%; border-collapse: collapse; text-align: left; }
  .au2-table th {
    padding: 0.7rem 1.25rem; font-size: 0.66rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.08em; color: #9a7060;
    background: #fdf8f4; border-bottom: 1px solid #f5ede5;
  }
  .au2-table td {
    padding: 0.85rem 1.25rem; font-size: 0.81rem; color: #4a3028;
    border-bottom: 1px solid #fdf5ee; vertical-align: middle;
  }
  .au2-table tr:last-child td { border-bottom: none; }
  .au2-table tbody tr { transition: background 0.15s; }
  .au2-table tbody tr:hover td { background: #fdf8f4; }

  .au2-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #c9856a);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.74rem; font-weight: 600; color: #e8c97a; letter-spacing: 0.03em;
  }
  .au2-user-name { font-weight: 500; font-size: 0.83rem; color: #2d1810; margin-bottom: 1px; }
  .au2-user-date { font-size: 0.68rem; color: #c4a898; }

  /* Status / Role badges */
  .au2-badge {
    display: inline-flex; align-items: center; gap: 0.25rem;
    padding: 0.18rem 0.65rem; border-radius: 99px;
    font-size: 0.69rem; font-weight: 600; white-space: nowrap;
  }
  .au2-badge.green  { background: #f0fdf4; color: #16a34a; }
  .au2-badge.red    { background: #fef2f2; color: #dc2626; }
  .au2-badge.brown  { background: #fdf5ee; color: #8b4e2e; }
  .au2-badge.purple { background: #faf5ff; color: #7c3aed; }
  .au2-badge.dark   { background: linear-gradient(135deg, #3d1f12, #8b4e2e); color: #e8c97a; }

  /* Row action buttons */
  .au2-actions { display: flex; gap: 0.4rem; justify-content: flex-end; }
  .au2-action-btn {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.32rem 0.7rem; border-radius: 99px;
    font-size: 0.71rem; font-weight: 500;
    border: 1px solid #f0ddd5; background: #fdf8f4;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    color: #6b4a3a; transition: all 0.18s;
  }
  .au2-action-btn:hover { background: #fff; border-color: #e8c9b8; color: #2d1810; }
  .au2-action-btn.lock   { color: #d97706; border-color: #fde68a; background: #fffbeb; }
  .au2-action-btn.lock:hover   { background: #fef3c7; border-color: #fbbf24; }
  .au2-action-btn.unlock { color: #16a34a; border-color: #bbf7d0; background: #f0fdf4; }
  .au2-action-btn.unlock:hover { background: #dcfce7; border-color: #86efac; }
  .au2-action-btn.del    { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
  .au2-action-btn.del:hover    { background: #fee2e2; border-color: #fca5a5; }

  /* Empty state */
  .au2-empty {
    text-align: center; padding: 3rem 1.5rem;
  }
  .au2-empty-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border: 1px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.85rem;
  }
  .au2-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 600; color: #2d1810; margin-bottom: 0.35rem; }
  .au2-empty-sub { font-size: 0.8rem; color: #9a7060; }

  /* ── MODAL OVERLAY ── */
  .au2-overlay {
    position: fixed; inset: 0; background: rgba(30,8,2,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; padding: 1.5rem;
  }

  .au2-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 460px;
    overflow: hidden; box-shadow: 0 24px 64px rgba(61,31,18,0.25);
    border: 1px solid #f0ddd5;
  }

  .au2-modal-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 1.4rem 1.6rem; border-bottom: 1px solid #f5ede5;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
  }
  .au2-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 600; color: #2d1810; margin-bottom: 0.15rem;
  }
  .au2-modal-sub { font-size: 0.75rem; color: #9a7060; }
  .au2-modal-close {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    border: 1px solid #f0ddd5; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #9a7060; transition: all 0.2s;
  }
  .au2-modal-close:hover { background: #fdf0e8; color: #4a3028; border-color: #e8c9b8; }

  .au2-modal-body { padding: 1.5rem 1.6rem; display: flex; flex-direction: column; gap: 1rem; }

  .au2-form-group { display: flex; flex-direction: column; gap: 0.35rem; }
  .au2-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
  .au2-form-label { font-size: 0.75rem; font-weight: 500; color: #6b4a3a; letter-spacing: 0.02em; }
  .au2-form-input,
  .au2-form-select {
    width: 100%; padding: 0.6rem 0.9rem;
    border: 1.5px solid #f0ddd5; border-radius: 10px;
    font-size: 0.83rem; font-family: 'DM Sans', sans-serif;
    color: #2d1810; background: #fdf8f4;
    outline: none; transition: all 0.2s;
    -webkit-appearance: none; appearance: none;
  }
  .au2-form-input::placeholder { color: #c4a898; }
  .au2-form-input:focus,
  .au2-form-select:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .au2-select-wrap { position: relative; }
  .au2-select-wrap svg { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: #9a7060; pointer-events: none; }
  .au2-form-select { padding-right: 2.25rem; cursor: pointer; }

  .au2-modal-footer {
    display: flex; justify-content: flex-end; gap: 0.65rem;
    padding: 1rem 1.6rem; border-top: 1px solid #f5ede5;
    background: #fdf8f4;
  }

  /* View modal grid */
  .au2-view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .au2-view-field-label { font-size: 0.67rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #c4a898; margin-bottom: 0.25rem; }
  .au2-view-field-value { font-size: 0.84rem; color: #2d1810; font-weight: 500; }

  .au2-view-avatar-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
  .au2-view-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #c9856a);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 600; color: #e8c97a;
    font-family: 'Cormorant Garamond', serif;
  }

  /* Confirm dialog */
  .au2-confirm-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 380px;
    overflow: hidden; box-shadow: 0 24px 64px rgba(61,31,18,0.25);
    border: 1px solid #f0ddd5;
    text-align: center; padding: 2rem 1.75rem;
  }
  .au2-confirm-icon {
    width: 52px; height: 52px; border-radius: 50%; margin: 0 auto 1rem;
    display: flex; align-items: center; justify-content: center;
  }
  .au2-confirm-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: #2d1810; margin-bottom: 0.5rem; }
  .au2-confirm-sub { font-size: 0.82rem; color: #9a7060; line-height: 1.6; margin-bottom: 1.5rem; }
  .au2-confirm-btns { display: flex; gap: 0.65rem; justify-content: center; }

  .au2-ornament { color: #e8c9b8; font-size: 0.6rem; letter-spacing: 0.2em; }
`;

const roleBadgeClass = (role) =>
  role === "SUPER_ADMIN" ? "dark" : role === "ADMIN" ? "purple" : "brown";

/* ─── Component ───────────────────────────────────────────────────────────── */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser]   = useState({ firstName: "", lastName: "", email: "", password: "", role: "USER" });
  const [search, setSearch]     = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [confirm, setConfirm]   = useState(null); // { type, user }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllUsers();
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  /* actions */
  const doLockToggle = React.useCallback(async (user) => {
    try {
      const isCurrentlyLocked = user.accountLockedUntil && new Date(user.accountLockedUntil) > new Date();
      const lockUntil = isCurrentlyLocked ? new Date(0).toISOString() : null;
      
      await AdminService.adminLockAccount(user.email, lockUntil);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to toggle account lock");
    } finally {
      setConfirm(null);
    }
  }, []);

  const doDelete = React.useCallback(async (user) => {
    try {
      await AdminService.adminSoftDeleteUser(user.email);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to delete user");
    } finally {
      setConfirm(null);
    }
  }, []);

  const doRoleChange = React.useCallback(async (user) => {
    try {
      const next = user.role === "USER" ? "ADMIN" : "USER";
      await AdminService.adminChangeRole(user.email, next);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to change user role");
    } finally {
      setConfirm(null);
    }
  }, []);

  const handleView = React.useCallback((user) => {
    setViewUser(user);
  }, []);

  const handleConfirmAction = React.useCallback((type, user) => {
    setConfirm({ type, user });
  }, []);

  const doAddUser = async (e) => {
    e.preventDefault();
    try {
      await AdminService.adminCreateUser(newUser);
      setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "USER" });
      setShowAdd(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to create user");
    }
  };

  const doPurge = async () => {
    try {
      await AdminService.purgeSoftDeletedUsers();
      fetchUsers();
    } catch (err) {
      alert(err.message || "Failed to purge deleted users");
    } finally {
      setConfirm(null);
    }
  };

  const isLocked = (user) => user.accountLockedUntil && new Date(user.accountLockedUntil) > new Date();
  
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div className="au2-root">

        {/* ── PAGE HEADER ── */}
        <div className="au2-header">
          <div className="au2-header-left">
            <div className="au2-eyebrow"><span className="au2-ornament">✦</span> Admin Panel</div>
            <h1 className="au2-page-title">User <span>Management</span></h1>
            <p className="au2-page-sub">View, edit, lock, or remove member accounts across the platform.</p>
          </div>
          <div className="au2-header-actions">
            <button className="au2-btn-danger" onClick={() => setConfirm({ type: "purge" })}>
              <Trash2Icon size={13} /> Purge Deleted
            </button>
            <button className="au2-btn-primary" onClick={() => setShowAdd(true)}>
              <UserPlusIcon size={13} /> Add Member
            </button>
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="au2-toolbar">
          <div className="au2-stats">
            <div className="au2-stat-chip">
              <span className="au2-stat-chip-label">Total Members</span>
              <span className="au2-stat-chip-value">{users.length}</span>
            </div>
            <div className="au2-stat-chip">
              <span className="au2-stat-chip-label">Locked Accounts</span>
              <span className="au2-stat-chip-value red">{users.filter(u => isLocked(u)).length}</span>
            </div>
            <div className="au2-stat-chip">
              <span className="au2-stat-chip-label">Admins</span>
              <span className="au2-stat-chip-value">{users.filter(u => u.role && u.role.includes("ADMIN")).length}</span>
            </div>
          </div>
          <div className="au2-search-field">
            <SearchIcon size={14} />
            <input
              className="au2-search-input"
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="au2-table-card">
          <table className="au2-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <UserRowSkeleton key={i} />
                ))
              ) : error ? (
                <tr>
                  <td colSpan="5">
                    <div className="au2-empty">
                      <div className="au2-empty-icon"><AlertCircleIcon size={20} style={{ color: "#dc2626" }} /></div>
                      <div className="au2-empty-title">Error</div>
                      <p className="au2-empty-sub">{error}</p>
                      <button className="au2-btn-ghost" onClick={fetchUsers} style={{ marginTop: "1rem" }}>Retry</button>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? filtered.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  isLocked={isLocked}
                  formatDate={formatDate}
                  roleBadgeClass={roleBadgeClass}
                  onView={handleView}
                  onRoleChange={(u) => handleConfirmAction("role", u)}
                  onLockToggle={(u) => handleConfirmAction("lock", u)}
                  onDelete={(u) => handleConfirmAction("delete", u)}
                />
              )) : (
                <tr>
                  <td colSpan="5">
                    <div className="au2-empty">
                      <div className="au2-empty-icon"><SearchIcon size={20} style={{ color: "#c9856a" }} /></div>
                      <div className="au2-empty-title">No members found</div>
                      <p className="au2-empty-sub">No results matched "<strong>{search}</strong>". Try a different search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── VIEW MODAL ── */}
        {viewUser && (
          <div className="au2-overlay" onClick={() => setViewUser(null)}>
            <div className="au2-modal" onClick={e => e.stopPropagation()}>
              <div className="au2-modal-header">
                <div>
                  <div className="au2-modal-title">Member Profile</div>
                  <div className="au2-modal-sub">UID #{viewUser.id}</div>
                </div>
                <button className="au2-modal-close" onClick={() => setViewUser(null)}><XIcon size={14} /></button>
              </div>
              <div className="au2-modal-body">
                <div className="au2-view-avatar-row">
                  <div className="au2-view-avatar">{viewUser.firstName[0]}{viewUser.lastName[0]}</div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: "#2d1810" }}>
                      {viewUser.firstName} {viewUser.lastName}
                    </div>
                    <span className={`au2-badge ${roleBadgeClass(viewUser.role)}`} style={{ marginTop: 4, display: "inline-flex" }}>
                      {viewUser.role}
                    </span>
                  </div>
                </div>
                <div className="au2-view-grid">
                  <div>
                    <div className="au2-view-field-label">Email</div>
                    <div className="au2-view-field-value">{viewUser.email}</div>
                  </div>
                  <div>
                    <div className="au2-view-field-label">Status</div>
                    <div className="au2-view-field-value">
                      <span className={`au2-badge ${isLocked(viewUser) ? "red" : "green"}`}>
                        {isLocked(viewUser) ? "Locked" : "Active"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="au2-view-field-label">Member Since</div>
                    <div className="au2-view-field-value">{formatDate(viewUser.createdAt)}</div>
                  </div>
                  <div>
                    <div className="au2-view-field-label">Account ID</div>
                    <div className="au2-view-field-value">#{viewUser.id}</div>
                  </div>
                </div>
              </div>
              <div className="au2-modal-footer">
                <button className="au2-btn-ghost" onClick={() => setViewUser(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── ADD USER MODAL ── */}
        {showAdd && (
          <div className="au2-overlay" onClick={() => setShowAdd(false)}>
            <div className="au2-modal" onClick={e => e.stopPropagation()}>
              <div className="au2-modal-header">
                <div>
                  <div className="au2-modal-title">Add New Member</div>
                  <div className="au2-modal-sub">Create a platform account manually</div>
                </div>
                <button className="au2-modal-close" onClick={() => setShowAdd(false)}><XIcon size={14} /></button>
              </div>
              <form onSubmit={doAddUser}>
                <div className="au2-modal-body">
                  <div className="au2-form-row">
                    <div className="au2-form-group">
                      <label className="au2-form-label">First Name</label>
                      <input className="au2-form-input" type="text" required placeholder="e.g. Kasun"
                        value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} />
                    </div>
                    <div className="au2-form-group">
                      <label className="au2-form-label">Last Name</label>
                      <input className="au2-form-input" type="text" required placeholder="e.g. Perera"
                        value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div className="au2-form-group">
                    <label className="au2-form-label">Email Address</label>
                    <input className="au2-form-input" type="email" required placeholder="member@example.com"
                      value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  </div>
                  <div className="au2-form-group">
                    <label className="au2-form-label">Initial Password</label>
                    <input className="au2-form-input" type="password" required placeholder="Min 6 characters"
                      value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  </div>
                  <div className="au2-form-group">
                    <label className="au2-form-label">Role</label>
                    <div className="au2-select-wrap">
                      <select className="au2-form-select" value={newUser.role}
                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="USER">Standard Member</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                      <ChevronDownIcon size={13} />
                    </div>
                  </div>
                </div>
                <div className="au2-modal-footer">
                  <button type="button" className="au2-btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                  <button type="submit" className="au2-btn-primary"><UserPlusIcon size={13} /> Create Member</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── CONFIRM DIALOG ── */}
        {confirm && (
          <div className="au2-overlay" onClick={() => setConfirm(null)}>
            <div className="au2-confirm-modal" onClick={e => e.stopPropagation()}>
              {confirm.type === "delete" && <>
                <div className="au2-confirm-icon" style={{ background: "#fef2f2" }}>
                  <Trash2Icon size={22} style={{ color: "#dc2626" }} />
                </div>
                <div className="au2-confirm-title">Delete Member?</div>
                <p className="au2-confirm-sub">
                  <strong>{confirm.user.firstName} {confirm.user.lastName}</strong> will be permanently removed. This cannot be undone.
                </p>
                <div className="au2-confirm-btns">
                  <button className="au2-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
                  <button className="au2-btn-danger" onClick={() => doDelete(confirm.user)}><Trash2Icon size={12} /> Delete</button>
                </div>
              </>}
              {confirm.type === "lock" && <>
                <div className="au2-confirm-icon" style={{ background: isLocked(confirm.user) ? "#f0fdf4" : "#fffbeb" }}>
                  {isLocked(confirm.user)
                    ? <UnlockIcon size={22} style={{ color: "#16a34a" }} />
                    : <LockIcon size={22} style={{ color: "#d97706" }} />
                  }
                </div>
                <div className="au2-confirm-title">{isLocked(confirm.user) ? "Unlock Account?" : "Lock Account?"}</div>
                <p className="au2-confirm-sub">
                  {isLocked(confirm.user)
                    ? <>This will restore access for <strong>{confirm.user.firstName}</strong>.</>
                    : <>This will prevent <strong>{confirm.user.firstName}</strong> from logging in.</>
                  }
                </p>
                <div className="au2-confirm-btns">
                  <button className="au2-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
                  <button
                    className={isLocked(confirm.user) ? "au2-btn-primary" : "au2-btn-danger"}
                    style={isLocked(confirm.user) ? {} : { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" }}
                    onClick={() => doLockToggle(confirm.user)}
                  >
                    {isLocked(confirm.user) ? <><UnlockIcon size={12} /> Unlock</> : <><LockIcon size={12} /> Lock</>}
                  </button>
                </div>
              </>}
              {confirm.type === "role" && <>
                <div className="au2-confirm-icon" style={{ background: "#faf5ff" }}>
                  <ShieldIcon size={22} style={{ color: "#7c3aed" }} />
                </div>
                <div className="au2-confirm-title">Change Role?</div>
                <p className="au2-confirm-sub">
                  Change <strong>{confirm.user.firstName}'s</strong> role from{" "}
                  <strong>{confirm.user.role}</strong> to{" "}
                  <strong>{confirm.user.role === "USER" ? "ADMIN" : "USER"}</strong>?
                </p>
                <div className="au2-confirm-btns">
                  <button className="au2-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
                  <button className="au2-btn-primary" onClick={() => doRoleChange(confirm.user)}><CheckIcon size={12} /> Confirm</button>
                </div>
              </>}
              {confirm.type === "purge" && <>
                <div className="au2-confirm-icon" style={{ background: "#fef2f2" }}>
                  <AlertCircleIcon size={22} style={{ color: "#dc2626" }} />
                </div>
                <div className="au2-confirm-title">Purge Deleted Users?</div>
                <p className="au2-confirm-sub">
                  This will permanently erase all soft-deleted accounts from the database. This cannot be reversed.
                </p>
                <div className="au2-confirm-btns">
                  <button className="au2-btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
                  <button className="au2-btn-danger" onClick={() => doPurge()}><Trash2Icon size={12} /> Purge All</button>
                </div>
              </>}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminUsers;