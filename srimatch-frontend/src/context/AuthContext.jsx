import React, { useEffect, useState, createContext, useContext } from "react";
import CookieService from "../services/cookie.service";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import ProfileService from "../services/profile.service";
import LikeService from "../services/like.service";
import MatchService from "../services/match.service";
import SubscriptionService from "../services/subscription.service";
import PaymentService from "../services/payment.service";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Fetch current user session
  const fetchUserSession = async () => {
    try {
      const response = await ProfileService.getMyProfile();
      if (response && response.success && response.data) {
        const profileData = response.data;
        setUser(profileData);
        setIsAuthenticated(true);
      } else {
        // If request succeeded but no data, we are not fully "profiled" but might be auth'd
        // However, without HttpOnly visibility, we can't check cookies.
        // We'll rely on the backend to provide user data if profile is missing.
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (error.status === 403 || error.status === 404) {
        // Fetch basic user data if profile doesn't exist yet
        try {
          const userRes = await UserService.getMyUserData();
          if (userRes && userRes.success) {
            setUser(userRes.data);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (uErr) {
          console.error("Critical error fetching basic user info:", uErr);
          setIsAuthenticated(false);
        }
      } else {
        console.error("Error fetching user session:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSession();
  }, []);

  const login = async (email, password, captchaToken = null) => {
    try {
      const response = await AuthService.login({ email, password, captchaToken });
      
      if (response.success && response.data) {
        // Fetch full profile/user info
        await fetchUserSession();
        
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || "Invalid credentials" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "An error occurred during login" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      
      if (response.success) {
        return { success: true, message: response.message || "Registration successful. Please verify your email." };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.message || "An error occurred during registration" };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await AuthService.verifyEmail({ identifier: email, otp });
      if (response.success) {
        return { success: true, message: response.message || "Email verified successfully" };
      }
      return { success: false, message: response.message || "Verification failed" };
    } catch (error) {
      console.error("Verification error:", error);
      return { success: false, message: error.message || "An error occurred during verification" };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local session even if server-side logout fails
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  };

  const adminLogin = async (email, password, totpCode = null) => {
    try {
      const response = await AuthService.login({ email, password, totpCode });
      
      if (response.success && response.data) {
        const userData = response.data;
        
        // Check for admin privileges
        if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
            setAdminUser(userData);
            setIsAdminAuthenticated(true);
            return { success: true, user: userData };
        }
        return { success: false, message: "Insufficient privileges for Admin Panel" };
      }
      return { success: false, message: response.message || "Invalid admin credentials" };
    } catch (error) {
      if (error.message && error.message.includes("MFA_REQUIRED")) {
          return { success: false, mfaRequired: true, message: error.message };
      }
      console.error("Admin login error:", error);
      return { success: false, message: error.message || "An error occurred during admin login" };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  const updateUserProfile = async (data) => {
    try {
      const response = await ProfileService.updateProfile(data);
      
      if (response.success) {
        setUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || "Failed to update profile" };
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMsg = error.data?.message || error.message || "Failed to update profile";
      return { success: false, message: errorMsg, status: error.status };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        adminUser,
        isAdminAuthenticated,
        login,
        register,
        verifyEmail,
        logout,
        adminLogin,
        adminLogout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};