import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/auth.service';
import ProfileService from '../services/profile.service';

interface AuthState {
  user: any;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  setUser: (user: any) => void;
  setIsAuthLoading: (loading: boolean) => void;
  loadStoredSession: () => Promise<void>;
  login: (credentials: { email?: string; username?: string; password?: string }) => Promise<any>;
  register: (userData: any) => Promise<any>;
  socialLogin: (provider: string, token: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAuthLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

  loadStoredSession: async () => {
    try {
      const [token, storedUser] = await Promise.all([
        AsyncStorage.getItem('srimatch_token'),
        AsyncStorage.getItem('srimatch_user'),
      ]);

      if (token) {
        let parsedUser: any = null;
        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
          } catch (e) {}
        }

        set({
          accessToken: token,
          user: parsedUser,
          isAuthenticated: true,
        });

        // Background refresh profile data from API
        try {
          const res: any = await ProfileService.getMyProfile();
          const p = res?.data || res;
          if (p && (p.id || p.firstName || p.email)) {
            const merged = {
              ...parsedUser,
              ...p,
              verified: Boolean(p.isVerified || p.verified || p.idVerified || parsedUser?.verified),
              isVerified: Boolean(p.isVerified || p.verified || p.idVerified || parsedUser?.verified),
              premium: Boolean(p.isPremium || p.premium || p.user?.isPremiumActive || parsedUser?.premium),
              isPremium: Boolean(p.isPremium || p.premium || p.user?.isPremiumActive || parsedUser?.premium),
            };
            await AsyncStorage.setItem('srimatch_user', JSON.stringify(merged));
            set({ user: merged, isAuthenticated: true });
          }
        } catch (apiErr) {
          console.log('Session validation notice:', apiErr);
        }
      } else {
        set({ isAuthenticated: false, user: null, accessToken: null });
      }
    } catch (err) {
      console.warn('Error reading stored session:', err);
    } finally {
      set({ isAuthLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isAuthLoading: true });
    try {
      const res: any = await AuthService.login(credentials);
      if (res?.success && res.data) {
        const token = res.data.token || res.data.accessToken;
        const refreshToken = res.data.refreshToken;
        const rawUser = res.data.user || res.data;
        const user = {
          ...rawUser,
          verified: Boolean(rawUser.verified || rawUser.isVerified),
          isVerified: Boolean(rawUser.verified || rawUser.isVerified),
          premium: Boolean(rawUser.premium || rawUser.isPremium),
          isPremium: Boolean(rawUser.premium || rawUser.isPremium),
        };

        if (token) await AsyncStorage.setItem('srimatch_token', token);
        if (refreshToken) await AsyncStorage.setItem('srimatch_refresh_token', refreshToken);
        if (user) await AsyncStorage.setItem('srimatch_user', JSON.stringify(user));

        set({ user, accessToken: token, isAuthenticated: true });

        // Immediately fetch detailed user profile to enrich state
        try {
          const profRes: any = await ProfileService.getMyProfile();
          const p = profRes?.data || profRes;
          if (p) {
            const enriched = {
              ...user,
              ...p,
              verified: Boolean(p.isVerified || p.verified || p.idVerified || user.verified),
              isVerified: Boolean(p.isVerified || p.verified || p.idVerified || user.verified),
              premium: Boolean(p.isPremium || p.premium || user.premium),
              isPremium: Boolean(p.isPremium || p.premium || user.premium),
            };
            await AsyncStorage.setItem('srimatch_user', JSON.stringify(enriched));
            set({ user: enriched });
          }
        } catch (e) {}

        return { success: true, data: res.data };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (error: any) {
      console.warn('Login execution error:', error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : null) ||
        'Unable to connect to server. Please check your credentials or network.';
      return {
        success: false,
        message: serverMsg,
      };
    } finally {
      set({ isAuthLoading: false });
    }
  },

  register: async (userData) => {
    set({ isAuthLoading: true });
    try {
      const res: any = await AuthService.register(userData);
      return res;
    } catch (error: any) {
      console.warn('Registration execution error:', error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === 'string' ? error : null) ||
        'Registration failed. Please try again.';
      return {
        success: false,
        message: serverMsg,
      };
    } finally {
      set({ isAuthLoading: false });
    }
  },

  socialLogin: async (provider: string, token: string) => {
    set({ isAuthLoading: true });
    try {
      const res: any = await AuthService.socialLogin({ provider, token });
      if (res?.success && res.data) {
        const tokenVal = res.data.token || res.data.accessToken;
        const refreshToken = res.data.refreshToken;
        const rawUser = res.data.user || res.data;
        const user = {
          ...rawUser,
          verified: Boolean(rawUser.verified || rawUser.isVerified),
          isVerified: Boolean(rawUser.verified || rawUser.isVerified),
          premium: Boolean(rawUser.premium || rawUser.isPremium),
          isPremium: Boolean(rawUser.premium || rawUser.isPremium),
        };

        if (tokenVal) await AsyncStorage.setItem('srimatch_token', tokenVal);
        if (refreshToken) await AsyncStorage.setItem('srimatch_refresh_token', refreshToken);
        if (user) await AsyncStorage.setItem('srimatch_user', JSON.stringify(user));

        set({ user, accessToken: tokenVal, isAuthenticated: true });

        // Refresh profile to get full details
        try {
          const profRes: any = await ProfileService.getMyProfile();
          const p = profRes?.data || profRes;
          if (p) {
            const enriched = {
              ...user,
              ...p,
              verified: Boolean(p.isVerified || p.verified || p.idVerified || user.verified),
              isVerified: Boolean(p.isVerified || p.verified || p.idVerified || user.verified),
              premium: Boolean(p.isPremium || p.premium || user.premium),
              isPremium: Boolean(p.isPremium || p.premium || user.premium),
            };
            await AsyncStorage.setItem('srimatch_user', JSON.stringify(enriched));
            set({ user: enriched });
          }
        } catch (e) {}

        return { success: true, data: res.data, user };
      }
      return { success: false, message: res?.message || 'Social login failed' };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || error?.response?.data?.message || 'Social login failed',
      };
    } finally {
      set({ isAuthLoading: false });
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } catch (e) {}
    await AsyncStorage.multiRemove(['srimatch_token', 'srimatch_refresh_token', 'srimatch_user']);
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  refreshProfile: async () => {
    try {
      const res: any = await ProfileService.getMyProfile();
      const p = res?.data || res;
      if (p) {
        const fullUser = {
          ...get().user,
          ...p,
          verified: Boolean(p.isVerified || p.verified || p.idVerified || get().user?.verified),
          isVerified: Boolean(p.isVerified || p.verified || p.idVerified || get().user?.verified),
          premium: Boolean(p.isPremium || p.premium || get().user?.premium),
          isPremium: Boolean(p.isPremium || p.premium || get().user?.premium),
        };
        await AsyncStorage.setItem('srimatch_user', JSON.stringify(fullUser));
        set({ user: fullUser, isAuthenticated: true });
      }
    } catch (e) {
      console.log('Could not refresh profile data', e);
    }
  },
}));

export default useAuthStore;
