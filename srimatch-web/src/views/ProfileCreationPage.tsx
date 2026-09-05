"use client";

// ProfileCreationPage.jsx - Redesigned Luxury Version
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import useProfileStore from "../store/useProfileStore";
import {
  Camera, BookOpen, Briefcase, Heart, Star, CheckCircle, User,
  FileText, Image as ImageIcon, MapPin, Home, Globe, GraduationCap, Building,
  Clock, DollarSign, Ruler, Activity, Coffee, Wine, Users, Languages,
  Cake, UserCheck, MessageCircle, AlertTriangle, Award, PlusCircle, X,
  Shield, Zap, TrendingUp, Smile, Music,
  Film, Dumbbell, Book, Plane, Gamepad, Mail,
  Sparkles, Gift, Bell, Lock, Upload, Save, RefreshCw, Eye,
  Target, Check, XCircle, Info, AlertCircle, Calendar,
} from "lucide-react";
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
  languages: ["Sinhala", "Tamil", "English", "French", "German", "Japanese", "Arabic"],
  industries: ["Technology", "Healthcare", "Finance", "Education", "Engineering", "Arts", "Government", "Other"],
  incomeRanges: ["Less than 50k", "50k - 100k", "100k - 200k", "200k - 500k", "Above 500k"],
  interests: ["Music", "Travel", "Photography", "Reading", "Movies", "Gaming", "Cooking", "Sports", "Yoga", "Dancing"]
};

