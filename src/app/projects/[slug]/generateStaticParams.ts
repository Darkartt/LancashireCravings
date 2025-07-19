import { projects } from '@/lib/media-organized';

// This file exports generateStaticParams for the dynamic route
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
