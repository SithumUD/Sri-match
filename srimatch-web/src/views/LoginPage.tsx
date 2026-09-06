"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Loader2, Shield as ShieldIcon, Check, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

import GoogleLoginButton from "../components/auth/GoogleLoginButton";

/* ─── Turnstile Widget ─────────────────────────────────────────────────── */
const TurnstileWidget = ({ onVerify }: { onVerify: (token: string) => void }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);
  const onVerifyRef = React.useRef(onVerify);

  React.useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

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
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAEpC8GS9grolKmHU";

    const interval = setInterval(() => {
      if ((window as any).turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          if (containerRef.current.childElementCount > 0) {
            containerRef.current.innerHTML = "";
          }
          widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              if (isMounted) onVerifyRef.current(token);
            },
            "expired-callback": () => {
              if (isMounted) onVerifyRef.current("");
            },
            "error-callback": () => {
              console.warn("Turnstile challenge error. Using dev token in development.");
              if (isMounted && process.env.NODE_ENV !== "production") {
                onVerifyRef.current("dev-bypass-token");
              }
            },
          });
          clearInterval(interval);
        } catch (e) {
          console.warn("Turnstile render failed, retrying...", e);
        }
      }
    }, 200);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (widgetIdRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="mt-5 mb-4 flex min-h-[65px] justify-center" />
  );
};

