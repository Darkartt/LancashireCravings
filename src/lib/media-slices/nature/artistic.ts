import type { NatureCategory, MediaItem } from "../../media-types";

// Minimal pilot slice for the 'artistic' nature category.
// Add more entries over time; this is purely illustrative and safe to remove or expand.
const items: MediaItem[] = [
  {
    id: "artistic-image-001",
    type: "image",
    src: "/media/nature/artistic/images/artistic_nature_001.jpeg",
    alt: "Artistic Nature - nature finished piece",
    category: "final",
    project: "artistic",
    filename: "artistic_nature_001.jpeg",
    order: 1,
    featured: true,
    subject: "nature"
  }
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
