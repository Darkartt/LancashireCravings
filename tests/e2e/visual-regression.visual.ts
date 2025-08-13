import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Disable animations for consistent screenshots
    await page.addInitScript(() => {
      document.documentElement.style.setProperty('--animation-duration', '0ms');
      document.documentElement.style.setProperty('--transition-duration', '0ms');
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for any lazy-loaded content
    await page.waitForTimeout(1000);
  });

  test('homepage visual regression - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });

  test('homepage visual regression - tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });

  test('homepage visual regression - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.3,
      animations: 'disabled'
    });
  });

  test('header visual consistency', async ({ page }) => {
    const header = page.locator('header').first();
    
    await expect(header).toHaveScreenshot('header-component.png', {
      threshold: 0.2
    });
  });

  test('footer visual consistency', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    const footer = page.locator('footer').last();
    
    await expect(footer).toHaveScreenshot('footer-component.png', {
      threshold: 0.2
    });
  });

  test('portfolio section visual regression', async ({ page }) => {
    // Navigate to portfolio or scroll to portfolio section
    const portfolioLink = page.locator('a[href*="portfolio"], a[href*="gallery"]').first();
    
    if (await portfolioLink.isVisible()) {
      await portfolioLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('portfolio-page.png', {
        fullPage: true,
        threshold: 0.3,
        animations: 'disabled'
      });
    } else {
      // Look for portfolio section on homepage
      const portfolioSection = page.locator('section:has(h2:text-matches("Portfolio|Gallery|Works", "i"))').first();
      
      if (await portfolioSection.isVisible()) {
        await expect(portfolioSection).toHaveScreenshot('portfolio-section.png', {
          threshold: 0.3
        });
      }
    }
  });

  test('about page visual regression', async ({ page }) => {
    const aboutLink = page.locator('a[href*="about"]').first();
    
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('about-page.png', {
        fullPage: true,
        threshold: 0.3,
        animations: 'disabled'
      });
    }
  });

  test('services page visual regression', async ({ page }) => {
    const servicesLink = page.locator('a[href*="services"]').first();
    
    if (await servicesLink.isVisible()) {
      await servicesLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('services-page.png', {
        fullPage: true,
        threshold: 0.3,
        animations: 'disabled'
      });
    }
  });

  test('contact/commission page visual regression', async ({ page }) => {
    const contactLink = page.locator('a[href*="commission"], a[href*="contact"]').first();
    
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot('contact-page.png', {
        fullPage: true,
        threshold: 0.3,
        animations: 'disabled'
      });
    }
  });

  test('form elements visual consistency', async ({ page }) => {
    // Look for forms on the page
    const form = page.locator('form').first();
    
    if (await form.isVisible()) {
      await expect(form).toHaveScreenshot('form-elements.png', {
        threshold: 0.2
      });
    }
  });

  test('button states visual regression', async ({ page }) => {
    const buttons = page.locator('button, .btn, a[class*="btn"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      
      // Normal state
      await expect(firstButton).toHaveScreenshot('button-normal.png', {
        threshold: 0.1
      });
      
      // Hover state
      await firstButton.hover();
      await page.waitForTimeout(200);
      await expect(firstButton).toHaveScreenshot('button-hover.png', {
        threshold: 0.2
      });
      
      // Focus state
      await firstButton.focus();
      await page.waitForTimeout(200);
      await expect(firstButton).toHaveScreenshot('button-focus.png', {
        threshold: 0.2
      });
    }
  });

  test('dark mode visual regression', async ({ page }) => {
    // Check if dark mode is supported
    await page.evaluate(() => {
      // Try to enable dark mode
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      threshold: 0.4,
      animations: 'disabled'
    });
  });

  test('high contrast mode visual regression', async ({ page }) => {
    // Simulate high contrast mode
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--color-contrast', 'high');
      document.documentElement.classList.add('high-contrast');
    });
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
      threshold: 0.4,
      animations: 'disabled'
    });
  });

  test('print stylesheet visual regression', async ({ page }) => {
    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-print.png', {
      fullPage: true,
      threshold: 0.4
    });
  });

  test('background animations visual consistency', async ({ page }) => {
    // Look for background elements
    const background = page.locator('[class*="background"], [data-testid*="background"]').first();
    
    if (await background.isVisible()) {
      // Take screenshot with animations disabled
      await expect(background).toHaveScreenshot('background-static.png', {
        threshold: 0.3,
        animations: 'disabled'
      });
    }
  });

  test('gallery layout visual regression', async ({ page }) => {
    // Look for gallery or grid layouts
    const gallery = page.locator('[class*="gallery"], [class*="grid"], .portfolio-grid').first();
    
    if (await gallery.isVisible()) {
      await expect(gallery).toHaveScreenshot('gallery-layout.png', {
        threshold: 0.3
      });
    }
  });

  test('typography visual consistency', async ({ page }) => {
    // Create a test element with different text styles
    await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.innerHTML = `
        <h1>Main Heading H1</h1>
        <h2>Section Heading H2</h2>
        <h3>Subsection Heading H3</h3>
        <p>Regular paragraph text with <strong>bold</strong> and <em>italic</em> text.</p>
        <p class="text-sm">Small text example</p>
        <p class="text-lg">Large text example</p>
        <a href="#">Link example</a>
      `;
      testDiv.style.padding = '20px';
      testDiv.style.background = 'white';
      testDiv.style.position = 'fixed';
      testDiv.style.top = '10px';
      testDiv.style.left = '10px';
      testDiv.style.zIndex = '9999';
      testDiv.id = 'typography-test';
      document.body.appendChild(testDiv);
    });
    
    const typographyTest = page.locator('#typography-test');
    await expect(typographyTest).toHaveScreenshot('typography-styles.png', {
      threshold: 0.1
    });
    
    // Clean up
    await page.evaluate(() => {
      const testDiv = document.getElementById('typography-test');
      if (testDiv) testDiv.remove();
    });
  });
});
