// Real Projects System - Uses actual media counts from directory audit
// This file contains project definitions with correct media counts

import { Project } from '@/lib/media-organized';
import { getRealMediaStats } from '@/lib/media-real';

export const realProjects: Project[] = [
  {
    id: 'golden-eagle',
    title: 'Golden Eagle',
    slug: 'golden-eagle',
    description: 'Majestic wildlife sculpture capturing the power and grace of nature\'s apex predator',
    category: 'wildlife',
    featured: true,
    coverImage: '/media/Eagle/IMG_3217.JPG',
    coverVideo: '/media/Eagle/Golden eagle - By Christian Lancaster.MP4',
    mediaFolder: '/media/Eagle',
    difficulty: 'expert',
    materials: ['Oak', 'Cherry'],
    completionTime: '8 weeks',
    mediaCount: {
      images: 51, // From actual file count
      videos: 3
    }
  },
  {
    id: 'nessie',
    title: 'Loch Ness Monster',
    slug: 'nessie',
    description: 'Mythical creature brought to life through masterful woodcarving artistry',
    category: 'mythical',
    featured: true,
    coverImage: '/media/Nessie/IMG_1559.JPG',
    mediaFolder: '/media/Nessie',
    difficulty: 'expert',
    materials: ['Walnut', 'Oak'],
    completionTime: '6 weeks',
    mediaCount: {
      images: 62, // From actual file count (IMG_1498 to IMG_1559)
      videos: 0
    }
  },
  {
    id: 'richard-peacock-bass',
    title: 'Richard Peacock Bass',
    slug: 'richard-peacock-bass',
    description: 'Custom commission capturing the essence of angling passion',
    category: 'commissioned',
    featured: true,
    coverImage: '/media/Richard Peacock Bass/IMG_1344.JPG',
    mediaFolder: '/media/Richard Peacock Bass',
    difficulty: 'expert',
    materials: ['Cherry', 'Walnut'],
    completionTime: '10 weeks',
    client: 'Richard Peacock',
    mediaCount: {
      images: 29, // From actual file count
      videos: 10
    }
  },
  {
    id: 'st-collen-statue',
    title: 'St. Collen Statue',
    slug: 'st-collen-statue',
    description: 'Sacred religious sculpture showcasing traditional craftsmanship',
    category: 'religious',
    featured: true,
    coverImage: '/media/St Collen statue/IMG_0331.JPEG',
    mediaFolder: '/media/St Collen statue',
    difficulty: 'expert',
    materials: ['Oak', 'Limewood'],
    completionTime: '12 weeks',
    mediaCount: {
      images: 76, // From actual file count - 152 total files (76 images + 76 videos)
      videos: 76
    }
  }
];

// Get all real projects
export function getAllRealProjects(): Project[] {
  return realProjects;
}

// Get featured real projects
export function getFeaturedRealProjects(): Project[] {
  return realProjects.filter(project => project.featured);
}

// Get real project by ID
export function getRealProjectById(id: string): Project | undefined {
  return realProjects.find(project => project.id === id);
}

// Get real project by slug
export function getRealProjectBySlug(slug: string): Project | undefined {
  return realProjects.find(project => project.slug === slug);
}

// Get real project statistics
export function getRealProjectStats(): {
  totalProjects: number;
  featuredProjects: number;
  totalMedia: number;
  categories: string[];
} {
  const stats = getRealMediaStats();
  const categories = [...new Set(realProjects.map(p => p.category))];
  
  return {
    totalProjects: realProjects.length,
    featuredProjects: realProjects.filter(p => p.featured).length,
    totalMedia: stats.totalFiles,
    categories
  };
}
