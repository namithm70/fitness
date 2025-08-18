export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'hiit' | 'yoga' | 'flexibility' | 'endurance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  exercises: Exercise[];
  description: string;
  tags: string[];
  isPublic: boolean;
  createdAt?: string;
  createdBy?: string;
  rating?: number;
  completedCount?: number;
}
