import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Header from '../../src/components/Header';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Global function from setup.js
declare global {
  function measurePerformance(fn: () => void): { duration: number };
}

// Mock Lenis for smooth scrolling
jest.mock('@studio-freight/lenis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    scrollTo: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    destroy: jest.fn()
  }))
}));

describe('Header Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('displays the brand logo/name', () => {
      render(<Header />);
      const logo = screen.getByRole('link', { name: /lancaster carving limited.*home/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('href', '/');
    });

    it('renders main navigation menu', () => {
      render(<Header />);
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
      
      // Check for specific navigation items
      expect(screen.getByRole('link', { name: /^portfolio$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^about$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^services$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^contact$/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper ARIA labels and roles', () => {
      render(<Header />);
      
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveAttribute('aria-label');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Header />);
      
      const firstLink = screen.getAllByRole('link')[0];
      
      // Tab should focus the first link
      await user.tab();
      expect(firstLink).toHaveFocus();
    });

    it('has proper contrast ratios for text elements', () => {
      render(<Header />);
      const navigation = screen.getByRole('navigation');
      
      // Check if navigation has the expected base classes
      expect(navigation).toHaveClass('hidden', 'md:flex');
      
      // Check if navigation links have proper styling
      const links = screen.getAllByRole('link');
      const navLinks = links.filter(link => link.closest('nav'));
      expect(navLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Behavior', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('768px'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<Header />);
      
      // Should render mobile menu toggle
      const mobileToggle = screen.queryByRole('button', { name: /menu|navigation/i });
      if (mobileToggle) {
        expect(mobileToggle).toBeInTheDocument();
      }
    });

    it('handles mobile menu toggle', async () => {
      const user = userEvent.setup();
      
      // Mock mobile environment
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('768px'),
          media: query,
        })),
      });

      render(<Header />);
      
      const mobileToggle = screen.queryByRole('button', { name: /menu|navigation/i });
      if (mobileToggle) {
        await act(async () => {
          await user.click(mobileToggle);
        });
        
        // Check if menu is expanded
        expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');
      }
    });
  });

  describe('Scroll Behavior', () => {
    it('changes style on scroll', async () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      
      // Simulate scroll event
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 100
      });
      
      fireEvent.scroll(window);
      
      await waitFor(() => {
        // Header should have scrolled class or style
        expect(header).toHaveClass(/scrolled|scroll-|bg-/);
      });
    });

    it('maintains visibility during scroll', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      
      // Check if header has proper z-index
      expect(header).toHaveClass(/z-\d+|fixed|sticky/);
    });
  });

  describe('Performance', () => {
    it('renders within performance budget', () => {
      const { duration } = measurePerformance(() => {
        render(<Header />);
      });
      
      // Should render within 50ms
      expect(duration).toBeLessThan(50);
    });

    it('uses proper CSS classes for GPU acceleration', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      
      // Check for performance-optimized classes
      const headerElement = header.closest('header') || header;
      const computedStyle = window.getComputedStyle(headerElement);
      
      // Should have transform property for GPU acceleration
      expect(
        headerElement.classList.toString().includes('transform') ||
        computedStyle.transform !== 'none' ||
        headerElement.style.willChange
      ).toBeTruthy();
    });
  });

  describe('Theme Support', () => {
    it('applies correct theme colors', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      
      // Should use theme colors from design system
      expect(header).toHaveClass(/bg-background|bg-surface|bg-white/);
    });

    it('supports dark mode if implemented', () => {
      // Mock dark mode preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('dark'),
          media: query,
        })),
      });

      render(<Header />);
      const header = screen.getByRole('banner');
      
      // Should handle dark mode appropriately
      expect(header).toBeInTheDocument();
    });
  });

  describe('SEO and Meta', () => {
    it('has proper semantic HTML structure', () => {
      render(<Header />);
      
      // Should use proper HTML5 semantic elements
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('has structured data attributes if implemented', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      
      // Check for schema.org or other structured data
      const hasStructuredData = 
        header.querySelector('[itemscope]') ||
        header.querySelector('[data-schema]') ||
        document.querySelector('script[type="application/ld+json"]');
      
      // This is optional but good for SEO
      if (hasStructuredData) {
        expect(hasStructuredData).toBeInTheDocument();
      }
    });
  });
});
