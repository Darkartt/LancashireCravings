import type { Metadata } from "next";
import "./globals_new.css";
import { AnimationProvider } from "../components/AnimationProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import PageTransition from "../components/PageTransition";
import { generateMetadata, generateStructuredData, generateLocalBusinessSchema, generateFAQSchema } from "../lib/metadata";

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // For runtime, the middleware will provide the nonce via headers
  const nonce = '';

  const organizationSchema = generateStructuredData('organization', {});
  const websiteSchema = generateStructuredData('website', {});
  const localBusinessSchema = generateLocalBusinessSchema();
  const faqSchema = generateFAQSchema();
  
  return (
    <html lang="en">
      <head>
        {/* CSP fallback for static hosting (GH Pages); allows inline JSON-LD */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#732E1F" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Enhanced SEO meta tags */}
        <meta name="geo.region" content="GB-FLN" />
        <meta name="geo.placename" content="Mold, Flintshire, Wales" />
        <meta name="geo.position" content="53.1667;-3.1333" />
        <meta name="ICBM" content="53.1667, -3.1333" />
        <meta name="DC.title" content="Lancaster Carving Limited - Premium Custom Woodcarving" />
        <meta name="DC.creator" content="Christian James Lancaster" />
        <meta name="DC.subject" content="Custom Woodcarving, Bespoke Furniture, Mold, Wales" />
        <meta name="DC.description" content="Premium custom woodcarving and bespoke furniture craftsmanship in Mold, United Kingdom" />
        <meta name="DC.publisher" content="Lancaster Carving Limited" />
        <meta name="DC.contributor" content="Christian James Lancaster" />
        <meta name="DC.date" content="2024" />
        <meta name="DC.type" content="Service" />
        <meta name="DC.format" content="text/html" />
        <meta name="DC.identifier" content="https://exampledesign.co.uk" />
        <meta name="DC.language" content="en-GB" />
        <meta name="DC.coverage" content="United Kingdom" />
        <meta name="DC.rights" content="Copyright 2024 Lancaster Carving Limited" />
        
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          nonce={nonce}
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          nonce={nonce}
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          nonce={nonce}
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          nonce={nonce}
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <ErrorBoundary>
          <AnimationProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </AnimationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
