import API from './base.service';

/**
 * SubscriptionService
 * Handles user subscription status and access control.
 */
const SubscriptionService = {
    /**
     * Get the current user's active subscription details
     */
    getMyActiveSubscription: () => {
        return API.get('/subscriptions/my/active');
    },

    /**
     * Get all subscriptions for the current user
     */
    getMySubscriptions: () => {
        return API.get('/subscriptions/my');
    },

    /**
     * Initiate a new subscription for a package
     * @param {number|string} packageId 
     */
    initiateSubscription: (packageId) => {
        return API.post(`/subscriptions/initiate/${packageId}`);
    }
};

export default SubscriptionService;
