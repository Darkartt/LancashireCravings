"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PortfolioBackground from "../../components/backgrounds/PortfolioBackground";
import "./portfolio.css"; // Ensure this points to the correct CSS file if needed

export default function Portfolio() {
  const galleryRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <PortfolioBackground />
      <Header />      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5 pt-24 z-10"> {/* Added z-10 for proper layering */}
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >Our Masterpieces</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >Explore the artistry of Elite Woodcraft through our portfolio of bespoke woodcarvings, custom furniture, and architectural elements crafted for clients worldwide.</motion.p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-background z-10"> {/* Added relative and z-10 */}
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >Browse by Category</motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/custom-furniture" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Custom Furniture</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/decorative-carvings" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Decorative Carvings</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/architectural-elements" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Architectural Elements</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/restoration" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Restoration Projects</h4>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>      {/* Featured Projects Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5 z-10" ref={galleryRef}> {/* Added relative and z-10 */}
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >Featured Projects</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Victorian-Inspired Armoire</h4>
                <p className="text-foreground/80 mb-4">A bespoke armoire featuring intricate Victorian motifs, crafted from sustainably sourced walnut for a private residence in London.</p>
                <Link href="/portfolio/victorian-armoire" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </motion.div>
            <motion.div 
              className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Ornate Fireplace Mantel</h4>
                <p className="text-foreground/80 mb-4">A hand-carved oak mantel with classical detailing, designed as the centerpiece for a historic estate's grand hall.</p>
                <Link href="/portfolio/fireplace-mantel" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </motion.div>
            <motion.div 
              className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Custom Dining Table</h4>
                <p className="text-foreground/80 mb-4">A 12-foot dining table crafted from reclaimed cherry wood, featuring subtle carvings inspired by the client's family heritage.</p>
                <Link href="/portfolio/dining-table" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </motion.div>
            <motion.div 
              className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Decorative Wall Panel</h4>
                <p className="text-foreground/80 mb-4">An expansive wall panel with nature-inspired carvings, installed in the lobby of a luxury boutique hotel in Paris.</p>
                <Link href="/portfolio/wall-panel" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </motion.div>
            <motion.div 
              className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Restored Cathedral Doors</h4>
                <p className="text-foreground/80 mb-4">A meticulous restoration of 18th-century cathedral doors, preserving historical integrity while reinforcing structural durability.</p>
                <Link href="/portfolio/cathedral-doors" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </motion.div>
            <motion.div 
              className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Bespoke Staircase Balustrade</h4>
                <p className="text-foreground/80 mb-4">A custom-designed balustrade featuring flowing organic patterns, crafted to complement a modern architectural residence.</p>
                <Link href="/portfolio/staircase-balustrade" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link href="/portfolio/all" className="inline-block border-2 border-accent-primary text-accent-primary px-8 py-3 rounded-md font-medium hover:bg-accent-primary/10 transition-colors">View All Projects</Link>
          </motion.div>
        </div>
      </section>      {/* Call to Action Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-accent-primary/10 z-10"> {/* Added relative and z-10 */}
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Inspired by Our Work?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Commission a bespoke piece that reflects your unique style. Let's create something extraordinary together.</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>
          </motion.div>
        </motion.div>
      </section>      {/* Using Framer Motion for all animations */}

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
