'use client';

import React, { useState } from 'react';
import MotionDiv from '@/components/MotionContainer';
import CleanBackground from '@/components/CleanBackground';
import ProjectCard from '@/components/ProjectCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { loadMediaData } from '@/lib/media-loader';
import type { Project } from '@/lib/media-types';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  React.useEffect(() => {
    let mounted = true;
    loadMediaData()
      .then(({ projects }) => { if (mounted) setAllProjects(projects); })
      .catch((e) => console.warn('Projects: loadMediaData failed', e));
    return () => { mounted = false; };
  }, []);
  
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
    <div className="min-h-screen">
      {/* Background Layer */}
      <CleanBackground variant="portfolio" />
      
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
                Project
                <span className="block text-[var(--accent-primary)]">Showcase</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
                Explore our complete collection of woodcarving projects. Each piece represents a unique journey 
                from concept to completion, showcasing traditional craftsmanship and artistic innovation.
              </p>
            </MotionDiv>

            {/* Project Stats */}
            <MotionDiv 
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{allProjects.length}</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{allProjects.filter(p => p.category === 'wildlife').length}</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Wildlife</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{allProjects.filter(p => p.category === 'commissioned').length}</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Commissioned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent-primary)]">{allProjects.filter(p => p.category === 'religious').length}</div>
                <div className="text-sm text-[var(--text-muted)] uppercase tracking-wide">Religious</div>
              </div>
            </MotionDiv>
          </div>
        </section>

        {/* Category Filter Section */}
        <section className="px-4 mb-12">
          <div className="max-w-7xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                Browse by Category
              </h2>
            </MotionDiv>

            {/* Category Filters */}
            <MotionDiv 
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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
          </div>
        </section>

        {/* Projects Grid */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
      <MotionDiv 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              layout
              key={selectedCategory}
            >
              {filteredProjects.map((project, index) => (
        <MotionDiv 
                  key={project.id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProjectCard 
                    project={project} 
                    variant="detailed"
                    className="h-full"
                  />
        </MotionDiv>
              ))}
      </MotionDiv>

            {/* No Results */}
            {filteredProjects.length === 0 && (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-[var(--text-muted)] text-lg mb-4">
                  No projects found in this category
                </div>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-[var(--accent-warm)] transition-colors"
                >
                  View All Projects
                </button>
              </MotionDiv>
            )}
          </div>
        </section>

        {/* Featured Categories */}
        <section className="px-4 py-16 bg-[var(--surface-elevated)]/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                Project Categories
              </h2>
              <p className="text-lg text-[var(--text-muted)]">
                Discover our diverse specialties in woodcarving artistry
              </p>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  category: 'wildlife',
                  title: 'Wildlife Carvings',
                  description: 'Majestic creatures brought to life through masterful woodcarving techniques',
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  ),
                  count: allProjects.filter(p => p.category === 'wildlife').length
                },
                {
                  category: 'mythical',
                  title: 'Mythical Creatures',
                  description: 'Legendary beings carved with imagination and traditional skill',
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  ),
                  count: allProjects.filter(p => p.category === 'mythical').length
                },
                {
                  category: 'religious',
                  title: 'Religious Art',
                  description: 'Sacred sculptures crafted with reverence and spiritual dedication',
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                  ),
                  count: allProjects.filter(p => p.category === 'religious').length
                }
              ].map((cat, index) => (
                <MotionDiv
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  as='button'
                  className="text-left p-6 bg-[var(--surface-elevated)] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-[var(--accent-primary)]">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">{cat.title}</h3>
                      <p className="text-sm text-[var(--text-muted)]">{cat.count} projects</p>
                    </div>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                    {cat.description}
                  </p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </section>

        {/* Commission CTA */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
                Ready to Commission Your Project?
              </h2>
              <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                Each project begins with your vision and our expertise. Whether you're inspired by wildlife, 
                drawn to mythical themes, or seeking a meaningful religious piece, we bring your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MotionDiv
                  href="/commission"
                  as='a'
                  className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-8 py-4 rounded-lg font-medium hover:bg-[var(--accent-warm)] transition-colors duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  Start Your Commission
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </MotionDiv>
                <MotionDiv
                  href="/gallery"
                  as='a'
                  className="inline-flex items-center gap-2 bg-[var(--surface-elevated)] text-[var(--foreground)] px-8 py-4 rounded-lg font-medium hover:bg-[var(--border-subtle)] transition-colors duration-300 border border-[var(--border-subtle)]"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  View Gallery
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
        </MotionDiv>
              </div>
      </MotionDiv>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
