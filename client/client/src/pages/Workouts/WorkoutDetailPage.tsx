import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Target, Users, Star } from 'lucide-react';

const WorkoutDetailPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams();
  // TODO: Use id to fetch workout details when API is implemented

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center py-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Workout Details</h1>
        <p className="text-gray-600 mb-6">
          Detailed workout information and exercise tracking coming soon!
        </p>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <Clock className="w-8 h-8 text-fitness-600 mx-auto mb-2" />
            <div className="text-lg font-semibold">45 min</div>
            <div className="text-sm text-gray-600">Duration</div>
          </div>
          <div className="text-center">
            <Target className="w-8 h-8 text-fitness-600 mx-auto mb-2" />
            <div className="text-lg font-semibold">Intermediate</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-fitness-600 mx-auto mb-2" />
            <div className="text-lg font-semibold">1.2k</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <Star className="w-8 h-8 text-fitness-600 mx-auto mb-2" />
            <div className="text-lg font-semibold">4.8</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
        </div>
        <button className="btn-primary mt-6 flex items-center mx-auto">
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </button>
      </motion.div>
    </div>
  );
};

export default WorkoutDetailPage;
