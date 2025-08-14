'use client';

import React, { useState } from 'react';
import MotionDiv from '@/components/MotionContainer';
import Image from 'next/image';
import type { MediaItem } from '@/lib/media-types';

interface BeforeAfterProps {
  beforeImage: MediaItem;
  afterImage: MediaItem;
  title?: string;
  description?: string;
  variant?: 'slider' | 'tabs' | 'hover';
  orientation?: 'horizontal' | 'vertical';
}

const BeforeAfterComparison: React.FC<BeforeAfterProps> = ({
  beforeImage,
  afterImage,
  title = "Transformation",
  description = "See the remarkable transformation from raw wood to finished masterpiece",
  variant = 'slider',
  orientation = 'horizontal'
}) => {
  const [isAfter, setIsAfter] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(parseInt(event.target.value));
  };

  if (variant === 'tabs') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">
            {title}
          </h3>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-6">
          <div className="bg-neutral-100 rounded-full p-1 flex">
            <button
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                !isAfter 
                  ? 'bg-accent-primary text-white shadow-md' 
                  : 'text-foreground/70 hover:text-foreground'
              }`}
              onClick={() => setIsAfter(false)}
            >
              Before
            </button>
            <button
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                isAfter 
                  ? 'bg-accent-primary text-white shadow-md' 
                  : 'text-foreground/70 hover:text-foreground'
              }`}
              onClick={() => setIsAfter(true)}
            >
              After
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
          <MotionDiv
            key={isAfter ? 'after' : 'before'}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-full"
          >              <Image
                src={isAfter ? afterImage.src : beforeImage.src}
                alt={isAfter ? afterImage.alt : beforeImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
          </MotionDiv>

          {/* Label */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {isAfter ? 'After' : 'Before'}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hover') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">
            {title}
          </h3>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {description}
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            Hover to reveal the transformation
          </p>
        </div>

        {/* Hover Image */}
        <div 
          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg cursor-pointer group"
          onMouseEnter={() => setIsAfter(true)}
          onMouseLeave={() => setIsAfter(false)}
        >
          <div className="w-full h-full relative">
            <Image
              src={beforeImage.src}
              alt={beforeImage.alt}
              fill
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
            <Image
              src={afterImage.src}
              alt={afterImage.alt}
              fill
              className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
            />
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-300 group-hover:opacity-0">
            Before
          </div>
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            After
          </div>
        </div>
      </div>
    );
  }

  // Slider variant (default)
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">
          {title}
        </h3>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          {description}
        </p>
        <p className="text-sm text-foreground/60 mt-2">
          Drag the slider to reveal the transformation
        </p>
      </div>

      {/* Slider Comparison */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
        {/* Before Image (full) */}
        <Image
          src={beforeImage.src}
          alt={beforeImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
        />

        {/* After Image (clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: orientation === 'horizontal' 
              ? `inset(0 ${100 - sliderPosition}% 0 0)`
              : `inset(${100 - sliderPosition}% 0 0 0)`
          }}
        >
          <Image
            src={afterImage.src}
            alt={afterImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute bg-white shadow-lg z-20"
          style={{
            [orientation === 'horizontal' ? 'left' : 'top']: `${sliderPosition}%`,
            [orientation === 'horizontal' ? 'top' : 'left']: '0',
            [orientation === 'horizontal' ? 'width' : 'height']: '2px',
            [orientation === 'horizontal' ? 'height' : 'width']: '100%',
            transform: orientation === 'horizontal' ? 'translateX(-1px)' : 'translateY(-1px)'
          }}
        />

        {/* Slider Handle */}
        <div
          className="absolute w-8 h-8 bg-white rounded-full shadow-lg border-2 border-accent-primary z-30 cursor-pointer flex items-center justify-center"
          style={{
            [orientation === 'horizontal' ? 'left' : 'top']: `${sliderPosition}%`,
            [orientation === 'horizontal' ? 'top' : 'left']: '50%',
            transform: orientation === 'horizontal' 
              ? 'translate(-50%, -50%)' 
              : 'translate(-50%, -50%)'
          }}
        >
          <div className="w-2 h-2 bg-accent-primary rounded-full" />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          After
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
          style={{
            background: 'transparent',
          }}
        />
      </div>

      {/* Slider Control */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <span className="text-sm font-medium text-foreground/70">Before</span>
        <div className="flex-1 max-w-md">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8B4513 0%, #8B4513 ${sliderPosition}%, #e5e5e5 ${sliderPosition}%, #e5e5e5 100%)`
            }}
          />
        </div>
        <span className="text-sm font-medium text-foreground/70">After</span>
      </div>
    </div>
  );
};

export default BeforeAfterComparison;
