"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { Camera, CheckCircle, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import VerificationService from "../services/verification.service";

const styles = `
  .msp-root {
    min-height: 100vh; background: #fdf8f4; color: #2d1810;
    padding: 1.5rem; display: flex; flex-direction: column; align-items: center;
    font-family: 'DM Sans', sans-serif;
  }
  .msp-card {
    background: #fff; border-radius: 24px; padding: 2rem; width: 100%; max-width: 450px;
    box-shadow: 0 20px 48px rgba(120,60,30,0.1); text-align: center;
  }
  .msp-title { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; }
  .msp-sub { font-size: 0.85rem; color: #9a7060; margin-bottom: 2rem; }
  
  .msp-camera-box {
    width: 100%; aspect-ratio: 3/4; background: #000; border-radius: 20px;
    overflow: hidden; position: relative; margin-bottom: 2rem;
  }
  .msp-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
  .msp-canvas { display: none; }
  
  .msp-shutter {
    width: 64px; height: 64px; border-radius: 50%; border: 4px solid #fff;
    background: #8b4e2e; cursor: pointer; display: flex; align-items: center; justify-content: center;
    position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  
  .msp-btn {
    width: 100%; padding: 0.85rem; border-radius: 99px; border: none;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e);
    color: #fff; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  }
`;

function MobileSelfieContent() {
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get("token") : null;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing session token.");
      return;
    }
    startCamera();
    return () => stopCamera();
  }, [token]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Un-mirror image
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(dataUrl);
    stopCamera();
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const uploadSelfie = async () => {
    if (!photo || !token) return;
    setLoading(true);
    setError(null);
    try {
      // Convert base64 to blob
      const res = await fetch(photo);
      const blob = await res.blob();
      const file = new File([blob], "mobile-selfie.jpg", { type: "image/jpeg" });
      
      const formData = new FormData();
      formData.append("token", token);
      formData.append("selfie", file);
      
      const uploadRes = await VerificationService.uploadMobileSelfie(formData);
      if (uploadRes && (uploadRes.success || uploadRes.status === "SUCCESS")) {
        setSuccess(true);
      } else {
        setError(uploadRes.message || "Failed to upload selfie.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="msp-root">
      <style>{styles}</style>
      <div className="msp-card">
        {success ? (
          <div>
            <CheckCircle size={56} color="#16a34a" style={{ margin: "0 auto 1.5rem" }} />
            <h2 className="msp-title">Selfie Submitted!</h2>
            <p className="msp-sub">
              Your identity photo has been received successfully. You can now return to your desktop browser to complete verification.
            </p>
          </div>
        ) : (
          <div>
            <ShieldCheck size={36} color="#8b4e2e" style={{ margin: "0 auto 0.75rem" }} />
            <h2 className="msp-title">Take a Live Selfie</h2>
            <p className="msp-sub">
              Position your face clearly within the frame. Ensure good lighting and remove any glasses/hats.
            </p>
            
            {error && (
              <div style={{ background: "#fee2e2", color: "#dc2626", padding: "0.75rem", borderRadius: "12px", fontSize: "0.8rem", marginBottom: "1rem" }}>
                <AlertCircle size={14} style={{ display: "inline", marginRight: "4px" }} />
                {error}
              </div>
            )}

            <div className="msp-camera-box">
              {photo ? (
                <img src={photo} alt="Captured selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="msp-video" />
                  <button className="msp-shutter" onClick={capturePhoto} title="Capture">
                    <Camera size={24} color="#fff" />
                  </button>
                </>
              )}
              <canvas ref={canvasRef} className="msp-canvas" />
            </div>

            {photo && (
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button 
                  onClick={retakePhoto}
                  style={{ flex: 1, padding: "0.85rem", borderRadius: "99px", border: "1px solid #d4b8a8", background: "#fff", color: "#6b3526", fontWeight: 600, cursor: "pointer" }}
                >
                  <RefreshCw size={14} style={{ display: "inline", marginRight: "4px" }} /> Retake
                </button>
                <button 
                  className="msp-btn" 
                  onClick={uploadSelfie}
                  disabled={loading}
                  style={{ flex: 2 }}
                >
                  {loading ? "Submitting..." : "Submit Photo"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobileSelfiePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MobileSelfieContent />
    </Suspense>
  );
}
