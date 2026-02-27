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

    // Update method
    static async update(id, { name, slug, description }) {
        const sql = `
            UPDATE tags 
            SET name = $1, slug = $2, description = $3 
            WHERE tag_id = $4 RETURNING *
        `;
        const { rows } = await query(sql, [name, slug, description, id]);
        return rows[0];
    }

    // Delete method
    static async delete(id) {
        const { rows } = await query('DELETE FROM tags WHERE tag_id = $1 RETURNING *', [id]);
        return rows[0];
    }
}

export default Tag;