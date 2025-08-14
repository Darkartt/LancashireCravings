'use client';

import React, { useState, useEffect } from 'react';
import MotionDiv from '@/components/MotionContainer';
import { LazyAnimatePresence } from '@/components/LazyAnimatePresence';
import Image from 'next/image';
import type { MediaItem } from '@/lib/media-types';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  media: MediaItem[];
  isActive?: boolean;
}

interface InteractiveProcessGalleryProps {
  projectTitle: string;
  steps: ProcessStep[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  variant?: 'grid' | 'carousel' | 'tabs';
}

const InteractiveProcessGallery: React.FC<InteractiveProcessGalleryProps> = ({
  projectTitle,
  steps,
  autoPlay = false,
  autoPlayInterval = 5000,
  showThumbnails = true,
  variant = 'tabs'
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const activeStep = steps[activeStepIndex];
  const activeMedia = activeStep?.media[activeMediaIndex];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !activeStep?.media.length) return;

    const interval = setInterval(() => {
      setActiveMediaIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= activeStep.media.length) {
          // Move to next step
          setActiveStepIndex(prevStep => {
            const nextStep = prevStep + 1;
            if (nextStep >= steps.length) {
              setIsPlaying(false);
              return 0;
            }
            return nextStep;
          });
          return 0;
        }
        return nextIndex;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, activeStepIndex, activeStep?.media.length, autoPlayInterval, steps.length]);

  const handleStepChange = (stepIndex: number) => {
    setActiveStepIndex(stepIndex);
    setActiveMediaIndex(0);
  };

  const handleMediaChange = (mediaIndex: number) => {
    setActiveMediaIndex(mediaIndex);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const mediaVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  };

  if (variant === 'grid') {
    return (
      <div className="w-full max-w-7xl mx-auto">
  <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
            {projectTitle} Process Gallery
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore the transformation through detailed documentation of each step
          </p>
  </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {steps.map((step, stepIndex) => (
            <MotionDiv
              key={step.id}
              variants={itemVariants}
              className="bg-background rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Step Header */}
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground/70 text-sm">
                  {step.description}
                </p>
              </div>

              {/* Media Grid */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {step.media.slice(0, 4).map((media, mediaIndex) => (
                    <MotionDiv
                      key={media.id}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square relative rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setActiveStepIndex(stepIndex);
                        setActiveMediaIndex(mediaIndex);
                      }}
                    >
                      <Image
                        src={media.src}
                        alt={media.alt}
                        fill
                        className="object-cover"
                      />
                      {step.media.length > 4 && mediaIndex === 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                          +{step.media.length - 4}
                        </div>
                      )}
        </MotionDiv>
                  ))}
                </div>
              </div>
      </MotionDiv>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LazyAnimatePresence>
          {activeMedia && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setActiveMediaIndex(-1)}
            >
              <MotionDiv
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              >
                <div className="aspect-video relative">
                  <Image
                    src={activeMedia.src}
                    alt={activeMedia.alt}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">
                    {activeStep.title}
                  </h3>
                  <p className="text-foreground/70">
                    {activeMedia.alt}
                  </p>
                </div>
              </MotionDiv>
            </MotionDiv>
          )}
        </LazyAnimatePresence>
      </div>
    );
  }

  // Tabs variant (default)
  return (
    <div className="w-full max-w-6xl mx-auto">
  <MotionDiv
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
          {projectTitle} Process Gallery
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Follow the step-by-step transformation with interactive photo documentation
        </p>
  </MotionDiv>

      {/* Step Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepChange(index)}
            className={`
              px-6 py-3 rounded-full font-medium transition-all duration-300
              ${activeStepIndex === index 
                ? 'bg-accent-primary text-white shadow-lg' 
                : 'bg-background hover:bg-neutral-50 text-foreground/70 border border-neutral-200'
              }
            `}
          >
            <span className="text-sm font-semibold mr-2">{index + 1}.</span>
            {step.title}
          </button>
        ))}
      </div>

      {/* Main Content */}
  <MotionDiv
        key={activeStepIndex}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-background rounded-xl border border-neutral-200 overflow-hidden shadow-lg"
      >
        {/* Main Image Display */}
        <div className="aspect-video relative bg-neutral-100">
      <LazyAnimatePresence mode="wait">
            {activeMedia && (
        <MotionDiv
                key={`${activeStepIndex}-${activeMediaIndex}`}
                variants={mediaVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={activeMedia.src}
                  alt={activeMedia.alt}
                  fill
                  className="object-cover"
                />
        </MotionDiv>
            )}
      </LazyAnimatePresence>

          {/* Media Controls */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={togglePlayback}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
              {activeMediaIndex + 1} / {activeStep?.media.length || 0}
            </span>
          </div>

          {/* Navigation Arrows */}
          {activeStep?.media.length > 1 && (
            <>
              <button
                onClick={() => handleMediaChange(Math.max(0, activeMediaIndex - 1))}
                disabled={activeMediaIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-50 text-white p-2 rounded-full transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => handleMediaChange(Math.min(activeStep.media.length - 1, activeMediaIndex + 1))}
                disabled={activeMediaIndex === activeStep.media.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-50 text-white p-2 rounded-full transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            <div className="flex-1">
              <h3 className="text-2xl font-serif font-semibold text-accent-primary mb-3">
                {activeStep.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                {activeStep.description}
              </p>
              {activeMedia?.alt && (
                <p className="text-sm text-foreground/60 italic">
                  {activeMedia.alt}
                </p>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {showThumbnails && activeStep?.media.length > 1 && (
              <div className="mt-4 lg:mt-0">
                <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-visible">
                  {activeStep.media.map((media, index) => (
                    <button
                      key={media.id}
                      onClick={() => handleMediaChange(index)}
                      className={`
                        flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                        ${index === activeMediaIndex 
                          ? 'border-accent-primary shadow-md' 
                          : 'border-neutral-200 hover:border-neutral-300'
                        }
                      `}
                    >
                      <Image
                        src={media.src}
                        alt={media.alt}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
  </MotionDiv>
    </div>
  );
};

export default InteractiveProcessGallery;
