import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

interface ThreeBackgroundProps {
  sceneType: 'home' | 'about' | 'portfolio' | 'shop' | 'blog' | 'contact';
}

const ThreeBackground = ({ sceneType }: ThreeBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current; // Capture ref value
    if (!isClient || !currentMount || typeof window === 'undefined' || typeof document === 'undefined') return; // Added typeof document check

    console.log(`ThreeBackground: Initializing scene for ${sceneType}`);
    if (sceneType === 'blog') {
      console.log("Blog scene: Setting up rotating scroll animation.");
      console.log("Blog scene: Component mounted, checking renderer and DOM element.");
      if (currentMount) { // Use currentMount
        console.log("Blog scene: Mount ref is available, appending renderer DOM element.");
      } else {
        console.error("Blog scene: Mount ref is not available, rendering may fail.");
      }
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneType === 'blog' ? 0x3c2f1a : 0x2c2416); // Slightly lighter for blog to contrast

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 6); // Adjusted camera position for better centering and view

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); // Enabled antialiasing and high performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.innerHTML = ''; // Clear any existing content
    currentMount.appendChild(renderer.domElement);

    // Add OrbitControls for interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    if (sceneType === 'home') {
      controls.minPolarAngle = Math.PI / 3; // Allow more vertical rotation
      controls.maxPolarAngle = Math.PI * 2 / 3;
      controls.minAzimuthAngle = -Math.PI / 3; // Allow more horizontal rotation
      controls.maxAzimuthAngle = Math.PI / 3;
    } else {
      controls.enableRotate = false;
    }

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xe8e4da, 0.8); // Slightly brighter ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Brighter directional light
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true; // Enable shadows
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffa500, 1.5, 30); // Warmer point light
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);
    
    renderer.shadowMap.enabled = true; // Enable shadow mapping in the renderer

    // Scene-specific content
    let animateFunction: () => void;
    const clock = new THREE.Clock(); // Clock for time-based animations

    switch (sceneType) {
      case 'home':
        // Ultra-detailed owl carving animation with intricate stages for master craftsmanship
        // Procedural wood texture
        const createWoodTexture = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const context = canvas.getContext('2d');
          if (!context) return new THREE.Texture();

          // Base wood color
          context.fillStyle = '#8B4513'; // Saddle Brown
          context.fillRect(0, 0, 512, 512);

          // Wood grain
          for (let i = 0; i < 300; i++) {
            const x1 = Math.random() * 512;
            const y1 = Math.random() * 512;
            const x2 = x1 + (Math.random() - 0.5) * 100;
            const y2 = y1 + (Math.random() - 0.5) * 100;
            const lightness = Math.floor(Math.random() * 30) + 40; // Darker grain
            context.strokeStyle = `hsl(30, 40%, ${lightness}%)`;
            context.lineWidth = Math.random() * 2 + 0.5;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
          }
          return new THREE.CanvasTexture(canvas);
        };
        
        const oakTexture = createWoodTexture();
        oakTexture.wrapS = THREE.RepeatWrapping;
        oakTexture.wrapT = THREE.RepeatWrapping;
        oakTexture.repeat.set(1, 1);


        const roughWoodMaterial = new THREE.MeshStandardMaterial({
          map: oakTexture,
          color: 0x8B4513, // Saddle brown
          roughness: 0.9,
          metalness: 0.1,
          side: THREE.DoubleSide,
        });
        const detailedWoodMaterial = new THREE.MeshStandardMaterial({
          map: oakTexture,
          color: 0x8B4513,
          roughness: 0.6,
          metalness: 0.2,
          side: THREE.DoubleSide,
        });
        // Removed polishedWoodMaterial as it's unused

        const owlGroup = new THREE.Group();
        scene.add(owlGroup);

        // Stage 0: Rough Block
        const blockGeometry = new THREE.BoxGeometry(2, 2.5, 1.5);
        const block = new THREE.Mesh(blockGeometry, roughWoodMaterial);
        block.castShadow = true;
        block.receiveShadow = true;
        owlGroup.add(block);

        // Owl parts (initially small and hidden, then grow and refine)
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.01, 32, 32), detailedWoodMaterial);
        head.position.set(0, 0.9, 0);
        head.castShadow = true;
        owlGroup.add(head);

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.01, 32), detailedWoodMaterial);
        body.position.set(0, -0.1, 0);
        body.castShadow = true;
        owlGroup.add(body);

        const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), detailedWoodMaterial);
        leftWing.position.set(-0.5, 0.2, 0);
        leftWing.castShadow = true;
        owlGroup.add(leftWing);

        const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), detailedWoodMaterial);
        rightWing.position.set(0.5, 0.2, 0);
        rightWing.castShadow = true;
        owlGroup.add(rightWing);
        
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.01, 0.01, 8), detailedWoodMaterial);
        beak.position.set(0, 0.9, 0.4);
        beak.rotation.x = Math.PI /2;
        beak.castShadow = true;
        owlGroup.add(beak);

        const tailFeathersGroup = new THREE.Group();
        owlGroup.add(tailFeathersGroup);
        for(let i=0; i<5; i++){
          const feather = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), detailedWoodMaterial);
          feather.position.set((i-2)*0.1, -0.8, -0.2);
          feather.rotation.x = -Math.PI/4;
          feather.castShadow = true;
          tailFeathersGroup.add(feather);
        }


        const animationTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });

        // Stage 0: Rough block visible
        animationTimeline.to(block.scale, { x: 1, y: 1, z: 1, duration: 0.1 }, 0);

        // Stage 1: Head carving
        animationTimeline.to(head.scale, { x: 100, y: 100, z: 100, duration: 2, ease: "power2.inOut" }, 1);
        animationTimeline.to(block.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 2, ease: "power2.inOut" }, 1);
        
        // Stage 2: Body carving
        animationTimeline.to(body.scale, { x: 100, y: 100, z: 100, duration: 2, ease: "power2.inOut" }, 2.5);
        animationTimeline.to(block.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 2, ease: "power2.inOut" }, 2.5);
        animationTimeline.to(head.material, { roughness: 0.5, duration: 1 }, 3.5);

        // Stage 3: Wing carving
        animationTimeline.to(leftWing.scale, { x: 100, y: 100, z: 100, duration: 1.5, ease: "power2.inOut" }, 4);
        animationTimeline.to(leftWing.rotation, { z: Math.PI / 5, duration: 1.5, ease: "power2.inOut" }, 4);
        animationTimeline.to(rightWing.scale, { x: 100, y: 100, z: 100, duration: 1.5, ease: "power2.inOut" }, 4);
        animationTimeline.to(rightWing.rotation, { z: -Math.PI / 5, duration: 1.5, ease: "power2.inOut" }, 4);
        animationTimeline.to(body.material, { roughness: 0.4, duration: 1 }, 5);
        
        // Stage 4: Beak carving
        animationTimeline.to(beak.scale, { x: 100, y: 100, z: 100, duration: 1, ease: "power2.inOut" }, 5.5);
        
        // Stage 5: Tail feathers carving
        tailFeathersGroup.children.forEach((feather, index) => {
          animationTimeline.to(feather.scale, { x: 100, y: 100, z: 100, duration: 1, ease: "power2.inOut" }, 6 + index * 0.2);
        });

        // Stage 6: Polishing
        animationTimeline.to([head.material, body.material, leftWing.material, rightWing.material, beak.material], { roughness: 0.2, metalness: 0.5, duration: 2, ease: "power2.inOut" }, 8);
        tailFeathersGroup.children.forEach(feather => {
          if (feather instanceof THREE.Mesh) {
            animationTimeline.to(feather.material, { roughness: 0.2, metalness: 0.5, duration: 2, ease: "power2.inOut" }, 8);
          }
        });
        
        // Final rotation
        animationTimeline.to(owlGroup.rotation, { y: Math.PI * 2, duration: 10, ease: "none" }, 0);


        animateFunction = () => {
          const delta = clock.getDelta();
          animationTimeline.time(animationTimeline.time() + delta); // Manually advance timeline
          controls.update();
          renderer.render(scene, camera);
        };
        break;
      // Other cases remain the same as before
      case 'about':
        const toolGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
        const toolMaterial = new THREE.MeshPhongMaterial({ color: 0x808080, shininess: 80 });
        const tool = new THREE.Mesh(toolGeometry, toolMaterial);
        scene.add(tool);
        animateFunction = () => { tool.rotation.z += 0.0025; renderer.render(scene, camera); };
        break;
      case 'portfolio':
        const itemGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.5);
        const itemMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513, shininess: 60 });
        const item = new THREE.Mesh(itemGeometry, itemMaterial);
        scene.add(item);
        animateFunction = () => { 
          item.rotation.y += 0.02; // Increased rotation speed for visibility
          renderer.render(scene, camera); 
          console.log("Portfolio scene: Animation frame rendered, item rotation updated.");
        };
        break;
      case 'shop':
        const shelfGeometry = new THREE.BoxGeometry(3, 0.2, 0.5);
        const shelfMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513, shininess: 60 });
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        scene.add(shelf);
        animateFunction = () => { shelf.position.y = Math.sin(Date.now() * 0.0005) * 0.05; renderer.render(scene, camera); };
        break;
      case 'blog':
        const scrollGeometry = new THREE.CylinderGeometry(2.0, 2.0, 5, 16); // Significantly larger size for visibility
        const scrollMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513, shininess: 80, emissive: 0x4a2c0d, emissiveIntensity: 0.3 });
        const scroll = new THREE.Mesh(scrollGeometry, scrollMaterial);
        scroll.position.set(0, 0, 2); // Bring closer to camera
        scene.add(scroll);
        animateFunction = () => { 
          scroll.rotation.x += 0.02; // Faster rotation for noticeable effect
          scroll.rotation.y += 0.01; // Add rotation on another axis for dynamic movement
          renderer.render(scene, camera); 
          console.log("Blog scene: Scroll rotation updated, animation frame rendered.");
        };
        break;
      case 'contact':
        const signGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const signMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513, shininess: 60 });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        scene.add(sign);
        animateFunction = () => { sign.position.y = Math.sin(Date.now() * 0.0005) * 0.025; renderer.render(scene, camera); };
        break;
      default:
        animateFunction = () => { renderer.render(scene, camera); };
    }

    // Animation loop with visibility check
    let isVisible = true;
    const animate = () => {
      if (isVisible) {
        requestAnimationFrame(animate);
        animateFunction();
      }
    };
    animate();

    // Ensure animation continues even after page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        isVisible = true;
        if (currentMount && !currentMount.querySelector('canvas')) { // Use currentMount
          currentMount.innerHTML = '';
          currentMount.appendChild(renderer.domElement);
        }
        animate();
      } else {
        isVisible = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (currentMount) { // Use currentMount for consistency
        currentMount.innerHTML = '';
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [sceneType, isClient]); // Added isClient to dependency array

  if (!isClient) {
    return null;
  }

  return (
    <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -10, width: '100%', height: '100vh', overflow: 'hidden', pointerEvents: 'none', background: 'transparent', isolation: 'isolate' }} />
  );
};

export default ThreeBackground;
