"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";
import { navigation } from "../lib/data";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { scrollY } = useScroll();
    // Use useTransform for smooth scroll-based changes
  const headerPadding = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <motion.header 
        className="px-6 sm:px-12 bg-background/95 backdrop-blur-sm border-b border-foreground/10 fixed top-0 left-0 right-0 z-50 header-container"
        style={{ 
          paddingTop: headerPadding, 
          paddingBottom: headerPadding,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mr-4 header-logo"
            >
              <Link href="/" aria-label="Elite Woodcraft - Home">
                <OptimizedImage 
                  src="/logo.svg" 
                  alt="Elite Woodcraft Logo" 
                  width={40} 
                  height={40}
                  priority
                />
              </Link>          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-2xl font-serif font-bold text-accent-primary"
          >
            <Link href="/">Elite Woodcraft</Link>
          </motion.h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-foreground/80 hover:text-accent-primary transition-colors font-medium header-nav-link focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 rounded-sm px-2 py-1"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden mr-4 text-foreground/80 hover:text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 rounded-sm p-2 mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>

          {/* CTA Button */}
          <Link
            href="/commission"
            className="bg-accent-primary text-background px-4 py-2 rounded-md font-medium header-cta-button hidden md:block hover:bg-accent-warm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
          >
            Commission a Piece
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-foreground/10 z-50 px-6 sm:px-12 py-4 mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col space-y-4 max-w-7xl mx-auto">            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-accent-primary transition-colors py-3 border-b border-foreground/10 font-medium focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 rounded-sm"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/commission"
              className="bg-accent-primary text-background px-4 py-3 rounded-md font-medium text-center mt-4 hover:bg-accent-warm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              Commission a Piece
            </Link>
          </nav>
        </div>
      )}
    </motion.header>
    </>
  );
}
