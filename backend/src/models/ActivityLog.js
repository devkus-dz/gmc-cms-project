import { query } from '../config/database.js';

class ActivityLog {
    static async findAll(userId = null) {
        let sql = `
            SELECT a.*, u.username, u.avatar 
            FROM activity_log a
            LEFT JOIN users u ON a.user_id = u.user_id
        `;
        const params = [];

        // If a userId is provided, filter the logs so the user only sees their own actions
        if (userId) {
            sql += ` WHERE a.user_id = $1 `;
            params.push(userId);
        }

        sql += ` ORDER BY a.created_at DESC LIMIT 500; `;

        const { rows } = await query(sql, params);
        return rows;
    }

    static async log({ user_id, action, entity_type, entity_id, description, ip_address, user_agent }) {
        const sql = `
            INSERT INTO activity_log (user_id, action, entity_type, entity_id, description, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;
        const params = [user_id || null, action, entity_type || null, entity_id || null, description || null, ip_address || null, user_agent || null];
        await query(sql, params);
    }
}

export default ActivityLog;