'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Dynamic import for ScrollTrigger to ensure it works with SSR
let ScrollTrigger: any = null;

interface ScrollTriggerConfig {
  trigger: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string | HTMLElement;
  snap?: boolean | number | { snapTo: number; duration: number };
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (self: any) => void;
  onToggle?: (self: any) => void;
  markers?: boolean;
  id?: string;
}

interface UseScrollTriggerReturn {
  isReady: boolean;
  ScrollTrigger: any;
  createScrollTrigger: (config: ScrollTriggerConfig) => any;
  refreshScrollTrigger: () => void;
  killScrollTriggers: (id?: string) => void;
}

export const useScrollTrigger = (): UseScrollTriggerReturn => {
  const [isReady, setIsReady] = useState(false);
  const scrollTriggersRef = useRef<any[]>([]);

  useEffect(() => {
    // Dynamic import of ScrollTrigger for SSR compatibility
    const initScrollTrigger = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Dynamic import
        const { ScrollTrigger: ST } = await import('gsap/ScrollTrigger');
        ScrollTrigger = ST;

        // Register the plugin
        gsap.registerPlugin(ScrollTrigger);

        // Configure ScrollTrigger defaults for better performance
        ScrollTrigger.config({
          autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
          ignoreMobileResize: true,
        });

        // Enable smooth scrolling integration
        ScrollTrigger.normalizeScroll(true);

        setIsReady(true);
      } catch (error) {
        console.error('Failed to load ScrollTrigger:', error);
      }
    };

    initScrollTrigger();

    // Cleanup on unmount
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.killAll();
        scrollTriggersRef.current = [];
      }
    };
  }, []);

  // Create a new ScrollTrigger instance
  const createScrollTrigger = (config: ScrollTriggerConfig) => {
    if (!ScrollTrigger || !isReady) {
      console.warn('ScrollTrigger not ready yet');
      return null;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Return a dummy object for reduced motion users
      return {
        kill: () => {},
        refresh: () => {},
        update: () => {},
      };
    }

    try {
      const scrollTrigger = ScrollTrigger.create({
        trigger: config.trigger,
        start: config.start || 'top 80%',
        end: config.end || 'bottom 20%',
        scrub: config.scrub || false,
        pin: config.pin || false,
        snap: config.snap || false,
        onEnter: config.onEnter,
        onLeave: config.onLeave,
        onEnterBack: config.onEnterBack,
        onLeaveBack: config.onLeaveBack,
        onUpdate: config.onUpdate,
        onToggle: config.onToggle,
        markers: config.markers || false,
        id: config.id,
        // Performance optimizations
        fastScrollEnd: true,
        preventOverlaps: true,
      });

      // Store reference for cleanup
      scrollTriggersRef.current.push(scrollTrigger);

      return scrollTrigger;
    } catch (error) {
      console.error('Error creating ScrollTrigger:', error);
      return null;
    }
  };

  // Refresh all ScrollTriggers
  const refreshScrollTrigger = () => {
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  };

  // Kill specific or all ScrollTriggers
  const killScrollTriggers = (id?: string) => {
    if (!ScrollTrigger) return;

    if (id) {
      ScrollTrigger.getById(id)?.kill();
      scrollTriggersRef.current = scrollTriggersRef.current.filter(
        (st) => st.vars.id !== id
      );
    } else {
      ScrollTrigger.killAll();
      scrollTriggersRef.current = [];
    }
  };

  return {
    isReady,
    ScrollTrigger,
    createScrollTrigger,
    refreshScrollTrigger,
    killScrollTriggers,
  };
};
