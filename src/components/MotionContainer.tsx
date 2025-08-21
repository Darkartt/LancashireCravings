"use client";
import React, { ReactNode } from 'react';

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
  const Element: any = as;
  // Drop all motion-specific props (no-op wrapper)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { initial, animate, exit, transition, whileHover, whileTap, layout, variants, whileInView, viewport, onViewportEnter, onViewportLeave, onAnimationStart, onAnimationComplete, onAnimationEnd, ...clean } = rest;
  return <Element {...clean}>{children}</Element>;
}

export default MotionDiv;
