import React from 'react';

interface BMICardProps {
  bmi: string;
}

const BMICard: React.FC<BMICardProps> = ({ bmi }) => {
  const bmiValue = parseFloat(bmi);
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
    if (bmi < 25) return { category: 'Normal Weight', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { category: 'Obese', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return 'Consider gaining some weight for better health';
    if (bmi < 25) return 'Great! You\'re in the healthy weight range';
    if (bmi < 30) return 'Consider losing some weight for better health';
    return 'Consider consulting a healthcare provider about weight management';
  };

  const bmiInfo = getBMICategory(bmiValue);
  const status = getBMIStatus(bmiValue);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Your BMI</h3>
        <div className="text-4xl font-bold text-white mb-2">{bmi}</div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bmiInfo.bgColor} ${bmiInfo.color}`}>
          {bmiInfo.category}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3">
        <p className="text-sm text-white/80">{status}</p>
      </div>

      {/* BMI Scale */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">BMI Categories</h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400">Underweight</span>
            <span className="text-white/70">&lt; 18.5</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-400">Normal Weight</span>
            <span className="text-white/70">18.5 - 24.9</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-yellow-400">Overweight</span>
            <span className="text-white/70">25.0 - 29.9</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-red-400">Obese</span>
            <span className="text-white/70">≥ 30.0</span>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-blue-500/20 backdrop-blur-lg border border-blue-500/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-300 mb-2">Health Tips</h4>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>• BMI is just one measure of health</li>
          <li>• Consider body composition and muscle mass</li>
          <li>• Consult healthcare provider for personalized advice</li>
        </ul>
      </div>
    </div>
  );
};

export default BMICard;
