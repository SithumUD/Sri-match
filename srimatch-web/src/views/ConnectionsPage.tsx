"use client";

// ConnectionsPage.jsx - Redesigned to match SriMatch luxury aesthetic
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserPlus, User, Check, X, MessageCircle, MapPin, Briefcase, Heart, Users, ChevronRight, Sparkles, Eye, Loader2, Lock } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useConnectionsOverview } from "../hooks/useConnections";

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

  /* ── Blurred like card ── */
  .cp-like-card-blurred {
    cursor: pointer;
    position: relative;
  }
  .cp-like-card-blurred:hover {
    box-shadow: 0 10px 30px rgba(120,60,30,0.18);
    transform: translateY(-2px);
    border-color: #c9856a;
  }

  /* Blurred image fill */
  .cp-blurred-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: blur(18px);
    transform: scale(1.1); /* hide blur edges */
    transition: filter 0.3s;
  }

  /* Blurred text content */
  .cp-blurred-text {
    filter: blur(6px);
    user-select: none;
    pointer-events: none;
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

  /* ── Blurred card lock overlay ── */
  .cp-lock-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    gap: 0.4rem;
  }
  .cp-lock-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    background: rgba(20, 8, 4, 0.62);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 14px;
    padding: 0.75rem 1.1rem;
    color: #fff;
  }
  .cp-lock-badge svg { opacity: 0.95; }
  .cp-lock-badge span {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.9;
  }

  /* ── Premium banner above likes grid ── */
  .cp-premium-banner {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 14px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    margin-bottom: 1.25rem;
    color: #fff;
  }
  .cp-premium-banner-icon {
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cp-premium-banner-text { flex: 1; }
  .cp-premium-banner-text strong {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 600; display: block; margin-bottom: 2px;
  }
  .cp-premium-banner-text span { font-size: 0.75rem; opacity: 0.82; }
  .cp-premium-banner-cta {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.5rem 1rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600;
    background: #fff; color: #8b4e2e; text-decoration: none;
    white-space: nowrap; transition: all 0.2s; flex-shrink: 0;
  }
  .cp-premium-banner-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }

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
    .cp-premium-banner { flex-wrap: wrap; }
  }
