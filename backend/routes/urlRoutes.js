/**
 * URL Routes
 * API endpoints for URL shortening and analytics
 */

const express = require('express');
const router = express.Router();

const urlService = require('../services/urlService');
const { validate, createUrlSchema, shortCodeSchema } = require('../validators/urlValidator');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * POST /api/shorten
 * Create a new shortened URL
 */
router.post('/shorten', 
  validate(createUrlSchema), 
  asyncHandler(async (req, res) => {
    const { longUrl, customCode, expiresAt } = req.body;

    logger.info('Creating short URL:', { longUrl, customCode, expiresAt });

    const result = await urlService.createShortUrl(longUrl, customCode, expiresAt);

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: result
    });
  })
);

/**
 * GET /api/stats/:shortCode
 * Get analytics for a specific short URL
 */
router.get('/stats/:shortCode', 
  validate(shortCodeSchema, 'params'),
  asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    logger.info('Getting stats for short code:', shortCode);

    const stats = await urlService.getUrlStats(shortCode);

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats
    });
  })
);

/**
 * GET /api/urls
 * Get all URLs (paginated) - can be used for admin dashboard
 */
router.get('/urls', 
  asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 per request
    const offset = parseInt(req.query.offset) || 0;

    logger.info('Getting all URLs:', { limit, offset });

    const urls = await urlService.getAllUrls(limit, offset);

    res.json({
      success: true,
      message: 'URLs retrieved successfully',
      data: urls,
      pagination: {
        limit,
        offset,
        count: urls.length
      }
    });
  })
);

/**
 * GET /api/health/detailed
 * Detailed health check including database and cache status
 */
router.get('/health/detailed', 
  asyncHandler(async (req, res) => {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    };

    // Test database connection
    try {
      await urlService.getAllUrls(1, 0);
      healthData.database = 'connected';
    } catch (error) {
      healthData.database = 'disconnected';
      healthData.status = 'DEGRADED';
    }

    // Test Redis connection
    try {
      const { getRedisClient } = require('../config/redis');
      const redis = getRedisClient();
      if (redis) {
        await redis.ping();
        healthData.cache = 'connected';
      } else {
        healthData.cache = 'disconnected';
      }
    } catch (error) {
      healthData.cache = 'disconnected';
      healthData.status = 'DEGRADED';
    }

    const statusCode = healthData.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(healthData);
  })
);

module.exports = router;
