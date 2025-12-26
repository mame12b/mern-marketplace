import express from 'express';
import { 
    applyForSeller, 
    getSellerApplicationStatus,
    updateShopInfo,
    getSellerDashboardStats
} from '../controllers/sellerController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Apply for seller account (pay application fee)
router.post('/apply', applyForSeller);

// Get seller application status
router.get('/application-status', getSellerApplicationStatus);

// Update shop information
router.put('/shop', updateShopInfo);

// Get seller dashboard stats
router.get('/dashboard-stats', getSellerDashboardStats);

export default router;
