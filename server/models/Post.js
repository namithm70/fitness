const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['text', 'photo', 'workout', 'progress', 'meal', 'achievement', 'challenge', 'event'], 
    required: true 
  },
  title: { type: String, trim: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 5000 },
  media: [{
    type: { type: String, enum: ['image', 'video', 'gif'], required: true },
    url: { type: String, required: true },
    caption: { type: String, maxlength: 500 },
    thumbnail: String
  }],
  category: { 
    type: String, 
    enum: ['workout', 'nutrition', 'progress', 'motivation', 'tips', 'general', 'challenge', 'event'],
    default: 'general'
  },
  tags: [{ type: String, maxlength: 50 }],
  hashtags: [{ type: String, maxlength: 50 }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  progressEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'ProgressEntry' },
  meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  locationName: { type: String, maxlength: 200 },
  isPublic: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isModerated: { type: Boolean, default: false },
  moderationReason: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ location: '2dsphere' });
postSchema.index({ content: 'text', title: 'text' });
postSchema.index({ isPublic: 1, createdAt: -1 });
postSchema.index({ isFeatured: 1, createdAt: -1 });

postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

postSchema.virtual('shareCount').get(function() {
  return this.shares.length;
});

postSchema.methods.updateEngagementScore = function() {
  this.engagementScore = (this.likes.length * 1) + (this.comments.length * 2) + (this.shares.length * 3) + (this.viewCount * 0.1);
  return this.save();
};

postSchema.methods.addView = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);
