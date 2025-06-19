"use client";

import Link from "next/link";
import HomeBackground from "../components/backgrounds/HomeBackground";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import { companyInfo } from "../lib/data";

export default function Home() {return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      <HomeBackground />
      <Header />

      {/* Hero Section - Enhanced Full-Height Immersive */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center bg-transparent z-10 pt-24 pb-32 hero-parallax">
        <div className="container mx-auto px-6 sm:px-12 text-center max-w-6xl">
          <div
            className="mb-6"
            data-animate-scale
          >            <span className="inline-block px-6 py-2 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium tracking-wider uppercase border border-accent-primary/20">
              {companyInfo.tagline}
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
            {companyInfo.description}
          </p>          {/* Social Proof */}
          <div
            className="mb-12 text-foreground/60"
            data-animate-fade-in
          >
            <span className="text-sm tracking-wide">Trusted by collectors worldwide</span>
            <div className="flex justify-center items-center gap-8 mt-4 opacity-70">
              {companyInfo.certifications.map((cert, index) => (
                <span key={index} className="font-serif italic text-sm">
                  {cert}
                </span>
              ))}
            </div>
          </div>
            <div
            className="flex flex-col sm:flex-row gap-6 justify-center hero-buttons max-w-2xl mx-auto"
            data-animate-fade-up
          >
            <Link href="/commission">
              <Button variant="primary" size="lg" fullWidth className="sm:w-auto">
                Commission Custom Piece
              </Button>
            </Link>
            <Link href="#portfolio">
              <Button variant="outline" size="lg" fullWidth className="sm:w-auto">
                Explore Collection
              </Button>
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
          <div className="text-center mb-20" data-animate-fade-up>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-8">
              From Vision to Heirloom
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
              Every masterpiece begins with a conversation and culminates in a legacy piece that will be treasured for generations.
            </p>
          </div>

          {/* Process Timeline */}
          <div className="relative">
            <div className="space-y-24">
              {/* Step 1 */}
              <div 
                className="flex flex-col lg:flex-row items-center gap-12"
                data-animate-slide-left
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
              </div>

              {/* Step 2 */}
              <div 
                className="flex flex-col lg:flex-row-reverse items-center gap-12"
                data-animate-slide-right
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
              </div>

              {/* Step 3 */}
              <div 
                className="flex flex-col lg:flex-row items-center gap-12"
                data-animate-slide-left
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
              </div>
            </div>
          </div>

          {/* Sustainability Commitment */}
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
      </section>

      {/* Enhanced Portfolio Section with Case Studies */}
      <section id="portfolio" className="py-32 px-6 sm:px-12 bg-background border-t border-foreground/10">
        <div className="container mx-auto max-w-7xl">
          <h2 
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
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div 
              className="group cursor-pointer card-hover"
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
              className="group cursor-pointer card-hover"
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
              className="group cursor-pointer card-hover"
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
              <div className="flex items-center gap-4 text-sm text-foreground/60">
                <span>• Dining tables</span>
                <span>• Carved chairs</span>
                <span>• Storage pieces</span>
              </div>
            </div>
          </div>

          {/* Portfolio Statistics */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center"
            data-animate-fade-up
          >
            <div>
              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">500+</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Pieces Created</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">37</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">25+</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-accent-primary mb-2">100%</div>
              <div className="text-foreground/60 text-sm uppercase tracking-wider">Sustainable Wood</div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/portfolio" className="btn-primary">
              Explore Complete Portfolio
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced About Section with Craftsman Story */}
      <section id="about" className="py-32 px-6 sm:px-12 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border-t border-foreground/10">
        <div className="container mx-auto max-w-7xl">
          <h2 
            className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-16 text-center"
            data-animate-fade-up
          >
            The Craftsman's Story
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1" data-animate-slide-left>
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
                  Based in the heart of Liverpool's historic arts quarter, our workshop combines traditional hand-carving techniques 
                  with an understanding of contemporary design. Every commission is a collaboration between artisan, client, and the 
                  raw beauty of sustainably-sourced hardwoods.
                </p>
                <p className="text-foreground/70 italic">
                  "We don't simply carve wood—we collaborate with it. Each grain line guides our tools, 
                  each knot tells us where to pause and listen. This is craftsmanship as meditation, 
                  creation as conversation."
                </p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2" data-animate-slide-right>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6">
                <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-foreground/40 text-center px-4">Master Craftsman Edward Langston in his Liverpool workshop</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-background p-6 rounded-xl shadow-lg border border-foreground/10">
                  <p className="text-foreground/80 italic mb-4">
                    "Edward's work transcends mere decoration—each piece is a meditation on the relationship between human creativity and natural beauty."
                  </p>
                  <p className="text-xs font-semibold text-accent-primary">— Victoria M., Private Collector</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Tools Gallery */}
          <div className="border-t border-foreground/10 pt-16" data-animate-fade-up>
            <h3 className="text-2xl font-serif font-semibold text-center mb-12 text-foreground">
              Traditional Tools, Timeless Techniques
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🪚</span>
                </div>
                <h4 className="font-semibold text-accent-primary mb-2">Hand Chisels</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔨</span>
                </div>
                <h4 className="font-semibold text-accent-primary mb-2">Carving Mallets</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚒️</span>
                </div>
                <h4 className="font-semibold text-accent-primary mb-2">Gouges</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📐</span>
                </div>
                <h4 className="font-semibold text-accent-primary mb-2">Precision Tools</h4>
              </div>
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
      <section id="testimonials" className="py-32 px-6 sm:px-12 bg-background border-t border-foreground/10">
        <div className="container mx-auto max-w-7xl">
          <h2 
            className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-16 text-center"
            data-animate-fade-up
          >
            Client Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="testimonial-card" data-animate-fade-up>
              <div className="text-4xl text-accent-primary mb-6">"</div>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                The sculpture Edward created for our estate exceeded every expectation. It's not just art—it's a piece of our family's heritage carved in wood.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-bold">JH</span>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-primary">James Harrison</h4>
                  <p className="text-sm text-foreground/60">Estate Owner, Yorkshire</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-animate-fade-up>
              <div className="text-4xl text-accent-primary mb-6">"</div>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Working with Elite Woodcraft was transformational. The attention to detail and respect for the wood's natural character created something truly magical.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-bold">SM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-primary">Sarah Mitchell</h4>
                  <p className="text-sm text-foreground/60">Interior Designer, London</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-animate-fade-up>
              <div className="text-4xl text-accent-primary mb-6">"</div>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                The craftsmanship is extraordinary. Each piece tells a story and becomes more beautiful with time. This is heirloom-quality artistry.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-accent-primary font-bold">DR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-accent-primary">David Roberts</h4>
                  <p className="text-sm text-foreground/60">Art Collector, Edinburgh</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center" data-animate-fade-up>
            <p className="text-lg text-foreground/70 mb-8">Join our community of satisfied collectors and commissioners</p>
            <Link href="/contact" className="btn-secondary">
              Share Your Vision
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Call-to-Action Section */}
      <section className="py-32 px-6 sm:px-12 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-t border-foreground/10">
        <div className="container mx-auto max-w-4xl text-center">
          <div data-animate-fade-up>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-8">
              Ready to Create Your Legacy?
            </h2>
            <p className="text-xl text-foreground/80 leading-relaxed mb-12 max-w-3xl mx-auto">
              Every masterpiece begins with a conversation. Let's discuss how we can transform your vision into a timeless work of art 
              that will be cherished for generations to come.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto mb-16">
              <Link href="/commission" className="btn-primary">
                Start Your Commission
              </Link>
              <Link href="/contact" className="btn-secondary">
                Schedule Consultation
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">Free Consultation</h3>
                <p className="text-foreground/70">Discuss your vision with our master craftsman</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">Custom Design</h3>
                <p className="text-foreground/70">Personalized sketches and material selection</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">Lifetime Guarantee</h3>
                <p className="text-foreground/70">Assured quality for generations to come</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
