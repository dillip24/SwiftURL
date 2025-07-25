/**
 * Validation Schemas
 * Joi schemas for request validation
 */

const Joi = require('joi');

/**
 * URL shortening request validation
 */
const createUrlSchema = Joi.object({
  longUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .max(2048)
    .required()
    .messages({
      'string.uri': 'Please provide a valid URL starting with http:// or https://',
      'string.max': 'URL cannot be longer than 2048 characters',
      'any.required': 'Long URL is required'
    }),
  
  customCode: Joi.string()
    .alphanum()
    .min(3)
    .max(10)
    .optional()
    .messages({
      'string.alphanum': 'Custom code can only contain letters and numbers',
      'string.min': 'Custom code must be at least 3 characters long',
      'string.max': 'Custom code cannot be longer than 10 characters'
    }),
  
  expiresAt: Joi.date()
    .iso()
    .min('now')
    .optional()
    .messages({
      'date.base': 'Expiration date must be a valid date',
      'date.iso': 'Expiration date must be in ISO format (YYYY-MM-DDTHH:MM:SSZ)',
      'date.min': 'Expiration date must be in the future'
    })
});

/**
 * Short code parameter validation
 */
const shortCodeSchema = Joi.object({
  shortCode: Joi.string()
    .alphanum()
    .min(3)
    .max(10)
    .required()
    .messages({
      'string.alphanum': 'Short code can only contain letters and numbers',
      'string.min': 'Short code must be at least 3 characters long',
      'string.max': 'Short code cannot be longer than 10 characters',
      'any.required': 'Short code is required'
    })
});

/**
 * Reserved keywords that cannot be used as custom codes
 */
const reservedKeywords = [
  'api', 'admin', 'www', 'app', 'mail', 'email', 'support', 'help',
  'about', 'contact', 'terms', 'privacy', 'login', 'register', 'signup',
  'dashboard', 'account', 'profile', 'settings', 'home', 'index',
  'health', 'status', 'metrics', 'docs', 'documentation', 'faq',
  'blog', 'news', 'static', 'assets', 'cdn', 'media', 'images',
  'js', 'css', 'fonts', 'favicon', 'robots', 'sitemap'
];

/**
 * Validate that custom code is not a reserved keyword
 */
function validateCustomCode(customCode) {
  if (!customCode) return true;
  
  const lowerCode = customCode.toLowerCase();
  if (reservedKeywords.includes(lowerCode)) {
    throw new Error(`'${customCode}' is a reserved keyword and cannot be used`);
  }
  
  return true;
}

/**
 * Middleware to validate request body against schema
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const validationError = new Error('Validation Error');
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      return next(validationError);
    }
    
    // Additional custom validation for custom codes
    if (property === 'body' && req.body.customCode) {
      try {
        validateCustomCode(req.body.customCode);
      } catch (err) {
        const customError = new Error('Validation Error');
        customError.name = 'ValidationError';
        customError.details = [{ message: err.message }];
        return next(customError);
      }
    }
    
    next();
  };
}

module.exports = {
  createUrlSchema,
  shortCodeSchema,
  validate,
  validateCustomCode,
  reservedKeywords
};
