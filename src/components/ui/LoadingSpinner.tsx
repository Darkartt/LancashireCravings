'use client';

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-[var(--accent-primary)]`}></div>
      {message && (
        <p className="text-[var(--text-muted)] text-sm font-medium">{message}</p>
      )}
    </div>
  );
}

// Simple page loading fallback
export function PageLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--accent-primary)] mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Lancaster Carving</h2>
          <p className="text-[var(--text-muted)]">Loading your woodcarving experience...</p>
        </div>
      </div>
    </div>
  );
}
