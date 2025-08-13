import { NextResponse } from 'next/server';
import type { Project, NatureCategory, MediaItem } from '@/lib/media-types';

// GET /api/portfolio
export async function GET() {
  try {
    const { getCuratedProjects, getCuratedMediaItems } = await import('@/lib/media-curated');
    const rootDir = process.cwd();
    const projects: Project[] = getCuratedProjects(rootDir);
    const items: MediaItem[] = getCuratedMediaItems(rootDir);
    const natureCollection: Record<string, NatureCategory> = {
      portfolio: {
        title: 'Portfolio',
        description: 'Curated Woodcarvings',
        coverImage: projects[0]?.coverImage || '',
        mediaFolder: '/portfolio',
        mediaCount: { images: items.length, videos: 0 },
        items
      }
    } as Record<string, NatureCategory>;

    return NextResponse.json({ projects, natureCollection });
  } catch (err) {
    return NextResponse.json({ projects: [], natureCollection: {} }, { status: 200 });
  }
}
