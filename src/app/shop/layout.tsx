import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Shop',
  description: 'Browse our collection of handcrafted wooden products. From decorative bowls to functional furniture, each piece is crafted with premium materials and expert craftsmanship.',
  keywords: [
    'buy wooden products',
    'handcrafted furniture',
    'wooden bowls',
    'cutting boards',
    'custom woodwork shop',
    'artisan wood products',
    'oak furniture',
    'walnut decor',
  ],
  ogImage: '/shop-og.jpg',
  canonicalUrl: '/shop',
});

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
