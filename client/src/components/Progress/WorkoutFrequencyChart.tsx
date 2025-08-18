import React from 'react';

interface WorkoutFrequencyChartProps {
  workoutStats: {
    totalWorkouts: number;
    totalDuration: number;
    avgDuration: number;
  };
}

const WorkoutFrequencyChart: React.FC<WorkoutFrequencyChartProps> = ({ workoutStats }) => {
  // Generate sample data for the last 30 days
  const generateSampleData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random workout data (in real app, this would come from API)
      const hasWorkout = Math.random() > 0.7; // 30% chance of workout
      const duration = hasWorkout ? Math.floor(Math.random() * 60) + 30 : 0; // 30-90 minutes
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: hasWorkout ? 1 : 0,
        duration: duration
      });
    }
    
    return data;
  };

  const data = generateSampleData();
  const totalWorkouts = data.reduce((sum, day) => sum + day.count, 0);
  const totalDuration = data.reduce((sum, day) => sum + day.duration, 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  // Find the maximum duration for scaling
  const maxDuration = Math.max(...data.map(d => d.duration));

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{totalWorkouts}</div>
          <div className="text-xs text-white/80">Workouts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{totalDuration}</div>
          <div className="text-xs text-white/80">Total Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{avgDuration}</div>
          <div className="text-xs text-white/80">Avg Duration</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">Last 30 Days</h3>
        <div className="flex items-end justify-between h-20 space-x-1">
          {data.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-400 rounded-t transition-all duration-300 hover:bg-blue-300"
                style={{ 
                  height: maxDuration > 0 ? `${(day.duration / maxDuration) * 100}%` : '0%',
                  minHeight: day.duration > 0 ? '4px' : '0px'
                }}
                title={`${day.date}: ${day.duration} minutes`}
              ></div>
              {index % 7 === 0 && (
                <span className="text-xs text-white/70 mt-1">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Streak Info */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Current Streak</p>
            <p className="text-xs text-blue-200">Keep up the great work!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              {Math.floor(Math.random() * 7) + 1}
            </div>
            <div className="text-xs text-blue-200">days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutFrequencyChart;
