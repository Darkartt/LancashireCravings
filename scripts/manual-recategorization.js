const fs = require('fs').promises;
const path = require('path');

/**
 * Manual File Recategorization Helper
 * This script helps you manually move files to correct project folders
 * based on actual image content
 */

class FileRecategorizer {
  constructor() {
    this.moveLog = [];
    this.projects = ['stcollen', 'eagle', 'bass', 'nessie'];
    this.categories = ['process', 'final'];
  }

  async listProjectFiles(projectName) {
    const projectPath = `public/media/projects/${projectName}/images`;
    console.log(`\n📁 Files in ${projectName} project:`);
    
    try {
      const files = await this.scanForImages(projectPath);
      files.forEach((file, index) => {
        const relativePath = file.replace('public/', '');
        console.log(`   ${index + 1}. ${relativePath}`);
      });
      return files;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      return [];
    }
  }

  async scanForImages(folderPath) {
    const imageFiles = [];
    
    try {
      const items = await fs.readdir(folderPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(folderPath, item.name);
        
        if (item.isDirectory() && !['process', 'final'].includes(item.name)) {
          const subFiles = await this.scanForImages(fullPath);
          imageFiles.push(...subFiles);
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            imageFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Folder doesn't exist or can't be accessed
    }
    
    return imageFiles;
  }

  async moveFile(sourceFile, targetProject, category = 'process') {
    try {
      const fileName = path.basename(sourceFile);
      const targetDir = `public/media/projects/${targetProject}/images/${category}`;
      const targetFile = path.join(targetDir, fileName);
      
      // Ensure target directory exists
      await fs.mkdir(targetDir, { recursive: true });
      
      // Move the file
      await fs.rename(sourceFile, targetFile);
      
      const moveRecord = {
        from: sourceFile,
        to: targetFile,
        project: targetProject,
        category: category,
        timestamp: new Date().toISOString()
      };
      
      this.moveLog.push(moveRecord);
      console.log(`✅ Moved: ${fileName} → ${targetProject}/${category}`);
      
      return true;
    } catch (error) {
      console.log(`❌ Error moving file: ${error.message}`);
      return false;
    }
  }

  async moveMisplacedFiles() {
    console.log(`\n🔧 MANUAL FILE RECATEGORIZATION TOOL`);
    console.log(`=====================================\n`);
    
    // Instructions
    console.log(`📋 INSTRUCTIONS:`);
    console.log(`1. Review the files listed below`);
    console.log(`2. Open suspicious files in an image viewer`);
    console.log(`3. Use the helper functions to move files:`);
    console.log(`   - moveStCollenFishToNature() - moves fish images from St Collen to nature`);
    console.log(`   - moveBassToStCollen() - moves bass/fish images to correct project`);
    console.log(`   - moveEagleToStCollen() - moves eagle images if misplaced`);
    console.log(`\n4. After manual review, run the specific move functions\n`);

    // List all current files
    for (const project of this.projects) {
      await this.listProjectFiles(project);
    }
  }

  // Helper function to move fish/sea creature images from St Collen to nature
  async moveStCollenFishToNature() {
    console.log(`\n🐟 Moving fish/sea creature images from St Collen to nature...`);
    
    const stcollenFiles = await this.scanForImages('public/media/projects/stcollen/images');
    const natureFishDir = 'public/media/nature/fish/images';
    
    // Ensure nature fish directory exists
    await fs.mkdir(natureFishDir, { recursive: true });
    
    let moveCount = 0;
    for (const file of stcollenFiles) {
      const fileName = path.basename(file);
      const targetFile = path.join(natureFishDir, fileName.replace('stcollen_stcollen', 'fish_display'));
      
      try {
        await fs.rename(file, targetFile);
        console.log(`✅ Moved fish image: ${fileName} → nature/fish/`);
        moveCount++;
      } catch (error) {
        console.log(`❌ Error moving ${fileName}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Moved ${moveCount} files from St Collen to nature/fish`);
  }

  // Helper function to move bass images to St Collen if they're actually statue images
  async moveBassToStCollen() {
    console.log(`\n🗿 Moving bass images to St Collen (if they're actually statue images)...`);
    
    const bassFiles = await this.scanForImages('public/media/projects/bass/images');
    const stcollenProcessDir = 'public/media/projects/stcollen/images/process';
    
    // Ensure St Collen process directory exists
    await fs.mkdir(stcollenProcessDir, { recursive: true });
    
    let moveCount = 0;
    for (const file of bassFiles) {
      const fileName = path.basename(file);
      const targetFile = path.join(stcollenProcessDir, fileName.replace('bass_bass', 'stcollen_process'));
      
      try {
        await fs.rename(file, targetFile);
        console.log(`✅ Moved statue image: ${fileName} → stcollen/process/`);
        moveCount++;
      } catch (error) {
        console.log(`❌ Error moving ${fileName}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Moved ${moveCount} files from bass to St Collen`);
  }

  // Save move log
  async saveMoveLog() {
    const logPath = 'file-recategorization-log.json';
    await fs.writeFile(logPath, JSON.stringify(this.moveLog, null, 2));
    console.log(`\n📄 Move log saved to: ${logPath}`);
  }

  // Generate new media file after recategorization
  async regenerateMediaFile() {
    console.log(`\n🔄 Regenerating media-organized.ts file...`);
    
    try {
      // Run the media generation script
      const { spawn } = require('child_process');
      const child = spawn('node', ['scripts/generate-updated-media-file.js'], { stdio: 'inherit' });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Media file regenerated successfully!`);
        } else {
          console.log(`❌ Error regenerating media file`);
        }
      });
    } catch (error) {
      console.log(`❌ Error running media generation: ${error.message}`);
    }
  }
}

// Export for use in Node.js REPL or other scripts
if (require.main === module) {
  const recategorizer = new FileRecategorizer();
  
  // You can uncomment and run specific functions based on what you find:
  
  // 1. First, list all files to review them manually
  recategorizer.moveMisplacedFiles();
  
  // 2. After manual review, run specific moves:
  // recategorizer.moveStCollenFishToNature();
  // recategorizer.moveBassToStCollen();
  // recategorizer.regenerateMediaFile();
  
} else {
  module.exports = FileRecategorizer;
}

console.log(`\n💡 TO USE THIS TOOL:`);
console.log(`1. First run: node scripts/manual-recategorization.js`);
console.log(`2. Review the file lists and open suspicious files in image viewer`);
console.log(`3. Edit this script to uncomment the appropriate move functions`);
console.log(`4. Run again to execute the moves`);
console.log(`5. Finally run the media regeneration`);
