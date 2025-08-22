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

// Simple useInView implementation that doesn't violate Rules of Hooks
export function useLazyInView(ref: React.RefObject<Element>, options?: any) {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: options?.threshold || 0,
        rootMargin: options?.margin || '0px',
        root: options?.root || null,
      }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options?.threshold, options?.margin, options?.root]);
  
  return isInView;
}
