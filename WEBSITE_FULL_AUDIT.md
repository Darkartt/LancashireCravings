# Comprehensive Full-Stack Website Audit

Date: 2025-08-12  
Repository: `check2` (Next.js App Router project)  
Audited By: Automated Senior Full‑Stack Review (GitHub Copilot)

---

## 1. Executive Summary

The project is a Next.js 15 (App Router) TypeScript application targeting a polished, animation‑heavy artisanal brand site (Lancaster Carving Limited). It integrates advanced scrolling/animation stacks (Lenis + GSAP ScrollTrigger patterns via custom hooks), Three.js/@react-three/fiber, Framer Motion, Lottie, custom structured data, Lighthouse CI, Playwright (multi‑device + visual + performance + accessibility), Jest + Testing Library + jest-axe, and Tailwind CSS v4 (canary) with Lightning CSS experimental optimization.

Strengths:
- Modern framework (Next 15) with strong testing ecosystem and performance monitoring (Lighthouse CI thresholds aggressive).
- Accessibility and SEO diligence (structured data, metadata generation, jest-axe, robots.txt, PWA manifest).
- Modular animation architecture: `ScrollTriggerProvider`, `AnimationProvider`, smooth scroll integration, reduced-motion respect.
- Domain modeling via TypeScript in `lib/data.ts` with utility pricing logic.
- Thoughtful image handling component (`OptimizedImage`) with graceful error/placeholder and progressive loading handling.
- Comprehensive test scaffolding (unit, integration, e2e, visual, performance, accessibility) though real coverage likely partial.

Key Risks / Gaps:
- Performance risk from heavy animation, multiple DOM observers, potential layout thrash, missing code-splitting of large libs (three/gsap) & absence of dynamic imports for seldom-used 3D/animation modules.
- No explicit API routes / backend integration—business logic purely static; potential future dynamic needs (contact form, commerce) not scaffolded.
- Tailwind v4 (pre‑release) may introduce instability; fallback strategy not documented.
- CSS duplication: multiple `globals.css` variants (`globals.css`, `globals_backup.css`, `globals_new.css`)—risk of config drift.
- Lacking security hardening: CSP, security headers, form spam/protection, dependency audit process.
- Inconsistent null SSR guarding (some components early-return `null` waiting for `isClient`; risk of layout shift & SEO content gaps if overused).
- Potential hydration mismatch risk: broad `HydrationSuppressor` usage could mask mismatches rather than solve underlying issues.
- `OptimizedImage` forces `style={{ width: 'auto', height: 'auto' }}` which may undermine responsive layouts & CLS management when dimensions omitted.
- Large static datasets in multiple `media-*` files (not fully inspected) can inflate bundle if imported client-side.
- Strict ESLint exceptions disable valuable rules (`@typescript-eslint/no-explicit-any`, `prefer-const`) reducing code quality enforcement.
- Lack of runtime validation (Zod imported but not applied in observed code parts) for form inputs or dynamic data.
- Missing sitemap.xml referenced in `robots.txt` (pointing to `https://exampledesign.co.uk/sitemap.xml`—not in repo).

Priority Recommendations (Top 10):
1. Implement bundle analysis & dynamic imports for heavy libraries (three, gsap, lottie) + route-level code splitting.
2. Add security headers middleware (CSP, Strict-Transport-Security, X-Frame-Options, Referrer-Policy).
3. Consolidate global CSS; remove backups from production build path; document styling architecture.
4. Introduce server actions / lightweight API endpoints for contact / commission forms with spam protection (honeypot + rate limit + validation via Zod). 
5. Apply Zod schemas for form validation; unify with `useFormValidation` or replace with RHF + resolver to remove duplication.
6. Add sitemap generation (Next.js route handler or build script) + open graph image optimization pipeline.
7. Establish image optimization (modern formats: AVIF/WebP) & responsive `sizes` refinements; consider `next/image` fill layout patterns.
8. Introduce dependency + vulnerability scanning (e.g., `npm audit --production` in CI) & renovate / dependabot automation.
9. Optimize animation initialization (reduce multiple observers, unify intersection logic, throttle/cancel on route transitions).
10. Add performance budgets & bundle size thresholds in CI (e.g., `@next/bundle-analyzer` + `size-limit`).

---

## 2. Technology & Stack Inventory

