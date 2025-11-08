/**
 * SEO Utilities
 * Comprehensive SEO helpers for generating optimized metadata and structured data
 */

import { Metadata } from 'next';
import { generateMetadata, generateStructuredData } from './metadata';

/**
 * Generate product page metadata with structured data
 */
export function generateProductSEO(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  materials?: string[];
  inStock?: boolean;
  rating?: number;
  reviewCount?: number;
}) {
  const metadata: Metadata = generateMetadata({
    title: product.name,
    description: product.description,
    keywords: [
      product.name.toLowerCase(),
      'custom woodcarving',
      'handcrafted',
      ...(product.category ? [product.category.toLowerCase()] : []),
      ...(product.materials || []),
    ],
    ogImage: product.images[0],
    ogType: 'website',
    canonicalUrl: `/shop/${product.id}`,
  });

  const structuredData = generateStructuredData('product', {
    name: product.name,
    description: product.description,
    id: product.id,
    price: product.price,
    images: product.images,
    url: `/shop/${product.id}`,
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    availability: product.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/PreOrder',
    aggregateRating: product.rating && product.reviewCount ? {
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  });

  return { metadata, structuredData };
}

/**
 * Generate project/portfolio page metadata with creative work schema
 */
export function generateProjectSEO(project: {
  id: string;
  title: string;
  description: string;
  images: string[];
  category?: string;
  materials?: string[];
  dateCreated?: string;
  dimensions?: string;
}) {
  const metadata: Metadata = generateMetadata({
    title: project.title,
    description: project.description,
    keywords: [
      project.title.toLowerCase(),
      'wood carving',
      'portfolio',
      'custom artwork',
      ...(project.category ? [project.category.toLowerCase()] : []),
      ...(project.materials || []),
    ],
    ogImage: project.images[0],
    canonicalUrl: `/projects/${project.id}`,
  });

  const structuredData = generateStructuredData('creativework', {
    name: project.title,
    description: project.description,
    images: project.images,
    dateCreated: project.dateCreated,
    material: project.materials?.join(', '),
    size: project.dimensions,
  });

  return { metadata, structuredData };
}

/**
 * Generate FAQ page structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return generateStructuredData('faqpage', { faqs });
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return generateStructuredData('breadcrumb', { items });
}

/**
 * Generate service page metadata (for commission, restoration, etc.)
 */
export function generateServiceSEO(service: {
  name: string;
  description: string;
  serviceType?: string;
  keywords?: string[];
}) {
  const metadata: Metadata = generateMetadata({
    title: service.name,
    description: service.description,
    keywords: service.keywords || [
      service.name.toLowerCase(),
      'woodcarving service',
      'custom commission',
      'bespoke furniture',
    ],
    canonicalUrl: `/${service.name.toLowerCase().replace(/\s+/g, '-')}`,
  });

  const structuredData = generateStructuredData('service', {
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
  });

  return { metadata, structuredData };
}

/**
 * Generate local business schema for about/contact pages
 */
export function generateLocalBusinessSchema(options?: {
  telephone?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: Array<{
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
}) {
  return generateStructuredData('localbusiness', {
    telephone: options?.telephone,
    latitude: options?.latitude,
    longitude: options?.longitude,
    openingHours: options?.openingHours?.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    })),
  });
}

/**
 * Generate article metadata for blog posts
 */
export function generateArticleSEO(article: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
}) {
  const metadata: Metadata = generateMetadata({
    title: article.title,
    description: article.description,
    keywords: article.keywords || [
      article.title.toLowerCase(),
      'woodcarving blog',
      'craftsmanship',
    ],
    ogImage: article.image,
    ogType: 'article',
  });

  const structuredData = generateStructuredData('article', {
    headline: article.title,
    description: article.description,
    image: article.image ? [article.image] : [],
    datePublished: article.datePublished,
    dateModified: article.dateModified,
  });

  return { metadata, structuredData };
}

/**
 * SEO-optimized canonical URL generator
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = 'https://exampledesign.co.uk';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate robots meta tag based on environment
 */
export function getRobotsMeta(shouldIndex: boolean = true): Metadata['robots'] {
  return {
    index: shouldIndex,
    follow: shouldIndex,
    googleBot: {
      index: shouldIndex,
      follow: shouldIndex,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}
