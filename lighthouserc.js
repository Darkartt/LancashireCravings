module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run build && npm start',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/portfolio',
        'http://localhost:3000/about',
        'http://localhost:3000/services',
        'http://localhost:3000/commission'
      ],
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
        chromeFlags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ]
      },
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        
        // Resource efficiency
        'unused-css-rules': ['warn', { maxLength: 2 }],
        'unused-javascript': ['warn', { maxLength: 2 }],
        'unminified-css': ['error', { maxLength: 0 }],
        'unminified-javascript': ['error', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'uses-responsive-images': ['warn', { maxLength: 0 }],
        'offscreen-images': ['warn', { maxLength: 0 }],
        
        // Accessibility
        'color-contrast': ['error', { maxLength: 0 }],
        'image-alt': ['error', { maxLength: 0 }],
        'label': ['error', { maxLength: 0 }],
        'aria-valid-attr': ['error', { maxLength: 0 }],
        'aria-valid-attr-value': ['error', { maxLength: 0 }],
        'button-name': ['error', { maxLength: 0 }],
        'link-name': ['error', { maxLength: 0 }],
        'heading-order': ['error', { maxLength: 0 }],
        'landmark-one-main': ['error', { maxLength: 0 }],
        
        // SEO
        'meta-description': ['error', { maxLength: 0 }],
        'document-title': ['error', { maxLength: 0 }],
        'html-has-lang': ['error', { maxLength: 0 }],
        'html-lang-valid': ['error', { maxLength: 0 }],
        'canonical': ['warn', { maxLength: 0 }],
        
        // Best Practices
        'is-on-https': ['error', { maxLength: 0 }],
        'uses-http2': ['warn', { maxLength: 0 }],
        'no-vulnerable-libraries': ['error', { maxLength: 0 }],
        'charset': ['error', { maxLength: 0 }],
        'doctype': ['error', { maxLength: 0 }],
        
        // Progressive Web App (if applicable)
        'service-worker': ['warn', { maxLength: 0 }],
        'offline-start-url': ['warn', { maxLength: 0 }],
        'apple-touch-icon': ['warn', { maxLength: 0 }],
        'themed-omnibox': ['warn', { maxLength: 0 }],
        
        // Security
        'csp-xss': ['warn', { maxLength: 0 }],
        'external-anchors-use-rel-noopener': ['error', { maxLength: 0 }],
        
        // Woodworking website specific checks
        'font-display': ['warn', { maxLength: 0 }], // For custom fonts
        'preload-lcp-image': ['warn', { maxLength: 0 }], // For hero images
        'uses-text-compression': ['error', { maxLength: 0 }], // Important for content-heavy site
      },
    },
    upload: {
      target: 'temporary-public-storage', // Change to your preferred storage
    },
    server: {
      port: 9001,
      storage: './lighthouse-results'
    }
  },
};
