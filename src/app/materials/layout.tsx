import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Premium Materials & Sustainability',
  description: 'Learn about our sustainably sourced hardwoods and expert finishing techniques. We use only FSC certified materials and follow eco-friendly practices in all our craftsmanship.',
  keywords: [
    'sustainable wood',
    'FSC certified hardwood',
    'wood species guide',
    'eco-friendly woodworking',
    'premium materials',
    'wood finishes',
    'sustainable craftsmanship',
    'responsible sourcing',
  ],
  ogImage: '/materials-og.jpg',
  canonicalUrl: '/materials',
});

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
