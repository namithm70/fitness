import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { Achievement } from '../../types/progress';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic':
        return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white';
      case 'uncommon':
        return 'bg-gradient-to-r from-green-400 to-teal-500 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <Star className="w-4 h-4" />;
      case 'epic':
        return <Trophy className="w-4 h-4" />;
      case 'rare':
        return <Award className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        {/* Achievement Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRarityColor(achievement.rarity)}`}>
          <span className="text-2xl">{achievement.icon}</span>
        </div>

        {/* Achievement Details */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{achievement.title}</h3>
            <div className="flex items-center space-x-1">
              {getRarityIcon(achievement.rarity)}
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
          
          {/* Progress */}
          {!achievement.isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{achievement.progress.current} / {achievement.progress.target} {achievement.criteria.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300 bg-blue-500"
                  style={{ width: `${achievement.progress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Achievement Date */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {new Date(achievement.achievedAt).toLocaleDateString()}
            </span>
            {achievement.points > 0 && (
              <span className="text-xs font-medium text-blue-600">
                +{achievement.points} pts
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
