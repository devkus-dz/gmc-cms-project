import ActivityLog from '../models/ActivityLog.js';

export const getRecentActivity = async (req, res) => {
    try {
        // Fetch the 10 most recent logs
        const logs = await ActivityLog.getRecentLogs(10);

        res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error("Activity Log Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load activity logs."
        });
    }
};