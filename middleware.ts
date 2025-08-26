import { NextResponse, type NextRequest } from 'next/server';

/**
 * Generate a cryptographically secure nonce for CSP using Web Crypto API (Edge Runtime compatible)
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Generate a CSP header with nonce for scripts and styles
 */
function generateCSPHeader(nonce: string): string {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic'",
    "style-src 'self' 'nonce-" + nonce + "' 'unsafe-hashes'",
    "img-src 'self' data: blob: https: *.vercel.app *.vercel-insights.com",
    "font-src 'self' data: https:",
    "connect-src 'self' https: *.vercel.app *.vercel-insights.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "require-trusted-types-for 'script'"
  ].join('; ');

  return csp;
}

/**
 * Global middleware applying security headers with CSP nonces (Phase 2).
 * Generates a unique nonce per request for inline scripts and styles.
 * This provides better security than 'unsafe-inline' while maintaining functionality.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Generate a unique nonce for this request
  const nonce = generateNonce();

  // Generate CSP header with the nonce
  const csp = generateCSPHeader(nonce);

  // Set security headers
  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  // 1 year HSTS with preload for exampledesign.co.uk
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

  // Pass the nonce to the page via a custom header (will be consumed by layout)
  res.headers.set('X-Nonce', nonce);

  return res;
}

export const config = {
  matcher: '/:path*'
};
