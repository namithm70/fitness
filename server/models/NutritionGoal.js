const mongoose = require('mongoose');

const nutritionGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dailyTargets: {
    calories: {
      type: Number,
      required: true,
      min: 1000,
      max: 5000
    },
    protein: {
      type: Number,
      required: true,
      min: 0,
      max: 500
    },
    carbohydrates: {
      type: Number,
      required: true,
      min: 0,
      max: 1000
    },
    fat: {
      type: Number,
      required: true,
      min: 0,
      max: 200
    },
    fiber: {
      type: Number,
      default: 25,
      min: 0,
      max: 100
    },
    sugar: {
      type: Number,
      default: 50,
      min: 0,
      max: 200
    },
    sodium: {
      type: Number,
      default: 2300,
      min: 0,
      max: 10000
    },
    water: {
      type: Number, // in ml
      default: 2000,
      min: 500,
      max: 5000
    }
  },
  macroRatios: {
    proteinPercentage: {
      type: Number,
      default: 20,
      min: 10,
      max: 50
    },
    carbPercentage: {
      type: Number,
      default: 45,
      min: 10,
      max: 70
    },
    fatPercentage: {
      type: Number,
      default: 35,
      min: 15,
      max: 50
    }
  },
  weightGoal: {
    type: String,
    enum: ['lose', 'maintain', 'gain'],
    default: 'maintain'
  },
  targetWeight: {
    type: Number,
    min: 30,
    max: 300
  },
  weeklyWeightChange: {
    type: Number, // in kg
    default: 0,
    min: -2,
    max: 2
  },
  dietaryPreferences: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'high-protein', 'low-carb', 'gluten-free', 'dairy-free']
  }],
  mealTiming: {
    breakfastTime: {
      type: String,
      default: '08:00'
    },
    lunchTime: {
      type: String,
      default: '12:00'
    },
    dinnerTime: {
      type: String,
      default: '19:00'
    },
    snackTimes: [{
      type: String
    }]
  },
  reminders: {
    mealReminders: {
      type: Boolean,
      default: true
    },
    waterReminders: {
      type: Boolean,
      default: true
    },
    weightReminders: {
      type: Boolean,
      default: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate macro ratios based on calories
nutritionGoalSchema.methods.calculateMacroTargets = function() {
  const calories = this.dailyTargets.calories;
  const proteinPct = this.macroRatios.proteinPercentage / 100;
  const carbPct = this.macroRatios.carbPercentage / 100;
  const fatPct = this.macroRatios.fatPercentage / 100;

  return {
    protein: Math.round((calories * proteinPct) / 4), // 4 calories per gram
    carbohydrates: Math.round((calories * carbPct) / 4), // 4 calories per gram
    fat: Math.round((calories * fatPct) / 9) // 9 calories per gram
  };
};

module.exports = mongoose.model('NutritionGoal', nutritionGoalSchema);
