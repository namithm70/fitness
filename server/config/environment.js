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
    : ['http://localhost:3000', 'https://fitness-ebon-nine.vercel.app'],
  
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

// Validation
if (!config.jwtSecret || config.jwtSecret === 'your-super-secret-jwt-key-change-in-production') {
  console.warn('⚠️ Warning: Using default JWT secret. Please set JWT_SECRET environment variable in production.');
}

if (config.nodeEnv === 'production' && !process.env.JWT_SECRET) {
  console.error('❌ Error: JWT_SECRET is required in production environment.');
  process.exit(1);
}

module.exports = config;
