"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ImageLightbox from "../components/ui/ImageLightbox";
import { loadMediaData } from "@/lib/media-loader";

// Animations removed for a cleaner, professional experience

import { companyInfo } from "../lib/data";

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState<{src: string, alt: string} | null>(null);
  // Removed unused animation-related state

  // Static featured projects for immediate loading
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([
    {
      title: "Golden Eagle Masterpiece",
      description: "Majestic golden eagle carved with incredible detail, showcasing the power and grace of this magnificent bird of prey.",
      category: "wildlife",
      coverImage: "/portfolio/eagle/eagle_05_Finished_1.jpg",
      difficulty: "Expert",
      materials: ["Premium Hardwood"],
      completionTime: "6-8 weeks"
    },
    {
      title: "Bass Sculpture",
      description: "Detailed fish carving showing intricate scales and flowing fins, perfect for aquatic-themed collections.",
      category: "commissioned",
      coverImage: "/portfolio/bass/bass_05_Finished_1.jpeg",
      difficulty: "Advanced",
      materials: ["Premium Hardwood"],
      completionTime: "4-6 weeks"
    },
    {
      title: "Fish Collection",
      description: "Beautiful collection of handcrafted fish carvings showcasing different wood grains and carving techniques.",
      category: "wildlife",
      coverImage: "/portfolio/fish/fish_05_Finished_1.jpeg",
      difficulty: "Advanced",
      materials: ["Premium Hardwood"],
      completionTime: "4-6 weeks"
    }
  ]);

  // Load additional data in background without blocking
  useEffect(() => {
    loadMediaData()
      .then(({ getFeaturedProjects, projects }) => {
        const list = getFeaturedProjects ? getFeaturedProjects() : projects;
        if (list.length > 0) {
          setFeaturedProjects(list.slice(0, 3)); // Update with real data if available
        }
      })
      .catch((e) => console.warn('Home: loadMediaData failed, using fallback', e));
  }, []);

  // Background visibility control based on scroll position
  // Removed legacy scroll-based background toggles

  const openLightbox = (src: string, alt: string) => {
    setLightboxImage({ src, alt });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative" style={{
      background: 'transparent',
      zIndex: 10,
      position: 'relative'
    }}>
      {/* Background animation removed completely from landing page */}
      
      <Header />

      {/* Hero Section - Enhanced Full-Height Immersive */}
  <section id="hero" style={{ zIndex: 10, position: 'relative' }} className="hero-section relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-background via-background to-accent-primary/5 pt-40 pb-40 hero-parallax section-transition-smooth overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-accent-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent-tertiary/10 rounded-full blur-2xl"></div>
        </div>
        <div className="container-modern text-center max-w-6xl relative z-10">
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
            <Link href="/commission" className="btn btn-lg-plus btn-primary sm:w-auto">
              Commission Custom Piece
            </Link>
            <Link href="/portfolio" className="btn btn-lg-plus btn-outline sm:w-auto">
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

      {/* Transition removed */}

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Enhanced Process Section with Timeline */}
      <section id="process" className="process-section section-padding-xl bg-transparent shadow-separator-medium relative section-transition-smooth" style={{
        background: 'linear-gradient(to bottom right, transparent 0%, rgba(var(--accent-secondary-rgb, 85, 107, 47), 0.05) 100%)',
        zIndex: 10,
        position: 'relative'
      }}>
        <div className="mb-24"> {/* Empty space for scroll animation trigger */}</div>
        <div className="container-modern max-w-7xl">
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary text-background rounded-2xl text-4xl mb-6 shadow-lg">
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-secondary text-background rounded-2xl text-4xl mb-6 shadow-lg">
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary text-background rounded-2xl text-4xl mb-6 shadow-lg">
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
            className="mt-24 p-12 bg-background rounded-3xl shadow-lg shadow-separator-subtle"
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

      {/* Transition removed */}

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Enhanced Portfolio Section with Case Studies */}
      <section id="portfolio" className="portfolio-section section-padding-xl shadow-separator-medium relative section-transition-smooth" style={{
        background: 'transparent',
        zIndex: 10,
        position: 'relative'
      }}>
        <div className="mb-24"> {/* Empty space for scroll animation trigger */}</div>
        <div className="container-modern max-w-7xl">
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
            className="mb-24 p-8 md:p-12 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 blob-container blob-lg shadow-separator-subtle"
            data-animate-fade-up
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-2 bg-accent-primary/10 text-accent-primary blob-container blob-xs text-sm font-medium mb-6">
                  Featured Commission
                </span>
                <h3 className="text-4xl font-serif font-bold text-accent-primary mb-6">
                  {featuredProjects[0]?.title || "Golden Eagle Masterpiece"}
                </h3>
                <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
                  <p>
                    {featuredProjects[0]?.description || "Majestic golden eagle carved with incredible detail, showcasing the power and grace of this magnificent bird of prey."}
                  </p>
                  <p>
                    This masterpiece required months of meticulous work, capturing every feather detail and the fierce intelligence 
                    in the eagle's gaze. Carved from premium hardwood and finished with natural wood stain to enhance the grain.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Category</h4>
                    <p className="text-foreground/60">{featuredProjects[0]?.category || "Wildlife"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Difficulty</h4>
                    <p className="text-foreground/60">{featuredProjects[0]?.difficulty || "Expert"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Materials</h4>
                    <p className="text-foreground/60">{featuredProjects[0]?.materials?.join(", ") || "Premium Hardwood"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-primary mb-2">Time</h4>
                    <p className="text-foreground/60">{featuredProjects[0]?.completionTime || "6-8 weeks"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="portfolio-showcase aspect-[4/5] overflow-hidden shadow-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                  {featuredProjects[0]?.coverImage ? (
                    <Image
                      src={featuredProjects[0].coverImage}
                      alt={featuredProjects[0].title}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                      onClick={() => openLightbox(featuredProjects[0].coverImage, featuredProjects[0].title)}
                    />
                  ) : (
                    <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-foreground/40 text-center px-4">Featured Project - Main View</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {featuredProjects[1]?.coverImage ? (
                    <div className="product-card-blob aspect-square overflow-hidden shadow-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                      <Image
                        src={featuredProjects[1].coverImage}
                        alt={featuredProjects[1].title}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={() => openLightbox(featuredProjects[1].coverImage, featuredProjects[1].title)}
                      />
                    </div>
                  ) : (
                    <div className="product-card-blob aspect-square overflow-hidden shadow-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                      <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                        <span className="text-foreground/40 text-xs text-center px-2">Detail view</span>
                      </div>
                    </div>
                  )}
                  {featuredProjects[2]?.coverImage ? (
                    <div className="product-card-blob aspect-square overflow-hidden shadow-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                      <Image
                        src={featuredProjects[2].coverImage}
                        alt={featuredProjects[2].title}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={() => openLightbox(featuredProjects[2].coverImage, featuredProjects[2].title)}
                      />
                    </div>
                  ) : (
                    <div className="product-card-blob aspect-square overflow-hidden shadow-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
                      <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                        <span className="text-foreground/40 text-xs text-center px-2">Process view</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Categories */}
          <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Enhanced portfolio cards with better styling */}
                          <div 
                className="portfolio-item group cursor-pointer card-hover bg-surface-elevated rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border-subtle hover:border-accent-primary/30"
                data-animate-fade-up
              >
                <div className="portfolio-showcase relative overflow-hidden shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6 group-hover:shadow-2xl transition-all duration-500 rounded-xl">
                {featuredProjects[0]?.coverImage ? (
                  <Image
                    src={featuredProjects[0].coverImage}
                    alt={featuredProjects[0].title}
                    width={400}
                    height={500}
                    className="aspect-[4/5] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onClick={() => openLightbox(featuredProjects[0].coverImage, featuredProjects[0].title)}
                  />
                ) : (
                  <div className="aspect-[4/5] bg-foreground/10 flex items-center justify-center">
                    <span className="text-foreground/40 text-center px-4">Wildlife Sculptures</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-2xl font-serif font-bold text-accent-primary mb-3 group-hover:text-accent-secondary transition-colors">
                Wildlife Sculptures
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
              <div className="portfolio-showcase relative overflow-hidden shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6 group-hover:shadow-2xl transition-all duration-500">
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
              <div className="portfolio-showcase relative overflow-hidden shadow-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6 group-hover:shadow-2xl transition-all duration-500">
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
            <Link href="/portfolio" className="btn btn-lg-plus btn-primary">
              Explore Complete Portfolio
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Enhanced About Section with Craftsman Story */}
      <section id="about" className="about-section section-padding-xl bg-transparent shadow-separator-medium section-transition-smooth" style={{
        background: 'linear-gradient(to bottom right, transparent 0%, rgba(var(--accent-primary-rgb, 139, 69, 19), 0.05) 100%)',
        zIndex: 10,
        position: 'relative'
      }}>
        <div className="mb-24"> {/* Empty space for scroll animation trigger */}</div>
        <div className="container-modern max-w-7xl">
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
              <div className="aspect-[4/5] blob-container blob-lg overflow-hidden shadow-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6">
                <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                  <span className="text-foreground/40 text-center px-4">Master Craftsman Edward Langston in his Liverpool workshop</span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-background p-6 blob-container blob-md shadow-lg shadow-separator-subtle">
                  <p className="text-foreground/80 italic mb-4">
                    "Edward's work transcends mere decoration—each piece is a meditation on the relationship between human creativity and natural beauty."
                  </p>
                  <p className="text-xs font-semibold text-accent-primary">— Victoria M., Private Collector</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Tools Gallery */}
          <div className="shadow-separator-medium pt-16" data-animate-fade-up>
            <h3 className="text-2xl font-serif font-semibold text-center mb-12 text-foreground">
              Traditional Tools, Timeless Techniques
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 blob-container blob-sm flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🪚</span>
                </div>
                <h4 className="font-semibold text-accent-primary mb-2">Hand Chisels</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 blob-container blob-sm flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔨</span>
                </div>
                <h4 className="font-semibold text-accent-primary mb-2">Carving Mallets</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 blob-container blob-sm flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚒️</span>
                </div>
                <h4 className="font-semibold text-accent-primary mb-2">Gouges</h4>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-primary/10 blob-container blob-sm flex items-center justify-center mx-auto mb-4">
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

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="testimonials-section section-padding-xl bg-transparent shadow-separator-medium section-transition-smooth" style={{
        zIndex: 10,
        position: 'relative'
      }}>
        <div className="mb-24"> {/* Empty space for scroll animation trigger */}</div>
        <div className="container-modern max-w-7xl">
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
                <div className="w-12 h-12 bg-accent-primary/20 blob-container blob-xs flex items-center justify-center">
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
                Working with Lancaster Carving Limited was transformational. The attention to detail and respect for the wood's natural character created something truly magical.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-primary/20 blob-container blob-xs flex items-center justify-center">
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
                <div className="w-12 h-12 bg-accent-primary/20 blob-container blob-xs flex items-center justify-center">
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
            <Link href="/contact" className="btn btn-lg-plus btn-secondary">
              Share Your Vision
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Social Highlights / Latest from Facebook */}
      <section className="py-32 px-6 sm:px-12 bg-foreground/5 shadow-separator-medium" style={{
        zIndex: 10,
        position: 'relative'
      }}>
        <div className="container mx-auto max-w-7xl">
          <h2 
            className="text-5xl md:text-6xl font-serif font-bold text-accent-primary mb-16 text-center"
            data-animate-fade-up
          >
            Latest from Our Workshop
          </h2>
          
          <p 
            className="text-xl text-foreground/70 text-center max-w-3xl mx-auto mb-20 leading-relaxed"
            data-animate-fade-up
          >
            Follow our journey as we bring wood to life. Here are some recent moments from our workshop and the creatures that inspire our craft.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group cursor-pointer" data-animate-fade-up onClick={() => openLightbox("/BarOwlBack.jpg", "Barn Owl Back carving - Good Afternoon 🌞 My Barn Owls back 😜 ❤️🔪🦉")}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5]">
                                     <Image 
                     src="/BarOwlBack.jpg" 
                     alt="Barn Owl Back carving" 
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     priority={false}
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-4xl">🔍</span>
                </div>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-lg">
                <p className="text-lg text-foreground/80 leading-relaxed text-center">
                  "Good Afternoon 🌞 My Barn Owls back 😜 ❤️🔪🦉"
                </p>
              </div>
            </div>

            <div className="group cursor-pointer" data-animate-fade-up onClick={() => openLightbox("/OwlFront.jpg", "Owl Front carving - When the sun sets gold...A new beginning begins to unfold ❤️🔪🦉")}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5]">
                                     <Image 
                     src="/OwlFront.jpg" 
                     alt="Owl Front carving" 
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-4xl">🔍</span>
                </div>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-lg">
                <p className="text-lg text-foreground/80 leading-relaxed text-center">
                  "When the sun sets gold...A new beginning begins to unfold ❤️🔪🦉"
                </p>
              </div>
            </div>

            <div className="group cursor-pointer" data-animate-fade-up onClick={() => openLightbox("/Crow.jpg", "Crow carving - I became insane, with long intervals of horrible sanity - Edgar Allan Poe ❤️🔪🐦‍⬛")}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5]">
                                     <Image 
                     src="/Crow.jpg" 
                     alt="Crow carving" 
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-4xl">🔍</span>
                </div>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-lg">
                <p className="text-lg text-foreground/80 leading-relaxed text-center">
                  "I became insane, with long intervals of horrible sanity." <br />
                  <span className="text-sm text-foreground/60 italic">- EDGAR ALLAN POE</span> ❤️🔪🐦‍⬛
                </p>
              </div>
            </div>

            <div className="group cursor-pointer" data-animate-fade-up onClick={() => openLightbox("/FishesOnTopOfTable.jpg", "Fish carvings on table - A collection of handcrafted fish showcasing different wood grains and carving techniques 🐟🎨")}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5]">
                                     <Image 
                     src="/FishesOnTopOfTable.jpg" 
                     alt="Fish carvings on table" 
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-4xl">🔍</span>
                </div>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-lg">
                <p className="text-lg text-foreground/80 leading-relaxed text-center">
                  "A collection of handcrafted fish showcasing different wood grains and carving techniques 🐟🎨"
                </p>
              </div>
            </div>

            <div className="group cursor-pointer" data-animate-fade-up onClick={() => openLightbox("/OwlAtNight.jpg", "Owl at Night - A majestic owl carving captured in atmospheric nighttime lighting 🦉🌙")}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5]">
                                     <Image 
                     src="/OwlAtNight.jpg" 
                     alt="Owl at Night carving" 
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-4xl">🔍</span>
                </div>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-lg">
                <p className="text-lg text-foreground/80 leading-relaxed text-center">
                  "A majestic owl carving captured in atmospheric nighttime lighting 🦉🌙"
                </p>
              </div>
            </div>

            <div className="group cursor-pointer" data-animate-fade-up onClick={() => openLightbox("/Dog.jpg", "Dog carving - Man's best friend immortalized in wood with loving detail 🐕❤️")}>
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 group-hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[4/5]">
                                     <Image 
                     src="/Dog.jpg" 
                     alt="Dog carving" 
                     fill
                     className="object-cover transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-4xl">🔍</span>
                </div>
              </div>
              <div className="p-6 bg-background rounded-xl shadow-lg">
                <p className="text-lg text-foreground/80 leading-relaxed text-center">
                  "Man's best friend immortalized in wood with loving detail 🐕❤️"
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16" data-animate-fade-up>
            <p className="text-lg text-foreground/70 mb-8">Experience the joy of handcrafted artistry</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🦉</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">Wildlife Inspiration</h3>
                <p className="text-foreground/70">Nature's creatures guide our artistic vision</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔪</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">Traditional Tools</h3>
                <p className="text-foreground/70">Time-honored techniques in every cut</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-accent-primary mb-2">Passionate Craft</h3>
                <p className="text-foreground/70">Love for the art in every piece</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Enhanced Call-to-Action Section */}
      <section className="py-32 px-6 sm:px-12 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 shadow-separator-medium" style={{
        zIndex: 10,
        position: 'relative'
      }}>
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
              <Link href="/commission" className="btn btn-lg-plus btn-primary">
                Start Your Commission
              </Link>
              <Link href="/contact" className="btn btn-lg-plus btn-secondary">
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

      {/* Spacing before footer for scroll animations */}
      <div className="h-24"></div>
      
      <Footer />

      {/* Image Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          isOpen={!!lightboxImage}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
