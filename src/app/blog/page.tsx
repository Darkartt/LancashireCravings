"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import ThreeBackground from "../../components/ThreeBackground";

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen text-foreground relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* Full Page Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1, pointerEvents: 'none', width: '100%', height: '100vh' }}>
        <ThreeBackground sceneType="blog" />
      </div>
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5 overflow-hidden" style={{ zIndex: 5 }}>
        <div className="container mx-auto relative">
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Woodcraft Chronicles</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Dive into the world of Elite Woodcraft with insights on craftsmanship, design inspiration, and the art of bespoke woodcarving.</motion.p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-serif font-semibold text-accent-primary">Recent Articles</h3>
            <div className="flex space-x-4">
              <button className="text-foreground/70 hover:text-foreground border border-foreground/20 px-3 py-1 rounded-md text-sm">All</button>
              <button className="text-foreground/70 hover:text-foreground border border-foreground/20 px-3 py-1 rounded-md text-sm">Techniques</button>
              <button className="text-foreground/70 hover:text-foreground border border-foreground/20 px-3 py-1 rounded-md text-sm">Design</button>
              <button className="text-foreground/70 hover:text-foreground border border-foreground/20 px-3 py-1 rounded-md text-sm">Projects</button>
            </div>
          </motion.div>
          <div className="space-y-12">
            {/* Blog Post 1 */}
            <motion.article 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="relative overflow-hidden rounded-lg shadow-md h-48 bg-foreground/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent-primary text-sm font-medium">Techniques</span>
                    <span className="text-foreground/60 text-sm">June 5, 2025</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent-primary transition-colors">Mastering the Art of Dovetail Joinery</h3>
                  <p className="text-foreground/80 mb-4">Explore the precision and beauty of dovetail joints, a hallmark of fine woodworking that combines strength with aesthetic appeal. Learn the traditional techniques we use to create seamless, enduring furniture pieces.</p>
                  <button className="text-accent-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read More →</button>
                </div>
              </div>
            </motion.article>
            {/* Blog Post 2 */}
            <motion.article 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="relative overflow-hidden rounded-lg shadow-md h-48 bg-foreground/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent-primary text-sm font-medium">Design</span>
                    <span className="text-foreground/60 text-sm">May 28, 2025</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent-primary transition-colors">Incorporating Woodcarvings into Modern Interiors</h3>
                  <p className="text-foreground/80 mb-4">Discover how bespoke woodcarvings can elevate contemporary spaces, blending traditional craftsmanship with modern design sensibilities to create unique, luxurious environments.</p>
                  <button className="text-accent-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read More →</button>
                </div>
              </div>
            </motion.article>
            {/* Blog Post 3 */}
            <motion.article 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="relative overflow-hidden rounded-lg shadow-md h-48 bg-foreground/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-2 right-2 bg-accent-secondary text-background text-xs font-bold px-2 py-1 rounded-md">Featured</div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent-primary text-sm font-medium">Projects</span>
                    <span className="text-foreground/60 text-sm">May 15, 2025</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent-primary transition-colors">Behind the Scenes: Crafting a Grand Oak Dining Set</h3>
                  <p className="text-foreground/80 mb-4">Follow the journey of creating a bespoke dining set for a luxury estate, from selecting the finest oak to the final hand-carved details that make this piece a true heirloom.</p>
                  <button className="text-accent-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read More →</button>
                </div>
              </div>
            </motion.article>
            {/* Blog Post 4 */}
            <motion.article 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="relative overflow-hidden rounded-lg shadow-md h-48 bg-foreground/10">
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-accent-primary text-sm font-medium">Techniques</span>
                    <span className="text-foreground/60 text-sm">April 30, 2025</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent-primary transition-colors">The Beauty of Hand-Carved Inlays</h3>
                  <p className="text-foreground/80 mb-4">Learn about the meticulous process of creating hand-carved inlays, a technique that adds intricate patterns and contrasting woods to elevate the elegance of our pieces.</p>
                  <button className="text-accent-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read More →</button>
                </div>
              </div>
            </motion.article>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button className="bg-accent-primary text-background px-3 py-1 rounded-md text-sm">1</button>
              <button className="text-foreground/70 hover:text-foreground px-3 py-1 rounded-md text-sm">2</button>
              <button className="text-foreground/70 hover:text-foreground px-3 py-1 rounded-md text-sm">Next →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-8 bg-accent-primary/10">
        <motion.div 
          className="container mx-auto text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Stay Updated</h3>
          <p className="text-lg text-foreground/80 mb-6">Subscribe to our newsletter for the latest insights, project reveals, and exclusive offers from Elite Woodcraft.</p>
          <form className="flex flex-col md:flex-row gap-3">
            <input type="email" placeholder="Your Email Address" className="flex-1 px-4 py-3 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required />
            <button type="submit" className="bg-accent-primary text-background px-6 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Subscribe</button>
          </form>
          <p className="text-foreground/60 text-sm mt-3">We respect your privacy and will never share your information.</p>
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
