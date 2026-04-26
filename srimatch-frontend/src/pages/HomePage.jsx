import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart, Star, Check, MapPin, Briefcase, GraduationCap,
  BookOpen, Search, ChevronDown, ChevronRight,
  Crown, Zap, Shield, ArrowUp, ArrowDown, Sparkles,
  Filter, RefreshCw, Loader2, Image as ImageIcon
} from "lucide-react";
import ProfileService from "../services/profile.service";

/* ─── Options Data ──────────────────────────────────────────────────────── */
const PROFILE_OPTIONS = {
  maritalStatus: ["Never Married", "Divorced", "Widowed", "Separated", "Annulled"],
  religion: ["Buddhist", "Hindu", "Muslim", "Christian", "Catholic", "No Religion", "Other"],
  ethnicity: ["Sinhalese", "Tamil", "Moor", "Burgher", "Malay", "Other"],
  education: ["High School", "Diploma", "Bachelors", "Masters", "Doctorate", "Professional Certification", "Other"],
  bodyType: ["Slim", "Athletic", "Average", "Overweight", "Plus Size", "Muscular"],
  complexion: ["Fair", "Wheatish", "Medium", "Dusky", "Dark"],
  smoking: ["Never", "Occasionally", "Regularly", "Trying to Quit"],
  drinking: ["Never", "Socially", "Occasionally", "Regularly"],
  dietary: ["Vegetarian", "Vegan", "Non Vegetarian", "Pescatarian", "No Preference"],
  horoscope: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  districts: ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"],
  interests: ["Music", "Travel", "Photography", "Reading", "Movies", "Gaming", "Cooking", "Sports", "Yoga", "Dancing"],
  industries: ["Technology", "Healthcare", "Finance", "Education", "Engineering", "Arts", "Government", "Other"],
  incomeRanges: ["Less than 50k", "50k - 100k", "100k - 200k", "200k - 500k", "Above 500k"]
};

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .hp-root * { box-sizing: border-box; }

  .hp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2rem 1.5rem 4rem;
  }

  @keyframes spin { 100% { transform:rotate(360deg); } }
  .spinning { animation: spin 1s linear infinite; }

  /* ── Page header ── */
  .hp-page-header {
    max-width: 1200px;
    margin: 0 auto 2rem;
  }
  .hp-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 600;
    color: #2d1810;
    line-height: 1.1;
  }
  .hp-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hp-page-sub { font-size: 0.85rem; color: #9a7060; margin-top: 0.25rem; }

  /* ── Search bar ── */
  .hp-search-wrap {
    max-width: 1200px;
    margin: 0 auto 1.75rem;
    position: relative;
  }
  .hp-search-icon {
    position: absolute; left: 1.1rem; top: 50%; transform: translateY(-50%);
    color: #c4a99a; pointer-events: none;
  }
  .hp-search {
    width: 100%;
    padding: 0.85rem 1.25rem 0.85rem 3rem;
    border: 1.5px solid #e8ddd8; border-radius: 14px;
    font-size: 0.9rem; color: #2d1810; background: #fff;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 16px rgba(120,60,30,0.06);
    outline: none; transition: all 0.2s;
  }
  .hp-search:focus { border-color: #c9856a; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .hp-search::placeholder { color: #c4b0a5; }

  /* ── Layout ── */
  .hp-layout {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 272px 1fr;
    gap: 1.75rem;
    align-items: start;
  }
  @media (max-width: 900px) {
    .hp-layout { grid-template-columns: 1fr; }
    .hp-sidebar { position: static !important; }
  }

  /* ── Sidebar ── */
  .hp-sidebar {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(120,60,30,0.08), 0 2px 8px rgba(0,0,0,0.04);
    overflow: hidden;
    position: sticky;
    top: 1.5rem;
  }
  .hp-sidebar-header {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.25rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .hp-sidebar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #fff;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .hp-sidebar-reset {
    background: rgba(255,255,255,0.15); border: none;
    color: #fff; font-size: 0.72rem; padding: 0.3rem 0.65rem;
    border-radius: 99px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.2s; display: flex; align-items: center; gap: 4px;
  }
  .hp-sidebar-reset:hover { background: rgba(255,255,255,0.25); }

  .hp-sidebar-body { padding: 1.25rem 1.5rem; max-height: calc(100vh - 120px); overflow-y: auto; }
  .hp-sidebar-body::-webkit-scrollbar { width: 3px; }
  .hp-sidebar-body::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 99px; }

  /* Premium banner */
  .hp-premium-banner {
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border: 1px solid #f0ddd5; border-radius: 12px;
    padding: 1rem; margin-bottom: 1.25rem;
  }
  .hp-premium-banner h4 {
    font-weight: 600; color: #4a3028; font-size: 0.82rem;
    display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem;
  }
  .hp-premium-banner p { font-size: 0.73rem; color: #9a7060; line-height: 1.5; margin-bottom: 0.65rem; }
  .hp-premium-cta {
    display: inline-block;
    padding: 0.4rem 1rem; border-radius: 99px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; font-size: 0.75rem; font-weight: 500;
    text-decoration: none; transition: opacity 0.2s;
  }
  .hp-premium-cta:hover { opacity: 0.88; }

  /* Filter groups */
  .hp-filter-group { margin-bottom: 1.1rem; }
  .hp-filter-group-title {
    font-size: 0.7rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.09em;
    color: #8b4e2e; margin-bottom: 0.6rem;
  }
  .hp-filter-label {
    display: block; font-size: 0.77rem; font-weight: 500;
    color: #4a3028; margin-bottom: 0.28rem; margin-top: 0.5rem;
  }
  .hp-filter-select {
    width: 100%; padding: 0.52rem 0.8rem;
    border: 1.5px solid #e8ddd8; border-radius: 8px;
    font-size: 0.81rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif;
    appearance: none; outline: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%23c9856a' d='M0 0l5 7 5-7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.75rem center;
    padding-right: 2rem;
    transition: border-color 0.2s;
  }
  .hp-filter-select:focus { border-color: #c9856a; }

  .hp-range-label { font-size: 0.74rem; color: #9a7060; margin-top: 0.5rem; margin-bottom: 0.2rem; }
  input[type=range] { width: 100%; accent-color: #8b4e2e; margin-bottom: 0.2rem; }

  .hp-filter-divider { height: 1px; background: #f0ddd5; margin: 1rem 0; }

  /* Advanced toggle */
  .hp-advanced-toggle {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    background: none; border: none; cursor: pointer;
    font-size: 0.8rem; font-weight: 500; color: #8b4e2e;
    padding: 0.4rem 0; font-family: 'DM Sans', sans-serif;
  }
  .hp-advanced-toggle:disabled { color: #b09080; cursor: not-allowed; }

  /* Verified checkbox */
  .hp-verify-row {
    display: flex; align-items: center; gap: 0.5rem;
    margin: 0.5rem 0;
  }
  .hp-verify-row input { accent-color: #8b4e2e; width: 15px; height: 15px; cursor: pointer; }
  .hp-verify-row label { font-size: 0.79rem; color: #6b4a3a; cursor: pointer; }

  /* Likes meter */
  .hp-likes-meter {
    background: #fdf5ee; border: 1px solid #f0ddd5;
    border-radius: 10px; padding: 0.85rem;
    margin-top: 1rem;
  }
  .hp-likes-meter-top {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 0.45rem;
  }
  .hp-likes-label { font-size: 0.78rem; font-weight: 500; color: #4a3028; display: flex; align-items: center; gap: 0.35rem; }
  .hp-likes-count { font-size: 0.78rem; font-weight: 600; color: #8b4e2e; }
  .hp-likes-track { height: 4px; background: #ede5e0; border-radius: 99px; overflow: hidden; }
  .hp-likes-fill { height: 100%; background: linear-gradient(90deg, #8b4e2e, #c9856a); border-radius: 99px; transition: width 0.4s; }
  .hp-likes-note { font-size: 0.69rem; color: #9a7060; margin-top: 0.4rem; }

  /* Interests chip filter */
  .hp-interests-filter { display: flex; flex-wrap: wrap; gap: 0.35rem; max-height: 110px; overflow-y: auto; border: 1.5px solid #e8ddd8; border-radius: 10px; padding: 0.55rem; background: #fdf8f5; margin-top: 0.25rem; }
  .hp-interests-filter::-webkit-scrollbar { width: 3px; }
  .hp-interests-filter::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 99px; }
  .hp-chip-filter {
    padding: 0.22rem 0.6rem; border-radius: 99px; font-size: 0.71rem;
    border: 1.5px solid #e8ddd8; color: #6b4a3a; background: #fff;
    cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .hp-chip-filter:hover { border-color: #c9856a; }
  .hp-chip-filter.sel { background: linear-gradient(135deg, #3d1f12, #8b4e2e); color: #fff; border-color: transparent; }

  /* ── Sort row ── */
  .hp-sort-row {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.65rem; margin-bottom: 1.4rem;
  }
  .hp-result-count { font-size: 0.85rem; color: #9a7060; }
  .hp-result-count strong { color: #2d1810; }
  .hp-sort-btns { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .hp-sort-btn {
    padding: 0.38rem 0.8rem; border-radius: 99px;
    font-size: 0.74rem; font-weight: 500; cursor: pointer;
    border: 1.5px solid #e8ddd8; background: #fdf8f5;
    color: #6b4a3a; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; display: flex; align-items: center; gap: 3px;
  }
  .hp-sort-btn:hover { border-color: #c9856a; }
  .hp-sort-btn.active {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 10px rgba(139,78,46,0.22);
  }

  /* ── Profile cards grid ── */
  .hp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.2rem;
  }

  /* ── Profile card ── */
  .hp-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.07), 0 2px 6px rgba(0,0,0,0.03);
    overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s;
    position: relative;
    display: flex; flex-direction: column;
  }
  .hp-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 44px rgba(120,60,30,0.13), 0 4px 10px rgba(0,0,0,0.05);
  }
  .hp-card.boosted { box-shadow: 0 0 0 2px #e07a30, 0 12px 36px rgba(120,60,30,0.1); }

  /* Card image */
  .hp-card-img-wrap { position: relative; height: 190px; overflow: hidden; flex-shrink: 0; }
  .hp-card-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
  .hp-card:hover .hp-card-img { transform: scale(1.05); }
  .hp-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(30,10,5,0.58) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Badges */
  .hp-badge {
    position: absolute; top: 0.65rem; left: 0.65rem;
    padding: 0.22rem 0.6rem; border-radius: 99px;
    font-size: 0.67rem; font-weight: 600;
    display: flex; align-items: center; gap: 3px;
    backdrop-filter: blur(6px);
  }
  .hp-badge.verified { background: rgba(61,31,18,0.85); color: #e8c97a; }
  .hp-badge.boosted {
    top: 0.65rem; left: auto; right: 0.65rem;
    background: linear-gradient(135deg, #e07a30, #c93a1a);
    color: #fff;
  }

  /* Action buttons on card */
  .hp-card-actions {
    position: absolute; bottom: 0.7rem; right: 0.7rem;
    display: flex; gap: 0.4rem;
  }
  .hp-action-btn {
    width: 33px; height: 33px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: none; cursor: pointer; transition: all 0.2s;
    backdrop-filter: blur(6px);
  }
  .hp-action-btn.like { background: rgba(255,255,255,0.9); color: #b09080; }
  .hp-action-btn.like.active { background: #f4c9d0; color: #c03060; }
  .hp-action-btn.like:hover { background: #fff; color: #c9856a; }
  .hp-action-btn.star { background: rgba(255,255,255,0.9); color: #b09080; }
  .hp-action-btn.star.active { background: #fff5d1; color: #d4a017; }
  .hp-action-btn.star:hover { background: #fff; color: #d4a017; }

  /* Card body */
  .hp-card-body { padding: 1rem 1.2rem 1.15rem; flex: 1; display: flex; flex-direction: column; }

  .hp-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 600; color: #2d1810;
    text-decoration: none; transition: color 0.2s; line-height: 1.1;
    display: block; margin-bottom: 0.2rem;
  }
  .hp-card-name:hover { color: #8b4e2e; }

  .hp-card-location { font-size: 0.74rem; color: #9a7060; display: flex; align-items: center; gap: 3px; margin-bottom: 0.6rem; }

  .hp-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.65rem; }
  .hp-tag {
    padding: 0.22rem 0.6rem; border-radius: 99px;
    font-size: 0.69rem; font-weight: 500;
    display: flex; align-items: center; gap: 3px;
  }
  .hp-tag.profession { background: #fdf0e8; color: #8b4e2e; }
  .hp-tag.education { background: #edf5fd; color: #3a6ea8; }
  .hp-tag.religion { background: #f5f0fa; color: #6a40a8; }

  .hp-card-about {
    font-size: 0.79rem; color: #6b4a3a; line-height: 1.55;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; margin-bottom: 0.65rem;
    flex: 1;
  }

  .hp-interests { display: flex; flex-wrap: wrap; gap: 0.28rem; margin-bottom: 0.8rem; }
  .hp-interest {
    background: #f5ede8; color: #8b5e4a;
    font-size: 0.67rem; padding: 0.18rem 0.5rem; border-radius: 99px;
  }

  .hp-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 0.7rem; border-top: 1px solid #f5ede8;
  }
  .hp-view-link {
    font-size: 0.77rem; font-weight: 500; color: #8b4e2e;
    text-decoration: none; display: flex; align-items: center; gap: 3px;
    transition: gap 0.2s;
  }
  .hp-view-link:hover { gap: 6px; }
  .hp-match-score {
    font-size: 0.71rem; font-weight: 600;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Empty state ── */
  .hp-empty {
    text-align: center; padding: 4rem 2rem;
    background: #fff; border-radius: 20px;
    box-shadow: 0 8px 28px rgba(120,60,30,0.06);
  }
  .hp-empty-icon {
    width: 68px; height: 68px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }
  .hp-empty h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: #2d1810; margin-bottom: 0.4rem; }
  .hp-empty p { font-size: 0.85rem; color: #9a7060; }

  @media (max-width: 600px) {
    .hp-root { padding: 1.25rem 1rem 3rem; }
    .hp-page-title { font-size: 1.6rem; }
    .hp-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
const HomePage = () => {
  const {
    likedProfiles = [],
    toggleLike,
    subscription = {},
    likesRemaining = 5,
    user: currentUser
  } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    ageFrom: 18,
    ageTo: 60,
    gender: "",
    maritalStatus: "",
    hasChildren: "",
    city: "",
    district: "",
    ethnicity: "",
    religion: "",
    education: "",
    profession: "",
    industry: "",
    income: "",
    heightFrom: 140,
    heightTo: 220,
    bodyType: "",
    smoking: "",
    drinking: "",
    dietaryPreferences: "",
    verified: false,
    horoscopeSign: "",
    interests: [],
  });

  const isPremium = subscription?.plan === "premium" || currentUser?.premium;

  // Infinite Scroll Observer
  const observerRef = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  const loadProfiles = async (pNum, isNew = false) => {
    setLoading(true);
    try {
      const mapEnum = (val) => val ? val.toUpperCase().replace(/\s+/g, '_') : null;
      
      const searchParams = {
        ...filters,
        page: pNum,
        size: 12,
        sortBy: sortOrder,
        query: searchTerm,
        maritalStatus: mapEnum(filters.maritalStatus),
        religion: mapEnum(filters.religion),
        ethnicity: mapEnum(filters.ethnicity),
        education: mapEnum(filters.education),
        gender: mapEnum(filters.gender),
        bodyType: mapEnum(filters.bodyType),
        smoking: mapEnum(filters.smoking),
        drinking: mapEnum(filters.drinking),
        dietaryPreferences: mapEnum(filters.dietaryPreferences),
        horoscopeSign: mapEnum(filters.horoscopeSign),
        hasChildren: filters.hasChildren === "" ? null : filters.hasChildren === "true"
      };

      const res = await ProfileService.searchProfiles(searchParams);
      if (res.success) {
        const newProfiles = res.data.content || [];
        setProfiles(prev => isNew ? newProfiles : [...prev, ...newProfiles]);
        setHasMore(!res.data.last);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    loadProfiles(0, true);
  }, [filters, searchTerm, sortOrder]);

  useEffect(() => {
    if (page > 0) {
      loadProfiles(page, false);
    }
  }, [page]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleRange = (name, val, isMax) => {
    setFilters(p => ({ 
      ...p, [isMax ? `${name}To` : `${name}From`]: val 
    }));
  };

  const toggleInterest = (interest) => {
    setFilters(p => {
      const cur = p.interests || [];
      return { ...p, interests: cur.includes(interest) ? cur.filter(i => i !== interest) : [...cur, interest] };
    });
  };

  const resetFilters = () => {
    setFilters({
      ageFrom: 18, ageTo: 60, gender: "", maritalStatus: "", hasChildren: "",
      city: "", district: "", ethnicity: "", religion: "", education: "",
      profession: "", industry: "", income: "", heightFrom: 140, heightTo: 220,
      bodyType: "", smoking: "", drinking: "", dietaryPreferences: "",
      verified: false, horoscopeSign: "", interests: [],
    });
    setSearchTerm("");
  };

  const SORT_OPTIONS = [
    { key: "newest", label: "Newest" },
    { key: "age_asc", label: "Age ↑" },
    { key: "age_desc", label: "Age ↓" },
    { key: "height_asc", label: "Height ↑" },
    { key: "height_desc", label: "Height ↓" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">
        <div className="hp-page-header">
          <h1 className="hp-page-title">Find Your <span>Forever</span></h1>
          <p className="hp-page-sub">Discover compatible matches across Sri Lanka</p>
        </div>

        <div className="hp-search-wrap">
          <Search className="hp-search-icon" size={17} />
          <input
            type="text"
            className="hp-search"
            placeholder="Search by name, profession, city…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="hp-layout">
          <aside className="hp-sidebar">
            <div className="hp-sidebar-header">
              <span className="hp-sidebar-title"><Filter size={15} /> Filters</span>
              <button className="hp-sidebar-reset" onClick={resetFilters}><RefreshCw size={10} /> Reset</button>
            </div>

            <div className="hp-sidebar-body">
              {!isPremium && (
                <div className="hp-premium-banner">
                  <h4><Crown size={13} style={{ color: "#d4a017" }} /> Premium Filters</h4>
                  <p>Unlock education, income, lifestyle & horoscope filters to find your ideal match faster.</p>
                  <Link to="/subscription" className="hp-premium-cta">Upgrade Now ✦</Link>
                </div>
              )}

              <div className="hp-filter-group">
                <div className="hp-filter-group-title">Basic</div>
                <label className="hp-filter-label">Looking for</label>
                <select name="gender" value={filters.gender} onChange={handleFilterChange} className="hp-filter-select">
                  <option value="">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <label className="hp-filter-label">Marital Status</label>
                <select name="maritalStatus" value={filters.maritalStatus} onChange={handleFilterChange} className="hp-filter-select">
                  <option value="">Any Status</option>
                  {PROFILE_OPTIONS.maritalStatus.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <label className="hp-filter-label">Has Children</label>
                <select name="hasChildren" value={filters.hasChildren} onChange={handleFilterChange} className="hp-filter-select">
                  <option value="">Any</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                <p className="hp-range-label">Age: {filters.ageFrom} – {filters.ageTo} yrs</p>
                <input type="range" min="18" max="70" value={filters.ageFrom} onChange={e => handleRange("age", +e.target.value, false)} />
                <input type="range" min="18" max="70" value={filters.ageTo} onChange={e => handleRange("age", +e.target.value, true)} />
              </div>

              <div className="hp-filter-divider" />

              <div className="hp-filter-group">
                <div className="hp-filter-group-title">Location & Background</div>
                <label className="hp-filter-label">District</label>
                <select name="district" value={filters.district} onChange={handleFilterChange} className="hp-filter-select">
                  <option value="">Any District</option>
                  {PROFILE_OPTIONS.districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <label className="hp-filter-label">City</label>
                <input name="city" value={filters.city} onChange={handleFilterChange} className="hp-filter-select" placeholder="e.g. Colombo" />
                <label className="hp-filter-label">Religion</label>
                <select name="religion" value={filters.religion} onChange={handleFilterChange} className="hp-filter-select">
                  <option value="">Any Religion</option>
                  {PROFILE_OPTIONS.religion.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <label className="hp-filter-label">Ethnicity</label>
                <select name="ethnicity" value={filters.ethnicity} onChange={handleFilterChange} className="hp-filter-select">
                  <option value="">Any Ethnicity</option>
                  {PROFILE_OPTIONS.ethnicity.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div className="hp-filter-divider" />
              <div className="hp-verify-row">
                <input type="checkbox" id="hp-verified" name="verified" checked={filters.verified} onChange={handleFilterChange} />
                <label htmlFor="hp-verified">Verified Profiles Only <Shield size={11} style={{ color: "#5d9e6a", display: "inline" }} /></label>
              </div>
              <div className="hp-filter-divider" />

              <button className="hp-advanced-toggle" onClick={() => isPremium && setShowAdvanced(!showAdvanced)} disabled={!isPremium}>
                <span>Advanced Filters {!isPremium && <Crown size={12} style={{ color: "#d4a017" }} />}</span>
                <ChevronDown size={14} style={{ transform: showAdvanced ? "rotate(180deg)" : "none", transition: "0.2s" }} />
              </button>

              {showAdvanced && isPremium && (
                <div style={{ marginTop: "1rem" }}>
                  <div className="hp-filter-group">
                    <div className="hp-filter-group-title">Education & Career</div>
                    <label className="hp-filter-label">Education Level</label>
                    <select name="education" value={filters.education} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any Education</option>
                      {PROFILE_OPTIONS.education.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <label className="hp-filter-label">Profession</label>
                    <input name="profession" value={filters.profession} onChange={handleFilterChange} className="hp-filter-select" placeholder="Search profession..." />
                    <label className="hp-filter-label">Industry</label>
                    <select name="industry" value={filters.industry} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any Industry</option>
                      {PROFILE_OPTIONS.industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <label className="hp-filter-label">Income Range</label>
                    <select name="income" value={filters.income} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any Income</option>
                      {PROFILE_OPTIONS.incomeRanges.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="hp-filter-divider" />
                  <div className="hp-filter-group">
                    <div className="hp-filter-group-title">Physical & Lifestyle</div>
                    <p className="hp-range-label">Height: {filters.heightFrom} – {filters.heightTo} cm</p>
                    <input type="range" min="120" max="250" value={filters.heightFrom} onChange={e => handleRange("height", +e.target.value, false)} />
                    <input type="range" min="120" max="250" value={filters.heightTo} onChange={e => handleRange("height", +e.target.value, true)} />
                    <label className="hp-filter-label">Body Type</label>
                    <select name="bodyType" value={filters.bodyType} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any</option>
                      {PROFILE_OPTIONS.bodyType.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label className="hp-filter-label">Smoking</label>
                    <select name="smoking" value={filters.smoking} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any</option>
                      {PROFILE_OPTIONS.smoking.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <label className="hp-filter-label">Drinking</label>
                    <select name="drinking" value={filters.drinking} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any</option>
                      {PROFILE_OPTIONS.drinking.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <label className="hp-filter-label">Dietary Preference</label>
                    <select name="dietaryPreferences" value={filters.dietaryPreferences} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any</option>
                      {PROFILE_OPTIONS.dietary.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="hp-filter-divider" />
                  <div className="hp-filter-group">
                    <div className="hp-filter-group-title">Horoscope & Interests</div>
                    <label className="hp-filter-label">Horoscope Sign</label>
                    <select name="horoscopeSign" value={filters.horoscopeSign} onChange={handleFilterChange} className="hp-filter-select">
                      <option value="">Any Sign</option>
                      {PROFILE_OPTIONS.horoscope.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <label className="hp-filter-label" style={{ marginTop: "0.5rem" }}>Interests</label>
                    <div className="hp-interests-filter">
                      {PROFILE_OPTIONS.interests.map(interest => (
                        <button key={interest} type="button" className={`hp-chip-filter${filters.interests.includes(interest) ? " sel" : ""}`} onClick={() => toggleInterest(interest)}>{interest}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!isPremium && (
                <div className="hp-likes-meter">
                  <div className="hp-likes-meter-top">
                    <span className="hp-likes-label"><Heart size={13} style={{ color: "#c9856a" }} /> Daily Likes</span>
                    <span className="hp-likes-count">{likesRemaining} / 5</span>
                  </div>
                  <div className="hp-likes-track"><div className="hp-likes-fill" style={{ width: `${(likesRemaining / 5) * 100}%` }} /></div>
                  <p className="hp-likes-note">Upgrade to Premium for unlimited likes ✦</p>
                </div>
              )}
            </div>
          </aside>

          <main>
            <div className="hp-sort-row">
              <p className="hp-result-count"><strong>{totalElements}</strong> {totalElements === 1 ? "profile" : "profiles"} found</p>
              <div className="hp-sort-btns">
                {SORT_OPTIONS.map(s => (
                  <button key={s.key} className={`hp-sort-btn${sortOrder === s.key ? " active" : ""}`} onClick={() => setSortOrder(s.key)}>{s.label}</button>
                ))}
              </div>
            </div>

            <div className="hp-grid">
              {profiles.map((profile, index) => (
                <div key={profile.id} ref={index === profiles.length - 1 ? lastElementRef : null} className={`hp-card${profile.boosted ? " boosted" : ""}`}>
                  <div className="hp-card-img-wrap">
                    <Link to={`/profile/${profile.id}`}>
                      <img src={profile.profileImage || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop"} alt={profile.firstName} className="hp-card-img" />
                    </Link>
                    <div className="hp-card-img-overlay" />
                    {profile.verified && <div className="hp-badge verified"><Check size={9} /> Verified</div>}
                    {profile.boosted && <div className="hp-badge boosted"><Zap size={9} /> Boosted</div>}
                    <div className="hp-card-actions">
                      <button 
                        className={`hp-action-btn like${(profile.interactionType === 'NORMAL' || likedProfiles.some(p => p.profileId === profile.id && p.type === 'NORMAL')) ? " active" : ""}`} 
                        onClick={() => !(profile.interactionType || likedProfiles.some(p => p.profileId === profile.id)) && toggleLike(profile.id)}
                        title="Like"
                      >
                        <Heart size={14} fill={(profile.interactionType === 'NORMAL' || likedProfiles.some(p => p.profileId === profile.id && p.type === 'NORMAL')) ? "currentColor" : "none"} />
                      </button>

                      <button 
                        className={`hp-action-btn star${(profile.interactionType === 'STAR' || likedProfiles.some(p => p.profileId === profile.id && p.type === 'STAR')) ? " active" : ""}`} 
                        onClick={() => !(profile.interactionType || likedProfiles.some(p => p.profileId === profile.id)) && toggleLike(profile.id, 'STAR')}
                        title="Star Like"
                      >
                        <Star size={14} fill={(profile.interactionType === 'STAR' || likedProfiles.some(p => p.profileId === profile.id && p.type === 'STAR')) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                  <div className="hp-card-body">
                    <Link to={`/profile/${profile.id}`} className="hp-card-name">{profile.firstName}, {profile.age}</Link>
                    <div className="hp-card-location"><MapPin size={10} /> {profile.city}, {profile.district}</div>
                    <div className="hp-tags">
                      {profile.profession && <span className="hp-tag profession"><Briefcase size={9} /> {profile.profession}</span>}
                      {profile.education && <span className="hp-tag education"><GraduationCap size={9} /> {profile.education}</span>}
                      {profile.religion && <span className="hp-tag religion"><BookOpen size={9} /> {profile.religion}</span>}
                    </div>
                    <p className="hp-card-about">{profile.about}</p>
                    {(profile.interests || []).length > 0 && (
                      <div className="hp-interests">
                        {(profile.interests || []).slice(0, 3).map((it, i) => <span key={i} className="hp-interest">{it}</span>)}
                        {(profile.interests || []).length > 3 && <span className="hp-interest">+{profile.interests.length - 3}</span>}
                      </div>
                    )}
                    <div className="hp-card-footer">
                      <Link to={`/profile/${profile.id}`} className="hp-view-link">View Profile <ChevronRight size={12} /></Link>
                      {profile.compatibilityScore && <span className="hp-match-score">{profile.compatibilityScore}% match</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {loading && <div style={{ padding: "2rem", textAlign: "center", color: "#8b4e2e" }}><Loader2 className="spinning" size={32} /></div>}
            {!loading && profiles.length === 0 && (
              <div className="hp-empty">
                <div className="hp-empty-icon"><Search size={28} style={{ color: "#c9856a" }} /></div>
                <h3>No matches found</h3>
                <p>Try adjusting your filters or search terms to see more profiles.</p>
              </div>
            )}
            {!hasMore && profiles.length > 0 && <div style={{ padding: "2rem", textAlign: "center", color: "#9a7060", fontSize: "0.85rem" }}>You've reached the end of the matches ✦</div>}
          </main>
        </div>
      </div>
    </>
  );
};

export default HomePage;