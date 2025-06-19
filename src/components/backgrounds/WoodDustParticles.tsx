'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../AnimationProvider';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

interface WoodDustParticlesProps {
  count?: number;
  colorScheme?: 'light' | 'dark' | 'warm';
  interactive?: boolean;
}

export const WoodDustParticles: React.FC<WoodDustParticlesProps> = ({ 
  count = 30, 
  colorScheme = 'warm',
  interactive = true
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animation = useAnimation();
  const cursorPosition = animation?.cursorPosition || { x: 0, y: 0 };
  
  // Color schemes for different wood types
  const colorSchemes = {
    light: ['#F5DEB3', '#DEB887', '#D2B48C', '#FAEBD7', '#F5F5DC'],
    dark: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#B8860B'],
    warm: ['#E6CCB2', '#DDB892', '#B08968', '#7F5539', '#9C6644']
  };
  
  const colors = colorSchemes[colorScheme] || colorSchemes.warm;
  
  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setParticles(newParticles);
  }, [count, colors]);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => {
        const interactionX = interactive 
          ? (cursorPosition.x / window.innerWidth - 0.5) * 10 * particle.speed
          : 0;
        const interactionY = interactive
          ? (cursorPosition.y / window.innerHeight - 0.5) * 5 * particle.speed
          : 0;
          
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity
            }}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              x: [
                `${particle.x}%`,
                `${particle.x + 3 + interactionX}%`,
                `${particle.x - 2 + interactionX}%`,
                `${particle.x}%`
              ],
              y: [
                `${particle.y}%`,
                `${particle.y - 5 + interactionY}%`,
                `${particle.y + 3 + interactionY}%`,
                `${particle.y}%`
              ]
            }}
            transition={{
              duration: 8 + particle.speed * 5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        );
      })}
    </div>
  );
};

export default WoodDustParticles;
