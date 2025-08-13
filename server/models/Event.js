const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['attending', 'maybe', 'declined'], default: 'attending' },
  rsvpDate: { type: Date, default: Date.now },
  notes: { type: String, maxlength: 500 },
  isOrganizer: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  type: { 
    type: String, 
    enum: ['workout', 'race', 'competition', 'meetup', 'class', 'workshop', 'seminar', 'challenge', 'social', 'other'],
    required: true 
  },
  category: { 
    type: String, 
    enum: ['running', 'weightlifting', 'yoga', 'crossfit', 'cycling', 'swimming', 'martial-arts', 'dance', 'general-fitness', 'nutrition', 'wellness', 'sports', 'other'],
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  timezone: { type: String, default: 'UTC' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  locationName: { type: String, required: true, maxlength: 200 },
  address: { type: String, maxlength: 500 },
  venue: { type: String, maxlength: 200 },
  isOnline: { type: Boolean, default: false },
  onlineUrl: { type: String },
  onlinePlatform: { type: String, enum: ['zoom', 'teams', 'google-meet', 'skype', 'other'] },
  attendees: [attendeeSchema],
  maxAttendees: { type: Number },
  currentAttendees: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
  isFree: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  registrationRequired: { type: Boolean, default: false },
  registrationDeadline: { type: Date },
  status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'draft' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all-levels'], default: 'all-levels' },
  ageGroup: { type: String, enum: ['all', 'teens', 'adults', 'seniors'] },
  gender: { type: String, enum: ['all', 'male', 'female'] },
  tags: [{ type: String, maxlength: 50 }],
  hashtag: { type: String, maxlength: 50 },
  coverImage: { type: String },
  images: [{ type: String }],
  requirements: [{ type: String, maxlength: 200 }],
  equipment: [{ type: String, maxlength: 100 }],
  schedule: [{
    time: { type: String, required: true },
    activity: { type: String, required: true },
    duration: { type: Number }, // in minutes
    description: { type: String, maxlength: 500 }
  }],
  instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sponsors: [{ type: String, maxlength: 100 }],
  prizes: [{ type: String, maxlength: 200 }],
  rules: [{ type: String, maxlength: 500 }],
  safetyGuidelines: [{ type: String, maxlength: 500 }],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  relatedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  viewCount: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isModerated: { type: Boolean, default: false },
  moderationReason: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

eventSchema.index({ organizer: 1, createdAt: -1 });
eventSchema.index({ type: 1, status: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ location: '2dsphere' });
eventSchema.index({ tags: 1 });
eventSchema.index({ hashtag: 1 });
eventSchema.index({ isPublic: 1, status: 1, startDate: 1 });
eventSchema.index({ 'attendees.user': 1 });

eventSchema.virtual('daysUntilEvent').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const diffTime = start - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

eventSchema.virtual('isUpcoming').get(function() {
  return this.daysUntilEvent > 0 && this.status === 'published';
});

eventSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  return now >= start && now <= end && this.status === 'published';
});

eventSchema.virtual('isPast').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  return now > end;
});

eventSchema.virtual('attendingCount').get(function() {
  return this.attendees.filter(a => a.status === 'attending').length;
});

eventSchema.virtual('maybeCount').get(function() {
  return this.attendees.filter(a => a.status === 'maybe').length;
});

eventSchema.methods.addAttendee = function(userId, status = 'attending', notes = '') {
  if (this.maxAttendees && this.currentAttendees >= this.maxAttendees) {
    throw new Error('Event is full');
  }
  
  const existingAttendee = this.attendees.find(a => a.user.toString() === userId.toString());
  if (existingAttendee) {
    throw new Error('User is already registered for this event');
  }
  
  const attendee = {
    user: userId,
    status,
    notes
  };
  
  this.attendees.push(attendee);
  if (status === 'attending') {
    this.currentAttendees += 1;
  }
  return this.save();
};

eventSchema.methods.updateAttendeeStatus = function(userId, newStatus) {
  const attendee = this.attendees.find(a => a.user.toString() === userId.toString());
  if (!attendee) {
    throw new Error('User is not registered for this event');
  }
  
  const oldStatus = attendee.status;
  attendee.status = newStatus;
  attendee.rsvpDate = new Date();
  
  // Update current attendee count
  if (oldStatus === 'attending' && newStatus !== 'attending') {
    this.currentAttendees = Math.max(0, this.currentAttendees - 1);
  } else if (oldStatus !== 'attending' && newStatus === 'attending') {
    this.currentAttendees += 1;
  }
  
  return this.save();
};

eventSchema.methods.removeAttendee = function(userId) {
  const attendeeIndex = this.attendees.findIndex(a => a.user.toString() === userId.toString());
  if (attendeeIndex === -1) {
    throw new Error('User is not registered for this event');
  }
  
  const attendee = this.attendees[attendeeIndex];
  if (attendee.status === 'attending') {
    this.currentAttendees = Math.max(0, this.currentAttendees - 1);
  }
  
  this.attendees.splice(attendeeIndex, 1);
  return this.save();
};

eventSchema.methods.isAttending = function(userId) {
  return this.attendees.some(a => a.user.toString() === userId.toString() && a.status === 'attending');
};

eventSchema.methods.isOrganizer = function(userId) {
  return this.organizer.toString() === userId.toString() || 
         this.attendees.some(a => a.user.toString() === userId.toString() && a.isOrganizer);
};

module.exports = mongoose.model('Event', eventSchema);
