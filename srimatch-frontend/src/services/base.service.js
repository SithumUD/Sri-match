import axios from 'axios';
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

// ==============================
// REQUEST INTERCEPTOR
// ==============================
API.interceptors.request.use(
    (config) => {
        // CSRF Protection: Manually extract XSRF token if Axios didn't 
        // (Varies by browser and backend configuration)
        const xsrfToken = CookieService.get('XSRF-TOKEN');
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = xsrfToken;
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
        // HANDLE 403 (FORBIDDEN / CSRF)
        // ------------------------------
        if (error.response?.status === 403) {
            // Silencing global log to avoid noise during session checks
            // Components can still handle 403 via the rejected promise
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