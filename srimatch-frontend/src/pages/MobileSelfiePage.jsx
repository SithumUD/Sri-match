import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  .msp-title { font-family: 'Cormorant Garamond', serif; fontSize: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; }
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

const MobileSelfiePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

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

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    const data = canvas.toDataURL("image/jpeg");
    setPhoto(data);
    stopCamera();
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      // Convert base64 to file
      const res = await fetch(photo);
      const blob = await res.blob();
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      
      await VerificationService.submitSelfie(token, file);
      setSuccess(true);
    } catch (err) {
      setError("Failed to upload selfie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="msp-root">
        <style>{styles}</style>
        <div className="msp-card">
          <div style={{ background: '#f0fdf4', color: '#16a34a', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={32} />
          </div>
          <h1 className="msp-title">Selfie Captured</h1>
          <p className="msp-sub">Your selfie has been uploaded successfully. You can now close this tab and return to your computer to finish the verification.</p>
          <div style={{ color: '#8b4e2e', fontSize: '0.8rem', fontWeight: 600 }}>✦ SriMatch Secure Verification ✦</div>
        </div>
      </div>
    );
  }

  return (
    <div className="msp-root">
      <style>{styles}</style>
      <div className="msp-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#8b4e2e', marginBottom: '1rem' }}>
          <ShieldCheck size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>SriMatch Secure</span>
        </div>
        <h1 className="msp-title">Live Selfie</h1>
        <p className="msp-sub">Please take a clear selfie. Make sure your face is well-lit and fits within the frame.</p>

        {error ? (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ margin: '0 auto 0.5rem' }} />
            {error}
          </div>
        ) : photo ? (
          <div className="msp-camera-box">
            <img src={photo} alt="Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              onClick={() => { setPhoto(null); startCamera(); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        ) : (
          <div className="msp-camera-box">
            <video ref={videoRef} autoPlay playsInline className="msp-video" />
            <button className="msp-shutter" onClick={takePhoto}>
              <Camera size={28} color="#fff" />
            </button>
          </div>
        )}

        {photo && (
          <button className="msp-btn" disabled={loading} onClick={handleUpload}>
            {loading ? <RefreshCw className="animate-spin" size={18} /> : "Submit Selfie"}
          </button>
        )}
        
        <canvas ref={canvasRef} className="msp-canvas" />
      </div>
    </div>
  );
};

export default MobileSelfiePage;
