import React from 'react';
import { Loader2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        loading || disabled
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      } ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

interface LoadingCardProps {
  loading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  error?: string;
  onRetry?: () => void;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({
  loading,
  children,
  skeleton,
  error,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        {skeleton || (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  text = 'Loading...'
}) => {
  if (!loading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
          <p className="text-white/90">{text}</p>
        </div>
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'idle';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  text,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className={`${sizeClasses[size]} animate-spin`} />
            <span>{text || 'Loading...'}</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className={sizeClasses[size]} />
            <span>{text || 'Success'}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className={sizeClasses[size]} />
            <span>{text || 'Error'}</span>
          </div>
        );
      case 'idle':
        return (
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className={sizeClasses[size]} />
            <span>{text || 'Ready'}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return getStatusContent();
};

export default LoadingSpinner;
