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
  // Server: read curated directly to avoid client bundling
  if (typeof window === 'undefined') {
    try {
      const { getCuratedProjects, getCuratedMediaItems } = await import('./media-curated');
      const rootDir = process.cwd();
      const curatedProjects = getCuratedProjects(rootDir);
      const curatedItems = getCuratedMediaItems(rootDir);
      if (curatedProjects.length > 0 && curatedItems.length > 0) {
        const curatedNature: Record<string, NatureCategory> = {
          portfolio: {
            title: 'Portfolio',
            description: 'Curated Woodcarvings',
            coverImage: curatedProjects[0]?.coverImage || '',
            mediaFolder: '/portfolio',
            mediaCount: { images: curatedItems.length, videos: 0 },
            items: curatedItems
          }
        } as Record<string, NatureCategory>;
        return {
          projects: curatedProjects,
          natureCollection: curatedNature,
          getAllMediaItems: () => curatedItems,
          getFeaturedProjects: () => curatedProjects
        };
      }
    } catch {
      // fall through to dataset
    }
  } else {
    // Client: fetch curated via API to avoid bundling fs
    try {
      const res = await fetch('/api/portfolio/', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const projects = (data.projects || []) as Project[];
        const natureCollection = (data.natureCollection || {}) as Record<string, NatureCategory>;
        if (projects.length) {
          const allItems = Object.values(natureCollection).flatMap(n => n.items);
          return {
            projects,
            natureCollection,
            getAllMediaItems: () => allItems,
            getFeaturedProjects: () => projects
          };
        }
      }
    } catch {
      // ignore and fall back
    }
  }

  // Fallback: import generated dataset
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

// Convenience: load all media items lazily
export async function loadAllMediaItems(): Promise<MediaItem[]> {
  const { natureCollection } = await loadMediaData();
  return Object.values(natureCollection).flatMap(n => n.items);
}

// Convenience: load media items for one project lazily
export async function loadMediaItemsForProject(projectId: string): Promise<MediaItem[]> {
  const { natureCollection } = await loadMediaData();
  const all = Object.values(natureCollection).flatMap(n => n.items);
  return all.filter(i => i.project === projectId || i.project === projectId.toLowerCase());
}

// Convenience: load featured projects lazily
export async function loadFeaturedProjects(): Promise<Project[]> {
  const mod = await import('./media-organized');
  const fn = (mod as any).getFeaturedProjects as () => Project[];
  return fn ? fn() : [];
}

// Slice-aware loaders (non-breaking):
// Try importing tiny slices from src/lib/media-slices first; fall back to full dataset.

/** Attempt to load a single nature category slice by key (e.g., 'artistic'). */
export async function loadNatureCategorySlice(key: string): Promise<NatureCategory | null> {
  try {
    const mod = await import(`./media-slices/nature/${key}`);
    return (mod as any).default as NatureCategory;
  } catch {
    return null;
  }
}

/** Attempt to load a single project slice by id (e.g., 'golden-eagle'). */
export async function loadProjectSlice(id: string): Promise<Project | null> {
  try {
    const mod = await import(`./media-slices/projects/${id}`);
    return (mod as any).default as Project;
  } catch {
    return null;
  }
}

/** Unified helper that prefers slice and falls back to the full dataset for a nature category. */
export async function loadNatureCategory(key: string): Promise<NatureCategory | undefined> {
  const slice = await loadNatureCategorySlice(key);
  if (slice) return slice;
  const { natureCollection } = await loadMediaData();
  return natureCollection[key];
}

/** Unified helper that prefers slice and falls back to the full dataset for a project by id or slug. */
export async function loadProjectByIdOrSlug(idOrSlug: string): Promise<Project | undefined> {
  const slice = await loadProjectSlice(idOrSlug);
  if (slice) return slice;
  const { projects } = await loadMediaData();
  return projects.find(p => p.id === idOrSlug || p.slug === idOrSlug);
}
