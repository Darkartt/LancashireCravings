'use client';

import React from 'react';
import { useScrollTriggerContext } from './ScrollTriggerProvider';

const ScrollTest: React.FC = () => {
  const { scrollTo, isReady, lenisReady, scrollTriggerReady } = useScrollTriggerContext();

  const handleScrollTest = () => {
    console.log('Scroll test triggered');
    console.log('IsReady:', isReady, 'LenisReady:', lenisReady, 'ScrollTriggerReady:', scrollTriggerReady);
    
    // Try scrolling to bottom of page
    scrollTo(document.body.scrollHeight - window.innerHeight);
  };

  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-white/90 rounded-lg shadow-lg">
      <div className="text-sm space-y-2">
        <div>Scroll Status:</div>
        <div>Ready: {isReady ? '✅' : '❌'}</div>
        <div>Lenis: {lenisReady ? '✅' : '❌'}</div>
        <div>ScrollTrigger: {scrollTriggerReady ? '✅' : '❌'}</div>
        <button 
          onClick={handleScrollTest}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Test Scroll
        </button>
      </div>
    </div>
  );
};

export default ScrollTest;
