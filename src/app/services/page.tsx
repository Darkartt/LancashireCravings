"use client";

import Link from "next/link";
import { MotionDiv } from "@/components/MotionContainer";
import "./services.css";
import Header from "../../components/Header";
import ServicesBackground from "../../components/backgrounds/ServicesBackground";
import Footer from "../../components/Footer";

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen text-foreground relative overflow-hidden" style={{ background: 'transparent' }}>
      {/* Full Page Background with Subtle Animation */}
      <div className="services-background">
        <ServicesBackground />
      </div>
      <div className="services-content">
      <Header />      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-8 bg-foreground/5 overflow-hidden pt-40" style={{ zIndex: 5 }}> {/* Fixed header clearance */}
        <div className="container mx-auto relative">
          <MotionDiv as="h2"
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >Our Craftsmanship Services</MotionDiv>
          <MotionDiv as="p"
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >Discover the range of bespoke woodcarving services offered by Lancaster Carving Limited, based in Mold, United Kingdom, tailored to bring your vision to life with unparalleled artistry for clients worldwide.</MotionDiv>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-8 bg-background">
        <div className="container mx-auto max-w-5xl">
          <MotionDiv as="h3"
            className="text-3xl font-serif font-bold text-accent-primary mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >Our Services</MotionDiv>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: Custom Furniture */}
            <MotionDiv 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Custom Furniture</h4>
              <p className="text-foreground/80 mb-4">Placeholder: We design and craft bespoke furniture pieces tailored to your specifications, from elegant dining tables to intricate chairs, using premium hardwoods for lasting beauty and durability.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include personalized design, exceptional craftsmanship, and pieces that become family heirlooms. Examples include custom oak dining sets and walnut desks.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $2,500 (varies by complexity and materials).</p>
              <Link href="/commission" className="btn btn-sm btn-secondary">Request a Custom Piece</Link>
            </MotionDiv>
            {/* Service 2: Decorative Carvings */}
            <MotionDiv 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Decorative Carvings</h4>
              <p className="text-foreground/80 mb-4">Placeholder: Our decorative carvings add a touch of artistry to any space, including wall sculptures, ornate frames, and standalone pieces crafted with meticulous detail.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include unique aesthetic enhancements and custom designs that reflect personal style. Examples include cherry wood wall art and maple figurines.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $800 (varies by size and intricacy).</p>
              <Link href="/commission" className="btn btn-sm btn-secondary">Commission a Piece</Link>
            </MotionDiv>
            {/* Service 3: Architectural Elements */}
            <MotionDiv 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Architectural Elements</h4>
              <p className="text-foreground/80 mb-4">Placeholder: We create custom architectural elements such as mantels, staircases, and door frames, enhancing the structural beauty of homes and commercial spaces with hand-carved details.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include seamless integration with existing architecture and elevated property value. Examples include mahogany stair balustrades and oak door surrounds.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $3,000 (varies by scope and materials).</p>
              <Link href="/commission" className="btn btn-sm btn-secondary">Explore Options</Link>
            </MotionDiv>
            {/* Service 4: Restoration */}
            <MotionDiv 
              className="p-6 rounded-lg shadow-md bg-foreground/5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Restoration</h4>
              <p className="text-foreground/80 mb-4">Placeholder: Our restoration services breathe new life into antique or damaged wooden pieces, preserving their historical value while restoring functionality and beauty.</p>
              <p className="text-foreground/80 mb-4">Placeholder: Benefits include maintaining heritage, expert matching of original techniques, and sustainable preservation. Examples include restoring Victorian furniture and colonial door frames.</p>
              <p className="text-foreground/80 mb-2">Placeholder: Starting Price: $1,000 (varies by condition and complexity).</p>
              <Link href="/contact" className="btn btn-sm btn-secondary">Request Restoration</Link>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Workshops Section */}
      <section className="py-24 px-4 sm:px-8 bg-foreground/5">
        <div className="container mx-auto max-w-4xl">
          <MotionDiv as="h3"
            className="text-3xl font-serif font-bold text-accent-primary mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >Workshops & Classes</MotionDiv>
          <MotionDiv 
            className="p-6 rounded-lg shadow-md bg-background"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-serif font-semibold text-foreground mb-4">Learn the Art of Woodcarving</h4>
            <p className="text-foreground/80 mb-4">Placeholder: We offer workshops and classes for enthusiasts of all skill levels, from beginners to advanced carvers, teaching traditional techniques and modern approaches to woodcraft.</p>
            <p className="text-foreground/80 mb-4">Placeholder: Benefits include hands-on learning, personalized instruction from master artisans, and the opportunity to create your own wooden piece. Classes are held monthly at our Liverpool studio.</p>
            <p className="text-foreground/80 mb-2">Placeholder: Workshop Fee: $250 for a weekend session (materials included).</p>
            <Link href="/contact" className="btn btn-sm btn-secondary">Register Interest</Link>
          </MotionDiv>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 sm:px-8 bg-accent-primary/10">
        <MotionDiv 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-6">Ready to Begin Your Project?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Placeholder: Contact us to discuss your vision for a custom woodcarving piece or to enroll in one of our upcoming workshops. Let’s create something extraordinary together.</p>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/commission" className="btn btn-lg btn-primary">Commission a Piece</Link>
          </MotionDiv>        </MotionDiv>
      </section>

      <Footer />
      </div>
    </div>
  );
}
