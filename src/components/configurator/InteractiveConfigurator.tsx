'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Plane } from '@react-three/drei';
import * as THREE from 'three';
import ConfigurationManager from './ConfigurationManager';

// Enhanced wood texture mappings with realistic properties
const woodTextures = {
  walnut: { 
    color: '#4A3728',
    secondaryColor: '#6B4E3D', 
    roughness: 0.7, 
    metalness: 0.05, 
    price: 150, 
    density: 0.65,
    description: 'Rich, dark grain with elegant chocolate tones',
    hardness: 'Hard',
    grain: 'Prominent',
    normalIntensity: 0.8,
    bumpScale: 0.3
  },
  oak: { 
    color: '#8B6914',
    secondaryColor: '#BDA072', 
    roughness: 0.8, 
    metalness: 0.02, 
    price: 120, 
    density: 0.75,
    description: 'Classic strength with prominent grain patterns',
    hardness: 'Very Hard',
    grain: 'Bold',
    normalIntensity: 1.0,
    bumpScale: 0.4
  },
  cherry: { 
    color: '#8B4513',
    secondaryColor: '#CD853F', 
    roughness: 0.6, 
    metalness: 0.08, 
    price: 130, 
    density: 0.58,
    description: 'Warm reddish hue that deepens with age',
    hardness: 'Medium',
    grain: 'Fine',
    normalIntensity: 0.6,
    bumpScale: 0.2
  },
  maple: { 
    color: '#DEB887',
    secondaryColor: '#F5DEB3', 
    roughness: 0.75, 
    metalness: 0.02, 
    price: 110, 
    density: 0.63,
    description: 'Light, clean grain with subtle elegance',
    hardness: 'Hard',
    grain: 'Subtle',
    normalIntensity: 0.4,
    bumpScale: 0.15
  },
  mahogany: { 
    color: '#8B0000',
    secondaryColor: '#CD5C5C', 
    roughness: 0.55, 
    metalness: 0.1, 
    price: 160, 
    density: 0.55,
    description: 'Luxurious reddish-brown with fine grain',
    hardness: 'Medium',
    grain: 'Fine',
    normalIntensity: 0.7,
    bumpScale: 0.25
  },
};

// Procedural wood texture generator
function generateWoodTexture(woodType: keyof typeof woodTextures): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  const wood = woodTextures[woodType];
  
  // Create wood grain pattern
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, wood.color);
  gradient.addColorStop(0.3, wood.secondaryColor);
  gradient.addColorStop(0.7, wood.color);
  gradient.addColorStop(1, wood.secondaryColor);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add wood grain lines
  ctx.strokeStyle = wood.color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;
  
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const y = (i / 20) * canvas.height;
    const variation = Math.sin(y * 0.02) * 20 + Math.random() * 10;
    ctx.moveTo(0, y + variation);
    
    for (let x = 0; x < canvas.width; x += 10) {
      const waveY = y + Math.sin(x * 0.01 + i) * 5 + Math.random() * 3;
      ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }
  
  // Add fine grain details
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    const y = Math.random() * canvas.height;
    const x1 = Math.random() * canvas.width;
    const x2 = x1 + Math.random() * 100 - 50;
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y + Math.random() * 4 - 2);
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  
  return texture;
}

// Finish properties with enhanced attributes
const finishProperties = {
  natural: { 
    roughness: 0.9, 
    metalness: 0.05, 
    price: 0, 
    durability: 'Medium',
    description: 'Enhances grain while maintaining natural feel',
    sheen: 'None',
    clearcoat: 0
  },
  satin: { 
    roughness: 0.3, 
    metalness: 0.1, 
    price: 25, 
    durability: 'High',
    description: 'Smooth, low-gloss protection with subtle sheen',
    sheen: 'Low',
    clearcoat: 0
  },
  gloss: { 
    roughness: 0.1, 
    metalness: 0.2, 
    clearcoat: 1.0, 
    price: 35, 
    durability: 'Very High',
    description: 'Mirror-like finish for modern elegance',
    sheen: 'High'
  },
  matte: { 
    roughness: 1.0, 
    metalness: 0.0, 
    price: 20, 
    durability: 'Medium',
    description: 'No-gloss protection with raw wood appearance',
    sheen: 'None',
    clearcoat: 0
  },
};

