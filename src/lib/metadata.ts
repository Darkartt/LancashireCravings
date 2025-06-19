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
  title: 'Elite Woodcraft - Premium Custom Woodcarving & Furniture',
  description: 'Discover exceptional custom woodcarving craftsmanship from Liverpool. Bespoke wooden furniture, sculptures, and architectural elements for discerning clients who value quality and artistry.',
  keywords: [
    'custom woodcarving',
    'bespoke furniture',
    'Liverpool woodcraft',
    'handcrafted furniture',
    'wooden sculptures',
    'artisan woodworking',
    'sustainable furniture',
    'commissioned woodwork'
  ],
  siteUrl: 'https://exampledesign.co.uk',
  ogImage: '/og-image.jpg',
  twitterHandle: '@elitewoodcraft'
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
    authors: [{ name: 'Elite Woodcraft' }],
    creator: 'Elite Woodcraft',
    publisher: 'Elite Woodcraft',
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
      siteName: 'Elite Woodcraft',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || 'Elite Woodcraft - Premium Custom Woodcarving',
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
        name: 'Elite Woodcraft',
        url: defaultMetadata.siteUrl,
        logo: `${defaultMetadata.siteUrl}/logo.svg`,
        description: defaultMetadata.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Liverpool',
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
        name: 'Elite Woodcraft',
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
          name: 'Elite Woodcraft',
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Elite Woodcraft',
        },
        ...data,
      };

    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        publisher: {
          '@type': 'Organization',
          name: 'Elite Woodcraft',
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
