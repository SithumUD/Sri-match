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
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [profileCreationStep, setProfileCreationStep] = useState(1);
  const [profileCreationData, setProfileCreationData] = useState({});
  const [likesRemaining, setLikesRemaining] = useState(5);
  const [notifications, setNotifications] = useState([]);
  const [subscription, setSubscription] = useState({
    plan: "free",
    expiresAt: null,
    features: {
      dailyLikes: 5,
      canSeeWhoLikedYou: false,
      canVoiceVideoCall: false,
      advancedFilters: false,
      messageBeforeAccept: 0,
      hasBoost: false,
      boostExpiresAt: null,
    },
  });

  // Fetch current user session
  const fetchUserSession = async () => {
    try {
      const response = await ProfileService.getMyProfile();
      if (response && response.success && response.data) {
        const profileData = response.data;
        setUser(profileData);
        setIsAuthenticated(true);
        
        if (profileData.activeSubscription) {
          setSubscription(profileData.activeSubscription);
        }
      } else {
        // If request succeeded but no data, we might still be authenticated (just no profile yet)
        setIsAuthenticated(!!CookieService.get("token"));
      }
    } catch (error) {
      if (error.status === 403 || error.status === 404) {
        setIsAuthenticated(!!CookieService.get("token"));
        // Fetch basic user data if profile doesn't exist yet
        try {
          const userRes = await UserService.getMyUserData();
          if (userRes && userRes.success) {
            setUser(userRes.data);
          }
        } catch (uErr) {
          console.error("Critical error fetching basic user info:", uErr);
        }
      } else {
        console.error("Error fetching user session:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  // Fetch additional user data
  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    
    try {
      const [receivedRes, sentRes, matchesRes, subRes] = await Promise.all([
        LikeService.getReceivedLikes(0, 100),
        LikeService.getSentLikes(0, 100),
        MatchService.getMyMatches(0, 100),
        SubscriptionService.getMyActiveSubscription()
      ]);

      if (sentRes.success) {
        const sentData = sentRes.data.content || sentRes.data || [];
        setLikedProfiles(sentData.map(l => ({ 
          profileId: l.receiver?.id || l.receiverId, 
          type: l.type 
        })));
      }

      if (receivedRes.success) {
        setReceivedRequests(receivedRes.data.content || receivedRes.data || []);
      }
      
      if (matchesRes.success) {
        setConnections(matchesRes.data.content || matchesRes.data || []);
      }
      
      if (subRes.success && subRes.data) {
        setSubscription(subRes.data);
        setLikesRemaining(subRes.data.remainingLikes || 5);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const checkDailyReset = async () => {
      try {
        const lastResetDate = CookieService.get("lastLikesResetDate");
        const today = new Date().toDateString();
        if (!lastResetDate || lastResetDate !== today) {
          resetDailyLikes();
          CookieService.set("lastLikesResetDate", today);
        }
      } catch (error) {
        console.error("Error checking daily reset:", error);
      }
    };

    fetchUserSession();
    if (isAuthenticated) {
      fetchUserData();
    }
    checkDailyReset();
  }, [isAuthenticated]);

  const login = async (email, password, captchaToken = null) => {
    try {
      const response = await AuthService.login({ email, password, captchaToken });
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, ...userData } = response.data;
        
        // Save tokens in secure cookies
        CookieService.set("token", accessToken);
        CookieService.set("refreshToken", refreshToken);
        
        // Fetch full profile/user info
        await fetchUserSession();
        
        return { success: true, user: userData };
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
      CookieService.remove("user");
      CookieService.remove("token");
      CookieService.remove("refreshToken");
      window.location.href = "/login";
    }
  };

  const adminLogin = async (email, password, totpCode = null) => {
    try {
      const response = await AuthService.login({ email, password, totpCode });
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, ...userData } = response.data;
        
        // Check for admin privileges
        if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
            setAdminUser(userData);
            setIsAdminAuthenticated(true);
            CookieService.set("adminUser", JSON.stringify(userData));
            CookieService.set("token", accessToken);
            CookieService.set("refreshToken", refreshToken);
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
    CookieService.remove("adminUser");
  };

  const updateUserProfile = async (data) => {
    try {
      const response = await ProfileService.updateProfile(data);
      
      if (response.success) {
        setUser(response.data);
        CookieService.set("user", JSON.stringify(response.data));
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || "Failed to update profile" };
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMsg = error.data?.message || error.message || "Failed to update profile";
      return { success: false, message: errorMsg, status: error.status };
    }
  };

  const toggleLike = async (profileId, type = 'NORMAL') => {
    // Basic limit check (can be expanded with backend limit data)
    // Basic limit check
    const alreadyLiked = likedProfiles.some(p => p.profileId === profileId);
    
    if (
      !alreadyLiked &&
      subscription.plan === "free" &&
      likesRemaining <= 0 &&
      type === 'NORMAL'
    ) {
      alert("Daily like limit reached. Upgrade for more!");
      return { success: false };
    }

    const targetId = Number(profileId);
    if (!targetId || isNaN(targetId)) {
      console.error("Invalid profile ID for like action:", profileId);
      return { success: false, message: "Invalid profile ID" };
    }

    try {
      const response = await LikeService.sendLike(targetId, type);
      
      if (response.success) {
        setLikedProfiles(prev => [...prev, { profileId: targetId, type }]);
        if (subscription.plan === "free" && type === 'NORMAL') {
            setLikesRemaining(prev => prev - 1);
        }
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error("Toggle like error:", error);
      return { success: false, message: "Failed to process like" };
    }
  };

  // Mutual matches are handled automatically by backend when both users like each other.
  // Friend request functions removed to align with Like/Match architecture.

  const upgradeSubscription = async (packageId) => {
    try {
      const response = await SubscriptionService.initiateSubscription(packageId);
      
      if (response.success) {
        // After initiation, the user usually goes to a payment gateway
        // For now, we'll refresh the active subscription state
        const activeSub = await SubscriptionService.getMyActiveSubscription();
        if (activeSub.success) {
            setSubscription(activeSub.data);
            CookieService.set("subscription", JSON.stringify(activeSub.data));
        }
        return { success: true, message: "Subscription initiated. Redirecting to payment..." };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error("Upgrade subscription error:", error);
      return { success: false, message: "Failed to upgrade subscription" };
    }
  };

  const cancelSubscription = async () => {
     // Backend doesn't currently expose a cancel endpoint in the analyzed controller.
     // Placeholder for future implementation.
     return { success: false, message: "Manual cancellation required. Please contact support." };
  };

  const activateBoost = async () => {
    // Boost logic not yet implemented in backend controllers.
    return { success: false, message: "Boost feature coming soon!" };
  };

  const resetDailyLikes = async () => {
    try {
      // TODO: Replace with backend API call
      // const response = await fetch('/api/user/likes/reset', {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${CookieService.get('token')}`
      //   }
      // });
      // const data = await response.json();
      
      const dailyLimit =
        subscription.features.dailyLikes === Infinity ? Infinity : 5;
      setLikesRemaining(dailyLimit);
      CookieService.set("likesRemaining", dailyLimit.toString());
      
      return { success: true };
    } catch (error) {
      console.error("Reset daily likes error:", error);
      return { success: false, message: "Failed to reset daily likes" };
    }
  };

  const updateProfileCreationData = (data) => {
    setProfileCreationData((prev) => {
      const updated = {
        ...prev,
        ...data,
      };
      return updated;
    });
  };

  // Notification functions
  const markNotificationAsRead = async (id) => {
    try {
      // TODO: Replace with backend API call
      // await fetch(`/api/notifications/${id}/read`, {
      //   method: 'PUT',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error("Mark notification as read error:", error);
      return { success: false, message: "Failed to mark notification as read" };
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      // TODO: Replace with backend API call
      // await fetch('/api/notifications/read-all', {
      //   method: 'PUT',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
      
      return { success: true };
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
      return { success: false, message: "Failed to mark all notifications as read" };
    }
  };

  const clearNotification = async (id) => {
    try {
      // TODO: Replace with backend API call
      // await fetch(`/api/notifications/${id}`, {
      //   method: 'DELETE',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
      
      return { success: true };
    } catch (error) {
      console.error("Clear notification error:", error);
      return { success: false, message: "Failed to clear notification" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        adminUser,
        isAdminAuthenticated,
        login,
        register,
        verifyEmail,
        logout,
        adminLogin,
        adminLogout,
        updateUserProfile,
        likedProfiles,
        sentRequests,
        receivedRequests,
        connections,
        toggleLike,
        
        profileCreationStep,
        setProfileCreationStep,
        profileCreationData,
        updateProfileCreationData,
        subscription,
        upgradeSubscription,
        cancelSubscription,
        activateBoost,
        likesRemaining,
        resetDailyLikes,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
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