import pool from '../config/database.js';

class Dashboard {
    static async getAdminEditorStats() {
        const postsRes = await pool.query('SELECT COUNT(*) as total FROM posts');
        const commentsRes = await pool.query('SELECT COUNT(*) as total FROM comments');
        const viewsRes = await pool.query('SELECT SUM(view_count) as total_views FROM posts');
        const usersRes = await pool.query('SELECT COUNT(*) as total FROM users');

        // Note: Using p.post_id and u.user_id based exactly on your schema!
        const topPostsRes = await pool.query(`
            SELECT p.post_id, p.title, u.username as author, p.view_count, p.status 
            FROM posts p 
            LEFT JOIN users u ON p.author_id = u.user_id 
            ORDER BY p.view_count DESC 
            LIMIT 5
        `);

        return {
            overview: {
                posts: { total: parseInt(postsRes.rows[0].total) || 0 },
                comments: { total: parseInt(commentsRes.rows[0].total) || 0 },
                views: { total_views: parseInt(viewsRes.rows[0].total_views) || 0 },
                users: { total: parseInt(usersRes.rows[0].total) || 0 }
            },
            topPosts: topPostsRes.rows
        };
    }

    static async getAuthorStats(authorId) {
        const postsRes = await pool.query('SELECT COUNT(*) as total FROM posts WHERE author_id = $1', [authorId]);
        const viewsRes = await pool.query('SELECT SUM(view_count) as total_views FROM posts WHERE author_id = $1', [authorId]);
        const commentsRes = await pool.query(`
            SELECT COUNT(*) as total FROM comments c
            JOIN posts p ON c.post_id = p.post_id
            WHERE p.author_id = $1
        `, [authorId]);

        const topPostsRes = await pool.query(`
            SELECT p.post_id, p.title, u.username as author, p.view_count, p.status 
            FROM posts p 
            LEFT JOIN users u ON p.author_id = u.user_id 
            WHERE p.author_id = $1
            ORDER BY p.view_count DESC 
            LIMIT 5
        `, [authorId]);

        return {
            overview: {
                posts: { total: parseInt(postsRes.rows[0].total) || 0 },
                comments: { total: parseInt(commentsRes.rows[0].total) || 0 },
                views: { total_views: parseInt(viewsRes.rows[0].total_views) || 0 },
                users: { total: 0 }
            },
            topPosts: topPostsRes.rows
        };
    }
}

export default Dashboard;