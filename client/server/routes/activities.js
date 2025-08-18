const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

// @route   POST /api/activities
// @desc    Log a new activity
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, action, details, completed = true } = req.body;
    
    const newActivity = new Activity({
      userId: req.user.id,
      type,
      action,
      details,
      completed,
      timestamp: new Date()
    });

    const activity = await newActivity.save();
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/activities/user/:userId
// @desc    Get user's activity history
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, type, completed } = req.query;
    
    // Build filter object
    const filter = { userId };
    
    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    const activities = await Activity.find(filter)
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/activities/user/:userId/history
// @desc    Get user's daily activity history grouped by date
// @access  Private
router.get('/user/:userId/history', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));
    
    const activities = await Activity.find({
      userId,
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ timestamp: -1 });
    
    // Group activities by date
    const dailyHistory = [];
    const dateMap = new Map();
    
    activities.forEach(activity => {
      const dateStr = activity.timestamp.toISOString().split('T')[0];
      
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          activities: [],
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0
        });
      }
      
      const dayData = dateMap.get(dateStr);
      dayData.activities.push(activity);
      
      if (activity.type === 'workout') {
        dayData.totalWorkouts++;
        dayData.totalDuration += activity.details.duration || 0;
        dayData.totalCalories += activity.details.calories || 0;
      }
    });
    
    // Convert map to array and sort by date
    const history = Array.from(dateMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/activities/user/:userId/stats
// @desc    Get user's activity statistics
// @access  Private
router.get('/user/:userId/stats', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = 'week' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    const activities = await Activity.find({
      userId,
      timestamp: { $gte: startDate }
    });
    
    const stats = {
      totalActivities: activities.length,
      totalWorkouts: activities.filter(a => a.type === 'workout').length,
      totalExercises: activities.filter(a => a.type === 'exercise').length,
      totalNutrition: activities.filter(a => a.type === 'nutrition').length,
      totalProgress: activities.filter(a => a.type === 'progress').length,
      totalGoals: activities.filter(a => a.type === 'goal').length,
      totalDuration: activities
        .filter(a => a.type === 'workout')
        .reduce((sum, a) => sum + (a.details.duration || 0), 0),
      totalCalories: activities
        .filter(a => a.type === 'workout')
        .reduce((sum, a) => sum + (a.details.calories || 0), 0),
      completionRate: activities.length > 0 
        ? (activities.filter(a => a.completed).length / activities.length * 100).toFixed(1)
        : 0
    };
    
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete an activity
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    
    // Make sure user owns the activity
    if (activity.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await activity.remove();
    res.json({ msg: 'Activity removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Activity not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
