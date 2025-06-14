'use client';

import React, { useEffect, useRef, useState } from 'react'; // Added useState
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProductGalleryBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !backgroundRef.current) return;

    // Variables for refresh timeouts and event handler
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;
    let refreshTimeout2: ReturnType<typeof setTimeout> | undefined;
    const handleWindowLoad = () => {
      ScrollTrigger.refresh();
      console.log("ProductGalleryBackground: ScrollTrigger refreshed on window load");
    };

    const ctx = gsap.context(() => {
      console.log("ProductGalleryBackground: Initializing ScrollTrigger animations for parallax effect");
      const colors = ['#6A5A4F', '#7B6B5F', '#8C7C6F', '#9D8D7F', '#AE9E8F', '#BFADA0']; // Wood-like shades
      const speeds = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85]; // Varying scroll speeds for parallax

      layersRef.current.forEach((layer, index) => {
        if (layer) {
          gsap.to(layer, {
            yPercent: -100 * speeds[index], // Move layer up as user scrolls down
            ease: 'none',
          scrollTrigger: {
            trigger: backgroundRef.current, // Trigger based on the background container
            start: 'top 80%', // Start earlier, when top of trigger is 80% down the viewport
            end: 'bottom 20%', // End later, when bottom of trigger is 20% down the viewport
            scrub: true,
          },
          });
        }
      });

      // Refresh ScrollTrigger after a short delay to ensure DOM is ready
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("ProductGalleryBackground: ScrollTrigger refreshed after 300ms");
      }, 300);

      // Additional refresh after a longer delay
      refreshTimeout2 = setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("ProductGalleryBackground: ScrollTrigger refreshed after 1000ms");
      }, 1000);

      // Refresh on window load
      window.addEventListener('load', handleWindowLoad);
    }, backgroundRef.current); // Scope context to backgroundRef

    // Cleanup
    return () => {
      ctx.revert(); // GSAP context cleanup
      if (refreshTimeout) clearTimeout(refreshTimeout);
      if (refreshTimeout2) clearTimeout(refreshTimeout2);
      window.removeEventListener('load', handleWindowLoad);
    };
  }, [isClient]); // Depend on isClient

  if (!isClient) {
    return null; // Or a placeholder
  }

  return (
    <div 
      ref={backgroundRef} 
      className="absolute inset-0 overflow-hidden z-1" // zIndex 1 to ensure visibility
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          ref={el => { if (el) layersRef.current[index] = el; }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '200%', // Taller to allow for parallax movement
            top: '-50%', // Start higher to cover initial view and allow upward movement
            left: 0,
            backgroundColor: ['#6A5A4F', '#7B6B5F', '#8C7C6F', '#9D8D7F', '#AE9E8F', '#BFADA0'][index],
            // Opacity can be adjusted per layer if needed, e.g., layers farther back are more transparent
            // opacity: 1 - (index * 0.1), 
            zIndex: - (6 - index) // Ensure layers stack correctly
          }}
        />
      ))}
    </div>
  );
};

export default ProductGalleryBackground;
