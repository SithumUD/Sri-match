import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User, MapPin, GraduationCap, Briefcase, Heart, Settings, Edit3, Save, X,
  Camera, FileText, BookOpen, Languages, Users, Star, Coffee, Activity,
  ChevronDown, ChevronUp, Check, Image as ImageIcon, Plus, ArrowLeft,
  Shield, Eye, EyeOff, Lock, Sparkles, Crown, Target, Home,
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
  interests: ["Music", "Travel", "Photography", "Reading", "Movies", "Gaming", "Cooking", "Sports", "Yoga", "Dancing"],
  industries: ["Technology", "Healthcare", "Finance", "Education", "Engineering", "Arts", "Government", "Other"],
  incomeRanges: ["Less than 50k", "50k - 100k", "100k - 200k", "200k - 500k", "Above 500k"]
};

import ProfileService from "../services/profile.service";
import { getProfileImage } from "../utils/image.utils";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .mp-root * { box-sizing: border-box; }

  .mp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2rem 1.5rem 5rem;
  }
  @keyframes spin { 100% { transform:rotate(360deg); } }
  .spinning { animation: spin 1s linear infinite; }

  .mp-inner { max-width: 900px; margin: 0 auto; }

  /* ── Back ── */
  .mp-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; color: #9a7060; text-decoration: none;
    margin-bottom: 1.75rem; transition: color 0.2s;
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }
  .mp-back:hover { color: #8b4e2e; }

  /* ── Hero card ── */
  .mp-hero-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 1.75rem;
  }

  /* Cover */
  .mp-cover {
    position: relative; height: 240px; overflow: hidden;
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
  }

  /* Shimmer lines for empty state */
  .mp-cover-shimmer {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      90deg, transparent, transparent 60px,
      rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px
    );
    pointer-events: none;
  }

  /* Collage grid */
  .mp-cover-collage {
    position: absolute; inset: 0;
    display: grid; gap: 2px;
    background: #1a0a05;
  }

  /* 1 image */
  .mp-cover-collage[data-count="1"] {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  /* 2 images — side by side */
  .mp-cover-collage[data-count="2"] {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
  /* 3 images — big left, two stacked right */
  .mp-cover-collage[data-count="3"] {
    grid-template-columns: 1.6fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .mp-cover-collage[data-count="3"] .mp-col-item:first-child {
    grid-row: 1 / 3;
  }
  /* 4 images — 2x2 */
  .mp-cover-collage[data-count="4"] {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  /* 5 images — big left, 2x2 right */
  .mp-cover-collage[data-count="5"] {
    grid-template-columns: 1.5fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .mp-cover-collage[data-count="5"] .mp-col-item:first-child {
    grid-row: 1 / 3;
  }
  /* 6+ images — 3x2 */
  .mp-cover-collage[data-count="6"] {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .mp-col-item { overflow: hidden; position: relative; }
  .mp-col-item img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.4s ease; filter: brightness(0.88);
  }
  .mp-col-item:hover img { transform: scale(1.06); filter: brightness(0.96); }

  /* "+N more" badge */
  .mp-col-more-badge {
    position: absolute; inset: 0;
    background: rgba(20, 6, 2, 0.55);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1.6rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif; pointer-events: none;
  }

  .mp-cover-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,4,1,0.65) 0%, rgba(40,12,4,0.2) 45%, transparent 75%);
    pointer-events: none; z-index: 2;
  }
  .mp-cover-cam {
    position: absolute; top: 1rem; right: 1rem;
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.18); backdrop-filter: blur(6px);
    border: none; color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s; z-index: 3;
  }
  .mp-cover-cam:hover { background: rgba(255,255,255,0.3); }

  /* Avatar row */
  .mp-avatar-row {
    display: flex; align-items: flex-end; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
    padding: 0 2rem 1.5rem;
    margin-top: -52px; position: relative; z-index: 2;
  }
  .mp-avatar-wrap { position: relative; flex-shrink: 0; }
  .mp-avatar {
    width: 100px; height: 100px; border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 8px 20px rgba(30,8,2,0.16);
    object-fit: cover; display: block; background: #f5ede8;
  }
  .mp-avatar-ph {
    width: 100px; height: 100px; border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 8px 20px rgba(30,8,2,0.16);
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
  }
  .mp-avatar-cam {
    position: absolute; bottom: 2px; right: 2px;
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    border: 2px solid #fff; color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s; border: none;
  }
  .mp-avatar-cam:hover { transform: scale(1.1); }

  .mp-name-block { flex: 1; padding-bottom: 0.25rem; }
  .mp-profile-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600; color: #2d1810; line-height: 1.1;
  }
  .mp-profile-meta {
    display: flex; flex-wrap: wrap; gap: 0.65rem;
    font-size: 0.78rem; color: #9a7060; margin-top: 0.3rem;
  }
  .mp-profile-meta-item { display: flex; align-items: center; gap: 4px; }

  .mp-hero-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; padding-bottom: 0.25rem; }
  .mp-btn-settings {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1rem; border-radius: 99px;
    font-size: 0.8rem; font-weight: 500;
    background: none; border: 1.5px solid #e8ddd8; color: #6b4a3a;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    text-decoration: none; transition: all 0.2s;
  }
  .mp-btn-settings:hover { border-color: #c9856a; color: #8b4e2e; }
  .mp-btn-edit-profile {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1.25rem; border-radius: 99px;
    font-size: 0.8rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(139,78,46,0.24);
    transition: all 0.2s;
  }
  .mp-btn-edit-profile:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(139,78,46,0.32); }

  /* ── Tabs ── */
  .mp-tabs-nav {
    display: flex; overflow-x: auto; border-top: 1px solid #f5ede8;
    scrollbar-width: none; padding: 0 2rem;
  }
  .mp-tabs-nav::-webkit-scrollbar { display: none; }
  .mp-tab-btn {
    padding: 0.85rem 1rem; font-size: 0.8rem; font-weight: 500;
    color: #9a7060; background: none; border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer; white-space: nowrap; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .mp-tab-btn:hover { color: #4a3028; }
  .mp-tab-btn.active { color: #8b4e2e; border-bottom-color: #8b4e2e; }

  /* ── Main content card ── */
  .mp-content-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
  }

  /* ── Accordion sections ── */
  .mp-section { border-bottom: 1px solid #f5ede8; }
  .mp-section:last-child { border-bottom: none; }

  .mp-section-toggle {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 2rem; cursor: pointer; transition: background 0.15s;
    background: none; border: none; font-family: 'DM Sans', sans-serif;
    text-align: left;
  }
  .mp-section-toggle:hover { background: #fffbf8; }

  .mp-section-toggle-left { display: flex; align-items: center; gap: 0.65rem; }
  .mp-section-icon {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
  }
  .mp-section-title { font-size: 0.92rem; font-weight: 500; color: #2d1810; }

  .mp-section-body { padding: 0 2rem 1.75rem; }

  /* Section header row (title + edit button) */
  .mp-section-head-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.25rem; padding-top: 0.25rem;
  }
  .mp-subsection-label {
    font-size: 0.7rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.09em; color: #8b4e2e;
  }

  /* Edit / Save / Cancel buttons */
  .mp-btn-edit {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.38rem 0.9rem; border-radius: 99px;
    font-size: 0.76rem; font-weight: 500;
    background: none; border: 1.5px solid #e8ddd8; color: #6b4a3a;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .mp-btn-edit:hover { border-color: #c9856a; color: #8b4e2e; }

  .mp-btn-save {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.38rem 0.9rem; border-radius: 99px;
    font-size: 0.76rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .mp-btn-save:hover { opacity: 0.88; }

  .mp-btn-cancel {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.38rem 0.9rem; border-radius: 99px;
    font-size: 0.76rem; font-weight: 500;
    background: none; border: 1.5px solid #e8ddd8; color: #9a7060;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .mp-btn-cancel:hover { border-color: #a84a4a; color: #a84a4a; }

  .mp-edit-actions { display: flex; gap: 0.5rem; }

  /* ── View mode info grid ── */
  .mp-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 2rem; }
  @media (max-width: 600px) { .mp-info-grid { grid-template-columns: 1fr; } }

  .mp-info-item {
    padding: 0.55rem 0; border-bottom: 1px solid #faf3ef;
    display: flex; flex-direction: column; gap: 2px;
  }
  .mp-info-label { font-size: 0.7rem; color: #b09080; text-transform: uppercase; letter-spacing: 0.06em; }
  .mp-info-value { font-size: 0.84rem; color: #2d1810; font-weight: 500; }

  /* About text block */
  .mp-about-text {
    font-size: 0.88rem; color: #4a3028; line-height: 1.75;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border-radius: 12px; padding: 1.1rem 1.25rem;
    margin-bottom: 1.25rem; border-left: 3px solid #c9856a;
  }

  /* Interest / language chips */
  .mp-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .mp-chip {
    background: #fdf0e8; color: #8b4e2e;
    font-size: 0.76rem; font-weight: 500;
    padding: 0.3rem 0.75rem; border-radius: 99px;
    border: 1px solid #f0ddd5;
  }
  .mp-chip.lang { background: #edf5fd; color: #3a6ea8; border-color: #c8ddf0; }

  /* ── Edit mode form elements ── */
  .mp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1rem; }
  @media (max-width: 600px) { .mp-form-grid { grid-template-columns: 1fr; } }
  .mp-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
  @media (max-width: 600px) { .mp-form-grid-3 { grid-template-columns: 1fr; } }

  .mp-form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.75rem; }
  .mp-form-label {
    font-size: 0.72rem; font-weight: 500; color: #6b4a3a;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .mp-input {
    padding: 0.6rem 0.9rem; border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.84rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s;
    width: 100%;
  }
  .mp-input:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .mp-input::placeholder { color: #c4b0a5; }

  .mp-textarea {
    padding: 0.65rem 0.9rem; border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.84rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif; outline: none; resize: vertical; transition: all 0.2s;
    width: 100%;
  }
  .mp-textarea:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .mp-textarea::placeholder { color: #c4b0a5; }

  .mp-select {
    padding: 0.6rem 2rem 0.6rem 0.9rem; border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.84rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif; outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%23c9856a' d='M0 0l5 7 5-7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.75rem center;
    transition: all 0.2s; width: 100%;
  }
  .mp-select:focus { border-color: #c9856a; background-color: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }

  .mp-range-label { font-size: 0.74rem; color: #9a7060; margin-bottom: 0.2rem; }
  input[type=range] { width: 100%; accent-color: #8b4e2e; }

  /* Chip picker (interests/languages) */
  .mp-chip-picker {
    display: flex; flex-wrap: wrap; gap: 0.35rem;
    border: 1.5px solid #e8ddd8; border-radius: 12px;
    padding: 0.65rem; background: #fdf8f5;
    max-height: 140px; overflow-y: auto;
  }
  .mp-chip-picker::-webkit-scrollbar { width: 3px; }
  .mp-chip-picker::-webkit-scrollbar-thumb { background: #e8c9b8; border-radius: 99px; }
  .mp-chip-option {
    padding: 0.25rem 0.65rem; border-radius: 99px; font-size: 0.74rem;
    border: 1.5px solid #e8ddd8; color: #6b4a3a; background: #fff;
    cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .mp-chip-option:hover { border-color: #c9856a; }
  .mp-chip-option.sel { background: linear-gradient(135deg, #3d1f12, #8b4e2e); color: #fff; border-color: transparent; }

  .mp-field-note { font-size: 0.69rem; color: #b09080; margin-top: 0.25rem; }

  /* ── Photos tab ── */
  .mp-photos-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 2rem; border-bottom: 1px solid #f5ede8;
  }
  .mp-photos-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 600; color: #2d1810;
  }
  .mp-btn-add-photo {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1.1rem; border-radius: 99px;
    font-size: 0.8rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(139,78,46,0.22);
    transition: all 0.2s;
  }
  .mp-btn-add-photo:hover { transform: translateY(-1px); }

  .mp-photos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; padding: 1.5rem 2rem; }
  @media (max-width: 560px) { .mp-photos-grid { grid-template-columns: 1fr 1fr; } }

  .mp-photo-item {
    position: relative; border-radius: 14px; overflow: hidden;
    aspect-ratio: 1; background: #f5ede8;
  }
  .mp-photo-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
  .mp-photo-item:hover .mp-photo-img { transform: scale(1.05); }
  .mp-photo-overlay {
    position: absolute; inset: 0;
    background: rgba(20,6,2,0.5);
    opacity: 0; transition: opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .mp-photo-item:hover .mp-photo-overlay { opacity: 1; }
  .mp-photo-btn {
    width: 34px; height: 34px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .mp-photo-btn.primary { background: #fdf0e8; color: #8b4e2e; }
  .mp-photo-btn.primary:hover { background: #e8c97a; }
  .mp-photo-btn.remove { background: #fde8e8; color: #a84a4a; }
  .mp-photo-btn.remove:hover { background: #a84a4a; color: #fff; }
  .mp-photo-primary-badge {
    position: absolute; top: 0.5rem; left: 0.5rem;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; font-size: 0.64rem; font-weight: 600;
    padding: 0.2rem 0.55rem; border-radius: 99px;
  }

  .mp-photos-empty {
    grid-column: 1/-1; text-align: center;
    padding: 3.5rem 2rem; border: 2px dashed #f0ddd5; border-radius: 16px;
  }
  .mp-photos-empty-icon {
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.85rem;
  }
  .mp-photos-empty h4 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 600; color: #2d1810; margin-bottom: 0.35rem;
  }
  .mp-photos-empty p { font-size: 0.8rem; color: #9a7060; margin-bottom: 1rem; }
  .mp-photos-note { font-size: 0.73rem; color: #b09080; line-height: 1.6; padding: 0 2rem 1.5rem; }

  /* ── Privacy tab ── */
  .mp-privacy-section {
    background: linear-gradient(135deg, #fdf5ee, #fdf8f4);
    border: 1px solid #f0ddd5; border-radius: 14px;
    padding: 1.25rem 1.5rem; margin-bottom: 1rem;
  }
  .mp-privacy-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #2d1810;
    margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;
  }
  .mp-privacy-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #f5ede8;
  }
  .mp-privacy-row:last-child { border-bottom: none; }
  .mp-privacy-row-label { font-size: 0.85rem; font-weight: 500; color: #2d1810; }
  .mp-privacy-row-sub { font-size: 0.73rem; color: #9a7060; margin-top: 2px; }

  /* Toggle switch */
  .mp-toggle { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
  .mp-toggle input { opacity: 0; width: 0; height: 0; }
  .mp-toggle-slider {
    position: absolute; inset: 0; background: #e8ddd8; border-radius: 99px;
    cursor: pointer; transition: background 0.2s;
  }
  .mp-toggle-slider::before {
    content: ''; position: absolute;
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    left: 3px; top: 3px; transition: transform 0.2s;
  }
  .mp-toggle input:checked + .mp-toggle-slider { background: linear-gradient(135deg, #8b4e2e, #c9856a); }
  .mp-toggle input:checked + .mp-toggle-slider::before { transform: translateX(20px); }

  .mp-privacy-select {
    padding: 0.45rem 2rem 0.45rem 0.75rem;
    border: 1.5px solid #e8ddd8; border-radius: 8px;
    font-size: 0.78rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif; appearance: none; outline: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath fill='%23c9856a' d='M0 0l5 7 5-7z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.6rem center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .mp-privacy-select:focus { border-color: #c9856a; }

  /* ── Image upload modal ── */
  .mp-modal-overlay {
    position: fixed; inset: 0; background: rgba(10,3,1,0.7);
    backdrop-filter: blur(4px); z-index: 50;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .mp-modal {
    background: #fff; border-radius: 22px;
    max-width: 460px; width: 100%;
    box-shadow: 0 24px 64px rgba(30,8,2,0.28);
    animation: mp-modal-in 0.2s ease;
    overflow: hidden;
  }
  @keyframes mp-modal-in { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }

  .mp-modal-head {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.25rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .mp-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #fff;
  }
  .mp-modal-close {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(255,255,255,0.15); border: none;
    color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .mp-modal-close:hover { background: rgba(255,255,255,0.28); }

  .mp-modal-body { padding: 1.5rem; }
  .mp-upload-zone {
    border: 2px dashed #e8ddd8; border-radius: 14px;
    height: 200px; display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; cursor: pointer; transition: all 0.2s;
    background: #fdf8f5; margin-bottom: 1.25rem;
  }
  .mp-upload-zone:hover { border-color: #c9856a; background: #fffbf8; }
  .mp-upload-zone input {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .mp-upload-preview { width: 100%; height: 100%; object-fit: contain; display: block; }
  .mp-upload-placeholder { text-align: center; pointer-events: none; }
  .mp-upload-placeholder-icon {
    width: 50px; height: 50px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 0.65rem;
  }
  .mp-upload-placeholder p { font-size: 0.82rem; color: #9a7060; }
  .mp-upload-placeholder span { font-size: 0.72rem; color: #b09080; }

  .mp-modal-footer { display: flex; justify-content: flex-end; gap: 0.65rem; }
  .mp-btn-upload {
    padding: 0.6rem 1.5rem; border-radius: 99px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; cursor: pointer;
    font-size: 0.84rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(139,78,46,0.24); transition: all 0.2s;
  }
  .mp-btn-upload:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
  .mp-btn-upload:hover:not(:disabled) { transform: translateY(-1px); }

  /* ── Ornament ── */
  .mp-ornament {
    text-align: center; font-size: 0.72rem; color: #d4b8a8;
    letter-spacing: 0.15em; padding: 1.5rem 0 0;
  }

  @media (max-width: 640px) {
    .mp-root { padding: 1.25rem 1rem 4rem; }
    .mp-avatar-row { padding: 0 1.25rem 1.25rem; margin-top: -44px; }
    .mp-section-body { padding: 0 1.25rem 1.5rem; }
    .mp-section-toggle { padding: 1rem 1.25rem; }
    .mp-tabs-nav { padding: 0 0.75rem; }
    .mp-photos-grid { padding: 1.25rem; }
    .mp-photos-header { padding: 1.25rem; }
    .mp-photos-note { padding: 0 1.25rem 1.25rem; }
  }
`;

const MyProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("about");
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({ ...user });
  const [expandedSections, setExpandedSections] = useState(["basic"]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user) setFormData({ ...user });
  }, [user]);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await ProfileService.getMyProfile();
        if (res.success) setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadProfile();
  }, [setUser]);

  if (!user) return (
    <div style={{ padding: "4rem", textAlign: "center", fontFamily: "'DM Sans', sans-serif", color: "#8b4e2e" }}>
      <Sparkles className="spinning" /> Loading your story...
    </div>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleArrayChange = (field, value) => {
    const cur = formData[field] || [];
    setFormData(prev => ({
      ...prev,
      [field]: cur.includes(value) ? cur.filter(i => i !== value) : [...cur, value],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const mappedData = { ...formData };
      const mapEnum = (val) => val ? val.toUpperCase().replace(/\s+/g, '_') : null;
      if (mappedData.maritalStatus) mappedData.maritalStatus = mapEnum(mappedData.maritalStatus);
      if (mappedData.religion) mappedData.religion = mapEnum(mappedData.religion);
      if (mappedData.ethnicity) mappedData.ethnicity = mapEnum(mappedData.ethnicity);
      if (mappedData.education) mappedData.education = mapEnum(mappedData.education);
      if (mappedData.gender) mappedData.gender = mapEnum(mappedData.gender);
      if (mappedData.bodyType) mappedData.bodyType = mapEnum(mappedData.bodyType);
      if (mappedData.complexion) mappedData.complexion = mapEnum(mappedData.complexion);
      if (mappedData.smoking) mappedData.smoking = mapEnum(mappedData.smoking);
      if (mappedData.drinking) mappedData.drinking = mapEnum(mappedData.drinking);
      if (mappedData.dietaryPreferences) mappedData.dietaryPreferences = mapEnum(mappedData.dietaryPreferences);
      const res = await ProfileService.updateProfile(mappedData);
      if (res.success) {
        setUser(res.data);
        setEditMode(null);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to save changes. Please check your internet connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setEditMode(null);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const [currentFile, setCurrentFile] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (previewImage && currentFile) {
      setIsSaving(true);
      try {
        const res = await ProfileService.uploadProfileImage(currentFile, (user.profileImages || []).length === 0);
        if (res.success) {
          setUser(res.data);
          setShowImageUpload(false);
          setPreviewImage(null);
          setCurrentFile(null);
        }
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Image upload failed.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  /* ── Cover render — adaptive collage ── */
  const renderCover = () => {
    const images = user.profileImages || [];
    const MAX_VISIBLE = 6;

    if (images.length === 0) {
      return <div className="mp-cover-shimmer" />;
    }

    const visibleCount = Math.min(images.length, MAX_VISIBLE);
    const extraCount = images.length > MAX_VISIBLE ? images.length - MAX_VISIBLE + 1 : 0;
    const showCount = extraCount > 0 ? MAX_VISIBLE - 1 : visibleCount;

    return (
      <div
        className="mp-cover-collage"
        data-count={Math.min(visibleCount, 6)}
      >
        {images.slice(0, showCount).map((img, idx) => (
          <div key={idx} className="mp-col-item">
            <img src={getProfileImage(img)} alt="" />
          </div>
        ))}
        {extraCount > 0 && (
          <div className="mp-col-item">
            <img src={images[showCount]} alt="" />
            <div className="mp-col-more-badge">+{extraCount}</div>
          </div>
        )}
      </div>
    );
  };

  /* ── Edit button group ── */
  const EditButtons = ({ section }) =>
    editMode === section ? (
      <div className="mp-edit-actions">
        <button className="mp-btn-save" onClick={handleSave}><Save size={12} />Save</button>
        <button className="mp-btn-cancel" onClick={handleCancel}><X size={12} />Cancel</button>
      </div>
    ) : (
      <button className="mp-btn-edit" onClick={() => setEditMode(section)}>
        <Edit3 size={12} />Edit
      </button>
    );

  /* ── Accordion header ── */
  const SectionToggle = ({ label, section, icon: Icon }) => (
    <button className="mp-section-toggle" onClick={() => toggleSection(section)}>
      <div className="mp-section-toggle-left">
        <div className="mp-section-icon"><Icon size={16} style={{ color: "#8b4e2e" }} /></div>
        <span className="mp-section-title">{label}</span>
      </div>
      {expandedSections.includes(section)
        ? <ChevronUp size={16} style={{ color: "#9a7060" }} />
        : <ChevronDown size={16} style={{ color: "#9a7060" }} />}
    </button>
  );

  const isOpen = (s) => expandedSections.includes(s);

  const TABS = [
    { key: "about", label: "About", icon: User },
    { key: "photos", label: "Photos", icon: ImageIcon },
    { key: "preferences", label: "Preferences", icon: Target },
    { key: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="mp-root">
        <div className="mp-inner">

          <button className="mp-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>

          {/* ── Hero Card ── */}
          <div className="mp-hero-card">

            {/* Cover */}
            <div className="mp-cover">
              {renderCover()}
              <div className="mp-cover-overlay" />
              <button className="mp-cover-cam" onClick={() => setActiveTab("photos")}>
                <Camera size={15} />
              </button>
            </div>

            {/* Avatar row */}
            <div className="mp-avatar-row">
              <div className="mp-avatar-wrap">
                {user.primaryImageUrl || (user.profileImages || [])[0]
                  ? <img src={getProfileImage(user.primaryImageUrl || user.profileImages[0])} alt="Profile" className="mp-avatar" />
                  : <div className="mp-avatar-ph"><User size={36} style={{ color: "#9a7060" }} /></div>}
                <button className="mp-avatar-cam" onClick={() => setActiveTab("photos")}>
                  <Camera size={13} />
                </button>
              </div>

              <div className="mp-name-block">
                <div className="mp-profile-name">{user.firstName} {user.lastName}</div>
                <div className="mp-profile-meta">
                  {user.city && user.district && (
                    <span className="mp-profile-meta-item"><MapPin size={11} />{user.city}, {user.district}</span>
                  )}
                  {user.profession && (
                    <span className="mp-profile-meta-item"><Briefcase size={11} />{user.profession}</span>
                  )}
                  {user.dateOfBirth && (
                    <span className="mp-profile-meta-item"><User size={11} />{calculateAge(user.dateOfBirth)} years</span>
                  )}
                </div>
              </div>

              <div className="mp-hero-actions">
                <Link to="/settings" className="mp-btn-settings">
                  <Settings size={13} /> Settings
                </Link>
                <button className="mp-btn-edit-profile" onClick={() => { setEditMode("basic"); setExpandedSections(["basic"]); setActiveTab("about"); }}>
                  <Edit3 size={13} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Tabs */}
            <nav className="mp-tabs-nav">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} className={`mp-tab-btn${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>
                  <Icon size={13} />{label}
                </button>
              ))}
            </nav>
          </div>

          {/* ── Content Card ── */}
          <div className="mp-content-card">

            {/* ── ABOUT TAB ── */}
            {activeTab === "about" && (
              <>
                {/* Basic Information */}
                <div className="mp-section">
                  <SectionToggle label="Basic Information" section="basic" icon={User} />
                  {isOpen("basic") && (
                    <div className="mp-section-body">
                      <div className="mp-section-head-row">
                        <span className="mp-subsection-label">Personal Details</span>
                        <EditButtons section="basic" />
                      </div>
                      {editMode === "basic" ? (
                        <>
                          <div className="mp-form-grid">
                            <div className="mp-form-group">
                              <label className="mp-form-label">First Name</label>
                              <input className="mp-input" type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Last Name</label>
                              <input className="mp-input" type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Date of Birth</label>
                              <input className="mp-input" type="date" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleChange} />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Gender</label>
                              <select className="mp-select" name="gender" value={formData.gender || ""} onChange={handleChange}>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Marital Status</label>
                              <select className="mp-select" name="maritalStatus" value={formData.maritalStatus || ""} onChange={handleChange}>
                                <option value="">Select status</option>
                                {(PROFILE_OPTIONS.maritalStatus || []).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Children</label>
                              <select className="mp-select" value={formData.hasChildren !== undefined ? String(formData.hasChildren) : ""} onChange={e => setFormData(p => ({ ...p, hasChildren: e.target.value === "true" }))}>
                                <option value="">Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="mp-info-grid">
                          {[
                            ["Full Name", `${user.firstName} ${user.lastName}`],
                            ["Gender", user.gender],
                            ["Date of Birth", user.dateOfBirth ? `${new Date(user.dateOfBirth).toLocaleDateString("en-LK")} (${calculateAge(user.dateOfBirth)} yrs)` : null],
                            ["Marital Status", user.maritalStatus],
                            ["Email", user.email],
                            ["Children", user.hasChildren !== undefined ? (user.hasChildren ? "Yes" : "No") : null],
                          ].map(([label, value]) => (
                            <div key={label} className="mp-info-item">
                              <span className="mp-info-label">{label}</span>
                              <span className="mp-info-value" style={{ textTransform: "capitalize" }}>{value || "Not specified"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Location & Background */}
                <div className="mp-section">
                  <SectionToggle label="Location & Background" section="location" icon={MapPin} />
                  {isOpen("location") && (
                    <div className="mp-section-body">
                      <div className="mp-section-head-row">
                        <span className="mp-subsection-label">Where You Live</span>
                        <EditButtons section="location" />
                      </div>
                      {editMode === "location" ? (
                        <>
                          <div className="mp-form-grid">
                            <div className="mp-form-group">
                              <label className="mp-form-label">District</label>
                              <select className="mp-select" name="district" value={formData.district || ""} onChange={handleChange}>
                                <option value="">Select district</option>
                                {(PROFILE_OPTIONS.districts || []).map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">City</label>
                              <input className="mp-input" type="text" name="city" value={formData.city || ""} onChange={handleChange} placeholder="e.g. Colombo" />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Place of Birth</label>
                              <input className="mp-input" type="text" name="placeOfBirth" value={formData.placeOfBirth || ""} onChange={handleChange} placeholder="e.g. Kandy" />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Ethnicity</label>
                              <select className="mp-select" name="ethnicity" value={formData.ethnicity || ""} onChange={handleChange}>
                                <option value="">Select ethnicity</option>
                                {(PROFILE_OPTIONS.ethnicity || []).map(e => <option key={e} value={e}>{e}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Religion</label>
                              <select className="mp-select" name="religion" value={formData.religion || ""} onChange={handleChange}>
                                <option value="">Select religion</option>
                                {(PROFILE_OPTIONS.religion || []).map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Religious Practices</label>
                            <textarea className="mp-textarea" rows={2} name="religiousPractices" value={formData.religiousPractices || ""} onChange={handleChange} placeholder="e.g. Regular temple visits, daily prayers" />
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Languages Spoken</label>
                            <div className="mp-chip-picker">
                              {(PROFILE_OPTIONS.languages || []).map(l => (
                                <button key={l} type="button" className={`mp-chip-option${(formData.languages || []).includes(l) ? " sel" : ""}`} onClick={() => handleArrayChange("languages", l)}>{l}</button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mp-info-grid" style={{ marginBottom: "1rem" }}>
                            {[
                              ["Current Location", user.city && user.district ? `${user.city}, ${user.district}` : null],
                              ["Religion", user.religion],
                              ["Place of Birth", user.placeOfBirth],
                              ["Religious Practices", user.religiousPractices],
                              ["Ethnicity", user.ethnicity],
                            ].map(([label, value]) => (
                              <div key={label} className="mp-info-item">
                                <span className="mp-info-label">{label}</span>
                                <span className="mp-info-value">{value || "Not specified"}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mp-info-label" style={{ marginBottom: "0.5rem" }}>Languages</div>
                          <div className="mp-chips">
                            {(user.languages || []).length > 0
                              ? user.languages.map((l, i) => <span key={i} className="mp-chip lang">{l}</span>)
                              : <span style={{ fontSize: "0.82rem", color: "#9a7060" }}>Not specified</span>}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Education & Career */}
                <div className="mp-section">
                  <SectionToggle label="Education & Career" section="career" icon={GraduationCap} />
                  {isOpen("career") && (
                    <div className="mp-section-body">
                      <div className="mp-section-head-row">
                        <span className="mp-subsection-label">Professional Background</span>
                        <EditButtons section="career" />
                      </div>
                      {editMode === "career" ? (
                        <>
                          <div className="mp-form-grid">
                            <div className="mp-form-group">
                              <label className="mp-form-label">Education Level</label>
                              <select className="mp-select" name="education" value={formData.education || ""} onChange={handleChange}>
                                <option value="">Select level</option>
                                {(PROFILE_OPTIONS.education || []).map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Field of Study</label>
                              <input className="mp-input" type="text" name="fieldOfStudy" value={formData.fieldOfStudy || ""} onChange={handleChange} placeholder="e.g. Computer Science" />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Profession</label>
                              <input className="mp-input" type="text" name="profession" value={formData.profession || ""} onChange={handleChange} placeholder="e.g. Software Engineer" />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Industry</label>
                              <select className="mp-select" name="industry" value={formData.industry || ""} onChange={handleChange}>
                                <option value="">Select industry</option>
                                {(PROFILE_OPTIONS.industries || []).map(i => <option key={i} value={i}>{i}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Employer</label>
                              <input className="mp-input" type="text" name="employer" value={formData.employer || ""} onChange={handleChange} placeholder="e.g. ABC Company" />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Work Location</label>
                              <input className="mp-input" type="text" name="workLocation" value={formData.workLocation || ""} onChange={handleChange} placeholder="e.g. Colombo, Remote" />
                            </div>
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Monthly Income (LKR)</label>
                            <select className="mp-select" name="income" value={formData.income || ""} onChange={handleChange}>
                              <option value="">Select income range</option>
                              {(PROFILE_OPTIONS.incomeRanges || []).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <p className="mp-field-note">Income information is kept private and used only for matching.</p>
                          </div>
                        </>
                      ) : (
                        <div className="mp-info-grid">
                          {[
                            ["Education", user.education],
                            ["Field of Study", user.fieldOfStudy],
                            ["Profession", user.profession],
                            ["Industry", user.industry],
                            ["Employer", user.employer],
                            ["Work Location", user.workLocation],
                            ["Income Range", user.income],
                          ].map(([label, value]) => (
                            <div key={label} className="mp-info-item">
                              <span className="mp-info-label">{label}</span>
                              <span className="mp-info-value">{value || "Not specified"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Physical & Lifestyle */}
                <div className="mp-section">
                  <SectionToggle label="Physical Appearance & Lifestyle" section="lifestyle" icon={Activity} />
                  {isOpen("lifestyle") && (
                    <div className="mp-section-body">
                      <div className="mp-section-head-row">
                        <span className="mp-subsection-label">Physical & Habits</span>
                        <EditButtons section="lifestyle" />
                      </div>
                      {editMode === "lifestyle" ? (
                        <>
                          <div className="mp-form-grid-3" style={{ marginBottom: "0.75rem" }}>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Height (cm)</label>
                              <input className="mp-input" type="number" name="height" min="140" max="220" value={formData.height || ""} onChange={handleChange} placeholder="e.g. 170" />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Body Type</label>
                              <select className="mp-select" name="bodyType" value={formData.bodyType || ""} onChange={handleChange}>
                                <option value="">Select</option>
                                {(PROFILE_OPTIONS.bodyType || []).map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Complexion</label>
                              <select className="mp-select" name="complexion" value={formData.complexion || ""} onChange={handleChange}>
                                <option value="">Select</option>
                                {(PROFILE_OPTIONS.complexion || []).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="mp-form-grid">
                            <div className="mp-form-group">
                              <label className="mp-form-label">Smoking</label>
                              <select className="mp-select" name="smoking" value={formData.smoking || ""} onChange={handleChange}>
                                <option value="">Select</option>
                                {(PROFILE_OPTIONS.smoking || []).map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Drinking</label>
                              <select className="mp-select" name="drinking" value={formData.drinking || ""} onChange={handleChange}>
                                <option value="">Select</option>
                                {(PROFILE_OPTIONS.drinking || []).map(h => <option key={h} value={h}>{h}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Dietary Preferences</label>
                              <select className="mp-select" name="dietaryPreferences" value={formData.dietaryPreferences || ""} onChange={handleChange}>
                                <option value="">Select</option>
                                {(PROFILE_OPTIONS.dietary || []).map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Health & Fitness Habits</label>
                            <textarea className="mp-textarea" rows={2} name="healthHabits" value={formData.healthHabits || ""} onChange={handleChange} placeholder="e.g. Regular gym, yoga, balanced diet" />
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Lifestyle Description</label>
                            <textarea className="mp-textarea" rows={2} name="lifestyle" value={formData.lifestyle || ""} onChange={handleChange} placeholder="e.g. Early riser, enjoys outdoors" />
                          </div>
                        </>
                      ) : (
                        <div className="mp-info-grid">
                          {[
                            ["Height", user.height ? `${user.height} cm` : null],
                            ["Body Type", user.bodyType],
                            ["Complexion", user.complexion],
                            ["Smoking", user.smoking],
                            ["Drinking", user.drinking],
                            ["Dietary Preferences", user.dietaryPreferences],
                            ["Health & Fitness", user.healthHabits],
                            ["Lifestyle", user.lifestyle],
                          ].map(([label, value]) => (
                            <div key={label} className="mp-info-item">
                              <span className="mp-info-label">{label}</span>
                              <span className="mp-info-value">{value || "Not specified"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cultural & Family */}
                <div className="mp-section">
                  <SectionToggle label="Cultural & Family Aspects" section="cultural" icon={Users} />
                  {isOpen("cultural") && (
                    <div className="mp-section-body">
                      <div className="mp-section-head-row">
                        <span className="mp-subsection-label">Family & Cultural Background</span>
                        <EditButtons section="cultural" />
                      </div>
                      {editMode === "cultural" ? (
                        <>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Family Background</label>
                            <textarea className="mp-textarea" rows={2} name="familyBackground" value={formData.familyBackground || ""} onChange={handleChange} placeholder="e.g. Parents (father - businessman, mother - teacher), two siblings" />
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Cultural Values</label>
                            <textarea className="mp-textarea" rows={2} name="culturalValues" value={formData.culturalValues || ""} onChange={handleChange} placeholder="e.g. Traditional values, respects elders" />
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Family Involvement</label>
                            <textarea className="mp-textarea" rows={2} name="familyInvolvement" value={formData.familyInvolvement || ""} onChange={handleChange} placeholder="e.g. Close with family, weekly gatherings" />
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Wedding Preferences</label>
                            <textarea className="mp-textarea" rows={2} name="weddingPreferences" value={formData.weddingPreferences || ""} onChange={handleChange} placeholder="e.g. Traditional Buddhist ceremony" />
                          </div>
                          <div className="mp-form-grid">
                            <div className="mp-form-group">
                              <label className="mp-form-label">Horoscope Sign</label>
                              <select className="mp-select" name="horoscopeSign" value={formData.horoscopeSign || ""} onChange={handleChange}>
                                <option value="">Select sign</option>
                                {(PROFILE_OPTIONS.horoscope || []).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Horoscope Details</label>
                              <textarea className="mp-textarea" rows={2} name="horoscopeDetails" value={formData.horoscopeDetails || ""} onChange={handleChange} placeholder="e.g. Moon in 7th house" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="mp-info-grid">
                          {[
                            ["Family Background", user.familyBackground],
                            ["Cultural Values", user.culturalValues],
                            ["Family Involvement", user.familyInvolvement],
                            ["Wedding Preferences", user.weddingPreferences],
                            ["Horoscope", user.horoscope?.sign ? `${user.horoscope.sign} — ${user.horoscope.details || ""}` : user.horoscopeSign],
                          ].map(([label, value]) => (
                            <div key={label} className="mp-info-item">
                              <span className="mp-info-label">{label}</span>
                              <span className="mp-info-value">{value || "Not specified"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* About & Interests */}
                <div className="mp-section">
                  <SectionToggle label="About Me & Interests" section="about-interests" icon={Sparkles} />
                  {isOpen("about-interests") && (
                    <div className="mp-section-body">
                      <div className="mp-section-head-row">
                        <span className="mp-subsection-label">Personal Story & Hobbies</span>
                        <EditButtons section="about-interests" />
                      </div>
                      {editMode === "about-interests" ? (
                        <>
                          <div className="mp-form-group">
                            <label className="mp-form-label">About Me</label>
                            <textarea className="mp-textarea" rows={4} name="about" value={formData.about || ""} onChange={handleChange} placeholder="Tell potential matches about yourself…" />
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Interests & Hobbies</label>
                            <div className="mp-chip-picker">
                              {(PROFILE_OPTIONS.interests || []).map(interest => (
                                <button key={interest} type="button" className={`mp-chip-option${(formData.interests || []).includes(interest) ? " sel" : ""}`} onClick={() => handleArrayChange("interests", interest)}>{interest}</button>
                              ))}
                            </div>
                          </div>
                          <div className="mp-form-grid">
                            <div className="mp-form-group">
                              <label className="mp-form-label">Favourite Food</label>
                              <input className="mp-input" type="text" value={(formData.favoriteThings || {}).food || ""} onChange={e => handleNestedChange("favoriteThings", "food", e.target.value)} placeholder="e.g. Rice and curry" />
                            </div>
                            <div className="mp-form-group">
                              <label className="mp-form-label">Favourite Movies / Shows</label>
                              <input className="mp-input" type="text" value={(formData.favoriteThings || {}).movies || ""} onChange={e => handleNestedChange("favoriteThings", "movies", e.target.value)} placeholder="e.g. Drama, documentaries" />
                            </div>
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Travel Preferences</label>
                            <textarea className="mp-textarea" rows={2} name="travelPreferences" value={formData.travelPreferences || ""} onChange={handleChange} placeholder="e.g. Enjoys both local and international travel" />
                          </div>
                          <div className="mp-form-group">
                            <label className="mp-form-label">Personality Traits</label>
                            <input className="mp-input" type="text" name="personalityTraits" value={formData.personalityTraits || ""} onChange={handleChange} placeholder="e.g. Patient, kind, organised" />
                          </div>
                        </>
                      ) : (
                        <>
                          {user.about && <p className="mp-about-text">"{user.about}"</p>}
                          <div className="mp-info-label" style={{ marginBottom: "0.5rem" }}>Interests & Hobbies</div>
                          <div className="mp-chips" style={{ marginBottom: "1.25rem" }}>
                            {(user.interests || []).length > 0
                              ? user.interests.map((it, i) => <span key={i} className="mp-chip">{it}</span>)
                              : <span style={{ fontSize: "0.82rem", color: "#9a7060" }}>Not specified</span>}
                          </div>
                          <div className="mp-info-grid">
                            {[
                              ["Favourite Food", (user.favoriteThings || {}).food],
                              ["Favourite Movies", (user.favoriteThings || {}).movies],
                              ["Travel Preferences", user.travelPreferences],
                              ["Personality Traits", user.personalityTraits],
                            ].map(([label, value]) => (
                              <div key={label} className="mp-info-item">
                                <span className="mp-info-label">{label}</span>
                                <span className="mp-info-value">{value || "Not specified"}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── PHOTOS TAB ── */}
            {activeTab === "photos" && (
              <>
                <div className="mp-photos-header">
                  <div className="mp-photos-title">My Photos</div>
                  <button className="mp-btn-add-photo" onClick={() => setShowImageUpload(true)}>
                    <Plus size={13} /> Add Photo
                  </button>
                </div>

                <div className="mp-photos-grid">
                  {(user.profileImages || []).length === 0 ? (
                    <div className="mp-photos-empty">
                      <div className="mp-photos-empty-icon"><ImageIcon size={24} style={{ color: "#c9856a" }} /></div>
                      <h4>No photos yet</h4>
                      <p>Add photos to attract more potential matches</p>
                      <button className="mp-btn-add-photo" onClick={() => setShowImageUpload(true)}>
                        <Plus size={13} /> Add Your First Photo
                      </button>
                    </div>
                  ) : (
                    (user.profileImages || []).map((img, i) => (
                      <div key={i} className="mp-photo-item">
                        <img src={img} alt={`Photo ${i + 1}`} className="mp-photo-img" />
                        <div className="mp-photo-overlay">
                          <button
                            className="mp-photo-btn primary"
                            title="Set as primary"
                            disabled={isSaving}
                            onClick={async () => {
                              setIsSaving(true);
                              try {
                                const res = await ProfileService.setPrimaryImage(img);
                                if (res.success) setUser(res.data);
                              } catch (err) { console.error(err); }
                              finally { setIsSaving(false); }
                            }}
                          >
                            <Star size={14} />
                          </button>
                          <button
                            className="mp-photo-btn remove"
                            title="Remove"
                            disabled={isSaving}
                            onClick={async () => {
                              if (!window.confirm("Remove this photo?")) return;
                              setIsSaving(true);
                              try {
                                const res = await ProfileService.deleteImage(img);
                                if (res.success) setUser(res.data);
                              } catch (err) { console.error(err); }
                              finally { setIsSaving(false); }
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {user.primaryImageUrl === img && <div className="mp-photo-primary-badge">Primary</div>}
                      </div>
                    ))
                  )}
                </div>
                <p className="mp-photos-note">
                  Upload up to 6 photos · Primary photo appears in search results · Clear, well-lit photos attract more interest
                </p>
              </>
            )}

            {/* ── PREFERENCES TAB ── */}
            {activeTab === "preferences" && (
              <div style={{ padding: "1.75rem 2rem" }}>
                <div className="mp-section-head-row" style={{ paddingTop: 0 }}>
                  <span className="mp-subsection-label">Partner Preferences</span>
                  <EditButtons section="preferences" />
                </div>

                {editMode === "preferences" ? (
                  <>
                    <div className="mp-form-group">
                      <label className="mp-form-label">Partner Age Range</label>
                      <div className="mp-form-grid">
                        <div>
                          <p className="mp-range-label">Min: {(formData.partnerPreferences?.ageRange || [18, 60])[0]} yrs</p>
                          <input type="range" min="18" max="60" value={(formData.partnerPreferences?.ageRange || [18, 60])[0]} onChange={e => { const v = +e.target.value; const cur = formData.partnerPreferences?.ageRange || [18, 60]; handleNestedChange("partnerPreferences", "ageRange", [v, Math.max(v, cur[1])]); }} />
                        </div>
                        <div>
                          <p className="mp-range-label">Max: {(formData.partnerPreferences?.ageRange || [18, 60])[1]} yrs</p>
                          <input type="range" min="18" max="60" value={(formData.partnerPreferences?.ageRange || [18, 60])[1]} onChange={e => { const v = +e.target.value; const cur = formData.partnerPreferences?.ageRange || [18, 60]; handleNestedChange("partnerPreferences", "ageRange", [Math.min(v, cur[0]), v]); }} />
                        </div>
                      </div>
                    </div>
                    <div className="mp-form-group">
                      <label className="mp-form-label">Partner Height Range (cm)</label>
                      <div className="mp-form-grid">
                        <div>
                          <p className="mp-range-label">Min: {(formData.partnerPreferences?.heightPreference || [150, 180])[0]} cm</p>
                          <input type="range" min="140" max="200" value={(formData.partnerPreferences?.heightPreference || [150, 180])[0]} onChange={e => { const v = +e.target.value; const cur = formData.partnerPreferences?.heightPreference || [150, 180]; handleNestedChange("partnerPreferences", "heightPreference", [v, Math.max(v, cur[1])]); }} />
                        </div>
                        <div>
                          <p className="mp-range-label">Max: {(formData.partnerPreferences?.heightPreference || [150, 180])[1]} cm</p>
                          <input type="range" min="140" max="200" value={(formData.partnerPreferences?.heightPreference || [150, 180])[1]} onChange={e => { const v = +e.target.value; const cur = formData.partnerPreferences?.heightPreference || [150, 180]; handleNestedChange("partnerPreferences", "heightPreference", [Math.min(v, cur[0]), v]); }} />
                        </div>
                      </div>
                    </div>
                    <div className="mp-form-grid">
                      <div className="mp-form-group">
                        <label className="mp-form-label">Location Preference</label>
                        <input className="mp-input" type="text" value={(formData.partnerPreferences || {}).locationPreference || ""} onChange={e => handleNestedChange("partnerPreferences", "locationPreference", e.target.value)} placeholder="e.g. Colombo or willing to relocate" />
                      </div>
                      <div className="mp-form-group">
                        <label className="mp-form-label">Education Preference</label>
                        <input className="mp-input" type="text" value={(formData.partnerPreferences || {}).educationLevel || ""} onChange={e => handleNestedChange("partnerPreferences", "educationLevel", e.target.value)} placeholder="e.g. Bachelor's or higher" />
                      </div>
                      <div className="mp-form-group">
                        <label className="mp-form-label">Religion Preference</label>
                        <input className="mp-input" type="text" value={(formData.partnerPreferences || {}).religionPreference || ""} onChange={e => handleNestedChange("partnerPreferences", "religionPreference", e.target.value)} placeholder="e.g. Buddhist, Open to all" />
                      </div>
                      <div className="mp-form-group">
                        <label className="mp-form-label">Marital Status Preference</label>
                        <input className="mp-input" type="text" value={(formData.partnerPreferences || {}).maritalStatusPreference || ""} onChange={e => handleNestedChange("partnerPreferences", "maritalStatusPreference", e.target.value)} placeholder="e.g. Never married" />
                      </div>
                    </div>
                    <div className="mp-form-group">
                      <label className="mp-form-label">Lifestyle Compatibility</label>
                      <textarea className="mp-textarea" rows={2} value={(formData.partnerPreferences || {}).lifestyleCompatibility || ""} onChange={e => handleNestedChange("partnerPreferences", "lifestyleCompatibility", e.target.value)} placeholder="e.g. Health-conscious, non-smoker" />
                    </div>
                    <div className="mp-form-group">
                      <label className="mp-form-label">Dealbreakers</label>
                      <textarea className="mp-textarea" rows={2} name="dealbreakers" value={formData.dealbreakers || ""} onChange={handleChange} placeholder="e.g. Smoking, dishonesty" />
                    </div>
                    <div className="mp-form-group">
                      <label className="mp-form-label">Future Aspirations</label>
                      <textarea className="mp-textarea" rows={2} name="futureAspirations" value={formData.futureAspirations || ""} onChange={handleChange} placeholder="e.g. Start a family, settle in Colombo" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mp-info-grid">
                      {[
                        ["Age Range", (user.partnerPreferences?.ageRange || []).length === 2 ? `${user.partnerPreferences.ageRange[0]} – ${user.partnerPreferences.ageRange[1]} years` : null],
                        ["Height Range", user.partnerPreferences?.heightPreference?.length === 2 ? `${user.partnerPreferences.heightPreference[0]} – ${user.partnerPreferences.heightPreference[1]} cm` : null],
                        ["Location", user.partnerPreferences?.locationPreference],
                        ["Education", user.partnerPreferences?.educationLevel],
                        ["Religion", user.partnerPreferences?.religionPreference],
                        ["Marital Status", user.partnerPreferences?.maritalStatusPreference],
                        ["Lifestyle Compatibility", user.partnerPreferences?.lifestyleCompatibility],
                        ["Dealbreakers", user.dealbreakers],
                      ].map(([label, value]) => (
                        <div key={label} className="mp-info-item">
                          <span className="mp-info-label">{label}</span>
                          <span className="mp-info-value">{value || "Not specified"}</span>
                        </div>
                      ))}
                    </div>
                    {user.futureAspirations && (
                      <>
                        <div style={{ height: "0.75rem" }} />
                        <div className="mp-info-label" style={{ marginBottom: "0.4rem" }}>Future Aspirations</div>
                        <p style={{ fontSize: "0.85rem", color: "#4a3028", lineHeight: 1.65 }}>{user.futureAspirations}</p>
                      </>
                    )}
                  </>
                )}
                <div className="mp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
              </div>
            )}

            {/* ── PRIVACY TAB ── */}
            {activeTab === "privacy" && (
              <div style={{ padding: "1.75rem 2rem" }}>
                <div className="mp-privacy-section">
                  <div className="mp-privacy-title"><Eye size={16} style={{ color: "#8b4e2e" }} />Profile Visibility</div>
                  {[
                    { label: "Who can see my profile", sub: "Control who can view your full profile details", type: "select" },
                    { label: "Show my online status", sub: "Let others know when you're active", type: "toggle", defaultChecked: true },
                    { label: "Show my location", sub: "Display your city/district to other users", type: "toggle", defaultChecked: true },
                  ].map((item, i) => (
                    <div key={i} className="mp-privacy-row">
                      <div>
                        <div className="mp-privacy-row-label">{item.label}</div>
                        <div className="mp-privacy-row-sub">{item.sub}</div>
                      </div>
                      {item.type === "select" ? (
                        <select className="mp-privacy-select">
                          <option>Everyone</option>
                          <option>Only members I like</option>
                          <option>Only matched members</option>
                        </select>
                      ) : (
                        <label className="mp-toggle">
                          <input type="checkbox" defaultChecked={item.defaultChecked} />
                          <span className="mp-toggle-slider" />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mp-privacy-section">
                  <div className="mp-privacy-title"><MessageCircleIcon size={16} style={{ color: "#8b4e2e" }} />Communication Privacy</div>
                  {[
                    { label: "Who can message me", sub: "Control who can send you direct messages", type: "select" },
                    { label: "Read receipts", sub: "Let others know when you've read their messages", type: "toggle", defaultChecked: true },
                    { label: "Show when I'm typing", sub: "Display typing indicator in chat", type: "toggle", defaultChecked: true },
                  ].map((item, i) => (
                    <div key={i} className="mp-privacy-row">
                      <div>
                        <div className="mp-privacy-row-label">{item.label}</div>
                        <div className="mp-privacy-row-sub">{item.sub}</div>
                      </div>
                      {item.type === "select" ? (
                        <select className="mp-privacy-select">
                          <option>Everyone</option>
                          <option>Only members I like</option>
                          <option>Only matched members</option>
                        </select>
                      ) : (
                        <label className="mp-toggle">
                          <input type="checkbox" defaultChecked={item.defaultChecked} />
                          <span className="mp-toggle-slider" />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mp-privacy-section">
                  <div className="mp-privacy-title"><Lock size={16} style={{ color: "#8b4e2e" }} />Information Privacy</div>
                  {[
                    { label: "Show my income range", sub: "Display income information to others", type: "toggle", defaultChecked: false },
                    { label: "Show horoscope details", sub: "Make detailed horoscope information visible", type: "toggle", defaultChecked: true },
                    { label: "Show family details", sub: "Display family background information", type: "toggle", defaultChecked: true },
                  ].map((item, i) => (
                    <div key={i} className="mp-privacy-row">
                      <div>
                        <div className="mp-privacy-row-label">{item.label}</div>
                        <div className="mp-privacy-row-sub">{item.sub}</div>
                      </div>
                      <label className="mp-toggle">
                        <input type="checkbox" defaultChecked={item.defaultChecked} />
                        <span className="mp-toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Image Upload Modal ── */}
      {showImageUpload && (
        <div className="mp-modal-overlay" onClick={() => { setShowImageUpload(false); setPreviewImage(null); }}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-modal-head">
              <div className="mp-modal-title">Upload Profile Photo</div>
              <button className="mp-modal-close" onClick={() => { setShowImageUpload(false); setPreviewImage(null); }}><X size={14} /></button>
            </div>
            <div className="mp-modal-body">
              <div className="mp-upload-zone">
                {previewImage
                  ? <img src={previewImage} alt="Preview" className="mp-upload-preview" />
                  : (
                    <div className="mp-upload-placeholder">
                      <div className="mp-upload-placeholder-icon"><Camera size={22} style={{ color: "#8b4e2e" }} /></div>
                      <p>Click to select a photo</p>
                      <span>JPG, PNG or WEBP · Max 5MB</span>
                    </div>
                  )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="mp-modal-footer">
                <button className="mp-btn-cancel" onClick={() => { setShowImageUpload(false); setPreviewImage(null); }}>Cancel</button>
                <button className="mp-btn-upload" disabled={!previewImage} onClick={handleImageUpload}>
                  <Camera size={13} style={{ marginRight: 4 }} />Upload Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MessageCircleIcon = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default MyProfilePage;