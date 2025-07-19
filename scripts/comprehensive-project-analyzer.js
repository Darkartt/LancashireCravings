const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Project Analyzer
 * Scans ALL 3,604 images to identify distinct carving projects
 * Creates individual project folders for each unique piece
 */

class ComprehensiveProjectAnalyzer {
    constructor() {
        this.mediaDir = path.join(__dirname, '../public/media');
        this.allFiles = [];
        this.projectAnalysis = {
            totalFiles: 0,
            imageFiles: 0,
            videoFiles: 0,
            detectedProjects: [],
            needsReview: [],
            categories: {
                carvings: [], // Individual carving projects
                nature: [], // Real animals/insects (not carvings)
                workshop: [], // Tools, process, workspace
                portraits: [], // People photos
                landscapes: [], // Outdoor scenes
                artistic: [] // Creative compositions
            }
        };
        this.inspectionHTML = '';
    }

    async analyzeAllProjects() {
        console.log('🔍 Starting comprehensive analysis of all 3,604 media files...');
        
        // Get all media files from all current folders
        await this.scanAllDirectories();
        
        // Create visual inspection HTML for ALL files
        await this.createComprehensiveInspectionHTML();
        
        // Save analysis results
        await this.saveAnalysisResults();
        
        console.log(`✅ Analysis complete! Found ${this.projectAnalysis.totalFiles} total files`);
        console.log(`📊 ${this.projectAnalysis.imageFiles} images, ${this.projectAnalysis.videoFiles} videos`);
        console.log(`📋 Inspection HTML created: comprehensive-project-inspection.html`);
        
        return this.projectAnalysis;
    }

