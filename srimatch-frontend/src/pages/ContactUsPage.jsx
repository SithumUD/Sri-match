import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  MessageCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  HeartIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChevronDownIcon,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .cu-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .cu-root {
    font-family: 'DM Sans', sans-serif;
    background: #fdf8f4;
    color: #2d1810;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .cu-hero {
    background: linear-gradient(160deg, #3d1f12 0%, #6b3526 45%, #8b4e2e 75%, #c9856a 100%);
    padding: 5rem 1.5rem 6rem;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .cu-hero::before {
    content: '';
    position: absolute; top: -120px; right: -120px;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(232,201,122,0.1) 0%, transparent 65%);
    pointer-events: none;
  }
  .cu-hero::after {
    content: '';
    position: absolute; bottom: -80px; left: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,160,160,0.08) 0%, transparent 65%);
    pointer-events: none;
  }
  .cu-hero-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 1; }

  .cu-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: rgba(232,201,122,0.15); border: 1px solid rgba(232,201,122,0.3);
    color: #e8c97a; font-size: 0.72rem; font-weight: 500;
    padding: 0.3rem 0.9rem; border-radius: 99px;
    letter-spacing: 0.1em; text-transform: uppercase;
    margin-bottom: 1.5rem;
  }
  .cu-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    font-weight: 600; color: #fff;
    line-height: 1.1; margin-bottom: 1.25rem;
  }
  .cu-hero-title .gold {
    background: linear-gradient(135deg, #e8c97a, #f4d898);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .cu-hero-subtitle {
    font-size: 1rem; color: rgba(255,255,255,0.7);
    line-height: 1.75; max-width: 500px; margin: 0 auto;
  }

  /* ── CONTACT CARDS ROW ── */
  .cu-cards-row {
    max-width: 960px; margin: -2.5rem auto 0;
    padding: 0 1.5rem;
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem; position: relative; z-index: 10;
  }
  @media (max-width: 700px) { .cu-cards-row { grid-template-columns: 1fr; margin-top: -1.5rem; } }
  @media (max-width: 900px) and (min-width: 701px) { .cu-cards-row { grid-template-columns: 1fr 1fr 1fr; } }

  .cu-info-card {
    background: #fff;
    border: 1px solid #f0ddd5;
    border-radius: 20px;
    padding: 1.75rem 1.5rem;
    text-align: center;
    box-shadow: 0 12px 40px rgba(61,31,18,0.1);
    transition: all 0.25s;
  }
  .cu-info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 56px rgba(61,31,18,0.14);
    border-color: #e8c9b8;
  }
  .cu-info-card-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 20px rgba(139,78,46,0.28);
  }
  .cu-info-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.4rem;
  }
  .cu-info-card-value {
    font-size: 0.86rem; color: #3d1f12; font-weight: 500; margin-bottom: 0.25rem;
  }
  .cu-info-card-value a {
    color: #3d1f12; text-decoration: none; transition: color 0.2s;
  }
  .cu-info-card-value a:hover { color: #8b4e2e; }
  .cu-info-card-sub { font-size: 0.76rem; color: #9a7060; line-height: 1.5; }

  /* ── MAIN CONTENT ── */
  .cu-main {
    max-width: 1100px; margin: 0 auto;
    padding: 5rem 1.5rem 3rem;
    display: grid; grid-template-columns: 1fr 1.6fr;
    gap: 3rem; align-items: start;
  }
  @media (max-width: 800px) { .cu-main { grid-template-columns: 1fr; gap: 2rem; padding-top: 3rem; } }

  /* ── LEFT PANEL ── */
  .cu-left {}

  .cu-section-eyebrow {
    font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: #8b4e2e;
    margin-bottom: 0.6rem;
  }
  .cu-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 600;
    color: #2d1810; line-height: 1.2;
    margin-bottom: 0.75rem;
  }
  .cu-section-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .cu-section-sub {
    font-size: 0.88rem; color: #9a7060; line-height: 1.7;
    margin-bottom: 2rem;
  }

  .cu-hours-card {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    border-radius: 20px; padding: 1.75rem;
    margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
    box-shadow: 0 16px 48px rgba(61,31,18,0.22);
  }
  .cu-hours-card::before {
    content: '✦';
    position: absolute; top: 1rem; right: 1.5rem;
    font-size: 1.2rem; color: rgba(232,201,122,0.12);
  }
  .cu-hours-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600; color: #e8c97a;
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .cu-hours-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.55rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    font-size: 0.82rem;
  }
  .cu-hours-row:last-child { border-bottom: none; }
  .cu-hours-day { color: rgba(255,255,255,0.65); }
  .cu-hours-time { color: rgba(255,255,255,0.9); font-weight: 500; }
  .cu-hours-time.closed { color: rgba(255,255,255,0.35); }
  .cu-hours-online {
    margin-top: 1rem; padding-top: 1rem;
    border-top: 1px solid rgba(232,201,122,0.2);
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.78rem; color: rgba(255,255,255,0.65);
  }
  .cu-hours-online-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #6ee7b7;
    box-shadow: 0 0 6px rgba(110,231,183,0.6);
    flex-shrink: 0;
  }

  .cu-quick-links {
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border: 1px solid #f0ddd5; border-radius: 20px;
    padding: 1.5rem;
  }
  .cu-ql-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #2d1810;
    margin-bottom: 1rem;
  }
  .cu-ql-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .cu-ql-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.6rem 0.85rem; border-radius: 10px;
    text-decoration: none;
    font-size: 0.82rem; color: #4a3028; font-weight: 500;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .cu-ql-item:hover {
    background: #fff;
    border-color: #f0ddd5;
    color: #8b4e2e;
    padding-left: 1rem;
  }
  .cu-ql-item svg { color: #c9856a; opacity: 0.7; }

  /* ── FORM PANEL ── */
  .cu-form-card {
    background: #fff;
    border: 1px solid #f0ddd5;
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 8px 32px rgba(61,31,18,0.07);
  }
  @media (max-width: 480px) { .cu-form-card { padding: 1.5rem; } }

  .cu-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.4rem;
  }
  .cu-form-sub { font-size: 0.84rem; color: #9a7060; margin-bottom: 2rem; line-height: 1.6; }

  .cu-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
  @media (max-width: 560px) { .cu-form-row { grid-template-columns: 1fr; } }

  .cu-form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
  .cu-form-group:last-of-type { margin-bottom: 0; }

  .cu-form-label {
    font-size: 0.8rem; font-weight: 500; color: #4a3028;
    letter-spacing: 0.02em;
  }
  .cu-form-input,
  .cu-form-select,
  .cu-form-textarea {
    width: 100%;
    border: 1.5px solid #f0ddd5;
    border-radius: 12px;
    padding: 0.7rem 0.95rem;
    font-size: 0.86rem;
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
    background: #fdf8f4;
    transition: all 0.2s;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }
  .cu-form-input::placeholder,
  .cu-form-textarea::placeholder { color: #c4a898; }
  .cu-form-input:focus,
  .cu-form-select:focus,
  .cu-form-textarea:focus {
    border-color: #c9856a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(201,133,106,0.1);
  }
  .cu-form-textarea { resize: vertical; min-height: 140px; line-height: 1.65; }

  .cu-form-select-wrap { position: relative; }
  .cu-form-select-wrap svg {
    position: absolute; right: 0.9rem; top: 50%; transform: translateY(-50%);
    color: #9a7060; pointer-events: none;
  }
  .cu-form-select { padding-right: 2.5rem; cursor: pointer; }
  .cu-form-select option { background: #fff; }

  .cu-btn-submit {
    width: 100%; margin-top: 1.5rem;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.85rem 2rem; border-radius: 99px;
    font-size: 0.92rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 20px rgba(200,160,80,0.32);
    transition: all 0.22s;
  }
  .cu-btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(200,160,80,0.44);
  }

  /* ── SUCCESS STATE ── */
  .cu-success {
    text-align: center; padding: 3rem 1.5rem;
  }
  .cu-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
    box-shadow: 0 12px 32px rgba(139,78,46,0.28);
  }
  .cu-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.75rem;
  }
  .cu-success-sub { font-size: 0.88rem; color: #9a7060; line-height: 1.7; margin-bottom: 1.75rem; max-width: 360px; margin-left: auto; margin-right: auto; }
  .cu-success-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.65rem 1.6rem; border-radius: 99px;
    font-size: 0.85rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 18px rgba(139,78,46,0.24);
    transition: all 0.2s;
  }
  .cu-success-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.34); }

  /* ── MAP SECTION ── */
  .cu-map-section {
    max-width: 1100px; margin: 0 auto;
    padding: 0 1.5rem 5rem;
  }
  .cu-map-card {
    background: #fff; border: 1px solid #f0ddd5;
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 8px 32px rgba(61,31,18,0.07);
  }
  .cu-map-header {
    padding: 1.5rem 2rem; border-bottom: 1px solid #f0ddd5;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .cu-map-header-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px rgba(139,78,46,0.24);
    flex-shrink: 0;
  }
  .cu-map-header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 600; color: #2d1810;
  }
  .cu-map-header-sub { font-size: 0.77rem; color: #9a7060; }
  .cu-map-iframe { width: 100%; height: 380px; border: none; display: block; }

  /* ── CTA BAND ── */
  .cu-cta {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 5rem 1.5rem; text-align: center; position: relative; overflow: hidden;
  }
  .cu-cta::before {
    content: '✦'; position: absolute; top: 2rem; left: 3rem;
    font-size: 3rem; color: rgba(232,201,122,0.07); pointer-events: none;
  }
  .cu-cta::after {
    content: '✦'; position: absolute; bottom: 2rem; right: 3rem;
    font-size: 4rem; color: rgba(232,201,122,0.06); pointer-events: none;
  }
  .cu-cta-inner { max-width: 600px; margin: 0 auto; position: relative; z-index: 1; }
  .cu-cta-ornament {
    color: rgba(232,201,122,0.3); margin-bottom: 1.25rem;
    font-size: 0.9rem; letter-spacing: 0.3em;
  }
  .cu-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 600;
    color: #fff; margin-bottom: 0.75rem; line-height: 1.2;
  }
  .cu-cta-title span { color: #e8c97a; }
  .cu-cta-sub { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 2rem; line-height: 1.65; }
  .cu-cta-btns { display: flex; justify-content: center; gap: 0.85rem; flex-wrap: wrap; }
  .cu-btn-gold {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.9rem; font-weight: 500;
    background: linear-gradient(135deg, #e8c97a, #c9a050);
    color: #3d1f12; text-decoration: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 20px rgba(200,160,80,0.36);
    transition: all 0.2s;
  }
  .cu-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(200,160,80,0.48); }
  .cu-btn-outline {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.75rem 1.75rem; border-radius: 99px;
    font-size: 0.9rem; font-weight: 500;
    background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3);
    color: #fff; text-decoration: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .cu-btn-outline:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.55); }

  .cu-trust-row {
    display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;
    margin-top: 2rem;
  }
  .cu-trust-item {
    display: flex; align-items: center; gap: 0.4rem;
    font-size: 0.76rem; color: rgba(255,255,255,0.55);
  }

  /* ornament */
  .cu-ornament {
    text-align: center; font-size: 0.8rem; color: #d4b8a8;
    letter-spacing: 0.2em; padding: 1rem 0;
  }
`;

/* ─── Component ─────────────────────────────────────────────────────────── */
const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cu-root">

        {/* ── HERO ── */}
        <section className="cu-hero">
          <div className="cu-hero-inner">
            <div className="cu-hero-eyebrow">
              <SparklesIcon size={11} /> We'd love to hear from you
            </div>
            <h1 className="cu-hero-title">
              Get in <span className="gold">Touch</span> With Us
            </h1>
            <p className="cu-hero-subtitle">
              Whether you have questions, need support, or simply want to share
              your love story — our team is here to help, every step of the way.
            </p>
          </div>
        </section>

        {/* ── CONTACT INFO CARDS ── */}
        <div className="cu-cards-row">
          <div className="cu-info-card">
            <div className="cu-info-card-icon">
              <MailIcon size={22} color="#fff" />
            </div>
            <div className="cu-info-card-title">Email Us</div>
            <div className="cu-info-card-value">
              <a href="mailto:hello@srimatch.lk">hello@srimatch.lk</a>
            </div>
            <div className="cu-info-card-sub">We respond within 24 hours</div>
          </div>
          <div className="cu-info-card">
            <div className="cu-info-card-icon">
              <PhoneIcon size={22} color="#fff" />
            </div>
            <div className="cu-info-card-title">Call Us</div>
            <div className="cu-info-card-value">
              <a href="tel:+94112345678">+94 11 234 5678</a>
            </div>
            <div className="cu-info-card-sub">Mon – Fri, 9:00 AM – 5:00 PM</div>
          </div>
          <div className="cu-info-card">
            <div className="cu-info-card-icon">
              <MapPinIcon size={22} color="#fff" />
            </div>
            <div className="cu-info-card-title">Visit Us</div>
            <div className="cu-info-card-value">42 Galle Road, Colombo 03</div>
            <div className="cu-info-card-sub">Sri Lanka</div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="cu-main">

          {/* ── LEFT — Hours & Quick Links ── */}
          <div className="cu-left">
            <div className="cu-section-eyebrow">Here to help</div>
            <h2 className="cu-section-title">
              We're always <span>available</span>
            </h2>
            <p className="cu-section-sub">
              Our dedicated support team is ready to assist you with anything —
              from account questions to horoscope guidance.
            </p>

            <div className="cu-hours-card">
              <div className="cu-hours-title">
                <ClockIcon size={16} style={{ color: "#e8c97a" }} />
                Business Hours
              </div>
              {[
                ["Monday – Friday", "9:00 AM – 5:00 PM", false],
                ["Saturday", "10:00 AM – 2:00 PM", false],
                ["Sunday", "Closed", true],
                ["Public Holidays", "Closed", true],
              ].map(([day, time, closed]) => (
                <div key={day} className="cu-hours-row">
                  <span className="cu-hours-day">{day}</span>
                  <span className={`cu-hours-time${closed ? " closed" : ""}`}>{time}</span>
                </div>
              ))}
              <div className="cu-hours-online">
                <div className="cu-hours-online-dot" />
                Online chat & email support available 24 / 7
              </div>
            </div>

            <div className="cu-quick-links">
              <div className="cu-ql-title">Quick Links</div>
              <div className="cu-ql-list">
                {[
                  { label: "Help Centre", to: "/help-center" },
                  { label: "FAQ", to: "/faq" },
                  { label: "Safety Guidelines", to: "/safety-guidelines" },
                  { label: "Report a Profile", to: "/report" },
                  { label: "Premium Plans", to: "/subscription" },
                  { label: "NIC Verification", to: "/verification" },
                ].map((item) => (
                  <Link key={item.to} to={item.to} className="cu-ql-item">
                    {item.label}
                    <ArrowRightIcon size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Form ── */}
          <div className="cu-form-card">
            {formSubmitted ? (
              <div className="cu-success">
                <div className="cu-success-icon">
                  <HeartIcon size={28} color="#e8c97a" />
                </div>
                <div className="cu-success-title">Message Sent!</div>
                <p className="cu-success-sub">
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours. In the meantime, feel free to browse our
                  FAQ for quick answers.
                </p>
                <button className="cu-success-btn" onClick={() => setFormSubmitted(false)}>
                  <MessageCircleIcon size={14} /> Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="cu-form-title">Send Us a Message</div>
                <p className="cu-form-sub">
                  Fill in the form below and we'll get back to you as soon as possible.
                  Your query matters to us — no message goes unanswered.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="cu-form-row">
                    <div className="cu-form-group" style={{ marginBottom: 0 }}>
                      <label className="cu-form-label" htmlFor="name">Your Name</label>
                      <input
                        id="name" name="name" type="text"
                        className="cu-form-input" required
                        placeholder="e.g. Nimal Perera"
                        value={formData.name} onChange={handleChange}
                      />
                    </div>
                    <div className="cu-form-group" style={{ marginBottom: 0 }}>
                      <label className="cu-form-label" htmlFor="email">Email Address</label>
                      <input
                        id="email" name="email" type="email"
                        className="cu-form-input" required
                        placeholder="you@example.com"
                        value={formData.email} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="cu-form-row">
                    <div className="cu-form-group" style={{ marginBottom: 0 }}>
                      <label className="cu-form-label" htmlFor="phone">Phone Number <span style={{ color: "#c4a898", fontWeight: 400 }}>(optional)</span></label>
                      <input
                        id="phone" name="phone" type="tel"
                        className="cu-form-input"
                        placeholder="+94 77 123 4567"
                        value={formData.phone} onChange={handleChange}
                      />
                    </div>
                    <div className="cu-form-group" style={{ marginBottom: 0 }}>
                      <label className="cu-form-label" htmlFor="subject">Subject</label>
                      <div className="cu-form-select-wrap">
                        <select
                          id="subject" name="subject"
                          className="cu-form-select" required
                          value={formData.subject} onChange={handleChange}
                        >
                          <option value="">Select a topic…</option>
                          <option value="account">Account Issues</option>
                          <option value="billing">Billing &amp; Payments</option>
                          <option value="verification">NIC Verification</option>
                          <option value="horoscope">Horoscope Matching</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback &amp; Suggestions</option>
                          <option value="partnership">Business Partnerships</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDownIcon size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-form-label" htmlFor="message">Your Message</label>
                    <textarea
                      id="message" name="message"
                      className="cu-form-textarea" required
                      placeholder="Tell us how we can help you…"
                      value={formData.message} onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="cu-btn-submit">
                    <MessageCircleIcon size={16} />
                    Send Message ✦
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* ── MAP ── */}
        <div className="cu-map-section">
          <div className="cu-map-card">
            <div className="cu-map-header">
              <div className="cu-map-header-icon">
                <MapPinIcon size={18} color="#fff" />
              </div>
              <div>
                <div className="cu-map-header-title">Our Office — Colombo 03</div>
                <div className="cu-map-header-sub">42 Galle Road, Colombo 03, Sri Lanka</div>
              </div>
            </div>
            <iframe
              className="cu-map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.80385539324!2d79.8211858!3d6.9218386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1656543341015!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              title="SriMatch Office Location"
            />
          </div>
        </div>

        {/* ── CTA ── */}
        <section className="cu-cta">
          <div className="cu-cta-inner">
            <div className="cu-cta-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
            <h2 className="cu-cta-title">
              Start your <span>love story</span> today
            </h2>
            <p className="cu-cta-sub">
              Join over 50,000 Sri Lankans who trust SriMatch to find a
              meaningful, culturally compatible life partner. Registration is
              always free.
            </p>
            <div className="cu-cta-btns">
              <Link to="/register" className="cu-btn-gold">
                Create Free Account <ArrowRightIcon size={15} />
              </Link>
              <Link to="/faq" className="cu-btn-outline">
                Browse FAQ
              </Link>
            </div>
            <div className="cu-trust-row">
              <div className="cu-trust-item"><HeartIcon size={12} /> Free to join</div>
              <div className="cu-trust-item"><ShieldCheckIcon size={12} /> NIC verified profiles</div>
              <div className="cu-trust-item"><UsersIcon size={12} /> 50,000+ members</div>
              <div className="cu-trust-item"><SparklesIcon size={12} /> Cancel anytime</div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactUsPage;