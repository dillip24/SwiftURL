/**
 * Redirect Routes
 * Handles short URL redirection and click tracking
 */

const express = require('express');
const router = express.Router();

const urlService = require('../services/urlService');
const { validate, shortCodeSchema } = require('../validators/urlValidator');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * GET /:shortCode
 * Redirect to the original URL and track clicks
 */
router.get('/:shortCode', 
  validate(shortCodeSchema, 'params'),
  asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    logger.info('Redirecting short code:', shortCode, {
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      referer: req.get('Referer')
    });

    try {
      // Get the URL data
      const urlData = await urlService.getUrlByShortCode(shortCode);

      // Increment click count (async, don't wait for it)
      urlService.incrementUrlClicks(shortCode).catch(error => {
        logger.error('Failed to increment click count:', error);
      });

      // Perform the redirect
      logger.info(`Redirecting ${shortCode} to ${urlData.longUrl}`);
      
      // Use 302 (temporary redirect) to ensure browsers don't cache the redirect
      res.redirect(302, urlData.longUrl);

    } catch (error) {
      // Handle specific error cases with user-friendly pages
      if (error.message === 'URL_NOT_FOUND') {
        return res.status(404).send(generateErrorPage(
          'URL Not Found',
          'The short URL you requested does not exist.',
          'This link may have been mistyped or the URL may have been removed.'
        ));
      }

      if (error.message === 'URL_EXPIRED') {
        return res.status(410).send(generateErrorPage(
          'URL Expired',
          'This short URL has expired and is no longer valid.',
          'The link you followed has reached its expiration date.'
        ));
      }

      // For other errors, show a generic error page
      logger.error('Redirect error:', error);
      return res.status(500).send(generateErrorPage(
        'Service Error',
        'We\'re experiencing technical difficulties.',
        'Please try again later or contact support if the problem persists.'
      ));
    }
  })
);

/**
 * Generate a user-friendly error page
 */
function generateErrorPage(title, message, description) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - SwiftURL</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          text-align: center;
          max-width: 500px;
          margin: 1rem;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          color: #e74c3c;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .description {
          font-size: 0.9rem;
          color: #888;
        }
        .home-link {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.3s;
        }
        .home-link:hover {
          background: #5a67d8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">⚠️</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <p class="description">${description}</p>
        <a href="${process.env.BASE_URL || 'http://localhost:3000'}" class="home-link">
          Go to SwiftURL Home
        </a>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;
