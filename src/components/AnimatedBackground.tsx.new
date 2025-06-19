'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAnimation } from './AnimationProvider';
import WoodDustParticles from './backgrounds/WoodDustParticles';
import WoodGrainBackground from './backgrounds/WoodGrainBackground';

type WoodType = 'oak' | 'walnut' | 'cherry' | 'maple';
type GrainIntensity = 'subtle' | 'medium' | 'strong';
type ColorScheme = 'light' | 'dark' | 'warm';

interface AnimatedBackgroundProps {
  variant: 'home' | 'about' | 'portfolio' | 'shop' | 'commission' | 'contact' | 'blog' | 'services' | 'process';
  className?: string;
  woodType?: WoodType;
  finishType?: string;
}

interface BackgroundConfig {
  baseGradient: string;
  particleCount: number;
  particleColor: ColorScheme;
  woodGrainIntensity: GrainIntensity;
  showTools: boolean;
  showDust: boolean;
  interactive: boolean;
  customWoodType?: WoodType;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant, 
  className = '',
  woodType = 'oak',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  finishType
}) => {
  const [isClient, setIsClient] = useState(false);
  const { scrollY } = useScroll();
  const animation = useAnimation();
  
  // Parallax effects with different intensities
  const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -25]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -75]);
  
  // Get cursor position for interactive elements - used in child components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cursorPosition = animation?.cursorPosition || { x: 0, y: 0 };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollProgress = animation?.scrollProgress || 0;
  
  // Client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={`fixed inset-0 -z-10 bg-gradient-to-br from-amber-50/5 to-amber-100/5 ${className}`} />;
  }
  
  // Configuration based on variant
  const backgroundConfig: Record<string, BackgroundConfig> = {
    home: {
      baseGradient: 'from-amber-50/20 to-amber-100/10',
      particleCount: 40,
      particleColor: 'warm',
      woodGrainIntensity: 'subtle',
      showTools: false,
      showDust: true,
      interactive: true
    },
    about: {
      baseGradient: 'from-stone-50/10 to-amber-50/5',
      particleCount: 20,
      particleColor: 'warm',
      woodGrainIntensity: 'medium',
      showTools: true,
      showDust: false,
      interactive: true
    },
    portfolio: {
      baseGradient: 'from-amber-50/10 to-stone-100/5',
      particleCount: 25,
      particleColor: 'light',
      woodGrainIntensity: 'medium',
      showTools: false,
      showDust: true,
      interactive: true
    },
    shop: {
      baseGradient: 'from-amber-50/10 via-stone-100/5 to-amber-100/10',
      particleCount: 15,
      particleColor: 'warm',
      woodGrainIntensity: 'subtle',
      showTools: false,
      showDust: true,
      interactive: true
    },
    commission: {
      baseGradient: 'from-amber-100/15 to-stone-100/10',
      particleCount: 30,
      particleColor: woodType === 'walnut' ? 'dark' : (woodType === 'cherry' ? 'warm' : 'light'),
      woodGrainIntensity: 'medium',
      showTools: false,
      showDust: true,
      interactive: true,
      customWoodType: woodType
    },
    contact: {
      baseGradient: 'from-stone-50/5 to-amber-50/10',
      particleCount: 15,
      particleColor: 'light',
      woodGrainIntensity: 'subtle',
      showTools: false,
      showDust: false,
      interactive: false
    },
    blog: {
      baseGradient: 'from-amber-50/10 via-stone-100/5 to-stone-50/10',
      particleCount: 15,
      particleColor: 'light',
      woodGrainIntensity: 'subtle',
      showTools: false,
      showDust: true,
      interactive: false
    },
    services: {
      baseGradient: 'from-stone-100/10 to-amber-50/5',
      particleCount: 10,
      particleColor: 'light',
      woodGrainIntensity: 'subtle',
      showTools: true,
      showDust: false,
      interactive: true
    },
    process: {
      baseGradient: 'from-amber-50/10 to-stone-100/5',
      particleCount: 35,
      particleColor: 'warm',
      woodGrainIntensity: 'medium',
      showTools: true,
      showDust: true,
      interactive: true
    }
  };
  
  const config = backgroundConfig[variant];
  
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${config.baseGradient}`}
        style={{ y: y1 }}
      />
      
      {/* Wood grain pattern appropriate for the section */}
      <motion.div style={{ y: y2 }}>
        <WoodGrainBackground
          woodType={config.customWoodType || woodType}
          intensity={config.woodGrainIntensity}
          animated={config.interactive}
        />
      </motion.div>
      
      {/* Floating wood dust particles */}
      {config.showDust && (
        <motion.div style={{ y: y3 }}>
          <WoodDustParticles
            count={config.particleCount}
            colorScheme={config.particleColor}
            interactive={config.interactive}
          />
        </motion.div>
      )}
      
      {/* Tool outlines for relevant sections */}
      {config.showTools && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {variant === 'about' && (
            <motion.path 
              d="M30,50 L70,50 M30,30 L70,30 M30,70 L70,70" 
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 10, 
                ease: "easeInOut", 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            />
          )}
          
          {variant === 'services' && (
            <>
              {/* Hammer outline */}
              <motion.path
                d="M40,30 L50,30 L50,40 L70,60 L65,65 L45,45 L40,45 Z"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 8, 
                  ease: "easeInOut", 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: 1
                }}
              />
              
              {/* Saw outline */}
              <motion.path
                d="M30,55 L70,55 L70,60 L65,55 L60,60 L55,55 L50,60 L45,55 L40,60 L35,55 L30,60 Z"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 12, 
                  ease: "easeInOut", 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
            </>
          )}
          
          {variant === 'process' && (
            <>
              {/* Flowing process path */}
              <motion.path
                d="M20,50 C30,40 40,60 50,50 C60,40 70,60 80,50"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0, strokeDasharray: "1 3" }}
                animate={{ pathLength: 1, strokeDasharray: "2 4" }}
                transition={{ 
                  duration: 15, 
                  ease: "easeInOut", 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
              
              {/* Process nodes */}
              {[20, 50, 80].map((x, i) => (
                <motion.circle
                  key={i}
                  cx={x}
                  cy="50"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  fill="none"
                  initial={{ r: 2, opacity: 0.02 }}
                  animate={{ r: 4, opacity: 0.05 }}
                  transition={{ 
                    duration: 4, 
                    ease: "easeInOut", 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    delay: i * 1.5
                  }}
                />
              ))}
            </>
          )}
        </svg>
      )}
      
      {/* Commission-specific interactive elements */}
      {variant === 'commission' && (
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            background: woodType === 'walnut' 
              ? 'radial-gradient(circle at center, rgba(94, 75, 60, 0.2), transparent 70%)'
              : woodType === 'cherry'
                ? 'radial-gradient(circle at center, rgba(161, 88, 67, 0.2), transparent 70%)'
                : woodType === 'maple'
                  ? 'radial-gradient(circle at center, rgba(245, 222, 179, 0.2), transparent 70%)'
                  : 'radial-gradient(circle at center, rgba(232, 212, 173, 0.2), transparent 70%)'
          }}
          transition={{ duration: 1 }}
        />
      )}
      
      {/* Portfolio grid pattern */}
      {variant === 'portfolio' && (
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="measurementGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" />
              <circle cx="0" cy="0" r="2" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="100" cy="0" r="2" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="100" r="2" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="2" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#measurementGrid)" />
          </svg>
        </div>
      )}
      
      {/* Shop shelf shadows */}
      {variant === 'shop' && (
        <div className="absolute inset-x-0 top-1/4 bottom-0">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px bg-amber-950/10"
              style={{ top: `${i * 25}%` }}
              animate={{
                boxShadow: [
                  '0 2px 10px rgba(0, 0, 0, 0.03)',
                  '0 3px 15px rgba(0, 0, 0, 0.05)',
                  '0 2px 10px rgba(0, 0, 0, 0.03)'
                ]
              }}
              transition={{
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedBackground;
