'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import MotionDiv from '@/components/MotionContainer';
import { LazyAnimatePresence } from '@/components/LazyAnimatePresence';
import type { MediaItem, Project } from '@/lib/media-types';

interface ModernMediaGalleryProps {
  items: MediaItem[];
  projects?: Project[];
  showFilters?: boolean;
  columns?: 2 | 3 | 4;
  showProjectCards?: boolean;
  className?: string;
}

const ModernMediaGallery: React.FC<ModernMediaGalleryProps> = ({
  items,
  showFilters = true,
  columns = 3,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  // Filter items based on selected category and project
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesProject = selectedProject === 'all' || item.project === selectedProject;
      return matchesCategory && matchesProject;
    });
  }, [items, selectedCategory, selectedProject]);

  // Get unique categories and projects for filters
  const categories = useMemo(() => 
    Array.from(new Set(items.map(item => item.category))),
    [items]
  );

  const projectNames = useMemo(() => 
    Array.from(new Set(items.map(item => item.project))),
    [items]
  );

  // Grid column classes based on the columns prop
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[columns];

  return (
    <div className={`modern-media-gallery ${className}`}>
      {/* Filters */}
      {showFilters && (
  <MotionDiv 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-[var(--accent-primary)] text-white shadow-md'
                  : 'bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 capitalize ${
                  selectedCategory === category
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]'
                }`}
              >
                {category.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Project Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedProject('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                selectedProject === 'all'
                  ? 'bg-[var(--accent-secondary)] text-white shadow-md'
                  : 'bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]'
              }`}
            >
              All Projects
            </button>
            {projectNames.map(project => (
              <button
                key={project}
                onClick={() => setSelectedProject(project)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  selectedProject === project
                    ? 'bg-[var(--accent-secondary)] text-white shadow-md'
                    : 'bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]'
                }`}
              >
                {project.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
  </MotionDiv>
      )}

      {/* Gallery Grid */}
      <MotionDiv 
        layout
        className={`grid gap-6 ${gridClass}`}
      >
        <LazyAnimatePresence>
          {filteredItems.map((item, index) => (
            <MotionDiv
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="media-item group cursor-pointer"
              onClick={() => setLightboxItem(item)}
            >
              <div className="relative overflow-hidden rounded-lg bg-[var(--surface-elevated)] shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                {item.type === 'image' ? (
                  <div className="relative aspect-square">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                ) : (
                  <div className="relative aspect-video">
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      Video
                    </div>
                  </div>
                )}
                
                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm font-medium">{item.alt}</p>
                  <p className="text-white/80 text-xs capitalize">
                    {item.category.replace('-', ' ')} • {item.project.replace('-', ' ')}
                  </p>
                </div>
              </div>
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
            onClick={() => setLightboxItem(null)}
          >
            <MotionDiv
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              {lightboxItem.type === 'image' ? (
                <Image
                  src={lightboxItem.src}
                  alt={lightboxItem.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              ) : (
                <video
                  src={lightboxItem.src}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              )}
              
              {/* Close Button */}
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Info Panel */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{lightboxItem.alt}</h3>
                <p className="text-sm text-white/80 capitalize">
                  {lightboxItem.category.replace('-', ' ')} • {lightboxItem.project.replace('-', ' ')}
                </p>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </LazyAnimatePresence>

      {/* No Results Message */}
      {filteredItems.length === 0 && (
  <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-[var(--text-muted)] text-lg">No media found for the selected filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedProject('all');
            }}
            className="mt-4 px-6 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-[var(--accent-warm)] transition-colors"
          >
            Clear Filters
          </button>
  </MotionDiv>
      )}
    </div>
  );
};

export default ModernMediaGallery;
