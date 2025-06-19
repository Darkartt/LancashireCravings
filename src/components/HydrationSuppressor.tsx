'use client';

import { useEffect, useState } from 'react';

export default function HydrationSuppressor({
  children
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // This runs after hydration and will show the final UI
    setIsMounted(true);
  }, []);

  // During SSR and initial render, show a simplified version
  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  // After client-side hydration, show the real UI
  return <>{children}</>;
}
