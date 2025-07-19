const fs = require('fs');
const path = require('path');

/**
 * COMPREHENSIVE ALL-IMAGE ANALYZER
 * Analyzes ALL 3,604 images systematically to identify distinct projects
 * Creates sequential analysis with chronological ordering
 */

class ComprehensiveImageAnalyzer {
    constructor() {
        this.mediaDir = path.join(__dirname, '../public/media');
        this.allImages = [];
        this.analysisResults = {
            totalImages: 0,
            totalVideos: 0,
            detectedProjects: new Map(),
            chronologicalSequences: [],
            projectProgression: {},
            recommendations: []
        };
        this.batchSize = 50; // Process 50 images at a time for manageable viewing
        this.currentBatch = 0;
    }

    async analyzeAllImages() {
        console.log('🔍 Starting COMPREHENSIVE analysis of ALL 3,604 media files...');
        
        // Get ALL files from ALL directories
        await this.scanAllMediaFiles();
        
        // Sort files chronologically by filename/creation for proper sequence
        this.sortFilesChronologically();
        
        // Create batched HTML inspection pages for systematic review
        await this.createBatchedInspectionPages();
        
        // Generate project detection recommendations
        await this.generateProjectRecommendations();
        
        console.log(`✅ COMPREHENSIVE ANALYSIS SETUP COMPLETE!`);
        console.log(`📊 Total: ${this.analysisResults.totalImages} images, ${this.analysisResults.totalVideos} videos`);
        console.log(`📋 Created ${Math.ceil(this.allImages.length / this.batchSize)} batched inspection pages`);
        
        return this.analysisResults;
    }

    async scanAllMediaFiles() {
        // Scan ALL directories recursively
        const allDirs = [
            'projects/eagle',
            'projects/nessie', 
            'projects/bass',
            'projects/stcollen',
            'nature/insects',
            'nature/birds',
            'nature/fish',
            'nature/mammals',
            'nature/flowers',
            'nature/landscapes',
            'nature/portraits',
            'nature/artistic',
            'workshop'
        ];

        for (const dir of allDirs) {
            const fullPath = path.join(this.mediaDir, dir);
            if (fs.existsSync(fullPath)) {
                await this.scanDirectoryRecursive(fullPath, dir);
            }
        }

        this.analysisResults.totalImages = this.allImages.filter(f => !f.isVideo).length;
        this.analysisResults.totalVideos = this.allImages.filter(f => f.isVideo).length;
        
        console.log(`📂 Scanned ${this.allImages.length} total files`);
        console.log(`📸 ${this.analysisResults.totalImages} images`);
        console.log(`🎬 ${this.analysisResults.totalVideos} videos`);
    }

    async scanDirectoryRecursive(dirPath, categoryPath) {
        try {
            const items = fs.readdirSync(dirPath, { withFileTypes: true });
            
            for (const item of items) {
                const fullPath = path.join(dirPath, item.name);
                
                if (item.isDirectory()) {
                    // Recursively scan subdirectories
                    await this.scanDirectoryRecursive(fullPath, `${categoryPath}/${item.name}`);
                } else if (this.isMediaFile(item.name)) {
                    const fileInfo = await this.getFileInfo(fullPath, categoryPath);
                    this.allImages.push(fileInfo);
                }
            }
        } catch (error) {
            console.error(`Error scanning ${dirPath}:`, error.message);
        }
    }

    isMediaFile(filename) {
        return /\.(jpg|jpeg|png|gif|mov|mp4|avi|webm)$/i.test(filename);
    }

    async getFileInfo(fullPath, categoryPath) {
        const stats = fs.statSync(fullPath);
        const filename = path.basename(fullPath);
        const extension = path.extname(fullPath);
        const isVideo = /\.(mov|mp4|avi|webm)$/i.test(filename);
        
        return {
            fullPath,
            relativePath: path.relative(this.mediaDir, fullPath),
            categoryPath,
            filename,
            extension,
            isVideo,
            size: stats.size,
            createdTime: stats.birthtime,
            modifiedTime: stats.mtime,
            webPath: `http://localhost:3001/${path.relative(this.mediaDir, fullPath)}`,
            // Extract sequence number from filename if present
            sequenceNumber: this.extractSequenceNumber(filename)
        };
    }

