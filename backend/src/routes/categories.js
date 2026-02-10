import express from 'express';
import { getAllCategories, createCategory, updateCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { categoryValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Public
router.get('/', getAllCategories);

// Admin/Editor only
router.post('/', protect, authorize('admin', 'editor'), categoryValidation, validate, createCategory);
router.put('/:id', protect, authorize('admin', 'editor'), categoryValidation, validate, updateCategory);

export default router;