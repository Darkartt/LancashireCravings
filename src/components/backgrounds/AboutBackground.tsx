'use client';

import React, { useRef, useEffect, useState } from 'react'; // Added useState
import Lottie, { LottieRefCurrentProps } from 'lottie-react'; 
// Assuming the Lottie JSON file is in the public folder
import animationData from '../../../public/woodcarving-process.json';

const AboutBackground: React.FC = () => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && lottieRef.current) { // Ensure isClient is true
      lottieRef.current.setSpeed(0.8); // Set speed as per instructions
    }
  }, [isClient]); // Add isClient to dependency array

  // lottie-react takes props directly, not an options object for basic settings
  // The 'rendererSettings' prop is available for more advanced configurations if needed.
  // For 'preserveAspectRatio', it's usually handled by the Lottie component's sizing and the SVG content itself.
  // We can pass style to Lottie component for sizing.

  // The 'hover' attribute from <lottie-player> to pause/play on hover needs manual implementation
  // with onMouseEnter/onMouseLeave and state management (e.g., isPaused).
  // For now, we'll implement autoplay and loop as per instructions.
  // Speed is handled by lottieRef.

  if (!isClient) {
    // Render a placeholder or null on the server and initial client render
    // This div will match the dimensions of the actual component to avoid layout shifts.
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '70vh', 
          background: 'transparent', 
        }} 
      />
    );
  }

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '70vh', // As specified in the instructions
        overflow: 'hidden',
        position: 'relative', // Or 'absolute' depending on layout needs
        background: 'transparent', // As specified in the instructions for lottie-player
        zIndex: 1 // Increase to ensure visibility
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData} // Removed 'as any'
        loop={true}
        autoplay={true}
        style={{ height: '100%', width: '100%' }}
        // For hover interaction (play on hover, pause on leave):
        // const [isPaused, setIsPaused] = React.useState(true);
        // onMouseEnter={() => setIsPaused(false)}
        // onMouseLeave={() => setIsPaused(true)}
        // isPaused={isPaused} // This would require React.useState
      />
      {/* 
        The instructions mention:
        - Interactive timeline with scrub control
        - SVG toolpath visualizations synced to audio descriptions
        These are advanced features and would require significant additional implementation.
        This basic component only renders the Lottie animation.
      */}
    </div>
  );
};

export default AboutBackground;
