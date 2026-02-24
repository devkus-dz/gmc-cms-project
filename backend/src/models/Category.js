import { query } from '../config/database.js';

/**
 * @class Category
 * @description Model for interacting with the categories table in PostgreSQL.
 */
class Category {
    static async findAll() {

        const sql = `
            SELECT c1.*, c2.name as parent_name 
            FROM categories c1
            LEFT JOIN categories c2 ON c1.parent_id = c2.category_id
            ORDER BY c1.display_order ASC, c1.name ASC;
        `;
        const { rows } = await query(sql);
        return rows;
    }

    static async findById(id) {
        const { rows } = await query('SELECT * FROM categories WHERE category_id = $1', [id]);
        return rows[0];
    }

    static async create({ name, slug, description, parent_id, display_order = 0, is_active = true }) {
        const sql = `
            INSERT INTO categories (name, slug, description, parent_id, display_order, is_active) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *;
        `;
        const params = [name, slug, description, parent_id || null, display_order, is_active];
        const { rows } = await query(sql, params);
        return rows[0];
    }

    static async update(id, { name, slug, description, parent_id, display_order, is_active }) {
        // Prevent a category from being its own parent
        if (parseInt(id) === parseInt(parent_id)) {
            throw new Error('A category cannot be its own parent.');
        }

        const sql = `
            UPDATE categories 
            SET name = $1, slug = $2, description = $3, parent_id = $4, display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
            WHERE category_id = $7 
            RETURNING *;
        `;
        const params = [name, slug, description, parent_id || null, display_order, is_active, id];
        const { rows } = await query(sql, params);
        return rows[0];
    }

    static async delete(id) {
        await query('DELETE FROM categories WHERE category_id = $1', [id]);
        return true;
    }
}

export default Category;