// Generate displacement map for carving patterns
function generateCarvingDisplacementMap(
  pattern: keyof typeof carvingPatterns, 
  depth: number, 
  detail: number,
  customImage?: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Base displacement (neutral gray)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (pattern === 'none') return new THREE.CanvasTexture(canvas);
  
  const depthScale = depth / 10;
  const detailScale = detail / 10;
  
  if (customImage) {
    // Use custom uploaded pattern
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // Convert to grayscale for displacement
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const displacement = 128 + (gray - 128) * depthScale;
        data[i] = data[i + 1] = data[i + 2] = displacement;
      }
      ctx.putImageData(imageData, 0, 0);
    };
    img.src = customImage;
  } else {
    // Generate procedural patterns based on type
    ctx.globalCompositeOperation = 'multiply';
    
    switch (pattern) {
      case 'geometric':
        for (let i = 0; i < 8 * detailScale; i++) {
          for (let j = 0; j < 8 * detailScale; j++) {
            const x = (i / (8 * detailScale)) * canvas.width;
            const y = (j / (8 * detailScale)) * canvas.height;
            const size = 20 + depthScale * 30;
            
            ctx.fillStyle = `rgba(${255 - depthScale * 100}, ${255 - depthScale * 100}, ${255 - depthScale * 100}, 0.8)`;
            ctx.fillRect(x - size/2, y - size/2, size, size);
          }
        }
        break;
        
      case 'floral':
        for (let i = 0; i < 15 * detailScale; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = 15 + depthScale * 25;
          
          ctx.beginPath();
          for (let petal = 0; petal < 5; petal++) {
            const angle = (petal / 5) * Math.PI * 2;
            const petalX = x + Math.cos(angle) * radius;
            const petalY = y + Math.sin(angle) * radius;
            ctx.arc(petalX, petalY, radius * 0.6, 0, Math.PI * 2);
          }
          ctx.fillStyle = `rgba(${200 - depthScale * 80}, ${200 - depthScale * 80}, ${200 - depthScale * 80}, 0.7)`;
          ctx.fill();
        }
        break;
        
      case 'celtic':
        // Celtic knot pattern
        ctx.strokeStyle = `rgba(${180 - depthScale * 60}, ${180 - depthScale * 60}, ${180 - depthScale * 60}, 0.9)`;
        ctx.lineWidth = 8 + depthScale * 12;
        
        for (let i = 0; i < 6 * detailScale; i++) {
          ctx.beginPath();
          const centerX = (i % 3) * (canvas.width / 3) + canvas.width / 6;
          const centerY = Math.floor(i / 3) * (canvas.height / 2) + canvas.height / 4;
          const radius = 40 + depthScale * 20;
          
          // Draw interlocking circles
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.arc(centerX + radius, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
        
      case 'relief':
        // Relief carving with raised areas
        const gradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, canvas.width/2
        );
        gradient.addColorStop(0, `rgba(${255 - depthScale * 127}, ${255 - depthScale * 127}, ${255 - depthScale * 127}, 1)`);
        gradient.addColorStop(1, `rgba(${128 + depthScale * 64}, ${128 + depthScale * 64}, ${128 + depthScale * 64}, 1)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'acanthus':
        // Acanthus leaf pattern
        for (let i = 0; i < 4 * detailScale; i++) {
          const x = (i % 2) * canvas.width/2 + canvas.width/4;
          const y = Math.floor(i / 2) * canvas.height/2 + canvas.height/4;
          
          ctx.beginPath();
          ctx.moveTo(x, y - 40);
          ctx.quadraticCurveTo(x + 30, y - 20, x + 20, y + 20);
          ctx.quadraticCurveTo(x + 10, y + 40, x - 10, y + 30);
          ctx.quadraticCurveTo(x - 30, y + 10, x - 20, y - 20);
          ctx.closePath();
          
          ctx.fillStyle = `rgba(${200 - depthScale * 70}, ${200 - depthScale * 70}, ${200 - depthScale * 70}, 0.8)`;
          ctx.fill();
        }
        break;
        
      default:
        // Default pattern
        for (let i = 0; i < 10 * detailScale; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = 10 + depthScale * 20;
          
          ctx.fillStyle = `rgba(${220 - depthScale * 40}, ${220 - depthScale * 40}, ${220 - depthScale * 40}, 0.6)`;
          ctx.fillRect(x - size/2, y - size/2, size, size);
        }
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  
  return texture;
}

// Generate normal map for wood grain
function generateNormalMap(woodType: keyof typeof woodTextures): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Get wood-specific properties
  const woodProps = woodTextures[woodType];
  const baseIntensity = woodProps.roughness * 255;
  
  // Create base normal map (neutral)
  ctx.fillStyle = '#8080FF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add grain bumps based on wood type
  ctx.globalCompositeOperation = 'overlay';
  
  for (let i = 0; i < 30; i++) {
    const gradient = ctx.createLinearGradient(0, i * 17, 0, (i + 1) * 17);
    gradient.addColorStop(0, `rgb(${Math.floor(baseIntensity * 0.7)}, ${Math.floor(baseIntensity * 0.7)}, ${Math.floor(192 + baseIntensity * 0.3)})`);
    gradient.addColorStop(0.5, '#8080FF');
    gradient.addColorStop(1, `rgb(${Math.floor(160 + baseIntensity * 0.4)}, ${Math.floor(160 + baseIntensity * 0.4)}, 255)`);
      ctx.fillStyle = gradient;
    ctx.fillRect(0, i * 17, canvas.width, 17);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  
  return texture;
}

// Carving techniques with specific characteristics
const carvingTechniques = {
  none: { name: 'No Carving', complexity: 1, priceMultiplier: 1.0, description: 'Clean, unadorned surface', timeAdd: 0 },
  relief: { name: 'Relief Carving', complexity: 4, priceMultiplier: 1.8, description: 'Raised patterns that stand out from the surface', timeAdd: 25 },
  incised: { name: 'Incised Carving', complexity: 2, priceMultiplier: 1.3, description: 'Cut lines and grooves into the wood surface', timeAdd: 15 },
  chip: { name: 'Chip Carving', complexity: 3, priceMultiplier: 1.5, description: 'Small triangular chips removed to create patterns', timeAdd: 20 },
  pierced: { name: 'Pierced Carving', complexity: 5, priceMultiplier: 2.2, description: 'Openwork carving with holes cut through', timeAdd: 35 },
  sculptural: { name: 'Sculptural', complexity: 6, priceMultiplier: 2.8, description: 'Three-dimensional sculptural elements', timeAdd: 50 }
};

// Carving styles with cultural and artistic influences
const carvingStyles = {
  none: { name: 'Plain', priceMultiplier: 1.0, description: 'No decorative style applied' },
  classical: { name: 'Classical', priceMultiplier: 1.4, description: 'Greek and Roman inspired motifs' },
  celtic: { name: 'Celtic', priceMultiplier: 1.6, description: 'Interwoven knots and spiral patterns' },
  gothic: { name: 'Gothic', priceMultiplier: 1.7, description: 'Medieval architectural elements' },
  art_nouveau: { name: 'Art Nouveau', priceMultiplier: 1.5, description: 'Flowing organic forms and nature motifs' },
  arts_crafts: { name: 'Arts & Crafts', priceMultiplier: 1.3, description: 'Simple, honest craftsmanship aesthetic' },
  modern: { name: 'Modern', priceMultiplier: 1.2, description: 'Clean lines and geometric forms' },
  traditional: { name: 'Traditional', priceMultiplier: 1.4, description: 'Classic woodworking patterns' },
  custom: { name: 'Custom Style', priceMultiplier: 2.0, description: 'Unique style designed for your vision' }
};

const carvingPatterns = {
  none: { name: 'Plain', complexity: 1, priceMultiplier: 1.0, description: 'Clean, unadorned surface', timeAdd: 0 },
  geometric: { name: 'Geometric', complexity: 2, priceMultiplier: 1.3, description: 'Precise geometric patterns and shapes', timeAdd: 10 },
  floral: { name: 'Floral', complexity: 3, priceMultiplier: 1.6, description: 'Organic flower and leaf motifs', timeAdd: 20 },
  celtic: { name: 'Celtic Knots', complexity: 4, priceMultiplier: 1.8, description: 'Intricate interwoven Celtic designs', timeAdd: 25 },
  relief: { name: 'Relief Carving', complexity: 5, priceMultiplier: 2.2, description: 'Three-dimensional sculptural elements', timeAdd: 35 },
  acanthus: { name: 'Acanthus Leaves', complexity: 4, priceMultiplier: 1.9, description: 'Classical acanthus leaf patterns', timeAdd: 30 },
  rosette: { name: 'Rosettes', complexity: 3, priceMultiplier: 1.5, description: 'Circular flower-like patterns', timeAdd: 18 },
  vine: { name: 'Vine Scrolls', complexity: 4, priceMultiplier: 1.7, description: 'Flowing vine and tendril motifs', timeAdd: 25 },
  heraldic: { name: 'Heraldic', complexity: 5, priceMultiplier: 2.1, description: 'Coats of arms and heraldic symbols', timeAdd: 32 },
  custom: { name: 'Custom Pattern', complexity: 5, priceMultiplier: 2.5, description: 'Bespoke pattern created for you', timeAdd: 40 }
};

const productTypes = {
  chair: { 
    name: 'Dining Chair', 
    basePrice: 800, 
    baseHours: 40, 
    dimensions: { width: 1.2, height: 2.0, depth: 1.0 },
    minDimensions: { width: 0.8, height: 1.5, depth: 0.8 },
    maxDimensions: { width: 1.8, height: 2.5, depth: 1.5 },
    category: 'furniture'
  },
  table: { 
    name: 'Coffee Table', 
    basePrice: 1200, 
    baseHours: 60, 
    dimensions: { width: 2.0, height: 0.8, depth: 1.2 },
    minDimensions: { width: 1.2, height: 0.6, depth: 0.8 },
    maxDimensions: { width: 3.0, height: 1.2, depth: 2.0 },
    category: 'furniture'
  },
  cabinet: { 
    name: 'Storage Cabinet', 
    basePrice: 1800, 
    baseHours: 80, 
    dimensions: { width: 1.5, height: 2.2, depth: 0.8 },
    minDimensions: { width: 1.0, height: 1.5, depth: 0.6 },
    maxDimensions: { width: 2.5, height: 3.0, depth: 1.2 },
    category: 'furniture'
  },
  sculpture: { 
    name: 'Art Sculpture', 
    basePrice: 2500, 
    baseHours: 100, 
    dimensions: { width: 1.0, height: 1.5, depth: 1.0 },
    minDimensions: { width: 0.5, height: 0.8, depth: 0.5 },
    maxDimensions: { width: 2.0, height: 3.0, depth: 2.0 },
    category: 'sculpture'
  },
  reliefPanel: {
    name: 'Relief Panel',
    basePrice: 1500,
    baseHours: 70,
    dimensions: { width: 1.5, height: 1.0, depth: 0.1 },
    minDimensions: { width: 0.8, height: 0.6, depth: 0.05 },
    maxDimensions: { width: 3.0, height: 2.0, depth: 0.3 },
    category: 'decorative'
  },
  carvedBox: {
    name: 'Carved Box',
    basePrice: 600,
    baseHours: 35,
    dimensions: { width: 0.4, height: 0.2, depth: 0.3 },
    minDimensions: { width: 0.2, height: 0.1, depth: 0.2 },
    maxDimensions: { width: 0.8, height: 0.4, depth: 0.6 },
    category: 'functional'
  },
  mantelpiece: {
    name: 'Mantelpiece',
    basePrice: 2200,
    baseHours: 90,
    dimensions: { width: 2.5, height: 0.3, depth: 0.4 },
    minDimensions: { width: 1.5, height: 0.2, depth: 0.3 },
    maxDimensions: { width: 4.0, height: 0.5, depth: 0.8 },
    category: 'architectural'
  },
  bowl: {
    name: 'Carved Bowl',
    basePrice: 450,
    baseHours: 25,
    dimensions: { width: 0.4, height: 0.15, depth: 0.4 },
    minDimensions: { width: 0.2, height: 0.08, depth: 0.2 },
    maxDimensions: { width: 0.8, height: 0.3, depth: 0.8 },
    category: 'functional'
  }
};

interface ConfiguratorState {
  productType: keyof typeof productTypes;
  woodType: keyof typeof woodTextures;
  finishType: keyof typeof finishProperties;
  carvingTechnique: keyof typeof carvingTechniques;
  carvingStyle: keyof typeof carvingStyles;
  pattern: keyof typeof carvingPatterns;
  carvingDepth: number; // 0-10 scale
  carvingDetail: number; // 0-10 scale
  dimensions: { width: number; height: number; depth: number };
  quantity: number;
  customText: string;
  customPatternFile: File | null;
  customPatternPreview: string | null;
  rushOrder: boolean;
}

interface ConfiguratorProps {
  onConfigChange?: (config: ConfiguratorState, price: number) => void;
}

// 3D Model Component with realistic materials and carving support
function ConfigurableModel({ config }: { config: ConfiguratorState }) {
  const groupRef = React.useRef<THREE.Group>(null);
  
  // Generate textures for current wood type and carving
  const woodTexture = useMemo(() => generateWoodTexture(config.woodType), [config.woodType]);
  const normalMap = useMemo(() => generateNormalMap(config.woodType), [config.woodType]);
  const displacementMap = useMemo(() => 
    generateCarvingDisplacementMap(
      config.pattern, 
      config.carvingDepth, 
      config.carvingDetail,
      config.customPatternPreview || undefined
    ), 
    [config.pattern, config.carvingDepth, config.carvingDetail, config.customPatternPreview]
  );
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
    }
  });

  const woodProps = woodTextures[config.woodType];
  const finishProps = finishProperties[config.finishType];
  const dims = config.dimensions;
  const createMaterial = (allowCarving = true) => {
    // Create a realistic wood material with carving support
    const material = new THREE.MeshPhysicalMaterial({
      map: woodTexture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(woodProps.normalIntensity, woodProps.normalIntensity),
      color: new THREE.Color(woodProps.color),
      roughness: finishProps.roughness,
      metalness: finishProps.metalness,
      clearcoat: finishProps.clearcoat || 0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.2,
      // Add subsurface scattering effect for more realism
      transmission: 0.02,
      thickness: 0.1,
      ior: 1.4,
      // Enhanced material properties
      reflectivity: finishProps.clearcoat ? 0.8 : 0.3,
      transparent: false,
      opacity: 1.0,
    });
    
    // Add carving effects if applicable and technique is not 'none'
    if (allowCarving && config.carvingTechnique !== 'none' && config.pattern !== 'none') {
      material.displacementMap = displacementMap;
      material.displacementScale = config.carvingDepth * 0.05; // Scale based on depth setting
      
      // Adjust material properties based on carving technique
      const technique = carvingTechniques[config.carvingTechnique];
      material.roughness += technique.complexity * 0.02; // More complex carvings are slightly rougher
    }
    
    return material;
  };  const renderProduct = () => {
    const woodMaterial = createMaterial();
    const structuralMaterial = createMaterial(false); // No carving on structural elements
    
    switch (config.productType) {
      case 'chair':
        return (
          <>
            {/* Seat */}
            <mesh position={[0, -0.3, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[dims.width, 0.12, dims.depth]} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.2, -dims.depth * 0.45]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[dims.width, dims.height * 0.5, 0.08]} />
            </mesh>
            {/* Legs */}
            {[-0.5, 0.5].map((x) =>
              [-0.4, 0.4].map((z) => (
                <mesh key={`leg-${x}-${z}`} position={[x * dims.width, -0.7, z * dims.depth]} castShadow receiveShadow material={structuralMaterial}>
                  <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
                </mesh>
              ))
            )}
            {/* Support rails for chair */}
            <mesh position={[0, -0.9, -dims.depth * 0.3]} castShadow receiveShadow material={structuralMaterial}>
              <boxGeometry args={[dims.width * 0.8, 0.04, 0.04]} />
            </mesh>
          </>
        );
        
      case 'table':
        return (
          <>
            {/* Table top */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[dims.width, 0.1, dims.depth]} />
            </mesh>
            {/* Table apron for more realistic look */}
            <mesh position={[dims.width * 0.4, -0.2, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[0.05, 0.3, dims.depth * 0.8]} />
            </mesh>
            <mesh position={[-dims.width * 0.4, -0.2, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[0.05, 0.3, dims.depth * 0.8]} />
            </mesh>
            {/* Legs */}
            {[-0.8, 0.8].map((x) =>
              [-0.4, 0.4].map((z) => (
                <mesh key={`leg-${x}-${z}`} position={[x * dims.width * 0.4, -dims.height * 0.5, z * dims.depth * 0.4]} castShadow receiveShadow material={structuralMaterial}>
                  <cylinderGeometry args={[0.06, 0.06, dims.height, 8]} />
                </mesh>
              ))
            )}
          </>
        );
        
      case 'cabinet':
        return (
          <>
            {/* Main body */}
            <mesh position={[0, 0, 0]} material={woodMaterial}>
              <boxGeometry args={[dims.width, dims.height, dims.depth]} />
            </mesh>
            {/* Doors */}
            <mesh position={[dims.width * 0.26, 0, dims.depth * 0.51]} material={woodMaterial}>
              <boxGeometry args={[dims.width * 0.48, dims.height * 0.8, 0.02]} />
            </mesh>
            <mesh position={[-dims.width * 0.26, 0, dims.depth * 0.51]} material={woodMaterial}>
              <boxGeometry args={[dims.width * 0.48, dims.height * 0.8, 0.02]} />
            </mesh>
          </>
        );
        
      case 'reliefPanel':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[dims.width, dims.height, dims.depth]} />
          </mesh>
        );
        
      case 'carvedBox':
        return (
          <>
            {/* Box body */}
            <mesh position={[0, -dims.height * 0.25, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[dims.width, dims.height * 0.5, dims.depth]} />
            </mesh>
            {/* Box lid */}
            <mesh position={[0, dims.height * 0.25, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[dims.width * 0.95, dims.height * 0.1, dims.depth * 0.95]} />
            </mesh>
          </>
        );
        
      case 'mantelpiece':
        return (
          <>
            {/* Main mantel shelf */}
            <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[dims.width, dims.height, dims.depth]} />
            </mesh>
            {/* Decorative brackets */}
            <mesh position={[dims.width * 0.3, -dims.height * 0.8, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[0.1, dims.height * 0.6, dims.depth * 0.8]} />
            </mesh>
            <mesh position={[-dims.width * 0.3, -dims.height * 0.8, 0]} castShadow receiveShadow material={woodMaterial}>
              <boxGeometry args={[0.1, dims.height * 0.6, dims.depth * 0.8]} />
            </mesh>
          </>
        );
        
      case 'bowl':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodMaterial}>
            <sphereGeometry args={[dims.width * 0.5, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          </mesh>
        );
        
      case 'sculpture':
      default:
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodMaterial}>
            <dodecahedronGeometry args={[dims.width * 0.5]} />
          </mesh>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {renderProduct()}
      
      {config.pattern !== 'none' && (
        <Text
          position={[0, dims.height * 0.6, 0]}
          fontSize={0.08}
          color="#8B4513"
          anchorX="center"
          anchorY="middle"
        >
          {carvingPatterns[config.pattern].name}
        </Text>
      )}
      
      {config.customText && (
        <Text
          position={[0, -dims.height * 0.6, 0]}
          fontSize={0.06}
          color="#654321"
          anchorX="center"
          anchorY="middle"
        >
          {config.customText}
        </Text>
      )}
      
      <ContactShadows
        position={[0, -dims.height * 0.6, 0]}
        opacity={0.4}
        scale={Math.max(dims.width, dims.depth) * 2}
        blur={2}
        far={1}
      />
    </group>
  );
}

export default function InteractiveConfigurator({ onConfigChange }: ConfiguratorProps) {
  const [config, setConfig] = useState<ConfiguratorState>({
    productType: 'chair',
    woodType: 'walnut',
    finishType: 'natural',
    carvingTechnique: 'none',
    carvingStyle: 'none',
    pattern: 'none',
    carvingDepth: 3,
    carvingDetail: 5,
    dimensions: productTypes.chair.dimensions,
    quantity: 1,
    customText: '',
    customPatternFile: null,
    customPatternPreview: null,
    rushOrder: false,
  });

  const [activeTab, setActiveTab] = useState<'product' | 'materials' | 'design' | 'options'>('product');
  // Price calculation with enhanced carving factors
  const calculatePrice = useCallback((currentConfig: ConfiguratorState) => {
    const product = productTypes[currentConfig.productType];
    const wood = woodTextures[currentConfig.woodType];
    const finish = finishProperties[currentConfig.finishType];
    const technique = carvingTechniques[currentConfig.carvingTechnique];
    const style = carvingStyles[currentConfig.carvingStyle];
    const pattern = carvingPatterns[currentConfig.pattern];

    // Calculate surface area for material costs
    const surfaceArea = (currentConfig.dimensions.width * currentConfig.dimensions.height) + 
                       (currentConfig.dimensions.width * currentConfig.dimensions.depth) + 
                       (currentConfig.dimensions.height * currentConfig.dimensions.depth);

    const basePrice = product.basePrice;
    const materialCost = wood.price * surfaceArea;
    const finishCost = finish.price * surfaceArea;
    
    // Enhanced carving cost calculation
    let carvingCost = 0;
    if (currentConfig.carvingTechnique !== 'none') {
      const baseCarvingCost = basePrice * (technique.priceMultiplier - 1);
      const styleCost = basePrice * (style.priceMultiplier - 1);
      const patternCost = basePrice * (pattern.priceMultiplier - 1);
      
      // Depth and detail multipliers
      const depthMultiplier = 1 + (currentConfig.carvingDepth / 10) * 0.5;
      const detailMultiplier = 1 + (currentConfig.carvingDetail / 10) * 0.3;
      
      // Custom pattern adds significant cost
      const customPatternCost = currentConfig.customPatternFile ? basePrice * 0.8 : 0;
      
      carvingCost = (baseCarvingCost + styleCost + patternCost + customPatternCost) * 
                    depthMultiplier * detailMultiplier;
    }
    
    const rushOrderCost = currentConfig.rushOrder ? basePrice * 0.5 : 0;

    const subtotal = (basePrice + materialCost + finishCost + carvingCost + rushOrderCost) * currentConfig.quantity;
    
    // Volume discount for multiple pieces
    let discount = 0;
    if (currentConfig.quantity >= 5) {
      discount = subtotal * 0.1; // 10% discount for 5+ pieces
    } else if (currentConfig.quantity >= 3) {
      discount = subtotal * 0.05; // 5% discount for 3+ pieces
    }
    
    return Math.round(subtotal - discount);
  }, []);  const updateConfig = useCallback((updates: Partial<ConfiguratorState>) => {
    const newConfig = { ...config, ...updates };
    
    // Reset dimensions when product type changes
    if (updates.productType && updates.productType !== config.productType) {
      newConfig.dimensions = productTypes[updates.productType].dimensions;
    }
    
    // Reset carving settings when technique changes to 'none'
    if (updates.carvingTechnique === 'none') {
      newConfig.carvingStyle = 'none';
      newConfig.pattern = 'none';
      newConfig.carvingDepth = 0;
      newConfig.carvingDetail = 0;
      newConfig.customPatternFile = null;
      newConfig.customPatternPreview = null;
    }
    
    setConfig(newConfig);
    
    const price = calculatePrice(newConfig);
    onConfigChange?.(newConfig, price);
  }, [config, calculatePrice, onConfigChange]);

  // Handle custom pattern file upload
  const handleCustomPatternUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        updateConfig({
          customPatternFile: file,
          customPatternPreview: preview,
          pattern: 'custom'
        });
      };
      reader.readAsDataURL(file);
    }
  }, [updateConfig]);

  const loadConfig = useCallback((newConfig: ConfiguratorState) => {
    setConfig(newConfig);
    const price = calculatePrice(newConfig);
    onConfigChange?.(newConfig, price);
  }, [calculatePrice, onConfigChange]);

  const tabs = [
    { id: 'product', label: 'Product', icon: '🪑' },
    { id: 'materials', label: 'Materials', icon: '🌳' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'options', label: 'Options', icon: '⚙️' },
  ] as const;

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* 3D Viewer */}
      <div className="lg:col-span-2 bg-background rounded-2xl shadow-xl overflow-hidden">
        <div className="h-[500px] md:h-[600px] relative">          <Canvas 
            camera={{ position: [0, 0, 3], fov: 50 }}
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            shadows
          >
            {/* Enhanced lighting setup for realistic wood rendering */}
            <ambientLight intensity={0.3} color="#f4f1eb" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              color="#fff8dc"
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              shadow-bias={-0.0001}
            />
            {/* Key light for wood grain definition */}
            <directionalLight
              position={[-5, 8, 3]}
              intensity={0.8}
              color="#ffd700"
            />
            {/* Fill light to soften shadows */}
            <pointLight 
              position={[-10, -5, -10]} 
              intensity={0.4} 
              color="#87ceeb" 
            />
            {/* Rim light for edge definition */}
            <pointLight 
              position={[5, -8, 5]} 
              intensity={0.6} 
              color="#ffe4b5" 
            />            
            {/* Enhanced environment for realistic reflections */}
            <Environment preset="warehouse" />
              {/* Workshop floor plane */}
            <Plane
              args={[10, 10]}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -2, 0]}
              receiveShadow
            >
              <meshPhysicalMaterial color="#8B7355" roughness={0.9} metalness={0.0} />
            </Plane>
            
            <ConfigurableModel config={config} />
            
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              autoRotate={false}
              maxPolarAngle={Math.PI / 2}
              minDistance={2}
              maxDistance={5}            />
          </Canvas>
          
          {/* Mobile Controls Hint */}
          <div className="absolute bottom-2 left-2 lg:hidden bg-black/50 text-white text-xs px-2 py-1 rounded">
            Pinch to zoom • Drag to rotate
          </div>
        </div>
          {/* 3D Viewer Info */}
        <div className="p-4 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-serif font-semibold text-accent-primary">
                {productTypes[config.productType].name}
              </h3>
              <p className="text-sm text-foreground/70">
                {woodTextures[config.woodType].description}
              </p>
            </div>
            <div className="text-right">              <div className="text-2xl font-bold text-accent-primary">
                ${calculatePrice(config).toLocaleString()}
              </div>
              <div className="text-sm text-foreground/70">
                Est. {productTypes[config.productType].baseHours + 
                      carvingTechniques[config.carvingTechnique].timeAdd + 
                      carvingPatterns[config.pattern].timeAdd + 
                      (config.carvingDepth * 2) + (config.carvingDetail * 1.5)} hours
              </div>
            </div>
          </div>
          
          {/* Configuration Management */}
          <ConfigurationManager
            currentConfig={config}
            currentPrice={calculatePrice(config)}
            onLoadConfig={loadConfig}
          />
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-background rounded-2xl shadow-xl overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-foreground/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 p-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-accent-primary bg-accent-primary/10 border-b-2 border-accent-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 h-[480px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Product Tab */}
            {activeTab === 'product' && (
              <motion.div
                key="product"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >                <h3 className="font-serif font-semibold text-accent-primary mb-4">Product Type</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(productTypes).map(([key, product]) => (
                    <motion.button
                      key={key}
                      onClick={() => updateConfig({ productType: key as keyof typeof productTypes })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        config.productType === key
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-foreground/20 hover:border-accent-primary/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-foreground/50 capitalize mt-1">
                            {product.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-accent-primary">
                            From ${product.basePrice}
                          </div>
                          <div className="text-xs text-foreground/70">
                            {product.baseHours}h base
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Dimensions */}
                <div className="mt-6">
                  <h4 className="font-medium text-foreground mb-3">Dimensions</h4>
                  <div className="space-y-3">
                    {(['width', 'height', 'depth'] as const).map((dim) => {
                      const product = productTypes[config.productType];
                      return (
                        <div key={dim} className="flex items-center gap-3">
                          <label className="text-sm font-medium text-foreground/80 w-16">
                            {dim.charAt(0).toUpperCase() + dim.slice(1)}:
                          </label>
                          <input
                            type="range"
                            min={product.minDimensions[dim]}
                            max={product.maxDimensions[dim]}
                            step={0.1}
                            value={config.dimensions[dim]}
                            onChange={(e) => updateConfig({
                              dimensions: {
                                ...config.dimensions,
                                [dim]: parseFloat(e.target.value)
                              }
                            })}
                            className="flex-1"
                          />
                          <span className="text-sm font-mono w-12 text-right">
                            {config.dimensions[dim].toFixed(1)}m
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Wood Selection */}
                <div>
                  <h3 className="font-serif font-semibold text-accent-primary mb-4">Wood Type</h3>
                  <div className="space-y-2">
                    {Object.entries(woodTextures).map(([key, wood]) => (
                      <motion.button
                        key={key}
                        onClick={() => updateConfig({ woodType: key as keyof typeof woodTextures })}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          config.woodType === key
                            ? 'border-accent-primary bg-accent-primary/10'
                            : 'border-foreground/20 hover:border-accent-primary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                            <div className="text-xs text-foreground/70 mt-1">{wood.description}</div>
                          </div>
                          <div className="text-sm font-bold text-accent-primary">
                            ${wood.price}/ft²
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Finish Selection */}
                <div>
                  <h3 className="font-serif font-semibold text-accent-primary mb-4">Finish</h3>
                  <div className="space-y-2">
                    {Object.entries(finishProperties).map(([key, finish]) => (
                      <motion.button
                        key={key}
                        onClick={() => updateConfig({ finishType: key as keyof typeof finishProperties })}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          config.finishType === key
                            ? 'border-accent-primary bg-accent-primary/10'
                            : 'border-foreground/20 hover:border-accent-primary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{finish.description.split('.')[0]}</div>
                            <div className="text-xs text-foreground/70 mt-1">
                              {finish.durability} durability • {finish.sheen} sheen
                            </div>
                          </div>
                          <div className="text-sm font-bold text-accent-primary">
                            +${finish.price}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}            {/* Design Tab */}
            {activeTab === 'design' && (
              <motion.div
                key="design"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Carving Technique */}
                <div>
                  <h3 className="font-serif font-semibold text-accent-primary mb-4">Carving Technique</h3>
                  <div className="space-y-2">
                    {Object.entries(carvingTechniques).map(([key, technique]) => (
                      <motion.button
                        key={key}
                        onClick={() => updateConfig({ carvingTechnique: key as keyof typeof carvingTechniques })}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          config.carvingTechnique === key
                            ? 'border-accent-primary bg-accent-primary/10'
                            : 'border-foreground/20 hover:border-accent-primary/50'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{technique.name}</div>
                            <div className="text-xs text-foreground/70 mt-1">{technique.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-accent-primary">
                              +{((technique.priceMultiplier - 1) * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs text-foreground/70">
                              +{technique.timeAdd}h
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Carving Style - only show if technique is not 'none' */}
                {config.carvingTechnique !== 'none' && (
                  <div>
                    <h3 className="font-serif font-semibold text-accent-primary mb-4">Carving Style</h3>
                    <div className="space-y-2">
                      {Object.entries(carvingStyles).map(([key, style]) => (
                        <motion.button
                          key={key}
                          onClick={() => updateConfig({ carvingStyle: key as keyof typeof carvingStyles })}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                            config.carvingStyle === key
                              ? 'border-accent-primary bg-accent-primary/10'
                              : 'border-foreground/20 hover:border-accent-primary/50'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{style.name}</div>
                              <div className="text-xs text-foreground/70 mt-1">{style.description}</div>
                            </div>
                            <div className="text-sm font-bold text-accent-primary">
                              +{((style.priceMultiplier - 1) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Carving Patterns - only show if technique is not 'none' */}
                {config.carvingTechnique !== 'none' && (
                  <div>
                    <h3 className="font-serif font-semibold text-accent-primary mb-4">Carving Pattern</h3>
                    <div className="space-y-2">
                      {Object.entries(carvingPatterns).map(([key, pattern]) => (
                        <motion.button
                          key={key}
                          onClick={() => updateConfig({ pattern: key as keyof typeof carvingPatterns })}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                            config.pattern === key
                              ? 'border-accent-primary bg-accent-primary/10'
                              : 'border-foreground/20 hover:border-accent-primary/50'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{pattern.name}</div>
                              <div className="text-xs text-foreground/70 mt-1">{pattern.description}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-accent-primary">
                                +{((pattern.priceMultiplier - 1) * 100).toFixed(0)}%
                              </div>
                              <div className="text-xs text-foreground/70">
                                +{pattern.timeAdd}h
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Pattern Upload - only show if pattern is 'custom' */}
                {config.pattern === 'custom' && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Custom Pattern Upload</h4>
                    <div className="border-2 border-dashed border-foreground/30 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCustomPatternUpload(file);
                        }}
                        className="hidden"
                        id="pattern-upload"
                      />
                      <label
                        htmlFor="pattern-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <div className="text-2xl">📁</div>
                        <div className="text-sm font-medium text-foreground">
                          {config.customPatternFile ? config.customPatternFile.name : 'Upload Pattern Image'}
                        </div>
                        <div className="text-xs text-foreground/60">
                          PNG, JPG, or SVG up to 5MB
                        </div>
                      </label>
                    </div>
                      {config.customPatternPreview && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-foreground mb-2">Pattern Preview:</div>
                        <div className="w-full h-32 bg-foreground/5 rounded-lg overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={config.customPatternPreview}
                            alt="Custom pattern preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Carving Depth & Detail - only show if technique is not 'none' */}
                {config.carvingTechnique !== 'none' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Carving Depth</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground/70 w-12">Light</span>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={1}
                          value={config.carvingDepth}
                          onChange={(e) => updateConfig({ carvingDepth: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm text-foreground/70 w-12">Deep</span>
                        <span className="text-sm font-mono w-8 text-right">
                          {config.carvingDepth}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Detail Level</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground/70 w-12">Simple</span>
                        <input
                          type="range"
                          min={0}
                          max={10}
                          step={1}
                          value={config.carvingDetail}
                          onChange={(e) => updateConfig({ carvingDetail: parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm text-foreground/70 w-12">Intricate</span>
                        <span className="text-sm font-mono w-8 text-right">
                          {config.carvingDetail}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Text */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Custom Engraving</h4>
                  <input
                    type="text"
                    placeholder="Add custom text or initials"
                    value={config.customText}
                    onChange={(e) => updateConfig({ customText: e.target.value })}
                    className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                    maxLength={50}
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Up to 50 characters. Additional cost may apply for complex engravings.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Options Tab */}
            {activeTab === 'options' && (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Quantity */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Quantity</h4>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateConfig({ quantity: Math.max(1, config.quantity - 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-foreground/20 hover:border-accent-primary flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold px-4">{config.quantity}</span>
                    <button
                      onClick={() => updateConfig({ quantity: Math.min(10, config.quantity + 1) })}
                      className="w-10 h-10 rounded-lg border-2 border-foreground/20 hover:border-accent-primary flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-foreground/60 mt-2">
                    Bulk discounts available for orders of 5+ pieces
                  </p>
                </div>

                {/* Rush Order */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.rushOrder}
                      onChange={(e) => updateConfig({ rushOrder: e.target.checked })}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-foreground">Rush Order (+50%)</div>
                      <div className="text-sm text-foreground/70">
                        Priority production for delivery in 2-3 weeks instead of standard 6-8 weeks
                      </div>
                    </div>
                  </label>
                </div>                {/* Price Breakdown */}
                <div className="bg-foreground/5 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-accent-primary mb-3">Price Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base price ({productTypes[config.productType].name})</span>
                      <span>${productTypes[config.productType].basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wood & finish</span>
                      <span>${Math.round((woodTextures[config.woodType].price + finishProperties[config.finishType].price) * 
                        ((config.dimensions.width * config.dimensions.height) + 
                         (config.dimensions.width * config.dimensions.depth) + 
                         (config.dimensions.height * config.dimensions.depth)))}</span>
                    </div>
                    {config.carvingTechnique !== 'none' && (
                      <>
                        <div className="flex justify-between">
                          <span>Carving technique</span>
                          <span>+{((carvingTechniques[config.carvingTechnique].priceMultiplier - 1) * 100).toFixed(0)}%</span>
                        </div>
                        {config.carvingStyle !== 'none' && (
                          <div className="flex justify-between">
                            <span>Carving style</span>
                            <span>+{((carvingStyles[config.carvingStyle].priceMultiplier - 1) * 100).toFixed(0)}%</span>
                          </div>
                        )}
                        {config.pattern !== 'none' && (
                          <div className="flex justify-between">
                            <span>Carving pattern</span>
                            <span>+{((carvingPatterns[config.pattern].priceMultiplier - 1) * 100).toFixed(0)}%</span>
                          </div>
                        )}
                        {config.carvingDepth > 0 && (
                          <div className="flex justify-between">
                            <span>Carving depth (Level {config.carvingDepth})</span>
                            <span>+{(config.carvingDepth * 5).toFixed(0)}%</span>
                          </div>
                        )}
                        {config.carvingDetail > 0 && (
                          <div className="flex justify-between">
                            <span>Detail level (Level {config.carvingDetail})</span>
                            <span>+{(config.carvingDetail * 3).toFixed(0)}%</span>
                          </div>
                        )}
                        {config.customPatternFile && (
                          <div className="flex justify-between">
                            <span>Custom pattern</span>
                            <span>+80%</span>
                          </div>
                        )}
                      </>
                    )}
                    {config.rushOrder && (
                      <div className="flex justify-between">
                        <span>Rush order</span>
                        <span>+50%</span>
                      </div>
                    )}
                    {config.quantity > 1 && (
                      <>
                        <div className="flex justify-between">
                          <span>Quantity</span>
                          <span>×{config.quantity}</span>
                        </div>
                        {config.quantity >= 5 && (
                          <div className="flex justify-between text-green-600">
                            <span>Bulk discount (5+ pieces)</span>
                            <span>-10%</span>
                          </div>
                        )}
                        {config.quantity >= 3 && config.quantity < 5 && (
                          <div className="flex justify-between text-green-600">
                            <span>Bulk discount (3+ pieces)</span>
                            <span>-5%</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="border-t border-foreground/20 pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-accent-primary">${calculatePrice(config).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
