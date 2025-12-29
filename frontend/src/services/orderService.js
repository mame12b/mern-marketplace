import axios from '../utils/axios';

const orderService = {
    // Get all orders (admin)
    getAllOrders: async () => {
        const response = await axios.get('/api/orders/admin/all');
        return response.data;
    },

    // Get user's orders
    getMyOrders: async () => {
        const response = await axios.get('/api/orders');
        return response.data;
    },

    // Get single order
    getOrder: async (id) => {
        const response = await axios.get(`/api/orders/${id}`);
        return response.data;
    },

    // Create order
    createOrder: async (orderData) => {
        const response = await axios.post('/api/orders', orderData);
        return response.data;
    },

    // Update order status
    updateOrderStatus: async (orderId, status) => {
        const response = await axios.put(`/api/orders/${orderId}/status`, { status });
        return response.data;
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        const response = await axios.put(`/api/orders/${orderId}/cancel`);
        return response.data;
    },
};

export default orderService;