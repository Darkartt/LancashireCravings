"use client";

import Link from "next/link";
import { useEffect, useRef } from "react"; // Added useEffect, useRef
import { gsap } from "gsap"; // Added gsap
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Ensured ScrollTrigger is imported
import ContactBackground from "../../components/backgrounds/ContactBackground"; // Changed import
import { motion } from "framer-motion";
import Header from "../../components/Header";

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (formRef.current) {
        const formInputs = gsap.utils.toArray<HTMLElement>('.form-input-animate');
        if (formInputs.length > 0) {
          gsap.fromTo(
            formInputs,
            { y: -30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.1,
              delay: 0.2,
              scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
                once: true,
                // markers: true, // Uncomment for debugging
              }
            }
          );
        }
      }

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(refreshTimeout);

    }, formRef); // Scope the context to formRef

    return () => ctx.revert(); // Cleanup GSAP animations and ScrollTriggers
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ContactBackground /> {/* Added new background component here */}
      <Header />

      {/* Hero Section */}
      {/* Removed the old ThreeBackground, ContactBackground is now at the root */}
      <section className="relative py-16 px-4 sm:px-8 bg-transparent"> {/* Made hero background transparent */}
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Connect With Us</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Reach out to Elite Woodcraft for bespoke woodcarving commissions, consultations, or inquiries. We're here to bring your vision to life.</motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-background"> {/* Added relative z-10 */}
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-serif font-semibold text-accent-primary mb-4">Contact Information</h3>
              <address className="text-foreground/80 not-italic space-y-3 mb-6">
                <p>123 Timber Lane</p>
                <p>Suite 456</p>
                <p>Oakwood, CA 90210</p>
                <p><a href="tel:+15551234567" className="hover:text-accent-primary transition-colors">(555) 123-4567</a></p>
                <p><a href="mailto:info@elitewoodcraft.com" className="hover:text-accent-primary transition-colors">info@elitewoodcraft.com</a></p>
              </address>
              <h3 className="text-xl font-serif font-semibold text-accent-primary mb-4">Hours</h3>
              <p className="text-foreground/80">Monday - Friday: 9am - 5pm PST</p>
              <p className="text-foreground/80">Saturday: By Appointment</p>
              <p className="text-foreground/80">Sunday: Closed</p>
            </motion.div>
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-serif font-semibold text-accent-primary mb-6">Request a Consultation</h3>
              <form ref={formRef} className="space-y-6"> {/* Added ref to form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-foreground/80 mb-1">Full Name</label>
                    <input type="text" id="name" className="form-input-animate w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-foreground/80 mb-1">Email Address</label>
                    <input type="email" id="email" className="form-input-animate w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-foreground/80 mb-1">Phone Number</label>
                  <input type="tel" id="phone" className="form-input-animate w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" />
                </div>
                <div>
                  <label htmlFor="project-type" className="block text-foreground/80 mb-1">Project Type</label>
                  <select id="project-type" className="form-input-animate w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required>
                    <option value="">Select a Project Type</option>
                    <option value="furniture">Custom Furniture</option>
                    <option value="decorative">Decorative Carvings</option>
                    <option value="architectural">Architectural Elements</option>
                    <option value="restoration">Restoration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-foreground/80 mb-1">Project Details</label>
                  <textarea id="message" rows={4} className="form-input-animate w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required placeholder="Please describe your project, including any specific materials, dimensions, or design preferences."></textarea>
                </div>
                <div className="flex justify-center">
                  <button type="submit" className="form-input-animate bg-accent-primary text-background px-6 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Submit Request</button>
                </div>
              </form>
              <p className="text-foreground/70 text-sm mt-4">We will respond to your inquiry within 1-2 business days.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-accent-primary/10"> {/* Added relative z-10 */}
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Ready to Start Your Project?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Our team is eager to discuss your vision and provide expert guidance on custom woodcarving solutions.</p>
          <button className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Call Us Now: (555) 123-4567</button>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 py-8 px-4 sm:px-8 bg-foreground/5 border-t border-foreground/10"> {/* Added relative z-10 */}
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
