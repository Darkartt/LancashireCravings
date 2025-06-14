import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: '/check/', // Changed from basePath to assetPrefix
  /* config options here */
};

export default nextConfig;