    async scanAllDirectories() {
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
                const files = this.getAllFilesRecursive(fullPath);
                const mediaFiles = files.filter(file => 
                    /\.(jpg|jpeg|png|gif|mov|mp4|avi|webm)$/i.test(file)
                );
                
                for (const file of mediaFiles) {
                    this.allFiles.push({
                        fullPath: file,
                        relativePath: path.relative(this.mediaDir, file),
                        currentCategory: dir,
                        filename: path.basename(file),
                        extension: path.extname(file),
                        isVideo: /\.(mov|mp4|avi|webm)$/i.test(file)
                    });
                }
            }
        }

        this.projectAnalysis.totalFiles = this.allFiles.length;
        this.projectAnalysis.imageFiles = this.allFiles.filter(f => !f.isVideo).length;
        this.projectAnalysis.videoFiles = this.allFiles.filter(f => f.isVideo).length;
    }

    getAllFilesRecursive(dir) {
        let files = [];
        try {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    files = files.concat(this.getAllFilesRecursive(fullPath));
                } else {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error.message);
        }
        return files;
    }

    async createComprehensiveInspectionHTML() {
        // Group files by current category for systematic review
        const groupedFiles = {};
        
        for (const file of this.allFiles) {
            const category = file.currentCategory;
            if (!groupedFiles[category]) {
                groupedFiles[category] = [];
            }
            groupedFiles[category].push(file);
        }

        this.inspectionHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Project Analysis - All ${this.projectAnalysis.totalFiles} Files</title>
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
        .category-section {
            background: white;
            margin: 20px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .category-header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            font-size: 1.5em;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .category-header .count {
            background: rgba(255,255,255,0.2);
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            padding: 20px;
        }
        .image-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .image-item:hover {
            transform: scale(1.05);
        }
        .image-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            cursor: pointer;
        }
        .image-item video {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .image-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            padding: 15px 10px 10px;
            font-size: 0.8em;
        }
        .video-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.7em;
            font-weight: bold;
        }
        .analysis-notes {
            background: #e8f5e8;
            border-left: 4px solid #27ae60;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .analysis-notes h3 {
            color: #27ae60;
            margin-top: 0;
        }
        .project-suggestions {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .project-suggestions h3 {
            color: #856404;
            margin-top: 0;
        }
        .sticky-nav {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .sticky-nav a {
            display: block;
            padding: 5px 10px;
            text-decoration: none;
            color: #333;
            border-radius: 5px;
            margin: 2px 0;
        }
        .sticky-nav a:hover {
            background: #f0f0f0;
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
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Comprehensive Project Analysis</h1>
        <p>Visual inspection of all ${this.projectAnalysis.totalFiles} media files</p>
        <p><strong>Goal:</strong> Identify every distinct carving project for individual showcases</p>
    </div>

    <div class="sticky-nav">
        <strong>Quick Navigation:</strong>
        ${Object.keys(groupedFiles).map(category => 
            `<a href="#${category.replace(/[^a-zA-Z0-9]/g, '-')}">${category} (${groupedFiles[category].length})</a>`
        ).join('')}
    </div>

    <div class="analysis-notes">
        <h3>📋 Analysis Instructions</h3>
        <p><strong>For each image, identify:</strong></p>
        <ul>
            <li><strong>Carving Projects:</strong> Individual pieces being carved (butterfly, dragonfly, specific fish species, etc.)</li>
            <li><strong>Subject Matter:</strong> What the carving depicts (insect, bird, fish, religious figure, etc.)</li>
            <li><strong>Stage:</strong> Planning, rough carving, detail work, finishing, final showcase</li>
            <li><strong>Workspace:</strong> Tools, environment, technique demonstrations</li>
            <li><strong>Nature Reference:</strong> Real animals/insects used as reference (not carvings)</li>
        </ul>
    </div>

    <div class="project-suggestions">
        <h3>🎨 Expected Project Categories</h3>
        <p><strong>Individual Carving Projects (each should be separate):</strong></p>
        <ul>
            <li><strong>Insects:</strong> Butterfly project, Dragonfly project, Bee project, etc.</li>
            <li><strong>Birds:</strong> Eagle project, Owl project, Crow project, etc.</li>
            <li><strong>Fish:</strong> Bass project, Trout project, Salmon project, etc.</li>
            <li><strong>Religious:</strong> St Collen statue project, Angel project, etc.</li>
            <li><strong>Mythical:</strong> Nessie project, Dragon project, etc.</li>
            <li><strong>Mammals:</strong> Squirrel project, Dog project, etc.</li>
        </ul>
    </div>

    <div class="fullscreen-modal" id="modal" onclick="closeModal()">
        <img id="modal-img" src="" alt="">
        <div class="modal-info" id="modal-info"></div>
    </div>
`;

        // Add each category section
        for (const [category, files] of Object.entries(groupedFiles)) {
            this.inspectionHTML += `
    <div class="category-section" id="${category.replace(/[^a-zA-Z0-9]/g, '-')}">
        <div class="category-header">
            <span>${category.toUpperCase()}</span>
            <span class="count">${files.length} files</span>
        </div>
        <div class="image-grid">
`;

            // Add first 100 files from each category (to keep HTML manageable)
            const filesToShow = files.slice(0, 100);
            
            for (const file of filesToShow) {
                const webPath = `http://localhost:3001/${file.relativePath}`;
                
                if (file.isVideo) {
                    this.inspectionHTML += `
            <div class="image-item">
                <video controls>
                    <source src="${webPath}" type="video/${file.extension.slice(1)}">
                </video>
                <div class="video-overlay">VIDEO</div>
                <div class="image-info">
                    <strong>${file.filename}</strong><br>
                    Current: ${file.currentCategory}
                </div>
            </div>
`;
                } else {
                    this.inspectionHTML += `
            <div class="image-item">
                <img src="${webPath}" alt="${file.filename}" 
                     onclick="openModal('${webPath}', '${file.filename}', '${file.currentCategory}')"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2YTczN2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'">
                <div class="image-info">
                    <strong>${file.filename}</strong><br>
                    Current: ${file.currentCategory}
                </div>
            </div>
`;
                }
            }

            if (files.length > 100) {
                this.inspectionHTML += `
            <div class="image-item" style="display: flex; align-items: center; justify-content: center; background: #f8f9fa; border: 2px dashed #dee2e6;">
                <div style="text-align: center; color: #6c757d;">
                    <strong>+${files.length - 100} more files</strong><br>
                    <small>Showing first 100 for performance</small>
                </div>
            </div>
`;
            }

            this.inspectionHTML += `
        </div>
    </div>
`;
        }

        this.inspectionHTML += `
    <script>
        function openModal(src, filename, category) {
            const modal = document.getElementById('modal');
            const modalImg = document.getElementById('modal-img');
            const modalInfo = document.getElementById('modal-info');
            
            modalImg.src = src;
            modalInfo.innerHTML = '<strong>' + filename + '</strong><br>Current category: ' + category;
            modal.style.display = 'block';
        }
        
        function closeModal() {
            document.getElementById('modal').style.display = 'none';
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    </script>
</body>
</html>
`;

        // Save the HTML file
        const htmlPath = path.join(__dirname, '../comprehensive-project-inspection.html');
        fs.writeFileSync(htmlPath, this.inspectionHTML);
        
        console.log(`📄 Comprehensive inspection HTML created: ${htmlPath}`);
    }

    async saveAnalysisResults() {
        const analysisPath = path.join(__dirname, '../comprehensive-project-analysis.json');
        const analysis = {
            ...this.projectAnalysis,
            timestamp: new Date().toISOString(),
            analysisType: 'comprehensive',
            purpose: 'Identify all distinct carving projects for individual showcases',
            allFiles: this.allFiles.map(f => ({
                relativePath: f.relativePath,
                currentCategory: f.currentCategory,
                filename: f.filename,
                isVideo: f.isVideo
            }))
        };
        
        fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
        console.log(`📊 Analysis data saved: ${analysisPath}`);
    }
}

// Run the comprehensive analysis
if (require.main === module) {
    const analyzer = new ComprehensiveProjectAnalyzer();
    analyzer.analyzeAllProjects()
        .then(() => {
            console.log('\n🎯 COMPREHENSIVE ANALYSIS COMPLETE!');
            console.log('📋 Next steps:');
            console.log('1. Start media server: node scripts/media-server.js');
            console.log('2. Open: http://localhost:3001/comprehensive-project-inspection.html');
            console.log('3. Review ALL images to identify distinct carving projects');
            console.log('4. Create individual project folders for each unique piece');
        })
        .catch(error => {
            console.error('❌ Error during analysis:', error);
        });
}

module.exports = { ComprehensiveProjectAnalyzer };
