const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['weight', 'strength', 'endurance', 'flexibility', 'measurements', 'workout-frequency', 'custom'],
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lbs', 'cm', 'inches', 'reps', 'minutes', 'km', 'miles', 'workouts', 'days', 'custom']
  },
  targetDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  // For strength goals
  exercise: {
    type: String,
    trim: true
  },
  // For measurement goals
  measurementType: {
    type: String,
    enum: ['chest', 'waist', 'hips', 'biceps', 'forearms', 'thighs', 'calves', 'neck', 'shoulders']
  },
  // Progress tracking
  milestones: [{
    value: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    achieved: { type: Boolean, default: false }
  }],
  // Reminders
  reminders: {
    enabled: { type: Boolean, default: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    lastReminder: { type: Date }
  },
  // Tags for organization
  tags: [{
    type: String,
    maxlength: 50
  }],
  // Notes
  notes: {
    type: String,
    maxlength: 1000
  },
  // Achievement tracking
  completedAt: {
    type: Date
  },
  completionNotes: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

// Indexes
goalSchema.index({ user: 1, status: 1, targetDate: 1 });
goalSchema.index({ user: 1, type: 1 });
goalSchema.index({ targetDate: 1 });

// Calculate progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  if (this.targetValue === 0) return 0;
  const progress = (this.currentValue / this.targetValue) * 100;
  return Math.min(Math.max(progress, 0), 100);
});

// Check if goal is overdue
goalSchema.virtual('isOverdue').get(function() {
  return this.status === 'active' && new Date() > this.targetDate;
});

// Days remaining
goalSchema.virtual('daysRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const target = new Date(this.targetDate);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
});

module.exports = mongoose.model('Goal', goalSchema);
