"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import {
  HeartIcon, ShieldCheckIcon, StarIcon, UsersIcon,
  PhoneCallIcon, SlidersIcon, ArrowRightIcon, CheckIcon,
  ChevronDownIcon, MapPinIcon, SparklesIcon, ZapIcon,
  CrownIcon, MessageCircleIcon, GlobeIcon, TrendingUpIcon,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .lp-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .lp-root {
    font-family: 'DM Sans', sans-serif;
    background: #fdf8f4;
    color: #2d1810;
    overflow-x: hidden;
  }

  /* ── NAVBAR ── */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    box-shadow: 0 4px 24px rgba(30,8,2,0.18);
  }
  .lp-nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 66px;
  }
  .lp-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem; font-weight: 600; letter-spacing: 0.03em;
    text-decoration: none; display: flex; align-items: center;
  }
  .lp-logo .gold { color: #e8c97a; }
  .lp-logo .white { color: #fff; }
  .lp-logo .heart { color: #f4a0a0; font-size: 1.3rem; margin-left: 2px; }

  .lp-nav-links { display: flex; align-items: center; gap: 0.5rem; }
  @media (max-width: 600px) { .lp-nav-links .lp-nav-link-ghost { display: none; } }

  .lp-nav-link-ghost {
    font-size: 0.85rem; font-weight: 500; color: rgba(255,255,255,0.82);
    text-decoration: none; padding: 0.45rem 1rem; border-radius: 99px;
    transition: all 0.2s;
  }
  .lp-nav-link-ghost:hover { color: #fff; background: rgba(255,255,255,0.1); }

  .lp-nav-cta {
    font-size: 0.85rem; font-weight: 500; color: #3d1f12;
    text-decoration: none; padding: 0.5rem 1.35rem; border-radius: 99px;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    box-shadow: 0 4px 14px rgba(200,160,80,0.32);
    transition: all 0.2s; white-space: nowrap;
  }
  .lp-nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(200,160,80,0.44); }

  /* ── HERO ── */
  .lp-hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column; justify-content: center;
    background: linear-gradient(160deg, #3d1f12 0%, #6b3526 40%, #8b4e2e 70%, #c9856a 100%);
    overflow: hidden; padding-top: 66px;
  }

  /* Decorative circles */
  .lp-hero::before {
    content: '';
    position: absolute; top: -120px; right: -120px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,201,122,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .lp-hero::after {
    content: '';
    position: absolute; bottom: -80px; left: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,160,160,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .lp-hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1545289305-8c3aeeaade63?auto=format&fit=crop&w=2940&q=80');
    background-size: cover; background-position: center;
    opacity: 0.08; pointer-events: none;
  }

  .lp-hero-inner {
    position: relative; z-index: 2;
    max-width: 1200px; margin: 0 auto; padding: 5rem 2rem 4rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;
  }
  @media (max-width: 900px) {
    .lp-hero-inner { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
    .lp-hero-btns { justify-content: center !important; }
    .lp-hero-stats { justify-content: center !important; }
    .lp-hero-image-col { display: none; }
  }

  .lp-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(232,201,122,0.15); border: 1px solid rgba(232,201,122,0.3);
    color: #e8c97a; font-size: 0.75rem; font-weight: 500;
    padding: 0.3rem 0.9rem; border-radius: 99px;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 1.25rem; display: flex; width: fit-content;
  }
  @media (max-width: 900px) { .lp-hero-eyebrow { margin: 0 auto 1.25rem; } }

  .lp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 600; color: #fff;
    line-height: 1.12; margin-bottom: 1.5rem;
  }
  .lp-hero-title .gold {
    background: linear-gradient(135deg, #e8c97a, #f4d898);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .lp-hero-subtitle {
    font-size: 1rem; color: rgba(255,255,255,0.72);
    line-height: 1.75; margin-bottom: 2rem; max-width: 480px;
  }
  @media (max-width: 900px) { .lp-hero-subtitle { margin-left: auto; margin-right: auto; } }

  .lp-hero-btns { display: flex; gap: 0.85rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .lp-btn-gold {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.9rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; text-decoration: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 20px rgba(200,160,80,0.36);
    transition: all 0.2s;
  }
  .lp-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,160,80,0.48); }

  .lp-btn-outline {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.9rem; font-weight: 500;
    background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
    color: #fff; text-decoration: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .lp-btn-outline:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.55); }

  .lp-hero-stats { display: flex; gap: 2rem; }
  .lp-stat { }
  .lp-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600; color: #e8c97a; line-height: 1;
  }
  .lp-stat-label { font-size: 0.74rem; color: rgba(255,255,255,0.6); margin-top: 2px; }

  /* Hero image mosaic */
  .lp-hero-image-col { position: relative; height: 500px; }
  .lp-mosaic {
    position: relative; width: 100%; height: 100%;
  }
  .lp-mosaic-img {
    position: absolute; border-radius: 18px;
    object-fit: cover; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    border: 3px solid rgba(232,201,122,0.25);
  }
  .lp-mosaic-img.a { width: 200px; height: 280px; top: 0; left: 30px; animation: lp-float 6s ease-in-out infinite; }
  .lp-mosaic-img.b { width: 170px; height: 230px; top: 60px; right: 20px; animation: lp-float 6s ease-in-out infinite 1.5s; }
  .lp-mosaic-img.c { width: 155px; height: 200px; bottom: 10px; left: 60px; animation: lp-float 6s ease-in-out infinite 3s; }
  .lp-mosaic-badge {
    position: absolute; bottom: 60px; right: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    border: 1.5px solid rgba(232,201,122,0.3);
    border-radius: 16px; padding: 0.85rem 1.1rem;
    box-shadow: 0 12px 32px rgba(0,0,0,0.3);
    display: flex; align-items: center; gap: 0.6rem;
  }
  .lp-mosaic-badge-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(232,201,122,0.15); display: flex; align-items: center; justify-content: center; }
  .lp-mosaic-badge-text { font-size: 0.78rem; font-weight: 500; color: #fff; line-height: 1.4; }
  .lp-mosaic-badge-sub { font-size: 0.68rem; color: rgba(255,255,255,0.6); }

  @keyframes lp-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .lp-hero-scroll {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
    font-size: 0.7rem; color: rgba(255,255,255,0.45); letter-spacing: 0.1em; text-transform: uppercase;
    animation: lp-bounce 2s ease-in-out infinite;
  }
  @keyframes lp-bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(6px); }
  }

  /* ── SECTION SHARED ── */
  .lp-section { padding: 5rem 1.5rem; }
  .lp-section-inner { max-width: 1200px; margin: 0 auto; }
  .lp-section-eyebrow {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e;
    margin-bottom: 0.6rem; text-align: center;
  }
  .lp-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 600;
    color: #2d1810; text-align: center; line-height: 1.2;
    margin-bottom: 0.75rem;
  }
  .lp-section-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .lp-section-sub {
    font-size: 0.9rem; color: #9a7060; text-align: center;
    max-width: 560px; margin: 0 auto 3rem; line-height: 1.7;
  }

  /* ── WHY SRIMATCH ── */
  .lp-why { background: #fff; }
  .lp-features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
  }
  @media (max-width: 700px) { .lp-features-grid { grid-template-columns: 1fr; } }
  @media (max-width: 1000px) and (min-width: 701px) { .lp-features-grid { grid-template-columns: 1fr 1fr; } }

  .lp-feature-card {
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border: 1px solid #f0ddd5; border-radius: 20px;
    padding: 1.75rem 1.5rem;
    transition: all 0.25s;
  }
  .lp-feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(139,78,46,0.1);
    border-color: #e8c9b8;
  }
  .lp-feature-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.1rem;
    box-shadow: 0 6px 16px rgba(139,78,46,0.28);
  }
  .lp-feature-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #2d1810; margin-bottom: 0.5rem;
  }
  .lp-feature-text { font-size: 0.84rem; color: #6b4a3a; line-height: 1.65; }

  /* ── STATS BAND ── */
  .lp-stats-band {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 3.5rem 1.5rem;
  }
  .lp-stats-grid {
    max-width: 1000px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  }
  @media (max-width: 600px) { .lp-stats-grid { grid-template-columns: 1fr 1fr; } }
  .lp-stats-item { text-align: center; padding: 1rem; }
  .lp-stats-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 600; color: #e8c97a; line-height: 1;
  }
  .lp-stats-label { font-size: 0.78rem; color: rgba(255,255,255,0.65); margin-top: 5px; }

  /* ── HOW IT WORKS ── */
  .lp-how { background: #fdf8f4; }
  .lp-steps {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem;
    position: relative;
  }
  @media (max-width: 800px) { .lp-steps { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .lp-steps { grid-template-columns: 1fr; } }

  /* Connector line */
  .lp-steps::before {
    content: '';
    position: absolute; top: 30px; left: 10%; right: 10%; height: 1px;
    background: linear-gradient(90deg, transparent, #e8c9b8, #e8c9b8, transparent);
    pointer-events: none;
  }
  @media (max-width: 800px) { .lp-steps::before { display: none; } }

  .lp-step { text-align: center; padding: 0.5rem; }
  .lp-step-num {
    width: 60px; height: 60px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600; color: #fff;
    box-shadow: 0 8px 24px rgba(139,78,46,0.3);
    position: relative; z-index: 1;
  }
  .lp-step-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.5rem;
  }
  .lp-step-text { font-size: 0.8rem; color: #9a7060; line-height: 1.6; }

  /* ── PREMIUM FEATURES ── */
  .lp-premium {
    background: #fff;
  }
  .lp-premium-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
  }
  @media (max-width: 800px) { .lp-premium-grid { grid-template-columns: 1fr; gap: 2rem; } }

  .lp-premium-visual {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    border-radius: 24px; padding: 2rem;
    box-shadow: 0 24px 64px rgba(61,31,18,0.3);
    position: relative; overflow: hidden;
  }
  .lp-premium-visual::before {
    content: '✦';
    position: absolute; top: 1rem; right: 1.5rem;
    font-size: 1.2rem; color: rgba(232,201,122,0.2);
  }
  .lp-pv-crown {
    display: flex; align-items: center; gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
  .lp-pv-crown-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #e8c97a;
  }
  .lp-pv-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .lp-pv-item {
    display: flex; align-items: center; gap: 0.75rem;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px; padding: 0.75rem 1rem;
  }
  .lp-pv-item-icon {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(232,201,122,0.12);
  }
  .lp-pv-item-text { font-size: 0.83rem; color: #fff; font-weight: 500; }
  .lp-pv-item-sub { font-size: 0.71rem; color: rgba(255,255,255,0.55); margin-top: 1px; }
  .lp-pv-price {
    margin-top: 1.25rem; display: flex; align-items: baseline; gap: 0.4rem;
  }
  .lp-pv-from { font-size: 0.75rem; color: rgba(255,255,255,0.55); }
  .lp-pv-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #e8c97a;
  }
  .lp-pv-per { font-size: 0.75rem; color: rgba(255,255,255,0.55); }

  .lp-premium-text { }
  .lp-premium-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.75rem; }
  .lp-premium-list-item {
    display: flex; align-items: flex-start; gap: 0.75rem;
  }
  .lp-check-icon {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }
  .lp-pli-title { font-size: 0.88rem; font-weight: 500; color: #2d1810; margin-bottom: 2px; }
  .lp-pli-sub { font-size: 0.77rem; color: #9a7060; line-height: 1.5; }

  /* ── TESTIMONIALS ── */
  .lp-testimonials { background: #fdf8f4; }
  .lp-test-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
  }
  @media (max-width: 900px) { .lp-test-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .lp-test-grid { grid-template-columns: 1fr; } }

  .lp-test-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 20px; padding: 1.5rem;
    border-left: 3px solid #c9856a;
    transition: all 0.2s;
  }
  .lp-test-card:hover { box-shadow: 0 10px 30px rgba(139,78,46,0.09); transform: translateY(-2px); }

  .lp-stars { color: #d4a017; font-size: 0.78rem; letter-spacing: 1px; margin-bottom: 0.75rem; }
  .lp-test-quote {
    font-size: 0.85rem; color: #4a3028; line-height: 1.7;
    font-style: italic; margin-bottom: 1rem;
  }
  .lp-test-author { display: flex; align-items: center; gap: 0.6rem; }
  .lp-test-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    object-fit: cover; border: 2px solid #f0ddd5;
    flex-shrink: 0;
  }
  .lp-test-name { font-size: 0.83rem; font-weight: 500; color: #2d1810; }
  .lp-test-loc { font-size: 0.72rem; color: #9a7060; }

  /* ── FAQ ── */
  .lp-faq { background: #fff; }
  .lp-faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.75rem; }
  .lp-faq-item {
    border: 1px solid #f0ddd5; border-radius: 14px; overflow: hidden;
  }
  .lp-faq-q {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 1.25rem; cursor: pointer; background: #fdf8f5;
    font-size: 0.88rem; font-weight: 500; color: #2d1810;
    transition: background 0.15s;
    border: none; width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
  }
  .lp-faq-q:hover { background: #fdf0e8; }
  .lp-faq-a {
    padding: 0 1.25rem 1rem; font-size: 0.82rem; color: #6b4a3a; line-height: 1.7;
    border-top: 1px solid #f0ddd5;
  }
  .lp-faq-chevron { transition: transform 0.25s; color: #9a7060; flex-shrink: 0; }
  .lp-faq-chevron.open { transform: rotate(180deg); }

  /* ── CTA BAND ── */
  .lp-cta {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 5rem 1.5rem; text-align: center; position: relative; overflow: hidden;
  }
  .lp-cta::before {
    content: '✦';
    position: absolute; top: 2rem; left: 3rem;
    font-size: 3rem; color: rgba(232,201,122,0.08); pointer-events: none;
  }
  .lp-cta::after {
    content: '✦';
    position: absolute; bottom: 2rem; right: 3rem;
    font-size: 4rem; color: rgba(232,201,122,0.08); pointer-events: none;
  }
  .lp-cta-inner { max-width: 640px; margin: 0 auto; position: relative; z-index: 1; }
  .lp-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 600;
    color: #fff; margin-bottom: 0.75rem; line-height: 1.2;
  }
  .lp-cta-title span { color: #e8c97a; }
  .lp-cta-sub { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.65; }
  .lp-cta-btns { display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }

  .lp-trust-row {
    display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;
    margin-top: 2rem;
  }
  .lp-trust-item {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.76rem; color: rgba(255,255,255,0.55);
  }

  /* ── ORNAMENT ── */
  .lp-ornament {
    text-align: center; font-size: 0.8rem; color: #d4b8a8;
    letter-spacing: 0.2em; padding: 1rem 0;
  }
`;

/* ─── FAQ data ─────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Is SriMatch only for Sri Lankan people?",
    a: "SriMatch is designed specifically with Sri Lankan culture, traditions, and values in mind. It's ideal for Sri Lankans living both in Sri Lanka and abroad who are looking for a culturally compatible partner.",
  },
  {
    q: "How does horoscope compatibility work?",
    a: "We use traditional Sri Lankan astrological principles to calculate compatibility between two horoscope charts. Premium members can view detailed compatibility reports, which many families consider an important factor in matrimonial decisions.",
  },
  {
    q: "How do I get my profile verified?",
    a: "Visit the Verification page after logging in and submit your National Identity Card (NIC) or passport details. Our team reviews submissions and grants a trusted green verified badge to approved profiles, typically within 24–48 hours.",
  },
  {
    q: "Is my personal information safe?",
    a: "Absolutely. We use industry-standard SSL encryption and never sell your personal data to third parties. You also have full control over your privacy settings, including who can see your profile, income, and contact details.",
  },
  {
    q: "Can I use SriMatch for free?",
    a: "Yes! The Free plan lets you browse profiles, send up to 5 likes per day, and manage your profile. Upgrading to Premium unlocks unlimited likes, voice & video calls, advanced filters, horoscope matching, and much more.",
  },
  {
    q: "How does matching work?",
    a: "Our algorithm considers your preferences, location, religion, education, lifestyle, and compatibility factors to surface the most relevant profiles. Premium members also benefit from horoscope-weighted matching and priority placement.",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      if (user && user.profileCompleted === false) {
        router.push("/profile-creation");
      } else {
        router.push("/home");
      }
    }
  }, [isAuthenticated, user, router]);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">

        {/* ── NAVBAR ── */}
        <nav className="lp-nav">
          <div className="lp-nav-inner">
            <Link href="/" className="lp-logo">
              <span className="gold">Sri</span>
              <span className="white">Match</span>
              <span className="heart"> ♥</span>
            </Link>
            <div className="lp-nav-links">
              <Link href="/login" className="lp-nav-link-ghost">Sign In</Link>
              <Link href="/register" className="lp-nav-cta">Join Free ✦</Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-bg" />

          <div className="lp-hero-inner">
            {/* Left — copy */}
            <div>
              <div className="lp-hero-eyebrow">
                <SparklesIcon size={11} />
                Sri Lanka's trusted matrimony platform
              </div>

              <h1 className="lp-hero-title">
                Find Your <span className="gold">Perfect Match</span> with Sri Lankan Values
              </h1>

              <p className="lp-hero-subtitle">
                SriMatch connects you with compatible partners who share your culture,
                traditions, and values — with horoscope matching, verified profiles,
                and a community built on trust.
              </p>

              <div className="lp-hero-btns">
                <Link href="/register" className="lp-btn-gold">
                  Create Free Account <ArrowRightIcon size={15} />
                </Link>
                <Link href="/login" className="lp-btn-outline">
                  Sign In
                </Link>
              </div>

              <div className="lp-hero-stats">
                <div className="lp-stat">
                  <div className="lp-stat-num">50K+</div>
                  <div className="lp-stat-label">Active members</div>
                </div>
                <div className="lp-stat">
                  <div className="lp-stat-num">12K+</div>
                  <div className="lp-stat-label">Successful matches</div>
                </div>
                <div className="lp-stat">
                  <div className="lp-stat-num">4.9★</div>
                  <div className="lp-stat-label">Member rating</div>
                </div>
              </div>
            </div>

            {/* Right — image mosaic */}
            <div className="lp-hero-image-col">
              <div className="lp-mosaic">
                <img
                  className="lp-mosaic-img a"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                  alt=""
                />
                <img
                  className="lp-mosaic-img b"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                  alt=""
                />
                <img
                  className="lp-mosaic-img c"
                  src="https://images.unsplash.com/photo-1664575599736-c5197c684de0?auto=format&fit=crop&w=400&q=80"
                  alt=""
                />
                <div className="lp-mosaic-badge">
                  <div className="lp-mosaic-badge-icon">
                    <HeartIcon size={16} style={{ color: "#e8c97a" }} />
                  </div>
                  <div>
                    <div className="lp-mosaic-badge-text">New match found!</div>
                    <div className="lp-mosaic-badge-sub">Nirmala · 94% compatibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lp-hero-scroll">
            Scroll to explore
            <ChevronDownIcon size={14} />
          </div>
        </section>

        {/* ── WHY SRIMATCH ── */}
        <section className="lp-section lp-why">
          <div className="lp-section-inner">
            <div className="lp-section-eyebrow">Why choose us</div>
            <h2 className="lp-section-title">Built for <span>Sri Lankan</span> hearts</h2>
            <p className="lp-section-sub">
              Every feature is thoughtfully designed around the values, traditions, and trust
              that matter most to Sri Lankan families and individuals.
            </p>
            <div className="lp-features-grid">
              {[
                {
                  icon: <UsersIcon size={22} color="#fff" />,
                  title: "Cultural Compatibility",
                  text: "Our matching system respects Sri Lankan traditions — religion, caste, ethnicity, and family values are first-class matching criteria.",
                },
                {
                  icon: <ShieldCheckIcon size={22} color="#fff" />,
                  title: "NIC Verified Profiles",
                  text: "Every member can get verified using their National Identity Card, giving you confidence that the profiles you see are real and trustworthy.",
                },
                {
                  icon: <StarIcon size={22} color="#fff" />,
                  title: "Horoscope Matching",
                  text: "Traditional astrological compatibility built right into the platform — a feature your parents will appreciate as much as you do.",
                },
                {
                  icon: <PhoneCallIcon size={22} color="#fff" />,
                  title: "Voice & Video Calls",
                  text: "Connect meaningfully before meeting in person. Premium members enjoy unlimited secure voice and video calls within the platform.",
                },
                {
                  icon: <SlidersIcon size={22} color="#fff" />,
                  title: "Advanced Filters",
                  text: "Filter by district, religion, education, profession, income range, height, and more — so you find exactly who you're looking for.",
                },
                {
                  icon: <GlobeIcon size={22} color="#fff" />,
                  title: "Worldwide Community",
                  text: "Sri Lankans in Colombo, London, Toronto, or Sydney — our community spans the globe so distance is never a barrier to love.",
                },
              ].map((f, i) => (
                <div key={i} className="lp-feature-card">
                  <div className="lp-feature-icon">{f.icon}</div>
                  <div className="lp-feature-title">{f.title}</div>
                  <div className="lp-feature-text">{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS BAND ── */}
        <div className="lp-stats-band">
          <div className="lp-stats-grid">
            {[
              ["50,000+", "Registered members"],
              ["12,000+", "Couples matched"],
              ["3×", "Faster with Premium"],
              ["4.9 / 5", "Average member rating"],
            ].map(([num, label]) => (
              <div key={label} className="lp-stats-item">
                <div className="lp-stats-num">{num}</div>
                <div className="lp-stats-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-section lp-how">
          <div className="lp-section-inner">
            <div className="lp-section-eyebrow">Simple process</div>
            <h2 className="lp-section-title">How <span>SriMatch</span> works</h2>
            <p className="lp-section-sub">
              Finding your life partner should be simple and safe. Four easy steps
              is all it takes to start your journey.
            </p>
            <div className="lp-steps">
              {[
                {
                  n: "1",
                  title: "Create Your Profile",
                  text: "Sign up free and complete your detailed profile — personal info, horoscope, preferences, and photos.",
                },
                {
                  n: "2",
                  title: "Verify Your Identity",
                  text: "Submit your NIC or passport for a trust badge. Verified members get 60% more responses.",
                },
                {
                  n: "3",
                  title: "Browse Matches",
                  text: "Explore compatible profiles filtered by your preferences, location, and horoscope compatibility.",
                },
                {
                  n: "4",
                  title: "Connect & Meet",
                  text: "Send a connection request, chat, call, and when ready — meet your match in person.",
                },
              ].map((s, i) => (
                <div key={i} className="lp-step">
                  <div className="lp-step-num">{s.n}</div>
                  <div className="lp-step-title">{s.title}</div>
                  <div className="lp-step-text">{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PREMIUM ── */}
        <section className="lp-section lp-premium">
          <div className="lp-section-inner">
            <div className="lp-premium-grid">

              {/* Visual card */}
              <div className="lp-premium-visual">
                <div className="lp-pv-crown">
                  <CrownIcon size={20} style={{ color: "#e8c97a" }} />
                  <span className="lp-pv-crown-text">SriMatch Premium</span>
                </div>
                <div className="lp-pv-list">
                  {[
                    { icon: <HeartIcon size={14} color="#f4a0a0" />, text: "Unlimited daily likes", sub: "No daily limit ever" },
                    { icon: <PhoneCallIcon size={14} color="#a0d0f4" />, text: "Voice & video calls", sub: "Secure in-app calling" },
                    { icon: <StarIcon size={14} color="#e8c97a" />, text: "Horoscope compatibility", sub: "Detailed chart analysis" },
                    { icon: <SlidersIcon size={14} color="#c4f4a0" />, text: "Advanced search filters", sub: "50+ filter combinations" },
                    { icon: <TrendingUpIcon size={14} color="#f4c0a0" />, text: "Monthly profile boost", sub: "Featured at the top" },
                    { icon: <MessageCircleIcon size={14} color="#a0c4f4" />, text: "Message before connect", sub: "3 messages per match" },
                  ].map((item, i) => (
                    <div key={i} className="lp-pv-item">
                      <div className="lp-pv-item-icon">{item.icon}</div>
                      <div>
                        <div className="lp-pv-item-text">{item.text}</div>
                        <div className="lp-pv-item-sub">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lp-pv-price">
                  <span className="lp-pv-from">From</span>
                  <span className="lp-pv-amount">$20</span>
                  <span className="lp-pv-per">/ month</span>
                </div>
              </div>

              {/* Text */}
              <div className="lp-premium-text">
                <div className="lp-section-eyebrow" style={{ textAlign: "left" }}>Premium membership</div>
                <h2 className="lp-section-title" style={{ textAlign: "left", marginBottom: "1rem" }}>
                  Find your match <span>3× faster</span>
                </h2>
                <p style={{ fontSize: "0.88rem", color: "#9a7060", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                  Thousands of Sri Lankan couples found each other through SriMatch Premium.
                  Unlock the tools that give you the best possible chance of meeting someone truly compatible.
                </p>
                <div className="lp-premium-list">
                  {[
                    { title: "See who liked you", sub: "Discover profiles that have already expressed interest in you — no guesswork." },
                    { title: "Priority matching", sub: "Your profile is shown first to compatible members who are most likely to respond." },
                    { title: "Detailed horoscope reports", sub: "Full chart-to-chart compatibility analysis that your family will trust and respect." },
                    { title: "Incognito browsing", sub: "Explore profiles privately without appearing in their visitors list." },
                  ].map((item, i) => (
                    <div key={i} className="lp-premium-list-item">
                      <div className="lp-check-icon">
                        <CheckIcon size={12} color="#fff" />
                      </div>
                      <div>
                        <div className="lp-pli-title">{item.title}</div>
                        <div className="lp-pli-sub">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/register" className="lp-btn-gold" style={{ display: "inline-flex" }}>
                  <CrownIcon size={14} /> Get Premium ✦
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="lp-section lp-testimonials">
          <div className="lp-section-inner">
            <div className="lp-section-eyebrow">Success stories</div>
            <h2 className="lp-section-title">Real couples, real <span>love</span></h2>
            <p className="lp-section-sub">
              Thousands of Sri Lankan families have celebrated engagements and weddings
              because of connections made on SriMatch.
            </p>
            <div className="lp-test-grid">
              {[
                {
                  stars: "★★★★★",
                  quote: "SriMatch helped us find each other based on our traditional values and horoscope compatibility. We're now happily married for 2 years!",
                  name: "Priya & Sanjay",
                  loc: "Colombo, Sri Lanka",
                  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=60",
                },
                {
                  stars: "★★★★★",
                  quote: "The detailed profiles and verification process made us feel completely safe. We connected over shared interests and values, and got engaged last month!",
                  name: "Nimal & Kumari",
                  loc: "Kandy, Sri Lanka",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=60",
                },
                {
                  stars: "★★★★★",
                  quote: "The horoscope matching feature was incredibly accurate! Our families were so impressed with how well our charts aligned. Thank you SriMatch!",
                  name: "Dilshan & Malini",
                  loc: "Galle, Sri Lanka",
                  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=60",
                },
                {
                  stars: "★★★★★",
                  quote: "As a Sri Lankan living in London, I never thought I'd find someone who truly understood our culture. SriMatch connected me with my now-wife within weeks.",
                  name: "Roshan & Thilini",
                  loc: "London, UK",
                  img: "https://images.unsplash.com/photo-1664575599736-c5197c684de0?auto=format&fit=crop&w=100&q=60",
                },
                {
                  stars: "★★★★★",
                  quote: "The profile boost feature worked amazingly — I got so many more views and matched with my fiancée within a month. Absolutely worth upgrading!",
                  name: "Kasun & Nirmala",
                  loc: "Negombo, Sri Lanka",
                  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
                },
                {
                  stars: "★★★★★",
                  quote: "My parents were hesitant about online matrimony, but the NIC verification and family involvement features won them over completely.",
                  name: "Dinesh & Sandya",
                  loc: "Colombo, Sri Lanka",
                  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                },
              ].map((t, i) => (
                <div key={i} className="lp-test-card">
                  <div className="lp-stars">{t.stars}</div>
                  <p className="lp-test-quote">"{t.quote}"</p>
                  <div className="lp-test-author">
                    <img src={t.img} alt={t.name} className="lp-test-avatar" />
                    <div>
                      <div className="lp-test-name">{t.name}</div>
                      <div className="lp-test-loc">
                        <MapPinIcon size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                        {t.loc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="lp-section lp-faq">
          <div className="lp-section-inner">
            <div className="lp-section-eyebrow">Common questions</div>
            <h2 className="lp-section-title">Everything you need to <span>know</span></h2>
            <p className="lp-section-sub">
              Have questions? Here are the answers our members ask most often.
            </p>
            <div className="lp-faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} className="lp-faq-item">
                  <button className="lp-faq-q" onClick={() => toggleFaq(i)}>
                    {faq.q}
                    <ChevronDownIcon
                      size={16}
                      className={`lp-faq-chevron${openFaq === i ? " open" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="lp-faq-a">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta">
          <div className="lp-cta-inner">
            <div className="lp-ornament" style={{ color: "rgba(232,201,122,0.3)", marginBottom: "1.25rem" }}>✦ &nbsp; ✦ &nbsp; ✦</div>
            <h2 className="lp-cta-title">
              Start your <span>love story</span> today
            </h2>
            <p className="lp-cta-sub">
              Join over 50,000 Sri Lankans who trust SriMatch to find a meaningful,
              culturally compatible life partner. Registration is always free.
            </p>
            <div className="lp-cta-btns">
              <Link href="/register" className="lp-btn-gold">
                Create Free Account <ArrowRightIcon size={15} />
              </Link>
              <Link href="/login" className="lp-btn-outline">
                Sign In
              </Link>
            </div>
            <div className="lp-trust-row">
              <div className="lp-trust-item"><CheckIcon size={12} /> Free to join</div>
              <div className="lp-trust-item"><ShieldCheckIcon size={12} /> NIC verified profiles</div>
              <div className="lp-trust-item"><StarIcon size={12} /> Horoscope matching</div>
              <div className="lp-trust-item"><ZapIcon size={12} /> Cancel anytime</div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;