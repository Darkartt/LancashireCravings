'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface WorkshopShowcaseProps {
  className?: string;
}

const WorkshopShowcase: React.FC<WorkshopShowcaseProps> = ({ className = '' }) => {
  // Workshop images from the public folder
  const workshopImages = [
    {
      src: '/BarOwlAtackACritter.jpg',
      alt: 'Barn Owl attacking a critter - Dynamic action carving',
      category: 'Wildlife Action'
    },
    {
      src: '/BeeOnHoneyComb.jpg', 
      alt: 'Bee on honeycomb - Intricate detail work',
      category: 'Nature Details'
    },
    {
      src: '/HoldingSqerrel.jpg',
      alt: 'Christian Lancaster holding carved squirrel',
      category: 'Artist at Work'
    },
    {
      src: '/MeHoldingAFish.jpg',
      alt: 'Artist with carved fish - Craftsmanship showcase',
      category: 'Artist at Work'
    },
    {
      src: '/MeHoldingAnOwl.jpg',
      alt: 'Christian Lancaster with carved owl masterpiece',
      category: 'Artist at Work'
    },
    {
      src: '/FishInDoor.jpg',
      alt: 'Fish carving integrated into door design',
      category: 'Architectural'
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
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className={`workshop-showcase ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            Workshop & Process
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-3xl mx-auto">
            Behind every masterpiece lies countless hours of dedication, precision, and artisanal craftsmanship. 
            Explore the workshop where magic happens and witness the artisan at work.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {workshopImages.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl bg-[var(--surface-elevated)] shadow-md hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={85}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[var(--accent-primary)] text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    {image.category}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-medium text-sm leading-tight">
                    {image.alt}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Wood Grain Process Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center">
            Premium Wood Selection
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                image: '/cherry_grain.jpeg', 
                title: 'Cherry Wood',
                description: 'Rich, warm tones perfect for detailed wildlife carvings'
              },
              { 
                image: '/oak_grain.jpeg', 
                title: 'Oak Wood',
                description: 'Strong, durable hardwood ideal for large sculptural pieces'
              },
              { 
                image: '/walnut_grain.jpeg', 
                title: 'Walnut Wood',
                description: 'Premium dark wood with beautiful grain patterns'
              }
            ].map((wood, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-md">
                  <Image
                    src={wood.image}
                    alt={`${wood.title} grain pattern`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {wood.title}
                </h4>
                <p className="text-sm text-[var(--text-muted)]">
                  {wood.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkshopShowcase;
