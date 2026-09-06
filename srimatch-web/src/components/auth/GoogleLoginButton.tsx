"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface GoogleLoginButtonProps {
  text?: "signin_with" | "signup_with" | "continue_with";
  className?: string;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  text = "continue_with",
  className = ""
}) => {
  const router = useRouter();
  const { socialLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) {
      toast.error("Google authentication failed. No token received.");
      return;
    }

    setLoading(true);
    try {
      const result = await socialLogin("GOOGLE", response.credential);
      if (result.success) {
        toast.success("Welcome to SriMatch!");
        const user = result.user;
        if (user && (user.hasProfile === false || user.profileCompleted === false)) {
          router.push("/profile-creation");
        } else {
          router.push("/home");
        }
      } else {
        toast.error(result.message || "Google authentication failed.");
      }
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      toast.error("An error occurred during Google Sign-In.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Google Identity Services script
    const scriptId = "google-gsi-client";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const interval = setInterval(() => {
      if ((window as any).google?.accounts?.id && clientId) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnRef.current) {
            (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "outline",
              size: "large",
              type: "standard",
              shape: "rectangular",
              text,
              logo_alignment: "left",
              width: googleBtnRef.current.parentElement?.clientWidth || 360,
            });
          }
          clearInterval(interval);
        } catch (e) {
          console.warn("Google Sign-In initialization retry...", e);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [clientId, text]);

  const handleCustomClick = () => {
    if (!clientId) {
      toast.error("Google Client ID is not configured yet in environment.");
      return;
    }

    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt was skipped or blocked, try trigger button click inside ref if available
          const renderedBtn = googleBtnRef.current?.querySelector('div[role="button"]') as HTMLElement;
          if (renderedBtn) {
            renderedBtn.click();
          }
        }
      });
    } else {
      toast.error("Google Sign-In service is initializing. Please try again in a moment.");
    }
  };

  const buttonText = text === "signup_with" 
    ? "Sign up with Google" 
    : text === "signin_with" 
      ? "Sign in with Google" 
      : "Continue with Google";

  return (
    <div className={`relative w-full ${className}`}>
      {/* Hidden container for official rendered Google button if loaded */}
      <div 
        ref={googleBtnRef} 
        className="hidden" 
        aria-hidden="true" 
      />

      <button
        type="button"
        onClick={handleCustomClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f5] px-4 py-3 text-[0.88rem] font-medium text-[#4a3028] shadow-sm transition-all hover:border-[#c9856a] hover:bg-[#fff5f0] hover:shadow disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="animate-spin text-[#c9856a]" size={18} />
        ) : (
          <GoogleIcon />
        )}
        <span>{loading ? "Authenticating..." : buttonText}</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
