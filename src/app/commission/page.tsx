'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import CommissionBackground from '../../components/backgrounds/CommissionBackground';
import SimpleConfigurator from '../../components/configurator/SimpleConfigurator';
import ConfiguratorTutorial from '../../components/configurator/ConfiguratorTutorial';
import Footer from '../../components/Footer';
import './commission.css';

// Wood types with properties
const woodTypes = [
  { id: 'walnut', name: 'Walnut', price: 150, description: 'Rich, dark grain with elegant chocolate tones' },
  { id: 'oak', name: 'Oak', price: 120, description: 'Classic strength with prominent grain patterns' },
  { id: 'cherry', name: 'Cherry', price: 130, description: 'Warm reddish hue that deepens with age' },
  { id: 'maple', name: 'Maple', price: 110, description: 'Light, clean grain with subtle elegance' },
  { id: 'mahogany', name: 'Mahogany', price: 160, description: 'Luxurious reddish-brown with fine grain' },
];

const finishTypes = [
  { id: 'natural', name: 'Natural Oil', description: 'Enhances grain while maintaining natural feel' },
  { id: 'satin', name: 'Satin Finish', description: 'Smooth, low-gloss protection with subtle sheen' },
  { id: 'gloss', name: 'High Gloss', description: 'Mirror-like finish for modern elegance' },
  { id: 'matte', name: 'Matte Finish', description: 'No-gloss protection with raw wood appearance' },
];

const projectTypes = [
  { id: 'furniture', name: 'Custom Furniture', examples: 'Tables, chairs, cabinets, desks' },
  { id: 'sculpture', name: 'Artistic Sculpture', examples: 'Abstract forms, figurative pieces, installations' },
  { id: 'functional', name: 'Functional Art', examples: 'Bowls, boxes, decorative shelving' },
  { id: 'architectural', name: 'Architectural Elements', examples: 'Mantels, trim work, built-ins' },
];

