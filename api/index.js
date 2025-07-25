/**
 * Vercel Serverless Function Entry Point
 * This file adapts our Express app for Vercel's serverless environment
 */

const app = require('./server');

// Export the Express app as a Vercel function
module.exports = app;
