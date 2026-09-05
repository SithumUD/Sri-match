"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Footer from "../components/Footer";
import {
  ChevronDownIcon,
  SearchIcon,
  SparklesIcon,
  ArrowRightIcon,
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
  MessageCircleIcon,
  CrownIcon,
  LockIcon,
  CreditCardIcon,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .faq-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .faq-root {
    font-family: 'DM Sans', sans-serif;
    background: #fdf8f4;
    color: #2d1810;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .faq-hero {
    background: linear-gradient(160deg, #3d1f12 0%, #6b3526 45%, #8b4e2e 75%, #c9856a 100%);
    padding: 5rem 1.5rem 7rem;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .faq-hero::before {
    content: '';
    position: absolute; top: -120px; right: -120px;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,201,122,0.1) 0%, transparent 65%);
    pointer-events: none;
  }
  .faq-hero::after {
    content: '';
    position: absolute; bottom: -80px; left: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,160,160,0.08) 0%, transparent 65%);
    pointer-events: none;
  }
  .faq-hero-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 1; }

  .faq-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(232,201,122,0.15); border: 1px solid rgba(232,201,122,0.3);
    color: #e8c97a; font-size: 0.72rem; font-weight: 500;
    padding: 0.3rem 0.9rem; border-radius: 99px;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .faq-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    font-weight: 600; color: #fff;
    line-height: 1.1; margin-bottom: 1.25rem;
  }
  .faq-hero-title .gold {
    background: linear-gradient(135deg, #e8c97a, #f4d898);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .faq-hero-subtitle {
    font-size: 1rem; color: rgba(255,255,255,0.7);
    line-height: 1.75; max-width: 500px; margin: 0 auto 2.25rem;
  }

  /* ── SEARCH BOX (floated card) ── */
  .faq-search-wrap {
    max-width: 640px; margin: -2rem auto 0;
    padding: 0 1.5rem;
    position: relative; z-index: 10;
  }
  .faq-search-card {
    background: #fff;
    border: 1px solid #f0ddd5;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 16px 48px rgba(61,31,18,0.14);
  }
  .faq-search-label {
    font-size: 0.78rem; font-weight: 500; color: #8b4e2e;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 0.65rem; display: block;
  }
  .faq-search-field {
    position: relative;
  }
  .faq-search-field svg {
    position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%);
    color: #c9856a; pointer-events: none;
  }
  .faq-search-input {
    width: 100%;
    border: 1.5px solid #f0ddd5;
    border-radius: 12px;
    padding: 0.75rem 1rem 0.75rem 2.6rem;
    font-size: 0.9rem;
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: #fdf8f4;
    transition: all 0.2s;
    outline: none;
  }
  .faq-search-input::placeholder { color: #c4a898; }
  .faq-search-input:focus {
    border-color: #c9856a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(201,133,106,0.12);
  }

  /* ── MAIN LAYOUT ── */
  .faq-main {
    max-width: 1100px; margin: 0 auto;
    padding: 4.5rem 1.5rem 3rem;
    display: grid; grid-template-columns: 260px 1fr;
    gap: 2.5rem; align-items: start;
  }
  @media (max-width: 800px) { .faq-main { grid-template-columns: 1fr; } }

  /* ── SIDEBAR ── */
  .faq-sidebar {}
  .faq-sidebar-title {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: #8b4e2e;
    margin-bottom: 0.85rem; padding-left: 0.25rem;
  }
  .faq-cat-list { display: flex; flex-direction: column; gap: 0.35rem; }
  .faq-cat-btn {
    display: flex; align-items: center; gap: 0.65rem;
    width: 100%; padding: 0.65rem 0.85rem;
    border-radius: 12px; border: 1px solid transparent;
    background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.84rem; font-weight: 500; color: #6b4a3a;
    text-align: left; transition: all 0.2s;
  }
  .faq-cat-btn:hover { background: #fff; border-color: #f0ddd5; color: #2d1810; }
  .faq-cat-btn.active {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border-color: transparent;
    box-shadow: 0 6px 18px rgba(139,78,46,0.22);
  }
  .faq-cat-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(201,133,106,0.12);
    transition: background 0.2s;
  }
  .faq-cat-btn.active .faq-cat-icon { background: rgba(255,255,255,0.15); }
  .faq-cat-count {
    margin-left: auto; font-size: 0.72rem;
    background: rgba(201,133,106,0.15); color: #8b4e2e;
    padding: 0.1rem 0.5rem; border-radius: 99px;
    transition: all 0.2s;
  }
  .faq-cat-btn.active .faq-cat-count { background: rgba(255,255,255,0.2); color: rgba(255,255,255,0.85); }

  /* Mobile category row */
  .faq-cat-row-mobile {
    display: none; overflow-x: auto;
    padding: 0 1.5rem 0; gap: 0.5rem;
    padding-bottom: 0.5rem;
    margin-bottom: 2rem;
  }
  @media (max-width: 800px) {
    .faq-cat-row-mobile { display: flex; }
    .faq-sidebar { display: none; }
  }
  .faq-cat-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1rem; border-radius: 99px;
    font-size: 0.78rem; font-weight: 500; white-space: nowrap;
    border: 1px solid #f0ddd5; background: #fff; color: #6b4a3a;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .faq-cat-pill.active {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border-color: transparent;
  }

  /* ── FAQ PANEL ── */
  .faq-panel {}
  .faq-panel-header {
    margin-bottom: 1.5rem;
  }
  .faq-panel-eyebrow {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: #8b4e2e; margin-bottom: 0.35rem;
  }
  .faq-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 600; color: #2d1810; line-height: 1.2;
  }
  .faq-panel-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .faq-panel-count { font-size: 0.8rem; color: #9a7060; margin-top: 0.25rem; }

  /* Search results header */
  .faq-search-results-header {
    font-size: 0.84rem; color: #9a7060; margin-bottom: 1.5rem;
  }
  .faq-search-results-header strong { color: #2d1810; }

  /* Accordion */
  .faq-accordion { display: flex; flex-direction: column; gap: 0.6rem; }

  .faq-item {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 16px; overflow: hidden;
    transition: all 0.2s;
  }
  .faq-item:hover { border-color: #e8c9b8; box-shadow: 0 6px 24px rgba(61,31,18,0.07); }
  .faq-item.open { border-color: #c9856a; box-shadow: 0 8px 32px rgba(139,78,46,0.1); }

  .faq-q {
    display: flex; justify-content: space-between; align-items: center; gap: 1rem;
    padding: 1.1rem 1.4rem; cursor: pointer;
    background: transparent; border: none; width: 100%;
    text-align: left; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .faq-q:hover { background: #fdf5ee; }
  .faq-item.open .faq-q { background: linear-gradient(135deg, #fdf5ee, #faf0e8); }

  .faq-q-text {
    font-size: 0.9rem; font-weight: 500; color: #2d1810; line-height: 1.45;
    flex: 1;
  }
  .faq-item.open .faq-q-text { color: #3d1f12; }

  .faq-chevron {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: #fdf0e8; border: 1px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.25s; color: #8b4e2e;
  }
  .faq-item.open .faq-chevron {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    border-color: transparent;
    transform: rotate(180deg);
  }
  .faq-item.open .faq-chevron svg { color: #fff; }

  .faq-a {
    padding: 0 1.4rem 1.2rem;
    border-top: 1px solid #f5ede5;
  }
  .faq-a-inner {
    padding-top: 0.9rem;
    font-size: 0.85rem; color: #6b4a3a; line-height: 1.78;
  }

  /* No results */
  .faq-no-results {
    text-align: center; padding: 3rem 1.5rem;
    background: #fff; border: 1px solid #f0ddd5; border-radius: 20px;
  }
  .faq-no-results-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf5ee, #faf0e8);
    border: 1px solid #f0ddd5;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
  }
  .faq-no-results-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #2d1810; margin-bottom: 0.5rem;
  }
  .faq-no-results-sub { font-size: 0.84rem; color: #9a7060; margin-bottom: 1.25rem; }
  .faq-clear-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.5rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .faq-clear-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(139,78,46,0.24); }

  /* ── CTA ── */
  .faq-cta {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 5rem 1.5rem; text-align: center; position: relative; overflow: hidden;
  }
  .faq-cta::before { content: '✦'; position: absolute; top: 2rem; left: 3rem; font-size: 3rem; color: rgba(232,201,122,0.07); }
  .faq-cta::after { content: '✦'; position: absolute; bottom: 2rem; right: 3rem; font-size: 4rem; color: rgba(232,201,122,0.06); }
  .faq-cta-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 1; }
  .faq-cta-ornament { color: rgba(232,201,122,0.3); margin-bottom: 1.25rem; font-size: 0.9rem; letter-spacing: 0.3em; }
  .faq-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 600;
    color: #fff; margin-bottom: 0.75rem; line-height: 1.2;
  }
  .faq-cta-title span { color: #e8c97a; }
  .faq-cta-sub { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.65; }
  .faq-cta-btns { display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }

  .faq-btn-gold {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.9rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; text-decoration: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 20px rgba(200,160,80,0.36);
    transition: all 0.2s;
  }
  .faq-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,160,80,0.48); }

  .faq-btn-outline {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.9rem; font-weight: 500;
    background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
    color: #fff; text-decoration: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .faq-btn-outline:hover { background: rgba(255,255,255,0.2); }

  .faq-trust-row {
    display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-top: 2rem;
  }
  .faq-trust-item {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.76rem; color: rgba(255,255,255,0.55);
  }

  /* ── STILL HAVE QUESTIONS ── */
  .faq-support-banner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 1.5rem 4rem;
  }
  .faq-support-card {
    background: linear-gradient(135deg, #fdf5ee 0%, #faf0f8 100%);
    border: 1px solid #f0ddd5; border-radius: 24px;
    padding: 2.5rem; display: flex; align-items: center;
    justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }
  .faq-support-icon {
    width: 64px; height: 64px; border-radius: 18px; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 10px 28px rgba(139,78,46,0.28);
  }
  .faq-support-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600; color: #2d1810; margin-bottom: 0.35rem;
  }
  .faq-support-sub { font-size: 0.86rem; color: #9a7060; line-height: 1.6; }
  .faq-support-left { display: flex; align-items: center; gap: 1.25rem; }
`;

/* ─── Category config ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "general",   label: "General",           icon: <SparklesIcon size={14} /> },
  { id: "account",   label: "Account & Profile", icon: <UsersIcon size={14} /> },
  { id: "matching",  label: "Matching",           icon: <HeartIcon size={14} /> },
  { id: "messaging", label: "Messaging",          icon: <MessageCircleIcon size={14} /> },
  { id: "premium",   label: "Premium",            icon: <CrownIcon size={14} /> },
  { id: "privacy",   label: "Privacy & Safety",   icon: <LockIcon size={14} /> },
  { id: "payment",   label: "Payment & Billing",  icon: <CreditCardIcon size={14} /> },
];

/* ─── FAQ data ─────────────────────────────────────────────────────────── */
const FAQS = {
  general: [
    {
      id: "g1",
      q: "What is SriMatch?",
      a: "SriMatch is a matrimonial and dating platform built exclusively for Sri Lankans. We combine traditional values — horoscope compatibility, family involvement, cultural and religious matching — with modern technology to help you find a life partner who truly understands where you come from.",
    },
    {
      id: "g2",
      q: "How is SriMatch different from other dating sites?",
      a: "SriMatch is purpose-built for the Sri Lankan community. Unlike generic dating apps, we offer NIC-verified profiles, traditional Jyotisha horoscope matching, district-level location filters, family-assisted profile creation, and cultural compatibility criteria including religion, caste, and ethnicity. Every feature exists to honour Sri Lankan traditions.",
    },
    {
      id: "g3",
      q: "Is SriMatch only for people living in Sri Lanka?",
      a: "Not at all. SriMatch serves Sri Lankans worldwide — in Colombo, London, Toronto, Sydney, Dubai, and beyond. Our diaspora community is large and active. Distance is never a barrier; Premium members can make in-app voice and video calls.",
    },
    {
      id: "g4",
      q: "Can I use SriMatch for free?",
      a: "Yes. The Free plan lets you create a profile, browse profiles, and send up to 5 connection requests per day. Upgrading to Premium unlocks unlimited likes, voice & video calls, horoscope reports, advanced search filters, and much more.",
    },
    {
      id: "g5",
      q: "Is SriMatch available as a mobile app?",
      a: "Yes — SriMatch is available on both iOS (App Store) and Android (Google Play), as well as on the web. Your profile and matches sync seamlessly across all devices.",
    },
  ],
  account: [
    {
      id: "a1",
      q: "How do I create an account on SriMatch?",
      a: "Click 'Create Free Account' on the homepage. Enter your name, email, and a password, then follow the guided profile builder — personal details, cultural background, horoscope information, and photos. The more complete your profile, the better your matches.",
    },
    {
      id: "a2",
      q: "Can I create a profile on behalf of my son or daughter?",
      a: "Yes. During registration you can indicate that you're creating the profile on a family member's behalf. The person must be aware of and consent to the profile. Many Sri Lankan families manage profiles together — we fully support that tradition.",
    },
    {
      id: "a3",
      q: "How many photos can I upload?",
      a: "Free members can upload up to 5 photos. Premium members can upload up to 10. We recommend at least 3 clear, recent, face-forward photos — profiles with good photos receive significantly more interest.",
    },
    {
      id: "a4",
      q: "Why should I verify my profile?",
      a: "NIC verification earns your profile a trusted green badge, giving other members confidence that you're a real person. Verified profiles appear higher in search results and receive up to 60% more responses. Verification involves uploading a copy of your National Identity Card or passport.",
    },
    {
      id: "a5",
      q: "How do I hide or delete my account?",
      a: "To hide your profile temporarily, go to Settings → Privacy → Hide My Profile. Your matches and messages are preserved. To permanently delete your account, go to Settings → Delete Account. Deletion is irreversible and removes all your data from our system.",
    },
  ],
  matching: [
    {
      id: "m1",
      q: "How does SriMatch's matching algorithm work?",
      a: "Our algorithm weighs your stated preferences — religion, ethnicity, education, profession, district, lifestyle, and age range — against those of other members. Premium members also receive horoscope-weighted matching, where astrological compatibility influences suggestions. The more complete your profile, the more accurate your matches.",
    },
    {
      id: "m2",
      q: "How does horoscope compatibility work?",
      a: "We use traditional Sri Lankan Jyotisha astrological principles to calculate chart-to-chart compatibility. When both members have entered their birth date, time, and place, we compute a detailed compatibility score. Premium members receive the full report — a document many Sri Lankan families use as part of their decision-making process.",
    },
    {
      id: "m3",
      q: "How many connection requests can I send?",
      a: "Free members can send up to 5 requests per day. Premium members enjoy unlimited daily requests. Personalised messages alongside requests are accepted significantly more often than blank requests.",
    },
    {
      id: "m4",
      q: "Can I see who has viewed my profile or liked me?",
      a: "Both features are available to Premium members. Free members can see how many views and likes their profile has received, but not the specific individuals. Upgrading to Premium unlocks full visitor and liker lists.",
    },
    {
      id: "m5",
      q: "What is a Profile Boost?",
      a: "A Profile Boost places your profile at the top of search results and match recommendations for 7 days, significantly increasing your visibility. Premium members receive one free boost per month and can purchase additional boosts.",
    },
  ],
  messaging: [
    {
      id: "msg1",
      q: "Can I message anyone on SriMatch?",
      a: "You can message members who have accepted your connection request or whose request you have accepted. This mutual-interest model ensures every conversation starts from a place of genuine interest on both sides.",
    },
    {
      id: "msg2",
      q: "How many messages can I send as a free member?",
      a: "Free members can send up to 30 messages per month across all active connections. Premium members enjoy completely unlimited messaging.",
    },
    {
      id: "msg3",
      q: "Are voice and video calls available?",
      a: "Yes — secure in-app voice and video calls are a Premium feature. You can connect face-to-face without sharing personal phone numbers, keeping your privacy fully intact until you're ready.",
    },
    {
      id: "msg4",
      q: "Are my messages private?",
      a: "All messages are private and visible only to you and the recipient. Our automated systems monitor for inappropriate content to maintain community standards, but message content is never shared with other members or third parties.",
    },
    {
      id: "msg5",
      q: "Can I share photos inside a conversation?",
      a: "Yes. Once a connection is established, you can share additional photos privately within the chat. All shared media is subject to our community guidelines, which prohibit inappropriate content.",
    },
  ],
  premium: [
    {
      id: "p1",
      q: "What does Premium membership include?",
      a: "Premium unlocks: unlimited daily likes, voice & video calls, detailed Jyotisha horoscope compatibility reports, 50+ advanced search filters, monthly profile boost, see who liked you, incognito browsing, priority customer support, and the ability to send a message before a connection is accepted (3 messages per match).",
    },
    {
      id: "p2",
      q: "How much does Premium cost?",
      a: "We offer three plans: 1-month at $19.99/month, 3-month at $14.99/month (billed as $44.97), and 6-month at $9.99/month (billed as $59.94). All plans include the same full Premium feature set — longer plans offer better value.",
    },
    {
      id: "p3",
      q: "How do I upgrade to Premium?",
      a: "Go to Subscription in your account settings, choose your preferred plan, and follow the payment flow. You can pay by credit/debit card, PayPal, or available local payment methods. Upgrade takes effect immediately.",
    },
    {
      id: "p4",
      q: "Can I cancel my Premium subscription?",
      a: "Yes, you can cancel at any time from Settings → Subscription → Cancel. Your Premium benefits continue until the end of your current billing period. There are no cancellation fees or penalties.",
    },
    {
      id: "p5",
      q: "Is there a free trial for Premium?",
      a: "We offer a 7-day money-back guarantee for first-time Premium subscribers. If you're not satisfied within the first 7 days of your initial purchase, contact our support team for a full refund.",
    },
  ],
  privacy: [
    {
      id: "pr1",
      q: "Who can see my profile?",
      a: "By default, only registered and logged-in SriMatch members can view your profile. You can further restrict visibility in Privacy Settings — for example, showing your profile only to members matching specific criteria such as age range, location, or religion.",
    },
    {
      id: "pr2",
      q: "How does SriMatch protect my personal information?",
      a: "We use industry-standard SSL/TLS encryption for all data in transit and at rest. Your contact details are never publicly displayed. We never sell your data to third parties, and we do not run advertising inside SriMatch. You retain full control over your privacy settings at all times.",
    },
    {
      id: "pr3",
      q: "Can I browse profiles without being seen?",
      a: "Yes — Incognito Browsing is a Premium feature that lets you view profiles without appearing in their visitor list. This gives you complete discretion while you explore potential matches.",
    },
    {
      id: "pr4",
      q: "How do I report inappropriate behaviour or a fake profile?",
      a: "Tap the Report button on any profile or inside any conversation. Our moderation team reviews all reports within 24 hours and takes appropriate action, which may include a warning, temporary suspension, or permanent ban.",
    },
    {
      id: "pr5",
      q: "Are my messages encrypted?",
      a: "All messages are transmitted over encrypted connections and stored securely. For safety reasons, our systems do monitor for harmful content as defined in our Community Guidelines, but messages are not accessible to other users or used for any commercial purpose.",
    },
  ],
  payment: [
    {
      id: "pay1",
      q: "What payment methods are accepted?",
      a: "We accept Visa, MasterCard, and American Express credit/debit cards, PayPal, and a range of local payment methods depending on your country. All payments are processed through PCI-DSS compliant payment gateways.",
    },
    {
      id: "pay2",
      q: "Is my payment information secure?",
      a: "Yes. We use PCI-DSS compliant processors and never store your complete card details on our servers. Your financial information is handled exclusively by our trusted payment partners.",
    },
    {
      id: "pay3",
      q: "Are subscriptions automatically renewed?",
      a: "Yes. Premium subscriptions auto-renew at the end of each billing cycle. You'll receive an email reminder 3 days before renewal. You can cancel auto-renewal at any time from Settings → Subscription.",
    },
    {
      id: "pay4",
      q: "Can I get a refund?",
      a: "First-time Premium subscribers are covered by our 7-day money-back guarantee. Contact support within 7 days of your initial purchase and we'll process a full refund. Renewal charges are non-refundable after the new billing cycle begins.",
    },
    {
      id: "pay5",
      q: "How do I update my payment details?",
      a: "Go to Settings → Subscription → Payment Methods. From there you can add a new card or update existing payment information. Changes take effect on your next billing cycle.",
    },
  ],
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (id) =>
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const allFaqs = Object.values(FAQS).flat();

  const displayedFaqs = searchTerm
    ? allFaqs.filter(
        (f) =>
          f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : FAQS[activeCategory];

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <>
      <style>{styles}</style>
      <div className="faq-root">

        {/* ── HERO ── */}
        <section className="faq-hero">
          <div className="faq-hero-inner">
            <div className="faq-hero-eyebrow">
              <SparklesIcon size={11} /> Help Centre
            </div>
            <h1 className="faq-hero-title">
              Frequently Asked <span className="gold">Questions</span>
            </h1>
            <p className="faq-hero-subtitle">
              Everything you need to know about finding your Sri Lankan life partner on
              SriMatch — answered clearly and honestly.
            </p>
          </div>
        </section>

        {/* ── SEARCH ── */}
        <div className="faq-search-wrap">
          <div className="faq-search-card">
            <span className="faq-search-label">Search all questions</span>
            <div className="faq-search-field">
              <SearchIcon size={16} />
              <input
                type="text"
                className="faq-search-input"
                placeholder="e.g. horoscope matching, NIC verification, cancel premium…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── MOBILE CATEGORY PILLS ── */}
        <div className="faq-cat-row-mobile" style={{ display: searchTerm ? "none" : undefined }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`faq-cat-pill${activeCategory === cat.id ? " active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* ── MAIN ── */}
        <div className="faq-main">

          {/* Sidebar */}
          {!searchTerm && (
            <aside className="faq-sidebar">
              <div className="faq-sidebar-title">Browse by topic</div>
              <div className="faq-cat-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`faq-cat-btn${activeCategory === cat.id ? " active" : ""}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <span className="faq-cat-icon">{cat.icon}</span>
                    {cat.label}
                    <span className="faq-cat-count">{FAQS[cat.id].length}</span>
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* Panel */}
          <div className="faq-panel">
            {searchTerm ? (
              <div className="faq-search-results-header">
                {displayedFaqs.length > 0 ? (
                  <>Showing <strong>{displayedFaqs.length}</strong> result{displayedFaqs.length !== 1 ? "s" : ""} for "<strong>{searchTerm}</strong>"</>
                ) : null}
              </div>
            ) : (
              <div className="faq-panel-header">
                <div className="faq-panel-eyebrow">{activeCat?.label}</div>
                <div className="faq-panel-title">
                  Common <span>questions</span>
                </div>
                <div className="faq-panel-count">{displayedFaqs.length} questions in this category</div>
              </div>
            )}

            {displayedFaqs.length > 0 ? (
              <div className="faq-accordion">
                {displayedFaqs.map((faq) => {
                  const isOpen = openItems.includes(faq.id);
                  return (
                    <div key={faq.id} className={`faq-item${isOpen ? " open" : ""}`}>
                      <button className="faq-q" onClick={() => toggleItem(faq.id)}>
                        <span className="faq-q-text">{faq.q}</span>
                        <span className="faq-chevron">
                          <ChevronDownIcon size={14} />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="faq-a">
                          <div className="faq-a-inner">{faq.a}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="faq-no-results">
                <div className="faq-no-results-icon">
                  <SearchIcon size={22} style={{ color: "#c9856a" }} />
                </div>
                <div className="faq-no-results-title">No results found</div>
                <p className="faq-no-results-sub">
                  We couldn't find any questions matching "<strong>{searchTerm}</strong>".
                  Try a different search term or browse by category.
                </p>
                <button className="faq-clear-btn" onClick={() => setSearchTerm("")}>
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── STILL HAVE QUESTIONS ── */}
        <div className="faq-support-banner">
          <div className="faq-support-card">
            <div className="faq-support-left">
              <div className="faq-support-icon">
                <MessageCircleIcon size={26} color="#e8c97a" />
              </div>
              <div>
                <div className="faq-support-title">Still have questions?</div>
                <p className="faq-support-sub">
                  Our support team is available Monday to Friday, 9 AM – 5 PM, and online chat is available 24/7. No question goes unanswered.
                </p>
              </div>
            </div>
            <Link href="/contact" className="faq-btn-gold">
              Contact Support <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="faq-cta">
          <div className="faq-cta-inner">
            <div className="faq-cta-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
            <h2 className="faq-cta-title">
              Ready to find your <span>forever?</span>
            </h2>
            <p className="faq-cta-sub">
              Join over 50,000 Sri Lankans who trust SriMatch to find a meaningful,
              culturally compatible life partner. Registration is always free.
            </p>
            <div className="faq-cta-btns">
              <Link href="/register" className="faq-btn-gold">
                Create Free Account <ArrowRightIcon size={15} />
              </Link>
              <Link href="/contact" className="faq-btn-outline">
                Contact Us
              </Link>
            </div>
            <div className="faq-trust-row">
              <div className="faq-trust-item"><HeartIcon size={12} /> Free to join</div>
              <div className="faq-trust-item"><ShieldCheckIcon size={12} /> NIC verified profiles</div>
              <div className="faq-trust-item"><UsersIcon size={12} /> 50,000+ members</div>
              <div className="faq-trust-item"><SparklesIcon size={12} /> Cancel anytime</div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default FAQPage;