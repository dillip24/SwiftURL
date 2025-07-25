/**
 * Error Handling Middleware
 * Centralized error handling for the Express application
 */

const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Handles all errors thrown in the application
 */
function errorHandler(err, req, res, next) {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Default error response
  let error = {
    message: 'Internal Server Error',
    status: 500
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Joi validation errors
    error = {
      message: 'Validation Error',
      details: err.details?.map(detail => detail.message) || [err.message],
      status: 400
    };
  } else if (err.code === '23505') {
    // PostgreSQL unique constraint violation
    error = {
      message: 'Resource already exists',
      details: ['The provided short code is already in use'],
      status: 409
    };
  } else if (err.code === '23502') {
    // PostgreSQL not null constraint violation
    error = {
      message: 'Missing required field',
      details: ['Required field cannot be null'],
      status: 400
    };
  } else if (err.code === 'ECONNREFUSED') {
    // Database connection error
    error = {
      message: 'Service temporarily unavailable',
      details: ['Database connection failed'],
      status: 503
    };
  } else if (err.message === 'URL_NOT_FOUND') {
    error = {
      message: 'URL not found',
      details: ['The requested short URL does not exist'],
      status: 404
    };
  } else if (err.message === 'URL_EXPIRED') {
    error = {
      message: 'URL expired',
      details: ['This short URL has expired and is no longer valid'],
      status: 410
    };
  } else if (err.message === 'INVALID_URL') {
    error = {
      message: 'Invalid URL',
      details: ['The provided URL is not valid'],
      status: 400
    };
  } else if (err.message === 'CUSTOM_CODE_TAKEN') {
    error = {
      message: 'Custom code unavailable',
      details: ['The requested custom short code is already in use'],
      status: 409
    };
  } else if (err.status && err.status < 500) {
    // Client errors (4xx)
    error = {
      message: err.message || 'Bad Request',
      details: err.details || [],
      status: err.status
    };
  } else if (process.env.NODE_ENV === 'development') {
    // In development, send full error details
    error = {
      message: err.message,
      stack: err.stack,
      status: err.status || 500
    };
  }

  // Send error response
  res.status(error.status).json({
    error: true,
    message: error.message,
    details: error.details,
    timestamp: new Date().toISOString(),
    ...(error.stack && { stack: error.stack })
  });
}

/**
 * Handle 404 errors for routes that don't exist
 */
function notFoundHandler(req, res) {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  
  res.status(404).json({
    error: true,
    message: 'Route not found',
    details: [`The requested route ${req.method} ${req.url} does not exist`],
    timestamp: new Date().toISOString()
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
