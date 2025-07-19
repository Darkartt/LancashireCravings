const fs = require('fs');
const path = require('path');

// Batch review system for systematic image analysis
class BatchReviewGenerator {
    constructor() {
        this.inventoryPath = path.join(__dirname, '../master-inventory.json');
        this.outputDir = path.join(__dirname, '../batch-reviews');
        this.batchSize = 50; // Images per batch
        this.currentBatch = 0;
        this.inventory = null;
        this.reviewProgress = {
            totalBatches: 0,
            completedBatches: 0,
            categorizedFiles: 0,
            totalFiles: 0,
            batches: []
        };
    }

    // Load inventory data
    loadInventory() {
        if (!fs.existsSync(this.inventoryPath)) {
            throw new Error('Master inventory not found. Run master-inventory-scanner.js first.');
        }
        
        this.inventory = JSON.parse(fs.readFileSync(this.inventoryPath, 'utf8'));
        console.log(`📊 Loaded inventory with ${this.inventory.totalFiles} files`);
    }

    // Create output directory
    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    // Generate batch review HTML
    generateBatchHTML(batchNumber, files, startIndex, endIndex) {
        const totalBatches = Math.ceil(this.inventory.totalImages / this.batchSize);
        const prevBatch = batchNumber > 1 ? batchNumber - 1 : null;
        const nextBatch = batchNumber < totalBatches ? batchNumber + 1 : null;
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Batch Review ${batchNumber} - Image Analysis</title>
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
        .nav-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
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
        .progress-bar {
            width: 100%;
            height: 10px;
            background: #eee;
            border-radius: 5px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s;
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
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Woodcarving Media Analysis</h1>
        <p>Batch ${batchNumber} of ${totalBatches} - Systematic Visual Review</p>
    </div>

    <div class="batch-info">
        <div>
            <strong>Images ${startIndex + 1}-${Math.min(endIndex, this.inventory.totalImages)} of ${this.inventory.totalImages}</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(batchNumber / totalBatches) * 100}%"></div>
            </div>
        </div>
        <div class="navigation">
            ${prevBatch ? `<a href="batch-${prevBatch}.html" class="nav-btn">← Previous</a>` : ''}
            <span class="nav-btn" style="background: #6c757d;">Batch ${batchNumber}</span>
            ${nextBatch ? `<a href="batch-${nextBatch}.html" class="nav-btn">Next →</a>` : ''}
        </div>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${files.length}</div>
            <div class="stat-label">Images in Batch</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${batchNumber}</div>
            <div class="stat-label">Current Batch</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalBatches}</div>
            <div class="stat-label">Total Batches</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${Math.round((batchNumber / totalBatches) * 100)}%</div>
            <div class="stat-label">Progress</div>
        </div>
    </div>

    <button class="save-progress" onclick="saveProgress()">💾 Save Progress</button>

    <div class="image-grid">
        ${files.map((file, index) => `
            <div class="image-card" data-file-index="${startIndex + index}">
                <div class="image-container">
                    <img src="../${file.relativePath.replace(/\\/g, '/')}" alt="${file.fileName}" 
                         onclick="openModal(this)" 
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect width=%22200%22 height=%22200%22 fill=%22%23f8f9fa%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>No Image</text></svg>'">
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
                        <button class="category-btn" data-category="process">⚙️ Process</button>
                        <button class="category-btn" data-category="other">❓ Other</button>
                    </div>
                    <select class="process-stage" style="width: 100%; margin-bottom: 5px;">
                        <option value="">Select stage...</option>
                        <option value="initial">Initial/Raw</option>
                        <option value="process">Work in Progress</option>
                        <option value="final">Final/Complete</option>
                        <option value="detail">Detail Shot</option>
                    </select>
                    <input type="text" class="notes-input" placeholder="Notes or project name...">
                </div>
            </div>
        `).join('')}
    </div>

    <!-- Modal for full-size image viewing -->
    <div id="imageModal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>

    <script>
        // Store categorization data
        let categorizations = {};
        
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
            localStorage.setItem('batch-${batchNumber}-progress', JSON.stringify(progressData));
            
