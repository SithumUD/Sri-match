import API from './base.service';

/**
 * AuthService
 * Handles all authentication and security-related API calls.
 */
const AuthService = {
    /**
     * Standard email/password registration
     */
    register: (userData) => {
        return API.post('/auth/register', userData);
    },

    /**
     * Standard email/password login
     */
    login: (credentials) => {
        return API.post('/auth/login', credentials);
    },

    /**
     * Social login (Google/Facebook etc.)
     */
    socialLogin: (socialData) => {
        return API.post('/auth/social-login', socialData);
    },

    /**
     * Logout and invalidate token on backend
     */
    logout: () => {
        return API.post('/auth/logout');
    },

    /**
     * Verify email with OTP
     */
    verifyEmail: (otpData) => {
        return API.post('/auth/verify-email', otpData);
    },

    /**
     * Verify phone number with OTP
     */
    verifyPhone: (otpData) => {
        return API.post('/auth/verify-phone', otpData);
    },

    /**
     * Resend verification email
     */
    resendVerification: (data) => {
        return API.post('/auth/resend-verification', data || {});
    },

    /**
     * Initiate 2FA setup (mostly for admins)
     */
    setup2FA: () => {
        return API.post('/auth/2fa/setup');
    },

    /**
     * Confirm 2FA setup with first OTP
     */
    confirm2FA: (totpCode) => {
        return API.post('/auth/2fa/confirm', { totpCode });
    },

    /**
     * Password Management
     */
    forgotPassword: (emailData) => {
        return API.post('/auth/forgot-password', emailData);
    },

    verifyResetOtp: (otpData) => {
        return API.post('/auth/verify-reset-otp', otpData);
    },

    resetPassword: (passwordData) => {
        return API.post('/auth/reset-password', passwordData);
    },

    updatePassword: (updateData) => {
        return API.post('/auth/update-password', updateData);
    }
};

export default AuthService;
