import express from 'express';
import {
    createCoupon,
    getCoupons,
    getCoupon,
    validateCoupon,
    updateCoupon,
    deleteCoupon,
    useCoupon,
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validate coupon (all authenticated users)
router.post('/validate', protect, validateCoupon);

// Coupon management (admin and sellers)
router.use(protect);
router.post('/', authorize('admin', 'seller'), createCoupon);
router.get('/', authorize('admin', 'seller'), getCoupons);
router.get('/:id', authorize('admin', 'seller'), getCoupon);
router.put('/:id', authorize('admin', 'seller'), updateCoupon);
router.delete('/:id', authorize('admin', 'seller'), deleteCoupon);
router.post('/:id/use', useCoupon);

export default router;
