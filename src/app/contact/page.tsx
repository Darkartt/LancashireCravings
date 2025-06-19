"use client";

import ContactBackground from "../../components/backgrounds/ContactBackground";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ContactBackground />
      <Header />      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-transparent pt-24"> {/* Added top padding for header */}
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
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-background">
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
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="name" className="block text-foreground/80 mb-1">Full Name</label>
                    <input type="text" id="name" className="w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <label htmlFor="email" className="block text-foreground/80 mb-1">Email Address</label>
                    <input type="email" id="email" className="w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required />
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="phone" className="block text-foreground/80 mb-1">Phone Number</label>
                  <input type="tel" id="phone" className="w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="project-type" className="block text-foreground/80 mb-1">Project Type</label>
                  <select id="project-type" className="w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required>
                    <option value="">Select a Project Type</option>
                    <option value="furniture">Custom Furniture</option>
                    <option value="decorative">Decorative Carvings</option>
                    <option value="architectural">Architectural Elements</option>
                    <option value="restoration">Restoration</option>
                    <option value="other">Other</option>
                  </select>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <label htmlFor="message" className="block text-foreground/80 mb-1">Project Details</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-2 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 bg-background text-foreground" required placeholder="Please describe your project, including any specific materials, dimensions, or design preferences."></textarea>
                </motion.div>
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <button type="submit" className="bg-accent-primary text-background px-6 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Submit Request</button>
                </motion.div>
              </form>
              <p className="text-foreground/70 text-sm mt-4">We will respond to your inquiry within 1-2 business days.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-16 px-4 sm:px-8 bg-accent-primary/10">
        <motion.div 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Ready to Start Your Project?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Our team is eager to discuss your vision and provide expert guidance on custom woodcarving solutions.</p>
          <button className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Call Us Now: (555) 123-4567</button>        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
