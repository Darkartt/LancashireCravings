"use client";

import Link from "next/link";
import Image from "next/image";
import AboutBackground from "../../components/backgrounds/AboutBackground";
import { MotionDiv } from "@/components/MotionContainer";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen text-foreground" style={{ background: 'transparent' }}>
      <Header />      {/* Hero Section */}
      <section className="relative pt-40 pb-16 px-4 sm:px-8 bg-foreground/5">
        {/* Replacing ThreeBackground with AboutBackground */}
        {/* The AboutBackground component has its own styling including height: 70vh */}
        {/* We might need to adjust the section's padding or structure if this doesn't look right */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center" style={{ zIndex: 0 }}> 
          {/* Added zIndex: 0 to ensure it's behind the text content but above page background */}
          <AboutBackground />
        </div>
        <div className="container mx-auto relative" style={{ zIndex: 10 }}>
          <MotionDiv as="h2" 
            className="text-4xl font-serif font-bold text-accent-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >Our Heritage</MotionDiv>
          <MotionDiv as="p" 
            className="text-lg text-foreground/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >Discover the legacy of Lancaster Carving Limited, based in Mold, United Kingdom, crafting unique wooden masterpieces for clients worldwide with over three decades of expertise.</MotionDiv>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <MotionDiv 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">A Legacy of Craftsmanship</h3>
              <p className="text-foreground/80 mb-4">Founded in 2019 by master woodcarver Christian James Lancaster, Lancaster Carving Limited was born from a deep reverence for the timeless art of woodworking. What began as a small workshop in Mold has grown into a respected atelier, celebrated for creating unique, bespoke wooden masterpieces.</p>
              <p className="text-foreground/80">Christian's vision was simple yet profound: to preserve traditional carving techniques while embracing bespoke design tailored to each client's vision, ensuring no two pieces are ever identical. Today, we continue to honor that legacy with every piece we create.</p>
            </MotionDiv>
            <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-row-reverse mb-12">
            <MotionDiv 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">Our Philosophy</h3>
              <p className="text-foreground/80 mb-4">At Lancaster Carving Limited, we believe that true luxury lies in the details. Each piece is meticulously crafted by hand, using sustainably sourced premium hardwoods, to ensure not only beauty but also enduring quality and uniqueness.</p>
              <p className="text-foreground/80">We view every project as a collaboration with our clients, transforming their ideas into one-of-a-kind works of art that reflect personal style and heritage. Our commitment to excellence means we never compromise on craftsmanship, delivering pieces that become cherished heirlooms.</p>
            </MotionDiv>
            <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <MotionDiv 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">Our Artisans</h3>
              <p className="text-foreground/80 mb-4">Our team of master artisans brings decades of combined experience to every project. Trained in both traditional and contemporary techniques, they possess an unparalleled dedication to their craft.</p>
              <p className="text-foreground/80">From intricate decorative carvings to grand architectural elements, our artisans approach each piece with precision and passion, ensuring that every cut, joint, and finish meets the highest standards of excellence.</p>
            </MotionDiv>
            <div className="rounded-lg shadow-lg h-80 bg-foreground/10"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-8 bg-foreground/5">
        <div className="container mx-auto">
          <MotionDiv as="h3" 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >Our Core Values</MotionDiv>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <MotionDiv 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Craftsmanship</h4>
              <p className="text-foreground/80">Unwavering dedication to the art of woodcarving, preserving time-honored techniques with meticulous attention to detail.</p>
            </MotionDiv>
            <MotionDiv 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Sustainability</h4>
              <p className="text-foreground/80">Commitment to responsible sourcing, using only premium hardwoods from sustainable forests to protect our natural heritage.</p>
            </MotionDiv>
            <MotionDiv 
              className="p-6 rounded-lg shadow-md bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-semibold text-foreground mb-3">Bespoke Design</h4>
              <p className="text-foreground/80">Tailoring every piece to the unique vision of our clients, ensuring each creation is a personal reflection of style and taste.</p>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-8 bg-accent-primary/10">
  <MotionDiv 
          className="container mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Collaborate With Us</h3>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">Experience the artistry of Lancaster Carving Limited firsthand. Commission a custom piece that embodies your vision with our unparalleled craftsmanship.</p>
          <Link href="/contact" className="inline-block bg-accent-primary text-background px-8 py-3 rounded-md font-medium hover:bg-accent-primary/90 transition-colors">Request a Consultation</Link>        </MotionDiv>
      </section>

      {/* Community & Inspiration */}
      <section className="py-16 px-4 sm:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <MotionDiv as="h3" 
            className="text-3xl font-serif font-bold text-accent-primary mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >Community & Inspiration</MotionDiv>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <MotionDiv 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/OwlAtNight.jpg`} 
                    alt="Owl at night, a memorial piece" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent rounded-2xl"></div>
              </div>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="p-8 bg-foreground/5 rounded-2xl">
                <h4 className="text-2xl font-serif font-bold text-accent-primary mb-6">In Memory & Celebration</h4>
                <p className="text-foreground/80 leading-relaxed mb-6">
                  "It's true what they say God takes the best first. This poem is for my beautiful cousin Hayley..."
                </p>
                
                <div className="bg-background p-6 rounded-xl border-l-4 border-accent-primary shadow-md">
                  <div className="text-lg font-serif italic text-accent-primary leading-relaxed">
                    "A flower of the moon...<br />
                    With the wind and sun in your hair"
                  </div>
                  <div className="mt-4 text-sm text-foreground/60">
                    — In loving memory
                  </div>
                </div>

                <p className="text-foreground/70 mt-6 leading-relaxed">
                  Every piece we create carries emotion, memory, and meaning. Our work often serves as a bridge between 
                  the physical and spiritual, honoring those we love and celebrating the beauty that surrounds us.
                </p>
              </div>
            </MotionDiv>
          </div>

          <MotionDiv 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto">
              <h4 className="text-xl font-serif font-semibold text-accent-primary mb-4">Creating with Purpose</h4>
              <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                Our craft is more than woodworking—it's about creating meaningful connections, preserving memories, 
                and bringing comfort through the timeless beauty of handcrafted art.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌙</span>
                  </div>
                  <h5 className="text-lg font-serif font-semibold text-accent-primary mb-2">Memorial Pieces</h5>
                  <p className="text-foreground/70">Honoring cherished memories through thoughtful design</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h5 className="text-lg font-serif font-semibold text-accent-primary mb-2">Celebration</h5>
                  <p className="text-foreground/70">Marking life's precious moments with lasting beauty</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <h5 className="text-lg font-serif font-semibold text-accent-primary mb-2">Connection</h5>
                  <p className="text-foreground/70">Building bridges between hearts through handcraft</p>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      <Footer />
    </div>
  );
}
