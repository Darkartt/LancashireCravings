'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-accent-primary',
    secondary: 'text-accent-secondary',
    muted: 'text-text-muted',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-text-muted">{message}</p>
      </div>
    </div>
  );
}

interface LoadingSectionProps {
  height?: number;
  message?: string;
  className?: string;
}

export function LoadingSection({ 
  height = 200, 
  message = 'Loading...', 
  className = '' 
}: LoadingSectionProps) {
  return (
    <div 
      className={`flex items-center justify-center bg-accent-primary/5 rounded-lg ${className}`}
      style={{ height: `${height}px` }}
    >
      <div className="text-center">
        <LoadingSpinner className="mx-auto mb-2" />
        <p className="text-text-muted text-sm">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
