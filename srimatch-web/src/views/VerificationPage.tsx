"use client";

// VerificationPage.tsx - Redesigned with Phone Verification & Luxury Aesthetic
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  AlertCircle,
  XCircle,
  Upload,
  Clock,
  Camera,
  CheckCircle,
  Info,
  X,
  Award,
  Lock,
  Star,
  ShieldCheck,
  QrCode,
  RefreshCw,
  Smartphone,
  Phone,
} from "lucide-react";
import VerificationService from "../services/verification.service";

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
    background: linear-gradient(135deg, #15803d, #16a34a);
    color: #fff;
    box-shadow: 0 4px 12px rgba(22,163,74,0.3);
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
  .vp-step-line.done { background: linear-gradient(90deg, #16a34a, #c9856a); }
  .vp-step-line.idle { background: #f0ddd5; }

  /* ── Section heading ── */
  .vp-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem; font-weight: 600; color: #2d1810;
    margin-bottom: 0.3rem;
  }
  .vp-section-sub { font-size: 0.82rem; color: #9a7060; margin-bottom: 1.75rem; line-height: 1.5; }

  /* ── Phone box ── */
  .vp-phone-box {
    background: #fdfaf8;
    border: 1.5px solid #f0ddd5;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  .vp-phone-verified {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    color: #166534;
    font-size: 0.85rem;
    font-weight: 600;
  }

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

  /* Selfie zone */
  .vp-selfie-zone {
    height: 220px;
    border: 2px dashed #ddd0c8; border-radius: 14px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.5rem; cursor: pointer; background: #fdf8f5; transition: all 0.2s;
    margin-bottom: 2rem;
  }
  .vp-selfie-zone:hover { border-color: #c9856a; background: #fff5f0; }
  .vp-selfie-preview { position: relative; max-height: 280px; border-radius: 14px; overflow: hidden; margin-bottom: 2rem; }
  .vp-selfie-preview img { width: 100%; max-height: 280px; object-fit: contain; background: #fdf8f5; display: block; }

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

  @media (max-width: 640px) {
    .vp-root { padding: 1rem 0.75rem 6rem; }
    .vp-card-top { padding: 1.5rem 1.25rem; gap: 0.85rem; }
    .vp-top-title { font-size: 1.4rem; }
    .vp-body { padding: 1.25rem 1rem 1.75rem; }
    .vp-stepper { margin-bottom: 1.5rem; }
    .vp-step-label { font-size: 0.6rem; }
    .vp-id-grid { grid-template-columns: 1fr; gap: 0.6rem; }
    .vp-upload-grid { grid-template-columns: 1fr; }
    .vp-status-card { padding: 2.5rem 1.25rem; }
    .vp-status-title { font-size: 1.6rem; }
  }
`;

/* ─── ID Type data ───────────────────────────────────────────────────────── */
const ID_TYPES = [
  { key: "NIC", label: "National ID (NIC)" },
  { key: "PASSPORT", label: "Passport" },
  { key: "DRIVING_LICENSE", label: "Driver's License" },
];

const ID_LABELS: Record<string, string> = {
  NIC: "National ID",
  PASSPORT: "Passport",
  DRIVING_LICENSE: "Driver's License",
};

const STEPS = [
  { label: "Phone" },
  { label: "ID Type" },
  { label: "Upload" },
  { label: "Selfie" },
  { label: "Review" },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const VerificationPage = () => {
  const { user, token, setUser } = useAuth() as any;

  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState("NIC");
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [polling, setPolling] = useState(false);
  const [useLocalCamera, setUseLocalCamera] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  // Phone state (Notify.lk)
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState("");

  const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api$/, "");
  const authHeader = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
  }, [user?.phoneNumber]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await VerificationService.getStatus();
      setVerificationData(res.data);

      if (res.data?.status === "PENDING") {
        setStep(4);
        setPolling(true);
      }
    } catch (err) {
      console.error("Fetch verification status error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (polling && verificationData?.selfieSessionToken && !useLocalCamera) {
      interval = setInterval(async () => {
        try {
          const res = await VerificationService.getStatus();
          if (res.data?.status === "UNDER_REVIEW") {
            setVerificationData(res.data);
            setPolling(false);
            setStep(5);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [polling, verificationData, useLocalCamera]);

  useEffect(() => {
    if (step === 4 && useLocalCamera && !localPhoto) {
      startLocalCamera();
    } else {
      stopLocalCamera();
    }
    return () => stopLocalCamera();
  }, [step, useLocalCamera, localPhoto]);

  const startLocalCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setLocalStream(s);
      const video = document.getElementById("localVideo") as HTMLVideoElement;
      if (video) video.srcObject = s;
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please use the QR code mobile option.");
      setUseLocalCamera(false);
    }
  };

  const stopLocalCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      setLocalStream(null);
    }
  };

  const captureLocalPhoto = () => {
    const video = document.getElementById("localVideo") as HTMLVideoElement;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    setLocalPhoto(canvas.toDataURL("image/jpeg"));
    stopLocalCamera();
  };

  const handleRequestPhoneOtp = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      setPhoneMsg("Please enter a valid mobile number (e.g. 0771234567)");
      return;
    }
    setOtpSending(true);
    setPhoneMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/users/me/request-phone-otp`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setPhoneMsg("✓ Verification code sent via SMS (Notify.lk)");
      } else {
        setPhoneMsg(data.message || "Failed to send SMS OTP");
      }
    } catch {
      setPhoneMsg("Network error sending OTP code");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.trim().length !== 6) {
      setPhoneMsg("Please enter the 6-digit OTP code");
      return;
    }
    setOtpVerifying(true);
    setPhoneMsg("");
    try {
      const res = await fetch(`${apiBase}/api/v1/users/me/verify-phone`, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({ otp: phoneOtp.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPhoneMsg("✓ Phone number verified successfully!");
        setOtpSent(false);
        setPhoneOtp("");
        setUser?.(data.data);
        setStep(2);
      } else {
        setPhoneMsg(data.message || "Invalid or expired OTP");
      }
    } catch {
      setPhoneMsg("Network error verifying OTP");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleLocalUpload = async () => {
    try {
      setIsSubmitting(true);
      if (!localPhoto) return;
      const [header, base64Data] = localPhoto.split(",");
      const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
      const binaryStr = atob(base64Data);
      const len = binaryStr.length;
      const u8arr = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        u8arr[i] = binaryStr.charCodeAt(i);
      }
      const file = new File([u8arr], "selfie.jpg", { type: mime });

      await VerificationService.submitSelfie(verificationData.selfieSessionToken, file);
      setPolling(false);
      setStep(5);
      fetchStatus();
    } catch (err) {
      alert("Failed to upload selfie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const readFile = (e: any, fileSetter: any, previewSetter: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileSetter(file);
    const r = new FileReader();
    r.onload = (ev) => previewSetter(ev.target?.result as string);
    r.readAsDataURL(file);
  };

  const handleNextToSelfie = async () => {
    try {
      setIsSubmitting(true);
      const res = await VerificationService.submitDocuments(idType, idFrontFile, idBackFile);
      setVerificationData(res.data);
      setStep(4);
      setPolling(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to upload documents");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUserVerified = Boolean(
    user?.isVerified ||
    user?.verified ||
    user?.idVerified ||
    (typeof user?.verificationStatus === "string" && user.verificationStatus === "APPROVED")
  );

  const isPhoneVerified = Boolean(user?.phoneVerified);

  const status = typeof verificationData?.status === "string"
    ? verificationData.status.toLowerCase()
    : isUserVerified && isPhoneVerified
    ? "approved"
    : typeof user?.verificationStatus === "string"
    ? user.verificationStatus.toLowerCase()
    : "not-submitted";

  const handleSubmit = async () => {
    fetchStatus();
  };

  /* ── Status screens ── */
  if (status === "approved") {
    return (
      <>
        <style>{styles}</style>
        <div className="vp-root">
          <div className="vp-wrap">
            <div className="vp-status-card">
              <div className="vp-status-icon green">
                <CheckCircle size={40} style={{ color: "#2e7d4a" }} />
              </div>
              <h1 className="vp-status-title">Profile Fully Verified!</h1>
              <p className="vp-status-sub">
                Congratulations! Both your mobile phone and official government identity have been validated. Your profile now proudly displays the trusted green badge.
              </p>
              <div className="vp-status-pill green">
                <ShieldCheck size={15} /> Verified Member
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

  if (status === "under_review") {
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
                Your verification documents are being reviewed by our moderation team (usually 2–4 hours). We will notify you as soon as your verified badge is activated.
              </p>
              <div className="vp-status-pill amber">
                <Clock size={14} /> Pending Moderation
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
              <h1 className="vp-status-title">Verification Incomplete</h1>
              <p className="vp-status-sub">
                We couldn't verify your identity with the provided images. Please ensure your ID photos and selfie are clearly visible and well-lit.
              </p>
              <div className="vp-status-pill red">
                <XCircle size={14} /> Please Try Again
              </div>
              <div>
                <button className="vp-retry-btn" onClick={() => setStep(1)}>
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
                <div className="vp-top-title">Profile Verification</div>
                <div className="vp-top-sub">Authenticate your mobile number &amp; government ID to earn the trusted green tick</div>
              </div>
            </div>

            <div className="vp-body">

              {/* Stepper */}
              <div className="vp-stepper">
                {STEPS.map((s, i) => {
                  const n = i + 1;
                  const isDone = (n === 1 && isPhoneVerified) || n < step;
                  const state = isDone ? "done" : n === step ? "active" : "idle";
                  return (
                    <React.Fragment key={n}>
                      <div className="vp-step-item">
                        <div className={`vp-step-circle ${state}`}>
                          {state === "done" ? <CheckCircle size={14} /> : n}
                        </div>
                        <span className={`vp-step-label ${state === "active" ? "active" : ""}`}>{s.label}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`vp-step-line ${isDone ? "done" : "idle"}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* ── STEP 1: Phone Verification ── */}
              {step === 1 && (
                <>
                  <h2 className="vp-section-title">Step 1: Mobile Phone Verification</h2>
                  <p className="vp-section-sub">
                    Verify your Sri Lankan mobile number to protect your account and verify your contact identity via Notify.lk SMS Gateway.
                  </p>

                  <div className="vp-phone-box">
                    {isPhoneVerified ? (
                      <div className="vp-phone-verified">
                        <CheckCircle size={18} color="#16a34a" />
                        <div>
                          <div>Phone Verified ✓</div>
                          <div style={{ fontSize: "0.75rem", color: "#15803d", fontWeight: 400, marginTop: "2px" }}>
                            {user?.phoneNumber || phoneNumber} · Verified via Notify.lk SMS
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#6b4a3a", marginBottom: "6px" }}>
                          Sri Lankan Mobile Number
                        </label>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "0.75rem" }}>
                          <input
                            type="tel"
                            placeholder="07XXXXXXXX or 947XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "0.65rem 0.9rem",
                              border: "1.5px solid #e8ddd8",
                              borderRadius: "10px",
                              fontSize: "0.85rem",
                              background: "#fff",
                              outline: "none",
                            }}
                          />
                          <button
                            type="button"
                            className="vp-btn-next"
                            style={{ padding: "0.6rem 1.25rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                            onClick={handleRequestPhoneOtp}
                            disabled={otpSending || !phoneNumber}
                          >
                            {otpSending ? "Sending SMS..." : (otpSent ? "Resend OTP" : "Send SMS OTP")}
                          </button>
                        </div>

                        {otpSent && (
                          <div style={{ background: "#fdf5ee", border: "1px solid #f0ddd5", borderRadius: "10px", padding: "1rem", marginTop: "1rem" }}>
                            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#8b4e2e", marginBottom: "0.35rem" }}>
                              Enter 6-Digit SMS Verification Code
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                value={phoneOtp}
                                onChange={(e) => setPhoneOtp(e.target.value)}
                                style={{
                                  width: "140px",
                                  padding: "0.6rem",
                                  textAlign: "center",
                                  letterSpacing: "3px",
                                  fontWeight: 700,
                                  fontSize: "1rem",
                                  border: "1.5px solid #e8ddd8",
                                  borderRadius: "10px",
                                  background: "#fff",
                                }}
                              />
                              <button
                                type="button"
                                className="vp-btn-next"
                                style={{ padding: "0.6rem 1.25rem", fontSize: "0.8rem" }}
                                onClick={handleVerifyPhoneOtp}
                                disabled={otpVerifying || !phoneOtp}
                              >
                                {otpVerifying ? "Verifying..." : "Confirm OTP"}
                              </button>
                            </div>
                          </div>
                        )}

                        {phoneMsg && (
                          <div style={{ fontSize: "0.78rem", color: phoneMsg.startsWith("✓") ? "#16a34a" : "#dc2626", marginTop: "0.5rem" }}>
                            {phoneMsg}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="vp-nav">
                    <div />
                    <button
                      className="vp-btn-next"
                      onClick={() => setStep(2)}
                      disabled={!isPhoneVerified}
                    >
                      {isPhoneVerified ? "Continue to ID Verification →" : "Verify Phone to Continue →"}
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 2: ID Type ── */}
              {step === 2 && (
                <>
                  <h2 className="vp-section-title">Step 2: Select Government ID Type</h2>
                  <p className="vp-section-sub">Choose the identification document you'd like to use. Ensure it's valid and government-issued.</p>
                  <div className="vp-id-grid">
                    {ID_TYPES.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        className={`vp-id-btn${idType === t.key ? " selected" : ""}`}
                        onClick={() => setIdType(t.key)}
                      >
                        <div className="vp-id-icon">
                          <ShieldCheck size={20} color={idType === t.key ? "#e8c97a" : "#c9856a"} />
                        </div>
                        <span className="vp-id-label">{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="vp-nav">
                    <button className="vp-btn-prev" onClick={() => setStep(1)}>← Back</button>
                    <button className="vp-btn-next" onClick={() => setStep(3)}>
                      Continue →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Upload ID ── */}
              {step === 3 && (
                <>
                  <h2 className="vp-section-title">Step 3: Upload {ID_LABELS[idType]}</h2>
                  <p className="vp-section-sub">Upload clear photos of both sides of your document. Ensure all text is legible and edges are not cropped.</p>
                  <div className="vp-upload-grid">
                    {/* Front */}
                    <div>
                      <span className="vp-upload-label-text">Front Side of {ID_LABELS[idType]}</span>
                      {idFrontPreview ? (
                        <div className="vp-upload-preview">
                          <img src={idFrontPreview} alt="ID Front" />
                          <button
                            className="vp-remove-btn"
                            onClick={() => {
                              setIdFrontPreview(null);
                              setIdFrontFile(null);
                            }}
                            type="button"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="vp-upload-zone">
                          <Upload size={22} style={{ color: "#c9856a" }} />
                          <span>Click to upload<br />front photo</span>
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => readFile(e, setIdFrontFile, setIdFrontPreview)}
                          />
                        </label>
                      )}
                    </div>
                    {/* Back */}
                    {idType !== "PASSPORT" && (
                      <div>
                        <span className="vp-upload-label-text">Back Side of {ID_LABELS[idType]}</span>
                        {idBackPreview ? (
                          <div className="vp-upload-preview">
                            <img src={idBackPreview} alt="ID Back" />
                            <button
                              className="vp-remove-btn"
                              onClick={() => {
                                setIdBackPreview(null);
                                setIdBackFile(null);
                              }}
                              type="button"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <label className="vp-upload-zone">
                            <Upload size={22} style={{ color: "#c9856a" }} />
                            <span>Click to upload<br />back photo</span>
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => readFile(e, setIdBackFile, setIdBackPreview)}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="vp-nav">
                    <button className="vp-btn-prev" onClick={() => setStep(2)}>← Back</button>
                    <button
                      className="vp-btn-next"
                      disabled={!idFrontFile || isSubmitting}
                      onClick={handleNextToSelfie}
                    >
                      {isSubmitting ? <><div className="vp-spinner" /> Encrypting...</> : <>Continue to Selfie →</>}
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 4: Selfie ── */}
              {step === 4 && (
                <>
                  <h2 className="vp-section-title">Step 4: Live Selfie Liveness Check</h2>
                  <p className="vp-section-sub">Take a quick live photo to ensure your face matches the submitted ID. Scan the QR code with your mobile or use this device's camera.</p>

                  <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", background: "#fdf8f4", padding: "0.4rem", borderRadius: "12px" }}>
                    <button
                      className={`vp-id-btn ${!useLocalCamera ? "selected" : ""}`}
                      style={{ flex: 1, padding: "0.75rem", flexDirection: "row" }}
                      onClick={() => setUseLocalCamera(false)}
                    >
                      <QrCode size={16} /> Mobile Camera (QR Code)
                    </button>
                    <button
                      className={`vp-id-btn ${useLocalCamera ? "selected" : ""}`}
                      style={{ flex: 1, padding: "0.75rem", flexDirection: "row" }}
                      onClick={() => setUseLocalCamera(true)}
                    >
                      <Camera size={16} /> This Device Webcam
                    </button>
                  </div>

                  {!useLocalCamera ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "2rem", background: "#fdfaf8", borderRadius: "20px", border: "1px solid #f0ddd5", marginBottom: "2rem" }}>
                      <div style={{ padding: "1rem", background: "#fff", borderRadius: "12px", boxShadow: "0 8px 24px rgba(139,78,46,0.1)" }}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${typeof window !== "undefined" ? window.location.origin : ""}/mobile-selfie?token=${verificationData?.selfieSessionToken}`}
                          alt="Scan to take selfie"
                          style={{ width: "180px", height: "180px" }}
                        />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#4a3028" }}>Scan with your mobile camera</p>
                        <p style={{ fontSize: "0.75rem", color: "#9a7060", marginTop: "0.25rem" }}>The page will automatically update once you take the selfie on your phone.</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#8b4e2e", fontSize: "0.8rem", fontWeight: 600 }}>
                        <RefreshCw size={14} className="animate-spin" />
                        Waiting for mobile selfie...
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                      {localPhoto ? (
                        <div className="vp-selfie-preview" style={{ width: "100%" }}>
                          <img src={localPhoto} alt="Selfie" style={{ width: "100%", borderRadius: "14px" }} />
                          <button className="vp-remove-btn" onClick={() => setLocalPhoto(null)}><X size={14} /></button>
                        </div>
                      ) : (
                        <div style={{ width: "100%", aspectRatio: "4/3", background: "#000", borderRadius: "20px", overflow: "hidden", position: "relative" }}>
                          <video id="localVideo" autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
                          <button
                            className="vp-btn-next"
                            style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", borderRadius: "50%", width: "56px", height: "56px", padding: 0, justifyContent: "center" }}
                            onClick={captureLocalPhoto}
                          >
                            <Camera size={24} />
                          </button>
                        </div>
                      )}
                      <p style={{ fontSize: "0.75rem", color: "#9a7060" }}>Make sure your face is clearly visible and unobstructed.</p>
                    </div>
                  )}

                  <div className="vp-nav">
                    <button className="vp-btn-prev" onClick={() => setStep(3)}>← Back</button>
                    {useLocalCamera && localPhoto && (
                      <button className="vp-btn-next" onClick={handleLocalUpload} disabled={isSubmitting}>
                        {isSubmitting ? <><div className="vp-spinner" /> Uploading...</> : <>Submit Selfie →</>}
                      </button>
                    )}
                    {!localPhoto && <div />}
                  </div>
                </>
              )}

              {/* ── STEP 5: Review ── */}
              {step === 5 && (
                <>
                  <h2 className="vp-section-title">Step 5: Review &amp; Submit</h2>
                  <p className="vp-section-sub">Please review your verification details before final submission.</p>

                  <div className="vp-phone-verified" style={{ marginBottom: "1.5rem" }}>
                    <CheckCircle size={18} color="#16a34a" />
                    <div>
                      <div>Mobile Phone Authenticated: {user?.phoneNumber || phoneNumber}</div>
                      <div style={{ fontSize: "0.74rem", color: "#15803d", fontWeight: 400 }}>Verified via Notify.lk SMS</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", padding: "1.5rem", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #dcfce7", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#16a34a", fontWeight: 600 }}>
                      <CheckCircle size={18} />
                      ID Documents &amp; Selfie Received Successfully
                    </div>
                  </div>

                  <div className="vp-info-box">
                    <Info size={16} style={{ color: "#8b4e2e", flexShrink: 0, marginTop: 2 }} />
                    <p>
                      <strong>Security Guarantee — </strong>
                      Your ID documents are encrypted in transit and at rest. We never share your government documents or personal number with any third parties.
                    </p>
                  </div>

                  <div className="vp-nav">
                    <button className="vp-btn-prev" onClick={() => setStep(4)}>← Back</button>
                    <button className="vp-btn-next" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? <><div className="vp-spinner" /> Submitting…</> : <>Complete Verification 🛡️</>}
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationPage;