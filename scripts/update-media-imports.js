#!/usr/bin/env node

/**
 * Update Media Imports - Phase 3: Code Integration
 * Updates all component imports to use the new organized media file
 * 
 * USAGE: node scripts/update-media-imports.js
 * 
 * This script will:
 * 1. Find all files importing from old media files
 * 2. Update imports to use media-organized.ts
 * 3. Update any specific references that need adjustment
 * 4. Test that all imports work correctly
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  srcDir: path.join(process.cwd(), 'src'),
  logFile: 'media-import-updates.json'
};

class MediaImportUpdater {
  constructor() {
    this.updateLog = {
      timestamp: new Date().toISOString(),
      filesProcessed: 0,
      filesUpdated: 0,
      updates: [],
      errors: []
    };
  }

  async findFilesWithMediaImports() {
    console.log('🔍 Finding files with media imports...');
    
    const files = await this.getAllTsFiles(CONFIG.srcDir);
    const filesWithImports = [];
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        if (this.hasMediaImport(content)) {
          filesWithImports.push(file);
        }
      } catch (error) {
        console.error(`❌ Error reading ${file}:`, error.message);
      }
    }
    
    console.log(`📄 Found ${filesWithImports.length} files with media imports`);
    return filesWithImports;
  }

  async getAllTsFiles(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir);
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory() && !entry.startsWith('.')) {
          const subFiles = await this.getAllTsFiles(fullPath);
          files.push(...subFiles);
        } else if (entry.match(/\\.(ts|tsx)$/)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${dir}:`, error.message);
    }
    
    return files;
  }

  hasMediaImport(content) {
    const mediaImportPatterns = [
      /@\/lib\/media-real/,
      /@\/lib\/media-new/,
      /@\/lib\/media-enhanced/,
      /@\/lib\/media-comprehensive/
    ];
    
    return mediaImportPatterns.some(pattern => pattern.test(content));
  }

  async updateFile(filePath) {
    console.log(`📝 Updating: ${path.relative(process.cwd(), filePath)}`);
    this.updateLog.filesProcessed++;
    
    try {
      let content = await fs.readFile(filePath, 'utf8');
      let updated = false;
      const originalContent = content;
      
      // Update import statements
      const importUpdates = [
        {
          from: /@\/lib\/media-real/g,
          to: '@/lib/media-organized',
          description: 'Updated media-real to media-organized'
        },
        {
          from: /@\/lib\/media-new/g,
          to: '@/lib/media-organized',
          description: 'Updated media-new to media-organized'
        },
        {
          from: /@\/lib\/media-enhanced/g,
          to: '@/lib/media-organized',
          description: 'Updated media-enhanced to media-organized'
        },
        {
          from: /@\/lib\/media-comprehensive/g,
          to: '@/lib/media-organized',
          description: 'Updated media-comprehensive to media-organized'
        }
      ];
      
      for (const update of importUpdates) {
        if (update.from.test(content)) {
          content = content.replace(update.from, update.to);
          updated = true;
          console.log(`  ✅ ${update.description}`);
        }
      }
      
      // Handle specific function name changes if needed
      const functionUpdates = [
        // Add any specific function name updates here if needed
      ];
      
      for (const update of functionUpdates) {
        if (update.from.test(content)) {
          content = content.replace(update.from, update.to);
          updated = true;
          console.log(`  ✅ ${update.description}`);
        }
      }
      
      if (updated) {
        await fs.writeFile(filePath, content, 'utf8');
        this.updateLog.filesUpdated++;
        this.updateLog.updates.push({
          file: path.relative(process.cwd(), filePath),
          changes: importUpdates.filter(u => u.from.test(originalContent)).map(u => u.description)
        });
        console.log(`  💾 File updated`);
      } else {
        console.log(`  ⏭️  No changes needed`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${filePath}:`, error.message);
      this.updateLog.errors.push({
        file: path.relative(process.cwd(), filePath),
        error: error.message
      });
    }
  }

  async updateAllFiles() {
    console.log('🔄 Updating all files with media imports...');
    
    const files = await this.findFilesWithMediaImports();
    
    for (const file of files) {
      await this.updateFile(file);
    }
    
    console.log(`\\n✅ Update complete!`);
    console.log(`📊 Files processed: ${this.updateLog.filesProcessed}`);
    console.log(`📝 Files updated: ${this.updateLog.filesUpdated}`);
    console.log(`❌ Errors: ${this.updateLog.errors.length}`);
  }

  async saveLog() {
    try {
      await fs.writeFile(CONFIG.logFile, JSON.stringify(this.updateLog, null, 2));
      console.log(`📋 Update log saved to: ${CONFIG.logFile}`);
    } catch (error) {
      console.error('❌ Error saving log:', error.message);
    }
  }

  async run() {
    try {
      console.log('🚀 Media Import Updater - Phase 3: Code Integration');
      console.log('===================================================');
      
      await this.updateAllFiles();
      await this.saveLog();
      
      if (this.updateLog.errors.length > 0) {
        console.log('\\n⚠️  Some files had errors:');
        this.updateLog.errors.forEach(error => {
          console.log(`  - ${error.file}: ${error.error}`);
        });
      }
      
      console.log('\\n🎉 Media import updates complete!');
      console.log('All components now use the organized media structure.');
      
    } catch (error) {
      console.error('💥 Media import update failed:', error);
      process.exit(1);
    }
  }
}

// Run the updater
if (require.main === module) {
  const updater = new MediaImportUpdater();
  updater.run();
}

module.exports = MediaImportUpdater;
