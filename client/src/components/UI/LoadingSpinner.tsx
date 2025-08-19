import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  // Inline styles as fallback
  const spinnerStyle = {
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    width: size === 'sm' ? '16px' : size === 'md' ? '32px' : '48px',
    height: size === 'sm' ? '16px' : size === 'md' ? '32px' : '48px',
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${className}`}>
      <div className={`spinner ${sizeClasses[size]}`} style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingSpinner;
