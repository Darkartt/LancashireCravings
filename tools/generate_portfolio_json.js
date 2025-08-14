// Generate a static JSON for curated data so static export can fetch it on GitHub Pages
const fs = require('node:fs');
const path = require('node:path');

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function titleCase(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
function relPortfolioSrc(projectFolder, mappingCuratedPath) {
  const normalized = mappingCuratedPath.replace(/\\/g, '/');
  const base = path.basename(normalized);
  return `/portfolio/${projectFolder}/${base}`;
}
function guessCategory(id) {
  if (/eagle/.test(id)) return 'wildlife';
  if (/nessie|loch|monster/.test(id)) return 'mythical';
  if (/st[- ]?collen/.test(id)) return 'religious';
  if (/bass|fish/.test(id)) return 'commissioned';
  return 'nature';
}

function buildCurated(rootDir) {
  const base = path.join(rootDir, 'public', 'portfolio');
  const projects = [];
  const items = [];
  if (!fs.existsSync(base)) return { projects, items };
  const entries = fs.readdirSync(base, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const dir = path.join(base, e.name);
    const mappingPath = path.join(dir, '_mapping.json');
    if (!fs.existsSync(mappingPath)) continue;
    const mapEntries = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    // cover image
    const finished = mapEntries.find((i) => /Finished_\d+/.test(i.label)) || mapEntries[0];
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
      mediaCount: { images: mapEntries.length, videos: 0 },
      featured: true,
    });
    // items
    for (let idx = 0; idx < mapEntries.length; idx++) {
      const m = mapEntries[idx];
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
        featured: /Finished_1$/.test(m.label),
      });
    }
  }
  return { projects, items };
}

function main() {
  const root = process.cwd();
  const { projects, items } = buildCurated(root);
  const natureCollection = {
    portfolio: {
      title: 'Portfolio',
      description: 'Curated Woodcarvings',
      coverImage: projects[0]?.coverImage || '',
      mediaFolder: '/portfolio',
      mediaCount: { images: items.length, videos: 0 },
      items,
    },
  };
  const outDir = path.join(root, 'public', 'api');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'portfolio.json');
  fs.writeFileSync(outFile, JSON.stringify({ projects, natureCollection }), 'utf-8');
  // Also write index.json under /api/portfolio/ for optional trailing-slash pathing
  const outDir2 = path.join(root, 'public', 'api', 'portfolio');
  if (!fs.existsSync(outDir2)) fs.mkdirSync(outDir2, { recursive: true });
  fs.writeFileSync(path.join(outDir2, 'index.json'), JSON.stringify({ projects, natureCollection }), 'utf-8');
  console.log(`Wrote static curated JSON to ${outFile} and /api/portfolio/index.json`);
}

main();
