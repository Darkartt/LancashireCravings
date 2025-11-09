"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Users,
  Sparkles,
  Shield,
  TreePine,
  Hammer,
  Star,
  ChevronRight
} from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { companyInfo } from "../lib/data";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const [stats] = useState([
    { label: "Years Experience", value: "35+", icon: Award },
    { label: "Projects Completed", value: "500+", icon: Sparkles },
    { label: "Happy Clients", value: "200+", icon: Users },
    { label: "Awards Won", value: "12", icon: Star }
  ]);

  const [features] = useState([
    {
      title: "Master Craftsmanship",
      description: "Over 35 years of expertise in traditional woodcarving techniques, passed down through generations.",
      icon: Hammer,
      color: "from-amber-500/10 to-orange-500/10"
    },
    {
      title: "Sustainable Materials",
      description: "100% FSC certified hardwoods sourced responsibly from sustainable forests worldwide.",
      icon: TreePine,
      color: "from-emerald-500/10 to-green-500/10"
    },
    {
      title: "Guaranteed Quality",
      description: "Every piece comes with our lifetime craftsmanship guarantee and satisfaction promise.",
      icon: Shield,
      color: "from-blue-500/10 to-indigo-500/10"
    }
  ]);

  const [featuredProjects] = useState([
    {
      title: "Golden Eagle Masterpiece",
      description: "Majestic golden eagle carved with incredible detail",
      category: "Wildlife",
      image: "/portfolio/eagle/eagle_05_Finished_1.jpg",
      slug: "eagle"
    },
    {
      title: "Largemouth Bass",
      description: "Detailed fish carving with intricate scale work",
      category: "Commissioned",
      image: "/portfolio/bass/bass_05_Finished_1.jpeg",
      slug: "bass"
    },
    {
      title: "Saint Collen Statue",
      description: "Religious sculpture capturing spiritual essence",
      category: "Religious Art",
      image: "/portfolio/stcollen/stcollen_05_Finished_1.jpeg",
      slug: "stcollen"
    }
  ]);

  const [testimonials] = useState([
    {
      quote: "The sculpture Edward created for our estate exceeded every expectation. It's not just art—it's a piece of our family's heritage carved in wood.",
      author: "James Harrison",
      role: "Estate Owner, Yorkshire",
      initials: "JH"
    },
    {
      quote: "Working with Lancaster Carving Limited was transformational. The attention to detail and respect for the wood's natural character created something truly magical.",
      author: "Sarah Mitchell",
      role: "Interior Designer, London",
      initials: "SM"
    },
    {
      quote: "The craftsmanship is extraordinary. Each piece tells a story and becomes more beautiful with time. This is heirloom-quality artistry.",
      author: "David Roberts",
      role: "Art Collector, Edinburgh",
      initials: "DR"
    }
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-48 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <Badge variant="outline" className="mb-6 text-sm px-4 py-2 border-primary/30">
                <Sparkles className="w-3 h-3 mr-2" />
                {companyInfo.tagline}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Crafting Timeless Art
              <br />
              <span className="text-primary">From Wood</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover exceptional custom woodcarving craftsmanship. Bespoke furniture, sculptures, and architectural elements for those who value artistry.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button asChild size="lg" className="group">
                <Link href="/commission">
                  Commission Your Piece
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/projects">
                  View Portfolio
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeInUp}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three decades of excellence in custom woodcarving and craftsmanship
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Featured Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our latest masterpieces and custom commissions
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {featuredProjects.map((project, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Link href={`/projects/${project.slug}`}>
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50">
                    <div className="relative h-64 overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-background/90 backdrop-blur-sm">{project.category}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription>
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/projects">
                View All Projects
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Client Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from those who've commissioned bespoke pieces
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">{testimonial.initials}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 border-none text-primary-foreground">
              <div className="absolute inset-0 bg-[url('/grain-texture.svg')] opacity-10" />
              <CardHeader className="relative z-10 text-center py-16 px-6">
                <CardTitle className="text-4xl md:text-5xl font-serif mb-6">
                  Ready to Start Your Project?
                </CardTitle>
                <CardDescription className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                  Let's bring your vision to life. Commission a bespoke piece that will be treasured for generations.
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary" className="font-semibold">
                    <Link href="/commission">
                      Start Commission
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-transparent hover:bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:border-primary-foreground/50">
                    <Link href="/contact">
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
