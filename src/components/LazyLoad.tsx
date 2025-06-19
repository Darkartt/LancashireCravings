'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export default function LazyLoad({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : placeholder || <LazyLoadPlaceholder />}
    </div>
  );
}

function LazyLoadPlaceholder() {
  return (
    <div className="animate-pulse bg-accent-primary/5 rounded h-64 flex items-center justify-center">
      <div className="text-accent-primary/40 text-sm">Loading...</div>
    </div>
  );
}
