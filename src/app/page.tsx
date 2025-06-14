"use client";

import Link from "next/link";
import HomeBackground from "../components/backgrounds/HomeBackground";
import { motion } from "framer-motion";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative"> {/* Added position: relative for z-index context if needed, though HomeBackground is fixed */}
      <HomeBackground /> {/* Moved HomeBackground to be a direct child */}
      <Header />

      {/* Hero Section */}
      {/* HomeBackground is now a global background for this page */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-transparent z-10"> {/* Made bg-transparent, added z-index */}
        {/* Removed HomeBackground from here */}
        <div className="container mx-auto px-4 sm:px-8 text-center relative"> {/* Removed zIndex: 10, relies on parent's zIndex */}
          <motion.h2 
            className="text-4xl md:text-6xl font-serif font-bold text-accent-primary mb-6 hero-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >One-of-a-Kind Woodcarving Masterpieces</motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
          >From Liverpool to the world, Elite Woodcraft creates bespoke, unique wooden masterpieces for discerning clients who value unparalleled artistry in every detail.</motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link href="/shop" className="bg-accent-primary text-background px-6 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors text-center">Explore Our Collection</Link>
            <Link href="/contact" className="border-2 border-accent-primary text-accent-primary px-6 py-3 rounded-md font-medium hover:bg-accent-primary/10 transition-colors text-center">Request Custom Piece</Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 px-4 sm:px-8 bg-background relative z-10"> {/* Added relative and z-index */}
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Signature Craftsmanship</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md h-64 bg-foreground/10 mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="absolute bottom-4 left-4 text-background font-bold opacity-0 group-hover:opacity-100 transition-opacity">Animal Carvings</p>
              </div>
              <h4 className="text-xl font-serif font-semibold text-foreground mb-2">Animal Carvings</h4>
              <p className="text-foreground/70">Lifelike animal sculptures, meticulously carved and painted to capture every detail, creating unique masterpieces.</p>
            </motion.div>
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md h-64 bg-foreground/10 mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="absolute bottom-4 left-4 text-background font-bold opacity-0 group-hover:opacity-100 transition-opacity">Religious Statues</p>
              </div>
              <h4 className="text-xl font-serif font-semibold text-foreground mb-2">Religious Statues</h4>
              <p className="text-foreground/70">Sacred carvings for churches and personal devotion, crafted with reverence and exceptional skill.</p>
            </motion.div>
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden rounded-lg shadow-md h-64 bg-foreground/10 mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="absolute bottom-4 left-4 text-background font-bold opacity-0 group-hover:opacity-100 transition-opacity">Custom Furniture</p>
              </div>
              <h4 className="text-xl font-serif font-semibold text-foreground mb-2">Custom Furniture</h4>
              <p className="text-foreground/70">Handcrafted tables, chairs, and cabinets tailored to your vision, ensuring no two pieces are ever identical.</p>
            </motion.div>
          </div>
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/portfolio" className="inline-block border border-accent-primary text-accent-primary px-6 py-2 rounded-md hover:bg-accent-primary/10 transition-colors">View Full Portfolio</Link>
          </motion.div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 px-4 sm:px-8 bg-foreground/5 relative z-10"> {/* Added relative and z-index */}
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Heritage of Craftsmanship</h3>
            <p className="text-foreground/80 mb-4">Based in Liverpool, Elite Woodcraft has over three decades of dedication to the art of woodcarving, serving clients worldwide with traditional techniques and bespoke designs.</p>
            <p className="text-foreground/80 mb-6">Each piece is a unique masterpiece, crafted with meticulous attention to detail using sustainably sourced premium hardwoods, ensuring no two creations are ever identical.</p>
            <Link href="/about" className="inline-block text-accent-primary font-medium hover:underline">Learn Our Story →</Link>
          </motion.div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-8 bg-background relative z-10"> {/* Added relative and z-index */}
        <div className="container mx-auto">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Client Appreciation</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p className="italic text-foreground/80 mb-4">'The custom dining table from Elite Woodcraft is a masterpiece. The craftsmanship and attention to detail exceeded our highest expectations.'</p>
              <p className="font-bold text-foreground">- Margaret R., Interior Designer</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="italic text-foreground/80 mb-4">'We commissioned a carved mantel for our estate, and the result is breathtaking. Their expertise transformed our vision into reality.'</p>
              <p className="font-bold text-foreground">- Edward T., Homeowner</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-8 bg-accent-primary/10 relative z-10"> {/* Added relative and z-index */}
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Commission Your Masterpiece</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Collaborate with our master artisans to create bespoke woodwork that reflects your unique style and vision.</p>
          <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>
        </motion.div>
      </section>

      {/* Removed GSAP ScrollTrigger Initialization in favor of Framer Motion */}

      {/* Footer Section */}
      <footer className="py-8 px-4 sm:px-8 bg-foreground/5 border-t border-foreground/10 relative z-10"> {/* Added relative and z-index */}
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
