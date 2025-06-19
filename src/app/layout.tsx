import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { AnimationProvider } from "../components/AnimationProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import HydrationSuppressor from "../components/HydrationSuppressor";
import { generateMetadata, generateStructuredData } from "../lib/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateStructuredData('organization', {});
  const websiteSchema = generateStructuredData('website', {});
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />        <link rel="manifest" href="/manifest.json" />        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#732E1F" />
        <meta name="color-scheme" content="light dark" />
          {/* Script for GitHub Pages SPA routing */}
        <script 
          src="/spa-redirect.js"
          async
        ></script>
          {/* Structured Data */}
        <script
          type="application/ld+json"
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />        <script
          type="application/ld+json"
          async
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />        <link
          rel="preload"
          href="/fonts/lora-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
          {/* Script for GitHub Pages SPA routing */}
        <script 
          async
          dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // If this is a redirect from a 404 page, restore the URL
              var redirect = sessionStorage.redirect;
              delete sessionStorage.redirect;
              if (redirect && redirect !== window.location.href) {
                history.replaceState(null, null, redirect);
              }
            })();
          `
        }} />
      </head><body className="antialiased">
        <ErrorBoundary>
          <HydrationSuppressor>
            <AnimationProvider>
              {children}
            </AnimationProvider>
          </HydrationSuppressor>
        </ErrorBoundary>
      </body>
    </html>
  );
}
