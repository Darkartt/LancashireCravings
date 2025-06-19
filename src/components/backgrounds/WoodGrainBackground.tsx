'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../AnimationProvider';

interface WoodGrainBackgroundProps {
  woodType?: 'oak' | 'walnut' | 'cherry' | 'maple';
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;
}

export const WoodGrainBackground: React.FC<WoodGrainBackgroundProps> = ({
  woodType = 'oak',
  intensity = 'subtle',
  animated = true
}) => {
  const animation = useAnimation();
  const scrollProgress = animation?.scrollProgress || 0;
  
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
  
  // Intensity settings
  const intensitySettings = {
    subtle: {
      opacity: 0.08,
      lineCount: 12,
      lineWidth: 0.5
    },
    medium: {
      opacity: 0.15,
      lineCount: 18,
      lineWidth: 0.8
    },
    strong: {
      opacity: 0.25,
      lineCount: 24,
      lineWidth: 1.2
    }
  };
  
  const colors = woodColors[woodType];
  const settings = intensitySettings[intensity];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Base wood color with very subtle grain texture */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ 
          backgroundColor: colors.base,
          opacity: settings.opacity * 2
        }}
      />
      
      {/* SVG wood grain pattern */}
      <svg width="100%" height="100%" className="absolute inset-0 opacity-30">
        <defs>
          <pattern id={`wood-grain-${woodType}`} patternUnits="userSpaceOnUse" width="200" height="200">
            {/* Vertical grain lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.path
                key={`v-${i}`}
                d={`M${30 + i * 35},0 Q${35 + i * 35},100 ${30 + i * 35},200`}
                stroke={colors.grain}
                strokeWidth={settings.lineWidth}
                fill="none"
                opacity={0.7}
                animate={animated ? {
                  d: [
                    `M${30 + i * 35},0 Q${35 + i * 35},100 ${30 + i * 35},200`,
                    `M${30 + i * 35},0 Q${25 + i * 35},100 ${30 + i * 35},200`,
                    `M${30 + i * 35},0 Q${35 + i * 35},100 ${30 + i * 35},200`,
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
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.path
                key={`h-${i}`}
                d={`M0,${50 + i * 45} Q100,${45 + i * 45} 200,${50 + i * 45}`}
                stroke={colors.accent}
                strokeWidth={settings.lineWidth * 0.7}
                fill="none"
                opacity={0.5}
                animate={animated ? {
                  d: [
                    `M0,${50 + i * 45} Q100,${45 + i * 45} 200,${50 + i * 45}`,
                    `M0,${50 + i * 45} Q100,${55 + i * 45} 200,${50 + i * 45}`,
                    `M0,${50 + i * 45} Q100,${45 + i * 45} 200,${50 + i * 45}`,
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
          style={{ opacity: settings.opacity }}
          animate={animated ? { 
            scale: [1, 1.02, 1],
            y: scrollProgress ? scrollProgress * -20 : 0
          } : undefined}
          transition={{ 
            duration: 20, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </svg>
      
      {/* Subtle wood grain lines */}
      {Array.from({ length: settings.lineCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full"
          style={{ 
            left: `${(i * (100 / settings.lineCount)) + Math.random() * 3}%`, 
            width: `${settings.lineWidth + Math.random() * 0.3}px`,
            backgroundColor: colors.grain,
            opacity: 0.1 + Math.random() * 0.1
          }}
          animate={animated ? {
            height: ["100%", "105%", "100%"],
            y: ["0%", "-2.5%", "0%"],
            opacity: [
              0.1 + Math.random() * 0.1,
              0.05 + Math.random() * 0.1,
              0.1 + Math.random() * 0.1
            ]
          } : undefined}
          transition={{
            duration: 20 + i % 5,
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
