const fs = require('fs');
const path = require('path');

/**
 * Smart File Mover - Execute file moves based on manual review
 * This script will help move files to their correct categories after manual review
 */

class SmartFileMover {
    constructor() {
        this.mediaDir = path.join(__dirname, '../public/media');
        this.moves = [];
        this.dryRun = true; // Safe mode by default
        this.logFile = path.join(__dirname, '../file-move-log.json');
    }

    /**
     * Add a file move to the queue
     * @param {string} sourceFile - Current file path (relative to media dir)
     * @param {string} targetCategory - Target category (e.g., 'nature/fish')
     * @param {string} reason - Reason for the move
     */
    addMove(sourceFile, targetCategory, reason = '') {
        this.moves.push({
            source: sourceFile,
            target: targetCategory,
            reason: reason,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Process all queued moves
     */
    async executeMoves() {
        if (this.moves.length === 0) {
            console.log('No moves queued');
            return;
        }

        console.log(`\n${this.dryRun ? '🔍 DRY RUN' : '🚚 EXECUTING'} ${this.moves.length} file moves...`);
        
        const results = {
            successful: 0,
            failed: 0,
            errors: [],
            moves: []
        };

        for (const move of this.moves) {
            try {
                const result = await this.executeMove(move);
                results.moves.push(result);
                if (result.success) {
                    results.successful++;
                } else {
                    results.failed++;
                    results.errors.push(result.error);
                }
            } catch (error) {
                console.error(`Error processing move: ${error.message}`);
                results.failed++;
                results.errors.push(error.message);
            }
        }

        // Save results to log file
        const logEntry = {
            timestamp: new Date().toISOString(),
            dryRun: this.dryRun,
            totalMoves: this.moves.length,
            results: results
        };

        this.saveLog(logEntry);
        this.printResults(results);
        
        return results;
    }

    async executeMove(move) {
        const sourcePath = path.join(this.mediaDir, move.source);
        const sourceDir = path.dirname(sourcePath);
        const filename = path.basename(sourcePath);
        
        // Generate new filename based on target category
        const newFilename = this.generateNewFilename(filename, move.target);
        const targetDir = path.join(this.mediaDir, move.target);
        const targetPath = path.join(targetDir, newFilename);

        const result = {
            source: move.source,
            target: path.relative(this.mediaDir, targetPath),
            reason: move.reason,
            success: false,
            error: null
        };

        try {
            // Check if source file exists
            if (!fs.existsSync(sourcePath)) {
                throw new Error(`Source file does not exist: ${sourcePath}`);
            }

            // Create target directory if it doesn't exist
            if (!this.dryRun) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            // Check if target file already exists
            if (fs.existsSync(targetPath)) {
                const uniqueTarget = this.generateUniqueFilename(targetPath);
                result.target = path.relative(this.mediaDir, uniqueTarget);
                console.log(`⚠️  Target exists, using: ${path.basename(uniqueTarget)}`);
            }

            if (this.dryRun) {
                console.log(`📋 WOULD MOVE: ${move.source} -> ${result.target}`);
            } else {
                fs.renameSync(sourcePath, targetPath);
                console.log(`✅ MOVED: ${move.source} -> ${result.target}`);
            }

            result.success = true;
            return result;

        } catch (error) {
            result.error = error.message;
            console.error(`❌ FAILED: ${move.source} - ${error.message}`);
            return result;
        }
    }

    generateNewFilename(originalFilename, targetCategory) {
        const ext = path.extname(originalFilename);
        const baseName = path.basename(originalFilename, ext);
        
        // Extract category prefix
        const categoryParts = targetCategory.split('/');
        const mainCategory = categoryParts[0]; // e.g., 'nature'
        const subCategory = categoryParts[1] || mainCategory; // e.g., 'fish'
        
        // Keep existing filename if it already has the right prefix
        if (baseName.startsWith(`${subCategory}_`)) {
            return originalFilename;
        }
        
        // Generate new filename with proper prefix
        const timestamp = Date.now();
        return `${subCategory}_${baseName}_${timestamp}${ext}`;
    }

    generateUniqueFilename(filePath) {
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);
        
        let counter = 1;
        let newPath = filePath;
        
        while (fs.existsSync(newPath)) {
            newPath = path.join(dir, `${baseName}_${counter}${ext}`);
            counter++;
        }
        
        return newPath;
    }

    saveLog(logEntry) {
        let existingLogs = [];
        if (fs.existsSync(this.logFile)) {
            existingLogs = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
        }
        existingLogs.push(logEntry);
        fs.writeFileSync(this.logFile, JSON.stringify(existingLogs, null, 2));
    }

    printResults(results) {
        console.log(`\n📊 MOVE RESULTS:`);
        console.log(`✅ Successful: ${results.successful}`);
        console.log(`❌ Failed: ${results.failed}`);
        
        if (results.errors.length > 0) {
            console.log(`\n❌ ERRORS:`);
            results.errors.forEach(error => console.log(`   - ${error}`));
        }
    }

    setDryRun(isDryRun) {
        this.dryRun = isDryRun;
    }

    clearMoves() {
        this.moves = [];
    }
}

// Example usage and helper functions
function createMoveExample() {
    console.log(`
📝 EXAMPLE USAGE:

const mover = new SmartFileMover();

// Add moves based on manual review
mover.addMove('projects/stcollen/stcollen_fish_123.jpg', 'nature/fish', 'Fish image in statue folder');
mover.addMove('projects/stcollen/stcollen_aquatic_456.jpg', 'nature/fish', 'Aquatic life in statue folder');
mover.addMove('nature/fish/fish_statue_789.jpg', 'projects/stcollen', 'Statue image in fish folder');

// Execute moves (dry run first)
mover.setDryRun(true);
await mover.executeMoves();

// If dry run looks good, execute for real
mover.setDryRun(false);
await mover.executeMoves();
`);
}

// Quick inspection functions
function inspectFolder(folderPath) {
    const fullPath = path.join(__dirname, '../public/media', folderPath);
    if (!fs.existsSync(fullPath)) {
        console.log(`❌ Folder does not exist: ${fullPath}`);
        return;
    }

    const files = fs.readdirSync(fullPath);
    const mediaFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|mov|mp4|avi|webm)$/i.test(file)
    );

    console.log(`\n📁 FOLDER: ${folderPath}`);
    console.log(`📊 Total files: ${mediaFiles.length}`);
    console.log(`🔍 First 10 files:`);
    
    mediaFiles.slice(0, 10).forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });

    if (mediaFiles.length > 10) {
        console.log(`   ... and ${mediaFiles.length - 10} more files`);
    }
}

// CLI commands
if (require.main === module) {
    const command = process.argv[2];
    
    if (command === 'inspect') {
        const folder = process.argv[3];
        if (!folder) {
            console.log('Usage: node smart-file-mover.js inspect <folder-path>');
            console.log('Example: node smart-file-mover.js inspect projects/stcollen');
            process.exit(1);
        }
        inspectFolder(folder);
    } else if (command === 'example') {
        createMoveExample();
    } else {
        console.log(`
🚚 SMART FILE MOVER

Available commands:
  inspect <folder>  - Inspect a folder's contents
  example          - Show usage example

Example:
  node smart-file-mover.js inspect projects/stcollen
  node smart-file-mover.js example
`);
    }
}

module.exports = { SmartFileMover, inspectFolder };
