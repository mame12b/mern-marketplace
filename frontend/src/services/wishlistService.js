import axios from '../utils/axios';

export const wishlistService = {
    // Get user's wishlist
    getWishlist: async () => {
        const response = await axios.get('/users/wishlist');
        return response.data;
    },

    // Add product to wishlist
    addToWishlist: async (productId) => {
        const response = await axios.post(`/users/wishlist/${productId}`);
        return response.data;
    },

    // Remove product from wishlist
    removeFromWishlist: async (productId) => {
        const response = await axios.delete(`/users/wishlist/${productId}`);
        return response.data;
    },

    // Toggle product in wishlist
    toggleWishlist: async (productId, isInWishlist) => {
        if (isInWishlist) {
            return wishlistService.removeFromWishlist(productId);
        } else {
            return wishlistService.addToWishlist(productId);
        }
    },
};

export default wishlistService;
