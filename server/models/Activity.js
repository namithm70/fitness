const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['workout', 'exercise', 'nutrition', 'progress', 'goal'],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    // Workout details
    workoutId: String,
    workoutName: String,
    duration: Number,
    calories: Number,
    
    // Exercise details
    exerciseName: String,
    sets: Number,
    reps: Number,
    weight: Number,
    
    // Nutrition details
    mealType: String,
    foodName: String,
    
    // Progress details
    measurementType: String,
    value: Number,
    
    // Goal details
    goalType: String,
    goalName: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
ActivitySchema.index({ userId: 1, timestamp: -1 });
ActivitySchema.index({ userId: 1, type: 1 });
ActivitySchema.index({ userId: 1, completed: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);
