const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  type: { type: String, enum: ['direct', 'group'], required: true },
  content: { type: String, required: true, maxlength: 2000 },
  media: [{
    type: { type: String, enum: ['image', 'video', 'audio', 'file'], required: true },
    url: { type: String, required: true },
    filename: { type: String },
    size: { type: Number },
    duration: { type: Number } // for audio/video
  }],
  messageType: { type: String, enum: ['text', 'image', 'video', 'audio', 'file', 'location', 'contact'], default: 'text' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: { type: String }
  },
  contact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  isRead: { type: Boolean, default: false },
  readBy: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  originalContent: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  forwardedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ group: 1, createdAt: -1 });
messageSchema.index({ type: 1, createdAt: -1 });
messageSchema.index({ isRead: 1, recipient: 1 });
messageSchema.index({ isRead: 1, group: 1 });

messageSchema.virtual('isDirect').get(function() {
  return this.type === 'direct';
});

messageSchema.virtual('isGroup').get(function() {
  return this.type === 'group';
});

messageSchema.methods.markAsRead = function(userId) {
  if (this.isRead) return this;
  
  const existingRead = this.readBy.find(r => r.user.toString() === userId.toString());
  if (!existingRead) {
    this.readBy.push({ user: userId });
  }
  
  this.isRead = true;
  return this.save();
};

messageSchema.methods.addReaction = function(userId, emoji) {
  const existingReaction = this.reactions.find(r => r.user.toString() === userId.toString());
  if (existingReaction) {
    existingReaction.emoji = emoji;
    existingReaction.createdAt = new Date();
  } else {
    this.reactions.push({ user: userId, emoji });
  }
  return this.save();
};

messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  return this.save();
};

messageSchema.methods.edit = function(newContent) {
  this.originalContent = this.content;
  this.content = newContent;
  this.isEdited = true;
  this.editedAt = new Date();
  return this.save();
};

messageSchema.methods.delete = function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);

// Conversation model to group messages
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: ['direct', 'group'], required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastMessageAt: { type: Date },
  unreadCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  isMuted: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ type: 1, lastMessageAt: -1 });
conversationSchema.index({ group: 1 });
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.methods.updateLastMessage = function(messageId) {
  this.lastMessage = messageId;
  this.lastMessageAt = new Date();
  return this.save();
};

conversationSchema.methods.incrementUnread = function() {
  this.unreadCount += 1;
  return this.save();
};

conversationSchema.methods.markAsRead = function() {
  this.unreadCount = 0;
  return this.save();
};

module.exports.Conversation = mongoose.model('Conversation', conversationSchema);
