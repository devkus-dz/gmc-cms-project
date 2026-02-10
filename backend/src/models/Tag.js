import { query } from '../config/database.js';

class Tag {
    static async findAll() {
        const { rows } = await query('SELECT * FROM tags ORDER BY name ASC');
        return rows;
    }

    static async create({ name, slug, description }) {
        const sql = 'INSERT INTO tags (name, slug, description) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await query(sql, [name, slug, description]);
        return rows[0];
    }
}

export default Tag;