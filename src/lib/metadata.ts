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

export function generateStructuredData(
  type: 'organization' | 'website' | 'product' | 'article' | 'creativework' | 'localbusiness' | 'service' | 'breadcrumb' | 'faqpage',
  data: any
) {
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
        sameAs: [
          // Add social media links when available
        ],
        ...data,
      };

    case 'localbusiness':
      return {
        ...baseData,
        '@type': 'LocalBusiness',
        name: 'Lancaster Carving Limited',
        image: `${defaultMetadata.siteUrl}/logo.svg`,
        url: defaultMetadata.siteUrl,
        telephone: data.telephone || '',
        priceRange: '££-£££',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mold',
          addressRegion: 'Flintshire',
          addressCountry: 'GB',
        },
        geo: data.geo || {
          '@type': 'GeoCoordinates',
          latitude: data.latitude,
          longitude: data.longitude,
        },
        openingHoursSpecification: data.openingHours || [],
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
        name: data.name,
        description: data.description,
        image: data.images || [],
        sku: data.sku || data.id,
        brand: {
          '@type': 'Brand',
          name: 'Lancaster Carving Limited',
        },
        manufacturer: {
          '@type': 'Organization',
          name: 'Lancaster Carving Limited',
        },
        offers: {
          '@type': 'Offer',
          url: data.url || defaultMetadata.siteUrl,
          priceCurrency: 'GBP',
          price: data.price,
          priceValidUntil: data.priceValidUntil,
          itemCondition: 'https://schema.org/NewCondition',
          availability: data.availability || 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Lancaster Carving Limited',
          },
        },
        aggregateRating: data.aggregateRating ? {
          '@type': 'AggregateRating',
          ratingValue: data.aggregateRating.ratingValue,
          reviewCount: data.aggregateRating.reviewCount,
        } : undefined,
        review: data.reviews || [],
        ...data,
      };

    case 'creativework':
      return {
        ...baseData,
        '@type': 'CreativeWork',
        name: data.name,
        description: data.description,
        creator: {
          '@type': 'Organization',
          name: 'Lancaster Carving Limited',
        },
        image: data.images || [],
        dateCreated: data.dateCreated,
        material: data.material,
        artform: 'Wood Carving',
        ...data,
      };

    case 'service':
      return {
        ...baseData,
        '@type': 'Service',
        name: data.name || 'Custom Woodcarving Commission',
        description: data.description || 'Bespoke woodcarving and furniture commission service',
        provider: {
          '@type': 'Organization',
          name: 'Lancaster Carving Limited',
        },
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom',
        },
        serviceType: data.serviceType || 'Custom Woodcarving',
        ...data,
      };

    case 'breadcrumb':
      return {
        ...baseData,
        '@type': 'BreadcrumbList',
        itemListElement: data.items?.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${defaultMetadata.siteUrl}${item.url}`,
        })) || [],
      };

    case 'faqpage':
      return {
        ...baseData,
        '@type': 'FAQPage',
        mainEntity: data.faqs?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })) || [],
      };

    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        headline: data.headline || data.title,
        description: data.description,
        image: data.image || [],
        datePublished: data.datePublished,
        dateModified: data.dateModified || data.datePublished,
        author: {
          '@type': 'Organization',
          name: 'Lancaster Carving Limited',
        },
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
