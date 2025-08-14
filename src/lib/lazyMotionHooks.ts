// Lazy adapters for common framer-motion hooks to avoid static import cost
import { useEffect, useState } from 'react';
import { loadMotion } from './lazyMotion';

export function useLazyScroll() {
  const [mod, setMod] = useState<any>(null);
  useEffect(() => { loadMotion().then(m => setMod(m)); }, []);
  if (mod?.useScroll) return mod.useScroll();
  // Fallback shim
  return { scrollY: { get: () => 0, onChange: () => () => {}, current: 0 } } as any;
}

export function useLazyTransform(value: any, input: any, output: any) {
  const [fn, setFn] = useState<any>(null);
  useEffect(() => { loadMotion().then(m => setFn(() => m.useTransform)); }, []);
  return fn ? fn(value, input, output) : value;
}

export function useLazyInView(ref: React.RefObject<Element>, options?: any) {
  const [hook, setHook] = useState<any>(null);
  useEffect(() => { loadMotion().then(m => setHook(() => m.useInView)); }, []);
  return hook ? hook(ref, options) : false;
}
