import { query } from '../config/database.js';

class Dashboard {
    // ==========================================
    // ADMIN / EDITOR: Global Stats
    // ==========================================
    static async getOverviewStats() {
        const postsQuery = await query("SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END), 0) as published FROM posts");
        const commentsQuery = await query("SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending FROM comments");
        const viewsQuery = await query("SELECT COALESCE(SUM(view_count), 0) as total_views FROM posts");
        const usersQuery = await query("SELECT COUNT(*) as total FROM users");

        return {
            posts: postsQuery.rows[0],
            comments: commentsQuery.rows[0],
            views: viewsQuery.rows[0],
            users: usersQuery.rows[0]
        };
    }

    static async getTopPosts() {
        const sql = `
            SELECT p.post_id, p.title, p.status, p.view_count, u.username as author,
            (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) as comment_count,
            0 as like_count
            FROM posts p
            JOIN users u ON p.author_id = u.user_id
            ORDER BY p.view_count DESC
            LIMIT 5;
        `;
        const { rows } = await query(sql);
        return rows;
    }

    // ==========================================
    // AUTHOR: Personal Stats Only
    // ==========================================
    static async getAuthorOverviewStats(authorId) {
        // Only count their own posts
        const postsQuery = await query(`
            SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END), 0) as published 
            FROM posts WHERE author_id = $1
        `, [authorId]);

        // Only sum views from their own posts
        const viewsQuery = await query(`
            SELECT COALESCE(SUM(view_count), 0) as total_views 
            FROM posts WHERE author_id = $1
        `, [authorId]);

        // Only count comments made on THEIR posts
        const commentsQuery = await query(`
            SELECT COUNT(*) as total, COALESCE(SUM(CASE WHEN c.status = 'pending' THEN 1 ELSE 0 END), 0) as pending
            FROM comments c
            JOIN posts p ON c.post_id = p.post_id
            WHERE p.author_id = $1
        `, [authorId]);

        return {
            posts: postsQuery.rows[0],
            views: viewsQuery.rows[0],
            comments: commentsQuery.rows[0],
            users: { total: 0 } // Authors don't manage users, keep it 0 for frontend consistency
        };
    }

    static async getAuthorTopPosts(authorId) {
        const sql = `
            SELECT p.post_id, p.title, p.status, p.view_count, u.username as author,
            (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) as comment_count,
            0 as like_count
            FROM posts p
            JOIN users u ON p.author_id = u.user_id
            WHERE p.author_id = $1
            ORDER BY p.view_count DESC
            LIMIT 5;
        `;
        const { rows } = await query(sql, [authorId]);
        return rows;
    }
}

export default Dashboard;