const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/gyms
// @desc    Get gym data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    res.json({ message: 'Gym integration features coming soon!' });
  } catch (error) {
    console.error('Gyms error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
