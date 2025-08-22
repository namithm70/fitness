const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { InMemoryStorage: inMemoryStorage } = require('../utils/inMemoryStorage');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const isConnected = req.app.locals.dbConnected;
    if (isConnected) {
      const user = await User.findById(req.user.id).select('-password');
      return res.json(user);
    }

    // In-memory fallback
    const user = await inMemoryStorage.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(inMemoryStorage.getUserPublicData(user));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('fitnessLevel').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('fitnessGoals').optional().isArray(),
  body('workoutDaysPerWeek').optional().isInt({ min: 1, max: 7 }),
  body('preferredWorkoutDuration').optional().isInt({ min: 15, max: 180 }),
  body('height').optional().isFloat({ min: 100, max: 250 }),
  body('weight').optional().isFloat({ min: 30, max: 300 }),
  body('bio').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isConnected = req.app.locals.dbConnected;
    if (isConnected) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update fields
      const updateFields = [
        'firstName', 'lastName', 'fitnessLevel', 'fitnessGoals', 
        'workoutDaysPerWeek', 'preferredWorkoutDuration', 'height', 
        'weight', 'bio', 'preferredWorkoutTypes', 'equipmentAccess', 
        'dietaryPreferences', 'physicalLimitations', 'injuries'
      ];

      updateFields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      await user.save();
      return res.json(user);
    }

    // In-memory fallback
    const allowedFields = [
      'firstName', 'lastName', 'fitnessLevel', 'fitnessGoals',
      'profilePicture', 'workoutDaysPerWeek', 'preferredWorkoutDuration',
      'height', 'weight', 'bio', 'preferredWorkoutTypes', 'equipmentAccess',
      'dietaryPreferences', 'physicalLimitations', 'injuries'
    ];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    const updatedUser = await inMemoryStorage.updateUser(req.user.id, updates);
    return res.json(inMemoryStorage.getUserPublicData(updatedUser));
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('totalWorkouts totalWorkoutTime streakDays lastWorkoutDate');
    
    const stats = {
      totalWorkouts: user.totalWorkouts,
      totalWorkoutTime: user.totalWorkoutTime,
      streakDays: user.streakDays,
      lastWorkoutDate: user.lastWorkoutDate,
      averageWorkoutTime: user.totalWorkouts > 0 ? Math.round(user.totalWorkoutTime / user.totalWorkouts) : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/search
// @desc    Search users (for community features)
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, fitnessLevel, location } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isPublicProfile: true, _id: { $ne: req.user.id } };

    if (q) {
      query.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }

    if (fitnessLevel) {
      query.fitnessLevel = fitnessLevel;
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    const users = await User.find(query)
      .select('firstName lastName profilePicture fitnessLevel fitnessGoals bio location totalWorkouts')
      .skip(skip)
      .limit(limit)
      .sort({ totalWorkouts: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get public user profile
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName profilePicture fitnessLevel bio totalWorkouts totalWorkoutTime streakDays createdAt')
      .where('isPublicProfile', true);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
