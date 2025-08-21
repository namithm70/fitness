import React from 'react';

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

const MacroChart: React.FC<MacroChartProps> = ({
  protein,
  carbs,
  fat,
  proteinTarget,
  carbsTarget,
  fatTarget
}) => {
  const totalCalories = protein * 4 + carbs * 4 + fat * 9;
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;

  const proteinPercentage = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
  const carbsPercentage = totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
  const fatPercentage = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'bg-green-500';
    if (percentage > 110) return 'bg-red-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-4">
      {/* Macro breakdown bars */}
      <div className="space-y-3">
        {/* Protein */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white font-medium">Protein</span>
            <span className="font-medium text-white">{protein}g / {proteinTarget}g</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(protein, proteinTarget)}`}
              style={{ width: `${Math.min((protein / proteinTarget) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-white/70 mt-1">
            {Math.round(proteinPercentage)}% of calories • {Math.round(proteinCalories)} cal
          </div>
        </div>

        {/* Carbs */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white font-medium">Carbs</span>
            <span className="font-medium text-white">{carbs}g / {carbsTarget}g</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(carbs, carbsTarget)}`}
              style={{ width: `${Math.min((carbs / carbsTarget) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-white/70 mt-1">
            {Math.round(carbsPercentage)}% of calories • {Math.round(carbsCalories)} cal
          </div>
        </div>

        {/* Fat */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white font-medium">Fat</span>
            <span className="font-medium text-white">{fat}g / {fatTarget}g</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(fat, fatTarget)}`}
              style={{ width: `${Math.min((fat / fatTarget) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-white/70 mt-1">
            {Math.round(fatPercentage)}% of calories • {Math.round(fatCalories)} cal
          </div>
        </div>
      </div>

      {/* Macro ratio pie chart */}
      <div className="mt-4">
        <div className="text-sm font-medium text-white mb-2">Macro Ratio</div>
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Protein slice */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="20"
                strokeDasharray={`${proteinPercentage * 2.51} ${100 * 2.51}`}
                strokeDashoffset="0"
              />
              {/* Carbs slice */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="20"
                strokeDasharray={`${carbsPercentage * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`-${proteinPercentage * 2.51}`}
              />
              {/* Fat slice */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="20"
                strokeDasharray={`${fatPercentage * 2.51} ${100 * 2.51}`}
                strokeDashoffset={`-${(proteinPercentage + carbsPercentage) * 2.51}`}
              />
            </svg>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-4 mt-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-white">Protein</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-white">Carbs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span className="text-white">Fat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacroChart;
