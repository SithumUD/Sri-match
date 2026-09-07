import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  const extraUrl = Constants.expoConfig?.extra?.apiUrl;
  if (extraUrl) {
    return extraUrl.replace(/\/+$/, '');
  }
  return 'https://api.sithum-dev.online/api/v1';
};

export const API_BASE_URL = getBaseUrl();

export const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 25000,
});

const AUTH_BYPASS_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/verify-reset-otp',
  '/auth/reset-password',
  '/auth/refresh-token',
];

// Request interceptor to attach JWT token
API.interceptors.request.use(
  async (config) => {
    try {
      config.headers = config.headers || {};
      config.headers['X-Requested-With'] = 'XMLHttpRequest';

      const isAuthBypass = AUTH_BYPASS_URLS.some((url) => config.url?.includes(url));
      if (!isAuthBypass) {
        const token = await AsyncStorage.getItem('srimatch_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn('Failed to retrieve token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh / expiration
API.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const isAuthBypass = AUTH_BYPASS_URLS.some((url) => originalRequest?.url?.includes(url));

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthBypass) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('srimatch_refresh_token');
        if (refreshToken) {
          const res = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken },
            { headers: { 'X-Requested-With': 'XMLHttpRequest' } }
          );
          const newAccessToken = res.data?.data?.accessToken || res.data?.data?.token;
          const newRefreshToken = res.data?.data?.refreshToken;

          if (newAccessToken) {
            await AsyncStorage.setItem('srimatch_token', newAccessToken);
            if (newRefreshToken) {
              await AsyncStorage.setItem('srimatch_refresh_token', newRefreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return API(originalRequest);
          }
        }
      } catch (refreshErr) {
        // If the refresh token is truly expired/revoked, remove session
        await Promise.all([
          AsyncStorage.removeItem('srimatch_token'),
          AsyncStorage.removeItem('srimatch_refresh_token'),
          AsyncStorage.removeItem('srimatch_user'),
        ]);
      }
    }

    // Return the detailed error payload from server
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;
