import express from 'express';
import { 
    addReview, 
    getProductReviews,
    getPendingReviews,
    getReview,
    moderateReview,
    getMyReviews,
    deleteReview,
    updateReview,
    markHelpful,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/:id', getReview);

// Protected routes
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.get('/user/my-reviews', protect, getMyReviews);
router.post('/:id/helpful', protect, markHelpful);

// Admin routes
router.get('/admin/pending', protect, authorize('admin'), getPendingReviews);
router.put('/:id/moderate', protect, authorize('admin'), moderateReview);

export default router;