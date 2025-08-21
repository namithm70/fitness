import React from 'react';
import { ProgressEntry } from '../../types/progress';

interface MeasurementChartProps {
	data: ProgressEntry[];
}

const MeasurementChart: React.FC<MeasurementChartProps> = ({ data }) => {
	if (data.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-white/70">No measurement data available</p>
				<p className="text-sm text-white/60">Start logging your measurements to see progress</p>
			</div>
		);
	}

	// Get all measurement types that have data
	const measurementTypes = ['chest', 'waist', 'hips', 'biceps', 'thighs', 'calves'];
	const availableMeasurements = measurementTypes.filter(type => 
		data.some(entry => entry.measurements?.[type as keyof typeof entry.measurements])
	);

	if (availableMeasurements.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-white/70">No measurement data available</p>
				<p className="text-sm text-white/60">Start logging your measurements to see progress</p>
			</div>
		);
	}

	// Sort data by date
	const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	// Get latest measurements
	const latestEntry = sortedData[sortedData.length - 1];
	const previousEntry = sortedData.length > 1 ? sortedData[sortedData.length - 2] : null;

	const colors = {
		chest: '#3B82F6',
		waist: '#EF4444',
		hips: '#8B5CF6',
		biceps: '#F59E0B',
		thighs: '#10B981',
		calves: '#06B6D4'
	};

	return (
		<div className="space-y-4">
			{/* Latest Measurements */}
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{availableMeasurements.map((type) => {
					const current = latestEntry.measurements?.[type as keyof typeof latestEntry.measurements];
					const previous = previousEntry?.measurements?.[type as keyof typeof previousEntry.measurements];
					const change = previous ? (current || 0) - previous : 0;
					const changePercent = previous ? ((change / previous) * 100) : 0;

					return (
						<div key={type} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-white capitalize">{type}</span>
								<div 
									className="w-3 h-3 rounded-full"
									style={{ backgroundColor: colors[type as keyof typeof colors] }}
								></div>
							</div>
							<div className="text-lg font-bold text-white">
								{current?.toFixed(1)} cm
							</div>
							{previous && (
								<div className={`text-xs ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
									{change >= 0 ? '+' : ''}{change.toFixed(1)} cm ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%)
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Simple Chart */}
			<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
				<h3 className="text-sm font-medium text-white mb-3">Measurement Trends</h3>
				<div className="space-y-2">
					{availableMeasurements.slice(0, 3).map((type, index) => {
						const measurements = sortedData
							.map(entry => entry.measurements?.[type as keyof typeof entry.measurements])
							.filter((m): m is number => m !== undefined);
						
						if (measurements.length < 2) return null;

						const min = Math.min(...measurements);
						const max = Math.max(...measurements);
						const range = max - min;
						const latest = measurements[measurements.length - 1];
						const progress = range > 0 ? ((latest - min) / range) * 100 : 50;

						return (
							<div key={type} className="space-y-1">
								<div className="flex justify-between text-xs text-white/70">
									<span className="capitalize">{type}</span>
									<span>{latest?.toFixed(1)} cm</span>
								</div>
								<div className="w-full bg-white/20 rounded-full h-2">
									<div
										className="h-2 rounded-full transition-all duration-300"
										style={{ 
											width: `${progress}%`,
											backgroundColor: colors[type as keyof typeof colors]
										}}
									></div>
								</div>
						</div>
					);
				})}
			</div>
			</div>
		</div>
	);
};

export default MeasurementChart;
