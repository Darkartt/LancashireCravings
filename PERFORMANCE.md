# Performance Optimization Guide

## Lighthouse Score Target: 95+

### Current Optimizations ✅

#### 1. Build & Bundle Optimization
- **Status**: Implemented
- Next.js 15.3.3 with App Router
- Static export for optimal performance
- Automatic code splitting
- Tree shaking enabled
- Production builds optimized

**Build Stats**:
```
Total Pages: 40
First Load JS (shared): 101 kB
  - chunks/1684: 45.9 kB
  - chunks/4bd1b696: 53.2 kB
  - other shared: 2.06 kB

Largest Pages:
  - /commission: 39.8 kB (192 kB total)
  - /checkout: 6.93 kB (168 kB total)
  - /process: 10.2 kB (128 kB total)
  - /projects/[slug]: 9.4 kB (128 kB total)
```

#### 2. Image Optimization
- **Status**: Implemented
- Next.js Image component used throughout
- Lazy loading for below-fold images
- `OptimizedImage` component with priority flag support
- Proper sizing and responsive images
- SVG for logos and icons

**Recommendations**:
- [ ] Add WebP/AVIF format support
- [ ] Implement blur placeholders for images
- [ ] Add explicit width/height to all images
- [ ] Consider image CDN for production

#### 3. Font Loading
- **Status**: Needs optimization
- Currently using system fonts via Tailwind

**Recommendations**:
- [ ] If custom fonts added, use `next/font` for optimization
- [ ] Implement `font-display: swap` strategy
- [ ] Preload critical fonts

#### 4. CSS Optimization
- **Status**: Implemented
- Tailwind CSS v4 with minimal footprint
- CSS layers for organization
- PostCSS for optimization
- Critical CSS inlined

**Current Setup**:
```css
@layer reset, base, components, utilities;
- Reset layer: Normalize/reset styles
- Base layer: Design tokens, custom properties
- Components layer: Component-specific styles
- Utilities layer: Tailwind utilities
```

#### 5. JavaScript Loading Strategy
- **Status**: Partially optimized
- React 19.0.0 for improved performance
- Dynamic imports for heavy components
- Client components marked with "use client"
- Server components where possible

**Recommendations**:
- [ ] Lazy load commission form steps
- [ ] Defer non-critical third-party scripts
- [ ] Use React.lazy() for code splitting large components

#### 6. Resource Hints
- **Status**: Partially implemented
- Logo preload in layout.tsx:46

**Recommendations**:
- [ ] Add dns-prefetch for external resources
- [ ] Preconnect to critical third-party domains
- [ ] Prefetch key navigation pages

### Performance Metrics

#### Core Web Vitals Targets

| Metric | Target | Status |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ Static export optimized |
| **FID** (First Input Delay) | < 100ms | ✅ Minimal JavaScript |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ⚠️ Needs image dimension attributes |
| **FCP** (First Contentful Paint) | < 1.8s | ✅ Static HTML |
| **TTI** (Time to Interactive) | < 3.8s | ✅ Optimized bundle |
| **TBT** (Total Blocking Time) | < 300ms | ✅ Efficient code |

### Lighthouse Categories

#### 🎯 Performance (Target: 95+)

**Current Optimizations**:
- ✅ Static site generation
- ✅ Minified assets
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Optimized images

**To Improve**:
- [ ] Add explicit width/height to images (prevents CLS)
- [ ] Implement blur placeholders
- [ ] Reduce JavaScript bundle size
- [ ] Optimize third-party scripts
- [ ] Add resource hints

#### ♿ Accessibility (Target: 95+)

**Current Implementation**:
- ✅ Skip links (layout.tsx:49)
- ✅ Semantic HTML throughout
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Form labels and validation
- ✅ Alt text support (needs audit)

**To Improve**:
- [ ] Complete image alt text audit
- [ ] Verify color contrast ratios
- [ ] Test with screen readers
- [ ] Add loading state announcements

#### 🎨 Best Practices (Target: 95+)

**Current Implementation**:
- ✅ HTTPS (when deployed)
- ✅ No console errors in production
- ✅ Proper DOCTYPE
- ✅ Valid HTML
- ✅ CSP headers (layout.tsx:26)
- ✅ Secure dependencies

**Content Security Policy**:
```
default-src 'self'
img-src 'self' data: blob: https:
style-src 'self' 'unsafe-inline'
script-src 'self' 'unsafe-inline'
font-src 'self' data:
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'self'
```

#### 🔍 SEO (Target: 95+)

**Current Implementation**:
- ✅ Meta descriptions (metadata.ts)
- ✅ OpenGraph tags
- ✅ Twitter Cards
- ✅ Structured data (JSON-LD)
  - Organization schema
  - Website schema
  - Product schema
  - CreativeWork schema
  - Service schema
  - FAQPage schema
  - BreadcrumbList schema
- ✅ Canonical URLs
- ✅ Robots meta tags
- ✅ XML sitemap
- ✅ Semantic HTML
- ✅ Proper heading hierarchy

