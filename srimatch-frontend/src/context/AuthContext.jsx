import React, { useEffect, useState, createContext, useContext } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  useEffect(() => {
    // TODO: Replace with backend API call to get current user session
    const fetchUserSession = async () => {
      try {
        // const response = await fetch('/api/auth/session');
        // const data = await response.json();
        // if (data.user) {
        //   setUser(data.user);
        //   setIsAuthenticated(true);
        // }
        
        // For now, check localStorage as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    // TODO: Replace with backend API calls for user data
    const fetchUserData = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Fetch liked profiles
        // const likedResponse = await fetch('/api/user/likes');
        // const likedData = await likedResponse.json();
        // setLikedProfiles(likedData);
        
        // Fetch sent requests
        // const sentResponse = await fetch('/api/user/requests/sent');
        // const sentData = await sentResponse.json();
        // setSentRequests(sentData);
        
        // Fetch received requests
        // const receivedResponse = await fetch('/api/user/requests/received');
        // const receivedData = await receivedResponse.json();
        // setReceivedRequests(receivedData);
        
        // Fetch connections
        // const connectionsResponse = await fetch('/api/user/connections');
        // const connectionsData = await connectionsResponse.json();
        // setConnections(connectionsData);
        
        // Fetch subscription
        // const subscriptionResponse = await fetch('/api/user/subscription');
        // const subscriptionData = await subscriptionResponse.json();
        // setSubscription(subscriptionData);
        
        // Fetch notifications
        // const notificationsResponse = await fetch('/api/user/notifications');
        // const notificationsData = await notificationsResponse.json();
        // setNotifications(notificationsData);
        
        // Fetch likes remaining
        // const likesResponse = await fetch('/api/user/likes/remaining');
        // const likesData = await likesResponse.json();
        // setLikesRemaining(likesData.remaining);
        
        // Load from localStorage as fallback
        const storedLikedProfiles = localStorage.getItem("likedProfiles");
        if (storedLikedProfiles) {
          setLikedProfiles(JSON.parse(storedLikedProfiles));
        }
        
        const storedSentRequests = localStorage.getItem("sentRequests");
        if (storedSentRequests) {
          setSentRequests(JSON.parse(storedSentRequests));
        }
        
        const storedReceivedRequests = localStorage.getItem("receivedRequests");
        if (storedReceivedRequests) {
          setReceivedRequests(JSON.parse(storedReceivedRequests));
        }
        
        const storedConnections = localStorage.getItem("connections");
        if (storedConnections) {
          setConnections(JSON.parse(storedConnections));
        }
        
        const storedSubscription = localStorage.getItem("subscription");
        if (storedSubscription) {
          setSubscription(JSON.parse(storedSubscription));
        }
        
        const storedLikesRemaining = localStorage.getItem("likesRemaining");
        if (storedLikesRemaining) {
          setLikesRemaining(parseInt(storedLikesRemaining));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Check for daily like reset
    const checkDailyReset = async () => {
      try {
        // TODO: Replace with backend API call to check/reset daily likes
        // const response = await fetch('/api/user/likes/check-reset');
        // const data = await response.json();
        // if (data.reset) {
        //   setLikesRemaining(data.remaining);
        // }
        
        const lastResetDate = localStorage.getItem("lastLikesResetDate");
        const today = new Date().toDateString();
        if (!lastResetDate || lastResetDate !== today) {
          resetDailyLikes();
          localStorage.setItem("lastLikesResetDate", today);
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

  const login = async (email, password) => {
    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setUser(data.user);
      //   setIsAuthenticated(true);
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   return { success: true, user: data.user };
      // } else {
      //   return { success: false, message: data.message };
      // }
      
      // Temporary demo logic - remove this in production
      const demoUsers = [
        { email: "user@example.com", password: "password123" }
      ];
      const demoUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        const userData = {
          id: "1",
          email: email,
          firstName: "Demo",
          lastName: "User",
          profileCompleted: true,
          isVerified: true,
          profileImage: null,
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const register = async (userData) => {
    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setUser(data.user);
      //   setIsAuthenticated(true);
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('user', JSON.stringify(data.user));
      //   return { success: true, user: data.user };
      // } else {
      //   return { success: false, message: data.message };
      // }
      
      // Temporary demo logic - remove this in production
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        profileCompleted: false,
        isVerified: false,
        profileImage: null,
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "An error occurred during registration" };
    }
  };

  const logout = async () => {
    try {
      // TODO: Replace with backend API call for logout
      // await fetch('/api/auth/logout', { method: 'POST' });
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUserProfile = async (data) => {
    try {
      // TODO: Replace with backend API call
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(data)
      // });
      // const updatedData = await response.json();
      
      const updatedUser = {
        ...user,
        ...data,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: "Failed to update profile" };
    }
  };

  const toggleLike = async (profileId) => {
    // Check if user has remaining likes
    if (
      !likedProfiles.includes(profileId) &&
      subscription.plan !== "premium" &&
      likesRemaining <= 0
    ) {
      alert(
        "You've reached your daily like limit. Upgrade to Premium for unlimited likes!"
      );
      return { success: false, message: "Daily like limit reached" };
    }

    try {
      // TODO: Replace with backend API call
      // const response = await fetch(`/api/user/like/${profileId}`, {
      //   method: likedProfiles.includes(profileId) ? 'DELETE' : 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      // Update local state
      setLikedProfiles((prevLiked) => {
        let newLiked;
        if (prevLiked.includes(profileId)) {
          newLiked = prevLiked.filter((id) => id !== profileId);
        } else {
          newLiked = [...prevLiked, profileId];
          // Decrement likes remaining if not premium and adding a new like
          if (subscription.plan !== "premium") {
            setLikesRemaining((prev) => {
              const newValue = prev - 1;
              localStorage.setItem("likesRemaining", newValue.toString());
              return newValue;
            });
          }
        }
        localStorage.setItem("likedProfiles", JSON.stringify(newLiked));
        return newLiked;
      });
      
      return { success: true };
    } catch (error) {
      console.error("Toggle like error:", error);
      return { success: false, message: "Failed to process like" };
    }
  };

  const toggleFriendRequest = async (profileId) => {
    try {
      // TODO: Replace with backend API call
      // const method = sentRequests.includes(profileId) ? 'DELETE' : 'POST';
      // const response = await fetch(`/api/user/request/${profileId}`, {
      //   method,
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      // Update local state
      setSentRequests((prevRequests) => {
        let newRequests;
        if (prevRequests.includes(profileId)) {
          newRequests = prevRequests.filter((id) => id !== profileId);
        } else {
          newRequests = [...prevRequests, profileId];
        }
        localStorage.setItem("sentRequests", JSON.stringify(newRequests));
        return newRequests;
      });
      
      return { success: true };
    } catch (error) {
      console.error("Toggle friend request error:", error);
      return { success: false, message: "Failed to process friend request" };
    }
  };

  const acceptFriendRequest = async (profileId) => {
    try {
      // TODO: Replace with backend API call
      // const response = await fetch(`/api/user/request/${profileId}/accept`, {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      // Remove from received requests
      setReceivedRequests((prev) => {
        const updated = prev.filter((id) => id !== profileId);
        localStorage.setItem("receivedRequests", JSON.stringify(updated));
        return updated;
      });
      
      // Add to connections
      setConnections((prev) => {
        const updated = [...prev, profileId];
        localStorage.setItem("connections", JSON.stringify(updated));
        return updated;
      });
      
      return { success: true };
    } catch (error) {
      console.error("Accept friend request error:", error);
      return { success: false, message: "Failed to accept friend request" };
    }
  };

  const rejectFriendRequest = async (profileId) => {
    try {
      // TODO: Replace with backend API call
      // const response = await fetch(`/api/user/request/${profileId}/reject`, {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      // Remove from received requests
      setReceivedRequests((prev) => {
        const updated = prev.filter((id) => id !== profileId);
        localStorage.setItem("receivedRequests", JSON.stringify(updated));
        return updated;
      });
      
      return { success: true };
    } catch (error) {
      console.error("Reject friend request error:", error);
      return { success: false, message: "Failed to reject friend request" };
    }
  };

  const upgradeSubscription = async (plan) => {
    try {
      // TODO: Replace with backend API call to payment gateway
      // const response = await fetch('/api/subscription/upgrade', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ plan })
      // });
      // const data = await response.json();
      
      // Calculate expiration date based on plan
      const now = new Date();
      let expirationDate;
      switch (plan) {
        case "monthly":
          expirationDate = new Date(now.setMonth(now.getMonth() + 1));
          break;
        case "3month":
          expirationDate = new Date(now.setMonth(now.getMonth() + 3));
          break;
        case "6month":
          expirationDate = new Date(now.setMonth(now.getMonth() + 6));
          break;
        case "yearly":
          expirationDate = new Date(now.setFullYear(now.getFullYear() + 1));
          break;
      }
      
      const updatedSubscription = {
        plan: "premium",
        expiresAt: expirationDate.toISOString(),
        features: {
          dailyLikes: Infinity,
          canSeeWhoLikedYou: true,
          canVoiceVideoCall: true,
          advancedFilters: true,
          messageBeforeAccept: 3,
          hasBoost: true,
          boostExpiresAt: null,
        },
      };
      
      setSubscription(updatedSubscription);
      localStorage.setItem("subscription", JSON.stringify(updatedSubscription));
      
      return { success: true };
    } catch (error) {
      console.error("Upgrade subscription error:", error);
      return { success: false, message: "Failed to upgrade subscription" };
    }
  };

  const cancelSubscription = async () => {
    try {
      // TODO: Replace with backend API call
      // const response = await fetch('/api/subscription/cancel', {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      const freeSubscription = {
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
      };
      
      setSubscription(freeSubscription);
      localStorage.setItem("subscription", JSON.stringify(freeSubscription));
      resetDailyLikes();
      
      return { success: true };
    } catch (error) {
      console.error("Cancel subscription error:", error);
      return { success: false, message: "Failed to cancel subscription" };
    }
  };

  const activateBoost = async () => {
    if (subscription.plan !== "premium") {
      return { success: false, message: "Premium subscription required" };
    }
    
    try {
      // TODO: Replace with backend API call
      // const response = await fetch('/api/user/boost', {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      // Set boost expiration to 5 days from now
      const now = new Date();
      const boostExpiration = new Date(now.setDate(now.getDate() + 5));
      const updatedSubscription = {
        ...subscription,
        features: {
          ...subscription.features,
          boostExpiresAt: boostExpiration.toISOString(),
        },
      };
      
      setSubscription(updatedSubscription);
      localStorage.setItem("subscription", JSON.stringify(updatedSubscription));
      
      return { success: true };
    } catch (error) {
      console.error("Activate boost error:", error);
      return { success: false, message: "Failed to activate boost" };
    }
  };

  const resetDailyLikes = async () => {
    try {
      // TODO: Replace with backend API call
      // const response = await fetch('/api/user/likes/reset', {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      const dailyLimit =
        subscription.features.dailyLikes === Infinity ? Infinity : 5;
      setLikesRemaining(dailyLimit);
      localStorage.setItem("likesRemaining", dailyLimit.toString());
      
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
        login,
        register,
        logout,
        updateUserProfile,
        likedProfiles,
        sentRequests,
        receivedRequests,
        connections,
        toggleLike,
        toggleFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
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