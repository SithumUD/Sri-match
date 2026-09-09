import API from './base.service';

/**
 * UserService
 * Handles account-level operations and settings.
 */
const UserService = {
    /**
     * Get basic user account data
     */
    getMyUserData: () => {
        return API.get('/users/me');
    },

    /**
     * Update basic user account info (email, full name, etc.)
     */
    updateMyUserData: (userData) => {
        return API.put('/users/me', userData);
    },

    /**
     * Soft delete own account
     */
    deleteAccount: () => {
        return API.delete('/users/me');
    },

    /**
     * Update FCM token for push notifications
     * @param {string} token 
     */
    updateFcmToken: (token) => {
        return API.patch('/users/me/fcm-token', null, {
            params: { token }
        });
    },

    /**
     * Update notification preferences
     * @param {Object} prefs 
     */
    updateNotificationPreferences: (prefs) => {
        return API.patch('/users/me/notifications', prefs);
    },

    /**
     * Request SMS OTP for phone verification
     * @param {string} phoneNumber 
     */
    requestPhoneOtp: (phoneNumber) => {
        return API.post('/users/me/request-phone-otp', { phoneNumber });
    },

    /**
     * Verify SMS OTP for phone verification
     * @param {string} otp 
     */
    verifyPhone: (otp) => {
        return API.post('/users/me/verify-phone', { otp });
    },

    /**
     * Get active device sessions
     */
    getActiveSessions: () => {
        return API.get('/users/me/sessions');
    },

    /**
     * Terminate a specific session
     * @param {number|string} sessionId 
     */
    revokeSession: (sessionId) => {
        return API.delete(`/users/me/sessions/${sessionId}`);
    },

    /**
     * Terminate all other sessions
     */
    revokeAllOtherSessions: () => {
        return API.delete('/users/me/sessions');
    }
};

export default UserService;
