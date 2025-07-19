import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
