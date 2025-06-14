"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image"; // Import Image component

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Ensure this only runs on client side after mount
    let isMounted = false;
    setTimeout(() => {
      isMounted = true;
    }, 0);

    const handleScroll = () => {
      if (isMounted) {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`py-6 px-4 sm:px-8 bg-background border-b border-foreground/10 fixed top-0 left-0 right-0 z-50 transition-all duration-300 header-container ${isScrolled ? 'py-3' : ''}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mr-4"
          >
            {/* Replace inline SVG with Image component */}
            <Link href="/">
              <Image src="/logo.svg" alt="Elite Woodcraft Logo" width={40} height={40} />
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            className="text-2xl font-serif font-bold text-accent-primary"
          >
            <Link href="/">Elite Woodcraft</Link>
          </motion.h1>
        </div>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-foreground/80 hover:text-accent-primary transition-colors">Home</Link>
          <Link href="/portfolio" className="text-foreground/80 hover:text-accent-primary transition-colors">Portfolio</Link>
          <Link href="/services" className="text-foreground/80 hover:text-accent-primary transition-colors">Services</Link>
          <Link href="/shop" className="text-foreground/80 hover:text-accent-primary transition-colors">Shop</Link>
          <Link href="/blog" className="text-foreground/80 hover:text-accent-primary transition-colors">Blog</Link>
          <Link href="/contact" className="text-foreground/80 hover:text-accent-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center">
          <div className="md:hidden mr-4">
            <button className="text-foreground/80 hover:text-accent-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <motion.button
            className="bg-accent-primary text-background px-4 py-2 rounded-md font-medium header-cta-button hidden md:block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/commission">Commission a Piece</Link>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
