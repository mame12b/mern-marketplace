import axios from '../utils/axios';

export const couponService = {
    // Validate coupon
    validateCoupon: async (code, orderAmount, products) => {
        const response = await axios.post('/coupons/validate', {
            code,
            orderAmount,
            products,
        });
        return response.data;
    },

    // Get all coupons (for sellers/admin)
    getCoupons: async (params = {}) => {
        const response = await axios.get('/coupons', { params });
        return response.data;
    },

    // Create coupon
    createCoupon: async (couponData) => {
        const response = await axios.post('/coupons', couponData);
        return response.data;
    },

    // Update coupon
    updateCoupon: async (id, couponData) => {
        const response = await axios.put(`/coupons/${id}`, couponData);
        return response.data;
    },

    // Delete coupon
    deleteCoupon: async (id) => {
        const response = await axios.delete(`/coupons/${id}`);
        return response.data;
    },
};

export default couponService;
