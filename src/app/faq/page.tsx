"use client";

import { useState } from "react";
import { generateFAQSchema } from "@/lib/metadata";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What types of woodcarving services do you offer?",
      answer: "We offer a comprehensive range of woodcarving services including custom sculptures, bespoke furniture, architectural elements, decorative carvings, and restoration services. Each piece is handcrafted to your specifications using premium hardwoods sourced from sustainable forestry operations."
    },
    {
      question: "How long does a custom woodcarving project take?",
      answer: "Project timelines vary based on complexity and size. Simple decorative pieces may take 2-4 weeks, while complex sculptures or furniture can take 6-12 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the process."
    },
    {
      question: "Do you work with sustainable materials?",
      answer: "Yes, we exclusively use sustainably-sourced hardwoods from certified forestry operations. We believe in honoring both the craft and the environment that provides our materials. All our wood comes from responsibly managed forests."
    },
    {
      question: "Can you work from my design or create something custom?",
      answer: "Absolutely! We can work from your existing design, create something completely custom based on your vision, or collaborate to develop a design that perfectly matches your needs and space. We offer full design consultation services."
    },
    {
      question: "Do you offer restoration services for antique wooden pieces?",
      answer: "Yes, we specialize in restoring antique and damaged wooden pieces, preserving their historical value while restoring functionality and beauty. We use traditional techniques and carefully match original finishes and materials."
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is based on the complexity of the project, materials used, and time required. We provide detailed quotes after our initial consultation. Starting prices range from £800 for decorative pieces to £2,500+ for complex furniture or sculptures."
    },
    {
      question: "Do you ship your work?",
      answer: "Yes, we offer secure shipping throughout the United Kingdom and can arrange international shipping for larger pieces. We use professional art handlers and provide full insurance coverage during transit."
    },
    {
      question: "What areas do you serve?",
      answer: "We primarily serve the United Kingdom, with our workshop located in Mold, Flintshire. We welcome clients from across the UK and can arrange consultations in person or via video call for those further afield."
    },
    {
      question: "Do you offer maintenance and care instructions?",
      answer: "Yes, every piece comes with detailed care instructions and maintenance recommendations. We also offer ongoing support and can provide refinishing services for pieces that need attention over time."
    },
    {
      question: "Can you work with different wood types?",
      answer: "We work with a wide variety of hardwoods including oak, walnut, cherry, maple, and exotic woods. We'll help you select the perfect wood for your project based on your preferences, budget, and the intended use."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema()) }}
      />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-accent-primary mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Everything you need to know about our custom woodcarving services, 
            from project timelines to materials and pricing.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-background border border-foreground/10 rounded-lg shadow-sm"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-accent-primary/5 transition-colors"
                  aria-expanded={openItems.includes(index)}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <span className="text-accent-primary text-2xl font-light">
                    {openItems.includes(index) ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`px-6 pb-4 transition-all duration-300 ease-in-out ${
                    openItems.includes(index) 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center p-8 bg-accent-primary/5 rounded-lg border border-accent-primary/20">
            <h3 className="text-2xl font-serif font-bold text-accent-primary mb-4">
              Still Have Questions?
            </h3>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              We're here to help! Contact us for personalized answers about your specific project 
              or to schedule a consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-accent-primary text-background rounded-lg font-semibold hover:bg-accent-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="tel:+447915998923"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-accent-primary text-accent-primary rounded-lg font-semibold hover:bg-accent-primary/10 transition-colors"
              >
                Call +44 7915 998923
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
