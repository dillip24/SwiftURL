/**
 * Logger Utility
 * Centralized logging for the application
 */

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? 
                         (process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO);

/**
 * Format timestamp
 */
function formatTimestamp() {
  return new Date().toISOString();
}

/**
 * Format log message
 */
function formatMessage(level, message, meta = {}) {
  const timestamp = formatTimestamp();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
}

/**
 * Write to log file
 */
function writeToFile(level, message, meta = {}) {
  try {
    const logFile = path.join(logsDir, `${level}.log`);
    const formattedMessage = formatMessage(level, message, meta) + '\n';
    
    fs.appendFileSync(logFile, formattedMessage);
    
    // Also write to combined log
    const combinedLogFile = path.join(logsDir, 'combined.log');
    fs.appendFileSync(combinedLogFile, formattedMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

/**
 * Console output with colors
 */
function logToConsole(level, message, meta = {}) {
  const colors = {
    error: '\x1b[31m', // Red
    warn: '\x1b[33m',  // Yellow
    info: '\x1b[36m',  // Cyan
    debug: '\x1b[90m'  // Gray
  };
  
  const reset = '\x1b[0m';
  const color = colors[level] || '';
  
  const formattedMessage = formatMessage(level, message, meta);
  console.log(`${color}${formattedMessage}${reset}`);
}

/**
 * Log function
 */
function log(level, message, meta = {}) {
  const levelValue = LOG_LEVELS[level.toUpperCase()];
  
  // Only log if the level is enabled
  if (levelValue <= CURRENT_LOG_LEVEL) {
    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      logToConsole(level, message, meta);
    }
    
    // Always log to file
    writeToFile(level, message, meta);
  }
}

/**
 * Logger object with convenience methods
 */
const logger = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
  
  // Utility method to log HTTP requests
  request: (req) => {
    log('info', `${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer')
    });
  }
};

module.exports = logger;
