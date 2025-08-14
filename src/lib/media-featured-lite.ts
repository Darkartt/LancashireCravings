import type { MediaItem } from './media-organized';

// Lightweight subset for bundle analysis to decouple from giant dataset during optimization work.
export const featuredMedia: MediaItem[] = [
  {
    id: 'lite-placeholder-hero',
    type: 'image',
    src: '/media/placeholder.jpg',
    alt: 'Showcase placeholder craftsmanship image',
    category: 'process',
    project: 'minimal',
    featured: true,
    subject: 'placeholder'
  }
];

export function getFeaturedProjectsLite(): MediaItem[] {
  return featuredMedia;
}
