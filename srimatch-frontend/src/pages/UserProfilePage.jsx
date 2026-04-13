// UserProfilePage.jsx - Redesigned to match SriMatch luxury aesthetic
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { dummyProfiles } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";
import {
  Heart, UserPlus, MessageCircle, Check, X, Info, MapPin, Briefcase,
  GraduationCap, HeartHandshake, Star, BookOpen, ArrowLeft, Cake, Users,
  Languages, CircleDollarSign, Ruler, Wine, Coffee, ChevronLeft, ChevronRight,
  Shield, Globe, Home, Sparkles, Crown, Zap, Camera, Music, Plane, Book,
  Film, Gamepad, Dumbbell, Smile, Target, Activity, User,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .up-root * { box-sizing: border-box; }

  .up-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2rem 1.5rem 5rem;
  }

  .up-inner { max-width: 900px; margin: 0 auto; }

  /* ── Back link ── */
  .up-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; color: #9a7060; text-decoration: none;
    margin-bottom: 1.5rem; transition: color 0.2s;
  }
  .up-back:hover { color: #8b4e2e; }

  /* ── Hero card ── */
  .up-hero {
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.1), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .up-gallery { position: relative; height: 440px; }
  .up-gallery-img {
    width: 100%; height: 100%; object-fit: cover;
    display: block; cursor: pointer;
    transition: transform 0.4s;
  }
  .up-gallery-img:hover { transform: scale(1.02); }
  .up-gallery-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(20,6,2,0.72) 0%, rgba(20,6,2,0.12) 45%, transparent 70%);
    pointer-events: none;
  }

  .up-gallery-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(255,255,255,0.18); backdrop-filter: blur(6px);
    border: none; color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .up-gallery-nav:hover { background: rgba(255,255,255,0.35); }
  .up-gallery-nav.prev { left: 1rem; }
  .up-gallery-nav.next { right: 1rem; }

  .up-gallery-dots {
    position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%);
    display: flex; gap: 6px;
  }
  .up-gallery-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,0.5); border: none; cursor: pointer;
    transition: all 0.2s; padding: 0;
  }
  .up-gallery-dot.active { background: #fff; transform: scale(1.3); }

  .up-gallery-counter {
    position: absolute; top: 1rem; right: 1rem;
    background: rgba(20,6,2,0.5); backdrop-filter: blur(4px);
    color: #fff; font-size: 0.72rem; padding: 0.3rem 0.7rem;
    border-radius: 99px;
  }

  /* Profile identity block */
  .up-identity {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 1.5rem 2rem;
    color: #fff;
  }
  .up-name-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
  .up-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 600; line-height: 1;
  }
  .up-verified-badge {
    display: flex; align-items: center; gap: 4px;
    background: rgba(61,31,18,0.8); backdrop-filter: blur(6px);
    color: #e8c97a; font-size: 0.68rem; font-weight: 600;
    padding: 0.25rem 0.65rem; border-radius: 99px;
  }
  .up-boosted-badge {
    display: flex; align-items: center; gap: 4px;
    background: linear-gradient(135deg, #e07a30, #c93a1a);
    color: #fff; font-size: 0.68rem; font-weight: 600;
    padding: 0.25rem 0.65rem; border-radius: 99px;
  }
  .up-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.82rem; color: rgba(255,255,255,0.88); }
  .up-meta-item { display: flex; align-items: center; gap: 4px; }

  /* Action bar */
  .up-action-bar {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
    padding: 1.2rem 2rem;
    border-top: 1px solid #f5ede8;
  }
  .up-action-left { display: flex; gap: 0.65rem; }
  .up-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.1rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .up-btn-like {
    border: 1.5px solid #e8ddd8; background: #fdf8f5; color: #6b4a3a;
  }
  .up-btn-like.active { background: #fde8ef; border-color: #f0a0b8; color: #c03060; }
  .up-btn-like:hover { border-color: #c9856a; }
  .up-btn-connect {
    border: 1.5px solid #e8ddd8; background: #fdf8f5; color: #6b4a3a;
  }
  .up-btn-connect.active { background: #e8eef8; border-color: #a0b8d8; color: #3a6ea8; }
  .up-btn-connect:hover { border-color: #c9856a; }
  .up-btn-msg {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
  }
  .up-btn-msg:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }

  .up-match-score {
    display: flex; flex-direction: column; align-items: flex-end;
  }
  .up-match-pct {
    font-size: 1.5rem; font-weight: 600;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    line-height: 1;
  }
  .up-match-label { font-size: 0.68rem; color: #9a7060; }

  /* ── Tabs ── */
  .up-tabs-card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.07), 0 2px 6px rgba(0,0,0,0.03);
    overflow: hidden;
    margin-bottom: 1.5rem;
  }
  .up-tabs-nav {
    display: flex; overflow-x: auto; border-bottom: 1px solid #f5ede8;
    scrollbar-width: none;
  }
  .up-tabs-nav::-webkit-scrollbar { display: none; }
  .up-tab-btn {
    padding: 0.9rem 1.2rem;
    font-size: 0.8rem; font-weight: 500;
    color: #9a7060; background: none; border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer; white-space: nowrap;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .up-tab-btn:hover { color: #4a3028; }
  .up-tab-btn.active { color: #8b4e2e; border-bottom-color: #8b4e2e; }

  .up-tab-body { padding: 1.75rem 2rem; }

  /* ── Section headings inside tabs ── */
  .up-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #2d1810;
    margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;
  }
  .up-section-divider { height: 1px; background: #f5ede8; margin: 1.5rem 0; }
  .up-subsection-title {
    font-size: 0.72rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.09em;
    color: #8b4e2e; margin-bottom: 0.75rem;
    display: flex; align-items: center; gap: 0.35rem;
  }

  /* ── Info grid ── */
  .up-info-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.6rem 1.5rem;
  }
  .up-info-item {
    display: flex; flex-direction: column; gap: 2px;
    padding: 0.6rem 0; border-bottom: 1px solid #faf3ef;
  }
  .up-info-label { font-size: 0.71rem; color: #b09080; text-transform: uppercase; letter-spacing: 0.06em; }
  .up-info-value { font-size: 0.84rem; color: #2d1810; font-weight: 500; }

  /* ── About text ── */
  .up-about-text {
    font-size: 0.9rem; color: #4a3028; line-height: 1.75;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border-radius: 14px; padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
    border-left: 3px solid #c9856a;
  }

  /* ── Interest chips ── */
  .up-interests { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .up-interest {
    display: flex; align-items: center; gap: 0.3rem;
    background: #fdf0e8; color: #8b4e2e;
    font-size: 0.78rem; font-weight: 500;
    padding: 0.35rem 0.8rem; border-radius: 99px;
    border: 1px solid #f0ddd5;
  }

  /* Language chips */
  .up-lang {
    background: #edf5fd; color: #3a6ea8;
    font-size: 0.76rem; padding: 0.3rem 0.75rem; border-radius: 99px;
    border: 1px solid #c8ddf0;
  }

  /* ── Compatibility bars ── */
  .up-compat-row { margin-bottom: 1.1rem; }
  .up-compat-header {
    display: flex; justify-content: space-between;
    font-size: 0.8rem; margin-bottom: 0.4rem;
  }
  .up-compat-label { font-weight: 500; color: #4a3028; }
  .up-compat-val { color: #8b4e2e; font-weight: 500; }
  .up-compat-track { height: 5px; background: #f0ddd5; border-radius: 99px; overflow: hidden; }
  .up-compat-fill {
    height: 100%;
    background: linear-gradient(90deg, #3d1f12, #8b4e2e, #c9856a);
    border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1);
  }

  /* Match score circle */
  .up-match-hero {
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border: 1px solid #f0ddd5; border-radius: 16px;
    padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .up-match-circle-wrap { flex-shrink: 0; }
  .up-match-hero-text h4 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #2d1810; margin-bottom: 0.25rem;
  }
  .up-match-hero-text p { font-size: 0.8rem; color: #9a7060; line-height: 1.5; }

  /* Horoscope info */
  .up-horoscope-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: #f5f0fa; color: #6a40a8;
    font-size: 0.8rem; font-weight: 500;
    padding: 0.4rem 1rem; border-radius: 99px;
    border: 1px solid #e0d0f8; margin-bottom: 1rem;
  }

  /* Preferences list */
  .up-pref-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.7rem 0; border-bottom: 1px solid #faf3ef;
    font-size: 0.83rem;
  }
  .up-pref-label { color: #9a7060; }
  .up-pref-value { color: #2d1810; font-weight: 500; text-align: right; max-width: 55%; }

  /* ── Gallery Modal ── */
  .up-modal-overlay {
    position: fixed; inset: 0; background: rgba(10,3,1,0.88);
    z-index: 50; display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .up-modal-inner { position: relative; max-width: 700px; width: 100%; }
  .up-modal-img {
    width: 100%; max-height: 75vh; object-fit: contain;
    border-radius: 16px; display: block;
  }
  .up-modal-close {
    position: absolute; top: -0.75rem; right: -0.75rem;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
    border: none; color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .up-modal-close:hover { background: rgba(255,255,255,0.28); }
  .up-modal-thumbs {
    display: flex; justify-content: center; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap;
  }
  .up-modal-thumb {
    width: 54px; height: 54px; border-radius: 8px; object-fit: cover;
    cursor: pointer; opacity: 0.6; transition: all 0.2s;
    border: 2px solid transparent;
  }
  .up-modal-thumb.active { opacity: 1; border-color: #c9856a; }

  /* ── Suggested actions card ── */
  .up-actions-card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.07), 0 2px 6px rgba(0,0,0,0.03);
    padding: 1.5rem 2rem;
  }
  .up-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; }
  .up-action-item {
    display: flex; align-items: center; gap: 0.85rem;
    padding: 1rem; border-radius: 14px;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border: 1px solid #f0ddd5;
    text-decoration: none; cursor: pointer;
    transition: all 0.2s; border: none; width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .up-action-item:hover { box-shadow: 0 6px 18px rgba(139,78,46,0.1); transform: translateY(-2px); }
  .up-action-icon {
    width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
  }
  .up-action-title { font-size: 0.84rem; font-weight: 500; color: #2d1810; }
  .up-action-sub { font-size: 0.73rem; color: #9a7060; margin-top: 2px; }

  /* ── Loading & empty ── */
  .up-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh;
  }
  .up-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 3px solid #f0ddd5; border-top-color: #8b4e2e;
    animation: up-spin 0.8s linear infinite;
  }
  @keyframes up-spin { to { transform: rotate(360deg); } }

  .up-not-found {
    text-align: center; padding: 5rem 2rem;
    background: #fff; border-radius: 20px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.07);
  }
  .up-not-found h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600; color: #2d1810; margin-bottom: 0.5rem;
  }
  .up-not-found p { font-size: 0.88rem; color: #9a7060; margin-bottom: 1.5rem; }
  .up-not-found-link {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.65rem 1.5rem; border-radius: 99px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; text-decoration: none; font-size: 0.85rem; font-weight: 500;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
  }

  /* ── Horoscope note ── */
  .up-astro-note {
    background: #fffbf0; border: 1px solid #f0e090;
    border-radius: 12px; padding: 0.9rem 1.1rem;
    font-size: 0.78rem; color: #7a6010; line-height: 1.55;
    display: flex; gap: 0.5rem; align-items: flex-start;
    margin-top: 1.25rem;
  }

  @media (max-width: 700px) {
    .up-root { padding: 1.25rem 1rem 4rem; }
    .up-gallery { height: 300px; }
    .up-name { font-size: 1.7rem; }
    .up-action-bar { padding: 1rem 1.25rem; }
    .up-tab-body { padding: 1.25rem 1.25rem; }
    .up-info-grid { grid-template-columns: 1fr; }
    .up-actions-grid { grid-template-columns: 1fr; }
    .up-match-hero { flex-direction: column; text-align: center; }
  }
`;

/* ─── Interest icon map ─────────────────────────────────────────────────── */
const INTEREST_ICONS = {
  Music: Music, Travel: Plane, Photography: Camera, Reading: Book,
  Movies: Film, Gaming: Gamepad, Cooking: Coffee, Sports: Dumbbell,
  Yoga: Activity, Dancing: Smile,
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const UserProfilePage = () => {
  const { id } = useParams();
  const { user, likedProfiles = [], sentRequests = [], toggleLike, toggleFriendRequest } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfile(dummyProfiles.find(p => p.id === id) || null);
      setLoading(false);
    }, 400);
  }, [id]);

  const images = profile?.profileImages?.length > 0 ? profile.profileImages : profile?.profileImage ? [profile.profileImage] : [];
  const currentImage = images[currentImageIndex] || "";

  const nextImage = (e) => { e?.stopPropagation(); setCurrentImageIndex(i => (i + 1) % images.length); };
  const prevImage = (e) => { e?.stopPropagation(); setCurrentImageIndex(i => (i - 1 + images.length) % images.length); };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="up-root"><div className="up-inner"><div className="up-loading"><div className="up-spinner" /></div></div></div>
    </>
  );

  if (!profile) return (
    <>
      <style>{styles}</style>
      <div className="up-root"><div className="up-inner">
        <div className="up-not-found">
          <h2>Profile Not Found</h2>
          <p>This profile doesn't exist or has been removed.</p>
          <Link to="/home" className="up-not-found-link">Browse Profiles</Link>
        </div>
      </div></div>
    </>
  );

  const isLiked = likedProfiles.includes(profile.id);
  const hasRequestSent = sentRequests.includes(profile.id);
  const matchPct = profile.matchPercentage || profile.matchScore || 78;

  /* ── Tab content renderers ── */
  const AboutTab = () => (
    <>
      {profile.about && <p className="up-about-text">"{profile.about}"</p>}

      <div className="up-subsection-title"><User size={11} />Basic Information</div>
      <div className="up-info-grid">
        {[
          ["Age", `${profile.age} years`],
          ["Marital Status", profile.maritalStatus],
          ["Has Children", profile.hasChildren ? "Yes" : "No"],
          ["Gender", profile.gender],
          ["Height", profile.height ? `${profile.height} cm` : "—"],
          ["Body Type", profile.bodyType],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value" style={{ textTransform: "capitalize" }}>{value || "Not specified"}</span>
          </div>
        ))}
      </div>

      <div className="up-section-divider" />
      <div className="up-subsection-title"><MapPin size={11} />Location</div>
      <div className="up-info-grid">
        {[
          ["Current City", profile.city],
          ["District", profile.district],
          ["Place of Birth", profile.placeOfBirth],
          ["Ethnicity", profile.ethnicity],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value">{value || "Not specified"}</span>
          </div>
        ))}
      </div>
    </>
  );

  const DetailsTab = () => (
    <>
      <div className="up-subsection-title"><BookOpen size={11} />Religion & Cultural Background</div>
      <div className="up-info-grid">
        {[
          ["Religion", profile.religion],
          ["Religious Practices", profile.religiousPractices],
          ["Cultural Values", profile.culturalValues],
          ["Family Involvement", profile.familyInvolvement],
          ["Family Background", profile.familyBackground],
          ["Wedding Preferences", profile.weddingPreferences],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value">{value || "Not specified"}</span>
          </div>
        ))}
      </div>

      {(profile.languages || []).length > 0 && (
        <>
          <div className="up-section-divider" />
          <div className="up-subsection-title"><Languages size={11} />Languages Spoken</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {profile.languages.map((l, i) => <span key={i} className="up-lang">{l}</span>)}
          </div>
        </>
      )}

      <div className="up-section-divider" />
      <div className="up-subsection-title"><GraduationCap size={11} />Education & Career</div>
      <div className="up-info-grid">
        {[
          ["Education", profile.education],
          ["Field of Study", profile.fieldOfStudy],
          ["Profession", profile.profession],
          ["Industry", profile.industry],
          ["Employer", profile.employer],
          ["Work Location", profile.workLocation],
          ["Income Range", profile.income],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value">{value || "Not specified"}</span>
          </div>
        ))}
      </div>
    </>
  );

  const InterestsTab = () => (
    <>
      <div className="up-subsection-title"><Sparkles size={11} />Interests & Hobbies</div>
      <div className="up-interests" style={{ marginBottom: "1.5rem" }}>
        {(profile.interests || []).map((interest, i) => {
          const IconComp = INTEREST_ICONS[interest] || Sparkles;
          return (
            <span key={i} className="up-interest">
              <IconComp size={12} />{interest}
            </span>
          );
        })}
      </div>

      <div className="up-section-divider" />
      <div className="up-subsection-title"><Star size={11} />Favourite Things</div>
      <div className="up-info-grid">
        {[
          ["Food", profile.favoriteThings?.food],
          ["Books", profile.favoriteThings?.books],
          ["Movies / Shows", profile.favoriteThings?.movies],
          ["Places", profile.favoriteThings?.places],
          ["Travel Preferences", profile.travelPreferences],
          ["Personality Traits", profile.personalityTraits],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value">{value || "Not specified"}</span>
          </div>
        ))}
      </div>
    </>
  );

  const LifestyleTab = () => (
    <>
      <div className="up-subsection-title"><Activity size={11} />Physical Appearance</div>
      <div className="up-info-grid">
        {[
          ["Height", profile.height ? `${profile.height} cm` : "—"],
          ["Body Type", profile.bodyType],
          ["Complexion", profile.complexion],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value">{value || "Not specified"}</span>
          </div>
        ))}
      </div>

      <div className="up-section-divider" />
      <div className="up-subsection-title"><Coffee size={11} />Habits & Lifestyle</div>
      <div className="up-info-grid">
        {[
          ["Smoking", profile.smoking],
          ["Drinking", profile.drinking],
          ["Dietary Preferences", profile.dietaryPreferences],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value">{value || "Not specified"}</span>
          </div>
        ))}
      </div>

      {(profile.healthHabits || profile.lifestyle) && (
        <>
          <div className="up-section-divider" />
          {profile.healthHabits && (
            <>
              <div className="up-subsection-title"><Dumbbell size={11} />Health & Fitness</div>
              <p style={{ fontSize: "0.85rem", color: "#4a3028", lineHeight: 1.65, marginBottom: "1rem" }}>{profile.healthHabits}</p>
            </>
          )}
          {profile.lifestyle && (
            <>
              <div className="up-subsection-title"><Home size={11} />Daily Lifestyle</div>
              <p style={{ fontSize: "0.85rem", color: "#4a3028", lineHeight: 1.65 }}>{profile.lifestyle}</p>
            </>
          )}
        </>
      )}
    </>
  );

  const CompatibilityTab = () => {
    const scores = [
      { label: "Emotional Compatibility", score: matchPct },
      { label: "Communication", score: Math.max(matchPct - 5, 50) },
      { label: "Trust & Values", score: Math.min(matchPct + 8, 100) },
      { label: "Lifestyle Match", score: Math.max(matchPct - 3, 55) },
      { label: "Cultural Alignment", score: Math.min(matchPct + 5, 100) },
    ];
    const scoreLabel = (s) => s >= 85 ? "Excellent" : s >= 70 ? "Good" : "Moderate";

    return (
      <>
        {/* Hero match block */}
        <div className="up-match-hero">
          <div className="up-match-circle-wrap">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="#f0ddd5" strokeWidth="5" fill="none" />
              <circle cx="40" cy="40" r="32"
                stroke="url(#matchGrad)" strokeWidth="5" fill="none"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={2 * Math.PI * 32 * (1 - matchPct / 100)}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
              <defs>
                <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3d1f12" />
                  <stop offset="100%" stopColor="#c9856a" />
                </linearGradient>
              </defs>
              <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="DM Sans, sans-serif" fill="#8b4e2e">{matchPct}%</text>
            </svg>
          </div>
          <div className="up-match-hero-text">
            <h4>Overall Match Score</h4>
            <p>Based on shared values, lifestyle, and preferences between you and {profile.firstName}. Horoscope compatibility is calculated separately.</p>
          </div>
        </div>

        {/* Compatibility bars */}
        <div className="up-subsection-title"><HeartHandshake size={11} />Compatibility Breakdown</div>
        {scores.map(({ label, score }) => (
          <div key={label} className="up-compat-row">
            <div className="up-compat-header">
              <span className="up-compat-label">{label}</span>
              <span className="up-compat-val">{scoreLabel(score)}</span>
            </div>
            <div className="up-compat-track">
              <div className="up-compat-fill" style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}

        <div className="up-section-divider" />
        <div className="up-subsection-title"><Star size={11} />Horoscope</div>

        {profile.horoscope?.sign && (
          <div className="up-horoscope-pill">
            <Star size={13} />{profile.horoscope.sign}
          </div>
        )}
        {profile.horoscope?.details && (
          <p style={{ fontSize: "0.84rem", color: "#4a3028", lineHeight: 1.65, marginBottom: "1rem" }}>
            {profile.horoscope.details}
          </p>
        )}
        {profile.horoscopeDetails && (
          <p style={{ fontSize: "0.84rem", color: "#4a3028", lineHeight: 1.65 }}>{profile.horoscopeDetails}</p>
        )}

        <div className="up-astro-note">
          <Star size={14} style={{ color: "#c07030", flexShrink: 0, marginTop: 1 }} />
          <span>Horoscope compatibility plays an important role in Sri Lankan matrimony. This score is calculated using traditional astrological principles and should be considered alongside personal values and communication.</span>
        </div>
      </>
    );
  };

  const PreferencesTab = () => (
    <>
      <div className="up-subsection-title"><Target size={11} />Partner Preferences</div>
      {[
        ["Age Range", (profile.partnerPreferences?.ageRange || []).length === 2 ? `${profile.partnerPreferences.ageRange[0]} – ${profile.partnerPreferences.ageRange[1]} years` : "Not specified"],
        ["Location Preference", profile.partnerPreferences?.locationPreference],
        ["Min. Education", profile.partnerPreferences?.educationLevel],
        ["Religion Preference", profile.partnerPreferences?.religionPreference],
        ["Marital Status", profile.partnerPreferences?.maritalStatusPreference],
        ["Height Preference", profile.partnerPreferences?.heightPreference ? profile.partnerPreferences.heightPreference.join(" – ") + " cm" : null],
        ["Lifestyle Compatibility", profile.partnerPreferences?.lifestyleCompatibility],
      ].map(([label, value]) => (
        <div key={label} className="up-pref-item">
          <span className="up-pref-label">{label}</span>
          <span className="up-pref-value">{value || "No preference"}</span>
        </div>
      ))}

      {profile.dealbreakers && (
        <>
          <div className="up-section-divider" />
          <div className="up-subsection-title" style={{ color: "#c03060" }}>
            <X size={11} style={{ color: "#c03060" }} />Dealbreakers
          </div>
          <p style={{ fontSize: "0.85rem", color: "#4a3028", lineHeight: 1.65 }}>{profile.dealbreakers}</p>
        </>
      )}

      {profile.futureAspirations && (
        <>
          <div className="up-section-divider" />
          <div className="up-subsection-title"><Sparkles size={11} />Future Aspirations</div>
          <p style={{ fontSize: "0.85rem", color: "#4a3028", lineHeight: 1.65 }}>{profile.futureAspirations}</p>
        </>
      )}
    </>
  );

  const TABS = [
    { key: "about", label: "About", icon: User, Component: AboutTab },
    { key: "details", label: "Details", icon: BookOpen, Component: DetailsTab },
    { key: "interests", label: "Interests", icon: Sparkles, Component: InterestsTab },
    { key: "lifestyle", label: "Lifestyle", icon: Activity, Component: LifestyleTab },
    { key: "compatibility", label: "Compatibility", icon: HeartHandshake, Component: CompatibilityTab },
    { key: "preferences", label: "Preferences", icon: Target, Component: PreferencesTab },
  ];

  const ActiveComponent = TABS.find(t => t.key === activeTab)?.Component || AboutTab;

  return (
    <>
      <style>{styles}</style>
      <div className="up-root">
        <div className="up-inner">

          {/* Back */}
          <button className="up-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back to browse
          </button>

          {/* ── Hero card ── */}
          <div className="up-hero">
            <div className="up-gallery">
              {currentImage && (
                <img
                  src={currentImage}
                  alt={profile.firstName}
                  className="up-gallery-img"
                  onClick={() => images.length > 1 && setShowGallery(true)}
                />
              )}
              <div className="up-gallery-overlay" />

              {images.length > 1 && (
                <>
                  <button className="up-gallery-nav prev" onClick={prevImage}><ChevronLeft size={16} /></button>
                  <button className="up-gallery-nav next" onClick={nextImage}><ChevronRight size={16} /></button>
                  <div className="up-gallery-dots">
                    {images.map((_, i) => (
                      <button key={i} className={`up-gallery-dot${i === currentImageIndex ? " active" : ""}`} onClick={e => { e.stopPropagation(); setCurrentImageIndex(i); }} />
                    ))}
                  </div>
                  <div className="up-gallery-counter">{currentImageIndex + 1} / {images.length}</div>
                </>
              )}

              {/* Identity overlay */}
              <div className="up-identity">
                <div className="up-name-row">
                  <span className="up-name">{profile.firstName}, {profile.age}</span>
                  {profile.isVerified && (
                    <span className="up-verified-badge"><Check size={9} />Verified</span>
                  )}
                  {profile.isBoosted && (
                    <span className="up-boosted-badge"><Zap size={9} />Boosted</span>
                  )}
                </div>
                <div className="up-meta">
                  <span className="up-meta-item"><MapPin size={12} />{profile.city}, {profile.district}</span>
                  {profile.profession && <span className="up-meta-item"><Briefcase size={12} />{profile.profession}</span>}
                  {profile.education && <span className="up-meta-item"><GraduationCap size={12} />{profile.education}</span>}
                  {profile.religion && <span className="up-meta-item"><BookOpen size={12} />{profile.religion}</span>}
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="up-action-bar">
              <div className="up-action-left">
                <button
                  type="button"
                  className={`up-btn up-btn-like${isLiked ? " active" : ""}`}
                  onClick={() => toggleLike(profile.id)}
                >
                  <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                  {isLiked ? "Liked" : "Like"}
                </button>
                <button
                  type="button"
                  className={`up-btn up-btn-connect${hasRequestSent ? " active" : ""}`}
                  onClick={() => toggleFriendRequest(profile.id)}
                >
                  <UserPlus size={14} />
                  {hasRequestSent ? "Requested" : "Connect"}
                </button>
                <Link to={`/messages?user=${profile.id}`} className="up-btn up-btn-msg" style={{ textDecoration: "none" }}>
                  <MessageCircle size={14} /> Message
                </Link>
              </div>
              {matchPct && (
                <div className="up-match-score">
                  <span className="up-match-pct">{matchPct}%</span>
                  <span className="up-match-label">match</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs card ── */}
          <div className="up-tabs-card">
            <nav className="up-tabs-nav">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} className={`up-tab-btn${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>
                  <Icon size={13} />{label}
                </button>
              ))}
            </nav>
            <div className="up-tab-body">
              <ActiveComponent />
            </div>
          </div>

          {/* ── Suggested actions ── */}
          <div className="up-actions-card">
            <div className="up-subsection-title"><Sparkles size={11} />Suggested Next Steps</div>
            <div className="up-actions-grid">
              <Link to={`/messages?user=${profile.id}`} className="up-action-item" style={{ textDecoration: "none" }}>
                <div className="up-action-icon"><MessageCircle size={18} color="#fff" /></div>
                <div>
                  <div className="up-action-title">Start a Conversation</div>
                  <div className="up-action-sub">Send the first message</div>
                </div>
              </Link>
              <button
                type="button"
                className="up-action-item"
                onClick={() => toggleFriendRequest(profile.id)}
              >
                <div className="up-action-icon"><UserPlus size={18} color="#fff" /></div>
                <div>
                  <div className="up-action-title">{hasRequestSent ? "Cancel Request" : "Send Connection"}</div>
                  <div className="up-action-sub">{hasRequestSent ? "Withdraw your request" : "Express your interest"}</div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Gallery Modal ── */}
      {showGallery && images.length > 1 && (
        <div className="up-modal-overlay" onClick={() => setShowGallery(false)}>
          <div className="up-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="up-modal-close" onClick={() => setShowGallery(false)}><X size={15} /></button>
            <img src={images[currentImageIndex]} alt={profile.firstName} className="up-modal-img" />
            {images.length > 1 && (
              <>
                <button className="up-gallery-nav prev" style={{ top: "50%", transform: "translateY(-50%)", left: "0.5rem" }} onClick={prevImage}><ChevronLeft size={16} /></button>
                <button className="up-gallery-nav next" style={{ top: "50%", transform: "translateY(-50%)", right: "0.5rem" }} onClick={nextImage}><ChevronRight size={16} /></button>
              </>
            )}
            <div className="up-modal-thumbs">
              {images.map((img, i) => (
                <img key={i} src={img} alt={`${profile.firstName} ${i + 1}`}
                  className={`up-modal-thumb${i === currentImageIndex ? " active" : ""}`}
                  onClick={() => setCurrentImageIndex(i)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;