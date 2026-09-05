"use client";

import React from "react";
import Link from "next/link";
import {
  HeartIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  SparklesIcon,
  ShieldCheckIcon,
  StarIcon,
  CodeIcon,
  ExternalLinkIcon,
  GlobeIcon,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .ft-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .ft-root {
    font-family: 'DM Sans', sans-serif;
    background: linear-gradient(160deg, #2a1208 0%, #4a2015 40%, #6b3526 80%, #7d4030 100%);
    color: rgba(255,255,255,0.82);
    position: relative;
    overflow: hidden;
  }

  /* Decorative background orbs */
  .ft-root::before {
    content: '';
    position: absolute; top: -100px; right: -100px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,201,122,0.06) 0%, transparent 65%);
    pointer-events: none;
  }
  .ft-root::after {
    content: '';
    position: absolute; bottom: 40px; left: -80px;
    width: 350px; height: 350px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,160,160,0.05) 0%, transparent 65%);
    pointer-events: none;
  }

  /* ── Top divider ornament ── */
  .ft-divider-top {
    text-align: center;
    padding: 2.25rem 0 0;
    position: relative; z-index: 1;
  }
  .ft-divider-top::before {
    content: '';
    display: block;
    width: 100%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,201,122,0.25), transparent);
    margin-bottom: 1.5rem;
  }
  .ft-ornament-row {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; margin-bottom: 2.25rem;
  }
  .ft-ornament-line {
    flex: 1; max-width: 120px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(232,201,122,0.35));
  }
  .ft-ornament-line.rev {
    background: linear-gradient(90deg, rgba(232,201,122,0.35), transparent);
  }
  .ft-ornament-heart {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(232,201,122,0.1);
    border: 1px solid rgba(232,201,122,0.25);
    display: flex; align-items: center; justify-content: center;
  }

  /* ── Main grid ── */
  .ft-main {
    max-width: 1200px; margin: 0 auto;
    padding: 0 2rem 3.5rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    position: relative; z-index: 1;
  }

  @media (max-width: 960px) {
    .ft-main { grid-template-columns: 1fr 1fr; gap: 2rem; }
  }
  @media (max-width: 560px) {
    .ft-main { grid-template-columns: 1fr; gap: 2rem; padding: 0 1.25rem 3rem; }
  }

  /* ── Brand column ── */
  .ft-brand {}

  .ft-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; letter-spacing: 0.02em;
    text-decoration: none; display: inline-flex; align-items: center;
    margin-bottom: 0.9rem;
  }
  .ft-logo .gold { color: #e8c97a; }
  .ft-logo .white { color: #fff; }
  .ft-logo .heart { color: #f4a0a0; font-size: 1.4rem; margin-left: 3px; }

  .ft-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem; font-style: italic;
    color: rgba(255,255,255,0.55); line-height: 1.55;
    margin-bottom: 1.1rem; max-width: 280px;
  }

  .ft-contact-list { display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1.5rem; }
  .ft-contact-item {
    display: flex; align-items: center; gap: 0.55rem;
    font-size: 0.79rem; color: rgba(255,255,255,0.6);
  }
  .ft-contact-item a {
    color: rgba(255,255,255,0.6); text-decoration: none;
    transition: color 0.2s;
  }
  .ft-contact-item a:hover { color: #e8c97a; }
  .ft-contact-icon {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    background: rgba(232,201,122,0.1); border: 1px solid rgba(232,201,122,0.2);
    display: flex; align-items: center; justify-content: center;
  }

  /* Social icons */
  .ft-socials { display: flex; gap: 0.55rem; }
  .ft-social-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.6); text-decoration: none;
    transition: all 0.22s;
  }
  .ft-social-btn:hover {
    background: rgba(232,201,122,0.15);
    border-color: rgba(232,201,122,0.35);
    color: #e8c97a;
    transform: translateY(-2px);
  }

  /* ── Link columns ── */
  .ft-col-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600;
    color: #e8c97a; margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .ft-col-title::after {
    content: '';
    flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(232,201,122,0.3), transparent);
  }

  .ft-links { display: flex; flex-direction: column; gap: 0.5rem; }
  .ft-link {
    font-size: 0.8rem; color: rgba(255,255,255,0.6);
    text-decoration: none; transition: all 0.2s;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .ft-link::before {
    content: '›';
    color: rgba(232,201,122,0.4); font-size: 0.9rem;
    transition: color 0.2s, transform 0.2s;
    display: inline-block;
  }
  .ft-link:hover { color: rgba(255,255,255,0.9); padding-left: 4px; }
  .ft-link:hover::before { color: #e8c97a; }

  /* ── Trust badges row ── */
  .ft-trust {
    max-width: 1200px; margin: 0 auto;
    padding: 1.25rem 2rem;
    display: flex; align-items: center; justify-content: center;
    gap: 2rem; flex-wrap: wrap;
    border-top: 1px solid rgba(255,255,255,0.08);
    position: relative; z-index: 1;
  }
  .ft-trust-item {
    display: flex; align-items: center; gap: 0.45rem;
    font-size: 0.75rem; color: rgba(255,255,255,0.45);
  }
  .ft-trust-item svg { color: rgba(232,201,122,0.55); }

  /* ── CeyCodEz Banner ── */
  .ft-ceycodez-band {
    max-width: 1200px; margin: 0 auto;
    padding: 0 2rem 1.5rem;
    position: relative; z-index: 1;
  }
  .ft-ceycodez-card {
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(232,201,122,0.15);
    border-radius: 16px;
    padding: 1.1rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1.25rem; flex-wrap: wrap;
  }
  .ft-ceycodez-left {
    display: flex; align-items: center; gap: 1rem;
  }
  .ft-ceycodez-logo {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 18px rgba(139,78,46,0.35);
  }
  .ft-ceycodez-logo-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 700; color: #e8c97a;
    letter-spacing: -0.01em; line-height: 1;
  }
  .ft-ceycodez-info {}
  .ft-ceycodez-eyebrow {
    font-size: 0.66rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(232,201,122,0.6);
    display: flex; align-items: center; gap: 0.3rem;
    margin-bottom: 0.2rem;
  }
  .ft-ceycodez-name {
    font-size: 0.84rem; font-weight: 500; color: rgba(255,255,255,0.85);
  }
  .ft-ceycodez-name span { color: #e8c97a; }
  .ft-ceycodez-right {
    display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
  }
  .ft-ceycodez-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .ft-ceycodez-tag {
    font-size: 0.67rem; padding: 0.18rem 0.6rem; border-radius: 99px;
    background: rgba(232,201,122,0.08);
    color: rgba(232,201,122,0.7);
    border: 1px solid rgba(232,201,122,0.18);
  }
  .ft-ceycodez-link {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.42rem 1rem; border-radius: 99px;
    font-size: 0.76rem; font-weight: 500;
    background: rgba(232,201,122,0.12);
    border: 1px solid rgba(232,201,122,0.28);
    color: #e8c97a; text-decoration: none;
    transition: all 0.2s; white-space: nowrap;
  }
  .ft-ceycodez-link:hover {
    background: rgba(232,201,122,0.22);
    border-color: rgba(232,201,122,0.5);
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 1.25rem 2rem;
    position: relative; z-index: 1;
  }
  .ft-bottom-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.75rem;
  }
  .ft-copyright {
    font-size: 0.75rem; color: rgba(255,255,255,0.38);
    display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;
  }
  .ft-copyright .made { color: rgba(255,255,255,0.38); }
  .ft-copyright .heart-inline { color: #f4a0a0; }
  .ft-copyright .cc-link {
    color: rgba(232,201,122,0.55); text-decoration: none;
    transition: color 0.2s;
  }
  .ft-copyright .cc-link:hover { color: #e8c97a; }

  .ft-legal-links { display: flex; gap: 1.25rem; flex-wrap: wrap; }
  .ft-legal-link {
    font-size: 0.72rem; color: rgba(255,255,255,0.38);
    text-decoration: none; transition: color 0.2s;
  }
  .ft-legal-link:hover { color: rgba(255,255,255,0.65); }

  @media (max-width: 560px) {
    .ft-trust { padding: 1.25rem 1.25rem; gap: 1rem; }
    .ft-bottom { padding: 1.25rem; }
    .ft-bottom-inner { flex-direction: column; align-items: flex-start; }
    .ft-ceycodez-band { padding: 0 1.25rem 1.5rem; }
    .ft-ceycodez-card { flex-direction: column; align-items: flex-start; }
  }
`;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{styles}</style>
      <footer className="ft-root">

        {/* Top ornament */}
        <div className="ft-divider-top">
          <div className="ft-ornament-row">
            <div className="ft-ornament-line" />
            <div className="ft-ornament-heart">
              <HeartIcon size={14} style={{ color: "#e8c97a" }} />
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", letterSpacing: "0.18em", color: "rgba(232,201,122,0.5)", textTransform: "uppercase" }}>
              Building Love Stories Since 2020
            </span>
            <div className="ft-ornament-heart">
              <SparklesIcon size={12} style={{ color: "#e8c97a" }} />
            </div>
            <div className="ft-ornament-line rev" />
          </div>
        </div>

        {/* Main grid */}
        {/* Main grid */}
        <div className="ft-main">

          {/* ── Brand column ── */}
          <div className="ft-brand">
            <Link href="/" className="ft-logo">
              <span className="gold">Sri</span>
              <span className="white">Match</span>
              <span className="heart"> ♥</span>
            </Link>

            <p className="ft-tagline">
              Sri Lanka's most trusted matrimonial platform — where tradition meets modern hearts.
            </p>

            <div className="ft-contact-list">
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <MapPinIcon size={11} style={{ color: "#e8c97a" }} />
                </div>
                <span>Colombo 03, Sri Lanka</span>
              </div>
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <MailIcon size={11} style={{ color: "#e8c97a" }} />
                </div>
                <a href="mailto:hello@srimatch.lk">hello@srimatch.lk</a>
              </div>
              <div className="ft-contact-item">
                <div className="ft-contact-icon">
                  <PhoneIcon size={11} style={{ color: "#e8c97a" }} />
                </div>
                <a href="tel:+94112345678">+94 11 234 5678</a>
              </div>
            </div>

            <div className="ft-socials">
              {/* Facebook */}
              <a href="#" className="ft-social-btn" aria-label="Facebook">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="ft-social-btn" aria-label="Instagram">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" className="ft-social-btn" aria-label="Twitter / X">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="ft-social-btn" aria-label="YouTube">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="ft-social-btn" aria-label="WhatsApp">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Company ── */}
          <div>
            <div className="ft-col-title">Company</div>
            <nav className="ft-links">
              <Link href="/about" className="ft-link">About Us</Link>
              <Link href="/how-it-works" className="ft-link">How It Works</Link>
              <Link href="/success-stories" className="ft-link">Success Stories</Link>
              <Link href="/blog" className="ft-link">Blog</Link>
              <Link href="/careers" className="ft-link">Careers</Link>
              <Link href="/contact" className="ft-link">Contact Us</Link>
              <Link href="/press" className="ft-link">Press & Media</Link>
            </nav>
          </div>

          {/* ── Membership ── */}
          <div>
            <div className="ft-col-title">Membership</div>
            <nav className="ft-links">
              <Link href="/register" className="ft-link">Join Free</Link>
              <Link href="/subscription" className="ft-link">Premium Plans</Link>
              <Link href="/verification" className="ft-link">NIC Verification</Link>
              <Link href="/connections" className="ft-link">Mutual Matches</Link>
              <Link href="/profile-boost" className="ft-link">Profile Boost</Link>
              <Link href="/gifting" className="ft-link">Send a Gift</Link>
            </nav>
          </div>

          {/* ── Support ── */}
          <div>
            <div className="ft-col-title">Support</div>
            <nav className="ft-links">
              <Link href="/help-center" className="ft-link">Help Centre</Link>
              <Link href="/faq" className="ft-link">FAQ</Link>
              <Link href="/safety-guidelines" className="ft-link">Safety Guidelines</Link>
              <Link href="/report" className="ft-link">Report a Profile</Link>
              <Link href="/customer-support" className="ft-link">Customer Support</Link>
              <Link href="/accessibility" className="ft-link">Accessibility</Link>
            </nav>
          </div>

        </div>

        {/* Trust badges */}
        <div className="ft-trust">
          <div className="ft-trust-item">
            <ShieldCheckIcon size={13} />
            <span>NIC Verified Profiles</span>
          </div>
          <div className="ft-trust-item">
            <StarIcon size={13} />
            <span>Smart Compatibility</span>
          </div>
          <div className="ft-trust-item">
            <HeartIcon size={13} />
            <span>12,000+ Couples Matched</span>
          </div>
          <div className="ft-trust-item">
            <SparklesIcon size={13} />
            <span>SSL Secured & Private</span>
          </div>
        </div>

        {/* ── CeyCodEz Ownership Band ── */}
        <div className="ft-ceycodez-band">
          <div className="ft-ceycodez-card">
            <div className="ft-ceycodez-left">
              <div className="ft-ceycodez-logo">
                <span className="ft-ceycodez-logo-text">CC</span>
              </div>
              <div className="ft-ceycodez-info">
                <div className="ft-ceycodez-eyebrow">
                  <CodeIcon size={10} /> Developed & Owned by
                </div>
                <div className="ft-ceycodez-name">
                  <span>CeyCodEz</span> Software Solutions (Pvt) Ltd — Sri Lankan Technology Company
                </div>
              </div>
            </div>
            <div className="ft-ceycodez-right">
              <div className="ft-ceycodez-tags">
                {["React", "Node.js", "AI Matching", "Cloud"].map(tag => (
                  <span key={tag} className="ft-ceycodez-tag">{tag}</span>
                ))}
              </div>
              <a
                href="https://ceycodez.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-ceycodez-link"
              >
                <GlobeIcon size={11} /> ceycodez.com <ExternalLinkIcon size={10} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <div className="ft-bottom-inner">
            <p className="ft-copyright">
              <span>© {year} SriMatch.</span>
              <span className="made">All rights reserved. Made with</span>
              <HeartIcon size={10} style={{ color: "#f4a0a0", display: "inline" }} />
              <span className="made">in Sri Lanka ✦ A product of</span>
              <a
                href="https://ceycodez.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cc-link"
              >
                CeyCodEz Software Solutions (Pvt) Ltd
              </a>
            </p>
            <div className="ft-legal-links">
              <Link href="/terms" className="ft-legal-link">Terms of Service</Link>
              <Link href="/privacy" className="ft-legal-link">Privacy Policy</Link>
              <Link href="/cookie-policy" className="ft-legal-link">Cookie Policy</Link>
              <Link href="/refund-policy" className="ft-legal-link">Refund Policy</Link>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;