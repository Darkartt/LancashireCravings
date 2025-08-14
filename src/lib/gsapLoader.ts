// Dynamic GSAP loader to avoid bundling GSAP on routes that never use it during initial load.
// Provides a cached promise so multiple calls reuse the same import.
let gsapPromise: Promise<typeof import('gsap')> | null = null;

export async function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = import('gsap');
  }
  return gsapPromise;
}
