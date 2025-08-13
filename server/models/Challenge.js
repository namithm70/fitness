const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  goal: { type: Number, required: true },
  unit: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
  completedAt: { type: Date },
  updates: [{
    date: { type: Date, default: Date.now },
    progress: { type: Number, required: true },
    notes: { type: String, maxlength: 500 },
    photo: { type: String }
  }],
  achievements: [{ type: String }],
  points: { type: Number, default: 0 }
});

const milestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  targetValue: { type: Number, required: true },
  reward: { type: String },
  points: { type: Number, default: 0 },
  badge: { type: String }
});

const challengeSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  type: { 
    type: String, 
    enum: ['weight-loss', 'strength', 'endurance', 'flexibility', 'workout-frequency', 'nutrition', 'custom'],
    required: true 
  },
  category: { 
    type: String, 
    enum: ['individual', 'team', 'global', 'local'],
    default: 'individual'
  },
  goalType: { 
    type: String, 
    enum: ['target', 'improvement', 'streak', 'frequency'],
    required: true 
  },
  targetValue: { type: Number, required: true },
  unit: { type: String, required: true },
  duration: { type: Number, required: true }, // in days
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  isPublic: { type: Boolean, default: true },
  maxParticipants: { type: Number },
  currentParticipants: { type: Number, default: 0 },
  participants: [participantSchema],
  milestones: [milestoneSchema],
  rules: [{ type: String, maxlength: 500 }],
  rewards: {
    firstPlace: { type: String },
    secondPlace: { type: String },
    thirdPlace: { type: String },
    participation: { type: String }
  },
  tags: [{ type: String, maxlength: 50 }],
  hashtag: { type: String, maxlength: 50 },
  coverImage: { type: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
  ageGroup: { type: String, enum: ['all', 'teens', 'adults', 'seniors'] },
  gender: { type: String, enum: ['all', 'male', 'female'] },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  locationName: { type: String, maxlength: 200 },
  radius: { type: Number, default: 50 }, // km for local challenges
  entryFee: { type: Number, default: 0 },
  prizePool: { type: Number, default: 0 },
  verificationRequired: { type: Boolean, default: false },
  autoVerification: { type: Boolean, default: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isModerated: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

challengeSchema.index({ creator: 1, createdAt: -1 });
challengeSchema.index({ type: 1, isActive: 1 });
challengeSchema.index({ category: 1, isActive: 1 });
challengeSchema.index({ startDate: 1, endDate: 1 });
challengeSchema.index({ location: '2dsphere' });
challengeSchema.index({ tags: 1 });
challengeSchema.index({ hashtag: 1 });
challengeSchema.index({ isPublic: 1, isActive: 1, createdAt: -1 });

challengeSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

challengeSchema.virtual('progressPercentage').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const totalDuration = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
});

challengeSchema.methods.addParticipant = function(userId, goal) {
  if (this.maxParticipants && this.currentParticipants >= this.maxParticipants) {
    throw new Error('Challenge is full');
  }
  
  const participant = {
    user: userId,
    goal: goal,
    unit: this.unit
  };
  
  this.participants.push(participant);
  this.currentParticipants += 1;
  return this.save();
};

challengeSchema.methods.updateParticipantProgress = function(userId, progress, notes, photo) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (!participant) {
    throw new Error('User is not a participant');
  }
  
  participant.progress = progress;
  participant.updates.push({
    progress,
    notes,
    photo
  });
  
  // Check if goal is reached
  if (progress >= participant.goal && participant.status === 'active') {
    participant.status = 'completed';
    participant.completedAt = new Date();
  }
  
  return this.save();
};

challengeSchema.methods.getLeaderboard = function() {
  return this.participants
    .filter(p => p.status === 'active' || p.status === 'completed')
    .sort((a, b) => {
      const aProgress = (a.progress / a.goal) * 100;
      const bProgress = (b.progress / b.goal) * 100;
      return bProgress - aProgress;
    });
};

module.exports = mongoose.model('Challenge', challengeSchema);
