'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import CleanBackground from '@/components/CleanBackground';
import TabbedMediaGallery from '@/components/TabbedMediaGallery';
import Timeline from '@/components/Timeline';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import ProcessVideo from '@/components/ProcessVideo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  getProjectBySlug, 
  getMediaItemsForProject, 
  projects,
  Project
} from '@/lib/media-organized';

// Define difficulty display names
const difficultyDisplayNames = {
  beginner: 'Beginner',
  intermediate: 'Intermediate', 
  expert: 'Expert'
};

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'process'>('overview');

  useEffect(() => {
    params.then(({ slug: paramSlug }) => {
      const foundProject = getProjectBySlug(paramSlug);
      setProject(foundProject || null);
      setLoading(false);
      
      if (!foundProject) {
        notFound();
      }
    });
  }, [params]);

  const projectMedia = useMemo(() => 
    project ? getMediaItemsForProject(project.id) : [],
    [project]
  );

  const processImages = useMemo(() => 
    projectMedia.filter(item => item.category === 'process'),
    [projectMedia]
  );
  
  const finishedImages = useMemo(() => 
    projectMedia.filter(item => item.category === 'final'),
    [projectMedia]
  );
  
  const videos = useMemo(() => 
    projectMedia.filter(item => item.type === 'video'),
    [projectMedia]
  );

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const getCategoryIcon = (category: Project['category']) => {
    switch (category) {
      case 'wildlife':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
      case 'mythical':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      case 'religious':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
          </svg>
        );
      case 'commissioned':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[var(--accent-primary)]">
                    {getCategoryIcon(project.category)}
                  </div>
                  <span className="text-[var(--text-muted)] text-lg capitalize">
                    {project.category.replace('-', ' ')}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
                  {project.title}
                </h1>
                
                <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-8">
                  {project.description}
                </p>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[var(--surface-elevated)] p-4 rounded-lg border border-[var(--border-subtle)]">
                    <div className="text-sm text-[var(--text-muted)] mb-1">Difficulty</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                      {difficultyDisplayNames[project.difficulty || 'beginner']}
                    </div>
                  </div>
                  <div className="bg-[var(--surface-elevated)] p-4 rounded-lg border border-[var(--border-subtle)]">
                    <div className="text-sm text-[var(--text-muted)] mb-1">Completion Time</div>
                    <div className="font-medium text-[var(--foreground)]">{project.completionTime}</div>
                  </div>
                  <div className="bg-[var(--surface-elevated)] p-4 rounded-lg border border-[var(--border-subtle)]">
                    <div className="text-sm text-[var(--text-muted)] mb-1">Photos</div>
                    <div className="font-medium text-[var(--foreground)]">{project.mediaCount.images}</div>
                  </div>
                  <div className="bg-[var(--surface-elevated)] p-4 rounded-lg border border-[var(--border-subtle)]">
                    <div className="text-sm text-[var(--text-muted)] mb-1">Videos</div>
                    <div className="font-medium text-[var(--foreground)]">{project.mediaCount.videos}</div>
                  </div>
                </div>

                {/* Materials */}
                {project.materials && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Materials Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.materials.map((material, index) => (
                        <span 
                          key={index}
                          className="bg-[var(--accent-tertiary)] text-[var(--foreground)] px-3 py-1 rounded-full text-sm"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Client Info */}
                {project.client && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Commissioned by</h3>
                    <p className="text-[var(--text-muted)]">{project.client}</p>
                  </div>
                )}
              </motion.div>

              {/* Hero Image/Video */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {project.coverVideo ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                    <ProcessVideo
                      src={project.coverVideo}
                      poster={project.coverImage}
                      title={`${project.title} - Time-lapse`}
                      autoPlay={false}
                      showControls={true}
                    />
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="px-4 mb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'gallery', label: `Gallery (${projectMedia.length})` },
                { key: 'process', label: `Process (${processImages.length})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-[var(--accent-primary)] text-white shadow-lg'
                      : 'bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Featured Images */}
                <div>
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Finished Masterpiece</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {finishedImages.slice(0, 6).map((item) => (
                      <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Videos */}
                {videos.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Process Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videos.map((video, index) => (
                        <div key={video.id} className="relative">
                          <ProcessVideo
                            src={video.src}
                            title={video.alt || 'Process Video'}
                            description={`Carving process documentation - Step ${index + 1}`}
                            duration={video.duration}
                            processStep={index + 1}
                            poster={video.src.replace(/\.(mp4|mov|webm)$/i, '.jpg')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TabbedMediaGallery 
                  items={projectMedia}
                  showFilters={true}
                  columns={3}
                />
              </motion.div>
            )}

            {activeTab === 'process' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Process Timeline */}
                <div>
                  <Timeline
                    steps={[
                      {
                        id: 'design',
                        title: 'Design & Planning',
                        description: 'Creating detailed sketches and selecting the perfect piece of wood.',
                        duration: '1-2 days',
                        media: processImages[0],
                        isCompleted: true,
                        icon: (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        )
                      },
                      {
                        id: 'roughing',
                        title: 'Rough Carving',
                        description: 'Removing large amounts of wood to establish the basic form.',
                        duration: '3-5 days',
                        media: processImages[Math.floor(processImages.length * 0.25)],
                        isCompleted: true,
                        icon: (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
                          </svg>
                        )
                      },
                      {
                        id: 'detailing',
                        title: 'Detail Work',
                        description: 'Adding intricate details, textures, and refining features.',
                        duration: '7-14 days',
                        media: processImages[Math.floor(processImages.length * 0.5)],
                        isCompleted: true,
                        icon: (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4z" clipRule="evenodd" />
                          </svg>
                        )
                      },
                      {
                        id: 'finishing',
                        title: 'Sanding & Finishing',
                        description: 'Final sanding and applying protective finishes.',
                        duration: '2-3 days',
                        media: processImages[Math.floor(processImages.length * 0.75)],
                        isCompleted: true,
                        icon: (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                          </svg>
                        )
                      }
                    ]}
                    title={`${project.title} - Carving Process`}
                    description="Follow the journey from raw wood to finished masterpiece"
                    variant="vertical"
                    showProgress={true}
                  />
                </div>

                {/* Before/After Comparison */}
                {processImages.length >= 2 && (
                  <div>
                    <BeforeAfterComparison
                      beforeImage={processImages[0]}
                      afterImage={processImages[processImages.length - 1]}
                      title="Transformation"
                      description={`See the incredible transformation of ${project.title} from raw wood to finished sculpture`}
                      variant="slider"
                    />
                  </div>
                )}

                {/* Process Photo Documentation */}
                <div>
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Step-by-Step Documentation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processImages.map((item, index) => (
                      <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden shadow-lg group">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white text-sm">Step {index + 1}: {item.alt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Videos */}
                {videos.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">Process Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {videos.map((video, index) => (
                        <div key={video.id} className="relative">
                          <ProcessVideo
                            src={video.src}
                            title={`${project.title} - Process Video ${index + 1}`}
                            description={`Detailed carving process documentation`}
                            duration={video.duration}
                            processStep={index + 1}
                            poster={video.src.replace(/\.(mp4|mov|webm)$/i, '.jpg')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* Related Projects */}
        <section className="px-4 py-16 bg-[var(--surface-elevated)]/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center">
              Related Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects
                .filter(p => p.id !== project.id && p.category === project.category)
                .slice(0, 3)
                .map((relatedProject) => (
                  <Link key={relatedProject.id} href={`/projects/${relatedProject.slug}`}>
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <Image
                        src={relatedProject.coverImage}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-semibold">{relatedProject.title}</h3>
                        <p className="text-white/80 text-sm capitalize">{relatedProject.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* Commission CTA */}
        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                Inspired by This Work?
              </h2>
              <p className="text-lg text-[var(--text-muted)] mb-8">
                Commission your own masterpiece with the same level of craftsmanship and attention to detail.
              </p>
              <Link
                href="/commission"
                className="inline-flex items-center gap-2 bg-[var(--accent-primary)] text-white px-8 py-4 rounded-lg font-medium hover:bg-[var(--accent-warm)] transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Commission
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
