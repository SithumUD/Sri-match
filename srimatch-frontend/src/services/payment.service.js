import API from './base.service';

/**
 * PaymentService
 * Handles billing, packages, and transactions.
 */
const PaymentService = {
    /**
     * Get list of available subscription packages
     */
    getPackages: () => {
        return API.get('/packages');
    },

    /**
     * Process a new payment
     */
    processPayment: (paymentData) => {
        return API.post('/payments', paymentData);
    },

    /**
     * Get bank details for manual payments/transfers
     */
    getBankDetails: () => {
        return API.get('/bank-details');
    },

    /**
     * Submit a bank receipt for a pending subscription
     * @param {number|string} subscriptionId 
     * @param {FormData} formData 
     */
    submitReceipt: (subscriptionId, formData) => {
        return API.post(`/payments/submit-receipt/${subscriptionId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    /**
     * Check if current user has a pending payment approval
     */
    checkPendingPayment: () => {
        return API.get('/payments/check-pending');
    }
};

export default PaymentService;
