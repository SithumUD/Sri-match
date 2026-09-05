import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// In development, Android emulator uses 10.0.2.2, iOS simulator uses localhost
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api/v1';
  }
  return 'http://localhost:8080/api/v1';
};

export const API_BASE_URL = getBaseUrl();

export const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('srimatch_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('srimatch_refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
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
    return Promise.reject(error.response?.data || error);
  }
);

export default API;
