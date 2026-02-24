import Dashboard from '../models/Dashboard.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

export const getDashboardStats = async (req, res) => {
    try {
        const { role, user_id } = req.user;
        let overview, topPosts;

        // Admins and Editors see everything
        if (role === 'admin' || role === 'editor') {
            overview = await Dashboard.getOverviewStats();
            topPosts = await Dashboard.getTopPosts();
        }
        // Authors only see their own performance
        else if (role === 'author') {
            overview = await Dashboard.getAuthorOverviewStats(user_id);
            topPosts = await Dashboard.getAuthorTopPosts(user_id);
        } else {
            return res.status(403).json(errorResponse('Access denied. Subscribers do not have a dashboard.'));
        }

        res.json(successResponse({ overview, topPosts }));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};