import ProfileService from "../services/profile.service";

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
    box-shadow: 0 0 0 3px rgba(201,133,106,0.12);
  }
  .pc-input-readonly {
    background: #f0f0f0 !important;
    cursor: not-allowed;
    color: #888;
    border-color: #ddd !important;
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
  .pc-review-profile { background: #fdf8f5; border: 1.5px solid #ede0d8; border-radius: 16px; padding: 1.3rem; margin-bottom: 1.25rem; }
  .pc-review-avatar-wrap { display: flex; align-items: center; gap: 1.25rem; }
  .pc-review-avatar { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2.5px solid #c9856a; display: block; flex-shrink: 0; box-shadow: 0 4px 12px rgba(139,78,46,0.15); }
  .pc-review-avatar-placeholder { width: 72px; height: 72px; border-radius: 50%; background: #f0ddd5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 2px solid #ddd0c8; }
  .pc-review-name { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 700; color: #2d1810; }
  .pc-review-sub { font-size: 0.78rem; color: #9a7060; margin-top: 0.2rem; }
  .pc-review-score { font-size: 1.4rem; font-weight: 700; color: #8b4e2e; }
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
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();
  const {
    profileCreationStep, setProfileCreationStep,
    profileCreationData, updateProfileCreationData,
  } = useProfileStore();

  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [completionScore, setCompletionScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [dismissedTips, setDismissedTips] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [verifications, setVerifications] = useState({ email: false, phone: false });
  const [savingDraft, setSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [photoValidationIssues, setPhotoValidationIssues] = useState([]);
  const [pendingImages, setPendingImages] = useState([]); // Array of { file, previewUrl }
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
      { key: "profileImages", w: 10, ok: v => (v?.length > 0 || pendingImages.length > 0) },
      { key: "about", w: 10, ok: v => v?.length > 50 },
      { key: "interests", w: 10, ok: v => v?.length >= 3 },
      { key: "education", w: 8, ok: v => v },
      { key: "profession", w: 8, ok: v => v },
      { key: "religion", w: 8, ok: v => v },
      { key: "partnerPreferences", w: 10, ok: v => Object.keys(v || {}).length > 0 },
      { key: "firstName", w: 5, ok: v => v },
      { key: "gender", w: 5, ok: v => v },
      { key: "dateOfBirth", w: 5, ok: v => v },
      { key: "city", w: 10, ok: v => v },
      { key: "maritalStatus", w: 6, ok: v => v },
    ];
    const score = fields.reduce((acc, f) => acc + (f.ok(profileCreationData[f.key]) ? f.w : 0), 0);
    setCompletionScore(Math.min(100, score));
  }, [profileCreationData, pendingImages]);

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
    try {
      const raw = localStorage.getItem("profileDraft");
      if (raw) {
        const { data, step, ts } = JSON.parse(raw);
        if (new Date() - new Date(ts) < 7 * 86400000) {
          if (window.confirm("We found an incomplete profile draft. Continue where you left off?")) {
            if (data && typeof data === 'object') {
              updateProfileCreationData(data);
            }
            setProfileCreationStep(Math.max(1, Math.min(8, Number(step) || 1)));
          }
        }
      }
    } catch {
      localStorage.removeItem("profileDraft");
    }
  }, []);

  useEffect(() => {
    if (user?.profileCompleted) router.push("/home");
    
    // Auto-fill names from user context if they are not already set
    if (user && !profileCreationData.firstName && !profileCreationData.lastName) {
      updateProfileCreationData({
        firstName: user.firstName || "",
        lastName: user.lastName || ""
      });
    }

    if (!profileCreationData.profileImages) updateProfileCreationData({ profileImages: [] });
  }, [user, router]);

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
    try {
      await new Promise(res => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 100) issues.push("Low resolution image");
          URL.revokeObjectURL(url);
          res();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          res();
        };
        img.src = url;
      });
    } catch {
      // fallback
    }
    return issues;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const currentTotal = (profileCreationData.profileImages || []).length + pendingImages.length;
    const availableSlots = Math.max(0, 6 - currentTotal);
    const filesToAdd = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      alert(`You can only upload up to 6 photos. Adding the first ${availableSlots}.`);
    }

    filesToAdd.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not a valid image file.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5 MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const previewUrl = event.target.result;
        setPendingImages(prev => [...prev, { file, previewUrl }]);
      };
      reader.readAsDataURL(file);
    });

    if (e.target) {
      e.target.value = "";
    }
  };

  const addPendingImage = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target.result;
      setPendingImages(prev => [...prev, { file, previewUrl }]);
    };
    reader.readAsDataURL(file);
  };

  const performUpload = async (file) => {
    setLoading(true);
    try {
      const isPrimary = (profileCreationData.profileImages || []).length === 0;
      const response = await ProfileService.uploadProfileImage(file, isPrimary);
      
      if (response.success && response.data) {
        // The backend returns the updated list of images in response.data.profileImages
        const updatedImages = response.data.profileImages || [];
        const primaryImg = response.data.primaryImageUrl;
        
        updateProfileCreationData({ 
          profileImages: updatedImages, 
          profileImage: primaryImg || updatedImages[0]
        });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmImageUpload = () => {
    if (!currentImage) return;
    setShowImageModal(false);
    addPendingImage(currentImage);
    setCurrentImage(null);
    setPhotoValidationIssues([]);
  };

  const removeImage = (idx) => {
    const remoteImgsCount = (profileCreationData.profileImages || []).length;
    
    if (idx < remoteImgsCount) {
      // Remove remote image
      const imgs = [...(profileCreationData.profileImages || [])];
      imgs.splice(idx, 1);
      updateProfileCreationData({ 
        profileImages: imgs, 
        profileImage: (idx === 0 && imgs.length > 0) ? imgs[0] : profileCreationData.profileImage 
      });
    } else {
      // Remove local pending image
      const localIdx = idx - remoteImgsCount;
      const item = pendingImages[localIdx];
      if (item) URL.revokeObjectURL(item.previewUrl);
      
      const newPending = [...pendingImages];
      newPending.splice(localIdx, 1);
      setPendingImages(newPending);
    }
  };

  const setPrimaryImage = (idx) => {
    // Currently only supported for remote/already uploaded images in this UI logic,
    // but we can set the local preview as 'desired primary' if needed.
    const remoteImgs = profileCreationData.profileImages || [];
    const remoteCount = remoteImgs.length;
    
    if (idx < remoteCount) {
      updateProfileCreationData({ profileImage: remoteImgs[idx] });
    }
  };

  const nextStep = () => {
    setProfileCreationStep(s => Math.min(8, (Number(s) || 1) + 1));
    window.scrollTo(0, 0);
  };
  const prevStep = () => {
    setProfileCreationStep(s => Math.max(1, (Number(s) || 1) - 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Helper to map and transform options to Enums
      const mapEnum = (val, type) => {
        if (!val) return null;
        const normalized = val.toLowerCase().trim();
        
        switch (type) {
          case 'maritalStatus':
            if (normalized.includes('never married') || normalized === 'single') return 'NEVER_MARRIED';
            if (normalized === 'widowed') return 'WIDOWED';
            if (normalized === 'divorced') return 'DIVORCED';
            if (normalized === 'separated') return 'SEPARATED';
            return normalized.toUpperCase().replace(/['\s]+/g, '_');
          case 'education':
            if (normalized.includes('bachelor')) return 'BACHELORS';
            if (normalized.includes('master')) return 'MASTERS';
            if (normalized.includes('doctor')) return 'DOCTORATE';
            if (normalized.includes('certificate')) return 'PROFESSIONAL_CERTIFICATION';
            if (normalized.includes('high school')) return 'HIGH_SCHOOL';
            if (normalized.includes('diploma')) return 'DIPLOMA';
            return 'OTHER';
          case 'smoking':
          case 'drinking':
            if (normalized.includes('never') || normalized.includes('non-')) return 'NEVER';
            if (normalized.includes('occasional')) return 'OCCASIONALLY';
            if (normalized.includes('regular')) return 'REGULARLY';
            if (normalized.includes('quit')) return 'TRYING_TO_QUIT';
            if (normalized.includes('social')) return 'SOCIALLY';
            return normalized.toUpperCase().replace(/['\s]+/g, '_');
          default:
            return normalized.toUpperCase().replace(/['\s]+/g, '_');
        }
      };

      const formattedData = {
        firstName: profileCreationData.firstName,
        lastName: profileCreationData.lastName,
        gender: profileCreationData.gender?.toUpperCase(),
        dateOfBirth: profileCreationData.dateOfBirth,
        maritalStatus: mapEnum(profileCreationData.maritalStatus, 'maritalStatus'),
        hasChildren: profileCreationData.hasChildren,
        numberOfChildren: profileCreationData.numberOfChildren || 0,
        
        city: profileCreationData.city,
        placeOfBirth: profileCreationData.placeOfBirth,
        
        religion: mapEnum(profileCreationData.religion, 'religion'),
        ethnicity: mapEnum(profileCreationData.ethnicity, 'ethnicity'),
        religiousPractices: profileCreationData.religiousPractices,
        languages: profileCreationData.languages || [],
        
        education: mapEnum(profileCreationData.education, 'education'),
        fieldOfStudy: profileCreationData.fieldOfStudy,
        profession: profileCreationData.profession,
        industry: profileCreationData.industry,
        employer: profileCreationData.employer,
        workLocation: profileCreationData.workLocation,
        income: profileCreationData.income,
        
        height: profileCreationData.height ? parseInt(profileCreationData.height) : null,
        bodyType: profileCreationData.bodyType?.toUpperCase(),
        complexion: profileCreationData.complexion?.toUpperCase(),
        
        smoking: mapEnum(profileCreationData.smoking, 'smoking'),
        drinking: mapEnum(profileCreationData.drinking, 'drinking'),
        dietaryPreferences: mapEnum(profileCreationData.dietaryPreferences, 'dietary'),
        healthHabits: profileCreationData.healthHabits,
        lifestyle: profileCreationData.lifestyle,
        
        familyBackground: profileCreationData.familyBackground,
        culturalValues: profileCreationData.culturalValues,
        familyInvolvement: profileCreationData.familyInvolvement,
        weddingPreferences: profileCreationData.weddingPreferences,
        horoscopeSign: mapEnum(profileCreationData.horoscopeSign, 'horoscope'),
        birthStar: profileCreationData.birthStar,
        horoscopeDetails: profileCreationData.horoscopeDetails,
        
        about: profileCreationData.about,
        interests: profileCreationData.interests || [],
        favoriteThings: profileCreationData.favoriteThings || {},
        travelPreferences: profileCreationData.travelPreferences,
        personalityTraits: profileCreationData.personalityTraits,
        
        partnerPreferences: profileCreationData.partnerPreferences || {},
        dealbreakers: profileCreationData.dealbreakers,
        quizAnswers: quizAnswers || {},
      };

      const result = await updateUserProfile(formattedData);
      
      if (result.success) {
        // Now upload images since profile exists
        if (pendingImages.length > 0) {
          for (let i = 0; i < pendingImages.length; i++) {
            try {
              // Mark the first ever image as primary
              const isPrimary = i === 0 && (profileCreationData.profileImages || []).length === 0;
              await ProfileService.uploadProfileImage(pendingImages[i].file, isPrimary);
            } catch (imgErr) {
              console.error("Delayed image upload failed for file:", i, imgErr);
            }
          }
        }
        
        localStorage.removeItem("profileDraft");
        router.push("/home");
      } else {
        alert(result.message || "Failed to save profile. Please check your info.");
      }
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
    const stepNum = Math.max(1, Math.min(8, Number(profileCreationStep) || 1));
    const currentStepMeta = STEPS[stepNum - 1] || STEPS[0];
    const StepIcon = currentStepMeta.icon || User;
    const step = stepNum;

    return (
      <div>
        {/* Step header */}
        <div className="pc-step-header">
          <div className="pc-step-badge">
            <div className="pc-step-icon-wrap">
              <StepIcon size={18} style={{ color: "#8b4e2e" }} />
            </div>
            <h2 className="pc-step-title">{currentStepMeta.label}</h2>
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
                {/* Remote Images */}
                {(profileCreationData.profileImages || []).map((img, i) => (
                  <div key={`remote-${i}`} className={`pc-photo-item${profileCreationData.profileImage === img ? " pc-photo-ring" : ""}`}>
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
                
                {/* Pending Local Images */}
                {pendingImages.map((item, i) => {
                  const isPrimary = (profileCreationData.profileImages || []).length === 0 && i === 0;
                  return (
                    <div key={`local-${i}`} className={`pc-photo-item${isPrimary ? " pc-photo-ring" : ""}`}>
                      <img src={item.previewUrl} alt={`Selected ${i + 1}`} className="pc-photo-img" style={{ opacity: 1 }} />
                      <div className="pc-photo-overlay">
                        <button type="button" className="pc-photo-action" style={{ background: "#c0392b" }} onClick={() => removeImage((profileCreationData.profileImages || []).length + i)} title="Remove">
                          <X size={13} color="#fff" />
                        </button>
                      </div>
                      <div className="pc-photo-badge" style={{ background: isPrimary ? "linear-gradient(135deg, #8b4e2e, #c9856a)" : "#6b4a3a" }}>
                        {isPrimary ? "Primary" : "Ready"}
                      </div>
                    </div>
                  );
                })}

                {( (profileCreationData.profileImages || []).length + pendingImages.length ) < 6 && (
                  <label className="pc-upload-slot" style={{ cursor: "pointer" }}>
                    <Upload size={22} style={{ color: "#c9856a" }} />
                    <span>Upload Photo<br />JPG/PNG · max 5 MB</span>
                    <input ref={fileInputRef} type="file" hidden multiple accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <p className="pc-note">{6 - ( (profileCreationData.profileImages || []).length + pendingImages.length )} photo slots remaining</p>
            </div>

            {/* Name */}
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">First Name <span className="req">*</span> <span className="hint">(from account)</span></label>
                <input name="firstName" type="text" value={profileCreationData.firstName || ""} readOnly className="pc-input pc-input-readonly" placeholder="First Name" />
              </div>
              <div className="pc-field">
                <label className="pc-label">Last Name <span className="req">*</span> <span className="hint">(from account)</span></label>
                <input name="lastName" type="text" value={profileCreationData.lastName || ""} readOnly className="pc-input pc-input-readonly" placeholder="Last Name" />
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
                  {(PROFILE_OPTIONS.maritalStatus || []).map(s => <option key={s} value={s}>{s}</option>)}
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
                <label className="pc-label">City / Current Town <span className="req">*</span></label>
                <input name="city" type="text" value={profileCreationData.city || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Colombo, Kandy, Galle" />
              </div>
              <div className="pc-field">
                <label className="pc-label">Place of Birth</label>
                <input name="placeOfBirth" type="text" value={profileCreationData.placeOfBirth || ""} onChange={handleChange} className="pc-input" placeholder="e.g. Matara" />
              </div>
            </div>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Ethnicity</label>
                <select name="ethnicity" value={profileCreationData.ethnicity || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(PROFILE_OPTIONS.ethnicity || []).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Religion <span className="req">*</span></label>
                <select name="religion" value={profileCreationData.religion || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(PROFILE_OPTIONS.religion || []).map(r => <option key={r} value={r}>{r}</option>)}
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
                {(PROFILE_OPTIONS.languages || []).map(lang => {
                  const rawLang = profileCreationData.languages;
                  const cur = Array.isArray(rawLang) ? rawLang : typeof rawLang === 'string' ? rawLang.split(',').map(s => s.trim()).filter(Boolean) : [];
                  const isSelected = cur.includes(lang);
                  return (
                    <button key={lang} type="button"
                      className={`pc-chip${isSelected ? " selected" : ""}`}
                      onClick={() => {
                        if (isSelected) {
                          updateProfileCreationData({ languages: cur.filter(l => l !== lang) });
                        } else if (cur.length < 5) {
                          updateProfileCreationData({ languages: [...cur, lang] });
                        }
                      }}>{lang}</button>
                  );
                })}
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
                  {(PROFILE_OPTIONS.education || []).map(l => <option key={l} value={l}>{l}</option>)}
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
                  {(PROFILE_OPTIONS.industries || []).map(i => <option key={i} value={i}>{i}</option>)}
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
                {(PROFILE_OPTIONS.incomeRanges || []).map(r => <option key={r} value={r}>{r}</option>)}
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
                  {(PROFILE_OPTIONS.bodyType || []).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Complexion</label>
              <select name="complexion" value={profileCreationData.complexion || ""} onChange={handleChange} className="pc-select">
                <option value="">Select</option>
                {(PROFILE_OPTIONS.complexion || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="pc-grid-2">
              <div className="pc-field">
                <label className="pc-label">Smoking Habits</label>
                <select name="smoking" value={profileCreationData.smoking || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(PROFILE_OPTIONS.smoking || []).map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Drinking Habits</label>
                <select name="drinking" value={profileCreationData.drinking || ""} onChange={handleChange} className="pc-select">
                  <option value="">Select</option>
                  {(PROFILE_OPTIONS.drinking || []).map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <div className="pc-field">
              <label className="pc-label">Dietary Preferences</label>
              <select name="dietaryPreferences" value={profileCreationData.dietaryPreferences || ""} onChange={handleChange} className="pc-select">
                <option value="">Select</option>
                {(PROFILE_OPTIONS.dietary || []).map(p => <option key={p} value={p}>{p}</option>)}
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
                  {(PROFILE_OPTIONS.horoscope || []).map(s => <option key={s} value={s}>{s}</option>)}
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
                  {(PROFILE_OPTIONS.interests || []).map(interest => {
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
                  {(PROFILE_OPTIONS.education || []).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="pc-field">
                <label className="pc-label">Religion Preference</label>
                <select value={(profileCreationData.partnerPreferences || {}).religionPreference || ""}
                  onChange={e => updateProfileCreationData({ partnerPreferences: { ...(profileCreationData.partnerPreferences || {}), religionPreference: e.target.value } })} className="pc-select">
                  <option value="">No preference</option>
                  {(PROFILE_OPTIONS.religion || []).map(r => <option key={r} value={r}>{r}</option>)}
                  <option value="Open to all">Open to all religions</option>
                </select>
              </div>
            </div>

            <div className="pc-field">
              <label className="pc-label">Marital Status Preference</label>
              <select value={(profileCreationData.partnerPreferences || {}).maritalStatusPreference || ""}
                onChange={e => updateProfileCreationData({ partnerPreferences: { ...(profileCreationData.partnerPreferences || {}), maritalStatusPreference: e.target.value } })} className="pc-select">
                <option value="">No preference</option>
                {(PROFILE_OPTIONS.maritalStatus || []).map(s => <option key={s} value={s}>{s}</option>)}
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
          </>
        )}

        {/* ─── STEP 8 — Review ─── */}
        {step === 8 && (() => {
          const getImgUrl = (item) => {
            if (!item) return null;
            if (typeof item === 'string' && item.trim().length > 0) return item;
            if (typeof item === 'object') {
              return item.previewUrl || item.url || item.imageUrl || null;
            }
            return null;
          };

          const reviewAvatar = (pendingImages.length > 0 && getImgUrl(pendingImages[0]))
            || getImgUrl(profileCreationData.profileImage)
            || (Array.isArray(profileCreationData.profileImages) && profileCreationData.profileImages.length > 0 && getImgUrl(profileCreationData.profileImages[0]))
            || getImgUrl(user?.profileImage)
            || getImgUrl(user?.primaryImageUrl);

          const allReviewImages = [
            ...pendingImages.map(p => getImgUrl(p)),
            ...(Array.isArray(profileCreationData.profileImages) ? profileCreationData.profileImages.map(img => getImgUrl(img)) : [])
          ].filter(Boolean);

          return (
            <>
              <div className="pc-review-profile">
                <div className="pc-review-avatar-wrap">
                  {reviewAvatar ? (
                    <img src={reviewAvatar} alt="Profile" className="pc-review-avatar" />
                  ) : (
                    <div className="pc-review-avatar-placeholder"><User size={32} style={{ color: "#9a7060" }} /></div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div className="pc-review-name">{profileCreationData.firstName || user?.firstName} {profileCreationData.lastName || user?.lastName}</div>
                    <div className="pc-review-sub">{calculateAge(profileCreationData.dateOfBirth)} yrs · {profileCreationData.gender || "—"} · {profileCreationData.city || "Location not set"}</div>
                    {allReviewImages.length > 1 && (
                      <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
                        {allReviewImages.map((src, idx) => (
                          <img key={idx} src={src} alt={`Selected ${idx + 1}`} style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover", border: idx === 0 ? "1.5px solid #8b4e2e" : "1px solid #ddd0c8" }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="pc-review-score">{completionScore}%</div>
                    <div style={{ fontSize: "0.7rem", color: "#9a7060" }}>Complete</div>
                  </div>
                </div>

              <div style={{ maxHeight: "420px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {/* 1. Basic & Location */}
                <div className="pc-review-section" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
                  <div className="pc-review-section-title"><User size={13} />Basic Information & Location</div>
                  <div className="pc-review-grid">
                    {[
                      ["Marital Status", profileCreationData.maritalStatus],
                      ["Children", profileCreationData.hasChildren ? `Yes (${profileCreationData.numberOfChildren || 0})` : profileCreationData.hasChildren === false ? "No" : "—"],
                      ["City", profileCreationData.city],
                      ["Place of Birth", profileCreationData.placeOfBirth],
                      ["Religion", profileCreationData.religion],
                      ["Ethnicity", profileCreationData.ethnicity],
                    ].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                    <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Languages:</span> {(profileCreationData.languages || []).join(", ") || "—"}</div>
                    {profileCreationData.religiousPractices && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Religious Practices:</span> {profileCreationData.religiousPractices}</div>
                    )}
                  </div>
                </div>

                {/* 2. Education & Career */}
                <div className="pc-review-section">
                  <div className="pc-review-section-title"><GraduationCap size={13} />Education & Career</div>
                  <div className="pc-review-grid">
                    {[
                      ["Education", profileCreationData.education],
                      ["Field of Study", profileCreationData.fieldOfStudy],
                      ["Profession", profileCreationData.profession],
                      ["Industry", profileCreationData.industry],
                      ["Employer", profileCreationData.employer],
                      ["Work Location", profileCreationData.workLocation],
                      ["Income Range", profileCreationData.income],
                    ].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                  </div>
                </div>

                {/* 3. Physical & Lifestyle */}
                <div className="pc-review-section">
                  <div className="pc-review-section-title"><Activity size={13} />Physical & Lifestyle</div>
                  <div className="pc-review-grid">
                    {[
                      ["Height", profileCreationData.height ? `${profileCreationData.height} cm` : "—"],
                      ["Body Type", profileCreationData.bodyType],
                      ["Complexion", profileCreationData.complexion],
                      ["Dietary Preference", profileCreationData.dietaryPreferences],
                      ["Smoking", profileCreationData.smoking],
                      ["Drinking", profileCreationData.drinking],
                    ].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                    {profileCreationData.healthHabits && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Health & Fitness:</span> {profileCreationData.healthHabits}</div>
                    )}
                    {profileCreationData.lifestyle && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Lifestyle:</span> {profileCreationData.lifestyle}</div>
                    )}
                  </div>
                </div>

                {/* 4. Cultural & Family Heritage */}
                <div className="pc-review-section">
                  <div className="pc-review-section-title"><Home size={13} />Cultural & Family Background</div>
                  <div className="pc-review-grid">
                    {[
                      ["Horoscope Sign", profileCreationData.horoscopeSign],
                      ["Birth Star", profileCreationData.birthStar],
                    ].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                    {profileCreationData.familyBackground && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Family Background:</span> {profileCreationData.familyBackground}</div>
                    )}
                    {profileCreationData.culturalValues && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Cultural Values:</span> {profileCreationData.culturalValues}</div>
                    )}
                    {profileCreationData.familyInvolvement && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Family Involvement:</span> {profileCreationData.familyInvolvement}</div>
                    )}
                    {profileCreationData.weddingPreferences && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Wedding Preferences:</span> {profileCreationData.weddingPreferences}</div>
                    )}
                    {profileCreationData.horoscopeDetails && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Horoscope Details:</span> {profileCreationData.horoscopeDetails}</div>
                    )}
                  </div>
                </div>

                {/* 5. About You */}
                <div className="pc-review-section">
                  <div className="pc-review-section-title"><Heart size={13} />About Me</div>
                  <p style={{ fontSize: "0.8rem", color: "#6b4a3a", lineHeight: 1.55, marginBottom: "0.6rem" }}>{profileCreationData.about || "Not provided"}</p>
                  
                  <div style={{ marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: 600, color: "#2d1810" }}>Interests: </span>
                    <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.35rem", verticalAlign: "middle", marginLeft: "0.3rem" }}>
                      {(profileCreationData.interests || []).map((it, i) => (
                        <span key={i} style={{ background: "#fdf0e8", color: "#8b4e2e", fontSize: "0.72rem", padding: "0.2rem 0.55rem", borderRadius: "99px", fontWeight: 500 }}>{it}</span>
                      ))}
                      {!(profileCreationData.interests || []).length && <span style={{ color: "#b09080", fontSize: "0.78rem" }}>—</span>}
                    </div>
                  </div>

                  <div className="pc-review-grid">
                    {profileCreationData.favoriteThings?.food && <div className="pc-review-item"><span>Fav Food:</span> {profileCreationData.favoriteThings.food}</div>}
                    {profileCreationData.favoriteThings?.movies && <div className="pc-review-item"><span>Fav Movies/Shows:</span> {profileCreationData.favoriteThings.movies}</div>}
                    {profileCreationData.personalityTraits && <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Personality:</span> {profileCreationData.personalityTraits}</div>}
                    {profileCreationData.travelPreferences && <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Travel Style:</span> {profileCreationData.travelPreferences}</div>}
                  </div>
                </div>

                {/* 6. Partner Preferences */}
                <div className="pc-review-section">
                  <div className="pc-review-section-title"><Target size={13} />Partner Preferences</div>
                  <div className="pc-review-grid">
                    {[
                      ["Age Range", (profileCreationData.partnerPreferences?.ageRange || []).length ? `${profileCreationData.partnerPreferences.ageRange[0]} – ${profileCreationData.partnerPreferences.ageRange[1]} yrs` : "—"],
                      ["Location Preference", profileCreationData.partnerPreferences?.locationPreference],
                      ["Min Education", profileCreationData.partnerPreferences?.educationLevel],
                      ["Religion Preference", profileCreationData.partnerPreferences?.religionPreference],
                      ["Marital Status Preference", profileCreationData.partnerPreferences?.maritalStatusPreference],
                    ].map(([k, v]) => (
                      <div key={k} className="pc-review-item"><span>{k}:</span> {v || "—"}</div>
                    ))}
                    {profileCreationData.partnerPreferences?.lifestyleCompatibility && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Lifestyle Compatibility:</span> {profileCreationData.partnerPreferences.lifestyleCompatibility}</div>
                    )}
                    {profileCreationData.dealbreakers && (
                      <div className="pc-review-item" style={{ gridColumn: "span 2" }}><span>Dealbreakers:</span> {profileCreationData.dealbreakers}</div>
                    )}
                  </div>
                </div>

                {/* 7. Quiz Answers */}
                {Object.keys(quizAnswers).length > 0 && (
                  <div className="pc-review-section">
                    <div className="pc-review-section-title"><Zap size={13} />Compatibility Quiz</div>
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
        )})()}

        {/* Navigation */}
        <div className="pc-nav">
          {step > 1
            ? <button type="button" className="pc-btn-prev" onClick={prevStep}>← Previous</button>
            : <div />}
          {step < 8
            ? <button type="button" className="pc-btn-next" onClick={nextStep}>Next Step →</button>
            : (
              <button type="submit" disabled={loading} className="pc-btn-submit">
                {loading ? <><RefreshCw size={15} style={{ animation: "spin 0.8s linear infinite" }} />Completing…</> : <><CheckCircle size={15} />Complete Profile</>}
              </button>
            )}
        </div>
        {step === 8 && completionScore < 70 && (
          <p className="pc-submit-warn">⚠ Tip: A higher completion score helps you get better match results</p>
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
              <form onSubmit={handleSubmit} onKeyDown={e => { if (e.key === 'Enter' && profileCreationStep < 8 && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }} noValidate>
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
                    : pendingImages.length > 0
                    ? <img src={pendingImages[0].previewUrl} alt="preview" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #c9856a" }} />
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