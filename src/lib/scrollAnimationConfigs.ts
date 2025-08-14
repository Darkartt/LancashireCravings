import { loadGsap } from '@/lib/gsapLoader';

export interface ScrollAnimationConfig {
  trigger: string;
  start: string;
  end: string;
  scrub?: boolean | number;
  pin?: boolean;
  anticipatePin?: number;
  refreshPriority?: number;
  markers?: boolean;
  onUpdate?: (self: any) => void;
  onEnter?: (self: any) => void;
  onLeave?: (self: any) => void;
  onEnterBack?: (self: any) => void;
  onLeaveBack?: (self: any) => void;
}

export interface WoodcarvingAnimationConfig {
  woodType: 'oak' | 'walnut' | 'cherry' | 'maple';
  intensity: 'subtle' | 'medium' | 'strong';
  direction: 'horizontal' | 'vertical';
  duration: number;
  particles: boolean;
  morphing: boolean;
}

// Page-specific animation configurations
export const pageAnimationConfigs = {
  home: {
    hero: {
      parallax: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      woodGrain: {
        type: 'oak',
        intensity: 'medium',
        flowing: true
      },
      particles: {
        count: 25,
        speed: 0.5,
        interactive: true
      }
    },
    sections: {
      heroToProcess: {
        trigger: '#hero',
        start: 'bottom 60%',
        end: 'bottom 20%',
        scrub: 1,
        woodTransition: {
          from: 'oak',
          to: 'walnut',
          style: 'carving-reveal'
        }
      },
      processToPortfolio: {
        trigger: '#process',
        start: 'bottom 60%',
        end: 'bottom 20%',
        scrub: 1,
        woodTransition: {
          from: 'walnut',
          to: 'cherry',
          style: 'tool-transform'
        }
      }
    }
  },
  
  portfolio: {
    showcase: {
      rotation: {
        trigger: '.portfolio-item',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.5,
      },
      zoom: {
        trigger: '.portfolio-detail',
        start: 'top 60%',
        end: 'center center',
        scrub: 1,
      }
    }
  },
  
  commission: {
    configurator: {
      woodSamples: {
        trigger: '.wood-configurator',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 0.8,
      },
      tools: {
        trigger: '.tool-demonstration',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1,
      }
    }
  }
} as const;

// Wood grain morphing presets
export const woodGrainMorphing = {
  oakToWalnut: {
    duration: 2,
    ease: 'power2.inOut',
    colorStops: [
      { time: 0, color: '#E8D4AD' },
      { time: 0.3, color: '#C4A484' },
      { time: 0.7, color: '#8B6F47' },
      { time: 1, color: '#5E4B3C' }
    ]
  },
  walnutToCherry: {
    duration: 1.8,
    ease: 'power2.inOut',
    colorStops: [
      { time: 0, color: '#5E4B3C' },
      { time: 0.4, color: '#7A5040' },
      { time: 0.8, color: '#95553F' },
      { time: 1, color: '#A15843' }
    ]
  },
  cherryToMaple: {
    duration: 2.2,
    ease: 'power2.inOut',
    colorStops: [
      { time: 0, color: '#A15843' },
      { time: 0.3, color: '#C47B5A' },
      { time: 0.7, color: '#E5B888' },
      { time: 1, color: '#F5DEB3' }
    ]
  }
} as const;

// Performance optimization settings
export const performanceSettings = {
  mobile: {
    reducedAnimations: true,
    particleCount: 8,
    maxScrubValue: 0.5,
    simplifiedMorphing: true,
    disableScrollTrigger: false
  },
  desktop: {
    fullAnimations: true,
    particleCount: 25,
    maxScrubValue: 1,
    complexMorphing: true,
    disableScrollTrigger: false
  },
  reducedMotion: {
    disableScrollTrigger: true,
    staticBackgrounds: true,
    fadeOnlyTransitions: true,
    particleCount: 0,
    maxScrubValue: 0
  }
} as const;

// Utility functions for creating scroll animations
export const createScrollTriggerAnimation = async (
  targetElement: string | Element,
  config: ScrollAnimationConfig,
  animation: any
) => {
  const { gsap } = await loadGsap();
  return gsap
    .timeline({
      scrollTrigger: {
        ...config,
        trigger: targetElement
      }
    })
    .add(animation);
};

export const createWoodGrainMorph = async (
  fromWood: keyof typeof woodGrainMorphing
) => {
  const config = woodGrainMorphing[fromWood];
  const { gsap } = await loadGsap();
  return gsap.timeline({
    duration: config.duration,
    ease: config.ease
  });
};

// Accessibility and performance checks
export const shouldUseReducedAnimations = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = window.innerWidth < 768;
  const isLowEndDevice = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
  
  return mediaQuery.matches || (isMobile && isLowEndDevice);
};

export const getOptimalPerformanceSettings = () => {
  if (typeof window === 'undefined') return performanceSettings.mobile;
  
  if (shouldUseReducedAnimations()) {
    return performanceSettings.reducedMotion;
  }
  
  return window.innerWidth < 768 ? performanceSettings.mobile : performanceSettings.desktop;
};

// Animation factory functions
export const createSectionTransition = async (
  fromSection: string,
  toSection: string,
  transitionType: 'carving' | 'polishing' | 'assembly' | 'finishing'
) => {
  const settings = getOptimalPerformanceSettings();
  
  if (settings.disableScrollTrigger) {
    const { gsap } = await loadGsap();
    return gsap.timeline(); // Return empty timeline for reduced motion
  }
  
  const { gsap } = await loadGsap();
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: fromSection,
      start: 'bottom 60%',
      end: 'bottom 20%',
      scrub: settings.maxScrubValue,
      refreshPriority: 1
    }
  });
  
  // Add transition-specific animations based on type
  switch (transitionType) {
    case 'carving':
      tl.to('.wood-block', { scale: 0.8, rotation: 5, duration: 1 })
        .to('.carving-tool', { x: 50, rotation: 360, duration: 1 }, '<')
        .to('.wood-chips', { opacity: 1, y: -20, stagger: 0.1 }, '<0.5');
      break;
      
    case 'polishing':
      tl.to('.surface-rough', { opacity: 0, duration: 0.8 })
        .to('.surface-smooth', { opacity: 1, duration: 0.8 }, '<0.2')
        .to('.shine-effect', { x: '100%', duration: 1.2 }, '<');
      break;
      
    // Add more transition types as needed
  }
  
  return tl;
};

const scrollAnimationConfigs = {
  pageAnimationConfigs,
  woodGrainMorphing,
  performanceSettings,
  createScrollTriggerAnimation,
  createWoodGrainMorph,
  shouldUseReducedAnimations,
  getOptimalPerformanceSettings,
  createSectionTransition
};

export default scrollAnimationConfigs;
