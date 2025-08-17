// In-memory storage for development when MongoDB is not available
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class InMemoryStorage {
  constructor() {
    this.users = new Map();
    this.nextUserId = 1;
    this.tokens = new Map(); // Store valid tokens
  }

  async createUser(userData) {
    const { email, password, firstName, lastName, fitnessLevel, fitnessGoals } = userData;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      throw new Error('Missing required fields');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const user = {
      id: this.nextUserId.toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fitnessLevel: fitnessLevel || 'beginner',
      fitnessGoals: fitnessGoals || [],
      profilePicture: null,
      subscription: {
        type: 'free',
        startDate: new Date(),
        endDate: null
      },
      totalWorkouts: 0,
      totalWorkoutTime: 0,
      streakDays: 0,
      lastWorkoutDate: null,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(email, user);
    this.nextUserId++;

    return user;
  }

  async findUserByEmail(email) {
    if (!email) return null;
    return this.users.get(email.toLowerCase()) || null;
  }

  async findUserById(id) {
    if (!id) return null;
    for (const user of this.users.values()) {
      if (user.id === id.toString()) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id, updates) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate updates
    const allowedFields = [
      'firstName', 'lastName', 'fitnessLevel', 'fitnessGoals', 
      'profilePicture', 'totalWorkouts', 'totalWorkoutTime', 
      'streakDays', 'lastWorkoutDate', 'isEmailVerified'
    ];

    const validUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        validUpdates[key] = value;
      }
    }

    const updatedUser = { 
      ...user, 
      ...validUpdates, 
      updatedAt: new Date() 
    };

    // Update in storage
    this.users.set(user.email, updatedUser);
    return updatedUser;
  }

  async comparePassword(email, password) {
    if (!email || !password) return false;
    
    const user = this.users.get(email.toLowerCase());
    if (!user) return false;
    
    return await bcrypt.compare(password, user.password);
  }

  async socialLogin(socialData) {
    const { provider, id, email, firstName, lastName, profilePicture } = socialData;
    
    // Validate required fields
    if (!provider || !id || !email || !firstName || !lastName) {
      throw new Error('Missing required fields for social login');
    }

    // Check if user exists with this social ID
    let user = null;
    for (const existingUser of this.users.values()) {
      if (existingUser.socialLogin && existingUser.socialLogin[provider] && existingUser.socialLogin[provider].id === id) {
        user = existingUser;
        break;
      }
    }

    if (!user) {
      // Check if user exists with email
      user = this.users.get(email.toLowerCase());
      
      if (user) {
        // Link social account to existing user
        if (!user.socialLogin) {
          user.socialLogin = {};
        }
        user.socialLogin[provider] = { id, email };
        user.updatedAt = new Date();
        this.users.set(user.email, user);
      } else {
        // Create new user
        user = {
          id: this.nextUserId.toString(),
          email: email.toLowerCase(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          profilePicture: profilePicture || null,
          socialLogin: {
            [provider]: { id, email }
          },
          fitnessLevel: 'beginner',
          fitnessGoals: [],
          subscription: {
            type: 'free',
            startDate: new Date(),
            endDate: null
          },
          totalWorkouts: 0,
          totalWorkoutTime: 0,
          streakDays: 0,
          lastWorkoutDate: null,
          isEmailVerified: true, // Social login users are considered verified
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.users.set(email, user);
        this.nextUserId++;
      }
    }

    return user;
  }

  generateToken(user) {
    if (!user || !user.id) {
      throw new Error('Invalid user data for token generation');
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Store token for validation
    this.tokens.set(token, {
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return token;
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if token is in our storage
      const storedToken = this.tokens.get(token);
      if (!storedToken || storedToken.expiresAt < new Date()) {
        this.tokens.delete(token);
        return null;
      }

      return decoded.user.id;
    } catch (error) {
      return null;
    }
  }

  getUserPublicData(user) {
    if (!user) return null;
    
    const { password, ...publicData } = user;
    return publicData;
  }

  // Clean up expired tokens
  cleanupExpiredTokens() {
    const now = new Date();
    for (const [token, tokenData] of this.tokens.entries()) {
      if (tokenData.expiresAt < now) {
        this.tokens.delete(token);
      }
    }
  }

  // Get storage statistics
  getStats() {
    return {
      totalUsers: this.users.size,
      totalTokens: this.tokens.size,
      nextUserId: this.nextUserId
    };
  }

  // Clear all data (for testing)
  clear() {
    this.users.clear();
    this.tokens.clear();
    this.nextUserId = 1;
  }
}

// Run cleanup every hour
const storage = new InMemoryStorage();
setInterval(() => {
  storage.cleanupExpiredTokens();
}, 60 * 60 * 1000); // 1 hour

module.exports = { InMemoryStorage: storage };
