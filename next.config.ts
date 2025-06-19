import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/your-repo-name' : '', // <-- Replace with your actual repo name
  images: {
    unoptimized: true
  },
};

export default nextConfig;
