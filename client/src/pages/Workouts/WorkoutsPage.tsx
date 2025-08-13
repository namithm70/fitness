import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Search, Filter } from 'lucide-react';

const WorkoutsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600">Browse and start your fitness routines</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Workout
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workouts..."
              className="input-field pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center py-12"
      >
        <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Workout Library Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          We're building an extensive library of workouts for all fitness levels. 
          Stay tuned for hundreds of professionally designed routines!
        </p>
        <div className="flex justify-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-fitness-600">500+</div>
            <div className="text-sm text-gray-600">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-fitness-600">50+</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-fitness-600">3</div>
            <div className="text-sm text-gray-600">Difficulty Levels</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutsPage;
