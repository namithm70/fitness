import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Camera } from 'lucide-react';

const ProgressPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
          <p className="text-gray-600">Track your fitness journey and achievements</p>
        </div>
        <button className="btn-primary flex items-center">
          <Camera className="w-4 h-4 mr-2" />
          Log Progress
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center py-12"
      >
        <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Progress Tracking Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Detailed analytics, progress photos, and achievement tracking will be available soon!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Charts</div>
            <div className="text-sm text-gray-600">Analytics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Photos</div>
            <div className="text-sm text-gray-600">Progress Pics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Badges</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressPage;
