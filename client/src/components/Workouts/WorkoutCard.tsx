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
import { Workout } from '../../types/workout';

interface WorkoutCardProps {
  workout: Workout;
  onStart: (workout: Workout) => void;
  onEdit?: (workout: Workout) => void;
  onShare?: (workout: Workout) => void;
  onBookmark?: (workout: Workout) => void;
  isBookmarked?: boolean;
}

const workoutTypeConfig = {
  strength: { icon: Dumbbell, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  cardio: { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  hiit: { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  yoga: { icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  flexibility: { icon: Target, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  endurance: { icon: Timer, color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
};

const difficultyConfig = {
  beginner: { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400', label: 'Beginner' },
  intermediate: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400', label: 'Intermediate' },
  advanced: { color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400', label: 'Advanced' },
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
  const difficultyLevelConfig = difficultyConfig[workout.difficulty];
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
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
              {workout.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                {difficultyLevelConfig.label}
              </span>
              <span className="text-sm text-white/70 capitalize">{workout.type}</span>
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
                  ? 'text-white bg-white/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/20'
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
              className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {workout.description && (
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {workout.description}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-white/60 mr-1" />
          </div>
          <div className="text-sm font-medium text-white">{formatDuration(workout.duration)}</div>
          <div className="text-xs text-white/70">Duration</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Dumbbell className="w-4 h-4 text-white/60 mr-1" />
          </div>
          <div className="text-sm font-medium text-white">{workout.exercises.length}</div>
          <div className="text-xs text-white/70">Exercises</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-white/60 mr-1" />
          </div>
          <div className="text-sm font-medium text-white">{getCaloriesEstimate()}</div>
          <div className="text-xs text-white/70">Calories</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-white/60 mr-1" />
          </div>
          <div className="text-sm font-medium text-white">
            {workout.rating ? `${workout.rating.toFixed(1)}★` : 'New'}
          </div>
          <div className="text-xs text-white/70">Rating</div>
        </div>
      </div>

      {/* Exercise Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Exercises Preview:</h4>
        <div className="space-y-1">
          {workout.exercises.slice(0, 3).map((exercise, index) => (
            <div key={exercise.id} className="flex items-center justify-between text-sm">
              <span className="text-white/80">
                {index + 1}. {exercise.name}
              </span>
              <span className="text-white/60">
                {exercise.sets}×{exercise.reps}
                {exercise.weight && ` @${exercise.weight}kg`}
              </span>
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="text-sm text-white/60">
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
              className="px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {workout.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full">
              +{workout.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(workout);
          }}
          className="bg-white text-purple-600 hover:bg-white/90 flex items-center flex-1 justify-center py-2 px-4 rounded-lg font-semibold transition-all duration-200"
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
            className="bg-white/20 text-white hover:bg-white/30 p-2 rounded-lg transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Completion Stats */}
      {workout.completedCount && workout.completedCount > 0 && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Completed {workout.completedCount} times</span>
            {workout.createdAt && (
              <span className="text-white/60">
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
