'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';
import { useAnimationReset } from '../hooks/useAnimationReset';
import { ScrollProgressIndicator } from './ScrollProgressIndicator';
import { ScrollTriggerProvider, useScrollTriggerContext } from './ScrollTriggerProvider';
import { usePathname } from 'next/navigation';

interface AnimationContextType {
  cursorPosition: { x: number, y: number };
  scrollProgress: number;
  isDarkMode: boolean;
  isReducedMotion: boolean;
  // Enhanced with ScrollTrigger capabilities
  scrollTriggerReady: boolean;
  createScrollAnimation: (config: any) => any;
  scrollTo: (target: string | number | HTMLElement, options?: any) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  cursorPosition: { x: 0, y: 0 },
  scrollProgress: 0,
  isDarkMode: false,
  isReducedMotion: false,
  scrollTriggerReady: false,
  createScrollAnimation: () => null,
  scrollTo: () => {},
});

export const useAnimation = () => useContext(AnimationContext);

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  return (
    <ScrollTriggerProvider>
      <AnimationProviderInner>
        {children}
      </AnimationProviderInner>
    </ScrollTriggerProvider>
  );
};

const AnimationProviderInner: React.FC<AnimationProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const heroScrollHandlerRef = useRef<(() => void) | null>(null);
  
  // Get ScrollTrigger context
  const {
    scrollTo,
    createScrollTrigger,
    isReady: scrollTriggerReady
  } = useScrollTriggerContext();
  
  // New state for cursor position and scroll progress
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Enhanced scroll animation creator
  const createScrollAnimation = (config: any) => {
    if (isReducedMotion) return null;
    return createScrollTrigger(config);
  };

  // Use the animation reset hook to handle route changes
  useAnimationReset();

  // Initialize scroll-based animations on mount and route change
  useEffect(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Global mouse movement tracker with throttling
    let mouseTimeout: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseTimeout) return;
      mouseTimeout = requestAnimationFrame(() => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
        mouseTimeout = 0;
      });
    };
    
    // Optimized scroll tracker with throttling
    let scrollTimeout: number;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        setScrollProgress(scrollPercent);
        scrollTimeout = 0;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const initializeScrollAnimations = () => {
      // Set up intersection observer for scroll-triggered animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          
          if (entry.isIntersecting) {
            // Element is visible - animate to visible state with slower timing
            target.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'; // Slower transition
            target.style.opacity = '1';
            target.style.transform = 'translateY(0) translateX(0) scale(1)';
            target.setAttribute('data-animated', 'true'); // Mark as animated
          } else {
            // Don't reset animations for elements that have been animated
            // This allows animations to persist across sections
            if (!target.hasAttribute('data-animated')) {
              target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
              target.style.opacity = '0';
              
              // Reset to initial state based on animation type
              if (target.hasAttribute('data-animate-fade-up')) {
                target.style.transform = 'translateY(50px)'; // Increased from 30px
              } else if (target.hasAttribute('data-animate-slide-left')) {
                target.style.transform = 'translateX(-50px)'; // Increased from -30px
              } else if (target.hasAttribute('data-animate-slide-right')) {
                target.style.transform = 'translateX(50px)'; // Increased from 30px
              } else if (target.hasAttribute('data-animate-scale')) {
                target.style.transform = 'scale(0.85)'; // More pronounced scale
              } else {
                target.style.transform = 'translateY(40px)'; // Increased from 20px
              }
            }
          }
        });
      }, observerOptions);

      // Observe all elements with animation attributes
      const animatedElements = document.querySelectorAll('[data-animate-fade-up], [data-animate-fade-in], [data-animate-slide-left], [data-animate-slide-right], [data-animate-scale]');
      animatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Set initial state with slower transition timing
        htmlElement.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'; // Slower initial transition
        htmlElement.style.opacity = '0';
        
        // Set initial transform based on animation type with larger distances
        if (htmlElement.hasAttribute('data-animate-fade-up')) {
          htmlElement.style.transform = 'translateY(50px)'; // Increased from 30px
        } else if (htmlElement.hasAttribute('data-animate-slide-left')) {
          htmlElement.style.transform = 'translateX(-50px)'; // Increased from -30px
        } else if (htmlElement.hasAttribute('data-animate-slide-right')) {
          htmlElement.style.transform = 'translateX(50px)'; // Increased from 30px
        } else if (htmlElement.hasAttribute('data-animate-scale')) {
          htmlElement.style.transform = 'scale(0.85)'; // More pronounced scale
        } else {
          htmlElement.style.transform = 'translateY(40px)'; // Increased from 20px
        }
        
        observer.observe(element);
      });

      observerRef.current = observer;
    };

    // Initialize after a small delay to ensure DOM is ready and reset is complete
    const timeoutId = setTimeout(initializeScrollAnimations, 200);
    
    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]); // Re-run when pathname changes

  // Handle hero section parallax effect with optimized performance
  useEffect(() => {
    let heroScrollTimeout: number;
    
    const handleHeroScroll = () => {
      if (heroScrollTimeout) return;
      
      heroScrollTimeout = requestAnimationFrame(() => {
        const hero = document.querySelector('.hero-section');
        const heroContent = document.querySelector('.hero-content');
        const backgroundDock = document.getElementById('background-dock');
        
        if (hero && heroContent) {
          const scrollPosition = window.scrollY;
          const heroHeight = hero.clientHeight;
          const scrollProgress = Math.min(scrollPosition / heroHeight, 1);
          
          // Batch DOM updates for better performance
          const heroElement = heroContent as HTMLElement;
          heroElement.style.transform = `translateY(${scrollProgress * 50}px)`;
          heroElement.style.opacity = `${1 - scrollProgress * 1.5}`;
          
          // Optimize CSS variable updates
          const scaleValue = Math.max(0.3, 1 - scrollProgress * 0.7);
          const opacityValue = Math.max(0.1, 1 - scrollProgress * 1.3);
          const blurValue = Math.min(8, scrollProgress * 12);
          
          // Batch CSS variable updates
          const root = document.documentElement.style;
          root.setProperty('--background-scale', `${scaleValue}`);
          root.setProperty('--background-opacity', `${opacityValue}`);
          root.setProperty('--background-blur', `${blurValue}px`);
          
          // Show the dock as we scroll with batched updates
          if (backgroundDock) {
            backgroundDock.style.opacity = scrollProgress > 0.3 ? '1' : '0';
            backgroundDock.style.transform = scrollProgress > 0.3 ? 'scale(1)' : 'scale(0.8)';
            backgroundDock.style.boxShadow = scrollProgress > 0.3 
              ? '0 4px 16px rgba(139, 69, 19, 0.2), 0 8px 32px -8px rgba(0, 0, 0, 0.3)' 
              : '0 0 0 rgba(139, 69, 19, 0), 0 8px 32px -8px rgba(0, 0, 0, 0.3)';
          }
        }
        
        heroScrollTimeout = 0;
      });
    };

    heroScrollHandlerRef.current = handleHeroScroll;
    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    
    return () => {
      if (heroScrollHandlerRef.current) {
        window.removeEventListener('scroll', heroScrollHandlerRef.current);
      }
    };
  }, [pathname]); // Re-run when pathname changes

  // Handle page transition events for better LenisScroll integration
  useEffect(() => {
    const handlePageTransitionComplete = () => {
      // Refresh scroll trigger and reset scroll position
      if (scrollTriggerReady) {
        // Reset all animation states when transitioning
        const animatedElements = document.querySelectorAll('[data-animated]');
        animatedElements.forEach((element) => {
          element.removeAttribute('data-animated');
        });
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          window.dispatchEvent(new Event('resize')); // Trigger layout recalculation
        }, 100);
      }
    };

    const handleLenisRefresh = () => {
      // Trigger any necessary scroll updates and reset animations
      setScrollProgress(0);
      setCursorPosition({ x: 0, y: 0 });
      
      // Reset animation states to allow re-triggering
      const animatedElements = document.querySelectorAll('[data-animated]');
      animatedElements.forEach((element) => {
        element.removeAttribute('data-animated');
      });
    };

    window.addEventListener('pageTransitionComplete', handlePageTransitionComplete);
    window.addEventListener('lenisRefresh', handleLenisRefresh);

    return () => {
      window.removeEventListener('pageTransitionComplete', handlePageTransitionComplete);
      window.removeEventListener('lenisRefresh', handleLenisRefresh);
    };
  }, [scrollTriggerReady]);

  const contextValue = useMemo(() => ({
    cursorPosition,
    scrollProgress,
    isDarkMode,
    isReducedMotion,
    scrollTriggerReady,
    createScrollAnimation,
    scrollTo
  }), [cursorPosition, scrollProgress, isDarkMode, isReducedMotion, scrollTriggerReady, createScrollAnimation, scrollTo]);

  return (
    <AnimationContext.Provider value={contextValue}>
      <ScrollProgressIndicator />
      {/* Sophisticated docking target that appears as background scales down */}
      <div 
        id="background-dock"
        className="fixed bottom-6 left-6 w-20 h-20 rounded-xl opacity-0 pointer-events-none z-20 transition-all duration-1000 ease-out dock-background dock-texture"
        style={{
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 69, 19, 0.4)',
          boxShadow: '0 0 0 rgba(139, 69, 19, 0), 0 8px 32px -8px rgba(0, 0, 0, 0.3)',
          transform: 'scale(0.8)',
          overflow: 'hidden'
        }}
      >
        {/* Pulsing inner glow */}
        <div 
          className="absolute inset-2 rounded-lg"
          style={{
            background: 'radial-gradient(circle at center, rgba(139, 69, 19, 0.4), transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
        
        {/* Corner accent indicators */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-sm" />
        <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-amber-300/40" />
        
        {/* Center focal point */}
        <div 
          className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.8), rgba(139, 69, 19, 0.6))',
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
          }}
        />
        
        {/* Subtle border highlight */}
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(139, 69, 19, 0.1) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        />
      </div>
      {children}
    </AnimationContext.Provider>
  );
};
