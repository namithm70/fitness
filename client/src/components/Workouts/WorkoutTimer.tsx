import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  X, 
  Timer, 
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Workout, Exercise } from '../../types/workout';

interface WorkoutTimerProps {
  workout: Workout;
  onComplete: (workout: Workout, timeSpent: number) => void;
  onClose: () => void;
}

type TimerState = 'ready' | 'exercise' | 'rest' | 'completed';

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ workout, onComplete, onClose }) => {
  const [currentState, setCurrentState] = useState<TimerState>('ready');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  const isLastSet = currentSet === currentExercise.sets;

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playSound();
            if (currentState === 'exercise') {
              if (isLastSet) {
                if (isLastExercise) {
                  setCurrentState('completed');
                  setIsRunning(false);
                  return 0;
                } else {
                  setCurrentState('rest');
                  setCurrentExerciseIndex(prev => prev + 1);
                  setCurrentSet(1);
                  return currentExercise.restTime;
                }
              } else {
                setCurrentState('rest');
                setCurrentSet(prev => prev + 1);
                return currentExercise.restTime;
              }
            } else if (currentState === 'rest') {
              setCurrentState('exercise');
              return currentExercise.duration || 30;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, currentState, currentExerciseIndex, currentSet]);

  useEffect(() => {
    if (isRunning && startTime) {
      const interval = setInterval(() => {
        setTotalTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, startTime]);

  const playSound = () => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(() => {});
    }
  };

  const startWorkout = () => {
    setCurrentState('exercise');
    setTimeLeft(currentExercise.duration || 30);
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const pauseWorkout = () => {
    setIsRunning(false);
  };

  const resumeWorkout = () => {
    setIsRunning(true);
  };

  const skipExercise = () => {
    if (currentState === 'exercise') {
      if (isLastSet) {
        if (isLastExercise) {
          setCurrentState('completed');
          setIsRunning(false);
        } else {
          setCurrentState('rest');
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSet(1);
          setTimeLeft(currentExercise.restTime);
        }
      } else {
        setCurrentState('rest');
        setCurrentSet(prev => prev + 1);
        setTimeLeft(currentExercise.restTime);
      }
    } else if (currentState === 'rest') {
      setCurrentState('exercise');
      setTimeLeft(currentExercise.duration || 30);
    }
  };

  const resetWorkout = () => {
    setCurrentState('ready');
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setTimeLeft(0);
    setIsRunning(false);
    setStartTime(null);
    setTotalTimeSpent(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalExercises = workout.exercises.length;
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedExercises = currentExerciseIndex;
    const completedSets = workout.exercises
      .slice(0, currentExerciseIndex)
      .reduce((sum, ex) => sum + ex.sets, 0) + (currentSet - 1);
    
    return Math.round(((completedExercises * totalSets + completedSets) / (totalExercises * totalSets)) * 100);
  };

  if (currentState === 'completed') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workout Complete!</h2>
          <p className="text-gray-600 mb-6">
            Great job! You've completed "{workout.name}"
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Time:</span>
              <span className="font-semibold">{formatTotalTime(totalTimeSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Exercises:</span>
              <span className="font-semibold">{workout.exercises.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Calories Burned:</span>
              <span className="font-semibold">~{Math.round(totalTimeSpent / 60 * 8)}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onComplete(workout, totalTimeSpent)}
              className="btn-primary flex-1"
            >
              Save Progress
            </button>
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{workout.name}</h2>
            <p className="text-sm text-gray-600">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-fitness-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {currentState === 'ready' ? (
            <div className="text-center py-8">
              <Timer className="w-16 h-16 text-fitness-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Start?</h3>
              <p className="text-gray-600 mb-6">
                Get ready for your workout. Make sure you have enough space and water nearby.
              </p>
              <button
                onClick={startWorkout}
                className="btn-primary flex items-center mx-auto"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Exercise */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentExercise.name}
                </h3>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>Set {currentSet} of {currentExercise.sets}</span>
                  <span>•</span>
                  <span>{currentExercise.reps} reps</span>
                  {currentExercise.weight && (
                    <>
                      <span>•</span>
                      <span>{currentExercise.weight}kg</span>
                    </>
                  )}
                </div>
              </div>

              {/* Timer Display */}
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${
                  currentState === 'rest' ? 'text-blue-600' : 'text-fitness-600'
                }`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg text-gray-600 capitalize">
                  {currentState === 'rest' ? 'Rest Time' : 'Exercise Time'}
                </div>
              </div>

              {/* Exercise Notes */}
              {currentExercise.notes && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">{currentExercise.notes}</p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isRunning ? (
                  <button
                    onClick={resumeWorkout}
                    className="btn-primary flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={pauseWorkout}
                    className="btn-secondary flex items-center"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={skipExercise}
                  className="btn-secondary flex items-center"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </button>
                
                <button
                  onClick={resetWorkout}
                  className="btn-secondary flex items-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>

              {/* Total Time */}
              {startTime && (
                <div className="text-center text-sm text-gray-600">
                  Total Time: {formatTotalTime(totalTimeSpent)}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkoutTimer;
