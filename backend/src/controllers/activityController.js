import ActivityLog from '../models/ActivityLog.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

export const getActivityLogs = async (req, res) => {
    try {
        const { role, user_id } = req.user;

        // Admins see all logs. Authors/Editors only see their own logs.
        const targetUserId = role === 'admin' ? null : user_id;

        const logs = await ActivityLog.findAll(targetUserId);
        res.json(successResponse(logs));
    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
};