**Structured Data Coverage**:
```javascript
- Organization (root layout)
- Website (root layout)
- LocalBusiness (for about/contact)
- Product (shop items)
- CreativeWork (projects)
- Service (commission)
- FAQPage (FAQ sections)
- BreadcrumbList (navigation)
```

### Bundle Analysis

**Recommended Optimization Steps**:

1. **Analyze Bundle Size**:
```bash
npm run build -- --experimental-build-profiler
```

2. **Check for Duplicate Dependencies**:
```bash
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

3. **Lazy Load Heavy Components**:
- Commission form steps
- Image lightbox
- Project galleries
- Cart drawer

### Runtime Performance

#### JavaScript Execution Time

**Heavy Components** (Consider Lazy Loading):
- CommissionForm: 39.8 kB
- ShoppingCartDrawer: Included in cart context
- ImageLightbox: Should be lazy loaded
- ProjectDetailView: 9.4 kB

**Code Splitting Example**:
```typescript
// Instead of:
import { CommissionForm } from '@/components/forms/CommissionForm';

// Use:
const CommissionForm = dynamic(() => import('@/components/forms/CommissionForm'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

#### React Performance

**Current Optimizations**:
- React 19.0.0 with automatic batching
- Proper key props on lists
- Memoization where needed (useCallback, useMemo)
- Context optimizations

**Recommendations**:
- [ ] Add React.memo to pure components
- [ ] Use useCallback for event handlers
- [ ] Implement virtualization for long lists
- [ ] Consider React Server Components for more pages

### Network Performance

#### Caching Strategy

**Static Assets**:
```
Cache-Control: public, max-age=31536000, immutable
- JS/CSS bundles (hashed)
- Images (hashed)
- Fonts
```

**HTML Pages**:
```
Cache-Control: public, max-age=3600, must-revalidate
- All static HTML pages
```

**API Routes** (when deployed with server):
```
Cache-Control: no-cache, must-revalidate
- /api/commission
- /api/contact
- /api/newsletter
```

#### Compression

**Current**:
- Next.js automatic compression in production
- Brotli compression for static assets

**GitHub Pages Deployment**:
- Gzip compression automatic
- Brotli support via CDN

### Monitoring & Testing

#### Tools

1. **Lighthouse CI**:
```bash
npm install -g @lhci/cli
lhci autorun
```

2. **WebPageTest**:
- Test from multiple locations
- Analyze waterfall
- Check Core Web Vitals

3. **Chrome DevTools**:
- Performance tab
- Coverage tab (unused CSS/JS)
- Network tab (resource timing)

4. **Bundle Analyzer**:
```bash
npx @next/bundle-analyzer
```

#### Performance Budget

**Recommended Limits**:
```json
{
  "javascript": {
    "total": 170,
    "maxSize": 50
  },
  "css": {
    "total": 30,
    "maxSize": 10
  },
  "images": {
    "total": 300,
    "maxSize": 100
  },
  "fonts": {
    "total": 50,
    "maxSize": 20
  }
}
```

### Production Checklist

#### Before Deployment:

- [ ] Run full build and verify no errors
- [ ] Run Lighthouse audit on key pages
- [ ] Test on slow 3G connection
- [ ] Verify all images have dimensions
- [ ] Check bundle size hasn't grown significantly
- [ ] Test Core Web Vitals with PageSpeed Insights
- [ ] Verify CSP headers work correctly
- [ ] Test PWA functionality (manifest.json)
- [ ] Ensure all external resources use HTTPS
- [ ] Verify sitemap.xml is generated
- [ ] Test 404 page

#### Post-Deployment:

- [ ] Monitor real user metrics (RUM)
- [ ] Set up performance alerts
- [ ] Track Core Web Vitals in production
- [ ] Review bundle size trends
- [ ] Check for console errors
- [ ] Verify analytics tracking

### Progressive Web App (PWA)

**Current Status**: Partial implementation

**Implemented**:
- ✅ manifest.json (layout.tsx:30)
- ✅ Apple touch icon
- ✅ Theme color meta tag
- ✅ Viewport meta tag

**To Implement**:
- [ ] Service Worker for offline support
- [ ] App shell caching strategy
- [ ] Background sync for forms
- [ ] Push notifications (optional)

### Quick Wins 🚀

**Immediate Impact** (< 1 hour):
1. Add width/height to all images
2. Add blur placeholders to hero images
3. Lazy load below-fold images
4. Add dns-prefetch for external domains
5. Defer non-critical JavaScript

**High Impact** (< 4 hours):
1. Implement dynamic imports for heavy components
2. Add service worker for caching
3. Optimize image formats (WebP/AVIF)
4. Implement virtual scrolling for long lists
5. Add loading skeletons

**Strategic** (ongoing):
1. Monitor Core Web Vitals
2. Regular bundle size audits
3. Performance regression testing
4. A/B testing optimizations
5. User experience monitoring

### Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
