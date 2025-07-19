// Enhanced Media Management System for Woodcarving Website
// Optimized for Lightning CSS + Next.js + Tailwind v4 performance

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  category: 'process' | 'finished' | 'workshop' | 'behind-scenes';
  project: string;
  filename?: string;
  order?: number;
  featured?: boolean;
  width?: number;
  height?: number;
  fileSize?: string;
  duration?: string; // For videos
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'wildlife' | 'mythical' | 'religious' | 'commissioned' | 'mixed';
  coverImage: string;
  coverVideo?: string;
  mediaFolder: string;
  mediaCount: {
    images: number;
    videos: number;
  };
  featured: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
  completionTime?: string;
  materials?: string[];
  client?: string;
  tags?: string[];
  slug: string;
}

// Project definitions based on actual media folder structure
export const projects: Project[] = [
  {
    id: 'golden-eagle',
    title: 'Golden Eagle Masterpiece',
    slug: 'golden-eagle',
    description: 'Majestic golden eagle carved with incredible detail, showcasing the power and grace of this magnificent bird of prey. Features intricate feather work and lifelike proportions.',
    category: 'wildlife',
    coverImage: '/media/Eagle/IMG_2056.JPG',
    coverVideo: '/media/Eagle/Golden eagle - By Christian Lancaster.MP4',
    mediaFolder: '/media/Eagle',
    mediaCount: { images: 48, videos: 3 },
    featured: true,
    difficulty: 'expert',
    completionTime: '6-8 weeks',
    materials: ['Premium Hardwood', 'Natural Wood Stain', 'Protective Finish'],
    tags: ['wildlife', 'eagle', 'detailed', 'masterpiece']
  },
  {
    id: 'loch-ness-monster',
    title: 'Nessie - Loch Ness Monster',
    slug: 'loch-ness-monster',
    description: 'Bringing the legendary creature of Scottish folklore to life through masterful woodcarving techniques. Captures the mysterious and elegant form of the mythical beast.',
    category: 'mythical',
    coverImage: '/media/Nessie/IMG_1498.JPG',
    mediaFolder: '/media/Nessie',
    mediaCount: { images: 39, videos: 0 },
    featured: true,
    difficulty: 'expert',
    completionTime: '4-6 weeks',
    materials: ['Hardwood', 'Natural Finish'],
    tags: ['mythical', 'nessie', 'scottish', 'legend']
  },
  {
    id: 'richard-peacock-bass',
    title: 'Richard Peacock Bass',
    slug: 'richard-peacock-bass',
    description: 'Commissioned bass carving featuring intricate scales and lifelike proportions, a testament to aquatic artistry. Custom piece showcasing detailed scale work and dynamic pose.',
    category: 'commissioned',
    coverImage: '/media/Richard Peacock Bass/IMG_1106.JPEG',
    coverVideo: '/media/Richard Peacock Bass/1080p.mov',
    mediaFolder: '/media/Richard Peacock Bass',
    mediaCount: { images: 45, videos: 15 },
    featured: true,
    difficulty: 'expert',
    client: 'Richard Peacock',
    completionTime: '8-10 weeks',
    materials: ['Premium Hardwood', 'Detailed Scale Work', 'Custom Finish'],
    tags: ['commissioned', 'bass', 'fish', 'scales', 'aquatic']
  },
  {
    id: 'st-collen-statue',
    title: 'St. Collen Statue',
    slug: 'st-collen-statue',
    description: 'Sacred religious statue carved with reverence and attention to spiritual detail, honoring Welsh patron saint. Features traditional religious iconography and ceremonial robes.',
    category: 'religious',
    coverImage: '/media/St Collen statue/IMG_0331.JPEG',
    coverVideo: '/media/St Collen statue/IMG_0364.MP4',
    mediaFolder: '/media/St Collen statue',
    mediaCount: { images: 75, videos: 75 },
    featured: true,
    difficulty: 'expert',
    completionTime: '12-16 weeks',
    materials: ['Sacred Wood', 'Religious Symbolism', 'Traditional Techniques'],
    tags: ['religious', 'saint', 'welsh', 'spiritual', 'traditional']
  },
  {
    id: 'butterflies-dragonflies-fish',
    title: 'Nature Collection: Butterflies, Dragonflies & Fish',
    slug: 'nature-collection',
    description: 'Delicate nature-inspired carvings capturing the essence of aquatic and flying creatures. A collection showcasing fine detail work and natural beauty.',
    category: 'wildlife',
    coverImage: '/media/1/iCloud Photos from Christian Lancaster/IMG_0010.JPEG',
    coverVideo: '/media/1/iCloud Photos from Christian Lancaster/Butterflies Dragonflies and fish - By Christian Lancaster.MP4',
    mediaFolder: '/media/1/iCloud Photos from Christian Lancaster',
    mediaCount: { images: 80, videos: 10 },
    featured: false,
    difficulty: 'intermediate',
    completionTime: '3-4 weeks per piece',
    materials: ['Fine Hardwood', 'Detail Carving Tools', 'Natural Finish'],
    tags: ['nature', 'butterflies', 'dragonflies', 'fish', 'collection']
  }
];

