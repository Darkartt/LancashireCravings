import { loadMediaData } from '@/lib/media-loader';
import ProjectPageClient from './ProjectPageClient';

export const dynamic = 'error';
export const revalidate = false;

export async function generateStaticParams() {
  // Use curated-manifest during export; fallback to loadMediaData on dev
  try {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const manifestPath = path.join(process.cwd(), 'public', 'curated-manifest.json');
    if (fs.existsSync(manifestPath)) {
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      const projects = (data.projects || []) as Array<{ slug: string }>;
      return projects.map((p) => ({ slug: p.slug }));
    }
  } catch {}
  const { projects } = await loadMediaData();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  // Render a thin server component that hydrates a client component
  const { slug } = await params;
  return <ProjectPageClient slug={slug} />;
}
