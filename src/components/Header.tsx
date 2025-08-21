"use client";

import Link from "next/link";
import MotionDiv from '@/components/MotionContainer';
import { useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";
import { navigation } from "../lib/data";
import "./header.css";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

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
  <MotionDiv 
        className="px-6 sm:px-8 lg:px-12 py-6 bg-background/95 backdrop-blur-sm shadow-header-black fixed top-0 left-0 right-0 header-container"
        style={{ zIndex: 60 }}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-modern flex justify-between items-center max-w-7xl">
          <div className="flex items-center">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mr-4 header-logo"
            >
              <Link href="/" aria-label="Lancaster Carving Limited - Home">
                <OptimizedImage 
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.svg`} 
                  alt="Lancaster Carving Limited Logo" 
                  width={32} 
                  height={32}
                  priority
                />
              </Link>
            </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-2xl font-serif font-bold text-accent-primary"
          >
            <Link href="/">Lancaster Carving Limited</Link>
          </MotionDiv>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-2" role="navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="nav-link"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden mr-4 text-foreground/80 hover:text-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 rounded-md p-2 mobile-menu-button"
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
          <Link href="/commission" className="hidden md:inline-flex btn btn-md btn-primary">
            Commission a Piece
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm shadow-separator-medium z-50 px-6 sm:px-8 lg:px-12 py-6 mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col space-y-2 max-w-7xl mx-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link block"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/commission"
              className="btn btn-md btn-primary text-center mt-3"
              onClick={() => setIsMobileMenuOpen(false)}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              Commission a Piece
            </Link>
          </nav>
        </div>
      )}
  </MotionDiv>
    </>
  );
}
