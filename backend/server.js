/**
 * SwiftURL Backend Server
 * Main entry point for the URL shortening service
 * 
 * Features:
 * - Express.js server with CORS and security middleware
 * - PostgreSQL database integration
 * - Redis caching and rate limiting
 * - URL shortening with custom codes
 * - Click analytics and URL expiration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

// Import custom modules
const { connectDB, initializeDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');
const rateLimiter = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const urlRoutes = require('./routes/urlRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

// Import services
const cleanupService = require('./services/cleanupService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Rate limiting middleware
app.use('/api', rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api', urlRoutes);

// Redirect routes (must be after API routes)
app.use('/', redirectRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize services and start server
async function startServer() {
  try {
    // Connect to PostgreSQL
    logger.info('Connecting to PostgreSQL...');
    await connectDB();
    await initializeDatabase();
    logger.info('PostgreSQL connected successfully');

    // Connect to Redis
    logger.info('Connecting to Redis...');
    await connectRedis();
    logger.info('Redis connected successfully');

    // Schedule cleanup job for expired URLs (runs every hour)
    cron.schedule('0 * * * *', async () => {
      logger.info('Running scheduled cleanup of expired URLs...');
      await cleanupService.cleanupExpiredUrls();
    });

    // Start the server
    app.listen(PORT, () => {
      logger.info(`🚀 SwiftURL Backend Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
      logger.info(`Health check available at: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();
