const mongoose = require('mongoose');

const progressEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['weight', 'measurements', 'body-fat', 'progress-photo', 'strength', 'endurance', 'flexibility'],
    required: true
  },
  // Weight tracking
  weight: {
    type: Number,
    min: 30,
    max: 300
  },
  // Body measurements
  measurements: {
    chest: { type: Number, min: 50, max: 200 },
    waist: { type: Number, min: 50, max: 200 },
    hips: { type: Number, min: 50, max: 200 },
    biceps: { type: Number, min: 20, max: 100 },
    forearms: { type: Number, min: 15, max: 80 },
    thighs: { type: Number, min: 30, max: 150 },
    calves: { type: Number, min: 20, max: 100 },
    neck: { type: Number, min: 20, max: 80 },
    shoulders: { type: Number, min: 80, max: 200 }
  },
  // Body composition
  bodyFatPercentage: {
    type: Number,
    min: 0,
    max: 50
  },
  muscleMass: {
    type: Number,
    min: 0,
    max: 200
  },
  // Progress photos
  photos: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['front', 'back', 'side', 'other'], required: true },
    notes: String
  }],
  // Strength tracking
  strengthMetrics: [{
    exercise: { type: String, required: true },
    weight: { type: Number, min: 0 },
    reps: { type: Number, min: 0 },
    sets: { type: Number, min: 0 },
    isPR: { type: Boolean, default: false }
  }],
  // Endurance tracking
  enduranceMetrics: {
    cardioType: { type: String, enum: ['running', 'cycling', 'swimming', 'rowing', 'elliptical', 'other'] },
    duration: { type: Number, min: 0 }, // in minutes
    distance: { type: Number, min: 0 }, // in km
    pace: { type: Number, min: 0 }, // minutes per km
    caloriesBurned: { type: Number, min: 0 }
  },
  // Flexibility tracking
  flexibilityMetrics: {
    sitAndReach: { type: Number, min: -50, max: 50 }, // cm
    shoulderFlexibility: { type: Number, min: 0, max: 180 }, // degrees
    hipFlexibility: { type: Number, min: 0, max: 180 } // degrees
  },
  // General notes
  notes: {
    type: String,
    maxlength: 1000
  },
  // Mood and energy
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible']
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  // Tags for organization
  tags: [{
    type: String,
    maxlength: 50
  }],
  // Privacy settings
  isPublic: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for efficient querying
progressEntrySchema.index({ user: 1, date: -1 });
progressEntrySchema.index({ user: 1, type: 1, date: -1 });
progressEntrySchema.index({ date: 1 });

module.exports = mongoose.model('ProgressEntry', progressEntrySchema);
