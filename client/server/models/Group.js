const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['member', 'moderator', 'admin'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  lastActivity: { type: Date, default: Date.now },
  contributionScore: { type: Number, default: 0 },
  permissions: {
    canPost: { type: Boolean, default: true },
    canComment: { type: Boolean, default: true },
    canInvite: { type: Boolean, default: false },
    canModerate: { type: Boolean, default: false }
  }
});

const groupEventSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 1000 },
  date: { type: Date, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  locationName: { type: String, maxlength: 200 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxAttendees: { type: Number },
  isPublic: { type: Boolean, default: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' }
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { 
    type: String, 
    enum: ['running', 'weightlifting', 'yoga', 'crossfit', 'cycling', 'swimming', 'martial-arts', 'dance', 'general-fitness', 'nutrition', 'weight-loss', 'muscle-building', 'endurance', 'flexibility', 'senior-fitness', 'youth-fitness', 'other'],
    required: true 
  },
  type: { type: String, enum: ['public', 'private', 'invite-only'], default: 'public' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [memberSchema],
  coverImage: { type: String },
  avatar: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  locationName: { type: String, maxlength: 200 },
  radius: { type: Number, default: 50 }, // km for local groups
  tags: [{ type: String, maxlength: 50 }],
  hashtag: { type: String, maxlength: 50 },
  rules: [{ type: String, maxlength: 500 }],
  guidelines: { type: String, maxlength: 2000 },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationDate: { type: Date },
  maxMembers: { type: Number },
  currentMembers: { type: Number, default: 0 },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  events: [groupEventSchema],
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
  achievements: [{
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    criteria: { type: String },
    points: { type: Number, default: 0 }
  }],
  stats: {
    totalPosts: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    totalChallenges: { type: Number, default: 0 },
    activeMembers: { type: Number, default: 0 },
    weeklyActivity: { type: Number, default: 0 }
  },
  settings: {
    allowMemberPosts: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    autoApprove: { type: Boolean, default: true },
    allowInvites: { type: Boolean, default: true },
    showMemberList: { type: Boolean, default: true },
    allowDirectMessages: { type: Boolean, default: true }
  },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isModerated: { type: Boolean, default: false },
  moderationReason: { type: String },
  viewCount: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

groupSchema.index({ creator: 1, createdAt: -1 });
groupSchema.index({ category: 1, isActive: 1 });
groupSchema.index({ type: 1, isActive: 1 });
groupSchema.index({ location: '2dsphere' });
groupSchema.index({ tags: 1 });
groupSchema.index({ hashtag: 1 });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ isPublic: 1, isActive: 1, createdAt: -1 });

groupSchema.virtual('memberCount').get(function() {
  return this.members.filter(m => m.isActive).length;
});

groupSchema.virtual('adminCount').get(function() {
  return this.members.filter(m => m.role === 'admin' && m.isActive).length;
});

groupSchema.virtual('moderatorCount').get(function() {
  return this.members.filter(m => m.role === 'moderator' && m.isActive).length;
});

groupSchema.methods.addMember = function(userId, role = 'member') {
  if (this.maxMembers && this.currentMembers >= this.maxMembers) {
    throw new Error('Group is full');
  }
  
  const existingMember = this.members.find(m => m.user.toString() === userId.toString());
  if (existingMember) {
    throw new Error('User is already a member');
  }
  
  const member = {
    user: userId,
    role,
    permissions: {
      canPost: role !== 'member',
      canComment: true,
      canInvite: role === 'admin' || role === 'moderator',
      canModerate: role === 'admin' || role === 'moderator'
    }
  };
  
  this.members.push(member);
  this.currentMembers += 1;
  return this.save();
};

groupSchema.methods.removeMember = function(userId) {
  const memberIndex = this.members.findIndex(m => m.user.toString() === userId.toString());
  if (memberIndex === -1) {
    throw new Error('User is not a member');
  }
  
  this.members.splice(memberIndex, 1);
  this.currentMembers = Math.max(0, this.currentMembers - 1);
  return this.save();
};

groupSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  if (!member) {
    throw new Error('User is not a member');
  }
  
  member.role = newRole;
  member.permissions = {
    canPost: newRole !== 'member',
    canComment: true,
    canInvite: newRole === 'admin' || newRole === 'moderator',
    canModerate: newRole === 'admin' || newRole === 'moderator'
  };
  
  return this.save();
};

groupSchema.methods.isMember = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString() && m.isActive);
};

groupSchema.methods.isAdmin = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString() && m.role === 'admin' && m.isActive);
};

groupSchema.methods.isModerator = function(userId) {
  return this.members.some(m => m.user.toString() === userId.toString() && (m.role === 'admin' || m.role === 'moderator') && m.isActive);
};

groupSchema.methods.canPost = function(userId) {
  const member = this.members.find(m => m.user.toString() === userId.toString() && m.isActive);
  return member && member.permissions.canPost;
};

module.exports = mongoose.model('Group', groupSchema);
