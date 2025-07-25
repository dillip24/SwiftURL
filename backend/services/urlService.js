/**
 * URL Service
 * Business logic for URL shortening, retrieval, and analytics
 */

const { nanoid } = require('nanoid');
const { query } = require('../config/database');
const { 
  getCachedUrl, 
  setCachedUrl, 
  incrementClickCount, 
  clearCache 
} = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Generate a unique short code
 */
function generateShortCode(length = 6) {
  // Use nanoid with URL-safe alphabet
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return nanoid(length, alphabet);
}

/**
 * Check if a short code already exists
 */
async function isShortCodeTaken(shortCode) {
  try {
    const result = await query(
      'SELECT id FROM urls WHERE short_code = $1',
      [shortCode]
    );
    return result.rows.length > 0;
  } catch (error) {
    logger.error('Error checking short code availability:', error);
    throw error;
  }
}

/**
 * Create a new shortened URL
 */
async function createShortUrl(longUrl, customCode = null, expiresAt = null) {
  try {
    let shortCode = customCode;

    // If custom code is provided, check if it's available
    if (customCode) {
      const taken = await isShortCodeTaken(customCode);
      if (taken) {
        const error = new Error('CUSTOM_CODE_TAKEN');
        throw error;
      }
    } else {
      // Generate a unique short code
      do {
        shortCode = generateShortCode();
      } while (await isShortCodeTaken(shortCode));
    }

    // Insert into database
    const insertQuery = `
      INSERT INTO urls (long_url, short_code, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, long_url, short_code, clicks, created_at, expires_at
    `;
    
    const result = await query(insertQuery, [longUrl, shortCode, expiresAt]);
    const newUrl = result.rows[0];

    // Cache the new URL
    const cacheData = {
      id: newUrl.id,
      longUrl: newUrl.long_url,
      shortCode: newUrl.short_code,
      clicks: newUrl.clicks,
      expiresAt: newUrl.expires_at
    };
    
    await setCachedUrl(shortCode, cacheData, process.env.CACHE_TTL || 3600);

    logger.info(`Created short URL: ${shortCode} -> ${longUrl}`);

    return {
      id: newUrl.id,
      longUrl: newUrl.long_url,
      shortCode: newUrl.short_code,
      shortUrl: `${process.env.BASE_URL}/${newUrl.short_code}`,
      clicks: newUrl.clicks,
      createdAt: newUrl.created_at,
      expiresAt: newUrl.expires_at
    };

  } catch (error) {
    logger.error('Error creating short URL:', error);
    throw error;
  }
}

/**
 * Get URL by short code
 */
async function getUrlByShortCode(shortCode) {
  try {
    // Try to get from cache first
    let urlData = await getCachedUrl(shortCode);

    if (!urlData) {
      // If not in cache, get from database
      const result = await query(
        'SELECT * FROM urls WHERE short_code = $1',
        [shortCode]
      );

      if (result.rows.length === 0) {
        const error = new Error('URL_NOT_FOUND');
        throw error;
      }

      const dbUrl = result.rows[0];
      urlData = {
        id: dbUrl.id,
        longUrl: dbUrl.long_url,
        shortCode: dbUrl.short_code,
        clicks: dbUrl.clicks,
        createdAt: dbUrl.created_at,
        expiresAt: dbUrl.expires_at
      };

      // Cache the URL data
      await setCachedUrl(shortCode, urlData, process.env.CACHE_TTL || 3600);
    }

    // Check if URL has expired
    if (urlData.expiresAt && new Date(urlData.expiresAt) < new Date()) {
      // Delete the expired URL from database
      await query(
        'DELETE FROM urls WHERE short_code = $1',
        [shortCode]
      );
      
      // Clear from cache
      await clearCache(shortCode);
      
      const error = new Error('URL_EXPIRED');
      throw error;
    }

    return urlData;

  } catch (error) {
    logger.error(`Error getting URL by short code ${shortCode}:`, error);
    throw error;
  }
}

/**
 * Increment click count for a URL
 */
async function incrementUrlClicks(shortCode) {
  try {
    // Increment in cache (fast)
    await incrementClickCount(shortCode);

    // Update in database (async, don't wait)
    setImmediate(async () => {
      try {
        await query(
          'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
          [shortCode]
        );
      } catch (error) {
        logger.error(`Error updating click count in database for ${shortCode}:`, error);
      }
    });

    logger.debug(`Incremented click count for: ${shortCode}`);

  } catch (error) {
    logger.error(`Error incrementing clicks for ${shortCode}:`, error);
    // Don't throw error - clicking should still work even if analytics fail
  }
}

/**
 * Get URL statistics
 */
async function getUrlStats(shortCode) {
  try {
    const result = await query(
      'SELECT short_code, long_url, clicks, created_at, expires_at FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      const error = new Error('URL_NOT_FOUND');
      throw error;
    }

    const urlData = result.rows[0];

    return {
      shortCode: urlData.short_code,
      longUrl: urlData.long_url,
      clicks: urlData.clicks,
      createdAt: urlData.created_at,
      expiresAt: urlData.expires_at,
      isExpired: urlData.expires_at && new Date(urlData.expires_at) < new Date()
    };

  } catch (error) {
    logger.error(`Error getting stats for ${shortCode}:`, error);
    throw error;
  }
}

/**
 * Get all URLs (for admin purposes - can be extended)
 */
async function getAllUrls(limit = 100, offset = 0) {
  try {
    const result = await query(
      `SELECT id, long_url, short_code, clicks, created_at, expires_at 
       FROM urls 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows.map(row => ({
      id: row.id,
      longUrl: row.long_url,
      shortCode: row.short_code,
      shortUrl: `${process.env.BASE_URL}/${row.short_code}`,
      clicks: row.clicks,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      isExpired: row.expires_at && new Date(row.expires_at) < new Date()
    }));

  } catch (error) {
    logger.error('Error getting all URLs:', error);
    throw error;
  }
}

module.exports = {
  createShortUrl,
  getUrlByShortCode,
  incrementUrlClicks,
  getUrlStats,
  getAllUrls,
  generateShortCode,
  isShortCodeTaken
};