Languages:
- TypeScript (strict true, but some relaxed lint rules) & React JSX/TSX.
- JavaScript config files (ESM style in ESLint config, CJS in some others).
- CSS (Tailwind + custom styles, plus potential inline styles & transitions) + experimental Lightning CSS.
- JSON / manifest / structured data / logs, Markdown documentation.
- Python utilities (`animal_photo_sorter.py`, etc.) unrelated to web runtime (auxiliary media processing pipeline).
- Shell script (`compress_videos.sh`) for ffmpeg-based asset optimization (Windows exe included).

Frontend Libraries:
- Next.js 15.3.3 (App Router, metadata API used).
- React 18.2 (Concurrent capabilities implicit).
- Framer Motion (page/element animations).
- GSAP + ScrollTrigger (scroll-based animations via custom provider; actual GSAP import not yet seen in audited files, likely in other animation components).
- Lenis for smooth scrolling.
- Three.js + @react-three/fiber + @react-three/drei (3D backgrounds / effects not yet fully reviewed, potential large payload).
- Lottie (both `lottie-react` & `@lottiefiles/react-lottie-player`—duplication to rationalize).
- Lucide Icons (SVG icon set).
- Tailwind CSS v4 (alpha) + Lightning CSS (minification).

Backend / Server:
- No traditional backend code (no `app/api` routes found in scanned subset). Purely SSG/SSR pages.
- Potential static export orientation (commented `output: 'export'`) aligned to GitHub Pages but currently disabled for dynamic features.

Testing & QA:
- Jest + Testing Library (unit/integration/accessibility/performance pseudo-tests).
- jest-axe for a11y assertions.
- Playwright multi-project (desktop/mobile/tablet + separate visual/perf/a11y slices).
- Lighthouse CI with aggressive thresholds.

Performance / Build Tooling:
- Experimental: `cssChunking`, Lightning CSS; no custom SWC plugin specifics; no bundle analyzer.

SEO / A11y / PWA:
- Metadata generation centralised in `lib/metadata.ts`.
- Structured data (organization, website, product, article) inserted via `<script type="application/ld+json">`.
- `robots.txt`, `manifest.json`, icons present. Missing `sitemap.xml` generation in repo.

Security:
- No explicit middleware for headers.
- No input sanitization logic seen for future forms (contact/commission page not yet examined in-depth).

Data & Domain:
- Domain model types for `WoodType`, `FinishType`, `ProjectType`, `PortfolioItem`, `BlogPost`.
- Pricing logic `calculateProjectPrice` simple predictable formula.
- Multiple large media descriptor files may create bloat; consider server-only modules or edge caching approach.

---

## 3. Directory & Structure Review (High-Level)

