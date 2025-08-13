import React from 'react';
import { Target, Calendar, Award, Clock } from 'lucide-react';
import { Goal } from '../../types/progress';

interface GoalCardProps {
  goal: Goal;
  onUpdate: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate }) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (goal.status === 'completed') return <Award className="w-4 h-4 text-green-600" />;
    if (goal.isOverdue) return <Clock className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  const getStatusText = () => {
    if (goal.status === 'completed') return 'Completed';
    if (goal.isOverdue) return 'Overdue';
    if (goal.daysRemaining && goal.daysRemaining <= 7) return `${goal.daysRemaining} days left`;
    return 'Active';
  };

  const getStatusColor = () => {
    if (goal.status === 'completed') return 'text-green-600';
    if (goal.isOverdue) return 'text-red-600';
    if (goal.daysRemaining && goal.daysRemaining <= 7) return 'text-orange-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{goal.title}</h3>
          {goal.description && (
            <p className="text-xs text-gray-600 mt-1">{goal.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(goal.progressPercentage || 0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                goal.progressPercentage && goal.progressPercentage >= 80 
                  ? 'bg-green-500' 
                  : goal.progressPercentage && goal.progressPercentage >= 60 
                  ? 'bg-yellow-500' 
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(goal.progressPercentage || 0, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Target Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Target className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              {new Date(goal.targetDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Priority Badge */}
        {goal.priority && goal.priority !== 'medium' && (
          <div className="flex justify-end">
            <span className={`text-xs px-2 py-1 rounded-full ${
              goal.priority === 'high' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {goal.priority} priority
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
