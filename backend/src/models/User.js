import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
  // Create a new user (Registration & Admin Creation)
  static async create({ username, email, password, firstName, lastName, role = 'subscriber', is_active = true }) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING user_id, username, email, role, is_active, created_at;
    `;

    const { rows } = await query(sql, [username, email, passwordHash, firstName, lastName, role, is_active]);
    return rows[0];
  }

  // Find user by email (Login)
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const { rows } = await query(sql, [email]);
    return rows[0];
  }

  // Find user by ID (Profile/Auth Middleware)
  static async findById(id) {
    const sql = 'SELECT user_id, username, email, role, first_name, last_name, bio, avatar, is_active FROM users WHERE user_id = $1';
    const { rows } = await query(sql, [id]);
    return rows[0];
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  // Admin: Get all users (Added is_active and avatar for the table)
  static async findAll() {
    const sql = `
      SELECT user_id, username, email, role, first_name, last_name, avatar, is_active, created_at, last_login 
      FROM users 
      ORDER BY created_at DESC;
    `;
    const { rows } = await query(sql);
    return rows;
  }

  // User: Update own profile
  static async updateProfile(id, { first_name, last_name, bio, avatar_url }) {
    const sql = `
        UPDATE users 
        SET first_name = $1, last_name = $2, bio = $3, avatar = $4, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $5 
        RETURNING user_id, username, email, first_name, last_name, bio, avatar;
    `;
    const { rows } = await query(sql, [first_name, last_name, bio, avatar_url, id]);
    return rows[0];
  }

  // Admin: Update user role, status, or password
  static async updateAdmin(id, { username, email, first_name, last_name, role, is_active, password }) {
    let sql, params;

    if (password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      sql = `
            UPDATE users 
            SET username = $1, email = $2, first_name = $3, last_name = $4, role = $5, is_active = $6, password_hash = $7, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $8 
            RETURNING user_id, username, email, role, is_active;
        `;
      params = [username, email, first_name, last_name, role, is_active, passwordHash, id];
    } else {
      sql = `
            UPDATE users 
            SET username = $1, email = $2, first_name = $3, last_name = $4, role = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $7 
            RETURNING user_id, username, email, role, is_active;
        `;
      params = [username, email, first_name, last_name, role, is_active, id];
    }

    const { rows } = await query(sql, params);
    return rows[0];
  }

  // Admin: Delete user
  static async delete(id) {
    await query('DELETE FROM users WHERE user_id = $1', [id]);
    return true;
  }

  // Update last login timestamp
  static async updateLastLogin(id) {
    const sql = `UPDATE users SET last_login = NOW() WHERE user_id = $1`;
    await query(sql, [id]);
  }
}

export default User;