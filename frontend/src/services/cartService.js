import axios from '../utils/axios';

const cartService = {
    // Get cart items
    getCart: async () => {
        const response = await axios.get('/api/cart');
        return response.data;
    },

    // Add item to cart
    addToCart: async (productId, quantity = 1) => {
        const response = await axios.post('/api/cart', {
            productId,
            quantity,
        });
        return response.data;
    },

    // Update cart item quantity
    updateCartItem: async (productId, quantity) => {
        const response = await axios.put(`/api/cart/${productId}`, {
            quantity,
        });
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (productId) => {
        const response = await axios.delete(`/api/cart/${productId}`);
        return response.data;
    },

    // Clear cart
    clearCart: async () => {
        const response = await axios.delete('/api/cart');
        return response.data;
    },
};

export default cartService;