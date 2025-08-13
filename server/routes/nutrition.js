const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/nutrition
// @desc    Get nutrition data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    res.json({ message: 'Nutrition features coming soon!' });
  } catch (error) {
    console.error('Nutrition error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
