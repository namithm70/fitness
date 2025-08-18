import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, UserPlus, FileText, Star, Heart, MessageSquare, Share2 } from 'lucide-react';

interface UserStatsProps {
  stats: {
    followers: number;
    following: number;
    posts: number;
    reputation: number;
    level: number;
    experience: number;
  };
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  const { followers, following, posts, reputation, level, experience } = stats;

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600 bg-purple-100';
    if (level >= 5) return 'text-blue-600 bg-blue-100';
    if (level >= 3) return 'text-green-600 bg-green-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Legend';
    if (level >= 5) return 'Expert';
    if (level >= 3) return 'Advanced';
    if (level >= 2) return 'Intermediate';
    return 'Beginner';
  };

  const experienceToNextLevel = 1000 - (experience % 1000);

  const statCards = [
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Followers',
      value: followers,
      color: 'text-blue-600 bg-blue-100',
      description: 'People following you'
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: 'Following',
      value: following,
      color: 'text-green-600 bg-green-100',
      description: 'People you follow'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Posts',
      value: posts,
      color: 'text-purple-600 bg-purple-100',
      description: 'Posts created'
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Reputation',
      value: reputation,
      color: 'text-yellow-600 bg-yellow-100',
      description: 'Community reputation'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Level and Experience */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getLevelColor(level)}`}>
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Level {level} - {getLevelTitle(level)}
              </h3>
              <p className="text-sm text-gray-600">
                {experience} XP • {experienceToNextLevel} XP to next level
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{reputation}</div>
            <div className="text-sm text-gray-600">Reputation Points</div>
          </div>
        </div>
        
        {/* Experience Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(experience % 1000) / 10}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500 text-center">
          {experience % 1000} / 1000 XP to Level {level + 1}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card text-center hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-gray-500">
              {stat.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Like Posts</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Join Challenge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
