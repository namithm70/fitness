import React from 'react';
import { WeeklyData } from '../../types/nutrition';

interface WeeklyChartProps {
  data: WeeklyData[];
  target: number;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, target }) => {
  const maxCalories = Math.max(...data.map(d => d.calories), target);

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getBarColor = (calories: number) => {
    const percentage = (calories / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'bg-green-500';
    if (percentage > 110) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="flex items-end justify-between h-32 space-x-2">
        {data.map((day, index) => (
          <div key={day.date} className="flex-1 flex flex-col items-center">
            {/* Bar */}
            <div className="w-full flex justify-center">
              <div 
                className={`w-full rounded-t transition-all duration-500 ${getBarColor(day.calories)}`}
                style={{ 
                  height: `${Math.max((day.calories / maxCalories) * 100, 5)}%`,
                  minHeight: '4px'
                }}
              ></div>
            </div>
            
            {/* Day label */}
            <div className="text-xs text-gray-600 mt-2 text-center">
              {getDayName(day.date)}
            </div>
            
            {/* Calories */}
            <div className="text-xs font-medium text-gray-900 mt-1">
              {Math.round(day.calories)}
            </div>
          </div>
        ))}
      </div>

      {/* Target line */}
      <div className="relative">
        <div 
          className="absolute w-full border-t-2 border-dashed border-gray-400"
          style={{ 
            top: `${100 - (target / maxCalories) * 100}%`
          }}
        ></div>
        <div className="text-xs text-gray-500 text-right">
          Target: {target} cal
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {Math.round(data.reduce((sum, day) => sum + day.calories, 0) / 7)}
          </div>
          <div className="text-xs text-gray-600">Avg Daily</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {Math.round(data.reduce((sum, day) => sum + day.protein, 0) / 7)}
          </div>
          <div className="text-xs text-gray-600">Avg Protein</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {data.filter(day => day.calories > 0).length}
          </div>
          <div className="text-xs text-gray-600">Days Tracked</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
