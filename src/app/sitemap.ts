import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

// Basic sitemap. Extend with dynamic data (e.g., projects, products) later.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://exampledesign.co.uk';
  const staticPaths = ['', 'about', 'contact', 'portfolio', 'services', 'commission', 'shop', 'blog', 'process', 'projects'].map(p => {
    const loc = p ? `${base}/${p}/` : `${base}/`;
  return { url: loc, changeFrequency: 'weekly' as const, priority: p === '' ? 1.0 : 0.7 };
  });
  // Include dynamic routes from real data
  const { realProjects } = require('@/lib/projects-real');
  const projectUrls = (realProjects || []).map((p: any) => ({
    url: `${base}/projects/${p.slug}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  const { generateStaticParams } = require('@/app/shop/[category]/generateStaticParams');
  const shopCategories = (generateStaticParams?.() || []).map((c: any) => c.category);
  const shopUrls = shopCategories.map((c: string) => ({
    url: `${base}/shop/${c}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.5
  }));

  return [
    ...staticPaths,
    ...projectUrls,
    ...shopUrls,
  ];
}
