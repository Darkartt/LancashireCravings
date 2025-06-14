'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HomeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after initial mount
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    if (!isClient || !mountRef.current) {
      // Don't run if not client-side or mountRef is not yet available
      return () => {
        // No-op cleanup if ctx was never initialized
      };
    }

    const currentMount = mountRef.current;

    let ctx: ReturnType<typeof gsap.context> | undefined; // Reverted to let and undefined initialization
    ctx = gsap.context(() => {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      currentMount.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(0, 0, 10);
      scene.add(pointLight);

      // Wood texture and material
      const textureLoader = new THREE.TextureLoader();
      const geometry = new THREE.PlaneGeometry(20, 12, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        opacity: 0.9,
        transparent: true,
        roughness: 0.8,
        metalness: 0.1,
        color: 0x5C4033, // Default color if texture fails
      });

      textureLoader.load(
        '/walnut_grain.jpg',
        (texture) => {
          material.map = texture;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          material.needsUpdate = true;
        },
        undefined,
        (errorEvent: unknown) => {
          console.warn(
            `Failed to load wood texture at /walnut_grain.jpg. Displaying fallback color. Please ensure the image exists in the public folder. Error:`, 
            errorEvent
          );
        }
      );
      
      const backgroundMesh = new THREE.Mesh(geometry, material);
      scene.add(backgroundMesh);
      camera.position.z = 5;

      // Ensure document.body is available before creating ScrollTrigger
      if (document.body) {
        ScrollTrigger.create({
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: self => {
            backgroundMesh.rotation.y = self.progress * Math.PI * 0.25;
          }
        });
      } else {
        console.warn("HomeBackground: document.body not available for ScrollTrigger. Retrying on load.");
        // Fallback if body is not immediately available
        window.addEventListener('load', () => {
          if (document.body) {
            ScrollTrigger.create({
              trigger: "body",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              onUpdate: self => {
                backgroundMesh.rotation.y = self.progress * Math.PI * 0.25;
              }
            });
            ScrollTrigger.refresh();
          }
        }, { once: true });
      }

      const handleMouseMove = (event: MouseEvent) => {
        mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        pointLight.position.x = mousePosition.current.x * 10;
        pointLight.position.y = mousePosition.current.y * 10;
      };
      window.addEventListener('mousemove', handleMouseMove);

      let frameId: number;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (material.map && material.map.wrapS === THREE.RepeatWrapping) {
          material.map.offset.x += 0.0005;
          material.map.offset.y += 0.0003;
        }
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (currentMount) {
          camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
          ScrollTrigger.refresh(); 
        }
      };
      window.addEventListener('resize', handleResize);
      
      console.log("HomeBackground: Initializing animations and ScrollTrigger");

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("HomeBackground: ScrollTrigger refreshed after 300ms");
      }, 300);

      // Additional refresh after a longer delay to ensure content is loaded
      const refreshTimeout2 = setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("HomeBackground: ScrollTrigger refreshed after 1000ms");
      }, 1000);

      // Refresh on window load to catch any late-loading content
      const handleWindowLoad = () => {
        ScrollTrigger.refresh();
        console.log("HomeBackground: ScrollTrigger refreshed on window load");
      };
      window.addEventListener('load', handleWindowLoad);

      // Cleanup for non-GSAP resources managed by this context
      if (ctx) {
        ctx.add(() => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('mousemove', handleMouseMove);
          if (frameId) {
            cancelAnimationFrame(frameId);
          }
          // Check if renderer.domElement is still a child before removing
          if (currentMount && renderer.domElement.parentNode === currentMount) {
              currentMount.removeChild(renderer.domElement);
          }
          renderer.dispose();
          geometry.dispose();
          material.dispose();
          if (material.map) material.map.dispose();
          clearTimeout(refreshTimeout);
          clearTimeout(refreshTimeout2);
          window.removeEventListener('load', handleWindowLoad); // Ensure this is removed
        });
      }

    }, currentMount); // Scope the context to currentMount

    return () => {
      if (ctx) {
        ctx.revert(); // Cleanup GSAP animations and ScrollTriggers
      }
    };
  }, [isClient]); // Re-run effect if isClient changes (though it only changes once)

  if (!isClient) {
    // Render nothing or a simple placeholder on the server and during initial client render
    return null; 
  }

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }} />;
};

export default HomeBackground;
