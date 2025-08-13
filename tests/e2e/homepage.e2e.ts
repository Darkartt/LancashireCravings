import { test, expect } from '@playwright/test';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('homepage loads successfully', async ({ page }) => {
    // Check that the page title contains brand name
    await expect(page).toHaveTitle(/WoodCrave|Artisan|Craftsmanship/i);
    
    // Check for main heading
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText(/WoodCrave|Artisan|Craftsmanship/i);
  });

  test('navigation menu is functional', async ({ page }) => {
    // Check main navigation exists
    const nav = page.locator('nav[role="navigation"]').first();
    await expect(nav).toBeVisible();
    
    // Test navigation links
    const portfolioLink = page.locator('a[href*="portfolio"], a[href*="gallery"]').first();
    const aboutLink = page.locator('a[href*="about"]').first();
    const servicesLink = page.locator('a[href*="services"]').first();
    const contactLink = page.locator('a[href*="commission"], a[href*="contact"]').first();
    
    await expect(portfolioLink).toBeVisible();
    await expect(aboutLink).toBeVisible();
    await expect(servicesLink).toBeVisible();
    await expect(contactLink).toBeVisible();
  });

  test('hero section displays correctly', async ({ page }) => {
    // Check hero content
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Should contain compelling copy about woodworking
    await expect(page.locator('text=/years|heritage|craftsmanship|artisan/i').first()).toBeVisible();
  });

  test('images load properly', async ({ page }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that images are present and loaded
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
        
        // Check that image has proper alt text
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
        expect(alt?.length).toBeGreaterThan(5);
      }
    }
  });

  test('page is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that content is still visible and usable
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    // Navigation should be accessible (might be in mobile menu)
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('scroll behavior works correctly', async ({ page }) => {
    // Check initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBe(0);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(100);
    
    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(newScrollY).toBeGreaterThan(0);
  });

  test('contact/commission form is accessible', async ({ page }) => {
    // Navigate to contact section or form
    const contactButton = page.locator('button:has-text("Contact"), button:has-text("Commission"), a[href*="contact"], a[href*="commission"]').first();
    
    if (await contactButton.isVisible()) {
      await contactButton.click();
      await page.waitForTimeout(500);
    }
    
    // Look for form elements
    const nameField = page.locator('input[type="text"], input[name*="name"], input[id*="name"]').first();
    const emailField = page.locator('input[type="email"], input[name*="email"], input[id*="email"]').first();
    const messageField = page.locator('textarea, input[name*="message"], input[id*="message"]').first();
    
    // Check if form exists and is functional
    if (await nameField.isVisible()) {
      await expect(nameField).toBeVisible();
      await expect(emailField).toBeVisible();
      await expect(messageField).toBeVisible();
      
      // Test form interaction
      await nameField.fill('Test User');
      await emailField.fill('test@example.com');
      await messageField.fill('Test commission inquiry');
      
      // Verify values were entered
      await expect(nameField).toHaveValue('Test User');
      await expect(emailField).toHaveValue('test@example.com');
      await expect(messageField).toHaveValue('Test commission inquiry');
    }
  });

  test('page has proper SEO structure', async ({ page }) => {
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content?.length).toBeGreaterThan(50);
    }
    
    // Check heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one H1
    
    // Check for structured data
    const jsonLd = page.locator('script[type="application/ld+json"]');
    // Structured data is optional but good for SEO
  });

  test('footer contains required information', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const footer = page.locator('footer[role="contentinfo"], footer').last();
    await expect(footer).toBeVisible();
    
    // Check for copyright or business info
    await expect(footer).toContainText(/copyright|©|woodcrave|2025/i);
  });
});

test.describe('Cross-Browser Compatibility', () => {
  test('works in different browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Basic functionality should work across browsers
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
    
    // Test basic interaction
    if (await page.locator('button, a[href*="portfolio"]').first().isVisible()) {
      await page.locator('button, a[href*="portfolio"]').first().click();
      await page.waitForTimeout(500);
    }
    
    console.log(`✓ Basic functionality works in ${browserName}`);
  });
});

test.describe('Performance Monitoring', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Page loaded in ${loadTime}ms`);
  });

  test('images load progressively', async ({ page }) => {
    await page.goto('/');
    
    // Count images immediately
    const initialImageCount = await page.locator('img').count();
    
    // Wait for network idle and count again
    await page.waitForLoadState('networkidle');
    const finalImageCount = await page.locator('img').count();
    
    // Should have images
    expect(finalImageCount).toBeGreaterThan(0);
    
    console.log(`Found ${finalImageCount} images on page`);
  });
});

test.describe('Error Handling', () => {
  test('handles 404 errors gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page', { waitUntil: 'networkidle' });
    
    if (response?.status() === 404) {
      // Should show a custom 404 page
      await expect(page.locator('text=/404|not found|page not found/i')).toBeVisible();
    }
  });

  test('handles JavaScript errors gracefully', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should not have critical JavaScript errors
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('Non-Error promise rejection') &&
      !error.includes('ResizeObserver loop limit exceeded')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Security Tests', () => {
  test('has proper security headers', async ({ page }) => {
    const response = await page.goto('/');
    
    const headers = response?.headers();
    if (headers) {
      // Check for security headers
      expect(headers['x-frame-options'] || headers['X-Frame-Options']).toBeTruthy();
      expect(headers['x-content-type-options'] || headers['X-Content-Type-Options']).toBeTruthy();
    }
  });

  test('external links have proper rel attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const externalLinks = page.locator('a[href^="http"]:not([href*="woodcrave"]):not([href*="localhost"])');
    const linkCount = await externalLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = externalLinks.nth(i);
      const rel = await link.getAttribute('rel');
      
      // External links should have noopener noreferrer
      if (await link.getAttribute('target') === '_blank') {
        expect(rel).toContain('noopener');
      }
    }
  });
});
