import { test, expect } from '@playwright/test';

test.describe('Performance Tests - Core Web Vitals', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance metrics collection
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Core Web Vitals - LCP (Largest Contentful Paint)', async ({ page }) => {
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log(`LCP: ${lcp}ms`);
    expect(lcp).toBeLessThan(2500); // 2.5 seconds threshold
  });

  test('Core Web Vitals - FID (First Input Delay)', async ({ page }) => {
    const button = page.locator('button, a[role="button"]').first();
    
    if (await button.isVisible()) {
      const startTime = Date.now();
      await button.click();
      const endTime = Date.now();
      
      const fid = endTime - startTime;
      console.log(`FID: ${fid}ms`);
      expect(fid).toBeLessThan(100); // 100ms threshold
    }
  });

  test('Core Web Vitals - CLS (Cumulative Layout Shift)', async ({ page }) => {
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Simulate some user interaction and wait
        setTimeout(() => resolve(clsValue), 3000);
      });
    });

    console.log(`CLS: ${cls}`);
    expect(cls).toBeLessThan(0.1); // 0.1 threshold
  });

  test('Loading Performance - Time to Interactive', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for the page to be interactive
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    
    // Test that the page is interactive
    const button = page.locator('button, a').first();
    if (await button.isVisible()) {
      await button.click();
    }
    
    const tti = Date.now() - startTime;
    console.log(`Time to Interactive: ${tti}ms`);
    expect(tti).toBeLessThan(3500); // 3.5 seconds threshold
  });

  test('Resource Loading Performance', async ({ page }) => {
    const resourceTimes = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        type: entry.initiatorType
      }));
    });

    // Check that no single resource takes too long
    const slowResources = resourceTimes.filter(resource => resource.duration > 2000);
    expect(slowResources.length).toBe(0);

    // Check total resource size
    const totalSize = resourceTimes.reduce((sum, resource) => sum + (resource.size || 0), 0);
    console.log(`Total resource size: ${(totalSize / 1024).toFixed(2)}KB`);
    expect(totalSize).toBeLessThan(5 * 1024 * 1024); // 5MB limit

    // Log largest resources
    const largestResources = resourceTimes
      .filter(r => r.size && r.size > 100 * 1024) // > 100KB
      .sort((a, b) => (b.size || 0) - (a.size || 0))
      .slice(0, 5);
    
    console.log('Largest resources:', largestResources);
  });

  test('JavaScript Bundle Size', async ({ page }) => {
    const jsResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => entry.name.includes('.js'))
        .map(entry => ({
          name: entry.name,
          size: entry.transferSize || 0
        }));
    });

    const totalJSSize = jsResources.reduce((sum, resource) => sum + resource.size, 0);
    console.log(`Total JS bundle size: ${(totalJSSize / 1024).toFixed(2)}KB`);
    
    // JavaScript bundle should be under 500KB compressed
    expect(totalJSSize).toBeLessThan(500 * 1024);
  });

  test('CSS Bundle Size', async ({ page }) => {
    const cssResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => entry.name.includes('.css'))
        .map(entry => ({
          name: entry.name,
          size: entry.transferSize || 0
        }));
    });

    const totalCSSSize = cssResources.reduce((sum, resource) => sum + resource.size, 0);
    console.log(`Total CSS bundle size: ${(totalCSSSize / 1024).toFixed(2)}KB`);
    
    // CSS bundle should be under 100KB compressed
    expect(totalCSSSize).toBeLessThan(100 * 1024);
  });

  test('Image Optimization', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      // Check that images have proper attributes
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const loading = await img.getAttribute('loading');
      
      expect(src).toBeTruthy();
      expect(alt).toBeTruthy();
      
      // Images below the fold should be lazy loaded
      const boundingBox = await img.boundingBox();
      const viewportSize = page.viewportSize();
      const isVisible = boundingBox && viewportSize && boundingBox.y < viewportSize.height;
      
      if (!isVisible) {
        expect(loading).toBe('lazy');
      }
    }

    // Check image resource sizes
    const imageResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => 
          entry.name.match(/\.(jpg|jpeg|png|webp|svg|gif)(\?|$)/i)
        )
        .map(entry => ({
          name: entry.name,
          size: entry.transferSize || 0
        }));
    });

    // Individual images should be under 500KB
    const largeImages = imageResources.filter(img => img.size > 500 * 1024);
    if (largeImages.length > 0) {
      console.log('Large images found:', largeImages);
    }
    expect(largeImages.length).toBe(0);
  });

  test('Font Loading Performance', async ({ page }) => {
    const fontResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => 
          entry.name.match(/\.(woff|woff2|ttf|otf)(\?|$)/i)
        )
        .map(entry => ({
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize || 0
        }));
    });

    // Fonts should load quickly
    const slowFonts = fontResources.filter(font => font.duration > 1000);
    expect(slowFonts.length).toBe(0);

    // Total font size should be reasonable
    const totalFontSize = fontResources.reduce((sum, font) => sum + font.size, 0);
    console.log(`Total font size: ${(totalFontSize / 1024).toFixed(2)}KB`);
    expect(totalFontSize).toBeLessThan(200 * 1024); // 200KB limit
  });

  test('Memory Usage', async ({ page }) => {
    // Measure initial memory
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });

    if (initialMemory) {
      console.log('Initial memory usage:', {
        used: `${(initialMemory.used / 1024 / 1024).toFixed(2)}MB`,
        total: `${(initialMemory.total / 1024 / 1024).toFixed(2)}MB`
      });

      // Perform some interactions
      await page.evaluate(() => {
        // Simulate user interactions
        window.scrollTo(0, 500);
        return new Promise(resolve => setTimeout(resolve, 1000));
      });

      // Measure memory after interactions
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize
        } : null;
      });

      if (finalMemory) {
        const memoryGrowth = finalMemory.used - initialMemory.used;
        console.log('Memory growth:', `${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
        
        // Memory growth should be reasonable
        expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // 50MB limit
      }
    }
  });

  test('Animation Performance', async ({ page }) => {
    // Check for expensive animations
    const animationPerformance = await page.evaluate(() => {
      const animations = document.getAnimations();
      return animations.map(animation => ({
        effect: (animation.effect as any)?.target?.tagName || 'unknown',
        playState: animation.playState,
        currentTime: animation.currentTime
      }));
    });

    console.log(`Active animations: ${animationPerformance.length}`);

    // Test scroll performance during animations
    const startTime = Date.now();
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await page.waitForTimeout(100);
    const scrollTime = Date.now() - startTime;

    console.log(`Scroll performance: ${scrollTime}ms`);
    expect(scrollTime).toBeLessThan(50); // Should be very fast
  });

  test('Network Requests', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Total requests: ${requests.length}`);
    
    // Should not make excessive requests
    expect(requests.length).toBeLessThan(50);

    // Check for duplicate requests
    const uniqueRequests = new Set(requests);
    const duplicates = requests.length - uniqueRequests.size;
    expect(duplicates).toBe(0);
  });

  test('Third-Party Script Performance', async ({ page }) => {
    const thirdPartyRequests = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return entries
        .filter(entry => 
          !entry.name.includes(window.location.origin) &&
          (entry.name.includes('.js') || entry.name.includes('analytics') || entry.name.includes('tracking'))
        )
        .map(entry => ({
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize || 0
        }));
    });

    // Third-party scripts should not be too heavy
    const heavyScripts = thirdPartyRequests.filter(script => script.size > 100 * 1024);
    console.log('Third-party scripts:', thirdPartyRequests);
    
    if (heavyScripts.length > 0) {
      console.log('Heavy third-party scripts:', heavyScripts);
    }
  });
});
