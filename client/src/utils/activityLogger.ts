import { api } from '../config/api';
import { Activity } from '../types/activity';

export interface LogActivityParams {
  userId: string;
  type: Activity['type'];
  action: string;
  details: Activity['details'];
  completed?: boolean;
}

export const logActivity = async (params: LogActivityParams): Promise<void> => {
  try {
    const activity: Omit<Activity, 'id' | 'timestamp'> = {
      userId: params.userId,
      type: params.type,
      action: params.action,
      details: params.details,
      completed: params.completed ?? true
    };

    await api.post('/api/activities', activity);
  } catch (error) {
    console.error('Error logging activity:', error);
    // In a real app, you might want to queue failed activities for retry
  }
};

// Convenience functions for common activities
export const logWorkoutCompletion = async (
  userId: string,
  workoutName: string,
  duration: number,
  calories: number,
  workoutId?: string
) => {
  await logActivity({
    userId,
    type: 'workout',
    action: 'Completed workout',
    details: {
      workoutId,
      workoutName,
      duration,
      workoutCalories: calories
    }
  });
};

export const logExerciseCompletion = async (
  userId: string,
  exerciseName: string,
  sets: number,
  reps: number,
  weight?: number,
  duration?: number
) => {
  await logActivity({
    userId,
    type: 'exercise',
    action: 'Completed exercise',
    details: {
      exerciseName,
      sets,
      reps,
      weight,
      duration
    }
  });
};

export const logNutritionEntry = async (
  userId: string,
  mealType: string,
  foodName: string,
  calories: number
) => {
  await logActivity({
    userId,
    type: 'nutrition',
    action: 'Logged meal',
    details: {
      mealType,
      foodName,
      nutritionCalories: calories
    }
  });
};

export const logProgressUpdate = async (
  userId: string,
  measurementType: string,
  value: number
) => {
  await logActivity({
    userId,
    type: 'progress',
    action: 'Updated progress',
    details: {
      measurementType,
      value
    }
  });
};

export const logGoalAchievement = async (
  userId: string,
  goalType: string,
  goalName: string
) => {
  await logActivity({
    userId,
    type: 'goal',
    action: 'Achieved goal',
    details: {
      goalType,
      goalName
    }
  });
};
