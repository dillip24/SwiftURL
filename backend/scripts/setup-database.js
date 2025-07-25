/**
 * Database Setup Script
 * Creates the database and required tables for SwiftURL
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a connection to PostgreSQL server (without specific database)
const serverPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres' // Connect to default postgres database
});

// Create a connection to the SwiftURL database
const dbPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'swifturl'
});

/**
 * Create the SwiftURL database if it doesn't exist
 */
async function createDatabase() {
  const dbName = process.env.DB_NAME || 'swifturl';
  
  try {
    console.log(`Checking if database '${dbName}' exists...`);
    
    // Check if database exists
    const result = await serverPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (result.rows.length === 0) {
      console.log(`Creating database '${dbName}'...`);
      await serverPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`✅ Database '${dbName}' already exists`);
    }
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
}

/**
 * Create the urls table and indexes
 */
async function createTables() {
  try {
    console.log('Creating tables...');
    
    // Create urls table
    const createUrlsTable = `
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        long_url TEXT NOT NULL,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE
      );
    `;
    
    await dbPool.query(createUrlsTable);
    console.log('✅ URLs table created successfully');
    
    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);',
      'CREATE INDEX IF NOT EXISTS idx_urls_expires_at ON urls(expires_at);',
      'CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at);'
    ];
    
    for (const indexQuery of indexes) {
      await dbPool.query(indexQuery);
    }
    
    console.log('✅ Database indexes created successfully');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
}

/**
 * Insert sample data for testing
 */
async function insertSampleData() {
  try {
    console.log('Checking for existing data...');
    
    const result = await dbPool.query('SELECT COUNT(*) FROM urls');
    const count = parseInt(result.rows[0].count);
    
    if (count > 0) {
      console.log(`✅ Database already has ${count} URLs, skipping sample data`);
      return;
    }
    
    console.log('Inserting sample data...');
    
    const sampleUrls = [
      {
        longUrl: 'https://www.google.com',
        shortCode: 'google',
        expiresAt: null
      },
      {
        longUrl: 'https://www.github.com',
        shortCode: 'github',
        expiresAt: null
      },
      {
        longUrl: 'https://www.stackoverflow.com',
        shortCode: 'stack',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      }
    ];
    
    for (const url of sampleUrls) {
      await dbPool.query(
        'INSERT INTO urls (long_url, short_code, expires_at) VALUES ($1, $2, $3)',
        [url.longUrl, url.shortCode, url.expiresAt]
      );
    }
    
    console.log(`✅ Inserted ${sampleUrls.length} sample URLs`);
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error.message);
    // Don't throw error - sample data is optional
  }
}

/**
 * Test database connection
 */
async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    const result = await dbPool.query('SELECT NOW() as current_time');
    console.log(`✅ Database connection successful. Current time: ${result.rows[0].current_time}`);
    
    // Test table access
    const tableTest = await dbPool.query('SELECT COUNT(*) as url_count FROM urls');
    console.log(`✅ URLs table accessible. Current URL count: ${tableTest.rows[0].url_count}`);
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    throw error;
  }
}

/**
 * Main setup function
 */
async function setupDatabase() {
  console.log('🚀 Starting SwiftURL Database Setup...\n');
  
  try {
    // Step 1: Create database
    await createDatabase();
    
    // Step 2: Create tables and indexes
    await createTables();
    
    // Step 3: Insert sample data
    await insertSampleData();
    
    // Step 4: Test connection
    await testConnection();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure Redis is running on your system');
    console.log('2. Update your .env file with the correct database credentials');
    console.log('3. Run "npm run dev" to start the development server');
    
  } catch (error) {
    console.error('\n💥 Database setup failed:', error.message);
    process.exit(1);
  } finally {
    // Close connections
    await serverPool.end();
    await dbPool.end();
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = {
  setupDatabase,
  createDatabase,
  createTables,
  insertSampleData,
  testConnection
};
