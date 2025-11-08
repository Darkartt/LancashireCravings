import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Portfolio & Projects',
  description: 'Explore our portfolio of custom woodcarving projects. From wildlife sculptures to architectural elements, see examples of our finest craftsmanship and artistic expertise.',
  keywords: [
    'woodcarving portfolio',
    'custom sculpture gallery',
    'wood art projects',
    'wildlife carvings',
    'architectural woodwork',
    'commission examples',
    'artisan portfolio',
  ],
  ogImage: '/projects-og.jpg',
  canonicalUrl: '/projects',
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
