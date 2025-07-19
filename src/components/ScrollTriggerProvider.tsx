'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLenis } from '../hooks/useLenis';
import { useScrollTrigger } from '../hooks/useScrollTrigger';

interface ScrollTriggerContextType {
  // Lenis smooth scrolling
  lenis: any;
  lenisReady: boolean;
  scrollTo: (target: string | number | HTMLElement, options?: any) => void;
  
  // GSAP ScrollTrigger
  ScrollTrigger: any;
  scrollTriggerReady: boolean;
  createScrollTrigger: (config: any) => any;
  refreshScrollTrigger: () => void;
  killScrollTriggers: (id?: string) => void;
  
  // Combined state
  isReady: boolean;
}

const ScrollTriggerContext = createContext<ScrollTriggerContextType>({
  lenis: null,
  lenisReady: false,
  scrollTo: () => {},
  ScrollTrigger: null,
  scrollTriggerReady: false,
  createScrollTrigger: () => null,
  refreshScrollTrigger: () => {},
  killScrollTriggers: () => {},
  isReady: false,
});

export const useScrollTriggerContext = () => useContext(ScrollTriggerContext);

interface ScrollTriggerProviderProps {
  children: React.ReactNode;
  lenisOptions?: any;
}

export const ScrollTriggerProvider: React.FC<ScrollTriggerProviderProps> = ({
  children,
  lenisOptions = {},
}) => {
  const [isClient, setIsClient] = useState(false);

  // Initialize hooks
  const {
    lenis,
    isReady: lenisReady,
    scrollTo,
  } = useLenis(lenisOptions);

  const {
    ScrollTrigger,
    isReady: scrollTriggerReady,
    createScrollTrigger,
    refreshScrollTrigger,
    killScrollTriggers,
  } = useScrollTrigger();

  // Combined ready state
  const isReady = lenisReady && scrollTriggerReady && isClient;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Integrate Lenis with ScrollTrigger when both are ready
  useEffect(() => {
    if (!isReady || !lenis || !ScrollTrigger) return;

    // More efficient ScrollTrigger integration
    lenis.on('scroll', ScrollTrigger.update);

    // Simplified scroller proxy for better performance
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: 'transform', // Use transform for better performance
    });

    // Single refresh after setup
    ScrollTrigger.refresh();

    return () => {
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
      }
    };
  }, [isReady, lenis, ScrollTrigger]);

  // Handle page visibility changes for performance
  useEffect(() => {
    if (!isReady) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause animations for performance
        if (lenis) lenis.stop();
      } else {
        // Page is visible, resume animations
        if (lenis) lenis.start();
        if (ScrollTrigger) ScrollTrigger.refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReady, lenis, ScrollTrigger]);

  const contextValue: ScrollTriggerContextType = {
    lenis,
    lenisReady,
    scrollTo,
    ScrollTrigger,
    scrollTriggerReady,
    createScrollTrigger,
    refreshScrollTrigger,
    killScrollTriggers,
    isReady,
  };

  return (
    <ScrollTriggerContext.Provider value={contextValue}>
      {children}
    </ScrollTriggerContext.Provider>
  );
};
