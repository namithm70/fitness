import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Clock, Target, Dumbbell, Heart, Zap, Users, Timer, Save } from 'lucide-react';
import { Workout, Exercise } from '../../types/workout';
import { getAllExercises } from '../../data/exercises';

interface CreateWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: Workout) => void;
}

const workoutTypes = [
  { id: 'strength', name: 'Strength Training', icon: Dumbbell, color: 'text-blue-600' },
  { id: 'cardio', name: 'Cardio', icon: Heart, color: 'text-red-600' },
  { id: 'hiit', name: 'HIIT', icon: Zap, color: 'text-orange-600' },
  { id: 'yoga', name: 'Yoga', icon: Users, color: 'text-purple-600' },
  { id: 'flexibility', name: 'Flexibility', icon: Target, color: 'text-green-600' },
  { id: 'endurance', name: 'Endurance', icon: Timer, color: 'text-indigo-600' },
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', name: 'Advanced', color: 'bg-red-100 text-red-800' },
];

const sampleExercises = getAllExercises().map(exercise => ({
  name: exercise.name,
  category: exercise.id.includes('strength') ? 'strength' : 
           exercise.id.includes('cardio') ? 'cardio' :
           exercise.id.includes('hiit') ? 'hiit' :
           exercise.id.includes('yoga') ? 'yoga' :
           exercise.id.includes('core') ? 'strength' : 'strength'
}));

const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ isOpen, onClose, onSave }) => {
  const [workout, setWorkout] = useState<Partial<Workout>>({
    name: '',
    type: 'strength',
    difficulty: 'beginner',
    duration: 30,
    exercises: [],
    description: '',
    tags: [],
    isPublic: true,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Partial<Exercise>>({});

  const addExercise = () => {
    if (currentExercise.name) {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        name: currentExercise.name,
        sets: currentExercise.sets || 3,
        reps: currentExercise.reps || 10,
        weight: currentExercise.weight,
        duration: currentExercise.duration,
        restTime: currentExercise.restTime || 60,
        notes: currentExercise.notes,
      };

      setWorkout(prev => ({
        ...prev,
        exercises: [...(prev.exercises || []), newExercise],
      }));

      setCurrentExercise({});
      setShowExerciseForm(false);
    }
  };

  const removeExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.filter(ex => ex.id !== exerciseId) || [],
    }));
  };

  const calculateTotalTime = () => {
    if (!workout.exercises?.length) return workout.duration || 0;
    
    let totalTime = 0;
    workout.exercises.forEach(exercise => {
      const exerciseTime = exercise.duration || (exercise.sets * exercise.reps * 2); // 2 seconds per rep
      const restTime = exercise.restTime * (exercise.sets - 1);
      totalTime += exerciseTime + restTime;
    });
    
    return Math.ceil(totalTime / 60); // Convert to minutes
  };

  const handleSave = () => {
    if (workout.name && workout.exercises?.length) {
      const finalWorkout: Workout = {
        id: Date.now().toString(),
        name: workout.name,
        type: workout.type as Workout['type'],
        difficulty: workout.difficulty as Workout['difficulty'],
        duration: calculateTotalTime(),
        exercises: workout.exercises,
        description: workout.description || '',
        tags: workout.tags || [],
        isPublic: workout.isPublic || false,
      };
      
      onSave(finalWorkout);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Workout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? 'bg-fitness-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-fitness-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    value={workout.name}
                    onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field w-full"
                    placeholder="e.g., Full Body Strength, Morning Cardio"
                  />
                </div>

                {/* Workout Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Workout Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {workoutTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setWorkout(prev => ({ ...prev, type: type.id as Workout['type'] }))}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            workout.type === type.id
                              ? 'border-fitness-500 bg-fitness-50 dark:bg-fitness-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${type.color}`} />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{type.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Difficulty Level
                  </label>
                  <div className="flex gap-3">
                    {difficultyLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setWorkout(prev => ({ ...prev, difficulty: level.id as Workout['difficulty'] }))}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          workout.difficulty === level.id
                            ? level.color
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={workout.description}
                    onChange={(e) => setWorkout(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field w-full h-24"
                    placeholder="Describe your workout routine..."
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Exercises List */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exercises</h3>
                  <button
                    onClick={() => setShowExerciseForm(true)}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </button>
                </div>

                {workout.exercises?.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p>No exercises added yet. Click "Add Exercise" to get started.</p>
                  </div>
                )}

                {workout.exercises?.map((exercise, index) => (
                  <div key={exercise.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          {exercise.weight && <span>{exercise.weight}kg</span>}
                          {exercise.duration && <span>{exercise.duration}s</span>}
                          <span>Rest: {exercise.restTime}s</span>
                        </div>
                        {exercise.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{exercise.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Exercise Form */}
                {showExerciseForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4 space-y-4"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">Add Exercise</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Exercise Name
                      </label>
                      <select
                        value={currentExercise.name || ''}
                        onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field w-full"
                      >
                        <option value="">Select an exercise...</option>
                        {sampleExercises.map((exercise) => (
                          <option key={exercise.name} value={exercise.name}>
                            {exercise.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sets
                        </label>
                        <input
                          type="number"
                          value={currentExercise.sets || ''}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, sets: parseInt(e.target.value) }))}
                          className="input-field"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reps
                        </label>
                        <input
                          type="number"
                          value={currentExercise.reps || ''}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, reps: parseInt(e.target.value) }))}
                          className="input-field"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Weight (kg) - Optional
                        </label>
                        <input
                          type="number"
                          value={currentExercise.weight || ''}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                          className="input-field"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration (seconds) - Optional
                        </label>
                        <input
                          type="number"
                          value={currentExercise.duration || ''}
                          onChange={(e) => setCurrentExercise(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          className="input-field"
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rest Time (seconds)
                      </label>
                      <input
                        type="number"
                        value={currentExercise.restTime || ''}
                        onChange={(e) => setCurrentExercise(prev => ({ ...prev, restTime: parseInt(e.target.value) }))}
                        className="input-field"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={currentExercise.notes || ''}
                        onChange={(e) => setCurrentExercise(prev => ({ ...prev, notes: e.target.value }))}
                        className="input-field"
                        rows={2}
                        placeholder="Any special instructions..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={addExercise}
                        className="btn-primary flex-1"
                      >
                        Add Exercise
                      </button>
                      <button
                        onClick={() => setShowExerciseForm(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Workout Summary */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Workout Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Clock className="w-8 h-8 text-fitness-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{calculateTotalTime()}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Dumbbell className="w-8 h-8 text-fitness-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{workout.exercises?.length || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Exercises</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Target className="w-8 h-8 text-fitness-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{workout.difficulty}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Exercises:</h4>
                    {workout.exercises?.map((exercise, index) => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{index + 1}. {exercise.name}</span>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                            {exercise.duration && ` (${exercise.duration}s)`}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-500">
                          Rest: {exercise.restTime}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={workout.isPublic}
                      onChange={(e) => setWorkout(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600 text-fitness-600 focus:ring-fitness-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Make this workout public</span>
                  </label>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!workout.name || (currentStep === 2 && !workout.exercises?.length)}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!workout.name || !workout.exercises?.length}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Workout
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateWorkoutModal;
