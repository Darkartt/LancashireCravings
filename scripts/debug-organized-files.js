const fs = require('fs');
const path = require('path');

// Debug script to check what files are being found
class DebugFileChecker {
    constructor() {
        this.mediaPath = path.join(__dirname, '../public/media');
        this.targetFolders = ['projects', 'nature', 'workshop'];
        this.imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
        this.foundFiles = [];
    }

    scanAndDebug() {
        console.log('🔍 Debug scan of organized folders...');
        
        for (const folder of this.targetFolders) {
            const folderPath = path.join(this.mediaPath, folder);
            console.log(`\n📁 Checking ${folder} at: ${folderPath}`);
            
            if (fs.existsSync(folderPath)) {
                this.scanDirectoryDebug(folderPath, folder, 0);
            } else {
                console.log(`❌ Folder not found: ${folderPath}`);
            }
        }
        
        console.log(`\n📊 Total files found: ${this.foundFiles.length}`);
        console.log('\n🔍 First 10 files:');
        this.foundFiles.slice(0, 10).forEach((file, index) => {
            console.log(`${index + 1}. ${file.fileName}`);
            console.log(`   Path: ${file.relativePath}`);
            console.log(`   Full: ${file.fullPath}`);
            console.log(`   Exists: ${fs.existsSync(file.fullPath)}`);
            console.log('');
        });
    }

    scanDirectoryDebug(dirPath, relativePath, depth) {
        if (depth > 5) return; // Prevent infinite recursion
        
        try {
            const items = fs.readdirSync(dirPath);
            console.log(`${'  '.repeat(depth)}📂 ${relativePath} (${items.length} items)`);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const relativeItemPath = path.join(relativePath, item);
                
                try {
                    const stats = fs.statSync(fullPath);
                    
                    if (stats.isDirectory()) {
                        if (item.includes('archive') || item.includes('backup') || item.includes('original-files')) {
                            console.log(`${'  '.repeat(depth + 1)}⏭️  Skipping: ${item}`);
                            continue;
                        }
                        this.scanDirectoryDebug(fullPath, relativeItemPath, depth + 1);
                    } else {
                        const ext = path.extname(item).toLowerCase();
                        if (this.imageExtensions.includes(ext)) {
                            this.foundFiles.push({
                                fullPath: fullPath,
                                relativePath: relativeItemPath.replace(/\\/g, '/'),
                                fileName: item,
                                directory: path.dirname(relativeItemPath),
                                extension: ext,
                                size: stats.size
                            });
                            console.log(`${'  '.repeat(depth + 1)}🖼️  ${item} (${this.formatBytes(stats.size)})`);
                        }
                    }
                } catch (error) {
                    console.warn(`${'  '.repeat(depth + 1)}❌ Error: ${item} - ${error.message}`);
                }
            }
        } catch (error) {
            console.warn(`❌ Error scanning ${dirPath}: ${error.message}`);
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Run the debug check
const checker = new DebugFileChecker();
checker.scanAndDebug();
