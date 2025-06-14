"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import "./portfolio.css"; // Ensure this points to the correct CSS file if needed

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (galleryRef.current) {
        const galleryItems = gsap.utils.toArray<HTMLElement>('.gallery-item');
        if (galleryItems.length > 0) {
          gsap.fromTo(
            galleryItems,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.1,
              delay: 0.2,
              scrollTrigger: {
                trigger: galleryRef.current,
                start: "top 80%",
                once: true,
              }
            }
          );
        }
      }

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(refreshTimeout);
    }, galleryRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5">
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Masterpieces</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Explore the artistry of Elite Woodcraft through our portfolio of bespoke woodcarvings, custom furniture, and architectural elements crafted for clients worldwide.</motion.p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Browse by Category</motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/custom-furniture" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Custom Furniture</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/decorative-carvings" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Decorative Carvings</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/architectural-elements" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Architectural Elements</h4>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/portfolio/restoration" className="block relative overflow-hidden rounded-lg shadow-lg h-48 bg-foreground/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                <h4 className="absolute bottom-0 left-0 p-6 text-background text-xl font-serif font-semibold">Restoration Projects</h4>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4 sm:px-8 bg-foreground/5" ref={galleryRef}>
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Featured Projects</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Victorian-Inspired Armoire</h4>
                <p className="text-foreground/80 mb-4">A bespoke armoire featuring intricate Victorian motifs, crafted from sustainably sourced walnut for a private residence in London.</p>
                <Link href="/portfolio/victorian-armoire" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </div>
            <div className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Ornate Fireplace Mantel</h4>
                <p className="text-foreground/80 mb-4">A hand-carved oak mantel with classical detailing, designed as the centerpiece for a historic estate's grand hall.</p>
                <Link href="/portfolio/fireplace-mantel" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </div>
            <div className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Custom Dining Table</h4>
                <p className="text-foreground/80 mb-4">A 12-foot dining table crafted from reclaimed cherry wood, featuring subtle carvings inspired by the client's family heritage.</p>
                <Link href="/portfolio/dining-table" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </div>
            <div className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Decorative Wall Panel</h4>
                <p className="text-foreground/80 mb-4">An expansive wall panel with nature-inspired carvings, installed in the lobby of a luxury boutique hotel in Paris.</p>
                <Link href="/portfolio/wall-panel" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </div>
            <div className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Restored Cathedral Doors</h4>
                <p className="text-foreground/80 mb-4">A meticulous restoration of 18th-century cathedral doors, preserving historical integrity while reinforcing structural durability.</p>
                <Link href="/portfolio/cathedral-doors" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </div>
            <div className="gallery-item bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-foreground/10"></div>
              <div className="p-6">
                <h4 className="text-xl font-serif font-semibold text-accent-primary mb-2">Bespoke Staircase Balustrade</h4>
                <p className="text-foreground/80 mb-4">A custom-designed balustrade featuring flowing organic patterns, crafted to complement a modern architectural residence.</p>
                <Link href="/portfolio/staircase-balustrade" className="text-accent-primary font-medium hover:underline">View Project Details</Link>
              </div>
            </div>
          </div>
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/portfolio/all" className="inline-block border-2 border-accent-primary text-accent-primary px-8 py-3 rounded-md font-medium hover:bg-accent-primary/10 transition-colors">View All Projects</Link>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-8 bg-accent-primary/10">
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Inspired by Our Work?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Commission a bespoke piece that reflects your unique style. Let's create something extraordinary together.</p>
          <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-4 sm:px-8 bg-foreground/5 border-t border-foreground/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-serif font-bold text-accent-primary mb-4">Elite Woodcraft</h4>
              <p className="text-foreground/70 mb-4">Creating timeless wooden masterpieces for discerning clients worldwide.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-foreground/70 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent-primary transition-colors">
                  <span className="sr-only">Pinterest</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 20l4-9"></path>
                    <path d="M10.76 13.76c-.24 1.44.62 2.87 2.05 3.12a3.26 3.26 0 0 0 3.29-1.8 16.52 16.52 0 0 0 1.38-5.17c-.26-3.77-2.05-6.91-5.75-7.87A6.15 6.15 0 0 0 4.11 4.3c.58 2.47 1.46 4.89 2.63 7.14 1.86-3.32 6.6-5.89 9.92-3.98-2.96 2.13-3.98 6.62-1.85 9.58a6.9 6.9 0 0 0 2.89 1.05c-.88 2.29-2.75 3.85-5.02 4.57l1.33 4.34"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-3">Explore</h5>
              <ul className="space-y-2">
                <li><Link href="/portfolio" className="text-foreground/70 hover:text-accent-primary transition-colors">Portfolio</Link></li>
                <li><Link href="/services" className="text-foreground/70 hover:text-accent-primary transition-colors">Services</Link></li>
                <li><Link href="/process" className="text-foreground/70 hover:text-accent-primary transition-colors">Process</Link></li>
                <li><Link href="/shop" className="text-foreground/70 hover:text-accent-primary transition-colors">Shop</Link></li>
                <li><Link href="/blog" className="text-foreground/70 hover:text-accent-primary transition-colors">Blog</Link></li>
                <li><Link href="/about" className="text-foreground/70 hover:text-accent-primary transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-3">Services</h5>
              <ul className="space-y-2">
                <li><Link href="/services/custom-furniture" className="text-foreground/70 hover:text-accent-primary transition-colors">Custom Furniture</Link></li>
                <li><Link href="/services/decorative-carvings" className="text-foreground/70 hover:text-accent-primary transition-colors">Decorative Carvings</Link></li>
                <li><Link href="/services/architectural-elements" className="text-foreground/70 hover:text-accent-primary transition-colors">Architectural Elements</Link></li>
                <li><Link href="/services/restoration" className="text-foreground/70 hover:text-accent-primary transition-colors">Restoration</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-3">Contact</h5>
              <address className="text-foreground/70 not-italic space-y-2">
                <p>123 Timber Lane</p>
                <p>Suite 456</p>
                <p>Oakwood, CA 90210</p>
                <p><a href="tel:+15551234567" className="hover:text-accent-primary transition-colors">(555) 123-4567</a></p>
                <p><a href="mailto:info@elitewoodcraft.com" className="hover:text-accent-primary transition-colors">info@elitewoodcraft.com</a></p>
              </address>
            </div>
          </div>
          <div className="border-t border-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/50 text-sm">© {new Date().getFullYear()} Elite Woodcraft. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
