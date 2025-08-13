const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ fitnessLevel: 1, fitnessGoals: 1 });

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
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
