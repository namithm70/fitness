import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  Dumbbell, 
  Heart, 
  Zap, 
  Users, 
  Timer, 
  Play, 
  Edit, 
  Share2, 
  Bookmark,
  TrendingUp
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  notes?: string;
}

interface Workout {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'hiit' | 'yoga' | 'flexibility' | 'endurance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: Exercise[];
  description: string;
  tags: string[];
  isPublic: boolean;
  createdAt?: string;
  createdBy?: string;
  rating?: number;
  completedCount?: number;
}

interface WorkoutCardProps {
  workout: Workout;
  onStart: (workout: Workout) => void;
  onEdit?: (workout: Workout) => void;
  onShare?: (workout: Workout) => void;
  onBookmark?: (workout: Workout) => void;
  isBookmarked?: boolean;
}

const workoutTypeConfig = {
  strength: { icon: Dumbbell, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  cardio: { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50' },
  hiit: { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  yoga: { icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  flexibility: { icon: Target, color: 'text-green-600', bgColor: 'bg-green-50' },
  endurance: { icon: Timer, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
};

const difficultyConfig = {
  beginner: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
  intermediate: { color: 'bg-yellow-100 text-yellow-800', label: 'Intermediate' },
  advanced: { color: 'bg-red-100 text-red-800', label: 'Advanced' },
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onStart,
  onEdit,
  onShare,
  onBookmark,
  isBookmarked = false,
}) => {
  const typeConfig = workoutTypeConfig[workout.type];
  const difficultyConfig = difficultyConfig[workout.difficulty];
  const Icon = typeConfig.icon;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCaloriesEstimate = () => {
    // Rough calorie estimation based on workout type and duration
    const caloriesPerMinute = {
      strength: 6,
      cardio: 8,
      hiit: 12,
      yoga: 3,
      flexibility: 2,
      endurance: 7,
    };
    return Math.round(workout.duration * caloriesPerMinute[workout.type]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
            <Icon className={`w-5 h-5 ${typeConfig.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-fitness-600 transition-colors">
              {workout.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyConfig.color}`}>
                {difficultyConfig.label}
              </span>
              <span className="text-sm text-gray-500 capitalize">{workout.type}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(workout);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'text-fitness-600 bg-fitness-50' 
                  : 'text-gray-400 hover:text-fitness-600 hover:bg-fitness-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(workout);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {workout.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {workout.description}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-gray-400 mr-1" />
          </div>
          <div className="text-sm font-medium text-gray-900">{formatDuration(workout.duration)}</div>
          <div className="text-xs text-gray-500">Duration</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Dumbbell className="w-4 h-4 text-gray-400 mr-1" />
          </div>
          <div className="text-sm font-medium text-gray-900">{workout.exercises.length}</div>
          <div className="text-xs text-gray-500">Exercises</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
          </div>
          <div className="text-sm font-medium text-gray-900">{getCaloriesEstimate()}</div>
          <div className="text-xs text-gray-500">Calories</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-gray-400 mr-1" />
          </div>
          <div className="text-sm font-medium text-gray-900">
            {workout.rating ? `${workout.rating.toFixed(1)}★` : 'New'}
          </div>
          <div className="text-xs text-gray-500">Rating</div>
        </div>
      </div>

      {/* Exercise Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises Preview:</h4>
        <div className="space-y-1">
          {workout.exercises.slice(0, 3).map((exercise, index) => (
            <div key={exercise.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {index + 1}. {exercise.name}
              </span>
              <span className="text-gray-500">
                {exercise.sets}×{exercise.reps}
                {exercise.weight && ` @${exercise.weight}kg`}
              </span>
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="text-sm text-gray-500">
              +{workout.exercises.length - 3} more exercises
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {workout.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {workout.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {workout.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{workout.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(workout);
          }}
          className="btn-primary flex items-center flex-1 justify-center"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </button>
        
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(workout);
            }}
            className="btn-secondary p-2"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Completion Stats */}
      {workout.completedCount && workout.completedCount > 0 && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Completed {workout.completedCount} times</span>
            {workout.createdAt && (
              <span className="text-gray-500">
                {new Date(workout.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WorkoutCard;
