const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Challenge = require('../models/Challenge');
const Group = require('../models/Group');
const Event = require('../models/Event');
const Message = require('../models/Message');
const Conversation = require('../models/Message').Conversation;
const Notification = require('../models/Notification');
const NotificationPreference = require('../models/Notification').NotificationPreference;
const User = require('../models/User');

const router = express.Router();

// ==================== DASHBOARD & FEED ====================

// @route   GET /api/community/dashboard
// @desc    Get community dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts from followed users and public posts
    const followingIds = user.following;
    const postQuery = {
      $or: [
        { user: { $in: followingIds } },
        { isPublic: true }
      ],
      isModerated: false
    };

    const posts = await Post.find(postQuery)
      .populate('user', 'firstName lastName username profilePicture isVerified')
      .populate('workout')
      .populate('progressEntry')
      .populate('meal')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get trending posts
    const trendingPosts = await Post.find({ 
      isPublic: true, 
      isModerated: false,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
      .populate('user', 'firstName lastName username profilePicture isVerified')
      .sort({ engagementScore: -1 })
      .limit(5);

    // Get active challenges
    const activeChallenges = await Challenge.find({ 
      isActive: true, 
      isPublic: true,
      endDate: { $gte: new Date() }
    })
      .populate('creator', 'firstName lastName username profilePicture')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      isPublic: true,
      status: 'published',
      startDate: { $gte: new Date() }
    })
      .populate('organizer', 'firstName lastName username profilePicture')
      .sort({ startDate: 1 })
      .limit(5);

    // Get recommended groups
    const recommendedGroups = await Group.find({
      isActive: true,
      isPublic: true,
      category: { $in: user.fitnessGoals }
    })
      .populate('creator', 'firstName lastName username profilePicture')
      .sort({ 'stats.activeMembers': -1 })
      .limit(5);

    // Get user's community stats
    const userStats = {
      followers: user.followers.length,
      following: user.following.length,
      posts: user.communityStats.totalPosts,
      reputation: user.communityStats.reputation,
      level: user.communityStats.level,
      experience: user.communityStats.experience
    };

    res.json({
      posts,
      trendingPosts,
      activeChallenges,
      upcomingEvents,
      recommendedGroups,
      userStats,
      hasMore: posts.length === limit
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== POSTS ====================

// @route   POST /api/community/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', [
  auth,
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 5000 }).withMessage('Content too long'),
  body('type').isIn(['text', 'photo', 'workout', 'progress', 'meal', 'achievement', 'challenge', 'event']).withMessage('Invalid post type'),
  body('category').optional().isIn(['workout', 'nutrition', 'progress', 'motivation', 'tips', 'general', 'challenge', 'event']),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, type, title, category, tags, hashtags, media, isPublic = true, location, locationName } = req.body;

    const post = new Post({
      user: req.user.id,
      content,
      type,
      title,
      category: category || 'general',
      tags: tags || [],
      hashtags: hashtags || [],
      media: media || [],
      isPublic,
      location,
      locationName
    });

    await post.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.communityStats.totalPosts += 1;
    user.addExperience(10);
    await user.save();

    // Populate user info for response
    await post.populate('user', 'firstName lastName username profilePicture isVerified');

    res.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/community/posts
// @desc    Get posts with filters
// @access  Private
router.get('/posts', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      type, 
      user, 
      hashtag, 
      sort = 'recent',
      search 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { isPublic: true, isModerated: false };

    if (category) query.category = category;
    if (type) query.type = type;
    if (user) query.user = user;
    if (hashtag) query.hashtags = hashtag;
    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'trending') sortOption = { engagementScore: -1 };
    if (sort === 'popular') sortOption = { likeCount: -1 };

    const posts = await Post.find(query)
      .populate('user', 'firstName lastName username profilePicture isVerified')
      .populate('workout')
      .populate('progressEntry')
      .populate('meal')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      total,
      hasMore: skip + posts.length < total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/community/posts/:id
// @desc    Get a specific post
// @access  Private
router.get('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'firstName lastName username profilePicture isVerified')
      .populate('workout')
      .populate('progressEntry')
      .populate('meal')
      .populate('challenge')
      .populate('event')
      .populate('group');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add view
    await post.addView();

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/community/posts/:id
// @desc    Update a post
// @access  Private
router.put('/posts/:id', [
  auth,
  body('content').optional().isLength({ max: 5000 }).withMessage('Content too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { content, title, category, tags, hashtags, media, isPublic } = req.body;

    if (content !== undefined) post.content = content;
    if (title !== undefined) post.title = title;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (hashtags !== undefined) post.hashtags = hashtags;
    if (media !== undefined) post.media = media;
    if (isPublic !== undefined) post.isPublic = isPublic;

    await post.save();
    await post.populate('user', 'firstName lastName username profilePicture isVerified');

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/community/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.remove();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.communityStats.totalPosts = Math.max(0, user.communityStats.totalPosts - 1);
    await user.save();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/community/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    await post.updateEngagementScore();

    res.json({ liked: likeIndex === -1, likeCount: post.likes.length });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/community/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/posts/:id/comment', [
  auth,
  body('content').notEmpty().withMessage('Comment content is required').isLength({ max: 1000 }).withMessage('Comment too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    post.comments.push(comment);
    await post.save();
    await post.updateEngagementScore();

    // Populate the new comment
    const newComment = post.comments[post.comments.length - 1];
    await newComment.populate('user', 'firstName lastName username profilePicture isVerified');

    res.json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
