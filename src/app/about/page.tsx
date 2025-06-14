"use client";

import Link from "next/link";
import AboutBackground from "@/components/backgrounds/AboutBackground"; // Changed import
import { motion } from "framer-motion";
import Header from "../../components/Header";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5">
        {/* Replacing ThreeBackground with AboutBackground */}
        {/* The AboutBackground component has its own styling including height: 70vh */}
        {/* We might need to adjust the section's padding or structure if this doesn't look right */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center" style={{ zIndex: 0 }}> 
          {/* Added zIndex: 0 to ensure it's behind the text content but above page background */}
          <AboutBackground />
        </div>
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Heritage</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Discover the legacy of Elite Woodcraft, based in Liverpool, crafting unique wooden masterpieces for clients worldwide with over three decades of expertise.</motion.p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">A Legacy of Craftsmanship</h3>
              <p className="text-foreground/80 mb-4">Founded in 1987 by master woodcarver Edward Langston, Elite Woodcraft was born from a deep reverence for the timeless art of woodworking. What began as a small workshop in Liverpool has grown into a globally recognized atelier, celebrated for creating unique, bespoke wooden masterpieces.</p>
              <p className="text-foreground/80">Edward's vision was simple yet profound: to preserve traditional carving techniques while embracing bespoke design tailored to each client's vision, ensuring no two pieces are ever identical. Today, under the guidance of his son, Michael Langston, we continue to honor that legacy with every piece we create.</p>
            </motion.div>
            <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-row-reverse mb-12">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">Our Philosophy</h3>
              <p className="text-foreground/80 mb-4">At Elite Woodcraft, we believe that true luxury lies in the details. Each piece is meticulously crafted by hand, using sustainably sourced premium hardwoods, to ensure not only beauty but also enduring quality and uniqueness.</p>
              <p className="text-foreground/80">We view every project as a collaboration with our clients, transforming their ideas into one-of-a-kind works of art that reflect personal style and heritage. Our commitment to excellence means we never compromise on craftsmanship, delivering pieces that become cherished heirlooms.</p>
            </motion.div>
            <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">Our Artisans</h3>
              <p className="text-foreground/80 mb-4">Our team of master artisans brings decades of combined experience to every project. Trained in both traditional and contemporary techniques, they possess an unparalleled dedication to their craft.</p>
              <p className="text-foreground/80">From intricate decorative carvings to grand architectural elements, our artisans approach each piece with precision and passion, ensuring that every cut, joint, and finish meets the highest standards of excellence.</p>
            </motion.div>
            <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-8 bg-foreground/5">
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Core Values</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Craftsmanship</h4>
              <p className="text-foreground/80">Unwavering dedication to the art of woodcarving, preserving time-honored techniques with meticulous attention to detail.</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Sustainability</h4>
              <p className="text-foreground/80">Commitment to responsible sourcing, using only premium hardwoods from sustainable forests to protect our natural heritage.</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Bespoke Design</h4>
              <p className="text-foreground/80">Tailoring every piece to the unique vision of our clients, ensuring each creation is a personal reflection of style and taste.</p>
            </motion.div>
          </div>
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
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Collaborate With Us</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Experience the artistry of Elite Woodcraft firsthand. Commission a custom piece that embodies your vision with our unparalleled craftsmanship.</p>
          <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-4 sm:px-8 bg-foreground/5 border-t border-foreground/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-serif font-bold text-accent-primary mb-4">Elite Woodcraft</h4>
              <p className="text-foreground/70 mb-4">Liverpool-based craftsmanship, creating unique wooden masterpieces for discerning clients worldwide.</p>
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
