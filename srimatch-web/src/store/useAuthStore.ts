import { create } from 'zustand';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import ProfileService from '../services/profile.service';

interface AuthState {
    user: any;
    accessToken: string | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    adminUser: any;
    isAdminAuthenticated: boolean;
    setUser: (user: any) => void;
    setAdminUser: (adminUser: any) => void;
    setIsAuthLoading: (isAuthLoading: boolean) => void;
    fetchUserSession: () => Promise<void>;
    login: (email: string, password: string, captchaToken?: string | null, totpCode?: string | null) => Promise<any>;
    register: (userData: any) => Promise<any>;
    verifyEmail: (email: string, otp: string) => Promise<any>;
    resendVerification: () => Promise<any>;
    logout: (redirectTo?: string) => Promise<void>;
    adminLogin: (email: string, password: string, totpCode?: string | null) => Promise<any>;
    adminLogout: () => Promise<void>;
    updateUserProfile: (data: any) => Promise<any>;
}

const isClient = typeof window !== 'undefined';

const useAuthStore = create<AuthState>((set, get) => ({
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
        if (!isClient) {
            set({ isAuthLoading: false });
            return;
        }

        // Only call if we have a hint that user is logged in
        if (!localStorage.getItem('srimatch_is_logged_in')) {
            set({ isAuthLoading: false, isAuthenticated: false });
            return;
        }

        set({ isAuthLoading: true });
        try {
            const response = await ProfileService.getMyProfile();
            if (response && response.success && response.data) {
                const userData = {
                    ...response.data,
                    profileCompleted: response.data.profileCompleted ?? true,
                    hasProfile: true
                };
                const isAdmin = userData.role === "ADMIN" || userData.role === "SUPER_ADMIN";
                set({ 
                    user: userData, 
                    isAuthenticated: true,
                    adminUser: isAdmin ? userData : null,
                    isAdminAuthenticated: isAdmin
                });
            } else {
                set({ isAuthenticated: false });
            }
        } catch (error: any) {
            if (error.status === 403 || error.status === 404) {
                // Fetch basic user data if profile doesn't exist yet
                try {
                    const userRes = await UserService.getMyUserData();
                    if (userRes && userRes.success) {
                        const userData = userRes.data;
                        const isAdmin = userData.role === "ADMIN" || userData.role === "SUPER_ADMIN";
                        set({ 
                            user: userData, 
                            isAuthenticated: true,
                            adminUser: isAdmin ? userData : null,
                            isAdminAuthenticated: isAdmin
                        });
                    } else {
                        set({ isAuthenticated: false });
                    }
                } catch (uErr) {
                    if (isClient) localStorage.removeItem('srimatch_is_logged_in');
                    set({ isAuthenticated: false, user: null, adminUser: null, isAdminAuthenticated: false });
                }
            } else {
                if (isClient) localStorage.removeItem('srimatch_is_logged_in');
                set({ isAuthenticated: false, user: null, adminUser: null, isAdminAuthenticated: false });
            }
        } finally {
            set({ isAuthLoading: false });
        }
    },

    login: async (email, password, captchaToken = null, totpCode = null) => {
        try {
            const response = await AuthService.login({ email, password, captchaToken, totpCode });
            
            if (response.success && response.data) {
                const token = response.data.accessToken;
                set({ accessToken: token });
                if (isClient) {
                    localStorage.setItem('srimatch_is_logged_in', 'true');
                    if (token) localStorage.setItem('srimatch_access_token', token);
                }
                await get().fetchUserSession();
                return { success: true, user: response.data };
            }
            return { success: false, message: response.message || "Invalid credentials" };
        } catch (error: any) {
            if (error.message && error.message.includes("MFA_REQUIRED")) {
                return { success: false, mfaRequired: true, message: error.message };
            }
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
        } catch (error: any) {
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
        } catch (error: any) {
            console.error("Verification error:", error);
            return { success: false, message: error.message || "An error occurred during verification" };
        }
    },

    resendVerification: async () => {
        try {
            const response = await AuthService.resendVerification();
            if (response.success) {
                return { success: true, message: response.message || "Verification email resent" };
            }
            return { success: false, message: response.message || "Failed to resend email" };
        } catch (error: any) {
            console.error("Resend error:", error);
            return { success: false, message: error.message || "An error occurred" };
        }
    },

    logout: async (redirectTo = "/login") => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            if (isClient) {
                localStorage.removeItem('srimatch_is_logged_in');
                localStorage.removeItem('srimatch_access_token');
            }
            set({ 
                user: null, 
                accessToken: null, 
                isAuthenticated: false, 
                adminUser: null, 
                isAdminAuthenticated: false 
            });
            if (isClient && redirectTo) {
                window.location.href = redirectTo;
            }
        }
    },

    adminLogin: async (email, password, totpCode = null) => {
        try {
            const response = await AuthService.login({ email, password, totpCode });
            
            if (response.success && response.data) {
                const userData = response.data;
                if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
                    set({ adminUser: userData, isAdminAuthenticated: true });
                    if (isClient) localStorage.setItem('srimatch_is_logged_in', 'true');
                    return { success: true, user: userData };
                }
                return { success: false, message: "Insufficient privileges" };
            }
            return { success: false, message: response.message || "Invalid admin credentials" };
        } catch (error: any) {
            if (error.message && error.message.includes("MFA_REQUIRED")) {
                return { success: false, mfaRequired: true, message: error.message };
            }
            console.error("Admin login error:", error);
            return { success: false, message: error.message || "An error occurred" };
        }
    },

    adminLogout: async () => {
        await get().logout("/admin/login");
    },

    updateUserProfile: async (data) => {
        try {
            const response = await ProfileService.updateProfile(data);
            if (response.success) {
                const currentUser = get().user || {};
                const updatedUser = {
                    ...currentUser,
                    ...response.data,
                    profileCompleted: true,
                    hasProfile: true
                };
                set({ user: updatedUser });
                return { success: true, user: updatedUser };
            }
            return { success: false, message: response.message || "Failed to update profile" };
        } catch (error: any) {
            console.error("Update profile error:", error);
            return { success: false, message: error.data?.message || error.message || "Failed to update profile", status: error.status };
        }
    },
}));

export default useAuthStore;
