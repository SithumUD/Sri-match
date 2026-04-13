// VerificationPage.jsx - Redesigned to match SriMatch luxury aesthetic
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck, Camera, Upload, CheckCircle, Clock,
  AlertCircle, XCircle, Info, X, Award, Lock, Star,
} from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .vp-root * { box-sizing: border-box; }

  .vp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2.5rem 1.5rem 4rem;
  }

  .vp-wrap {
    max-width: 720px;
    margin: 0 auto;
  }

  /* ── Card ── */
  .vp-card {
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 24px 64px rgba(120,60,30,0.1), 0 4px 16px rgba(0,0,0,0.04);
    overflow: hidden;
  }

  /* ── Card top strip ── */
  .vp-card-top {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 2rem 2.5rem;
    display: flex;
    align-items: center;
    gap: 1.1rem;
    position: relative;
  }
  .vp-card-top::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 28px;
    background: #ffffff;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }
  .vp-top-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .vp-top-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem; font-weight: 600; color: #fff;
    line-height: 1.1;
  }
  .vp-top-sub { font-size: 0.8rem; color: rgba(255,255,255,0.65); margin-top: 0.2rem; }

  /* ── Card body ── */
  .vp-body { padding: 1.75rem 2.5rem 2.5rem; }

  /* ── Progress stepper ── */
  .vp-stepper {
    display: flex;
    align-items: center;
    margin-bottom: 2.25rem;
  }
  .vp-step-item { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .vp-step-circle {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 600;
    transition: all 0.3s;
  }
  .vp-step-circle.done {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff;
    box-shadow: 0 4px 12px rgba(139,78,46,0.3);
  }
  .vp-step-circle.active {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    color: #fff;
    box-shadow: 0 4px 12px rgba(201,133,106,0.4);
  }
  .vp-step-circle.idle {
    background: #f0ddd5;
    color: #b09080;
  }
  .vp-step-label { font-size: 0.68rem; color: #9a7060; margin-top: 0.35rem; font-weight: 500; }
  .vp-step-label.active { color: #8b4e2e; }

  .vp-step-line { flex: 1; height: 2px; margin: 0 0.5rem; margin-bottom: 1.35rem; border-radius: 99px; transition: background 0.3s; }
  .vp-step-line.done { background: linear-gradient(90deg, #3d1f12, #c9856a); }
  .vp-step-line.idle { background: #f0ddd5; }

  /* ── Section heading ── */
  .vp-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.3rem;
  }
  .vp-section-sub { font-size: 0.82rem; color: #9a7060; margin-bottom: 1.75rem; line-height: 1.5; }

  /* ── ID type cards ── */
  .vp-id-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; margin-bottom: 2rem; }
  @media (max-width: 520px) { .vp-id-grid { grid-template-columns: 1fr; } }

  .vp-id-btn {
    padding: 1.1rem 0.75rem; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    border: 1.5px solid #e8ddd8; background: #fdf8f5;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .vp-id-btn:hover { border-color: #c9856a; background: #fff5f0; }
  .vp-id-btn.selected {
    border-color: #8b4e2e;
    background: linear-gradient(135deg, #fdf0e8, #fae8dc);
    box-shadow: 0 4px 16px rgba(139,78,46,0.15);
  }
  .vp-id-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .vp-id-btn.selected .vp-id-icon { background: linear-gradient(135deg, #3d1f12, #8b4e2e); }
  .vp-id-btn:not(.selected) .vp-id-icon { background: #f0ddd5; }
  .vp-id-label { font-size: 0.8rem; font-weight: 500; color: #4a3028; text-align: center; }
  .vp-id-btn.selected .vp-id-label { color: #2d1810; }

  /* ── Upload zones ── */
  .vp-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  @media (max-width: 500px) { .vp-upload-grid { grid-template-columns: 1fr; } }

  .vp-upload-label-text { font-size: 0.78rem; font-weight: 500; color: #4a3028; margin-bottom: 0.4rem; display: block; }

  .vp-upload-zone {
    height: 170px;
    border: 2px dashed #ddd0c8; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.5rem; cursor: pointer; background: #fdf8f5; transition: all 0.2s;
  }
  .vp-upload-zone:hover { border-color: #c9856a; background: #fff5f0; }
  .vp-upload-zone span { font-size: 0.75rem; color: #b09080; text-align: center; line-height: 1.5; }

  .vp-upload-preview { position: relative; height: 170px; border-radius: 14px; overflow: hidden; }
  .vp-upload-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .vp-remove-btn {
    position: absolute; top: 0.5rem; right: 0.5rem;
    width: 26px; height: 26px; border-radius: 50%;
    background: rgba(30,10,5,0.7); color: #fff;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .vp-remove-btn:hover { background: rgba(180,40,20,0.85); }

  /* Selfie zone - full width */
  .vp-selfie-zone {
    height: 220px;
    border: 2px dashed #ddd0c8; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.5rem; cursor: pointer; background: #fdf8f5; transition: all 0.2s;
    margin-bottom: 2rem;
  }
  .vp-selfie-zone:hover { border-color: #c9856a; background: #fff5f0; }
  .vp-selfie-zone span { font-size: 0.75rem; color: #b09080; text-align: center; line-height: 1.5; }
  .vp-selfie-preview { position: relative; max-height: 280px; border-radius: 14px; overflow: hidden; margin-bottom: 2rem; }
  .vp-selfie-preview img { width: 100%; max-height: 280px; object-fit: contain; background: #fdf8f5; display: block; }

  /* ── Review grid ── */
  .vp-review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; margin-bottom: 1.75rem; }
  @media (max-width: 500px) { .vp-review-grid { grid-template-columns: 1fr; } }
  .vp-review-img-label { font-size: 0.75rem; font-weight: 500; color: #4a3028; margin-bottom: 0.4rem; }
  .vp-review-img { width: 100%; height: 110px; object-fit: cover; border-radius: 10px; }

  /* ── Info box ── */
  .vp-info-box {
    display: flex; gap: 0.75rem; align-items: flex-start;
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border: 1px solid #f0ddd5; border-radius: 12px;
    padding: 1rem 1.1rem; margin-bottom: 2rem;
  }
  .vp-info-box p { font-size: 0.78rem; color: #6b4a3a; line-height: 1.6; }
  .vp-info-box strong { font-weight: 600; color: #4a3028; }

  /* ── Nav buttons ── */
  .vp-nav { display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; border-top: 1px solid #f0ddd5; }
  .vp-btn-prev {
    padding: 0.65rem 1.5rem; border: 1.5px solid #e8ddd8; border-radius: 99px;
    font-size: 0.85rem; color: #6b4a3a; background: #fdf8f5;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .vp-btn-prev:hover { border-color: #c9856a; background: #fff5f0; }
  .vp-btn-next {
    padding: 0.65rem 1.75rem;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; border-radius: 99px;
    font-size: 0.85rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
    display: flex; align-items: center; gap: 0.4rem;
  }
  .vp-btn-next:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }
  .vp-btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* ── Spinner ── */
  .vp-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: vp-spin 0.75s linear infinite;
  }
  @keyframes vp-spin { to { transform: rotate(360deg); } }

  /* ── Status pages ── */
  .vp-status-card {
    background: #fff; border-radius: 24px;
    box-shadow: 0 24px 64px rgba(120,60,30,0.1), 0 4px 16px rgba(0,0,0,0.04);
    padding: 4rem 2rem; text-align: center;
  }
  .vp-status-icon {
    width: 88px; height: 88px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.5rem;
  }
  .vp-status-icon.green { background: linear-gradient(135deg, #d4f0e0, #a8e0c0); }
  .vp-status-icon.amber { background: linear-gradient(135deg, #fdf0d4, #f5dda0); }
  .vp-status-icon.red { background: linear-gradient(135deg, #fde8e8, #f5c0c0); }

  .vp-status-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #2d1810; margin-bottom: 0.65rem;
  }
  .vp-status-sub { font-size: 0.85rem; color: #9a7060; line-height: 1.65; max-width: 420px; margin: 0 auto 1.75rem; }

  .vp-status-pill {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 1.25rem; border-radius: 99px;
    font-size: 0.8rem; font-weight: 600;
  }
  .vp-status-pill.green { background: #e0f5e8; color: #2e7d4a; }
  .vp-status-pill.amber { background: #fdf0d4; color: #8a6010; }
  .vp-status-pill.red { background: #fde8e8; color: #8a2020; }

  .vp-retry-btn {
    margin-top: 1.25rem; padding: 0.65rem 1.75rem;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; border-radius: 99px;
    font-size: 0.85rem; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
    display: inline-block;
  }
  .vp-retry-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }

  .vp-ornament { text-align: center; margin-top: 1.5rem; font-size: 0.72rem; color: #d4b8a8; letter-spacing: 0.15em; }

  /* Benefits strip */
  .vp-benefits {
    display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
    margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f0ddd5;
  }
  .vp-benefit-item { display: flex; align-items: center; gap: 0.45rem; font-size: 0.75rem; color: #8b4e2e; }

  @media (max-width: 560px) {
    .vp-body { padding: 1.5rem 1.25rem 2rem; }
    .vp-card-top { padding: 1.75rem 1.5rem; }
  }
`;

/* ─── ID Type data ───────────────────────────────────────────────────────── */
const ID_TYPES = [
  { key: "national-id", label: "National ID" },
  { key: "passport",    label: "Passport" },
  { key: "drivers-license", label: "Driver's License" },
];

const ID_LABELS = { "national-id": "National ID", passport: "Passport", "drivers-license": "Driver's License" };

const STEPS = [
  { label: "ID Type" },
  { label: "Upload" },
  { label: "Selfie" },
  { label: "Review" },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const VerificationPage = () => {
  const { user, updateUserProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState("national-id");
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(user?.isVerified ? "verified" : "not-submitted");

  const readFile = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => setter(ev.target.result);
    r.readAsDataURL(file);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setStatus("pending");
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus("verified");
        updateUserProfile({ isVerified: true });
      }, 3000);
    }, 1500);
  };

  /* ── Status screens ── */
  if (status === "verified") {
    return (
      <>
        <style>{styles}</style>
        <div className="vp-root">
          <div className="vp-wrap">
            <div className="vp-status-card">
              <div className="vp-status-icon green">
                <CheckCircle size={40} style={{ color: "#2e7d4a" }} />
              </div>
              <h1 className="vp-status-title">Account Verified!</h1>
              <p className="vp-status-sub">
                Your identity has been successfully verified. Your profile now carries the trusted verified badge, helping you attract more genuine matches.
              </p>
              <div className="vp-status-pill green">
                <ShieldCheck size={15} /> Verified Account
              </div>
              <div className="vp-benefits">
                <div className="vp-benefit-item"><Star size={13} /> 3× more matches</div>
                <div className="vp-benefit-item"><Award size={13} /> Priority in search results</div>
                <div className="vp-benefit-item"><Lock size={13} /> Trust badge on profile</div>
              </div>
              <div className="vp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (status === "pending") {
    return (
      <>
        <style>{styles}</style>
        <div className="vp-root">
          <div className="vp-wrap">
            <div className="vp-status-card">
              <div className="vp-status-icon amber">
                <Clock size={40} style={{ color: "#8a6010" }} />
              </div>
              <h1 className="vp-status-title">Under Review</h1>
              <p className="vp-status-sub">
                Your verification documents are being reviewed by our team. This process typically takes 24–48 hours. We'll notify you once complete.
              </p>
              <div className="vp-status-pill amber">
                <Clock size={14} /> Pending Review
              </div>
              <div className="vp-ornament" style={{ marginTop: "1.5rem" }}>✦ &nbsp; ✦ &nbsp; ✦</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (status === "rejected") {
    return (
      <>
        <style>{styles}</style>
        <div className="vp-root">
          <div className="vp-wrap">
            <div className="vp-status-card">
              <div className="vp-status-icon red">
                <XCircle size={40} style={{ color: "#8a2020" }} />
              </div>
              <h1 className="vp-status-title">Verification Failed</h1>
              <p className="vp-status-sub">
                We couldn't verify your identity with the provided documents. Please ensure your ID is clearly visible, well-lit, and not cropped or blurred.
              </p>
              <div className="vp-status-pill red">
                <XCircle size={14} /> Verification Failed
              </div>
              <div>
                <button className="vp-retry-btn" onClick={() => setStatus("not-submitted")}>
                  Try Again
                </button>
              </div>
              <div className="vp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Main verification flow ── */
  return (
    <>
      <style>{styles}</style>
      <div className="vp-root">
        <div className="vp-wrap">
          <div className="vp-card">

            {/* Header strip */}
            <div className="vp-card-top">
              <div className="vp-top-icon">
                <ShieldCheck size={24} color="#fff" />
              </div>
              <div>
                <div className="vp-top-title">Identity Verification</div>
                <div className="vp-top-sub">Verify your identity to receive a trusted badge and attract more matches</div>
              </div>
            </div>

            <div className="vp-body">

              {/* Stepper */}
              <div className="vp-stepper">
                {STEPS.map((s, i) => {
                  const n = i + 1;
                  const state = n < step ? "done" : n === step ? "active" : "idle";
                  return (
                    <React.Fragment key={n}>
                      <div className="vp-step-item">
                        <div className={`vp-step-circle ${state}`}>
                          {state === "done" ? <CheckCircle size={14} /> : n}
                        </div>
                        <span className={`vp-step-label ${state === "active" ? "active" : ""}`}>{s.label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`vp-step-line ${n < step ? "done" : "idle"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* ── STEP 1: ID Type ── */}
              {step === 1 && (
                <>
                  <h2 className="vp-section-title">Select ID Type</h2>
                  <p className="vp-section-sub">Choose the identification document you'd like to use. Make sure it's a government-issued document in good condition.</p>
                  <div className="vp-id-grid">
                    {ID_TYPES.map(t => (
                      <button key={t.key} type="button"
                        className={`vp-id-btn${idType === t.key ? " selected" : ""}`}
                        onClick={() => setIdType(t.key)}>
                        <div className="vp-id-icon">
                          <ShieldCheck size={20} color={idType === t.key ? "#e8c97a" : "#c9856a"} />
                        </div>
                        <span className="vp-id-label">{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="vp-nav">
                    <div />
                    <button className="vp-btn-next" onClick={() => setStep(2)}>
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 2: Upload ID ── */}
              {step === 2 && (
                <>
                  <h2 className="vp-section-title">Upload {ID_LABELS[idType]}</h2>
                  <p className="vp-section-sub">Upload clear photos of both sides of your document. Ensure all details are legible and the image is not cropped.</p>
                  <div className="vp-upload-grid">
                    {/* Front */}
                    <div>
                      <span className="vp-upload-label-text">Front of {ID_LABELS[idType]}</span>
                      {idFront ? (
                        <div className="vp-upload-preview">
                          <img src={idFront} alt="ID Front" />
                          <button className="vp-remove-btn" onClick={() => setIdFront(null)} type="button">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="vp-upload-zone">
                          <Upload size={22} style={{ color: "#c9856a" }} />
                          <span>Click to upload<br />front image</span>
                          <input type="file" hidden accept="image/*" onChange={e => readFile(e, setIdFront)} />
                        </label>
                      )}
                    </div>
                    {/* Back */}
                    <div>
                      <span className="vp-upload-label-text">Back of {ID_LABELS[idType]}</span>
                      {idBack ? (
                        <div className="vp-upload-preview">
                          <img src={idBack} alt="ID Back" />
                          <button className="vp-remove-btn" onClick={() => setIdBack(null)} type="button">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="vp-upload-zone">
                          <Upload size={22} style={{ color: "#c9856a" }} />
                          <span>Click to upload<br />back image</span>
                          <input type="file" hidden accept="image/*" onChange={e => readFile(e, setIdBack)} />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="vp-nav">
                    <button className="vp-btn-prev" onClick={() => setStep(1)}>← Back</button>
                    <button className="vp-btn-next" disabled={!idFront || !idBack} onClick={() => setStep(3)}>
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Selfie ── */}
              {step === 3 && (
                <>
                  <h2 className="vp-section-title">Take a Selfie</h2>
                  <p className="vp-section-sub">Upload a clear photo of yourself holding your {ID_LABELS[idType]} next to your face. Your face and ID should both be clearly visible.</p>
                  {selfie ? (
                    <div className="vp-selfie-preview">
                      <img src={selfie} alt="Selfie with ID" />
                      <button className="vp-remove-btn" style={{ top: "0.6rem", right: "0.6rem" }} onClick={() => setSelfie(null)} type="button">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <label className="vp-selfie-zone">
                      <Camera size={28} style={{ color: "#c9856a" }} />
                      <span>Click to take or upload a selfie<br />Hold your ID next to your face</span>
                      <input type="file" hidden accept="image/*" onChange={e => readFile(e, setSelfie)} />
                    </label>
                  )}
                  <div className="vp-nav">
                    <button className="vp-btn-prev" onClick={() => setStep(2)}>← Back</button>
                    <button className="vp-btn-next" disabled={!selfie} onClick={() => setStep(4)}>
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 4: Review ── */}
              {step === 4 && (
                <>
                  <h2 className="vp-section-title">Review & Submit</h2>
                  <p className="vp-section-sub">Please review your documents before submitting. Ensure all images are clear and all details are readable.</p>

                  <div className="vp-review-grid">
                    <div>
                      <p className="vp-review-img-label">Front of {ID_LABELS[idType]}</p>
                      <img src={idFront} alt="ID Front" className="vp-review-img" />
                    </div>
                    <div>
                      <p className="vp-review-img-label">Back of {ID_LABELS[idType]}</p>
                      <img src={idBack} alt="ID Back" className="vp-review-img" />
                    </div>
                    <div>
                      <p className="vp-review-img-label">Selfie with ID</p>
                      <img src={selfie} alt="Selfie" className="vp-review-img" />
                    </div>
                  </div>

                  <div className="vp-info-box">
                    <Info size={16} style={{ color: "#8b4e2e", flexShrink: 0, marginTop: 2 }} />
                    <p>
                      <strong>Privacy Notice — </strong>
                      Your ID documents will be securely processed and stored in accordance with our privacy policy. We never share your personal information with third parties without your explicit consent.
                    </p>
                  </div>

                  <div className="vp-nav">
                    <button className="vp-btn-prev" onClick={() => setStep(3)}>← Back</button>
                    <button className="vp-btn-next" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting
                        ? <><div className="vp-spinner" /> Submitting…</>
                        : <>Submit for Verification</>}
                    </button>
                  </div>
                </>
              )}

              <div className="vp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationPage;