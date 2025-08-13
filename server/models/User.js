const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  phone: {
    type: String
  },
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Fitness Profile
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  fitnessGoals: [{
    type: String,
    enum: ['weight-loss', 'muscle-gain', 'endurance', 'general-fitness', 'strength', 'flexibility']
  }],
  workoutDaysPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    default: 3
  },
  preferredWorkoutDuration: {
    type: Number, // in minutes
    default: 45
  },
  physicalLimitations: [{
    type: String
  }],
  injuries: [{
    type: String
  }],
  // Body Metrics
  height: {
    type: Number, // in cm
    min: 100,
    max: 250
  },
  weight: {
    type: Number, // in kg
    min: 30,
    max: 300
  },
  bodyFatPercentage: {
    type: Number,
    min: 0,
    max: 50
  },
  // Preferences
  preferredWorkoutTypes: [{
    type: String,
    enum: ['strength', 'cardio', 'hiit', 'yoga', 'stretching', 'pilates', 'crossfit']
  }],
  equipmentAccess: [{
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbells', 'machines', 'resistance-bands', 'cardio-equipment']
  }],
  dietaryPreferences: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'high-protein', 'low-carb']
  }],
  // Social Features
  bio: {
    type: String,
    maxlength: 500
  },
  isPublicProfile: {
    type: Boolean,
    default: true
  },
  // Community Features
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingFollowRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPrivate: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationBadge: { type: String },
  socialLinks: {
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    website: { type: String }
  },
  badges: [{
    name: { type: String, required: true },
    icon: { type: String },
    earnedAt: { type: Date, default: Date.now },
    description: { type: String }
  }],
  achievements: [{
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    earnedAt: { type: Date, default: Date.now },
    points: { type: Number, default: 0 }
  }],
  communityStats: {
    totalPosts: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    totalChallenges: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    totalGroups: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 }
  },
  privacySettings: {
    showProfile: { type: Boolean, default: true },
    showWorkouts: { type: Boolean, default: true },
    showProgress: { type: Boolean, default: true },
    showNutrition: { type: Boolean, default: true },
    allowMessages: { type: Boolean, default: true },
    allowFollowRequests: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
    showLastSeen: { type: Boolean, default: true }
  },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  mutedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastSeen: { type: Date, default: Date.now },
  isOnline: { type: Boolean, default: false },
  // Subscription
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'premium-plus'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String
  },
  // Stats
  totalWorkouts: {
    type: Number,
    default: 0
  },
  totalWorkoutTime: {
    type: Number, // in minutes
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  lastWorkoutDate: Date,
  // Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  // Social Login
  socialLogin: {
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    }
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ fitnessLevel: 1, fitnessGoals: 1 });
userSchema.index({ followers: 1 });
userSchema.index({ following: 1 });
userSchema.index({ isPublicProfile: 1, isPrivate: 1 });
userSchema.index({ 'communityStats.reputation': -1 });
userSchema.index({ lastSeen: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for BMI
userSchema.virtual('bmi').get(function() {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.stripeCustomerId;
  delete userObject.blockedUsers;
  delete userObject.mutedUsers;
  delete userObject.privacySettings;
  return userObject;
};

// Community methods
userSchema.methods.follow = function(userId) {
  if (this.following.includes(userId)) {
    throw new Error('Already following this user');
  }
  this.following.push(userId);
  return this.save();
};

userSchema.methods.unfollow = function(userId) {
  this.following = this.following.filter(id => id.toString() !== userId.toString());
  return this.save();
};

userSchema.methods.isFollowing = function(userId) {
  return this.following.some(id => id.toString() === userId.toString());
};

userSchema.methods.isFollowedBy = function(userId) {
  return this.followers.some(id => id.toString() === userId.toString());
};

userSchema.methods.blockUser = function(userId) {
  if (!this.blockedUsers.includes(userId)) {
    this.blockedUsers.push(userId);
  }
  return this.save();
};

userSchema.methods.unblockUser = function(userId) {
  this.blockedUsers = this.blockedUsers.filter(id => id.toString() !== userId.toString());
  return this.save();
};

userSchema.methods.isBlocked = function(userId) {
  return this.blockedUsers.some(id => id.toString() === userId.toString());
};

userSchema.methods.addExperience = function(points) {
  this.communityStats.experience += points;
  const newLevel = Math.floor(this.communityStats.experience / 1000) + 1;
  if (newLevel > this.communityStats.level) {
    this.communityStats.level = newLevel;
  }
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
