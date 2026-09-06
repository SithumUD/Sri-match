"use client";

import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Check, RefreshCw, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Validation Schema
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the Terms and Privacy Policy"),
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
const TurnstileWidget = ({ onVerify }: { onVerify: (token: string) => void }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetIdRef = React.useRef<string | null>(null);

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
      if ((window as any).turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
            sitekey: "0x4AAAAAADCRNcxH7bShZFVD", // Always Passes test key
            callback: (token: string) => {
              if (isMounted) onVerify(token);
            },
            "error-callback": () => {
              console.error("Turnstile error");
            }
          });
          clearInterval(interval);
        } catch (e) {
          console.warn("Turnstile render failed, retrying...", e);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [onVerify]);

  return (
    <div ref={containerRef} className="mt-5 mb-4 flex min-h-[65px] justify-center" />
  );
};

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser, verifyEmail, resendVerification, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState("");
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

  const onSubmit = async (data: any) => {
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
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
      const result = await resendVerification(formData?.email);
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdf8f4] px-4 py-8 font-['DM_Sans']">
      {/* Decorative Blobs */}
      <div className="fixed top-[-120px] right-[-120px] z-0 h-[520px] w-[520px] rounded-full bg-[#c9856a] opacity-15 blur-[90px] pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] z-0 h-[420px] w-[420px] rounded-full bg-[#8b6248] opacity-15 blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[24px] bg-white shadow-[0_32px_80px_rgba(120,60,30,0.12),0_8px_24px_rgba(0,0,0,0.05)]">
        {/* Brand Header */}
        <div className="relative bg-gradient-to-br from-[#3d1f12] via-[#6b3526] to-[#8b4e2e] px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-8 after:rounded-t-[50%] after:bg-white">
          <Link href="/" className="mb-1 block font-['Cormorant_Garamond'] text-[2rem] sm:text-[2.2rem] font-semibold tracking-wide text-white no-underline transition-opacity hover:opacity-85">
            <span className="text-[#e8c97a]">Sri</span>Match<span className="text-[#f4a0a0]"> ♥</span>
          </Link>
          <p className="text-[0.78rem] sm:text-[0.8rem] font-light tracking-[0.09em] uppercase text-white/60">Where traditions meet forever</p>
        </div>

        <div className="px-5 sm:px-10 pt-6 sm:pt-8 pb-8 sm:pb-10">
          {!showOtpStep ? (
            <>
              <h2 className="mb-1 font-['Cormorant_Garamond'] text-[1.6rem] sm:text-[1.75rem] font-semibold leading-tight text-[#2d1810]">Begin your journey</h2>
              <p className="mb-6 sm:mb-7 text-[0.85rem] text-[#9a7060]">Create an account to find your perfect match</p>

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
                <div className="mb-[1.1rem] grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div className="mb-6 flex flex-col gap-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[0.78rem] text-[#4a3028]">
                    <input
                      type="checkbox"
                      {...register("agreeToTerms")}
                      className="mt-0.5 h-4 w-4 rounded border-[#e8ddd8] text-[#8b4e2e] focus:ring-[#8b4e2e]"
                    />
                    <span>
                      I agree to the <Link href="/terms" className="text-[#8b4e2e] font-medium underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-[#8b4e2e] font-medium underline">Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && <p className="text-[0.75rem] text-red-500">{errors.agreeToTerms.message as string}</p>}
                </div>

                <TurnstileWidget onVerify={(token) => setCaptchaToken(token)} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] py-3.5 text-[0.92rem] font-semibold text-white shadow-[0_6px_20px_rgba(139,78,46,0.25)] transition-all hover:translate-y-[-1px] disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account ✦"}
                </button>
              </form>

              <div className="mt-6 text-center text-[0.82rem] text-[#9a7060]">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#8b4e2e] hover:underline">
                  Sign In
                </Link>
              </div>
            </>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf0e8] text-[#c9856a]">
                <Mail size={28} />
              </div>
              <h2 className="mb-2 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold text-[#2d1810]">Verify your email</h2>
              <p className="mb-6 text-[0.84rem] text-[#9a7060]">
                We sent a 6-digit verification code to <strong className="text-[#4a3028]">{formData.email}</strong>. Please enter it below.
              </p>

              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full tracking-[0.4em] text-center text-[1.5rem] font-bold rounded-2xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] py-3 text-[#2d1810] outline-none focus:border-[#c9856a] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verificationLoading || otpValue.length < 6}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] py-3.5 text-[0.92rem] font-semibold text-white shadow-[0_6px_20px_rgba(139,78,46,0.25)] transition-all hover:translate-y-[-1px] disabled:opacity-60"
                >
                  {verificationLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify & Continue"}
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-2 text-[0.82rem] text-[#9a7060]">
                <span>Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="flex items-center justify-center gap-1 font-semibold text-[#8b4e2e] hover:underline"
                >
                  <RefreshCw size={13} /> Resend Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;