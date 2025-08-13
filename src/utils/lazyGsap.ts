// Lightweight lazy loader for GSAP and optionally plugins to avoid pulling GSAP into the shared bundle
// Only client components should call these helpers (guard against SSR usage)

let gsapCorePromise: Promise<any> | null = null;
let scrollTriggerPromise: Promise<any> | null = null;

export async function getGsap() {
  if (typeof window === 'undefined') {
    // SSR safeguard – return a no-op stub
    return {
      timeline: () => ({ to: () => {}, from: () => {}, fromTo: () => {}, add: () => {}, set: () => {}, play: () => {} }),
      to: () => {},
      from: () => {},
      fromTo: () => {},
      set: () => {},
      registerPlugin: () => {},
      core: { Tween: {}, Timeline: {} }
    } as any;
  }
  if (!gsapCorePromise) {
    gsapCorePromise = import('gsap');
  }
  const mod = await gsapCorePromise;
  return (mod.gsap ?? mod.default ?? mod) as any;
}

export async function getScrollTrigger() {
  if (typeof window === 'undefined') return null;
  const gsap = await getGsap();
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = import('gsap/ScrollTrigger');
  }
  const { ScrollTrigger } = await scrollTriggerPromise;
  if (ScrollTrigger && (gsap as any).registerPlugin) {
    (gsap as any).registerPlugin(ScrollTrigger);
  }
  return ScrollTrigger;
}
