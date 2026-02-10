import express from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { protect, authorize } from '../middleware/auth.js';
import { postValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

// Protected routes (Requires login)
router.post('/', protect, authorize('admin', 'editor'), postValidation, validate, createPost);
router.put('/:id', protect, authorize('admin', 'editor', 'author'), postValidation, validate, updatePost);
router.delete('/:id', protect, authorize('admin', 'editor'), deletePost);

export default router;