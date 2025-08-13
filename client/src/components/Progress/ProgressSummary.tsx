import React from 'react';
import { TrendingUp, Target, Trophy, BarChart3, Activity, Calendar, Users, Clock } from 'lucide-react';

interface ProgressSummaryProps {
  summary: {
    totalEntries: number;
    totalGoals: number;
    completedGoals: number;
    totalAchievements: number;
  };
  workoutStats: {
    totalWorkouts: number;
    totalDuration: number;
    avgDuration: number;
  };
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ summary, workoutStats }) => {
  const cards = [
    {
      title: 'Progress Entries',
      value: summary.totalEntries,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Goals',
      value: summary.totalGoals - summary.completedGoals,
      icon: <Target className="w-5 h-5" />,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Completed Goals',
      value: summary.completedGoals,
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Achievements',
      value: summary.totalAchievements,
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Workouts',
      value: workoutStats.totalWorkouts,
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Avg Workout Time',
      value: `${Math.round(workoutStats.avgDuration)} min`,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`w-10 h-10 ${card.bgColor} rounded-full flex items-center justify-center`}>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSummary;