export default function CommissionPage() {
  const [selectedWood, setSelectedWood] = useState('walnut');
  const [selectedFinish, setSelectedFinish] = useState('natural');
  const [selectedProject, setSelectedProject] = useState('furniture');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [showAdvancedConfigurator, setShowAdvancedConfigurator] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    timeline: '',
    budget: '',
    description: '',
    dimensions: '',
    inspiration: '',
  });  // Modern scroll animations with proper containers
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Smooth, modern scroll transforms with better easing
  const heroY = useTransform(heroProgress, [0, 1], [0, -150]);
  const heroOpacity = useTransform(heroProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.6], [1, 0.92]);
  const heroBlur = useTransform(heroProgress, [0, 0.3], [0, 2]);
  
  // Configurator entrance animation - fixed transparency
  const configRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: configProgress } = useScroll({
    target: configRef,
    offset: ["start 0.9", "start 0.1"]
  });
  
  const configY = useTransform(configProgress, [0, 1], [80, 0]);
  const configScale = useTransform(configProgress, [0, 1], [0.95, 1]);
  const handleConfigChange = (config: any) => {
    setCurrentPrice(config.estimatedPrice || 800);
    // Update selected values for consistency
    setSelectedWood(config.woodType);
    setSelectedFinish(config.finishType || 'matte');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Commission request submitted:', {
      ...formData,
      wood: selectedWood,
      finish: selectedFinish,
      project: selectedProject,
    });
    alert('Thank you for your commission request! We will contact you within 24 hours.');
  };

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
        {/* Hero Section with Modern Parallax */}
      <motion.section 
        ref={heroRef}
        className="relative pt-32 pb-16 px-4 sm:px-8 wood-texture overflow-hidden"
        style={{ 
          y: heroY,
          opacity: heroOpacity,
          scale: heroScale,
          filter: useTransform(heroBlur, (value) => `blur(${value}px)`)
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.4, 
              ease: [0.16, 1, 0.3, 1],
              staggerChildren: 0.15
            }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-serif font-bold text-accent-primary mb-6 leading-tight"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                delay: 0.2, 
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              Commission Your
              <motion.span 
                className="block text-accent-secondary italic elegant-underline"
                initial={{ opacity: 0, x: -30, rotateX: 15 }}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{ 
                  duration: 1.0, 
                  delay: 0.5, 
                  ease: [0.16, 1, 0.3, 1],
                  type: "spring",
                  stiffness: 120,
                  damping: 20
                }}
              >
                Masterpiece
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.0, 
                delay: 0.7, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              Collaborate with master craftsmen to create bespoke woodwork that tells your story. 
              Every grain, every curve, every detail meticulously crafted to your vision.
            </motion.p>
            <motion.div              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.9, 
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 100
              }}
            >
              {[
                { icon: "✓", text: "30+ Years Experience" },
                { icon: "✓", text: "Lifetime Warranty" },
                { icon: "✓", text: "Heirloom Quality" }
              ].map((badge, i) => (
                <motion.div 
                  key={badge.text}
                  className="flex items-center gap-2 text-accent-primary trust-badge"
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1.1 + (i * 0.1), 
                    ease: [0.16, 1, 0.3, 1],
                    type: "spring",
                    stiffness: 120,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.08,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Enhanced floating elements with better animations */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-accent-primary/5 rounded-full blur-sm"
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-accent-secondary/5 rounded-full blur-sm"
          animate={{
            y: [0, -35, 0],
            x: [0, -20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
            repeatType: "loop"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent-primary/3 rounded-full blur-md"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
            repeatType: "loop"
          }}
        />
      </motion.section>

      {/* 3D Configurator Section - Fixed Transparency and Animations */}
      <motion.section 
        ref={configRef}
        className="py-20 px-4 sm:px-8 bg-gradient-to-b from-foreground/3 to-background relative z-10"
        style={{ 
          y: configY,
          scale: configScale
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.0, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-serif font-bold text-accent-primary mb-6 elegant-underline"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
            >
              Interactive Design Studio
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1]
              }}
              viewport={{ once: true }}
            >
              Visualize your piece in real-time. Configure every aspect of your custom creation              with our advanced 3D configurator.
            </motion.p>
            
            {/* Configurator Toggle with Enhanced Animation */}
            <motion.div 
              className="flex justify-center mb-10"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
            >
              <div className="bg-background/90 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-foreground/10 hover:shadow-accent-primary/10 transition-all duration-500">
                <button
                  onClick={() => setShowAdvancedConfigurator(false)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-500 ${
                    !showAdvancedConfigurator
                      ? 'bg-accent-primary text-white shadow-lg transform scale-105 shadow-accent-primary/25'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  Quick Preview
                </button>
                <button
                  onClick={() => setShowAdvancedConfigurator(true)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-500 ${
                    showAdvancedConfigurator
                      ? 'bg-accent-primary text-white shadow-lg transform scale-105 shadow-accent-primary/25'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  Full Configurator
                </button>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            {showAdvancedConfigurator ? (
              // Advanced Interactive Configurator - Fixed Transparency Issues
              <motion.div
                key="advanced"
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.9 }}
                transition={{ 
                  duration: 1.0, 
                  ease: [0.16, 1, 0.3, 1],
                  type: "spring",
                  stiffness: 80,
                  damping: 20
                }}
                className="relative z-20"
              >
                {/* Configurator Container with Fixed Background */}
                <div 
                  className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-foreground/10 p-8 relative overflow-hidden"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 69, 19, 0.3) 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  {/* Configurator Header with Enhanced Design */}
                  <motion.div 
                    className="mb-8 flex justify-between items-center relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div>
                      <motion.h3 
                        className="text-3xl font-serif font-bold text-accent-primary mb-2"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        Advanced 3D Configurator
                      </motion.h3>
                      <motion.p 
                        className="text-sm text-foreground/60"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        Professional woodcarving design tool
                      </motion.p>
                    </div>
                    {currentPrice > 0 && (
                      <motion.div 
                        className="text-right bg-accent-primary/5 rounded-2xl px-6 py-4 border border-accent-primary/10"
                        initial={{ opacity: 0, scale: 0.8, x: 30 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ 
                          delay: 0.5, 
                          duration: 0.8, 
                          ease: [0.16, 1, 0.3, 1],
                          type: "spring",
                          stiffness: 100
                        }}
                      >
                        <div className="text-sm text-foreground/60 mb-1">Starting at</div>
                        <div className="text-3xl font-bold text-accent-primary">
                          ${currentPrice.toLocaleString()}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>                  {/* Configurator with Enhanced Staggered Animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4, 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="relative z-10"
                  >
                    <SimpleConfigurator onConfigChange={handleConfigChange} />
                  </motion.div>
                  
                  {/* Premium Features Highlight with Modern Animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 p-6 bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 rounded-2xl border border-accent-primary/20 backdrop-blur-sm"
                  >
                    <motion.h4 
                      className="text-lg font-serif font-semibold text-accent-primary mb-4 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0, duration: 0.6 }}
                    >
                      🌟 Premium Design Studio Features
                    </motion.h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      {[
                        { icon: "🎯", title: "Real-time 3D Preview", desc: "Interactive visualization" },
                        { icon: "🎨", title: "Carving Techniques", desc: "6 professional methods" },
                        { icon: "📐", title: "Precision Controls", desc: "Depth & detail sliders" },
                        { icon: "📁", title: "Custom Patterns", desc: "Upload your designs" }
                      ].map((feature, i) => (
                        <motion.div 
                          key={feature.title}
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: 1.2 + (i * 0.1), 
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                        >
                          <div className="text-2xl mb-2">{feature.icon}</div>
                          <div className="font-medium">{feature.title}</div>
                          <div className="text-foreground/60">{feature.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
          ) : (
            // Quick Preview Mode
            <motion.div 
              key="quick"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* 3D Viewer - Quick preview with basic controls */}
              <div className="lg:col-span-2">
                <div className="bg-background rounded-2xl shadow-2xl overflow-hidden floating-card">
                  <div className="h-[500px] md:h-[600px] relative">
                    <CommissionBackground 
                      woodType={selectedWood} 
                      finishType={selectedFinish}
                    />
                  </div>
                  <div className="p-6 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 wood-texture">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-accent-primary">Preview Mode</h3>
                        <p className="text-foreground/70">Basic 3D visualization</p>
                      </div>
                      {currentPrice > 0 && (
                        <div className="text-right">
                          <div className="text-sm text-foreground/60">Estimated</div>
                          <div className="text-2xl font-bold text-accent-primary">
                            ${currentPrice.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Controls */}
              <div className="space-y-6">
                <div className="bg-background rounded-2xl shadow-xl p-6">
                  <h4 className="text-lg font-serif font-semibold text-accent-primary mb-4">Wood Selection</h4>
                  <div className="space-y-2">
                    {woodTypes.map((wood) => (
                      <button
                        key={wood.id}
                        onClick={() => setSelectedWood(wood.id)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedWood === wood.id
                            ? 'bg-accent-primary text-white'
                            : 'bg-foreground/5 hover:bg-foreground/10'
                        }`}
                      >
                        <div className="font-medium">{wood.name}</div>
                        <div className="text-sm opacity-80">${wood.price}/ft²</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-background rounded-2xl shadow-xl p-6">
                  <h4 className="text-lg font-serif font-semibold text-accent-primary mb-4">Finish Type</h4>
                  <div className="space-y-2">
                    {finishTypes.map((finish) => (
                      <button
                        key={finish.id}
                        onClick={() => setSelectedFinish(finish.id)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedFinish === finish.id
                            ? 'bg-accent-primary text-white'
                            : 'bg-foreground/5 hover:bg-foreground/10'
                        }`}
                      >
                        <div className="font-medium">{finish.name}</div>
                        <div className="text-sm opacity-80">{finish.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Commission Form Section */}
      <section className="pt-24 pb-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-serif font-bold text-accent-primary mb-4 elegant-underline">
              Let's Bring Your Vision to Life
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Share your ideas with us and let our master craftsmen turn your dreams into reality.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-background rounded-3xl shadow-2xl p-8"
            onSubmit={handleSubmit}
          >
            {/* Project Type Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-serif font-semibold text-accent-primary mb-4">Project Type</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {projectTypes.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProject(project.id)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedProject === project.id
                        ? 'bg-accent-primary text-white shadow-lg'
                        : 'bg-foreground/5 hover:bg-foreground/10'
                    }`}
                  >
                    <div className="font-semibold">{project.name}</div>
                    <div className="text-sm opacity-80 mt-1">{project.examples}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                >
                  <option value="">Select timeline</option>
                  <option value="no-rush">No rush (3-6 months)</option>
                  <option value="standard">Standard (2-3 months)</option>
                  <option value="priority">Priority (4-8 weeks)</option>
                  <option value="rush">Rush (2-4 weeks)</option>
                </select>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Budget Range
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                >
                  <option value="">Select budget range</option>
                  <option value="under-1000">Under $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="over-10000">Over $10,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Approximate Dimensions
                </label>
                <input
                  type="text"
                  name="dimensions"
                  placeholder="e.g., 6ft x 3ft x 2ft"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe your vision, intended use, style preferences..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-2">
                Inspiration & References
              </label>
              <textarea
                name="inspiration"
                rows={3}
                placeholder="Share any inspiration sources, reference images, or specific details..."
                value={formData.inspiration}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border-2 border-foreground/20 focus:border-accent-primary bg-background text-foreground"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-accent-primary text-white py-4 px-8 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 floating-card"
            >
              Submit Commission Request
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Process & Trust Section */}
      <section className="py-16 px-4 sm:px-8 bg-foreground/5 wood-texture">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-accent-primary mb-4 elegant-underline">
              Our Commission Process
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              From initial consultation to final delivery, we ensure every step 
              of your commission journey is transparent and collaborative.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: "01", 
                title: "Consultation", 
                desc: "We discuss your vision, requirements, and provide initial concepts and pricing." 
              },
              { 
                step: "02", 
                title: "Design", 
                desc: "Detailed drawings and 3D models are created for your approval." 
              },
              { 
                step: "03", 
                title: "Crafting", 
                desc: "Our master craftsmen bring your piece to life with regular progress updates." 
              },
              { 
                step: "04", 
                title: "Delivery", 
                desc: "White-glove delivery and installation service to your location." 
              }
            ].map((process, i) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-background rounded-2xl p-6 shadow-xl floating-card"
              >
                <div className="text-4xl font-bold text-accent-primary mb-4 font-serif">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-accent-primary mb-3">
                  {process.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {process.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Tutorial Modal */}
      {!tutorialComplete && (
        <ConfiguratorTutorial onComplete={() => setTutorialComplete(true)} />
      )}
    </div>
  );
}
