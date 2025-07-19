import type { Metadata } from "next";
import "./globals.css";
import { AnimationProvider } from "../components/AnimationProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import HydrationSuppressor from "../components/HydrationSuppressor";
import PageTransition from "../components/PageTransition";
import { generateMetadata, generateStructuredData } from "../lib/metadata";

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateStructuredData('organization', {});
  const websiteSchema = generateStructuredData('website', {});
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#732E1F" />
        <meta name="color-scheme" content="light dark" />
        <script
          type="application/ld+json"
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link
          rel="preload"
          href="/logo.svg"
          as="image"
          type="image/svg+xml"
        />
      </head><body className="antialiased" suppressHydrationWarning={true}>
        <ErrorBoundary>
          <HydrationSuppressor>
            <AnimationProvider>
              <PageTransition>
                {children}
              </PageTransition>
            </AnimationProvider>
          </HydrationSuppressor>
        </ErrorBoundary>
      </body>
    </html>
  );
}
