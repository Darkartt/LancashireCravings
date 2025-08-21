'use client';

import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ThreeBackgroundProps {
  sceneType: 'home' | 'about' | 'portfolio' | 'shop' | 'blog' | 'contact';
}

// Dynamic import of the heavy ThreeBackground component
const ThreeBackground = React.lazy(() => import('./ThreeBackground'));

export default function ThreeBackgroundWrapper({ sceneType }: ThreeBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -8 }}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-foreground/70">Loading 3D scene...</p>
          </div>
        </div>
      }>
        <ThreeBackground sceneType={sceneType} />
      </Suspense>
    </div>
  );
}
