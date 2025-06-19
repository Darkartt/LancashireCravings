import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// No need for basePath if we're using a custom domain as homepage
// If you're using GitHub Pages with a repo name, uncomment and set this:
// const basePath = isProd ? '/your-repo-name' : '';

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export for GitHub Pages
  // basePath: basePath, // No basePath for custom domain
  images: {
    unoptimized: true
  },
  /* config options here */
};

export default nextConfig;
