'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Lenis from 'lenis';

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smooth?: boolean;
  direction?: 'vertical' | 'horizontal';
  gestureDirection?: 'vertical' | 'horizontal' | 'both';
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
}

interface UseLenisReturn {
  lenis: Lenis | null;
  isReady: boolean;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number; easing?: (t: number) => number }) => void;
  start: () => void;
  stop: () => void;
  destroy: () => void;
}

const defaultOptions: LenisOptions = {
  duration: 0.3, // Very fast and responsive
  easing: (t: number) => 1 - (1 - t) * (1 - t), // Simple quadratic easing for snappy feel
  smooth: true,
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothTouch: false, // Better performance on mobile
  touchMultiplier: 1.2, // Responsive touch scrolling
  infinite: false,
};

export const useLenis = (options: LenisOptions = {}): UseLenisReturn => {
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Merge options with defaults
  const mergedOptions = useMemo(() => ({ ...defaultOptions, ...options }), [options]);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Disable smooth scrolling for reduced motion users
      setIsReady(true);
      return;
    }

    // Initialize Lenis with a small delay to ensure DOM is ready
    const initLenis = async () => {
      try {
        const lenis = new Lenis(mergedOptions);
        lenisRef.current = lenis;

        // Optimized animation loop
        const raf = (time: number) => {
          lenis.raf(time);
          rafRef.current = requestAnimationFrame(raf);
        };

        // Start immediately for smoother experience
        rafRef.current = requestAnimationFrame(raf);

        // Mark as ready immediately
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize Lenis:', error);
        // Fallback to ready state without smooth scrolling
        setIsReady(true);
      }
    };

    // Immediate initialization for better responsiveness
    initLenis();

    // Cleanup function
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      setIsReady(false);
    };
  }, [mergedOptions]); // Now properly depend on the memoized options

  // Scroll to target function
  const scrollTo = (
    target: string | number | HTMLElement,
    options?: { 
      offset?: number; 
      duration?: number; 
      easing?: (t: number) => number;
    }
  ) => {
    if (!lenisRef.current) {
      // Fallback to native scrolling if Lenis isn't available
      let scrollTarget: number;
      
      if (typeof target === 'number') {
        scrollTarget = target;
      } else if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          scrollTarget = element.getBoundingClientRect().top + window.pageYOffset;
        } else {
          return;
        }
      } else if (target instanceof HTMLElement) {
        scrollTarget = target.getBoundingClientRect().top + window.pageYOffset;
      } else {
        return;
      }
      
      window.scrollTo({
        top: scrollTarget + (options?.offset || 0),
        behavior: 'smooth'
      });
      return;
    }
    
    lenisRef.current.scrollTo(target, {
      offset: options?.offset || 0,
      duration: options?.duration || mergedOptions.duration,
      easing: options?.easing || mergedOptions.easing,
    });
  };

  // Control functions
  const start = () => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  };

  const stop = () => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  };

  const destroy = () => {
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
      setIsReady(false);
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  return {
    lenis: lenisRef.current,
    isReady,
    scrollTo,
    start,
    stop,
    destroy,
  };
};
