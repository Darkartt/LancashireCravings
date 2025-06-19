"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProcessBackground from "../../components/backgrounds/ProcessBackground";

export default function Process() {
  const stepsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ProcessBackground />
      <Header />{/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5 pt-24"> {/* Added top padding for header */}
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <motion.h2 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Craftsmanship Process</motion.h2>
          <motion.p 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Discover the meticulous journey of creating bespoke wooden masterpieces at Elite Woodcraft, from initial concept to final installation.</motion.p>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-16 px-4 sm:px-8 bg-background" ref={stepsRef}>
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-16">
            <div className="step-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">1. Consultation & Vision</h3>
                <p className="text-foreground/80 mb-4">Every project begins with a detailed consultation. We listen to your ideas, preferences, and requirements to understand your vision. Whether it's a piece of furniture, a decorative carving, or an architectural element, we ensure your personality and style are reflected in the design.</p>
                <p className="text-foreground/80">Our team provides expert guidance on materials, dimensions, and finishes, often presenting initial sketches or digital renderings to visualize the concept.</p>
              </div>
            </div>
            <div className="step-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-row-reverse">
              <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">2. Design & Planning</h3>
                <p className="text-foreground/80 mb-4">Once the concept is finalized, our designers create detailed blueprints and 3D models. This stage involves close collaboration with you to refine every detail, ensuring the design aligns perfectly with your vision and space.</p>
                <p className="text-foreground/80">We select premium, sustainably sourced hardwoods and plan the carving techniques that will bring the design to life, balancing aesthetics with structural integrity.</p>
              </div>
            </div>
            <div className="step-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">3. Material Selection</h3>
                <p className="text-foreground/80 mb-4">The choice of wood is critical to the beauty and longevity of each piece. We source only the finest hardwoods from sustainable forests, such as oak, walnut, cherry, and mahogany, ensuring exceptional grain and durability.</p>
                <p className="text-foreground/80">Each piece of timber is carefully inspected for quality, ensuring it meets our exacting standards before craftsmanship begins.</p>
              </div>
            </div>
            <div className="step-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-row-reverse">
              <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">4. Handcrafting & Carving</h3>
                <p className="text-foreground/80 mb-4">Our master artisans bring the design to life using a blend of traditional hand-carving techniques and precision tools. Every cut, joint, and detail is executed with meticulous care, often taking weeks or months for intricate pieces.</p>
                <p className="text-foreground/80">This stage is where the unique character of your piece emerges, with each carving telling a story through its craftsmanship.</p>
              </div>
            </div>
            <div className="step-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">5. Finishing & Refinement</h3>
                <p className="text-foreground/80 mb-4">After carving, the piece undergoes sanding, staining, and finishing to enhance its natural beauty and protect it for generations. We use eco-friendly finishes that highlight the wood's grain while ensuring durability.</p>
                <p className="text-foreground/80">Multiple layers of finish are applied by hand, with careful attention to achieving the perfect tone and texture as envisioned in the design phase.</p>
              </div>
            </div>
            <div className="step-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-row-reverse">
              <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">6. Quality Assurance</h3>
                <p className="text-foreground/80 mb-4">Before delivery, every piece is rigorously inspected to ensure it meets our uncompromising standards. We check for structural integrity, finish quality, and fidelity to the original design.</p>
                <p className="text-foreground/80">This step ensures that the final product is not only a work of art but also a functional, lasting piece that exceeds your expectations.</p>
              </div>
            </div>
            <div className="step-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">7. Delivery & Installation</h3>
                <p className="text-foreground/80 mb-4">We take great care in packaging and delivering your piece, whether it's to a local residence or an international destination. For larger or architectural pieces, our team provides professional installation to ensure a perfect fit.</p>
                <p className="text-foreground/80">Our commitment doesn't end at delivery—we follow up to ensure your complete satisfaction with the final result.</p>
              </div>
            </div>
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
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Ready to Begin Your Project?</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Experience our detailed craftsmanship process firsthand. Let's collaborate to create a bespoke piece that reflects your vision.</p>
          <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
