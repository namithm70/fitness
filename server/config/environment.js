// Environment configuration
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS configuration
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'https://fitness-ebon-nine.vercel.app', 'https://*.vercel.app', 'https://fitness-ebon-nine.vercel.app'],
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // requests per window
  
  // Email configuration (for future use)
  emailService: process.env.EMAIL_SERVICE || 'gmail',
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  
  // File upload configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Security
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  
  // Feature flags
  features: {
    emailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
    socialLogin: process.env.ENABLE_SOCIAL_LOGIN === 'true',
    realTimeFeatures: process.env.ENABLE_REALTIME === 'true',
  }
};

// Security validation
const validateSecurity = () => {
  // JWT Secret validation
  if (!config.jwtSecret || config.jwtSecret === 'your-super-secret-jwt-key-change-in-production') {
    if (config.nodeEnv === 'production') {
      console.error('❌ CRITICAL: JWT_SECRET is required in production environment.');
      console.error('💡 Please set a strong JWT_SECRET environment variable.');
      process.exit(1);
    } else {
      console.warn('⚠️ Warning: Using default JWT secret. Please set JWT_SECRET environment variable in production.');
    }
  }

  // JWT Secret strength validation
  if (config.jwtSecret && config.jwtSecret.length < 32) {
    console.warn('⚠️ Warning: JWT_SECRET should be at least 32 characters long for security.');
  }

  // MongoDB URI validation
  if (config.nodeEnv === 'production' && (!config.mongodbUri || config.mongodbUri === 'mongodb://localhost:27017/fitness-app')) {
    console.warn('⚠️ Warning: MONGODB_URI not set in production. Using in-memory storage.');
    console.warn('💡 For production, set a valid MongoDB connection string.');
    // Don't exit - allow in-memory storage to work
  }

  // CORS validation
  if (config.nodeEnv === 'production' && config.allowedOrigins.includes('http://localhost:3000')) {
    console.warn('⚠️ Warning: localhost is included in allowed origins in production.');
  }
};

// Run security validation
validateSecurity();

module.exports = config;
