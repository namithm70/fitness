const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['workout-streak', 'weight-loss', 'strength-gain', 'endurance', 'consistency', 'milestone', 'special'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  criteria: {
    metric: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  achievedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    current: { type: Number, default: 0 },
    target: { type: Number, required: true },
    percentage: { type: Number, default: 0 }
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 10
  },
  // For streak achievements
  streakDays: {
    type: Number,
    default: 0
  },
  // For milestone achievements
  milestone: {
    type: String,
    enum: ['first-workout', 'first-week', 'first-month', 'first-3-months', 'first-6-months', 'first-year', 'weight-goal', 'strength-goal', 'endurance-goal']
  },
  // Additional data
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  // Social features
  shared: {
    type: Boolean,
    default: false
  },
  sharedAt: {
    type: Date
  }
}, { timestamps: true });

// Indexes
achievementSchema.index({ user: 1, achievedAt: -1 });
achievementSchema.index({ user: 1, type: 1 });
achievementSchema.index({ type: 1, rarity: 1 });

// Update progress percentage
achievementSchema.methods.updateProgress = function(currentValue) {
  this.progress.current = currentValue;
  this.progress.percentage = Math.min((currentValue / this.progress.target) * 100, 100);
  return this.save();
};

// Check if achievement is completed
achievementSchema.virtual('isCompleted').get(function() {
  return this.progress.current >= this.progress.target;
});

module.exports = mongoose.model('Achievement', achievementSchema);

// Predefined achievements
const predefinedAchievements = [
  // Workout Streaks
  {
    type: 'workout-streak',
    title: 'Getting Started',
    description: 'Complete your first workout',
    icon: '🎯',
    criteria: { metric: 'workout-streak', value: 1, unit: 'days' },
    progress: { target: 1 },
    rarity: 'common',
    points: 10
  },
  {
    type: 'workout-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    criteria: { metric: 'workout-streak', value: 7, unit: 'days' },
    progress: { target: 7 },
    rarity: 'uncommon',
    points: 25
  },
  {
    type: 'workout-streak',
    title: 'Month Master',
    description: 'Maintain a 30-day workout streak',
    icon: '💪',
    criteria: { metric: 'workout-streak', value: 30, unit: 'days' },
    progress: { target: 30 },
    rarity: 'rare',
    points: 100
  },
  {
    type: 'workout-streak',
    title: 'Consistency King',
    description: 'Maintain a 100-day workout streak',
    icon: '👑',
    criteria: { metric: 'workout-streak', value: 100, unit: 'days' },
    progress: { target: 100 },
    rarity: 'epic',
    points: 500
  },
  // Weight Loss
  {
    type: 'weight-loss',
    title: 'First Steps',
    description: 'Lose your first 5 pounds',
    icon: '⚖️',
    criteria: { metric: 'weight-loss', value: 5, unit: 'lbs' },
    progress: { target: 5 },
    rarity: 'common',
    points: 20
  },
  {
    type: 'weight-loss',
    title: 'Transformation',
    description: 'Lose 20 pounds',
    icon: '🔄',
    criteria: { metric: 'weight-loss', value: 20, unit: 'lbs' },
    progress: { target: 20 },
    rarity: 'rare',
    points: 150
  },
  // Strength
  {
    type: 'strength-gain',
    title: 'Getting Stronger',
    description: 'Increase your bench press by 20 pounds',
    icon: '🏋️',
    criteria: { metric: 'strength-gain', value: 20, unit: 'lbs' },
    progress: { target: 20 },
    rarity: 'uncommon',
    points: 50
  },
  // Endurance
  {
    type: 'endurance',
    title: 'Distance Runner',
    description: 'Run your first 5K',
    icon: '🏃',
    criteria: { metric: 'endurance', value: 5, unit: 'km' },
    progress: { target: 5 },
    rarity: 'uncommon',
    points: 40
  },
  // Consistency
  {
    type: 'consistency',
    title: 'Regular',
    description: 'Work out 3 times in a week',
    icon: '📅',
    criteria: { metric: 'consistency', value: 3, unit: 'workouts' },
    progress: { target: 3 },
    rarity: 'common',
    points: 15
  }
];

module.exports.predefinedAchievements = predefinedAchievements;
