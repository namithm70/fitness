import React from 'react';

interface CalorieCircleProps {
  current: number;
  target: number;
}

const CalorieCircle: React.FC<CalorieCircleProps> = ({ current, target }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((current / target) * 100, 100);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 90 && percentage <= 110) return '#10B981'; // green
    if (percentage > 110) return '#EF4444'; // red
    return '#3B82F6'; // blue
  };

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 140 140">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-gray-600">
            {current} / {target}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCircle;
