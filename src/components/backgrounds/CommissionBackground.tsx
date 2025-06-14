'use client';

import React, { Suspense, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei'; // Removed GLTFResult import
import * as THREE from 'three';

// Placeholder for texture loading, replace with actual texture paths
const placeholderTextures: { [key: string]: string } = {
  walnut: '/walnut_grain.jpg', // Assuming this exists from homepage
  oak: '/oak_grain.jpg', // Placeholder, create this image if needed
  cherry: '/cherry_grain.jpg', // Placeholder, create this image if needed
};

// Function to create a simple placeholder texture if actual image fails to load
const createPlaceholderTexture = (color = 0x8B4513) => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    context.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
};

interface ModelProps {
  woodType: string;
}

function Model({ woodType }: ModelProps) {
  // All hooks must be called unconditionally at the top level
  const gltf = useGLTF('/chair_model.glb') as any; // Reverted to 'as any'
  const { nodes } = gltf; // Destructure nodes here, after gltf is assigned
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null);
  // Removed errorLoading state declaration
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    setIsLoading(true);
    const texturePath = placeholderTextures[woodType];
    if (texturePath) {
      new THREE.TextureLoader().load(
        texturePath,
        (loadedTexture) => {
          loadedTexture.flipY = false; 
          loadedTexture.colorSpace = THREE.SRGBColorSpace; 
          loadedTexture.needsUpdate = true;
          setCurrentTexture(loadedTexture);
          setIsLoading(false);
        },
        undefined,
        (errEv) => {
          console.warn(
            `Failed to load texture for ${woodType}: ${texturePath}. Displaying fallback. Please ensure image exists. Error:`,
            errEv
          );
          setCurrentTexture(createPlaceholderTexture(woodType === 'walnut' ? 0x654321 : woodType === 'oak' ? 0xBDA072 : 0xA0522D));
          setIsLoading(false);
        }
      );
    } else {
      console.warn(`No texture path defined for wood type: ${woodType}. Displaying fallback.`);
      setCurrentTexture(createPlaceholderTexture(0xcccccc)); // Grey placeholder
      setIsLoading(false);
    }
  }, [woodType]);

  // Conditional returns must come after all hook calls
  if (!gltf || !nodes) {
    return (
      <Html center>
        <div style={{ color: 'red', background: 'white', padding: '10px', borderRadius: '5px' }}>
          Error: Unable to load 3D model. Please check the console for details.
        </div>
      </Html>
    );
  }

  // Attempt to find a mesh with geometry. This is a common pattern for simple GLTFs.
  // You might need to adjust this based on your actual GLTF structure.
  const chairMeshNode = Object.values(nodes).find(node => (node as THREE.Mesh).isMesh && (node as THREE.Mesh).geometry) as THREE.Mesh | undefined;

  if (!chairMeshNode) {
    return (
      <Html center>
        <div style={{ color: 'red', background: 'white', padding: '10px' }}>
          Error: Chair model mesh not found in GLTF.
        </div>
      </Html>
    );
  }
  
  if (isLoading) {
    return (
      <Html center>
        <div style={{ color: '#333', background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '5px' }}>
          Loading {woodType} texture...
        </div>
      </Html>
    );
  }
  
  // currentTexture will be the loaded texture or a placeholder from createPlaceholderTexture
  return (
    <mesh geometry={chairMeshNode.geometry}>
      <meshStandardMaterial
        map={currentTexture} // This will be the actual texture or a fallback color texture
        roughness={0.3}
        metalness={0.1}
        side={THREE.DoubleSide} // Render both sides, useful for planes or thin models
      />
    </mesh>
  );
}

const CommissionBackground: React.FC = () => {
  const [woodType, setWoodType] = useState('walnut'); // Default wood type
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Placeholder textures - these would ideally be preloaded or handled more robustly
  // For now, we're loading them inside the Model component.

  if (!isClient) {
    // Render a placeholder or null on the server and initial client render
    // This div will match the dimensions of the actual component to avoid layout shifts.
    return <div style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', background: '#e0e0e0', zIndex: 0 }} />;
  }

  return (
    <div style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', background: '#e0e0e0', zIndex: 1 }}>
      {/* Wood type selection UI (simple example) */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 100, background: 'white', padding: '10px', borderRadius: '5px' }}>
        <label htmlFor="wood-type-select">Wood Type: </label>
        <select
          id="wood-type-select"
          value={woodType}
          onChange={(e) => setWoodType(e.target.value)}
          style={{ padding: '5px' }}
        >
          {Object.keys(placeholderTextures).map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <Canvas camera={{ position: [0, 1, 2.5], fov: 50 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <Suspense fallback={
          <Html center>
            <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
              Loading 3D Model...
            </div>
          </Html>
        }>
          <Model woodType={woodType} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

// Preload GLTF model for better performance
useGLTF.preload('/chair_model.glb');
// Preload initial textures
Object.values(placeholderTextures).forEach(src => {
  if (src) new THREE.TextureLoader().load(src);
});


export default CommissionBackground;
