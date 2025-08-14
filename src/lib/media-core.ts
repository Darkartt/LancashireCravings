// Lightweight core media exports for initial bundle.
// Full heavy dataset is dynamically imported on demand.
import type { Project } from './media-organized';

export const coreProjects: Project[] = [
  {
    id: 'golden-eagle',
    title: 'Golden Eagle Masterpiece',
    slug: 'golden-eagle',
    description: 'Majestic golden eagle carving showcasing power and grace.',
    category: 'wildlife',
    coverImage: '/media/placeholder.jpg',
    mediaFolder: '/media/projects/golden-eagle',
    mediaCount: { images: 0, videos: 0 },
    featured: true,
    difficulty: 'expert',
    completionTime: '8 weeks',
    materials: ['Premium Hardwood'],
    tags: ['eagle','wildlife']
  }
];

export function getFeaturedProjectsLite() {
  return coreProjects.filter(p => p.featured);
}

export async function loadFullProjects(): Promise<typeof import('./media-organized')> {
  return import('./media-organized');
}
