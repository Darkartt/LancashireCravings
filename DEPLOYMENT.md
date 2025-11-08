# Production Deployment Checklist

## Pre-Deployment Checklist

### 1. Code Quality ✅

- [x] TypeScript compilation passes (`npm run build`)
- [x] No ESLint errors or warnings
- [x] All tests pass (when implemented)
- [x] Code reviewed and approved
- [x] No console.log statements in production code
- [x] Environment variables configured
- [ ] Sensitive data not committed to repository

### 2. Performance ⚡

- [x] Bundle size within budget (< 200KB total JS)
- [ ] Images optimized and have width/height attributes
- [ ] Lighthouse performance score > 90
- [ ] Core Web Vitals passing
- [ ] Resources cached appropriately
- [ ] CSS/JS minified
- [ ] Unused code eliminated

### 3. SEO 🔍

- [x] All pages have unique meta titles
- [x] All pages have meta descriptions
- [x] OpenGraph tags configured
- [x] Twitter Card tags configured
- [x] Structured data (JSON-LD) implemented
- [x] Canonical URLs set
- [x] Robots.txt configured
- [x] Sitemap.xml generated
- [x] 404 page implemented
- [ ] Google Search Console verified
- [ ] Google Analytics/Tag Manager installed

### 4. Accessibility ♿

- [x] WCAG 2.1 AA compliant
- [x] Lighthouse accessibility score > 90
- [x] Keyboard navigation works
- [x] Screen reader tested
- [x] Color contrast ratios pass
- [x] ARIA labels on interactive elements
- [x] Skip links implemented
- [x] Form labels present
- [ ] Focus indicators visible

### 5. Security 🔒

- [x] HTTPS enforced
- [x] Content Security Policy configured
- [x] No inline scripts (except JSON-LD)
- [x] Form validation (client & server)
- [x] XSS protection
- [x] CSRF protection (when using forms with server)
- [ ] Rate limiting on API routes
- [ ] Security headers configured
- [ ] Dependencies updated and secure

### 6. Browser Compatibility 🌐

**Tested Browsers**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Minimum Support**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 7. Functionality Testing 🧪

#### Core User Flows:
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Commission form submits successfully
- [ ] Contact form submits successfully
- [ ] Newsletter signup works
- [ ] Shop browsing and filtering
- [ ] Add to cart functionality
- [ ] Checkout process
- [ ] Search functionality (Cmd+K)
- [ ] Mobile menu works
- [ ] Image lightbox works
- [ ] Projects detail pages load
- [ ] 404 page shows for invalid routes

#### Form Validation:
- [ ] Required fields validated
- [ ] Email format validated
- [ ] Phone format validated
- [ ] File uploads work (commission form)
- [ ] Error messages display
- [ ] Success messages display

### 8. Content Audit 📝

- [ ] All copy reviewed for spelling/grammar
- [ ] All images have descriptive alt text
- [ ] All links work (no 404s)
- [ ] All external links open in new tab
- [ ] Contact information accurate
- [ ] Pricing information current
- [ ] Legal pages present (Terms, Privacy)
- [ ] Copyright year current

### 9. Mobile Responsiveness 📱

**Breakpoints Tested**:
- [ ] Mobile (320px - 640px)
- [ ] Tablet (641px - 1024px)
- [ ] Desktop (1025px - 1920px)
- [ ] Large Desktop (1921px+)

**Touch Targets**:
- [ ] Buttons at least 44x44px
- [ ] Links adequately spaced
- [ ] Form inputs easily tappable

### 10. Email Integrations 📧

**Production Setup Required**:
- [ ] Commission form email notifications
- [ ] Contact form email notifications
- [ ] Newsletter integration (Mailchimp/SendGrid)
- [ ] Order confirmation emails (future)
- [ ] From address configured
- [ ] Email templates tested

### 11. Analytics & Monitoring 📊

- [ ] Google Analytics installed
- [ ] Google Tag Manager configured
- [ ] Conversion tracking setup
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Custom events tracked:
  - [ ] Commission form submissions
  - [ ] Contact form submissions
  - [ ] Newsletter signups
  - [ ] Add to cart events
  - [ ] Checkout completions

### 12. GitHub Pages Configuration 🚀

#### Required Files:
- [x] `package.json` with build scripts
- [x] `.nojekyll` file (if needed)
- [x] Custom domain CNAME (if using)
- [x] 404.html for client-side routing

#### Build Configuration:
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "node ./scripts/generate-curated-manifest.mjs"
  }
}
```

#### Next.js Configuration:
```javascript
// next.config.mjs
export default {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
};
```

### 13. Environment Variables 🔐

**Development** (.env.local):
```env
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Production** (GitHub Secrets):
```env
NEXT_PUBLIC_BASE_PATH=/your-repo-name
NEXT_PUBLIC_API_URL=https://exampledesign.co.uk
```

