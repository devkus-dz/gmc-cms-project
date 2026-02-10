import { query } from '../config/database.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

// @desc    Get dashboard statistics (Admin/Editor only)
// @route   GET /api/v1/stats
export const getStats = async (req, res) => {
    try {
        // Optimized Query: Get all counts in a single database trip
        const sql = `
      SELECT 
        (SELECT COUNT(*) FROM posts) AS total_posts,
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM comments) AS total_comments,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM media) AS total_media,
        (SELECT COUNT(*) FROM posts WHERE status = 'published') AS published_posts,
        (SELECT COUNT(*) FROM comments WHERE status = 'pending') AS pending_comments
    `;

        const { rows } = await query(sql);

        // The result comes back as strings (BigInt), so we parse them to numbers
        const stats = {
            total_posts: parseInt(rows[0].total_posts),
            total_users: parseInt(rows[0].total_users),
            total_comments: parseInt(rows[0].total_comments),
            total_categories: parseInt(rows[0].total_categories),
            total_media: parseInt(rows[0].total_media),
            published_posts: parseInt(rows[0].published_posts),
            pending_comments: parseInt(rows[0].pending_comments)
        };

        res.json(successResponse(stats, 'Dashboard stats retrieved successfully'));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};