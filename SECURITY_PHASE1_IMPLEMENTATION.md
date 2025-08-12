## Phase 1 Security & Performance Implementation

This document tracks execution of Phase 1 items from the audit roadmap.

### Objectives
- Add strong HTTP security headers.
- Provide an XML sitemap and baseline robots alignment.
- Establish bundle size visibility (analyzer) without blocking builds yet.
- Introduce accessible skip link & focus styles.
- Prepare for future image optimization (toggle unoptimized flag later).

### Checklist
- [x] middleware.ts created with headers: CSP, HSTS, Referrer-Policy, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, Strict-Transport-Security, X-DNS-Prefetch-Control
- [ ] CSP nonce generation util (if needed) and applied to inline scripts (deferred – inline scripts currently static LD+JSON; using 'unsafe-inline' hash until refactor)
- [x] Add sitemap route at `app/sitemap.ts` generating dynamic URLs.
- [x] Update robots.txt if sitemap path added (already present – verify includes sitemap line)
- [x] Add `analyze` npm script with `@next/bundle-analyzer` integration.
- [x] Add accessible skip link in `layout.tsx` + base styling in `globals.css`.
- [x] Add documentation comment block in `middleware.ts` describing policies & modification guide.

### CSP Draft
We start with a moderately strict CSP allowing same-origin plus required CDNs if any appear later.

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

This will tighten once inline JSON-LD is refactored to use nonce/hashes.

### Notes
- Production hosting must terminate HTTPS for HSTS to be effective.
- If GitHub Pages (static) is used, middleware will only work on a Node/Edge deployment; static export bypasses middleware. This may require a deployment strategy decision (e.g., Vercel) to benefit from headers. For now we implement; if exporting statically, generate a `/headers` config (Netlify) or GitHub Pages action alternative.

### Bundle Baseline (Captured 2025-08-12)
- Shared First Load JS: 101 kB
- Largest Route: 210 kB (projects/[slug], process)
- Targets: Shared < 85 kB (Phase 2), < 70 kB (Phase 3); Largest < 170 kB (Phase 2)
See `BUNDLE_BASELINE.md` for full detail and refactor plan.

### Next Hardening Steps (Phase 2+)
- Replace inline structured data scripts with nonce-based injection.
- Introduce Subresource Integrity for any external scripts/styles (if added).
- Add rate limiting / bot filtering (if server runtime available).
