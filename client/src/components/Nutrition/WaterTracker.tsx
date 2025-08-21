import React, { useState } from 'react';
import { Droplets } from 'lucide-react';

interface WaterTrackerProps {
  current: number;
  target: number;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ current, target }) => {
  const [localCurrent, setLocalCurrent] = useState(current);

  const addWater = (amount: number) => {
    setLocalCurrent(prev => Math.min(prev + amount, target));
  };

  const percentage = Math.min((localCurrent / target) * 100, 100);

  const getColor = () => {
    if (percentage >= 90) return '#10B981'; // green
    if (percentage >= 60) return '#3B82F6'; // blue
    return '#F59E0B'; // yellow
  };

  return (
    <div className="space-y-4">
      {/* Water bottle visualization */}
      <div className="flex justify-center">
        <div className="relative w-20 h-32">
          {/* Bottle outline */}
          <div className="absolute inset-0 border-4 border-white/30 rounded-lg"></div>
          {/* Water level */}
          <div 
            className="absolute bottom-0 left-0 right-0 rounded-b-sm transition-all duration-500"
            style={{ 
              height: `${percentage}%`,
              backgroundColor: getColor()
            }}
          ></div>
          {/* Water drops */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <Droplets className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>

      {/* Progress text */}
      <div className="text-center">
        <div className="text-2xl font-bold text-white">
          {Math.round(localCurrent)}ml
        </div>
        <div className="text-sm text-white/80">
          {Math.round(percentage)}% of daily goal
        </div>
        <div className="text-xs text-white/70">
          Target: {target}ml
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => addWater(250)}
          className="flex items-center justify-center w-10 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors border border-white/20"
          title="Add 250ml"
        >
          <span className="text-xs font-medium">250</span>
        </button>
        <button
          onClick={() => addWater(500)}
          className="flex items-center justify-center w-10 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors border border-white/20"
          title="Add 500ml"
        >
          <span className="text-xs font-medium">500</span>
        </button>
        <button
          onClick={() => addWater(1000)}
          className="flex items-center justify-center w-10 h-10 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors border border-white/20"
          title="Add 1L"
        >
          <span className="text-xs font-medium">1L</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/20 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getColor()
          }}
        ></div>
      </div>
    </div>
  );
};

export default WaterTracker;
