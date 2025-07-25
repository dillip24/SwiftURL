#!/usr/bin/env node

/**
 * Railway Deployment Helper
 * Sets up the database schema after Railway deployment
 */

const { Pool } = require('pg');

async function setupRailwayDatabase() {
  console.log('🚀 Setting up Railway database...');
  
  // Railway provides DATABASE_URL automatically
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Create tables
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

    await pool.query(createUrlsTable);
    await pool.query(createIndexes);

    // Insert sample data
    const sampleUrls = [
      ['https://www.google.com', 'google'],
      ['https://www.github.com', 'github'],
      ['https://www.stackoverflow.com', 'stack']
    ];

    for (const [longUrl, shortCode] of sampleUrls) {
      await pool.query(
        'INSERT INTO urls (long_url, short_code) VALUES ($1, $2) ON CONFLICT (short_code) DO NOTHING',
        [longUrl, shortCode]
      );
    }

    console.log('✅ Railway database setup completed!');
    console.log('📊 Sample URLs created: google, github, stack');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupRailwayDatabase();
}

module.exports = { setupRailwayDatabase };
