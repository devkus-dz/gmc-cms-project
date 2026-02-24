import { query } from '../config/database.js';

/**
 * @class Tag
 * @description Model for interacting with the tags table in PostgreSQL.
 */
class Tag {
    static async findAll() {
        const { rows } = await query('SELECT * FROM tags ORDER BY name ASC');
        return rows;
    }

    static async findById(id) {
        const { rows } = await query('SELECT * FROM tags WHERE tag_id = $1', [id]);
        return rows[0];
    }

    static async create({ name, slug, description }) {
        const sql = 'INSERT INTO tags (name, slug, description) VALUES ($1, $2, $3) RETURNING *';
        const { rows } = await query(sql, [name, slug, description]);
        return rows[0];
    }

    static async update(id, { name, slug, description }) {
        const sql = `
            UPDATE tags 
            SET name = $1, slug = $2, description = $3
            WHERE tag_id = $4 
            RETURNING *;
        `;
        const { rows } = await query(sql, [name, slug, description, id]);
        return rows[0];
    }

    static async delete(id) {
        // Thanks to ON DELETE CASCADE in your schema, this also removes links in post_tags!
        await query('DELETE FROM tags WHERE tag_id = $1', [id]);
        return true;
    }
}

export default Tag;