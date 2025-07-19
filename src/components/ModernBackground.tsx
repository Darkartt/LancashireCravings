'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type BackgroundVariant = 'home' | 'about' | 'portfolio' | 'shop' | 'commission' | 'contact' | 'blog' | 'services' | 'process';

interface ModernBackgroundProps {
  variant: BackgroundVariant;
  className?: string;
}

interface BackgroundConfig {
  gradient: string;
  pattern: 'none' | 'grain' | 'grid' | 'dots';
  intensity: 'subtle' | 'medium';
  animation: 'none' | 'gentle' | 'parallax';
}

const ModernBackground: React.FC<ModernBackgroundProps> = ({ 
  variant, 
  className = ''
}) => {
  const { scrollY } = useScroll();
  
  // Subtle parallax effects
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -50]);
  
  // Professional configuration for each page
  const backgroundConfig: Record<BackgroundVariant, BackgroundConfig> = {
    home: {
      gradient: 'radial-gradient(ellipse at top, rgba(139, 69, 19, 0.03) 0%, rgba(250, 249, 247, 1) 50%)',
      pattern: 'grain',
      intensity: 'subtle',
      animation: 'parallax'
    },
    about: {
      gradient: 'linear-gradient(135deg, rgba(250, 249, 247, 1) 0%, rgba(232, 212, 173, 0.1) 100%)',
      pattern: 'grain',
      intensity: 'subtle',
      animation: 'gentle'
    },
    portfolio: {
      gradient: 'radial-gradient(circle at center, rgba(250, 249, 247, 1) 0%, rgba(139, 69, 19, 0.02) 100%)',
      pattern: 'grid',
      intensity: 'subtle',
      animation: 'parallax'
    },
    shop: {
      gradient: 'linear-gradient(180deg, rgba(250, 249, 247, 1) 0%, rgba(232, 212, 173, 0.05) 100%)',
      pattern: 'dots',
      intensity: 'subtle',
      animation: 'gentle'
    },
    commission: {
      gradient: 'radial-gradient(ellipse at bottom, rgba(139, 69, 19, 0.05) 0%, rgba(250, 249, 247, 1) 70%)',
      pattern: 'grain',
      intensity: 'medium',
      animation: 'parallax'
    },
    contact: {
      gradient: 'linear-gradient(45deg, rgba(250, 249, 247, 1) 0%, rgba(85, 107, 47, 0.03) 100%)',
      pattern: 'none',
      intensity: 'subtle',
      animation: 'gentle'
    },
    blog: {
      gradient: 'linear-gradient(135deg, rgba(250, 249, 247, 1) 0%, rgba(232, 228, 218, 0.3) 100%)',
      pattern: 'grain',
      intensity: 'subtle',
      animation: 'none'
    },
    services: {
      gradient: 'radial-gradient(circle at top left, rgba(85, 107, 47, 0.03) 0%, rgba(250, 249, 247, 1) 60%)',
      pattern: 'dots',
      intensity: 'subtle',
      animation: 'gentle'
    },
    process: {
      gradient: 'linear-gradient(180deg, rgba(250, 249, 247, 1) 0%, rgba(139, 69, 19, 0.03) 50%, rgba(250, 249, 247, 1) 100%)',
      pattern: 'grid',
      intensity: 'subtle',
      animation: 'parallax'
    }
  };
  
  const config = backgroundConfig[variant];
  
  // Professional wood grain pattern using CSS
  const WoodGrainPattern = () => (
    <div 
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.01) 2px,
            rgba(139, 69, 19, 0.01) 3px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(139, 69, 19, 0.005) 40px,
            rgba(139, 69, 19, 0.005) 41px
          )
        `,
        filter: 'blur(0.5px)'
      }}
    />
  );
  
  // Minimal grid pattern
  const GridPattern = () => (
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(139, 69, 19, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 69, 19, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}
    />
  );
  
  // Subtle dot pattern
  const DotsPattern = () => (
    <div 
      className="absolute inset-0 opacity-25"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(139, 69, 19, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}
    />
  );
  
  const renderPattern = () => {
    switch (config.pattern) {
      case 'grain':
        return <WoodGrainPattern />;
      case 'grid':
        return <GridPattern />;
      case 'dots':
        return <DotsPattern />;
      default:
        return null;
    }
  };
  
  const AnimationWrapper = ({ children }: { children: React.ReactNode }) => {
    if (config.animation === 'parallax') {
      return <motion.div style={{ y: y1 }}>{children}</motion.div>;
    }
    if (config.animation === 'gentle') {
      return <motion.div style={{ y: y2 }}>{children}</motion.div>;
    }
    return <div>{children}</div>;
  };
  
  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`} style={{ zIndex: -20 }}>
      {/* Main background gradient */}
      <AnimationWrapper>
        <div 
          className="absolute inset-0"
          style={{ background: config.gradient }}
        />
      </AnimationWrapper>
      
      {/* Pattern overlay */}
      <AnimationWrapper>
        {renderPattern()}
      </AnimationWrapper>
      
      {/* Subtle ambient light effect for home page */}
      {variant === 'home' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.02) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      )}
      
      {/* Gentle highlight for portfolio */}
      {variant === 'portfolio' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(139, 69, 19, 0.01) 50%, transparent 100%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      )}
      
      {/* Commission page wood warmth */}
      {variant === 'commission' && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(232, 212, 173, 0.05) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
};

export default ModernBackground;
