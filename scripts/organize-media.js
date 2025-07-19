#!/usr/bin/env node

/**
 * File Organization Script
 * Systematically organizes and renames media files based on analysis
 */

const fs = require('fs').promises;
const path = require('path');

class MediaOrganizer {
  constructor() {
    this.mediaDir = path.join(process.cwd(), 'public', 'media');
    this.organizationRules = this.createOrganizationRules();
    this.processed = { success: 0, skipped: 0, errors: 0 };
    this.log = [];
  }

  createOrganizationRules() {
    return {
      // Golden Eagle Project - IMG_2056 to IMG_3217 range
      eagle: {
        sourcePatterns: [
          { folder: 'Eagle', pattern: /^IMG_([2-3]\d{3})\.(jpg|jpeg|mov|mp4)$/i },
          { folder: 'Eagle', pattern: /eagle/i }
        ],
        targetFolder: 'projects/eagle',
        getCategory: (filename) => {
          // Last 10 files are considered final
          const match = filename.match(/IMG_(\d+)/i);
          if (match) {
            const num = parseInt(match[1]);
            return num >= 3200 ? 'final' : 'process';
          }
          return 'process';
        }
      },

      // Nessie Project - IMG_1498 to IMG_1559 range  
      nessie: {
        sourcePatterns: [
          { folder: 'Nessie', pattern: /^IMG_(14[5-9]\d|15[0-5]\d)\.(jpg|jpeg|mov|mp4)$/i },
          { folder: 'Nessie', pattern: /nessie/i }
        ],
        targetFolder: 'projects/nessie',
        getCategory: (filename) => {
          const match = filename.match(/IMG_(\d+)/i);
          if (match) {
            const num = parseInt(match[1]);
            return num >= 1550 ? 'final' : 'process';
          }
          return 'process';
        }
      },

      // Richard Peacock Bass
      bass: {
        sourcePatterns: [
          { folder: 'Richard Peacock Bass', pattern: /\.(jpg|jpeg|mov|mp4)$/i }
        ],
        targetFolder: 'projects/bass',
        getCategory: (filename) => 'process' // Most files are process
      },

      // St Collen Statue
      stcollen: {
        sourcePatterns: [
          { folder: 'St Collen statue', pattern: /\.(jpg|jpeg|mov|mp4)$/i }
        ],
        targetFolder: 'projects/stcollen',
        getCategory: (filename) => {
          // Files with higher numbers tend to be more finished
          const match = filename.match(/IMG_(\d+)/i);
          if (match) {
            const num = parseInt(match[1]);
            return num >= 800 ? 'final' : 'process';
          }
          return 'process';
        }
      },

      // Workshop content from iCloud folders
      workshop: {
        sourcePatterns: [
          { folder: 'iCloud Photos from Christian Lancaster', pattern: /\.(jpg|jpeg|mov|mp4)$/i },
          { folder: 'iCloud Photos from Christian Lancaster (1)', pattern: /\.(jpg|jpeg|mov|mp4)$/i }
        ],
        targetFolder: 'workshop',
        getCategory: (filename) => {
          if (filename.toLowerCase().includes('tool')) return 'tools';
          if (filename.toLowerCase().includes('work')) return 'techniques';
          return 'environment';
        }
      },

      // Nature collection from numbered folders
      nature: {
        sourcePatterns: [
          { folder: '1', pattern: /butterfly|dragonfly|fish|nature/i },
          { folder: '2', pattern: /butterfly|dragonfly|fish|nature/i },
          { folder: '3', pattern: /butterfly|dragonfly|fish|nature/i },
          { folder: '4', pattern: /butterfly|dragonfly|fish|nature/i },
          { folder: '5', pattern: /butterfly|dragonfly|fish|nature/i },
          { folder: '6', pattern: /butterfly|dragonfly|fish|nature/i }
        ],
        targetFolder: 'nature-collection',
        getCategory: () => 'images'
      }
    };
  }

  generateNewFilename(originalName, project, category, sequence, fileType) {
    const ext = path.extname(originalName).toLowerCase();
    
    // Determine subcategory for more specific naming
    let subcategory = '';
    const lower = originalName.toLowerCase();
    
    if (project === 'eagle') {
      if (category === 'process') {
        const match = originalName.match(/IMG_(\d+)/i);
        if (match) {
          const num = parseInt(match[1]);
          if (num < 2200) subcategory = 'roughing';
          else if (num < 2800) subcategory = 'carving';
          else if (num < 3100) subcategory = 'detailing';
          else subcategory = 'finishing';
        }
      } else {
        subcategory = 'showcase';
      }
    } else if (project === 'nessie') {
      if (category === 'process') {
        subcategory = 'carving';
      } else {
        subcategory = 'showcase';
      }
    } else if (project === 'bass') {
      subcategory = 'carving';
    } else if (project === 'stcollen') {
      if (category === 'process') {
        subcategory = 'carving';
      } else {
        subcategory = 'showcase';
      }
    } else if (project === 'workshop') {
      subcategory = category; // tools, techniques, environment
    } else if (project === 'nature') {
      if (lower.includes('butterfly')) subcategory = 'butterfly';
      else if (lower.includes('dragonfly')) subcategory = 'dragonfly';
      else if (lower.includes('fish')) subcategory = 'fish';
      else subcategory = 'mixed';
    }

    const paddedSequence = sequence.toString().padStart(3, '0');
    return `${project}_${category}_${subcategory}_${paddedSequence}${ext}`;
  }

