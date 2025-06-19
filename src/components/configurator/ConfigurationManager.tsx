'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfiguratorState {
  productType: 'chair' | 'table' | 'cabinet' | 'sculpture' | 'reliefPanel' | 'carvedBox' | 'mantelpiece' | 'bowl';
  woodType: 'walnut' | 'oak' | 'cherry' | 'maple' | 'mahogany';
  finishType: 'natural' | 'satin' | 'gloss' | 'matte';
  carvingTechnique: 'none' | 'relief' | 'incised' | 'chip' | 'pierced' | 'sculptural';
  carvingStyle: 'none' | 'classical' | 'celtic' | 'gothic' | 'art_nouveau' | 'arts_crafts' | 'modern' | 'traditional' | 'custom';
  pattern: 'none' | 'geometric' | 'floral' | 'celtic' | 'relief' | 'acanthus' | 'rosette' | 'vine' | 'heraldic' | 'custom';
  carvingDepth: number;
  carvingDetail: number;
  dimensions: { width: number; height: number; depth: number };
  quantity: number;
  customText: string;
  customPatternFile: File | null;
  customPatternPreview: string | null;
  rushOrder: boolean;
}

interface SavedConfiguration {
  id: string;
  name: string;
  config: ConfiguratorState;
  price: number;
  createdAt: string;
}

interface ConfigurationManagerProps {
  currentConfig: ConfiguratorState;
  currentPrice: number;
  onLoadConfig: (config: ConfiguratorState) => void;
}

export default function ConfigurationManager({ 
  currentConfig, 
  currentPrice, 
  onLoadConfig 
}: ConfigurationManagerProps) {
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [configName, setConfigName] = useState('');

  const saveConfiguration = useCallback(() => {
    if (!configName.trim()) return;

    const newConfig: SavedConfiguration = {
      id: Date.now().toString(),
      name: configName.trim(),
      config: currentConfig,
      price: currentPrice,
      createdAt: new Date().toISOString(),
    };

    setSavedConfigs(prev => [...prev, newConfig]);
    setConfigName('');
    setShowSaveDialog(false);

    // In a real app, you'd save this to localStorage or a backend
    localStorage.setItem('woodcarving_configs', JSON.stringify([...savedConfigs, newConfig]));
  }, [configName, currentConfig, currentPrice, savedConfigs]);

  const loadConfiguration = useCallback((config: SavedConfiguration) => {
    onLoadConfig(config.config);
    setShowLoadDialog(false);
  }, [onLoadConfig]);

  const deleteConfiguration = useCallback((id: string) => {
    setSavedConfigs(prev => prev.filter(c => c.id !== id));
    // Update localStorage
    const updatedConfigs = savedConfigs.filter(c => c.id !== id);
    localStorage.setItem('woodcarving_configs', JSON.stringify(updatedConfigs));
  }, [savedConfigs]);

  const shareConfiguration = useCallback(() => {
    const shareUrl = `${window.location.origin}/commission?config=${encodeURIComponent(JSON.stringify(currentConfig))}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Custom Woodcarving Design',
        text: `Check out my custom ${currentConfig.productType} design - ${currentPrice.toLocaleString()} estimated price`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Configuration link copied to clipboard!');
    }
  }, [currentConfig, currentPrice]);

  // Load saved configurations on component mount
  React.useEffect(() => {
    const saved = localStorage.getItem('woodcarving_configs');
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved configurations:', e);
      }
    }
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      {/* Save Configuration */}
      <motion.button
        onClick={() => setShowSaveDialog(true)}
        className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors font-medium flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>💾</span>
        Save Design
      </motion.button>

      {/* Load Configuration */}
      {savedConfigs.length > 0 && (
        <motion.button
          onClick={() => setShowLoadDialog(true)}
          className="px-4 py-2 bg-foreground/10 text-foreground rounded-lg hover:bg-foreground/20 transition-colors font-medium flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>📂</span>
          Load Design ({savedConfigs.length})
        </motion.button>
      )}

      {/* Share Configuration */}
      <motion.button
        onClick={shareConfiguration}
        className="px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors font-medium flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>🔗</span>
        Share Design
      </motion.button>

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-serif font-bold text-accent-primary mb-4">
                Save Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Configuration Name
                  </label>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="e.g., Living Room Chair Design"
                    className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                    autoFocus
                  />
                </div>
                <div className="bg-foreground/5 rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Product:</span>
                    <span className="font-medium capitalize">{currentConfig.productType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Wood:</span>
                    <span className="font-medium capitalize">{currentConfig.woodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Estimated Price:</span>
                    <span className="font-bold text-accent-primary">${currentPrice.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveConfiguration}
                    disabled={!configName.trim()}
                    className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load Dialog */}
      <AnimatePresence>
        {showLoadDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowLoadDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-serif font-bold text-accent-primary mb-4">
                Load Saved Configuration
              </h3>
              <div className="space-y-3">
                {savedConfigs.map((config) => (
                  <motion.div
                    key={config.id}
                    className="bg-foreground/5 rounded-lg p-4 hover:bg-foreground/10 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground">{config.name}</h4>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => loadConfiguration(config)}
                          className="px-3 py-1 bg-accent-primary text-white rounded text-sm hover:bg-accent-primary/90 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Load
                        </motion.button>
                        <motion.button
                          onClick={() => deleteConfiguration(config.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-foreground/70">
                      <div>
                        <span className="font-medium">Product:</span> {config.config.productType}
                      </div>
                      <div>
                        <span className="font-medium">Wood:</span> {config.config.woodType}
                      </div>
                      <div>
                        <span className="font-medium">Pattern:</span> {config.config.pattern}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> ${config.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs text-foreground/50 mt-2">
                      Saved: {new Date(config.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowLoadDialog(false)}
                  className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
