import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// No need for basePath if we're using a custom domain as homepage
// If you're using GitHub Pages with a repo name, uncomment and set this:
// const basePath = isProd ? '/your-repo-name' : '';

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export for GitHub Pages
  // basePath: basePath, // No basePath for custom domain
  images: {
    unoptimized: true // Required for static export
  },
  trailingSlash: true, // Helps with GitHub Pages routing
  // Ensure we're not treating 404s as SSG pages in production
  experimental: {
    scrollRestoration: true
  }
};

export default nextConfig;
