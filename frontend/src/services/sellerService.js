import api from '../utils/axios';

// Apply for seller account (pay application fee)
export const applyForSeller = async (paymentData) => {
    const response = await api.post('/api/seller/apply', paymentData);
    return response.data;
};

// Get seller application status
export const getSellerApplicationStatus = async () => {
    const response = await api.get('/api/seller/application-status');
    return response.data;
};

// Update shop information
export const updateShopInfo = async (shopData) => {
    const response = await api.put('/api/seller/shop', shopData);
    return response.data;
};

// Get seller dashboard stats
export const getSellerDashboardStats = async () => {
    const response = await api.get('/api/seller/dashboard-stats');
    return response.data;
};
