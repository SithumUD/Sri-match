// RegisterPage.jsx - Enhanced Single-Step Version (Phone Number Removed)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Eye, EyeOff, Heart, Mail, Lock, User, Gift,
  Shield, CheckCircle, XCircle, AlertCircle, ArrowRight,
} from "lucide-react";

/* ─── Inline styles for custom fonts & decorative elements ─────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .reg-page * { box-sizing: border-box; }

  .reg-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .reg-bg-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
  }
  .reg-bg-blob-1 { width: 520px; height: 520px; background: #c9856a; top: -120px; right: -120px; }
  .reg-bg-blob-2 { width: 420px; height: 420px; background: #8b6248; bottom: -100px; left: -100px; }
  .reg-bg-blob-3 { width: 280px; height: 280px; background: #e8b89a; top: 40%; left: 40%; }

  .reg-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(120,60,30,0.12), 0 8px 24px rgba(0,0,0,0.06);
    overflow: hidden;
  }

  .reg-card-top {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 2.5rem 2.5rem 2rem;
    text-align: center;
    position: relative;
  }
  .reg-card-top::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 32px;
    background: #ffffff;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }

  .reg-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.04em;
    text-decoration: none;
    display: block;
    margin-bottom: 0.25rem;
  }
  .reg-logo span.gold { color: #e8c97a; }
  .reg-logo span.heart { color: #f4a0a0; }

  .reg-tagline {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.65);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 300;
  }

  .reg-body { padding: 2rem 2.5rem 2.5rem; }

  .reg-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #2d1810;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }
  .reg-subheading {
    font-size: 0.85rem;
    color: #9a7060;
    margin-bottom: 1.75rem;
  }

  /* Social buttons */
  .reg-social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
  .reg-social-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.65rem 1rem;
    border: 1.5px solid #e8ddd8;
    border-radius: 10px;
    background: #fdf8f5;
    font-size: 0.82rem;
    color: #4a3028;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .reg-social-btn:hover { border-color: #c9856a; background: #fff5f0; }

  .reg-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.25rem 0;
    color: #c4a99a; font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .reg-divider::before, .reg-divider::after { content: ''; flex: 1; height: 1px; background: #ede5e0; }

  /* Form fields */
  .reg-field { margin-bottom: 1.1rem; }
  .reg-label {
    display: block; font-size: 0.8rem; font-weight: 500;
    color: #4a3028; margin-bottom: 0.4rem; letter-spacing: 0.02em;
  }
  .reg-label .req { color: #d9644a; margin-left: 2px; }
  .reg-label .opt { color: #b09080; font-weight: 300; font-size: 0.72rem; margin-left: 4px; }

  .reg-input-wrap { position: relative; }
  .reg-input-icon {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #c4a99a; width: 15px; height: 15px; pointer-events: none;
  }
  .reg-input-icon-right {
    position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #c4a99a; width: 15px; height: 15px; cursor: pointer;
  }

  .reg-input {
    width: 100%; padding: 0.7rem 2.5rem 0.7rem 2.5rem;
    border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.88rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; outline: none;
  }
  .reg-input:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .reg-input.error { border-color: #d9644a; background: #fff9f7; }
  .reg-input.success { border-color: #6daa7a; }
  .reg-input:disabled { background: #f5f0ed; color: #9a7060; }

  .reg-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  .reg-error { font-size: 0.75rem; color: #d9644a; margin-top: 0.3rem; display: flex; align-items: center; gap: 4px; }
  .reg-success-note { font-size: 0.75rem; color: #5d9e6a; margin-top: 0.3rem; display: flex; align-items: center; gap: 4px; }

  /* Password strength */
  .pw-strength-bars { display: flex; gap: 4px; height: 3px; margin-top: 0.5rem; }
  .pw-strength-bar { flex: 1; border-radius: 99px; background: #ede5e0; transition: background 0.3s; }
  .pw-strength-bar.active-0 { background: #d9644a; }
  .pw-strength-bar.active-1 { background: #e09050; }
  .pw-strength-bar.active-2 { background: #d4aa40; }
  .pw-strength-bar.active-3 { background: #6daa7a; }
  .pw-strength-text { font-size: 0.72rem; color: #9a7060; margin-top: 0.3rem; }

  /* CAPTCHA */
  .reg-captcha-box {
    padding: 1rem; background: #fdf5f0; border: 1px solid #f0ddd5; border-radius: 10px;
    margin-top: 0.75rem;
  }
  .reg-captcha-code {
    font-family: monospace; font-size: 1.4rem; letter-spacing: 0.35em; font-weight: 700;
    background: linear-gradient(135deg, #3d1f12, #6b3526);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    padding: 0.5rem 0;
    user-select: none;
  }
  .reg-captcha-row { display: flex; align-items: center; gap: 0.75rem; }
  .reg-captcha-refresh {
    background: none; border: none; cursor: pointer;
    font-size: 1.2rem; color: #9a7060; transition: transform 0.3s;
  }
  .reg-captcha-refresh:hover { transform: rotate(180deg); }

  /* Checkbox */
  .reg-checkbox-row { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem; }
  .reg-checkbox {
    width: 16px; height: 16px; accent-color: #8b4e2e;
    margin-top: 2px; flex-shrink: 0; cursor: pointer;
  }
  .reg-checkbox-label { font-size: 0.8rem; color: #6b4a3a; line-height: 1.5; }
  .reg-checkbox-label a { color: #8b4e2e; text-decoration: underline; text-underline-offset: 2px; }

  /* Submit button */
  .reg-submit-btn {
    width: 100%; padding: 0.85rem;
    background: linear-gradient(135deg, #3d1f12 0%, #8b4e2e 60%, #c9856a 100%);
    color: #fff; border: none; border-radius: 12px;
    font-size: 0.92rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    margin-top: 1.25rem;
    box-shadow: 0 6px 20px rgba(139,78,46,0.28);
  }
  .reg-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(139,78,46,0.36); }
  .reg-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .reg-signin-link {
    text-align: center; margin-top: 1.25rem;
    font-size: 0.82rem; color: #9a7060;
  }
  .reg-signin-link a { color: #8b4e2e; font-weight: 500; text-decoration: none; }
  .reg-signin-link a:hover { text-decoration: underline; }

  .reg-back-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.8rem; color: #9a7060; text-decoration: none; margin-bottom: 1rem;
  }
  .reg-back-link:hover { color: #8b4e2e; }

  /* Alert */
  .reg-alert {
    padding: 0.75rem 1rem; border-radius: 10px;
    background: #fef1ee; border: 1px solid #f5c4b8;
    display: flex; align-items: flex-start; gap: 0.5rem;
    font-size: 0.82rem; color: #8b3020; margin-bottom: 1rem;
  }

  .reg-referral-note { font-size: 0.73rem; color: #8b4e2e; margin-top: 0.3rem; }

  @media (max-width: 520px) {
    .reg-card { border-radius: 20px; }
    .reg-body { padding: 1.5rem 1.5rem 2rem; }
    .reg-card-top { padding: 2rem 1.5rem 1.75rem; }
    .reg-input-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── Helper: SVG icons for social login ───────────────────────────────── */
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/* ─── Main Component ────────────────────────────────────────────────────── */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    agreeTerms: false,
  });

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    setCaptchaCode(Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };

  useEffect(() => { generateCaptcha(); }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (formData.email && /\S+@\S+\.\S+/.test(formData.email)) {
        setCheckingEmail(true);
        setTimeout(() => {
          const taken = ["test@test.com", "admin@example.com"];
          setEmailAvailable(!taken.includes(formData.email));
          setCheckingEmail(false);
        }, 500);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [formData.email]);

  const checkPasswordStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^a-zA-Z\d]/.test(pw)) s++;
    setPasswordStrength(s);
    return s;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
    if (name === "password") checkPasswordStrength(value);
  };

  const handleBlur = (f) => setTouched(p => ({ ...p, [f]: true }));

  const pwStrengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const pwStrengthActiveClass = ["active-0", "active-1", "active-2", "active-3", "active-3"];

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Invalid email address";
    else if (emailAvailable === false) e.email = "Email already registered";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "Minimum 8 characters";
    else if (passwordStrength < 2) e.password = "Password is too weak";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms) e.agreeTerms = "Please accept the terms to continue";
    if (showCaptcha && captchaInput !== captchaCode) e.captcha = "Incorrect code — try again";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempts(a => a + 1);
    if (attempts >= 2 && !showCaptcha) { setShowCaptcha(true); generateCaptcha(); return; }
    if (!validate()) return;
    try {
      setLoading(true);
      const success = await register(formData);
      if (success) {
        if (formData.referralCode) localStorage.setItem("referralUsed", formData.referralCode);
        navigate("/profile-creation");
      } else {
        setErrors({ form: "Registration failed. Please try again." });
      }
    } catch (err) {
      setErrors({ form: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="reg-page">
        <div className="reg-bg-blob reg-bg-blob-1" />
        <div className="reg-bg-blob reg-bg-blob-2" />
        <div className="reg-bg-blob reg-bg-blob-3" />

        <div className="reg-card">
          {/* Top brand area */}
          <div className="reg-card-top">
            <Link to="/" className="reg-logo">
              <span className="gold">Sri</span>Match<span className="heart"> ♥</span>
            </Link>
            <p className="reg-tagline">Where traditions meet forever</p>
          </div>

          <div className="reg-body">
            <Link to="/" className="reg-back-link">← Back to home</Link>
            <h2 className="reg-heading">Begin your journey</h2>
            <p className="reg-subheading">Create an account to find your perfect match</p>

            {/* Social login */}
            <div className="reg-social-row">
              <button type="button" className="reg-social-btn">
                <GoogleIcon /> Continue with Google
              </button>
              <button type="button" className="reg-social-btn">
                <FacebookIcon /> Continue with Facebook
              </button>
            </div>

            <div className="reg-divider">or sign up with email</div>

            {errors.form && (
              <div className="reg-alert">
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Name row */}
              <div className="reg-input-grid" style={{ marginBottom: "1.1rem" }}>
                <div className="reg-field" style={{ marginBottom: 0 }}>
                  <label className="reg-label">First Name <span className="req">*</span></label>
                  <div className="reg-input-wrap">
                    <User className="reg-input-icon" size={15} />
                    <input
                      name="firstName" type="text" value={formData.firstName}
                      onChange={handleChange} onBlur={() => handleBlur("firstName")}
                      className={`reg-input${errors.firstName && touched.firstName ? " error" : ""}${formData.firstName && !errors.firstName ? " success" : ""}`}
                      placeholder="Amara"
                    />
                  </div>
                  {errors.firstName && touched.firstName && <p className="reg-error"><XCircle size={11} />{errors.firstName}</p>}
                </div>
                <div className="reg-field" style={{ marginBottom: 0 }}>
                  <label className="reg-label">Last Name <span className="req">*</span></label>
                  <div className="reg-input-wrap">
                    <User className="reg-input-icon" size={15} />
                    <input
                      name="lastName" type="text" value={formData.lastName}
                      onChange={handleChange} onBlur={() => handleBlur("lastName")}
                      className={`reg-input${errors.lastName && touched.lastName ? " error" : ""}${formData.lastName && !errors.lastName ? " success" : ""}`}
                      placeholder="Perera"
                    />
                  </div>
                  {errors.lastName && touched.lastName && <p className="reg-error"><XCircle size={11} />{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="reg-field">
                <label className="reg-label">Email Address <span className="req">*</span></label>
                <div className="reg-input-wrap">
                  <Mail className="reg-input-icon" size={15} />
                  <input
                    name="email" type="email" value={formData.email}
                    onChange={handleChange} onBlur={() => handleBlur("email")}
                    className={`reg-input${errors.email && touched.email ? " error" : ""}${emailAvailable === true ? " success" : ""}`}
                    style={{ paddingRight: "2.5rem" }}
                    placeholder="you@example.com"
                  />
                  {checkingEmail && (
                    <div className="reg-input-icon-right" style={{ animation: "spin 1s linear infinite" }}>
                      <div style={{ width: 14, height: 14, border: "2px solid #c9856a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    </div>
                  )}
                  {!checkingEmail && emailAvailable === true && formData.email && <CheckCircle className="reg-input-icon-right" size={15} style={{ color: "#5d9e6a" }} />}
                  {!checkingEmail && emailAvailable === false && formData.email && <XCircle className="reg-input-icon-right" size={15} style={{ color: "#d9644a" }} />}
                </div>
                {errors.email && touched.email && <p className="reg-error"><XCircle size={11} />{errors.email}</p>}
                {emailAvailable === true && formData.email && <p className="reg-success-note"><CheckCircle size={11} />Email is available</p>}
              </div>

              {/* Password */}
              <div className="reg-field">
                <label className="reg-label">Password <span className="req">*</span></label>
                <div className="reg-input-wrap">
                  <Lock className="reg-input-icon" size={15} />
                  <input
                    name="password" type={showPassword ? "text" : "password"} value={formData.password}
                    onChange={handleChange} onBlur={() => handleBlur("password")}
                    className={`reg-input${errors.password && touched.password ? " error" : ""}`}
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" className="reg-input-icon-right" onClick={() => setShowPassword(v => !v)} style={{ background: "none", border: "none", padding: 0 }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {formData.password && (
                  <>
                    <div className="pw-strength-bars">
                      {[1, 2, 3, 4].map(l => (
                        <div key={l} className={`pw-strength-bar${passwordStrength >= l ? ` ${pwStrengthActiveClass[passwordStrength - 1]}` : ""}`} />
                      ))}
                    </div>
                    <p className="pw-strength-text">Strength: {pwStrengthLabels[passwordStrength] || "Very Weak"}{passwordStrength < 2 ? " — add uppercase, numbers & symbols" : ""}</p>
                  </>
                )}
                {errors.password && touched.password && <p className="reg-error"><XCircle size={11} />{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="reg-field">
                <label className="reg-label">Confirm Password <span className="req">*</span></label>
                <div className="reg-input-wrap">
                  <Lock className="reg-input-icon" size={15} />
                  <input
                    name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword}
                    onChange={handleChange} onBlur={() => handleBlur("confirmPassword")}
                    className={`reg-input${errors.confirmPassword && touched.confirmPassword ? " error" : ""}${formData.confirmPassword && formData.password === formData.confirmPassword ? " success" : ""}`}
                    placeholder="Repeat password"
                  />
                  <button type="button" className="reg-input-icon-right" onClick={() => setShowConfirmPassword(v => !v)} style={{ background: "none", border: "none", padding: 0 }}>
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && <p className="reg-error"><XCircle size={11} />{errors.confirmPassword}</p>}
                {formData.confirmPassword && formData.password === formData.confirmPassword && <p className="reg-success-note"><CheckCircle size={11} />Passwords match</p>}
              </div>

              {/* Referral */}
              <div className="reg-field">
                <label className="reg-label">Referral Code <span className="opt">(optional)</span></label>
                <div className="reg-input-wrap">
                  <Gift className="reg-input-icon" size={15} />
                  <input
                    name="referralCode" type="text" value={formData.referralCode}
                    onChange={handleChange}
                    className="reg-input"
                    placeholder="Enter code for 30 days free premium"
                  />
                </div>
                <p className="reg-referral-note">✦ Valid referral codes unlock 30 days of Premium for free</p>
              </div>

              {/* CAPTCHA */}
              {showCaptcha && (
                <div className="reg-captcha-box">
                  <label className="reg-label" style={{ marginBottom: "0.5rem" }}>Security Check</label>
                  <div className="reg-captcha-row">
                    <div className="reg-captcha-code">{captchaCode}</div>
                    <button type="button" className="reg-captcha-refresh" onClick={generateCaptcha}>↻</button>
                  </div>
                  <input
                    type="text" placeholder="Type the code above" value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    className="reg-input" style={{ marginTop: "0.5rem" }}
                  />
                  {errors.captcha && <p className="reg-error"><XCircle size={11} />{errors.captcha}</p>}
                </div>
              )}

              {/* Checkboxes */}
              <div style={{ marginTop: "1.25rem" }}>
                <div className="reg-checkbox-row">
                  <input id="agreeTerms" name="agreeTerms" type="checkbox"
                    checked={formData.agreeTerms} onChange={handleChange} className="reg-checkbox" />
                  <label htmlFor="agreeTerms" className="reg-checkbox-label">
                    I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                    {errors.agreeTerms && <span style={{ display: "block", color: "#d9644a", fontSize: "0.73rem", marginTop: "0.2rem" }}>{errors.agreeTerms}</span>}
                  </label>
                </div>
                <div className="reg-checkbox-row">
                  <input id="marketing" type="checkbox" checked={agreeToMarketing}
                    onChange={e => setAgreeToMarketing(e.target.checked)} className="reg-checkbox" />
                  <label htmlFor="marketing" className="reg-checkbox-label">
                    Send me match suggestions and updates by email
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="reg-submit-btn">
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Creating your account…
                  </>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>

              <p className="reg-signin-link">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </form>
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};

export default RegisterPage;