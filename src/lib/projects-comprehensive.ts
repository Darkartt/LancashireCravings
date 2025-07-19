// Extended project definitions for comprehensive media system
import { Project } from '@/lib/media-organized';

export const comprehensiveProjects: Project[] = [
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
      images: 51,
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
      images: 39,
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
      images: 55,
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
    coverImage: '/media/St Collen statue/IMG_0001.JPG',
    mediaFolder: '/media/St Collen statue',
    difficulty: 'expert',
    materials: ['Oak', 'Limewood'],
    completionTime: '12 weeks',
    mediaCount: {
      images: 150,
      videos: 5
    }
  },
  {
    id: 'nature-collection',
    title: 'Butterflies, Dragonflies & Fish',
    slug: 'nature-collection',
    description: 'Delicate nature studies showcasing intricate detail work',
    category: 'nature',
    featured: true,
    coverImage: '/media/1/iCloud Photos from Christian Lancaster/IMG_3296.JPEG',
    coverVideo: '/media/1/iCloud Photos from Christian Lancaster/Butterflies Dragonflies and fish - By Christian Lancaster.MP4',
    mediaFolder: '/media/1/iCloud Photos from Christian Lancaster',
    difficulty: 'intermediate',
    materials: ['Various Hardwoods'],
    completionTime: 'Ongoing',
    mediaCount: {
      images: 85,
      videos: 25
    }
  },
  {
    id: 'workshop',
    title: 'Workshop & Techniques',
    slug: 'workshop',
    description: 'Behind-the-scenes documentation of methods and artistic process',
    category: 'workshop',
    featured: false,
    coverImage: '/media/2/iCloud Photos from Christian Lancaster/IMG_1857.JPG',
    coverVideo: '/media/2/iCloud Photos from Christian Lancaster/My painting\'s acrylic on canvas - By Christian Lancaster.MP4',
    mediaFolder: '/media/2/iCloud Photos from Christian Lancaster',
    difficulty: 'intermediate',
    materials: ['Various'],
    completionTime: 'Ongoing',
    mediaCount: {
      images: 45,
      videos: 15
    }
  },
  {
    id: 'master-craftsman',
    title: 'Master Craftsman Collection',
    slug: 'master-craftsman',
    description: 'Comprehensive documentation of artistry and workshop environment',
    category: 'nature',
    featured: false,
    coverImage: '/media/iCloud Photos from Christian Lancaster/iCloud Photos from Christian Lancaster/IMG_0478.JPG',
    mediaFolder: '/media/iCloud Photos from Christian Lancaster/iCloud Photos from Christian Lancaster',
    difficulty: 'expert',
    materials: ['All Woods'],
    completionTime: 'Career Spanning',
    mediaCount: {
      images: 140,
      videos: 10
    }
  }
];

export function getComprehensiveProject(id: string): Project | undefined {
  return comprehensiveProjects.find(project => project.id === id);
}

export function getFeaturedComprehensiveProjects(): Project[] {
  return comprehensiveProjects.filter(project => project.featured);
}

export function getAllComprehensiveProjects(): Project[] {
  return comprehensiveProjects;
}
