import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MapPin, Calendar, MessageSquare, Target, Star,
  Shield, Lock, Globe, TrendingUp, Award, Users as GroupIcon
} from 'lucide-react';
import { Group } from '../../types/community';

interface GroupCardProps {
  group: Group;
  compact?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, compact = false }) => {
  const {
    name,
    description,
    category,
    type,
    currentMembers,
    maxMembers,
    stats,
    tags,
    coverImage,
    avatar,
    isVerified
  } = group;

  const getCategoryIcon = () => {
    switch (category) {
      case 'running': return <Target className="w-4 h-4" />;
      case 'weightlifting': return <Star className="w-4 h-4" />;
      case 'yoga': return <Award className="w-4 h-4" />;
      case 'crossfit': return <Target className="w-4 h-4" />;
      case 'cycling': return <Target className="w-4 h-4" />;
      case 'swimming': return <Target className="w-4 h-4" />;
      case 'martial-arts': return <Star className="w-4 h-4" />;
      case 'dance': return <Award className="w-4 h-4" />;
      case 'general-fitness': return <Target className="w-4 h-4" />;
      case 'nutrition': return <Award className="w-4 h-4" />;
      case 'weight-loss': return <TrendingUp className="w-4 h-4" />;
      case 'muscle-building': return <Star className="w-4 h-4" />;
      case 'endurance': return <Target className="w-4 h-4" />;
      case 'flexibility': return <Award className="w-4 h-4" />;
      default: return <GroupIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'running': return 'text-green-600 bg-green-100';
      case 'weightlifting': return 'text-blue-600 bg-blue-100';
      case 'yoga': return 'text-purple-600 bg-purple-100';
      case 'crossfit': return 'text-orange-600 bg-orange-100';
      case 'cycling': return 'text-yellow-600 bg-yellow-100';
      case 'swimming': return 'text-cyan-600 bg-cyan-100';
      case 'martial-arts': return 'text-red-600 bg-red-100';
      case 'dance': return 'text-pink-600 bg-pink-100';
      case 'general-fitness': return 'text-gray-600 bg-gray-100';
      case 'nutrition': return 'text-emerald-600 bg-emerald-100';
      case 'weight-loss': return 'text-green-600 bg-green-100';
      case 'muscle-building': return 'text-blue-600 bg-blue-100';
      case 'endurance': return 'text-purple-600 bg-purple-100';
      case 'flexibility': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      case 'invite-only': return <Shield className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'public': return 'text-green-600 bg-green-100';
      case 'private': return 'text-red-600 bg-red-100';
      case 'invite-only': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (compact) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-3">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor()}`}>
                {getCategoryIcon()}
              </div>
            )}
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                <Award className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 text-sm truncate">{name}</h4>
              <div className={`p-1 rounded-full ${getTypeColor()}`}>
                {getTypeIcon()}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentMembers} members • {stats.weeklyActivity} posts this week
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor()}`}>
                {getCategoryIcon()}
              </div>
            )}
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                <Award className="w-3 h-3" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <div className={`p-1 rounded-full ${getTypeColor()}`}>
                {getTypeIcon()}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor()}`}>
                {category.replace('-', ' ')}
              </span>
              <span className="text-sm text-gray-500 capitalize">{type}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">{currentMembers}</div>
          <div className="text-sm text-gray-500">
            {maxMembers ? `of ${maxMembers}` : ''} members
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.totalPosts}</div>
          <div className="text-xs text-gray-500">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.totalEvents}</div>
          <div className="text-xs text-gray-500">Events</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.weeklyActivity}</div>
          <div className="text-xs text-gray-500">This Week</div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Activity */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Recent Activity</span>
          <span className="text-gray-900 font-medium">{stats.weeklyActivity} posts</span>
        </div>
        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span>{stats.totalPosts} total posts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{stats.totalEvents} events</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{currentMembers} members</span>
          </div>
        </div>
        <button className="btn-primary text-sm">
          Join Group
        </button>
      </div>
    </motion.div>
  );
};

export default GroupCard;
