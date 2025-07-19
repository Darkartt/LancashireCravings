const fs = require('fs');
const path = require('path');

// Focused batch review system for organized media files only
class FocusedBatchReviewGenerator {
    constructor() {
        this.mediaPath = path.join(__dirname, '../public/media');
        this.outputDir = path.join(__dirname, '../organized-batch-reviews');
        this.batchSize = 50;
        this.organizedFiles = [];
        this.imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'];
        
        // Focus on organized folders only
        this.targetFolders = [
            'projects',
            'nature',
            'workshop'
        ];
    }

    // Scan only organized media folders (excluding archives and backups)
    scanOrganizedMedia() {
        console.log('🔍 Scanning organized media folders (excluding archives)...');
        
        for (const folder of this.targetFolders) {
            const folderPath = path.join(this.mediaPath, folder);
            if (fs.existsSync(folderPath)) {
                console.log(`📁 Scanning ${folder} folder...`);
                this.scanDirectoryRecursive(folderPath, folder);
            } else {
                console.log(`⚠️  Folder ${folder} not found at ${folderPath}`);
            }
        }
        
        console.log(`📊 Found ${this.organizedFiles.length} organized media files`);
        
        // Filter out any archive/backup files that might have been included
        this.organizedFiles = this.organizedFiles.filter(file => 
            !file.relativePath.includes('archive') && 
            !file.relativePath.includes('backup') &&
            !file.relativePath.includes('original-files')
        );
        
        console.log(`📊 After filtering archives: ${this.organizedFiles.length} files`);
        return this.organizedFiles;
    }

