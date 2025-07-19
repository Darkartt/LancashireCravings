const fs = require('fs');
const path = require('path');

/**
 * Visual Image Inspector - Browser-based image analysis
 * This script creates an HTML page to visually inspect images and categorize them properly
 */

class VisualImageInspector {
    constructor() {
        this.mediaDir = path.join(__dirname, '../public/media');
        this.outputDir = path.join(__dirname, '../inspection-reports');
        this.inspectionData = {};
    }

    async createInspectionReport(projectName) {
        const projectPath = path.join(this.mediaDir, 'projects', projectName);
        if (!fs.existsSync(projectPath)) {
            console.error(`Project ${projectName} not found at ${projectPath}`);
            return;
        }

        const images = this.getProjectImages(projectPath);
        const htmlContent = this.generateInspectionHTML(projectName, images);
        
        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Save HTML file
        const htmlPath = path.join(this.outputDir, `${projectName}-inspection.html`);
        fs.writeFileSync(htmlPath, htmlContent);
        
        console.log(`📊 Inspection report created: ${htmlPath}`);
        return htmlPath;
    }

    getProjectImages(projectPath) {
        const images = [];
        
        // Check both main images folder and subfolders
        const imagePaths = [
            path.join(projectPath, 'images'),
            path.join(projectPath, 'images', 'process'),
            path.join(projectPath, 'images', 'final')
        ];

        for (const imgPath of imagePaths) {
            if (fs.existsSync(imgPath)) {
                const files = fs.readdirSync(imgPath);
                const imageFiles = files.filter(file => 
                    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
                );
                
                imageFiles.forEach(file => {
                    const relativePath = path.relative(path.join(__dirname, '../public'), path.join(imgPath, file));
                    images.push({
                        filename: file,
                        path: relativePath.replace(/\\/g, '/'), // Convert to web path
                        folder: path.basename(imgPath),
                        fullPath: path.join(imgPath, file)
                    });
                });
            }
        }

        return images.sort((a, b) => a.filename.localeCompare(b.filename));
    }

