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

  // Sample workout data with comprehensive exercises
  const sampleWorkouts = useMemo<Workout[]>(() => [
    {
      id: '1',
      name: 'Full Body Strength',
      type: 'strength',
      difficulty: 'intermediate',
      duration: 45,
      exercises: [
        { id: 'push-ups', name: 'Push-ups', sets: 3, reps: 12, restTime: 60, notes: 'Keep body straight, lower chest to ground' },
        { id: 'squats', name: 'Squats', sets: 4, reps: 15, restTime: 90, notes: 'Keep chest up, knees in line with toes' },
        { id: 'plank', name: 'Plank', sets: 3, reps: 1, duration: 60, restTime: 60, notes: 'Keep body straight, engage core' },
        { id: 'lunges', name: 'Lunges', sets: 3, reps: 12, restTime: 60, notes: 'Step forward, lower back knee to ground' },
        { id: 'bent-over-rows', name: 'Bent Over Rows', sets: 3, reps: 12, restTime: 90, notes: 'Pull weight to lower chest, squeeze shoulder blades' },
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
        { id: 'burpees', name: 'Burpees', sets: 4, reps: 10, restTime: 30, notes: 'Full burpee with push-up and jump' },
        { id: 'mountain-climbers', name: 'Mountain Climbers', sets: 4, reps: 1, duration: 45, restTime: 30, notes: 'Fast alternating knees' },
        { id: 'jumping-jacks', name: 'Jumping Jacks', sets: 4, reps: 1, duration: 30, restTime: 30, notes: 'Full range jumping jacks' },
        { id: 'high-knees', name: 'High Knees', sets: 4, reps: 1, duration: 30, restTime: 30, notes: 'Run in place, knees to chest' },
        { id: 'squat-jumps', name: 'Squat Jumps', sets: 4, reps: 12, restTime: 45, notes: 'Explosive jump from squat position' },
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
        { id: 'downward-dog', name: 'Downward Dog', sets: 3, reps: 1, duration: 60, restTime: 30, notes: 'Press hips back and up' },
        { id: 'warrior-1', name: 'Warrior I', sets: 2, reps: 1, duration: 45, restTime: 30, notes: 'Front knee bent, back leg straight' },
        { id: 'child-pose', name: 'Child\'s Pose', sets: 2, reps: 1, duration: 60, restTime: 30, notes: 'Relaxing stretch for back' },
        { id: 'sun-salutation', name: 'Sun Salutation', sets: 3, reps: 1, duration: 120, restTime: 60, notes: 'Complete flow sequence' },
        { id: 'cat-cow', name: 'Cat-Cow', sets: 3, reps: 10, restTime: 30, notes: 'Alternate arching and rounding back' },
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
        { id: 'pull-ups', name: 'Pull-ups', sets: 4, reps: 8, restTime: 90, notes: 'Pull chin above bar, control descent' },
        { id: 'dips', name: 'Dips', sets: 4, reps: 10, restTime: 90, notes: 'Lower body until upper arms are parallel to ground' },
        { id: 'bench-press', name: 'Bench Press', sets: 4, reps: 8, restTime: 120, notes: 'Lower bar to chest, press up explosively' },
        { id: 'overhead-press', name: 'Overhead Press', sets: 3, reps: 10, restTime: 90, notes: 'Press weight overhead, keep core tight' },
        { id: 'bicep-curls', name: 'Bicep Curls', sets: 3, reps: 12, restTime: 60, notes: 'Curl weight up, control descent' },
      ],
      description: 'Focus on building upper body strength and power.',
      tags: ['upper-body', 'strength', 'power'],
      isPublic: true,
      rating: 4.6,
      completedCount: 6,
    },
    {
      id: '5',
      name: 'Lower Body Blast',
      type: 'strength',
      difficulty: 'intermediate',
      duration: 40,
      exercises: [
        { id: 'squats', name: 'Squats', sets: 4, reps: 15, restTime: 90, notes: 'Keep chest up, knees in line with toes' },
        { id: 'deadlifts', name: 'Deadlifts', sets: 4, reps: 8, restTime: 120, notes: 'Keep back straight, drive through heels' },
        { id: 'lunges', name: 'Lunges', sets: 3, reps: 12, restTime: 60, notes: 'Step forward, lower back knee to ground' },
        { id: 'calf-raises', name: 'Calf Raises', sets: 4, reps: 20, restTime: 60, notes: 'Raise heels, hold at top' },
        { id: 'glute-bridges', name: 'Glute Bridges', sets: 3, reps: 15, restTime: 60, notes: 'Squeeze glutes at top' },
      ],
      description: 'Target your legs, glutes, and calves for a complete lower body workout.',
      tags: ['lower-body', 'strength', 'legs'],
      isPublic: true,
      rating: 4.4,
      completedCount: 9,
    },
    {
      id: '6',
      name: 'Core Crusher',
      type: 'strength',
      difficulty: 'beginner',
      duration: 25,
      exercises: [
        { id: 'plank', name: 'Plank', sets: 3, reps: 1, duration: 60, restTime: 60, notes: 'Keep body straight, engage core' },
        { id: 'crunches', name: 'Crunches', sets: 3, reps: 20, restTime: 45, notes: 'Lift shoulders off ground, don\'t pull neck' },
        { id: 'russian-twists', name: 'Russian Twists', sets: 3, reps: 20, restTime: 45, notes: 'Rotate torso, keep feet off ground' },
        { id: 'leg-raises', name: 'Leg Raises', sets: 3, reps: 15, restTime: 60, notes: 'Lower legs slowly, don\'t arch back' },
        { id: 'side-plank', name: 'Side Plank', sets: 3, reps: 1, duration: 30, restTime: 45, notes: 'Hold each side' },
      ],
      description: 'Strengthen your core with this comprehensive ab workout.',
      tags: ['core', 'abs', 'strength'],
      isPublic: true,
      rating: 4.3,
      completedCount: 18,
    },
    {
      id: '7',
      name: 'Cardio Kickboxing',
      type: 'cardio',
      difficulty: 'intermediate',
      duration: 35,
      exercises: [
        { id: 'jumping-jacks', name: 'Jumping Jacks', sets: 3, reps: 1, duration: 60, restTime: 30, notes: 'Full range of motion' },
        { id: 'high-knees', name: 'High Knees', sets: 3, reps: 1, duration: 45, restTime: 30, notes: 'Knees to chest level' },
        { id: 'burpees', name: 'Burpees', sets: 3, reps: 10, restTime: 60, notes: 'Squat, push-up, jump sequence' },
        { id: 'mountain-climbers', name: 'Mountain Climbers', sets: 3, reps: 1, duration: 60, restTime: 45, notes: 'Fast alternating knees' },
        { id: 'jump-rope', name: 'Jump Rope', sets: 3, reps: 1, duration: 120, restTime: 60, notes: 'Basic bounce or advanced moves' },
      ],
      description: 'High-energy cardio workout with boxing-inspired movements.',
      tags: ['cardio', 'boxing', 'high-energy'],
      isPublic: true,
      rating: 4.7,
      completedCount: 11,
    },
    {
      id: '8',
      name: 'Functional Fitness',
      type: 'strength',
      difficulty: 'advanced',
      duration: 55,
      exercises: [
        { id: 'kettlebell-swings', name: 'Kettlebell Swings', sets: 3, reps: 15, restTime: 90, notes: 'Hip hinge movement, swing between legs' },
        { id: 'clean-and-press', name: 'Clean and Press', sets: 3, reps: 8, restTime: 120, notes: 'Clean weight to shoulders, press overhead' },
        { id: 'farmer-walks', name: 'Farmer Walks', sets: 3, reps: 1, duration: 60, restTime: 90, notes: 'Walk with heavy weights' },
        { id: 'medicine-ball-slams', name: 'Medicine Ball Slams', sets: 3, reps: 12, restTime: 60, notes: 'Slam ball to ground' },
        { id: 'battle-ropes', name: 'Battle Ropes', sets: 3, reps: 1, duration: 45, restTime: 60, notes: 'Wave motion with ropes' },
      ],
      description: 'Functional movements that improve everyday strength and mobility.',
      tags: ['functional', 'strength', 'mobility'],
      isPublic: true,
      rating: 4.9,
      completedCount: 7,
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
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1 
            className="text-4xl font-bold text-gray-900 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              className="mr-3"
            >
              💪
            </motion.span>
            Workouts
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Browse and start your fitness routines
          </motion.p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Workout
          </button>
        </motion.div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
            />
          </div>

          {/* Type Filters */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="mr-2"
              >
                🏋️
              </motion.span>
              Workout Type
            </h3>
            <div className="flex flex-wrap gap-3">
              {workoutTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.button
                    key={type.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      selectedType === type.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filters */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="mr-2"
              >
                ⚡
              </motion.span>
              Difficulty Level
            </h3>
            <div className="flex flex-wrap gap-3">
              {difficultyLevels.map((level, index) => (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                    selectedDifficulty === level.id
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                                  >
                    {level.name}
                  </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {[
          {
            icon: <Dumbbell className="w-6 h-6" />,
            value: filteredWorkouts.length,
            label: 'Available Workouts',
            color: 'from-blue-500 to-blue-600'
          },
          {
            icon: <Clock className="w-6 h-6" />,
            value: `${Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / filteredWorkouts.length || 0)}m`,
            label: 'Avg Duration',
            color: 'from-green-500 to-green-600'
          },
          {
            icon: <Star className="w-6 h-6" />,
            value: filteredWorkouts.length > 0 
              ? (filteredWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) / filteredWorkouts.length).toFixed(1)
              : '0.0',
            label: 'Avg Rating',
            color: 'from-yellow-500 to-yellow-600'
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            value: filteredWorkouts.reduce((sum, w) => sum + (w.completedCount || 0), 0),
            label: 'Total Completions',
            color: 'from-purple-500 to-purple-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div 
              className={`flex items-center justify-center mb-3 p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              {stat.icon}
            </motion.div>
            <motion.div 
              className="text-3xl font-bold text-gray-900 mb-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            >
              {stat.value}
            </motion.div>
            <div className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Workouts Grid */}
      {filteredWorkouts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Dumbbell className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Workouts Found</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Try adjusting your search or filters to find more workouts.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Workout
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <WorkoutCard
                workout={workout}
                onStart={handleStartWorkout}
                onBookmark={handleBookmarkWorkout}
                isBookmarked={bookmarkedWorkouts.includes(workout.id)}
              />
            </motion.div>
          ))}
        </motion.div>
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
