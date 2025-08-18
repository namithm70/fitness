import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-white/80">Manage your account and preferences</p>
        </div>
        <button className="bg-white text-purple-600 hover:bg-white/90 flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-white/80">{user?.email}</p>
                <p className="text-sm text-white/60">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Fitness Level</h3>
                <p className="text-white/80 capitalize">{user?.fitnessLevel}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.fitnessGoals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                    >
                      {goal.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg"
          >
            <h3 className="font-semibold text-white mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/80">Total Workouts</span>
                <span className="font-semibold text-white">{user?.totalWorkouts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Current Streak</span>
                <span className="font-semibold text-white">{user?.streakDays || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Time</span>
                <span className="font-semibold text-white">{Math.floor((user?.totalWorkoutTime || 0) / 60)}h</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Settings Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg text-center py-12"
      >
        <Settings className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings Coming Soon</h2>
        <p className="text-white/70">
          Advanced profile customization and settings will be available soon!
        </p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
