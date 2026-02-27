import { query } from '../config/database.js';

class Comment {
  static async create({ post_id, user_id, content, parent_id, ip_address, user_agent }) {
    const sql = `
            INSERT INTO comments (post_id, user_id, content, parent_id, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
    const params = [post_id, user_id, content, parent_id, ip_address, user_agent];
    const { rows } = await query(sql, params);
    return rows[0];
  }

  /**
   * @function findAll
   * @description Fetches paginated comments across the site with optional search.
   */
  static async findAll({ limit = 20, offset = 0, search = '' }) {
    let sql = `
            SELECT c.*, u.username, u.avatar, p.title as post_title 
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            LEFT JOIN posts p ON c.post_id = p.post_id
            WHERE 1=1
        `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      sql += ` AND (u.username ILIKE $${paramIndex} OR c.content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`;
    params.push(limit, offset);

    const { rows } = await query(sql, params);

    // Get total count for TanStack pagination
    let countSql = `
            SELECT COUNT(*) FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            WHERE 1=1
        `;
    const countParams = [];

    if (search) {
      countSql += ` AND (u.username ILIKE $1 OR c.content ILIKE $1)`;
      countParams.push(`%${search}%`);
    }

    const { rows: countRows } = await query(countSql, countParams);

    return {
      comments: rows,
      total: parseInt(countRows[0].count)
    };
  }

  /**
       * @function findByPost
       * @description Fetches all APPROVED comments for a specific post.
       */
  static async findByPost(postId) {
    const sql = `
      SELECT c.*, u.username, u.avatar 
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.post_id = $1 AND c.status = 'approved' -- 👈 ADD THIS CONDITION
      ORDER BY c.created_at ASC;
  `;
    const { rows } = await query(sql, [postId]);
    return rows;
  }

  static async updateStatus(id, status) {
    const sql = `
            UPDATE comments 
            SET status = $1, updated_at = NOW() 
            WHERE comment_id = $2 
            RETURNING *;
        `;
    const { rows } = await query(sql, [status, id]);
    return rows[0];
  }

  static async delete(id) {
    await query('DELETE FROM comments WHERE comment_id = $1', [id]);
    return true;
  }
}

export default Comment;