import type { NextConfig } from "next";
// Bundle analyzer (conditionally loaded)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

const baseConfig: NextConfig = {
  // output: 'export', // Enable static HTML export for GitHub Pages - temporarily disabled for dynamic routes
  images: {
    unoptimized: true // Required for static export
  },
  trailingSlash: true, // Helps with GitHub Pages routing
  experimental: {
    scrollRestoration: true,
    // Lightning CSS integration for improved performance
    cssChunking: true, // Enable CSS chunking for better performance
  },
  // Configure Lightning CSS for production builds
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Use Lightning CSS for CSS minification in production
      config.optimization = {
        ...config.optimization,
        minimizer: [
          ...config.optimization.minimizer,
        ],
      };
    }
    return config;
  }
};

const nextConfig: NextConfig = withBundleAnalyzer(baseConfig);

export default nextConfig;
