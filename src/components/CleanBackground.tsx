'use client';

import React, { useEffect, useState } from 'react';

interface CleanBackgroundProps {
  variant?: 'home' | 'about' | 'portfolio' | 'shop' | 'commission' | 'contact' | 'blog' | 'services' | 'process';
  className?: string;
}

const CleanBackground: React.FC<CleanBackgroundProps> = ({ 
  variant = 'home', 
  className = '' 
}) => {
  const [offset, setOffset] = useState(0);

  // Throttled animation for better performance
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      // Only update every 100ms for smooth but efficient animation
      if (currentTime - lastTime >= 100) {
        setOffset(prev => (prev + 0.5) % 100);
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Background with fallback colors and better visibility
  const backgroundStyles: Record<string, React.CSSProperties> = {
    home: {
      background: `
        radial-gradient(circle at ${20 + Math.sin(offset * 0.1) * 2}% ${50 + Math.cos(offset * 0.15) * 2}%, var(--accent-tertiary, #D2B48C) 0%, transparent 70%),
        radial-gradient(circle at ${80 + Math.sin(offset * 0.12) * 1.5}% ${20 + Math.cos(offset * 0.08) * 1.5}%, var(--accent-primary, #8B4513) 0%, transparent 70%),
        radial-gradient(circle at ${40 + Math.sin(offset * 0.09) * 2}% ${80 + Math.cos(offset * 0.11) * 2}%, var(--accent-secondary, #556B2F) 0%, transparent 70%)
      `,
    },
    about: {
      background: `
        radial-gradient(circle at ${30 + Math.sin(offset * 0.1) * 2}% ${40 + Math.cos(offset * 0.13) * 2}%, var(--accent-warm, #CD853F) 0%, transparent 70%),
        radial-gradient(circle at ${70 + Math.sin(offset * 0.11) * 1.5}% ${60 + Math.cos(offset * 0.09) * 1.5}%, var(--accent-tertiary, #D2B48C) 0%, transparent 70%)
      `,
    },
    portfolio: {
      background: `
        radial-gradient(circle at ${25 + Math.sin(offset * 0.12) * 2}% ${75 + Math.cos(offset * 0.1) * 2}%, var(--accent-secondary, #556B2F) 0%, transparent 70%),
        radial-gradient(circle at ${75 + Math.sin(offset * 0.08) * 1.5}% ${25 + Math.cos(offset * 0.14) * 1.5}%, var(--accent-primary, #8B4513) 0%, transparent 70%)
      `,
    },
    shop: {
      background: `
        radial-gradient(circle at ${60 + Math.sin(offset * 0.11) * 2}% ${30 + Math.cos(offset * 0.12) * 2}%, var(--accent-warm, #CD853F) 0%, transparent 70%),
        radial-gradient(circle at ${20 + Math.sin(offset * 0.09) * 1.5}% ${70 + Math.cos(offset * 0.1) * 1.5}%, var(--accent-tertiary, #D2B48C) 0%, transparent 70%)
      `,
    },
    commission: {
      background: `
        radial-gradient(circle at ${50 + Math.sin(offset * 0.1) * 2}% ${20 + Math.cos(offset * 0.11) * 2}%, var(--accent-primary, #8B4513) 0%, transparent 70%),
        radial-gradient(circle at ${30 + Math.sin(offset * 0.13) * 1.5}% ${80 + Math.cos(offset * 0.09) * 1.5}%, var(--accent-secondary, #556B2F) 0%, transparent 70%)
      `,
    },
    contact: {
      background: `
        radial-gradient(circle at ${40 + Math.sin(offset * 0.12) * 2}% ${60 + Math.cos(offset * 0.1) * 2}%, var(--accent-tertiary, #D2B48C) 0%, transparent 70%),
        radial-gradient(circle at ${80 + Math.sin(offset * 0.08) * 1.5}% ${40 + Math.cos(offset * 0.13) * 1.5}%, var(--accent-warm, #CD853F) 0%, transparent 70%)
      `,
    },
    blog: {
      background: `
        radial-gradient(circle at ${70 + Math.sin(offset * 0.11) * 2}% ${80 + Math.cos(offset * 0.12) * 2}%, var(--accent-warm, #CD853F) 0%, transparent 70%),
        radial-gradient(circle at ${30 + Math.sin(offset * 0.09) * 1.5}% ${20 + Math.cos(offset * 0.1) * 1.5}%, var(--accent-secondary, #556B2F) 0%, transparent 70%)
      `,
    },
    services: {
      background: `
        radial-gradient(circle at ${80 + Math.sin(offset * 0.1) * 2}% ${60 + Math.cos(offset * 0.11) * 2}%, var(--accent-secondary, #556B2F) 0%, transparent 70%),
        radial-gradient(circle at ${20 + Math.sin(offset * 0.12) * 1.5}% ${40 + Math.cos(offset * 0.09) * 1.5}%, var(--accent-primary, #8B4513) 0%, transparent 70%)
      `,
    },
    process: {
      background: `
        radial-gradient(circle at ${60 + Math.sin(offset * 0.13) * 2}% ${70 + Math.cos(offset * 0.1) * 2}%, var(--accent-tertiary, #D2B48C) 0%, transparent 70%),
        radial-gradient(circle at ${40 + Math.sin(offset * 0.08) * 1.5}% ${30 + Math.cos(offset * 0.12) * 1.5}%, var(--accent-warm, #CD853F) 0%, transparent 70%)
      `,
    }
  };

  return (
    <div 
      className={`fixed inset-0 pointer-events-none animate-pulse ${className}`}
      style={{ 
        ...backgroundStyles[variant],
        opacity: 0.18, // Significantly increased visibility from 0.1
        willChange: 'opacity',
        zIndex: -7, // Improved from -5 for better layering but still visible
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        animation: 'subtle-float 20s ease-in-out infinite'
      }}
    />
  );
};

export default CleanBackground;
