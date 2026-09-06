import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import CookieService from './cookie.service';

// Create Axios instance
const API = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// List of endpoints that should NOT send an Authorization header
const AUTH_BYPASS_URLS = [
    '/auth/login',
    '/auth/register',
    '/auth/social-login',
    '/auth/forgot-password',
    '/auth/verify-reset-otp',
    '/auth/reset-password',
    '/auth/refresh-token',
];

// ==============================
// REQUEST INTERCEPTOR
// ==============================
API.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // CSRF Protection
        const xsrfToken = CookieService.get('XSRF-TOKEN');
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = xsrfToken;
        }

        // Attach Authorization header from localStorage only for authenticated endpoints
        const isAuthBypass = AUTH_BYPASS_URLS.some((url) => config.url?.includes(url));
        if (!isAuthBypass && typeof window !== 'undefined') {
            const token = localStorage.getItem('srimatch_access_token');
            if (token && !config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
API.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // ------------------------------
        // HANDLE 401 (TOKEN EXPIRED)
        // ------------------------------
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(
                    `${API.defaults.baseURL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
                    const newToken = refreshResponse.data.data.accessToken;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('srimatch_access_token', newToken);
                    }
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                }

                // If refresh succeeds, retry the original request
                return API(originalRequest);

            } catch (refreshError) {
                console.warn("Token refresh failed:", refreshError);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('srimatch_access_token');
                }
                return Promise.reject(refreshError);
            }
        }

        // ------------------------------
        // STANDARD ERROR FORMAT
        // ------------------------------
        const errorMessage =
            error.response?.data?.message || 'An unexpected error occurred';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default API;
