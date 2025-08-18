#!/usr/bin/env node

const mongoose = require('mongoose');
const Food = require('../models/Food');
require('dotenv').config();

const sampleFoods = [
  // Fruits
  {
    name: 'Banana',
    category: 'fruits',
    servingSize: { amount: 118, unit: 'g' },
    nutrition: {
      calories: 105,
      protein: 1.3,
      carbohydrates: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
      sodium: 1,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free']
  },
  {
    name: 'Apple',
    category: 'fruits',
    servingSize: { amount: 182, unit: 'g' },
    nutrition: {
      calories: 95,
      protein: 0.5,
      carbohydrates: 25,
      fat: 0.3,
      fiber: 4.4,
      sugar: 19,
      sodium: 2,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free']
  },
  {
    name: 'Orange',
    category: 'fruits',
    servingSize: { amount: 131, unit: 'g' },
    nutrition: {
      calories: 62,
      protein: 1.2,
      carbohydrates: 15,
      fat: 0.2,
      fiber: 3.1,
      sugar: 12,
      sodium: 0,
      cholesterol: 0,
      saturatedFat: 0,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free']
  },

  // Vegetables
  {
    name: 'Spinach',
    category: 'vegetables',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 23,
      protein: 2.9,
      carbohydrates: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      sodium: 79,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'low-carb']
  },
  {
    name: 'Broccoli',
    category: 'vegetables',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 34,
      protein: 2.8,
      carbohydrates: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      cholesterol: 0,
      saturatedFat: 0.1,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'low-carb']
  },
  {
    name: 'Carrot',
    category: 'vegetables',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 41,
      protein: 0.9,
      carbohydrates: 10,
      fat: 0.2,
      fiber: 2.8,
      sugar: 4.7,
      sodium: 69,
      cholesterol: 0,
      saturatedFat: 0,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free']
  },

  // Protein
  {
    name: 'Chicken Breast',
    category: 'protein',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 165,
      protein: 31,
      carbohydrates: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      cholesterol: 85,
      saturatedFat: 1.1,
      transFat: 0
    },
    dietaryTags: ['gluten-free', 'dairy-free', 'high-protein', 'low-carb']
  },
  {
    name: 'Salmon',
    category: 'protein',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 208,
      protein: 25,
      carbohydrates: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      cholesterol: 63,
      saturatedFat: 2.3,
      transFat: 0
    },
    dietaryTags: ['gluten-free', 'dairy-free', 'high-protein', 'low-carb']
  },
  {
    name: 'Eggs',
    category: 'protein',
    servingSize: { amount: 50, unit: 'g' },
    nutrition: {
      calories: 74,
      protein: 6.3,
      carbohydrates: 0.4,
      fat: 5,
      fiber: 0,
      sugar: 0.4,
      sodium: 71,
      cholesterol: 186,
      saturatedFat: 1.6,
      transFat: 0
    },
    dietaryTags: ['gluten-free', 'dairy-free', 'high-protein', 'low-carb']
  },

  // Grains
  {
    name: 'Brown Rice',
    category: 'grains',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 111,
      protein: 2.6,
      carbohydrates: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      cholesterol: 0,
      saturatedFat: 0.2,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free']
  },
  {
    name: 'Oatmeal',
    category: 'grains',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 68,
      protein: 2.4,
      carbohydrates: 12,
      fat: 1.4,
      fiber: 1.7,
      sugar: 0.3,
      sodium: 49,
      cholesterol: 0,
      saturatedFat: 0.2,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free']
  },
  {
    name: 'Quinoa',
    category: 'grains',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 120,
      protein: 4.4,
      carbohydrates: 22,
      fat: 1.9,
      fiber: 2.8,
      sugar: 0.9,
      sodium: 7,
      cholesterol: 0,
      saturatedFat: 0.2,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'high-protein']
  },

  // Dairy
  {
    name: 'Greek Yogurt',
    category: 'dairy',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 59,
      protein: 10,
      carbohydrates: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.2,
      sodium: 36,
      cholesterol: 5,
      saturatedFat: 0.1,
      transFat: 0
    },
    dietaryTags: ['gluten-free', 'high-protein', 'low-carb']
  },
  {
    name: 'Milk',
    category: 'dairy',
    servingSize: { amount: 100, unit: 'ml' },
    nutrition: {
      calories: 42,
      protein: 3.4,
      carbohydrates: 5,
      fat: 1,
      fiber: 0,
      sugar: 5,
      sodium: 44,
      cholesterol: 5,
      saturatedFat: 0.6,
      transFat: 0
    },
    dietaryTags: ['gluten-free']
  },
  {
    name: 'Cheddar Cheese',
    category: 'dairy',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 403,
      protein: 25,
      carbohydrates: 1.3,
      fat: 33,
      fiber: 0,
      sugar: 0.5,
      sodium: 621,
      cholesterol: 105,
      saturatedFat: 21,
      transFat: 0
    },
    dietaryTags: ['gluten-free', 'high-protein', 'low-carb']
  },

  // Fats
  {
    name: 'Olive Oil',
    category: 'fats',
    servingSize: { amount: 15, unit: 'ml' },
    nutrition: {
      calories: 120,
      protein: 0,
      carbohydrates: 0,
      fat: 14,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      cholesterol: 0,
      saturatedFat: 2,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'low-carb']
  },
  {
    name: 'Avocado',
    category: 'fats',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 160,
      protein: 2,
      carbohydrates: 9,
      fat: 15,
      fiber: 7,
      sugar: 0.7,
      sodium: 7,
      cholesterol: 0,
      saturatedFat: 2.1,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'low-carb']
  },
  {
    name: 'Almonds',
    category: 'fats',
    servingSize: { amount: 100, unit: 'g' },
    nutrition: {
      calories: 579,
      protein: 21,
      carbohydrates: 22,
      fat: 50,
      fiber: 12,
      sugar: 4.4,
      sodium: 1,
      cholesterol: 0,
      saturatedFat: 3.7,
      transFat: 0
    },
    dietaryTags: ['vegan', 'gluten-free', 'dairy-free', 'high-protein']
  }
];

async function seedFoods() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app');
    console.log('Connected to MongoDB');

    // Clear existing foods
    await Food.deleteMany({});
    console.log('Cleared existing foods');

    // Insert sample foods
    const foods = await Food.insertMany(sampleFoods);
    console.log(`Inserted ${foods.length} foods`);

    console.log('Food seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
}

seedFoods();
