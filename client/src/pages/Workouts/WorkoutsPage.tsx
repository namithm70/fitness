import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Clock, 
  Target, 
  Heart, 
  Zap, 
  Users, 
  Timer,
  TrendingUp,
  Star
} from 'lucide-react';
import CreateWorkoutModal from '../../components/Workouts/CreateWorkoutModal';
import WorkoutCard from '../../components/Workouts/WorkoutCard';
import WorkoutTimer from '../../components/Workouts/WorkoutTimer';
import toast from 'react-hot-toast';
import { Workout } from '../../types/workout';

const WorkoutsPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [bookmarkedWorkouts, setBookmarkedWorkouts] = useState<string[]>([]);

  // Sample workout data
  const sampleWorkouts = useMemo<Workout[]>(() => [
    {
      id: '1',
      name: 'Full Body Strength',
      type: 'strength',
      difficulty: 'intermediate',
      duration: 45,
      exercises: [
        { id: '1', name: 'Push-ups', sets: 3, reps: 12, restTime: 60 },
        { id: '2', name: 'Squats', sets: 3, reps: 15, restTime: 60 },
        { id: '3', name: 'Plank', sets: 3, reps: 1, duration: 30, restTime: 60 },
        { id: '4', name: 'Lunges', sets: 3, reps: 10, restTime: 60 },
      ],
      description: 'A comprehensive full-body workout targeting all major muscle groups.',
      tags: ['full-body', 'strength', 'bodyweight'],
      isPublic: true,
      rating: 4.5,
      completedCount: 12,
    },
    {
      id: '2',
      name: 'HIIT Cardio Blast',
      type: 'hiit',
      difficulty: 'advanced',
      duration: 30,
      exercises: [
        { id: '1', name: 'Burpees', sets: 4, reps: 10, restTime: 30 },
        { id: '2', name: 'Mountain Climbers', sets: 4, reps: 1, duration: 45, restTime: 30 },
        { id: '3', name: 'Jumping Jacks', sets: 4, reps: 1, duration: 30, restTime: 30 },
        { id: '4', name: 'High Knees', sets: 4, reps: 1, duration: 30, restTime: 30 },
      ],
      description: 'High-intensity interval training for maximum calorie burn.',
      tags: ['cardio', 'hiit', 'fat-burning'],
      isPublic: true,
      rating: 4.8,
      completedCount: 8,
    },
    {
      id: '3',
      name: 'Morning Yoga Flow',
      type: 'yoga',
      difficulty: 'beginner',
      duration: 25,
      exercises: [
        { id: '1', name: 'Downward Dog', sets: 3, reps: 1, duration: 30, restTime: 15 },
        { id: '2', name: 'Warrior Pose', sets: 2, reps: 1, duration: 45, restTime: 15 },
        { id: '3', name: 'Child\'s Pose', sets: 2, reps: 1, duration: 30, restTime: 15 },
        { id: '4', name: 'Sun Salutation', sets: 3, reps: 1, duration: 60, restTime: 15 },
      ],
      description: 'Gentle yoga flow perfect for starting your day with energy.',
      tags: ['yoga', 'morning', 'flexibility'],
      isPublic: true,
      rating: 4.2,
      completedCount: 15,
    },
    {
      id: '4',
      name: 'Upper Body Power',
      type: 'strength',
      difficulty: 'advanced',
      duration: 50,
      exercises: [
        { id: '1', name: 'Pull-ups', sets: 4, reps: 8, restTime: 90 },
        { id: '2', name: 'Dips', sets: 4, reps: 10, restTime: 90 },
        { id: '3', name: 'Push-ups', sets: 4, reps: 15, restTime: 60 },
        { id: '4', name: 'Plank Hold', sets: 3, reps: 1, duration: 60, restTime: 60 },
      ],
      description: 'Focus on building upper body strength and power.',
      tags: ['upper-body', 'strength', 'power'],
      isPublic: true,
      rating: 4.6,
      completedCount: 6,
    },
  ], []);

  useEffect(() => {
    // Load sample workouts
    setWorkouts(sampleWorkouts);
    setFilteredWorkouts(sampleWorkouts);
  }, [sampleWorkouts]);

  useEffect(() => {
    // Filter workouts based on search and filters
    let filtered = workouts;

    if (searchTerm) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(workout => workout.type === selectedType);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(workout => workout.difficulty === selectedDifficulty);
    }

    setFilteredWorkouts(filtered);
  }, [workouts, searchTerm, selectedType, selectedDifficulty]);

  const handleCreateWorkout = (workout: Workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      rating: 0,
      completedCount: 0,
    };
    
    setWorkouts(prev => [newWorkout, ...prev]);
    toast.success('Workout created successfully!');
  };

  const handleStartWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
  };

  const handleCompleteWorkout = (workout: Workout, timeSpent: number) => {
    // Update workout completion count
    setWorkouts(prev => prev.map(w => 
      w.id === workout.id 
        ? { ...w, completedCount: (w.completedCount || 0) + 1 }
        : w
    ));
    
    toast.success(`Great job! You completed ${workout.name} in ${Math.floor(timeSpent / 60)} minutes`);
    setCurrentWorkout(null);
  };

  const handleBookmarkWorkout = (workout: Workout) => {
    setBookmarkedWorkouts(prev => {
      if (prev.includes(workout.id)) {
        return prev.filter(id => id !== workout.id);
      } else {
        return [...prev, workout.id];
      }
    });
  };

  const workoutTypes = [
    { id: 'all', name: 'All Types', icon: Dumbbell },
    { id: 'strength', name: 'Strength', icon: Dumbbell },
    { id: 'cardio', name: 'Cardio', icon: Heart },
    { id: 'hiit', name: 'HIIT', icon: Zap },
    { id: 'yoga', name: 'Yoga', icon: Users },
    { id: 'flexibility', name: 'Flexibility', icon: Target },
    { id: 'endurance', name: 'Endurance', icon: Timer },
  ];

  const difficultyLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600">Browse and start your fitness routines</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workout
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>

          {/* Type Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Workout Type</h3>
            <div className="flex flex-wrap gap-2">
              {workoutTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedType === type.id
                        ? 'bg-fitness-100 text-fitness-700 border border-fitness-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDifficulty === level.id
                      ? 'bg-fitness-100 text-fitness-700 border border-fitness-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Dumbbell className="w-6 h-6 text-fitness-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{filteredWorkouts.length}</div>
          <div className="text-sm text-gray-600">Available Workouts</div>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-fitness-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / filteredWorkouts.length || 0)}m
          </div>
          <div className="text-sm text-gray-600">Avg Duration</div>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-6 h-6 text-fitness-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredWorkouts.length > 0 
              ? (filteredWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) / filteredWorkouts.length).toFixed(1)
              : '0.0'
            }
          </div>
          <div className="text-sm text-gray-600">Avg Rating</div>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-fitness-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredWorkouts.reduce((sum, w) => sum + (w.completedCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Total Completions</div>
        </div>
      </div>

      {/* Workouts Grid */}
      {filteredWorkouts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12"
        >
          <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Workouts Found</h2>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters to find more workouts.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Workout
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <WorkoutCard
                workout={workout}
                onStart={handleStartWorkout}
                onBookmark={handleBookmarkWorkout}
                isBookmarked={bookmarkedWorkouts.includes(workout.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateWorkoutModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateWorkout}
      />

             {currentWorkout && (
         <WorkoutTimer
           workout={currentWorkout}
           onComplete={handleCompleteWorkout}
           onClose={() => {
             setCurrentWorkout(null);
           }}
         />
       )}
    </div>
  );
};

export default WorkoutsPage;