            // Also try to save to file (this would need a server endpoint)
            console.log('Progress saved:', progressData);
            alert('Progress saved locally!');
        }
        
        // Load saved progress
        function loadProgress() {
            const saved = localStorage.getItem('batch-${batchNumber}-progress');
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

    // Generate all batch files
    async generateAllBatches() {
        console.log('🎨 Generating batch review system...');
        
        // Load inventory
        this.loadInventory();
        
        // Create output directory
        this.ensureOutputDir();
        
        // Filter to images only
        const images = this.inventory.allFiles.filter(file => file.isImage);
        const totalBatches = Math.ceil(images.length / this.batchSize);
        
        console.log(`📊 Processing ${images.length} images in ${totalBatches} batches`);
        
        // Generate each batch
        for (let i = 0; i < totalBatches; i++) {
            const batchNumber = i + 1;
            const startIndex = i * this.batchSize;
            const endIndex = Math.min(startIndex + this.batchSize, images.length);
            const batchFiles = images.slice(startIndex, endIndex);
            
            console.log(`📄 Generating batch ${batchNumber}/${totalBatches} (${batchFiles.length} images)`);
            
            // Generate HTML for this batch
            const html = this.generateBatchHTML(batchNumber, batchFiles, startIndex, endIndex);
            
            // Save batch file
            const batchPath = path.join(this.outputDir, `batch-${batchNumber}.html`);
            fs.writeFileSync(batchPath, html);
            
            this.reviewProgress.batches.push({
                batchNumber: batchNumber,
                fileName: `batch-${batchNumber}.html`,
                imageCount: batchFiles.length,
                startIndex: startIndex,
                endIndex: endIndex
            });
        }
        
        // Update progress tracking
        this.reviewProgress.totalBatches = totalBatches;
        this.reviewProgress.totalFiles = images.length;
        
        // Save progress file
        const progressPath = path.join(this.outputDir, 'review-progress.json');
        fs.writeFileSync(progressPath, JSON.stringify(this.reviewProgress, null, 2));
        
        // Generate index file
        this.generateIndexFile(totalBatches);
        
        console.log('\n🎉 BATCH REVIEW SYSTEM READY!');
        console.log(`📁 Output directory: ${this.outputDir}`);
        console.log(`📄 Generated ${totalBatches} batch files`);
        console.log(`🏠 Open batch-reviews/index.html to start reviewing`);
        console.log(`🎯 Each batch contains ${this.batchSize} images for manageable review`);
    }

    // Generate index file
    generateIndexFile(totalBatches) {
        const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Woodcarving Media Review - Master Index</title>
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
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .stat-label {
            font-size: 14px;
            color: #666;
        }
        .batch-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        .batch-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .batch-card:hover {
            transform: translateY(-5px);
        }
        .batch-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .batch-info {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .batch-btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            transition: background 0.3s;
        }
        .batch-btn:hover {
            background: #5a6fd8;
        }
        .instructions {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .instructions h3 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .instructions ol {
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Woodcarving Media Review System</h1>
        <p>Systematic Visual Analysis of All ${this.reviewProgress.totalFiles} Images</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${this.reviewProgress.totalFiles}</div>
            <div class="stat-label">Total Images</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalBatches}</div>
            <div class="stat-label">Review Batches</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${this.batchSize}</div>
            <div class="stat-label">Images per Batch</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">0</div>
            <div class="stat-label">Batches Completed</div>
        </div>
    </div>

    <div class="instructions">
        <h3>📋 How to Use This Review System</h3>
        <ol>
            <li><strong>Start with Batch 1:</strong> Click on any batch below to begin systematic review</li>
            <li><strong>Categorize Each Image:</strong> Click category buttons to identify what each image shows</li>
            <li><strong>Select Process Stage:</strong> Choose if it's initial, work-in-progress, or final</li>
            <li><strong>Add Notes:</strong> Include project names or special details</li>
            <li><strong>Save Progress:</strong> Click "Save Progress" button to store your work</li>
            <li><strong>Navigate:</strong> Use Previous/Next buttons to move between batches</li>
            <li><strong>Review Large Images:</strong> Click any image to view it full-size</li>
        </ol>
        <p><strong>Goal:</strong> Identify every distinct woodcarving project so we can create individual project showcases.</p>
    </div>

    <div class="batch-grid">
        ${Array.from({length: totalBatches}, (_, i) => {
            const batchNumber = i + 1;
            const startIndex = i * this.batchSize;
            const endIndex = Math.min(startIndex + this.batchSize, this.reviewProgress.totalFiles);
            const imageCount = endIndex - startIndex;
            
            return `
                <div class="batch-card">
                    <div class="batch-title">Batch ${batchNumber}</div>
                    <div class="batch-info">
                        Images ${startIndex + 1}-${endIndex}<br>
                        ${imageCount} images to review
                    </div>
                    <a href="batch-${batchNumber}.html" class="batch-btn">Start Review →</a>
                </div>
            `;
        }).join('')}
    </div>

    <script>
        // Track overall progress
        function updateOverallProgress() {
            let completedBatches = 0;
            
            // Check localStorage for completed batches
            for (let i = 1; i <= ${totalBatches}; i++) {
                const saved = localStorage.getItem(\`batch-\${i}-progress\`);
                if (saved) {
                    const data = JSON.parse(saved);
                    if (Object.keys(data.categorizations || {}).length > 0) {
                        completedBatches++;
                    }
                }
            }
            
            // Update stats
            document.querySelector('.stat-card:last-child .stat-number').textContent = completedBatches;
            
            // Calculate percentage
            const percentage = Math.round((completedBatches / ${totalBatches}) * 100);
            console.log(\`Overall progress: \${completedBatches}/\${totalBatches} batches (\${percentage}%)\`);
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateOverallProgress();
            
            // Update progress every 5 seconds
            setInterval(updateOverallProgress, 5000);
        });
    </script>
</body>
</html>`;
        
        const indexPath = path.join(this.outputDir, 'index.html');
        fs.writeFileSync(indexPath, indexHTML);
    }
}

// Run the batch generator
if (require.main === module) {
    const generator = new BatchReviewGenerator();
    generator.generateAllBatches().catch(console.error);
}

module.exports = BatchReviewGenerator;
