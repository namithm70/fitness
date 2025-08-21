import React from 'react';
import { ProgressEntry } from '../../types/progress';

interface WeightChartProps {
  data: ProgressEntry[];
}

const WeightChart: React.FC<WeightChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No weight data available</p>
        <p className="text-sm text-white/60">Start logging your weight to see progress</p>
      </div>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get min and max values for scaling
  const weights = sortedData.map(entry => entry.weight || 0).filter(weight => weight > 0);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight;
  
  // Chart dimensions
  const width = 100;
  const height = 60;
  const padding = 10;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  // Generate SVG path
  const generatePath = () => {
    if (sortedData.length < 2) return '';

    const points = sortedData
      .filter(entry => entry.weight && entry.weight > 0)
      .map((entry, index) => {
        const x = padding + (index / (sortedData.length - 1)) * chartWidth;
        const normalizedWeight = weightRange > 0 
          ? ((entry.weight! - minWeight) / weightRange) 
          : 0.5;
        const y = padding + chartHeight - (normalizedWeight * chartHeight);
        return `${x},${y}`;
      });

    return `M ${points.join(' L ')}`;
  };

  const path = generatePath();

  // Calculate trend
  const calculateTrend = () => {
    if (sortedData.length < 2) return { direction: 'neutral', change: 0 };
    
    const firstWeight = sortedData[0].weight || 0;
    const lastWeight = sortedData[sortedData.length - 1].weight || 0;
    const change = lastWeight - firstWeight;
    
    if (change > 0.5) return { direction: 'up', change: Math.abs(change) };
    if (change < -0.5) return { direction: 'down', change: Math.abs(change) };
    return { direction: 'neutral', change: Math.abs(change) };
  };

  const trend = calculateTrend();

  return (
    <div className="space-y-4">
      {/* Trend Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/70">Trend:</span>
          <span className={`text-sm font-medium ${
            trend.direction === 'up' ? 'text-red-400' : 
            trend.direction === 'down' ? 'text-green-400' : 'text-white/70'
          }`}>
            {trend.direction === 'up' ? '↗' : 
             trend.direction === 'down' ? '↘' : '→'} 
            {trend.change > 0 ? `${trend.change.toFixed(1)} kg` : 'Stable'}
          </span>
        </div>
        <div className="text-sm text-white/70">
          {sortedData.length} entries
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          {weightRange > 0 && (
            <>
              <text x={padding - 2} y={padding + 4} className="text-xs fill-white/60" textAnchor="end">
                {maxWeight.toFixed(1)}
              </text>
              <text x={padding - 2} y={height - padding - 4} className="text-xs fill-white/60" textAnchor="end">
                {minWeight.toFixed(1)}
              </text>
            </>
          )}

          {/* Data points */}
          {sortedData
            .filter(entry => entry.weight && entry.weight > 0)
            .map((entry, index) => {
              const x = padding + (index / (sortedData.length - 1)) * chartWidth;
              const normalizedWeight = weightRange > 0 
                ? ((entry.weight! - minWeight) / weightRange) 
                : 0.5;
              const y = padding + chartHeight - (normalizedWeight * chartHeight);
              
              return (
                <circle
                  key={entry._id}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3B82F6"
                  className="hover:r-3 transition-all"
                />
              );
            })}

          {/* Line chart */}
          {path && (
            <path
              d={path}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Latest weight label */}
          {sortedData.length > 0 && sortedData[sortedData.length - 1].weight && (
            <text
              x={width - padding}
              y={padding + 4}
              className="text-xs fill-white/90 font-medium"
              textAnchor="end"
            >
              {sortedData[sortedData.length - 1].weight} kg
            </text>
          )}
        </svg>
      </div>

      {/* Date range */}
      <div className="flex justify-between text-xs text-white/60">
        <span>
          {sortedData[0] && new Date(sortedData[0].date).toLocaleDateString()}
        </span>
        <span>
          {sortedData[sortedData.length - 1] && 
           new Date(sortedData[sortedData.length - 1].date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default WeightChart;
