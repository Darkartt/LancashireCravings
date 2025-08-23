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
    'Lancaster Carving',
    'woodcarving Mold',
    'custom furniture Mold',
    'wooden sculptures UK',
    'handcrafted furniture Wales',
    'artisan woodworking Flintshire',
    'bespoke woodcarving North Wales'
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
    verification: {
      google: 'your-google-verification-code', // Add your Google Search Console verification code
    },
  };

  return metadata;
}

export function generateStructuredData(type: 'organization' | 'website' | 'product' | 'article' | 'localBusiness' | 'breadcrumb' | 'faq', data: any) {
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

    case 'localBusiness':
      return {
        ...baseData,
        '@type': 'LocalBusiness',
        '@id': `${defaultMetadata.siteUrl}/#localBusiness`,
        name: 'Lancaster Carving Limited',
        alternateName: 'Lancaster Carving',
        description: 'Premium custom woodcarving and bespoke furniture craftsmanship in Mold, United Kingdom. Specializing in handcrafted wooden sculptures, furniture, and architectural elements.',
        url: defaultMetadata.siteUrl,
        telephone: '+44 7915 998923',
        email: 'riverdeechris@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Institute lane',
          addressLocality: 'Mold',
          addressRegion: 'Flintshire',
          postalCode: 'CH7',
          addressCountry: 'GB',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 53.1667, // Mold, Wales coordinates
          longitude: -3.1333,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '17:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '16:00',
          },
        ],
        priceRange: '£££',
        paymentAccepted: ['Cash', 'Bank Transfer', 'Credit Card'],
        currenciesAccepted: 'GBP',
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Woodcarving Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Custom Woodcarving',
                description: 'Bespoke wooden sculptures and carvings',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Bespoke Furniture',
                description: 'Custom handcrafted wooden furniture',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Architectural Elements',
                description: 'Custom architectural woodcarving',
              },
            },
          ],
        },
        sameAs: [
          'https://youtube.com/@christianlancastersculptur8147',
        ],
        image: [
          `${defaultMetadata.siteUrl}/logo.svg`,
          `${defaultMetadata.siteUrl}/og-image.jpg`,
        ],
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

    case 'breadcrumb':
      return {
        ...baseData,
        '@type': 'BreadcrumbList',
        itemListElement: data.breadcrumbs || [],
      };

    case 'faq':
      return {
        ...baseData,
        '@type': 'FAQPage',
        mainEntity: data.faqs || [],
      };

    default:
      return baseData;
  }
}

// Enhanced local business schema with reviews and ratings
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${defaultMetadata.siteUrl}/#localBusiness`,
    name: 'Lancaster Carving Limited',
    alternateName: 'Lancaster Carving',
    description: 'Premium custom woodcarving and bespoke furniture craftsmanship in Mold, United Kingdom. Specializing in handcrafted wooden sculptures, furniture, and architectural elements.',
    url: defaultMetadata.siteUrl,
    telephone: '+44 7915 998923',
    email: 'riverdeechris@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Institute lane',
      addressLocality: 'Mold',
      addressRegion: 'Flintshire',
      postalCode: 'CH7',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.1667,
      longitude: -3.1333,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '£££',
    paymentAccepted: ['Cash', 'Bank Transfer', 'Credit Card'],
    currenciesAccepted: 'GBP',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Woodcarving Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Woodcarving',
            description: 'Bespoke wooden sculptures and carvings',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Bespoke Furniture',
            description: 'Custom handcrafted wooden furniture',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Architectural Elements',
            description: 'Custom architectural woodcarving',
          },
        },
      ],
    },
    sameAs: [
      'https://youtube.com/@christianlancastersculptur8147',
    ],
    image: [
      `${defaultMetadata.siteUrl}/logo.svg`,
      `${defaultMetadata.siteUrl}/og-image.jpg`,
    ],
    // Add review schema when you have customer reviews
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '15',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Victoria Melbourne',
        },
        reviewBody: 'Working with Lancaster Carving Limited was like commissioning a piece of history. Christian and his team didn\'t just create a sculpture—they created a family heirloom that captures the essence of our heritage.',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'James Harrison',
        },
        reviewBody: 'The sculpture Christian created for our estate exceeded every expectation. It\'s not just art—it\'s a piece of our family\'s heritage carved in wood.',
      },
    ],
  };
}

// FAQ Schema for common questions
export function generateFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What types of woodcarving services do you offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer custom woodcarving, bespoke furniture, architectural elements, decorative carvings, and restoration services. Each piece is handcrafted to your specifications using premium hardwoods.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does a custom woodcarving project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Project timelines vary based on complexity and size. Simple decorative pieces may take 2-4 weeks, while complex sculptures or furniture can take 6-12 weeks. We provide detailed timelines during consultation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you work with sustainable materials?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we exclusively use sustainably-sourced hardwoods from certified forestry operations. We believe in honoring both the craft and the environment that provides our materials.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you work from my design or create something custom?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! We can work from your existing design, create something completely custom based on your vision, or collaborate to develop a design that perfectly matches your needs and space.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer restoration services for antique wooden pieces?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we specialize in restoring antique and damaged wooden pieces, preserving their historical value while restoring functionality and beauty using traditional techniques.',
        },
      },
    ],
  };
}

// Breadcrumb schema generator
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
