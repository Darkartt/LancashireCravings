const fs = require('fs');
const path = require('path');

// Complete inventory scanner for all media files
class MasterInventoryScanner {
    constructor() {
        this.mediaPath = path.join(__dirname, '../public/media');
        this.publicPath = path.join(__dirname, '../public');
        this.allFiles = [];
        this.imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg'];
        this.videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
        this.stats = {
            totalFiles: 0,
            totalImages: 0,
            totalVideos: 0,
            totalSize: 0,
            folderCounts: {},
            extensionCounts: {},
            duplicates: []
        };
    }

    // Recursively scan all directories
    scanDirectory(dirPath, relativePath = '') {
        try {
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const relativeItemPath = path.join(relativePath, item);
                
                try {
                    const stats = fs.statSync(fullPath);
                    
                    if (stats.isDirectory()) {
                        // Recursively scan subdirectories
                        this.scanDirectory(fullPath, relativeItemPath);
                    } else {
                        // Process files
                        this.processFile(fullPath, relativeItemPath, stats);
                    }
                } catch (error) {
                    console.warn(`Error processing ${fullPath}:`, error.message);
                }
            }
        } catch (error) {
            console.warn(`Error scanning directory ${dirPath}:`, error.message);
        }
    }

    // Process individual files
    processFile(fullPath, relativePath, stats) {
        const ext = path.extname(relativePath).toLowerCase();
        const isImage = this.imageExtensions.includes(ext);
        const isVideo = this.videoExtensions.includes(ext);
        
        if (isImage || isVideo) {
            const fileInfo = {
                fullPath: fullPath,
                relativePath: relativePath,
                fileName: path.basename(relativePath),
                directory: path.dirname(relativePath),
                extension: ext,
                size: stats.size,
                sizeFormatted: this.formatBytes(stats.size),
                modifiedDate: stats.mtime,
                isImage: isImage,
                isVideo: isVideo,
                type: isImage ? 'image' : 'video'
            };
            
            this.allFiles.push(fileInfo);
            this.updateStats(fileInfo);
        }
    }

    // Update statistics
    updateStats(fileInfo) {
        this.stats.totalFiles++;
        this.stats.totalSize += fileInfo.size;
        
        if (fileInfo.isImage) {
            this.stats.totalImages++;
        } else if (fileInfo.isVideo) {
            this.stats.totalVideos++;
        }
        
        // Count by folder
        const topFolder = fileInfo.directory.split(path.sep)[0] || 'root';
        this.stats.folderCounts[topFolder] = (this.stats.folderCounts[topFolder] || 0) + 1;
        
        // Count by extension
        this.stats.extensionCounts[fileInfo.extension] = (this.stats.extensionCounts[fileInfo.extension] || 0) + 1;
    }

    // Format bytes to human readable
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Find potential duplicates based on filename
    findDuplicates() {
        const nameMap = {};
        
        this.allFiles.forEach(file => {
            const name = file.fileName.toLowerCase();
            if (nameMap[name]) {
                nameMap[name].push(file);
            } else {
                nameMap[name] = [file];
            }
        });
        
        this.stats.duplicates = Object.values(nameMap).filter(group => group.length > 1);
    }

    // Generate comprehensive report
    generateReport() {
        const report = {
            scanDate: new Date().toISOString(),
            totalFiles: this.stats.totalFiles,
            totalImages: this.stats.totalImages,
            totalVideos: this.stats.totalVideos,
            totalSize: this.stats.totalSize,
            totalSizeFormatted: this.formatBytes(this.stats.totalSize),
            folderDistribution: this.stats.folderCounts,
            extensionDistribution: this.stats.extensionCounts,
            duplicateGroups: this.stats.duplicates.length,
            duplicateFiles: this.stats.duplicates.reduce((sum, group) => sum + group.length, 0),
            allFiles: this.allFiles,
            duplicates: this.stats.duplicates
        };
        
        return report;
    }

    // Run complete scan
    async runScan() {
        console.log('🔍 Starting comprehensive media scan...');
        console.log(`📁 Scanning: ${this.mediaPath}`);
        console.log(`📁 Also scanning: ${this.publicPath} (for loose files)`);
        
        // Scan main media directory
        if (fs.existsSync(this.mediaPath)) {
            this.scanDirectory(this.mediaPath, 'media');
        }
        
        // Scan public directory for loose files
        if (fs.existsSync(this.publicPath)) {
            const publicItems = fs.readdirSync(this.publicPath);
            for (const item of publicItems) {
                const fullPath = path.join(this.publicPath, item);
                const stats = fs.statSync(fullPath);
                
                if (stats.isFile()) {
                    this.processFile(fullPath, item, stats);
                }
            }
        }
        
        console.log(`📊 Found ${this.allFiles.length} media files`);
        
        // Find duplicates
        this.findDuplicates();
        
        // Generate report
        const report = this.generateReport();
        
        // Save inventory
        const inventoryPath = path.join(__dirname, '../master-inventory.json');
        fs.writeFileSync(inventoryPath, JSON.stringify(report, null, 2));
        
        // Save summary
        const summaryPath = path.join(__dirname, '../master-inventory-summary.json');
        const summary = {
            scanDate: report.scanDate,
            totalFiles: report.totalFiles,
            totalImages: report.totalImages,
            totalVideos: report.totalVideos,
            totalSizeFormatted: report.totalSizeFormatted,
            folderDistribution: report.folderDistribution,
            extensionDistribution: report.extensionDistribution,
            duplicateGroups: report.duplicateGroups,
            duplicateFiles: report.duplicateFiles
        };
        fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
        
        console.log('\n📋 SCAN COMPLETE!');
        console.log(`📁 Total files: ${report.totalFiles}`);
        console.log(`🖼️  Images: ${report.totalImages}`);
        console.log(`🎥 Videos: ${report.totalVideos}`);
        console.log(`💾 Total size: ${report.totalSizeFormatted}`);
        console.log(`🔍 Duplicate groups: ${report.duplicateGroups}`);
        console.log(`📄 Inventory saved to: ${inventoryPath}`);
        console.log(`📊 Summary saved to: ${summaryPath}`);
        
        return report;
    }
}

// Run the scanner
if (require.main === module) {
    const scanner = new MasterInventoryScanner();
    scanner.runScan().catch(console.error);
}

module.exports = MasterInventoryScanner;
