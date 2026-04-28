import { create } from 'zustand';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import ProfileService from '../services/profile.service';

const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isAuthLoading: true,
    adminUser: null,
    isAdminAuthenticated: false,

    // Actions
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setAdminUser: (adminUser) => set({ adminUser, isAdminAuthenticated: !!adminUser }),
    setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

    // Fetch current user session
    fetchUserSession: async () => {
        set({ isAuthLoading: true });
        try {
            const response = await ProfileService.getMyProfile();
            if (response && response.success && response.data) {
                set({ user: response.data, isAuthenticated: true });
            } else {
                set({ isAuthenticated: false });
            }
        } catch (error) {
            if (error.status === 403 || error.status === 404) {
                // Fetch basic user data if profile doesn't exist yet
                try {
                    const userRes = await UserService.getMyUserData();
                    if (userRes && userRes.success) {
                        set({ user: userRes.data, isAuthenticated: true });
                    } else {
                        set({ isAuthenticated: false });
                    }
                } catch (uErr) {
                    console.error("Critical error fetching basic user info:", uErr);
                    set({ isAuthenticated: false });
                }
            } else {
                console.error("Error fetching user session:", error);
                set({ isAuthenticated: false, user: null });
            }
        } finally {
            set({ isAuthLoading: false });
        }
    },

    login: async (email, password, captchaToken = null) => {
        try {
            const response = await AuthService.login({ email, password, captchaToken });
            
            if (response.success && response.data) {
                set({ accessToken: response.data.accessToken });
                await get().fetchUserSession();
                return { success: true, user: response.data };
            }
            return { success: false, message: response.message || "Invalid credentials" };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.message || "An error occurred during login" };
        }
    },

    register: async (userData) => {
        try {
            const response = await AuthService.register(userData);
            if (response.success) {
                return { success: true, message: response.message || "Registration successful" };
            }
            return { success: false, message: response.message || "Registration failed" };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, message: error.message || "An error occurred during registration" };
        }
    },

    verifyEmail: async (email, otp) => {
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
    },

    logout: async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            set({ user: null, isAuthenticated: false });
            window.location.href = "/login";
        }
    },

    adminLogin: async (email, password, totpCode = null) => {
        try {
            const response = await AuthService.login({ email, password, totpCode });
            
            if (response.success && response.data) {
                const userData = response.data;
                if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
                    set({ adminUser: userData, isAdminAuthenticated: true });
                    return { success: true, user: userData };
                }
                return { success: false, message: "Insufficient privileges" };
            }
            return { success: false, message: response.message || "Invalid admin credentials" };
        } catch (error) {
            if (error.message && error.message.includes("MFA_REQUIRED")) {
                return { success: false, mfaRequired: true, message: error.message };
            }
            console.error("Admin login error:", error);
            return { success: false, message: error.message || "An error occurred" };
        }
    },

    adminLogout: () => {
        set({ adminUser: null, isAdminAuthenticated: false });
    },

    updateUserProfile: async (data) => {
        try {
            const response = await ProfileService.updateProfile(data);
            if (response.success) {
                set({ user: response.data });
                return { success: true, user: response.data };
            }
            return { success: false, message: response.message || "Failed to update profile" };
        } catch (error) {
            console.error("Update profile error:", error);
            return { success: false, message: error.data?.message || error.message || "Failed to update profile", status: error.status };
        }
    },
}));

export default useAuthStore;
