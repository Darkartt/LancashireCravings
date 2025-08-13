import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';
// Minimal stubs for Fetch API objects if absent (allows importing Next route handlers in tests)
if (typeof Request === 'undefined') {
  // @ts-ignore
  globalThis.Request = class {};
}
if (typeof Response === 'undefined') {
  // @ts-ignore
  globalThis.Response = class {};
}
if (typeof Headers === 'undefined') {
  // @ts-ignore
  globalThis.Headers = class {
    get() { return null; }
  };
}

// Configure React Testing Library
configure({ testIdAttribute: 'data-testid' });

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn()
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn()
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  }
}));

// Mock Lenis smooth scrolling library
jest.mock('lenis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    off: jest.fn(),
    destroy: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    raf: jest.fn(),
    scrollTo: jest.fn()
  }));
});

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function Image({ src, alt, ...props }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn()
});

// Mock CSS.supports
Object.defineProperty(window, 'CSS', {
  writable: true,
  value: {
    supports: jest.fn().mockReturnValue(true)
  }
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => [])
  }
});

// Mock fetch for API tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200
  })
);

// Console warnings filter for known issues
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out known warnings from testing environment
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('Warning: ReactDOMTestUtils.act') ||
     message.includes('Warning: An invalid form control') ||
     message.includes('Warning: validateDOMNesting'))
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

// Setup performance measurement helpers
global.measurePerformance = (fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return {
    result,
    duration: end - start
  };
};

// Setup accessibility testing
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Mock gsap & ScrollTrigger (prevents ESM import errors and animation warnings in tests)
jest.mock('gsap', () => {
  const functions = ['registerPlugin', 'to', 'from', 'fromTo', 'set', 'timeline'];
  const gsapMock = {};
  functions.forEach(fn => {
    gsapMock[fn] = jest.fn(() => gsapMock);
  });
  return { gsap: gsapMock, default: gsapMock };
});

jest.mock('gsap/ScrollTrigger', () => {
  const triggers = [];
  const create = jest.fn((vars = {}) => {
    const triggerObj = {
      kill: jest.fn(),
      refresh: jest.fn(),
      update: jest.fn(),
      vars,
      trigger: vars.trigger || null
    };
    triggers.push(triggerObj);
    return triggerObj;
  });
  const getAll = jest.fn(() => triggers);
  const getById = jest.fn((id) => triggers.find(t => t.vars && t.vars.id === id));
  const killAll = jest.fn(() => { triggers.length = 0; });
  return { ScrollTrigger: { create, refresh: jest.fn(), killAll, config: jest.fn(), normalizeScroll: jest.fn(), getById, getAll } };
});

// Inject fallback animation styles used by tests (e.g., fallback-show)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `@keyframes fallback-show { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  [data-animate-fade-up], [data-animate-fade-in], [data-animate-slide-left], [data-animate-scale] { animation: fallback-show 0.3s ease-out forwards; }`;
  document.head.appendChild(style);
}

// Mock heavy animation components to reduce noise & avoid DOM/ScrollTrigger coupling in unit tests
jest.mock('@/components/animations/SectionMorphing', () => () => <div data-testid="section-morphing" />);
jest.mock('@/components/animations/WoodGrainTransition', () => () => <div data-testid="woodgrain-transition" />);
