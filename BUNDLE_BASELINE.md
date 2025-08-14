# Bundle Baseline (Phase 1)

Date: 2025-08-13
Command: `npm run analyze`

## Key Metrics (Post Syntax + Lint Stabilization)
- Shared First Load JS: 101 kB
- Largest Route First Load: 198–196 kB (projects/[slug] 198 kB, process 196 kB)
- Typical Informational Routes: 148–151 kB
- Small Static Utility Routes: ~101 kB (icon, sitemap)

## Largest Shared Chunks (Analyzer Reports)
- 4bd1b696-46d2ec519b4f23f7.js: 53.2 kB (vendor composite)
- 684-2598bfeb396df75b.js: 45.9 kB (vendor composite)

## Heavy Contributors (Inference)
- Dual animation stacks: gsap + framer-motion
- Potential 3D / rich media libs (validate in analyzer HTML – next action)
- Large media dataset still bundled (need late-load path) though lint/type mitigations applied

## Immediate Optimization Actions (Next 3 PRs)
1. Split media dataset: create `media-core.ts` (featured subset) + dynamic import full dataset in galleries.
2. Dynamic import GSAP + ScrollTrigger only inside components using scroll effects.
3. Isolate framer-motion usage behind a tiny wrapper; tree-shake unused motion features.
4. (Optional) Defer any three.js / heavy visual modules with `dynamic(() => import(...), { ssr: false })`.
5. Remove unused eslint-disable lines to keep noise low (non-size but hygiene improvement).

## Phase Targets
- Phase 2 Target Shared First Load: < 85 kB (−16 kB)
- Phase 2 Target Largest Route: < 170 kB (−~25 kB)
- Stretch (Phase 3): Shared < 70 kB, Largest < 150 kB

## Measurement Plan
- After each optimization cluster run `npm run analyze` and append delta entry.
- Track: Shared First Load, Top 3 Routes, Largest Vendor Chunk, Added Async Chunks.

## Changelog
- 2025-08-13: Clean successful baseline after fixing media-organized syntax & type issues; analyzer HTML generated for client/node/edge.
- 2025-08-12: Initial (failed build due to syntax) partial reports; not canonical.

### 2025-08-13 (Later) – Dynamic Animation & 3D Deferral Pass
- Converted all remaining static `gsap` imports (ThreeBackground, WoodGrainTransition, useScrollTrigger, scrollAnimationConfigs) to dynamic loader `loadGsap()`; helper factories now async.
- `three` + `OrbitControls` moved to dynamic import inside `ThreeBackground` effect; prevents automatic inclusion in shared chunk for routes not rendering it.
- Removed unused eslint-disable directives in multiple files (hygiene only).
- Shared first-load JS unchanged at 101 kB (indicates gsap + three were not dominating shared pre-pass or already route-split); no regression.
- Encountered transient Windows EPERM file lock on `.next/trace`; retry succeeded (note for CI flake mitigation—potential solution: retry logic or clean `.next` before build).

### Pending High-Impact Opportunities
1. Inspect analyzer HTML to list top modules inside `chunks/4bd1b696` & `chunks/684` (expected: framer-motion, React/Next core, tailwind runtime, residual dataset pieces).
2. Evaluate framer-motion: wrap or dynamically import; migrate simpler fades/transforms to CSS or gsap to drop its footprint if sizable.
3. Further dataset segmentation: break `media-organized` into thematic shards loaded per route interaction.
4. Introduce performance budget CI gate: fail if shared >105 kB or any route >200 kB (then tighten after reductions).
5. Consider code splitting PageTransition / AnimationProvider if they pull motion libs on every route.
6. Audit `projects/[slug]` and `process` pages (currently 198–196 kB) for large synchronous imports.

