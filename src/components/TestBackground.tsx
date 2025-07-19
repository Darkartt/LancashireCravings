'use client';

import React from 'react';

const TestBackground: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{ 
        background: 'linear-gradient(to bottom right, #D2B48C, #8B4513, #556B2F)',
        pointerEvents: 'none',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    />
  );
};

export default TestBackground;
