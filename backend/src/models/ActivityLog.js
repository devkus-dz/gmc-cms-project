import pool from '../config/database.js';

class ActivityLog {
    static async getRecentLogs(limit = 10) {
        // Joins the activity_log table with users to get the username
        const query = `
            SELECT a.log_id, a.action, a.description, a.created_at, u.username 
            FROM activity_log a
            LEFT JOIN users u ON a.user_id = u.user_id
            ORDER BY a.created_at DESC
            LIMIT $1
        `;
        const result = await pool.query(query, [limit]);
        return result.rows;
    }
}

export default ActivityLog;