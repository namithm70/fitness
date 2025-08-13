import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Clock, Star, Award, Target,
  Video, Globe, DollarSign, CheckCircle, XCircle, HelpCircle
} from 'lucide-react';
import { Event } from '../../types/community';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, compact = false }) => {
  const {
    title,
    description,
    type,
    category,
    startDate,
    endDate,
    locationName,
    isOnline,
    currentAttendees,
    maxAttendees,
    isFree,
    price,
    difficulty,
    status
  } = event;

  const getTypeIcon = () => {
    switch (type) {
      case 'workout': return <Target className="w-4 h-4" />;
      case 'race': return <Star className="w-4 h-4" />;
      case 'competition': return <Award className="w-4 h-4" />;
      case 'meetup': return <Users className="w-4 h-4" />;
      case 'class': return <Target className="w-4 h-4" />;
      case 'workshop': return <Star className="w-4 h-4" />;
      case 'seminar': return <Award className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'workout': return 'text-blue-600 bg-blue-100';
      case 'race': return 'text-red-600 bg-red-100';
      case 'competition': return 'text-yellow-600 bg-yellow-100';
      case 'meetup': return 'text-green-600 bg-green-100';
      case 'class': return 'text-purple-600 bg-purple-100';
      case 'workshop': return 'text-orange-600 bg-orange-100';
      case 'seminar': return 'text-indigo-600 bg-indigo-100';
      case 'social': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-orange-600 bg-orange-100';
      case 'all-levels': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilEvent = () => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
              {isOnline ? (
                <Globe className="w-3 h-3" />
              ) : (
                <MapPin className="w-3 h-3" />
              )}
              <span>{locationName}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(startDate)} • {currentAttendees} attending
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
          <div className={`p-2 rounded-full ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
                {difficulty}
              </span>
              <span className="text-sm text-gray-500 capitalize">{type}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {isFree ? 'Free' : `$${price}`}
          </div>
          <div className="text-sm text-gray-500">
            {currentAttendees}{maxAttendees ? `/${maxAttendees}` : ''} attending
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description}</p>

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          {isOnline ? (
            <Globe className="w-4 h-4 text-gray-400" />
          ) : (
            <MapPin className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-gray-600">{locationName}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {currentAttendees} attending
            {maxAttendees && ` (${maxAttendees - currentAttendees} spots left)`}
          </span>
        </div>
      </div>

      {/* Days Until Event */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">
            {getDaysUntilEvent() === 0 ? 'Today!' : `${getDaysUntilEvent()} days until event`}
          </span>
          <div className="text-2xl font-bold text-blue-600">{getDaysUntilEvent()}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(startDate)}</span>
          </div>
        </div>
        <button className="btn-primary text-sm">
          {getDaysUntilEvent() === 0 ? 'Join Now' : 'RSVP'}
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
