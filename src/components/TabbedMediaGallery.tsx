'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import MotionDiv from '@/components/MotionContainer';
import { LazyAnimatePresence } from '@/components/LazyAnimatePresence';
import { MediaItem, Project } from '@/lib/media-organized';
import { Play, Image as ImageIcon, Video } from 'lucide-react';

interface TabbedMediaGalleryProps {
  items: MediaItem[];
  projects?: Project[];
  showFilters?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}

const TabbedMediaGallery: React.FC<TabbedMediaGalleryProps> = ({
  items,
  showFilters = true,
  columns = 3,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  // Separate items by type and sort by order
  const { photos, videos } = useMemo(() => {
    const filteredItems = items.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesProject = selectedProject === 'all' || item.project === selectedProject;
      return matchesCategory && matchesProject;
    });

    // Sort by order field (process order), with fallback to filename
    const sortedItems = filteredItems.sort((a, b) => {
      // First, sort by order if both have it
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // If only one has order, prioritize it
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      // If neither has order, sort by filename/id as fallback
      return a.filename?.localeCompare(b.filename || '') || a.id.localeCompare(b.id);
    });

    return {
      photos: sortedItems.filter(item => item.type === 'image'),
      videos: sortedItems.filter(item => item.type === 'video')
    };
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

  const currentItems = activeTab === 'photos' ? photos : videos;

  const handleItemClick = (item: MediaItem) => {
    if (item.type === 'video') {
      // For videos, we could open them in a modal or navigate to a video player
      window.open(item.src, '_blank');
    } else {
      setLightboxItem(item);
    }
  };

  const closeLightbox = () => {
    setLightboxItem(null);
  };

  return (
    <div className={`modern-media-gallery ${className}`}>
      {/* Tab Navigation - Modern Minimal Style */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('photos')}
            className={`relative p-3 rounded-full transition-all duration-300 ${
              activeTab === 'photos'
                ? 'text-blue-600 bg-blue-50 shadow-lg scale-110'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={`Photos (${photos.length})`}
          >
            <ImageIcon size={24} />
            {activeTab === 'photos' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`relative p-3 rounded-full transition-all duration-300 ${
              activeTab === 'videos'
                ? 'text-blue-600 bg-blue-50 shadow-lg scale-110'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={`Videos (${videos.length})`}
          >
            <Video size={24} />
            {activeTab === 'videos' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Project Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Project:</span>
            <button
              onClick={() => setSelectedProject('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedProject === 'all'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {projectNames.map(project => (
              <button
                key={project}
                onClick={() => setSelectedProject(project)}
                className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                  selectedProject === project
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {project}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[400px]">
        {currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            {activeTab === 'photos' ? (
              <ImageIcon size={48} className="mb-4 opacity-50" />
            ) : (
              <Video size={48} className="mb-4 opacity-50" />
            )}
            <p className="text-lg">No {activeTab} found for the selected filters.</p>
            <p className="text-sm">Try adjusting your category or project filters.</p>
          </div>
        ) : (
          <LazyAnimatePresence mode="wait">
            <MotionDiv
              key={`${activeTab}-${selectedCategory}-${selectedProject}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`grid ${gridClass} gap-6`}
            >
              {currentItems.map((item, index) => (
                <MotionDiv
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="aspect-square relative overflow-hidden">
                    {item.type === 'image' ? (
                      <>
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes={`(max-width: 768px) 100vw, (max-width: 1200px) ${100/columns}vw, ${100/columns}vw`}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <>
                        {/* Video thumbnail - you might want to generate or use a placeholder */}
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <Play size={48} className="text-white/80" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-3 right-3">
                          <div className="bg-black/70 rounded-full p-2">
                            <Video size={16} className="text-white" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">{item.alt}</h3>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                      <span className="capitalize">{item.category}</span>
                      <span className="capitalize">{item.project}</span>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>
          </LazyAnimatePresence>
        )}
      </div>

      {/* Lightbox for Images */}
      <LazyAnimatePresence>
        {lightboxItem && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
          >
            <MotionDiv
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] mx-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
              <div className="absolute -bottom-16 left-0 right-0 text-white text-center">
                <p className="text-lg font-medium">{lightboxItem.alt}</p>
                <p className="text-sm text-gray-300 capitalize">
                  {lightboxItem.category} • {lightboxItem.project}
                </p>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </LazyAnimatePresence>
    </div>
  );
};

export default TabbedMediaGallery;
