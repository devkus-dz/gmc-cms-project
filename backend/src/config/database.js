import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Recommended settings for the Supabase Transaction Pooler
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // ⚡ REQUIRED for cloud database security
  ssl: {
    rejectUnauthorized: false
  }
});

// --- Event Handlers ---
pool.on('connect', () => {
  console.log('✅ Connected to Supabase via IPv4 Transaction Pooler');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
});

/**
 * Connection Test
 */
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected at:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
};

/**
 * Simple Query Helper
 */
export const query = (text, params) => pool.query(text, params);

export default pool;