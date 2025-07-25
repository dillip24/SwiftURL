/**
 * Cleanup Service
 * Handles cleanup of expired URLs and maintenance tasks
 */

const { query } = require('../config/database');
const { clearCache } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Clean up expired URLs from the database
 * Deletes expired URLs and clears their cache
 */
async function cleanupExpiredUrls() {
  try {
    logger.info('Starting cleanup of expired URLs...');

    // Find all expired URLs
    const expiredUrls = await query(`
      SELECT short_code, long_url 
      FROM urls 
      WHERE expires_at < NOW()
    `);

    if (expiredUrls.rows.length === 0) {
      logger.info('No expired URLs found');
      return { cleaned: 0 };
    }

    // Delete expired URLs
    const deleteResult = await query(`
      DELETE FROM urls 
      WHERE expires_at < NOW()
    `);

    const cleanedCount = deleteResult.rowCount;

    // Clear cache for expired URLs
    for (const row of expiredUrls.rows) {
      await clearCache(row.short_code);
      logger.debug(`Cleaned up expired URL: ${row.short_code} -> ${row.long_url}`);
    }

    logger.info(`Cleanup completed: ${cleanedCount} expired URLs deleted`);

    return { 
      cleaned: cleanedCount,
      urls: expiredUrls.rows 
    };

  } catch (error) {
    logger.error('Error during cleanup process:', error);
    throw error;
  }
}

/**
 * Get cleanup statistics
 */
async function getCleanupStats() {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_urls,
        COUNT(*) FILTER (WHERE is_active = true) as active_urls,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_urls,
        COUNT(*) FILTER (WHERE expires_at IS NOT NULL) as urls_with_expiry,
        COUNT(*) FILTER (WHERE expires_at < NOW() AND is_active = true) as expired_active_urls,
        COUNT(*) FILTER (WHERE expires_at < NOW() AND is_active = false) as expired_inactive_urls
      FROM urls
    `);

    return stats.rows[0];

  } catch (error) {
    logger.error('Error getting cleanup stats:', error);
    throw error;
  }
}

/**
 * Permanently delete URLs that have been inactive for a specified period
 * This is a more aggressive cleanup that can be run less frequently
 */
async function purgeOldInactiveUrls(daysOld = 30) {
  try {
    logger.info(`Starting purge of URLs inactive for more than ${daysOld} days...`);

    const purgeDate = new Date();
    purgeDate.setDate(purgeDate.getDate() - daysOld);

    // Find URLs to be purged
    const urlsToPurge = await query(`
      SELECT short_code, long_url, created_at
      FROM urls 
      WHERE is_active = false 
      AND created_at < $1
    `, [purgeDate]);

    if (urlsToPurge.rows.length === 0) {
      logger.info('No old inactive URLs found for purging');
      return { purged: 0 };
    }

    // Delete the URLs
    const deleteResult = await query(`
      DELETE FROM urls 
      WHERE is_active = false 
      AND created_at < $1
    `, [purgeDate]);

    const purgedCount = deleteResult.rowCount;

    // Clear cache for purged URLs (just in case)
    for (const row of urlsToPurge.rows) {
      await clearCache(row.short_code);
    }

    logger.info(`Purge completed: ${purgedCount} old inactive URLs permanently deleted`);

    return { 
      purged: purgedCount,
      urls: urlsToPurge.rows 
    };

  } catch (error) {
    logger.error('Error during purge process:', error);
    throw error;
  }
}

/**
 * Database maintenance tasks
 */
async function performMaintenance() {
  try {
    logger.info('Starting database maintenance...');

    // Analyze table statistics
    await query('ANALYZE urls');

    // Update table statistics
    const tableStats = await query(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables 
      WHERE tablename = 'urls'
    `);

    logger.info('Database maintenance completed', tableStats.rows[0]);

    return tableStats.rows[0];

  } catch (error) {
    logger.error('Error during database maintenance:', error);
    throw error;
  }
}

module.exports = {
  cleanupExpiredUrls,
  getCleanupStats,
  purgeOldInactiveUrls,
  performMaintenance
};
