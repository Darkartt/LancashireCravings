#!/usr/bin/env node

/**
 * Master File Organization Script
 * Systematically organizes all 3,604 media files using the Master Plan
 * 
 * USAGE: node scripts/organize-all-media.js
 * 
 * This script will:
 * 1. Read the complete file inventory from enhanced-media-analysis-report.json
 * 2. Create the new organized folder structure
 * 3. Categorize each file by project and type
 * 4. Apply the new naming convention
 * 5. Move files to their new locations
 * 6. Generate a complete change log
 * 7. Update media references for code integration
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  mediaDir: path.join(process.cwd(), 'public', 'media'),
  backupDir: path.join(process.cwd(), 'public', 'media', 'archive', 'original-files-backup-20250706'),
  logFile: 'media-organization-log.json',
  dryRun: true, // Set to false to actually move files
  
  // Project identification patterns
  projectPatterns: {
    eagle: {
      patterns: [
        /IMG_2[0-3]\d{2}\.jpg$/i,
        /IMG_3[01]\d{2}\.jpg$/i,
        /IMG_32[01]\d\.jpg$/i,
        /eagle/i
      ],
      folders: ['Eagle']
    },
    nessie: {
      patterns: [
        /IMG_14[5-9]\d\.jpg$/i,
        /IMG_15[0-5]\d\.jpg$/i,
        /nessie/i
      ],
      folders: ['Nessie']
    },
    bass: {
      patterns: [
        /bass/i,
        /peacock/i
      ],
      folders: ['Richard Peacock Bass']
    },
    stcollen: {
      patterns: [
        /collen/i,
        /statue/i
      ],
      folders: ['St Collen statue']
    },
    workshop: {
      patterns: [
        /workshop/i,
        /tool/i,
        /technique/i,
        /environment/i
      ],
      folders: ['workshop']
    },
    nature: {
      patterns: [
        /butterfly/i,
        /dragonfly/i,
        /fish/i,
        /nature/i,
        /bird/i
      ],
      folders: ['nature-collection']
    }
  }
};

class MediaOrganizer {
  constructor() {
    this.organizationLog = {
      timestamp: new Date().toISOString(),
      totalFiles: 0,
      processedFiles: 0,
      errors: [],
      moves: [],
      summary: {}
    };
  }

  async loadFileInventory() {
    try {
      const reportPath = 'enhanced-media-analysis-report.json';
      const reportData = await fs.readFile(reportPath, 'utf8');
      const report = JSON.parse(reportData);
      
      console.log(`📊 Loaded inventory: ${report.foundFiles.length} files`);
      return report.foundFiles;
    } catch (error) {
      console.error('❌ Cannot load file inventory:', error.message);
      console.log('ℹ️  Run find-all-media.js first to generate the inventory');
      process.exit(1);
    }
  }

  async createOrganizedStructure() {
    console.log('🏗️  Creating organized folder structure...');
    
    const structures = [
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
      'workshop/videos',
      'nature-collection/images',
      'nature-collection/videos',
      'mixed/images',
      'mixed/videos'
    ];

    for (const structure of structures) {
      const fullPath = path.join(CONFIG.mediaDir, structure);
      try {
        await fs.mkdir(fullPath, { recursive: true });
        console.log(`  ✅ Created: ${structure}`);
      } catch (error) {
        console.error(`  ❌ Failed to create ${structure}:`, error.message);
      }
    }
  }

  categorizeFile(file) {
    const filename = file.fileName.toLowerCase();
    const directory = file.directory.toLowerCase();
    const extension = file.extension.toLowerCase();
    
    // Check each project pattern
    for (const [project, config] of Object.entries(CONFIG.projectPatterns)) {
      // Check filename patterns
      for (const pattern of config.patterns) {
        if (pattern.test(file.fileName) || pattern.test(directory)) {
          return {
            project,
            category: this.determineCategory(file),
            type: this.getMediaType(extension)
          };
        }
      }
      
      // Check if file is in project folder
      for (const folder of config.folders) {
        if (directory.includes(folder.toLowerCase())) {
          return {
            project,
            category: this.determineCategory(file),
            type: this.getMediaType(extension)
          };
        }
      }
    }
    
    // Default to mixed if no project match
    return {
      project: 'mixed',
      category: 'unsorted',
      type: this.getMediaType(extension)
    };
  }

  determineCategory(file) {
    const filename = file.fileName.toLowerCase();
    const directory = file.directory.toLowerCase();
    
    if (directory.includes('final') || filename.includes('final')) return 'final';
    if (directory.includes('process') || filename.includes('process')) return 'process';
    if (directory.includes('environment') || filename.includes('environment')) return 'environment';
    if (directory.includes('tools') || filename.includes('tool')) return 'tools';
    if (directory.includes('techniques') || filename.includes('technique')) return 'techniques';
    if (filename.includes('timelapse') || filename.includes('time')) return 'timelapse';
    
    // Default categorization based on file type
    return file.extension.includes('mp4') || file.extension.includes('mov') ? 'timelapse' : 'process';
  }

  getMediaType(extension) {
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    return videoExts.includes(extension) ? 'videos' : 'images';
  }

  generateNewFilename(file, categorization, sequence) {
    const { project, category } = categorization;
    const extension = file.extension;
    const paddedSequence = sequence.toString().padStart(3, '0');
    
    return `${project}_${category}_${paddedSequence}${extension}`;
  }

  generateNewPath(categorization, filename) {
    const { project, category, type } = categorization;
    
    if (project === 'mixed') {
      return path.join('mixed', type, filename);
    }
    
    if (project === 'workshop') {
      return path.join('workshop', type, category, filename);
    }
    
    if (project === 'nature') {
      return path.join('nature-collection', type, filename);
    }
    
    // Regular projects
    if (type === 'videos') {
      return path.join('projects', project, 'videos', filename);
    } else {
      return path.join('projects', project, 'images', category, filename);
    }
  }

  async processFiles(files) {
    console.log(`🔄 Processing ${files.length} files...`);
    
    // Group files by project for sequential numbering
    const filesByProject = {};
    
    for (const file of files) {
      const categorization = this.categorizeFile(file);
      const projectKey = `${categorization.project}_${categorization.category}_${categorization.type}`;
      
      if (!filesByProject[projectKey]) {
        filesByProject[projectKey] = [];
      }
      
      filesByProject[projectKey].push({ file, categorization });
    }

    // Process each project group
    for (const [projectKey, projectFiles] of Object.entries(filesByProject)) {
      console.log(`\n📁 Processing ${projectKey}: ${projectFiles.length} files`);
      
      let sequence = 1;
      for (const { file, categorization } of projectFiles) {
        await this.processFile(file, categorization, sequence);
        sequence++;
      }
    }
  }

  async processFile(file, categorization, sequence) {
    try {
      const newFilename = this.generateNewFilename(file, categorization, sequence);
      const newRelativePath = this.generateNewPath(categorization, newFilename);
      const oldFullPath = path.join(CONFIG.mediaDir, file.relativePath);
      const newFullPath = path.join(CONFIG.mediaDir, newRelativePath);

      // Log the move
      const moveRecord = {
        oldPath: file.relativePath,
        newPath: newRelativePath,
        oldFilename: file.fileName,
        newFilename: newFilename,
        project: categorization.project,
        category: categorization.category,
        type: categorization.type,
        sequence: sequence
      };

      this.organizationLog.moves.push(moveRecord);

      if (CONFIG.dryRun) {
        console.log(`  📝 DRY RUN: ${file.fileName} → ${newFilename}`);
      } else {
        // Ensure target directory exists
        await fs.mkdir(path.dirname(newFullPath), { recursive: true });
        
        // Move the file
        await fs.rename(oldFullPath, newFullPath);
        console.log(`  ✅ MOVED: ${file.fileName} → ${newFilename}`);
      }

      this.organizationLog.processedFiles++;
    } catch (error) {
      console.error(`  ❌ ERROR processing ${file.fileName}:`, error.message);
      this.organizationLog.errors.push({
        file: file.fileName,
        error: error.message
      });
    }
  }

  async generateSummary() {
    // Count files by project
    const projectCounts = {};
    for (const move of this.organizationLog.moves) {
      if (!projectCounts[move.project]) {
        projectCounts[move.project] = { images: 0, videos: 0, total: 0 };
      }
      
      if (move.type === 'images') {
        projectCounts[move.project].images++;
      } else {
        projectCounts[move.project].videos++;
      }
      projectCounts[move.project].total++;
    }

    this.organizationLog.summary = {
      projectCounts,
      totalProcessed: this.organizationLog.processedFiles,
      totalErrors: this.organizationLog.errors.length,
      successRate: ((this.organizationLog.processedFiles / this.organizationLog.totalFiles) * 100).toFixed(2)
    };
  }

  async saveLog() {
    await fs.writeFile(CONFIG.logFile, JSON.stringify(this.organizationLog, null, 2));
    console.log(`\n📄 Organization log saved to: ${CONFIG.logFile}`);
  }

  async run() {
    console.log('🚀 Starting Master Media Organization');
    console.log('=====================================');
    console.log(`📁 Media directory: ${CONFIG.mediaDir}`);
    console.log(`💾 Backup directory: ${CONFIG.backupDir}`);
    console.log(`🔍 Dry run mode: ${CONFIG.dryRun ? 'ENABLED' : 'DISABLED'}`);
    
    if (CONFIG.dryRun) {
      console.log('⚠️  DRY RUN MODE: No files will be moved. Review the log, then set dryRun: false');
    }

    try {
      // Step 1: Load file inventory
      const files = await this.loadFileInventory();
      this.organizationLog.totalFiles = files.length;

      // Step 2: Create organized structure
      await this.createOrganizedStructure();

      // Step 3: Process all files
      await this.processFiles(files);

      // Step 4: Generate summary
      await this.generateSummary();

      // Step 5: Save log
      await this.saveLog();

      // Step 6: Display results
      console.log('\n✅ Organization Complete!');
      console.log('========================');
      console.log(`📊 Total files: ${this.organizationLog.totalFiles}`);
      console.log(`✅ Processed: ${this.organizationLog.processedFiles}`);
      console.log(`❌ Errors: ${this.organizationLog.errors.length}`);
      console.log(`📈 Success rate: ${this.organizationLog.summary.successRate}%`);

      console.log('\n📁 Project Distribution:');
      for (const [project, counts] of Object.entries(this.organizationLog.summary.projectCounts)) {
        console.log(`   ${project}: ${counts.total} files (${counts.images} images, ${counts.videos} videos)`);
      }

      if (CONFIG.dryRun) {
        console.log('\n🔄 Next steps:');
        console.log('   1. Review the organization log file');
        console.log('   2. Set CONFIG.dryRun = false in this script');
        console.log('   3. Run the script again to perform actual file moves');
      } else {
        console.log('\n🎉 All files have been organized!');
        console.log('   Next: Update code references in media-real.ts and components');
      }

    } catch (error) {
      console.error('❌ Organization failed:', error);
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the organizer
const organizer = new MediaOrganizer();
organizer.run();
