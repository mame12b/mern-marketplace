import express from 'express';
import {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  clearCart,
  changePassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Address routes
router.post('/address', addAddress);
router.put('/address/:addressId', updateAddress);
router.delete('/address/:id', deleteAddress);

// Wishlist routes
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.get('/wishlist', getWishlist);

// Cart routes
router.post('/cart', addToCart);
router.put('/cart/:productId', updateCartItem);
router.delete('/cart/:productId', removeFromCart);
router.get('/cart', getCart);
router.delete('/cart', clearCart);

export default router;