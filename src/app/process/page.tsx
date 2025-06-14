"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Header from "../../components/Header";

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stepsRef.current) {
        const stepItems = gsap.utils.toArray<HTMLElement>('.step-item');
        if (stepItems.length > 0) {
          gsap.fromTo(
            stepItems,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.1,
              delay: 0.2,
              scrollTrigger: {
                trigger: stepsRef.current,
                start: "top 80%",
                once: true,
              }
            }
          );
        }
      }

      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(refreshTimeout);
    }, stepsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 bg-foreground/5">
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
          <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>
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
