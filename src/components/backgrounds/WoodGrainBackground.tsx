'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../AnimationProvider';

interface WoodGrainBackgroundProps {
  woodType?: 'oak' | 'walnut' | 'cherry' | 'maple';
  intensity?: 'subtle' | 'medium' | 'strong';
  blobShape?: 'sm' | 'md' | 'lg' | 'none';
  animated?: boolean;
}

export const WoodGrainBackground: React.FC<WoodGrainBackgroundProps> = ({
  woodType = 'oak',
  intensity = 'subtle',
  blobShape = 'none',
  animated = true
}) => {
  const animation = useAnimation();
  const scrollProgress = animation?.scrollProgress || 0;
  
  // Reduce visibility when at the very top of the page
  const isAtTop = scrollProgress < 0.1;
  const adjustedOpacity = isAtTop ? 0.5 : 1;
  
  // Color mappings for different wood types
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
  
  // Intensity settings - significantly increased visibility
  const intensitySettings = {
    subtle: {
      opacity: 0.15, // Significantly increased from 0.03
      lineCount: 10,  // Increased from 8
      lineWidth: 0.8  // Increased from 0.3
    },
    medium: {
      opacity: 0.22, // Significantly increased from 0.05
      lineCount: 14,  // Increased from 10
      lineWidth: 1.0  // Increased from 0.4
    },
    strong: {
      opacity: 0.28, // Significantly increased from 0.08
      lineCount: 18,  // Increased from 14
      lineWidth: 1.2  // Increased from 0.6
    }
  };
  
  const colors = woodColors[woodType];
  const settings = intensitySettings[intensity];
  
  return (
    <div 
      className="wood-grain-background absolute inset-0 pointer-events-none overflow-hidden"
      data-wood-type={woodType}
      data-intensity={intensity}
      data-blob-shape={blobShape}
      style={{ 
        opacity: adjustedOpacity,
        '--wood-animation-duration': animated ? '25s' : '0s',
        ...(blobShape !== 'none' && {
          clipPath: `var(--blob-radius-${blobShape})`
        })
      } as React.CSSProperties}
    >
      {/* Base wood color with enhanced grain texture */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ 
          backgroundColor: colors.base,
          opacity: settings.opacity * 0.8 // More visible base layer
        }}
      />
      
      {/* SVG wood grain pattern */}
      <svg width="100%" height="100%" className="absolute inset-0 opacity-60">
        <defs>
          <pattern id={`wood-grain-${woodType}`} patternUnits="userSpaceOnUse" width="200" height="200">
            {/* Vertical grain lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.path
                key={`v-${i}`}
                d={`M${30 + i * 25},0 Q${35 + i * 25},100 ${30 + i * 25},200`}
                stroke={colors.grain}
                strokeWidth={settings.lineWidth}
                fill="none"
                opacity={0.8}
                animate={animated ? {
                  d: [
                    `M${30 + i * 25},0 Q${35 + i * 25},100 ${30 + i * 25},200`,
                    `M${30 + i * 25},0 Q${25 + i * 25},100 ${30 + i * 25},200`,
                    `M${30 + i * 25},0 Q${35 + i * 25},100 ${30 + i * 25},200`,
                  ]
                } : undefined}
                transition={{
                  duration: 20,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.5
                }}
              />
            ))}
            
            {/* Horizontal grain details */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.path
                key={`h-${i}`}
                d={`M0,${40 + i * 30} Q100,${35 + i * 30} 200,${40 + i * 30}`}
                stroke={colors.accent}
                strokeWidth={settings.lineWidth * 0.7}
                fill="none"
                opacity={0.6}
                animate={animated ? {
                  d: [
                    `M0,${40 + i * 30} Q100,${35 + i * 30} 200,${40 + i * 30}`,
                    `M0,${40 + i * 30} Q100,${45 + i * 30} 200,${40 + i * 30}`,
                    `M0,${40 + i * 30} Q100,${35 + i * 30} 200,${40 + i * 30}`,
                  ]
                } : undefined}
                transition={{
                  duration: 15,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.8
                }}
              />
            ))}
          </pattern>
        </defs>
        <motion.rect
          width="100%" 
          height="100%"
          fill={`url(#wood-grain-${woodType})`}
          style={{ opacity: settings.opacity }} // More visible pattern
          animate={animated ? { 
            scale: [1, 1.02, 1],
            y: scrollProgress ? scrollProgress * -15 : 0
          } : undefined}
          transition={{ 
            duration: 25,
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </svg>
      
      {/* Enhanced wood grain lines */}
      {Array.from({ length: settings.lineCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full"
          style={{ 
            left: `${(i * (100 / settings.lineCount)) + Math.random() * 2}%`, 
            width: `${settings.lineWidth + Math.random() * 0.4}px`,
            backgroundColor: colors.grain,
            opacity: 0.08 + Math.random() * 0.06 // Significantly increased opacity
          }}
          animate={animated ? {
            height: ["100%", "103%", "100%"],
            y: ["0%", "-2%", "0%"],
            opacity: [
              0.08 + Math.random() * 0.06,
              0.05 + Math.random() * 0.04,
              0.08 + Math.random() * 0.06
            ]
          } : undefined}
          transition={{
            duration: 20 + i % 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

export default WoodGrainBackground;
