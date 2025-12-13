import express from 'express';
import { 
getDashboardStats,
deleteUser,
getAllUsers,
updateUserStatus,
moderateProduct,
getAnalytics,
getSettings,
getAllProducts,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// all routes are admin only
router.use(protect);
router.use(authorize('admin'));

// dashboard stats
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);
router.get('/settings', getSettings);

// user management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', updateUserStatus);

// product management
router.get('/products', getAllProducts);
router.put('/products/:id/moderate', moderateProduct);

export default router;