import Dashboard from '../models/Dashboard.js';
// 👇 ADD THIS LINE: Import your response helpers
import { successResponse, errorResponse } from '../utils/helpers.js';

export const getDashboardStats = async (req, res) => {
    try {
        const { id, role } = req.user;
        let stats;

        if (role === 'admin' || role === 'editor') {
            stats = await Dashboard.getAdminEditorStats();
        } else if (role === 'author') {
            stats = await Dashboard.getAuthorStats(id);
        } else if (role === 'subscriber') {
            stats = { isSubscriber: true };
        } else {
            return res.status(403).json(errorResponse("Unauthorized role."));
        }

        res.status(200).json(successResponse(stats));
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json(errorResponse("Failed to load dashboard statistics."));
    }
};