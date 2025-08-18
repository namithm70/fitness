// ==================== POSTS ====================

export interface Comment {
  _id: string;
  user: User;
  content: string;
  likes: string[];
  replies: CommentReply[];
  createdAt: string;
}

export interface CommentReply {
  user: User;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface Post {
  _id: string;
  user: User;
  type: 'text' | 'photo' | 'video' | 'workout' | 'progress' | 'meal' | 'achievement' | 'challenge' | 'event';
  title?: string;
  content: string;
  media: Media[];
  category: 'workout' | 'nutrition' | 'progress' | 'motivation' | 'tips' | 'general' | 'challenge' | 'event';
  tags: string[];
  hashtags: string[];
  likes: string[];
  bookmarks: string[];
  shares: string[];
  comments: Comment[];
  workout?: any;
  progressEntry?: any;
  meal?: any;
  challenge?: any;
  event?: any;
  group?: any;
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
  isPublic: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  viewCount: number;
  engagementScore: number;
  reportedBy: string[];
  isModerated: boolean;
  moderationReason?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  type: 'image' | 'video' | 'gif';
  url: string;
  caption?: string;
  thumbnail?: string;
}

export interface PostCreate {
  content: string;
  type: 'text' | 'photo' | 'video' | 'workout' | 'progress' | 'meal' | 'achievement' | 'challenge' | 'event';
  title?: string;
  category?: 'workout' | 'nutrition' | 'progress' | 'motivation' | 'tips' | 'general' | 'challenge' | 'event';
  tags?: string[];
  hashtags?: string[];
  media?: Media[];
  isPublic?: boolean;
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
}

// ==================== CHALLENGES ====================

export interface ChallengeParticipant {
  user: string;
  joinedAt: string;
  progress: number;
  goal: number;
  unit: string;
  status: 'active' | 'completed' | 'dropped';
  completedAt?: string;
  updates: ChallengeUpdate[];
  achievements: string[];
  points: number;
}

export interface ChallengeUpdate {
  date: string;
  progress: number;
  notes?: string;
  photo?: string;
}

export interface ChallengeMilestone {
  name: string;
  description?: string;
  targetValue: number;
  reward?: string;
  points: number;
  badge?: string;
}

export interface Challenge {
  _id: string;
  creator: User;
  title: string;
  description: string;
  type: 'weight-loss' | 'strength' | 'endurance' | 'flexibility' | 'workout-frequency' | 'nutrition' | 'custom';
  category: 'individual' | 'team' | 'global' | 'local';
  goalType: 'target' | 'improvement' | 'streak' | 'frequency';
  targetValue: number;
  unit: string;
  duration: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isPublic: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  participants: ChallengeParticipant[];
  milestones: ChallengeMilestone[];
  rules: string[];
  rewards: {
    firstPlace?: string;
    secondPlace?: string;
    thirdPlace?: string;
    participation?: string;
  };
  tags: string[];
  hashtag?: string;
  coverImage?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  ageGroup: 'all' | 'teens' | 'adults' | 'seniors';
  gender: 'all' | 'male' | 'female';
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
  radius: number;
  entryFee: number;
  prizePool: number;
  verificationRequired: boolean;
  autoVerification: boolean;
  moderators: string[];
  reportedBy: string[];
  isModerated: boolean;
  viewCount: number;
  engagementScore: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeCreate {
  title: string;
  description: string;
  type: 'weight-loss' | 'strength' | 'endurance' | 'flexibility' | 'workout-frequency' | 'nutrition' | 'custom';
  category?: 'individual' | 'team' | 'global' | 'local';
  goalType: 'target' | 'improvement' | 'streak' | 'frequency';
  targetValue: number;
  unit: string;
  duration: number;
  startDate: string;
  endDate: string;
  isPublic?: boolean;
  maxParticipants?: number;
  milestones?: ChallengeMilestone[];
  rules?: string[];
  rewards?: {
    firstPlace?: string;
    secondPlace?: string;
    thirdPlace?: string;
    participation?: string;
  };
  tags?: string[];
  hashtag?: string;
  coverImage?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  ageGroup?: 'all' | 'teens' | 'adults' | 'seniors';
  gender?: 'all' | 'male' | 'female';
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
  radius?: number;
  entryFee?: number;
  prizePool?: number;
  verificationRequired?: boolean;
  autoVerification?: boolean;
}

// ==================== GROUPS ====================

export interface GroupMember {
  user: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: string;
  isActive: boolean;
  lastActivity: string;
  contributionScore: number;
  permissions: {
    canPost: boolean;
    canComment: boolean;
    canInvite: boolean;
    canModerate: boolean;
  };
}

export interface GroupEvent {
  title: string;
  description?: string;
  date: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
  organizer: string;
  attendees: string[];
  maxAttendees?: number;
  isPublic: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  category: 'running' | 'weightlifting' | 'yoga' | 'crossfit' | 'cycling' | 'swimming' | 'martial-arts' | 'dance' | 'general-fitness' | 'nutrition' | 'weight-loss' | 'muscle-building' | 'endurance' | 'flexibility' | 'senior-fitness' | 'youth-fitness' | 'other';
  type: 'public' | 'private' | 'invite-only';
  creator: User;
  admins: string[];
  moderators: string[];
  members: GroupMember[];
  coverImage?: string;
  avatar?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
  radius: number;
  tags: string[];
  hashtag?: string;
  rules: string[];
  guidelines?: string;
  isActive: boolean;
  isVerified: boolean;
  verificationDate?: string;
  maxMembers?: number;
  currentMembers: number;
  posts: string[];
  events: GroupEvent[];
  challenges: string[];
  achievements: GroupAchievement[];
  stats: {
    totalPosts: number;
    totalEvents: number;
    totalChallenges: number;
    activeMembers: number;
    weeklyActivity: number;
  };
  settings: {
    allowMemberPosts: boolean;
    requireApproval: boolean;
    autoApprove: boolean;
    allowInvites: boolean;
    showMemberList: boolean;
    allowDirectMessages: boolean;
  };
  reportedBy: string[];
  isModerated: boolean;
  moderationReason?: string;
  viewCount: number;
  engagementScore: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface GroupAchievement {
  name: string;
  description?: string;
  icon?: string;
  criteria: string;
  points: number;
}

export interface GroupCreate {
  name: string;
  description: string;
  category: 'running' | 'weightlifting' | 'yoga' | 'crossfit' | 'cycling' | 'swimming' | 'martial-arts' | 'dance' | 'general-fitness' | 'nutrition' | 'weight-loss' | 'muscle-building' | 'endurance' | 'flexibility' | 'senior-fitness' | 'youth-fitness' | 'other';
  type?: 'public' | 'private' | 'invite-only';
  coverImage?: string;
  avatar?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName?: string;
  radius?: number;
  tags?: string[];
  hashtag?: string;
  rules?: string[];
  guidelines?: string;
  maxMembers?: number;
  settings?: {
    allowMemberPosts?: boolean;
    requireApproval?: boolean;
    autoApprove?: boolean;
    allowInvites?: boolean;
    showMemberList?: boolean;
    allowDirectMessages?: boolean;
  };
}

// ==================== EVENTS ====================

export interface EventAttendee {
  user: string;
  status: 'attending' | 'maybe' | 'declined';
  rsvpDate: string;
  notes?: string;
  isOrganizer: boolean;
}

export interface EventSchedule {
  time: string;
  activity: string;
  duration?: number;
  description?: string;
}

export interface Event {
  _id: string;
  organizer: User;
  title: string;
  description: string;
  type: 'workout' | 'race' | 'competition' | 'meetup' | 'class' | 'workshop' | 'seminar' | 'challenge' | 'social' | 'other';
  category: 'running' | 'weightlifting' | 'yoga' | 'crossfit' | 'cycling' | 'swimming' | 'martial-arts' | 'dance' | 'general-fitness' | 'nutrition' | 'wellness' | 'sports' | 'other';
  startDate: string;
  endDate: string;
  timezone: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName: string;
  address?: string;
  venue?: string;
  isOnline: boolean;
  onlineUrl?: string;
  onlinePlatform?: 'zoom' | 'teams' | 'google-meet' | 'skype' | 'other';
  attendees: EventAttendee[];
  maxAttendees?: number;
  currentAttendees: number;
  isPublic: boolean;
  isFree: boolean;
  price: number;
  currency: string;
  registrationRequired: boolean;
  registrationDeadline?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  ageGroup: 'all' | 'teens' | 'adults' | 'seniors';
  gender: 'all' | 'male' | 'female';
  tags: string[];
  hashtag?: string;
  coverImage?: string;
  images: string[];
  requirements: string[];
  equipment: string[];
  schedule: EventSchedule[];
  instructors: string[];
  sponsors: string[];
  prizes: string[];
  rules: string[];
  safetyGuidelines: string[];
  group?: string;
  challenge?: string;
  relatedEvents: string[];
  viewCount: number;
  engagementScore: number;
  reportedBy: string[];
  isModerated: boolean;
  moderationReason?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface EventCreate {
  title: string;
  description: string;
  type: 'workout' | 'race' | 'competition' | 'meetup' | 'class' | 'workshop' | 'seminar' | 'challenge' | 'social' | 'other';
  category: 'running' | 'weightlifting' | 'yoga' | 'crossfit' | 'cycling' | 'swimming' | 'martial-arts' | 'dance' | 'general-fitness' | 'nutrition' | 'wellness' | 'sports' | 'other';
  startDate: string;
  endDate: string;
  timezone?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  locationName: string;
  address?: string;
  venue?: string;
  isOnline?: boolean;
  onlineUrl?: string;
  onlinePlatform?: 'zoom' | 'teams' | 'google-meet' | 'skype' | 'other';
  maxAttendees?: number;
  isPublic?: boolean;
  isFree?: boolean;
  price?: number;
  currency?: string;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  ageGroup?: 'all' | 'teens' | 'adults' | 'seniors';
  gender?: 'all' | 'male' | 'female';
  tags?: string[];
  hashtag?: string;
  coverImage?: string;
  images?: string[];
  requirements?: string[];
  equipment?: string[];
  schedule?: EventSchedule[];
  instructors?: string[];
  sponsors?: string[];
  prizes?: string[];
  rules?: string[];
  safetyGuidelines?: string[];
  group?: string;
  challenge?: string;
  relatedEvents?: string[];
}

// ==================== MESSAGING ====================

export interface Message {
  _id: string;
  sender: User;
  recipient?: User;
  group?: string;
  type: 'direct' | 'group';
  content: string;
  media: MessageMedia[];
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'contact';
  location?: {
    type: string;
    coordinates: number[];
    address?: string;
  };
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  isRead: boolean;
  readBy: MessageRead[];
  isEdited: boolean;
  editedAt?: string;
  originalContent?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  replyTo?: string;
  forwardedFrom?: string;
  reactions: MessageReaction[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  filename?: string;
  size?: number;
  duration?: number;
}

export interface MessageRead {
  user: string;
  readAt: string;
}

export interface MessageReaction {
  user: string;
  emoji: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  type: 'direct' | 'group';
  group?: Group;
  lastMessage?: Message;
  lastMessageAt?: string;
  unreadCount: number;
  isActive: boolean;
  isPinned: boolean;
  isMuted: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface MessageCreate {
  content: string;
  media?: MessageMedia[];
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'contact';
  location?: {
    type: string;
    coordinates: number[];
    address?: string;
  };
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  replyTo?: string;
  forwardedFrom?: string;
}

// ==================== NOTIFICATIONS ====================

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User;
  type: 'post_like' | 'post_comment' | 'post_share' | 'post_mention' | 'comment_like' | 'comment_reply' | 'comment_mention' | 'follow' | 'unfollow' | 'follow_request' | 'challenge_invite' | 'challenge_update' | 'challenge_complete' | 'event_invite' | 'event_reminder' | 'event_update' | 'event_cancel' | 'group_invite' | 'group_join' | 'group_post' | 'group_event' | 'message_received' | 'message_reaction' | 'achievement_unlocked' | 'goal_complete' | 'streak_milestone' | 'workout_buddy_match' | 'workout_reminder' | 'system_announcement' | 'maintenance' | 'update';
  title: string;
  message: string;
  data: {
    post?: string;
    comment?: string;
    challenge?: string;
    event?: string;
    group?: string;
    message?: string;
    achievement?: string;
    goal?: string;
    workout?: string;
    url?: string;
    metadata?: any;
  };
  isRead: boolean;
  readAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  deliveryMethod: 'in_app' | 'email' | 'push' | 'sms';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: string;
  isActionable: boolean;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
  image?: string;
  badge?: string;
  sound?: string;
  vibration: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  user: string;
  preferences: {
    [key: string]: {
      in_app: boolean;
      email: boolean;
      push: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  emailSettings: {
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    digest: boolean;
    unsubscribeToken?: string;
  };
  pushSettings: {
    enabled: boolean;
    token?: string;
    platform?: 'web' | 'ios' | 'android';
    sound: boolean;
    vibration: boolean;
    badge: boolean;
  };
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// ==================== USER PROFILES & SOCIAL ====================

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  displayName?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phone?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals: string[];
  workoutDaysPerWeek: number;
  preferredWorkoutDuration: number;
  physicalLimitations: string[];
  injuries: string[];
  height?: number;
  weight?: number;
  bodyFatPercentage?: number;
  preferredWorkoutTypes: string[];
  equipmentAccess: string[];
  dietaryPreferences: string[];
  bio?: string;
  isPublicProfile: boolean;
  followers: string[];
  following: string[];
  followRequests: string[];
  pendingFollowRequests: string[];
  isPrivate: boolean;
  isVerified: boolean;
  verificationBadge?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
  };
  badges: UserBadge[];
  achievements: UserAchievement[];
  communityStats: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalChallenges: number;
    totalEvents: number;
    totalGroups: number;
    reputation: number;
    level: number;
    experience: number;
  };
  privacySettings: {
    showProfile: boolean;
    showWorkouts: boolean;
    showProgress: boolean;
    showNutrition: boolean;
    allowMessages: boolean;
    allowFollowRequests: boolean;
    showOnlineStatus: boolean;
    showLastSeen: boolean;
  };
  blockedUsers: string[];
  mutedUsers: string[];
  lastSeen: string;
  isOnline: boolean;
  subscription: {
    type: 'free' | 'premium' | 'premium-plus';
    startDate?: string;
    endDate?: string;
    stripeCustomerId?: string;
  };
  totalWorkouts: number;
  totalWorkoutTime: number;
  streakDays: number;
  lastWorkoutDate?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserBadge {
  name: string;
  icon?: string;
  earnedAt: string;
  description?: string;
}

export interface UserAchievement {
  type: string;
  title: string;
  description?: string;
  icon?: string;
  earnedAt: string;
  points: number;
}

// ==================== DASHBOARD & FEED ====================

export interface CommunityDashboard {
  posts: Post[];
  trendingPosts: Post[];
  activeChallenges: Challenge[];
  upcomingEvents: Event[];
  recommendedGroups: Group[];
  userStats: {
    followers: number;
    following: number;
    posts: number;
    reputation: number;
    level: number;
    experience: number;
  };
  hasMore: boolean;
}

export interface FeedFilters {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  user?: string;
  hashtag?: string;
  sort?: 'recent' | 'trending' | 'popular';
  search?: string;
}

// ==================== SEARCH ====================

export interface SearchResults {
  posts?: Post[];
  users?: User[];
  groups?: Group[];
  events?: Event[];
  challenges?: Challenge[];
}

export interface SearchFilters {
  q: string;
  type?: 'all' | 'posts' | 'users' | 'groups' | 'events' | 'challenges';
  page?: number;
  limit?: number;
}
