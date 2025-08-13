/**
 * Landing Page Content Visibility and Background Tests
 * 
 * This test suite ensures:
 * 1. All content sections are properly visible
 * 2. Background animations don't interfere with content
 * 3. Z-index layering follows .copilot-instructions.md standards
 * 4. Professional design system compliance
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { act } from 'react';
import Home from '@/app/page';

// Mock Next.js components for testing
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock lazy components to avoid Suspense issues in tests
jest.mock('@/components/backgrounds/HomeBackground', () => {
  return function MockHomeBackground() {
    return (
      <div 
        data-testid="home-background"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -8 }}
        aria-hidden="true"
      >
        Background Animation
      </div>
    );
  };
});

jest.mock('@/components/animations/SectionMorphing', () => {
  return function MockSectionMorphing({ sectionId, nextSectionId }: any) {
    return (
      <div 
        data-testid={`section-morphing-${sectionId}-${nextSectionId}`}
        className="section-transition"
      >
        Section Transition
      </div>
    );
  };
});

describe('Landing Page Content Visibility', () => {
  beforeEach(() => {
    // Reset any previous scroll position
    window.scrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  describe('Content Structure and Visibility', () => {
    it('renders all main content sections', async () => {
      await act(async () => {
        render(<Home />);
      });

  // Check hero section content (use heading role to avoid multiple "handcrafted" matches)
  const heroHeading = screen.getByRole('heading', { level: 1, name: /Handcrafted/i });
  expect(heroHeading).toBeInTheDocument();
  const heirloomSpan = screen.getAllByText(/Heirloom/i).find(el => el.classList.contains('text-foreground/90'));
  expect(heirloomSpan).toBeInTheDocument();
  const masterpiecesSpan = screen.getAllByText(/Masterpieces/i).find(el => el.classList.contains('text-accent-secondary'));
  expect(masterpiecesSpan).toBeInTheDocument();
      
      // Check navigation buttons
      expect(screen.getByText(/Commission Custom Piece/i)).toBeInTheDocument();
      expect(screen.getByText(/Explore Collection/i)).toBeInTheDocument();
      
      // Check process section exists
      expect(screen.getByText(/From Vision to Heirloom/i)).toBeInTheDocument();
    });

    it('ensures hero section has proper z-index layering', async () => {
      await act(async () => {
        render(<Home />);
      });

      const heroSection = screen.getByRole('banner').parentElement?.querySelector('#hero');
      expect(heroSection).toHaveStyle({ zIndex: '1' });
    });

    it('verifies background component is properly positioned', async () => {
      await act(async () => {
        render(<Home />);
      });

      const background = screen.getByTestId('home-background');
      expect(background).toBeInTheDocument();
      expect(background).toHaveStyle({ zIndex: '-8' });
      expect(background).toHaveClass('fixed', 'inset-0', 'pointer-events-none');
    });

    it('checks that content is not transparent or hidden', async () => {
      await act(async () => {
        render(<Home />);
      });

  const heroHeading = screen.getByRole('heading', { level: 1, name: /Handcrafted/i });
  const mainContent = heroHeading.closest('div');
      expect(mainContent).not.toHaveStyle({ opacity: '0' });
      expect(mainContent).not.toHaveStyle({ visibility: 'hidden' });
      expect(mainContent).not.toHaveStyle({ display: 'none' });
    });
  });

  describe('Background and Layering System', () => {
    it('follows .copilot-instructions.md z-index hierarchy', async () => {
      await act(async () => {
        render(<Home />);
      });

      // Background should be at z-index -8 (background layer)
      const background = screen.getByTestId('home-background');
      expect(background).toHaveStyle({ zIndex: '-8' });

      // Content should be at higher z-index levels
      const heroSection = screen.getByRole('banner').parentElement?.querySelector('#hero');
      expect(heroSection).toHaveStyle({ zIndex: '1' });
    });

    it('ensures background does not interfere with content interactions', async () => {
      await act(async () => {
        render(<Home />);
      });

      const commissionButton = screen.getByText(/Commission Custom Piece/i);
      
      // Button should be clickable (not blocked by background)
      expect(commissionButton.closest('a')).toBeVisible();
      
      // Background should be non-interactive
      const background = screen.getByTestId('home-background');
      expect(background).toHaveClass('pointer-events-none');
    });

    it('verifies transparent backgrounds allow content visibility', async () => {
      await act(async () => {
        render(<Home />);
      });

  const heroHeading = screen.getByRole('heading', { level: 1, name: /Handcrafted/i });
  const mainContainer = heroHeading.closest('[style*="background"]');
      if (mainContainer) {
        const styles = window.getComputedStyle(mainContainer);
        // Should have transparent or semi-transparent background
        expect(styles.background).toMatch(/(transparent|rgba)/);
      }
    });
  });

  describe('Section Background Integrity', () => {
    it('ensures process section has proper background styling', async () => {
      await act(async () => {
        render(<Home />);
      });

      const processSection = screen.getByText(/From Vision to Heirloom/i).closest('section');
      expect(processSection).toHaveClass('bg-transparent');
      
      // Check for proper section styling classes
      expect(processSection).toHaveClass('section-padding-xl');
    });

    it('verifies hero section background transparency', async () => {
      await act(async () => {
        render(<Home />);
      });

      const heroSection = screen.getByRole('banner').parentElement?.querySelector('#hero');
      expect(heroSection).toHaveClass('bg-transparent');
    });

    it('checks section morphing components exist', async () => {
      await act(async () => {
        render(<Home />);
      });

      const sectionMorphing = screen.getByTestId('section-morphing-hero-process');
      expect(sectionMorphing).toBeInTheDocument();
    });
  });

  describe('Professional Design System Compliance', () => {
    it('uses proper color scheme classes from design system', async () => {
      await act(async () => {
        render(<Home />);
      });

      // Check for proper color classes
  const heroTitle = screen.getByRole('heading', { level: 1, name: /Handcrafted/i });
  expect(heroTitle).toHaveClass('text-accent-primary');
  const subtitleSpan = screen.getAllByText(/Heirloom/i).find(el => el.classList.contains('text-foreground/90'));
  expect(subtitleSpan).toHaveClass('text-foreground/90');
    });

    it('ensures proper spacing using design system', async () => {
      await act(async () => {
        render(<Home />);
      });

      const heroSection = screen.getByRole('banner').parentElement?.querySelector('#hero');
      expect(heroSection).toHaveClass('pt-40', 'pb-40');
    });

    it('verifies typography hierarchy compliance', async () => {
      await act(async () => {
        render(<Home />);
      });

  const mainHeading = screen.getByRole('heading', { level: 1, name: /Handcrafted/i });
      expect(mainHeading).toHaveClass('text-6xl', 'md:text-8xl', 'lg:text-9xl');
      expect(mainHeading).toHaveClass('font-serif', 'font-bold');
    });
  });

  describe('Content Interaction and Accessibility', () => {
    it('ensures buttons are properly accessible and visible', async () => {
      await act(async () => {
        render(<Home />);
      });

      const commissionButton = screen.getByText(/Commission Custom Piece/i);
      const exploreButton = screen.getByText(/Explore Collection/i);
      
      expect(commissionButton.closest('a')).toHaveAttribute('href', '/commission');
      expect(exploreButton.closest('a')).toHaveAttribute('href', '/portfolio');
      
      // Buttons should be visible and not obscured
      expect(commissionButton).toBeVisible();
      expect(exploreButton).toBeVisible();
    });

    it('verifies scroll indicator is present and visible', async () => {
      await act(async () => {
        render(<Home />);
      });

      const scrollIndicator = screen.getByText(/Discover Our Craft/i);
      expect(scrollIndicator).toBeInTheDocument();
      expect(scrollIndicator).toBeVisible();
    });

    it('checks animation attributes for scroll animations', async () => {
      await act(async () => {
        render(<Home />);
      });

  const heroHeading = screen.getByRole('heading', { level: 1, name: /Handcrafted/i });
  const animatedElements = heroHeading.closest('[data-animate-fade-up]');
      expect(animatedElements).toBeInTheDocument();
    });
  });

  describe('Responsive Design and Layout', () => {
    it('ensures proper container classes for layout', async () => {
      await act(async () => {
        render(<Home />);
      });

  const heroHeading = screen.getByRole('heading', { level: 1, name: /Handcrafted/i });
  const heroContainer = heroHeading.closest('.container-modern');
      expect(heroContainer).toHaveClass('max-w-6xl');
    });

    it('verifies responsive text sizing', async () => {
      await act(async () => {
        render(<Home />);
      });

  // Check hero subtitle by class (content may vary by companyInfo description)
  const heroSubtitle = document.querySelector('#hero .hero-subtitle') as HTMLElement | null;
  expect(heroSubtitle).toHaveClass('text-xl', 'md:text-2xl', 'lg:text-3xl');
    });
  });
});
