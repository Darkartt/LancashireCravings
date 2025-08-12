// Lightweight shared media types (extracted from large media-organized dataset)
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  category: 'process' | 'final' | 'workshop' | 'behind-scenes' | 'timelapse' | 'tools' | 'techniques' | 'environment';
  project: string;
  filename?: string;
  order?: number;
  featured?: boolean;
  width?: number;
  height?: number;
  fileSize?: string;
  duration?: string;
  subject?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'wildlife' | 'mythical' | 'religious' | 'commissioned' | 'workshop' | 'nature';
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

export interface NatureCategory {
  title: string;
  description: string;
  coverImage: string;
  mediaFolder: string;
  mediaCount: {
    images: number;
    videos: number;
  };
  items: MediaItem[];
}
