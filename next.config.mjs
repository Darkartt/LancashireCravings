import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

const isVercel = process.env.VERCEL === '1';
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true' || process.env.VERCEL_URL?.includes('exampledesign.co.uk');

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    // Disable image optimization for Vercel to fix 400 errors
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Ensure static images work properly
    dangerouslyAllowSVG: true,
  },
  env: {
    CUSTOM_DOMAIN: isCustomDomain ? 'true' : 'false',
  },
  experimental: {
    scrollRestoration: true,
    cssChunking: true,
  },
  // Vercel-specific optimizations
  ...(isVercel ? {
    // Enable Vercel's built-in optimizations
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
  } : {}),
};

const nextConfig = withBundleAnalyzer(baseConfig);

export default nextConfig;
