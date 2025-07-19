'use client';

import React, { useEffect, useState, useRef } from 'react';

interface SmoothBackgroundProps {
  variant?: 'home' | 'about' | 'portfolio' | 'shop' | 'commission' | 'contact' | 'blog' | 'services' | 'process';
  className?: string;
}

const SmoothBackground: React.FC<SmoothBackgroundProps> = ({ 
  variant = 'home', 
  className = '' 
}) => {
  const [scrollY, setScrollY] = useState(0);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Simplified scroll tracking - no direction complexity
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple animation calculation
  const animationOffset = (scrollY * 0.005) % 100;

  // More visible and balanced color scheme for better background visibility
  // Variant-specific colors for different pages
  const currentColors = variant === 'portfolio' || variant === 'shop' ? {
    primary: 'rgba(139, 69, 19, 0.15)', // Enhanced visibility for portfolio/shop
    secondary: 'rgba(210, 180, 140, 0.12)', 
    tertiary: 'rgba(205, 133, 63, 0.16)'
  } : {
    primary: 'rgba(139, 69, 19, 0.12)', // Default visibility for other pages
    secondary: 'rgba(210, 180, 140, 0.10)', 
    tertiary: 'rgba(205, 133, 63, 0.14)'
  };

  return (
    <div 
      ref={backgroundRef}
      className={`fixed inset-0 pointer-events-none animate-gradient ${className}`}
      style={{
        zIndex: -8, // Improved from -10 for better visibility
        background: `
          radial-gradient(ellipse at ${20 + Math.sin(animationOffset * 0.008) * 3}% ${30 + Math.cos(animationOffset * 0.01) * 3}%, ${currentColors.primary} 0%, transparent 75%),
          radial-gradient(ellipse at ${80 + Math.sin(animationOffset * 0.009) * 2.5}% ${70 + Math.cos(animationOffset * 0.006) * 2.5}%, ${currentColors.secondary} 0%, transparent 75%),
          radial-gradient(ellipse at ${50 + Math.sin(animationOffset * 0.011) * 3.5}% ${50 + Math.cos(animationOffset * 0.007) * 3.5}%, ${currentColors.tertiary} 0%, transparent 80%),
          linear-gradient(135deg, 
            rgb(250 249 247 / 0.95) 0%, 
            rgb(245 242 237 / 0.92) 50%,
            rgb(250 249 247 / 0.95) 100%
          )
        `,
        transition: 'background 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        willChange: 'background',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        mixBlendMode: 'multiply'
      }}
      aria-hidden="true"
    >
      {/* Subtle overlay for content protection */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgb(250 249 247) 0%, transparent 20%, transparent 80%, rgb(250 249 247) 100%)`,
          opacity: 0.6
        }}
      />
    </div>
  );
};

export default SmoothBackground;
