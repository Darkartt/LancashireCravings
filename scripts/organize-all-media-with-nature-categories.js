#!/usr/bin/env node

/**
 * Enhanced Media Organization Script - Subject-Based Categories
 * Organizes all 3,604 media files using specific nature categories instead of "mixed"
 * 
 * USAGE: node scripts/organize-all-media-with-nature-categories.js
 * 
 * This script will:
 * 1. Load the existing categorization plan from media-categorization-plan.json
 * 2. Create organized folder structure with specific nature categories:
 *    - insects (butterflies, dragonflies, bees, etc.)
 *    - birds (owls, eagles, crows, etc.)
 *    - fish (various species)
 *    - mammals (squirrels, dogs, etc.)
 *    - flowers (various blooms)
 *    - landscapes (nature scenes)
 *    - portraits (people/artistic)
 * 3. Move files to appropriate subject-based folders
 * 4. Apply intelligent naming based on subject content
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  mediaDir: path.join(process.cwd(), 'public', 'media'),
  backupDir: path.join(process.cwd(), 'public', 'media', 'archive', 'original-files-backup-20250706'),
  logFile: 'nature-categorization-FINAL-log.json',
  dryRun: false, // Set to false to actually move files
  
  // Nature-based categorization structure
  natureCategories: {
    insects: {
      keywords: ['butterfly', 'butterflies', 'dragonfly', 'dragonflies', 'bee', 'bees', 'honeycomb', 'insect', 'moth', 'beetle'],
      folder: 'nature/insects'
    },
    birds: {
      keywords: ['owl', 'owls', 'eagle', 'eagles', 'crow', 'crows', 'bird', 'birds', 'feather', 'nest', 'wing'],
      folder: 'nature/birds'
    },
    fish: {
      keywords: ['fish', 'fishes', 'aquatic', 'water', 'pond', 'stream', 'fishing'],
      folder: 'nature/fish'
    },
    mammals: {
      keywords: ['squirrel', 'squirrels', 'dog', 'dogs', 'cat', 'cats', 'deer', 'rabbit', 'mammal'],
      folder: 'nature/mammals'
    },
    flowers: {
      keywords: ['flower', 'flowers', 'bloom', 'blooms', 'petal', 'petals', 'rose', 'lily', 'daisy', 'garden'],
      folder: 'nature/flowers'
    },
    landscapes: {
      keywords: ['landscape', 'landscapes', 'scenery', 'mountain', 'forest', 'tree', 'trees', 'sky', 'sunset', 'sunrise'],
      folder: 'nature/landscapes'
    },
    portraits: {
      keywords: ['portrait', 'portraits', 'person', 'people', 'face', 'me', 'holding', 'christian'],
      folder: 'nature/portraits'
    },
    artistic: {
      keywords: ['artistic', 'art', 'creative', 'abstract', 'composition'],
      folder: 'nature/artistic'
    }
  }
};

class NatureCategoryOrganizer {
  constructor() {
    this.organizationLog = {
      timestamp: new Date().toISOString(),
      totalFiles: 0,
      processedFiles: 0,
      categorizedFiles: 0,
      errors: [],
      moves: [],
      categoryStats: {},
      summary: {}
    };
    
    this.existingCategorizationPlan = null;
  }

  async loadExistingCategorizationPlan() {
    try {
      const planPath = 'media-categorization-plan.json';
      const planData = await fs.readFile(planPath, 'utf8');
      this.existingCategorizationPlan = JSON.parse(planData);
      console.log('📋 Loaded existing categorization plan with', Object.keys(this.existingCategorizationPlan.projects || {}).length, 'categories');
      
      // Initialize category stats
      for (const category of Object.keys(CONFIG.natureCategories)) {
        this.organizationLog.categoryStats[category] = { images: 0, videos: 0, total: 0 };
      }
    } catch (error) {
      console.error('❌ Failed to load categorization plan:', error.message);
      process.exit(1);
    }
  }

  async createNatureFolderStructure() {
    console.log('\n📁 Creating nature-based folder structure...');
    
    // Main project structures (keep existing)
    const projectStructures = [
      'projects/eagle/images/process',
      'projects/eagle/images/final',
      'projects/eagle/videos',
      'projects/nessie/images/process',
      'projects/nessie/images/final',
      'projects/nessie/videos',
      'projects/bass/images/process',
      'projects/bass/images/final',
      'projects/bass/videos',
      'projects/stcollen/images/process',
      'projects/stcollen/images/final',
      'projects/stcollen/videos',
      'workshop/images/tools',
      'workshop/images/techniques',
      'workshop/images/environment',
      'workshop/videos'
    ];

    // Nature category structures (NEW - replace mixed)
    const natureStructures = [];
    for (const [category, config] of Object.entries(CONFIG.natureCategories)) {
      natureStructures.push(`${config.folder}/images`);
      natureStructures.push(`${config.folder}/videos`);
    }

    const allStructures = [...projectStructures, ...natureStructures];

    for (const structure of allStructures) {
      const fullPath = path.join(CONFIG.mediaDir, structure);
      try {
        await fs.mkdir(fullPath, { recursive: true });
        console.log(`  ✅ Created: ${structure}`);
      } catch (error) {
        console.error(`  ❌ Failed to create ${structure}:`, error.message);
      }
    }
  }

  categorizeFileByNature(file) {
    const filename = file.fileName.toLowerCase();
    const directory = file.directory.toLowerCase();
    const fullPath = (file.relativePath || '').toLowerCase();
    
    // Check existing categorization plan first
    if (this.existingCategorizationPlan) {
      const category = this.findInCategorizationPlan(file);
      if (category) {
        return category;
      }
    }
    
    // Check for nature categories based on filename/path content
    for (const [category, config] of Object.entries(CONFIG.natureCategories)) {
      for (const keyword of config.keywords) {
        if (filename.includes(keyword) || directory.includes(keyword) || fullPath.includes(keyword)) {
          return {
            project: 'nature',
            category: category,
            folder: config.folder,
            type: this.getMediaType(file.extension)
          };
        }
      }
    }
    
    // Special handling for generic IMG files in numbered folders (these are likely nature collection)
    if (filename.match(/^img_\d+\.(jpg|jpeg|mov|mp4)$/i) && directory.match(/^[1-6]$/)) {
      return {
        project: 'nature',
        category: 'artistic', // Default for unidentifiable nature content
        folder: CONFIG.natureCategories.artistic.folder,
        type: this.getMediaType(file.extension)
      };
    }
    
    // Check for project files
    const projectMatch = this.categorizeProjectFile(file);
    if (projectMatch.project !== 'uncategorized') {
      return projectMatch;
    }
    
    // Default fallback to artistic nature category instead of "mixed"
    return {
      project: 'nature',
      category: 'artistic',
      folder: CONFIG.natureCategories.artistic.folder,
      type: this.getMediaType(file.extension)
    };
  }

  findInCategorizationPlan(file) {
    const projects = this.existingCategorizationPlan.projects || {};
    
    for (const [projectName, projectData] of Object.entries(projects)) {
      // Check images
      if (projectData.images) {
        for (const image of projectData.images) {
          if (image.originalPath === file.relativePath || image.originalName === file.fileName) {
            return {
              project: image.category.category === 'nature' ? 'nature' : projectName,
              category: image.category.subcategory || projectName,
              folder: image.category.category === 'nature' ? 
                CONFIG.natureCategories[image.category.subcategory]?.folder || `nature/${image.category.subcategory}` :
                `projects/${projectName}`,
              type: 'images'
            };
          }
        }
      }
      
      // Check videos
      if (projectData.videos) {
        for (const video of projectData.videos) {
          if (video.originalPath === file.relativePath || video.originalName === file.fileName) {
            return {
              project: video.category.category === 'nature' ? 'nature' : projectName,
              category: video.category.subcategory || projectName,
              folder: video.category.category === 'nature' ? 
                CONFIG.natureCategories[video.category.subcategory]?.folder || `nature/${video.category.subcategory}` :
                `projects/${projectName}`,
              type: 'videos'
            };
          }
        }
      }
    }
    
    return null;
  }

  categorizeProjectFile(file) {
    const filename = file.fileName.toLowerCase();
    const directory = file.directory.toLowerCase();
    
    // Project identification patterns
    const projectPatterns = {
      eagle: {
        patterns: [/IMG_2[0-3]\d{2}\.jpg$/i, /IMG_3[01]\d{2}\.jpg$/i, /eagle/i],
        folders: ['eagle']
      },
      nessie: {
        patterns: [/IMG_14[5-9]\d\.jpg$/i, /IMG_15[0-5]\d\.jpg$/i, /nessie/i],
        folders: ['nessie']
      },
      bass: {
        patterns: [/bass/i, /peacock/i],
        folders: ['richard peacock bass']
      },
      stcollen: {
        patterns: [/collen/i, /statue/i],
        folders: ['st collen statue']
      },
      workshop: {
        patterns: [/workshop/i, /tool/i, /technique/i, /environment/i],
        folders: ['workshop']
      }
    };
    
    for (const [project, config] of Object.entries(projectPatterns)) {
      // Check filename patterns
      for (const pattern of config.patterns) {
        if (pattern.test(file.fileName) || pattern.test(directory)) {
          return {
            project,
            category: this.determineProjectCategory(file),
            folder: `projects/${project}`,
            type: this.getMediaType(file.extension)
          };
        }
      }
      
      // Check if file is in project folder
      for (const folder of config.folders) {
        if (directory.includes(folder)) {
          return {
            project,
            category: this.determineProjectCategory(file),
            folder: `projects/${project}`,
            type: this.getMediaType(file.extension)
          };
        }
      }
    }
    
    return {
      project: 'uncategorized',
      category: 'unknown',
      folder: 'nature/artistic', // Default fallback
      type: this.getMediaType(file.extension)
    };
  }

  determineProjectCategory(file) {
    const filename = file.fileName.toLowerCase();
    const directory = file.directory.toLowerCase();
    
    if (directory.includes('final') || filename.includes('final')) return 'final';
    if (directory.includes('process') || filename.includes('process')) return 'process';
    if (directory.includes('environment') || filename.includes('environment')) return 'environment';
    if (directory.includes('tools') || filename.includes('tool')) return 'tools';
    if (directory.includes('techniques') || filename.includes('technique')) return 'techniques';
    if (filename.includes('timelapse') || filename.includes('time')) return 'timelapse';
    
    return file.extension.includes('mp4') || file.extension.includes('mov') ? 'timelapse' : 'process';
  }

  getMediaType(extension) {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv'];
    return videoExtensions.includes(extension.toLowerCase()) ? 'videos' : 'images';
  }

  generateNewFilename(file, categorization, sequence) {
    const extension = file.extension.toLowerCase();
    const category = categorization.category;
    const subcategory = this.determineSubcategory(file, categorization);
    
    if (categorization.project === 'nature') {
      // Nature files: category_subcategory_sequence.ext
      return `${category}_${subcategory}_${String(sequence).padStart(3, '0')}${extension}`;
    } else {
      // Project files: project_category_sequence.ext  
      return `${categorization.project}_${category}_${String(sequence).padStart(3, '0')}${extension}`;
    }
  }

  determineSubcategory(file, categorization) {
    const filename = file.fileName.toLowerCase();
    
    if (categorization.project === 'nature') {
      // For nature files, try to determine specific subject
      if (categorization.category === 'insects') {
        if (filename.includes('butterfly') || filename.includes('butterflies')) return 'butterfly';
        if (filename.includes('dragonfly') || filename.includes('dragonflies')) return 'dragonfly';
        if (filename.includes('bee')) return 'bee';
        return 'insect';
      }
      
      if (categorization.category === 'birds') {
        if (filename.includes('owl')) return 'owl';
        if (filename.includes('eagle')) return 'eagle';
        if (filename.includes('crow')) return 'crow';
        return 'bird';
      }
      
      if (categorization.category === 'fish') {
        return 'fish';
      }
      
      if (categorization.category === 'mammals') {
        if (filename.includes('squirrel')) return 'squirrel';
        if (filename.includes('dog')) return 'dog';
        return 'mammal';
      }
      
      if (categorization.category === 'flowers') {
        return 'flower';
      }
      
      if (categorization.category === 'landscapes') {
        return 'landscape';
      }
      
      if (categorization.category === 'portraits') {
        return 'portrait';
      }
      
      return 'nature';
    }
    
    // For project files, use the category as subcategory
    return categorization.category;
  }

  async organizeAllFiles() {
    console.log('\n🚀 Starting nature-based file organization...');
    
    // Load file inventory
    const reportPath = 'enhanced-media-analysis-report.json';
    let fileInventory;
    
    try {
      const reportData = await fs.readFile(reportPath, 'utf8');
      const report = JSON.parse(reportData);
      fileInventory = report.foundFiles || [];
    } catch (error) {
      console.error('❌ Failed to load file inventory:', error.message);
      return;
    }
    
    this.organizationLog.totalFiles = fileInventory.length;
    console.log(`📊 Processing ${fileInventory.length} files...`);
    
    // Track sequences for each category
    const sequences = {};
    
    for (const file of fileInventory) {
      try {
        const categorization = this.categorizeFileByNature(file);
        const categoryKey = `${categorization.folder}/${categorization.type}`;
        
        // Initialize sequence if needed
        if (!sequences[categoryKey]) {
          sequences[categoryKey] = 1;
        }
        
        const newFilename = this.generateNewFilename(file, categorization, sequences[categoryKey]);
        const newPath = `${categorization.folder}/${categorization.type}/${newFilename}`;
        
        // Update category stats
        if (categorization.project === 'nature') {
          this.organizationLog.categoryStats[categorization.category][categorization.type]++;
          this.organizationLog.categoryStats[categorization.category].total++;
          this.organizationLog.categorizedFiles++;
        }
        
        // Log the move
        this.organizationLog.moves.push({
          oldPath: file.relativePath,
          newPath: newPath,
          oldFilename: file.fileName,
          newFilename: newFilename,
          project: categorization.project,
          category: categorization.category,
          type: categorization.type,
          sequence: sequences[categoryKey]
        });
        
        sequences[categoryKey]++;
        this.organizationLog.processedFiles++;
        
        // Perform actual move if not dry run
        if (!CONFIG.dryRun) {
          const oldFullPath = path.join(CONFIG.mediaDir, file.relativePath);
          const newFullPath = path.join(CONFIG.mediaDir, newPath);
          
          // Create directory if needed
          await fs.mkdir(path.dirname(newFullPath), { recursive: true });
          
          // Move file
          await fs.rename(oldFullPath, newFullPath);
        }
        
        if (this.organizationLog.processedFiles % 100 === 0) {
          console.log(`  📄 Processed ${this.organizationLog.processedFiles}/${this.organizationLog.totalFiles} files...`);
        }
      } catch (error) {
        console.error(`❌ Error processing file ${file.fileName}:`, error.message);
        this.organizationLog.errors.push({
          file: file.fileName,
          error: error.message
        });
      }
    }
    
    // Generate summary
    this.organizationLog.summary = {
      totalFiles: this.organizationLog.totalFiles,
      processedFiles: this.organizationLog.processedFiles,
      categorizedFiles: this.organizationLog.categorizedFiles,
      errorCount: this.organizationLog.errors.length,
      categoryBreakdown: this.organizationLog.categoryStats,
      mode: CONFIG.dryRun ? 'DRY RUN' : 'ACTUAL MOVE'
    };
    
    // Save log
    await fs.writeFile(CONFIG.logFile, JSON.stringify(this.organizationLog, null, 2));
    
    console.log('\n📊 ORGANIZATION COMPLETE!');
    console.log(`✅ Total files processed: ${this.organizationLog.processedFiles}/${this.organizationLog.totalFiles}`);
    console.log(`🏷️  Files categorized into nature subjects: ${this.organizationLog.categorizedFiles}`);
    console.log(`❌ Errors: ${this.organizationLog.errors.length}`);
    console.log(`📋 Mode: ${CONFIG.dryRun ? 'DRY RUN (no files moved)' : 'FILES ACTUALLY MOVED'}`);
    
    console.log('\n🌿 NATURE CATEGORY BREAKDOWN:');
    for (const [category, stats] of Object.entries(this.organizationLog.categoryStats)) {
      if (stats.total > 0) {
        console.log(`  ${category}: ${stats.total} files (${stats.images} images, ${stats.videos} videos)`);
      }
    }
    
    console.log(`\n💾 Full log saved to: ${CONFIG.logFile}`);
  }

  async run() {
    try {
      console.log('🎯 Enhanced Media Organization - Nature Categories');
      console.log('===============================================');
      
      await this.loadExistingCategorizationPlan();
      await this.createNatureFolderStructure();
      await this.organizeAllFiles();
      
      console.log('\n🎉 Organization complete! Files now organized by specific nature subjects instead of generic "mixed" category.');
      
    } catch (error) {
      console.error('💥 Organization failed:', error);
      process.exit(1);
    }
  }
}

// Run the organizer
if (require.main === module) {
  const organizer = new NatureCategoryOrganizer();
  organizer.run();
}

module.exports = NatureCategoryOrganizer;
