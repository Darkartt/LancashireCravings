'use client';

import { useEffect } from 'react';

export const useScrollAnimations = () => {
  useEffect(() => {
    const handleScroll = () => {
      const animatedElements = document.querySelectorAll('[data-animate-fade-up], [data-animate-fade-in], [data-animate-slide-left], [data-animate-slide-right], [data-animate-scale]');
      
      animatedElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          element.classList.add('animate-in');
        }
      });
    };

    // Trigger on initial load
    setTimeout(handleScroll, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

// Immediate visibility for critical content
export const addPreloadVisibility = () => {
  // Make hero content immediately visible
  const heroElements = document.querySelectorAll('#hero [data-animate-fade-up], #hero [data-animate-scale]');
  heroElements.forEach(element => {
    element.classList.add('preload-visible');
  });
  
  // Remove preload visibility after a brief moment to allow normal animations
  setTimeout(() => {
    heroElements.forEach(element => {
      element.classList.remove('preload-visible');
      element.classList.add('animate-in');
    });
  }, 300);
};
