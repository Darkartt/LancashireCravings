import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useAnimationReset = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Reset all animations on route change
    const resetAnimations = () => {
      // Reset scroll position first
      window.scrollTo(0, 0);
      
      // Reset hero section styles that might have been modified by scroll
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.style.opacity = '1';
        const heroContent = heroSection.querySelector('.container');
        if (heroContent) {
          (heroContent as HTMLElement).style.transform = '';
        }
      }
      
      // Remove all animation classes and reset inline styles
      const animatedElements = document.querySelectorAll('[class*="animate-"], [style*="transform"], [style*="opacity"], [data-animate-fade-up], [data-animate-fade-in], [data-animate-slide-left], [data-animate-slide-right], [data-animate-scale]');
      animatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Reset inline styles that might be set by animations or scroll effects
        htmlElement.style.transform = '';
        htmlElement.style.opacity = '';
        htmlElement.style.transition = '';
        
        // Remove animation classes
        const classes = Array.from(htmlElement.classList);
        classes.forEach(className => {
          if (className.includes('animate-') || className.includes('fade-') || className.includes('slide-')) {
            htmlElement.classList.remove(className);
          }
        });
        
        // Reset data attributes to initial state
        if (htmlElement.hasAttribute('data-animate-fade-up') ||
            htmlElement.hasAttribute('data-animate-fade-in') ||
            htmlElement.hasAttribute('data-animate-slide-left') ||
            htmlElement.hasAttribute('data-animate-slide-right') ||
            htmlElement.hasAttribute('data-animate-scale')) {
          // Reset to initial hidden state for scroll-triggered animations
          htmlElement.style.opacity = '0';
          
          if (htmlElement.hasAttribute('data-animate-fade-up')) {
            htmlElement.style.transform = 'translateY(30px)';
          } else if (htmlElement.hasAttribute('data-animate-slide-left')) {
            htmlElement.style.transform = 'translateX(-30px)';
          } else if (htmlElement.hasAttribute('data-animate-slide-right')) {
            htmlElement.style.transform = 'translateX(30px)';
          } else if (htmlElement.hasAttribute('data-animate-scale')) {
            htmlElement.style.transform = 'scale(0.9)';
          }
        }
      });

      // Reset any Three.js scenes or background animations
      const threeElements = document.querySelectorAll('[data-three-scene]');
      threeElements.forEach((element) => {
        const customEvent = new CustomEvent('resetThreeScene');
        element.dispatchEvent(customEvent);
      });      // Force reflow to ensure all resets are applied
      void document.body.offsetHeight;
    };

    resetAnimations();
  }, [pathname]);
};
