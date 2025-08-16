# Full-Stack Website Audit

Repo: professional-website
Auditor: GitHub Copilot
Date: 2025-08-14

## Summary
- Health: 7.5/10
- Biggest risks: dual Next configs, CI scripts mismatch, robots blocking JSON.
- Fast wins: align npm scripts + add Lighthouse CI, consolidate Next config, fix robots and expand sitemap.

## Scope covered
- Read core configs (Next, TS, ESLint, Jest, Playwright, PostCSS, Lighthouse), app pages, key components, middleware, APIs, workflows, public assets, and large data modules. Enumerated the entire repo and sampled generated media files; no secrets found.

## Top issues (Severity · Impact · Location · Evidence · Recommendation · Effort)
1) Major · Build ambiguity · `next.config.ts` and `next.config.mjs` · Both exist with overlapping settings · Keep `.mjs`, merge analyzer/experimental, remove `.ts` · S
2) Major · CI pipeline breaks · `.github/workflows/qa.yml` · Calls scripts that don’t exist (`npm run test:unit`, `lighthouse`) · Add scripts and `@lhci/cli` devDependency · S
3) Major · SEO/PWA risk · `public/robots.txt` · `Disallow: *.json$` blocks manifest/JSON resources · Remove blanket block; explicitly allow `/manifest.json` and `/curated-manifest.json` · S
4) Medium · Incomplete sitemap · `src/app/sitemap.ts` · Only core pages listed · Add dynamic `/projects/[slug]` and `/shop/[category]` URLs · S
5) Medium · Security headers on GH Pages · `middleware.ts` vs static export · Middleware won’t run on static hosting · Add conservative CSP meta fallback in `layout.tsx` · S
6) Medium · LCP hints missing · `src/components/OptimizedImage.tsx` · No fetchPriority/decoding hints · Add `fetchPriority='high'` when `priority` and `decoding='async'` · S
7) Medium · Node version drift · Workflows vs local · QA uses Node 18; deploy uses 20 · Pin Node 20 in `.nvmrc` and `package.json engines`, update QA to 20 · S
8) Minor · Deploy artifact path · `.github/workflows/deploy-gh-pages.yml` · Uploads `./.next/export` but export step not run · Run `npm run export` and upload `./out` · S
9) Minor · Analyzer only in TS config · `next.config.ts` · ESM config lacks analyzer/experimental · Consolidate into `.mjs` · S
10) Minor · Apple touch icon SVG · `public/manifest.json` · Lighthouse prefers PNG for apple-touch-icon · Optional: add PNG `apple-touch-icon.png` · M

## CI/CD and scripts
- Add npm scripts: test variants and `lighthouse`; add `@lhci/cli`.
- Align Node to v20 across workflows; add `.nvmrc` and engines.
- Ensure export runs and correct artifact (`out/`).

## SEO, a11y, performance
- Fix robots.txt; expand sitemap; add LCP hints; consider PNG touch icon.
- a11y tests exist; keep enforcing jest-axe + Playwright a11y suites.

## Deliverables
- Report: this `AUDIT.md`.
- Patches: see `fixes/` (01–10) with unified diffs ready to apply.

## Notes
- If migrating from GH Pages to SSR hosting, prefer nonce-based CSP via middleware and durable rate limiting.