// Enhanced media generation with proper typing
export function getMediaItemsForProject(projectId: string): MediaItem[] {
  const project = getProjectById(projectId);
  if (!project) return [];

  const mediaItems: MediaItem[] = [];

  // Golden Eagle project - comprehensive media
  if (projectId === 'golden-eagle') {
    // Main process video
    mediaItems.push({
      id: 'eagle-main-video',
      type: 'video',
      src: '/media/Eagle/Golden eagle - By Christian Lancaster.MP4',
      alt: 'Golden Eagle carving time-lapse process - Complete transformation',
      category: 'process',
      project: projectId,
      featured: true,
      order: 0,
      duration: '5:30'
    });

    // Additional videos
    mediaItems.push({
      id: 'eagle-detail-video',
      type: 'video',
      src: '/media/Eagle/IMG_2703.mp4',
      alt: 'Golden Eagle - Detail carving process video',
      category: 'process',
      project: projectId,
      order: 1,
      duration: '2:15'
    });

    mediaItems.push({
      id: 'eagle-finishing-video',
      type: 'video',
      src: '/media/Eagle/IMG_2799.MOV',
      alt: 'Golden Eagle - Finishing techniques demonstration',
      category: 'process',
      project: projectId,
      order: 2,
      duration: '1:45'
    });

    // Comprehensive photo collection
    const eaglePhotos = [
      { file: 'IMG_2056.JPG', alt: 'Golden Eagle - Finished masterpiece front view', category: 'finished' as const, featured: true },
      { file: 'IMG_2063.JPG', alt: 'Golden Eagle - Wing detail showing feather texture', category: 'finished' as const },
      { file: 'IMG_2075.JPG', alt: 'Golden Eagle - Head detail with beak and eye work', category: 'finished' as const },
      { file: 'IMG_2089.JPG', alt: 'Golden Eagle - Side profile showing proportions', category: 'finished' as const },
      { file: 'IMG_2095.JPG', alt: 'Golden Eagle - Talon detail work', category: 'process' as const },
      { file: 'IMG_2130.JPG', alt: 'Golden Eagle - Initial rough carving stage', category: 'process' as const },
      { file: 'IMG_2255.JPG', alt: 'Golden Eagle - Wing carving progress', category: 'process' as const },
      { file: 'IMG_2256.JPG', alt: 'Golden Eagle - Body shaping phase', category: 'process' as const },
      { file: 'IMG_2261.JPG', alt: 'Golden Eagle - Feather detail work beginning', category: 'process' as const },
      { file: 'IMG_2284.JPG', alt: 'Golden Eagle - Head carving refinement', category: 'process' as const },
      { file: 'IMG_2285.JPG', alt: 'Golden Eagle - Beak detail carving', category: 'process' as const },
      { file: 'IMG_2286.JPG', alt: 'Golden Eagle - Eye area detailing', category: 'process' as const },
      { file: 'IMG_2287.JPG', alt: 'Golden Eagle - Face expression work', category: 'process' as const },
      { file: 'IMG_2294.JPG', alt: 'Golden Eagle - Overall form development', category: 'process' as const },
      { file: 'IMG_2297.JPG', alt: 'Golden Eagle - Wing positioning', category: 'process' as const },
      { file: 'IMG_2298.JPG', alt: 'Golden Eagle - Texture development', category: 'process' as const },
      { file: 'IMG_2443.JPG', alt: 'Golden Eagle - Advanced detailing phase', category: 'process' as const },
      { file: 'IMG_2444.JPG', alt: 'Golden Eagle - Feather texture refinement', category: 'process' as const },
      { file: 'IMG_2448.JPG', alt: 'Golden Eagle - Wing span work', category: 'process' as const },
      { file: 'IMG_2450.JPG', alt: 'Golden Eagle - Power pose development', category: 'process' as const },
      { file: 'IMG_2965.JPG', alt: 'Golden Eagle - Near completion stage', category: 'finished' as const },
      { file: 'IMG_3177.JPG', alt: 'Golden Eagle - Final detailing work', category: 'finished' as const },
      { file: 'IMG_3217.JPG', alt: 'Golden Eagle - Completed masterpiece', category: 'finished' as const, featured: true }
    ];

    eaglePhotos.forEach((photo, index) => {
      mediaItems.push({
        id: `eagle-img-${index}`,
        type: 'image',
        src: `/media/Eagle/${photo.file}`,
        alt: photo.alt,
        category: photo.category,
        project: projectId,
        featured: photo.featured || false,
        order: index + 3, // Offset by 3 for the videos
        filename: photo.file
      });
    });
  }

  // Nessie project - comprehensive collection
  if (projectId === 'loch-ness-monster') {
    const nessiePhotos = [
      { file: 'IMG_1498.JPG', alt: 'Nessie - Initial rough carving outline', category: 'process' as const },
      { file: 'IMG_1499.JPG', alt: 'Nessie - Basic form shaping', category: 'process' as const },
      { file: 'IMG_1500.JPG', alt: 'Nessie - Serpentine body development', category: 'process' as const },
      { file: 'IMG_1501.JPG', alt: 'Nessie - Head and neck carving', category: 'process' as const },
      { file: 'IMG_1504.JPG', alt: 'Nessie - Body curve refinement', category: 'process' as const },
      { file: 'IMG_1505.JPG', alt: 'Nessie - Scale texture beginning', category: 'process' as const },
      { file: 'IMG_1506.JPG', alt: 'Nessie - Facial features work', category: 'process' as const },
      { file: 'IMG_1507.JPG', alt: 'Nessie - Neck detail carving', category: 'process' as const },
      { file: 'IMG_1508.JPG', alt: 'Nessie - Body proportion checks', category: 'process' as const },
      { file: 'IMG_1509.JPG', alt: 'Nessie - Mythical character emerging', category: 'process' as const },
      { file: 'IMG_1510.JPG', alt: 'Nessie - Surface texture development', category: 'process' as const },
      { file: 'IMG_1515.JPG', alt: 'Nessie - Mid-stage carving progress', category: 'process' as const },
      { file: 'IMG_1520.JPG', alt: 'Nessie - Advanced detailing phase', category: 'process' as const },
      { file: 'IMG_1525.JPG', alt: 'Nessie - Finishing touches beginning', category: 'process' as const },
      { file: 'IMG_1555.JPG', alt: 'Nessie - Near completion', category: 'finished' as const },
      { file: 'IMG_1556.JPG', alt: 'Nessie - Final carved form', category: 'finished' as const, featured: true },
      { file: 'IMG_1557.JPG', alt: 'Nessie - Finished mythical creature side view', category: 'finished' as const },
      { file: 'IMG_1558.JPG', alt: 'Nessie - Completed Loch Ness Monster', category: 'finished' as const },
      { file: 'IMG_1559.JPG', alt: 'Nessie - Final masterpiece showcase', category: 'finished' as const, featured: true }
    ];

    nessiePhotos.forEach((photo, index) => {
      mediaItems.push({
        id: `nessie-img-${index}`,
        type: 'image',
        src: `/media/Nessie/${photo.file}`,
        alt: photo.alt,
        category: photo.category,
        project: projectId,
        featured: photo.featured || false,
        order: index,
        filename: photo.file
      });
    });
  }

  // Richard Peacock Bass project
  if (projectId === 'richard-peacock-bass') {
    // Main video
    mediaItems.push({
      id: 'bass-main-video',
      type: 'video',
      src: '/media/Richard Peacock Bass/1080p.mov',
      alt: 'Richard Peacock Bass - Carving process showcase',
      category: 'process',
      project: projectId,
      featured: true,
      order: 0,
      duration: '4:20'
    });

    // Sample photos (we'd need to scan the actual folder for complete list)
    const bassPhotos = [
      { file: 'IMG_1106.JPEG', alt: 'Richard Peacock Bass - Finished commission front view', category: 'finished' as const, featured: true },
      { file: 'IMG_1107.JPEG', alt: 'Richard Peacock Bass - Scale detail work', category: 'finished' as const },
      { file: 'IMG_1108.JPEG', alt: 'Richard Peacock Bass - Side profile showcase', category: 'finished' as const },
      { file: 'IMG_1109.JPEG', alt: 'Richard Peacock Bass - Fin detail carving', category: 'process' as const },
      { file: 'IMG_1110.JPEG', alt: 'Richard Peacock Bass - Body texture work', category: 'process' as const }
    ];

    bassPhotos.forEach((photo, index) => {
      mediaItems.push({
        id: `bass-img-${index}`,
        type: 'image',
        src: `/media/Richard Peacock Bass/${photo.file}`,
        alt: photo.alt,
        category: photo.category,
        project: projectId,
        featured: photo.featured || false,
        order: index + 1,
        filename: photo.file
      });
    });
  }

  // St. Collen Statue project
  if (projectId === 'st-collen-statue') {
    // Main video
    mediaItems.push({
      id: 'st-collen-video',
      type: 'video',
      src: '/media/St Collen statue/IMG_0364.MP4',
      alt: 'St. Collen Statue - Sacred carving process',
      category: 'process',
      project: projectId,
      featured: true,
      order: 0,
      duration: '3:45'
    });

    // Sample photos
    const saintPhotos = [
      { file: 'IMG_0331.JPEG', alt: 'St. Collen Statue - Sacred religious carving front view', category: 'finished' as const, featured: true },
      { file: 'IMG_0332.JPEG', alt: 'St. Collen Statue - Robes detail work', category: 'finished' as const },
      { file: 'IMG_0333.JPEG', alt: 'St. Collen Statue - Facial expression carving', category: 'process' as const },
      { file: 'IMG_0334.JPEG', alt: 'St. Collen Statue - Religious iconography detail', category: 'process' as const },
      { file: 'IMG_0335.JPEG', alt: 'St. Collen Statue - Traditional carving techniques', category: 'process' as const }
    ];

    saintPhotos.forEach((photo, index) => {
      mediaItems.push({
        id: `saint-img-${index}`,
        type: 'image',
        src: `/media/St Collen statue/${photo.file}`,
        alt: photo.alt,
        category: photo.category,
        project: projectId,
        featured: photo.featured || false,
        order: index + 1,
        filename: photo.file
      });
    });
  }

  // Nature Collection (Butterflies, Dragonflies, Fish)
  if (projectId === 'butterflies-dragonflies-fish') {
    // Main video
    mediaItems.push({
      id: 'nature-collection-video',
      type: 'video',
      src: '/media/1/iCloud Photos from Christian Lancaster/Butterflies Dragonflies and fish - By Christian Lancaster.MP4',
      alt: 'Nature Collection - Butterflies, Dragonflies and Fish carving showcase',
      category: 'process',
      project: projectId,
      featured: true,
      order: 0,
      duration: '6:15'
    });

    // Sample photos from the collection
    const naturePhotos = [
      { file: 'IMG_0010.JPEG', alt: 'Nature Collection - Delicate butterfly carving', category: 'finished' as const, featured: true },
      { file: 'IMG_0011.JPEG', alt: 'Nature Collection - Dragonfly wing detail', category: 'finished' as const },
      { file: 'IMG_0012.JPEG', alt: 'Nature Collection - Fish scale texture work', category: 'process' as const },
      { file: 'IMG_0013.JPEG', alt: 'Nature Collection - Multiple species showcase', category: 'finished' as const }
    ];

    naturePhotos.forEach((photo, index) => {
      mediaItems.push({
        id: `nature-img-${index}`,
        type: 'image',
        src: `/media/1/iCloud Photos from Christian Lancaster/${photo.file}`,
        alt: photo.alt,
        category: photo.category,
        project: projectId,
        featured: photo.featured || false,
        order: index + 1,
        filename: photo.file
      });
    });
  }

  return mediaItems.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Get all media items across all projects
export function getAllMediaItems(): MediaItem[] {
  const allItems: MediaItem[] = [];
  projects.forEach(project => {
    const projectMedia = getMediaItemsForProject(project.id);
    allItems.push(...projectMedia);
  });
  return allItems;
}

// Get featured media items
export function getFeaturedMediaItems(): MediaItem[] {
  return getAllMediaItems().filter(item => item.featured);
}

// Helper functions
export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  return projects.filter(p => p.category === category);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function searchProjects(query: string): Project[] {
  const searchTerm = query.toLowerCase();
  return projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.materials?.some(m => m.toLowerCase().includes(searchTerm)) ||
    p.tags?.some(t => t.toLowerCase().includes(searchTerm))
  );
}

