#!/usr/bin/env node

/**
 * Generate Updated Media File - Phase 3: Code Integration
 * Creates media-organized.ts with actual organized file paths
 * 
 * USAGE: node scripts/generate-updated-media-file.js
 * 
 * This script will:
 * 1. Scan the new organized folder structure
 * 2. Generate MediaItem entries for all organized files
 * 3. Create updated media-organized.ts with actual file paths
 * 4. Maintain project structure and nature categories
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  mediaDir: path.join(process.cwd(), 'public', 'media'),
  outputFile: 'src/lib/media-organized.ts',
  logFile: 'media-integration-log.json'
};

class MediaFileGenerator {
  constructor() {
    this.mediaData = {
      projects: {},
      nature: {},
      totalFiles: 0,
      generatedAt: new Date().toISOString()
    };
  }

  async scanOrganizedStructure() {
    console.log('🔍 Scanning organized media structure...');
    
    try {
      // Scan projects folder
      const projectsDir = path.join(CONFIG.mediaDir, 'projects');
      const projects = await fs.readdir(projectsDir);
      
      for (const project of projects) {
        if (project.startsWith('.')) continue;
        
        const projectPath = path.join(projectsDir, project);
        const stat = await fs.stat(projectPath);
        if (!stat.isDirectory()) continue;
        
        console.log(`  📁 Scanning project: ${project}`);
        this.mediaData.projects[project] = await this.scanProjectFolder(projectPath, project);
      }
      
      // Scan nature folder
      const natureDir = path.join(CONFIG.mediaDir, 'nature');
      const natureCategories = await fs.readdir(natureDir);
      
      for (const category of natureCategories) {
        if (category.startsWith('.')) continue;
        
        const categoryPath = path.join(natureDir, category);
        const stat = await fs.stat(categoryPath);
        if (!stat.isDirectory()) continue;
        
        console.log(`  🌿 Scanning nature category: ${category}`);
        this.mediaData.nature[category] = await this.scanNatureCategory(categoryPath, category);
      }
      
      console.log(`✅ Scan complete! Found ${this.mediaData.totalFiles} organized files`);
      
    } catch (error) {
      console.error('❌ Error scanning organized structure:', error.message);
      throw error;
    }
  }

  async scanProjectFolder(projectPath, projectName) {
    const projectData = {
      images: { process: [], final: [] },
      videos: [],
      stats: { images: 0, videos: 0, total: 0 }
    };

    try {
      // Scan images folder
      const imagesPath = path.join(projectPath, 'images');
      
      // Scan main images directory first
      if (await this.pathExists(imagesPath)) {
        const allFiles = await fs.readdir(imagesPath);
        console.log(`  🔍 Scanning ${projectName}: Found ${allFiles.length} items in images folder`);
        
        let processedImages = 0;
        for (const file of allFiles) {
          // Skip directories like 'final' and 'process'
          const filePath = path.join(imagesPath, file);
          const fileStat = await fs.stat(filePath);
          if (fileStat.isDirectory()) continue;
          
          if (this.isImageFile(file)) {
            // Determine category based on filename patterns
            const category = this.categorizeImageFile(file);
            const targetArray = category === 'process' ? projectData.images.process : projectData.images.final;
            
            targetArray.push(this.createMediaItem(
              file,
              `projects/${projectName}/images/${file}`,
              'image',
              category,
              projectName,
              targetArray.length + 1
            ));
            projectData.stats.images++;
            this.mediaData.totalFiles++;
            processedImages++;
          }
        }
        console.log(`  ✅ ${projectName}: Processed ${processedImages} images`);
      }
      
      // Process images subdirectory (if exists)
      const processPath = path.join(imagesPath, 'process');
      if (await this.pathExists(processPath)) {
        const processFiles = await fs.readdir(processPath);
        for (const file of processFiles) {
          if (this.isImageFile(file)) {
            projectData.images.process.push(this.createMediaItem(
              file, 
              `projects/${projectName}/images/process/${file}`,
              'image',
              'process',
              projectName,
              projectData.images.process.length + 1
            ));
            projectData.stats.images++;
            this.mediaData.totalFiles++;
          }
        }
      }
      
      // Final images subdirectory (if exists)
      const finalPath = path.join(imagesPath, 'final');
      if (await this.pathExists(finalPath)) {
        const finalFiles = await fs.readdir(finalPath);
        for (const file of finalFiles) {
          if (this.isImageFile(file)) {
            projectData.images.final.push(this.createMediaItem(
              file,
              `projects/${projectName}/images/final/${file}`,
              'image', 
              'final',
              projectName,
              projectData.images.final.length + 1
            ));
            projectData.stats.images++;
            this.mediaData.totalFiles++;
          }
        }
      }
      
      // Videos
      const videosPath = path.join(projectPath, 'videos');
      if (await this.pathExists(videosPath)) {
        const videoFiles = await fs.readdir(videosPath);
        for (const file of videoFiles) {
          if (this.isVideoFile(file)) {
            projectData.videos.push(this.createMediaItem(
              file,
              `projects/${projectName}/videos/${file}`,
              'video',
              'timelapse',
              projectName,
              projectData.videos.length + 1
            ));
            projectData.stats.videos++;
            this.mediaData.totalFiles++;
          }
        }
      }
      
      projectData.stats.total = projectData.stats.images + projectData.stats.videos;
      
    } catch (error) {
      console.error(`❌ Error scanning project ${projectName}:`, error.message);
    }
    
    return projectData;
  }

  async scanNatureCategory(categoryPath, categoryName) {
    const categoryData = {
      images: [],
      videos: [],
      stats: { images: 0, videos: 0, total: 0 }
    };

    try {
      // Scan images
      const imagesPath = path.join(categoryPath, 'images');
      if (await this.pathExists(imagesPath)) {
        const imageFiles = await fs.readdir(imagesPath);
        for (const file of imageFiles) {
          if (this.isImageFile(file)) {
            categoryData.images.push(this.createMediaItem(
              file,
              `nature/${categoryName}/images/${file}`,
              'image',
              'final',
              categoryName,
              categoryData.images.length + 1,
              this.extractSubjectFromFilename(file, categoryName)
            ));
            categoryData.stats.images++;
            this.mediaData.totalFiles++;
          }
        }
      }
      
      // Scan videos
      const videosPath = path.join(categoryPath, 'videos');
      if (await this.pathExists(videosPath)) {
        const videoFiles = await fs.readdir(videosPath);
        for (const file of videoFiles) {
          if (this.isVideoFile(file)) {
            categoryData.videos.push(this.createMediaItem(
              file,
              `nature/${categoryName}/videos/${file}`,
              'video',
              'timelapse',
              categoryName,
              categoryData.videos.length + 1,
              this.extractSubjectFromFilename(file, categoryName)
            ));
            categoryData.stats.videos++;
            this.mediaData.totalFiles++;
          }
        }
      }
      
      categoryData.stats.total = categoryData.stats.images + categoryData.stats.videos;
      
    } catch (error) {
      console.error(`❌ Error scanning nature category ${categoryName}:`, error.message);
    }
    
    return categoryData;
  }

  createMediaItem(filename, relativePath, type, category, project, order, subject = null) {
    const id = `${project}-${type}-${String(order).padStart(3, '0')}`;
    const alt = this.generateAltText(filename, project, category, subject);
    
    return {
      id,
      type,
      src: `/media/${relativePath}`,
      alt,
      category,
      project,
      filename,
      order,
      featured: order <= 5 || (project !== 'artistic' && order <= 3), // First few are featured
      subject
    };
  }

  generateAltText(filename, project, category, subject) {
    const projectTitles = {
      eagle: 'Golden Eagle',
      nessie: 'Loch Ness Monster', 
      bass: 'Richard Peacock Bass',
      stcollen: 'St. Collen Statue',
      workshop: 'Workshop',
      insects: 'Insects & Butterflies',
      fish: 'Aquatic Life',
      portraits: 'Portrait Photography',
      artistic: 'Artistic Nature',
      birds: 'Birds & Wildlife',
      mammals: 'Mammals',
      flowers: 'Flowers & Gardens',
      landscapes: 'Landscapes'
    };
    
    const categoryDescriptions = {
      process: 'carving process',
      final: 'finished piece',
      timelapse: 'time-lapse video',
      tools: 'woodcarving tools',
      techniques: 'carving techniques',
      environment: 'workshop environment'
    };
    
    const projectTitle = projectTitles[project] || project;
    const categoryDesc = categoryDescriptions[category] || category;
    
    if (subject) {
      return `${projectTitle} - ${subject} ${categoryDesc}`;
    }
    
    return `${projectTitle} - ${categoryDesc}`;
  }

  extractSubjectFromFilename(filename, category) {
    const name = filename.toLowerCase();
    
    // Extract subject from organized filename pattern: category_subject_###.ext
    const match = name.match(/^[a-z]+_([a-z]+)_\d+\./);
    if (match) {
      return match[1];
    }
    
    // Fallback based on category
    const subjectMappings = {
      insects: 'insect',
      fish: 'fish',
      portraits: 'portrait',
      artistic: 'nature',
      birds: 'bird',
      mammals: 'mammal',
      flowers: 'flower',
      landscapes: 'landscape'
    };
    
    return subjectMappings[category] || 'unknown';
  }

  async generateMediaFile() {
    console.log('📝 Generating updated media-organized.ts file...');
    
    const fileContent = this.buildMediaFileContent();
    
    console.log(`📝 About to write ${fileContent.length} characters to ${CONFIG.outputFile}`);
    
    try {
      await fs.writeFile(CONFIG.outputFile, fileContent, 'utf8');
      console.log(`✅ Generated ${CONFIG.outputFile}`);
      
      // Verify the file was written
      const stats = await fs.stat(CONFIG.outputFile);
      console.log(`📊 File size: ${stats.size} bytes, modified: ${stats.mtime}`);
      
      // Save generation log
      await fs.writeFile(CONFIG.logFile, JSON.stringify(this.mediaData, null, 2));
      console.log(`📋 Saved generation log to ${CONFIG.logFile}`);
      
    } catch (error) {
      console.error('❌ Error writing media file:', error.message);
      throw error;
    }
  }

  buildMediaFileContent() {
    const projectsArray = this.buildProjectsArray();
    const natureCollectionObject = this.buildNatureCollectionObject();
    
    return `// ORGANIZED Media Management System - Generated from Actual File Structure
// Generated on: ${new Date().toISOString()}
// Total files: ${this.mediaData.totalFiles}
// Phase 3: Code Integration - Using organized folder structure

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  category: 'process' | 'final' | 'workshop' | 'behind-scenes' | 'timelapse' | 'tools' | 'techniques' | 'environment';
  project: string;
  filename?: string;
  order?: number;
  featured?: boolean;
  width?: number;
  height?: number;
  fileSize?: string;
  duration?: string;
  subject?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'wildlife' | 'mythical' | 'religious' | 'commissioned' | 'workshop' | 'nature';
  coverImage: string;
  coverVideo?: string;
  mediaFolder: string;
  mediaCount: {
    images: number;
    videos: number;
  };
  featured: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
  completionTime?: string;
  materials?: string[];
  client?: string;
  tags?: string[];
  slug: string;
}

export interface NatureCategory {
  title: string;
  description: string;
  coverImage: string;
  mediaFolder: string;
  mediaCount: {
    images: number;
    videos: number;
  };
  items: MediaItem[];
}

// PROJECTS - Generated from organized structure
export const projects: Project[] = ${projectsArray};

// NATURE COLLECTION - Generated from organized structure  
export const natureCollection: Record<string, NatureCategory> = ${natureCollectionObject};

// HELPER FUNCTIONS
export function getMediaItemsForProject(projectId: string): MediaItem[] {
  const projectData = {
    'golden-eagle': 'eagle',
    'loch-ness-monster': 'nessie',
    'richard-peacock-bass': 'bass',
    'st-collen-statue': 'stcollen',
    'workshop-techniques': 'workshop'
  };
  
  const actualProjectId = projectData[projectId] || projectId;
  const project = projects.find(p => p.id === projectId);
  if (!project) return [];
  
  // Return combined media items for this project
  const mediaItems: MediaItem[] = [];
  
  // Add process images
  const projectMedia = ${JSON.stringify(this.mediaData.projects, null, 2)};
  if (projectMedia[actualProjectId]) {
    const data = projectMedia[actualProjectId];
    mediaItems.push(...data.images.process);
    mediaItems.push(...data.images.final);
    mediaItems.push(...data.videos);
  }
  
  return mediaItems.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured);
}

export function getFeaturedMedia(): MediaItem[] {
  const featuredItems: MediaItem[] = [];
  
  // Add featured items from each project
  projects.forEach(project => {
    const projectMedia = getMediaItemsForProject(project.id);
    const featuredProjectMedia = projectMedia.filter(item => item.featured);
    featuredItems.push(...featuredProjectMedia.slice(0, 3)); // Top 3 from each
  });
  
  // Add featured nature items
  Object.values(natureCollection).forEach(category => {
    const featuredNatureItems = category.items.filter(item => item.featured);
    featuredItems.push(...featuredNatureItems);
  });
  
  return featuredItems.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getAllMediaItems(): MediaItem[] {
  const allItems: MediaItem[] = [];
  
  // Add all project media
  projects.forEach(project => {
    const projectMedia = getMediaItemsForProject(project.id);
    allItems.push(...projectMedia);
  });
  
  // Add all nature collection items
  Object.values(natureCollection).forEach(category => {
    allItems.push(...category.items);
  });
  
  return allItems.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

export function getNatureCategory(categoryId: string): NatureCategory | undefined {
  return natureCollection[categoryId];
}

export function getMediaStats() {
  const totalProjects = projects.length;
  const totalNatureCategories = Object.keys(natureCollection).length;
  
  const projectStats = projects.reduce((acc, project) => {
    acc.images += project.mediaCount.images;
    acc.videos += project.mediaCount.videos;
    return acc;
  }, { images: 0, videos: 0 });
  
  const natureStats = Object.values(natureCollection).reduce((acc, category) => {
    acc.images += category.mediaCount.images;
    acc.videos += category.mediaCount.videos;
    return acc;
  }, { images: 0, videos: 0 });
  
  return {
    projects: {
      count: totalProjects,
      featured: projects.filter(p => p.featured).length,
      ...projectStats
    },
    nature: {
      categories: totalNatureCategories,
      activeCategories: Object.values(natureCollection).filter(c => 
        c.mediaCount.images > 0 || c.mediaCount.videos > 0
      ).length,
      ...natureStats
    },
    total: {
      images: projectStats.images + natureStats.images,
      videos: projectStats.videos + natureStats.videos,
      files: projectStats.images + projectStats.videos + natureStats.images + natureStats.videos
    }
  };
}

export default {
  projects,
  natureCollection,
  getMediaItemsForProject,
  getFeaturedProjects,
  getFeaturedMedia,
  getAllMediaItems,
  getProjectBySlug,
  getNatureCategory,
  getMediaStats
};`;
  }

  buildProjectsArray() {
    const projectDefinitions = {
      eagle: {
        id: 'golden-eagle',
        title: 'Golden Eagle Masterpiece',
        slug: 'golden-eagle',
        description: 'Majestic golden eagle carved with incredible detail, showcasing the power and grace of this magnificent bird of prey.',
        category: 'wildlife',
        difficulty: 'expert',
        completionTime: '6-8 weeks',
        materials: ['Premium Hardwood', 'Natural Wood Stain', 'Protective Finish'],
        tags: ['wildlife', 'eagle', 'detailed', 'masterpiece']
      },
      nessie: {
        id: 'loch-ness-monster',
        title: 'Nessie - Loch Ness Monster',
        slug: 'loch-ness-monster',
        description: 'Bringing the legendary creature of Scottish folklore to life through masterful woodcarving techniques.',
        category: 'mythical',
        difficulty: 'expert',
        completionTime: '4-6 weeks',
        materials: ['Hardwood', 'Natural Finish'],
        tags: ['mythical', 'nessie', 'scottish', 'legend']
      },
      bass: {
        id: 'richard-peacock-bass',
        title: 'Richard Peacock Bass',
        slug: 'richard-peacock-bass',
        description: 'Commissioned bass carving featuring intricate scales and lifelike proportions.',
        category: 'commissioned',
        client: 'Richard Peacock',
        difficulty: 'expert',
        completionTime: '8-10 weeks',
        materials: ['Premium Hardwood', 'Detailed Scale Work', 'Custom Finish'],
        tags: ['commissioned', 'bass', 'fish', 'scales', 'aquatic']
      },
      stcollen: {
        id: 'st-collen-statue',
        title: 'St. Collen Statue',
        slug: 'st-collen-statue',
        description: 'Sacred religious statue carved with reverence and attention to spiritual detail.',
        category: 'religious',
        client: 'Religious Commission',
        difficulty: 'expert',
        completionTime: '12-16 weeks',
        materials: ['Sacred Wood', 'Traditional Finishes', 'Religious Detailing'],
        tags: ['religious', 'statue', 'welsh', 'saint', 'spiritual']
      },
      workshop: {
        id: 'workshop-techniques',
        title: 'Workshop & Techniques',
        slug: 'workshop-techniques',
        description: 'Behind-the-scenes look at the tools, techniques, and workshop environment.',
        category: 'workshop',
        difficulty: 'beginner',
        completionTime: 'Ongoing',
        materials: ['Professional Tools', 'Workshop Setup'],
        tags: ['workshop', 'tools', 'techniques', 'environment', 'process']
      }
    };

    const projectsArray = [];

    Object.keys(this.mediaData.projects).forEach(projectKey => {
      const projectData = this.mediaData.projects[projectKey];
      const definition = projectDefinitions[projectKey];
      
      if (definition) {
        const coverImage = projectData.images.process[0]?.src || projectData.images.final[0]?.src || '';
        const coverVideo = projectData.videos[0]?.src || '';
        
        projectsArray.push({
          ...definition,
          coverImage,
          coverVideo,
          mediaFolder: `/media/projects/${projectKey}`,
          mediaCount: {
            images: projectData.stats.images,
            videos: projectData.stats.videos
          },
          featured: projectData.stats.total > 10 // Featured if has substantial content
        });
      }
    });

    return JSON.stringify(projectsArray, null, 2);
  }

  buildNatureCollectionObject() {
    const categoryDefinitions = {
      insects: {
        title: 'Insects & Butterflies',
        description: 'Beautiful captures of butterflies, dragonflies, and other fascinating insects'
      },
      fish: {
        title: 'Aquatic Life',
        description: 'Fascinating underwater world and fish photography'
      },
      portraits: {
        title: 'Portraits & People',
        description: 'Personal photography and portrait work'
      },
      artistic: {
        title: 'Artistic & Creative',
        description: 'Creative compositions and artistic nature photography'
      },
      birds: {
        title: 'Birds & Wildlife',
        description: 'Majestic birds including owls, eagles, and crows'
      },
      mammals: {
        title: 'Mammals',
        description: 'Squirrels, dogs, and other mammalian subjects'
      },
      flowers: {
        title: 'Flowers & Gardens',
        description: 'Beautiful floral arrangements and botanical subjects'
      },
      landscapes: {
        title: 'Landscapes & Scenery',
        description: 'Natural scenic photography and landscape compositions'
      }
    };

    const natureCollection = {};

    Object.keys(this.mediaData.nature).forEach(categoryKey => {
      const categoryData = this.mediaData.nature[categoryKey];
      const definition = categoryDefinitions[categoryKey];
      
      if (definition) {
        const allItems = [...categoryData.images, ...categoryData.videos];
        const coverImage = allItems[0]?.src || '';
        
        natureCollection[categoryKey] = {
          ...definition,
          coverImage,
          mediaFolder: `/media/nature/${categoryKey}`,
          mediaCount: {
            images: categoryData.stats.images,
            videos: categoryData.stats.videos
          },
          items: allItems
        };
      }
    });

    return JSON.stringify(natureCollection, null, 2);
  }

  async pathExists(path) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(filename).toLowerCase();
    return imageExtensions.includes(ext);
  }

  isVideoFile(filename) {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    const ext = path.extname(filename).toLowerCase();
    return videoExtensions.includes(ext);
  }

  categorizeImageFile(filename) {
    // Determine category based on filename patterns
    const lowerName = filename.toLowerCase();
    
    // Process images typically have keywords like "process", "work", "progress", "wip", "construction", etc.
    if (lowerName.includes('_process_') || 
        lowerName.includes('process') || 
        lowerName.includes('work') || 
        lowerName.includes('progress') || 
        lowerName.includes('wip') || 
        lowerName.includes('construction') || 
        lowerName.includes('carving') || 
        lowerName.includes('rough') || 
        lowerName.includes('stage')) {
      return 'process';
    }
    
    // Default to final for finished pieces
    return 'final';
  }

  async run() {
    try {
      console.log('🚀 Media File Generator - Phase 3: Code Integration');
      console.log('==================================================');
      
      await this.scanOrganizedStructure();
      await this.generateMediaFile();
      
      console.log('\\n✅ Media file generation complete!');
      console.log(`📊 Total files processed: ${this.mediaData.totalFiles}`);
      console.log(`📁 Projects: ${Object.keys(this.mediaData.projects).length}`);
      console.log(`🌿 Nature categories: ${Object.keys(this.mediaData.nature).length}`);
      console.log(`💾 Updated file: ${CONFIG.outputFile}`);
      
    } catch (error) {
      console.error('💥 Media file generation failed:', error);
      process.exit(1);
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new MediaFileGenerator();
  generator.run();
}

module.exports = MediaFileGenerator;
