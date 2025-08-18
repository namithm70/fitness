const { body, param, query, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// Generic validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

// Sanitize HTML content
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  body('fitnessLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Fitness level must be beginner, intermediate, or advanced'),
  body('fitnessGoals')
    .optional()
    .isArray()
    .withMessage('Fitness goals must be an array'),
  sanitizeInput,
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  sanitizeInput,
  handleValidationErrors
];

// Workout validation
const validateWorkout = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Workout name is required and must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('duration')
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required'),
  sanitizeInput,
  handleValidationErrors
];

// Progress entry validation
const validateProgressEntry = [
  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),
  body('bodyFatPercentage')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Body fat percentage must be between 0 and 50'),
  body('measurements')
    .optional()
    .isObject()
    .withMessage('Measurements must be an object'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  sanitizeInput,
  handleValidationErrors
];

// Nutrition entry validation
const validateNutritionEntry = [
  body('foods')
    .isArray({ min: 1 })
    .withMessage('At least one food item is required'),
  body('foods.*.name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Food name is required and must be less than 100 characters'),
  body('foods.*.calories')
    .isInt({ min: 0, max: 5000 })
    .withMessage('Calories must be between 0 and 5000'),
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Meal type must be breakfast, lunch, dinner, or snack'),
  sanitizeInput,
  handleValidationErrors
];

// Post validation
const validatePost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Post content is required and must be less than 2000 characters'),
  body('type')
    .isIn(['text', 'photo', 'video', 'workout', 'progress', 'meal', 'achievement', 'challenge', 'event'])
    .withMessage('Invalid post type'),
  body('category')
    .optional()
    .isIn(['workout', 'nutrition', 'progress', 'motivation', 'tips', 'general', 'challenge', 'event'])
    .withMessage('Invalid post category'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  sanitizeInput,
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query is required and must be less than 100 characters'),
  query('type')
    .optional()
    .isIn(['all', 'posts', 'users', 'groups', 'events', 'challenges'])
    .withMessage('Invalid search type'),
  validatePagination
];

module.exports = {
  handleValidationErrors,
  sanitizeInput,
  validateRegistration,
  validateLogin,
  validateWorkout,
  validateProgressEntry,
  validateNutritionEntry,
  validatePost,
  validateId,
  validatePagination,
  validateSearch
};
