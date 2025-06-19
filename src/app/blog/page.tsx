"use client";

import { motion } from "framer-motion";
import Header from "../../components/Header";
import BlogBackground from "../../components/backgrounds/BlogBackground";
import Footer from "../../components/Footer";

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen text-foreground relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* Full Page Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1, pointerEvents: 'none', width: '100%', height: '100vh' }}>
        <BlogBackground />
      </div>
      <Header />      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5 overflow-hidden pt-24" style={{ zIndex: 5 }}> {/* Added top padding for header */}
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
          <p className="text-foreground/60 text-sm mt-3">We respect your privacy and will never share your information.</p>        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
