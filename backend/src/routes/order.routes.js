import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getSellerOrders,
  getAllOrders,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// public/buyer routes (protected)
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, authorize( 'seller', 'admin'), getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

//  seller routes
router.get('/seller/my-orders', protect, authorize('seller', 'admin'), getSellerOrders);


// seller/admin routes
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

// admin routes
router.get('/all', protect, authorize('admin'), getAllOrders);

export default router;