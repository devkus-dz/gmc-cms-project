import { query } from '../config/database.js';

class Post {
    static async create(data) {
        const { title, slug, content, excerpt, author_id, category_id, status, featured_image, is_featured, allow_comments, reading_time } = data;
        const sql = `
      INSERT INTO posts (title, slug, content, excerpt, author_id, category_id, status, featured_image, is_featured, allow_comments, reading_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
        const params = [title, slug, content, excerpt, author_id, category_id, status, featured_image, is_featured, allow_comments, reading_time];
        const { rows } = await query(sql, params);
        return rows[0];
    }

    static async findAll({ status = 'published', limit = 10, offset = 0 }) {
        const sql = `
      SELECT p.*, u.username as author_name, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.status = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
        const { rows } = await query(sql, [status, limit, offset]);
        return rows;
    }

    static async findBySlug(slug) {
        const sql = `
      SELECT p.*, u.username as author_name, u.bio as author_bio, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.slug = $1;
    `;
        const { rows } = await query(sql, [slug]);
        return rows[0];
    }

    static async update(id, data) {
        const { title, slug, content, excerpt, category_id, status, featured_image, is_featured } = data;
        const sql = `
      UPDATE posts 
      SET title = $1, slug = $2, content = $3, excerpt = $4, category_id = $5, status = $6, featured_image = $7, is_featured = $8, updated_at = NOW()
      WHERE post_id = $9 RETURNING *;
    `;
        const { rows } = await query(sql, [title, slug, content, excerpt, category_id, status, featured_image, is_featured, id]);
        return rows[0];
    }

    static async delete(id) {
        await query('DELETE FROM posts WHERE post_id = $1', [id]);
        return true;
    }

    static async incrementViews(id) {
        await query('UPDATE posts SET view_count = view_count + 1 WHERE post_id = $1', [id]);
    }

    /**
     * @function incrementLikes
     * @description Increments the like count for a specific post.
     * @param {string|number} id - The ID of the post.
     * @returns {Promise<void>}
     */
    static async incrementLikes(id) {
        await query('UPDATE posts SET like_count = COALESCE(like_count, 0) + 1 WHERE post_id = $1', [id]);
    }
}

export default Post;