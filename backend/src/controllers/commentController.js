import Comment from '../models/Comment.js';
import cacheService from '../services/cacheService.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

/**
 * @desc    Get all comments (System-wide).
 * Uses caching to reduce database load for admin dashboards.
 * @route   GET /api/v1/comments
 * @access  Protected (Admin/Editor)
 * @returns {Object} List of all comments
 */
export const getAllComments = async (req, res) => {
    try {
        const cacheKey = 'all_system_comments';

        // Check Cache
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
            return res.json(successResponse(cachedData));
        }

        // Database Query
        const comments = await Comment.findAll();

        // Save to Cache (TTL 5 minutes)
        cacheService.set(cacheKey, comments, 300);

        res.json(successResponse(comments));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Get approved comments for a specific post.
 * Caches result by post ID.
 * @route   GET /api/v1/comments/post/:postId
 * @access  Public
 * @returns {Object} List of comments for the post
 */
export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const cacheKey = `comments_post_${postId}`;

        // Check Cache
        const cachedComments = cacheService.get(cacheKey);
        if (cachedComments) {
            return res.json(successResponse(cachedComments));
        }

        // Database Query
        const comments = await Comment.findByPost(postId);

        // Save to Cache
        cacheService.set(cacheKey, comments);

        res.json(successResponse(comments));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};

/**
 * @desc    Create a new comment.
 * Invalidates cache for the specific post and the system-wide list.
 * @route   POST /api/v1/comments
 * @access  Protected (Logged in users)
 * @returns {Object} The created comment object
 */
export const createComment = async (req, res) => {
    try {
        const { post_id, content, parent_id } = req.body;

        const commentData = {
            post_id,
            content,
            parent_id: parent_id || null,
            user_id: req.user.user_id,
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        };

        const comment = await Comment.create(commentData);

        // Invalidate cache for this post's comments
        cacheService.del(`comments_post_${post_id}`);
        // Invalidate admin list cache
        cacheService.del('all_system_comments');

        res.status(201).json(successResponse(comment, 'Comment submitted successfully'));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Update comment status (Approve/Reject).
 * Flushes cache to ensure status updates are reflected immediately.
 * @route   PATCH /api/v1/comments/:id
 * @access  Protected (Admin/Editor)
 * @returns {Object} The updated comment
 */
export const updateCommentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const comment = await Comment.updateStatus(req.params.id, status);

        if (!comment) {
            return res.status(404).json(errorResponse('Comment not found'));
        }

        // Flush cache to reflect status changes in lists
        cacheService.flush();

        res.json(successResponse(comment, `Comment status updated to ${status}`));
    } catch (error) {
        res.status(400).json(errorResponse(error.message));
    }
};

/**
 * @desc    Delete a comment.
 * Flushes cache to remove deleted comment from lists.
 * @route   DELETE /api/v1/comments/:id
 * @access  Protected (Admin/Editor)
 * @returns {Object} Success message
 */
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.delete(req.params.id);

        if (!comment) {
            return res.status(404).json(errorResponse('Comment not found'));
        }

        // Flush cache
        cacheService.flush();

        res.json(successResponse(null, 'Comment deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};