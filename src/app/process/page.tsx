'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CleanBackground from '@/components/CleanBackground';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveProcessGallery from '@/components/InteractiveProcessGallery';
import EnhancedTimeline from '@/components/EnhancedTimeline';
import EnhancedBeforeAfter from '@/components/EnhancedBeforeAfter';
import ProcessVideoPlayer from '@/components/ProcessVideoPlayer';
import { 
  getAllMediaItems
} from '@/lib/media-organized';
import { MediaItem } from '@/lib/media-organized';

export default function ProcessDocumentationPage() {
  const [activeProject, setActiveProject] = useState<'eagle' | 'nessie' | 'bass'>('eagle');
  
  // Get media for different projects using organized media system
  const allMedia = getAllMediaItems();
  const eagleMedia = allMedia.filter((media: any) => media.project === 'golden-eagle');
  
  // Create process steps data for Interactive Process Gallery
  const eagleProcessSteps = [
    {
      id: 'design',
      title: 'Design & Planning',
      description: 'Creating detailed sketches and planning the sculpture based on reference photos and anatomical studies.',
      media: eagleMedia.slice(0, 3),
      isActive: true
    },
    {
      id: 'rough-carving',
      title: 'Rough Carving',
      description: 'Blocking out the basic form and establishing proportions using power tools and large chisels.',
      media: eagleMedia.slice(3, 6),
      isActive: false
    },
    {
      id: 'detail-work',
      title: 'Detail Work',
      description: 'Adding intricate details like feathers, talons, and facial features using precision carving tools.',
      media: eagleMedia.slice(6, 9),
      isActive: false
    },
    {
      id: 'finishing',
      title: 'Finishing & Protection',
      description: 'Sanding, applying protective finishes, and final detailing to bring the sculpture to life.',
      media: eagleMedia.slice(9, 12),
      isActive: false
    }
  ];

  // Create timeline steps for Enhanced Timeline
  const timelineSteps = [
    {
      id: 'concept',
      title: 'Concept Development',
      description: 'Research, sketching, and planning the sculpture design',
      duration: '1-2 days',
      media: eagleMedia.slice(0, 2),
      isCompleted: true,
      details: 'This phase involves extensive research into the subject, gathering reference materials, and creating detailed sketches from multiple angles.',
      tools: ['Pencils', 'Sketchbook', 'Reference Photos'],
      techniques: ['Anatomical Study', 'Proportion Analysis', 'Composition Planning'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      )
    },
    {
      id: 'wood-selection',
      title: 'Wood Selection',
      description: 'Choosing the perfect piece of wood for the project',
      duration: '1 day',
      media: eagleMedia.slice(2, 4),
      isCompleted: true,
      details: 'Selecting wood involves considering grain direction, color, hardness, and size requirements for the specific project.',
      tools: ['Measuring Tools', 'Wood Samples'],
      techniques: ['Grain Assessment', 'Quality Inspection'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'rough-shaping',
      title: 'Rough Shaping',
      description: 'Establishing the basic form and proportions',
      duration: '3-5 days',
      media: eagleMedia.slice(4, 7),
      isCompleted: true,
      details: 'Using power tools and large chisels to remove excess material and establish the overall shape and proportions.',
      tools: ['Chainsaw', 'Angle Grinder', 'Large Gouges', 'Mallet'],
      techniques: ['Power Carving', 'Roughing Out', 'Form Development'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'detail-carving',
      title: 'Detail Carving',
      description: 'Adding intricate details and textures',
      duration: '7-14 days',
      media: eagleMedia.slice(7, 10),
      isCompleted: false,
      details: 'The most time-intensive phase involving precise hand carving to add realistic details, textures, and character.',
      tools: ['Detail Chisels', 'V-Tools', 'Micro Gouges', 'Carving Knives'],
      techniques: ['Fine Detail Work', 'Texture Carving', 'Feature Definition'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'finishing',
      title: 'Finishing',
      description: 'Sanding, oiling, and final protective coatings',
      duration: '2-3 days',
      media: eagleMedia.slice(10, 12),
      isCompleted: false,
      details: 'Final preparation including progressive sanding, application of protective oils or wax, and quality assessment.',
      tools: ['Sandpaper', 'Steel Wool', 'Natural Oils', 'Wax', 'Brushes'],
      techniques: ['Progressive Sanding', 'Oil Application', 'Wax Finishing'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  // Create comparison stages for Enhanced Before/After
  const comparisonStages = [
    {
      id: 'raw-wood',
      title: 'Raw Wood Block',
      description: 'Selected piece of premium English oak ready for carving',
      media: eagleMedia[0] || { 
        id: '1', 
        src: '/BarOwlBack.jpg', 
        alt: 'Raw wood block', 
        type: 'image' as const,
        category: 'process' as const,
        project: 'golden-eagle'
      },
      timestamp: 'Day 1'
    },
    {
      id: 'rough-shape',
      title: 'Rough Shape',
      description: 'Basic form established with power tools',
      media: eagleMedia[3] || { 
        id: '2', 
        src: '/OwlFront.jpg', 
        alt: 'Rough carved shape', 
        type: 'image' as const,
        category: 'process' as const,
        project: 'golden-eagle'
      },
      timestamp: 'Day 3-5'
    },
    {
      id: 'detailed-carving',
      title: 'Detailed Carving',
      description: 'Intricate details and textures added by hand',
      media: eagleMedia[7] || { 
        id: '3', 
        src: '/OwlAtNight.jpg', 
        alt: 'Detailed carving', 
        type: 'image' as const,
        category: 'process' as const,
        project: 'golden-eagle'
      },
      timestamp: 'Day 8-15'
    },
    {
      id: 'finished-piece',
      title: 'Finished Masterpiece',
      description: 'Completed sculpture with protective finish applied',
      media: eagleMedia[11] || { 
        id: '4', 
        src: '/Crow.jpg', 
        alt: 'Finished carved eagle', 
        type: 'image' as const,
        category: 'finished' as const,
        project: 'golden-eagle'
      },
      timestamp: 'Day 18-20'
    }
  ];

  // Mock video data
  const processVideo: MediaItem = {
    id: 'eagle-timelapse',
    src: '/videos/eagle-carving-timelapse.mp4',
    alt: 'Eagle carving time-lapse video',
    type: 'video',
    category: 'process',
    project: 'golden-eagle',
    duration: '6:00'
  };

  const videoChapters = [
    {
      id: 'setup',
      title: 'Setup & Planning',
      description: 'Preparing workspace and marking the wood',
      startTime: 0,
      endTime: 30,
      thumbnail: '/BarOwlBack.jpg'
    },
    {
      id: 'roughing',
      title: 'Rough Carving',
      description: 'Removing bulk material with power tools',
      startTime: 30,
      endTime: 120,
      thumbnail: '/OwlFront.jpg'
    },
    {
      id: 'detailing',
      title: 'Detail Work',
      description: 'Hand carving intricate details',
      startTime: 120,
      endTime: 300,
      thumbnail: '/OwlAtNight.jpg'
    },
    {
      id: 'finishing',
      title: 'Finishing Touches',
      description: 'Final sanding and protective coating',
      startTime: 300,
      endTime: 360,
      thumbnail: '/Crow.jpg'
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
    <div className="min-h-screen text-foreground" style={{ background: 'transparent' }}>
      <CleanBackground variant="process" />
      <div className="relative z-10">
        <Header />
        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-accent-primary mb-6">
                  Process Documentation
                </h1>
                <p className="text-xl md:text-2xl text-foreground/70 mb-8">
                  Interactive journey through the carving process
                </p>
                <p className="text-lg text-foreground/60 max-w-3xl mx-auto">
                  Experience the transformation from raw wood to finished masterpiece through 
                  interactive galleries, detailed timelines, and immersive documentation.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Project Selection */}
          <section className="py-8 border-b border-neutral-200">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="flex justify-center">
                <div className="flex space-x-2 bg-background border border-neutral-200 rounded-full p-2">
                  {[
                    { id: 'eagle' as const, label: 'Golden Eagle' },
                    { id: 'nessie' as const, label: 'Nessie Sculpture' },
                    { id: 'bass' as const, label: 'Bass Relief' }
                  ].map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setActiveProject(project.id)}
                      className={`
                        px-6 py-3 rounded-full font-medium transition-all duration-300
                        ${activeProject === project.id 
                          ? 'bg-accent-primary text-white shadow-lg' 
                          : 'text-foreground/70 hover:text-foreground hover:bg-neutral-50'
                        }
                      `}
                    >
                      {project.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-24 py-16"
          >
            {/* Interactive Process Gallery */}
            <motion.section variants={itemVariants} className="container mx-auto px-6 lg:px-8">
              <InteractiveProcessGallery
                projectTitle="Golden Eagle"
                steps={eagleProcessSteps}
                autoPlay={false}
                showThumbnails={true}
                variant="tabs"
              />
            </motion.section>

            {/* Enhanced Timeline */}
            <motion.section variants={itemVariants} className="container mx-auto px-6 lg:px-8">
              <EnhancedTimeline
                steps={timelineSteps}
                title="Detailed Process Timeline"
                description="Interactive timeline with expandable details and progress tracking"
                variant="interactive"
                showProgress={true}
                interactive={true}
                autoPlay={false}
              />
            </motion.section>

            {/* Enhanced Before/After Comparison */}
            <motion.section variants={itemVariants} className="bg-neutral-50 py-16">
              <div className="container mx-auto px-6 lg:px-8">
                <EnhancedBeforeAfter
                  stages={comparisonStages}
                  title="Transformation Journey"
                  description="Witness the complete transformation from raw wood to finished masterpiece"
                  variant="timeline"
                  autoPlay={false}
                  showLabels={true}
                  showProgress={true}
                />
              </div>
            </motion.section>

            {/* Process Video Player */}
            <motion.section variants={itemVariants} className="container mx-auto px-6 lg:px-8">
              <ProcessVideoPlayer
                video={processVideo}
                title="Time-Lapse Documentation"
                description="Watch the complete carving process condensed into an engaging time-lapse video"
                chapters={videoChapters}
                autoPlay={false}
                showControls={true}
                showChapters={true}
                showPlaybackSpeed={true}
                posterImage={eagleMedia[0]}
                variant="cinematic"
              />
            </motion.section>

            {/* Alternative Before/After - Slider */}
            <motion.section variants={itemVariants} className="container mx-auto px-6 lg:px-8">
              <EnhancedBeforeAfter
                stages={[comparisonStages[0], comparisonStages[3]]}
                title="Before & After Comparison"
                description="Drag the slider to see the dramatic transformation"
                variant="slider"
                showLabels={true}
              />
            </motion.section>

            {/* Grid Process Gallery */}
            <motion.section variants={itemVariants} className="bg-neutral-50 py-16">
              <div className="container mx-auto px-6 lg:px-8">
                <InteractiveProcessGallery
                  projectTitle="Process Overview"
                  steps={eagleProcessSteps}
                  variant="grid"
                />
              </div>
            </motion.section>
          </motion.div>

          {/* Call to Action */}
          <section className="py-16 bg-accent-primary text-white">
            <div className="container mx-auto px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif font-bold mb-4">
                  Commission Your Own Masterpiece
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Experience this level of craftsmanship and documentation for your own custom sculpture
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-accent-primary px-8 py-3 rounded-full font-semibold hover:bg-neutral-100 transition-colors duration-200">
                    Start Commission
                  </button>
                  <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-accent-primary transition-colors duration-200">
                    View Portfolio
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
