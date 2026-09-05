"use client";
import React, { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import {
  HeartIcon,
  UsersIcon,
  GlobeIcon,
  ShieldCheckIcon,
  AwardIcon,
  TrophyIcon,
  SparklesIcon,
  StarIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckIcon,
  ZapIcon,
  CodeIcon,
  ExternalLinkIcon,
  TrendingUpIcon,
  LockIcon,
  SmileIcon,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .au-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .au-root {
    font-family: 'DM Sans', sans-serif;
    background: #fdf8f4;
    color: #2d1810;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .au-hero {
    background: linear-gradient(160deg, #3d1f12 0%, #6b3526 45%, #8b4e2e 75%, #c9856a 100%);
    padding: 5rem 1.5rem 6rem;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .au-hero::before {
    content: '';
    position: absolute; top: -120px; right: -120px;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,201,122,0.1) 0%, transparent 65%);
    pointer-events: none;
  }
  .au-hero::after {
    content: '';
    position: absolute; bottom: -80px; left: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,160,160,0.08) 0%, transparent 65%);
    pointer-events: none;
  }
  .au-hero-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 1; }

  .au-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(232,201,122,0.15); border: 1px solid rgba(232,201,122,0.3);
    color: #e8c97a; font-size: 0.72rem; font-weight: 500;
    padding: 0.3rem 0.9rem; border-radius: 99px;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .au-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 600; color: #fff;
    line-height: 1.1; margin-bottom: 1.25rem;
  }
  .au-hero-title .gold {
    background: linear-gradient(135deg, #e8c97a, #f4d898);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .au-hero-subtitle {
    font-size: 1rem; color: rgba(255,255,255,0.7);
    line-height: 1.75; margin-bottom: 2.25rem; max-width: 540px; margin-left: auto; margin-right: auto;
  }
  .au-hero-btns { display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }

  .au-btn-gold {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.88rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; text-decoration: none;
    box-shadow: 0 6px 20px rgba(200,160,80,0.36);
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .au-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,160,80,0.48); }

  .au-btn-outline {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.88rem; font-weight: 500;
    background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
    color: #fff; text-decoration: none;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .au-btn-outline:hover { background: rgba(255,255,255,0.2); }

  /* ── STATS BAND ── */
  .au-stats-band {
    background: #fff;
    border-bottom: 1px solid #f0ddd5;
    padding: 2.5rem 1.5rem;
  }
  .au-stats-grid {
    max-width: 960px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  }
  @media (max-width: 600px) { .au-stats-grid { grid-template-columns: 1fr 1fr; } }
  .au-stat-item { text-align: center; padding: 0.75rem; }
  .au-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 600;
    background: linear-gradient(135deg, #3d1f12, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    line-height: 1;
  }
  .au-stat-label { font-size: 0.76rem; color: #9a7060; margin-top: 4px; }

  /* ── SHARED SECTION ── */
  .au-section { padding: 5rem 1.5rem; }
  .au-section-inner { max-width: 1100px; margin: 0 auto; }
  .au-section-eyebrow {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e;
    margin-bottom: 0.6rem; text-align: center;
  }
  .au-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 600;
    color: #2d1810; text-align: center; line-height: 1.2;
    margin-bottom: 0.75rem;
  }
  .au-section-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .au-section-sub {
    font-size: 0.9rem; color: #9a7060; text-align: center;
    max-width: 560px; margin: 0 auto 3rem; line-height: 1.7;
  }

  /* ── MISSION ── */
  .au-mission { background: #fdf8f4; }
  .au-mission-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
  }
  @media (max-width: 800px) { .au-mission-grid { grid-template-columns: 1fr; gap: 2rem; } }

  .au-mission-visual {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    border-radius: 24px; padding: 2.5rem;
    position: relative; overflow: hidden;
    box-shadow: 0 24px 64px rgba(61,31,18,0.25);
  }
  .au-mission-visual::before {
    content: '✦';
    position: absolute; top: 1.5rem; right: 2rem;
    font-size: 1.5rem; color: rgba(232,201,122,0.15);
  }
  .au-mission-visual::after {
    content: '✦';
    position: absolute; bottom: 1.5rem; left: 1.5rem;
    font-size: 2.5rem; color: rgba(232,201,122,0.06);
  }
  .au-mv-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(232,201,122,0.15); border: 1px solid rgba(232,201,122,0.25);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem;
  }
  .au-mv-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 600; color: #e8c97a;
    margin-bottom: 1rem; line-height: 1.2;
  }
  .au-mv-text {
    font-size: 0.87rem; color: rgba(255,255,255,0.75); line-height: 1.75;
    margin-bottom: 1.25rem;
  }
  .au-mv-list { display: flex; flex-direction: column; gap: 0.55rem; }
  .au-mv-list-item {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.82rem; color: rgba(255,255,255,0.82);
  }
  .au-mv-check {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
    background: rgba(232,201,122,0.15);
    display: flex; align-items: center; justify-content: center;
  }

  .au-mission-text { }
  .au-section-sub-left { text-align: left; margin: 0 0 1.5rem; max-width: 100%; }
  .au-mission-p {
    font-size: 0.88rem; color: #6b4a3a; line-height: 1.8;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border-radius: 14px; padding: 1.25rem 1.5rem;
    border-left: 3px solid #c9856a; margin-bottom: 1rem;
  }

  /* ── STORY ── */
  .au-story { background: #fff; }
  .au-story-timeline { max-width: 680px; margin: 0 auto; }
  .au-timeline-item {
    display: flex; gap: 1.25rem; padding-bottom: 2rem; position: relative;
  }
  .au-timeline-item:not(:last-child)::before {
    content: '';
    position: absolute; left: 19px; top: 44px; bottom: 0;
    width: 1px; background: linear-gradient(180deg, #e8c9b8, transparent);
  }
  .au-timeline-dot {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 16px rgba(139,78,46,0.28);
    position: relative; z-index: 1;
  }
  .au-timeline-year {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.72rem; font-weight: 600; color: #8b4e2e;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 0.35rem;
  }
  .au-timeline-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.4rem;
  }
  .au-timeline-text { font-size: 0.84rem; color: #6b4a3a; line-height: 1.7; }

  /* ── WHAT MAKES US DIFFERENT ── */
  .au-different { background: #fdf8f4; }
  .au-diff-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
  }
  @media (max-width: 900px) { .au-diff-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .au-diff-grid { grid-template-columns: 1fr; } }

  .au-diff-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 20px; padding: 1.75rem 1.5rem;
    transition: all 0.25s;
  }
  .au-diff-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(139,78,46,0.1);
    border-color: #e8c9b8;
  }
  .au-diff-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.1rem;
    box-shadow: 0 6px 16px rgba(139,78,46,0.28);
  }
  .au-diff-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.12rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.5rem;
  }
  .au-diff-text { font-size: 0.83rem; color: #6b4a3a; line-height: 1.65; }

  /* ── VALUES ── */
  .au-values { background: #fff; }
  .au-values-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
    max-width: 860px; margin: 0 auto;
  }
  @media (max-width: 600px) { .au-values-grid { grid-template-columns: 1fr; } }
  .au-value-item {
    display: flex; align-items: flex-start; gap: 1rem;
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border: 1px solid #f0ddd5; border-radius: 16px; padding: 1.25rem;
  }
  .au-value-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(139,78,46,0.24);
  }
  .au-value-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #2d1810; margin-bottom: 0.3rem;
  }
  .au-value-text { font-size: 0.81rem; color: #6b4a3a; line-height: 1.6; }

  /* ── TEAM ── */
  .au-team { background: #fdf8f4; }
  .au-team-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
  }
  @media (max-width: 760px) { .au-team-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .au-team-grid { grid-template-columns: 1fr; } }

  .au-team-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 20px; overflow: hidden;
    text-align: center;
    transition: all 0.25s;
  }
  .au-team-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(139,78,46,0.1);
  }
  .au-team-img-wrap {
    height: 200px; overflow: hidden; position: relative;
  }
  .au-team-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.4s;
  }
  .au-team-card:hover .au-team-img { transform: scale(1.05); }
  .au-team-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(61,31,18,0.5) 0%, transparent 50%);
  }
  .au-team-body { padding: 1.25rem 1rem 1.5rem; }
  .au-team-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #2d1810; margin-bottom: 0.2rem;
  }
  .au-team-role {
    font-size: 0.75rem; color: #8b4e2e; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.65rem;
  }
  .au-team-bio { font-size: 0.79rem; color: #9a7060; line-height: 1.6; }

  /* ── CEYCODEZ ── */
  .au-ceycodez {
    background: linear-gradient(135deg, #fdf5ee 0%, #fdf0e8 100%);
    border-top: 1px solid #f0ddd5; border-bottom: 1px solid #f0ddd5;
  }
  .au-ceycodez-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 24px; padding: 2.5rem 3rem;
    display: grid; grid-template-columns: auto 1fr; gap: 2.5rem; align-items: center;
    box-shadow: 0 16px 48px rgba(139,78,46,0.08);
    max-width: 860px; margin: 0 auto;
  }
  @media (max-width: 700px) {
    .au-ceycodez-card { grid-template-columns: 1fr; text-align: center; padding: 2rem 1.5rem; gap: 1.5rem; }
    .au-ceycodez-logo-block { margin: 0 auto; }
  }
  .au-ceycodez-logo-block {
    width: 90px; height: 90px; border-radius: 22px; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 12px 32px rgba(139,78,46,0.3);
  }
  .au-ceycodez-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 700; color: #e8c97a;
    letter-spacing: -0.02em; line-height: 1;
    text-align: center;
  }
  .au-ceycodez-logo-sub {
    font-size: 0.5rem; color: rgba(232,201,122,0.7);
    letter-spacing: 0.06em; text-transform: uppercase; display: block; margin-top: 2px;
  }
  .au-ceycodez-eyebrow {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.4rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  @media (max-width: 700px) { .au-ceycodez-eyebrow { justify-content: center; } }
  .au-ceycodez-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.65rem; line-height: 1.2;
  }
  .au-ceycodez-text {
    font-size: 0.85rem; color: #6b4a3a; line-height: 1.75; margin-bottom: 1rem;
  }
  .au-ceycodez-link {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.35rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; text-decoration: none;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
    transition: all 0.2s;
  }
  .au-ceycodez-link:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.38); }
  .au-ceycodez-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  @media (max-width: 700px) { .au-ceycodez-tags { justify-content: center; } }
  .au-ceycodez-tag {
    font-size: 0.71rem; padding: 0.22rem 0.7rem; border-radius: 99px;
    background: #fdf0e8; color: #8b4e2e;
    border: 1px solid #f0ddd5;
  }

  /* ── CTA ── */
  .au-cta {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 5rem 1.5rem; text-align: center; position: relative; overflow: hidden;
  }
  .au-cta::before {
    content: '✦'; position: absolute; top: 2rem; left: 3rem;
    font-size: 3rem; color: rgba(232,201,122,0.07); pointer-events: none;
  }
  .au-cta::after {
    content: '✦'; position: absolute; bottom: 2rem; right: 3rem;
    font-size: 4rem; color: rgba(232,201,122,0.06); pointer-events: none;
  }
  .au-cta-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 1; }
  .au-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 600;
    color: #fff; margin-bottom: 0.75rem; line-height: 1.2;
  }
  .au-cta-title span { color: #e8c97a; }
  .au-cta-sub { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.65; }
  .au-cta-btns { display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }

  /* ornament */
  .au-ornament {
    text-align: center; font-size: 0.8rem; color: #d4b8a8;
    letter-spacing: 0.2em; padding: 0.5rem 0;
  }
`;

/* ─── Team data ─────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name: "Rajiv Perera",
    role: "CEO & Founder",
    bio: "Visionary leader with 15+ years in tech and a deep passion for Sri Lankan culture and community building.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auhref=format&fit=crop&w=400&q=80",
  },
  {
    name: "Priya Jayawardena",
    role: "Chief Technology Officer",
    bio: "Full-stack architect specialising in secure, scalable platforms. Former lead engineer at a top Colombo fintech.",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auhref=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dinesh Fernando",
    role: "Chief Marketing Officer",
    bio: "Digital marketing strategist with expertise in growing Sri Lankan consumer brands across local and diaspora audiences.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auhref=format&fit=crop&w=400&q=80",
  },
  {
    name: "Nimali Senanayake",
    role: "Head of Member Success",
    bio: "Relationship counsellor and community manager dedicated to ensuring every member feels heard, safe, and supported.",
    img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auhref=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kasun Wickramasinghe",
    role: "Lead Designer",
    bio: "Award-winning UX/UI designer crafting elegant, culturally resonant experiences that feel distinctly Sri Lankan.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auhref=format&fit=crop&w=400&q=80",
  },
  {
    name: "Tharushi Mendis",
    role: "Family & Culture Advisor",
    bio: "Relationship counselor ensuring our compatibility matching honours authentic Sri Lankan family values.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auhref=format&fit=crop&w=400&q=80",
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const AboutUsPage = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="au-root">

        {/* ── HERO ── */}
        <section className="au-hero">
          <div className="au-hero-inner">
            <div className="au-hero-eyebrow">
              <SparklesIcon size={11} /> Our Story
            </div>
            <h1 className="au-hero-title">
              Where Sri Lankan <span className="gold">Hearts</span> Find Home
            </h1>
            <p className="au-hero-subtitle">
              SriMatch was born from a simple belief — that love is most beautiful
              when it honours who you are, where you come from, and the traditions
              that shaped you.
            </p>
            <div className="au-hero-btns">
              <Link href="/register" className="au-btn-gold">
                Join Free <ArrowRightIcon size={14} />
              </Link>
              <Link href="/contact" className="au-btn-outline">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="au-stats-band">
          <div className="au-stats-grid">
            {[
              ["50,000+", "Registered Members"],
              ["12,000+", "Couples Matched"],
              ["4.9 / 5", "Member Rating"],
              ["Since 2020", "Years of Trust"],
            ].map(([num, label]) => (
              <div key={label} className="au-stat-item">
                <div className="au-stat-num">{num}</div>
                <div className="au-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MISSION ── */}
        <section className="au-section au-mission">
          <div className="au-section-inner">
            <div className="au-mission-grid">
              {/* Visual */}
              <div className="au-mission-visual">
                <div className="au-mv-icon">
                  <HeartIcon size={24} style={{ color: "#e8c97a" }} />
                </div>
                <div className="au-mv-title">Our Mission</div>
                <p className="au-mv-text">
                  To empower Sri Lankans worldwide to find life partners who share
                  their culture, values, and vision — through a platform built with
                  integrity, warmth, and deep respect for tradition.
                </p>
                <div className="au-mv-list">
                  {[
                    "Honour Sri Lankan traditions in every feature",
                    "Build the most trusted matrimonial community",
                    "Serve Sri Lankans in Lanka and across the globe",
                    "Make meaningful matches — not just connections",
                  ].map((item, i) => (
                    <div key={i} className="au-mv-list-item">
                      <div className="au-mv-check"><CheckIcon size={10} style={{ color: "#e8c97a" }} /></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* Text */}
              <div className="au-mission-text">
                <div className="au-section-eyebrow" style={{ textAlign: "left" }}>Why we exist</div>
                <h2 className="au-section-title" style={{ textAlign: "left", marginBottom: "1.25rem" }}>
                  Built for <span>Sri Lankan</span> hearts
                </h2>
                <p className="au-mission-p">
                  At SriMatch, our mission is to help Sri Lankan singles find meaningful
                  relationships that respect cultural values and traditions while
                  embracing modern sensibilities. We believe successful relationships
                  are built on shared values, cultural compatibility, and genuine connection.
                </p>
                <p className="au-mission-p">
                  We are committed to creating a safe, respectful, and inclusive platform
                  where people — whether in Colombo, London, Toronto, or Sydney — can
                  discover compatible partners who share their background, beliefs,
                  and life aspirations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── OUR STORY TIMELINE ── */}
        <section className="au-section au-story">
          <div className="au-section-inner">
            <div className="au-section-eyebrow">How we got here</div>
            <h2 className="au-section-title">Our <span>Story</span></h2>
            <p className="au-section-sub">
              From a small idea among friends to Sri Lanka's most trusted matrimonial platform —
              here is the journey that brought us to where we are today.
            </p>
            <div className="au-story-timeline">
              {[
                {
                  year: "2020",
                  icon: <SparklesIcon size={16} style={{ color: "#e8c97a" }} />,
                  heading: "The Idea Takes Root",
                  text: "SriMatch was founded by a group of Sri Lankan professionals who experienced first-hand the difficulty of finding culturally compatible partners. They built a small prototype and launched it to a community of 500 early members.",
                },
                {
                  year: "2021",
                  icon: <ShieldCheckIcon size={16} style={{ color: "#e8c97a" }} />,
                  heading: "NIC Verification Launched",
                  text: "We introduced National Identity Card verification — a first for Sri Lankan matrimonial platforms. Trust and authenticity became core pillars, and verified member sign-ups grew by 300% within the year.",
                },
                {
                  year: "2022",
                  icon: <StarIcon size={16} style={{ color: "#e8c97a" }} />,
                  heading: "Smart Matching Goes Live",
                  text: "We partnered with relationship experts and cultural advisors to build our compatibility engine — honouring traditions and values that thousands of Sri Lankan families rely on when considering a match.",
                },
                {
                  year: "2023",
                  icon: <GlobeIcon size={16} style={{ color: "#e8c97a" }} />,
                  heading: "Going Global",
                  text: "SriMatch expanded its community to reach Sri Lankan diaspora in the UK, Australia, Canada, and the UAE. Premium voice and video calling brought matches closer, no matter the distance.",
                },
                {
                  year: "2024",
                  icon: <TrendingUpIcon size={16} style={{ color: "#e8c97a" }} />,
                  heading: "12,000+ Couples Matched",
                  text: "A landmark milestone — over 12,000 couples traced their relationship back to a first connection on SriMatch. We celebrated by launching our Success Stories feature, letting couples share their journeys.",
                },
                {
                  year: "2025",
                  icon: <ZapIcon size={16} style={{ color: "#e8c97a" }} />,
                  heading: "AI-Powered Matching",
                  text: "Working with our technology partner CeyCodEz, we rolled out an intelligent compatibility engine that learns from member preferences and success patterns to surface even better matches.",
                },
              ].map((item, i) => (
                <div key={i} className="au-timeline-item">
                  <div className="au-timeline-dot">{item.icon}</div>
                  <div>
                    <div className="au-timeline-year">{item.year}</div>
                    <div className="au-timeline-heading">{item.heading}</div>
                    <p className="au-timeline-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT MAKES US DIFFERENT ── */}
        <section className="au-section au-different">
          <div className="au-section-inner">
            <div className="au-section-eyebrow">Why choose us</div>
            <h2 className="au-section-title">What makes SriMatch <span>different</span></h2>
            <p className="au-section-sub">
              Every feature is thoughtfully designed around the values, traditions, and trust that matter most to Sri Lankan families.
            </p>
            <div className="au-diff-grid">
              {[
                { icon: <ShieldCheckIcon size={22} color="#fff" />, title: "NIC Verified Profiles", text: "Every member can get verified using their National Identity Card, giving you confidence that every profile you see is real and trustworthy." },
                {
                icon: <StarIcon size={22} color="#fff" />,
                title: "Smart Compatibility",
                text: "Deep cultural and lifestyle compatibility built right into the platform — a feature your parents will appreciate as much as you do.",
              },
                { icon: <UsersIcon size={22} color="#fff" />, title: "Cultural Compatibility", text: "Religion, ethnicity, caste preferences, and family values are first-class matching criteria — because they matter here." },
                { icon: <GlobeIcon size={22} color="#fff" />, title: "Worldwide Sri Lankan Community", text: "Colombo, London, Toronto, or Sydney — our community spans the globe so distance is never a barrier to love." },
                { icon: <LockIcon size={22} color="#fff" />, title: "Privacy & Data Security", text: "SSL encryption, granular privacy controls, and a strict no-data-selling policy. Your personal information is always yours." },
                { icon: <SmileIcon size={22} color="#fff" />, title: "Family-Friendly Features", text: "We respect the role of family in Sri Lankan relationships and provide tools that allow appropriate family involvement." },
              ].map((f, i) => (
                <div key={i} className="au-diff-card">
                  <div className="au-diff-icon">{f.icon}</div>
                  <div className="au-diff-title">{f.title}</div>
                  <div className="au-diff-text">{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR VALUES ── */}
        <section className="au-section au-values">
          <div className="au-section-inner">
            <div className="au-section-eyebrow">What we stand for</div>
            <h2 className="au-section-title">Our Core <span>Values</span></h2>
            <p className="au-section-sub">
              These are the principles that guide every decision we make — from the features we build to how we treat our members.
            </p>
            <div className="au-values-grid">
              {[
                { icon: <HeartIcon size={20} color="#fff" />, title: "Respect", text: "Every member deserves dignity and respect. We foster a community where differences are celebrated, not judged." },
                { icon: <ShieldCheckIcon size={20} color="#fff" />, title: "Trust", text: "We earn trust through transparency, rigorous verification, and never compromising on member privacy." },
                { icon: <SparklesIcon size={20} color="#fff" />, title: "Authenticity", text: "We encourage real, honest profiles and genuine conversations — because authenticity is the foundation of lasting love." },
                { icon: <GlobeIcon size={20} color="#fff" />, title: "Inclusivity", text: "Sri Lanka is beautifully diverse. SriMatch welcomes all ethnicities, religions, and communities within our culture." },
                { icon: <TrendingUpIcon size={20} color="#fff" />, title: "Innovation", text: "We continuously evolve our platform — AI matching, lifestyle discovery, video calling — always guided by member needs." },
                { icon: <UsersIcon size={20} color="#fff" />, title: "Community", text: "We are more than an app. We are a community of Sri Lankans who believe love is worth celebrating." },
              ].map((v, i) => (
                <div key={i} className="au-value-item">
                  <div className="au-value-icon-wrap">{v.icon}</div>
                  <div>
                    <div className="au-value-title">{v.title}</div>
                    <div className="au-value-text">{v.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="au-section au-team">
          <div className="au-section-inner">
            <div className="au-section-eyebrow">The people behind SriMatch</div>
            <h2 className="au-section-title">Meet Our <span>Team</span></h2>
            <p className="au-section-sub">
              A passionate group of Sri Lankan professionals united by a single goal — helping you find your person.
            </p>
            <div className="au-team-grid">
              {TEAM.map((member, i) => (
                <div key={i} className="au-team-card">
                  <div className="au-team-img-wrap">
                    <img src={member.img} alt={member.name} className="au-team-img" />
                    <div className="au-team-img-overlay" />
                  </div>
                  <div className="au-team-body">
                    <div className="au-team-name">{member.name}</div>
                    <div className="au-team-role">{member.role}</div>
                    <div className="au-team-bio">{member.bio}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CEYCODEZ ── */}
        <section className="au-section au-ceycodez">
          <div className="au-section-inner">
            <div className="au-section-eyebrow">Technology partner</div>
            <h2 className="au-section-title">Powered by <span>CeyCodEz</span></h2>
            <p className="au-section-sub">
              SriMatch is developed, maintained, and owned by CeyCodEz Software Solutions (Pvt) Ltd — a Sri Lankan technology company dedicated to building world-class digital products.
            </p>
            <div className="au-ceycodez-card">
              <div className="au-ceycodez-logo-block">
                <div>
                  <div className="au-ceycodez-logo-text">CC</div>
                  <span className="au-ceycodez-logo-sub">CeyCodEz</span>
                </div>
              </div>
              <div>
                <div className="au-ceycodez-eyebrow">
                  <CodeIcon size={11} /> Developed & Owned by
                </div>
                <div className="au-ceycodez-title">CeyCodEz Software Solutions (Pvt) Ltd</div>
                <p className="au-ceycodez-text">
                  CeyCodEz is a Sri Lanka–based software company specialising in modern web and mobile applications.
                  From concept to deployment, they bring technical excellence and creative vision to every product they build.
                  SriMatch is their flagship consumer platform — crafted with care for the Sri Lankan community at home and abroad.
                </p>
                <div className="au-ceycodez-tags">
                  {["React", "Node.js", "Cloud Infrastructure", "AI Matching", "Mobile Apps", "UI/UX Design"].map(tag => (
                    <span key={tag} className="au-ceycodez-tag">{tag}</span>
                  ))}
                </div>
                <a
                  href="https://ceycodez.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="au-ceycodez-link"
                >
                  Visit CeyCodEz <ExternalLinkIcon size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="au-cta">
          <div className="au-cta-inner">
            <div className="au-ornament" style={{ color: "rgba(232,201,122,0.3)", marginBottom: "1.25rem" }}>✦ &nbsp; ✦ &nbsp; ✦</div>
            <h2 className="au-cta-title">
              Ready to find your <span>forever?</span>
            </h2>
            <p className="au-cta-sub">
              Join over 50,000 Sri Lankans who trust SriMatch to find a meaningful, culturally compatible life partner. Registration is always free.
            </p>
            <div className="au-cta-btns">
              <Link href="/register" className="au-btn-gold">
                Create Free Account <ArrowRightIcon size={14} />
              </Link>
              <Link href="/contact" className="au-btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutUsPage;