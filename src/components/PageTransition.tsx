'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Only trigger transitions on actual pathname changes (different pages)
  useEffect(() => {
    if (children !== displayChildren) {
      setIsTransitioning(true);
      
      // Delay to allow exit animation
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [pathname]); // Changed from [children, displayChildren] to [pathname]

  // Enhanced page variants that work well with scroll
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smoother feel
    duration: 0.6
  };

  return (
    <div className="page-transition-container">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ 
            width: '100%', 
            minHeight: '100vh',
            // Ensure no interference with LenisScroll
            transformOrigin: 'center top',
            willChange: 'transform, opacity'
          }}
          onAnimationStart={() => {
            // Temporarily pause scroll updates during transition
            document.body.style.pointerEvents = 'none';
          }}
          onAnimationComplete={(definition) => {
            // Re-enable interactions after transition
            document.body.style.pointerEvents = '';
            
            if (definition === 'in') {
              // Page transition complete - refresh scroll position
              window.dispatchEvent(new CustomEvent('pageTransitionComplete'));
              
              // Scroll to top for new page
              window.scrollTo({ top: 0, behavior: 'auto' });
              
              // Trigger LenisScroll refresh if available
              const lenisRefreshEvent = new CustomEvent('lenisRefresh');
              window.dispatchEvent(lenisRefreshEvent);
            }
          }}
        >
          {isTransitioning ? displayChildren : children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