const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, user, verifyEmail, resendVerification, fetchUserSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("dev-bypass");
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  
  // OTP Verification states
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showUnverifiedBox, setShowUnverifiedBox] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [loginData, setLoginData] = useState<{ email: string; password?: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false }
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.emailVerified === false) {
        // Stay on login page and show unverified box if not already showing OTP step
        if (!showOtpStep && !showUnverifiedBox) {
          setLoginData(prev => prev || { email: user.email });
          setShowUnverifiedBox(true);
        }
      } else if (user.hasProfile === false || user.profileCompleted === false || (!user.id && !user.userId)) {
        router.push("/profile-creation");
      } else {
        router.push("/home");
      }
    }
  }, [isAuthenticated, user, router, showOtpStep, showUnverifiedBox]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await login(data.email, data.password, captchaToken, totpCode);
      if (result.success) {
        if (result.user && result.user.emailVerified === false) {
          setLoginData({ email: data.email, password: data.password });
          setShowUnverifiedBox(true);
          toast.info("Please verify your email to continue.");
        } else {
          toast.success("Welcome back!");
          if (result.user && (result.user.hasProfile === false || result.user.profileCompleted === false)) {
            router.push("/profile-creation");
          } else {
            router.push("/home");
          }
        }
      } else if (result.mfaRequired) {
        setMfaRequired(true);
        toast.info("Two-factor authentication required.");
      } else {
        toast.error(result.message || "Invalid email or password.");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setVerificationLoading(true);
    try {
      const emailToVerify = loginData?.email || user?.email || "";
      const result = await verifyEmail(emailToVerify, otpValue);
      if (result.success) {
        toast.success("Email verified successfully!");
        // Refresh session to sync verified status
        await fetchUserSession();
        router.push("/profile-creation");
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
      const emailToResend = loginData?.email || user?.email;
      const result = await resendVerification(emailToResend);
      if (result.success) {
        toast.success("New verification code sent!");
        if (showUnverifiedBox) {
          setShowUnverifiedBox(false);
          setShowOtpStep(true);
        }
      } else {
        toast.error(result.message || "Failed to resend code.");
      }
    } catch (err) {
      toast.error("Error resending code.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdf8f4] px-4 py-8 font-['DM_Sans']">
      
      {/* Decorative Blobs */}
      <div className="fixed top-[-100px] right-[-80px] z-0 h-[480px] w-[480px] rounded-full bg-[#c9856a] opacity-15 blur-[90px] pointer-events-none" />
      <div className="fixed bottom-[-80px] left-[-80px] z-0 h-[380px] w-[380px] rounded-full bg-[#8b6248] opacity-15 blur-[90px] pointer-events-none" />
      <div className="fixed top-1/2 left-[35%] z-0 h-[240px] w-[240px] rounded-full bg-[#e8b89a] opacity-15 blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[24px] bg-white shadow-[0_32px_80px_rgba(120,60,30,0.12),0_8px_24px_rgba(0,0,0,0.05)]">
        {/* Brand Header */}
        <div className="relative bg-gradient-to-br from-[#3d1f12] via-[#6b3526] to-[#8b4e2e] px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-8 after:rounded-t-[50%] after:bg-white">
          <Link href="/" className="mb-1 block font-['Cormorant_Garamond'] text-[2rem] sm:text-[2.2rem] font-semibold tracking-wide text-white no-underline transition-opacity hover:opacity-85">
            <span className="text-[#e8c97a]">Sri</span>Match<span className="text-[#f4a0a0]"> ♥</span>
          </Link>
          <p className="text-[0.78rem] sm:text-[0.8rem] font-light tracking-[0.09em] uppercase text-white/60">Where traditions meet forever</p>
        </div>

        <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-8 sm:pb-10">
          {showUnverifiedBox ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 rounded-2xl border-[1.5px] border-[#e8c9b8] bg-[#fffaf8] p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf0e8] text-[#c9856a]">
                  <Mail size={28} />
                </div>
                <h2 className="mb-2 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-tight text-[#2d1810]">Verify your email</h2>
                <p className="text-[0.85rem] text-[#9a7060]">
                  Your email <strong className="text-[#4a3028]">{loginData?.email}</strong> is not verified yet. 
                  Please check your inbox or click below to get a verification code.
                </p>
                
                <div className="mt-8 flex flex-col gap-4">
                  <button 
                    onClick={handleResendOtp}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] py-3.5 text-[0.92rem] font-medium text-white shadow-[0_6px_20px_rgba(139,78,46,0.2)] transition-all hover:translate-y-[-1px]"
                  >
                    <RefreshCw size={18} /> Send Verification Code
                  </button>
                  <button 
                    onClick={() => setShowUnverifiedBox(false)}
                    className="text-[0.82rem] font-medium text-[#9a7060] hover:text-[#8b4e2e] hover:underline underline-offset-4"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : !showOtpStep ? (
            <>
              <h2 className="mb-1 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-tight text-[#2d1810]">Welcome back</h2>
              <p className="mb-7 text-[0.85rem] text-[#9a7060]">Sign in to continue your journey to find love</p>

              {/* Social login */}
              <div className="mb-6">
                <GoogleLoginButton text="signin_with" />
              </div>

              <div className="relative my-5 flex items-center gap-3 text-[0.78rem] tracking-wide uppercase text-[#c4a99a] before:h-px before:flex-1 before:bg-[#ede5e0] after:h-px after:flex-1 after:bg-[#ede5e0]">
                or sign in with email
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email */}
                <div className="mb-[1.1rem]">
                  <label htmlFor="email" className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                    <input
                      {...register("email")}
                      id="email" type="email" autoComplete="email"
                      className={`w-full rounded-xl border-[1.5px] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5] ${errors.email ? 'border-red-300' : 'border-[#e8ddd8] focus:border-[#c9856a]'}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-[0.75rem] text-red-500">{errors.email.message as string}</p>}
                </div>

                {/* Password */}
                <div className="mb-[1.1rem]">
                  <label htmlFor="password" className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Password</label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                    <input
                      {...register("password")}
                      id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                      className={`w-full rounded-xl border-[1.5px] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5] ${errors.password ? 'border-red-300' : 'border-[#e8ddd8] focus:border-[#c9856a]'}`}
                      placeholder="Your password"
                    />
                    <button type="button" className="absolute top-1/2 right-[0.85rem] flex -translate-y-1/2 items-center bg-transparent text-[#c4a99a]" onClick={() => setShowPassword(v => !v)}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-[0.75rem] text-red-500">{errors.password.message as string}</p>}
                </div>

                {/* MFA Code if triggered */}
                {mfaRequired && (
                  <div className="mb-[1.1rem]">
                    <label htmlFor="totpCode" className="mb-1.5 block text-[0.8rem] font-medium tracking-wide text-[#4a3028]">Authenticator Code (2FA)</label>
                    <div className="relative">
                      <ShieldIcon className="absolute top-1/2 left-[0.85rem] -translate-y-1/2 text-[#c4a99a]" size={15} />
                      <input
                        id="totpCode"
                        type="text"
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value)}
                        className="w-full rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-[0.7rem] px-10 text-[0.88rem] text-[#2d1810] outline-none transition-all focus:border-[#c9856a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(201,133,106,0.12)] placeholder:text-[#c4b0a5]"
                        placeholder="6-digit authenticator code"
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}

                {/* Remember & Forgot */}
                <div className="mb-5 flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-[0.8rem] text-[#7a5848]">
                    <input type="checkbox" {...register("rememberMe")} className="accent-[#c9856a]" /> Remember me
                  </label>
                  <Link href="/forgot-password" className="text-[0.8rem] font-medium text-[#c9856a] no-underline hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Cloudflare Turnstile */}
                <TurnstileWidget onVerify={(token) => setCaptchaToken(token)} />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] py-3.5 text-[0.92rem] font-medium text-white shadow-[0_6px_20px_rgba(139,78,46,0.2)] transition-all hover:translate-y-[-1px] disabled:opacity-60"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="mt-6 text-center text-[0.83rem] text-[#9a7060]">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-[#8b4e2e] no-underline hover:underline">
                  Create one free
                </Link>
              </p>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fdf0e8] text-[#c9856a]">
                  <Mail size={24} />
                </div>
                <h2 className="mb-1 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-tight text-[#2d1810]">Verify Email</h2>
                <p className="text-[0.85rem] text-[#9a7060]">
                  Enter the 6-digit verification code sent to <br />
                  <strong className="text-[#4a3028]">{loginData?.email || user?.email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="w-full rounded-2xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-3 text-center font-mono text-[1.75rem] tracking-[0.4em] text-[#2d1810] outline-none transition-all focus:border-[#c9856a] focus:bg-white focus:shadow-[0_0_0_4px_rgba(201,133,106,0.12)]"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={verificationLoading || otpValue.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] py-3.5 text-[0.92rem] font-medium text-white shadow-[0_6px_20px_rgba(139,78,46,0.2)] transition-all hover:translate-y-[-1px] disabled:opacity-50"
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
                    Back to login
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-5 text-center text-[0.72rem] tracking-[0.15em] text-[#d4b8a8]">✦ &nbsp; ✦ &nbsp; ✦</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;