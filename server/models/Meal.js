const mongoose = require('mongoose');

const mealEntrySchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  servingAmount: {
    type: Number,
    required: true,
    min: 0.1
  },
  servingUnit: {
    type: String,
    required: true,
    enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece', 'slice']
  },
  multiplier: {
    type: Number,
    default: 1,
    min: 0.1
  },
  notes: {
    type: String,
    maxlength: 500
  }
});

const mealSchema = new mongoose.Schema({
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
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  entries: [mealEntrySchema],
  totalNutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    cholesterol: { type: Number, default: 0 },
    saturatedFat: { type: Number, default: 0 },
    transFat: { type: Number, default: 0 }
  },
  imageUrl: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    maxlength: 50
  }]
}, {
  timestamps: true
});

// Indexes
mealSchema.index({ user: 1, date: -1 });
mealSchema.index({ user: 1, mealType: 1, date: -1 });
mealSchema.index({ date: 1 });

// Calculate total nutrition before saving
mealSchema.pre('save', function(next) {
  this.totalNutrition = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    cholesterol: 0,
    saturatedFat: 0,
    transFat: 0
  };

  this.entries.forEach(entry => {
    const multiplier = entry.multiplier || 1;
    this.totalNutrition.calories += (entry.food.nutrition?.calories || 0) * multiplier;
    this.totalNutrition.protein += (entry.food.nutrition?.protein || 0) * multiplier;
    this.totalNutrition.carbohydrates += (entry.food.nutrition?.carbohydrates || 0) * multiplier;
    this.totalNutrition.fat += (entry.food.nutrition?.fat || 0) * multiplier;
    this.totalNutrition.fiber += (entry.food.nutrition?.fiber || 0) * multiplier;
    this.totalNutrition.sugar += (entry.food.nutrition?.sugar || 0) * multiplier;
    this.totalNutrition.sodium += (entry.food.nutrition?.sodium || 0) * multiplier;
    this.totalNutrition.cholesterol += (entry.food.nutrition?.cholesterol || 0) * multiplier;
    this.totalNutrition.saturatedFat += (entry.food.nutrition?.saturatedFat || 0) * multiplier;
    this.totalNutrition.transFat += (entry.food.nutrition?.transFat || 0) * multiplier;
  });

  next();
});

module.exports = mongoose.model('Meal', mealSchema);
