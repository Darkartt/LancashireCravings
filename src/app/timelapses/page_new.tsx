'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CleanBackground from '@/components/CleanBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProcessVideoPlayer from '@/components/ProcessVideoPlayer';
import ModernMediaGallery from '@/components/ModernMediaGallery';
import { 
  getAllMediaItems,
  projects,
  Project,
  MediaItem 
} from '@/lib/media-organized';

interface TimelapseShowcaseProps {
  project: Project;
  video: MediaItem;
  duration: string;
  processSteps: number;
}

const TimelapseShowcase: React.FC<TimelapseShowcaseProps> = ({ 
  project, 
  video, 
  duration, 
  processSteps 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="aspect-video w-full">
        <ProcessVideoPlayer
          video={video}
          title={`${project.title} - Time-lapse`}
          chapters={[
            { id: '1', title: 'Initial Design', startTime: 0, endTime: 30, description: 'Design phase' },
            { id: '2', title: 'Rough Carving', startTime: 30, endTime: 120, description: 'Initial carving' },
            { id: '3', title: 'Detail Work', startTime: 120, endTime: 240, description: 'Fine details' },
            { id: '4', title: 'Finishing', startTime: 240, endTime: 300, description: 'Final touches' }
          ]}
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{project.title.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">{project.title}</h3>
            <p className="text-neutral-600">{project.category}</p>
          </div>
        </div>
        
        <p className="text-neutral-700 mb-4">{project.description}</p>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{duration}</div>
            <div className="text-sm text-neutral-600">Duration</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{processSteps}</div>
            <div className="text-sm text-neutral-600">Steps</div>
          </div>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{project.mediaCount.images + project.mediaCount.videos}</div>
            <div className="text-sm text-neutral-600">Media</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TimelapsePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');
  
  // Get all video media items
  const allVideos = getAllMediaItems().filter((item: any) => item.type === 'video');
  
  // Featured time-lapse projects
  const featuredTimelapses = [
    {
      project: projects.find(p => p.id === 'golden-eagle')!,
      video: {
        id: 'eagle-timelapse',
        type: 'video' as const,
        src: '/media/Eagle/Golden eagle - By Christian Lancaster.MP4',
        alt: 'Golden Eagle Carving Time-lapse',
        title: 'Golden Eagle Time-lapse',
        description: 'Complete carving process from design to finish',
        category: 'process' as const,
        project: 'golden-eagle'
      },
      duration: '15 mins',
      processSteps: 8
    },
    {
      project: projects.find(p => p.id === 'richard-peacock-bass')!,
      video: {
        id: 'bass-process',
        type: 'video' as const,
        src: '/media/Richard Peacock Bass/IMG_1825.MOV',
        alt: 'Bass Carving Process Video',
        title: 'Bass Carving Process',
        description: 'Detailed bass carving technique demonstration',
        category: 'process' as const,
        project: 'richard-peacock-bass'
      },
      duration: '8 mins',
      processSteps: 6
    },
    {
      project: projects.find(p => p.id === 'nature-collection')!,
      video: {
        id: 'butterflies-dragonflies',
        type: 'video' as const,
        src: '/media/1/Butterflies Dragonflies and fish.MP4',
        alt: 'Nature Collection Time-lapse',
        title: 'Butterflies & Dragonflies',
        description: 'Intricate nature-inspired carvings',
        category: 'process' as const,
        project: 'nature-collection'
      },
      duration: '12 mins',
      processSteps: 7
    }
  ];

  // Filter videos based on selected category
  const filteredVideos = selectedCategory === 'all' 
    ? allVideos 
    : allVideos.filter(video => video.project === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Videos', count: allVideos.length },
    { id: 'golden-eagle', name: 'Eagle Project', count: allVideos.filter(v => v.project === 'golden-eagle').length },
    { id: 'richard-peacock-bass', name: 'Bass Project', count: allVideos.filter(v => v.project === 'richard-peacock-bass').length },
    { id: 'nature-collection', name: 'Nature Collection', count: allVideos.filter(v => v.project === 'nature-collection').length },
  ];

  return (
    <>
      <CleanBackground variant="portfolio" />
      <Header />
      <div className="relative z-10 min-h-screen py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
                Time-lapse <span className="text-amber-600">Showcase</span>
              </h1>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
                Watch the magic unfold as raw wood transforms into stunning masterpieces. 
                Each time-lapse captures hours of meticulous craftsmanship compressed into 
                captivating moments of artistic creation.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{allVideos.length}</div>
                  <div className="text-sm text-neutral-600">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">50+</div>
                  <div className="text-sm text-neutral-600">Hours Recorded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">5</div>
                  <div className="text-sm text-neutral-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">100+</div>
                  <div className="text-sm text-neutral-600">Process Steps</div>
                </div>
              </div>
            </motion.div>

            {/* View Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-12"
            >
              <div className="inline-flex rounded-lg bg-neutral-100 p-1">
                <button
                  onClick={() => setViewMode('featured')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'featured'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Featured Projects
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Videos
                </button>
              </div>
            </motion.div>

            {/* Featured Time-lapses */}
            {viewMode === 'featured' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
                  Featured Time-lapses
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {featuredTimelapses.map((showcase, index) => (
                    <motion.div
                      key={showcase.project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <TimelapseShowcase {...showcase} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Video Gallery */}
            {viewMode === 'grid' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-amber-600 text-white shadow-lg'
                          : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>

                {/* Video Grid */}
                <ModernMediaGallery
                  items={filteredVideos}
                  columns={3}
                  showFilters={false}
                  className="video-gallery"
                />
              </motion.div>
            )}

          </div>
        </div>
      <Footer />
    </>
  );
}
