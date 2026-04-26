import axios from 'axios';
import CookieService from './cookie.service';

// Create Axios instance
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
API.interceptors.request.use(
    (config) => {
        const token = CookieService.get('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
API.interceptors.response.use(
    (response) => {
        // Return only API data
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // ------------------------------
        // HANDLE 401 (TOKEN EXPIRED)
        // ------------------------------
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = CookieService.get('refreshToken');

            if (refreshToken) {
                try {
                    const res = await axios.post(
                        `${API.defaults.baseURL}/auth/refresh-token`,
                        { refreshToken }
                    );

                    const { accessToken, refreshToken: newRefreshToken } = res.data.data;

                    // Save new tokens
                    CookieService.set('token', accessToken);
                    CookieService.set('refreshToken', newRefreshToken);

                    // Retry original request
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return API(originalRequest);

                } catch (refreshError) {
                    // Refresh failed → logout
                    CookieService.remove('token');
                    CookieService.remove('refreshToken');
                    CookieService.remove('user');

                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
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