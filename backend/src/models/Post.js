import { query } from '../config/database.js';

class Post {
    static async create(data) {
        const {
            title, slug, content, excerpt, author_id, category_id,
            status, featured_image, published_at, tags,
            meta_title, meta_description, meta_keywords, allow_comments, reading_time
        } = data;

        // 1. Insert the main post
        const sql = `
            INSERT INTO posts (
                title, slug, content, excerpt, author_id, category_id, 
                status, featured_image, published_at, meta_title, 
                meta_description, meta_keywords, allow_comments, reading_time
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;

        const params = [
            title, slug, content, excerpt, author_id, category_id || null,
            status || 'draft', featured_image, published_at || null,
            meta_title, meta_description, meta_keywords,
            allow_comments !== false, reading_time || 1
        ];

        const { rows } = await query(sql, params);
        const newPost = rows[0];

        // 2. Insert the tags safely (Identical to our bulletproof update logic)
        if (tags && Array.isArray(tags)) {
            const normalizedTags = tags
                .map(t => typeof t === 'object' ? String(t.tag_id || t.id) : String(t))
                .filter(t => t !== 'null' && t !== 'undefined' && t !== '');

            const uniqueTags = [...new Set(normalizedTags)];

            for (const tagId of uniqueTags) {
                await query(
                    `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT (post_id, tag_id) DO NOTHING`,
                    [newPost.post_id, parseInt(tagId)]
                );
            }
        }

        return newPost;
    }

    static async update(id, data) {
        const {
            title, slug, content, excerpt, category_id,
            status, featured_image, published_at, tags,
            meta_title, meta_description, meta_keywords, allow_comments, reading_time
        } = data;

        // 1. Update the main post
        const sql = `
            UPDATE posts 
            SET title = $1, slug = $2, content = $3, excerpt = $4, category_id = $5, 
                status = $6, featured_image = $7, published_at = $8, meta_title = $9, 
                meta_description = $10, meta_keywords = $11, allow_comments = $12, 
                reading_time = $13, updated_at = NOW()
            WHERE post_id = $14 RETURNING *;
        `;

        const params = [
            title, slug, content, excerpt, category_id || null,
            status, featured_image, published_at || null,
            meta_title, meta_description, meta_keywords,
            allow_comments !== false, reading_time || 1, id
        ];

        const { rows } = await query(sql, params);
        const updatedPost = rows[0];

        // 2. Update tags (Delete old ones, insert new ones)
        if (updatedPost && tags && Array.isArray(tags)) {
            await query(`DELETE FROM post_tags WHERE post_id = $1`, [id]);

            // Normalize all incoming tags to strings to safely deduplicate them
            const normalizedTags = tags
                .map(t => typeof t === 'object' ? String(t.tag_id || t.id) : String(t))
                .filter(t => t !== 'null' && t !== 'undefined' && t !== '');

            // Now the Set will perfectly eliminate duplicates (e.g., "8" and "8")
            const uniqueTags = [...new Set(normalizedTags)];

            for (const tagId of uniqueTags) {
                // We add the specific conflict target (post_id, tag_id) so PG knows what to ignore
                await query(
                    `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT (post_id, tag_id) DO NOTHING`,
                    [id, parseInt(tagId)]
                );
            }
        }

        return updatedPost;
    }

    static async findAll({ status = 'published', limit = 10, offset = 0, search = '' }) {
        let sql = `
            SELECT p.*,
                   u.username as author_name, c.name as category_name
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.user_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (status && status !== 'all') {
            sql += ` AND p.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (search) {
            sql += ` AND (p.title ILIKE $${paramIndex} OR p.slug ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        sql += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limit, offset);

        const { rows } = await query(sql, params);

        let countSql = `SELECT COUNT(*) FROM posts p WHERE 1=1`;
        const countParams = [];
        let countIndex = 1;

        if (status && status !== 'all') {
            countSql += ` AND p.status = $${countIndex}`;
            countParams.push(status);
            countIndex++;
        }
        if (search) {
            countSql += ` AND (p.title ILIKE $${countIndex} OR p.slug ILIKE $${countIndex})`;
            countParams.push(`%${search}%`);
        }

        const { rows: countRows } = await query(countSql, countParams);

        return { posts: rows, total: parseInt(countRows[0].count) };
    }

    static async findBySlug(slug) {
        const sql = `
            SELECT p.*, 
                   u.username as author_name, 
                   u.bio as author_bio, 
                   c.name as category_name, c.slug as category_slug,
                   COALESCE(
                       (
                           SELECT json_agg(
                               json_build_object(
                                   'tag_id', t.tag_id, 
                                   'name', t.name, 
                                   'slug', t.slug
                               )
                           ) 
                           FROM post_tags pt 
                           JOIN tags t ON pt.tag_id = t.tag_id
                           WHERE pt.post_id = p.post_id
                       ), 
                       '[]'::json
                   ) as tags
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.user_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.slug = $1;
        `;
        const { rows } = await query(sql, [slug]);
        return rows[0];
    }

    static async delete(id) {
        await query('DELETE FROM posts WHERE post_id = $1', [id]);
        return true;
    }

    static async incrementViews(id) {
        await query('UPDATE posts SET view_count = view_count + 1 WHERE post_id = $1', [id]);
    }

    static async incrementLikes(id) {
        await query('UPDATE posts SET like_count = COALESCE(like_count, 0) + 1 WHERE post_id = $1', [id]);
    }

    static async decrementLikes(id) {
        await query('UPDATE posts SET like_count = GREATEST(0, like_count - 1) WHERE post_id = $1', [id]);
    }
}

export default Post;