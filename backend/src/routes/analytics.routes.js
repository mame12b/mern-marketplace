import express from 'express';
import {
    getSellerAnalytics,
    getAdminAnalytics,
    getBuyerAnalytics,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/seller', authorize('seller'), getSellerAnalytics);
router.get('/admin', authorize('admin'), getAdminAnalytics);
router.get('/buyer', getBuyerAnalytics);

export default router;
