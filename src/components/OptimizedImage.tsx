'use client';

import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85
}) => {
  // Generate WebP version path
  const getWebPSrc = (originalSrc: string) => {
    const lastDotIndex = originalSrc.lastIndexOf('.');
    if (lastDotIndex === -1) return originalSrc;
    return originalSrc.substring(0, lastDotIndex) + '.webp';
  };

  // Generate responsive image paths
  const getResponsiveSrc = (originalSrc: string, width: number) => {
    const lastDotIndex = originalSrc.lastIndexOf('.');
    if (lastDotIndex === -1) return originalSrc;
    const basePath = originalSrc.substring(0, lastDotIndex);
    const extension = originalSrc.substring(lastDotIndex);
    return `${basePath}_${width}w${extension}`;
  };

  const webpSrc = getWebPSrc(src);
  const responsive800w = getResponsiveSrc(src, 800);
  const responsive1200w = getResponsiveSrc(src, 1200);
  const responsive1600w = getResponsiveSrc(src, 1600);

  return (
    <picture>
      {/* WebP format with responsive sizes */}
      <source
        type="image/webp"
        srcSet={`
          ${getWebPSrc(responsive800w)} 800w,
          ${getWebPSrc(responsive1200w)} 1200w,
          ${getWebPSrc(responsive1600w)} 1600w,
          ${webpSrc} 2000w
        `}
        sizes={sizes}
      />
      
      {/* JPEG fallback with responsive sizes */}
      <source
        type="image/jpeg"
        srcSet={`
          ${responsive800w} 800w,
          ${responsive1200w} 1200w,
          ${responsive1600w} 1600w,
          ${src} 2000w
        `}
        sizes={sizes}
      />
      
      {/* Fallback image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        quality={quality}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
      />
    </picture>
  );
};

export default OptimizedImage;
