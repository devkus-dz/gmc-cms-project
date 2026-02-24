import { query } from '../config/database.js';

/**
 * @class Post
 * @description Model for interacting with the posts table and related taxonomies.
 */
class Post {
    /**
     * @function create
     * @description Inserts a new post and its associated tags into the database.
     * @param {Object} data - The post data payload.
     * @returns {Promise<Object>} The created post record.
     */
    static async create(data) {
        // 👇 Added meta fields to destructuring
        const {
            title, slug, content, excerpt, author_id, category_id, status,
            featured_image, is_featured, allow_comments, reading_time, published_at, tags,
            meta_title, meta_description, meta_keywords
        } = data;

        const sql = `
            INSERT INTO posts (
                title, slug, content, excerpt, author_id, category_id, status, 
                featured_image, is_featured, allow_comments, reading_time, published_at,
                meta_title, meta_description, meta_keywords
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *;
        `;

        const params = [
            title, slug, content, excerpt || null, author_id, category_id || null, status || 'draft',
            featured_image || null, is_featured || false, allow_comments ?? true, reading_time || 0, published_at || null,
            meta_title || null, meta_description || null, meta_keywords || null
        ];

        const { rows } = await query(sql, params);
        const newPost = rows[0];

        if (tags && Array.isArray(tags) && tags.length > 0) {
            for (const tagId of tags) {
                await query('INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)', [newPost.post_id, tagId]);
            }
        }

        return newPost;
    }

    /**
     * @function findAll
     * @description Retrieves a list of all posts for the admin datatable.
     * @param {Object} options - Query options.
     * @param {string} [options.status] - Optional filter (e.g., 'draft').
     * @param {number} [options.limit=100] - Max records.
     * @returns {Promise<Array>}
     */
    static async findAll({ status = 'all', limit = 100, offset = 0 } = {}) {
        let sql = `
        SELECT 
            p.post_id, 
            p.title, 
            p.slug, 
            p.status, 
            p.view_count, 
            p.created_at, 
            p.published_at,
            p.content,        
            p.excerpt,       
            p.featured_image,
            u.username as author_name, 
            c.name as category_name
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.user_id
        LEFT JOIN categories c ON p.category_id = c.category_id
    `;

        const params = [];
        let paramIndex = 1;

        // If status is 'all' or undefined, we don't add a WHERE clause, 
        // ensuring ALL posts show up in the admin panel.
        if (status && status !== 'all') {
            sql += ` WHERE p.status = $${paramIndex++}`;
            params.push(status);
        }

        sql += ` ORDER BY p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(limit, offset);

        const { rows } = await query(sql, params);
        return rows;
    }

    /**
     * @function findBySlug
     * @description Retrieves a single post by its slug, including its tags.
     * @param {string} slug - The URL-friendly string.
     * @returns {Promise<Object>} The post record.
     */
    static async findBySlug(slug) {
        const sql = `
            SELECT p.*, u.username as author_name, u.bio as author_bio, c.name as category_name,
                   COALESCE(json_agg(json_build_object('tag_id', t.tag_id, 'name', t.name)) FILTER (WHERE t.tag_id IS NOT NULL), '[]') as tags
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.user_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN post_tags pt ON p.post_id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.tag_id
            WHERE p.slug = $1
            GROUP BY p.post_id, u.username, u.bio, c.name;
        `;
        const { rows } = await query(sql, [slug]);
        return rows[0];
    }

    /**
     * @function findById
     * @description Retrieves a single post by its unique numeric ID, including its tags.
     * @param {string|number} id - The post ID.
     * @returns {Promise<Object>} The post record.
     */
    static async findById(id) {
        const sql = `
            SELECT p.*, u.username as author_name, u.bio as author_bio, c.name as category_name,
                   COALESCE(json_agg(json_build_object('tag_id', t.tag_id, 'name', t.name)) FILTER (WHERE t.tag_id IS NOT NULL), '[]') as tags
            FROM posts p
            LEFT JOIN users u ON p.author_id = u.user_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN post_tags pt ON p.post_id = pt.post_id
            LEFT JOIN tags t ON pt.tag_id = t.tag_id
            WHERE p.post_id = $1
            GROUP BY p.post_id, u.username, u.bio, c.name;
        `;
        const { rows } = await query(sql, [id]);
        return rows[0];
    }

    /**
     * @function update
     * @description Updates an existing post record and synchronizes its tags.
     * @param {string|number} id - The ID of the post to update.
     * @param {Object} data - The updated data fields.
     * @returns {Promise<Object>} The updated post record.
     */
    static async update(id, data) {
        // 👇 Added all SEO and options fields to destructuring
        const {
            title, slug, content, excerpt, category_id, status, featured_image,
            is_featured, published_at, tags,
            meta_title, meta_description, meta_keywords, allow_comments, reading_time
        } = data;

        const sql = `
            UPDATE posts 
            SET title = $1, slug = $2, content = $3, excerpt = $4, category_id = $5, 
                status = $6, featured_image = $7, is_featured = $8, published_at = $9, 
                meta_title = $10, meta_description = $11, meta_keywords = $12, 
                allow_comments = $13, reading_time = $14,
                updated_at = CURRENT_TIMESTAMP
            WHERE post_id = $15 
            RETURNING *;
        `;

        const params = [
            title, slug, content, excerpt || null, category_id || null,
            status, featured_image || null, is_featured || false, published_at || null,
            meta_title || null, meta_description || null, meta_keywords || null,
            allow_comments ?? true, reading_time || 0,
            id
        ];

        const { rows } = await query(sql, params);
        const updatedPost = rows[0];

        // Sync Tags (Delete old ones, insert new ones)
        if (tags !== undefined && Array.isArray(tags)) {
            await query('DELETE FROM post_tags WHERE post_id = $1', [id]);

            if (tags.length > 0) {
                for (const tagId of tags) {
                    await query('INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)', [id, tagId]);
                }
            }
        }

        return updatedPost;
    }

    /**
     * @function delete
     * @description Removes a post from the database (cascade deletes tags).
     * @param {string|number} id - The ID of the post to delete.
     * @returns {Promise<boolean>} True if successful.
     */
    static async delete(id) {
        await query('DELETE FROM posts WHERE post_id = $1', [id]);
        return true;
    }

    /**
     * @function incrementViews
     * @description Increments the view count for a specific post.
     * @param {string|number} id - The ID of the post.
     * @returns {Promise<void>}
     */
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