// Dynamic loader for heavy media-organized dataset
// Usage: const { projects, natureCollection } = await loadMediaData();
import type { Project, NatureCategory, MediaItem } from './media-types';

export interface MediaDataExport {
  projects: Project[];
  natureCollection: Record<string, NatureCategory>;
  getAllMediaItems?: () => MediaItem[];
  getFeaturedProjects?: () => Project[];
}

export async function loadMediaData(): Promise<MediaDataExport> {
  // Dynamic import so the large dataset isn't in the main bundle
  const mod = await import('./media-organized');
  return {
    projects: (mod as any).projects as Project[],
    natureCollection: (mod as any).natureCollection as Record<string, NatureCategory>,
    getAllMediaItems: (mod as any).getAllMediaItems,
    getFeaturedProjects: (mod as any).getFeaturedProjects
  };
}

// Helper to lazily fetch a single project by slug
export async function loadProject(slug: string): Promise<Project | undefined> {
  const { projects } = await loadMediaData();
  return projects.find(p => p.slug === slug);
}

// Helper to search media items lazily (example)
export async function searchMedia(predicate: (item: MediaItem) => boolean): Promise<MediaItem[]> {
  const { natureCollection } = await loadMediaData();
  const items: MediaItem[] = [];
  for (const key of Object.keys(natureCollection)) {
    items.push(...natureCollection[key].items.filter(predicate));
  }
  return items;
}
