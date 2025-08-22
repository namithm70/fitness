const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config/environment');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());

// CORS configuration - Explicit for Vercel frontend
app.use((req, res, next) => {
  // Allow specific origins
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://fitness-ebon-nine.vercel.app',
    'https://fitness-fkct.onrender.com',
    'http://localhost:3000'
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Also keep the cors middleware as backup
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'Origin', 'Accept', 'X-Requested-With']
}));

// Trust proxy for rate limiting behind load balancers
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection management
const databaseManager = require('./utils/database');

// Initialize database connection
async function initializeDatabase() {
  const connected = await databaseManager.connect();
  app.locals.dbConnected = connected;
  app.locals.databaseManager = databaseManager;
}

// Initialize database
initializeDatabase();

// Start the server regardless of MongoDB connection status
server.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📊 Database: ${app.locals.dbConnected ? 'MongoDB' : 'In-Memory'}`);
});

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const nutritionRoutes = require('./routes/nutrition');
const progressRoutes = require('./routes/progress');
const communityRoutes = require('./routes/community');
const gymRoutes = require('./routes/gyms');
const activityRoutes = require('./routes/activities');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/activities', activityRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await app.locals.databaseManager.healthCheck();
    res.json({ 
      status: 'OK', 
      message: 'Fitness API is running',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    if (userId && typeof userId === 'string') {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    } else {
      console.warn('Invalid userId provided for join-user-room:', userId);
    }
  });

  // Handle workout tracking
  socket.on('workout-started', (data) => {
    if (data && data.userId) {
      socket.broadcast.to(`user-${data.userId}`).emit('workout-update', data);
    } else {
      console.warn('Invalid workout data received:', data);
    }
  });

  // Handle real-time messaging
  socket.on('send-message', (data) => {
    if (data && data.roomId) {
      io.to(data.roomId).emit('new-message', data);
    } else {
      console.warn('Invalid message data received:', data);
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
    
    // Clean up any user-specific data
    socket.rooms.forEach(room => {
      if (room.startsWith('user-')) {
        socket.leave(room);
      }
    });
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    io.close(() => {
      console.log('Socket.io server closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    io.close(() => {
      console.log('Socket.io server closed');
      process.exit(0);
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = { app, io };