    extractSequenceNumber(filename) {
        // Try to extract sequence numbers from various patterns
        const patterns = [
            /(\d{3,4})\./, // 3-4 digits before extension
            /_(\d{3,4})\./, // 3-4 digits after underscore
            /(\d{3,4})_/, // 3-4 digits before underscore
            /IMG_(\d{4})/, // IMG_XXXX pattern
        ];
        
        for (const pattern of patterns) {
            const match = filename.match(pattern);
            if (match) {
                return parseInt(match[1]);
            }
        }
        return 0; // Default if no sequence found
    }

    sortFilesChronologically() {
        console.log('📅 Sorting files chronologically...');
        
        // Sort by multiple criteria for proper chronological order
        this.allImages.sort((a, b) => {
            // First by category path (to group related content)
            if (a.categoryPath !== b.categoryPath) {
                return a.categoryPath.localeCompare(b.categoryPath);
            }
            
            // Then by sequence number if available
            if (a.sequenceNumber !== b.sequenceNumber) {
                return a.sequenceNumber - b.sequenceNumber;
            }
            
            // Finally by filename for consistency
            return a.filename.localeCompare(b.filename);
        });
        
        console.log('✅ Files sorted chronologically');
    }

    async createBatchedInspectionPages() {
        const totalBatches = Math.ceil(this.allImages.length / this.batchSize);
        console.log(`📄 Creating ${totalBatches} batched inspection pages...`);
        
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const startIndex = batchIndex * this.batchSize;
            const endIndex = Math.min(startIndex + this.batchSize, this.allImages.length);
            const batchFiles = this.allImages.slice(startIndex, endIndex);
            
            await this.createBatchInspectionHTML(batchIndex + 1, batchFiles, totalBatches);
        }
        
