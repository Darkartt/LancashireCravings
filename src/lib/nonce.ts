import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure nonce for CSP
 * This should be called server-side for each request
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Generate a CSP header with nonce for scripts and styles
 */
export function generateCSPHeader(nonce: string): string {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "'",
    "style-src 'self' 'nonce-" + nonce + "'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests'
  ].join('; ');

  return csp;
}

