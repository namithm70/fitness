const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'lower-back', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'full-body'],
    required: true
  }],
  equipment: [{
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance-bands', 'cable-machine', 'smith-machine', 'bench', 'pull-up-bar', 'dip-bars', 'cardio-equipment'],
    required: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  instructions: [{
    type: String,
    required: true
  }],
  videoUrl: {
    type: String
  },
  imageUrl: {
    type: String
  },
  tips: [{
    type: String
  }],
  variations: [{
    name: String,
    description: String,
    difficulty: String,
    instructions: [String]
  }],
  caloriesPerMinute: {
    type: Number,
    default: 0
  },
  isCompound: {
    type: Boolean,
    default: false
  },
  isCardio: {
    type: Boolean,
    default: false
  },
  isStretching: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  usageCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
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
exerciseSchema.index({ name: 1 });
exerciseSchema.index({ muscleGroups: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ difficulty: 1 });
exerciseSchema.index({ 'rating.average': -1 });
exerciseSchema.index({ featured: 1, createdAt: -1 });

// Text search index
exerciseSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);