        // Create master navigation page
        await this.createMasterNavigationPage(totalBatches);
    }

    async createBatchInspectionHTML(batchNumber, batchFiles, totalBatches) {
        const startIndex = (batchNumber - 1) * this.batchSize + 1;
        const endIndex = startIndex + batchFiles.length - 1;
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Batch ${batchNumber}/${totalBatches} - Images ${startIndex}-${endIndex}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
        }
        .navigation {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .navigation a {
            display: inline-block;
            padding: 10px 20px;
            margin: 5px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.2s;
        }
        .navigation a:hover {
            background: #0056b3;
        }
        .navigation .current {
            background: #28a745;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .image-item {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .image-item:hover {
            transform: scale(1.02);
        }
        .image-container {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        .image-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
        }
        .image-item video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .image-info {
            padding: 15px;
        }
        .image-number {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 0.9em;
        }
        .video-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .category-info {
            font-size: 0.9em;
            color: #666;
            margin: 5px 0;
        }
        .filename {
            font-family: monospace;
            font-size: 0.8em;
            color: #333;
            background: #f8f9fa;
            padding: 5px;
            border-radius: 3px;
            word-break: break-all;
        }
        .analysis-form {
            background: #e8f5e8;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .analysis-form select, .analysis-form input {
            width: 100%;
            padding: 5px;
            margin: 3px 0;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        .fullscreen-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            cursor: pointer;
        }
        .fullscreen-modal img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        .modal-info {
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: white;
            background: rgba(0,0,0,0.7);
            padding: 15px;
            border-radius: 8px;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e9ecef;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            width: ${(batchNumber / totalBatches) * 100}%;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Comprehensive Image Analysis</h1>
        <h2>Batch ${batchNumber} of ${totalBatches}</h2>
        <p>Images ${startIndex} - ${endIndex} (${batchFiles.length} files)</p>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <p><strong>Progress:</strong> ${((batchNumber / totalBatches) * 100).toFixed(1)}% Complete</p>
    </div>

    <div class="navigation">
        <a href="all-images-master.html">🏠 Master Index</a>
        ${batchNumber > 1 ? `<a href="batch-${batchNumber - 1}.html">← Previous</a>` : ''}
        <span class="current">Batch ${batchNumber}</span>
        ${batchNumber < totalBatches ? `<a href="batch-${batchNumber + 1}.html">Next →</a>` : ''}
        <a href="#" onclick="exportAnalysis()">📊 Export Analysis</a>
    </div>

    <div class="image-grid">
`;

        // Add each image in the batch
        batchFiles.forEach((file, index) => {
            const globalIndex = (batchNumber - 1) * this.batchSize + index + 1;
            
            html += `
        <div class="image-item" data-global-index="${globalIndex}">
            <div class="image-container">
                <div class="image-number">#${globalIndex}</div>
                ${file.isVideo ? '<div class="video-overlay">VIDEO</div>' : ''}
                ${file.isVideo ? 
                    `<video controls><source src="${file.webPath}" type="video/${file.extension.slice(1)}"></video>` :
                    `<img src="${file.webPath}" alt="${file.filename}" 
                         onclick="openModal('${file.webPath}', '${file.filename}', '${file.categoryPath}', ${globalIndex})"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YTczN2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'">`
                }
            </div>
            <div class="image-info">
                <div class="category-info"><strong>Current:</strong> ${file.categoryPath}</div>
                <div class="filename">${file.filename}</div>
                <div class="analysis-form">
                    <select onchange="updateAnalysis(${globalIndex}, 'project', this.value)">
                        <option value="">🎨 Project Type...</option>
                        <option value="butterfly">🦋 Butterfly Carving</option>
                        <option value="dragonfly">🜀 Dragonfly Carving</option>
                        <option value="fish-display">🐟 Fish Display</option>
                        <option value="duck-waterfowl">🦆 Duck/Waterfowl</option>
                        <option value="stcollen-statue">⛪ St Collen Statue</option>
                        <option value="eagle-carving">🦅 Eagle Carving</option>
                        <option value="bass-carving">🐟 Bass Carving</option>
                        <option value="nessie-carving">🐲 Nessie/Dragon</option>
                        <option value="owl-carving">🦉 Owl Carving</option>
                        <option value="workshop">🛠️ Workshop/Tools</option>
                        <option value="nature-reference">📸 Nature Reference</option>
                        <option value="portrait">👤 Portrait/People</option>
                        <option value="other">❓ Other/Unidentified</option>
                    </select>
                    <select onchange="updateAnalysis(${globalIndex}, 'stage', this.value)">
                        <option value="">📋 Stage...</option>
                        <option value="concept">💡 Concept/Planning</option>
                        <option value="material-prep">🪵 Material Preparation</option>
                        <option value="rough-carving">🔨 Rough Carving</option>
                        <option value="detail-work">🎨 Detail Work</option>
                        <option value="finishing">✨ Finishing</option>
                        <option value="final-showcase">🏆 Final Showcase</option>
                        <option value="client-delivery">🤝 Client Delivery</option>
                    </select>
                    <input type="text" placeholder="📝 Notes/Description..." 
                           onchange="updateAnalysis(${globalIndex}, 'notes', this.value)">
                </div>
            </div>
        </div>
`;
        });

        html += `
    </div>

    <div class="fullscreen-modal" id="modal" onclick="closeModal()">
        <img id="modal-img" src="" alt="">
        <div class="modal-info" id="modal-info"></div>
    </div>

    <script>
        let analysisData = JSON.parse(localStorage.getItem('imageAnalysis') || '{}');
        
        function updateAnalysis(imageIndex, field, value) {
            if (!analysisData[imageIndex]) {
                analysisData[imageIndex] = {};
            }
            analysisData[imageIndex][field] = value;
            localStorage.setItem('imageAnalysis', JSON.stringify(analysisData));
            
            // Visual feedback
            const item = document.querySelector('[data-global-index="' + imageIndex + '"]');
            if (item && field === 'project' && value) {
                item.style.border = '3px solid #28a745';
            }
        }
        
        function openModal(src, filename, category, index) {
            const modal = document.getElementById('modal');
            const modalImg = document.getElementById('modal-img');
            const modalInfo = document.getElementById('modal-info');
            
            modalImg.src = src;
            modalInfo.innerHTML = '<strong>#' + index + ': ' + filename + '</strong><br>Category: ' + category;
            modal.style.display = 'block';
        }
        
        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }
        
        function exportAnalysis() {
            const data = localStorage.getItem('imageAnalysis');
            const blob = new Blob([data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image-analysis-batch-${batchNumber}.json';
            a.click();
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft' && ${batchNumber > 1}) {
                window.location.href = 'batch-${batchNumber - 1}.html';
            }
            if (e.key === 'ArrowRight' && ${batchNumber < totalBatches}) {
                window.location.href = 'batch-${batchNumber + 1}.html';
            }
        });
        
        // Load existing analysis data
        document.addEventListener('DOMContentLoaded', function() {
            Object.keys(analysisData).forEach(index => {
                const item = document.querySelector('[data-global-index="' + index + '"]');
                if (item && analysisData[index].project) {
                    item.style.border = '3px solid #28a745';
                }
            });
        });
    </script>
</body>
</html>
`;

        const filename = `batch-${batchNumber}.html`;
        const filepath = path.join(__dirname, `../public/${filename}`);
        fs.writeFileSync(filepath, html);
        
        console.log(`📄 Created batch ${batchNumber}: ${filepath}`);
    }

    async createMasterNavigationPage(totalBatches) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Image Analysis - All 3,604 Files</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
        }
        .batch-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .batch-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .batch-card:hover {
            transform: translateY(-5px);
        }
        .batch-card a {
            text-decoration: none;
            color: inherit;
        }
        .batch-number {
            font-size: 2em;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .batch-info {
            color: #666;
            margin: 10px 0;
        }
        .progress-section {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .instructions {
            background: #e8f5e8;
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Master Image Analysis Dashboard</h1>
        <h2>Comprehensive Analysis of All 3,604 Media Files</h2>
        <p>Systematic review to identify distinct carving projects</p>
    </div>

    <div class="instructions">
        <h3>📋 Analysis Instructions</h3>
        <p><strong>Goal:</strong> Identify every distinct carving project across all 3,604 files</p>
        <ul>
            <li><strong>For each image:</strong> Select the project type and carving stage</li>
            <li><strong>Look for:</strong> Individual carving pieces (butterfly, dragonfly, fish species, etc.)</li>
            <li><strong>Note progression:</strong> Concept → Material Prep → Rough Carving → Detail Work → Final</li>
            <li><strong>Identify misplacements:</strong> Content that belongs in different projects</li>
        </ul>
        <p><strong>Your analysis will create the proper project structure for the website!</strong></p>
    </div>

    <div class="progress-section">
        <h3>📊 Analysis Progress</h3>
        <p>Total batches: ${totalBatches} | Images per batch: ${this.batchSize}</p>
        <div id="progress-info">Click "Load Progress" to see current analysis status</div>
        <button onclick="loadProgress()">Load Progress</button>
        <button onclick="exportAllAnalysis()">Export Complete Analysis</button>
    </div>

    <div class="batch-grid">
`;

        for (let i = 1; i <= totalBatches; i++) {
            const startIndex = (i - 1) * this.batchSize + 1;
            const endIndex = Math.min(startIndex + this.batchSize - 1, this.allImages.length);
            
            html += `
        <div class="batch-card">
            <a href="batch-${i}.html">
                <div class="batch-number">Batch ${i}</div>
                <div class="batch-info">Images ${startIndex} - ${endIndex}</div>
                <div class="batch-info">${endIndex - startIndex + 1} files</div>
                <div class="batch-info" id="batch-${i}-status">Not started</div>
            </a>
        </div>
`;
        }

        html += `
    </div>

    <script>
        function loadProgress() {
            const analysisData = JSON.parse(localStorage.getItem('imageAnalysis') || '{}');
            const totalImages = ${this.allImages.length};
            const analyzedCount = Object.keys(analysisData).length;
            const progressPercent = ((analyzedCount / totalImages) * 100).toFixed(1);
            
            document.getElementById('progress-info').innerHTML = 
                'Analyzed: ' + analyzedCount + ' / ' + totalImages + ' (' + progressPercent + '%)';
            
            // Update batch statuses
            for (let i = 1; i <= ${totalBatches}; i++) {
                const startIndex = (i - 1) * ${this.batchSize} + 1;
                const endIndex = Math.min(startIndex + ${this.batchSize} - 1, totalImages);
                let batchAnalyzed = 0;
                
                for (let j = startIndex; j <= endIndex; j++) {
                    if (analysisData[j] && analysisData[j].project) {
                        batchAnalyzed++;
                    }
                }
                
                const batchSize = endIndex - startIndex + 1;
                const batchPercent = ((batchAnalyzed / batchSize) * 100).toFixed(0);
                const statusElement = document.getElementById('batch-' + i + '-status');
                
                if (batchPercent == 0) {
                    statusElement.textContent = 'Not started';
                    statusElement.style.color = '#dc3545';
                } else if (batchPercent == 100) {
                    statusElement.textContent = 'Complete ✅';
                    statusElement.style.color = '#28a745';
                } else {
                    statusElement.textContent = batchPercent + '% complete';
                    statusElement.style.color = '#ffc107';
                }
            }
        }
        
        function exportAllAnalysis() {
            const data = localStorage.getItem('imageAnalysis');
            const blob = new Blob([data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'complete-image-analysis-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
        }
        
        // Load progress on page load
        document.addEventListener('DOMContentLoaded', loadProgress);
    </script>
</body>
</html>
`;

        const filepath = path.join(__dirname, '../public/all-images-master.html');
        fs.writeFileSync(filepath, html);
        
        console.log(`📋 Created master navigation: ${filepath}`);
    }

    async generateProjectRecommendations() {
        // Analyze current file distribution and create recommendations
        const categoryDistribution = {};
        
        this.allImages.forEach(file => {
            if (!categoryDistribution[file.categoryPath]) {
                categoryDistribution[file.categoryPath] = 0;
            }
            categoryDistribution[file.categoryPath]++;
        });
        
        this.analysisResults.recommendations = [
            "🎯 Complete systematic visual analysis of all batches",
            "🔍 Look for distinct carving projects hidden in current folders",
            "📝 Document progression sequences for each identified project",
            "🚚 Create move script based on analysis findings",
            "🌐 Update website structure with new project showcases"
        ];
        
        // Save comprehensive analysis results
        const analysisPath = path.join(__dirname, '../comprehensive-all-images-analysis.json');
        const analysis = {
            ...this.analysisResults,
            timestamp: new Date().toISOString(),
            categoryDistribution,
            analysisType: 'comprehensive-all-images',
            totalBatches: Math.ceil(this.allImages.length / this.batchSize),
            batchSize: this.batchSize,
            purpose: 'Systematic analysis of all 3,604 images to identify distinct carving projects'
        };
        
        fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
        console.log(`📊 Comprehensive analysis data saved: ${analysisPath}`);
    }
}

// Run the comprehensive analysis
if (require.main === module) {
    const analyzer = new ComprehensiveImageAnalyzer();
    analyzer.analyzeAllImages()
        .then(() => {
            console.log('\n🎯 COMPREHENSIVE ALL-IMAGE ANALYSIS SETUP COMPLETE!');
            console.log('📋 Next steps:');
            console.log('1. Open: http://localhost:3001/all-images-master.html');
            console.log('2. Work through each batch systematically');
            console.log('3. Identify distinct carving projects in each image');
            console.log('4. Export analysis data when complete');
            console.log('5. Create project restructuring script based on findings');
        })
        .catch(error => {
            console.error('❌ Error during comprehensive analysis:', error);
        });
}

module.exports = { ComprehensiveImageAnalyzer };
