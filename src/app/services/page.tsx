"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import "./services.css";
import Header from "../../components/Header";

const ThreeBackground = dynamic(() => import("../../components/ThreeBackground"), { ssr: false });

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen text-foreground relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* Full Page Background with Subtle Animation */}
      <div className="services-background">
        <ThreeBackground sceneType="shop" />
      </div>
      <div className="services-content">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-8 bg-foreground/5 overflow-hidden" style={{ zIndex: 5 }}>
        <div className="container mx-auto relative">
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Craftsmanship Services</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Discover the range of bespoke woodcarving services offered by Elite Woodcraft, based in Liverpool, tailored to bring your vision to life with unparalleled artistry for clients worldwide.</motion.p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Services</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: Custom Furniture */}
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Custom Furniture</h4>
              <p className="text-foreground/80 mb-4">Placeholder: We design and craft bespoke furniture pieces tailored to your specifications, from elegant dining tables to intricate chairs, using premium hardwoods for lasting beauty and durability.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include personalized design, exceptional craftsmanship, and pieces that become family heirlooms. Examples include custom oak dining sets and walnut desks.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $2,500 (varies by complexity and materials).</p>
              <Link href="/commission" className="text-accent-primary font-medium hover:underline">Request a Custom Piece →</Link>
            </motion.div>
            {/* Service 2: Decorative Carvings */}
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Decorative Carvings</h4>
              <p className="text-foreground/80 mb-4">Placeholder: Our decorative carvings add a touch of artistry to any space, including wall sculptures, ornate frames, and standalone pieces crafted with meticulous detail.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include unique aesthetic enhancements and custom designs that reflect personal style. Examples include cherry wood wall art and maple figurines.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $800 (varies by size and intricacy).</p>
              <Link href="/commission" className="text-accent-primary font-medium hover:underline">Commission a Piece →</Link>
            </motion.div>
            {/* Service 3: Architectural Elements */}
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Architectural Elements</h4>
              <p className="text-foreground/80 mb-4">Placeholder: We create custom architectural elements such as mantels, staircases, and door frames, enhancing the structural beauty of homes and commercial spaces with hand-carved details.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include seamless integration with existing architecture and elevated property value. Examples include mahogany stair balustrades and oak door surrounds.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $3,000 (varies by scope and materials).</p>
              <Link href="/commission" className="text-accent-primary font-medium hover:underline">Explore Options →</Link>
            </motion.div>
            {/* Service 4: Restoration */}
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Restoration</h4>
              <p className="text-foreground/80 mb-4">Placeholder: Our restoration services breathe new life into antique or damaged wooden pieces, preserving their historical value while restoring functionality and beauty.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include maintaining heritage, expert matching of original techniques, and sustainable preservation. Examples include restoring Victorian furniture and colonial door frames.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $1,000 (varies by condition and complexity).</p>
              <Link href="/contact" className="text-accent-primary font-medium hover:underline">Request Restoration →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section className="py-24 px-4 sm:px-8 bg-foreground/5">
        <div className="container mx-auto max-w-4xl">
          <motion.h3 
            className="text-3xl font-serif font-bold text-accent-primary mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Workshops & Classes</motion.h3>
          <motion.div 
            className="p-6 rounded-lg shadow-md bg-background"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Learn the Art of Woodcarving</h4>
            <p className="text-foreground/80 mb-4">Placeholder: We offer workshops and classes for enthusiasts of all skill levels, from beginners to advanced carvers, teaching traditional techniques and modern approaches to woodcraft.</p>
            <p className="text-foreground/80 mb-4">Placeholder: Benefits include hands-on learning, personalized instruction from master artisans, and the opportunity to create your own wooden piece. Classes are held monthly at our Liverpool studio.</p>
            <p className="text-foreground/80 mb-2">Placeholder: Workshop Fee: $250 for a weekend session (materials included).</p>
            <Link href="/contact" className="text-accent-primary font-medium hover:underline">Register Interest →</Link>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 sm:px-8 bg-accent-primary/10">
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-6">Ready to Begin Your Project?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Placeholder: Contact us to discuss your vision for a custom woodcarving piece or to enroll in one of our upcoming workshops. Let’s create something extraordinary together.</p>
          <Link href="/commission" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Commission a Piece</Link>
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
          {/* Newsletter Signup in Footer */}
          <div className="mt-8 flex flex-col md:flex-row gap-3 justify-center">
            <input type="email" placeholder="Subscribe to Newsletter" className="flex-1 px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required />
            <button type="submit" className="bg-accent-primary text-background px-6 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Subscribe</button>
          </div>
          <p className="text-foreground/60 text-sm mt-3 text-center">We respect your privacy and will never share your information.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}
