const { test, expect } = require('@playwright/test');

test.describe('3D Background Effect', () => {
  const pages = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Portfolio', url: '/portfolio' },
    { name: 'Shop', url: '/shop' },
    { name: 'Blog', url: '/blog' },
    { name: 'Contact', url: '/contact' }
  ];

  pages.forEach(pageItem => {
    test(`should display 3D background on ${pageItem.name} page`, async ({ page }) => {
      console.log('Navigating to URL:', 'http://localhost:3000' + pageItem.url);
      // Listen for console errors or warnings
      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          console.log(`Console ${msg.type()}: ${msg.text()}`);
        }
      });
      // Set an even longer timeout for page navigation
      await page.goto('http://localhost:3000' + pageItem.url, { timeout: 30000 });
      await page.waitForTimeout(5000); // Wait longer for 3D rendering
      
      // Check for the presence of the canvas element rendered by Three.js
      const canvas = await page.$('canvas');
      expect(canvas).not.toBeNull();
      
      // Optionally take a screenshot for visual verification
      await page.screenshot({ path: `screenshots/${pageItem.name.toLowerCase()}-page.png` });
      console.log(`Screenshot taken for ${pageItem.name} page`);
    });
  });
});
