const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: [
      'post_like', 'post_comment', 'post_share', 'post_mention',
      'comment_like', 'comment_reply', 'comment_mention',
      'follow', 'unfollow', 'follow_request',
      'challenge_invite', 'challenge_update', 'challenge_complete',
      'event_invite', 'event_reminder', 'event_update', 'event_cancel',
      'group_invite', 'group_join', 'group_post', 'group_event',
      'message_received', 'message_reaction',
      'achievement_unlocked', 'goal_complete', 'streak_milestone',
      'workout_buddy_match', 'workout_reminder',
      'system_announcement', 'maintenance', 'update'
    ],
    required: true 
  },
  title: { type: String, required: true, maxlength: 100 },
  message: { type: String, required: true, maxlength: 500 },
  data: {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: mongoose.Schema.Types.ObjectId },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
    workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
    url: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  deliveryMethod: { 
    type: String, 
    enum: ['in_app', 'email', 'push', 'sms'],
    default: 'in_app'
  },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  expiresAt: { type: Date },
  isActionable: { type: Boolean, default: true },
  actionUrl: { type: String },
  actionText: { type: String },
  icon: { type: String },
  image: { type: String },
  badge: { type: String },
  sound: { type: String },
  vibration: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ isDelivered: 1, deliveryMethod: 1 });
notificationSchema.index({ expiresAt: 1 });

notificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsDelivered = function() {
  this.isDelivered = true;
  this.deliveredAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);

// User notification preferences
const notificationPreferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferences: {
    post_like: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: true } },
    post_comment: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: true } },
    post_share: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: false } },
    post_mention: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    comment_like: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: false } },
    comment_reply: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: true } },
    comment_mention: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    follow: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: true } },
    follow_request: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    challenge_invite: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    challenge_update: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: true } },
    challenge_complete: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    event_invite: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    event_reminder: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    event_update: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    group_invite: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    group_join: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: false } },
    group_post: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: false } },
    message_received: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: true } },
    message_reaction: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: false } },
    achievement_unlocked: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    goal_complete: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    streak_milestone: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    workout_buddy_match: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    workout_reminder: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: false }, push: { type: Boolean, default: true } },
    system_announcement: { in_app: { type: Boolean, default: true }, email: { type: Boolean, default: true }, push: { type: Boolean, default: true } }
  },
  quietHours: {
    enabled: { type: Boolean, default: false },
    startTime: { type: String, default: '22:00' }, // 24-hour format
    endTime: { type: String, default: '08:00' },
    timezone: { type: String, default: 'UTC' }
  },
  emailSettings: {
    frequency: { type: String, enum: ['immediate', 'hourly', 'daily', 'weekly'], default: 'daily' },
    digest: { type: Boolean, default: true },
    unsubscribeToken: { type: String }
  },
  pushSettings: {
    enabled: { type: Boolean, default: true },
    token: { type: String },
    platform: { type: String, enum: ['web', 'ios', 'android'] },
    sound: { type: Boolean, default: true },
    vibration: { type: Boolean, default: true },
    badge: { type: Boolean, default: true }
  },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

notificationPreferenceSchema.index({ user: 1 });

notificationPreferenceSchema.methods.isQuietHours = function() {
  if (!this.quietHours.enabled) return false;
  
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    timeZone: this.quietHours.timezone 
  });
  
  const start = this.quietHours.startTime;
  const end = this.quietHours.endTime;
  
  if (start <= end) {
    return currentTime >= start && currentTime <= end;
  } else {
    // Handles overnight quiet hours (e.g., 22:00 to 08:00)
    return currentTime >= start || currentTime <= end;
  }
};

notificationPreferenceSchema.methods.shouldSendNotification = function(type, method) {
  if (this.isQuietHours() && method === 'push') {
    return false;
  }
  
  const preference = this.preferences[type];
  if (!preference) return false;
  
  return preference[method] || false;
};

module.exports.NotificationPreference = mongoose.model('NotificationPreference', notificationPreferenceSchema);