    // Recursively scan directories (excluding backup/archive folders)
    scanDirectoryRecursive(dirPath, relativePath) {
        try {
            // Skip archive, backup, and original-files directories
            if (relativePath.includes('archive') || 
                relativePath.includes('backup') || 
                relativePath.includes('original-files')) {
                console.log(`⏭️  Skipping archive/backup folder: ${relativePath}`);
                return;
            }
            
            const items = fs.readdirSync(dirPath);
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item);
                const relativeItemPath = path.join(relativePath, item);
                
                try {
                    const stats = fs.statSync(fullPath);
                    
                    if (stats.isDirectory()) {
                        // Skip if this is an archive/backup directory
                        if (item.includes('archive') || 
                            item.includes('backup') || 
                            item.includes('original-files')) {
                            console.log(`⏭️  Skipping backup directory: ${item}`);
                            continue;
                        }
                        this.scanDirectoryRecursive(fullPath, relativeItemPath);
                    } else {
                        const ext = path.extname(item).toLowerCase();
                        if (this.imageExtensions.includes(ext)) {
                            this.organizedFiles.push({
                                fullPath: fullPath,
                                relativePath: relativeItemPath.replace(/\\/g, '/'),
                                fileName: item,
                                directory: path.dirname(relativeItemPath),
                                extension: ext,
                                size: stats.size,
                                sizeFormatted: this.formatBytes(stats.size),
                                modifiedDate: stats.mtime,
                                isImage: true,
                                type: 'image'
                            });
                        }
                    }
                } catch (error) {
                    console.warn(`Error processing ${fullPath}:`, error.message);
                }
            }
        } catch (error) {
            console.warn(`Error scanning directory ${dirPath}:`, error.message);
        }
    }

    // Format bytes to human readable
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Generate batch HTML
    generateBatchHTML(batchNumber, files, startIndex, endIndex) {
        const totalBatches = Math.ceil(this.organizedFiles.length / this.batchSize);
        const prevBatch = batchNumber > 1 ? batchNumber - 1 : null;
        const nextBatch = batchNumber < totalBatches ? batchNumber + 1 : null;
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organized Media Review - Batch ${batchNumber}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        .batch-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .navigation {
            display: flex;
            gap: 10px;
        }
        .nav-btn {
            padding: 8px 16px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .nav-btn:hover {
            background: #5a6fd8;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .image-card {
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .image-card:hover {
            transform: translateY(-5px);
        }
        .image-container {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
            border-radius: 8px;
            margin-bottom: 10px;
            background: #f8f9fa;
        }
        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
        }
        .image-info {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
        }
        .image-name {
            font-weight: bold;
            margin-bottom: 5px;
            word-break: break-word;
        }
        .image-path {
            font-size: 11px;
            color: #888;
            margin-bottom: 5px;
        }
        .categorization {
            margin-top: 10px;
        }
        .category-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
        }
        .category-btn {
            padding: 4px 8px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s;
        }
        .category-btn.selected {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        .notes-input {
            width: 100%;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 11px;
            margin-top: 5px;
        }
        .save-progress {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
        }
        .modal-content {
            margin: auto;
            display: block;
            max-width: 90%;
            max-height: 90%;
        }
        .close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
        }
        .current-folder {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            font-weight: bold;
            color: #1976d2;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Organized Media Review</h1>
        <p>Batch ${batchNumber} of ${totalBatches} - Current Organized Files Only</p>
    </div>

    <div class="batch-info">
        <div>
            <strong>Images ${startIndex + 1}-${Math.min(endIndex, this.organizedFiles.length)} of ${this.organizedFiles.length}</strong>
        </div>
        <div class="navigation">
            ${prevBatch ? `<a href="batch-${prevBatch}.html" class="nav-btn">← Previous</a>` : ''}
            <span class="nav-btn" style="background: #6c757d;">Batch ${batchNumber}</span>
            ${nextBatch ? `<a href="batch-${nextBatch}.html" class="nav-btn">Next →</a>` : ''}
        </div>
    </div>

    <button class="save-progress" onclick="saveProgress()">💾 Save Progress</button>

    <div class="image-grid">
        ${files.map((file, index) => {
            const currentFolder = file.directory.split('/')[0];
            const isNewFolder = index === 0 || files[index - 1].directory.split('/')[0] !== currentFolder;
            
            return `
                ${isNewFolder ? `<div class="current-folder" style="grid-column: 1 / -1;">📁 ${currentFolder.toUpperCase()} FOLDER</div>` : ''}
                <div class="image-card" data-file-index="${startIndex + index}">
                    <div class="image-container">
                        <img src="/media/${file.relativePath.replace(/\\/g, '/')}" alt="${file.fileName}" 
                             onclick="openModal(this)" 
                             onerror="handleImageError(this)">
                    </div>
                    <div class="image-info">
                        <div class="image-name">${file.fileName}</div>
                        <div class="image-path">${file.relativePath}</div>
                        <div>Size: ${file.sizeFormatted}</div>
                    </div>
                    <div class="categorization">
                        <div class="category-buttons">
                            <button class="category-btn" data-category="dragonfly">🦋 Dragonfly</button>
                            <button class="category-btn" data-category="butterfly">🦋 Butterfly</button>
                            <button class="category-btn" data-category="fish">🐟 Fish</button>
                            <button class="category-btn" data-category="duck">🦆 Duck</button>
                            <button class="category-btn" data-category="eagle">🦅 Eagle</button>
                            <button class="category-btn" data-category="stcollen">⛪ St Collen</button>
                            <button class="category-btn" data-category="bass">🎸 Bass</button>
                            <button class="category-btn" data-category="nessie">🐲 Nessie</button>
                            <button class="category-btn" data-category="nature">🌿 Nature</button>
                            <button class="category-btn" data-category="tools">🔧 Tools</button>
                            <button class="category-btn" data-category="correct">✅ Correct</button>
                            <button class="category-btn" data-category="wrong">❌ Wrong</button>
                        </div>
                        <select class="process-stage" style="width: 100%; margin-bottom: 5px;">
                            <option value="">Select stage...</option>
                            <option value="initial">Initial/Raw</option>
                            <option value="process">Work in Progress</option>
                            <option value="final">Final/Complete</option>
                            <option value="detail">Detail Shot</option>
                        </select>
                        <input type="text" class="notes-input" placeholder="Notes or corrections needed...">
                    </div>
                </div>
            `;
        }).join('')}
    </div>

    <!-- Modal for full-size image viewing -->
    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>

    <script>
        // Store categorization data
        let categorizations = {};
        
        // Handle image loading errors
        function handleImageError(img) {
            img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#f8f9fa"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image not found</text></svg>';
            img.parentElement.style.border = '2px solid #dc3545';
        }
        
        // Category button handling
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.image-card');
                const fileIndex = card.dataset.fileIndex;
                const category = this.dataset.category;
                
                // Clear other selections in this card
                card.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
                
                // Store categorization
                if (!categorizations[fileIndex]) {
                    categorizations[fileIndex] = {};
                }
                categorizations[fileIndex].category = category;
                
                updateProgress();
            });
        });
        
        // Process stage handling
        document.querySelectorAll('.process-stage').forEach(select => {
            select.addEventListener('change', function() {
                const card = this.closest('.image-card');
                const fileIndex = card.dataset.fileIndex;
                
                if (!categorizations[fileIndex]) {
                    categorizations[fileIndex] = {};
                }
                categorizations[fileIndex].stage = this.value;
                
                updateProgress();
            });
        });
        
        // Notes handling
        document.querySelectorAll('.notes-input').forEach(input => {
            input.addEventListener('input', function() {
                const card = this.closest('.image-card');
                const fileIndex = card.dataset.fileIndex;
                
                if (!categorizations[fileIndex]) {
                    categorizations[fileIndex] = {};
                }
                categorizations[fileIndex].notes = this.value;
            });
        });
        
        // Modal functions
        function openModal(img) {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            modal.style.display = 'block';
            modalImg.src = img.src;
        }
        
        function closeModal() {
            document.getElementById('imageModal').style.display = 'none';
        }
        
        // Progress tracking
        function updateProgress() {
            const totalImages = document.querySelectorAll('.image-card').length;
            const categorizedImages = Object.keys(categorizations).length;
            
            console.log(\`Progress: \${categorizedImages}/\${totalImages} images categorized\`);
        }
        
        // Save progress
        function saveProgress() {
            const progressData = {
                batchNumber: ${batchNumber},
                totalBatches: ${totalBatches},
                categorizations: categorizations,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('organized-batch-${batchNumber}-progress', JSON.stringify(progressData));
            
            console.log('Progress saved:', progressData);
            alert('Progress saved locally!');
        }
        
        // Load saved progress
        function loadProgress() {
            const saved = localStorage.getItem('organized-batch-${batchNumber}-progress');
            if (saved) {
                const data = JSON.parse(saved);
                categorizations = data.categorizations || {};
                
                // Restore UI state
                Object.keys(categorizations).forEach(fileIndex => {
                    const card = document.querySelector(\`[data-file-index="\${fileIndex}"]\`);
                    if (card) {
                        const cat = categorizations[fileIndex];
                        
                        // Restore category selection
                        if (cat.category) {
                            const btn = card.querySelector(\`[data-category="\${cat.category}"]\`);
                            if (btn) btn.classList.add('selected');
                        }
                        
                        // Restore stage selection
                        if (cat.stage) {
                            const select = card.querySelector('.process-stage');
                            if (select) select.value = cat.stage;
                        }
                        
                        // Restore notes
                        if (cat.notes) {
                            const input = card.querySelector('.notes-input');
                            if (input) input.value = cat.notes;
                        }
                    }
                });
                
                updateProgress();
            }
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadProgress();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    </script>
</body>
</html>`;
        
        return html;
    }

    // Generate all batches
    async generateAllBatches() {
        console.log('🎨 Generating focused batch review system...');
        
        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        
        // Scan organized media
        const files = this.scanOrganizedMedia();
        
        if (files.length === 0) {
            console.log('❌ No organized media files found. Run the organization script first.');
            return;
        }
        
        const totalBatches = Math.ceil(files.length / this.batchSize);
        console.log(`📊 Processing ${files.length} organized files in ${totalBatches} batches`);
        
        // Generate each batch
        for (let i = 0; i < totalBatches; i++) {
            const batchNumber = i + 1;
            const startIndex = i * this.batchSize;
            const endIndex = Math.min(startIndex + this.batchSize, files.length);
            const batchFiles = files.slice(startIndex, endIndex);
            
            console.log(`📄 Generating batch ${batchNumber}/${totalBatches} (${batchFiles.length} files)`);
            
            // Generate HTML for this batch
            const html = this.generateBatchHTML(batchNumber, batchFiles, startIndex, endIndex);
            
            // Save batch file
            const batchPath = path.join(this.outputDir, `batch-${batchNumber}.html`);
            fs.writeFileSync(batchPath, html);
        }
        
        // Generate index file
        this.generateIndexFile(totalBatches);
        
        console.log('\n🎉 FOCUSED BATCH REVIEW SYSTEM READY!');
        console.log(`📁 Output directory: ${this.outputDir}`);
        console.log(`📄 Generated ${totalBatches} batch files`);
        console.log(`🏠 Open organized-batch-reviews/index.html to start`);
        console.log(`🎯 Focus: Review currently organized files for accuracy`);
    }

    // Generate index file
    generateIndexFile(totalBatches) {
        const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organized Media Review - Master Index</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; text-align: center; }
        .batch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .batch-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .batch-btn { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Organized Media Review</h1>
        <p>Review Currently Organized Files for Accuracy</p>
        <p>Total Files: ${this.organizedFiles.length} | Batches: ${totalBatches}</p>
    </div>
    <div class="batch-grid">
        ${Array.from({length: totalBatches}, (_, i) => `
            <div class="batch-card">
                <h3>Batch ${i + 1}</h3>
                <p>Review ${Math.min(this.batchSize, this.organizedFiles.length - i * this.batchSize)} files</p>
                <a href="batch-${i + 1}.html" class="batch-btn">Start Review →</a>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
        
        const indexPath = path.join(this.outputDir, 'index.html');
        fs.writeFileSync(indexPath, indexHTML);
    }
}

// Run the focused batch generator
if (require.main === module) {
    const generator = new FocusedBatchReviewGenerator();
    generator.generateAllBatches().catch(console.error);
}

module.exports = FocusedBatchReviewGenerator;
