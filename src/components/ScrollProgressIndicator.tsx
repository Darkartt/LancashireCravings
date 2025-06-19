'use client';

import { useEffect, useState } from 'react';

export const ScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="scroll-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-accent-primary to-accent-secondary z-50 transition-transform duration-100"
      style={{ 
        width: `${scrollProgress}%`,
        transformOrigin: '0%'
      }}
    />
  );
};
