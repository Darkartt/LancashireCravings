import { NextResponse, type NextRequest } from 'next/server';

/**
 * Global middleware applying baseline security headers (Phase 1).
 * NOTE: Applies only when deploying to a platform that runs the Next.js server/edge runtime (not static export).
 * Future tightening: Replace 'unsafe-inline' by nonces/hashes after refactoring inline JSON-LD.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests'
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // 6 months HSTS; includeSubDomains (add preload after verifying domain)
  res.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');

  return res;
}

export const config = {
  matcher: '/:path*'
};
