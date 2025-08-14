Media Slices
============

Purpose: Provide optional, tiny per-scope data shards (by nature category or by project) that can be dynamically imported instead of the full `media-organized` dataset.

How it works
- Loader tries `import('./nature/<category>')` or `import('./projects/<id>')` first.
- If not found, it falls back to `media-organized` to preserve behavior.

Conventions
- File paths:
  - `src/lib/media-slices/nature/<category>.ts`
  - `src/lib/media-slices/projects/<projectId>.ts`
- Each file should export a default object matching the lightweight types in `media-types.ts`.

Example (nature category slice)
// src/lib/media-slices/nature/artistic.ts
import type { NatureCategory, MediaItem } from "../../media-types";

const items: MediaItem[] = [
  // Minimal representative entries only; add more as needed
];

const category: NatureCategory = {
  title: "Artistic & Creative",
  description: "Creative compositions and artistic nature photography",
  coverImage: "/media/nature/artistic/images/artistic_nature_001.jpeg",
  mediaFolder: "/media/nature/artistic",
  mediaCount: { images: items.filter(i=>i.type==='image').length, videos: items.filter(i=>i.type==='video').length },
  items
};

export default category;

Notes
- Start with the categories or projects used by the heaviest routes.
- Keep slices small; they should materially undercut the full dataset’s size.
