import type { MetadataRoute } from 'next';
import { realProjects } from '@/lib/projects-real';
import { generateStaticParams } from '@/app/shop/[category]/generateStaticParams';

export const dynamic = 'force-static';
export const revalidate = false;

// Enhanced sitemap with local SEO optimization
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://exampledesign.co.uk';
  
  // Static pages with optimized priorities and change frequencies
  const staticPaths = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: 'about', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: 'contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'portfolio', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: 'services', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'commission', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'shop', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: 'blog', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: 'process', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: 'projects', priority: 0.8, changeFrequency: 'weekly' as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: path ? `${base}/${path}/` : `${base}/`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  // Include dynamic routes from real data
  const projectUrls = (realProjects || []).map((p: any) => ({
    url: `${base}/projects/${p.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const shopCategories = (generateStaticParams?.() || []).map((c: any) => c.category);
  const shopUrls = shopCategories.map((c: string) => ({
    url: `${base}/shop/${c}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Add local business specific pages
  const localBusinessPages = [
    { path: 'woodcarving-mold', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'custom-furniture-wales', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'bespoke-woodcarving-flintshire', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: 'artisan-woodworking-north-wales', priority: 0.8, changeFrequency: 'monthly' as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${base}/${path}/`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  return [
    ...staticPaths,
    ...projectUrls,
    ...shopUrls,
    ...localBusinessPages,
  ];
}
