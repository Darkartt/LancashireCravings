import fs from 'node:fs';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
// If a CNAME file exists, we're using a custom domain and should not set basePath/assetPrefix
const hasCNAME = fs.existsSync('./CNAME');
const useSubpath = isGitHubPages && !hasCNAME;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: isGitHubPages,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: useSubpath ? `/${repoName}` : '',
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

export default nextConfig;
