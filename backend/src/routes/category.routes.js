import express from 'express';
import  { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory,
    getCategoryBySlug,
    getCategoryTree,
    getPopularCategories,
    getCategory,
} from '../controllers/categoryController.js';
import {protect, authorize} from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/popular', getPopularCategories);
router.get('/tree', getCategoryTree);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

// Admin routes
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;