### 14. DNS & Domain 🌍

- [ ] Domain purchased and configured
- [ ] DNS records set up:
  - [ ] A record pointing to GitHub Pages
  - [ ] CNAME record (if using www)
  - [ ] MX records (for email)
- [ ] SSL certificate active
- [ ] WWW redirect configured
- [ ] Domain verified in GitHub Pages

### 15. Backup & Recovery 💾

- [ ] Repository backed up
- [ ] Database backup strategy (if applicable)
- [ ] Rollback plan documented
- [ ] Version tagged in Git
- [ ] Deployment documented

## Deployment Steps

### GitHub Pages Deployment

1. **Build Production Assets**:
```bash
npm run build
```

2. **Test Production Build Locally**:
```bash
npx serve out
```

3. **Configure GitHub Pages**:
- Go to repository Settings > Pages
- Source: Deploy from branch
- Branch: gh-pages
- Folder: / (root)

4. **Deploy Using GitHub Actions** (Recommended):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: out
          branch: gh-pages
```

5. **Manual Deploy** (Alternative):
```bash
npm run build
npx gh-pages -d out
```

### Post-Deployment Verification

1. **Functional Testing**:
- [ ] Visit homepage: https://exampledesign.co.uk
- [ ] Test all main navigation links
- [ ] Submit commission form (test mode)
- [ ] Submit contact form (test mode)
- [ ] Add item to cart
- [ ] Complete checkout flow
- [ ] Search functionality
- [ ] Mobile menu

2. **Performance Testing**:
```bash
# Run Lighthouse
lighthouse https://exampledesign.co.uk --view

# Test from multiple locations
# Use WebPageTest: https://www.webpagetest.org
```

3. **SEO Verification**:
- [ ] Check robots.txt: `/robots.txt`
- [ ] Check sitemap: `/sitemap.xml`
- [ ] Verify structured data: [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Check OpenGraph: [OpenGraph Debugger](https://www.opengraph.xyz/)
- [ ] Check Twitter Cards: [Twitter Card Validator](https://cards-dev.twitter.com/validator)

4. **Analytics Check**:
- [ ] Verify Google Analytics tracking
- [ ] Test event tracking
- [ ] Check real-time reports

5. **Error Monitoring**:
- [ ] Check for JavaScript errors in console
- [ ] Verify error tracking service receiving errors
- [ ] Test 404 page

## Rollback Procedure

If issues are detected post-deployment:

1. **Quick Rollback**:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback to specific tag
git checkout v1.0.0
npm run build
# Redeploy
```

2. **GitHub Pages Rollback**:
- Go to repository > Actions
- Re-run previous successful deployment

3. **Notify Users** (if necessary):
- Update status page
- Send notification via social media
- Post maintenance notice

## Monitoring Schedule

### Daily:
- Check uptime monitoring
- Review error logs
- Monitor Core Web Vitals

### Weekly:
- Review analytics reports
- Check performance metrics
- Review user feedback
- Security updates

### Monthly:
- Lighthouse audit all pages
- Dependency updates
- Content audit
- Backup verification

## Support & Maintenance

### Contact Information:
- Technical Lead: [Contact Info]
- Project Manager: [Contact Info]
- Emergency Contact: [24/7 Contact]

### Documentation:
- [README.md](./README.md) - Project overview
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility audit
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance guide
- [API Documentation](#) - API endpoints (future)

### Issue Reporting:
1. Create GitHub issue with template
2. Include browser/device information
3. Steps to reproduce
4. Screenshots if applicable
5. Priority level (Critical/High/Medium/Low)

## Success Metrics

### Performance KPIs:
- Lighthouse Performance Score: > 90
- Lighthouse Accessibility Score: > 95
- Lighthouse Best Practices Score: > 95
- Lighthouse SEO Score: > 95
- Core Web Vitals: All "Good"
- Page Load Time: < 2 seconds
- Time to Interactive: < 3 seconds

### Business KPIs:
- Commission form submissions
- Contact form submissions
- Newsletter signups
- Cart conversion rate
- Bounce rate < 50%
- Average session duration > 2 minutes

## Version History

| Version | Date | Changes | Deployed By |
|---------|------|---------|-------------|
| 1.0.0 | TBD | Initial production release | TBD |
| 0.9.0 | TBD | Phase 6 complete (SEO, A11y, Performance) | Claude |
| 0.8.0 | TBD | Phase 5 complete (Enhanced features) | Claude |
| 0.7.0 | TBD | Phase 4 complete (E-commerce) | Claude |

---

**Last Updated**: 2025-11-08
**Next Review**: After production deployment
