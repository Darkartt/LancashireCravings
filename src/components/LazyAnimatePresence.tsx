"use client";
import React, { ReactNode } from 'react';
import { useLazyMotion } from '@/lib/lazyMotion';

interface LazyAnimatePresenceProps {
  children: ReactNode;
  mode?: 'sync' | 'popLayout' | 'wait';
  initial?: boolean;
  onExitComplete?: () => void;
}

// Renders AnimatePresence only after framer-motion has loaded; otherwise just children (no exit animations yet)
export function LazyAnimatePresence({ children, ...rest }: LazyAnimatePresenceProps) {
  const { AnimatePresence } = useLazyMotion();
  if (!AnimatePresence) return <>{children}</>;
  return <AnimatePresence {...rest}>{children}</AnimatePresence>;
}

export default LazyAnimatePresence;
