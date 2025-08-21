import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const hasCNAME = fs.existsSync('./CNAME');
const useSubpath = isGitHubPages && !hasCNAME;

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    unoptimized: false, // Enable Next.js image optimization
    formats: ['image/webp', 'image/avif'], // Modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: useSubpath ? `/${repoName}` : '',
  },
  experimental: {
    scrollRestoration: true,
    cssChunking: true,
  },
  ...(useSubpath
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : (isGitHubPages
        ? {
            output: 'export',
            trailingSlash: true,
          }
        : {})),
};

const nextConfig = withBundleAnalyzer(baseConfig);

export default nextConfig;
