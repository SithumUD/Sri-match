import API from './base.service';

/**
 * ChatService
 * Handles messaging and chat interactions.
 */
const ChatService = {
    /**
     * Get list of chat matches for the current user
     */
    getMatches: () => {
        return API.get('/matches');
    },

    /**
     * Get messages for a specific match
     * @param {number|string} matchId 
     * @param {number} page
     */
    getChatHistory: (matchId, page = 0) => {
        return API.get(`/chat/history/${matchId}`, { params: { page, size: 50 } });
    },

    /**
     * Send a message
     */
    sendMessage: (messageData) => {
        return API.post('/chat/send', messageData);
    },

    /**
     * Mark a message as read
     */
    markAsRead: (messageId) => {
        return API.patch(`/chat/messages/${messageId}/read`);
    },

    /**
     * Upload media file within a chat
     * @param {File} file 
     */
    uploadMedia: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return API.post('/chat/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Send WebRTC call signaling payload (Offer, Answer, Candidate, Reject, End)
     */
    sendCallSignal: (signalData) => {
        return API.post('/chat/call/signal', signalData);
    }
};

export default ChatService;
