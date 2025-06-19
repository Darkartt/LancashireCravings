'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAnimationReset } from '../hooks/useAnimationReset';
import { ScrollProgressIndicator } from './ScrollProgressIndicator';
import { usePathname } from 'next/navigation';

interface AnimationContextType {
  cursorPosition: { x: number, y: number };
  scrollProgress: number;
  isDarkMode: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  cursorPosition: { x: 0, y: 0 },
  scrollProgress: 0,
  isDarkMode: false,
});

export const useAnimation = () => useContext(AnimationContext);

interface AnimationProviderProps {
  children: React.ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const heroScrollHandlerRef = useRef<(() => void) | null>(null);
    // New state for cursor position and scroll progress
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Use the animation reset hook to handle route changes
  useAnimationReset();

  // Initialize scroll-based animations on mount and route change
  useEffect(() => {
    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Global mouse movement tracker
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    // Global scroll tracker
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

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
            // Element is visible - animate to visible state with proper timing
            target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            target.style.opacity = '1';
            target.style.transform = 'translateY(0) translateX(0) scale(1)';
          } else {
            // Element is not visible - reset to initial state
            target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            target.style.opacity = '0';
            
            // Reset to initial state based on animation type
            if (target.hasAttribute('data-animate-fade-up')) {
              target.style.transform = 'translateY(30px)';
            } else if (target.hasAttribute('data-animate-slide-left')) {
              target.style.transform = 'translateX(-30px)';
            } else if (target.hasAttribute('data-animate-slide-right')) {
              target.style.transform = 'translateX(30px)';
            } else if (target.hasAttribute('data-animate-scale')) {
              target.style.transform = 'scale(0.9)';
            } else {
              target.style.transform = 'translateY(20px)';
            }
          }
        });
      }, observerOptions);

      // Observe all elements with animation attributes
      const animatedElements = document.querySelectorAll('[data-animate-fade-up], [data-animate-fade-in], [data-animate-slide-left], [data-animate-slide-right], [data-animate-scale]');
      animatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Set initial state with proper transition
        htmlElement.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        htmlElement.style.opacity = '0';
        
        // Set initial transform based on animation type
        if (htmlElement.hasAttribute('data-animate-fade-up')) {
          htmlElement.style.transform = 'translateY(30px)';
        } else if (htmlElement.hasAttribute('data-animate-slide-left')) {
          htmlElement.style.transform = 'translateX(-30px)';
        } else if (htmlElement.hasAttribute('data-animate-slide-right')) {
          htmlElement.style.transform = 'translateX(30px)';
        } else if (htmlElement.hasAttribute('data-animate-scale')) {
          htmlElement.style.transform = 'scale(0.9)';
        } else {
          htmlElement.style.transform = 'translateY(20px)';
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

  // Handle hero section parallax effect
  useEffect(() => {
    const handleHeroScroll = () => {
      const hero = document.querySelector('.hero-section');
      const heroContent = document.querySelector('.hero-content');
      const backgroundDock = document.getElementById('background-dock');
      
      if (hero && heroContent) {
        const scrollPosition = window.scrollY;
        const heroHeight = hero.clientHeight;
        const scrollProgress = Math.min(scrollPosition / heroHeight, 1);
        
        // Parallax effect on hero content
        (heroContent as HTMLElement).style.transform = `translateY(${scrollProgress * 50}px)`;
        (heroContent as HTMLElement).style.opacity = `${1 - scrollProgress * 1.5}`;
        
        // Scale background gradually as we scroll
        const scaleValue = Math.max(0.3, 1 - scrollProgress * 0.7);
        const opacityValue = Math.max(0.1, 1 - scrollProgress * 1.3);
        const blurValue = Math.min(8, scrollProgress * 12);
        
        // Apply complex CSS variables for the animation
        document.documentElement.style.setProperty('--background-scale', `${scaleValue}`);
        document.documentElement.style.setProperty('--background-opacity', `${opacityValue}`);
        document.documentElement.style.setProperty('--background-blur', `${blurValue}px`);
        
        // Show the dock as we scroll
        if (backgroundDock) {
          backgroundDock.style.opacity = scrollProgress > 0.3 ? '1' : '0';
          backgroundDock.style.transform = scrollProgress > 0.3 ? 'scale(1)' : 'scale(0.8)';
          backgroundDock.style.boxShadow = scrollProgress > 0.3 
            ? '0 4px 16px rgba(139, 69, 19, 0.2), 0 8px 32px -8px rgba(0, 0, 0, 0.3)' 
            : '0 0 0 rgba(139, 69, 19, 0), 0 8px 32px -8px rgba(0, 0, 0, 0.3)';
        }
      }
    };

    heroScrollHandlerRef.current = handleHeroScroll;
    window.addEventListener('scroll', handleHeroScroll);
    
    return () => {
      if (heroScrollHandlerRef.current) {
        window.removeEventListener('scroll', heroScrollHandlerRef.current);
      }
    };
  }, [pathname]); // Re-run when pathname changes

  return (
    <AnimationContext.Provider value={{ cursorPosition, scrollProgress, isDarkMode }}>
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
