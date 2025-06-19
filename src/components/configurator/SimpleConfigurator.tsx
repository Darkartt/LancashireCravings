'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ConfigurationState {
  woodType: string;
  productType: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  customizations: string[];
  estimatedPrice: number;
  estimatedTime: number;
}

interface SimpleConfiguratorProps {
  onConfigChange: (config: ConfigurationState) => void;
}

const SimpleConfigurator: React.FC<SimpleConfiguratorProps> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<ConfigurationState>({
    woodType: 'walnut',
    productType: 'chair',
    dimensions: { width: 50, height: 80, depth: 50 },
    customizations: [],
    estimatedPrice: 800,
    estimatedTime: 4
  });

  const woodTypes = [
    { id: 'walnut', name: 'Walnut', price: 150 },
    { id: 'oak', name: 'Oak', price: 120 },
    { id: 'cherry', name: 'Cherry', price: 130 },
    { id: 'maple', name: 'Maple', price: 110 }
  ];

  const productTypes = [
    { id: 'chair', name: 'Dining Chair', basePrice: 800 },
    { id: 'table', name: 'Coffee Table', basePrice: 1200 },
    { id: 'cabinet', name: 'Storage Cabinet', basePrice: 1800 },
    { id: 'sculpture', name: 'Art Sculpture', basePrice: 2500 }
  ];

  const handleConfigUpdate = (updates: Partial<ConfigurationState>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="w-full bg-foreground/5 rounded-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h3 className="text-2xl font-bold text-foreground mb-4">Configure Your Piece</h3>
        
        {/* Wood Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Wood Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {woodTypes.map((wood) => (
              <motion.button
                key={wood.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg border transition-colors ${
                  config.woodType === wood.id
                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                    : 'border-foreground/20 hover:border-accent-primary/50'
                }`}
                onClick={() => handleConfigUpdate({ woodType: wood.id })}
              >
                <div className="font-medium">{wood.name}</div>
                <div className="text-sm opacity-70">£{wood.price}/sqft</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productTypes.map((product) => (
              <motion.button
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  config.productType === product.id
                    ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                    : 'border-foreground/20 hover:border-accent-primary/50'
                }`}
                onClick={() => handleConfigUpdate({ productType: product.id })}
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-sm opacity-70">From £{product.basePrice}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-foreground/70 mb-1">Width</label>
              <input
                type="number"
                value={config.dimensions.width}
                onChange={(e) => handleConfigUpdate({
                  dimensions: { ...config.dimensions, width: parseInt(e.target.value) || 0 }
                })}
                className="w-full p-2 border border-foreground/20 rounded bg-background/50 focus:border-accent-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/70 mb-1">Height</label>
              <input
                type="number"
                value={config.dimensions.height}
                onChange={(e) => handleConfigUpdate({
                  dimensions: { ...config.dimensions, height: parseInt(e.target.value) || 0 }
                })}
                className="w-full p-2 border border-foreground/20 rounded bg-background/50 focus:border-accent-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-foreground/70 mb-1">Depth</label>
              <input
                type="number"
                value={config.dimensions.depth}
                onChange={(e) => handleConfigUpdate({
                  dimensions: { ...config.dimensions, depth: parseInt(e.target.value) || 0 }
                })}
                className="w-full p-2 border border-foreground/20 rounded bg-background/50 focus:border-accent-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Preview and Summary */}
        <motion.div
          className="bg-accent-primary/10 rounded-lg p-4 border border-accent-primary/20"
          layout
        >
          <h4 className="font-semibold text-foreground mb-2">Configuration Summary</h4>
          <div className="space-y-1 text-sm">
            <div>Wood: <span className="font-medium text-accent-primary">{woodTypes.find(w => w.id === config.woodType)?.name}</span></div>
            <div>Product: <span className="font-medium text-accent-primary">{productTypes.find(p => p.id === config.productType)?.name}</span></div>
            <div>Size: <span className="font-medium text-accent-primary">{config.dimensions.width} × {config.dimensions.height} × {config.dimensions.depth} cm</span></div>
            <div className="pt-2 border-t border-accent-primary/20">
              <div>Estimated Price: <span className="font-bold text-accent-primary">£{config.estimatedPrice}</span></div>
              <div>Estimated Time: <span className="font-medium text-accent-primary">{config.estimatedTime} weeks</span></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SimpleConfigurator;
