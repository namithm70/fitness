const mongoose = require('mongoose');
const { InMemoryStorage: inMemoryStorage } = require('./inMemoryStorage');

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.inMemoryStorage = inMemoryStorage;
    this.retryAttempts = 0;
    this.maxRetries = 3;
  }

  async connect() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app';
    
    // Check if we have a valid MongoDB URI
    if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/fitness-app') {
      console.log('⚠️ No MongoDB URI provided, using in-memory storage');
      this.isConnected = false;
      return false;
    }
    
    try {
      console.log('🔄 Attempting to connect to MongoDB...');
      console.log(`📡 Connection string: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
      
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      this.retryAttempts = 0;
      console.log('✅ Successfully connected to MongoDB');
      
      // Set up connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
        this.isConnected = true;
      });

      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      
      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts++;
        console.log(`🔄 Retrying connection (${this.retryAttempts}/${this.maxRetries})...`);
        
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.connect();
      }
      
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ MongoDB connection failed in production. Please check your MONGODB_URI environment variable.');
        console.error('💡 Make sure you have set up MongoDB Atlas and configured the connection string correctly.');
        process.exit(1);
      } else {
        console.log('⚠️ Falling back to in-memory storage for development...');
        this.isConnected = false;
        return false;
      }
    }
  }

  async disconnect() {
    if (this.isConnected && mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  isDatabaseConnected() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  getStorage() {
    return this.isDatabaseConnected() ? mongoose : this.inMemoryStorage;
  }

  // Health check method
  async healthCheck() {
    if (this.isDatabaseConnected()) {
      try {
        await mongoose.connection.db.admin().ping();
        return { status: 'healthy', type: 'mongodb' };
      } catch (error) {
        return { status: 'unhealthy', type: 'mongodb', error: error.message };
      }
    } else {
      return { status: 'healthy', type: 'in-memory' };
    }
  }
}

module.exports = new DatabaseManager();
