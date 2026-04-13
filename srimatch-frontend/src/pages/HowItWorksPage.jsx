import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import {
  UserPlusIcon,
  ShieldCheckIcon,
  SearchIcon,
  HeartIcon,
  MessageCircleIcon,
  CalendarIcon,
  CheckIcon,
  StarIcon,
  SparklesIcon,
  ArrowRightIcon,
  CrownIcon,
  PhoneCallIcon,
  SlidersIcon,
  TrendingUpIcon,
  ZapIcon,
  LockIcon,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .hiw-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .hiw-root {
    font-family: 'DM Sans', sans-serif;
    background: #fdf8f4;
    color: #2d1810;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .hiw-hero {
    background: linear-gradient(160deg, #3d1f12 0%, #6b3526 45%, #8b4e2e 75%, #c9856a 100%);
    padding: 5rem 1.5rem 7rem;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .hiw-hero::before {
    content: '';
    position: absolute; top: -120px; right: -120px;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,201,122,0.1) 0%, transparent 65%);
    pointer-events: none;
  }
  .hiw-hero::after {
    content: '';
    position: absolute; bottom: -80px; left: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,160,160,0.08) 0%, transparent 65%);
    pointer-events: none;
  }
  .hiw-hero-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 1; }

  .hiw-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(232,201,122,0.15); border: 1px solid rgba(232,201,122,0.3);
    color: #e8c97a; font-size: 0.72rem; font-weight: 500;
    padding: 0.3rem 0.9rem; border-radius: 99px;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .hiw-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 600; color: #fff;
    line-height: 1.1; margin-bottom: 1.25rem;
  }
  .hiw-hero-title .gold {
    background: linear-gradient(135deg, #e8c97a, #f4d898);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hiw-hero-subtitle {
    font-size: 1rem; color: rgba(255,255,255,0.7);
    line-height: 1.75; max-width: 540px; margin: 0 auto 2.25rem;
  }
  .hiw-hero-btns { display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }

  .hiw-btn-gold {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.88rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; text-decoration: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 20px rgba(200,160,80,0.36);
    transition: all 0.2s;
  }
  .hiw-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,160,80,0.48); }

  .hiw-btn-outline {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.88rem; font-weight: 500;
    background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
    color: #fff; text-decoration: none;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .hiw-btn-outline:hover { background: rgba(255,255,255,0.2); }

  /* ── QUICK STEPS BAND ── */
  .hiw-quick-band {
    background: #fff;
    border-bottom: 1px solid #f0ddd5;
    padding: 0 1.5rem;
    position: relative; z-index: 10;
  }
  .hiw-quick-inner {
    max-width: 1000px; margin: -2.5rem auto 0;
    display: grid; grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
  }
  @media (max-width: 900px) { .hiw-quick-inner { grid-template-columns: repeat(3, 1fr); margin-top: 0; padding-top: 2.5rem; } }
  @media (max-width: 500px) { .hiw-quick-inner { grid-template-columns: repeat(2, 1fr); } }

  .hiw-quick-item {
    background: #fff;
    border: 1px solid #f0ddd5;
    border-radius: 16px;
    padding: 1.25rem 1rem;
    text-align: center;
    box-shadow: 0 8px 24px rgba(61,31,18,0.08);
    transition: all 0.2s;
  }
  .hiw-quick-item:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(61,31,18,0.13); border-color: #e8c9b8; }
  .hiw-quick-num {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 600; color: #fff;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.6rem;
    box-shadow: 0 4px 12px rgba(139,78,46,0.28);
  }
  .hiw-quick-label {
    font-size: 0.72rem; font-weight: 500; color: #4a3028; line-height: 1.4;
  }

  /* ── SHARED SECTION ── */
  .hiw-section { padding: 5rem 1.5rem; }
  .hiw-section-inner { max-width: 1100px; margin: 0 auto; }
  .hiw-section-eyebrow {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e;
    margin-bottom: 0.6rem; text-align: center;
  }
  .hiw-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 600;
    color: #2d1810; text-align: center; line-height: 1.2;
    margin-bottom: 0.75rem;
  }
  .hiw-section-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hiw-section-sub {
    font-size: 0.9rem; color: #9a7060; text-align: center;
    max-width: 560px; margin: 0 auto 3.5rem; line-height: 1.7;
  }

  /* ── STEPS ── */
  .hiw-steps { background: #fdf8f4; }
  .hiw-steps-list { display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto; }

  .hiw-step-card {
    display: grid; grid-template-columns: auto 1fr;
    gap: 2rem; align-items: start;
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 24px; padding: 2rem 2.25rem;
    box-shadow: 0 8px 32px rgba(61,31,18,0.06);
    transition: all 0.25s;
    position: relative; overflow: hidden;
  }
  .hiw-step-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #3d1f12, #8b4e2e, #c9856a);
    opacity: 0; transition: opacity 0.25s;
  }
  .hiw-step-card:hover { transform: translateY(-4px); box-shadow: 0 20px 56px rgba(61,31,18,0.1); border-color: #e8c9b8; }
  .hiw-step-card:hover::before { opacity: 1; }
  @media (max-width: 640px) { .hiw-step-card { grid-template-columns: 1fr; gap: 1.25rem; padding: 1.5rem; } }

  .hiw-step-left { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
  .hiw-step-num-wrap {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 10px 28px rgba(139,78,46,0.32);
    flex-shrink: 0;
    position: relative;
  }
  .hiw-step-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 700; color: #fff; line-height: 1;
  }
  .hiw-step-icon-wrap {
    width: 44px; height: 44px; border-radius: 14px;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border: 1px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .hiw-step-content { }
  .hiw-step-year {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.35rem;
  }
  .hiw-step-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.45rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.65rem; line-height: 1.2;
  }
  .hiw-step-text {
    font-size: 0.86rem; color: #6b4a3a; line-height: 1.75;
    margin-bottom: 1rem;
  }
  .hiw-step-checklist { display: flex; flex-direction: column; gap: 0.45rem; }
  .hiw-step-check-item {
    display: flex; align-items: center; gap: 0.55rem;
    font-size: 0.81rem; color: #4a3028;
  }
  .hiw-check-dot {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(139,78,46,0.22);
  }
  .hiw-step-tip {
    display: inline-flex; align-items: center; gap: 0.4rem;
    margin-top: 1rem; padding: 0.45rem 0.9rem; border-radius: 99px;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border: 1px solid #f0ddd5;
    font-size: 0.76rem; color: #8b4e2e; font-weight: 500;
  }

  /* ── PREMIUM ── */
  .hiw-premium { background: #fff; }
  .hiw-premium-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
  }
  @media (max-width: 900px) { .hiw-premium-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .hiw-premium-grid { grid-template-columns: 1fr; } }

  .hiw-prem-card {
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border: 1px solid #f0ddd5; border-radius: 20px; padding: 1.75rem 1.5rem;
    transition: all 0.25s;
  }
  .hiw-prem-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(139,78,46,0.1); border-color: #e8c9b8; }
  .hiw-prem-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.1rem;
    box-shadow: 0 6px 16px rgba(139,78,46,0.28);
  }
  .hiw-prem-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: #2d1810; margin-bottom: 0.45rem;
  }
  .hiw-prem-text { font-size: 0.82rem; color: #6b4a3a; line-height: 1.65; }

  /* ── PREMIUM HIGHLIGHT BAND ── */
  .hiw-prem-band {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    border-radius: 24px; padding: 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
    gap: 2rem; flex-wrap: wrap;
    max-width: 900px; margin: 3rem auto 0;
    box-shadow: 0 20px 56px rgba(61,31,18,0.22);
    position: relative; overflow: hidden;
  }
  .hiw-prem-band::before {
    content: '✦'; position: absolute; top: 1rem; right: 2rem;
    font-size: 2rem; color: rgba(232,201,122,0.1);
  }
  .hiw-prem-band-text { }
  .hiw-prem-band-label {
    font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(232,201,122,0.7);
    margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.35rem;
  }
  .hiw-prem-band-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600; color: #fff; line-height: 1.2; margin-bottom: 0.5rem;
  }
  .hiw-prem-band-title span { color: #e8c97a; }
  .hiw-prem-band-sub { font-size: 0.84rem; color: rgba(255,255,255,0.65); line-height: 1.6; }
  .hiw-prem-band-price {
    display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; flex-shrink: 0;
  }
  @media (max-width: 600px) { .hiw-prem-band-price { align-items: flex-start; } }
  .hiw-prem-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 600; color: #e8c97a; line-height: 1;
  }
  .hiw-prem-per { font-size: 0.74rem; color: rgba(255,255,255,0.5); }

  /* ── TIPS ── */
  .hiw-tips { background: #fdf8f4; }
  .hiw-tips-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
    max-width: 860px; margin: 0 auto;
  }
  @media (max-width: 600px) { .hiw-tips-grid { grid-template-columns: 1fr; } }
  .hiw-tip-item {
    display: flex; align-items: flex-start; gap: 1rem;
    background: #fff; border: 1px solid #f0ddd5; border-radius: 16px; padding: 1.25rem;
  }
  .hiw-tip-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(139,78,46,0.24);
  }
  .hiw-tip-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 600; color: #2d1810; margin-bottom: 0.3rem;
  }
  .hiw-tip-text { font-size: 0.8rem; color: #6b4a3a; line-height: 1.6; }

  /* ── CTA ── */
  .hiw-cta {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 5rem 1.5rem; text-align: center; position: relative; overflow: hidden;
  }
  .hiw-cta::before { content: '✦'; position: absolute; top: 2rem; left: 3rem; font-size: 3rem; color: rgba(232,201,122,0.07); }
  .hiw-cta::after { content: '✦'; position: absolute; bottom: 2rem; right: 3rem; font-size: 4rem; color: rgba(232,201,122,0.06); }
  .hiw-cta-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 1; }
  .hiw-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 600;
    color: #fff; margin-bottom: 0.75rem; line-height: 1.2;
  }
  .hiw-cta-title span { color: #e8c97a; }
  .hiw-cta-sub { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.65; }
  .hiw-cta-btns { display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }

  .hiw-trust-row {
    display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-top: 2rem;
  }
  .hiw-trust-item {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.76rem; color: rgba(255,255,255,0.55);
  }

  .hiw-ornament {
    text-align: center; font-size: 0.8rem; color: #d4b8a8;
    letter-spacing: 0.2em; padding: 0.5rem 0;
  }
`;

/* ─── Steps data ────────────────────────────────────────────────────────── */
const STEPS = [
  {
    num: "1",
    icon: <UserPlusIcon size={20} style={{ color: "#8b4e2e" }} />,
    label: "Create Profile",
    heading: "Sign Up & Build Your Profile",
    text: "Your journey begins by creating a free SriMatch account. A detailed, honest profile is your first impression — make it count. Share your personality, values, and what you're looking for in a life partner.",
    checks: [
      "Personal details — age, education, profession & district",
      "Cultural background — religion, ethnicity & family values",
      "Lifestyle preferences, hobbies & interests",
      "Horoscope details (optional but highly recommended by families)",
      "Upload 3 or more clear, recent photos",
    ],
    tip: "✦  Complete profiles get 3× more connection requests",
  },
  {
    num: "2",
    icon: <ShieldCheckIcon size={20} style={{ color: "#8b4e2e" }} />,
    label: "Get Verified",
    heading: "Verify Your Identity with NIC",
    text: "Trust is at the heart of SriMatch. Submit your National Identity Card (NIC) or passport to earn our trusted verification badge — the green tick that tells others your profile is real and authentic.",
    checks: [
      "Upload a clear copy of your NIC or passport",
      "Our team reviews submissions within 24–48 hours",
      "Earn a verified badge displayed on your profile",
      "Verified profiles appear higher in search results",
    ],
    tip: "✦  Verified members receive 60% more responses",
  },
  {
    num: "3",
    icon: <SearchIcon size={20} style={{ color: "#8b4e2e" }} />,
    label: "Browse Matches",
    heading: "Discover Compatible Profiles",
    text: "Browse daily AI-powered match suggestions tailored to your preferences, or search with advanced filters. Our algorithm weighs cultural compatibility, location, education, lifestyle — and horoscope if you choose.",
    checks: [
      "Daily personalised match suggestions",
      "50+ search filters including district, religion & caste",
      "Horoscope compatibility score on every profile",
      "Save favourites to revisit later",
      "See who's recently active for faster responses",
    ],
    tip: "✦  Premium members get priority placement in results",
  },
  {
    num: "4",
    icon: <HeartIcon size={20} style={{ color: "#8b4e2e" }} />,
    label: "Show Interest",
    heading: "Express Interest & Connect",
    text: "Found someone special? Send a connection request with a warm, personalised message, or simply like their profile to show interest. If they feel the same, you're officially connected and can begin chatting.",
    checks: [
      "Send a personalised connection request",
      "Like profiles to express interest",
      "See mutual likes with Premium",
      "Family members can send requests on your behalf",
    ],
    tip: "✦  Personalised messages get accepted 2× more often",
  },
  {
    num: "5",
    icon: <MessageCircleIcon size={20} style={{ color: "#8b4e2e" }} />,
    label: "Communicate",
    heading: "Chat, Call & Get to Know Each Other",
    text: "Once connected, open a secure conversation inside SriMatch. Take your time — meaningful relationships are built through genuine dialogue. Premium members can also make in-app voice and video calls.",
    checks: [
      "End-to-end encrypted messaging",
      "Share additional photos in private conversations",
      "Voice & video calls (Premium)",
      "Smart conversation starters to break the ice",
      "Control when to share contact details outside the app",
    ],
    tip: "✦  Your privacy settings are always in your hands",
  },
  {
    num: "6",
    icon: <CalendarIcon size={20} style={{ color: "#8b4e2e" }} />,
    label: "Meet in Person",
    heading: "Take the Next Step & Meet",
    text: "When the time feels right, plan your first meeting. SriMatch is built with Sri Lankan family values in mind — involve your loved ones as much or as little as you choose. This is where your story truly begins.",
    checks: [
      "Use our in-app meeting scheduler",
      "Choose safe, public locations for first meetings",
      "Follow our safety guidelines for in-person meetings",
      "Share your story in our Success Stories feature after you find the one",
    ],
    tip: "✦  12,000+ couples have found love on SriMatch",
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
const HowItWorksPage = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="hiw-root">

        {/* ── HERO ── */}
        <section className="hiw-hero">
          <div className="hiw-hero-inner">
            <div className="hiw-hero-eyebrow">
              <SparklesIcon size={11} /> Your Journey to Love
            </div>
            <h1 className="hiw-hero-title">
              How <span className="gold">SriMatch</span> Works
            </h1>
            <p className="hiw-hero-subtitle">
              Six thoughtful steps — from your first profile to your first meeting —
              designed around the values and traditions Sri Lankan families hold dear.
            </p>
            <div className="hiw-hero-btns">
              <Link to="/register" className="hiw-btn-gold">
                Get Started Free <ArrowRightIcon size={14} />
              </Link>
              <Link to="/contact" className="hiw-btn-outline">
                Have Questions?
              </Link>
            </div>
          </div>
        </section>

        {/* ── QUICK STEP BAND ── */}
        <div className="hiw-quick-band">
          <div className="hiw-quick-inner">
            {STEPS.map((s, i) => (
              <div key={i} className="hiw-quick-item">
                <div className="hiw-quick-num">{s.num}</div>
                <div className="hiw-quick-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEPS DETAIL ── */}
        <section className="hiw-section hiw-steps" style={{ paddingTop: "5rem" }}>
          <div className="hiw-section-inner">
            <div className="hiw-section-eyebrow">Step by step</div>
            <h2 className="hiw-section-title">Your path to <span>finding the one</span></h2>
            <p className="hiw-section-sub">
              We've made finding a culturally compatible life partner as simple,
              safe, and meaningful as possible — from the very first click.
            </p>

            <div className="hiw-steps-list">
              {STEPS.map((step, i) => (
                <div key={i} className="hiw-step-card">
                  {/* Left */}
                  <div className="hiw-step-left">
                    <div className="hiw-step-num-wrap">
                      <span className="hiw-step-num">{step.num}</span>
                    </div>
                    <div className="hiw-step-icon-wrap">{step.icon}</div>
                  </div>
                  {/* Right */}
                  <div className="hiw-step-content">
                    <div className="hiw-step-year">Step {step.num} of {STEPS.length}</div>
                    <div className="hiw-step-heading">{step.heading}</div>
                    <p className="hiw-step-text">{step.text}</p>
                    <div className="hiw-step-checklist">
                      {step.checks.map((c, j) => (
                        <div key={j} className="hiw-step-check-item">
                          <div className="hiw-check-dot">
                            <CheckIcon size={10} color="#fff" />
                          </div>
                          {c}
                        </div>
                      ))}
                    </div>
                    <div className="hiw-step-tip">{step.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PREMIUM FEATURES ── */}
        <section className="hiw-section hiw-premium">
          <div className="hiw-section-inner">
            <div className="hiw-section-eyebrow">Unlock more</div>
            <h2 className="hiw-section-title">Find your match <span>3× faster</span> with Premium</h2>
            <p className="hiw-section-sub">
              Thousands of couples found each other because they unlocked the tools that gave them
              the best possible chance of a meaningful, lasting connection.
            </p>

            <div className="hiw-premium-grid">
              {[
                {
                  icon: <HeartIcon size={22} color="#fff" />,
                  title: "Unlimited Daily Likes",
                  text: "Remove the daily like limit and express interest in as many compatible profiles as you wish, every single day.",
                },
                {
                  icon: <PhoneCallIcon size={22} color="#fff" />,
                  title: "Voice & Video Calls",
                  text: "Get to know your match better with secure, in-app voice and video calls — before sharing personal contact details.",
                },
                {
                  icon: <StarIcon size={22} color="#fff" />,
                  title: "Detailed Horoscope Reports",
                  text: "Full Jyotisha chart-to-chart compatibility analysis — the kind of trusted report your family will rely on when considering a match.",
                },
                {
                  icon: <SlidersIcon size={22} color="#fff" />,
                  title: "50+ Advanced Filters",
                  text: "Filter by district, caste, religion, education, income, height, and lifestyle for laser-precise search results.",
                },
                {
                  icon: <TrendingUpIcon size={22} color="#fff" />,
                  title: "Monthly Profile Boost",
                  text: "Get featured at the top of search results for 7 days each month, dramatically increasing your visibility and reach.",
                },
                {
                  icon: <LockIcon size={22} color="#fff" />,
                  title: "Incognito Browsing",
                  text: "Explore profiles privately without appearing in their visitors list — browse with complete confidence and discretion.",
                },
              ].map((f, i) => (
                <div key={i} className="hiw-prem-card">
                  <div className="hiw-prem-icon">{f.icon}</div>
                  <div className="hiw-prem-title">{f.title}</div>
                  <div className="hiw-prem-text">{f.text}</div>
                </div>
              ))}
            </div>

            {/* Premium CTA band */}
            <div className="hiw-prem-band">
              <div className="hiw-prem-band-text">
                <div className="hiw-prem-band-label">
                  <CrownIcon size={11} /> SriMatch Premium
                </div>
                <div className="hiw-prem-band-title">
                  Start your Premium journey <span>today</span>
                </div>
                <p className="hiw-prem-band-sub">
                  Upgrade in minutes and instantly unlock every Premium feature.
                  Cancel anytime — no commitments, no hidden fees.
                </p>
              </div>
              <div className="hiw-prem-band-price">
                <div>
                  <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>From</div>
                  <div className="hiw-prem-amount">$20</div>
                  <div className="hiw-prem-per">per month</div>
                </div>
                <Link to="/subscription" className="hiw-btn-gold" style={{ whiteSpace: "nowrap" }}>
                  <CrownIcon size={14} /> View Premium Plans
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TIPS FOR SUCCESS ── */}
        <section className="hiw-section hiw-tips">
          <div className="hiw-section-inner">
            <div className="hiw-section-eyebrow">Advice from us</div>
            <h2 className="hiw-section-title">Tips for <span>meaningful</span> matches</h2>
            <p className="hiw-section-sub">
              After helping over 12,000 couples find each other, we've learned what makes
              the difference between a browse and a lifelong bond.
            </p>
            <div className="hiw-tips-grid">
              {[
                {
                  icon: <UserPlusIcon size={20} color="#fff" />,
                  title: "Be Genuine in Your Profile",
                  text: "Authentic profiles attract authentic people. Avoid exaggeration — the right match will love you for exactly who you are.",
                },
                {
                  icon: <SparklesIcon size={20} color="#fff" />,
                  title: "Include Your Horoscope",
                  text: "Even if you're undecided about astrology, adding your horoscope details opens the door to families who consider it important.",
                },
                {
                  icon: <MessageCircleIcon size={20} color="#fff" />,
                  title: "Personalise Your First Message",
                  text: "Reference something specific from their profile. A thoughtful opener shows genuine interest and gets far more replies.",
                },
                {
                  icon: <ShieldCheckIcon size={20} color="#fff" />,
                  title: "Get Verified Early",
                  text: "The NIC verified badge builds immediate trust. Do it as soon as you sign up to maximise your profile's performance.",
                },
                {
                  icon: <HeartIcon size={20} color="#fff" />,
                  title: "Involve Family Thoughtfully",
                  text: "Sri Lankan matrimony often involves family. SriMatch supports family participation — share profiles with a parent when you feel ready.",
                },
                {
                  icon: <ZapIcon size={20} color="#fff" />,
                  title: "Stay Active on the Platform",
                  text: "Active members appear higher in results. Log in regularly, respond promptly, and keep your profile photo fresh.",
                },
              ].map((t, i) => (
                <div key={i} className="hiw-tip-item">
                  <div className="hiw-tip-icon-wrap">{t.icon}</div>
                  <div>
                    <div className="hiw-tip-title">{t.title}</div>
                    <div className="hiw-tip-text">{t.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="hiw-cta">
          <div className="hiw-cta-inner">
            <div className="hiw-ornament" style={{ color: "rgba(232,201,122,0.3)", marginBottom: "1.25rem" }}>✦ &nbsp; ✦ &nbsp; ✦</div>
            <h2 className="hiw-cta-title">
              Ready to start your <span>journey?</span>
            </h2>
            <p className="hiw-cta-sub">
              Join over 50,000 Sri Lankans who trust SriMatch to find a meaningful,
              culturally compatible life partner. Registration is always free.
            </p>
            <div className="hiw-cta-btns">
              <Link to="/register" className="hiw-btn-gold">
                Create Free Account <ArrowRightIcon size={14} />
              </Link>
              <Link to="/contact" className="hiw-btn-outline">
                Contact Us
              </Link>
            </div>
            <div className="hiw-trust-row">
              <div className="hiw-trust-item"><CheckIcon size={12} /> Free to join</div>
              <div className="hiw-trust-item"><ShieldCheckIcon size={12} /> NIC verified profiles</div>
              <div className="hiw-trust-item"><StarIcon size={12} /> Horoscope matching</div>
              <div className="hiw-trust-item"><ZapIcon size={12} /> Cancel anytime</div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HowItWorksPage;