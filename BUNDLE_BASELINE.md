# Bundle Baseline (Phase 1)

Date: 2025-08-12
Command: `npm run analyze`

## Key Metrics
- Shared First Load JS: 101 kB
- Largest Route First Load: 210 kB (projects/[slug], process)
- Typical Informational Routes: 149–159 kB
- Static lightweight routes: ~101 kB (icon, sitemap)

## Largest Shared Chunks
- 4bd1b696-46d2ec519b4f23f7.js: 53.2 kB
- 684-2598bfeb396df75b.js: 45.9 kB

## Likely Contributors
- three / @react-three/fiber / @react-three/drei (3D configurator)
- gsap + framer-motion (dual animation libs)
- Lottie libraries (two variants) – consider consolidating
- Massive `media-organized.ts` static object (loaded eagerly?)

## Immediate Optimization Targets (Phase 1/2 Bridge)
1. Lazy load 3D configurator (dynamic import, SSR false) – only on pages where used.
2. Code-split large media dataset: dynamic import when gallery opens.
3. Evaluate removing one Lottie implementation; load lazily (dynamic import) where used.
4. Conditional import GSAP only when scroll-trigger components mount.
5. Audit framer-motion usage for shared utilities; potentially create a lightweight motion wrapper.

## Targets
- Phase 2 Target Shared First Load: < 85 kB
- Phase 2 Target Largest Route: < 170 kB
- Stretch (Phase 3): Shared < 70 kB, Largest < 150 kB

## Measurement Plan
- Re-run `npm run analyze` after each refactor cluster.
- Record deltas in CHANGELOG section below.

## Changelog
- 2025-08-12: Baseline captured.
