import axios from 'axios';
import CookieService from './cookie.service';

// Create Axios instance
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
API.interceptors.request.use(
    (config) => {
        // With HttpOnly cookies, we don't need to manually set the Authorization header.
        // The browser sends cookies automatically with { withCredentials: true }.
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

            try {
                // We call the refresh endpoint. The browser will automatically 
                // include the HttpOnly refreshToken cookie.
                await axios.post(
                    `${API.defaults.baseURL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                // If refresh succeeds, the backend will have set a new accessToken cookie.
                // We retry the original request.
                return API(originalRequest);

            } catch (refreshError) {
                // Refresh failed → redirect to login
                window.location.href = '/login';
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