"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HomeBackground from "../components/backgrounds/HomeBackground";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative" style={{ zIndex: 0, position: 'relative' }}>
      <HomeBackground />
      <Header />      {/* Hero Section - Enhanced Full-Height Immersive */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center bg-transparent z-10 pt-24 pb-32 hero-parallax">
        <div className="container mx-auto px-6 sm:px-12 text-center max-w-6xl">
          <div
            className="mb-6"
            data-animate-scale
          >
            <span className="inline-block px-6 py-2 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium tracking-wider uppercase border border-accent-primary/20">
              Master Craftsman Since 1987
            </span>
          </div>
          
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-accent-primary mb-8 hero-title leading-tight"
            data-animate-fade-up
          >
            Handcrafted
            <span className="block text-foreground/90">Heirloom</span>
            <span className="block text-accent-secondary">Masterpieces</span>
          </h1>
          
          <p
            className="text-xl md:text-2xl lg:text-3xl text-foreground/80 max-w-4xl mx-auto mb-12 hero-subtitle leading-relaxed"
            data-animate-fade-up
          >
            From our Liverpool workshop to discerning collectors worldwide, we transform sustainably-sourced hardwoods into 
            <span className="text-accent-primary font-semibold"> one-of-a-kind sculptural treasures</span> that tell your story.
          </p>

          {/* Social Proof */}
          <div
            className="mb-12 text-foreground/60"
            data-animate-fade-in
          >
            <span className="text-sm tracking-wide">As featured in</span>
            <div className="flex justify-center items-center gap-8 mt-4 opacity-70">
              <span className="font-serif italic">Woodworking Today</span>
              <span className="font-serif italic">Artisan Quarterly</span>
              <span className="font-serif italic">Fine Crafts Magazine</span>
            </div>
          </div>
          
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center hero-buttons max-w-2xl mx-auto"
            data-animate-fade-up
          >
            <Link href="/commission" className="bg-accent-primary text-background px-10 py-5 rounded-xl font-semibold hover:bg-accent-primary/90 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
              Commission Custom Piece
            </Link>
            <Link href="#portfolio" className="border-2 border-accent-primary text-accent-primary px-10 py-5 rounded-xl font-semibold hover:bg-accent-primary/10 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
              Explore Collection
            </Link>
          </div>
          
          {/* Enhanced Scroll Indicator */}
          <div 
            className="mt-20 flex flex-col items-center"
            data-animate-fade-in
          >
            <div className="flex flex-col items-center animate-bounce">
              <div className="w-6 h-10 border-2 border-accent-primary rounded-full flex justify-center">
                <div className="w-1 h-3 bg-accent-primary rounded-full mt-2 animate-pulse"></div>
              </div>
              <span className="text-xs text-foreground/60 mt-4 tracking-wider uppercase">Discover Our Craft</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Process Section with Timeline */}
      <section id="process" className="py-32 px-6 sm:px-12 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border-t border-foreground/10">
        <div className="container mx-auto max-w-7xl">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-8">
              From Vision to Heirloom
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Every masterpiece begins with a conversation and culminates in a legacy piece that will be treasured for generations.
            </p>
          </motion.div>

          {/* Process Timeline */}
          <div className="relative">
            <div className="space-y-24">
              {/* Step 1 */}
              <motion.div 
                className="flex flex-col lg:flex-row items-center gap-12"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="lg:w-1/2 text-center lg:text-right">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary text-background rounded-full text-4xl mb-6 shadow-lg">
                    📝
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Discovery & Consultation</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                    We begin every project by listening to your story, understanding your vision, and exploring how the piece will live in your space.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                    <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-foreground/40">Design consultation & sketching</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="flex flex-col lg:flex-row-reverse items-center gap-12"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="lg:w-1/2 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-secondary text-background rounded-full text-4xl mb-6 shadow-lg">
                    🪵
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Material Selection</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                    Together, we select the perfect wood species for your project. Each piece of timber is chosen for its unique grain and character.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                    <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-foreground/40">Wood selection & grain matching</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                className="flex flex-col lg:flex-row items-center gap-12"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="lg:w-1/2 text-center lg:text-right">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary text-background rounded-full text-4xl mb-6 shadow-lg">
                    🪚
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-accent-primary mb-4">Master Craftsmanship</h3>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                    Our master artisans employ time-honored techniques passed down through generations. Every detail is executed by hand.
                  </p>
                </div>
                <div className="lg:w-1/2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                    <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-foreground/40">Hand-carving in progress</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>          {/* Sustainability Commitment */}
          <div 
            className="mt-24 p-12 bg-background rounded-3xl shadow-lg border border-foreground/10"
            data-animate-fade-up
          >
            <div className="text-center">
              <h3 className="text-3xl font-serif font-bold text-accent-primary mb-6">Our Sustainability Promise</h3>
              <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Every piece of wood we use is sustainably sourced from certified forestry operations. We believe in honoring both the craft 
                and the environment that provides our materials.
              </p>
            </div>
          </div>
        </div>
      </section>{/* Enhanced Portfolio Section with Case Studies */}
      <section id="portfolio" className="py-32 px-6 sm:px-12 bg-background border-t border-foreground/10">
        <div className="container mx-auto max-w-7xl">          <h2 
            className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-16 text-center"
            data-animate-fade-up
          >
            Masterpiece Collection
          </h2>
          
          <p 
            className="text-xl text-foreground/70 text-center max-w-3xl mx-auto mb-20 leading-relaxed"
            data-animate-fade-up
          >
            Each piece in our collection represents years of experience, countless hours of meticulous craftsmanship, 
            and an unwavering commitment to excellence. These are not just sculptures—they are stories carved in wood.
          </p>

          {/* Featured Case Study */}
          <div 
            className="mb-24 p-8 md:p-12 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 rounded-3xl border border-foreground/10"
            data-animate-fade-up
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium mb-6">
                  Featured Commission
                </span>
                <h3 className="text-4xl font-serif font-bold text-accent-primary mb-6">
                  "The Guardian Oak"
                </h3>
                <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
                  <p>
                    Commissioned by the Thornfield Estate in 2023, this 8-foot oak sculpture represents the ancient guardian 
                    spirit of their 200-year-old property. Carved from a single piece of English oak that fell naturally 
                    on the estate itself, the piece incorporates intricate Celtic knotwork and wildlife motifs.
                  </p>
                  <p>
                    The project required 6 months of meticulous work, including consultations with local historians 
                    and naturalists to ensure every detail reflected the land's unique heritage. The piece now serves 
                    as the centerpiece of the estate's grand entrance hall.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Materials</h4>
                    <p className="text-foreground/60">Estate-grown English Oak, 200+ years old</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Dimensions</h4>
                    <p className="text-foreground/60">8' H × 3' W × 2' D</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Techniques</h4>
                    <p className="text-foreground/60">Traditional chisel work, Celtic knotwork</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Finish</h4>
                    <p className="text-foreground/60">Hand-rubbed tung oil, natural wax</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                  <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                    <span className="text-foreground/40 text-center px-4">The Guardian Oak - Completed piece</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                    <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-foreground/40 text-xs text-center px-2">Detail: Celtic knotwork</span>
                    </div>
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                    <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-foreground/40 text-xs text-center px-2">Process: Rough carving</span>
                    </div>
                  </div>
                </div>              </div>
            </div>
          </div>

          {/* Portfolio Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">            <div 
              className="group cursor-pointer"
              data-animate-fade-up
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5] bg-foreground/10 flex items-center justify-center">
                  <span className="text-foreground/40 text-center px-4">Sculptural Figures</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-2xl font-serif font-bold text-accent-primary mb-3 group-hover:text-accent-secondary transition-colors">
                Sculptural Figures
              </h4>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Lifelike human and animal figures that capture movement, emotion, and character. Each piece tells a story 
                through carefully observed details and masterful proportions.
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/60">
                <span>• Wildlife sculptures</span>
                <span>• Portrait figures</span>
                <span>• Abstract forms</span>
              </div>
            </div>

            <div 
              className="group cursor-pointer"
              data-animate-fade-up
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5] bg-foreground/10 flex items-center justify-center">
                  <span className="text-foreground/40 text-center px-4">Architectural Elements</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-2xl font-serif font-bold text-accent-primary mb-3 group-hover:text-accent-secondary transition-colors">
                Architectural Elements
              </h4>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Carved elements that enhance architectural spaces—from ornate mantels and decorative panels 
                to custom millwork that transforms ordinary spaces into extraordinary ones.
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/60">
                <span>• Fireplace mantels</span>
                <span>• Decorative panels</span>
                <span>• Door surrounds</span>
              </div>
            </div>

            <div 
              className="group cursor-pointer"
              data-animate-fade-up
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5] bg-foreground/10 flex items-center justify-center">
                  <span className="text-foreground/40 text-center px-4">Heirloom Furniture</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-2xl font-serif font-bold text-accent-primary mb-3 group-hover:text-accent-secondary transition-colors">
                Heirloom Furniture
              </h4>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Functional art pieces designed to be passed down through generations. Each piece combines 
                structural integrity with beautiful carved details that improve with age.
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/60">                <span>• Dining tables</span>
                <span>• Carved chairs</span>
                <span>• Storage pieces</span>
              </div>
            </div>
          </div>          {/* Portfolio Statistics */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center"
            data-animate-fade-up
          >
            <div>
              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">500+</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Completed Pieces</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">35+</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">25+</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Countries Served</div>
            </div>
            <div>              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">100%</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Sustainable Wood</div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/portfolio" className="inline-flex items-center gap-2 bg-accent-primary text-background px-12 py-5 rounded-xl font-semibold hover:bg-accent-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
              Explore Complete Portfolio
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>      {/* About Section - Enhanced with Craftsman Story */}
      <section id="about" className="py-32 px-6 sm:px-12 bg-background border-t border-foreground/10">
        <div className="container mx-auto max-w-7xl">
          <h2 
            className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-16 text-center"
            data-animate-fade-up
          >
            The Craftsman's Story
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div
              className="order-2 lg:order-1"
              data-animate-slide-left
            >
              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                <p className="text-xl font-semibold text-accent-primary mb-6">
                  "Every piece of wood has a story waiting to be revealed. My role is simply to listen and carve away everything that doesn't belong."
                </p>
                <p>
                  For over three decades, Master Craftsman Edward Langston has dedicated his life to the ancient art of woodcarving. 
                  What began as childhood fascination with his grandfather's whittling knife has evolved into a world-renowned workshop 
                  that serves collectors, institutions, and discerning clients across six continents.
                </p>
                <p>
                  Our Liverpool workshop, now led by Edward's son Michael, continues this legacy of excellence. We work exclusively 
                  with sustainably sourced hardwoods—each plank carefully selected for its grain, character, and story. From the 
                  rich warmth of American walnut to the striking figure of European olive, every material becomes part of the 
                  narrative we create together.
                </p>
                <p>
                  We believe in the marriage of time-honored tradition and thoughtful innovation. Our techniques have been passed 
                  down through generations, yet each piece incorporates contemporary design sensibilities that speak to modern life. 
                  The result is artwork that honors the past while embracing the future—true heirlooms in every sense.
                </p>
              </div>
              
              {/* Workshop Glimpse */}
              <div className="mt-10 p-6 bg-accent-primary/5 rounded-xl border-l-4 border-accent-primary">
                <h4 className="font-serif font-semibold text-accent-primary mb-3">Workshop Philosophy</h4>                <p className="text-foreground/70 italic">
                  "We don't simply carve wood—we collaborate with it. Each grain line guides our tools, 
                  each knot tells us where to pause and listen. This is craftsmanship as meditation, 
                  creation as conversation."
                </p>
              </div>
            </div>
              <div
              data-animate-slide-right
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                  {/* Placeholder for craftsman portrait */}
                  <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                    <span className="text-foreground/40 text-center px-4">
                      Master Craftsman Edward Langston<br />
                      <span className="text-sm">At work in the Liverpool workshop</span>
                    </span>
                  </div>
                </div>
                {/* Floating testimonial */}
                <div className="absolute -bottom-8 -left-8 bg-background p-6 rounded-xl shadow-xl border border-foreground/10 max-w-sm">
                  <p className="text-sm italic text-foreground/70 mb-2">
                    "Working with Elite Woodcraft was like commissioning a piece of history. The attention to detail is extraordinary."
                  </p>                  <p className="text-xs font-semibold text-accent-primary">— Victoria M., Private Collector</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Tools Gallery */}          <div
            data-animate-fade-up
            className="border-t border-foreground/10 pt-16"
          >
            <h3 className="text-2xl font-serif font-semibold text-center mb-12 text-foreground">
              Traditional Tools, Timeless Techniques
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="text-3xl">🪚</span>
                </div>
                <h4 className="font-medium text-foreground mb-2">Hand Chisels</h4>
                <p className="text-sm text-foreground/60">Centuries-old techniques</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="text-3xl">⚒️</span>
                </div>
                <h4 className="font-medium text-foreground mb-2">Mallet Work</h4>
                <p className="text-sm text-foreground/60">Precision control</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="text-3xl">🔧</span>
                </div>
                <h4 className="font-medium text-foreground mb-2">Detail Work</h4>
                <p className="text-sm text-foreground/60">Fine finishing</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <h4 className="font-medium text-foreground mb-2">Hand Finishing</h4>
                <p className="text-sm text-foreground/60">Natural oils & waxes</p>              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link href="/about" className="inline-flex items-center gap-2 text-accent-primary font-semibold text-lg hover:underline transition-all duration-300 hover:gap-4">
              Discover Our Full Story 
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-32 px-6 sm:px-12 bg-gradient-to-br from-accent-secondary/5 to-accent-primary/5 border-t border-foreground/10">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-8">
              Stories of Excellence
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Our greatest pride comes from the relationships we build and the satisfaction of clients who become part of our extended family.
            </p>
          </motion.div>

          {/* Featured Testimonial */}
          <motion.div 
            className="mb-20 p-8 md:p-12 bg-background rounded-3xl shadow-xl border border-foreground/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="text-6xl text-accent-primary/20 mb-4">"</div>
                <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground/90 leading-relaxed mb-8">
                  Working with Elite Woodcraft was like commissioning a piece of history. Edward and his team didn't just create a sculpture—they created a family heirloom that captures the essence of our heritage.
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center">
                    <span className="text-2xl">V</span>
                  </div>
                  <div>
                    <p className="font-bold text-accent-primary text-lg">Victoria Melbourne</p>
                    <p className="text-foreground/60">Private Art Collector, London</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 shadow-lg flex items-center justify-center">
                  <span className="text-foreground/40 text-center px-4">Client photo</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Client Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="p-8 rounded-2xl shadow-lg bg-background border border-foreground/10 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold">M</span>
                </div>
                <div>
                  <p className="font-bold text-accent-primary">Margaret Richardson</p>
                  <p className="text-sm text-foreground/60">Interior Designer</p>
                </div>
              </div>
              <blockquote className="italic text-foreground/80 leading-relaxed">
                "The custom dining table from Elite Woodcraft is a masterpiece. The craftsmanship and attention to detail exceeded our highest expectations."
              </blockquote>
            </motion.div>

            <motion.div 
              className="p-8 rounded-2xl shadow-lg bg-background border border-foreground/10 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold">E</span>
                </div>
                <div>
                  <p className="font-bold text-accent-primary">Edward Thompson</p>
                  <p className="text-sm text-foreground/60">Estate Owner</p>
                </div>
              </div>
              <blockquote className="italic text-foreground/80 leading-relaxed">
                "We commissioned a carved mantel for our estate, and the result is breathtaking. Their expertise transformed our vision into reality."
              </blockquote>
            </motion.div>

            <motion.div 
              className="p-8 rounded-2xl shadow-lg bg-background border border-foreground/10 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold">P</span>
                </div>
                <div>
                  <p className="font-bold text-accent-primary">Priya Sharma</p>
                  <p className="text-sm text-foreground/60">Art Collector</p>
                </div>
              </div>
              <blockquote className="italic text-foreground/80 leading-relaxed">
                "Elite Woodcraft's attention to detail and artistry is unmatched. Our custom sculpture is the centerpiece of our home."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>      {/* Enhanced Call to Action Section */}
      <section id="cta" className="py-32 px-6 sm:px-12 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-t border-foreground/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16" 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-8">
              Commission Your Legacy
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              Transform your vision into a masterpiece that will be treasured for generations. 
              Every commission begins with a conversation, and every conversation begins with possibility.
            </p>
            <p className="text-lg text-foreground/60 mb-12">
              From concept to completion, we guide you through every step of creating your unique heirloom.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-accent-primary mb-4">Free Consultation</h3>
              <p className="text-foreground/70 leading-relaxed">
                Begin with a no-obligation consultation where we explore your vision, discuss possibilities, and provide expert guidance.
              </p>
            </div>
            
            <div className="text-center p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-accent-primary mb-4">Custom Design</h3>
              <p className="text-foreground/70 leading-relaxed">
                We create detailed sketches and 3D renderings, ensuring every aspect of your piece reflects your unique style and requirements.
              </p>
            </div>
            
            <div className="text-center p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-accent-primary/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-accent-primary mb-4">Lifetime Legacy</h3>
              <p className="text-foreground/70 leading-relaxed">
                Your completed masterpiece comes with authentication, care instructions, and our lifetime craftsmanship warranty.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link 
                href="/commission" 
                className="inline-flex items-center justify-center gap-3 bg-accent-primary text-background px-12 py-5 rounded-xl font-semibold hover:bg-accent-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                Start Your Commission
                <span className="text-xl">→</span>
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-3 border-2 border-accent-primary text-accent-primary px-12 py-5 rounded-xl font-semibold hover:bg-accent-primary/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
              >
                Schedule Consultation
                <span className="text-xl">📞</span>
              </Link>
            </div>
            
            <div className="max-w-2xl mx-auto p-6 bg-accent-primary/5 rounded-xl border border-accent-primary/20">
              <p className="text-sm text-foreground/70 mb-2">
                <strong className="text-accent-primary">Ready to begin?</strong>
              </p>
              <p className="text-sm text-foreground/60">
                Call us directly at <span className="font-semibold text-accent-primary">+44 151 123 4567</span> or 
                email <span className="font-semibold text-accent-primary">hello@elitewoodcraft.co.uk</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
