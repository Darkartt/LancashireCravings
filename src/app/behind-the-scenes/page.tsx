'use client';

import React, { useState } from 'react';
import { MotionDiv } from '@/components/MotionContainer';
import Image from 'next/image';
import CleanBackground from '@/components/CleanBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabbedMediaGallery from '@/components/TabbedMediaGallery';
import Timeline from '@/components/Timeline';
import BeforeAfterComparison from '@/components/BeforeAfterComparison';
import WorkshopShowcase from '@/components/WorkshopShowcase';
import { loadAllMediaItems } from '@/lib/media-loader';
import type { MediaItem } from '@/lib/media-types';

export default function BehindTheScenesPage() {
  const [activeSection, setActiveSection] = useState<'workshop' | 'process' | 'techniques' | 'tools'>('workshop');
  
  // Lazily load media for behind-the-scenes
  // Note: we don't need to keep a full copy in state; filter directly into per-section buckets
  const [behindScenesMedia, setBehindScenesMedia] = React.useState<MediaItem[]>([]);
  const [processMedia, setProcessMedia] = React.useState<MediaItem[]>([]);
  React.useEffect(() => {
    let mounted = true;
    loadAllMediaItems().then(items => {
      if (!mounted) return;
      setBehindScenesMedia(items.filter(m => m.category === 'behind-scenes'));
      setProcessMedia(items.filter(m => m.category === 'process'));
    });
    return () => { mounted = false; };
  }, []);
  
  // Create timeline data for the carving process
  const processSteps = [
    {
      id: 'design',
      title: 'Design & Planning',
      description: 'Creating detailed sketches and selecting the perfect piece of wood for the project.',
      duration: '1-2 days',
      media: processMedia[0],
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
      description: 'Removing large amounts of wood to establish the basic form and proportions.',
      duration: '3-5 days',
      media: processMedia[1],
      isCompleted: true,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'detailing',
      title: 'Detail Work',
      description: 'Adding intricate details, textures, and refining the sculpture\'s features.',
      duration: '7-14 days',
      media: processMedia[2],
      isCompleted: true,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'sanding',
      title: 'Sanding & Smoothing',
      description: 'Progressive sanding from coarse to fine grits to achieve a smooth surface.',
      duration: '2-3 days',
      media: processMedia[3],
      isCompleted: true,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'finishing',
      title: 'Finishing & Protection',
      description: 'Applying oils, waxes, or other finishes to protect and enhance the wood\'s beauty.',
      duration: '1-2 days',
      media: processMedia[4],
      isCompleted: false,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const sections = [
    { 
      id: 'workshop' as const, 
      label: 'Workshop Tour', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12V8H4v8h12z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'process' as const, 
      label: 'Carving Process', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      id: 'techniques' as const, 
      label: 'Techniques', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      )
    },
    { 
      id: 'tools' as const, 
      label: 'Tools & Materials', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    }
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CleanBackground variant="process" />
      <div className="relative z-10">
        <Header />
        <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-accent-primary mb-6">
                Behind the Scenes
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 mb-8">
                Step into the workshop of master craftsman Christian Lancaster
              </p>
              <p className="text-lg text-foreground/60 max-w-3xl mx-auto">
                Discover the artistry, dedication, and traditional techniques that bring each piece 
                to life. From initial design to final finish, witness the transformation of 
                raw wood into extraordinary sculptures.
              </p>
            </MotionDiv>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="py-8 border-b border-neutral-200">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${activeSection === section.id 
                      ? 'bg-accent-primary text-white shadow-lg' 
                      : 'bg-background hover:bg-neutral-50 text-foreground/70 border border-neutral-200'
                    }
                  `}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
    <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeSection}
          className="py-16"
        >
          {activeSection === 'workshop' && (
            <section className="container mx-auto px-6 lg:px-8">
      <MotionDiv variants={itemVariants}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
                    Workshop Tour
                  </h2>
                  <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                    Take a virtual tour of the workshop where magic happens. See the tools, 
                    techniques, and environment that shape each masterpiece.
                  </p>
                </div>
                <WorkshopShowcase />
      </MotionDiv>
            </section>
          )}

          {activeSection === 'process' && (
            <section className="container mx-auto px-6 lg:px-8">
              <MotionDiv variants={itemVariants}>
                <Timeline
                  steps={processSteps}
                  title="The Carving Journey"
                  description="Follow the step-by-step process from concept to completion"
                  variant="vertical"
                  showProgress={true}
                />
              </MotionDiv>

              {/* Before/After Example */}
              {processMedia.length >= 2 && (
                <MotionDiv variants={itemVariants} className="mt-20">
                  <BeforeAfterComparison
                    beforeImage={processMedia[0]}
                    afterImage={processMedia[processMedia.length - 1]}
                    title="Raw Wood to Masterpiece"
                    description="See the incredible transformation from a simple piece of wood to a work of art"
                    variant="slider"
                  />
                </MotionDiv>
              )}
            </section>
          )}

          {activeSection === 'techniques' && (
            <section className="container mx-auto px-6 lg:px-8">
              <MotionDiv variants={itemVariants}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
                    Traditional Techniques
                  </h2>
                  <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                    Explore the time-honored woodcarving techniques passed down through generations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Relief Carving",
                      description: "Creating raised designs that project from a flat background",
                      image: processMedia[0]
                    },
                    {
                      title: "Chip Carving",
                      description: "Precise knife work to create geometric patterns and textures",
                      image: processMedia[1]
                    },
                    {
                      title: "Sculpture Carving",
                      description: "Three-dimensional forms carved in the round",
                      image: processMedia[2]
                    }
                  ].map((technique, index) => (
                    <MotionDiv
                      key={index}
                      variants={itemVariants}
                      className="bg-background rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      {technique.image && (
                        <div className="aspect-[4/3] relative">
                          <Image
                            src={technique.image.src}
                            alt={technique.image.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-semibold text-accent-primary mb-3">
                          {technique.title}
                        </h3>
                        <p className="text-foreground/70">
                          {technique.description}
                        </p>
                      </div>
        </MotionDiv>
                  ))}
                </div>
      </MotionDiv>
            </section>
          )}

          {activeSection === 'tools' && (
            <section className="container mx-auto px-6 lg:px-8">
              <MotionDiv variants={itemVariants}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
                    Tools & Materials
                  </h2>
                  <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                    The essential tools and carefully selected materials that make excellence possible
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Tools Section */}
                  <div>
                    <h3 className="text-2xl font-serif font-semibold text-accent-primary mb-6">
                      Essential Tools
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: "Carving Chisels", description: "Hand-forged chisels in various sizes for detailed work" },
                        { name: "Gouges", description: "Curved cutting tools for shaping and hollowing" },
                        { name: "V-Tools", description: "Specialized tools for creating sharp lines and details" },
                        { name: "Mallets", description: "Wooden mallets for controlled striking force" },
                        { name: "Hand Saws", description: "For initial rough cutting and shaping" },
                        { name: "Sharpening Stones", description: "Maintaining razor-sharp tool edges" }
                      ].map((tool, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-neutral-200">
                          <div className="w-2 h-2 bg-accent-primary rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-accent-primary">{tool.name}</h4>
                            <p className="text-sm text-foreground/70">{tool.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Materials Section */}
                  <div>
                    <h3 className="text-2xl font-serif font-semibold text-accent-primary mb-6">
                      Premium Materials
                    </h3>
                    <div className="space-y-4">
                      {[
                        { name: "English Oak", description: "Sustainably sourced hardwood with beautiful grain" },
                        { name: "Walnut", description: "Rich, dark wood perfect for detailed sculptures" },
                        { name: "Cherry", description: "Fine-grained wood that ages to a warm patina" },
                        { name: "Lime Wood", description: "Traditional carving wood prized for its workability" },
                        { name: "Natural Oils", description: "Food-safe finishes that enhance wood's natural beauty" },
                        { name: "Carnauba Wax", description: "Premium protection and lustrous finish" }
                      ].map((material, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-neutral-200">
                          <div className="w-2 h-2 bg-accent-secondary rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-accent-primary">{material.name}</h4>
                            <p className="text-sm text-foreground/70">{material.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
      </MotionDiv>
            </section>
          )}
    </MotionDiv>

        {/* Process Media Gallery */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-6 lg:px-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold text-accent-primary mb-4">
                  Process Documentation
                </h2>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                  Browse through our extensive collection of process photos and videos
                </p>
              </div>
              <TabbedMediaGallery
                items={[...processMedia, ...behindScenesMedia]}
                showFilters={true}
                columns={3}
              />
            </MotionDiv>
          </div>
        </section>        </main>
        <Footer />
      </div>
    </div>
  );
}
