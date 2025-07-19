'use client';

import React, { useEffect, useState } from 'react';
import { useScrollTriggerContext } from './ScrollTriggerProvider';

const ScrollDebug: React.FC = () => {
  const { lenis, lenisReady, scrollTriggerReady, isReady } = useScrollTriggerContext();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50"
      style={{ pointerEvents: 'none' }}
    >
      <div>Scroll Y: {scrollY}</div>
      <div>Lenis Ready: {lenisReady ? '✅' : '❌'}</div>
      <div>ScrollTrigger Ready: {scrollTriggerReady ? '✅' : '❌'}</div>
      <div>Combined Ready: {isReady ? '✅' : '❌'}</div>
      <div>Lenis Instance: {lenis ? '✅' : '❌'}</div>
      <div>Smooth Scrolling: {lenis?.isScrolling ? '🔄' : '⏸️'}</div>
    </div>
  );
};

export default ScrollDebug;
