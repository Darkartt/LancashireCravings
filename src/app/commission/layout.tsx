import { Metadata } from 'next';
import { generateMetadata, generateStructuredData } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Commission a Custom Piece',
  description: 'Request a bespoke woodcarving commission. Our expert craftsmen create custom furniture, sculptures, and architectural elements tailored to your vision. Get a personalized quote today.',
  keywords: [
    'commission woodcarving',
    'custom furniture order',
    'bespoke sculpture',
    'personalized woodwork',
    'custom commission request',
    'made to order furniture',
    'artisan commission',
  ],
  ogImage: '/commission-og.jpg',
  canonicalUrl: '/commission',
});

// Generate service schema for commission service
const serviceSchema = generateStructuredData('service', {
  name: 'Custom Woodcarving Commission',
  description: 'Bespoke woodcarving and furniture commission service. We create custom pieces tailored to your specifications, from initial consultation to final delivery.',
  serviceType: 'Custom Manufacturing',
});

export default function CommissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
