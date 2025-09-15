const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const NotificationPreference = require('../models/Notification').NotificationPreference;
const User = require('../models/User');
const Workout = require('../models/Workout');
const inMemoryStorage = require('../utils/inMemoryStorage');

// Helper: select a workout tailored to the user's fitness level.
async function selectWorkoutForUser(userId) {
  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];

  // Read user's fitness level if present; default beginner
  const user = await User.findById(userId).select('fitnessLevel').lean();
  const level = user?.fitnessLevel || 'beginner';
  const levelIndex = Math.max(0, difficultyOrder.indexOf(level));
  const allowedDifficulties = difficultyOrder.slice(0, levelIndex + 1);

  // Try to sample one workout within allowed difficulties
  let results = await Workout.aggregate([
    { $match: { difficulty: { $in: allowedDifficulties } } },
    { $sample: { size: 1 } }
  ]);

  if (!results || results.length === 0) {
    // Fallback: sample any workout configured in DB
    results = await Workout.aggregate([{ $sample: { size: 1 } }]);
  }

  return results && results.length > 0 ? results[0] : null;
}

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;

    const isConnected = req.app.locals.dbConnected;
    let notifications = [];

    if (isConnected) {
      let query = { recipient: req.user.id };
      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      notifications = await Notification.find(query)
        .populate('sender', 'firstName lastName profilePicture')
        .populate('data.post', 'title content')
        .populate('data.challenge', 'title description')
        .populate('data.event', 'title description')
        .populate('data.group', 'name description')
        .populate('data.workout', 'name description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Mark notifications as delivered
      await Notification.updateMany(
        { recipient: req.user.id, isDelivered: false },
        { isDelivered: true, deliveredAt: new Date() }
      );
    } else {
      // In-memory fallback
      const allNotifications = await inMemoryStorage.getAllNotifications();
      notifications = allNotifications
        .filter(notif => notif.recipient === req.user.id)
        .filter(notif => unreadOnly !== 'true' || !notif.isRead)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(skip, skip + parseInt(limit));
    }

    // Get unread count
    const unreadCount = isConnected 
      ? await Notification.countDocuments({ recipient: req.user.id, isRead: false })
      : (await inMemoryStorage.getAllNotifications()).filter(n => n.recipient === req.user.id && !n.isRead).length;

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: notifications.length
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const isConnected = req.app.locals.dbConnected;
    
    if (isConnected) {
      const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, recipient: req.user.id },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
    } else {
      // In-memory fallback
      const notifications = await inMemoryStorage.getAllNotifications();
      const notification = notifications.find(n => n._id === req.params.id && n.recipient === req.user.id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      notification.isRead = true;
      notification.readAt = new Date();
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    const isConnected = req.app.locals.dbConnected;
    
    if (isConnected) {
      await Notification.updateMany(
        { recipient: req.user.id, isRead: false },
        { isRead: true, readAt: new Date() }
      );
    } else {
      // In-memory fallback
      const notifications = await inMemoryStorage.getAllNotifications();
      notifications
        .filter(n => n.recipient === req.user.id && !n.isRead)
        .forEach(n => {
          n.isRead = true;
          n.readAt = new Date();
        });
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const isConnected = req.app.locals.dbConnected;
    
    if (isConnected) {
      const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user.id
      });

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
    } else {
      // In-memory fallback
      const notifications = await inMemoryStorage.getAllNotifications();
      const notificationIndex = notifications.findIndex(n => n._id === req.params.id && n.recipient === req.user.id);
      
      if (notificationIndex === -1) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      notifications.splice(notificationIndex, 1);
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/daily-workout
// @desc    Get daily workout suggestion
// @access  Private
router.get('/daily-workout', auth, async (req, res) => {
  try {
    const isConnected = req.app.locals.dbConnected;
    let workout = null;

    if (isConnected) {
      // Get user's fitness level and goals
      const user = await User.findById(req.user.id).select('fitnessLevel fitnessGoals');
      
      // Get random workout based on user's fitness level
      const workouts = await Workout.find({
        difficulty: user.fitnessLevel || 'beginner'
      }).limit(10);

      if (workouts.length > 0) {
        const randomIndex = Math.floor(Math.random() * workouts.length);
        workout = workouts[randomIndex];
      }
    } else {
      // In-memory fallback - create a simple workout suggestion
      const workoutTypes = [
        'Push-ups Challenge',
        'Plank Hold',
        'Squat Variations',
        'Burpee Workout',
        'Mountain Climbers',
        'Jumping Jacks',
        'Lunges',
        'High Knees',
        'Wall Sit',
        'Calf Raises'
      ];

      const randomType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      workout = {
        _id: `workout_${Date.now()}`,
        name: `Daily ${randomType}`,
        description: `Complete 3 sets of ${randomType.toLowerCase()} for 30 seconds each with 30 seconds rest between sets.`,
        difficulty: 'beginner',
        duration: 10,
        exercises: [
          {
            name: randomType,
            sets: 3,
            reps: '30 seconds',
            rest: '30 seconds'
          }
        ]
      };
    }

    if (!workout) {
      return res.status(404).json({ error: 'No workout suggestions available' });
    }

    res.json({
      workout,
      message: 'Your daily workout suggestion is ready!',
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Get daily workout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/notifications/create-daily-suggestion
// @desc    Create daily workout suggestion notification
// @access  Private
router.post('/create-daily-suggestion', auth, async (req, res) => {
  try {
    const isConnected = req.app.locals.dbConnected;
    
    // Check if daily suggestion already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let existingNotification = null;
    if (isConnected) {
      existingNotification = await Notification.findOne({
        recipient: req.user.id,
        type: 'workout_reminder',
        'data.metadata.isDailySuggestion': true,
        createdAt: { $gte: today, $lt: tomorrow }
      });
    }

    if (existingNotification) {
      return res.json({ 
        message: 'Daily workout suggestion already exists for today',
        notification: existingNotification
      });
    }

    // Get daily workout suggestion directly
    let workout = null;

    if (isConnected) {
      workout = await selectWorkoutForUser(req.user.id);
    } else {
      // In-memory fallback – use a lightweight suggestion structure
      workout = {
        _id: `workout_${Date.now()}`,
        name: 'Daily Fitness Challenge',
        difficulty: 'beginner',
        duration: 30,
        description: 'A quick 30-minute workout to keep you active today!'
      };
    }

    if (!workout) {
      return res.status(404).json({ error: 'No workouts available in database' });
    }

    // Create notification
    const notificationData = {
      recipient: req.user.id,
      type: 'workout_reminder',
      title: 'Daily Workout Suggestion',
      message: `Ready for today's workout? Try: ${workout.name}`,
      data: {
        workout: workout._id,
        metadata: {
          isDailySuggestion: true,
          workoutType: workout.name,
          difficulty: workout.difficulty,
          duration: workout.duration
        }
      },
      priority: 'normal',
      isActionable: true,
      actionUrl: `/workouts/${workout._id}`,
      actionText: 'Start Workout',
      icon: 'dumbbell',
      deliveryMethod: 'in_app'
    };

    let notification;
    if (isConnected) {
      notification = new Notification(notificationData);
      await notification.save();
    } else {
      // In-memory fallback
      notification = {
        _id: `notif_${Date.now()}`,
        ...notificationData,
        createdAt: new Date(),
        isRead: false,
        isDelivered: false
      };
      await inMemoryStorage.addNotification(notification);
    }

    res.json({
      message: 'Daily workout suggestion created',
      notification
    });
  } catch (error) {
    console.error('Create daily suggestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
