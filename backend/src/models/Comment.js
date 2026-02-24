import { query } from '../config/database.js';

class Comment {
  // Create a new comment
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

  // Admin: Get ALL comments across the whole site
  static async findAll(limit = 100, offset = 0) {
    const sql = `
      SELECT c.*, 
             u.username as author_name, 
             u.avatar, 
             p.title as post_title,
             p.slug as post_slug
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN posts p ON c.post_id = p.post_id
      ORDER BY c.created_at DESC 
      LIMIT $1 OFFSET $2;
    `;
    // 👆 Added 'as author_name' and 'p.slug as post_slug'

    const { rows } = await query(sql, [limit, offset]);
    return rows;
  }

  // Public: Get only approved comments for a specific post
  static async findByPost(post_id) {
    const sql = `
    SELECT c.*, 
           u.username as author_name, 
           u.avatar as author_avatar 
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.user_id
    WHERE c.post_id = $1 AND c.status = 'approved' 
    ORDER BY c.created_at ASC;
  `;

    const { rows } = await query(sql, [post_id]);
    return rows;
  }

  // Moderate: Update comment status (approved, pending, spam)
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