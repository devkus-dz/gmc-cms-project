import express from 'express';
import {
    getAllComments,
    getPostComments,
    createComment,
    updateCommentStatus,
    deleteComment
} from '../controllers/commentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { commentValidation, validate, commentStatusValidation } from '../middleware/validation.js';

const router = express.Router();

// Admin Route: Get all comments across the site
// URL: GET /api/v1/comments
router.get('/', protect, authorize('admin', 'editor'), getAllComments);

// Public Route: Get comments for a specific post
// URL: GET /api/v1/comments/post/:postId
router.get('/post/:postId', getPostComments);

// Private Route: Post a comment
// URL: POST /api/v1/comments
router.post('/', protect, commentValidation, validate, createComment);

// Admin/Editor Route: Moderate a comment
// URL: PATCH /api/v1/comments/:id/status
router.put('/:id/status', protect, authorize('admin', 'editor'), commentStatusValidation, validate, updateCommentStatus);

// Delete a comment (Admin/Editor only)
router.delete('/:id', protect, authorize('admin', 'editor'), deleteComment);

export default router;