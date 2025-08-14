'use client';

import React, { useState, useRef, useCallback } from 'react';
import MotionDiv from '@/components/MotionContainer';
import { LazyAnimatePresence } from '@/components/LazyAnimatePresence';
import Image from 'next/image';
import type { MediaItem } from '@/lib/media-types';

interface ComparisonStage {
  id: string;
  title: string;
  description: string;
  media: MediaItem;
  timestamp?: string;
}

interface EnhancedBeforeAfterProps {
  stages: ComparisonStage[];
  title?: string;
  description?: string;
  variant?: 'slider' | 'split' | 'overlay' | 'tabs' | 'timeline';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showLabels?: boolean;
  showProgress?: boolean;
}

const EnhancedBeforeAfter: React.FC<EnhancedBeforeAfterProps> = ({
  stages,
  title = "Transformation Timeline",
  description = "Witness the incredible transformation step by step",
  variant = 'slider',
  autoPlay = false,
  autoPlayInterval = 3000,
  showLabels = true,
  showProgress = true
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStage = stages[currentStageIndex];

  // Auto-play functionality
  React.useEffect(() => {
    if (!isPlaying || stages.length < 2) return;

    intervalRef.current = setInterval(() => {
      setCurrentStageIndex(prev => {
        const next = prev + 1;
        if (next >= stages.length - 1) {
          setIsPlaying(false);
          return stages.length - 1;
        }
        return next;
      });
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoPlayInterval, stages.length]);

  const handleSliderChange = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderChange(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleSliderChange(e.clientX);
  }, [isDragging, handleSliderChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStage = (index: number) => {
    setCurrentStageIndex(index);
    setIsPlaying(false);
  };

  // Timeline variant with multiple stages
  if (variant === 'timeline' && stages.length > 2) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Stage Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 bg-background border border-neutral-200 rounded-full p-2">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => goToStage(index)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${index === currentStageIndex 
                    ? 'bg-accent-primary text-white shadow-md' 
                    : 'text-foreground/70 hover:text-foreground hover:bg-neutral-50'
                  }
                `}
              >
                {stage.title}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-foreground/60 mb-2">
              <span>Progress</span>
              <span>{currentStageIndex + 1} of {stages.length}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <MotionDiv
                className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2 rounded-full"
                animate={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Stage Display */}
        <LazyAnimatePresence mode="wait">
          <MotionDiv
            key={currentStageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-background rounded-xl border border-neutral-200 overflow-hidden shadow-lg"
          >
            <div className="aspect-video relative">
              <Image
                src={currentStage.media.src}
                alt={currentStage.media.alt}
                fill
                className="object-cover"
              />
              
              {/* Stage Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <h3 className="text-xl font-serif font-semibold mb-2">
                  {currentStage.title}
                </h3>
                <p className="text-sm opacity-90">
                  {currentStage.description}
                </p>
                {currentStage.timestamp && (
                  <span className="text-xs opacity-75 mt-2 block">
                    {currentStage.timestamp}
                  </span>
                )}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => goToStage(Math.max(0, currentStageIndex - 1))}
                disabled={currentStageIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-50 text-white p-3 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => goToStage(Math.min(stages.length - 1, currentStageIndex + 1))}
                disabled={currentStageIndex === stages.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-50 text-white p-3 rounded-full transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayback}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors duration-200"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </MotionDiv>
        </LazyAnimatePresence>

        {/* Stage Thumbnails */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => goToStage(index)}
                className={`
                  flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200
                  ${index === currentStageIndex 
                    ? 'border-accent-primary shadow-lg scale-110' 
                    : 'border-neutral-200 hover:border-neutral-300 opacity-70 hover:opacity-100'
                  }
                `}
              >
                <Image
                  src={stage.media.src}
                  alt={stage.media.alt}
                  width={80}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Slider variant for before/after comparison
  if (variant === 'slider' && stages.length >= 2) {
    const beforeImage = stages[0];
    const afterImage = stages[stages.length - 1];

    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Comparison Container */}
        <div 
          ref={containerRef}
          className="relative aspect-video rounded-xl overflow-hidden shadow-xl border border-neutral-200 cursor-col-resize"
          onMouseDown={handleMouseDown}
        >
          {/* Before Image */}
          <div className="absolute inset-0">
            <Image
              src={beforeImage.media.src}
              alt={beforeImage.media.alt}
              fill
              className="object-cover"
            />
            {showLabels && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {beforeImage.title}
              </div>
            )}
          </div>

          {/* After Image */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src={afterImage.media.src}
              alt={afterImage.media.alt}
              fill
              className="object-cover"
            />
            {showLabels && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {afterImage.title}
              </div>
            )}
          </div>

          {/* Slider Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          />

          {/* Slider Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-accent-primary z-30 flex items-center justify-center cursor-col-resize -ml-4"
            style={{ left: `${sliderPosition}%` }}
          >
            <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
            Drag to compare
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="text-center">
            <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">
              {beforeImage.title}
            </h3>
            <p className="text-foreground/70">
              {beforeImage.description}
            </p>
            {beforeImage.timestamp && (
              <span className="text-sm text-foreground/50 mt-1 block">
                {beforeImage.timestamp}
              </span>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">
              {afterImage.title}
            </h3>
            <p className="text-foreground/70">
              {afterImage.description}
            </p>
            {afterImage.timestamp && (
              <span className="text-sm text-foreground/50 mt-1 block">
                {afterImage.timestamp}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tabs variant
  if (variant === 'tabs') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
            {title}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-background border border-neutral-200 rounded-lg p-1">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setCurrentStageIndex(index)}
                className={`
                  px-6 py-3 rounded-md text-sm font-medium transition-all duration-200
                  ${index === currentStageIndex 
                    ? 'bg-accent-primary text-white shadow-sm' 
                    : 'text-foreground/70 hover:text-foreground hover:bg-neutral-50'
                  }
                `}
              >
                {stage.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <LazyAnimatePresence mode="wait">
          <MotionDiv
            key={currentStageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-background rounded-xl border border-neutral-200 overflow-hidden shadow-lg"
          >
            <div className="aspect-video relative">
              <Image
                src={currentStage.media.src}
                alt={currentStage.media.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold text-accent-primary mb-3">
                {currentStage.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {currentStage.description}
              </p>
              {currentStage.timestamp && (
                <span className="text-sm text-foreground/50 mt-3 block">
                  {currentStage.timestamp}
                </span>
              )}
            </div>
          </MotionDiv>
        </LazyAnimatePresence>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
          {title}
        </h2>
        <p className="text-lg text-foreground/70">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EnhancedBeforeAfter;
