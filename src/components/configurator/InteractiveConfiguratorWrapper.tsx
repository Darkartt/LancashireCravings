'use client';

import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ConfiguratorState {
  productType: string;
  woodType: string;
  finishType: string;
  carvingTechnique: string;
  carvingStyle: string;
  pattern: string;
  carvingDepth: number;
  carvingDetail: number;
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

// Dynamic import of the heavy InteractiveConfigurator component
const InteractiveConfigurator = React.lazy(() => import('./InteractiveConfigurator'));

export default function InteractiveConfiguratorWrapper({ onConfigChange }: ConfiguratorProps) {
  return (
    <div className="w-full h-full">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-foreground/70">Loading 3D Configurator...</p>
          </div>
        </div>
      }>
        <InteractiveConfigurator onConfigChange={onConfigChange} />
      </Suspense>
    </div>
  );
}
