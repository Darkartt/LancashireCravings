'use client';

import React from 'react';
import Image from 'next/image';
import type { MediaItem } from '@/lib/media-types';

interface MediaCardProps {
  media: MediaItem;
  onSelect?: (media: MediaItem) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'minimal' | 'detailed';
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  media, 
  onSelect, 
  size = 'medium',
  variant = 'minimal'
}) => {
  const sizeClasses = {
    small: 'aspect-square',
    medium: media.type === 'video' ? 'aspect-video' : 'aspect-square',
    large: media.type === 'video' ? 'aspect-video' : 'aspect-[4/5]'
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(media);
    }
  };

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl bg-white 
        shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        transition-all duration-300 cursor-pointer hover:-translate-y-1
        ${sizeClasses[size]}
      `}
      onClick={handleClick}
    >
      {/* Media Content */}
      <div className="relative w-full h-full">
        {media.type === 'image' ? (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/2gAMAwEAAhEDEQA/AKrqooooAKKKKAP/2Q=="
          />
        ) : (
          <>
            <video
              src={media.src}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              preload="metadata"
              poster={media.src.replace(/\.(mp4|mov|webm)$/i, '.jpg')}
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
              <div 
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
              >
                <svg className="w-6 h-6 text-[var(--accent-primary)] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured Badge */}
        {media.featured && (
          <div 
            className="absolute top-3 left-3 animate-in fade-in-0 zoom-in-95 duration-300 delay-200"
          >
            <span className="bg-[var(--accent-primary)] text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}

        {/* Content Overlay */}
        {variant === 'detailed' && (
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="text-white font-medium text-sm leading-tight mb-1 line-clamp-2">
              {media.alt}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/80 capitalize bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {media.category}
              </span>
              {media.duration && (
                <span className="text-white/80 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {media.duration}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Minimal hover effect line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
};

export default MediaCard;