`src/app/` – Route segments: about, portfolio, services, commission, contact, etc. (Not all inspected line-by-line due to size; recommend automated route inventory script.)  
`src/components/` – Presentation & animation utilities, providers, galleries, backgrounds, 3D wrappers, forms. Some duplicate “.new” variants (e.g., `AnimationProvider.tsx.new`)—refactor / remove stale variants.  
`src/hooks/` – Animation, scroll & form utilities.  
`src/lib/` – Data sets, metadata, projects/media config, scroll animation configs.  
`public/` – Mixed raster images (JPG/JPEG), some capitalized filenames, inconsistent naming (`fish#1.jpg` vs `Fish#3.jpg`)—potential URL issues & case-sensitivity hazards on Linux hosting; hash (#) in file names may cause URL encoding problems—should rename.

Observations:
- Mixed naming conventions (camelCase, kebab-case, PascalCase, spaces in MD file names). Standardize for portability.
- Backups & alternative versions clutter root (numerous reports). Consider `docs/` folder.
- Potentially large static JSON result files (analysis logs) inflate repo; exclude from production build via `.next` ignore or move to separate data store.

---

## 4. Frontend Architecture & Component Patterns

Providers: Layered context for animation (Lenis + ScrollTrigger) promoting separation of concerns.  
Issue: Direct DOM querying in `AnimationProviderInner` (`document.querySelectorAll`) executed each route—could be abstracted into custom hook & selective targets; potential memory leaks if observers not fully disconnected on rapid route changes.

IntersectionObserver:
- Observes every animated element with generous thresholds. For many elements this can degrade performance; prefer single root Observer or CSS `@starting-style` transitions + `view-timeline` (when supported) fallback. Or unify with GSAP ScrollTrigger rather than separate parallel systems.

Parallax Logic:
- Direct inline style mutation and CSS variable updates each scroll frame (throttled via rAF). Good that rAF used, but consider using `transform` layers & will-change hints with constraints to avoid layout.

State & Context:
- `cursorPosition` & `scrollProgress` tracked; could be exposed via simpler event subscription to avoid re-renders—consider using `useSyncExternalStore` or throttle + custom event dispatch for lower render churn.

Image Handling:
- `OptimizedImage` overlays skeleton but uses `style={{ width:'auto' }}` which may cause intrinsic layout shift—prefer specifying width/height or using container aspect ratios.

Accessibility Considerations:
- Good: ARIA labels, focus styles, `aria-expanded` on menu, support for keyboard nav in tests.
- Missing: Skip-to-content link, landmark completeness check (header has banner; confirm main, footer landmarks present site-wide), focus trap for open mobile menu (currently not enforced), ARIA for animations (reduce motion already respected partially). 

Dark Mode:
- `isDarkMode` state placeholder unused; implement system preference detection + tailwind `dark:` classes or remove until needed.

---

## 5. Performance & Web Vitals Risks

Potential Issues:
- Bundle size from Three.js, GSAP, Lottie, Framer Motion concurrently.
- Multiple animation libraries—rationalize (Framer Motion + GSAP overlap).
- Static data arrays imported client-side inflate initial JS; move large catalogs to server components or lazy modules.
- Unoptimized images (JPEGs not converted to WebP/AVIF; inconsistent sizing; no explicit preloading for LCP asset aside from logo).
- `images.unoptimized: true` in Next config disables Next Image Optimization pipeline—makes sense for static export but sacrifices automatic resizing/compression; consider conditional enabling per deployment target.
- No service worker / caching strategy aside from default; could leverage Next middleware or edge caching for static assets.

Recommendations:
1. Introduce bundle analyzer & tree-shake Three.js (only import required submodules) or load 3D route lazily.
2. SSR-only structured data & move animation code to client components only where needed to reduce hydration payload.
3. Replace manual IntersectionObserver animation triggers with CSS `@media (prefers-reduced-motion)` and single animation library.
4. Evaluate replacing some GSAP sequences with native `scroll-timeline` (progressive enhancement) or Framer Motion scroll features.
5. Re-enable Next Image Optimization (remove `unoptimized`) for production (unless GitHub Pages static export requirement persists; if so integrate pre-build image optimization script).

---

## 6. UI/UX & Mobile Responsiveness

Pros:
- Mobile navigation toggle & accessible states.
- Motion gating partially via reduced-motion detection (Lenis disabled).
- Consistent spacing & typographic hierarchy (from partial inspection). 

Areas to Improve:
- Provide explicit tap targets (44px) for mobile menu items (check actual applied classes).
- Add sticky offset compensation to anchor scroll (header height) when using `scrollTo`.
- Consider in-view progressive image reveal with low-quality placeholder (LQIP) for gallery assets—currently placeholder blank or pulse block.
- Add global focus outline visibility improvements (avoid relying only on color changes).
- Provide content skeleton for main hero to mitigate CLS.

---

## 7. Business Logic & Forms

- `useFormValidation` duplicates capabilities of React Hook Form & Zod; unify for maintainability.
- Price calculation simple; consider currency formatting & future tax/shipping logic separation.
- Missing anti-spam (honeypot field, time trap) & server-side validation endpoints.

---

## 8. Testing Strategy Assessment

Strengths:
- Multi-dimensional Playwright setup (visual/perf/a11y) suggests aim for robust coverage.
- jest-axe integrated for accessibility baseline.
- Performance measurement helper in tests.

Gaps:
- Only 1 unit test file observed (Header). Need broader component & hook coverage.
- No contract tests for pricing logic or data integrity (e.g., ensuring wood types unique IDs).
- Visual regression config present but sample tests not visible; ensure threshold tolerances defined.
- Performance tests (Playwright `performance` project) rely on custom naming—need explicit metrics extraction (e.g., using `page.metrics()` or tracing) for actionable budgets.

Recommendations:
1. Add test coverage thresholds in Jest config (lines/statements >80% initially).
2. Add hook tests (`useLenis`, `useScrollTrigger`, `useFormValidation`).
3. Expand accessibility tests for all primary routes.
4. Integrate per-PR Lighthouse CI run (currently multiple URLs; ensure PR gating).
5. Add smoke test that builds + exports (if static mode required) to catch export regressions.

---

## 9. Code Quality & Linting

Pros:
- Flat ESLint config with Next core web vitals.
- TypeScript strict mode enabled.

Concerns:
- Disabling `prefer-const` and `no-explicit-any` reduces guidance.
- Some large components (AnimationProvider ~350 lines) would benefit from modularization.
- Potential inconsistent naming & residual `.new` or backup files.

Recommendations:
1. Re-enable `prefer-const`; audit legitimate mutation cases.
2. Replace `any` with generics or unknown + narrowing.
3. Split AnimationProvider: cursor tracking, intersection animations, parallax, scroll triggers into dedicated hooks.
4. Add Prettier or adopt ESLint formatting rules for consistent style.
5. Enable import/order rule to group dependencies.

---

## 10. Security & Compliance

Findings:
- No CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy headers.
- External links (if any) need `rel="noopener noreferrer"` (Lighthouse rule enforced but verify).
- Form inputs not sanitized beyond client validation, absence of server processing.
- `robots.txt` disallows `*.json$` (but some JSON likely needs to be public if referenced); pattern may inadvertently block structured data endpoints if added later.

Recommendations:
1. Add middleware for security headers.
2. Implement minimal serverless route for form submissions with validation & rate limiting.
3. Add dependency vulnerability scanning (GitHub Dependabot alerts / audit job).
4. Evaluate GDPR compliance (cookie consent if tracking added later); currently no analytics observed.

---

## 11. SEO & Structured Data

Pros:
- Central metadata factory ensures consistency.
- JSON-LD for organization & website included (good). Could defer script execution or inline safely.

Areas:
- Missing sitemap generation artifact.
- Canonical handling: passes optional canonical but many pages may lack distinct canonical logic.
- Keywords meta largely deprecated; consider focusing on content semantics.
- Check duplicate titles for deeper routes; dynamic per route recommended.

Recommendations:
1. Add dynamic generation of canonical & openGraph images per route.
2. Implement sitemap builder script at build-time.
3. Add breadcrumbs structured data if site depth warrants.
4. Provide alt text audit for all images—some raw media file names may lack contextual alt usage.

---

## 12. Maintainability & Scalability

Strengths: Centralized providers & data libs.
Risks: Overly large monolithic providers, static dataset duplication (multiple media-* variants), lacks feature module boundaries.

Suggestions:
- Introduce `features/` modules (e.g., `features/portfolio`, `features/animations`, `features/forms`).
- Convert large static arrays to server-only modules (mark with `'use server'` or place under `src/server/`).
- Provide a design system primitives layer (Buttons, Headings, Layout) for consistency.

---

## 13. Asset & Media Pipeline

Findings:
- Raw JPEG assets, inconsistent naming & capitalization, presence of `#` character (URL-unsafe) in filenames (e.g., `fish#1.jpg`).
- No WebP/AVIF alternate variants; potential large transfer sizes.
- ffmpeg binary & script implies video compression intent, but not integrated into CI.

Recommendations:
1. Standardize filenames (lowercase, hyphenated, no special characters) & add pre-commit renaming script.
2. Add image optimization pipeline (Sharp script) pre-build to generate responsive sizes & modern formats.
3. Implement asset hashing / caching headers via Next config or CDN layer.
4. Remove platform binaries (`ffmpeg.exe`) from repo; use CI-installed package to reduce size.

---

## 14. Logging & Error Handling

Pros: ErrorBoundary component in RootLayout.
Improvements: Add Sentry (or similar) integration for runtime error telemetry; granular error boundaries around 3D/animation heavy sections.

---

## 15. Dependency Optimization

Potential Redundancies:
- Both `lottie-react` and `@lottiefiles/react-lottie-player`; choose one.
- GSAP + Framer Motion overlap for simple entrance animations; evaluate consolidating to a single library for foundational animations; reserve GSAP for complex timelines.

Upgrade / Monitoring:
- Track Tailwind v4 stability; pin to a specific pre-release tag or revert to 3.x stable until GA.

---

## 16. Detailed Improvement Plan (Phased)

Phase 1 (Immediate / High ROI):
- Add security headers middleware.
- Implement sitemap generator + verify robots reference.
- Re-enable image optimization or add build-time optimizer.
- Introduce bundle analyzer & dynamic imports for Three / GSAP heavy components.
- Rename unsafe media filenames & remove duplicates/backups.

Phase 2 (Next 2–4 Weeks):
- Refactor AnimationProvider into modular hooks; reduce DOM querying; unify animation strategy.
- Integrate Zod + RHF for forms; add server action endpoint for commission form.
- Add skip link, focus trap for mobile menu, accessibility regression tests per core route.
- Add logging/monitoring (Sentry) & error boundaries per feature.

Phase 3 (1–2 Months):
- Asset pipeline modernization (WebP/AVIF generation, video streaming strategy, CDN).
- Introduce design system + tokens, remove style drift.
- Implement advanced performance budgets (size-limit, route-level RUM collection).
- Replace redundant animation libs; evaluate Web Animations API / native scroll timelines.

Phase 4 (Scaling / Future):
- CMS integration (e.g., Sanity / Contentlayer) for blog & portfolio items (reduce hard-coded data).
- Edge caching & serverless optimization (conditional static export vs hybrid SSR).
- Internationalization (i18n) & accessibility localization.

---

## 17. Sample Action Items Table

| ID | Action | Priority | Effort | Owner | Notes |
|----|--------|----------|--------|-------|-------|
| A1 | Add security headers middleware | High | Low | DevOps | Use Next middleware | 
| A2 | Dynamic import Three/GSAP components | High | Medium | Frontend | Reduces initial bundle |
| A3 | Generate sitemap.xml on build | High | Low | SEO | Sync with robots.txt |
| A4 | Image optimization (WebP/AVIF) | High | Medium | Frontend | Use `sharp` script pre-build |
| A5 | Consolidate animation libs | Medium | Medium | Frontend | Keep GSAP OR Framer | 
| A6 | Zod + RHF integration | Medium | Medium | Frontend | Improves validation |
| A7 | Refactor AnimationProvider | Medium | Medium | Frontend | Split into hooks |
| A8 | Rename unsafe media filenames | Medium | Low | Content | Remove `#` / capitals |
| A9 | Add skip link & focus trap | Medium | Low | Accessibility | A11y improvement |
| A10| Add bundle & size budget CI | High | Low | DevOps | Guard regressions |

---

## 18. Suggested Code Snippets (Illustrative)

Security Headers Middleware (`src/middleware.ts`):
```
import { NextResponse } from 'next/server';

export function middleware(req) {
  const res = NextResponse.next();
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "img-src 'self' data: https:" ,
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data: https:",
    "connect-src 'self' https:" ,
  ].join('; '));
  return res;
}
```

Dynamic Import Example:
```
const ThreeCanvas = dynamic(() => import('@/components/backgrounds/ThreeBackground'), { ssr: false, loading: () => <Skeleton /> });
```

Bundle Analyzer Integration (add dev dependency & script):
```
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
export default withBundleAnalyzer(nextConfig);
```

Zod + RHF Integration (Concept):
```
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

Sitemap Generation (build script):
```
// scripts/generate-sitemap.mjs
import { writeFileSync } from 'fs';
const base = 'https://exampledesign.co.uk';
const routes = ['/', '/about', '/portfolio', '/services', '/commission'];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
 routes.map(r => `<url><loc>${base}${r}</loc></url>`).join('\n') + '\n</urlset>';
writeFileSync('public/sitemap.xml', xml);
```

---

## 19. Risk Matrix (Selected)

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Large initial JS bundle | High | High | Dynamic imports, tree-shaking, analyzer |
| Animation performance jank | Medium | Medium | Reduce observers, unify animation libs |
| Missing security headers | Medium | High | Middleware headers |
| Unoptimized images | High | High | Re-enable image optimizer / pre-process |
| Accessibility regressions | Medium | Medium | Expand jest-axe & Playwright a11y tests |
| Tailwind v4 instability | Medium | Medium | Lock version, add fallback branch |

---

## 20. Conclusion

The codebase establishes a strong foundation emphasizing motion, visual polish, and testing scaffolding. The next maturity leap requires disciplined performance optimization, security hardening, accessibility refinements, and consolidation of overlapping animation/form utilities. Implementing the prioritized recommendations will reduce technical debt, improve Core Web Vitals, and enhance resilience for future dynamic features (commerce, CMS, internationalization).

---

## 21. Appendices / Further Work

Potential follow-ups not yet implemented:
- Full inventory script output of all route components & their client/server boundaries.
- Lighthouse CI recent run artifact summary (not generated during this static audit).
- Detailed bundle size diff pre/post optimization.
- Automated filename normalization script.

If you’d like, subsequent steps can implement the Phase 1 action items directly (e.g., add middleware, sitemap script, bundle analyzer). Let me know to proceed.

---

End of Report.
