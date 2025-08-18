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
    if (level >= 10) return 'text-purple-400 bg-purple-500/20';
    if (level >= 5) return 'text-blue-400 bg-blue-500/20';
    if (level >= 3) return 'text-green-400 bg-green-500/20';
    return 'text-white bg-white/20';
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
      color: 'text-blue-400 bg-blue-500/20',
      description: 'People following you'
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: 'Following',
      value: following,
      color: 'text-green-400 bg-green-500/20',
      description: 'People you follow'
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: 'Posts',
      value: posts,
      color: 'text-purple-400 bg-purple-500/20',
      description: 'Posts created'
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Reputation',
      value: reputation,
      color: 'text-yellow-400 bg-yellow-500/20',
      description: 'Community reputation'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Level and Experience */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${getLevelColor(level)}`}>
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Level {level} - {getLevelTitle(level)}
              </h3>
              <p className="text-sm text-white/80">
                {experience} XP • {experienceToNextLevel} XP to next level
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{reputation}</div>
            <div className="text-sm text-white/80">Reputation Points</div>
          </div>
        </div>
        
        {/* Experience Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(experience % 1000) / 10}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          />
        </div>
        <p className="text-xs text-white/60 text-center">
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
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg text-center hover:bg-white/15 transition-all duration-200"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-white/90 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-white/70">
              {stat.description}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Like Posts</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors border border-purple-500/30">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors border border-orange-500/30">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Join Challenge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
