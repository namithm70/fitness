const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress
// @desc    Get progress data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    res.json({ message: 'Progress tracking features coming soon!' });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
