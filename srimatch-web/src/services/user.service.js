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
    }
};

export default UserService;
