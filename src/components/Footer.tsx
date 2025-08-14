"use client";

import Link from "next/link";
import Image from "next/image";
import MotionDiv from '@/components/MotionContainer';

export default function Footer() {
  return (
    <footer className="section-padding-lg bg-foreground/5 shadow-separator-medium relative z-10">
      <div className="container-modern">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-serif font-bold text-accent-primary mb-4">Lancaster Carving Limited</h4>
            <p className="text-foreground/70 mb-4">Mold, United Kingdom — Master craftsmanship, creating unique wooden masterpieces for discerning clients worldwide.</p>
            <div className="flex space-x-4">
              <a href="https://youtube.com/@christianlancastersculptur8147" className="text-foreground/70 hover:text-accent-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">YouTube</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58zM10 15V9l6 3-6 3z"></path></svg>
              </a>
            </div>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h5 className="font-bold text-foreground mb-3">Explore</h5>
            <ul className="space-y-2">
              <li><Link href="/portfolio" className="text-foreground/70 hover:text-accent-primary transition-colors">Portfolio</Link></li>
              <li><Link href="/services" className="text-foreground/70 hover:text-accent-primary transition-colors">Services</Link></li>
              <li><Link href="/process" className="text-foreground/70 hover:text-accent-primary transition-colors">Process</Link></li>
              <li><Link href="/shop" className="text-foreground/70 hover:text-accent-primary transition-colors">Shop</Link></li>
              <li><Link href="/blog" className="text-foreground/70 hover:text-accent-primary transition-colors">Blog</Link></li>
              <li><Link href="/about" className="text-foreground/70 hover:text-accent-primary transition-colors">About Us</Link></li>
            </ul>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h5 className="font-bold text-foreground mb-3">Services</h5>
            <ul className="space-y-2">
              <li><Link href="/services/custom-furniture" className="text-foreground/70 hover:text-accent-primary transition-colors">Custom Furniture</Link></li>
              <li><Link href="/services/decorative-carvings" className="text-foreground/70 hover:text-accent-primary transition-colors">Decorative Carvings</Link></li>
              <li><Link href="/services/architectural-elements" className="text-foreground/70 hover:text-accent-primary transition-colors">Architectural Elements</Link></li>
              <li><Link href="/services/restoration" className="text-foreground/70 hover:text-accent-primary transition-colors">Restoration</Link></li>
            </ul>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h5 className="font-bold text-foreground mb-3">Contact</h5>
            <address className="text-foreground/70 not-italic space-y-2">
              <p>Institute lane</p>
              <p>Mold, United Kingdom</p>
              <p><a href="tel:+447915998923" className="hover:text-accent-primary transition-colors">+44 7915 998923</a></p>
              <p><a href="mailto:riverdeechris@gmail.com" className="hover:text-accent-primary transition-colors">riverdeechris@gmail.com</a></p>
              <p><a href="https://wa.me/447915998923" className="hover:text-accent-primary transition-colors" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
            </address>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h5 className="font-bold text-foreground mb-3">Workshop Highlights</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-foreground/10">
                  <Image 
                    src="/BeeOnHoneyComb.jpg" 
                    alt="Bee carving preview" 
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-foreground/60">Latest work</p>
                  <p className="text-sm text-foreground/80">"Be kind" 🐝</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-foreground/10">
                  <Image 
                    src="/OwlFront.jpg" 
                    alt="Owl carving preview" 
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-foreground/60">Recent creation</p>
                  <p className="text-sm text-foreground/80">Golden sunset owl 🦉</p>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
        
  <MotionDiv 
          className="shadow-separator-medium pt-6 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-foreground/50 text-sm">© {new Date().getFullYear()} Lancaster Carving Limited. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-foreground/50 text-sm hover:text-foreground/80 transition-colors">Terms of Service</Link>
          </div>
  </MotionDiv>
      </div>
    </footer>
  );
}
