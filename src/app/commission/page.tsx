"use client";

// Commission page is temporarily simplified while animation refactor is in progress.
// Original rich implementation (hero, configurator, form, process timeline) was removed due to
// structural corruption during a failed framer-motion lazy-loading conversion.
// TODO: Rebuild progressively using MotionDiv / lazyMotion pattern WITHOUT direct framer-motion import.

export default function CommissionPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-12 text-center gap-6">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-accent-primary">Commission Experience Updating</h1>
      <p className="max-w-xl text-sm md:text-base text-foreground/70 leading-relaxed">
        We're refactoring this page to defer heavy animation and 3D configurator code for faster initial loads.
        The full commission workflow (interactive configurator, request form, process timeline) will return shortly.
      </p>
      <p className="text-xs text-foreground/50">Placeholder page rendered intentionally minimal to restore a clean build.</p>
    </main>
  );
}
