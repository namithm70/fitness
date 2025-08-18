const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Food = require('../models/Food');
const Meal = require('../models/Meal');
const NutritionGoal = require('../models/NutritionGoal');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/nutrition/dashboard
// @desc    Get nutrition dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's meals
    const todaysMeals = await Meal.find({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    }).populate('entries.food');

    // Calculate daily totals
    const dailyTotals = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      water: 0
    };

    todaysMeals.forEach(meal => {
      dailyTotals.calories += meal.totalNutrition.calories;
      dailyTotals.protein += meal.totalNutrition.protein;
      dailyTotals.carbohydrates += meal.totalNutrition.carbohydrates;
      dailyTotals.fat += meal.totalNutrition.fat;
      dailyTotals.fiber += meal.totalNutrition.fiber;
      dailyTotals.sugar += meal.totalNutrition.sugar;
      dailyTotals.sodium += meal.totalNutrition.sodium;
    });

    // Get user's nutrition goals
    let nutritionGoal = await NutritionGoal.findOne({ user: req.user.id });
    if (!nutritionGoal) {
      // Create default goals based on user profile
      const user = await User.findById(req.user.id);
      const bmr = calculateBMR(user);
      const tdee = calculateTDEE(bmr, user.fitnessLevel);
      
      nutritionGoal = new NutritionGoal({
        user: req.user.id,
        dailyTargets: {
          calories: tdee,
          protein: Math.round(tdee * 0.2 / 4), // 20% protein
          carbohydrates: Math.round(tdee * 0.45 / 4), // 45% carbs
          fat: Math.round(tdee * 0.35 / 9), // 35% fat
          fiber: 25,
          sugar: 50,
          sodium: 2300,
          water: 2000
        }
      });
      await nutritionGoal.save();
    }

    // Get recent meals
    const recentMeals = await Meal.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5)
      .populate('entries.food');

    // Get weekly nutrition data
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyMeals = await Meal.find({
      user: req.user.id,
      date: { $gte: weekAgo }
    }).populate('entries.food');

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayMeals = weeklyMeals.filter(meal => 
        meal.date.toDateString() === date.toDateString()
      );
      
      const dayTotal = dayMeals.reduce((acc, meal) => ({
        calories: acc.calories + meal.totalNutrition.calories,
        protein: acc.protein + meal.totalNutrition.protein,
        carbohydrates: acc.carbohydrates + meal.totalNutrition.carbohydrates,
        fat: acc.fat + meal.totalNutrition.fat
      }), { calories: 0, protein: 0, carbohydrates: 0, fat: 0 });

      weeklyData.push({
        date: date.toISOString().split('T')[0],
        ...dayTotal
      });
    }

    res.json({
      dailyTotals,
      nutritionGoal,
      recentMeals,
      weeklyData,
      todaysMeals
    });
  } catch (error) {
    console.error('Nutrition dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/nutrition/foods
// @desc    Search foods
// @access  Private
router.get('/foods', auth, async (req, res) => {
  try {
    const { q, category, limit = 20 } = req.query;
    let query = { isPublic: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (category) {
      query.category = category;
    }

    const foods = await Food.find(query)
      .limit(parseInt(limit))
      .sort({ usageCount: -1, name: 1 });

    res.json(foods);
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/nutrition/foods
// @desc    Add custom food
// @access  Private
router.post('/foods', [
  auth,
  body('name').notEmpty().withMessage('Food name is required'),
  body('category').isIn(['fruits', 'vegetables', 'grains', 'protein', 'dairy', 'fats', 'beverages', 'snacks', 'desserts', 'condiments', 'other']).withMessage('Invalid category'),
  body('servingSize.amount').isNumeric().withMessage('Serving amount must be numeric'),
  body('servingSize.unit').isIn(['g', 'ml', 'oz', 'cup', 'tbsp', 'tsp', 'piece', 'slice']).withMessage('Invalid serving unit'),
  body('nutrition.calories').isNumeric().withMessage('Calories must be numeric')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const food = new Food({
      ...req.body,
      createdBy: req.user.id
    });

    await food.save();
    res.json(food);
  } catch (error) {
    console.error('Add food error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/nutrition/meals
// @desc    Log a meal
// @access  Private
router.post('/meals', [
  auth,
  body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
  body('entries').isArray({ min: 1 }).withMessage('At least one food entry is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const meal = new Meal({
      ...req.body,
      user: req.user.id,
      date: req.body.date || new Date()
    });

    await meal.save();
    await meal.populate('entries.food');
    
    res.json(meal);
  } catch (error) {
    console.error('Log meal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/nutrition/meals
// @desc    Get user meals
// @access  Private
router.get('/meals', auth, async (req, res) => {
  try {
    const { date, mealType, limit = 20 } = req.query;
    let query = { user: req.user.id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (mealType) {
      query.mealType = mealType;
    }

    const meals = await Meal.find(query)
      .populate('entries.food')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(meals);
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/nutrition/goals
// @desc    Update nutrition goals
// @access  Private
router.put('/goals', auth, async (req, res) => {
  try {
    let nutritionGoal = await NutritionGoal.findOne({ user: req.user.id });
    
    if (!nutritionGoal) {
      nutritionGoal = new NutritionGoal({
        user: req.user.id,
        ...req.body
      });
    } else {
      Object.assign(nutritionGoal, req.body);
    }

    await nutritionGoal.save();
    res.json(nutritionGoal);
  } catch (error) {
    console.error('Update goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/nutrition/goals
// @desc    Get nutrition goals
// @access  Private
router.get('/goals', auth, async (req, res) => {
  try {
    let nutritionGoal = await NutritionGoal.findOne({ user: req.user.id });
    
    if (!nutritionGoal) {
      // Create default goals
      const user = await User.findById(req.user.id);
      const bmr = calculateBMR(user);
      const tdee = calculateTDEE(bmr, user.fitnessLevel);
      
      nutritionGoal = new NutritionGoal({
        user: req.user.id,
        dailyTargets: {
          calories: tdee,
          protein: Math.round(tdee * 0.2 / 4),
          carbohydrates: Math.round(tdee * 0.45 / 4),
          fat: Math.round(tdee * 0.35 / 9),
          fiber: 25,
          sugar: 50,
          sodium: 2300,
          water: 2000
        }
      });
      await nutritionGoal.save();
    }

    res.json(nutritionGoal);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper functions
function calculateBMR(user) {
  // Mifflin-St Jeor Equation
  if (user.gender === 'male') {
    return 10 * user.weight + 6.25 * user.height - 5 * getAge(user.dateOfBirth) + 5;
  } else {
    return 10 * user.weight + 6.25 * user.height - 5 * getAge(user.dateOfBirth) - 161;
  }
}

function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    'beginner': 1.2,
    'intermediate': 1.375,
    'advanced': 1.55
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

function getAge(dateOfBirth) {
  if (!dateOfBirth) return 25; // Default age
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

module.exports = router;
