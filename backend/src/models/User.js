import { query } from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
  // Create a new user (Registration)
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

  // Find user by email (Login)
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const { rows } = await query(sql, [email]);
    return rows[0];
  }

  // Find user by ID (Profile/Auth Middleware)
  static async findById(id) {
    const sql = 'SELECT user_id, username, email, role, first_name, last_name, bio, avatar FROM users WHERE user_id = $1';
    const { rows } = await query(sql, [id]);
    return rows[0];
  }

  // Update last login timestamp
  static async updateLastLogin(id) {
    const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1';
    await query(sql, [id]);
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  static async findAll() {

    const sql = `
    SELECT user_id, username, email, role, first_name, last_name, created_at, last_login 
    FROM users 
    ORDER BY created_at DESC;
  `;
    const { rows } = await query(sql);
    return rows;
  }

  static async updateLastLogin(id) {
    const sql = `UPDATE users SET last_login = NOW() WHERE user_id = $1`;
    await query(sql, [id]);
  }

}


export default User;