// ProfileCreationPage.jsx - Redesigned Luxury Version
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Camera, BookOpen, Briefcase, Heart, Star, CheckCircle, User,
  FileText, Image, MapPin, Home, Globe, GraduationCap, Building,
  Clock, DollarSign, Ruler, Activity, Coffee, Wine, Users, Languages,
  Cake, UserCheck, MessageCircle, AlertTriangle, Award, PlusCircle, X,
  Shield, Zap, TrendingUp, Smile, Music,
  Film, Dumbbell, Book, Plane, Gamepad, Mail,
  Sparkles, Gift, Bell, Lock, Upload, Save, RefreshCw, Eye,
  Target, Check, XCircle, Info, AlertCircle, Calendar,
} from "lucide-react";
import { profileOptions } from "../data/dummyData";

/* ─── Global styles ──────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .pc-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
  }

  /* ── Header ─── */
  .pc-header {
    text-align: center;
    padding: 2.5rem 1rem 1rem;
    position: relative;
  }
  .pc-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.25rem;
    text-decoration: none; display: inline-block;
  }
  .pc-header h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600;
    color: #2d1810; margin-bottom: 0.35rem; line-height: 1.2;
  }
  .pc-header p { font-size: 0.88rem; color: #9a7060; }

  /* ── Score circle ─── */
  .pc-score-pill {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: #fff; border-radius: 99px; padding: 0.5rem 1.25rem;
    box-shadow: 0 4px 16px rgba(139,78,46,0.1);
    margin-top: 1rem; border: 1px solid #f0ddd5;
  }
  .pc-score-pill .label { font-size: 0.8rem; font-weight: 500; color: #4a3028; }
  .pc-score-pill .sublabel { font-size: 0.7rem; color: #b09080; }
  .pc-saving { font-size: 0.72rem; color: #b09080; display: flex; align-items: center; gap: 4px; }

  /* ── Progress bar ─── */
  .pc-progress-wrap { max-width: 760px; margin: 1.25rem auto 0; padding: 0 1.5rem; }
  .pc-progress-track {
    height: 4px; background: #ede5e0; border-radius: 99px; overflow: hidden;
  }
  .pc-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3d1f12, #8b4e2e, #c9856a);
    border-radius: 99px; transition: width 0.5s cubic-bezier(.4,0,.2,1);
  }

  /* ── Step tabs ─── */
  .pc-tabs-wrap { max-width: 760px; margin: 1.25rem auto 0; padding: 0 1.5rem; overflow-x: auto; }
  .pc-tabs { display: flex; gap: 0.4rem; min-width: max-content; }
  .pc-tab {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 0.85rem; border-radius: 10px;
    font-size: 0.78rem; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.2s;
    background: #f5ede8; color: #9a7060;
  }
  .pc-tab:hover:not(.active):not(.done) { background: #eeddd5; color: #6b4a3a; }
  .pc-tab.active {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; box-shadow: 0 4px 12px rgba(139,78,46,0.28);
  }
  .pc-tab.done { background: #e8f5ec; color: #4a8a5e; }

  /* ── Main card ─── */
  .pc-card-wrap { max-width: 760px; margin: 1.25rem auto 3rem; padding: 0 1.5rem; }
  .pc-card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
  }
  .pc-card-inner { padding: 2rem 2.25rem; }

  /* ── Step header ─── */
  .pc-step-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.75rem; padding-bottom: 1.25rem;
    border-bottom: 1px solid #f0ddd5;
  }
  .pc-step-badge {
    display: flex; align-items: center; gap: 0.6rem;
  }
  .pc-step-icon-wrap {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
  }
  .pc-step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 600; color: #2d1810; }
  .pc-step-count { font-size: 0.78rem; color: #b09080; }

  /* ── Tip block ─── */
  .pc-tip {
    display: flex; justify-content: space-between; align-items: flex-start;
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border-left: 3px solid #c9856a;
    padding: 0.75rem 0.9rem; border-radius: 0 10px 10px 0;
    margin-bottom: 1.5rem; gap: 0.75rem;
  }
  .pc-tip-inner { display: flex; gap: 0.6rem; align-items: flex-start; }
  .pc-tip p { font-size: 0.8rem; color: #6b4a3a; line-height: 1.5; }
  .pc-tip-dismiss { background: none; border: none; color: #c9856a; cursor: pointer; padding: 0; flex-shrink: 0; }

  /* ── Form elements ─── */
  .pc-field { margin-bottom: 1.1rem; }
  .pc-label {
    display: block; font-size: 0.78rem; font-weight: 500;
    color: #4a3028; margin-bottom: 0.4rem; letter-spacing: 0.02em;
  }
  .pc-label .req { color: #d9644a; margin-left: 2px; }
  .pc-label .hint { color: #b09080; font-weight: 300; font-size: 0.71rem; margin-left: 6px; }

  .pc-input, .pc-select, .pc-textarea {
    width: 100%; padding: 0.68rem 0.9rem;
    border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.87rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; outline: none;
    appearance: none;
  }
  .pc-input:focus, .pc-select:focus, .pc-textarea:focus {
    border-color: #c9856a; background: #fff;
    box-shadow: 0 0 0 3px rgba(201,133,106,0.12);
  }
  .pc-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23c9856a' d='M0 0l6 8 6-8z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.9rem center; padding-right: 2.25rem; }
  .pc-textarea { resize: vertical; min-height: 80px; }

  .pc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .pc-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }

  .pc-note { font-size: 0.72rem; color: #9a7060; margin-top: 0.3rem; display: flex; align-items: center; gap: 4px; }
  .pc-note.green { color: #5d9e6a; }
  .pc-note.gold { color: #b08830; }

  /* Gender toggle */
  .pc-gender-row { display: flex; gap: 0.6rem; }
  .pc-gender-btn {
    flex: 1; padding: 0.6rem 0.5rem;
    border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.82rem; color: #6b4a3a; font-weight: 500;
    background: #fdf8f5; cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .pc-gender-btn:hover { border-color: #c9856a; }
  .pc-gender-btn.selected {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 12px rgba(139,78,46,0.24);
  }

  /* Tag chips */
  .pc-chips-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .pc-chip {
    padding: 0.45rem 0.85rem; border-radius: 99px;
    font-size: 0.78rem; font-weight: 500; cursor: pointer;
    border: 1.5px solid #e8ddd8; color: #6b4a3a; background: #fdf8f5;
    transition: all 0.2s; display: flex; align-items: center; gap: 0.3rem;
    font-family: 'DM Sans', sans-serif;
  }
  .pc-chip:hover { border-color: #c9856a; }
  .pc-chip.selected {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border-color: transparent;
    box-shadow: 0 3px 8px rgba(139,78,46,0.22);
  }

  .pc-chips-scrollbox {
    max-height: 200px; overflow-y: auto; border: 1.5px solid #e8ddd8;
    border-radius: 12px; padding: 0.75rem; background: #fdf8f5;
  }
  .pc-chips-scrollbox::-webkit-scrollbar { width: 4px; }
  .pc-chips-scrollbox::-webkit-scrollbar-track { background: transparent; }
  .pc-chips-scrollbox::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 99px; }

  /* Photo upload */
  .pc-photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
  @media (min-width: 520px) { .pc-photo-grid { grid-template-columns: repeat(4, 1fr); } }

  .pc-photo-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; }
  .pc-photo-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pc-photo-overlay {
    position: absolute; inset: 0; background: rgba(30,10,5,0.55);
    opacity: 0; transition: opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  }
  .pc-photo-item:hover .pc-photo-overlay { opacity: 1; }
  .pc-photo-action {
    width: 30px; height: 30px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: transform 0.15s;
  }
  .pc-photo-action:hover { transform: scale(1.1); }
  .pc-photo-badge {
    position: absolute; top: 0.4rem; right: 0.4rem;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    color: #fff; font-size: 0.65rem; padding: 0.2rem 0.5rem;
    border-radius: 99px; font-weight: 500;
  }
  .pc-photo-ring { box-shadow: 0 0 0 3px #c9856a; }

  .pc-upload-slot {
    aspect-ratio: 1; border: 2px dashed #ddd0c8; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.35rem; cursor: pointer; background: #fdf8f5; transition: all 0.2s;
  }
  .pc-upload-slot:hover { border-color: #c9856a; background: #fff5f0; }
  .pc-upload-slot span { font-size: 0.72rem; color: #b09080; text-align: center; line-height: 1.4; }

  /* Slider */
  .pc-slider-group { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  .pc-slider-label { font-size: 0.75rem; color: #9a7060; margin-bottom: 0.35rem; }
  input[type=range] { width: 100%; accent-color: #8b4e2e; }

  /* Verification card */
  .pc-verify-card {
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border: 1px solid #f0ddd5; border-radius: 14px; padding: 1.25rem;
  }
  .pc-verify-card h4 { font-weight: 600; color: #4a3028; font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.75rem; }
  .pc-verify-item {
    display: flex; justify-content: space-between; align-items: center;
    background: #fff; border-radius: 10px; padding: 0.75rem 0.9rem;
    margin-bottom: 0.5rem; cursor: pointer; transition: box-shadow 0.2s;
    border: 1px solid transparent;
  }
  .pc-verify-item:hover { box-shadow: 0 4px 12px rgba(139,78,46,0.1); border-color: #f0ddd5; }
  .pc-verify-item:last-child { margin-bottom: 0; }
  .pc-verify-item-left { display: flex; align-items: center; gap: 0.65rem; }
  .pc-verify-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .pc-verify-title { font-size: 0.82rem; font-weight: 500; color: #2d1810; }
  .pc-verify-sub { font-size: 0.7rem; color: #9a7060; }
  .pc-verify-pts { font-size: 0.78rem; font-weight: 600; color: #8b4e2e; }

  /* Nav buttons */
  .pc-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f0ddd5; }
  .pc-btn-prev {
    padding: 0.65rem 1.5rem; border: 1.5px solid #e8ddd8; border-radius: 99px;
    font-size: 0.85rem; color: #6b4a3a; background: #fdf8f5;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .pc-btn-prev:hover { border-color: #c9856a; background: #fff5f0; }
  .pc-btn-next {
    padding: 0.65rem 1.75rem;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; border-radius: 99px;
    font-size: 0.85rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
  }
  .pc-btn-next:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }
  .pc-btn-submit {
    padding: 0.65rem 1.75rem;
    background: linear-gradient(135deg, #2a6040, #3d8a5e, #5aaa7a);
    color: #fff; border: none; border-radius: 99px;
    font-size: 0.85rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 0.4rem;
    box-shadow: 0 6px 18px rgba(40,100,60,0.28);
  }
  .pc-btn-submit:hover:not(:disabled) { transform: translateY(-1px); }
  .pc-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .pc-submit-warn { text-align: center; font-size: 0.78rem; color: #c07030; margin-top: 0.75rem; }

  /* Review step */
  .pc-review-profile { background: linear-gradient(135deg, #fdf5ee, #faf0f8); border-radius: 16px; padding: 1.5rem; }
  .pc-review-avatar-wrap { display: flex; align-items: flex-start; gap: 1.25rem; margin-bottom: 1.5rem; }
  .pc-review-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #c9856a; flex-shrink: 0; }
  .pc-review-avatar-placeholder { width: 80px; height: 80px; border-radius: 50%; background: #ede5e0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pc-review-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: #2d1810; }
  .pc-review-sub { font-size: 0.82rem; color: #9a7060; margin-top: 0.2rem; }
  .pc-review-score { font-size: 1.6rem; font-weight: 700; background: linear-gradient(135deg, #8b4e2e, #c9856a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  .pc-review-section { border-top: 1px solid #e8ddd8; padding-top: 1rem; margin-top: 1rem; }
  .pc-review-section-title { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #8b4e2e; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.65rem; }
  .pc-review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem 1rem; }
  .pc-review-item { font-size: 0.8rem; color: #4a3028; }
  .pc-review-item span { font-weight: 500; color: #2d1810; }

  /* Warning box */
  .pc-warning-box {
    background: #fffbf0; border: 1px solid #f0dfa0; border-radius: 12px;
    padding: 1rem 1.1rem; display: flex; gap: 0.65rem; align-items: flex-start;
    margin-top: 1rem;
  }
  .pc-warning-box ul { font-size: 0.78rem; color: #7a5c10; margin: 0.35rem 0 0; list-style: none; padding: 0; }
  .pc-warning-box ul li { padding: 0.15rem 0; }

  /* Preview fab */
  .pc-preview-fab {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 40;
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 24px rgba(139,78,46,0.38);
    transition: all 0.25s;
  }
  .pc-preview-fab:hover { transform: scale(1.1); }

  /* Preview modal */
  .pc-modal-overlay {
    position: fixed; inset: 0; background: rgba(20,8,4,0.6); z-index: 60;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .pc-modal {
    background: #fff; border-radius: 20px; max-width: 380px; width: 100%;
    max-height: 80vh; overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.3);
  }
  .pc-modal-header {
    position: sticky; top: 0; background: #fff;
    padding: 1rem 1.25rem; border-bottom: 1px solid #f0ddd5;
    display: flex; justify-content: space-between; align-items: center; z-index: 1;
  }
  .pc-modal-header h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: #2d1810; }
  .pc-modal-body { padding: 1.25rem; }

  /* Photo modal */
  .pc-photo-modal { position: fixed; inset: 0; background: rgba(20,8,4,0.75); z-index: 70; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .pc-photo-modal-card { background: #fff; border-radius: 16px; max-width: 400px; width: 100%; overflow: hidden; }
  .pc-photo-modal-img { width: 100%; height: 260px; object-fit: contain; background: #fdf8f5; }

  .pc-quiz-block { background: linear-gradient(135deg, #fdf5ee, #faf0f8); border-radius: 14px; padding: 1.25rem; margin-top: 0.75rem; }
  .pc-quiz-q { background: #fff; border-radius: 10px; padding: 0.9rem; margin-bottom: 0.65rem; }
  .pc-quiz-q p { font-size: 0.82rem; font-weight: 500; color: #2d1810; margin-bottom: 0.5rem; }
  .pc-quiz-opts { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .pc-quiz-opt {
    padding: 0.3rem 0.75rem; border-radius: 99px; font-size: 0.75rem;
    border: 1.5px solid #e8ddd8; color: #6b4a3a; background: #fdf8f5;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .pc-quiz-opt.sel { background: linear-gradient(135deg, #3d1f12, #8b4e2e); color: #fff; border-color: transparent; }

  @media (max-width: 600px) {
    .pc-card-inner { padding: 1.5rem 1.25rem; }
    .pc-grid-2 { grid-template-columns: 1fr; }
    .pc-slider-group { grid-template-columns: 1fr; }
    .pc-review-grid { grid-template-columns: 1fr; }
    .pc-tabs-wrap, .pc-progress-wrap, .pc-card-wrap { padding: 0 0.75rem; }
  }
`;

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const calculateAge = (dob) => {
  if (!dob) return "";
  const today = new Date();
  const b = new Date(dob);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
};

const INTEREST_ICONS = {
  Music: Music, Travel: Plane, Photography: Camera, Reading: Book,
  Movies: Film, Gaming: Gamepad, Cooking: Coffee, Sports: Dumbbell,
  Yoga: Activity, Dancing: Smile,
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const ProfileCreationPage = () => {
  const navigate = useNavigate();
  const {
    user, updateUserProfile,
    profileCreationStep, setProfileCreationStep,
    profileCreationData, updateProfileCreationData,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [completionScore, setCompletionScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [dismissedTips, setDismissedTips] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [verifications, setVerifications] = useState({ email: false, phone: false });
  const [similarProfiles, setSimilarProfiles] = useState([]);
  const [savingDraft, setSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [photoValidationIssues, setPhotoValidationIssues] = useState([]);
  const fileInputRef = useRef(null);

  const compatibilityQuestions = [

  // 🌍 VALUES & BELIEFS
  { id: "religion_importance", question: "How important is religion in your life?", options: ["Very Important", "Somewhat Important", "Not Important"] },
  { id: "religion_partner", question: "Should your partner follow your religion?", options: ["Must", "Preferred", "Not necessary"] },
  { id: "cultural_values", question: "How important are cultural traditions?", options: ["Very Important", "Moderate", "Not Important"] },
  { id: "political_views", question: "Do political views matter in a relationship?", options: ["Very Important", "Somewhat", "Not Important"] },

  // 💍 RELATIONSHIP GOALS
  { id: "relationship_goal", question: "What are you looking for?", options: ["Marriage", "Serious relationship", "Friendship first", "Not sure"] },
  { id: "marriage_timeline", question: "When do you plan to get married?", options: ["Soon", "1-2 years", "3+ years", "Not sure"] },
  { id: "long_distance", question: "Are you open to long-distance relationships?", options: ["Yes", "Maybe", "No"] },

  // 🏡 FAMILY & LIFESTYLE
  { id: "family_size", question: "What's your ideal family size?", options: ["1–2 children", "3+ children", "No children", "Open"] },
  { id: "living_arrangement", question: "Preferred living arrangement after marriage?", options: ["With family", "Nuclear", "Close to parents", "Open"] },
  { id: "family_involvement", question: "How involved should families be in your relationship?", options: ["Very involved", "Moderate", "Minimal"] },

  // 💼 CAREER & MONEY
  { id: "career_priority", question: "How important is career in your life?", options: ["Very Important", "Balanced", "Less Important"] },
  { id: "partner_work", question: "Should both partners work?", options: ["Yes", "Optional", "Prefer one works"] },
  { id: "financial_management", question: "How should finances be handled?", options: ["Shared", "Separate", "Mixed"] },

  // 📍 LOCATION & FUTURE
  { id: "relocation", question: "Would you consider relocating?", options: ["Anywhere", "Sri Lanka only", "Maybe", "No"] },
  { id: "abroad_plans", question: "Do you plan to migrate abroad?", options: ["Yes", "Maybe", "No"] },

  // ❤️ PERSONALITY & LIFESTYLE
  { id: "social_type", question: "Are you more introverted or extroverted?", options: ["Introvert", "Extrovert", "Ambivert"] },
  { id: "free_time", question: "How do you prefer to spend free time?", options: ["At home", "Outdoor", "Social events", "Mixed"] },
  { id: "travel_interest", question: "How important is travel to you?", options: ["Very Important", "Sometimes", "Not Important"] },

  // 🚬 HABITS
  { id: "smoking", question: "Do you smoke?", options: ["Yes", "Occasionally", "No"] },
  { id: "partner_smoking", question: "Are you okay with a partner who smokes?", options: ["Yes", "No", "Depends"] },
  { id: "drinking", question: "Do you drink alcohol?", options: ["Yes", "Occasionally", "No"] },
  { id: "partner_drinking", question: "Are you okay with a partner who drinks?", options: ["Yes", "No", "Depends"] },

  // 💞 RELATIONSHIP STYLE
  { id: "love_language", question: "What is your love language?", options: ["Words", "Actions", "Gifts", "Time", "Touch"] },
  { id: "conflict_resolution", question: "How do you handle conflicts?", options: ["Talk immediately", "Take time then talk", "Avoid conflict"] },
  { id: "jealousy", question: "How do you feel about jealousy in a relationship?", options: ["Normal", "Sometimes", "Not acceptable"] },

  // 🧒 CHILDREN & RESPONSIBILITY
  { id: "children_importance", question: "How important is having children?", options: ["Very Important", "Optional", "Not Important"] },
  { id: "parenting_style", question: "Preferred parenting style?", options: ["Strict", "Balanced", "Relaxed"] },

  // 📱 MODERN FACTORS
  { id: "social_media", question: "How active are you on social media?", options: ["Very active", "Moderate", "Not active"] },
  { id: "privacy_level", question: "How private are you?", options: ["Very private", "Moderate", "Open"] },

];

  /* ── Completion score ── */
  useEffect(() => {
    const fields = [
      { key: "profileImages", w: 10, ok: v => v?.length > 0 },
      { key: "about", w: 10, ok: v => v?.length > 50 },
      { key: "interests", w: 10, ok: v => v?.length >= 3 },
      { key: "education", w: 8, ok: v => v },
      { key: "profession", w: 8, ok: v => v },
      { key: "religion", w: 8, ok: v => v },
      { key: "partnerPreferences", w: 10, ok: v => Object.keys(v || {}).length > 0 },
      { key: "firstName", w: 5, ok: v => v },
      { key: "gender", w: 5, ok: v => v },
      { key: "dateOfBirth", w: 5, ok: v => v },
      { key: "district", w: 5, ok: v => v },
      { key: "city", w: 5, ok: v => v },
      { key: "maritalStatus", w: 6, ok: v => v },
    ];
    const score = fields.reduce((acc, f) => acc + (f.ok(profileCreationData[f.key]) ? f.w : 0), 0);
    setCompletionScore(Math.min(100, score));
  }, [profileCreationData]);

  /* ── Auto-save draft ── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (Object.keys(profileCreationData).length > 0) {
        setSavingDraft(true);
        try {
          localStorage.setItem("profileDraft", JSON.stringify({ data: profileCreationData, step: profileCreationStep, ts: new Date().toISOString() }));
          setLastSaved(new Date());
        } finally {
          setSavingDraft(false);
        }
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [profileCreationData, profileCreationStep]);

  /* ── Load draft on mount ── */
  useEffect(() => {
    const raw = localStorage.getItem("profileDraft");
    if (raw) {
      const { data, step, ts } = JSON.parse(raw);
      if (new Date() - new Date(ts) < 7 * 86400000) {
        if (window.confirm("We found an incomplete profile draft. Continue where you left off?")) {
          updateProfileCreationData(data);
          setProfileCreationStep(step);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user?.profileCompleted) navigate("/home");
    if (!profileCreationData.profileImages) updateProfileCreationData({ profileImages: [] });
  }, [user, navigate]);

  useEffect(() => {
    if ((profileCreationData.interests || []).length > 0) {
      setSimilarProfiles([
        { id: 1, name: "Amila P.", matchScore: 85 },
        { id: 2, name: "Dilini F.", matchScore: 78 },
        { id: 3, name: "Nuwan S.", matchScore: 72 },
      ]);
    }
  }, [profileCreationData.interests]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateProfileCreationData({ [name]: value });
  };

  const handleInterestsChange = (interest) => {
    const cur = profileCreationData.interests || [];
    if (cur.includes(interest)) {
      updateProfileCreationData({ interests: cur.filter(i => i !== interest) });
    } else if (cur.length < 10) {
      updateProfileCreationData({ interests: [...cur, interest] });
    }
  };

  const validatePhoto = async (file) => {
    const issues = [];
    if (file.size > 5 * 1024 * 1024) issues.push("File size too large (max 5 MB)");
    const url = URL.createObjectURL(file);
    await new Promise(res => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 300) issues.push("Low resolution (min 300 px width)");
        URL.revokeObjectURL(url);
        res();
      };
      img.src = url;
    });
    return issues;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const issues = await validatePhoto(file);
    setPhotoValidationIssues(issues);
    setCurrentImage(file);
    setShowImageModal(true);
  };

  const confirmImageUpload = () => {
    if (!currentImage) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result;
      const imgs = [...(profileCreationData.profileImages || []), url];
      updateProfileCreationData({ profileImages: imgs, ...(imgs.length === 1 ? { profileImage: url } : {}) });
      setShowImageModal(false);
      setCurrentImage(null);
      setPhotoValidationIssues([]);
    };
    reader.readAsDataURL(currentImage);
  };

  const removeImage = (idx) => {
    const imgs = [...(profileCreationData.profileImages || [])];
    imgs.splice(idx, 1);
    updateProfileCreationData({ profileImages: imgs, ...(idx === 0 && imgs.length > 0 ? { profileImage: imgs[0] } : {}) });
  };

  const setPrimaryImage = (idx) => {
    const imgs = profileCreationData.profileImages || [];
    if (idx >= 0 && idx < imgs.length) updateProfileCreationData({ profileImage: imgs[idx] });
  };

  const nextStep = () => { setProfileCreationStep(s => s + 1); window.scrollTo(0, 0); };
  const prevStep = () => { setProfileCreationStep(s => s - 1); window.scrollTo(0, 0); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transformation logic to match backend Enums and DTO structure
      const formattedData = {
        ...profileCreationData,
        // Enums (Frontend values to Backend Enum strings)
        gender: profileCreationData.gender?.toUpperCase(),
        maritalStatus: profileCreationData.maritalStatus === "single" ? "NEVER_MARRIED" : profileCreationData.maritalStatus?.toUpperCase().replace(" ", "_"),
        religion: profileCreationData.religion?.toUpperCase(),
        education: profileCreationData.education?.toUpperCase().replace(" ", "_"),
        ethnicity: profileCreationData.ethnicity?.toUpperCase(),
        bodyType: profileCreationData.bodyType?.toUpperCase().replace(" ", "_"),
        complexion: profileCreationData.complexion?.toUpperCase(),
        horoscopeSign: profileCreationData.horoscopeSign?.toUpperCase(),
        
        // Complex mappings for lifestyle habits
        smoking: profileCreationData.smoking === "non-smoker" ? "NEVER" : 
                 profileCreationData.smoking === "occasional" ? "OCCASIONALLY" : 
                 profileCreationData.smoking === "regular" ? "REGULARLY" : profileCreationData.smoking?.toUpperCase(),
        
        drinking: profileCreationData.drinking === "non-drinker" ? "NEVER" : 
                  profileCreationData.drinking === "social drinker" ? "SOCIALLY" : 
                  profileCreationData.drinking === "regular" ? "REGULARLY" : profileCreationData.drinking?.toUpperCase(),
        
        dietaryPreferences: profileCreationData.dietaryPreferences?.toUpperCase().replace(" ", "_"),
        
        // Metadata fields
        profileCompleted: true,
        quizAnswers,
        verificationStatus: verifications, // Backend uses verificationStatus
        completionScore
      };

      // Clean up fields that might cause mapping issues in strict backends if needed
      // (Optional: remove profileImage/profileImages if backend DTO doesn't support them in main POST)
      
      await updateUserProfile(formattedData);
      localStorage.removeItem("profileDraft");
      navigate("/home");
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step metadata ── */
  const STEPS = [
    { icon: User, label: "Basic Info" },
    { icon: MapPin, label: "Location" },
    { icon: GraduationCap, label: "Career" },
    { icon: Activity, label: "Lifestyle" },
    { icon: Users, label: "Cultural" },
    { icon: Heart, label: "About You" },
    { icon: Star, label: "Preferences" },
    { icon: CheckCircle, label: "Review" },
  ];

  /* ── Tip component ── */
  const Tip = ({ field, message, icon: Icon }) => {
    if (dismissedTips[field]) return null;
    return (
      <div className="pc-tip">
        <div className="pc-tip-inner">
          {Icon && <Icon size={15} style={{ color: "#c9856a", flexShrink: 0, marginTop: 1 }} />}
          <p>{message}</p>
        </div>
        <button className="pc-tip-dismiss" onClick={() => setDismissedTips(p => ({ ...p, [field]: true }))}>
          <X size={14} />
        </button>
      </div>
    );
  };

  /* ── Step content ── */
  const renderStep = () => {
    const step = profileCreationStep;

    return (
      <div>
        {/* Step header */}
        <div className="pc-step-header">
          <div className="pc-step-badge">
            <div className="pc-step-icon-wrap">
              {React.createElement(STEPS[step - 1].icon, { size: 18, style: { color: "#8b4e2e" } })}
            </div>
            <h2 className="pc-step-title">{STEPS[step - 1].label}</h2>
          </div>
          <span className="pc-step-count">Step {step} of 8</span>
        </div>

        {/* Tips */}
        {step === 1 && <Tip field="profileImages" message="Profiles with 3+ photos receive 5× more matches. Use clear, well-lit face photos." icon={Camera} />}
        {step === 6 && <Tip field="about" message="A genuine, personal bio makes you stand out. Share your passions and what you value in a partner." icon={MessageCircle} />}
        {step === 7 && <Tip field="partnerPreferences" message="Specific preferences help our algorithm surface the most compatible matches for you." icon={Target} />}

        {/* ─── STEP 1 ─── */}
        {step === 1 && (
          <>
            {/* Photos */}
            <div className="pc-field">
              <label className="pc-label">Profile Photos <span className="hint">(3–6 recommended)</span></label>
              <div className="pc-photo-grid">
                {(profileCreationData.profileImages || []).map((img, i) => (
                  <div key={i} className={`pc-photo-item${profileCreationData.profileImage === img ? " pc-photo-ring" : ""}`}>
                    <img src={img} alt={`Photo ${i + 1}`} className="pc-photo-img" />
                    <div className="pc-photo-overlay">
                      <button type="button" className="pc-photo-action" style={{ background: "#8b4e2e" }} onClick={() => setPrimaryImage(i)} title="Set as primary">
                        <Star size={13} color="#fff" />
                      </button>
                      <button type="button" className="pc-photo-action" style={{ background: "#c0392b" }} onClick={() => removeImage(i)} title="Remove">
                        <X size={13} color="#fff" />
                      </button>
                    </div>
                    {profileCreationData.profileImage === img && <div className="pc-photo-badge">Primary</div>}
                  </div>
                ))}
                {(profileCreationData.profileImages || []).length < 6 && (
                  <label className="pc-upload-slot">
                    <Upload size={20} style={{ color: "#c9856a" }} />
                    <span>Upload Photo<br />JPG/PNG · max 5 MB</span>
                    <input ref={fileInputRef} type="file" hidden accept="image/jpeg,image/png,image/jpg" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <p className="pc-note">{6 - (profileCreationData.profileImages || []).length} photo slots remaining</p>
            </div>

            {/* Name */}
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">First Name <span className="req">*</span></label>
                <input name="firstName" type="text" value={profileCreationData.firstName || ""} onChange={handleChange} className="pc-input" placeholder="Amara" />
              </div>
              <div className="pc-field">
                <label className="pc-label">Last Name <span className="req">*</span></label>
                <input name="lastName" type="text" value={profileCreationData.lastName || ""} onChange={handleChange} className="pc-input" placeholder="Perera" />
              </div>
            </div>

            {/* Gender */}
            <div className="pc-field">
              <label className="pc-label">Gender <span className="req">*</span></label>
              <div className="pc-gender-row">
                {["Male", "Female", "Other"].map(g => (
                  <button key={g} type="button"
                    className={`pc-gender-btn${profileCreationData.gender === g.toLowerCase() ? " selected" : ""}`}
                    onClick={() => updateProfileCreationData({ gender: g.toLowerCase() })}>{g}</button>
                ))}
              </div>
            </div>

            {/* DOB & marital status */}
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Date of Birth <span className="req">*</span></label>
                <input name="dateOfBirth" type="date" value={profileCreationData.dateOfBirth || ""}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                  className="pc-input" />
                {profileCreationData.dateOfBirth && <p className="pc-note green"><CheckCircle size={11} />Age: {calculateAge(profileCreationData.dateOfBirth)} years</p>}
              </div>
              <div className="pc-field">
                <label className="pc-label">Marital Status <span className="req">*</span></label>
                <select name="maritalStatus" value={profileCreationData.maritalStatus || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select status</option>
                  {(profileOptions.maritalStatus || []).map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">Do you have children?</label>
              <select value={profileCreationData.hasChildren !== undefined ? String(profileCreationData.hasChildren) : ""}
                onChange={e => updateProfileCreationData({ hasChildren: e.target.value === "true" })} className="pc-select">
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </>
        )}

        {/* ─── STEP 2 ─── */}
        {step === 2 && (
          <>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">District <span className="req">*</span></label>
                <select name="district" value={profileCreationData.district || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select district</option>
                  {(profileOptions.districts || []).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">City <span className="req">*</span></label>
                <input name="city" type="text" value={profileCreationData.city || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Colombo" />
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Place of Birth</label>
              <input name="placeOfBirth" type="text" value={profileCreationData.placeOfBirth || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Kandy" />
            </div>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Ethnicity</label>
                <select name="ethnicity" value={profileCreationData.ethnicity || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.ethnicities || []).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Religion <span className="req">*</span></label>
                <select name="religion" value={profileCreationData.religion || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.religions || []).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Religious Practices</label>
              <textarea name="religiousPractices" rows={2} value={profileCreationData.religiousPractices || ""} onChange={handleChange} className="pc-textarea" placeholder="e.g. Daily prayers, regular temple visits" />
            </div>
            <div className="pc-field">
              <label className="pc-label">Languages Spoken <span className="hint">(select up to 5)</span></label>
              <div className="pc-chips-grid">
                {(profileOptions.languages || []).map(lang => (
                  <button key={lang} type="button"
                    className={`pc-chip${(profileCreationData.languages || []).includes(lang) ? " selected" : ""}`}
                    onClick={() => {
                      const cur = profileCreationData.languages || [];
                      if (cur.includes(lang)) updateProfileCreationData({ languages: cur.filter(l => l !== lang) });
                      else if (cur.length < 5) updateProfileCreationData({ languages: [...cur, lang] });
                    }}>{lang}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── STEP 3 ─── */}
        {step === 3 && (
          <>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Education Level <span className="req">*</span></label>
                <select name="education" value={profileCreationData.education || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.educationLevels || []).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Field of Study</label>
                <input name="fieldOfStudy" type="text" value={profileCreationData.fieldOfStudy || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Computer Science" />
              </div>
            </div>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Profession <span className="req">*</span></label>
                <input name="profession" type="text" value={profileCreationData.profession || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Software Engineer" />
              </div>
              <div className="pc-field">
                <label className="pc-label">Industry</label>
                <select name="industry" value={profileCreationData.industry || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.industries || []).map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Employer</label>
                <input name="employer" type="text" value={profileCreationData.employer || ""} onChange={handleChange} className="pc-input" placeholder="Company name" />
              </div>
              <div className="pc-field">
                <label className="pc-label">Work Location</label>
                <input name="workLocation" type="text" value={profileCreationData.workLocation || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Colombo, Remote" />
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Monthly Income Range (LKR)</label>
              <select name="income" value={profileCreationData.income || ""} onChange={handleChange} className="pc-select">
                <option value="">Select range</option>
                {(profileOptions.incomeRanges || []).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <p className="pc-note"><Shield size={11} />Used for matching only — never shown publicly</p>
            </div>
          </>
        )}

        {/* ─── STEP 4 ─── */}
        {step === 4 && (
          <>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Height (cm)</label>
                <input name="height" type="number" min="140" max="220" value={profileCreationData.height || ""} onChange={handleChange} className="pc-input" placeholder="e.g. 170" />
              </div>
              <div className="pc-field">
                <label className="pc-label">Body Type</label>
                <select name="bodyType" value={profileCreationData.bodyType || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.bodyTypes || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Complexion</label>
              <select name="complexion" value={profileCreationData.complexion || ""} onChange={handleChange} className="pc-select">
                <option value="">Select</option>
                {(profileOptions.complexions || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Smoking Habits</label>
                <select name="smoking" value={profileCreationData.smoking || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.smokingHabits || []).map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Drinking Habits</label>
                <select name="drinking" value={profileCreationData.drinking || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.drinkingHabits || []).map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Dietary Preferences</label>
              <select name="dietaryPreferences" value={profileCreationData.dietaryPreferences || ""} onChange={handleChange} className="pc-select">
                <option value="">Select</option>
                {(profileOptions.dietaryPreferences || []).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="pc-field">
              <label className="pc-label">Lifestyle & Fitness</label>
              <textarea name="healthHabits" rows={2} value={profileCreationData.healthHabits || ""} onChange={handleChange} className="pc-textarea" placeholder="e.g. Regular gym, yoga, balanced diet, evening walks" />
            </div>
            <div className="pc-field">
              <label className="pc-label">Daily Lifestyle</label>
              <textarea name="lifestyle" rows={2} value={profileCreationData.lifestyle || ""} onChange={handleChange} className="pc-textarea" placeholder="Describe your routines and lifestyle…" />
            </div>
          </>
        )}

        {/* ─── STEP 5 ─── */}
        {step === 5 && (
          <>
            <div className="pc-field">
              <label className="pc-label">Family Background</label>
              <textarea name="familyBackground" rows={3} value={profileCreationData.familyBackground || ""} onChange={handleChange} className="pc-textarea" placeholder="e.g. Father is a businessman, mother a teacher, one older sibling — we're a close family." />
            </div>
            <div className="pc-field">
              <label className="pc-label">Cultural Values & Traditions</label>
              <textarea name="culturalValues" rows={3} value={profileCreationData.culturalValues || ""} onChange={handleChange} className="pc-textarea" placeholder="e.g. Respecting elders, celebrating Sinhala New Year, traditional customs" />
            </div>
            <div className="pc-field">
              <label className="pc-label">Family Involvement in Married Life</label>
              <textarea name="familyInvolvement" rows={2} value={profileCreationData.familyInvolvement || ""} onChange={handleChange} className="pc-textarea" placeholder="How involved do you want your family to be?" />
            </div>
            <div className="pc-field">
              <label className="pc-label">Wedding Preferences</label>
              <textarea name="weddingPreferences" rows={2} value={profileCreationData.weddingPreferences || ""} onChange={handleChange} className="pc-textarea" placeholder="e.g. Traditional ceremony, intimate civil wedding, destination wedding" />
            </div>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Horoscope / Zodiac Sign</label>
                <select name="horoscopeSign" value={profileCreationData.horoscopeSign || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(profileOptions.horoscopeSigns || []).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Birth Star / Nakshatra <span className="hint">(optional)</span></label>
                <input name="birthStar" type="text" value={profileCreationData.birthStar || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Ashwini" />
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Additional Horoscope Details</label>
              <textarea name="horoscopeDetails" rows={2} value={profileCreationData.horoscopeDetails || ""} onChange={handleChange} className="pc-textarea" placeholder="Any astrological details relevant to match compatibility" />
              <p className="pc-note gold"><Star size={11} />Horoscope compatibility is an important factor in Sri Lankan matrimony</p>
            </div>

            {/* Verification — email & phone only */}
            <div className="pc-verify-card" style={{ marginTop: "1rem" }}>
              <h4><Award size={16} style={{ color: "#c9856a" }} />Verification Badges</h4>
              {!verifications.email && (
                <div className="pc-verify-item" onClick={() => {}}>
                  <div className="pc-verify-item-left">
                    <div className="pc-verify-icon" style={{ background: "#f5e8ff" }}><Mail size={15} style={{ color: "#8b4e2e" }} /></div>
                    <div><div className="pc-verify-title">Verify Email</div><div className="pc-verify-sub">Get the verified badge on your profile</div></div>
                  </div>
                  <span className="pc-verify-pts">+50 pts</span>
                </div>
              )}
              {verifications.email && (
                <div className="pc-verify-item" style={{ background: "#f0faf3" }}>
                  <div className="pc-verify-item-left">
                    <div className="pc-verify-icon" style={{ background: "#e0f5e8" }}><CheckCircle size={15} style={{ color: "#4a8a5e" }} /></div>
                    <div><div className="pc-verify-title" style={{ color: "#4a8a5e" }}>Email Verified</div></div>
                  </div>
                  <CheckCircle size={16} style={{ color: "#4a8a5e" }} />
                </div>
              )}
              {!verifications.phone && (
                <div className="pc-verify-item" onClick={() => {}}>
                  <div className="pc-verify-item-left">
                    <div className="pc-verify-icon" style={{ background: "#e8f5ff" }}><Shield size={15} style={{ color: "#3a6ea8" }} /></div>
                    <div><div className="pc-verify-title">Verify Phone</div><div className="pc-verify-sub">Add trust to your profile</div></div>
                  </div>
                  <span className="pc-verify-pts">+30 pts</span>
                </div>
              )}
              <p style={{ fontSize: "0.72rem", color: "#9a7060", marginTop: "0.75rem" }}>
                Verified profiles get 3× more matches and rank higher in search results.
              </p>
            </div>
          </>
        )}

        {/* ─── STEP 6 ─── */}
        {step === 6 && (
          <>
            <div className="pc-field">
              <label className="pc-label">About Me <span className="req">*</span></label>
              <textarea name="about" rows={6} value={profileCreationData.about || ""} onChange={handleChange} className="pc-textarea"
                placeholder="Write something genuine about yourself — your passions, what makes you unique, and what you're looking for in a partner…" />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p className="pc-note">{profileCreationData.about?.length || 0} characters</p>
                {profileCreationData.about?.length > 100 && <p className="pc-note green"><CheckCircle size={11} />Great length</p>}
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">Interests & Hobbies <span className="req">*</span> <span className="hint">(min 3, max 10)</span></label>
              <div className="pc-chips-scrollbox">
                <div className="pc-chips-grid">
                  {(profileOptions.interests || []).map(interest => {
                    const IconComp = INTEREST_ICONS[interest] || Sparkles;
                    return (
                      <button key={interest} type="button"
                        className={`pc-chip${(profileCreationData.interests || []).includes(interest) ? " selected" : ""}`}
                        onClick={() => handleInterestsChange(interest)}>
                        <IconComp size={12} />{interest}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p className="pc-note">Selected: {(profileCreationData.interests || []).length}/10</p>
                {(profileCreationData.interests || []).length >= 3 && <p className="pc-note green"><CheckCircle size={11} />Great selection!</p>}
              </div>
            </div>

            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Favourite Food</label>
                <input type="text" value={(profileCreationData.favoriteThings || {}).food || ""}
                  onChange={e => updateProfileCreationData({ favoriteThings: { ...(profileCreationData.favoriteThings || {}), food: e.target.value } })}
                  className="pc-input" placeholder="e.g. Rice and curry" />
              </div>
              <div className="pc-field">
                <label className="pc-label">Favourite Movies / Shows</label>
                <input type="text" value={(profileCreationData.favoriteThings || {}).movies || ""}
                  onChange={e => updateProfileCreationData({ favoriteThings: { ...(profileCreationData.favoriteThings || {}), movies: e.target.value } })}
                  className="pc-input" placeholder="e.g. Drama, documentaries" />
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">Travel Preferences</label>
              <textarea name="travelPreferences" rows={2} value={profileCreationData.travelPreferences || ""} onChange={handleChange} className="pc-textarea" placeholder="e.g. Beach destinations, cultural trips, adventure travel" />
            </div>

            <div className="pc-field">
              <label className="pc-label">Personality Traits</label>
              <input name="personalityTraits" type="text" value={profileCreationData.personalityTraits || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Patient, ambitious, humorous, caring" />
            </div>

            {/* Compatibility Quiz */}
            <div className="pc-field">
              <button type="button" onClick={() => setShowQuiz(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#8b4e2e", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem", padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
                <Zap size={15} />
                {showQuiz ? "Hide" : "Take"} Compatibility Quiz <span style={{ color: "#b09080", fontWeight: 300 }}>(optional — improves matching)</span>
              </button>
              {showQuiz && (
                <div className="pc-quiz-block">
                  {compatibilityQuestions.map(q => (
                    <div key={q.id} className="pc-quiz-q">
                      <p>{q.question}</p>
                      <div className="pc-quiz-opts">
                        {q.options.map(opt => (
                          <button key={opt} type="button"
                            className={`pc-quiz-opt${quizAnswers[q.id] === opt ? " sel" : ""}`}
                            onClick={() => setQuizAnswers(p => ({ ...p, [q.id]: opt }))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── STEP 7 ─── */}
        {step === 7 && (
          <>
            <div className="pc-field">
              <label className="pc-label">Partner Age Range</label>
              <div className="pc-slider-group">
                <div>
                  <p className="pc-slider-label">Minimum: {(profileCreationData.partnerPreferences?.ageRange || [])[0] || 18} yrs</p>
                  <input type="range" min="18" max="60"
                    value={(profileCreationData.partnerPreferences?.ageRange || [])[0] || 18}
                    onChange={e => {
                      const v = parseInt(e.target.value);
                      const cur = profileCreationData.partnerPreferences || {};
                      const range = cur.ageRange || [18, 60];
                      updateProfileCreationData({ partnerPreferences: { ...cur, ageRange: [v, Math.max(v, range[1])] } });
                    }} />
                </div>
                <div>
                  <p className="pc-slider-label">Maximum: {(profileCreationData.partnerPreferences?.ageRange || [])[1] || 60} yrs</p>
                  <input type="range" min="18" max="60"
                    value={(profileCreationData.partnerPreferences?.ageRange || [])[1] || 60}
                    onChange={e => {
                      const v = parseInt(e.target.value);
                      const cur = profileCreationData.partnerPreferences || {};
                      const range = cur.ageRange || [18, 60];
                      updateProfileCreationData({ partnerPreferences: { ...cur, ageRange: [Math.min(v, range[0]), v] } });
                    }} />
                </div>
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">Location Preference</label>
              <input type="text" value={(profileCreationData.partnerPreferences || {}).locationPreference || ""}
                onChange={e => updateProfileCreationData({ partnerPreferences: { ...(profileCreationData.partnerPreferences || {}), locationPreference: e.target.value } })}
                className="pc-input" placeholder="e.g. Colombo, Western Province, open to relocate" />
            </div>

            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Min. Education Level</label>
                <select value={(profileCreationData.partnerPreferences || {}).educationLevel || ""}
                  onChange={e => updateProfileCreationData({ partnerPreferences: { ...(profileCreationData.partnerPreferences || {}), educationLevel: e.target.value } })} className="pc-select">
                  <option value="">No preference</option>
                  {(profileOptions.educationLevels || []).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Religion Preference</label>
                <select value={(profileCreationData.partnerPreferences || {}).religionPreference || ""}
                  onChange={e => updateProfileCreationData({ partnerPreferences: { ...(profileCreationData.partnerPreferences || {}), religionPreference: e.target.value } })} className="pc-select">
                  <option value="">No preference</option>
                  {(profileOptions.religions || []).map(r => <option key={r} value={r}>{r}</option>)}
                  <option value="Open to all">Open to all religions</option>
                </select>
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">Marital Status Preference</label>
              <select value={(profileCreationData.partnerPreferences || {}).maritalStatusPreference || ""}
                onChange={e => updateProfileCreationData({ partnerPreferences: { ...(profileCreationData.partnerPreferences || {}), maritalStatusPreference: e.target.value } })} className="pc-select">
                <option value="">No preference</option>
                {(profileOptions.maritalStatus || []).map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
              </select>
            </div>

            <div className="pc-field">
              <label className="pc-label">Lifestyle Compatibility</label>
              <textarea rows={2} value={(profileCreationData.partnerPreferences || {}).lifestyleCompatibility || ""}
                onChange={e => updateProfileCreationData({ partnerPreferences: { ...(profileCreationData.partnerPreferences || {}), lifestyleCompatibility: e.target.value } })}
                className="pc-textarea" placeholder="e.g. Health-conscious, non-smoker, active lifestyle" />
            </div>

            <div className="pc-field">
              <label className="pc-label">Dealbreakers</label>
              <textarea name="dealbreakers" rows={2} value={profileCreationData.dealbreakers || ""} onChange={handleChange} className="pc-textarea" placeholder="What are absolute no-gos? (e.g. smoking, dishonesty)" />
            </div>

            {/* Similar profiles */}
            {similarProfiles.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "#4a3028", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Users size={14} style={{ color: "#8b4e2e" }} />People with similar profiles
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {similarProfiles.map(p => (
                    <div key={p.id} style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #ede5e0, #d4c0b8)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <User size={22} style={{ color: "#9a7060" }} />
                        <div style={{ position: "absolute", top: -4, right: -4, background: "#5aaa7a", color: "#fff", fontSize: "0.6rem", fontWeight: 600, padding: "1px 4px", borderRadius: "99px" }}>{p.matchScore}%</div>
                      </div>
                      <p style={{ fontSize: "0.7rem", fontWeight: 500, marginTop: "0.35rem", color: "#4a3028" }}>{p.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── STEP 8 — Review ─── */}
        {step === 8 && (
          <>
            <div className="pc-review-profile">
              <div className="pc-review-avatar-wrap">
                {(profileCreationData.profileImages || []).length > 0 ? (
                  <img src={profileCreationData.profileImage || profileCreationData.profileImages[0]} alt="Profile" className="pc-review-avatar" />
                ) : (
                  <div className="pc-review-avatar-placeholder"><User size={32} style={{ color: "#9a7060" }} /></div>
                )}
                <div style={{ flex: 1 }}>
                  <div className="pc-review-name">{profileCreationData.firstName || user?.firstName} {profileCreationData.lastName || user?.lastName}</div>
                  <div className="pc-review-sub">{calculateAge(profileCreationData.dateOfBirth)} yrs · {profileCreationData.gender || "—"} · {profileCreationData.city || "Location not set"}</div>
                  <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.4rem" }}>
                    {verifications.email && <span style={{ fontSize: "0.68rem", background: "#e0f5e8", color: "#4a8a5e", padding: "2px 8px", borderRadius: "99px", fontWeight: 500 }}>✓ Email</span>}
                    {verifications.phone && <span style={{ fontSize: "0.68rem", background: "#e0f5e8", color: "#4a8a5e", padding: "2px 8px", borderRadius: "99px", fontWeight: 500 }}>✓ Phone</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="pc-review-score">{completionScore}%</div>
                  <div style={{ fontSize: "0.7rem", color: "#9a7060" }}>Complete</div>
                </div>
              </div>

              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                <div className="pc-review-section">
                  <div className="pc-review-section-title"><User size={12} />Basic Information</div>
                  <div className="pc-review-grid">
                    {[["Marital Status", profileCreationData.maritalStatus], ["Children", profileCreationData.hasChildren ? "Yes" : profileCreationData.hasChildren === false ? "No" : "—"], ["Religion", profileCreationData.religion], ["Ethnicity", profileCreationData.ethnicity]].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                    <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Languages:</span> {(profileCreationData.languages || []).join(", ") || "—"}</div>
                  </div>
                </div>

                <div className="pc-review-section">
                  <div className="pc-review-section-title"><GraduationCap size={12} />Education & Career</div>
                  <div className="pc-review-grid">
                    {[["Education", profileCreationData.education], ["Profession", profileCreationData.profession], ["Industry", profileCreationData.industry], ["Work Location", profileCreationData.workLocation]].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                  </div>
                </div>

                <div className="pc-review-section">
                  <div className="pc-review-section-title"><Heart size={12} />About Me</div>
                  <p style={{ fontSize: "0.8rem", color: "#6b4a3a", lineHeight: 1.55 }}>{profileCreationData.about || "Not provided"}</p>
                </div>

                <div className="pc-review-section">
                  <div className="pc-review-section-title"><Star size={12} />Interests</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {(profileCreationData.interests || []).map((it, i) => (
                      <span key={i} style={{ background: "#fdf0e8", color: "#8b4e2e", fontSize: "0.72rem", padding: "0.25rem 0.6rem", borderRadius: "99px", fontWeight: 500 }}>{it}</span>
                    ))}
                    {!(profileCreationData.interests || []).length && <span style={{ color: "#b09080", fontSize: "0.8rem" }}>—</span>}
                  </div>
                </div>

                <div className="pc-review-section">
                  <div className="pc-review-section-title"><Target size={12} />Partner Preferences</div>
                  <div className="pc-review-grid">
                    {[["Age Range", (profileCreationData.partnerPreferences?.ageRange || []).join(" – ")], ["Location", profileCreationData.partnerPreferences?.locationPreference], ["Education", profileCreationData.partnerPreferences?.educationLevel], ["Religion", profileCreationData.partnerPreferences?.religionPreference]].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                  </div>
                </div>

                {Object.keys(quizAnswers).length > 0 && (
                  <div className="pc-review-section">
                    <div className="pc-review-section-title"><Zap size={12} />Compatibility Quiz</div>
                    {Object.entries(quizAnswers).map(([key, val]) => {
                      const q = compatibilityQuestions.find(q => q.id === key);
                      return q ? <div key={key} className="pc-review-item" style={{ marginBottom: "0.25rem" }}><span>{q.question}:</span> {val}</div> : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="pc-warning-box">
              <AlertTriangle size={16} style={{ color: "#c07030", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "#8a5010" }}>Before you submit</p>
                <ul>
                  <li>✦ Double-check all information for accuracy</li>
                  <li>✦ Your profile will become visible to potential matches</li>
                  <li>✦ You can edit your profile anytime from settings</li>
                  <li>✦ Complete profiles get 5× more match activity</li>
                </ul>
              </div>
            </div>

            {lastSaved && (
              <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#b09080", marginTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                <Save size={11} />Draft saved at {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="pc-nav">
          {step > 1
            ? <button type="button" className="pc-btn-prev" onClick={prevStep}>← Previous</button>
            : <div />}
          {step < 8
            ? <button type="button" className="pc-btn-next" onClick={nextStep}>Next Step →</button>
            : (
              <button type="submit" disabled={loading || completionScore < 70} className="pc-btn-submit">
                {loading ? <><RefreshCw size={15} style={{ animation: "spin 0.8s linear infinite" }} />Completing…</> : <><CheckCircle size={15} />Complete Profile</>}
              </button>
            )}
        </div>
        {step === 8 && completionScore < 70 && (
          <p className="pc-submit-warn">⚠ Please complete more sections to unlock better match results</p>
        )}
      </div>
    );
  };

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{styles}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="pc-root">

        {/* Header */}
        <div className="pc-header">
          <span className="pc-logo">SriMatch ♥</span>
          <h1>Create Your Profile</h1>
          <p>Tell us about yourself to start connecting with your ideal match</p>

          {/* Score pill */}
          <div className="pc-score-pill">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" stroke="#f0ddd5" strokeWidth="3" fill="none" />
              <circle cx="20" cy="20" r="16"
                stroke="url(#scoreGrad)" strokeWidth="3" fill="none"
                strokeDasharray={2 * Math.PI * 16}
                strokeDashoffset={2 * Math.PI * 16 * (1 - completionScore / 100)}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.5s" }} />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3d1f12" />
                  <stop offset="100%" stopColor="#c9856a" />
                </linearGradient>
              </defs>
              <text x="20" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="DM Sans, sans-serif" fill="#8b4e2e">{completionScore}%</text>
            </svg>
            <div>
              <div className="label">Profile Completion</div>
              <div className="sublabel">{completionScore === 100 ? "Perfect! 🎉" : "Keep going!"}</div>
            </div>
            {savingDraft && <span className="pc-saving"><Save size={11} />Saving…</span>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="pc-progress-wrap">
          <div className="pc-progress-track">
            <div className="pc-progress-fill" style={{ width: `${(profileCreationStep / 8) * 100}%` }} />
          </div>
        </div>

        {/* Step tabs */}
        <div className="pc-tabs-wrap">
          <div className="pc-tabs">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const isDone = n < profileCreationStep;
              const isActive = n === profileCreationStep;
              return (
                <button key={n} type="button"
                  className={`pc-tab${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                  onClick={() => setProfileCreationStep(n)}>
                  {isDone ? <CheckCircle size={13} /> : React.createElement(s.icon, { size: 13 })}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main card */}
        <div className="pc-card-wrap">
          <div className="pc-card">
            <div className="pc-card-inner">
              <form onSubmit={handleSubmit} noValidate>
                {renderStep()}
              </form>
            </div>
          </div>
        </div>

        {/* Preview FAB */}
        <button className="pc-preview-fab" onClick={() => setShowPreview(true)} title="Live preview">
          <Eye size={18} />
        </button>

        {/* Preview modal */}
        {showPreview && (
          <div className="pc-modal-overlay" onClick={() => setShowPreview(false)}>
            <div className="pc-modal" onClick={e => e.stopPropagation()}>
              <div className="pc-modal-header">
                <h3>Profile Preview</h3>
                <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9a7060" }}><X size={18} /></button>
              </div>
              <div className="pc-modal-body">
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  {(profileCreationData.profileImages || []).length > 0
                    ? <img src={profileCreationData.profileImage || profileCreationData.profileImages[0]} alt="preview" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #c9856a" }} />
                    : <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#ede5e0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}><User size={36} style={{ color: "#9a7060" }} /></div>}
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, marginTop: "0.5rem", color: "#2d1810" }}>
                    {profileCreationData.firstName || "Your Name"} {profileCreationData.lastName || ""}
                  </h4>
                  <p style={{ fontSize: "0.8rem", color: "#9a7060" }}>{calculateAge(profileCreationData.dateOfBirth) || "Age"} · {profileCreationData.city || "Location"}</p>
                </div>
                {profileCreationData.about && <div style={{ marginBottom: "0.75rem" }}><p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#8b4e2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>About</p><p style={{ fontSize: "0.82rem", color: "#4a3028", lineHeight: 1.55 }}>{profileCreationData.about}</p></div>}
                {(profileCreationData.interests || []).length > 0 && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#8b4e2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Interests</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {(profileCreationData.interests || []).slice(0, 6).map((it, i) => (
                        <span key={i} style={{ background: "#fdf0e8", color: "#8b4e2e", fontSize: "0.7rem", padding: "0.2rem 0.55rem", borderRadius: "99px" }}>{it}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profileCreationData.profession && <div><p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#8b4e2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>Profession</p><p style={{ fontSize: "0.82rem", color: "#4a3028" }}>{profileCreationData.profession}</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* Photo confirm modal */}
        {showImageModal && currentImage && (
          <div className="pc-photo-modal">
            <div className="pc-photo-modal-card">
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #f0ddd5" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "#2d1810" }}>Confirm Photo</h3>
              </div>
              <img src={URL.createObjectURL(currentImage)} alt="preview" className="pc-photo-modal-img" />
              {photoValidationIssues.length > 0 && (
                <div style={{ margin: "0.75rem", padding: "0.65rem", background: "#fffbf0", border: "1px solid #f0e0a0", borderRadius: 8 }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#7a6010", marginBottom: "0.25rem" }}>Photo suggestions:</p>
                  {photoValidationIssues.map((iss, i) => <p key={i} style={{ fontSize: "0.72rem", color: "#7a6010" }}>· {iss}</p>)}
                </div>
              )}
              <div style={{ padding: "0.9rem 1.25rem", borderTop: "1px solid #f0ddd5", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => { setShowImageModal(false); setCurrentImage(null); setPhotoValidationIssues([]); }}
                  style={{ padding: "0.55rem 1.1rem", border: "1.5px solid #e8ddd8", borderRadius: 8, background: "#fdf8f5", color: "#6b4a3a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem" }}>
                  Cancel
                </button>
                <button type="button" onClick={confirmImageUpload}
                  style={{ padding: "0.55rem 1.25rem", background: "linear-gradient(135deg, #3d1f12, #8b4e2e)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 500 }}>
                  Use This Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileCreationPage;