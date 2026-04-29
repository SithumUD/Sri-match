import API from './base.service';

/**
 * BoostService
 * Handles profile boosting features and status.
 */
const BoostService = {
    /**
     * Get the current user's boost status and remaining counts
     */
    getBoostStatus: () => {
        return API.get('/boost/status');
    },

    /**
     * Activate one boost from the user's balance
     */
    activateBoost: () => {
        return API.post('/boost/activate');
    },

    /**
     * Get all available boost packages for purchase
     */
    getBoostPackages: () => {
        return API.get('/boost/packages');
    },

    /**
     * Submit a bank transfer receipt for a boost package purchase.
     * Goes through admin approval — boosts are added once approved.
     * @param {number|string} packageId
     * @param {FormData} formData  (must contain 'receipt' file field)
     */
    submitBoostReceipt: (packageId, formData) => {
        return API.post(`/boost/purchase/${packageId}/receipt`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default BoostService;
