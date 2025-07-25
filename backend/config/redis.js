/**
 * Redis Configuration and Connection
 * Handles Redis connection for caching and rate limiting
 */

const redis = require('redis');
const logger = require('../utils/logger');

let redisClient;

/**
 * Connect to Redis server
 */
async function connectRedis() {
  try {
    // Use REDIS_URL if available (Railway, Heroku, etc.)
    const redisUrl = process.env.REDIS_URL;
    
    if (redisUrl) {
      redisClient = redis.createClient({
        url: redisUrl,
      });
    } else {
      // Fallback to individual environment variables
      redisClient = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });
    }

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('end', () => {
      logger.info('Redis client disconnected');
    });

    await redisClient.connect();
    
    // Test the connection
    await redisClient.ping();
    logger.info('Redis connection established successfully');
    
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error.message);
    throw error;
  }
}

/**
 * Get cached URL mapping
 */
async function getCachedUrl(shortCode) {
  try {
    if (!redisClient) {
      logger.warn('Redis client not available, skipping cache');
      return null;
    }
    
    const cachedUrl = await redisClient.get(`url:${shortCode}`);
    if (cachedUrl) {
      logger.debug(`Cache hit for short code: ${shortCode}`);
      return JSON.parse(cachedUrl);
    }
    
    logger.debug(`Cache miss for short code: ${shortCode}`);
    return null;
  } catch (error) {
    logger.error('Redis get error:', error.message);
    return null; // Fall back to database if Redis fails
  }
}

/**
 * Cache URL mapping
 */
async function setCachedUrl(shortCode, urlData, ttl = 3600) {
  try {
    if (!redisClient) {
      logger.warn('Redis client not available, skipping cache');
      return false;
    }
    
    await redisClient.setEx(
      `url:${shortCode}`, 
      ttl, 
      JSON.stringify(urlData)
    );
    
    logger.debug(`Cached URL for short code: ${shortCode}`);
    return true;
  } catch (error) {
    logger.error('Redis set error:', error.message);
    return false;
  }
}

/**
 * Increment click counter in cache
 */
async function incrementClickCount(shortCode) {
  try {
    if (!redisClient) {
      logger.warn('Redis client not available, skipping cache increment');
      return 0;
    }
    
    const count = await redisClient.incr(`clicks:${shortCode}`);
    
    // Set expiry for click counter (24 hours)
    await redisClient.expire(`clicks:${shortCode}`, 86400);
    
    return count;
  } catch (error) {
    logger.error('Redis increment error:', error.message);
    return 0;
  }
}

/**
 * Get click count from cache
 */
async function getCachedClickCount(shortCode) {
  try {
    if (!redisClient) {
      return 0;
    }
    
    const count = await redisClient.get(`clicks:${shortCode}`);
    return count ? parseInt(count) : 0;
  } catch (error) {
    logger.error('Redis get click count error:', error.message);
    return 0;
  }
}

/**
 * Clear cache for a specific short code
 */
async function clearCache(shortCode) {
  try {
    if (!redisClient) {
      return false;
    }
    
    await redisClient.del(`url:${shortCode}`);
    await redisClient.del(`clicks:${shortCode}`);
    
    logger.debug(`Cache cleared for short code: ${shortCode}`);
    return true;
  } catch (error) {
    logger.error('Redis delete error:', error.message);
    return false;
  }
}

/**
 * Check rate limit for IP address
 */
async function checkRateLimit(ip, windowMs = 60000, maxRequests = 10) {
  try {
    if (!redisClient) {
      logger.warn('Redis client not available, skipping rate limit');
      return { allowed: true, remaining: maxRequests };
    }
    
    const key = `rate_limit:${ip}`;
    const current = await redisClient.get(key);
    
    if (!current) {
      // First request from this IP
      await redisClient.setEx(key, Math.ceil(windowMs / 1000), '1');
      return { allowed: true, remaining: maxRequests - 1 };
    }
    
    const count = parseInt(current);
    if (count >= maxRequests) {
      const ttl = await redisClient.ttl(key);
      return { 
        allowed: false, 
        remaining: 0, 
        resetTime: Date.now() + (ttl * 1000) 
      };
    }
    
    await redisClient.incr(key);
    return { allowed: true, remaining: maxRequests - count - 1 };
    
  } catch (error) {
    logger.error('Rate limit check error:', error.message);
    // Allow request if Redis fails
    return { allowed: true, remaining: maxRequests };
  }
}

/**
 * Get Redis client instance
 */
function getRedisClient() {
  return redisClient;
}

module.exports = {
  connectRedis,
  getCachedUrl,
  setCachedUrl,
  incrementClickCount,
  getCachedClickCount,
  clearCache,
  checkRateLimit,
  getRedisClient
};
