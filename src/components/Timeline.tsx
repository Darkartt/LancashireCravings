'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MediaItem } from '@/lib/media-organized';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  media?: MediaItem;
  icon?: React.ReactNode;
  isCompleted?: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
  title?: string;
  description?: string;
  variant?: 'vertical' | 'horizontal';
  showProgress?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  steps,
  title = "Carving Process",
  description = "Follow the journey from raw wood to finished masterpiece",
  variant = 'vertical',
  showProgress = true
}) => {
  const completedSteps = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: variant === 'vertical' ? 30 : 0,
      x: variant === 'horizontal' ? 30 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className="w-full max-w-6xl mx-auto">
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
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-neutral-200 z-0" />
          <motion.div
            className="absolute top-8 left-0 h-0.5 bg-accent-primary z-10"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />

          <div className="flex justify-between relative z-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={stepVariants}
                className="flex flex-col items-center max-w-xs"
              >
                {/* Step Circle */}
                <div className={`
                  w-16 h-16 rounded-full border-4 flex items-center justify-center mb-4
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
                <div className="text-center">
                  <h3 className="font-serif font-semibold text-lg text-accent-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-2">
                    {step.description}
                  </p>
                  <span className="text-xs font-medium text-accent-secondary">
                    {step.duration}
                  </span>
                </div>

                {/* Media */}
                {step.media && (
                  <div className="mt-4 w-32 h-24 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={step.media.src}
                      alt={step.media.alt || step.title}
                      width={128}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Vertical Timeline (default)
  return (
    <div className="w-full max-w-4xl mx-auto">
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
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Vertical Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-200 z-0" />
        <motion.div
          className="absolute left-8 top-0 w-0.5 bg-accent-primary z-10"
          initial={{ height: 0 }}
          animate={{ height: `${progressPercentage}%` }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />

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
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                    <div className="flex-1">
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

                    {/* Media */}
                    {step.media && (                  <div className="mt-4 lg:mt-0 lg:w-48 h-36 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                    <Image
                      src={step.media.src}
                      alt={step.media.alt || step.title}
                      width={192}
                      height={144}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Timeline;
