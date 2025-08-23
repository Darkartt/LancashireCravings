import type { Project, MediaItem } from './media-types';

// Build curated projects from public/portfolio/<project> folder using _mapping.json
export function getCuratedProjects(rootDir: string): Project[] {
  // Use eval to avoid static require lint, still server-only
  const path: typeof import('node:path') = (eval('require'))('node:path');
  const fs: typeof import('node:fs') = (eval('require'))('node:fs');
  const base = path.join(rootDir, 'public', 'portfolio');
  if (!fs.existsSync(base)) return [];
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const projects: Project[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(base, e.name);
    const mappingPath = path.join(dir, '_mapping.json');
    if (!fs.existsSync(mappingPath)) continue;
  const items: { label: string; curated: string }[] = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  // derive cover image as first Finished_* if present, else first item
  const finished = items.find(i => /Finished_\d+/.test(i.label)) || items[0];
  const coverImage = finished ? relPortfolioSrc(e.name, finished.curated) : '';
    const id = slugify(e.name);
    const project: Project = {
      id,
      title: titleCase(e.name),
      slug: id,
      description: `${titleCase(e.name)} curated portfolio`,
      category: guessCategory(id),
      coverImage,
  mediaFolder: `/portfolio/${e.name}`,
      mediaCount: { images: items.length, videos: 0 },
      featured: true
    };
    projects.push(project);
  }
  return projects;
}

export function getCuratedMediaItems(rootDir: string): MediaItem[] {
  const path: typeof import('node:path') = (eval('require'))('node:path');
  const fs: typeof import('node:fs') = (eval('require'))('node:fs');
  const base = path.join(rootDir, 'public', 'portfolio');
  if (!fs.existsSync(base)) return [];
  const items: MediaItem[] = [];
  const entries = fs.readdirSync(base, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(base, e.name);
    const mappingPath = path.join(dir, '_mapping.json');
    if (!fs.existsSync(mappingPath)) continue;
    const mapEntries: { label: string; curated: string }[] = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    for (let idx = 0; idx < mapEntries.length; idx++) {
      const m = mapEntries[idx];
      const src = relPortfolioSrc(e.name, m.curated);
      items.push({
        id: `${slugify(e.name)}-${idx + 1}`,
        type: 'image',
        src,
        alt: `${titleCase(e.name)} - ${m.label}`,
        category: m.label.startsWith('Finished') || m.label.startsWith('Detail') ? 'final' : 'process',
        project: slugify(e.name),
        filename: path.basename(src),
        order: idx + 1,
        featured: /Finished_1$/.test(m.label)
      });
    }
  }
  return items;
}

function relPortfolioSrc(projectFolder: string, mappingCuratedPath: string): string {
  // mapping curated path to public path: '/portfolio/<project>/<basename>'
  const path: typeof import('node:path') = (eval('require'))('node:path');
  const normalized = mappingCuratedPath.replace(/\\/g, '/');
  const base = path.basename(normalized);
  return `/portfolio/${projectFolder}/${base}`;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function titleCase(s: string): string {
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function guessCategory(id: string): Project['category'] {
  if (/eagle|owl|squirrel|crow|dog/.test(id)) return 'wildlife';
  if (/nessie|loch|monster/.test(id)) return 'mythical';
  if (/st[- ]?collen/.test(id)) return 'religious';
  if (/bass|fish/.test(id)) return 'commissioned';
  if (/display/.test(id)) return 'workshop';
  if (/bee/.test(id)) return 'nature';
  return 'nature';
}
