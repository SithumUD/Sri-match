// ConnectionsPage.jsx - Redesigned to match SriMatch luxury aesthetic
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { dummyProfiles } from "../data/dummyData";
import { UserPlus, User, Check, X, MessageCircle, MapPin, Briefcase, Heart, Users, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .cp-root * { box-sizing: border-box; }

  .cp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2rem 1.5rem 5rem;
  }

  .cp-inner { max-width: 860px; margin: 0 auto; }

  /* ── Page header ── */
  .cp-page-header { margin-bottom: 1.75rem; }
  .cp-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #2d1810; line-height: 1.1;
  }
  .cp-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .cp-page-sub { font-size: 0.83rem; color: #9a7060; margin-top: 0.2rem; }

  /* ── Stats row ── */
  .cp-stats-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0.85rem; margin-bottom: 1.75rem;
  }
  .cp-stat-card {
    background: #fff; border-radius: 16px;
    box-shadow: 0 6px 20px rgba(120,60,30,0.07), 0 2px 6px rgba(0,0,0,0.03);
    padding: 1.1rem 1.25rem;
    display: flex; align-items: center; gap: 0.85rem;
  }
  .cp-stat-icon {
    width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .cp-stat-icon.connections { background: linear-gradient(135deg, #fdf0e8, #f5ddd0); }
  .cp-stat-icon.requests    { background: linear-gradient(135deg, #edf5fd, #d0e8f8); }
  .cp-stat-icon.liked       { background: linear-gradient(135deg, #fde8ef, #f8d0dc); }
  .cp-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600; color: #2d1810; line-height: 1;
  }
  .cp-stat-label { font-size: 0.72rem; color: #9a7060; margin-top: 1px; }

  /* ── Main card ── */
  .cp-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
  }

  /* ── Tabs ── */
  .cp-tabs-header {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.5rem 2rem 0;
  }
  .cp-tabs-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600; color: #fff;
    margin-bottom: 1rem;
  }
  .cp-tabs-nav { display: flex; gap: 0.25rem; }
  .cp-tab-btn {
    padding: 0.6rem 1.25rem;
    font-size: 0.8rem; font-weight: 500;
    background: rgba(255,255,255,0.12); border: none;
    border-radius: 10px 10px 0 0; color: rgba(255,255,255,0.7);
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .cp-tab-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
  .cp-tab-btn.active { background: #fdf8f4; color: #8b4e2e; }

  .cp-tab-badge {
    background: rgba(255,255,255,0.25); color: #fff;
    font-size: 0.65rem; font-weight: 600;
    padding: 1px 6px; border-radius: 99px; min-width: 18px; text-align: center;
  }
  .cp-tab-btn.active .cp-tab-badge {
    background: linear-gradient(135deg, #8b4e2e, #c9856a); color: #fff;
  }

  /* ── Tab body ── */
  .cp-tab-body { padding: 1.75rem 2rem; }

  /* ── Profile cards ── */
  .cp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 640px) { .cp-grid { grid-template-columns: 1fr; } }

  .cp-profile-card {
    display: flex; flex-direction: column;
    border: 1px solid #f0ddd5; border-radius: 16px;
    overflow: hidden; transition: all 0.25s;
    background: #fff;
  }
  .cp-profile-card:hover {
    box-shadow: 0 10px 30px rgba(120,60,30,0.1);
    transform: translateY(-2px);
    border-color: #e8c9b8;
  }

  .cp-card-img-wrap { position: relative; height: 130px; overflow: hidden; }
  .cp-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
  .cp-profile-card:hover .cp-card-img { transform: scale(1.06); }
  .cp-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(30,10,5,0.55) 0%, transparent 55%);
    pointer-events: none;
  }
  .cp-card-img-name {
    position: absolute; bottom: 0.6rem; left: 0.75rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #fff;
  }

  .cp-card-body { padding: 0.85rem 1rem; flex: 1; }
  .cp-card-meta {
    display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.6rem;
  }
  .cp-card-tag {
    display: flex; align-items: center; gap: 3px;
    font-size: 0.7rem; padding: 0.2rem 0.55rem; border-radius: 99px;
  }
  .cp-card-tag.loc { background: #fdf0e8; color: #8b4e2e; }
  .cp-card-tag.job { background: #edf5fd; color: #3a6ea8; }

  .cp-card-actions {
    display: flex; gap: 0.4rem; padding: 0 1rem 0.85rem;
  }
  .cp-card-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.35rem;
    padding: 0.5rem 0.6rem; border-radius: 10px; font-size: 0.75rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; text-decoration: none;
    font-family: 'DM Sans', sans-serif; border: 1.5px solid #e8ddd8;
    background: #fdf8f5; color: #6b4a3a;
  }
  .cp-card-btn:hover { border-color: #c9856a; background: #fff5f0; }
  .cp-card-btn.primary {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 12px rgba(139,78,46,0.22);
  }
  .cp-card-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(139,78,46,0.3); }

  /* Request-specific action buttons */
  .cp-req-btn {
    width: 36px; height: 36px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .cp-req-btn.accept { background: #e0f5e8; color: #4a8a5e; }
  .cp-req-btn.accept:hover { background: #4a8a5e; color: #fff; transform: scale(1.1); }
  .cp-req-btn.decline { background: #f5e8e8; color: #a84a4a; }
  .cp-req-btn.decline:hover { background: #a84a4a; color: #fff; transform: scale(1.1); }

  /* Requests list layout */
  .cp-req-list { display: flex; flex-direction: column; gap: 0.85rem; }
  .cp-req-card {
    display: flex; align-items: center; gap: 1rem;
    padding: 1rem 1.1rem; border: 1px solid #f0ddd5;
    border-radius: 14px; background: #fff; transition: all 0.2s;
  }
  .cp-req-card:hover { box-shadow: 0 6px 20px rgba(120,60,30,0.08); border-color: #e8c9b8; }
  .cp-req-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #f0ddd5; flex-shrink: 0; }
  .cp-req-info { flex: 1; min-width: 0; }
  .cp-req-name { font-size: 0.92rem; font-weight: 500; color: #2d1810; margin-bottom: 2px; }
  .cp-req-sub { font-size: 0.75rem; color: #9a7060; display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .cp-req-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }

  /* ── Empty states ── */
  .cp-empty {
    text-align: center; padding: 3.5rem 2rem;
  }
  .cp-empty-icon {
    width: 68px; height: 68px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }
  .cp-empty h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600; color: #2d1810; margin-bottom: 0.4rem;
  }
  .cp-empty p { font-size: 0.84rem; color: #9a7060; margin-bottom: 1.5rem; line-height: 1.6; }
  .cp-empty-cta {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.65rem 1.5rem; border-radius: 99px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; text-decoration: none; font-size: 0.85rem; font-weight: 500;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28); transition: all 0.2s;
  }
  .cp-empty-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }

  /* ── Ornament ── */
  .cp-ornament {
    text-align: center; font-size: 0.72rem; color: #d4b8a8;
    letter-spacing: 0.15em; padding: 1.25rem 0 0.5rem;
    border-top: 1px solid #f5ede8; margin-top: 1rem;
  }

  @media (max-width: 600px) {
    .cp-root { padding: 1.25rem 1rem 4rem; }
    .cp-stats-row { grid-template-columns: 1fr 1fr; }
    .cp-tabs-header { padding: 1.25rem 1.25rem 0; }
    .cp-tab-body { padding: 1.25rem 1.25rem; }
    .cp-stat-card { padding: 0.85rem 1rem; }
    .cp-req-card { flex-wrap: wrap; }
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState("connections");
  const {
    connections = [],
    receivedRequests = [],
    likedProfiles = [],
    acceptFriendRequest,
    rejectFriendRequest,
  } = useAuth();

  const connectedProfiles = dummyProfiles.filter(p => connections.includes(p.id));
  const requestProfiles   = dummyProfiles.filter(p => receivedRequests.includes(p.id));

  return (
    <>
      <style>{styles}</style>
      <div className="cp-root">
        <div className="cp-inner">

          {/* Page header */}
          <div className="cp-page-header">
            <h1 className="cp-page-title">Your <span>Connections</span></h1>
            <p className="cp-page-sub">Manage your matches, requests, and relationships</p>
          </div>

          {/* Stats row */}
          <div className="cp-stats-row">
            <div className="cp-stat-card">
              <div className="cp-stat-icon connections">
                <Users size={20} style={{ color: "#8b4e2e" }} />
              </div>
              <div>
                <div className="cp-stat-num">{connections.length}</div>
                <div className="cp-stat-label">Connections</div>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon requests">
                <UserPlus size={20} style={{ color: "#3a6ea8" }} />
              </div>
              <div>
                <div className="cp-stat-num">{receivedRequests.length}</div>
                <div className="cp-stat-label">Pending Requests</div>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon liked">
                <Heart size={20} style={{ color: "#c03060" }} />
              </div>
              <div>
                <div className="cp-stat-num">{likedProfiles?.length || 0}</div>
                <div className="cp-stat-label">Liked Profiles</div>
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className="cp-card">

            {/* Tabs header */}
            <div className="cp-tabs-header">
              <div className="cp-tabs-title">People you know</div>
              <div className="cp-tabs-nav">
                <button
                  className={`cp-tab-btn${activeTab === "connections" ? " active" : ""}`}
                  onClick={() => setActiveTab("connections")}
                >
                  <Users size={13} /> Connections
                  <span className="cp-tab-badge">{connections.length}</span>
                </button>
                <button
                  className={`cp-tab-btn${activeTab === "requests" ? " active" : ""}`}
                  onClick={() => setActiveTab("requests")}
                >
                  <UserPlus size={13} /> Requests
                  {receivedRequests.length > 0 && (
                    <span className="cp-tab-badge">{receivedRequests.length}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab body */}
            <div className="cp-tab-body">

              {/* ── Connections Tab ── */}
              {activeTab === "connections" && (
                connectedProfiles.length === 0 ? (
                  <div className="cp-empty">
                    <div className="cp-empty-icon">
                      <Users size={28} style={{ color: "#c9856a" }} />
                    </div>
                    <h3>No connections yet</h3>
                    <p>Start browsing profiles and send connection requests<br />to build your network of potential matches.</p>
                    <Link to="/home" className="cp-empty-cta">
                      <Sparkles size={14} /> Browse Profiles
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="cp-grid">
                      {connectedProfiles.map(profile => (
                        <div key={profile.id} className="cp-profile-card">
                          <div className="cp-card-img-wrap">
                            <img src={profile.profileImage} alt={profile.firstName} className="cp-card-img" />
                            <div className="cp-card-img-overlay" />
                            <span className="cp-card-img-name">{profile.firstName}, {profile.age}</span>
                          </div>
                          <div className="cp-card-body">
                            <div className="cp-card-meta">
                              {profile.city && (
                                <span className="cp-card-tag loc">
                                  <MapPin size={9} />{profile.city}
                                </span>
                              )}
                              {profile.profession && (
                                <span className="cp-card-tag job">
                                  <Briefcase size={9} />{profile.profession}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="cp-card-actions">
                            <Link to={`/profile/${profile.id}`} className="cp-card-btn">
                              <User size={13} /> Profile
                            </Link>
                            <Link to={`/messages?user=${profile.id}`} className="cp-card-btn primary">
                              <MessageCircle size={13} /> Message
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </>
                )
              )}

              {/* ── Requests Tab ── */}
              {activeTab === "requests" && (
                requestProfiles.length === 0 ? (
                  <div className="cp-empty">
                    <div className="cp-empty-icon">
                      <UserPlus size={28} style={{ color: "#c9856a" }} />
                    </div>
                    <h3>No pending requests</h3>
                    <p>When someone sends you a connection request,<br />it will appear here for you to accept or decline.</p>
                    <Link to="/home" className="cp-empty-cta">
                      <Sparkles size={14} /> Discover Matches
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="cp-req-list">
                      {requestProfiles.map(profile => (
                        <div key={profile.id} className="cp-req-card">
                          <img src={profile.profileImage} alt={profile.firstName} className="cp-req-avatar" />
                          <div className="cp-req-info">
                            <div className="cp-req-name">
                              {profile.firstName} {profile.lastName}
                            </div>
                            <div className="cp-req-sub">
                              {profile.age && <span>{profile.age} yrs</span>}
                              {profile.city && <span><MapPin size={10} style={{ display: "inline", verticalAlign: "middle" }} /> {profile.city}</span>}
                              {profile.profession && <span>{profile.profession}</span>}
                            </div>
                          </div>
                          <div className="cp-req-actions">
                            <button
                              className="cp-req-btn accept"
                              title="Accept Request"
                              onClick={() => acceptFriendRequest(profile.id)}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              className="cp-req-btn decline"
                              title="Decline Request"
                              onClick={() => rejectFriendRequest(profile.id)}
                            >
                              <X size={16} />
                            </button>
                            <Link to={`/profile/${profile.id}`} className="cp-card-btn" style={{ width: "auto", flex: "none", padding: "0.45rem 0.75rem", textDecoration: "none" }}>
                              <User size={13} /> View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="cp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                  </>
                )
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectionsPage;