import React, { useState, useEffect } from "react";
import {
  XIcon, UserIcon, HeartIcon, FlagIcon, CreditCardIcon,
  ImageIcon, ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon,
  LockIcon, UnlockIcon, ExternalLinkIcon, CalendarIcon,
  SparklesIcon, ClockIcon, Loader2Icon, MapPinIcon, BriefcaseIcon,
  GraduationCapIcon, PhoneIcon, MailIcon, StarIcon, EyeIcon
} from "lucide-react";
import AdminService from "../../services/admin.service";

const modalStyles = `
  .upm-overlay {
    position: fixed; inset: 0;
    background: rgba(45,24,16,0.65);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem;
    animation: upmFadeIn 0.2s ease-out;
  }
  @keyframes upmFadeIn { from { opacity: 0; } to { opacity: 1; } }

  .upm-card {
    background: #fff;
    border-radius: 24px;
    width: 100%; max-width: 960px;
    max-height: 90vh;
    display: flex; flex-direction: column;
    box-shadow: 0 24px 60px rgba(45,24,16,0.25);
    border: 1px solid #f0ddd5;
    overflow: hidden;
    animation: upmSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes upmSlideUp { from { transform: translateY(20px) scale(0.98); } to { transform: translateY(0) scale(1); } }

  .upm-header {
    background: linear-gradient(135deg, #fffaf7 0%, #fdf5ee 100%);
    padding: 1.5rem 1.75rem 1.25rem;
    border-bottom: 1px solid #f0ddd5;
    position: relative;
  }
  .upm-close {
    position: absolute; right: 1.25rem; top: 1.25rem;
    width: 32px; height: 32px; border-radius: 50%;
    background: #fff; border: 1px solid #f0ddd5;
    color: #8b4e2e; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s;
  }
  .upm-close:hover { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; transform: rotate(90deg); }

  .upm-profile-hero {
    display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
  }
  .upm-avatar-large {
    width: 72px; height: 72px; border-radius: 50%;
    object-fit: cover; border: 3px solid #e8c97a;
    box-shadow: 0 4px 14px rgba(200,160,80,0.25);
  }
  .upm-avatar-placeholder {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; font-weight: 700; border: 3px solid #e8c97a;
  }
  .upm-hero-info { flex: 1; min-width: 240px; }
  .upm-hero-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.65rem; font-weight: 700; color: #2d1810;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .upm-hero-meta {
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    margin-top: 0.35rem; font-size: 0.82rem; color: #8b4e2e;
  }
  .upm-badges-row {
    display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem;
  }

  .upm-pill {
    font-size: 0.7rem; font-weight: 600; padding: 0.22rem 0.65rem;
    border-radius: 99px; display: inline-flex; align-items: center; gap: 0.3rem;
  }
  .upm-pill.gold { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
  .upm-pill.green { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
  .upm-pill.red { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
  .upm-pill.blue { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  .upm-pill.purple { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }

  /* TABS */
  .upm-tabs-bar {
    display: flex; gap: 0.5rem; padding: 0.75rem 1.75rem;
    background: #fff; border-bottom: 1px solid #f0ddd5;
    overflow-x: auto;
  }
  .upm-tab-btn {
    padding: 0.5rem 0.95rem; border-radius: 12px;
    font-size: 0.8rem; font-weight: 500;
    color: #9a7060; background: transparent; border: none;
    cursor: pointer; transition: all 0.18s; display: flex; align-items: center; gap: 0.4rem;
    white-space: nowrap; font-family: inherit;
  }
  .upm-tab-btn:hover { background: #fdf5ee; color: #2d1810; }
  .upm-tab-btn.active {
    background: #8b4e2e; color: #fff; box-shadow: 0 4px 12px rgba(139,78,46,0.25);
  }
  .upm-tab-count {
    background: rgba(0,0,0,0.08); font-size: 0.65rem; padding: 0.1rem 0.45rem;
    border-radius: 99px;
  }
  .upm-tab-btn.active .upm-tab-count {
    background: rgba(255,255,255,0.25); color: #fff;
  }

  /* BODY */
  .upm-body {
    flex: 1; overflow-y: auto; padding: 1.5rem 1.75rem;
    background: #faf7f5;
  }

  /* SECTION CARDS */
  .upm-section-card {
    background: #fff; border: 1px solid #f0ddd5; border-radius: 16px;
    padding: 1.25rem; margin-bottom: 1.25rem;
    box-shadow: 0 2px 8px rgba(45,24,16,0.03);
  }
  .upm-section-title {
    font-family: 'Cormorant Garamond', serif; font-size: 1.2rem;
    font-weight: 700; color: #2d1810; margin-bottom: 0.85rem;
    display: flex; align-items: center; gap: 0.45rem;
  }
  .upm-field-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  .upm-field-item label {
    display: block; font-size: 0.68rem; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.05em; color: #9a7060; margin-bottom: 0.2rem;
  }
  .upm-field-item value {
    display: block; font-size: 0.84rem; font-weight: 500; color: #2d1810;
  }

  /* PHOTOS GRID */
  .upm-photo-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
  .upm-photo-card {
    position: relative; border-radius: 14px; overflow: hidden;
    aspect-ratio: 1; border: 1px solid #f0ddd5; background: #fdf5ee;
  }
  .upm-photo-card img {
    width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;
  }
  .upm-photo-card:hover img { transform: scale(1.05); }
  .upm-photo-primary-badge {
    position: absolute; top: 8px; left: 8px;
    background: #8b4e2e; color: #fff; font-size: 0.62rem;
    font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 99px;
  }

  /* LIST ITEMS (LIKES, REPORTS, SUBS) */
  .upm-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .upm-list-item {
    background: #fff; border: 1px solid #f0ddd5; border-radius: 14px;
    padding: 0.9rem 1.1rem; display: flex; align-items: center;
    justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    transition: transform 0.15s;
  }
  .upm-list-item:hover { transform: translateX(2px); border-color: #c9856a; }
  .upm-item-left { display: flex; align-items: center; gap: 0.85rem; }
  .upm-item-avatar {
    width: 44px; height: 44px; border-radius: 50%; object-fit: cover;
    border: 1.5px solid #f0ddd5;
  }
  .upm-item-avatar-placeholder {
    width: 44px; height: 44px; border-radius: 50%;
    background: #fdf5ee; color: #8b4e2e; display: flex;
    align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem;
  }
  .upm-item-name { font-size: 0.88rem; font-weight: 600; color: #2d1810; }
  .upm-item-sub { font-size: 0.75rem; color: #9a7060; margin-top: 0.15rem; }

  .upm-subtabs {
    display: flex; gap: 0.5rem; margin-bottom: 1rem;
  }
  .upm-subtab-btn {
    padding: 0.35rem 0.8rem; border-radius: 99px; font-size: 0.75rem;
    font-weight: 500; border: 1px solid #f0ddd5; background: #fff;
    color: #8b4e2e; cursor: pointer; transition: all 0.15s;
  }
  .upm-subtab-btn.active {
    background: #8b4e2e; color: #fff; border-color: #8b4e2e;
  }

  .upm-empty {
    text-align: center; padding: 2.5rem 1rem; color: #9a7060; font-size: 0.85rem;
  }
`;

const AdminUserProfileModal = ({ userId, initialUser, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'photos' | 'likes' | 'reports' | 'subscriptions'
  const [likesSubTab, setLikesSubTab] = useState("received"); // 'received' | 'sent'
  const [reportsSubTab, setReportsSubTab] = useState("received"); // 'received' | 'sent'

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await AdminService.adminGetUserDetails(userId);
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin user details:", err);
    } finally {
      setLoading(false);
    }
  };

  const user = data?.user || initialUser;
  const profile = data?.profile;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const formatShortDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="upm-overlay" onClick={onClose}>
      <style>{modalStyles}</style>
      <div className="upm-card" onClick={(e) => e.stopPropagation()}>
        
        {/* ── HEADER ── */}
        <div className="upm-header">
          <button className="upm-close" onClick={onClose} aria-label="Close">
            <XIcon size={16} />
          </button>

          <div className="upm-profile-hero">
            {profile?.primaryImageUrl ? (
              <img src={profile.primaryImageUrl} alt={user?.firstName} className="upm-avatar-large" />
            ) : (
              <div className="upm-avatar-placeholder">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}

            <div className="upm-hero-info">
              <div className="upm-hero-name">
                {user?.firstName} {user?.lastName}
                {user?.idVerified && (
                  <span title="ID Verified" style={{ color: "#16a34a", display: "inline-flex" }}>
                    <CheckCircleIcon size={18} />
                  </span>
                )}
              </div>

              <div className="upm-hero-meta">
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <MailIcon size={13} /> {user?.email}
                </span>
                {user?.phoneNumber && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <PhoneIcon size={13} /> {user?.phoneNumber}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <CalendarIcon size={13} /> Joined {formatShortDate(user?.createdAt)}
                </span>
              </div>

              <div className="upm-badges-row">
                <span className={`upm-pill ${user?.role === "SUPER_ADMIN" ? "gold" : user?.role === "ADMIN" ? "purple" : "blue"}`}>
                  <ShieldCheckIcon size={11} /> {user?.role}
                </span>
                
                <span className={`upm-pill ${user?.idVerified ? "green" : "red"}`}>
                  <ShieldCheckIcon size={11} />
                  {user?.idVerified ? "ID Verified" : `ID: ${user?.verificationStatus || "NOT_SUBMITTED"}`}
                </span>

                {user?.premium ? (
                  <span className="upm-pill gold">
                    <SparklesIcon size={11} /> Premium Active
                  </span>
                ) : (
                  <span className="upm-pill blue">Free Member</span>
                )}

                {user?.accountLockedUntil && new Date(user.accountLockedUntil) > new Date() ? (
                  <span className="upm-pill red">
                    <LockIcon size={11} /> Account Locked
                  </span>
                ) : (
                  <span className="upm-pill green">
                    <CheckCircleIcon size={11} /> Account Active
                  </span>
                )}

                <span className="upm-pill" style={{ background: "#f1f5f9", color: "#475569" }}>
                  ID #{user?.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="upm-tabs-bar">
          <button
            className={`upm-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <UserIcon size={14} /> Profile Details
          </button>

          <button
            className={`upm-tab-btn ${activeTab === "photos" ? "active" : ""}`}
            onClick={() => setActiveTab("photos")}
          >
            <ImageIcon size={14} /> Photos
            <span className="upm-tab-count">{profile?.profileImages?.length || (profile?.primaryImageUrl ? 1 : 0)}</span>
          </button>

          <button
            className={`upm-tab-btn ${activeTab === "likes" ? "active" : ""}`}
            onClick={() => setActiveTab("likes")}
          >
            <HeartIcon size={14} /> Likes Activity
            <span className="upm-tab-count">{(data?.totalReceivedLikes || 0) + (data?.totalSentLikes || 0)}</span>
          </button>

          <button
            className={`upm-tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <FlagIcon size={14} /> Reports & Safety
            <span className="upm-tab-count">{(data?.totalReceivedReports || 0) + (data?.totalSentReports || 0)}</span>
          </button>

          <button
            className={`upm-tab-btn ${activeTab === "subscriptions" ? "active" : ""}`}
            onClick={() => setActiveTab("subscriptions")}
          >
            <CreditCardIcon size={14} /> Billing & History
            <span className="upm-tab-count">{(data?.subscriptions?.length || 0) + (data?.tiktokPromotions?.length || 0)}</span>
          </button>
        </div>

        {/* ── CONTENT BODY ── */}
        <div className="upm-body">
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#8b4e2e" }}>
              <Loader2Icon size={32} className="animate-spin" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>Loading comprehensive user record...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: COMPLETE PROFILE */}
              {activeTab === "profile" && (
                <div>
                  {!profile ? (
                    <div className="upm-empty">
                      <p>This user has not completed their matchmaking profile yet.</p>
                    </div>
                  ) : (
                    <>
                      {/* Basic Info */}
                      <div className="upm-section-card">
                        <div className="upm-section-title">
                          <UserIcon size={16} color="#8b4e2e" /> Basic Demographics
                        </div>
                        <div className="upm-field-grid">
                          <div className="upm-field-item">
                            <label>Age & Gender</label>
                            <value>{profile.age ? `${profile.age} yrs` : "N/A"} • {profile.gender || "N/A"}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Marital Status</label>
                            <value>{profile.maritalStatus || "N/A"} {profile.hasChildren ? `(${profile.numberOfChildren} children)` : ""}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Height & Body</label>
                            <value>{profile.height ? `${profile.height} cm` : "N/A"} • {profile.bodyType || "N/A"} • {profile.complexion || "N/A"}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Date of Birth</label>
                            <value>{formatShortDate(profile.dateOfBirth)} {profile.timeOfBirth ? `at ${profile.timeOfBirth}` : ""}</value>
                          </div>
                        </div>
                      </div>

                      {/* Location & Origins */}
                      <div className="upm-section-card">
                        <div className="upm-section-title">
                          <MapPinIcon size={16} color="#8b4e2e" /> Location & Heritage
                        </div>
                        <div className="upm-field-grid">
                          <div className="upm-field-item">
                            <label>District / City</label>
                            <value>{profile.district || "N/A"} / {profile.city || "N/A"}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Religion & Practices</label>
                            <value>{profile.religion || "N/A"} {profile.religiousPractices ? `(${profile.religiousPractices})` : ""}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Ethnicity & Languages</label>
                            <value>{profile.ethnicity || "N/A"} • {profile.languages?.join(", ") || "N/A"}</value>
                          </div>
                        </div>
                      </div>

                      {/* Career & Education */}
                      <div className="upm-section-card">
                        <div className="upm-section-title">
                          <BriefcaseIcon size={16} color="#8b4e2e" /> Career & Education
                        </div>
                        <div className="upm-field-grid">
                          <div className="upm-field-item">
                            <label>Profession</label>
                            <value>{profile.profession || "N/A"}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Industry & Employer</label>
                            <value>{profile.industry || "N/A"} {profile.employer ? `at ${profile.employer}` : ""}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Education</label>
                            <value>{profile.education || "N/A"} {profile.fieldOfStudy ? `in ${profile.fieldOfStudy}` : ""}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Income & Location</label>
                            <value>{profile.income || "N/A"} • {profile.workLocation || "N/A"}</value>
                          </div>
                        </div>
                      </div>

                      {/* Horoscope */}
                      <div className="upm-section-card">
                        <div className="upm-section-title">
                          <StarIcon size={16} color="#8b4e2e" /> Horoscope & Astrology
                        </div>
                        <div className="upm-field-grid">
                          <div className="upm-field-item">
                            <label>Rashi (Sign)</label>
                            <value>{profile.horoscopeSign || "N/A"}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Birth Star (Nekatha)</label>
                            <value>{profile.birthStar || "N/A"}</value>
                          </div>
                          <div className="upm-field-item" style={{ gridColumn: "1 / -1" }}>
                            <label>Astrological Details</label>
                            <value>{profile.horoscopeDetails || "Not provided"}</value>
                          </div>
                        </div>
                      </div>

                      {/* Lifestyle, Family & Bio */}
                      <div className="upm-section-card">
                        <div className="upm-section-title">
                          <SparklesIcon size={16} color="#8b4e2e" /> Lifestyle & Bio
                        </div>
                        <div className="upm-field-grid" style={{ marginBottom: "1rem" }}>
                          <div className="upm-field-item">
                            <label>Diet / Drinking / Smoking</label>
                            <value>{profile.dietaryPreferences || "Normal"} • {profile.drinking || "No"} • {profile.smoking || "No"}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Family Background</label>
                            <value>{profile.familyBackground || "N/A"}</value>
                          </div>
                          <div className="upm-field-item">
                            <label>Interests</label>
                            <value>{profile.interests?.join(", ") || "None listed"}</value>
                          </div>
                        </div>
                        <div className="upm-field-item">
                          <label>About Me</label>
                          <value style={{ whiteSpace: "pre-line", lineHeight: 1.45 }}>{profile.about || "No bio provided"}</value>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: PHOTOS */}
              {activeTab === "photos" && (
                <div>
                  {(!profile?.profileImages || profile.profileImages.length === 0) && !profile?.primaryImageUrl ? (
                    <div className="upm-empty">
                      <ImageIcon size={36} style={{ margin: "0 auto 0.5rem", opacity: 0.4 }} />
                      <p>No photos uploaded by this member.</p>
                    </div>
                  ) : (
                    <div className="upm-photo-grid">
                      {profile?.profileImages?.map((url, idx) => (
                        <div key={idx} className="upm-photo-card">
                          <img src={url} alt={`Photo ${idx + 1}`} />
                          {url === profile.primaryImageUrl && (
                            <span className="upm-photo-primary-badge">Primary</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LIKES ACTIVITY */}
              {activeTab === "likes" && (
                <div>
                  <div className="upm-subtabs">
                    <button
                      className={`upm-subtab-btn ${likesSubTab === "received" ? "active" : ""}`}
                      onClick={() => setLikesSubTab("received")}
                    >
                      Likes Received ({data?.receivedLikes?.length || 0})
                    </button>
                    <button
                      className={`upm-subtab-btn ${likesSubTab === "sent" ? "active" : ""}`}
                      onClick={() => setLikesSubTab("sent")}
                    >
                      Likes Sent ({data?.sentLikes?.length || 0})
                    </button>
                  </div>

                  {likesSubTab === "received" ? (
                    data?.receivedLikes?.length === 0 ? (
                      <div className="upm-empty">No likes received yet.</div>
                    ) : (
                      <div className="upm-list">
                        {data?.receivedLikes?.map((like) => (
                          <div key={like.id} className="upm-list-item">
                            <div className="upm-item-left">
                              {like.targetUserImage ? (
                                <img src={like.targetUserImage} alt={like.targetUserName} className="upm-item-avatar" />
                              ) : (
                                <div className="upm-item-avatar-placeholder">
                                  {like.targetUserName?.[0]}
                                </div>
                              )}
                              <div>
                                <div className="upm-item-name">{like.targetUserName}</div>
                                <div className="upm-item-sub">
                                  {like.targetUserAge ? `${like.targetUserAge} yrs` : ""} {like.targetUserCity ? `• ${like.targetUserCity}` : ""} • {like.targetUserEmail}
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className={`upm-pill ${like.status === "ACCEPTED" ? "green" : like.status === "REJECTED" ? "red" : "gold"}`}>
                                {like.type}: {like.status}
                              </span>
                              <div className="upm-item-sub" style={{ marginTop: 4 }}>
                                {formatDate(like.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    data?.sentLikes?.length === 0 ? (
                      <div className="upm-empty">No likes sent yet.</div>
                    ) : (
                      <div className="upm-list">
                        {data?.sentLikes?.map((like) => (
                          <div key={like.id} className="upm-list-item">
                            <div className="upm-item-left">
                              {like.targetUserImage ? (
                                <img src={like.targetUserImage} alt={like.targetUserName} className="upm-item-avatar" />
                              ) : (
                                <div className="upm-item-avatar-placeholder">
                                  {like.targetUserName?.[0]}
                                </div>
                              )}
                              <div>
                                <div className="upm-item-name">{like.targetUserName}</div>
                                <div className="upm-item-sub">
                                  {like.targetUserAge ? `${like.targetUserAge} yrs` : ""} {like.targetUserCity ? `• ${like.targetUserCity}` : ""} • {like.targetUserEmail}
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className={`upm-pill ${like.status === "ACCEPTED" ? "green" : like.status === "REJECTED" ? "red" : "gold"}`}>
                                {like.type}: {like.status}
                              </span>
                              <div className="upm-item-sub" style={{ marginTop: 4 }}>
                                {formatDate(like.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* TAB 4: REPORTS & SAFETY */}
              {activeTab === "reports" && (
                <div>
                  <div className="upm-subtabs">
                    <button
                      className={`upm-subtab-btn ${reportsSubTab === "received" ? "active" : ""}`}
                      onClick={() => setReportsSubTab("received")}
                    >
                      Reports Against User ({data?.receivedReports?.length || 0})
                    </button>
                    <button
                      className={`upm-subtab-btn ${reportsSubTab === "sent" ? "active" : ""}`}
                      onClick={() => setReportsSubTab("sent")}
                    >
                      Reports Made by User ({data?.sentReports?.length || 0})
                    </button>
                  </div>

                  {reportsSubTab === "received" ? (
                    data?.receivedReports?.length === 0 ? (
                      <div className="upm-empty" style={{ color: "#166534" }}>
                        <CheckCircleIcon size={32} style={{ margin: "0 auto 0.5rem" }} />
                        <p>No reports filed against this member. Clean account history.</p>
                      </div>
                    ) : (
                      <div className="upm-list">
                        {data?.receivedReports?.map((rep) => (
                          <div key={rep.id} className="upm-list-item" style={{ borderColor: "#fca5a5" }}>
                            <div className="upm-item-left">
                              <div className="upm-item-avatar-placeholder" style={{ background: "#fee2e2", color: "#991b1b" }}>
                                <FlagIcon size={18} />
                              </div>
                              <div>
                                <div className="upm-item-name" style={{ color: "#991b1b" }}>
                                  Reason: {rep.reason}
                                </div>
                                <div className="upm-item-sub">Reported by {rep.otherUserName} ({rep.otherUserEmail})</div>
                                <div style={{ fontSize: "0.8rem", color: "#2d1810", marginTop: 4 }}>
                                  "{rep.description}"
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className={`upm-pill ${rep.status === "RESOLVED" ? "green" : rep.status === "DISMISSED" ? "blue" : "red"}`}>
                                {rep.status}
                              </span>
                              <div className="upm-item-sub" style={{ marginTop: 4 }}>{formatDate(rep.createdAt)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    data?.sentReports?.length === 0 ? (
                      <div className="upm-empty">No reports filed by this user.</div>
                    ) : (
                      <div className="upm-list">
                        {data?.sentReports?.map((rep) => (
                          <div key={rep.id} className="upm-list-item">
                            <div className="upm-item-left">
                              <div className="upm-item-avatar-placeholder">
                                <FlagIcon size={18} />
                              </div>
                              <div>
                                <div className="upm-item-name">Reported: {rep.otherUserName}</div>
                                <div className="upm-item-sub">Reason: {rep.reason}</div>
                                <div style={{ fontSize: "0.8rem", color: "#2d1810", marginTop: 4 }}>
                                  "{rep.description}"
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className="upm-pill blue">{rep.status}</span>
                              <div className="upm-item-sub" style={{ marginTop: 4 }}>{formatDate(rep.createdAt)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* TAB 5: BILLING & SUBSCRIPTIONS */}
              {activeTab === "subscriptions" && (
                <div>
                  {/* Membership Subscriptions */}
                  <div className="upm-section-card">
                    <div className="upm-section-title">
                      <SparklesIcon size={16} color="#8b4e2e" /> Membership Plans
                    </div>
                    {data?.subscriptions?.length === 0 ? (
                      <div className="upm-empty">No active or past membership subscriptions.</div>
                    ) : (
                      <div className="upm-list">
                        {data?.subscriptions?.map((sub) => (
                          <div key={sub.id} className="upm-list-item">
                            <div>
                              <div className="upm-item-name">{sub.packageName}</div>
                              <div className="upm-item-sub">
                                {formatShortDate(sub.startDate)} - {formatShortDate(sub.endDate)}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className={`upm-pill ${sub.status === "ACTIVE" ? "green" : "blue"}`}>
                                {sub.status}
                              </span>
                              {sub.daysRemaining > 0 && (
                                <div className="upm-item-sub" style={{ marginTop: 4 }}>
                                  {sub.daysRemaining} days remaining
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* TikTok Promotions */}
                  <div className="upm-section-card">
                    <div className="upm-section-title">
                      <EyeIcon size={16} color="#8b4e2e" /> TikTok Spotlight Packages
                    </div>
                    {data?.tiktokPromotions?.length === 0 ? (
                      <div className="upm-empty">No TikTok promotions requested.</div>
                    ) : (
                      <div className="upm-list">
                        {data?.tiktokPromotions?.map((promo) => (
                          <div key={promo.id} className="upm-list-item">
                            <div>
                              <div className="upm-item-name">{promo.packageName} ({promo.durationDays} Days)</div>
                              <div className="upm-item-sub">
                                Submitted {formatShortDate(promo.submittedAt)}
                                {promo.tiktokPostUrl && (
                                  <a
                                    href={promo.tiktokPostUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ marginLeft: 8, color: "#8b4e2e", display: "inline-flex", alignItems: "center", gap: 2 }}
                                  >
                                    <ExternalLinkIcon size={11} /> TikTok Link
                                  </a>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className={`upm-pill ${promo.status === "PUBLISHED" ? "green" : promo.status === "REJECTED" ? "red" : "gold"}`}>
                                {promo.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payments & Bank Slips */}
                  <div className="upm-section-card">
                    <div className="upm-section-title">
                      <CreditCardIcon size={16} color="#8b4e2e" /> Payment Transactions
                    </div>
                    {data?.payments?.length === 0 ? (
                      <div className="upm-empty">No payment transactions found.</div>
                    ) : (
                      <div className="upm-list">
                        {data?.payments?.map((pay) => (
                          <div key={pay.id} className="upm-list-item">
                            <div>
                              <div className="upm-item-name">
                                LKR {pay.amount?.toLocaleString()} • {pay.packageName || pay.paymentType}
                              </div>
                              <div className="upm-item-sub">
                                {pay.paymentMethod} • {formatDate(pay.submittedAt)}
                              </div>
                            </div>
                            <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 10 }}>
                              {pay.receiptUrl && (
                                <a
                                  href={pay.receiptUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="upm-pill gold"
                                  style={{ textDecoration: "none" }}
                                >
                                  <ExternalLinkIcon size={11} /> View Slip
                                </a>
                              )}
                              <span className={`upm-pill ${pay.paymentStatus === "COMPLETED" ? "green" : pay.paymentStatus === "REJECTED" ? "red" : "gold"}`}>
                                {pay.paymentStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfileModal;
