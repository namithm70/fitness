import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Users, Calendar, Trophy, Award, Clock, MapPin,
  TrendingUp, Star, Users as GroupIcon, Award as Medal
} from 'lucide-react';
import { Challenge } from '../../types/community';

interface ChallengeCardProps {
  challenge: Challenge;
  compact?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, compact = false }) => {
  const {
    title,
    description,
    type,
    category,
    targetValue,
    unit,
    duration,
    startDate,
    endDate,
    currentParticipants,
    maxParticipants,
    difficulty,
    rewards,
    tags,
    coverImage
  } = challenge;

  const getTypeIcon = () => {
    switch (type) {
      case 'weight-loss': return <TrendingUp className="w-4 h-4" />;
      case 'strength': return <Target className="w-4 h-4" />;
      case 'endurance': return <Clock className="w-4 h-4" />;
      case 'flexibility': return <Star className="w-4 h-4" />;
      case 'workout-frequency': return <Calendar className="w-4 h-4" />;
      case 'nutrition': return <Award className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'weight-loss': return 'text-green-600 bg-green-100';
      case 'strength': return 'text-blue-600 bg-blue-100';
      case 'endurance': return 'text-purple-600 bg-purple-100';
      case 'flexibility': return 'text-yellow-600 bg-yellow-100';
      case 'workout-frequency': return 'text-orange-600 bg-orange-100';
      case 'nutrition': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  if (compact) {
    return (
      <div className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">{title}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {currentParticipants} participants • {getDaysRemaining()}d left
            </p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
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
          <div className={`p-2 rounded-full ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
                {difficulty}
              </span>
              <span className="text-sm text-gray-500 capitalize">{type.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{targetValue}</div>
          <div className="text-sm text-gray-500">{unit}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{duration}</div>
          <div className="text-xs text-gray-500">Days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{currentParticipants}</div>
          <div className="text-xs text-gray-500">
            {maxParticipants ? `of ${maxParticipants}` : ''} Participants
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{getDaysRemaining()}</div>
          <div className="text-xs text-gray-500">Days Left</div>
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

      {/* Rewards */}
      {rewards && (rewards.firstPlace || rewards.participation) && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Rewards</span>
          </div>
          <div className="text-xs text-yellow-700">
            {rewards.firstPlace && <div>🥇 {rewards.firstPlace}</div>}
            {rewards.participation && <div>🎁 {rewards.participation}</div>}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
        </div>
        <button className="btn-primary text-sm">
          Join Challenge
        </button>
      </div>
    </motion.div>
  );
};

export default ChallengeCard;
