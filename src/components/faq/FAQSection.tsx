"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { generateFAQSchema } from "@/lib/seo";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  faqs: FAQ[];
  showContact?: boolean;
  className?: string;
  includeSchema?: boolean;
}

export function FAQSection({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our products, services, and processes.",
  faqs,
  showContact = true,
  className = "",
  includeSchema = true,
}: FAQSectionProps) {
  const faqSchema = includeSchema ? generateFAQSchema(faqs) : null;

  return (
    <div className={className}>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-2xl font-serif">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {showContact && (
            <div className="pt-6 border-t border-border">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for?
                </p>
                <Button asChild variant="outline">
                  <Link href="/contact">
                    <MessageCircle className="mr-2 w-4 h-4" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Predefined FAQ sets for different pages
export const generalFAQs: FAQ[] = [
  {
    question: "How long does a custom commission take?",
    answer:
      "Commission timelines vary based on complexity. Simple pieces take 2-4 weeks, moderate pieces 4-8 weeks, and complex sculptures can take 8-16 weeks. We'll provide a detailed timeline during your consultation.",
  },
  {
    question: "What types of wood do you use?",
    answer:
      "We work with premium hardwoods including English Walnut, European Oak, Wild Cherry, Field Maple, and sustainable Mahogany. All our wood is FSC certified and responsibly sourced.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship worldwide. Shipping costs vary by location and item size. We use professional packaging to ensure your piece arrives safely. International orders typically take 7-14 business days.",
  },
  {
    question: "Can I visit your workshop?",
    answer:
      "Absolutely! We welcome workshop visits by appointment. Contact us to schedule a time to see our craftsmen in action and discuss your project in person.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee on shop items. Custom commissions are non-refundable but we work closely with you throughout the process to ensure you're delighted with the final piece.",
  },
  {
    question: "Do you offer restoration services?",
    answer:
      "Yes, we restore and repair antique furniture and wood carvings. We can match original finishes, replace damaged sections, and bring heirloom pieces back to life.",
  },
];

export const commissionFAQs: FAQ[] = [
  {
    question: "How does the commission process work?",
    answer:
      "First, you submit a commission request with your vision. We'll schedule a consultation to discuss details, show wood samples, and provide a quote. Once approved, we begin crafting with regular progress updates. Final payment is due upon completion before shipping.",
  },
  {
    question: "Can I make changes during the commission?",
    answer:
      "Minor adjustments can be accommodated in early stages. Once carving begins, major changes aren't possible. We provide detailed sketches and mockups before starting to ensure we're aligned on the vision.",
  },
  {
    question: "What's the deposit and payment schedule?",
    answer:
      "We require a 50% deposit to begin work, with the remaining 50% due upon completion. For projects over £5,000, we offer milestone-based payment plans.",
  },
  {
    question: "Can I request specific wood or finish?",
    answer:
      "Absolutely! You can choose from our available wood species and finishing options. If you have a specific request not in our standard offerings, we can usually source it.",
  },
];

export const shippingFAQs: FAQ[] = [
  {
    question: "How much does shipping cost?",
    answer:
      "UK shipping is £15 flat rate, with free shipping on orders over £200. International shipping costs vary by destination and item size, calculated at checkout.",
  },
  {
    question: "How is my item packaged?",
    answer:
      "We use custom crating for larger pieces and professional foam padding for smaller items. Every piece is insured during transit. Fragile carvings receive extra protective packaging.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes! You'll receive a tracking number via email once your order ships. You can monitor its progress in real-time through our shipping partners.",
  },
  {
    question: "What if my item arrives damaged?",
    answer:
      "All shipments are fully insured. If damage occurs during transit, contact us immediately with photos. We'll file a claim and either repair or replace the item at no cost to you.",
  },
];
