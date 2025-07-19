'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import { MediaItem } from '@/lib/media-organized';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  media?: MediaItem[];
  icon?: React.ReactNode;
  isCompleted?: boolean;
  details?: string;
  tools?: string[];
  techniques?: string[];
}

interface EnhancedTimelineProps {
  steps: TimelineStep[];
  title?: string;
  description?: string;
  variant?: 'vertical' | 'horizontal' | 'interactive';
  showProgress?: boolean;
  interactive?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({
  steps,
  title = "Carving Process",
  description = "Follow the journey from raw wood to finished masterpiece",
  variant = 'interactive',
  showProgress = true,
  interactive = true,
  autoPlay = false,
  autoPlayInterval = 3000
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, margin: "-100px" });

  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !interactive) return;

    const interval = setInterval(() => {
      setActiveStepIndex(prev => {
        const next = prev + 1;
        if (next >= steps.length) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, interactive, autoPlayInterval, steps.length]);

  const handleStepClick = (index: number) => {
    if (!interactive) return;
    setActiveStepIndex(index);
    setIsPlaying(false);
  };

  const toggleExpanded = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const progressVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  if (variant === 'interactive') {
    return (
      <div ref={timelineRef} className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-6">
            {description}
          </p>
          
          {showProgress && (
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm font-medium text-foreground/60 mb-2">
                <span>Progress</span>
                <span>{completedSteps} of {steps.length} steps completed</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${progressPercentage}%` } : {}}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Playback Controls */}
          {interactive && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                onClick={togglePlayback}
                className="flex items-center space-x-2 bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-2 rounded-full transition-colors duration-200"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Play</span>
                  </>
                )}
              </button>
              <span className="text-sm text-foreground/60">
                Step {activeStepIndex + 1} of {steps.length}
              </span>
            </div>
          )}
        </motion.div>

        {/* Interactive Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-4"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  className={`
                    relative cursor-pointer transition-all duration-300
                    ${index === activeStepIndex ? 'scale-105' : 'hover:scale-102'}
                  `}
                  onClick={() => handleStepClick(index)}
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-neutral-200 z-0" />
                  )}
                  
                  {/* Animated Progress Line */}
                  {index < activeStepIndex && (
                    <motion.div
                      className="absolute left-6 top-12 bottom-0 w-px bg-accent-primary z-10"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  )}

                  <div className={`
                    relative z-20 flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300
                    ${index === activeStepIndex 
                      ? 'bg-accent-primary/5 border-accent-primary shadow-lg' 
                      : 'bg-background border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                    }
                  `}>
                    {/* Step Circle */}
                    <div className={`
                      w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${step.isCompleted 
                        ? 'bg-accent-primary border-accent-primary text-white' 
                        : index === activeStepIndex
                        ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                        : 'bg-background border-neutral-300 text-foreground/60'
                      }
                    `}>
                      {step.icon || (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`
                        font-serif font-semibold truncate
                        ${index === activeStepIndex ? 'text-accent-primary' : 'text-foreground'}
                      `}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-foreground/60 line-clamp-2">
                        {step.description}
                      </p>
                      <span className="text-xs font-medium text-accent-secondary">
                        {step.duration}
                      </span>
                    </div>

                    {/* Expand Icon */}
                    <motion.div
                      animate={{ rotate: expandedStep === step.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-foreground/40"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedStep === step.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 ml-16 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        {step.details && (
                          <p className="text-sm text-foreground/70 mb-3">
                            {step.details}
                          </p>
                        )}
                        {step.tools && step.tools.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-semibold text-accent-primary mb-1">Tools:</h4>
                            <div className="flex flex-wrap gap-1">
                              {step.tools.map((tool, toolIndex) => (
                                <span key={toolIndex} className="text-xs bg-accent-primary/10 text-accent-primary px-2 py-1 rounded">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {step.techniques && step.techniques.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-accent-secondary mb-1">Techniques:</h4>
                            <div className="flex flex-wrap gap-1">
                              {step.techniques.map((technique, techIndex) => (
                                <span key={techIndex} className="text-xs bg-accent-secondary/10 text-accent-secondary px-2 py-1 rounded">
                                  {technique}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Active Step Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-xl border border-neutral-200 overflow-hidden shadow-lg"
              >
                {/* Media Display */}
                {steps[activeStepIndex]?.media && steps[activeStepIndex].media!.length > 0 && (
                  <div className="aspect-video relative bg-neutral-100">
                    <Image
                      src={steps[activeStepIndex].media![0].src}
                      alt={steps[activeStepIndex].media![0].alt}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Media Count Badge */}
                    {steps[activeStepIndex].media!.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        1 / {steps[activeStepIndex].media!.length}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-accent-primary mb-2">
                        {steps[activeStepIndex].title}
                      </h3>
                      <span className="inline-block bg-accent-secondary/10 text-accent-secondary text-sm font-medium px-3 py-1 rounded-full">
                        {steps[activeStepIndex].duration}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpanded(steps[activeStepIndex].id)}
                      className="text-foreground/60 hover:text-foreground transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-foreground/70 leading-relaxed mb-6">
                    {steps[activeStepIndex].description}
                  </p>

                  {/* Additional Media Thumbnails */}
                  {steps[activeStepIndex].media && steps[activeStepIndex].media!.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {steps[activeStepIndex].media!.slice(1).map((media) => (
                        <div key={media.id} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                          <Image
                            src={media.src}
                            alt={media.alt}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to original Timeline for non-interactive variants
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {description}
          </p>
          
          {showProgress && (
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium text-foreground/60 mb-2">
                <span>Progress</span>
                <span>{completedSteps} of {steps.length} steps</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <motion.div
                  className="bg-accent-primary h-2 rounded-full"
                  variants={progressVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-200 z-0" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={stepVariants}
                className="relative flex items-start"
              >
                {/* Step Circle */}
                <div className={`
                  relative z-20 w-16 h-16 rounded-full border-4 flex items-center justify-center mr-8
                  ${step.isCompleted 
                    ? 'bg-accent-primary border-accent-primary text-white' 
                    : 'bg-background border-neutral-300 text-foreground/60'
                  }
                  shadow-lg
                `}>
                  {step.icon || (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-background rounded-lg border border-neutral-200 p-6 shadow-sm">
                    <h3 className="font-serif font-semibold text-xl text-accent-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 mb-4 leading-relaxed">
                      {step.description}
                    </p>
                    <span className="inline-block bg-accent-secondary/10 text-accent-secondary text-sm font-medium px-3 py-1 rounded-full">
                      {step.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedTimeline;
