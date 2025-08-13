import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Trophy } from 'lucide-react';

const CommunityPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600">Connect with fellow fitness enthusiasts</p>
        </div>
        <button className="btn-primary flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" />
          New Post
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center py-12"
      >
        <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Features Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Forums, challenges, and social features will be available soon!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Forums</div>
            <div className="text-sm text-gray-600">Discussions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Challenges</div>
            <div className="text-sm text-gray-600">Monthly Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Partners</div>
            <div className="text-sm text-gray-600">Find Workout Buddies</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityPage;
