const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    trim: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    enum: ['fruits', 'vegetables', 'grains', 'protein', 'dairy', 'fats', 'beverages', 'snacks', 'desserts', 'condiments', 'other'],
    required: true
  },
  servingSize: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece', 'slice']
    }
  },
  nutrition: {
    calories: {
      type: Number,
      required: true,
      min: 0
    },
    protein: {
      type: Number,
      default: 0,
      min: 0
    },
    carbohydrates: {
      type: Number,
      default: 0,
      min: 0
    },
    fat: {
      type: Number,
      default: 0,
      min: 0
    },
    fiber: {
      type: Number,
      default: 0,
      min: 0
    },
    sugar: {
      type: Number,
      default: 0,
      min: 0
    },
    sodium: {
      type: Number,
      default: 0,
      min: 0
    },
    cholesterol: {
      type: Number,
      default: 0,
      min: 0
    },
    saturatedFat: {
      type: Number,
      default: 0,
      min: 0
    },
    transFat: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  vitamins: {
    vitaminA: { type: Number, default: 0 },
    vitaminC: { type: Number, default: 0 },
    vitaminD: { type: Number, default: 0 },
    vitaminE: { type: Number, default: 0 },
    vitaminK: { type: Number, default: 0 },
    vitaminB1: { type: Number, default: 0 },
    vitaminB2: { type: Number, default: 0 },
    vitaminB3: { type: Number, default: 0 },
    vitaminB6: { type: Number, default: 0 },
    vitaminB12: { type: Number, default: 0 },
    folate: { type: Number, default: 0 }
  },
  minerals: {
    calcium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    magnesium: { type: Number, default: 0 },
    phosphorus: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    zinc: { type: Number, default: 0 }
  },
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'organic', 'low-sodium', 'low-sugar', 'high-protein', 'low-carb', 'keto-friendly', 'paleo-friendly']
  }],
  imageUrl: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better search performance
foodSchema.index({ name: 'text', brand: 'text' });
foodSchema.index({ category: 1 });
foodSchema.index({ 'nutrition.calories': 1 });
foodSchema.index({ dietaryTags: 1 });

module.exports = mongoose.model('Food', foodSchema);
