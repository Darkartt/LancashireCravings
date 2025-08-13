import type { MetadataRoute } from 'next';

// Basic sitemap. Extend with dynamic data (e.g., projects, products) later.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://exampledesign.co.uk';
  const staticPaths = ['', 'about', 'contact', 'portfolio'].map(p => {
    const loc = p ? `${base}/${p}/` : `${base}/`;
    return { url: loc, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: p === '' ? 1.0 : 0.7 };
  });
  return [
    ...staticPaths,
  ];
}
