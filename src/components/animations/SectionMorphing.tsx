'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import WoodGrainTransition from './WoodGrainTransition';

interface SectionMorphingProps {
  sectionId: string;
  nextSectionId: string;
  morphingType: 'hero-to-process' | 'process-to-portfolio' | 'portfolio-to-commission' | 'commission-to-contact';
  className?: string;
}

// Define morphing configurations outside component to prevent recreation
const MORPHING_CONFIGS = {
  'hero-to-process': {
    woodFrom: 'oak' as const,
    woodTo: 'walnut' as const,
    animationType: 'carving-reveal',
    particles: 'wood-chips',
    duration: 2
  },
  'process-to-portfolio': {
    woodFrom: 'walnut' as const,
    woodTo: 'cherry' as const,
    animationType: 'tool-transform',
    particles: 'dust-settling',
    duration: 1.8
  },
  'portfolio-to-commission': {
    woodFrom: 'cherry' as const,
    woodTo: 'maple' as const,
    animationType: 'sample-transition',
    particles: 'grain-flow',
    duration: 2.2
  },
  'commission-to-contact': {
    woodFrom: 'maple' as const,
    woodTo: 'oak' as const,
    animationType: 'polish-finish',
    particles: 'shine-effect',
    duration: 1.5
  }
} as const;

const SectionMorphing: React.FC<SectionMorphingProps> = ({
  sectionId,
  nextSectionId,
  morphingType,
  className = ''
}) => {
  const morphingRef = useRef<HTMLDivElement>(null);
  const { ScrollTrigger } = useScrollTrigger();
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<Array<{x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize config to prevent useEffect infinite loop
  const config = useMemo(() => MORPHING_CONFIGS[morphingType], [morphingType]);

  useEffect(() => {
    if (!ScrollTrigger || !morphingRef.current) return;

    const morphingElement = morphingRef.current;
    const currentSection = document.getElementById(sectionId);
    const nextSection = document.getElementById(nextSectionId);

    if (!currentSection || !nextSection) return;

    // Create the morphing timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: currentSection,
        start: 'bottom 60%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Update morphing element opacity and effects based on scroll progress
          gsap.set(morphingElement, {
            opacity: progress,
            scale: 1 + (progress * 0.05),
            filter: `blur(${(1 - progress) * 2}px)`
          });
        }
      }
    });

    // Animation-specific effects
    switch (config.animationType) {
      case 'carving-reveal':
        tl.to('.carving-tool', {
          rotation: 360,
          duration: config.duration,
          ease: 'power2.inOut'
        })
        .to('.wood-block', {
          scale: 0.8,
          duration: config.duration,
          ease: 'power2.inOut'
        }, '<');
        break;

      case 'tool-transform':
        tl.to('.tool-elements', {
          y: -50,
          opacity: 0,
          stagger: 0.2,
          duration: config.duration / 2,
          ease: 'power2.in'
        })
        .to('.portfolio-pieces', {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: config.duration / 2,
          ease: 'power2.out'
        });
        break;

      case 'sample-transition':
        tl.to('.wood-samples', {
          rotationY: 180,
          duration: config.duration,
          ease: 'power2.inOut',
          stagger: 0.1
        });
        break;

      case 'polish-finish':
        tl.to('.finish-layer', {
          opacity: 1,
          duration: config.duration,
          ease: 'power2.out'
        })
        .to('.surface-shine', {
          x: '100%',
          duration: config.duration * 0.6,
          ease: 'power2.inOut'
        }, '<');
        break;
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === currentSection) {
          trigger.kill();
        }
      });
    };
  }, [ScrollTrigger, sectionId, nextSectionId, config, morphingType]);

  // Generate particles with seeded random for consistent SSR/client rendering
  useEffect(() => {
    if (!isClient) return;
    
    // Use a seeded random function for consistent results
    let seed = sectionId.charCodeAt(0) * 1000 + nextSectionId.charCodeAt(0); // Deterministic seed
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    const particleCount = config.particles === 'wood-chips' ? 15 : 8;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: seededRandom() * 100,
        y: seededRandom() * 100,
        delay: i * 0.2
      });
    }
    setParticles(newParticles);
  }, [isClient, sectionId, nextSectionId, config]);

  const renderAnimationElements = () => {
    switch (config.animationType) {
      case 'carving-reveal':
        return (
          <>
            <div className="carving-tool absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-amber-800">
                <path d="M10,30 L30,10 L35,15 L15,35 Z" fill="currentColor" opacity="0.3"/>
                <path d="M12,28 L28,12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="wood-block absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-amber-200 opacity-20 rounded" />
          </>
        );

      case 'tool-transform':
        return (
          <>
            {['chisel', 'hammer', 'plane'].map((tool, i) => (
              <div key={tool} className={`tool-elements absolute opacity-30`} style={{
                top: `${20 + i * 15}%`,
                left: `${30 + i * 20}%`
              }}>
                <div className="w-8 h-8 bg-amber-700 rounded transform rotate-45" />
              </div>
            ))}
            {['piece1', 'piece2', 'piece3'].map((piece, i) => (
              <div key={piece} className={`portfolio-pieces absolute opacity-0`} style={{
                top: `${30 + i * 10}%`,
                right: `${20 + i * 15}%`
              }}>
                <div className="w-6 h-6 bg-amber-600 rounded-full" />
              </div>
            ))}
          </>
        );

      case 'sample-transition':
        return (
          <>
            {[config.woodFrom, config.woodTo].map((wood, i) => {
              const getWoodColor = (woodType: string) => {
                switch (woodType) {
                  case 'oak': return '#E8D4AD';
                  case 'walnut': return '#5E4B3C';
                  case 'cherry': return '#A15843';
                  case 'maple': return '#F5DEB3';
                  default: return '#E8D4AD';
                }
              };
              
              return (
                <div key={wood} className={`wood-samples absolute w-12 h-8 rounded opacity-40`} style={{
                  top: `${40 + i * 10}%`,
                  left: `${40 + i * 10}%`,
                  backgroundColor: getWoodColor(wood)
                }} />
              );
            })}
          </>
        );

      case 'polish-finish':
        return (
          <>
            <div className="finish-layer absolute inset-0 bg-gradient-to-r from-transparent via-amber-100 to-transparent opacity-0" />
            <div className="surface-shine absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60 transform -translate-x-full" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      ref={morphingRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 5 }}
    >
      {/* Wood grain transition background */}
      <WoodGrainTransition
        fromWoodType={config.woodFrom}
        toWoodType={config.woodTo}
        triggerElement={`#${sectionId}`}
        intensity="medium"
        className="opacity-70"
      />

      {/* Animation-specific elements */}
      <div className="relative w-full h-full">
        {renderAnimationElements()}
      </div>

      {/* Particle effects based on morphing type */}
      <div className="particle-container absolute inset-0">
        {isClient && particles.map((particle, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 rounded-full ${
              config.particles === 'wood-chips' ? 'bg-amber-600' :
              config.particles === 'dust-settling' ? 'bg-amber-200' :
              config.particles === 'grain-flow' ? 'bg-amber-500' :
              'bg-amber-300'
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionMorphing;
