import type { NextConfig } from "next";

// const isProd = process.env.NODE_ENV === 'production'; // No longer needed for assetPrefix

const nextConfig: NextConfig = {
  // output: 'export', // Temporarily commented out to resolve asset loading issues in development mode
  // assetPrefix: isProd ? '/check/' : undefined, // Remove assetPrefix for custom domain root
  images: {
    unoptimized: true
  },
  /* config options here */
};

export default nextConfig;
