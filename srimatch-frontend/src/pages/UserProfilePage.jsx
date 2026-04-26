import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileService from "../services/profile.service";
import HoroscopeService from "../services/horoscope.service";
import LikeService from "../services/like.service";
import ReportService from "../services/report.service";
import {
  Heart, UserPlus, MessageCircle, Check, X, MapPin, Briefcase,
  GraduationCap, HeartHandshake, Star, BookOpen, ArrowLeft,
  Languages, Coffee, ChevronLeft, ChevronRight,
  Home, Sparkles, Zap, Camera, Music, Plane, Book,
  Film, Gamepad, Dumbbell, Smile, Target, Activity, User, Loader2, Info, Flag
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

  .up-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; color: #9a7060; text-decoration: none;
    margin-bottom: 1.5rem; transition: color 0.2s;
    background: none; border: none; cursor: pointer;
    font-family: inherit;
  }
  .up-back:hover { color: #8b4e2e; }

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
  .up-btn-like { border: 1.5px solid #e8ddd8; background: #fdf8f5; color: #6b4a3a; }
  .up-btn-like.active { background: #fde8ef; border-color: #f0a0b8; color: #c03060; }
  .up-btn-like:hover { border-color: #c9856a; }
  .up-btn-connect { border: 1.5px solid #e8ddd8; background: #fdf8f5; color: #6b4a3a; }
  .up-btn-connect.active { background: #e8eef8; border-color: #a0b8d8; color: #3a6ea8; }
  .up-btn-connect:hover { border-color: #c9856a; }
  .up-btn-msg {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
  }
  .up-btn-msg:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }
  
  .up-btn-star { 
    background: #fff; border: 1px solid #e8c97a; color: #d4a017; padding: 0.7rem;
    box-shadow: 0 4px 12px rgba(212,160,23,0.12);
  }
  .up-btn-star:hover { background: #fffcf0; transform: scale(1.05); }
  .up-btn-star.active { background: linear-gradient(135deg, #e8c97a, #d4a017); color: #fff; border: none; }
  .up-btn-star:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .up-match-score { display: flex; flex-direction: column; align-items: flex-end; }
  .up-match-pct {
    font-size: 1.5rem; font-weight: 600;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    line-height: 1;
  }
  .up-match-label { font-size: 0.68rem; color: #9a7060; }
  .up-match-badge-pill {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #fdf5ee, #f0e6ff);
    color: #6a40a8; font-size: 0.72rem; font-weight: 600;
    padding: 0.35rem 0.8rem; border-radius: 99px;
    border: 1px solid #dcd0f8;
    box-shadow: 0 2px 6px rgba(106,64,168,0.08);
    animation: upPulse 2s infinite;
  }
  @keyframes upPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

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

  .up-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem 1.5rem; }
  .up-info-item { display: flex; flex-direction: column; gap: 2px; padding: 0.6rem 0; border-bottom: 1px solid #faf3ef; }
  .up-info-label { font-size: 0.71rem; color: #b09080; text-transform: uppercase; letter-spacing: 0.06em; }
  .up-info-value { font-size: 0.84rem; color: #2d1810; font-weight: 500; }

  .up-about-text {
    font-size: 0.9rem; color: #4a3028; line-height: 1.75;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border-radius: 14px; padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem; border-left: 3px solid #c9856a;
  }

  .up-interests { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .up-interest {
    display: flex; align-items: center; gap: 0.3rem;
    background: #fdf0e8; color: #8b4e2e;
    font-size: 0.78rem; font-weight: 500;
    padding: 0.35rem 0.8rem; border-radius: 99px;
    border: 1px solid #f0ddd5;
  }

  .up-lang {
    background: #edf5fd; color: #3a6ea8;
    font-size: 0.76rem; padding: 0.3rem 0.75rem; border-radius: 99px;
    border: 1px solid #c8ddf0;
  }

  .up-compat-row { margin-bottom: 1.1rem; }
  .up-compat-header { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem; }
  .up-compat-label { font-weight: 500; color: #4a3028; }
  .up-compat-val { color: #8b4e2e; font-weight: 500; }
  .up-compat-track { height: 5px; background: #f0ddd5; border-radius: 99px; overflow: hidden; }
  .up-compat-fill {
    height: 100%;
    background: linear-gradient(90deg, #3d1f12, #8b4e2e, #c9856a);
    border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1);
  }

  .up-match-hero {
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border: 1px solid #f0ddd5; border-radius: 16px;
    padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .up-match-circle-wrap { flex-shrink: 0; }
  .up-match-hero-text h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 600; color: #2d1810; margin-bottom: 0.25rem; }
  .up-match-hero-text p { font-size: 0.8rem; color: #9a7060; line-height: 1.5; }

  .up-horoscope-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: #f5f0fa; color: #6a40a8;
    font-size: 0.8rem; font-weight: 500;
    padding: 0.4rem 1rem; border-radius: 99px;
    border: 1px solid #e0d0f8; margin-bottom: 1rem;
  }

  .up-pref-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.7rem 0; border-bottom: 1px solid #faf3ef; font-size: 0.83rem;
  }
  .up-pref-label { color: #9a7060; }
  .up-pref-value { color: #2d1810; font-weight: 500; text-align: right; max-width: 55%; }

  .up-modal-overlay {
    position: fixed; inset: 0; background: rgba(10,3,1,0.88);
    z-index: 50; display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .up-modal-inner { position: relative; max-width: 700px; width: 100%; }
  .up-modal-img { width: 100%; max-height: 75vh; object-fit: contain; border-radius: 16px; display: block; }
  .up-modal-close {
    position: absolute; top: -0.75rem; right: -0.75rem;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
    border: none; color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .up-modal-close:hover { background: rgba(255,255,255,0.28); }

  .up-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
  .up-spinner {
    width: 40px; height: 40px; border-radius: 50%;
    border: 3px solid #f0ddd5; border-top-color: #8b4e2e;
    animation: up-spin 0.8s linear infinite;
  }
  @keyframes up-spin { to { transform: rotate(360deg); } }

  .up-not-found { text-align: center; padding: 5rem 2rem; background: #fff; border-radius: 20px; box-shadow: 0 8px 28px rgba(120,60,30,0.07); }
  .up-not-found h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 600; color: #2d1810; margin-bottom: 0.5rem; }
  .up-not-found p { font-size: 0.88rem; color: #9a7060; margin-bottom: 1.5rem; }
  .up-not-found-link {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.65rem 1.5rem; border-radius: 99px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; text-decoration: none; font-size: 0.85rem; font-weight: 500;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
  }

  @media (max-width: 700px) {
    .up-root { padding: 1.25rem 1rem 4rem; }
    .up-gallery { height: 300px; }
    .up-name { font-size: 1.7rem; }
  }
`;

const INTEREST_ICONS = {
  Music, Travel: Plane, Photography: Camera, Reading: Book,
  Movies: Film, Gaming: Gamepad, Cooking: Coffee, Sports: Dumbbell,
  Yoga: Activity, Dancing: Smile,
};

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: authUser, likedProfiles = [], connections = [], toggleLike } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [horoscopeMatch, setHoroscopeMatch] = useState(null);
  const [horoscopeLoading, setHoroscopeLoading] = useState(false);
  const [horoscopeError, setHoroscopeError] = useState(null);
  const [currentInteraction, setCurrentInteraction] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, interactionRes] = await Promise.all([
        ProfileService.getPublicProfile(id),
        LikeService.checkInteraction(id).catch(() => null)
      ]);

      setProfile(profileRes.data || profileRes);

      if (interactionRes?.success && interactionRes.data) {
        setCurrentInteraction(interactionRes.data);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason || !reportDesc) return;
    try {
      setReportLoading(true);
      await ReportService.submitReport({
        reportedUserId: Number(id),
        reason: reportReason,
        description: reportDesc
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason("");
        setReportDesc("");
      }, 2000);
    } catch (err) {
      alert(err.message || "Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
    window.scrollTo(0, 0);
  }, [id]);

  const handleHoroscopeMatch = async () => {
    if (horoscopeMatch) return;
    try {
      setHoroscopeLoading(true);
      setHoroscopeError(null);
      const res = await HoroscopeService.getMatchAnalysis(id);
      if (res.status === 'ok' || res.success) {
        setHoroscopeMatch(res.data);
      } else {
        setHoroscopeError(res.message || "Failed to calculate horoscope match");
      }
    } catch (err) {
      console.error("Horoscope match error:", err);
      setHoroscopeError(err.response?.data?.message || "Failed to call horoscope service");
    } finally {
      setHoroscopeLoading(false);
    }
  };

  if (loading) return (
    <div className="up-root" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <style>{styles}</style>
      <div className="up-spinner" />
    </div>
  );

  if (error || !profile) return (
    <div className="up-root">
      <style>{styles}</style>
      <div className="up-inner">
        <div className="up-not-found">
          <h2>{error || "Profile Not Found"}</h2>
          <p>We couldn't retrieve the requested profile.</p>
          <Link to="/home" className="up-not-found-link">Browse Profiles</Link>
        </div>
      </div>
    </div>
  );

  const images = profile.profileImages && profile.profileImages.length > 0 ? profile.profileImages : [profile.primaryImageUrl].filter(Boolean);
  const currentImage = images[currentImageIndex] || "";

  const effectiveInteraction = currentInteraction || likedProfiles.find(p => p.profileId === Number(id));
  const isLiked = !!effectiveInteraction && (effectiveInteraction.type === 'NORMAL');
  const isStarred = !!effectiveInteraction && (effectiveInteraction.type === 'STAR');

  const isMatched = (connections || []).some(c =>
    c.user1?.id === Number(id) || c.user2?.id === Number(id) || c.matchedUser?.id === Number(id) ||
    (effectiveInteraction?.status === 'ACCEPTED')
  );
  const matchPct = profile.compatibilityScore || 0;

  const nextImage = (e) => { e?.stopPropagation(); setCurrentImageIndex(i => (i + 1) % images.length); };
  const prevImage = (e) => { e?.stopPropagation(); setCurrentImageIndex(i => (i - 1 + images.length) % images.length); };

  const AboutTab = () => (
    <>
      {profile.about && <p className="up-about-text">"{profile.about}"</p>}
      <div className="up-subsection-title"><User size={11} />Basic Information</div>
      <div className="up-info-grid">
        {[
          ["Age", `${profile.age} years`],
          ["Marital Status", profile.maritalStatus],
          ["Gender", profile.gender],
          ["Height", profile.height ? `${profile.height} cm` : "—"],
          ["Body Type", profile.bodyType],
          ["Ethnicity", profile.ethnicity],
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
      <div className="up-subsection-title"><BookOpen size={11} />Religion & Culture</div>
      <div className="up-info-grid">
        {[
          ["Religion", profile.religion],
          ["Religious Practices", profile.religiousPractices],
          ["Family Background", profile.familyBackground],
          ["Wedding Preferences", profile.weddingPreferences],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value">{value || "Not specified"}</span>
          </div>
        ))}
      </div>
      {profile.languages && profile.languages.length > 0 && (
        <>
          <div className="up-section-divider" />
          <div className="up-subsection-title"><Languages size={11} />Languages</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {profile.languages.map((l, i) => <span key={i} className="up-lang">{l}</span>)}
          </div>
        </>
      )}
      <div className="up-section-divider" />
      <div className="up-subsection-title"><GraduationCap size={11} />Education & Career</div>
      <div className="up-info-grid">
        {[
          ["Education", profile.educationLevel],
          ["Field of Study", profile.fieldOfStudy],
          ["Profession", profile.profession],
          ["Industry", profile.industry],
          ["Employer", profile.employer],
          ["Work Location", profile.workLocation],
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
      <div className="up-subsection-title"><Sparkles size={11} />Interests</div>
      <div className="up-interests" style={{ marginBottom: "1.5rem" }}>
        {(profile.interests || []).map((interest, i) => {
          const IconComp = INTEREST_ICONS[interest] || Sparkles;
          return <span key={i} className="up-interest"><IconComp size={12} />{interest}</span>;
        })}
      </div>
      <div className="up-section-divider" />
      <div className="up-subsection-title"><Star size={11} />Favourite Things</div>
      <div className="up-info-grid">
        {Object.entries(profile.favoriteThings || {}).map(([key, val]) => (
          <div key={key} className="up-info-item">
            <span className="up-info-label" style={{ textTransform: 'capitalize' }}>{key}</span>
            <span className="up-info-value">{val || "Not specified"}</span>
          </div>
        ))}
      </div>
    </>
  );

  const LifestyleTab = () => (
    <>
      <div className="up-subsection-title"><Activity size={11} />Lifestyle</div>
      <div className="up-info-grid">
        {[
          ["Complexion", profile.complexion],
          ["Smoking", profile.smoking],
          ["Drinking", profile.drinking],
          ["Dietary", profile.dietaryPreferences],
        ].map(([label, value]) => (
          <div key={label} className="up-info-item">
            <span className="up-info-label">{label}</span>
            <span className="up-info-value" style={{ textTransform: "capitalize" }}>{value || "Not specified"}</span>
          </div>
        ))}
      </div>
      {profile.lifestyle && (
        <>
          <div className="up-section-divider" />
          <div className="up-subsection-title"><Home size={11} />Daily Lifestyle</div>
          <p style={{ fontSize: "0.85rem", color: "#4a3028", lineHeight: 1.65 }}>{profile.lifestyle}</p>
        </>
      )}
    </>
  );

  const CompatibilityTab = () => (
    <>
      <div className="up-match-hero">
        <div className="up-match-circle-wrap">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" stroke="#f0ddd5" strokeWidth="5" fill="none" />
            <circle cx="40" cy="40" r="32" stroke="url(#matchGrad)" strokeWidth="5" fill="none"
              strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - matchPct / 100)}
              strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
            <defs>
              <linearGradient id="matchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3d1f12" /><stop offset="100%" stopColor="#c9856a" />
              </linearGradient>
            </defs>
            <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="700" fill="#8b4e2e">{matchPct}%</text>
          </svg>
        </div>
        <div className="up-match-hero-text">
          <h4>Compatibility Score</h4>
          <p>Based on shared interests and preferences between you and {profile.firstName}.</p>
        </div>
      </div>
      <div className="up-subsection-title"><Star size={11} />Horoscope</div>
      <div className="up-horoscope-pill"><Star size={13} />{profile.horoscopeSign || "Not shared"}</div>
      <div className="up-subsection-title"><Star size={11} />Detailed Horoscope Matching</div>

      {!authUser?.dateOfBirth ? (
        <div className="up-about-text" style={{ background: "#fff9f2", borderLeftColor: "#e8c97a" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <Info size={16} style={{ color: "#d4a017", marginTop: "2px" }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: "#8b4e2e", fontSize: "0.85rem" }}>Profile Incomplete</p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: "#9a7060" }}>
                Add your birth date and place to your profile to see detailed horoscope matching (Porutham) with {profile.firstName}.
              </p>
              <Link to="/profile/edit" style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "0.8rem", color: "#8b4e2e", fontWeight: 600 }}>Update My Profile →</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="horoscope-match-box">
          {!horoscopeMatch && !horoscopeLoading && (
            <button className="up-btn up-btn-connect" style={{ width: "100%", justifyContent: "center" }} onClick={handleHoroscopeMatch}>
              Check Detailed Porutham Compatibility
            </button>
          )}

          {horoscopeLoading && (
            <div style={{ textAlign: "center", padding: "1.5rem", color: "#8b4e2e" }}>
              <Loader2 className="up-spinner" size={24} style={{ margin: "0 auto 0.5rem" }} />
              <p style={{ fontSize: "0.85rem" }}>Analyzing astrological alignment...</p>
            </div>
          )}

          {horoscopeError && (
            <div style={{ padding: "1rem", background: "#fff5f5", borderRadius: "10px", color: "#c03060", fontSize: "0.85rem", border: "1px solid #fed7d7" }}>
              {horoscopeError}
            </div>
          )}

          {horoscopeMatch && (
            <div className="horoscope-results">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", padding: "0 0.5rem" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#2d1810" }}>Porutham Analysis</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#8b4e2e" }}>
                  {horoscopeMatch.total_points || horoscopeMatch.totalPoints || 0} / {horoscopeMatch.maximum_points || horoscopeMatch.maximumPoints || 10}
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", padding: "0.85rem", background: "#fff", borderRadius: "12px", border: "1px solid #f0ddd5", boxShadow: "0 2px 8px rgba(100,50,30,0.03)" }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "0.6rem", color: "#b09080", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>Target Profile</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4a3028" }}>
                    {profile.gender === 'MALE' ? horoscopeMatch.boy_info?.nakshatra?.name : horoscopeMatch.girl_info?.nakshatra?.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#8b4e2e", fontWeight: 500 }}>
                    {profile.gender === 'MALE' ? horoscopeMatch.boy_info?.rasi?.name : horoscopeMatch.girl_info?.rasi?.name} Rasi
                  </div>
                </div>
                <div style={{ width: "1px", background: "#f0ddd5" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "0.6rem", color: "#b09080", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>You</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4a3028" }}>
                    {profile.gender === 'MALE' ? horoscopeMatch.girl_info?.nakshatra?.name : horoscopeMatch.boy_info?.nakshatra?.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#8b4e2e", fontWeight: 500 }}>
                    {profile.gender === 'MALE' ? horoscopeMatch.girl_info?.rasi?.name : horoscopeMatch.boy_info?.rasi?.name} Rasi
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {Array.isArray(horoscopeMatch.matches) ? (
                  horoscopeMatch.matches.map((m) => (
                    <div key={m.id} style={{ padding: "0.65rem 0.85rem", background: "#fff", borderRadius: "10px", border: "1px solid #f0ddd5", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#b09080", letterSpacing: "0.05em" }}>{m.name}</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: m.has_porutham ? "#2e7d32" : "#c62828", display: "flex", alignItems: "center", gap: "4px" }}>
                        {m.has_porutham ? <Check size={10} /> : <X size={10} />}
                        {m.has_porutham ? "Matched" : "No Match"}
                      </div>
                    </div>
                  ))
                ) : (
                  Object.entries(horoscopeMatch.matches || {}).map(([key, val]) => (
                    <div key={key} style={{ padding: "0.65rem 0.85rem", background: "#fff", borderRadius: "10px", border: "1px solid #f0ddd5" }}>
                      <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#b09080", letterSpacing: "0.05em" }}>{key}</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: val.match ? "#2e7d32" : "#c62828" }}>
                        {val.match ? "Matched" : "No Match"} {val.points ? `(${val.points})` : ""}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {(horoscopeMatch.message?.description || horoscopeMatch.conclusion) && (
                <div style={{ marginTop: "1.5rem", padding: "1.25rem", background: "linear-gradient(135deg, #fdf5ee, #f9f0ff)", borderRadius: "16px", border: "1px solid #e0d0f8" }}>
                  <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#8b4e2e", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                    Matching Conclusion: {horoscopeMatch.message?.type || ''}
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#4a3028", lineHeight: 1.6, margin: 0 }}>
                    {horoscopeMatch.message?.description || horoscopeMatch.conclusion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );

  const PreferencesTab = () => (
    <>
      <div className="up-subsection-title"><Target size={11} />What {profile.firstName} is looking for</div>
      {Object.entries(profile.partnerPreferences || {}).map(([key, val]) => {
        let displayValue = val;
        if (Array.isArray(val) && val.length === 2) {
          displayValue = `${val[0]} – ${val[1]} ${key === 'ageRange' ? 'years' : ''}`;
        } else if (Array.isArray(val)) {
          displayValue = val.join(", ");
        }

        return (
          <div key={key} className="up-pref-item">
            <span className="up-pref-label" style={{ textTransform: 'capitalize' }}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <span className="up-pref-value" style={{ textTransform: Array.isArray(val) ? "none" : "capitalize" }}>
              {displayValue || "No preference"}
            </span>
          </div>
        );
      })}
      {profile.dealbreakers && (
        <>
          <div className="up-section-divider" />
          <div className="up-subsection-title" style={{ color: "#c03060" }}><X size={11} />Dealbreakers</div>
          <p style={{ fontSize: "0.85rem", color: "#4a3028", lineHeight: 1.65 }}>{profile.dealbreakers}</p>
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
          <button className="up-back" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Back to browse</button>

          <div className="up-hero">
            <div className="up-gallery">
              {currentImage && <img src={currentImage} alt={profile.firstName} className="up-gallery-img" onClick={() => images.length > 1 && setShowGallery(true)} />}
              <div className="up-gallery-overlay" />
              {images.length > 1 && (
                <>
                  <button className="up-gallery-nav prev" onClick={prevImage}><ChevronLeft size={16} /></button>
                  <button className="up-gallery-nav next" onClick={nextImage}><ChevronRight size={16} /></button>
                  <div className="up-gallery-dots">
                    {images.map((_, i) => <button key={i} className={`up-gallery-dot${i === currentImageIndex ? " active" : ""}`} onClick={e => { e.stopPropagation(); setCurrentImageIndex(i); }} />)}
                  </div>
                </>
              )}
              <div className="up-identity">
                <div className="up-name-row">
                  <span className="up-name">{profile.firstName} {profile.lastName}, {profile.age}</span>
                  {(profile.verified || profile.isVerified) && <span className="up-verified-badge"><Check size={9} />Verified</span>}
                  {(profile.boosted || profile.isBoosted) && <span className="up-boosted-badge"><Zap size={9} />Boosted</span>}
                </div>
                <div className="up-meta">
                  <span className="up-meta-item"><MapPin size={12} />{profile.city}, {profile.district}</span>
                  {profile.profession && <span className="up-meta-item"><Briefcase size={12} />{profile.profession}</span>}
                </div>
              </div>
            </div>

            <div className="up-action-bar">
              <div className="up-action-left">
                <button
                  type="button"
                  className={`up-btn up-btn-like${isLiked || isMatched ? " active" : ""}`}
                  onClick={() => !isLiked && !isMatched && toggleLike(Number(id))}
                >
                  <Heart size={14} fill={isLiked || isMatched ? "currentColor" : "none"} />
                  {isMatched ? "Matched" : isLiked ? "Liked" : "Like"}
                </button>

                <button
                  type="button"
                  className={`up-btn up-btn-star${isStarred ? " active" : ""}`}
                  onClick={() => !isStarred && !isMatched && toggleLike(Number(id), 'STAR')}
                  title="Star Like"
                  style={{ minWidth: "42px", padding: 0, justifyContent: "center" }}
                >
                  <Star size={16} fill={isStarred ? "currentColor" : "none"} />
                </button>

                <Link
                  to={`/chat?recipient=${profile.id}`}
                  className="up-btn up-btn-msg"
                  style={{ textDecoration: "none" }}
                >
                  <MessageCircle size={14} /> Message
                </Link>

                {isMatched && (
                  <span className="up-match-badge-pill">
                    <Sparkles size={12} /> Mutual Match
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  className="up-btn up-btn-msg" 
                  style={{ minWidth: '42px', padding: 0, justifyContent: 'center', borderColor: '#f0ddd5' }}
                  title="Report User"
                  onClick={() => setShowReportModal(true)}
                >
                  <Flag size={14} />
                </button>
                <div className="up-match-score">
                  <span className="up-match-pct">{matchPct}%</span><span className="up-match-label">match</span>
                </div>
              </div>
            </div>
          </div>

          <div className="up-tabs-card">
            <nav className="up-tabs-nav">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} className={`up-tab-btn${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}><Icon size={13} /> {label}</button>
              ))}
            </nav>
            <div className="up-tab-body"><ActiveComponent /></div>
          </div>
        </div>
      </div>

      {showGallery && (
        <div className="up-modal-overlay" onClick={() => setShowGallery(false)}>
          <div className="up-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="up-modal-close" onClick={() => setShowGallery(false)}><X size={15} /></button>
            <img src={images[currentImageIndex]} alt={profile.firstName} className="up-modal-img" />
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="up-modal-overlay" onClick={() => !reportLoading && setShowReportModal(false)}>
          <div className="up-modal-inner" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Report User</h3>
                <button className="up-modal-close" style={{ position: 'static' }} onClick={() => setShowReportModal(false)}><X size={15} /></button>
              </div>

              {reportSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Check size={24} />
                  </div>
                  <p style={{ fontWeight: 600, color: '#2d1810' }}>Report Submitted</p>
                  <p style={{ fontSize: '0.85rem', color: '#9a7060', marginTop: '0.25rem' }}>Thank you for helping us keep our community safe.</p>
                </div>
              ) : (
                <form onSubmit={handleReport}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b4e2e', marginBottom: '0.4rem', display: 'block' }}>Reason for report</label>
                    <select 
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1.5px solid #f0ddd5', fontSize: '0.85rem', outline: 'none' }}
                      value={reportReason}
                      onChange={e => setReportReason(e.target.value)}
                      required
                    >
                      <option value="">Select a reason</option>
                      <option value="FAKE_PROFILE">Fake Profile / Identity</option>
                      <option value="HARASSMENT">Harassment or Abuse</option>
                      <option value="INAPPROPRIATE_CONTENT">Inappropriate Photos/Bio</option>
                      <option value="SPAM">Spam or Scamming</option>
                      <option value="UNDERAGE">User appears underage</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b4e2e', marginBottom: '0.4rem', display: 'block' }}>Tell us more</label>
                    <textarea 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid #f0ddd5', fontSize: '0.85rem', outline: 'none', resize: 'none', minHeight: '100px' }}
                      placeholder="Please provide details about the violation..."
                      value={reportDesc}
                      onChange={e => setReportDesc(e.target.value)}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={reportLoading}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '99px', border: 'none', background: 'linear-gradient(135deg, #3d1f12, #8b4e2e)', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {reportLoading ? <Loader2 size={16} className="animate-spin" /> : <Flag size={14} />}
                    Submit Report
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfilePage;