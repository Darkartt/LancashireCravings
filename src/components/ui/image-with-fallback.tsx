"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  showPlaceholder?: boolean;
}

/**
 * Image component with fallback support for missing images (e.g., Git LFS files not pulled)
 * Shows a nice placeholder with gradient background when image fails to load
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  showPlaceholder = true,
  className = "",
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If error and no fallback, show placeholder
  if (error && !fallbackSrc && showPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-muted via-muted/80 to-muted/60 ${className}`}
        style={{ position: 'relative', ...props.style }}
      >
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-muted-foreground">
          <ImageIcon className="w-12 h-12 opacity-40" />
          <span className="text-xs text-center opacity-60">
            {alt || "Image"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && showPlaceholder && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/20 animate-pulse ${className}`}
        >
          <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
        </div>
      )}
      <Image
        src={error && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        className={className}
        onError={() => {
          if (!error) {
            setError(true);
          }
        }}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </>
  );
}
