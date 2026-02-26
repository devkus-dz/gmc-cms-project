import Dashboard from '../models/Dashboard.js';

export const getDashboardStats = async (req, res) => {
    try {
        const { id, role } = req.user;
        let stats;

        // Admin and Editor see everything, Author sees only their own
        if (role === 'admin' || role === 'editor') {
            stats = await Dashboard.getAdminEditorStats();
        } else if (role === 'author') {
            stats = await Dashboard.getAuthorStats(id);
        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized role."
            });
        }

        res.status(200).json({
            success: true,
            data: stats // This 'data' object contains the nested 'overview' and 'topPosts'
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics."
        });
    }
};