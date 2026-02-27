import { query } from '../config/database.js';

class Category {
    static async findAll() {
        const { rows } = await query('SELECT * FROM categories ORDER BY display_order ASC');
        return rows;
    }

    static async findById(id) {
        const { rows } = await query('SELECT * FROM categories WHERE category_id = $1', [id]);
        return rows[0];
    }

    static async create({ name, slug, description, parent_id }) {
        const sql = `
      INSERT INTO categories (name, slug, description, parent_id)
      VALUES ($1, $2, $3, $4) RETURNING *`;
        const { rows } = await query(sql, [name, slug, description, parent_id]);
        return rows[0];
    }

    static async update(id, { name, slug, description, parent_id, is_active }) {
        const sql = `
      UPDATE categories 
      SET name = $1, slug = $2, description = $3, parent_id = $4, is_active = $5, updated_at = NOW()
      WHERE category_id = $6 RETURNING *`;
        const { rows } = await query(sql, [name, slug, description, parent_id, is_active, id]);
        return rows[0];
    }

    static async delete(id) {
        const sql = 'DELETE FROM categories WHERE category_id = $1 RETURNING *';
        const { rows } = await query(sql, [id]);
        return rows[0];
    }
}

export default Category;