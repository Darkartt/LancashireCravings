'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import { motion } from 'framer-motion';

interface WoodGrainTransitionProps {
  fromWoodType: 'oak' | 'walnut' | 'cherry' | 'maple';
  toWoodType: 'oak' | 'walnut' | 'cherry' | 'maple';
  triggerElement?: string;
  direction?: 'horizontal' | 'vertical';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

const WoodGrainTransition: React.FC<WoodGrainTransitionProps> = ({
  fromWoodType,
  toWoodType,
  triggerElement = '.section-transition-trigger',
  direction = 'vertical',
  intensity = 'medium',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ScrollTrigger } = useScrollTrigger();

  // Wood type color mappings
  const woodColors = {
    oak: {
      base: '#E8D4AD',
      grain: '#D4B48C',
      accent: '#B89F65'
    },
    walnut: {
      base: '#5E4B3C',
      grain: '#3A2C24',
      accent: '#4E3424'
    },
    cherry: {
      base: '#A15843',
      grain: '#7E3B2C',
      accent: '#8B4537'
    },
    maple: {
      base: '#F5DEB3',
      grain: '#E5C99F',
      accent: '#DEB887'
    }
  };

  const intensitySettings = {
    subtle: { opacity: 0.3, scale: 1.02, blur: 1 },
    medium: { opacity: 0.5, scale: 1.05, blur: 2 },
    strong: { opacity: 0.7, scale: 1.08, blur: 3 }
  };

  const settings = intensitySettings[intensity];
  const fromColors = woodColors[fromWoodType];
  const toColors = woodColors[toWoodType];

  useEffect(() => {
    if (!ScrollTrigger || !containerRef.current) return;

    const container = containerRef.current;
    const grainLines = container.querySelectorAll('.grain-line');
    const morphingBg = container.querySelector('.morphing-background');

    // Create scroll-triggered wood grain transition
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Interpolate colors based on scroll progress
          const r1 = parseInt(fromColors.base.slice(1, 3), 16);
          const g1 = parseInt(fromColors.base.slice(3, 5), 16);
          const b1 = parseInt(fromColors.base.slice(5, 7), 16);
          
          const r2 = parseInt(toColors.base.slice(1, 3), 16);
          const g2 = parseInt(toColors.base.slice(3, 5), 16);
          const b2 = parseInt(toColors.base.slice(5, 7), 16);
          
          const r = Math.round(r1 + (r2 - r1) * progress);
          const g = Math.round(g1 + (g2 - g1) * progress);
          const b = Math.round(b1 + (b2 - b1) * progress);
          
          if (morphingBg) {
            (morphingBg as HTMLElement).style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
          }
        }
      }
    });

    // Animate grain lines with staggered timing
    tl.to(grainLines, {
      duration: 1,
      y: direction === 'vertical' ? -100 : 0,
      x: direction === 'horizontal' ? -100 : 0,
      opacity: 0,
      stagger: 0.1,
      ease: 'power2.inOut'
    })
    .set(grainLines, {
      y: direction === 'vertical' ? 100 : 0,
      x: direction === 'horizontal' ? 100 : 0,
    })
    .to(grainLines, {
      duration: 1,
      y: 0,
      x: 0,
      opacity: settings.opacity,
      stagger: 0.1,
      ease: 'power2.inOut'
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === triggerElement) {
          trigger.kill();
        }
      });
    };
  }, [ScrollTrigger, triggerElement, direction, settings, fromColors, toColors]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: -1 }}
    >
      {/* Morphing background */}
      <motion.div
        className="morphing-background absolute inset-0"
        initial={{ backgroundColor: fromColors.base }}
        style={{ 
          opacity: settings.opacity,
          filter: `blur(${settings.blur}px)`
        }}
      />

      {/* Animated grain lines */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          <pattern 
            id={`grain-pattern-${fromWoodType}-${toWoodType}`} 
            patternUnits="userSpaceOnUse" 
            width="100" 
            height="100"
          >
            {/* Vertical grain lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.path
                key={`v-${i}`}
                className="grain-line"
                d={`M${8 + i * 8},0 Q${10 + i * 8},50 ${8 + i * 8},100`}
                stroke={fromColors.grain}
                strokeWidth="0.3"
                fill="none"
                opacity={settings.opacity}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
            
            {/* Horizontal grain details */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.path
                key={`h-${i}`}
                className="grain-line"
                d={`M0,${15 + i * 15} Q50,${12 + i * 15} 100,${15 + i * 15}`}
                stroke={fromColors.accent}
                strokeWidth="0.2"
                fill="none"
                opacity={settings.opacity * 0.7}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </pattern>
        </defs>
        
        <rect 
          width="100%" 
          height="100%" 
          fill={`url(#grain-pattern-${fromWoodType}-${toWoodType})`}
        />
      </svg>

      {/* Transition particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: fromColors.accent,
            left: `${10 + i * 10}%`,
            top: `${20 + (i % 3) * 20}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, settings.opacity, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  );
};

export default WoodGrainTransition;
