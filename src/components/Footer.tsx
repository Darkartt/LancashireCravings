"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-8 bg-foreground/5 border-t border-foreground/10 relative z-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h5 className="font-bold text-foreground mb-3">Explore</h5>
            <ul className="space-y-2">
              <li><Link href="/portfolio" className="text-foreground/70 hover:text-accent-primary transition-colors">Portfolio</Link></li>
              <li><Link href="/services" className="text-foreground/70 hover:text-accent-primary transition-colors">Services</Link></li>
              <li><Link href="/process" className="text-foreground/70 hover:text-accent-primary transition-colors">Process</Link></li>
              <li><Link href="/shop" className="text-foreground/70 hover:text-accent-primary transition-colors">Shop</Link></li>
              <li><Link href="/blog" className="text-foreground/70 hover:text-accent-primary transition-colors">Blog</Link></li>
              <li><Link href="/about" className="text-foreground/70 hover:text-accent-primary transition-colors">About Us</Link></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h5 className="font-bold text-foreground mb-3">Services</h5>
            <ul className="space-y-2">
              <li><Link href="/services/custom-furniture" className="text-foreground/70 hover:text-accent-primary transition-colors">Custom Furniture</Link></li>
              <li><Link href="/services/decorative-carvings" className="text-foreground/70 hover:text-accent-primary transition-colors">Decorative Carvings</Link></li>
              <li><Link href="/services/architectural-elements" className="text-foreground/70 hover:text-accent-primary transition-colors">Architectural Elements</Link></li>
              <li><Link href="/services/restoration" className="text-foreground/70 hover:text-accent-primary transition-colors">Restoration</Link></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h5 className="font-bold text-foreground mb-3">Contact</h5>
            <address className="text-foreground/70 not-italic space-y-2">
              <p>123 Timber Lane</p>
              <p>Suite 456</p>
              <p>Oakwood, CA 90210</p>
              <p><a href="tel:+15551234567" className="hover:text-accent-primary transition-colors">(555) 123-4567</a></p>
              <p><a href="mailto:info@elitewoodcraft.com" className="hover:text-accent-primary transition-colors">info@elitewoodcraft.com</a></p>
            </address>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-foreground/50 text-sm">© {new Date().getFullYear()} Elite Woodcraft. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
