import { query } from '../config/database.js';

class Media {
    static async create(data) {
        const { filename, original_name, file_path, file_type, file_size, mime_type, uploaded_by } = data;
        const sql = `
      INSERT INTO media (filename, original_name, file_path, file_type, file_size, mime_type, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const { rows } = await query(sql, [filename, original_name, file_path, file_type, file_size, mime_type, uploaded_by]);
        return rows[0];
    }

    static async findAll(limit = 20, offset = 0) {
        const { rows } = await query('SELECT * FROM media ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return rows;
    }

    static async delete(id) {
        const { rows } = await query('DELETE FROM media WHERE media_id = $1 RETURNING file_path', [id]);
        return rows[0];
    }
}

export default Media;