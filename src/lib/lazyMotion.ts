// Centralized lazy loader for framer-motion to reduce initial shared bundle
// Usage: const { motion, AnimatePresence, ... } = await loadMotion()
// For components: switch `import { motion } from 'framer-motion'` to dynamic pattern

let motionModulePromise: Promise<any> | null = null;

export async function loadMotion() {
  if (!motionModulePromise) {
    motionModulePromise = import('framer-motion');
  }
  return motionModulePromise;
}

// Helper to get just motion without awaiting everywhere in user code (returns proxy that resolves at runtime)
// Recommended approach: in components convert to async effect usage or dynamic wrapper components.

// React hook convenience wrapper
// Usage: const { motion, ready, AnimatePresence } = useLazyMotion();
// Only access motion when ready === true to avoid undefined references.
import { useEffect, useState } from 'react';

export function useLazyMotion() {
  const [mod, setMod] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    if (!mod) {
      loadMotion().then(m => { if (mounted) setMod(m); });
    }
    return () => { mounted = false; };
  }, [mod]);
  return {
    motion: mod ? mod.motion : null,
    ready: !!mod,
    AnimatePresence: mod ? mod.AnimatePresence : null,
    // Expose other frequently used exports as needed
  };
}
