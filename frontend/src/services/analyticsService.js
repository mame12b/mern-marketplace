import axios from '../utils/axios';

export const analyticsService = {
    // Get seller analytics
    getSellerAnalytics: async (period = '30') => {
        const response = await axios.get('/analytics/seller', {
            params: { period },
        });
        return response.data;
    },

    // Get admin analytics
    getAdminAnalytics: async (period = '30') => {
        const response = await axios.get('/analytics/admin', {
            params: { period },
        });
        return response.data;
    },

    // Get buyer analytics
    getBuyerAnalytics: async (period = '30') => {
        const response = await axios.get('/analytics/buyer', {
            params: { period },
        });
        return response.data;
    },
};

export default analyticsService;
