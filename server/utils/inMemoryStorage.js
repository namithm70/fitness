// In-memory storage for development when MongoDB is not available
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class InMemoryStorage {
  constructor() {
    this.users = new Map();
    this.nextUserId = 1;
  }

  async createUser(userData) {
    const { email, password, firstName, lastName, fitnessLevel, fitnessGoals } = userData;
    
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
      email,
      password: hashedPassword,
      firstName,
      lastName,
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
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(email, user);
    this.nextUserId++;

    return user;
  }

  async findUserByEmail(email) {
    return this.users.get(email) || null;
  }

  async findUserById(id) {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id, updates) {
    for (const [email, user] of this.users.entries()) {
      if (user.id === id) {
        const updatedUser = { ...user, ...updates, updatedAt: new Date() };
        this.users.set(email, updatedUser);
        return updatedUser;
      }
    }
    return null;
  }

  async comparePassword(email, password) {
    const user = this.users.get(email);
    if (!user) return false;
    
    return await bcrypt.compare(password, user.password);
  }

  generateToken(user) {
    const payload = {
      user: {
        id: user.id
      }
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return decoded.user.id;
    } catch (error) {
      return null;
    }
  }

  getUserPublicData(user) {
    const { password, ...publicData } = user;
    return publicData;
  }
}

module.exports = { InMemoryStorage };
