const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: isGitHubPages,
  },
  ...(isGitHubPages
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
