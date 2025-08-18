import React from 'react';
import { Target, Award, Clock, Activity } from 'lucide-react';

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
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-blue-400',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      title: 'Active Goals',
      value: summary.totalGoals - summary.completedGoals,
      icon: <Target className="w-5 h-5" />,
      color: 'bg-green-400',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    {
      title: 'Completed Goals',
      value: summary.completedGoals,
      icon: <Award className="w-5 h-5" />,
      color: 'bg-yellow-400',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400'
    },
    {
      title: 'Achievements',
      value: summary.totalAchievements,
      icon: <Award className="w-5 h-5" />,
      color: 'bg-purple-400',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      title: 'Total Workouts',
      value: workoutStats.totalWorkouts,
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-red-400',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400'
    },
    {
      title: 'Avg Workout Time',
      value: `${Math.round(workoutStats.avgDuration)} min`,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-indigo-400',
      bgColor: 'bg-indigo-500/20',
      textColor: 'text-indigo-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">{card.title}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
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
