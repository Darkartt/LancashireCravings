# 🎯 WoodCrave Quality Assurance System

> **Comprehensive automated testing suite that runs after every code change to ensure website quality and prevent regressions.**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm run test:all

# Run tests in CI mode
npm run test:ci
```

## 📋 Testing Overview

This project implements a comprehensive quality assurance system covering:

- ✅ **Unit Testing** - Component and utility function testing
- ✅ **Integration Testing** - User journey and workflow testing  
- ✅ **Accessibility Testing** - WCAG 2.1 AAA compliance validation
- ✅ **Performance Testing** - Core Web Vitals monitoring
- ✅ **E2E Testing** - Cross-browser end-to-end functionality
- ✅ **Visual Regression** - Screenshot comparison testing
- ✅ **Lighthouse Auditing** - Performance, accessibility, SEO, and best practices
- ✅ **Security Scanning** - Dependency vulnerability checks

## 🧪 Test Commands

### Unit & Integration Tests
```bash
npm run test              # Run all Jest tests
npm run test:watch        # Run tests in watch mode
npm run test:unit         # Run only unit tests
npm run test:integration  # Run only integration tests
npm run test:accessibility # Run accessibility tests
npm run test:performance  # Run performance tests
npm run test:coverage     # Generate coverage report
```

### End-to-End Tests
```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:visual       # Run visual regression tests
npm run test:perf         # Run E2E performance tests
npm run test:a11y         # Run E2E accessibility tests
```

### Performance & Quality Audits
```bash
npm run lighthouse        # Run Lighthouse performance audit
npm run lint              # Run ESLint
npm run test:all          # Run complete test suite
```

## 📁 Test Structure

```
tests/
├── setup.js                          # Global test configuration
├── unit/                             # Component unit tests
│   └── Header.test.tsx              # Header component tests
├── integration/                      # Integration tests
│   └── user-journeys.test.tsx       # Full user flow testing
├── accessibility/                    # Accessibility tests
│   └── wcag-compliance.test.tsx     # WCAG 2.1 AAA compliance
├── performance/                      # Performance tests
│   └── core-web-vitals.test.tsx     # Core Web Vitals monitoring
└── e2e/                             # End-to-end tests
    ├── homepage.e2e.ts              # Homepage functionality
    ├── visual-regression.visual.ts   # Visual regression testing
    ├── performance.perf.ts          # E2E performance monitoring
    └── accessibility.a11y.ts        # E2E accessibility validation
```

## ⚙️ Configuration Files

- **`jest.config.js`** - Jest testing framework configuration
- **`playwright.config.js`** - Playwright E2E testing configuration
- **`lighthouserc.js`** - Lighthouse CI performance auditing
- **`eslint.config.mjs`** - ESLint code quality configuration

## 🎯 Quality Standards

### Performance Budgets
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Component Rendering**: < 50ms
- **Lighthouse Performance**: > 90%

### Accessibility Standards
- **WCAG 2.1 AAA Compliance**: 100%
- **Keyboard Navigation**: Full support
- **Screen Reader Compatibility**: Complete
- **Color Contrast**: AAA level (7:1 ratio)
- **Touch Targets**: Minimum 44x44px

### Code Quality
- **Test Coverage**: > 80% threshold
- **TypeScript Compliance**: Zero type errors
- **ESLint Compliance**: Zero linting errors
- **Cross-browser Support**: Chrome, Firefox, Safari, Mobile

## 🔄 Continuous Integration

The CI pipeline automatically runs on:
- **Push to main/develop branches**
- **Pull requests to main**
- **Daily scheduled runs at 2 AM UTC**

### CI Pipeline Stages

1. **🔍 Lint & TypeScript** - Code quality checks
2. **🧪 Unit & Integration Tests** - Functionality testing
3. **🏗️ Build Application** - Production build validation
4. **🎭 E2E Tests** - Cross-browser testing
5. **👁️ Visual Regression** - UI consistency checks
6. **💡 Lighthouse Audit** - Performance monitoring
7. **♿ Accessibility Audit** - WCAG compliance
8. **🔒 Security Scan** - Vulnerability detection
9. **🚀 Deploy** - Production deployment (main branch only)

## 📊 Test Reports

### Coverage Reports
- Located in `coverage/` directory
- HTML report: `coverage/lcov-report/index.html`
- Uploaded to Codecov in CI

### E2E Test Reports
- Playwright reports in `test-results/`
- Visual diff artifacts for failed tests
- Performance metrics and traces

### Lighthouse Reports
- Performance audits in `lighthouse-results/`
- Core Web Vitals tracking
- Accessibility and SEO scoring

## 🛠️ Development Workflow

### Before Committing
```bash
# Run quick tests
npm run test:unit
npm run lint

# Run full test suite
npm run test:all
```

### Adding New Tests

1. **Unit Tests**: Add to `tests/unit/`
2. **Integration Tests**: Add to `tests/integration/`
3. **E2E Tests**: Add to `tests/e2e/`
4. **Update CI**: Tests run automatically

### Test Writing Guidelines

```typescript
// Unit Test Example
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

```typescript
// E2E Test Example
import { test, expect } from '@playwright/test';

test('homepage should load correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

## 🎨 Visual Regression Testing

### How It Works
- Takes screenshots of components in different states
- Compares against baseline images
- Highlights visual changes for review

### Managing Visual Tests
```bash
# Update baseline images
npx playwright test --project=visual-regression --update-snapshots

# Review visual differences
npx playwright show-report
```

## 📈 Performance Monitoring

### Core Web Vitals Tracking
- **Real User Metrics**: Measured in browser context
- **Performance Budgets**: Strict thresholds enforced
- **Regression Detection**: Alerts on performance degradation

### Optimization Verification
- Bundle size limits
- Image optimization validation
- Font loading performance
- GPU acceleration checks

## ♿ Accessibility Testing

### Automated Checks
- **axe-core Integration**: Industry-standard accessibility testing
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader Support**: ARIA compliance validation
- **Color Contrast**: Automated contrast ratio checking

### Manual Testing Guidelines
- Test with keyboard navigation only
- Use screen reader software
- Verify mobile touch targets
- Check high contrast mode

## 🔧 Troubleshooting

### Common Issues

**Tests failing in CI but passing locally?**
- Check Node.js version compatibility
- Verify environment variables
- Review browser versions

**Visual regression tests failing?**
- Font rendering differences between platforms
- Update snapshots: `--update-snapshots`
- Review actual vs expected differences

**Performance tests inconsistent?**
- Run multiple times to establish baseline
- Check for external service dependencies
- Review system resource availability

### Debug Commands
```bash
# Debug Jest tests
npm run test:watch -- --verbose

# Debug Playwright tests
npx playwright test --debug

# Debug specific test file
npx playwright test homepage.e2e.ts --debug
```

## 📝 Contributing

1. **Write Tests First**: TDD approach recommended
2. **Follow Naming Conventions**: Descriptive test names
3. **Update Documentation**: Keep README current
4. **Performance Impact**: Consider test execution time
5. **Cross-browser Testing**: Verify compatibility

## 🎯 Quality Gates

All tests must pass before:
- ✅ Merging pull requests
- ✅ Deploying to production
- ✅ Creating releases
- ✅ Publishing changes

## 📞 Support

For questions about the testing system:
1. Check this README
2. Review test examples in the codebase
3. Check CI pipeline logs
4. Create an issue for complex problems

---

**🎯 Remember**: These tests are your safety net. They catch issues before users do and ensure the WoodCrave website maintains professional quality standards.
