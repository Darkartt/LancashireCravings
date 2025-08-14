import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

// Basic sitemap. Extend with dynamic data (e.g., projects, products) later.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://exampledesign.co.uk';
  const staticPaths = ['', 'about', 'contact', 'portfolio'].map(p => {
    const loc = p ? `${base}/${p}/` : `${base}/`;
  return { url: loc, changeFrequency: 'weekly' as const, priority: p === '' ? 1.0 : 0.7 };
  });
  return [
    ...staticPaths,
  ];
}
