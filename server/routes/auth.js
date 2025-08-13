const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
// const { validateRegistration, validateLogin } = require('../middleware/validation');
const { InMemoryStorage: inMemoryStorage } = require('../utils/inMemoryStorage');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, fitnessLevel, fitnessGoals } = req.body;

    // Check if database is connected
    const isConnected = req.app.locals.dbConnected;

    if (isConnected) {
      // Use MongoDB
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      user = new User({
        email,
        password,
        firstName,
        lastName,
        fitnessLevel: fitnessLevel || 'beginner',
        fitnessGoals: fitnessGoals || []
      });

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              fitnessLevel: user.fitnessLevel,
              fitnessGoals: user.fitnessGoals
            }
          });
        }
      );
    } else {
      // Use in-memory storage
      try {
        const user = await inMemoryStorage.createUser({
          email,
          password,
          firstName,
          lastName,
          fitnessLevel,
          fitnessGoals
        });

        const token = inMemoryStorage.generateToken(user);
        const publicUser = inMemoryStorage.getUserPublicData(user);

        res.json({
          token,
          user: publicUser
        });
      } catch (error) {
        if (error.message === 'User already exists') {
          return res.status(400).json({ error: 'User already exists' });
        }
        throw error;
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if database is connected
    const isConnected = req.app.locals.dbConnected;

    if (isConnected) {
      // Use MongoDB
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              fitnessLevel: user.fitnessLevel,
              fitnessGoals: user.fitnessGoals,
              profilePicture: user.profilePicture
            }
          });
        }
      );
    } else {
      // Use in-memory storage
      const user = await inMemoryStorage.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await inMemoryStorage.comparePassword(email, password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = inMemoryStorage.generateToken(user);
      const publicUser = inMemoryStorage.getUserPublicData(user);

      res.json({
        token,
        user: publicUser
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/user
// @desc    Get authenticated user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const isConnected = req.app.locals.dbConnected;

    if (isConnected) {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } else {
      const user = await inMemoryStorage.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const publicUser = inMemoryStorage.getUserPublicData(user);
      res.json(publicUser);
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // For now, just return the token
    res.json({ 
      message: 'Password reset email sent',
      resetToken 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Update password
    user.password = password;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/social-login
// @desc    Social media login (Google, Facebook)
// @access  Public
router.post('/social-login', async (req, res) => {
  try {
    const { provider, socialId, email, firstName, lastName, profilePicture } = req.body;

    let user = await User.findOne({
      [`socialLogin.${provider}.id`]: socialId
    });

    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ email });
      
      if (user) {
        // Link social account to existing user
        user.socialLogin[provider] = { id: socialId, email };
        await user.save();
      } else {
        // Create new user
        user = new User({
          email,
          firstName,
          lastName,
          profilePicture,
          socialLogin: {
            [provider]: { id: socialId, email }
          },
          isEmailVerified: true // Social login users are considered verified
        });
        await user.save();
      }
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture
          }
        });
      }
    );
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', [
  body('token').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
