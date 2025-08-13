export interface ProgressEntry {
  _id: string;
  user: string;
  date: string;
  type: 'weight' | 'measurements' | 'body-fat' | 'progress-photo' | 'strength' | 'endurance' | 'flexibility';
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    forearms?: number;
    thighs?: number;
    calves?: number;
    neck?: number;
    shoulders?: number;
  };
  bodyFatPercentage?: number;
  muscleMass?: number;
  photos?: Array<{
    url: string;
    type: 'front' | 'back' | 'side' | 'other';
    notes?: string;
  }>;
  strengthMetrics?: Array<{
    exercise: string;
    weight: number;
    reps: number;
    sets: number;
    isPR: boolean;
  }>;
  enduranceMetrics?: {
    cardioType: 'running' | 'cycling' | 'swimming' | 'rowing' | 'elliptical' | 'other';
    duration: number;
    distance: number;
    pace: number;
    caloriesBurned: number;
  };
  flexibilityMetrics?: {
    sitAndReach: number;
    shoulderFlexibility: number;
    hipFlexibility: number;
  };
  notes?: string;
  mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  energyLevel?: number;
  tags?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  _id: string;
  user: string;
  title: string;
  description?: string;
  type: 'weight' | 'strength' | 'endurance' | 'flexibility' | 'measurements' | 'workout-frequency' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: 'kg' | 'lbs' | 'cm' | 'inches' | 'reps' | 'minutes' | 'km' | 'miles' | 'workouts' | 'days' | 'custom';
  targetDate: string;
  startDate: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  exercise?: string;
  measurementType?: 'chest' | 'waist' | 'hips' | 'biceps' | 'forearms' | 'thighs' | 'calves' | 'neck' | 'shoulders';
  milestones: Array<{
    value: number;
    date: string;
    achieved: boolean;
  }>;
  reminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    lastReminder?: string;
  };
  tags?: string[];
  notes?: string;
  completedAt?: string;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
  progressPercentage?: number;
  isOverdue?: boolean;
  daysRemaining?: number;
}

export interface Achievement {
  _id: string;
  user: string;
  type: 'workout-streak' | 'weight-loss' | 'strength-gain' | 'endurance' | 'consistency' | 'milestone' | 'special';
  title: string;
  description: string;
  icon: string;
  color: string;
  criteria: {
    metric: string;
    value: number;
    unit: string;
  };
  achievedAt: string;
  progress: {
    current: number;
    target: number;
    percentage: number;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  streakDays?: number;
  milestone?: 'first-workout' | 'first-week' | 'first-month' | 'first-3-months' | 'first-6-months' | 'first-year' | 'weight-goal' | 'strength-goal' | 'endurance-goal';
  metadata?: any;
  shared: boolean;
  sharedAt?: string;
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
}

export interface ProgressDashboard {
  recentEntries: ProgressEntry[];
  weightTrend: ProgressEntry[];
  activeGoals: Goal[];
  recentAchievements: Achievement[];
  workoutStats: {
    totalWorkouts: number;
    totalDuration: number;
    avgDuration: number;
  };
  bmi?: string;
  measurementTrend: ProgressEntry[];
  summary: {
    totalEntries: number;
    totalGoals: number;
    completedGoals: number;
    totalAchievements: number;
  };
}

export interface ProgressAnalytics {
  weightTrend: ProgressEntry[];
  measurementTrend: ProgressEntry[];
  workoutFrequency: Array<{
    _id: string;
    count: number;
    totalDuration: number;
  }>;
  goalProgress: Goal[];
  summary: {
    totalEntries: number;
    totalGoals: number;
    completedGoals: number;
    totalAchievements: number;
  };
}

export interface ProgressEntryCreate {
  type: 'weight' | 'measurements' | 'body-fat' | 'progress-photo' | 'strength' | 'endurance' | 'flexibility';
  date?: string;
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    forearms?: number;
    thighs?: number;
    calves?: number;
    neck?: number;
    shoulders?: number;
  };
  bodyFatPercentage?: number;
  muscleMass?: number;
  photos?: Array<{
    url: string;
    type: 'front' | 'back' | 'side' | 'other';
    notes?: string;
  }>;
  strengthMetrics?: Array<{
    exercise: string;
    weight: number;
    reps: number;
    sets: number;
    isPR: boolean;
  }>;
  enduranceMetrics?: {
    cardioType: 'running' | 'cycling' | 'swimming' | 'rowing' | 'elliptical' | 'other';
    duration: number;
    distance: number;
    pace: number;
    caloriesBurned: number;
  };
  flexibilityMetrics?: {
    sitAndReach: number;
    shoulderFlexibility: number;
    hipFlexibility: number;
  };
  notes?: string;
  mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  energyLevel?: number;
  tags?: string[];
}

export interface GoalCreate {
  title: string;
  description?: string;
  type: 'weight' | 'strength' | 'endurance' | 'flexibility' | 'measurements' | 'workout-frequency' | 'custom';
  targetValue: number;
  unit: 'kg' | 'lbs' | 'cm' | 'inches' | 'reps' | 'minutes' | 'km' | 'miles' | 'workouts' | 'days' | 'custom';
  targetDate: string;
  priority?: 'low' | 'medium' | 'high';
  exercise?: string;
  measurementType?: 'chest' | 'waist' | 'hips' | 'biceps' | 'forearms' | 'thighs' | 'calves' | 'neck' | 'shoulders';
  tags?: string[];
  notes?: string;
}

export interface GoalUpdate {
  title?: string;
  targetValue?: number;
  targetDate?: string;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  currentValue?: number;
  description?: string;
}

export interface ProgressEntryUpdate {
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  notes?: string;
  mood?: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  energyLevel?: number;
}

export interface ProgressFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface GoalFilters {
  status?: string;
  type?: string;
}

export interface MeasurementData {
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  shoulders?: number;
}

export interface WeightData {
  date: string;
  weight: number;
}

export interface WorkoutFrequencyData {
  date: string;
  count: number;
  totalDuration: number;
}
