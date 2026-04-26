import API from './base.service';

/**
 * LikeService
 * Handles sending and receiving likes.
 */
const LikeService = {
    /**
     * Send a like to another user
     * @param {number} receiverId 
     * @param {string} type 
     */
    sendLike: (receiverId, type = 'NORMAL') => {
        return API.post('/likes/send', { receiverId, type });
    },

    /**
     * Get a paginated list of users who liked the current user
     */
    getReceivedLikes: (page = 0, size = 10, type = null) => {
        return API.get('/likes/received', {
            params: { page, size, type }
        });
    },
    
    /**
     * Get a paginated list of likes sent by the current user
     */
    getSentLikes: (page = 0, size = 100) => {
        return API.get('/likes/sent', {
            params: { page, size }
        });
    },

    /**
     * Check if current user has liked a specific profile.
     * Returns: { liked: true/false, type: "NORMAL"/"STAR"/null }
     * @param {number|string} targetProfileId - the profile ID from the URL
     */
    checkInteraction: (targetProfileId) => {
        return API.get(`/likes/check/${targetProfileId}`);
    }
};

export default LikeService;