  async organizeFiles() {
    console.log('🚀 Starting file organization...\n');

    for (const [projectName, rules] of Object.entries(this.organizationRules)) {
      console.log(`📁 Processing ${projectName} project...`);
      
      let projectSequence = { process: 1, final: 1, tools: 1, techniques: 1, environment: 1, images: 1, videos: 1 };

      for (const pattern of rules.sourcePatterns) {
        const sourcePath = path.join(this.mediaDir, pattern.folder);
        
        try {
          const exists = await fs.access(sourcePath).then(() => true).catch(() => false);
          if (!exists) {
            console.log(`⚠️ Source folder not found: ${pattern.folder}`);
            continue;
          }

          const files = await fs.readdir(sourcePath);
          
          for (const file of files) {
            if (file === 'iCloud Photos from Christian Lancaster') {
              // Handle nested folders
              const nestedPath = path.join(sourcePath, file);
              const nestedFiles = await fs.readdir(nestedPath);
              
              for (const nestedFile of nestedFiles) {
                if (pattern.pattern.test(nestedFile)) {
                  await this.processFile(
                    path.join(nestedPath, nestedFile),
                    nestedFile,
                    projectName,
                    rules,
                    projectSequence
                  );
                }
              }
            } else if (pattern.pattern.test(file)) {
              await this.processFile(
                path.join(sourcePath, file),
                file,
                projectName,
                rules,
                projectSequence
              );
            }
          }
        } catch (error) {
          console.error(`❌ Error processing ${pattern.folder}:`, error.message);
          this.processed.errors++;
        }
      }
      
      console.log(`✅ ${projectName} project complete\n`);
    }

    this.printSummary();
  }

  async processFile(sourceFilePath, originalFilename, projectName, rules, sequence) {
    try {
      const fileType = this.getFileType(originalFilename);
      const category = rules.getCategory(originalFilename);
      
      // Determine sequence number based on category
      let seqNum;
      if (category === 'process' || category === 'final') {
        seqNum = sequence[category]++;
      } else {
        seqNum = sequence[category] ? sequence[category]++ : (sequence.images++);
      }

      const newFilename = this.generateNewFilename(
        originalFilename, 
        projectName, 
        category, 
        seqNum, 
        fileType
      );

      // Determine target directory
      let targetDir;
      if (fileType === 'video') {
        targetDir = path.join(this.mediaDir, rules.targetFolder, 'videos');
      } else if (projectName === 'workshop') {
        targetDir = path.join(this.mediaDir, rules.targetFolder, 'images', category);
      } else if (projectName === 'nature') {
        targetDir = path.join(this.mediaDir, rules.targetFolder, 'images');
      } else {
        targetDir = path.join(this.mediaDir, rules.targetFolder, 'images', category);
      }

      const targetFilePath = path.join(targetDir, newFilename);

      // Check if source file exists and target doesn't
      const sourceExists = await fs.access(sourceFilePath).then(() => true).catch(() => false);
      const targetExists = await fs.access(targetFilePath).then(() => true).catch(() => false);

      if (!sourceExists) {
        console.log(`⚠️ Source file not found: ${sourceFilePath}`);
        this.processed.skipped++;
        return;
      }

      if (targetExists) {
        console.log(`⚠️ Target already exists: ${newFilename}`);
        this.processed.skipped++;
        return;
      }

      // Create target directory if it doesn't exist
      await fs.mkdir(targetDir, { recursive: true });

      // Copy file to new location with new name
      await fs.copyFile(sourceFilePath, targetFilePath);

      console.log(`✅ ${originalFilename} → ${newFilename}`);
      this.log.push({
        original: sourceFilePath,
        new: targetFilePath,
        project: projectName,
        category: category
      });
      this.processed.success++;

    } catch (error) {
      console.error(`❌ Failed to process ${originalFilename}:`, error.message);
      this.processed.errors++;
    }
  }

  getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv'];
    return videoExts.includes(ext) ? 'video' : 'image';
  }

  printSummary() {
    console.log('\n📊 ORGANIZATION SUMMARY');
    console.log('========================');
    console.log(`✅ Successfully processed: ${this.processed.success}`);
    console.log(`⚠️ Skipped: ${this.processed.skipped}`);
    console.log(`❌ Errors: ${this.processed.errors}`);
    console.log(`📄 Total operations: ${this.processed.success + this.processed.skipped + this.processed.errors}`);

    // Save processing log
    fs.writeFile(
      'media-organization-log.json',
      JSON.stringify(this.log, null, 2)
    );
    console.log('\n📄 Detailed log saved to: media-organization-log.json');
  }
}

// Run organization
const organizer = new MediaOrganizer();
organizer.organizeFiles()
  .then(() => {
    console.log('\n🎉 File organization complete!');
  })
  .catch(error => {
    console.error('💥 Organization failed:', error);
  });
