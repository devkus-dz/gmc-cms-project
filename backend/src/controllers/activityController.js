import ActivityLog from '../models/ActivityLog.js';
import { successResponse, errorResponse, paginate } from '../utils/helpers.js';

export const getRecentActivity = async (req, res) => {
    try {
        const { user_id, role } = req.user;
        const filterId = role === 'admin' ? null : user_id;

        const logs = await ActivityLog.getRecentLogs(10, filterId);
        res.status(200).json(successResponse(logs));
    } catch (error) {
        console.error("Activity Log Error:", error);
        res.status(500).json(errorResponse("Failed to load recent activity logs."));
    }
};

export const getAllActivity = async (req, res) => {
    try {
        const { page, limit, offset } = paginate(req.query.page, req.query.limit);
        const search = req.query.search || '';

        const { user_id, role } = req.user;
        const filterId = ['admin'].includes(role) ? null : user_id;

        const result = await ActivityLog.getAll({ limit, offset, search, userId: filterId });

        res.status(200).json(successResponse({
            items: result.logs,
            pagination: {
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            }
        }));
    } catch (error) {
        console.error("All Activity Error:", error);
        res.status(500).json(errorResponse("Failed to load paginated activity logs."));
    }
};