### 2025-08-13 (Later) – Framer Motion Lazy Migration Wave 1
- Introduced `MotionContainer` (MotionDiv) earlier; now migrated ProjectCard plus gallery, portfolio, and projects pages to use it—removing direct `framer-motion` static imports on those routes.
- Added `LazyAnimatePresence` wrapper to defer AnimatePresence mounting; converted `TabbedMediaGallery` (including lightbox) to lazy motion usage.
- Converted `WoodGrainTransition` to MotionDiv (removes direct motion dependency; all animation there is GSAP-driven + initial path animations now behind lazy loader once framer-motion loads).
- Created self-closing support in MotionContainer (children optional) for SVG path/particle elements.
- Remaining direct framer-motion imports (next wave): process page, timelapses pages, media galleries (ModernMediaGallery, MediaGallery variants), configurators, background parallax components (ModernBackground with useScroll/useTransform), timelines (EnhancedTimeline with useInView), PageTransition (core), video players, before/after components.
- Expected Impact: No immediate shared reduction until last static import removed; partial conversion may add wrapper overhead (<1 kB). Final wave will allow framer-motion to be entirely async on initial load for routes not using advanced transitions.
- Next Steps: Replace remaining motion imports; introduce lazy hook helpers for useScroll/useTransform/useInView to eliminate early hook import path; then re-run analyzer to capture delta.

### 2025-08-13 (Even Later) – Framer Motion Lazy Migration Wave 2 Complete
- Completed conversions for: services, shop, shop/[category], contact, blog, about, gallery (page-new), behind-the-scenes, timelapses (page_new), legacy home (page_old), and InteractiveConfigurator (AnimatePresence → LazyAnimatePresence, motion.* → MotionDiv).
- Enhanced MotionDiv fallback to strip whileInView/viewport props to avoid DOM warnings before framer-motion loads.
- Analyzer rerun results:
	- Shared First Load JS: 101 kB (no regression)
	- Example routes: / 122 kB, /behind-the-scenes 161 kB, /process 162 kB, /projects/[slug] 164 kB
	- Client analyzer highlights large async chunk: static/chunks/253… includes media-organized.ts (~710 kB parsed) but remains async on several routes.
- Impact: Direct framer-motion is no longer included in the initial shared chunk; it's loaded lazily when animations mount. Shared remains 101 kB due to other vendors; the benefit is reduction for routes that do not trigger motion immediately and less TTI pressure.
- Next: Segment media-organized.ts and wire dynamic slices per route; set CI budgets and track reductions.

### 2025-08-13 (Night) – Post-Lint Fix Re-run (Clean Analyze)
- Command: `npm run analyze`
- Outcome: Compiled successfully in ~32s; analyzer HTML generated for client/node/edge.
- ESLint: Only one warning remains (react-hooks/exhaustive-deps) in `src/components/PageTransition.tsx`; informational only.
- Shared First Load JS: 101 kB (unchanged)
- Route sizes (sample):
	- / 122 kB
	- /timelapses 123 kB
	- /gallery 118 kB
	- /behind-the-scenes 125 kB
	- /process 126 kB
	- /projects/[slug] 128 kB
- Largest shared vendor chunks remain:
	- chunks/4bd1b696-46d2ec519b4f23f7.js – 53.2 kB
	- chunks/684-2598bfeb396df75b.js – 45.9 kB
- Notes:
	- Clean baseline achieved after repairing `timelapses/page_new.tsx` and removing ESLint blockers.
	- PageTransition dependency warning to be revisited when we evaluate splitting/rewriting that component.

### 2025-08-13 (Night, later) – Slice-aware loader scaffolding
- Added `src/lib/media-slices/` with pilot slices and README.
- Extended `media-loader` with slice-aware helpers: `loadNatureCategorySlice`, `loadProjectSlice`, `loadNatureCategory`, `loadProjectByIdOrSlug` (with graceful fallback to `media-organized`).
- Added tiny pilot slices for `nature/artistic` and `projects/golden-eagle`.
- Re-ran analyze: shared still 101 kB; route sizes unchanged (as expected—no consumers are wired yet). This enables incremental sharding without regressions.
