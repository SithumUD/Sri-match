import API from './base.service';

const NotificationService = {
    /**
     * Fetch paginated notifications
     * @param {Object} params - { page: 0, size: 20 }
     */
    getNotifications: async (params = {}) => {
        const response = await API.get('/notifications', { params });
        return response.data;
    },

    /**
     * Get unread notification count
     */
    getUnreadCount: async () => {
        const response = await API.get('/notifications/unread-count');
        return response.data;
    },

    /**
     * Mark single notification as read
     * @param {number|string} id 
     */
    markAsRead: async (id) => {
        const response = await API.patch(`/notifications/${id}/read`);
        return response.data;
    },

    /**
     * Mark all user notifications as read
     */
    markAllAsRead: async () => {
        const response = await API.patch('/notifications/read-all');
        return response.data;
    },

    /**
     * Delete/dismiss a notification
     * @param {number|string} id 
     */
    deleteNotification: async (id) => {
        const response = await API.delete(`/notifications/${id}`);
        return response.data;
    },
};

export default NotificationService;
