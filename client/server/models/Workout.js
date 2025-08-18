const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'lower-back', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'full-body']
  }],
  equipment: [{
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance-bands', 'cable-machine', 'smith-machine', 'bench', 'pull-up-bar', 'dip-bars', 'cardio-equipment']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  instructions: [{
    type: String
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
    difficulty: String
  }],
  caloriesPerMinute: {
    type: Number,
    default: 0
  }
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'hiit', 'yoga', 'stretching', 'pilates', 'crossfit', 'functional'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    sets: {
      type: Number,
      default: 3
    },
    reps: {
      type: Number,
      default: 10
    },
    weight: {
      type: Number, // in kg
      default: 0
    },
    duration: {
      type: Number, // in seconds, for timed exercises
      default: 0
    },
    restTime: {
      type: Number, // in seconds
      default: 60
    },
    notes: String,
    order: {
      type: Number,
      required: true
    }
  }],
  targetMuscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'lower-back', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'full-body']
  }],
  equipment: [{
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance-bands', 'cable-machine', 'smith-machine', 'bench', 'pull-up-bar', 'dip-bars', 'cardio-equipment']
  }],
  caloriesBurned: {
    type: Number,
    default: 0
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
    ref: 'User',
    required: true
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
  completedCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: String
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
workoutSchema.index({ category: 1, difficulty: 1 });
workoutSchema.index({ targetMuscleGroups: 1 });
workoutSchema.index({ equipment: 1 });
workoutSchema.index({ 'rating.average': -1 });
workoutSchema.index({ featured: 1, createdAt: -1 });

// Virtual for total exercises
workoutSchema.virtual('totalExercises').get(function() {
  return this.exercises.length;
});

// Virtual for estimated total time
workoutSchema.virtual('estimatedTotalTime').get(function() {
  let totalTime = this.duration;
  this.exercises.forEach(exercise => {
    totalTime += (exercise.restTime * (exercise.sets - 1)) / 60; // Convert rest time to minutes
  });
  return Math.round(totalTime);
});

module.exports = mongoose.model('Workout', workoutSchema);
