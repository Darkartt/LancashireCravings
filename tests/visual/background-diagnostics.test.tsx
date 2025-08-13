/**
 * Background System Diagnostic Tests
 * 
 * This test suite diagnoses and ensures:
 * 1. Background animations are visible but don't block content
 * 2. Z-index layering follows professional standards
 * 3. Background opacity levels are correct
 * 4. CSS custom properties work properly
 */

import { render, screen } from '@testing-library/react';
import { act } from 'react';
import SmoothBackground from '@/components/backgrounds/SmoothBackground';
import HomeBackground from '@/components/backgrounds/HomeBackground';

describe('Background System Diagnostics', () => {
  describe('SmoothBackground Component', () => {
    it('renders with correct z-index and positioning', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

  const background = screen.getByTestId('smooth-background');
      expect(background).toHaveStyle({
        position: 'fixed',
        zIndex: '-8',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0'
      });
    });

    it('has proper pointer-events and aria attributes', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

  const background = screen.getByTestId('smooth-background');
      expect(background).toHaveClass('pointer-events-none');
      expect(background).toHaveAttribute('aria-hidden', 'true');
    });

    it('uses correct opacity levels per .copilot-instructions.md', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

  const background = screen.getByTestId('smooth-background');
  const overlay = background.querySelector('div');
  const styles = window.getComputedStyle(overlay || background);
  const opacity = parseFloat(styles.opacity);
  expect(opacity).toBeCloseTo(0.1, 1);
    });

    const variants = ['home', 'portfolio', 'about', 'shop', 'commission'] as const;
    it.each(variants)('supports %s variant rendering', async (variant) => {
      await act(async () => {
        render(<SmoothBackground variant={variant} />);
      });
      const background = screen.getByTestId('smooth-background');
      expect(background).toBeInTheDocument();
    });
  });

  describe('Background Layering System', () => {
    it('follows .copilot-instructions.md z-index hierarchy', async () => {
      await act(async () => {
        render(
          <div>
            <SmoothBackground variant="home" />
            <div style={{ zIndex: 0 }} data-testid="content-base">Content Base</div>
            <div style={{ zIndex: 1 }} data-testid="content-elevated">Content Elevated</div>
          </div>
        );
      });

  const background = screen.getByTestId('smooth-background');
      const contentBase = screen.getByTestId('content-base');
      const contentElevated = screen.getByTestId('content-elevated');

      // Verify z-index hierarchy
      expect(background).toHaveStyle({ zIndex: '-8' });
      expect(contentBase).toHaveStyle({ zIndex: '0' });
      expect(contentElevated).toHaveStyle({ zIndex: '1' });
    });

    it('ensures content is above background layers', async () => {
      await act(async () => {
        render(
          <div>
            <SmoothBackground variant="home" />
            <main style={{ position: 'relative', zIndex: 1 }} data-testid="main-content">
              <h1>Test Content</h1>
            </main>
          </div>
        );
      });

  const background = screen.getByTestId('smooth-background');
      const mainContent = screen.getByTestId('main-content');

      const backgroundZIndex = parseInt(window.getComputedStyle(background).zIndex);
      const contentZIndex = parseInt(window.getComputedStyle(mainContent).zIndex);

      expect(contentZIndex).toBeGreaterThan(backgroundZIndex);
    });
  });

  describe('CSS Custom Properties Integration', () => {
    it('uses design system color variables', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

  const background = screen.getByTestId('smooth-background');
      const styles = window.getComputedStyle(background);
      
      // Should use CSS custom properties for colors
      expect(styles.background).toMatch(/rgba?\(/);
    });

    it('applies correct animation and transform properties', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

  const background = screen.getByTestId('smooth-background');
      
      expect(background).toHaveClass('animate-gradient');
      expect(background).toHaveStyle({
        willChange: 'background',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden'
      });
    });
  });

  describe('Performance Optimizations', () => {
    it('has proper GPU acceleration attributes', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

  const background = screen.getByTestId('smooth-background');
      
      expect(background).toHaveStyle({
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        willChange: 'background'
      });
    });

    it('uses efficient transition timing', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

      const background = screen.getByRole('presentation', { hidden: true });
      const styles = window.getComputedStyle(background);
      
      // Should have smooth transition
      expect(styles.transition).toMatch(/background.*1\.5s.*cubic-bezier/);
    });
  });

  describe('Background Visibility Diagnostics', () => {
    it('diagnoses potential visibility blocking issues', async () => {
      await act(async () => {
        render(
          <div>
            <SmoothBackground variant="home" />
            <div 
              style={{ 
                position: 'fixed', 
                inset: 0, 
                background: 'white', 
                zIndex: 0 
              }}
              data-testid="potential-blocker"
            >
              Potential Content Blocker
            </div>
          </div>
        );
      });

      const background = screen.getByRole('presentation', { hidden: true });
      const blocker = screen.getByTestId('potential-blocker');

      // Background should be at -8, blocker at 0 - this would block the background
      const backgroundZ = parseInt(window.getComputedStyle(background).zIndex);
      const blockerZ = parseInt(window.getComputedStyle(blocker).zIndex);

      expect(backgroundZ).toBeLessThan(blockerZ);
      // This test identifies the issue: solid backgrounds at z-index 0 block the background
    });

    it('ensures mix-blend-mode is properly applied', async () => {
      await act(async () => {
        render(<SmoothBackground variant="home" />);
      });

      const background = screen.getByRole('presentation', { hidden: true });
      expect(background).toHaveStyle({ mixBlendMode: 'multiply' });
    });
  });
});
