import express from 'express';
import {
    getAllComments,
    getPostComments,
    createComment,
    updateCommentStatus,
    deleteComment
} from '../controllers/commentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { commentValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Admin Route: Get all comments across the site
router.get('/', protect, authorize('admin', 'editor'), getAllComments);

// Public Route: Get comments for a specific post
router.get('/post/:postId', getPostComments);

// Private Route: Post a comment (This requires the full commentValidation)
router.post('/', protect, commentValidation, validate, createComment);

// Admin/Editor Route: Moderate a comment
router.put('/:id/status', protect, authorize('admin', 'editor'), updateCommentStatus);

// Delete a comment (Admin/Editor only)
router.delete('/:id', protect, authorize('admin', 'editor'), deleteComment);

export default router;