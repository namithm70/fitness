export interface Activity {
  id: string;
  userId: string;
  type: 'workout' | 'exercise' | 'nutrition' | 'progress' | 'goal';
  action: string;
  details: {
    workoutId?: string;
    workoutName?: string;
    exerciseName?: string;
    duration?: number;
    workoutCalories?: number;
    sets?: number;
    reps?: number;
    weight?: number;
    mealType?: string;
    foodName?: string;
    nutritionCalories?: number;
    measurementType?: string;
    value?: number;
    goalType?: string;
    goalName?: string;
  };
  timestamp: string;
  completed: boolean;
}

export interface DailyHistory {
  date: string;
  activities: Activity[];
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
}

export interface HistoryFilters {
  startDate?: string;
  endDate?: string;
  activityType?: Activity['type'];
  completed?: boolean;
}