    generateInspectionHTML(projectName, images) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName.toUpperCase()} - Visual Content Inspector</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a1a;
            color: #ffffff;
            overflow-x: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #2c3e50, #34495e);
            padding: 2rem;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: #ecf0f1;
        }
        
        .header p {
            font-size: 1.2rem;
            color: #bdc3c7;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
        }
        
        .stat {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #3498db;
        }
        
        .controls {
            background: #2c3e50;
            padding: 1rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .control-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .control-group label {
            color: #ecf0f1;
            font-weight: 500;
        }
        
        .control-group select, .control-group input {
            padding: 0.5rem;
            border: none;
            border-radius: 4px;
            background: #34495e;
            color: #ecf0f1;
        }
        
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            padding: 2rem;
        }
        
        .image-card {
            background: #2c3e50;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .image-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }
        
        .image-container {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        
        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .image-container:hover img {
            transform: scale(1.05);
        }
        
        .image-info {
            padding: 1rem;
        }
        
        .image-filename {
            font-size: 0.9rem;
            color: #3498db;
            margin-bottom: 0.5rem;
            word-break: break-all;
        }
        
        .image-folder {
            font-size: 0.8rem;
            color: #95a5a6;
            background: rgba(52, 73, 94, 0.5);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 0.5rem;
        }
        
        .categorization {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .categorization select {
            padding: 0.5rem;
            border: none;
            border-radius: 4px;
            background: #34495e;
            color: #ecf0f1;
            font-size: 0.9rem;
        }
        
        .category-process {
            background: #27ae60;
        }
        
        .category-final {
            background: #e74c3c;
        }
        
        .category-workshop {
            background: #f39c12;
        }
        
        .category-nature {
            background: #9b59b6;
        }
        
        .actions {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            gap: 1rem;
        }
        
        .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #3498db;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .btn-success {
            background: #27ae60;
            color: white;
        }
        
        .btn-success:hover {
            background: #219a52;
            transform: translateY(-2px);
        }
        
        .fullscreen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .fullscreen-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        
        .close-fullscreen {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: #e74c3c;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .progress-bar {
            width: 100%;
            height: 4px;
            background: #34495e;
            margin-top: 1rem;
        }
        
        .progress-fill {
            height: 100%;
            background: #3498db;
            transition: width 0.3s ease;
        }
        
        .image-sequence {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .suggestions {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(52, 73, 94, 0.3);
            border-radius: 4px;
        }
        
        .suggestions h4 {
            color: #3498db;
            margin-bottom: 0.5rem;
        }
        
        .suggestion-item {
            font-size: 0.9rem;
            color: #ecf0f1;
            margin-bottom: 0.25rem;
        }
        
        @media (max-width: 768px) {
            .image-grid {
                grid-template-columns: 1fr;
                padding: 1rem;
            }
            
            .controls {
                flex-direction: column;
                align-items: stretch;
            }
            
            .actions {
                position: static;
                justify-content: center;
                margin-top: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${projectName.toUpperCase()} PROJECT</h1>
        <p>Visual Content Inspector & Categorization Tool</p>
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${images.length}</div>
                <div>Total Images</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="categorized-count">0</div>
                <div>Categorized</div>
            </div>
            <div class="stat">
                <div class="stat-number" id="progress-percent">0%</div>
                <div>Complete</div>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
        </div>
    </div>
    
    <div class="controls">
        <div class="control-group">
            <label>Filter by folder:</label>
            <select id="folder-filter">
                <option value="">All folders</option>
                <option value="images">Main images</option>
                <option value="process">Process</option>
                <option value="final">Final</option>
            </select>
        </div>
        <div class="control-group">
            <label>Sort by:</label>
            <select id="sort-order">
                <option value="filename">Filename</option>
                <option value="sequence">Sequence number</option>
                <option value="folder">Folder</option>
            </select>
        </div>
        <div class="control-group">
            <label>Zoom:</label>
            <input type="range" id="zoom-slider" min="200" max="400" value="300" step="25">
        </div>
    </div>
    
    <div class="image-grid" id="image-grid">
        ${images.map((image, index) => `
            <div class="image-card" data-filename="${image.filename}" data-folder="${image.folder}">
                <div class="image-container">
                    <div class="image-sequence">#${index + 1}</div>
                    <img src="/${image.path}" alt="${image.filename}" 
                         onclick="openFullscreen('/${image.path}', '${image.filename}')"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzQ0OTVlIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZWNmMGYxIiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg=='; this.parentElement.style.background='#e74c3c';"
                         loading="lazy">
                </div>
                <div class="image-info">
                    <div class="image-filename">${image.filename}</div>
                    <div class="image-folder">${image.folder}</div>
                    <div class="categorization">
                        <select class="category-select" data-image="${image.filename}">
                            <option value="">Select category</option>
                            <option value="process">Process Step</option>
                            <option value="final">Final Result</option>
                            <option value="workshop">Workshop/Tools</option>
                            <option value="nature-fish">Nature: Fish</option>
                            <option value="nature-birds">Nature: Birds</option>
                            <option value="nature-other">Nature: Other</option>
                            <option value="misplaced">Misplaced</option>
                        </select>
                        <select class="sequence-select" data-image="${image.filename}">
                            <option value="">Sequence</option>
                            ${Array.from({length: 50}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                        </select>
                    </div>
                    <div class="suggestions">
                        <h4>AI Suggestions:</h4>
                        <div class="suggestion-item">📸 Analyze content to suggest category</div>
                        <div class="suggestion-item">🔢 Suggest sequence based on visual progression</div>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
    
    <div class="actions">
        <button class="btn btn-primary" onclick="exportCategorization()">Export Data</button>
        <button class="btn btn-success" onclick="generateMoveScript()">Generate Move Script</button>
    </div>
    
    <div class="fullscreen-overlay" id="fullscreen-overlay" onclick="closeFullscreen()">
        <button class="close-fullscreen" onclick="closeFullscreen()">×</button>
        <img class="fullscreen-image" id="fullscreen-image">
    </div>
    
    <script>
        let categorizationData = {};
        
        // Initialize categorization tracking
        document.querySelectorAll('.category-select, .sequence-select').forEach(select => {
            select.addEventListener('change', function() {
                const imageName = this.dataset.image;
                const type = this.classList.contains('category-select') ? 'category' : 'sequence';
                
                if (!categorizationData[imageName]) {
                    categorizationData[imageName] = {};
                }
                
                categorizationData[imageName][type] = this.value;
                updateProgress();
            });
        });
        
        // Filter and sort functionality
        document.getElementById('folder-filter').addEventListener('change', filterImages);
        document.getElementById('sort-order').addEventListener('change', sortImages);
        document.getElementById('zoom-slider').addEventListener('input', function() {
            const size = this.value + 'px';
            document.querySelectorAll('.image-card').forEach(card => {
                card.style.width = size;
            });
        });
        
        function filterImages() {
            const filter = document.getElementById('folder-filter').value;
            document.querySelectorAll('.image-card').forEach(card => {
                const folder = card.dataset.folder;
                card.style.display = (!filter || folder === filter) ? 'block' : 'none';
            });
        }
        
        function sortImages() {
            const sortBy = document.getElementById('sort-order').value;
            const grid = document.getElementById('image-grid');
            const cards = Array.from(grid.children);
            
            cards.sort((a, b) => {
                if (sortBy === 'filename') {
                    return a.dataset.filename.localeCompare(b.dataset.filename);
                } else if (sortBy === 'folder') {
                    return a.dataset.folder.localeCompare(b.dataset.folder);
                } else if (sortBy === 'sequence') {
                    const aNum = parseInt(a.dataset.filename.match(/\\d+/)?.[0] || '0');
                    const bNum = parseInt(b.dataset.filename.match(/\\d+/)?.[0] || '0');
                    return aNum - bNum;
                }
                return 0;
            });
            
            cards.forEach(card => grid.appendChild(card));
        }
        
        function updateProgress() {
            const totalImages = ${images.length};
            const categorizedCount = Object.keys(categorizationData).filter(key => 
                categorizationData[key].category && categorizationData[key].category !== ''
            ).length;
            
            const percentage = Math.round((categorizedCount / totalImages) * 100);
            
            document.getElementById('categorized-count').textContent = categorizedCount;
            document.getElementById('progress-percent').textContent = percentage + '%';
            document.getElementById('progress-fill').style.width = percentage + '%';
        }
        
        function openFullscreen(src, filename) {
            document.getElementById('fullscreen-image').src = src;
            document.getElementById('fullscreen-overlay').style.display = 'flex';
        }
        
        function closeFullscreen() {
            document.getElementById('fullscreen-overlay').style.display = 'none';
        }
        
        function exportCategorization() {
            const data = {
                project: '${projectName}',
                timestamp: new Date().toISOString(),
                images: ${images.length},
                categorization: categorizationData
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '${projectName}-categorization.json';
            a.click();
            URL.revokeObjectURL(url);
        }
        
        function generateMoveScript() {
            const moves = [];
            
            Object.keys(categorizationData).forEach(filename => {
                const data = categorizationData[filename];
                if (data.category && data.category !== '') {
                    let targetFolder = '';
                    
                    switch(data.category) {
                        case 'process':
                            targetFolder = 'projects/${projectName}/images/process';
                            break;
                        case 'final':
                            targetFolder = 'projects/${projectName}/images/final';
                            break;
                        case 'workshop':
                            targetFolder = 'workshop/images';
                            break;
                        case 'nature-fish':
                            targetFolder = 'nature/fish/images';
                            break;
                        case 'nature-birds':
                            targetFolder = 'nature/birds/images';
                            break;
                        case 'nature-other':
                            targetFolder = 'nature/artistic/images';
                            break;
                    }
                    
                    if (targetFolder) {
                        moves.push({
                            source: filename,
                            target: targetFolder,
                            category: data.category,
                            sequence: data.sequence || null
                        });
                    }
                }
            });
            
            const script = \`
// Auto-generated move script for ${projectName}
const { SmartFileMover } = require('./smart-file-mover');

async function execute${projectName.charAt(0).toUpperCase() + projectName.slice(1)}Moves() {
    const mover = new SmartFileMover();
    
    \${moves.map(move => \`
    mover.addMove('projects/${projectName}/images/\${move.source}', '\${move.target}', 'Visual categorization: \${move.category}');\`).join('')}
    
    // Execute dry run first
    console.log('🔍 RUNNING DRY RUN...');
    mover.setDryRun(true);
    await mover.executeMoves();
    
    // Uncomment to execute for real
    // mover.setDryRun(false);
    // await mover.executeMoves();
}

execute${projectName.charAt(0).toUpperCase() + projectName.slice(1)}Moves().catch(console.error);
\`;
            
            const blob = new Blob([script], {type: 'application/javascript'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '${projectName}-moves.js';
            a.click();
            URL.revokeObjectURL(url);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFullscreen();
            }
        });
        
        // Initialize with filename sort
        sortImages();
    </script>
</body>
</html>`;
    }

    async createAllProjectReports() {
        const projects = ['stcollen', 'eagle', 'bass', 'nessie'];
        const reports = [];
        
        for (const project of projects) {
            const reportPath = await this.createInspectionReport(project);
            if (reportPath) {
                reports.push(reportPath);
            }
        }
        
        return reports;
    }
}

// CLI usage
if (require.main === module) {
    const inspector = new VisualImageInspector();
    const projectName = process.argv[2];
    
    if (!projectName) {
        console.log(`
🔍 VISUAL IMAGE INSPECTOR

Usage:
  node visual-image-inspector.js <project>     # Create report for specific project
  node visual-image-inspector.js all          # Create reports for all projects

Examples:
  node visual-image-inspector.js stcollen
  node visual-image-inspector.js eagle
  node visual-image-inspector.js all

This will create an interactive HTML report that you can open in a browser
to visually inspect and categorize images.
`);
        process.exit(1);
    }
    
    if (projectName === 'all') {
        inspector.createAllProjectReports()
            .then(reports => {
                console.log('\n✅ All project reports created!');
                console.log('📋 Open these files in your browser:');
                reports.forEach(report => console.log(`   - ${report}`));
            })
            .catch(console.error);
    } else {
        inspector.createInspectionReport(projectName)
            .then(reportPath => {
                console.log('\n✅ Inspection report created!');
                console.log(`📋 Open this file in your browser: ${reportPath}`);
            })
            .catch(console.error);
    }
}

module.exports = { VisualImageInspector };
