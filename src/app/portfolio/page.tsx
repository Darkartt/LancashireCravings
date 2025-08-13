'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MotionDiv from '@/components/MotionContainer';
import CleanBackground from '@/components/CleanBackground';
import ProjectCard from '@/components/ProjectCard';
import MediaCard from '@/components/MediaCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { loadMediaData } from '@/lib/media-loader';
import type { Project } from '@/lib/media-types';
// Featured media will be dynamically loaded; remove static heavy import.

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredMedia, setFeaturedMedia] = useState<any[]>([]);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  React.useEffect(() => {
    let mounted = true;
    loadMediaData()
      .then(({ projects, getFeaturedProjects }) => {
        if (!mounted) return;
        setAllProjects(projects);
        setFeaturedProjects(getFeaturedProjects ? getFeaturedProjects() : projects);
      })
      .catch((e) => console.warn('Portfolio: loadMediaData failed', e));
    return () => { mounted = false; };
  }, []);
  // Defer featured media load until idle
  React.useEffect(() => {
    if (!mediaLoaded) {
      const defer = (cb: () => void) => (typeof window !== 'undefined' && 'requestIdleCallback' in window ? (window as any).requestIdleCallback(cb) : setTimeout(cb, 250));
      defer(async () => {
        try {
          const { natureCollection } = await loadMediaData();
          const items = Object.values(natureCollection).flatMap(n => n.items);
          setFeaturedMedia(items.slice(0, 12));
          setMediaLoaded(true);
        } catch (e) {
          console.warn('Portfolio: featured media load failed', e);
        }
      });
    }
  }, [mediaLoaded]);
  
  // Filter projects by category
  const filteredProjects = selectedCategory === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'All Projects', count: allProjects.length },
    { key: 'wildlife', label: 'Wildlife Carvings', count: allProjects.filter(p => p.category === 'wildlife').length },
    { key: 'mythical', label: 'Mythical Creatures', count: allProjects.filter(p => p.category === 'mythical').length },
    { key: 'religious', label: 'Religious Art', count: allProjects.filter(p => p.category === 'religious').length },
    { key: 'commissioned', label: 'Commissioned Works', count: allProjects.filter(p => p.category === 'commissioned').length },
    { key: 'nature', label: 'Nature Collections', count: allProjects.filter(p => p.category === 'nature').length }
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Background Layer */}
      <CleanBackground variant="portfolio" />
      
      <Header />
      
      <main className="relative z-10" style={{ background: 'transparent' }}>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4" style={{ background: 'transparent' }}>
          <div className="max-w-7xl mx-auto text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
                Portfolio of
                <span className="block text-[var(--accent-primary)]">Masterworks</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
                Explore decades of artisanal woodcarving excellence. From majestic wildlife to sacred religious pieces, 
                each creation represents the pinnacle of traditional craftsmanship merged with contemporary artistry.
              </p>
            </MotionDiv>

            {/* Portfolio Stats */}
            <MotionDiv 
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{allProjects.length}</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Featured Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">15+</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">250+</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Pieces Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">100%</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Handcrafted</div>
              </div>
            </MotionDiv>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-16 px-4 bg-transparent backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                Featured Masterpieces
              </h2>
              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                Signature pieces that showcase the highest level of artisanal skill and creative vision
              </p>
            </MotionDiv>

      <MotionDiv 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {featuredProjects.map((project, index) => (
        <MotionDiv key={`featured-${project.id}-${index}`} variants={itemVariants}>
                  <ProjectCard 
                    project={project} 
                    variant="detailed"
                    className="h-full hover:scale-[1.02] transition-transform duration-300"
                  />
        </MotionDiv>
              ))}
      </MotionDiv>

            {/* View All Gallery Link */}
            <MotionDiv 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-8 py-4 rounded-lg font-medium hover:bg-[var(--accent-warm)] transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View Complete Gallery
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </MotionDiv>
          </div>
        </section>

        {/* Category Filter Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                Browse by Category
              </h2>
              <p className="text-lg text-[var(--text-muted)]">
                Discover our diverse range of woodcarving specialties
              </p>
            </MotionDiv>

            {/* Category Filters */}
            <MotionDiv 
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.key
                      ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                      : 'bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </MotionDiv>

            {/* Filtered Projects Grid */}
      <MotionDiv 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              layout
              key={selectedCategory}
            >
              {filteredProjects.map((project, index) => (
        <MotionDiv 
                  key={`filtered-${project.id}-${selectedCategory}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProjectCard 
                    project={project} 
                    variant="compact"
                    className="h-full"
                  />
        </MotionDiv>
              ))}
      </MotionDiv>
          </div>
        </section>

        {/* Process Highlight Section */}
        <section className="py-16 px-4 bg-transparent backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                Behind the Artistry
              </h2>
              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                Witness the transformation from raw wood to breathtaking sculpture through our documented process
              </p>
            </MotionDiv>

      <MotionDiv 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {(featuredMedia.length ? featuredMedia.slice(0, 6) : []).map((media, index) => (
        <MotionDiv key={`media-${media.id}-${index}`} variants={itemVariants}>
                  <MediaCard 
                    media={media}
                    size="medium"
                    variant="detailed"
                  />
        </MotionDiv>
              ))}
      </MotionDiv>
          </div>
        </section>

        {/* Commission Call to Action */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6">
                Commission Your Vision
              </h2>
              <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                Every masterpiece begins with an idea. Whether you envision a wildlife sculpture, 
                religious piece, or architectural element, we bring your creative vision to life 
                with uncompromising craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/commission"
                  className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-8 py-4 rounded-lg font-medium hover:bg-[var(--accent-warm)] transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Commission
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[var(--surface-elevated)] text-[var(--foreground)] px-8 py-4 rounded-lg font-medium hover:bg-[var(--border-subtle)] transition-colors duration-300 border border-[var(--border-subtle)]"
                >
                  Discuss Ideas
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.748-.431L5 21l1.43-5.248A8 8 0 1121 12z" />
                  </svg>
                </Link>
              </div>
            </MotionDiv>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
