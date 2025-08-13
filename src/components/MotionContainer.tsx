"use client";
import React, { ReactNode } from 'react';
import { useLazyMotion } from '@/lib/lazyMotion';

interface MotionContainerProps {
  as?: keyof JSX.IntrinsicElements;
  children?: ReactNode;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  layout?: boolean;
  className?: string;
  variants?: any;
  style?: React.CSSProperties;
  [key: string]: any; // allow extra props
}

// Wraps children in a motion element when framer-motion is loaded; otherwise renders a plain element.
export function MotionDiv({ as = 'div', children, ...rest }: MotionContainerProps) {
  const { motion, ready } = useLazyMotion();
  const Element: any = as;
  if (ready && motion) {
    const MotionEl = (motion as any)[as] || (motion as any).div;
    return <MotionEl {...rest}>{children}</MotionEl>;
  }
  // Strip motion-only props for fallback
  // Omit motion-only props to avoid React DOM warnings (extract then ignore)
  const { initial, animate, exit, transition, whileHover, whileTap, layout, variants, ...clean } = rest; // eslint-disable-line @typescript-eslint/no-unused-vars
  return <Element {...clean}>{children}</Element>;
}

export default MotionDiv;
