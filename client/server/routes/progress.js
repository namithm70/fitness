const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const ProgressEntry = require('../models/ProgressEntry');
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Workout = require('../models/Workout');

const router = express.Router();

// @route   GET /api/progress/dashboard
// @desc    Get progress dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Get recent progress entries
    const recentEntries = await ProgressEntry.find({
      user: userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 }).limit(10);

    // Get weight trend (last 30 days)
    const weightEntries = await ProgressEntry.find({
      user: userId,
      type: 'weight',
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Get active goals
    const activeGoals = await Goal.find({
      user: userId,
      status: 'active'
    }).sort({ targetDate: 1 }).limit(5);

    // Get recent achievements
    const recentAchievements = await Achievement.find({
      user: userId
    }).sort({ achievedAt: -1 }).limit(5);

    // Get workout stats
    const workoutStats = await Workout.aggregate([
      { $match: { createdBy: userId } },
      { $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalDuration: { $sum: '$duration' },
        avgDuration: { $avg: '$duration' }
      }}
    ]);

    // Calculate BMI if height and weight available
    const user = await User.findById(userId);
    let bmi = null;
    if (user.height && weightEntries.length > 0) {
      const latestWeight = weightEntries[weightEntries.length - 1].weight;
      bmi = (latestWeight / Math.pow(user.height / 100, 2)).toFixed(1);
    }

    // Get measurement trends
    const measurementEntries = await ProgressEntry.find({
      user: userId,
      type: 'measurements',
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    const dashboardData = {
      recentEntries,
      weightTrend: weightEntries,
      activeGoals,
      recentAchievements,
      workoutStats: workoutStats[0] || { totalWorkouts: 0, totalDuration: 0, avgDuration: 0 },
      bmi,
      measurementTrend: measurementEntries,
      summary: {
        totalEntries: await ProgressEntry.countDocuments({ user: userId }),
        totalGoals: await Goal.countDocuments({ user: userId }),
        completedGoals: await Goal.countDocuments({ user: userId, status: 'completed' }),
        totalAchievements: await Achievement.countDocuments({ user: userId })
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Progress dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/progress/entries
// @desc    Create a new progress entry
// @access  Private
router.post('/entries', [
  auth,
  body('type').isIn(['weight', 'measurements', 'body-fat', 'progress-photo', 'strength', 'endurance', 'flexibility']),
  body('date').optional().isISO8601(),
  body('weight').optional().isFloat({ min: 30, max: 300 }),
  body('bodyFatPercentage').optional().isFloat({ min: 0, max: 50 }),
  body('muscleMass').optional().isFloat({ min: 0, max: 200 }),
  body('notes').optional().isLength({ max: 1000 }),
  body('mood').optional().isIn(['excellent', 'good', 'okay', 'poor', 'terrible']),
  body('energyLevel').optional().isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entryData = {
      user: req.user.id,
      ...req.body
    };

    if (req.body.date) {
      entryData.date = new Date(req.body.date);
    }

    const entry = new ProgressEntry(entryData);
    await entry.save();

    res.json(entry);
  } catch (error) {
    console.error('Create progress entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/progress/entries
// @desc    Get progress entries with filters
// @access  Private
router.get('/entries', auth, async (req, res) => {
  try {
    const {
      type,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;
    let query = { user: req.user.id };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const entries = await ProgressEntry.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ProgressEntry.countDocuments(query);

    res.json({
      entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get progress entries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/progress/entries/:id
// @desc    Update a progress entry
// @access  Private
router.put('/entries/:id', [
  auth,
  body('weight').optional().isFloat({ min: 30, max: 300 }),
  body('bodyFatPercentage').optional().isFloat({ min: 0, max: 50 }),
  body('muscleMass').optional().isFloat({ min: 0, max: 200 }),
  body('notes').optional().isLength({ max: 1000 }),
  body('mood').optional().isIn(['excellent', 'good', 'okay', 'poor', 'terrible']),
  body('energyLevel').optional().isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entry = await ProgressEntry.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({ error: 'Progress entry not found' });
    }

    Object.assign(entry, req.body);
    await entry.save();

    res.json(entry);
  } catch (error) {
    console.error('Update progress entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/progress/entries/:id
// @desc    Delete a progress entry
// @access  Private
router.delete('/entries/:id', auth, async (req, res) => {
  try {
    const entry = await ProgressEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({ error: 'Progress entry not found' });
    }

    res.json({ message: 'Progress entry deleted' });
  } catch (error) {
    console.error('Delete progress entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/progress/goals
// @desc    Create a new goal
// @access  Private
router.post('/goals', [
  auth,
  body('title').isLength({ min: 1, max: 100 }),
  body('type').isIn(['weight', 'strength', 'endurance', 'flexibility', 'measurements', 'workout-frequency', 'custom']),
  body('targetValue').isFloat({ min: 0 }),
  body('unit').isIn(['kg', 'lbs', 'cm', 'inches', 'reps', 'minutes', 'km', 'miles', 'workouts', 'days', 'custom']),
  body('targetDate').isISO8601(),
  body('description').optional().isLength({ max: 500 }),
  body('priority').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goalData = {
      user: req.user.id,
      ...req.body,
      targetDate: new Date(req.body.targetDate)
    };

    const goal = new Goal(goalData);
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/progress/goals
// @desc    Get user goals
// @access  Private
router.get('/goals', auth, async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = { user: req.user.id };

    if (status) query.status = status;
    if (type) query.type = type;

    const goals = await Goal.find(query).sort({ targetDate: 1 });
    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/progress/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/goals/:id', [
  auth,
  body('title').optional().isLength({ min: 1, max: 100 }),
  body('targetValue').optional().isFloat({ min: 0 }),
  body('targetDate').optional().isISO8601(),
  body('status').optional().isIn(['active', 'completed', 'paused', 'cancelled']),
  body('currentValue').optional().isFloat({ min: 0 }),
  body('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    if (req.body.targetDate) {
      req.body.targetDate = new Date(req.body.targetDate);
    }

    Object.assign(goal, req.body);
    await goal.save();

    res.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/progress/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/goals/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/progress/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user.id })
      .sort({ achievedAt: -1 });

    res.json(achievements);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/progress/analytics
// @desc    Get progress analytics and trends
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));

    // Weight trend
    const weightData = await ProgressEntry.find({
      user: req.user.id,
      type: 'weight',
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Measurement trends
    const measurementData = await ProgressEntry.find({
      user: req.user.id,
      type: 'measurements',
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Workout frequency
    const workoutData = await Workout.aggregate([
      { $match: { 
        createdBy: req.user.id,
        createdAt: { $gte: startDate }
      }},
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
        totalDuration: { $sum: "$duration" }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Goal progress
    const activeGoals = await Goal.find({
      user: req.user.id,
      status: 'active'
    });

    const analytics = {
      weightTrend: weightData,
      measurementTrend: measurementData,
      workoutFrequency: workoutData,
      goalProgress: activeGoals,
      summary: {
        totalEntries: await ProgressEntry.countDocuments({ user: req.user.id }),
        totalGoals: await Goal.countDocuments({ user: req.user.id }),
        completedGoals: await Goal.countDocuments({ user: req.user.id, status: 'completed' }),
        totalAchievements: await Achievement.countDocuments({ user: req.user.id })
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
