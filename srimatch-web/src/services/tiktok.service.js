import API from './base.service';

/**
 * TikTokService
 * Handles TikTok Spotlight promotion packages and user promotion lifecycle.
 */
const TikTokService = {

    // ─────────────────────────────────────────
    // Public / User
    // ─────────────────────────────────────────

    /** Get all active TikTok packages (public) */
    getPackages: () => API.get('/tiktok/packages'),

    /** Submit a promotion: sends packageId + bank slip as multipart */
    submitPromotion: (packageId, slipFile) => {
        const fd = new FormData();
        fd.append('packageId', packageId);
        fd.append('slip', slipFile);
        return API.post('/tiktok/promotions', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /** Get the authenticated user's own promotions */
    getMyPromotions: () => API.get('/tiktok/promotions/me'),

    // ─────────────────────────────────────────
    // Admin — Packages
    // ─────────────────────────────────────────

    adminGetPackages: () => API.get('/admin/tiktok/packages'),

    adminCreatePackage: (data) => API.post('/admin/tiktok/packages', data),

    adminUpdatePackage: (id, data) => API.put(`/admin/tiktok/packages/${id}`, data),

    adminTogglePackage: (id) => API.patch(`/admin/tiktok/packages/${id}/toggle`),

    // ─────────────────────────────────────────
    // Admin — Promotions
    // ─────────────────────────────────────────

    /** List all promotions, optionally filtered by status string */
    adminListPromotions: (status = null) => {
        const params = status ? { status } : {};
        return API.get('/admin/tiktok/promotions', { params });
    },

    adminSetProcessing: (id) => API.patch(`/admin/tiktok/promotions/${id}/process`),

    adminPublish: (id, tiktokPostUrl, adminNotes = '') =>
        API.patch(`/admin/tiktok/promotions/${id}/publish`, { tiktokPostUrl, adminNotes }),

    adminReject: (id, rejectionReason) =>
        API.patch(`/admin/tiktok/promotions/${id}/reject`, { rejectionReason }),
};

export default TikTokService;
