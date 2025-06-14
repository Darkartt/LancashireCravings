import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isProd ? '/check/' : undefined, // Apply assetPrefix only in production
  /* config options here */
};

export default nextConfig;
