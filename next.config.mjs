import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isVercel = process.env.VERCEL === '1';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
// Always use subpath for GitHub Pages deployments at user.github.io/<repo>
const useSubpath = isGitHubPages;

// For exampledesigns.co.uk deployment
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    // For Vercel, we can use image optimization
    unoptimized: isGitHubPages ? true : false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable image optimization for Vercel
    ...(isVercel && {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    }),
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: useSubpath ? `/${repoName}` : '',
    CUSTOM_DOMAIN: process.env.CUSTOM_DOMAIN || 'false',
  },
  experimental: {
    scrollRestoration: true,
    cssChunking: true,
  },
  // Only use static export for GitHub Pages, not for Vercel
  ...(isGitHubPages
    ? {
        output: 'export',
        trailingSlash: true,
        ...(useSubpath && repoName
          ? {
              basePath: `/${repoName}`,
              assetPrefix: `/${repoName}/`,
            }
          : {}),
      }
    : {}),
};

const nextConfig = withBundleAnalyzer(baseConfig);

export default nextConfig;
