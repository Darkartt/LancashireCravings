import type { Project } from "../../media-types";

const project: Project = {
  id: "golden-eagle",
  title: "Golden Eagle Masterpiece",
  slug: "golden-eagle",
  description: "Majestic golden eagle carving showcasing power and grace.",
  category: "wildlife",
  coverImage: "/media/placeholder.jpg",
  mediaFolder: "/media/projects/golden-eagle",
  mediaCount: { images: 0, videos: 0 },
  featured: true,
  difficulty: "expert",
  completionTime: "8 weeks",
  materials: ["Premium Hardwood"],
  tags: ["eagle", "wildlife"]
};

export default project;
