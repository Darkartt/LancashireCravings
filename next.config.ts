import type { NextConfig } from "next";

// const isProd = process.env.NODE_ENV === 'production'; // No longer needed for assetPrefix

const nextConfig: NextConfig = {
  output: 'export',
  // assetPrefix: isProd ? '/check/' : undefined, // Remove assetPrefix for custom domain root
  /* config options here */
};

export default nextConfig;
