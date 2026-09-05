"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import { 
  Eye, EyeOff, Mail, Lock, User, Gift, 
  Shield, AlertCircle, ArrowRight, Loader2, Check, RefreshCw 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Validation Schema
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreeToMarketing: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

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

/* ─── Turnstile Widget ─────────────────────────────────────────────────── */
const TurnstileWidget = ({ onVerify }) => {
  const containerRef = React.useRef(null);
  const widgetIdRef = React.useRef(null);

  React.useEffect(() => {
    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    let isMounted = true;
    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: "0x4AAAAAADCRNcxH7bShZFVD", // Always Passes test key
            callback: (token) => {
              if (isMounted) onVerify(token);
            }
          });
          clearInterval(interval);
        } catch (e) {
          console.warn("Turnstile render failed, retrying...");
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [onVerify]);

  return <div ref={containerRef} className="mt-5 mb-4 flex min-h-[65px] justify-center" />;
};

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser, verifyEmail, login, resendVerification } = useAuth();
  
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("dev-bypass");
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeToTerms: false,
      agreeToMarketing: false,
    }
  });

  const formData = watch();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerUser({ ...data, captchaToken });
      if (result.success) {
        toast.success("Account created! Please verify your email.");
        setShowOtpStep(true);
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setVerificationLoading(true);
    try {
      const result = await verifyEmail(formData.email, otpValue);
      if (result.success) {
        toast.success("Email verified successfully!");
        // Attempt automatic login
        const loginResult = await login(formData.email, formData.password, captchaToken);
        if (loginResult.success) {
          router.push("/profile-creation");
        } else {
          router.push("/login");
        }
      } else {
        toast.error(result.message || "Invalid code. Please try again.");
      }
    } catch (err) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await resendVerification(formData.email);
      if (result.success) {
        toast.success("New verification code sent!");
      } else {
        toast.error(result.message || "Failed to resend code.");
      }
    } catch (err) {
      toast.error("Error resending code.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdf8f4] px-4 py-12 font-['DM_Sans']">
      {/* Decorative Blobs */}
      <div className="fixed top-[-120px] right-[-120px] z-0 h-[520px] w-[520px] rounded-full bg-[#c9856a] opacity-15 blur-[90px] pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] z-0 h-[420px] w-[420px] rounded-full bg-[#8b6248] opacity-15 blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[24px] bg-white shadow-[0_32px_80px_rgba(120,60,30,0.12),0_8px_24px_rgba(0,0,0,0.05)]">
        {/* Brand Header */}
        <div className="relative bg-gradient-to-br from-[#3d1f12] via-[#6b3526] to-[#8b4e2e] px-10 pt-10 pb-8 text-center after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-8 after:rounded-t-[50%] after:bg-white">
          <Link href="/" className="mb-1 block font-['Cormorant_Garamond'] text-[2.2rem] font-semibold tracking-wide text-white no-underline transition-opacity hover:opacity-85">
            <span className="text-[#e8c97a]">Sri</span>Match<span className="text-[#f4a0a0]"> ♥</span>
          </Link>
          <p className="text-[0.8rem] font-light tracking-[0.09em] uppercase text-white/60">Where traditions meet forever</p>
        </div>

        <div className="px-10 pt-8 pb-10">
          {!showOtpStep ? (
            <>
              <h2 className="mb-1 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-tight text-[#2d1810]">Begin your journey</h2>
              <p className="mb-7 text-[0.85rem] text-[#9a7060]">Create an account to find your perfect match</p>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] px-4 py-2.5 text-[0.82rem] font-medium text-[#4a3028] transition-all hover:border-[#c9856a] hover:bg-[#fff5f0]">
                  <GoogleIcon /> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] px-4 py-2.5 text-[0.82rem] font-medium text-[#4a3028] transition-all hover:border-[#c9856a] hover:bg-[#fff5f0]">
                  <FacebookIcon /> Facebook
                </button>
              </div>

              <div className="relative my-5 flex items-center gap-3 text-[0.78rem] tracking-wide uppercase text-[#c4a99a] before:h-px before:flex-1 before:bg-[#ede5e0] after:h-px after:flex-1 after:bg-[#ede5e0]">
                or sign up with email
              </div>

              <form onSubmit={handleSubmit(onSubmit, (err) => console.log("Register form validation errors:", err))} noValidate>
                <div className="mb-[1.1rem] grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">First Name</label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                      <input
                        {...register("firstName")}
                        className={`w-full rounded-xl border-[1.5px] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5] ${errors.firstName ? 'border-red-300' : 'border-[#e8ddd8] focus:border-[#c9856a]'}`}
                        placeholder="Amara"
                      />
                    </div>
                    {errors.firstName && <p className="mt-1 text-[0.75rem] text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Last Name</label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                      <input
                        {...register("lastName")}
                        className={`w-full rounded-xl border-[1.5px] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5] ${errors.lastName ? 'border-red-300' : 'border-[#e8ddd8] focus:border-[#c9856a]'}`}
                        placeholder="Perera"
                      />
                    </div>
                    {errors.lastName && <p className="mt-1 text-[0.75rem] text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="mb-[1.1rem]">
                  <label className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                    <input
                      {...register("email")}
                      className={`w-full rounded-xl border-[1.5px] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5] ${errors.email ? 'border-red-300' : 'border-[#e8ddd8] focus:border-[#c9856a]'}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-[0.75rem] text-red-500">{errors.email.message}</p>}
                </div>

                <div className="mb-[1.1rem]">
                  <label className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Password</label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className={`w-full rounded-xl border-[1.5px] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5] ${errors.password ? 'border-red-300' : 'border-[#e8ddd8] focus:border-[#c9856a]'}`}
                      placeholder="Min. 8 characters"
                    />
                    <button type="button" className="absolute top-1/2 right-[0.85rem] flex -translate-y-1/2 items-center bg-transparent text-[#c4a99a]" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-[0.75rem] text-red-500">{errors.password.message}</p>}
                </div>

                <div className="mb-[1.1rem]">
                  <label className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full rounded-xl border-[1.5px] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5] ${errors.confirmPassword ? 'border-red-300' : 'border-[#e8ddd8] focus:border-[#c9856a]'}`}
                      placeholder="Repeat password"
                    />
                    <button type="button" className="absolute top-1/2 right-[0.85rem] flex -translate-y-1/2 items-center bg-transparent text-[#c4a99a]" onClick={() => setShowConfirmPassword(v => !v)}>
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-[0.75rem] text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <div className="mb-6">
                  <label className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Referral Code <span className="text-[#b09080] font-light">(optional)</span></label>
                  <div className="relative">
                    <Gift className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                    <input
                      {...register("referralCode")}
                      className="w-full rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:border-[#c9856a] placeholder:text-[#c4b0a5]"
                      placeholder="Unlock 30 days free premium"
                    />
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <input 
                      {...register("agreeToTerms")}
                      id="agreeToTerms" type="checkbox" 
                      className="mt-1 h-[15px] w-[15px] cursor-pointer accent-[#8b4e2e]" 
                    />
                    <label htmlFor="agreeToTerms" className="text-[0.8rem] leading-relaxed text-[#6b4a3a]">
                      I agree to the <a href="#" className="font-medium text-[#8b4e2e] underline underline-offset-2">Terms & Conditions</a> and <a href="#" className="font-medium text-[#8b4e2e] underline underline-offset-2">Privacy Policy</a>
                    </label>
                  </div>
                  {errors.agreeToTerms && <p className="text-[0.75rem] text-red-500 ml-[25px]">{errors.agreeToTerms.message}</p>}
                  
                  <div className="flex items-start gap-2.5">
                    <input 
                      {...register("agreeToMarketing")}
                      id="agreeToMarketing" type="checkbox" 
                      className="mt-1 h-[15px] w-[15px] cursor-pointer accent-[#8b4e2e]" 
                    />
                    <label htmlFor="agreeToMarketing" className="text-[0.8rem] leading-relaxed text-[#6b4a3a]">
                      Send me match suggestions and updates by email
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] p-[0.85rem] font-['DM_Sans'] text-[0.92rem] font-medium tracking-wide text-white shadow-[0_6px_20px_rgba(139,78,46,0.28)] transition-all hover:translate-y-[-1px] hover:shadow-[0_10px_28px_rgba(139,78,46,0.36)] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Creating account…
                    </>
                  ) : (
                    <>Create Account <ArrowRight size={16} /></>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-[0.82rem] text-[#9a7060]">
                Already have an account? <Link href="/login" className="font-medium text-[#8b4e2e] no-underline hover:underline hover:underline-offset-2">Sign in</Link>
              </p>
            </>
          ) : (
            /* OTP Step */
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#fdf5f0] text-[#8b4e2e]">
                <Mail size={32} />
              </div>
              <h2 className="mb-2 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-tight text-[#2d1810]">Verify your email</h2>
              <p className="mb-8 text-[0.85rem] text-[#9a7060]">
                We've sent a 6-digit verification code to <br />
                <strong className="text-[#4a3028]">{formData.email}</strong>
              </p>

              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-3.5 text-center font-['DM_Sans'] text-[1.75rem] font-bold tracking-[0.75rem] text-[#2d1810] outline-none transition-all focus:border-[#c9856a] focus:bg-white placeholder:text-[#c4b0a5]"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={verificationLoading || otpValue.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] p-[0.85rem] font-['DM_Sans'] text-[0.92rem] font-medium tracking-wide text-white shadow-[0_6px_20px_rgba(139,78,46,0.28)] transition-all hover:translate-y-[-1px] hover:shadow-[0_10px_28px_rgba(139,78,46,0.36)] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {verificationLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Verifying…
                    </>
                  ) : (
                    <>Verify & Continue <Check size={18} /></>
                  )}
                </button>

                <div className="mt-8 flex flex-col items-center gap-4">
                  <button 
                    type="button" 
                    onClick={handleResendOtp}
                    className="flex items-center gap-1.5 text-[0.8rem] font-medium text-[#9a7060] transition-colors hover:text-[#8b4e2e]"
                  >
                    <RefreshCw size={14} /> Resend code
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowOtpStep(false)}
                    className="text-[0.8rem] font-medium text-[#8b4e2e] no-underline hover:underline underline-offset-4"
                  >
                    Change email address
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;