import { Metadata } from 'next';

interface MetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
}

const defaultMetadata = {
  title: 'Lancaster Carving Limited - Premium Custom Woodcarving & Furniture',
  description: 'Discover exceptional custom woodcarving craftsmanship from Mold, United Kingdom. Bespoke wooden furniture, sculptures, and architectural elements for discerning clients who value quality and artistry.',
  keywords: [
    'custom woodcarving',
    'bespoke furniture',
    'Mold woodcraft',
    'handcrafted furniture',
    'wooden sculptures',
    'artisan woodworking',
    'sustainable furniture',
    'commissioned woodwork',
    'Lancaster Carving'
  ],
  siteUrl: 'https://exampledesign.co.uk',
  ogImage: '/og-image.jpg',
  twitterHandle: '@lancastercarving'
};

export function generateMetadata({
  title,
  description = defaultMetadata.description,
  keywords = defaultMetadata.keywords,
  ogImage = defaultMetadata.ogImage,
  ogType = 'website',
  canonicalUrl
}: MetadataParams = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${defaultMetadata.title}`
    : defaultMetadata.title;
  const metadata: Metadata = {
    metadataBase: new URL(defaultMetadata.siteUrl),
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Lancaster Carving Limited' }],
    creator: 'Lancaster Carving Limited',
    publisher: 'Lancaster Carving Limited',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: ogType,
      locale: 'en_GB',
      url: canonicalUrl || defaultMetadata.siteUrl,
      title: fullTitle,
      description,
      siteName: 'Lancaster Carving Limited',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || 'Lancaster Carving Limited - Premium Custom Woodcarving',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: defaultMetadata.twitterHandle,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: '/logo.svg', type: 'image/svg+xml' },
        { url: '/favicon.svg', type: 'image/svg+xml' }
      ],
      shortcut: '/logo.svg',
      apple: '/apple-touch-icon.svg',
    },
  };

  return metadata;
}

export function generateStructuredData(type: 'organization' | 'website' | 'product' | 'article', data: any) {
  const baseData = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: 'Lancaster Carving Limited',
        url: defaultMetadata.siteUrl,
        logo: `${defaultMetadata.siteUrl}/logo.svg`,
        description: defaultMetadata.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mold',
          addressCountry: 'GB',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: 'English',
        },
        ...data,
      };

    case 'website':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: 'Lancaster Carving Limited',
        url: defaultMetadata.siteUrl,
        description: defaultMetadata.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${defaultMetadata.siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        ...data,
      };

    case 'product':
      return {
        ...baseData,
        '@type': 'Product',
        brand: {
          '@type': 'Brand',
          name: 'Lancaster Carving Limited',
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Lancaster Carving Limited',
        },
        ...data,
      };

    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        publisher: {
          '@type': 'Organization',
          name: 'Lancaster Carving Limited',
          logo: {
            '@type': 'ImageObject',
            url: `${defaultMetadata.siteUrl}/logo.svg`,
          },
        },
        ...data,
      };

    default:
      return baseData;
  }
}
