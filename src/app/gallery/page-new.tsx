'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import CleanBackground from '@/components/CleanBackground';
import ModernMediaGallery from '@/components/ModernMediaGallery';
import ProjectCard from '@/components/ProjectCard';
import { projects, getMediaItemsForProject, getFeaturedProjects, MediaItem } from '@/lib/media-organized';

export default function GalleryPage() {
  const [selectedView, setSelectedView] = useState<'all' | 'projects' | 'media'>('all');
  
  // Get all media items from all projects
  const allMediaItems = useMemo(() => {
    const items: MediaItem[] = [];
    projects.forEach(project => {
      const projectMedia = getMediaItemsForProject(project.id);
      items.push(...projectMedia);
    });
    return items;
  }, []);

  const featuredProjects = getFeaturedProjects();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background Layer */}
      <CleanBackground variant="portfolio" />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
                Woodcarving
                <span className="block text-[var(--accent-primary)]">Gallery</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
                Explore the complete collection of handcrafted masterpieces, from mystical creatures 
                to wildlife artistry. Each piece tells a story of dedication, skill, and artisan passion.
              </p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div 
              className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{projects.length}</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{allMediaItems.filter(item => item.type === 'image').length}+</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{allMediaItems.filter(item => item.type === 'video').length}+</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">15+</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Years Experience</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* View Toggle */}
        <section className="px-4 mb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex flex-wrap justify-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { key: 'all', label: 'All Content' },
                { key: 'projects', label: 'Projects' },
                { key: 'media', label: 'Media Gallery' }
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setSelectedView(view.key as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedView === view.key
                      ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                      : 'bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        {(selectedView === 'all' || selectedView === 'projects') && (
          <section className="px-4 mb-16">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                  Featured Projects
                </h2>
                <p className="text-[var(--text-muted)]">
                  Masterpieces showcasing the pinnacle of woodcarving artistry
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {featuredProjects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <ProjectCard 
                      project={project} 
                      variant="detailed"
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Media Gallery Section */}
        {(selectedView === 'all' || selectedView === 'media') && (
          <section className="px-4 mb-16">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                  Complete Media Gallery
                </h2>
                <p className="text-[var(--text-muted)]">
                  Browse through the entire collection of process photos and finished pieces
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <ModernMediaGallery 
                  items={allMediaItems}
                  projects={projects}
                  showFilters={true}
                  columns={3}
                  className="modern-gallery"
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* All Projects Section */}
        {selectedView === 'projects' && (
          <section className="px-4 mb-16">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                  All Projects
                </h2>
                <p className="text-[var(--text-muted)]">
                  Complete portfolio of woodcarving projects and commissions
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {projects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants}>
                    <ProjectCard 
                      project={project} 
                      variant="compact"
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="px-4 py-16 bg-[var(--surface-elevated)]/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                Commission Your Own Masterpiece
              </h2>
              <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                Ready to bring your vision to life? Each piece is handcrafted with meticulous 
                attention to detail and decades of expertise.
              </p>
              <motion.a
                href="/commission"
                className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-8 py-4 rounded-lg font-medium hover:bg-[var(--accent-warm)] transition-colors duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Start Your Commission
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
