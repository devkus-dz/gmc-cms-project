import { query } from '../config/database.js';

class ActivityLog {

    static async log(data) {
        const { user_id, action, entity_type, entity_id, description, ip_address, user_agent } = data;
        const sql = `
            INSERT INTO activity_log (user_id, action, entity_type, entity_id, description, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const params = [user_id, action, entity_type, entity_id, description, ip_address, user_agent];
        const { rows } = await query(sql, params);
        return rows[0];
    }

    static async getRecentLogs(limit = 10, userId = null) {
        let sql = `
            SELECT a.log_id, a.action, a.description, a.created_at, u.username 
            FROM activity_log a
            LEFT JOIN users u ON a.user_id = u.user_id
            WHERE 1=1
        `;
        const params = [limit];

        if (userId) {
            sql += ` AND a.user_id = $2`;
            params.push(userId);
        }

        sql += ` ORDER BY a.created_at DESC LIMIT $1;`;

        const { rows } = await query(sql, params);
        return rows;
    }

    static async getAll({ limit = 10, offset = 0, search = '', userId = null }) {
        let sql = `
            SELECT a.log_id, a.action, a.entity_type, a.description, a.created_at, u.username 
            FROM activity_log a
            LEFT JOIN users u ON a.user_id = u.user_id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        // 1. Filter by User if applicable
        if (userId) {
            sql += ` AND a.user_id = $${paramIndex}`;
            params.push(userId);
            paramIndex++;
        }

        // 2. Filter by Search
        if (search) {
            sql += ` AND (u.username ILIKE $${paramIndex} OR a.action ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        sql += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`;
        params.push(limit, offset);

        const { rows } = await query(sql, params);

        // Count Query
        let countSql = `
            SELECT COUNT(*) 
            FROM activity_log a
            LEFT JOIN users u ON a.user_id = u.user_id
            WHERE 1=1
        `;
        const countParams = [];
        let countIndex = 1;

        if (userId) {
            countSql += ` AND a.user_id = $${countIndex}`;
            countParams.push(userId);
            countIndex++;
        }
        if (search) {
            countSql += ` AND (u.username ILIKE $${countIndex} OR a.action ILIKE $${countIndex} OR a.description ILIKE $${countIndex})`;
            countParams.push(`%${search}%`);
        }

        const { rows: countRows } = await query(countSql, countParams);

        return {
            logs: rows,
            total: parseInt(countRows[0].count)
        };
    }
}

export default ActivityLog;