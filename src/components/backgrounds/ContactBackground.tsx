'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ContactBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log("ContactBackground: Initializing canvas animation for wood dust particles");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    console.log(`ContactBackground: Canvas initialized with width=${width}, height=${height}`);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = [];
    const numParticles = 150; // Increased for more noticeable effect
    const woodDustColors = ['#A0522D', '#8B4513', '#D2B48C', '#DEB887']; // Sienna, SaddleBrown, Tan, BurlyWood

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3, // Slow horizontal movement
        vy: Math.random() * -0.5 - 0.2, // Slow upward movement (negative vy)
        radius: Math.random() * 1.5 + 0.5, // Small particles
        alpha: Math.random() * 0.3 + 0.1, // Very subtle
      });
    }

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Assign a color from the palette based on index or randomly
        ctx.fillStyle = woodDustColors[i % woodDustColors.length] + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        // Reset particle if it goes off screen (top)
        if (p.y + p.radius < 0) {
          p.y = height + p.radius;
          p.x = Math.random() * width;
        }
        // Wrap around horizontally
        if (p.x + p.radius < 0) p.x = width + p.radius;
        if (p.x - p.radius > width) p.x = -p.radius;
      });
    };

    const animation = gsap.ticker.add(draw);

    const handleResize = () => {
      if (canvasRef.current) {
        width = window.innerWidth;
        height = window.innerHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        console.log(`ContactBackground: Canvas resized to width=${width}, height=${height}`);
        // Re-initialize particle positions if needed, or let them adjust
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', // Use fixed to ensure it stays in the background
        top: 0,
        left: 0,
        width: '100vw', // Use viewport width for full coverage
        height: '100vh', // Use viewport height for full coverage
        zIndex: 1,
        pointerEvents: 'none', // Ensure it doesn't interfere with interactions
        overflow: 'hidden' // Prevent any overflow issues
      }}
    />
  );
};

export default ContactBackground;
