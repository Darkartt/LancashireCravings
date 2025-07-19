# Media Integration System - User Guide

## 🚀 Quick Start

The new media integration system is now live! Here's how to use and extend it:

## 📁 File Structure Created

```
src/
├── lib/
│   └── media-new.ts           # Media management system & data
├── components/
│   ├── ModernMediaGallery.tsx # Full-featured gallery with filtering
│   ├── MediaGallery.tsx       # Simple gallery component
│   ├── MediaCard.tsx          # Individual media item display
│   ├── ProjectCard.tsx        # Project showcase cards
│   └── WorkshopShowcase.tsx   # Workshop/behind-scenes content
├── app/
│   └── gallery/
│       ├── page.tsx           # New active gallery page
│       └── page-old.tsx       # Original gallery backup
```

## 🎯 How to Use the Components

### 1. ModernMediaGallery (Full-Featured)
```tsx
import ModernMediaGallery from '@/components/ModernMediaGallery';
import { getAllMediaItems, projects } from '@/lib/media-new';

const allMedia = getAllMediaItems();

<ModernMediaGallery 
  items={allMedia}
  projects={projects}
  showFilters={true}
  columns={3}
  className="my-gallery"
/>
```

**Features:**
- Category filtering (process, finished, workshop, behind-scenes)
- Project filtering (eagle, nessie, bass, etc.)
- Lightbox modal with video controls
- Responsive grid (2, 3, or 4 columns)
- Framer Motion animations

### 2. MediaGallery (Simple)
```tsx
import MediaGallery from '@/components/MediaGallery';
import { getMediaItemsForProject } from '@/lib/media-new';

const eagleMedia = getMediaItemsForProject('golden-eagle');

<MediaGallery 
  items={eagleMedia}
  columns={3}
  variant="minimal"
/>
```

### 3. Individual Components
```tsx
// Single media item
<MediaCard 
  media={mediaItem}
  onSelect={handleLightboxOpen}
  size="medium"
  variant="detailed"
/>

// Project showcase
<ProjectCard 
  project={project}
  variant="detailed"
  className="project-card"
/>
```

## 📊 Available Data

### Projects Available:
- `golden-eagle` - Golden Eagle Masterpiece (50+ photos, 3 videos)
- `loch-ness-monster` - Nessie carving (39 photos)
- `richard-peacock-bass` - Commissioned bass (45+ photos, videos)
- `st-collen-statue` - Religious statue (75+ photos, videos)
- `butterflies-dragonflies-fish` - Nature collection (80+ photos, video)

### Helper Functions:
```tsx
import { 
  getAllMediaItems,
  getFeaturedMediaItems, 
  getMediaItemsForProject,
  getFeaturedProjects,
  getProjectsByCategory,
  searchProjects
} from '@/lib/media-new';

// Get all media across projects
const allMedia = getAllMediaItems(); // 150+ items

// Get only featured content
const featured = getFeaturedMediaItems();

// Get project-specific media
const eagleMedia = getMediaItemsForProject('golden-eagle');

// Get projects by category
const wildlifeProjects = getProjectsByCategory('wildlife');

// Search projects
const searchResults = searchProjects('eagle');
```

## 🎨 Styling & Design

### Design System Integration
All components use the site's design tokens:
- `var(--accent-primary)` - Saddle brown
- `var(--accent-secondary)` - Dark olive green  
- `var(--accent-tertiary)` - Tan/wood tone
- `var(--foreground)` - Rich espresso text
- `var(--surface-elevated)` - Pure white cards
- Border radius from `var(--border-radius-lg)`
- Shadow system from `var(--shadow-md)` etc.

### Responsive Breakpoints
- Mobile: Single column
- Tablet: 2 columns 
- Desktop: 3 columns
- Large: 4 columns (optional)

## 🔧 Adding New Media

### 1. Add New Project
```tsx
// In src/lib/media-new.ts
export const projects: Project[] = [
  // ...existing projects,
  {
    id: 'new-project',
    title: 'My New Project',
    slug: 'new-project',
    description: 'Project description...',
    category: 'wildlife', // wildlife | mythical | religious | commissioned | mixed
    coverImage: '/media/NewProject/cover.jpg',
    mediaFolder: '/media/NewProject',
    mediaCount: { images: 20, videos: 2 },
    featured: true,
    difficulty: 'expert',
    // ... other fields
  }
];
```

### 2. Add Media Items
```tsx
// In getMediaItemsForProject function
if (projectId === 'new-project') {
  mediaItems.push({
    id: 'new-project-img-1',
    type: 'image',
    src: '/media/NewProject/image1.jpg',
    alt: 'Description of the image',
    category: 'process', // process | finished | workshop | behind-scenes
    project: projectId,
    featured: true,
    order: 1
  });
}
```

## 🚀 Performance Features

### Image Optimization
- Next.js Image component with lazy loading
- Blur placeholders for smooth loading
- Responsive sizes for different viewports
- Quality optimization (85% default)

### Animations
- Framer Motion for smooth transitions
- Staggered animations for gallery grids
- Optimized for 60fps performance
- Lightning CSS for efficient styling

### Lazy Loading
- Images load as they enter viewport
- Videos preload metadata only
- Smooth skeleton loading states

## 🎯 What's Next

### Phase 2 - Individual Project Pages
```
/projects/golden-eagle    # Detailed project view
/projects/nessie         # Project-specific gallery
/behind-the-scenes       # Workshop content
/timelapses             # Video showcase
```

### Phase 3 - Advanced Features
- Video thumbnail generation
- Image compression pipeline
- Advanced search and filtering
- Social sharing capabilities

## 🐛 Troubleshooting

### Common Issues:
1. **Images not loading**: Check file paths in `/public/media/`
2. **Styling issues**: Ensure Tailwind v4 and Lightning CSS are configured
3. **Performance**: Use `getAllMediaItems()` sparingly, prefer project-specific queries

### Development:
```bash
npm run dev  # Start development server
npm run build # Test production build
```

The gallery is now live at `/gallery` with full functionality! 🎉
