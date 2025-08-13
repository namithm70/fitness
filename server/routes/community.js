const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/community
// @desc    Get community data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    res.json({ message: 'Community features coming soon!' });
  } catch (error) {
    console.error('Community error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
