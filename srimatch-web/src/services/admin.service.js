import API from './base.service';

/**
 * AdminService
 * Handles all administrative operations (Dashboard, User management, Settings, etc.)
 */
const AdminService = {
    // Dashboard & Stats
    getDashboardData: () => {
        return API.get('/admin/dashboard');
    },

    // User Management
    getAllUsers: () => {
        return API.get('/admin/users');
    },

    adminGetUserDetails: (userId) => {
        return API.get(`/admin/users/${userId}/details`);
    },

    adminCreateUser: (userData) => {
        return API.post('/admin/users', userData);
    },

    adminUpdateUser: (email, userData) => {
        return API.put(`/admin/users/${email}`, userData);
    },

    adminChangeRole: (email, role) => {
        return API.patch(`/admin/users/${email}/role`, null, { params: { role } });
    },

    adminLockAccount: (email, lockUntil = null) => {
        return API.patch(`/admin/users/${email}/lock`, { lockUntil });
    },

    adminSoftDeleteUser: (email) => {
        return API.delete(`/admin/users/${email}/soft`);
    },

    adminHardDeleteUser: (email) => {
        return API.delete(`/admin/users/${email}/hard`);
    },

    purgeSoftDeletedUsers: () => {
        return API.delete('/admin/users/purge');
    },

    // Settings (FAQ, Terms, etc.)
    getSettings: () => {
        return API.get('/admin/settings');
    },

    updateSetting: (key, value) => {
        return API.put(`/admin/settings/${key}`, { value });
    },

    // Financials
    getAdminPayments: () => {
        return API.get('/admin/payments');
    },

    reviewPayment: (paymentId, reviewData) => {
        return API.patch(`/admin/payments/${paymentId}/review`, reviewData);
    },

    // Packages
    createPackage: (packageData) => {
        return API.post('/admin/packages', packageData);
    },

    updatePackage: (id, packageData) => {
        return API.put(`/admin/packages/${id}`, packageData);
    },

    // Support (Admin View)
    getAllTickets: () => {
        return API.get('/admin/support/tickets');
    },

    getTicketMessages: (ticketId) => {
        return API.get(`/admin/support/tickets/${ticketId}/messages`);
    },

    replyToTicketAsAdmin: (ticketId, message) => {
        return API.post(`/admin/support/tickets/${ticketId}/messages`, { message });
    },

    updateTicketStatus: (ticketId, status) => {
        return API.patch(`/admin/support/tickets/${ticketId}/status`, { status });
    },

    // Bulk update settings
    updateBulkSettings: (updates) => {
        return API.put('/admin/settings', updates);
    },

    // Premium Packages
    getAdminPackagesOverview: () => {
        return API.get('/admin/packages/overview');
    },

    getAdminPackages: () => {
        return API.get('/admin/packages');
    },

    createPackage: (data) => {
        return API.post('/admin/packages', data);
    },

    updatePackage: (id, data) => {
        return API.put(`/admin/packages/${id}`, data);
    },

    togglePackageStatus: (id) => {
        return API.patch(`/admin/packages/${id}/toggle`);
    },

    // Boost Packages
    getAdminBoostPackages: () => {
        return API.get('/admin/boost/packages');
    },

    createBoostPackage: (data) => {
        return API.post('/admin/boost/packages', data);
    },

    updateBoostPackage: (id, data) => {
        return API.put(`/admin/boost/packages/${id}`, data);
    },

    // Bank Details
    getBankDetails: () => {
        return API.get('/admin/bank-details');
    },

    addBankDetail: (data) => {
        return API.post('/admin/bank-details', data);
    },

    updateBankDetail: (id, data) => {
        return API.put(`/admin/bank-details/${id}`, data);
    },

    toggleBankDetailStatus: (id) => {
        return API.patch(`/admin/bank-details/${id}/toggle`);
    },

    // Locations (Cities)
    getAdminCities: (params = {}) => {
        return API.get('/admin/locations/cities', { params });
    },
    
    addCity: (data) => {
        return API.post('/admin/locations/cities', data);
    },

    updateCity: (id, data) => {
        return API.put(`/admin/locations/cities/${id}`, data);
    },

    deleteCity: (id) => {
        return API.delete(`/admin/locations/cities/${id}`);
    },

    // Moderation (Reports)
    getAdminReports: () => {
        return API.get('/admin/reports');
    },

    getReportDetails: (id) => {
        return API.get(`/admin/reports/${id}`);
    },

    takeReportAction: (id, data) => {
        return API.patch(`/admin/reports/${id}/action`, data);
    },

    // Audit Logs
    getAuditLogs: (params = {}) => {
        if (typeof params === 'string') {
            return API.get(`/admin/audits${params ? `?email=${params}` : ''}`);
        }
        return API.get('/admin/audits', { params });
    },

    // User Verifications
    getPendingVerifications: () => {
        return API.get('/admin/verifications/pending');
    },

    getVerificationImage: (id, side) => {
        return `${API.defaults.baseURL}/admin/verifications/${id}/view/${side}`;
    },

    approveVerification: (id) => {
        return API.post(`/admin/verifications/${id}/approve`);
    },

    rejectVerification: (id, reason) => {
        return API.post(`/admin/verifications/${id}/reject?reason=${encodeURIComponent(reason)}`);
    }
};

export default AdminService;
