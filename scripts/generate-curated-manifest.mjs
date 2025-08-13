#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const portfolioDir = path.join(root, 'public', 'portfolio');
const outDir = path.join(root, 'public');
const manifestPath = path.join(outDir, 'curated-manifest.json');

function relPortfolioSrc(projectFolder, curated) {
  const normalized = curated.replace(/\\/g, '/');
  const base = path.basename(normalized);
  return `/portfolio/${projectFolder}/${base}`;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function titleCase(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function guessCategory(id) {
  if (/eagle/.test(id)) return 'wildlife';
  if (/nessie|loch|monster/.test(id)) return 'mythical';
  if (/st[- ]?collen/.test(id)) return 'religious';
  if (/bass|fish/.test(id)) return 'commissioned';
  return 'nature';
}

function build() {
  if (!fs.existsSync(portfolioDir)) {
    fs.writeFileSync(manifestPath, JSON.stringify({ projects: [], items: [] }, null, 2));
    return;
  }
  const projects = [];
  const items = [];
  const entries = fs.readdirSync(portfolioDir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(portfolioDir, e.name);
    const mappingPath = path.join(dir, '_mapping.json');
    if (!fs.existsSync(mappingPath)) continue;
    const map = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    const finished = map.find(i => /Finished_\d+/.test(i.label)) || map[0];
    const coverImage = finished ? relPortfolioSrc(e.name, finished.curated) : '';
    const id = slugify(e.name);
    projects.push({
      id,
      title: titleCase(e.name),
      slug: id,
      description: `${titleCase(e.name)} curated portfolio`,
      category: guessCategory(id),
      coverImage,
      mediaFolder: `/portfolio/${e.name}`,
      mediaCount: { images: map.length, videos: 0 },
      featured: true
    });
    map.forEach((m, idx) => {
      const src = relPortfolioSrc(e.name, m.curated);
      items.push({
        id: `${id}-${idx + 1}`,
        type: 'image',
        src,
        alt: `${titleCase(e.name)} - ${m.label}`,
        category: m.label.startsWith('Finished') || m.label.startsWith('Detail') ? 'final' : 'process',
        project: id,
        filename: path.basename(src),
        order: idx + 1,
        featured: /Finished_1$/.test(m.label)
      });
    });
  }
  fs.writeFileSync(manifestPath, JSON.stringify({ projects, items }, null, 2));
}

build();
console.log(`Wrote ${manifestPath}`);
