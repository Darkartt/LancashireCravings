import { test, expect } from '@playwright/test';

// Install axe-core for accessibility testing
test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core for accessibility testing
    await page.goto('/');
    await page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
    });
    await page.waitForLoadState('networkidle');
  });

  test('homepage has no accessibility violations', async ({ page }) => {
    const accessibilityResults = await page.evaluate(() => {
      return new Promise((resolve) => {
        (window as any).axe.run(document, {
          tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
          rules: {
            'color-contrast': { enabled: true },
            'keyboard-navigation': { enabled: true },
            'focus-management': { enabled: true }
          }
        }, (err: any, results: any) => {
          if (err) throw err;
          resolve(results);
        });
      });
    });

    const violations = (accessibilityResults as any).violations;
    
    if (violations.length > 0) {
      console.log('Accessibility violations found:');
      violations.forEach((violation: any) => {
        console.log(`- ${violation.id}: ${violation.description}`);
        console.log(`  Impact: ${violation.impact}`);
        console.log(`  Affected elements: ${violation.nodes.length}`);
      });
    }

    expect(violations.length).toBe(0);
  });

  test('keyboard navigation works throughout the site', async ({ page }) => {
    // Test tab navigation
    let focusedElements: string[] = [];
    
    // Start from the beginning
    await page.keyboard.press('Tab');
    
    // Tab through first 10 focusable elements
    for (let i = 0; i < 10; i++) {
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? `${el.tagName}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ')[0] : ''}` : null;
      });
      
      if (focusedElement) {
        focusedElements.push(focusedElement);
      }
      
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
    }
    
    console.log('Focusable elements:', focusedElements);
    expect(focusedElements.length).toBeGreaterThan(3);
    
    // Check that focus is visible
    const focusIndicator = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el) return false;
      
      const styles = window.getComputedStyle(el);
      return styles.outline !== 'none' || 
             styles.boxShadow !== 'none' || 
             el.classList.contains('focus:outline') ||
             el.classList.contains('focus:ring');
    });
    
    expect(focusIndicator).toBeTruthy();
  });

  test('screen reader compatibility', async ({ page }) => {
    // Check for proper ARIA labels and roles
    const ariaElements = await page.locator('[aria-label], [aria-labelledby], [aria-describedby], [role]').all();
    
    for (const element of ariaElements) {
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaLabelledBy = await element.getAttribute('aria-labelledby');
      const ariaDescribedBy = await element.getAttribute('aria-describedby');
      const role = await element.getAttribute('role');
      
      // Elements with ARIA attributes should have meaningful values
      if (ariaLabel) {
        expect(ariaLabel.trim().length).toBeGreaterThan(0);
      }
      
      if (ariaLabelledBy) {
        const labelElement = page.locator(`#${ariaLabelledBy}`);
        await expect(labelElement).toBeAttached();
      }
      
      if (ariaDescribedBy) {
        const descElement = page.locator(`#${ariaDescribedBy}`);
        await expect(descElement).toBeAttached();
      }
      
      if (role) {
        expect(['banner', 'navigation', 'main', 'contentinfo', 'button', 'link', 'heading', 'list', 'listitem', 'article', 'section', 'complementary', 'form', 'search', 'img', 'figure', 'dialog', 'alert', 'status', 'region', 'tab', 'tabpanel', 'tablist']).toContain(role);
      }
    }
  });

  test('semantic HTML structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels: number[] = [];
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.charAt(1));
      headingLevels.push(level);
    }
    
    // Should have exactly one H1
    const h1Count = headingLevels.filter(level => level === 1).length;
    expect(h1Count).toBe(1);
    
    // Check heading hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];
      
      // Next heading should not skip more than one level
      expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
    }
    
    // Check for landmark regions
    const landmarks = await page.locator('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer').all();
    expect(landmarks.length).toBeGreaterThan(0);
  });

  test('form accessibility', async ({ page }) => {
    const forms = await page.locator('form').all();
    
    for (const form of forms) {
      // Check form inputs have labels
      const inputs = await form.locator('input, textarea, select').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          // Input should have either a label, aria-label, or aria-labelledby
          expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
        
        // Required fields should be marked
        const required = await input.getAttribute('required');
        const ariaRequired = await input.getAttribute('aria-required');
        
        if (required !== null) {
          expect(ariaRequired).toBe('true');
        }
      }
      
      // Check for form validation
      const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(500);
        
        // Check for error messages
        const errorMessages = await page.locator('[role="alert"], .error, [aria-invalid="true"]').all();
        console.log(`Found ${errorMessages.length} validation messages`);
      }
    }
  });

  test('color contrast compliance', async ({ page }) => {
    const contrastResults = await page.evaluate(() => {
      return new Promise((resolve) => {
        (window as any).axe.run(document, {
          rules: {
            'color-contrast': { enabled: true }
          }
        }, (err: any, results: any) => {
          if (err) throw err;
          resolve(results.violations.filter((v: any) => v.id === 'color-contrast'));
        });
      });
    });

    const violations = contrastResults as any[];
    
    if (violations.length > 0) {
      console.log('Color contrast violations:');
      violations.forEach(violation => {
        console.log(`- ${violation.description}`);
        violation.nodes.forEach((node: any) => {
          console.log(`  Element: ${node.target[0]}`);
          console.log(`  Contrast ratio: ${node.any[0]?.data?.contrastRatio || 'unknown'}`);
        });
      });
    }

    expect(violations.length).toBe(0);
  });

  test('image alt text quality', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      const role = await img.getAttribute('role');
      
      // Decorative images should have empty alt or presentation role
      if (role === 'presentation' || role === 'none') {
        expect(alt).toBe('');
      } else {
        // Content images should have descriptive alt text
        expect(alt).toBeTruthy();
        
        if (alt) {
          expect(alt.length).toBeGreaterThan(5);
          
          // Alt text should not contain redundant words
          expect(alt.toLowerCase()).not.toMatch(/image of|picture of|photo of|graphic of/);
          
          // Alt text should be descriptive for woodworking context
          expect(alt.toLowerCase()).toMatch(/wood|carv|craft|sculpt|artisan|detail|master|commission|oak|walnut|cherry|mahogany|eagle|furniture|restoration/);
        }
      }
    }
  });

  test('focus management in interactive components', async ({ page }) => {
    // Test modal/dialog focus trapping if present
    const modalTriggers = await page.locator('[data-modal], [aria-haspopup="dialog"], button:has-text("Contact"), button:has-text("Gallery")').all();
    
    for (const trigger of modalTriggers) {
      if (await trigger.isVisible()) {
        await trigger.click();
        await page.waitForTimeout(500);
        
        // Check if a modal opened
        const modal = page.locator('[role="dialog"], .modal, [aria-modal="true"]').first();
        
        if (await modal.count() > 0) {
          // Focus should be trapped in modal
          const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
          expect(focusedElement).toBeTruthy();
          
          // Close modal if possible
          const closeButton = modal.locator('button:has-text("Close"), button:has-text("×"), [aria-label*="close"]').first();
          if (await closeButton.count() > 0) {
            await closeButton.click();
            await page.waitForTimeout(300);
          } else {
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
          }
        }
      }
    }
  });

  test('mobile accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check mobile menu accessibility
    const mobileMenuToggle = page.locator('button[aria-label*="menu"], button[aria-label*="navigation"], .menu-toggle, .nav-toggle').first();
    
    if (await mobileMenuToggle.count() > 0) {
      // Menu toggle should have proper ARIA attributes
      const ariaExpanded = await mobileMenuToggle.getAttribute('aria-expanded');
      const ariaControls = await mobileMenuToggle.getAttribute('aria-controls');
      const ariaLabel = await mobileMenuToggle.getAttribute('aria-label');
      
      expect(ariaExpanded).toBeTruthy();
      expect(ariaLabel).toBeTruthy();
      
      // Test menu interaction
      await mobileMenuToggle.click();
      await page.waitForTimeout(300);
      
      const expandedState = await mobileMenuToggle.getAttribute('aria-expanded');
      expect(expandedState).toBe('true');
      
      // Menu should be keyboard accessible
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    }
    
    // Touch targets should be large enough (44px minimum)
    const touchTargets = await page.locator('button, a, input, select, textarea').all();
    
    for (const target of touchTargets.slice(0, 5)) { // Test first 5 elements
      const boundingBox = await target.boundingBox();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('reduced motion compliance', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that animations are disabled or reduced
    const animationElements = await page.locator('[class*="animate"], [class*="transition"], [style*="animation"], [style*="transition"]').all();
    
    for (const element of animationElements.slice(0, 5)) {
      const computedStyle = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          animationDuration: styles.animationDuration,
          transitionDuration: styles.transitionDuration
        };
      });
      
      // Animations should be very short or disabled when reduced motion is preferred
      if (computedStyle.animationDuration !== 'none') {
        const duration = parseFloat(computedStyle.animationDuration);
        expect(duration).toBeLessThan(0.5); // Less than 500ms
      }
    }
  });

  test('error messages are accessible', async ({ page }) => {
    // Try to trigger form validation errors
    const forms = await page.locator('form').all();
    
    for (const form of forms) {
      const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
      
      if (await submitButton.count() > 0) {
        // Submit empty form to trigger validation
        await submitButton.click();
        await page.waitForTimeout(500);
        
        // Check for accessible error messages
        const errorElements = await page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"], .error').all();
        
        for (const error of errorElements) {
          const text = await error.textContent();
          expect(text?.trim().length).toBeGreaterThan(0);
          
          // Error should be associated with form field
          const ariaDescribedBy = await error.getAttribute('id');
          if (ariaDescribedBy) {
            const associatedField = page.locator(`[aria-describedby*="${ariaDescribedBy}"]`);
            expect(await associatedField.count()).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
