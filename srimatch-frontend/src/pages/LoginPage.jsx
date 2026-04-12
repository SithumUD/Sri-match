// LoginPage.jsx - Redesigned to match SriMatch luxury aesthetic
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .lp-root * { box-sizing: border-box; }

  .lp-root {
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

  /* Decorative blobs */
  .lp-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.16;
    pointer-events: none;
    z-index: 0;
  }
  .lp-blob-1 { width: 480px; height: 480px; background: #c9856a; top: -100px; right: -80px; }
  .lp-blob-2 { width: 380px; height: 380px; background: #8b6248; bottom: -80px; left: -80px; }
  .lp-blob-3 { width: 240px; height: 240px; background: #e8b89a; top: 50%; left: 35%; }

  /* Card */
  .lp-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(120,60,30,0.12), 0 8px 24px rgba(0,0,0,0.05);
    overflow: hidden;
  }

  /* Top brand strip */
  .lp-top {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 2.5rem 2.5rem 2rem;
    text-align: center;
    position: relative;
  }
  .lp-top::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 32px;
    background: #ffffff;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }

  .lp-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.04em;
    text-decoration: none;
    display: block;
    margin-bottom: 0.25rem;
    transition: opacity 0.2s;
  }
  .lp-logo:hover { opacity: 0.85; }
  .lp-logo .gold { color: #e8c97a; }
  .lp-logo .heart { color: #f4a0a0; }

  .lp-tagline {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.6);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    font-weight: 300;
  }

  /* Body */
  .lp-body { padding: 2rem 2.5rem 2.5rem; }

  .lp-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #2d1810;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }
  .lp-sub {
    font-size: 0.85rem;
    color: #9a7060;
    margin-bottom: 1.75rem;
  }

  /* Social row */
  .lp-social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
  .lp-social-btn {
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
    font-family: 'DM Sans', sans-serif;
  }
  .lp-social-btn:hover { border-color: #c9856a; background: #fff5f0; }

  /* Divider */
  .lp-divider {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.25rem 0;
    color: #c4a99a; font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .lp-divider::before, .lp-divider::after {
    content: ''; flex: 1; height: 1px; background: #ede5e0;
  }

  /* Alert */
  .lp-alert {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: #fef1ee;
    border: 1px solid #f5c4b8;
    display: flex; align-items: flex-start; gap: 0.5rem;
    font-size: 0.82rem; color: #8b3020;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  /* Fields */
  .lp-field { margin-bottom: 1.1rem; }
  .lp-label {
    display: block;
    font-size: 0.8rem; font-weight: 500;
    color: #4a3028; margin-bottom: 0.4rem; letter-spacing: 0.02em;
  }
  .lp-input-wrap { position: relative; }
  .lp-icon-left {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #c4a99a; pointer-events: none;
  }
  .lp-icon-right {
    position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #c4a99a; cursor: pointer; background: none; border: none; padding: 0;
    display: flex; align-items: center;
  }
  .lp-input {
    width: 100%;
    padding: 0.7rem 2.5rem;
    border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.88rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; outline: none;
  }
  .lp-input:focus {
    border-color: #c9856a; background: #fff;
    box-shadow: 0 0 0 3px rgba(201,133,106,0.12);
  }
  .lp-input::placeholder { color: #c4b0a5; }

  /* Remember / forgot row */
  .lp-meta-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem; font-size: 0.8rem;
  }
  .lp-remember { display: flex; align-items: center; gap: 0.45rem; color: #6b4a3a; cursor: pointer; }
  .lp-remember input { accent-color: #8b4e2e; width: 15px; height: 15px; cursor: pointer; }
  .lp-forgot { color: #8b4e2e; text-decoration: none; font-weight: 500; }
  .lp-forgot:hover { text-decoration: underline; text-underline-offset: 2px; }

  /* Submit */
  .lp-submit {
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #3d1f12 0%, #8b4e2e 60%, #c9856a 100%);
    color: #fff; border: none; border-radius: 12px;
    font-size: 0.92rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    box-shadow: 0 6px 20px rgba(139,78,46,0.28);
  }
  .lp-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(139,78,46,0.36);
  }
  .lp-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Spinner */
  .lp-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lp-spin 0.75s linear infinite;
  }
  @keyframes lp-spin { to { transform: rotate(360deg); } }

  /* Footer links */
  .lp-footer {
    text-align: center; margin-top: 1.5rem;
    font-size: 0.82rem; color: #9a7060;
  }
  .lp-footer a { color: #8b4e2e; font-weight: 500; text-decoration: none; }
  .lp-footer a:hover { text-decoration: underline; text-underline-offset: 2px; }

  /* Decorative bottom ornament */
  .lp-ornament {
    text-align: center; margin-top: 1.25rem;
    font-size: 0.72rem; color: #d4b8a8; letter-spacing: 0.15em;
  }

  @media (max-width: 480px) {
    .lp-card { border-radius: 20px; }
    .lp-body { padding: 1.5rem 1.5rem 2rem; }
    .lp-top { padding: 2rem 1.5rem 1.75rem; }
  }
`;

/* ─── Icon helpers ───────────────────────────────────────────────────────── */
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

/* ─── Component ──────────────────────────────────────────────────────────── */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/home");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/home");
      } else {
        setError('Invalid email or password. Hint: use an email containing "test".');
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lp-root">
        {/* Ambient blobs */}
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />

        <div className="lp-card">
          {/* Brand header */}
          <div className="lp-top">
            <Link to="/" className="lp-logo">
              <span className="gold">Sri</span>Match<span className="heart"> ♥</span>
            </Link>
            <p className="lp-tagline">Where traditions meet forever</p>
          </div>

          <div className="lp-body">
            <h2 className="lp-heading">Welcome back</h2>
            <p className="lp-sub">Sign in to continue your journey to find love</p>

            {/* Social login */}
            <div className="lp-social-row">
              <button type="button" className="lp-social-btn">
                <GoogleIcon /> Google
              </button>
              <button type="button" className="lp-social-btn">
                <FacebookIcon /> Facebook
              </button>
            </div>

            <div className="lp-divider">or sign in with email</div>

            {/* Error */}
            {error && (
              <div className="lp-alert">
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="lp-field">
                <label htmlFor="email" className="lp-label">Email Address</label>
                <div className="lp-input-wrap">
                  <Mail className="lp-icon-left" size={15} />
                  <input
                    id="email" name="email" type="email" autoComplete="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="lp-input" placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <label htmlFor="password" className="lp-label">Password</label>
                <div className="lp-input-wrap">
                  <Lock className="lp-icon-left" size={15} />
                  <input
                    id="password" name="password" type={showPassword ? "text" : "password"}
                    autoComplete="current-password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="lp-input" placeholder="Your password"
                  />
                  <button type="button" className="lp-icon-right" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="lp-meta-row">
                <label className="lp-remember">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                  Remember me
                </label>
                <a href="#" className="lp-forgot">Forgot password?</a>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="lp-submit">
                {loading
                  ? <><div className="lp-spinner" /> Signing in…</>
                  : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="lp-footer">
              <p>Don't have an account? <Link to="/register">Create one</Link></p>
            </div>

            <div className="lp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;