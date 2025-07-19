'use client';

import React from 'react';

interface BlobContainerProps {
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

/**
 * BlobContainer - A reusable component for applying organic blob shapes
 * Part of Phase 1: Organic Design Elements implementation
 */
export const BlobContainer: React.FC<BlobContainerProps> = ({ 
  size, 
  children,
  className = ''
}) => (
  <div 
    className={`blob-container ${className}`}
    data-blob-size={size}
    style={{ 
      clipPath: `var(--blob-radius-${size})` 
    } as React.CSSProperties}
  >
    {children}
  </div>
);

export default BlobContainer;
