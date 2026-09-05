import API from './base.service';

/**
 * ProfileService
 * Handles user profile management and public profile browsing.
 */
const ProfileService = {
    /**
     * Get the authenticated user's profile
     */
    getMyProfile: () => {
        return API.get('/profile/me');
    },

    /**
     * Create or update user profile
     */
    updateProfile: (profileData) => {
        return API.post('/profile', profileData);
    },

    /**
     * Upload or update profile image
     * @param {File} file 
     * @param {boolean} isPrimary 
     */
    uploadProfileImage: (file, isPrimary = false) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isPrimary', isPrimary);
        
        return API.post('/profile/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Set a specific image as the primary profile photo
     * @param {string} imageUrl 
     */
    setPrimaryImage: (imageUrl) => {
        return API.patch('/profile/image/primary', null, { params: { imageUrl } });
    },

    /**
     * Delete an image from the profile
     * @param {string} imageUrl 
     */
    deleteImage: (imageUrl) => {
        return API.delete('/profile/image', { params: { imageUrl } });
    },

    /**
     * Search and filter public profiles (offset-based pagination, kept for compatibility)
     * @param {Object} params - Search filters
     */
    searchProfiles: (params) => {
        return API.get('/profiles', { params });
    },

    /**
     * Cursor-based (keyset) profile discovery.
     * Returns { items, nextCursor, hasMore, count } — no duplicate profiles across pages.
     * @param {Object} params - Filters (minAge, maxAge, gender, religion, etc.) + sortBy + cursor + limit
     */
    searchProfilesCursor: (params) => {
        return API.get('/profiles/cursor', { params });
    },

    /**
     * View a specific user's public profile
     * @param {number|string} profileId 
     */
    getPublicProfile: (profileId) => {
        return API.get(`/profiles/${profileId}`);
    }
};

export default ProfileService;