// Media file utilities
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'];

export function getFileType(filename: string): 'image' | 'video' | 'unknown' {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  return 'unknown';
}

// Category mappings for UI
export const categoryDisplayNames = {
  wildlife: 'Wildlife Carvings',
  mythical: 'Mythical Creatures',
  religious: 'Religious Art',
  commissioned: 'Commissioned Works',
  mixed: 'Mixed Collections'
};

export const difficultyDisplayNames = {
  beginner: 'Beginner Friendly',
  intermediate: 'Intermediate Level',
  expert: 'Master Level'
};

// Performance optimization helpers
export function generateMediaUrl(project: string, filename: string): string {
  // In a full implementation, this would generate optimized URLs
  // For now, return the direct path
  return `/media/${project}/${filename}`;
}

export function getOptimizedImageProps(src: string, alt: string) {
  return {
    src,
    alt,
    loading: 'lazy' as const,
    quality: 85,
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/2gAMAwEAAhEDEQA/AKrqooooAKKKKAP/2Q=='
  };
}

// Helper function to get media items by category
export function getMediaItemsByCategory(category: MediaItem['category']): MediaItem[] {
  return getAllMediaItems().filter(item => item.category === category);
}

// Helper function to get media items by type
export function getMediaItemsByType(type: MediaItem['type']): MediaItem[] {
  return getAllMediaItems().filter(item => item.type === type);
}