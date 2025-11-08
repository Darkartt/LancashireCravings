"use client";

import { CommissionForm } from "@/components/forms/CommissionForm";
import { Toaster } from "@/components/ui/sonner";

export default function CommissionPage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-4">
              Commission Your Masterpiece
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your vision into a bespoke work of art. Our master craftsmen bring decades of expertise
              to create one-of-a-kind pieces that tell your story.
            </p>
          </div>

          {/* Commission Form */}
          <CommissionForm />

          {/* Additional Info */}
          <div className="mt-16 max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-primary mb-2">1-3 Days</div>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Satisfaction Guaranteed</p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <div className="text-3xl font-bold text-primary mb-2">35+ Years</div>
                <p className="text-sm text-muted-foreground">Master Craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster position="top-center" richColors />
    </>
  );
}
