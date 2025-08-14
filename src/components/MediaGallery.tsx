'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import MotionDiv from '@/components/MotionContainer';
import { LazyAnimatePresence } from '@/components/LazyAnimatePresence';
import MediaCard from '@/components/MediaCard';
import type { MediaItem } from '@/lib/media-types';

interface MediaGalleryProps {
  items: MediaItem[];
  className?: string;
  columns?: 2 | 3 | 4;
  variant?: 'minimal' | 'detailed';
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  items,
  className = '',
  columns = 3,
  variant = 'minimal'
}) => {
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const handleLightboxOpen = (item: MediaItem) => {
    setLightboxItem(item);
  };

  const handleLightboxClose = () => {
    setLightboxItem(null);
  };

  return (
    <div className={`media-gallery ${className}`}>
      {/* Gallery Grid */}
      <MotionDiv 
        className={`grid gap-6 ${gridClasses[columns]}`}
        layout
      >
        <LazyAnimatePresence>
          {items.map((item) => (
            <MotionDiv
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <MediaCard
                media={item}
                onSelect={handleLightboxOpen}
                size="medium"
                variant={variant}
              />
            </MotionDiv>
          ))}
        </LazyAnimatePresence>
      </MotionDiv>

      {/* Lightbox Modal */}
      <LazyAnimatePresence>
        {lightboxItem && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={handleLightboxClose}
          >
            <MotionDiv
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              {lightboxItem.type === 'image' ? (
                <div className="relative w-full h-full">
                  <Image
                    src={lightboxItem.src}
                    alt={lightboxItem.alt}
                    fill
                    className="object-contain rounded-lg"
                    sizes="100vw"
                  />
                </div>
              ) : (
                <video
                  src={lightboxItem.src}
                  className="w-full h-full object-contain rounded-lg"
                  controls
                  autoPlay
                />
              )}
              
              {/* Close Button */}
              <button
                onClick={handleLightboxClose}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Info Panel */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-1">{lightboxItem.alt}</h3>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span className="capitalize">{lightboxItem.category.replace('-', ' ')}</span>
                  <span>•</span>
                  <span className="capitalize">{lightboxItem.project.replace('-', ' ')}</span>
                  {lightboxItem.duration && (
                    <>
                      <span>•</span>
                      <span>{lightboxItem.duration}</span>
                    </>
                  )}
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </LazyAnimatePresence>

      {/* No Items Message */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[var(--text-muted)] text-lg mb-4">
            No media items found
          </div>
          <div className="w-16 h-16 mx-auto mb-4 text-[var(--border-subtle)]">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
