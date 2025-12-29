import axios from '../utils/axios';

export const notificationService = {
    // Get all notifications
    getNotifications: async (params = {}) => {
        const response = await axios.get('/notifications', { params });
        return response.data;
    },

    // Mark notification as read
    markAsRead: async (id) => {
        const response = await axios.put(`/notifications/${id}/read`);
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        const response = await axios.put('/notifications/read-all');
        return response.data;
    },

    // Delete notification
    deleteNotification: async (id) => {
        const response = await axios.delete(`/notifications/${id}`);
        return response.data;
    },
};

export default notificationService;
