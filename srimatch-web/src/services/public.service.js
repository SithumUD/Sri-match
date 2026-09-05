import API from './base.service';

/**
 * PublicService
 * Handles data that is accessible without authentication (Landing page, FAQ, etc.)
 */
const PublicService = {
    /**
     * Get list of active premium packages for the landing page
     */
    getPackages: () => {
        return API.get('/packages');
    },

    /**
     * Get specific package details (no login required to view)
     */
    getPackageDetails: (id) => {
        return API.get(`/packages/${id}`);
    },

    /**
     * Get public settings (FAQ, Terms, Privacy)
     * Note: These might be part of v1/admin/settings but with public access allowed in SecurityConfig
     */
    getFaqs: () => {
        return API.get('/public/faqs'); // Placeholder for potential public endpoints
    },

    getTerms: () => {
        return API.get('/public/terms'); // Placeholder
    }
};

export default PublicService;
