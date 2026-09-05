"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .alp-root * { box-sizing: border-box; }

  .alp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #f4f6f8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* Decorative blobs - cooler colors for admin */
  .alp-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.12;
    pointer-events: none;
    z-index: 0;
  }
  .alp-blob-1 { width: 480px; height: 480px; background: #6b8ea5; top: -100px; right: -80px; }
  .alp-blob-2 { width: 380px; height: 380px; background: #3d5a73; bottom: -80px; left: -80px; }
  .alp-blob-3 { width: 240px; height: 240px; background: #a2b9ca; top: 50%; left: 35%; }

  /* Card */
  .alp-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(30,50,70,0.12), 0 8px 24px rgba(0,0,0,0.05);
    overflow: hidden;
  }

  /* Top brand strip */
  .alp-top {
    background: linear-gradient(135deg, #1d2b36 0%, #2f4556 50%, #46637b 100%);
    padding: 2.5rem 2.5rem 2rem;
    text-align: center;
    position: relative;
  }
  .alp-top::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 32px;
    background: #ffffff;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }

  .alp-logo {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.04em;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  .alp-logo-icon { color: #f4a0a0; }

  .alp-tagline {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    font-weight: 400;
  }

  /* Body */
  .alp-body { padding: 1.5rem 2.5rem 2.5rem; }

  .alp-heading {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1d2b36;
    margin-bottom: 0.25rem;
    line-height: 1.2;
    text-align: center;
  }
  .alp-sub {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 1.75rem;
    text-align: center;
  }

  /* Alert */
  .alp-alert {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: #fee2e2;
    border: 1px solid #fca5a5;
    display: flex; align-items: flex-start; gap: 0.5rem;
    font-size: 0.82rem; color: #991b1b;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  /* Fields */
  .alp-field { margin-bottom: 1.1rem; }
  .alp-label {
    display: block;
    font-size: 0.8rem; font-weight: 600;
    color: #334155; margin-bottom: 0.4rem; letter-spacing: 0.02em;
  }
  .alp-input-wrap { position: relative; }
  .alp-icon-left {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #94a3b8; pointer-events: none;
  }
  .alp-icon-right {
    position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #94a3b8; cursor: pointer; background: none; border: none; padding: 0;
    display: flex; align-items: center;
  }
  .alp-input {
    width: 100%;
    padding: 0.7rem 2.5rem;
    border: 1.5px solid #cbd5e1; border-radius: 10px;
    font-size: 0.88rem; color: #1e293b; background: #f8fafc;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; outline: none;
  }
  .alp-input:focus {
    border-color: #3b82f6; background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }
  .alp-input::placeholder { color: #cbd5e1; }

  /* Submit */
  .alp-submit {
    width: 100%;
    padding: 0.85rem;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: #fff; border: none; border-radius: 12px;
    font-size: 0.92rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.04em;
    cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    box-shadow: 0 6px 20px rgba(30,41,59,0.25);
    margin-top: 1.5rem;
  }
  .alp-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(30,41,59,0.35);
  }
  .alp-submit:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Spinner */
  .alp-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: alp-spin 0.75s linear infinite;
  }
  @keyframes alp-spin { to { transform: rotate(360deg); } }

  /* Footer links */
  .alp-footer {
    text-align: center; margin-top: 1.5rem;
    font-size: 0.82rem; color: #64748b;
  }
  .alp-footer a { color: #3b82f6; font-weight: 500; text-decoration: none; }
  .alp-footer a:hover { text-decoration: underline; text-underline-offset: 2px; }

  /* Decorative bottom ornament */
  .alp-ornament {
    text-align: center; margin-top: 1.25rem;
    font-size: 0.72rem; color: #cbd5e1; letter-spacing: 0.15em;
  }

  @media (max-width: 480px) {
    .alp-card { border-radius: 20px; }
    .alp-body { padding: 1.5rem 1.5rem 2rem; }
    .alp-top { padding: 2rem 1.5rem 1.75rem; }
  }
`;

const AdminLoginPage = () => {
  const router = useRouter();
  const { adminLogin, isAdminAuthenticated, user, isAuthenticated } = useAuth();
  const isActuallyAdmin = isAdminAuthenticated || (isAuthenticated && (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"));

  const [email, setEmail] = useState("admin@srimatch.lk");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [totpCode, setTotpCode] = useState("");

  useEffect(() => {
    if (isActuallyAdmin) router.push("/admin");
  }, [isActuallyAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await adminLogin(email, password, mfaRequired ? totpCode : null);
      
      if (result.success) {
        router.push("/admin");
      } else if (result.mfaRequired) {
        setMfaRequired(true);
        setError("Two-Factor Authentication is required.");
      } else {
        setError(result.message || "Invalid credentials.");
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
      <div className="alp-root">
        {/* Ambient blobs */}
        <div className="alp-blob alp-blob-1" />
        <div className="alp-blob alp-blob-2" />
        <div className="alp-blob alp-blob-3" />

        <div className="alp-card">
          {/* Brand header */}
          <div className="alp-top">
            <div className="alp-logo">
              <ShieldCheck size={28} className="alp-logo-icon" color="#fff" />
              SriMatch Admin
            </div>
            <p className="alp-tagline">Secure Management Portal</p>
          </div>

          <div className="alp-body">
            <h2 className="alp-heading">Admin Access</h2>
            <p className="alp-sub">Sign in with administrative privileges</p>

            {/* Error */}
            {error && (
              <div className="alp-alert">
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="alp-field">
                <label htmlFor="email" className="alp-label">Admin Email</label>
                <div className="alp-input-wrap">
                  <Mail className="alp-icon-left" size={15} />
                  <input
                    id="email" name="email" type="email" autoComplete="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="alp-input" placeholder="admin@srimatch.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="alp-field">
                <label htmlFor="password" className="alp-label">Password</label>
                <div className="alp-input-wrap">
                  <Lock className="alp-icon-left" size={15} />
                  <input
                    id="password" name="password" type={showPassword ? "text" : "password"}
                    autoComplete="current-password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="alp-input" placeholder="Admin password"
                  />
                  <button type="button" className="alp-icon-right" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* MFA Field - only shown if required */}
              {mfaRequired && (
                <div className="alp-field" style={{ animation: 'alp-fade-in 0.3s ease-out' }}>
                  <label htmlFor="totpCode" className="alp-label">Authenticator Code</label>
                  <div className="alp-input-wrap">
                    <ShieldCheck className="alp-icon-left" size={15} />
                    <input
                      id="totpCode" name="totpCode" type="text" inputMode="numeric" pattern="[0-9]*"
                      autoComplete="one-time-code" required
                      value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="alp-input" placeholder="6-digit code"
                      autoFocus
                    />
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem' }}>
                    Open your authenticator app to get the code.
                  </p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="alp-submit">
                {loading
                  ? <><div className="alp-spinner" /> Authenticating…</>
                  : <>Secure Login <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="alp-footer">
              <p><Link href="/">Return to Main Site</Link></p>
            </div>

            <div className="alp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
