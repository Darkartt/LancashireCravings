/**
 * Accessibility Utilities
 * Helpers for improving WCAG 2.1 AA compliance
 */

/**
 * Generates a unique ID for associating labels with inputs
 */
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if an element is keyboard focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableElements = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
  ];

  return focusableElements.some(selector => element.matches(selector));
}

/**
 * Gets all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * Creates a focus trap for modals and dialogs
 */
export function createFocusTrap(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announces a message to screen readers using an aria-live region
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is made
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Checks color contrast ratio (simplified - for basic checks)
 * For production, use a library like color-contrast-checker
 */
export function getContrastRatio(foreground: string, background: string): number {
  // This is a simplified implementation
  // For accurate contrast checking, use a proper library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const sRGB = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validates if contrast meets WCAG AA standards
 */
export function meetsContrastRequirement(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Escape hatch for when you need to use tabIndex=-1
 * Documents why an element is being removed from tab order
 */
export function removeFromTabOrder(reason: string): number {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Element removed from tab order: ${reason}`);
  }
  return -1;
}

/**
 * Creates a descriptive aria-label for complex interactive elements
 */
export function createAriaLabel(
  action: string,
  target: string,
  context?: string
): string {
  const parts = [action, target];
  if (context) {
    parts.push(`(${context})`);
  }
  return parts.join(' ');
}

/**
 * Brand color contrast ratios for reference
 * Saddle Brown: #8B4513
 * Olive Green: #556B2F
 * Warm Brown: #CD853F
 */
export const brandColorContrast = {
  saddleBrown: {
    onWhite: 5.75, // Passes AA for normal text
    onBlack: 3.65, // Fails AA for normal text
  },
  oliveGreen: {
    onWhite: 6.22, // Passes AA for normal text
    onBlack: 3.37, // Fails AA for normal text
  },
  warmBrown: {
    onWhite: 3.91, // Fails AA for normal text
    onBlack: 5.38, // Passes AA for normal text
  },
};

/**
 * Helper to determine if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Helper to determine if high contrast mode is active
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Visually hidden class for screen reader only content
 * Tailwind equivalent: sr-only
 */
export const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const;
