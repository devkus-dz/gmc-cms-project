import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ username, email, password, firstName, lastName, role = 'subscriber' }) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const sql = `
            INSERT INTO users (username, email, password_hash, first_name, last_name, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id, username, email, role, created_at;
        `;

    const { rows } = await query(sql, [username, email, passwordHash, firstName, lastName, role]);
    return rows[0];
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const { rows } = await query(sql, [email]);
    return rows[0];
  }

  static async findById(id) {
    const sql = 'SELECT user_id, username, email, role, first_name, last_name, bio, avatar FROM users WHERE user_id = $1';
    const { rows } = await query(sql, [id]);
    return rows[0];
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  static async updateLastLogin(id) {
    const sql = `UPDATE users SET last_login = NOW() WHERE user_id = $1`;
    await query(sql, [id]);
  }

  /**
     * @function update
     * @description Updates a user's profile information (first name, last name, bio, avatar).
     * @param {string|number} id - The user ID.
     * @param {Object} data - The updated profile data.
     * @returns {Promise<Object>} The updated user record.
     */
  static async update(id, data) {
    const { first_name, last_name, bio, avatar_url } = data;
    const sql = `
        UPDATE users 
        SET first_name = $1, 
            last_name = $2, 
            bio = $3, 
            avatar = $4, 
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $5 
        RETURNING user_id, username, email, first_name, last_name, bio, avatar, role;
    `;
    const { rows } = await query(sql, [first_name, last_name, bio, avatar_url, id]);
    return rows[0];
  }

  /**
   * @function findAll
   * @description Fetches a paginated list of users with an optional search filter.
   * @param {Object} params - Pagination and search parameters.
   * @returns {Promise<Object>} Object containing user rows and total count.
   */
  static async findAll({ limit = 10, offset = 0, search = '' }) {
    let sql = `
            SELECT user_id, username, email, role, first_name, last_name, is_active, avatar, created_at, last_login 
            FROM users 
            WHERE 1=1
        `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      sql += ` AND (username ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const { rows } = await query(sql, params);

    let countSql = `SELECT COUNT(*) FROM users WHERE 1=1`;
    const countParams = [];
    if (search) {
      countSql += ` AND (username ILIKE $1 OR email ILIKE $1)`;
      countParams.push(`%${search}%`);
    }

    const { rows: countRows } = await query(countSql, countParams);

    return {
      users: rows,
      total: parseInt(countRows[0].count)
    };
  }

  static async adminUpdate(id, data) {
    const { username, email, first_name, last_name, role, is_active, password } = data;
    let sql;
    let params;

    // If the admin typed a new password, we need to hash it and update it
    if (password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      sql = `
            UPDATE users 
            SET username=$1, email=$2, first_name=$3, last_name=$4, role=$5, is_active=$6, password_hash=$7, updated_at=NOW() 
            WHERE user_id=$8 RETURNING user_id, username, email, role;
        `;
      params = [username, email, first_name, last_name, role, is_active, passwordHash, id];
    } else {
      // Otherwise, update everything EXCEPT the password
      sql = `
            UPDATE users 
            SET username=$1, email=$2, first_name=$3, last_name=$4, role=$5, is_active=$6, updated_at=NOW() 
            WHERE user_id=$7 RETURNING user_id, username, email, role;
        `;
      params = [username, email, first_name, last_name, role, is_active, id];
    }

    const { rows } = await query(sql, params);
    return rows[0];
  }

  // Delete method
  static async delete(id) {
    const { rows } = await query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

export default User;