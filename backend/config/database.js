/**
 * Database Configuration and Connection
 * Handles PostgreSQL connection and database initialization
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');

// Create PostgreSQL connection pool
const pool = new Pool({
  // Use DATABASE_URL if available (Railway, Heroku, etc.)
  connectionString: process.env.DATABASE_URL,
  // Fallback to individual environment variables
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

/**
 * Test database connection
 */
async function connectDB() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    logger.info('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error.message);
    throw error;
  }
}

/**
 * Initialize database tables
 */
async function initializeDatabase() {
  const createUrlsTable = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      long_url TEXT NOT NULL,
      short_code VARCHAR(10) UNIQUE NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
    CREATE INDEX IF NOT EXISTS idx_urls_expires_at ON urls(expires_at);
    CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at);
  `;

  try {
    await pool.query(createUrlsTable);
    await pool.query(createIndexes);
    logger.info('Database tables initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error.message);
    throw error;
  }
}

/**
 * Execute a query with error handling
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Query error:', { text, error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool (for transactions)
 */
async function getClient() {
  return await pool.connect();
}

module.exports = {
  pool,
  connectDB,
  initializeDatabase,
  query,
  getClient
};
