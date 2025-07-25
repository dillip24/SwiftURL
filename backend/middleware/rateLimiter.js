/**
 * Rate Limiting Middleware
 * Implements IP-based rate limiting using Redis
 */

const { checkRateLimit } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Rate limiting middleware
 * Limits requests per IP address based on environment configuration
 */
async function rateLimiter(req, res, next) {
  try {
    // Get client IP address
    const clientIP = req.ip || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress ||
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                    req.headers['x-forwarded-for']?.split(',')[0] ||
                    'unknown';

    // Get rate limit configuration from environment
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000; // 1 minute
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10; // 10 requests

    // Check rate limit
    const rateLimit = await checkRateLimit(clientIP, windowMs, maxRequests);

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': rateLimit.remaining,
      'X-RateLimit-Window': windowMs
    });

    if (!rateLimit.allowed) {
      logger.warn(`Rate limit exceeded for IP: ${clientIP}`);
      
      // Add reset time header
      if (rateLimit.resetTime) {
        res.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());
      }

      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        retryAfter: rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000) : Math.ceil(windowMs / 1000)
      });
    }

    logger.debug(`Rate limit check passed for IP: ${clientIP}, remaining: ${rateLimit.remaining}`);
    next();

  } catch (error) {
    logger.error('Rate limiter error:', error.message);
    // Continue without rate limiting if Redis fails
    next();
  }
}

module.exports = rateLimiter;
