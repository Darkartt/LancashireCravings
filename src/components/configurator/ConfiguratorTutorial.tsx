'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  target?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to the Design Studio",
    description: "Create your perfect custom woodwork piece with our interactive 3D configurator. Follow this quick tour to get started.",
    icon: "👋"
  },
  {
    title: "Choose Your Product",
    description: "Start by selecting the type of piece you want - chair, table, cabinet, or sculpture. Each has unique customization options.",
    icon: "🪑"
  },
  {
    title: "Select Materials",
    description: "Choose from premium wood types and finishes. See how different combinations affect both appearance and price.",
    icon: "🌳"
  },
  {
    title: "Add Design Elements",
    description: "Explore our carving pattern library and add custom engraving to make your piece truly unique.",
    icon: "🎨"
  },
  {
    title: "Fine-tune Options",
    description: "Adjust dimensions, quantity, and delivery options. Watch the 3D model and price update in real-time.",
    icon: "⚙️"
  },
  {
    title: "Save & Share",
    description: "Save your favorite designs and share them with others. Your configurations are stored locally for future reference.",
    icon: "💾"
  }
];

interface ConfiguratorTutorialProps {
  onComplete: () => void;
}

export default function ConfiguratorTutorial({ onComplete }: ConfiguratorTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('woodcarving_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    localStorage.setItem('woodcarving_tutorial_seen', 'true');
    setShowTutorial(false);
    onComplete();
  };
  const restartTutorial = () => {
    setCurrentStep(0);
    setShowTutorial(true);
  };

  return (
    <>
      {/* Tutorial trigger button for returning users */}
      {!showTutorial && (
        <motion.button
          onClick={restartTutorial}
          className="fixed bottom-6 right-6 bg-accent-primary text-white p-3 rounded-full shadow-lg hover:bg-accent-primary/90 transition-colors z-40 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <span className="text-lg">💡</span>
          <span className="hidden sm:inline text-sm font-medium">Tutorial</span>
        </motion.button>
      )}

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl"
            >
              {/* Progress Indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-accent-primary'
                          : index < currentStep
                          ? 'bg-accent-primary/50'
                          : 'bg-foreground/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center mb-8"
              >
                <div className="text-6xl mb-4">
                  {tutorialSteps[currentStep].icon}
                </div>
                <h2 className="text-2xl font-serif font-bold text-accent-primary mb-4">
                  {tutorialSteps[currentStep].title}
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {tutorialSteps[currentStep].description}
                </p>
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={skipTutorial}
                    className="px-4 py-2 text-foreground/60 hover:text-foreground transition-colors"
                  >
                    Skip Tutorial
                  </button>
                  {currentStep > 0 && (
                    <motion.button
                      onClick={prevStep}
                      className="px-4 py-2 text-accent-primary hover:text-accent-primary/80 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Previous
                    </motion.button>
                  )}
                </div>

                <div className="flex gap-3 items-center">
                  <span className="text-sm text-foreground/60">
                    {currentStep + 1} of {tutorialSteps.length}
                  </span>
                  <motion.button
                    onClick={nextStep}
                    className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                  </motion.button>
                </div>
              </div>

              {/* Additional Features Notice */}
              {currentStep === tutorialSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-4 bg-accent-primary/10 rounded-lg border border-accent-primary/20"
                >
                  <h4 className="font-semibold text-accent-primary mb-2">
                    🚀 Premium Features Available
                  </h4>
                  <div className="text-sm text-foreground/70 grid grid-cols-2 gap-2">
                    <div>• Export 3D models</div>
                    <div>• Professional consultations</div>
                    <div>• CAD file downloads</div>
                    <div>• Progress tracking</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