`;

/* ─── Blurred Like Card ──────────────────────────────────────────────────── */
const BlurredLikeCard = ({ like, isPremium, onUnlockClick }) => {
  const isBlurred = !isPremium || like.isBlurred;

  if (!isBlurred) {
    // Premium user, fully visible
    return (
      <Link href={`/profile/${like.sender.id}`} style={{ textDecoration: 'none' }}>
        <div className="cp-profile-card">
          <div className="cp-card-img-wrap">
            <img src={like.sender.profileImage || like.sender.profileImageUrl || "/default-avatar.png"} alt={like.sender.firstName || like.sender.name} className="cp-card-img" />
            <div className="cp-card-img-overlay" />
            <span className="cp-card-img-name">{like.sender.firstName || like.sender.name}, {like.sender.age}</span>
          </div>
          <div className="cp-card-body">
            <div className="cp-card-meta">
              <span className="cp-card-tag loc"><MapPin size={9} />{like.sender.city || "Sri Lanka"}</span>
              {like.sender.profession && (
                <span className="cp-card-tag job"><Briefcase size={9} />{like.sender.profession}</span>
              )}
            </div>
          </div>
          <div className="cp-card-actions">
            <button className="cp-card-btn primary" style={{ width: '100%' }}>
              <User size={13} /> View Profile
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Free user — fully blurred card
  return (
    <div className="cp-profile-card cp-like-card-blurred" onClick={onUnlockClick}>
      {/* Image section — blurred */}
      <div className="cp-card-img-wrap" style={{ position: 'relative' }}>
        <img
          src={like.sender.profileImage || like.sender.profileImageUrl || "/default-avatar.png"}
          alt="Hidden profile"
          className="cp-blurred-img"
        />
        {/* Dark gradient overlay */}
        <div className="cp-card-img-overlay" />
        {/* Lock badge centered over image */}
        <div className="cp-lock-overlay">
          <div className="cp-lock-badge">
            <Lock size={18} />
            <span>Premium Only</span>
          </div>
        </div>
        {/* Blurred name placeholder */}
        <span className="cp-card-img-name cp-blurred-text" style={{ zIndex: 1 }}>
          ███████, ██
        </span>
      </div>

      {/* Body section — blurred */}
      <div className="cp-card-body">
        <div className="cp-card-meta cp-blurred-text">
          <span className="cp-card-tag loc"><MapPin size={9} />██████████</span>
          <span className="cp-card-tag job"><Briefcase size={9} />████████</span>
        </div>
      </div>

      {/* Action — unlock CTA */}
      <div className="cp-card-actions">
        <Link href="/subscription"
          className="cp-card-btn primary"
          style={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Sparkles size={13} /> Unlock
        </Link>
      </div>
    </div>
  );
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const ConnectionsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("matches");

  const { data: overview, isLoading: loading } = useConnectionsOverview(50);

  const isPremium = overview?.isPremium ?? (user?.premium || false);
  const stats = {
    views: overview?.profileViews ?? 0,
    likes: overview?.totalLikesCount ?? 0,
    matches: overview?.totalMatchesCount ?? (overview?.matches?.length ?? 0),
  };
  const matches = overview?.matches || [];
  const receivedLikes = overview?.receivedLikes || [];
  const starLikes = overview?.starLikes || [];

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
                <Eye size={20} style={{ color: "#8b4e2e" }} />
              </div>
              <div>
                <div className="cp-stat-num">{stats.views}</div>
                <div className="cp-stat-label">Profile Views</div>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon requests">
                <Heart size={20} style={{ color: "#3a6ea8" }} />
              </div>
              <div>
                <div className="cp-stat-num">{stats.likes}</div>
                <div className="cp-stat-label">Likes Received</div>
              </div>
            </div>
            <div className="cp-stat-card">
              <div className="cp-stat-icon liked">
                <Users size={20} style={{ color: "#c03060" }} />
              </div>
              <div>
                <div className="cp-stat-num">{stats.matches}</div>
                <div className="cp-stat-label">Total Matches</div>
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className="cp-card">

            {/* Tabs header */}
            <div className="cp-tabs-header">
              <div className="cp-tabs-title">People you connect with</div>
              <div className="cp-tabs-nav">
                <button
                  className={`cp-tab-btn${activeTab === "matches" ? " active" : ""}`}
                  onClick={() => setActiveTab("matches")}
                >
                  <Users size={13} /> Matches
                  <span className="cp-tab-badge">{stats.matches}</span>
                </button>
                <button
                  className={`cp-tab-btn${activeTab === "likes" ? " active" : ""}`}
                  onClick={() => setActiveTab("likes")}
                >
                  <Heart size={13} /> Received Likes
                  {stats.likes > 0 && (
                    <span className="cp-tab-badge">{stats.likes}</span>
                  )}
                </button>
                <button
                  className={`cp-tab-btn${activeTab === "starLikes" ? " active" : ""}`}
                  onClick={() => setActiveTab("starLikes")}
                >
                  <Sparkles size={13} /> Star Likes
                  {starLikes.length > 0 && (
                    <span className="cp-tab-badge">{starLikes.length}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab body */}
            <div className="cp-tab-body">
              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#9a7060' }}>
                  <Loader2 size={32} style={{ margin: '0 auto 1rem', display: 'block' }} />
                  <p>Fetching your connections...</p>
                </div>
              ) : (
                <>
                  {/* ── Matches tab ── */}
                  {activeTab === "matches" && (
                    matches.length === 0 ? (
                      <div className="cp-empty">
                        <div className="cp-empty-icon">
                          <Users size={28} style={{ color: "#c9856a" }} />
                        </div>
                        <h3>No matches yet</h3>
                        <p>Start browsing profiles to find your perfect match.<br />Matched profiles will appear here.</p>
                        <Link href="/" className="cp-empty-cta">
                          <Sparkles size={14} /> Discover Matches
                        </Link>
                      </div>
                    ) : (
                      <div className="cp-grid">
                        {matches.map(match => (
                          <div
                            key={match.id}
                            className="cp-profile-card"
                            onClick={() => router.push(`/profile/${match.otherUser.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="cp-card-img-wrap">
                              <img src={match.otherUser.profileImageUrl || "/default-avatar.png"} alt={match.otherUser.name} className="cp-card-img" />
                              <div className="cp-card-img-overlay" />
                              <span className="cp-card-img-name">{match.otherUser.name}, {match.otherUser.age}</span>
                            </div>
                            <div className="cp-card-body">
                              <div className="cp-card-meta">
                                <span className="cp-card-tag loc"><MapPin size={9} />{match.otherUser.city || "Sri Lanka"}</span>
                                <span className="cp-card-tag job"><Briefcase size={9} />{match.otherUser.profession}</span>
                              </div>
                            </div>
                            <div className="cp-card-actions">
                              <Link href={`/profile/${match.otherUser.id}`} className="cp-card-btn" onClick={(e) => e.stopPropagation()}>
                                <User size={13} /> Profile
                              </Link>
                              <Link href="/messages" className="cp-card-btn primary" onClick={(e) => e.stopPropagation()}>
                                <MessageCircle size={13} /> Message
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* ── Who Liked Me tab ── */}
                  {activeTab === "likes" && (
                    receivedLikes.length === 0 ? (
                      <div className="cp-empty">
                        <div className="cp-empty-icon">
                          <Heart size={28} style={{ color: "#c9856a" }} />
                        </div>
                        <h3>No likes yet</h3>
                        <p>Likes from other users will show up here.<br />Try boosting your profile for more visibility.</p>
                      </div>
                    ) : (
                      <>
                        {/* Premium upsell banner — shown only to free users */}
                        {!isPremium && (
                          <div className="cp-premium-banner">
                            <div className="cp-premium-banner-icon">
                              <Lock size={18} color="#fff" />
                            </div>
                            <div className="cp-premium-banner-text">
                              <strong>{stats.likes} people liked your profile</strong>
                              <span>Upgrade to Premium to see who they are</span>
                            </div>
                            <Link href="/subscription" className="cp-premium-banner-cta">
                              <Sparkles size={12} /> Unlock All
                            </Link>
                          </div>
                        )}

                        <div className="cp-grid">
                          {receivedLikes.map(like => (
                            <BlurredLikeCard
                              key={like.likeId}
                              like={like}
                              isPremium={isPremium}
                              onUnlockClick={() => router.push("/subscription")}
                            />
                          ))}
                        </div>
                      </>
                    )
                  )}

                  {/* ── Star Likes tab ── */}
                  {activeTab === "starLikes" && (
                    starLikes.length === 0 ? (
                      <div className="cp-empty">
                        <div className="cp-empty-icon">
                          <Sparkles size={28} style={{ color: "#c9856a" }} />
                        </div>
                        <h3>No Star Likes yet</h3>
                        <p>Special likes from users who want to stand out<br />will appear here. These are prioritized connections!</p>
                      </div>
                    ) : (
                      <div className="cp-grid">
                        {starLikes.map(like => (
                          <BlurredLikeCard
                            key={like.likeId}
                            like={like}
                            isPremium={isPremium}
                            onUnlockClick={() => router.push("/subscription")}
                          />
                        ))}
                      </div>
                    )
                  )}

                  <div className="cp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectionsPage;