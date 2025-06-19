"use client";

import Link from "next/link";
import AboutBackground from "@/components/backgrounds/AboutBackground"; // Changed import
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-8 bg-foreground/5">
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
          >Discover the legacy of Elite Woodcraft, based in Liverpool, crafting unique wooden masterpieces for clients worldwide with over three decades of expertis'e.</motion.p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
              transition={{ duration: 0.5, delay: 0.3 }}
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
              transition={{ duration: 0.5, delay: 0.4 }}
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
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >Our Core Values</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Craftsmanship</h4>
              <p className="text-foreground/80">Unwavering dedication to the art of woodcarving, preserving time-honored techniques with meticulous attention to detail.</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Sustainability</h4>
              <p className="text-foreground/80">Commitment to responsible sourcing, using only premium hardwoods from sustainable forests to protect our natural heritage.</p>
            </motion.div>
            <motion.div 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
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
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Collaborate With Us</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Experience the artistry of Elite Woodcraft firsthand. Commission a custom piece that embodies your vision with our unparalleled craftsmanship.</p>
          <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
