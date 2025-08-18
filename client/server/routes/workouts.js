const express = require('express');
const { body, validationResult } = require('express-validator');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/workouts
// @desc    Get all workouts with filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      category,
      difficulty,
      muscleGroup,
      equipment,
      duration,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const skip = (page - 1) * limit;
    let query = { isPublic: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (muscleGroup) query.targetMuscleGroups = muscleGroup;
    if (equipment) query.equipment = equipment;
    if (duration) query.duration = { $lte: parseInt(duration) };
    if (search) {
      query.$text = { $search: search };
    }

    const workouts = await Workout.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ featured: -1, 'rating.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Workout.countDocuments(query);

    res.json({
      workouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get workout by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('exercises.exercise');

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/workouts
// @desc    Create a new workout
// @access  Private
router.post('/', [
  auth,
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('category').isIn(['strength', 'cardio', 'hiit', 'yoga', 'stretching', 'pilates', 'crossfit', 'functional']),
  body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
  body('duration').isInt({ min: 5, max: 300 }),
  body('exercises').isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const workout = new Workout({
      ...req.body,
      createdBy: req.user.id
    });

    await workout.save();
    await workout.populate('createdBy', 'firstName lastName');
    await workout.populate('exercises.exercise');

    res.status(201).json(workout);
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update workout
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(workout, req.body);
    await workout.save();
    
    await workout.populate('createdBy', 'firstName lastName');
    await workout.populate('exercises.exercise');

    res.json(workout);
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    if (workout.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await workout.remove();
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/workouts/:id/rate
// @desc    Rate a workout
// @access  Private
router.post('/:id/rate', [
  auth,
  body('rating').isFloat({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Update rating
    const newRating = req.body.rating;
    const currentRating = workout.rating;
    
    currentRating.count += 1;
    currentRating.average = ((currentRating.average * (currentRating.count - 1)) + newRating) / currentRating.count;
    
    await workout.save();
    res.json(workout.rating);
  } catch (error) {
    console.error('Rate workout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/workouts/recommended
// @desc    Get recommended workouts for user
// @access  Private
router.get('/recommended', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    
    let query = { isPublic: true };
    
    // Filter by user's fitness level
    query.difficulty = user.fitnessLevel;
    
    // Filter by user's goals
    if (user.fitnessGoals.length > 0) {
      query.targetMuscleGroups = { $in: user.fitnessGoals };
    }
    
    // Filter by preferred duration
    query.duration = { $lte: user.preferredWorkoutDuration + 15 };

    const workouts = await Workout.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ 'rating.average': -1, featured: -1 })
      .limit(6);

    res.json(workouts);
  } catch (error) {
    console.error('Get recommended workouts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
