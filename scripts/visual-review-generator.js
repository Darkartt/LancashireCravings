const fs = require('fs');
const path = require('path');

class VisualReviewGenerator {
    constructor() {
        this.mediaDir = path.join(__dirname, '..', 'public', 'media');
        this.outputDir = path.join(__dirname, '..', 'visual-animal-review');
        
        // Animal categories for manual classification
        this.animalCategories = {
            fish: [
                'largemouth_bass', 'smallmouth_bass', 'striped_bass', 'trout', 'salmon',
                'pike', 'muskie', 'walleye', 'perch', 'catfish', 'sunfish', 'other_fish'
            ],
            birds: [
                'bald_eagle', 'golden_eagle', 'owl', 'hawk', 'falcon', 'duck', 'goose',
                'heron', 'cardinal', 'woodpecker', 'other_bird'
            ],
            insects: [
                'butterfly', 'dragonfly', 'bee', 'spider', 'other_insect'
            ],
            mammals: [
                'deer', 'bear', 'wolf', 'fox', 'rabbit', 'squirrel', 'other_mammal'
            ],
            amphibians: [
                'frog', 'turtle', 'lizard', 'snake', 'other_amphibian'
            ],
            other: [
                'nessie', 'st_collen', 'cross', 'angel', 'unknown', 'not_animal'
            ]
        };
        
        this.processStages = [
            'raw_log', 'rough_carving', 'detailed_work', 'finishing', 'final_complete'
        ];
    }

    // Load the latest visual review batches
    loadLatestBatches() {
        const files = fs.readdirSync(__dirname.replace('scripts', ''))
            .filter(f => f.startsWith('visual-review-batches-') && f.endsWith('.json'))
            .sort()
            .reverse();
        
        if (files.length === 0) {
            throw new Error('No visual review batches found. Run enhanced-image-analyzer-fixed.js first.');
        }
        
        const latestFile = files[0];
        const filePath = path.join(__dirname, '..', latestFile);
        console.log(`📂 Loading batches from: ${latestFile}`);
        
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // Generate HTML for animal classification
    generateAnimalClassificationHTML(batch, batchName) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animal Classification - ${batchName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            margin: -20px -20px 20px -20px;
            text-align: center;
        }
        .batch-info {
            background: #3498db;
            color: white;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .image-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.2s;
        }
        .image-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 12px rgba(0,0,0,0.15);
        }
        .image-container {
            position: relative;
            height: 250px;
            overflow: hidden;
        }
        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .image-info {
            padding: 15px;
        }
        .filename {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .path {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 10px;
            word-break: break-all;
        }
        .controls {
            margin-top: 10px;
        }
        .animal-select {
            width: 100%;
            padding: 8px;
            border: 2px solid #bdc3c7;
            border-radius: 5px;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .stage-select {
            width: 100%;
            padding: 6px;
            border: 1px solid #bdc3c7;
            border-radius: 3px;
            font-size: 12px;
        }
        .classification-summary {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            z-index: 1000;
        }
        .summary-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .summary-list {
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }
        .export-button {
            background: #27ae60;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            width: 100%;
        }
        .export-button:hover {
            background: #229954;
        }
        .category-header {
            background: #34495e;
            color: white;
            padding: 10px 15px;
            margin: 20px 0 10px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        .instructions {
            background: #f39c12;
            color: white;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 Animal Classification - ${batchName}</h1>
        <p>Manually identify animals in woodcarving images</p>
    </div>

    <div class="instructions">
        <h3>📋 Instructions:</h3>
        <ol>
            <li>Look at each image carefully</li>
            <li>Select the correct animal type from the dropdown</li>
            <li>Choose the carving stage if visible</li>
            <li>Click "Export Classifications" when done</li>
            <li>Use the exported JSON to create separate projects</li>
        </ol>
    </div>

    <div class="batch-info">
        <h3>📊 Batch Information</h3>
        <p><strong>Category:</strong> ${batchName}</p>
        <p><strong>Total Images:</strong> ${batch.length}</p>
        <p><strong>Note:</strong> Filenames are random camera names (IMG_001, etc.)</p>
    </div>

    <div class="classification-summary">
        <div class="summary-title">🎯 Classification Summary</div>
        <div class="summary-list" id="summaryList">
            No classifications yet
        </div>
        <button class="export-button" onclick="exportClassifications()">
            📤 Export Classifications
        </button>
    </div>

    <div class="image-grid">
        ${batch.map((item, index) => this.generateImageCard(item, index)).join('')}
    </div>

    <script>
        let classifications = {};

        function updateClassification(index, field, value) {
            if (!classifications[index]) {
                classifications[index] = {};
            }
            classifications[index][field] = value;
            
            // Update the summary
            updateSummary();
        }

        function updateSummary() {
            const summaryList = document.getElementById('summaryList');
            const counts = {};
            
            Object.values(classifications).forEach(classification => {
                if (classification.animal) {
                    counts[classification.animal] = (counts[classification.animal] || 0) + 1;
                }
            });
            
            if (Object.keys(counts).length === 0) {
                summaryList.innerHTML = 'No classifications yet';
                return;
            }
            
            let html = '';
            Object.entries(counts).sort().forEach(([animal, count]) => {
                html += \`<div>\${animal}: \${count}</div>\`;
            });
            
            summaryList.innerHTML = html;
        }

        function exportClassifications() {
            const exportData = {
                batchName: '${batchName}',
                timestamp: new Date().toISOString(),
                totalImages: ${batch.length},
                classifications: Object.entries(classifications).map(([index, data]) => ({
                    index: parseInt(index),
                    filename: document.querySelector(\`[data-index="\${index}"] .filename\`).textContent,
                    path: document.querySelector(\`[data-index="\${index}"] .path\`).textContent,
                    animal: data.animal || 'unknown',
                    stage: data.stage || 'unknown',
                    shouldCreateProject: data.animal && data.animal !== 'unknown' && data.animal !== 'not_animal'
                }))
            };
            
            // Download as JSON
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`animal-classifications-\${exportData.batchName}-\${Date.now()}.json\`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert(\`Exported \${Object.keys(classifications).length} classifications!\`);
        }

        // Auto-save to localStorage
        function saveToStorage() {
            localStorage.setItem('animal_classifications_${batchName}', JSON.stringify(classifications));
        }

        function loadFromStorage() {
            const stored = localStorage.getItem('animal_classifications_${batchName}');
            if (stored) {
                classifications = JSON.parse(stored);
                
                // Restore selections
                Object.entries(classifications).forEach(([index, data]) => {
                    if (data.animal) {
                        const animalSelect = document.querySelector(\`[data-index="\${index}"] .animal-select\`);
                        if (animalSelect) animalSelect.value = data.animal;
                    }
                    if (data.stage) {
                        const stageSelect = document.querySelector(\`[data-index="\${index}"] .stage-select\`);
                        if (stageSelect) stageSelect.value = data.stage;
                    }
                });
                
                updateSummary();
            }
        }

        // Load saved data on page load
        document.addEventListener('DOMContentLoaded', loadFromStorage);

        // Save on every change
        document.addEventListener('change', saveToStorage);
    </script>
</body>
</html>
        `;
        
        return html;
    }

    // Generate individual image card HTML
    generateImageCard(item, index) {
        const relativePath = item.file || item.relativePath || '';
        const imagePath = path.join(this.mediaDir, '..', '..', relativePath).replace(/\\/g, '/');
        const webPath = `../../${relativePath.replace(/\\/g, '/')}`;
        
        const allAnimals = [
            ...this.animalCategories.fish,
            ...this.animalCategories.birds,
            ...this.animalCategories.insects,
            ...this.animalCategories.mammals,
            ...this.animalCategories.amphibians,
            ...this.animalCategories.other
        ];
        
        return `
            <div class="image-card" data-index="${index}">
                <div class="image-container">
                    <img src="${webPath}" alt="Woodcarving image" loading="lazy" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='">
                </div>
                <div class="image-info">
                    <div class="filename">${path.basename(relativePath)}</div>
                    <div class="path">${relativePath}</div>
                    <div class="controls">
                        <select class="animal-select" onchange="updateClassification(${index}, 'animal', this.value)">
                            <option value="">🤔 Select Animal Type...</option>
                            <optgroup label="🐟 Fish">
                                ${this.animalCategories.fish.map(animal => 
                                    `<option value="${animal}">${animal.replace('_', ' ')}</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="🦅 Birds">
                                ${this.animalCategories.birds.map(animal => 
                                    `<option value="${animal}">${animal.replace('_', ' ')}</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="🦋 Insects & Small">
                                ${this.animalCategories.insects.map(animal => 
                                    `<option value="${animal}">${animal.replace('_', ' ')}</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="🦌 Mammals">
                                ${this.animalCategories.mammals.map(animal => 
                                    `<option value="${animal}">${animal.replace('_', ' ')}</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="🐸 Amphibians & Reptiles">
                                ${this.animalCategories.amphibians.map(animal => 
                                    `<option value="${animal}">${animal.replace('_', ' ')}</option>`
                                ).join('')}
                            </optgroup>
                            <optgroup label="🔮 Other">
                                ${this.animalCategories.other.map(animal => 
                                    `<option value="${animal}">${animal.replace('_', ' ')}</option>`
                                ).join('')}
                            </optgroup>
                        </select>
                        <select class="stage-select" onchange="updateClassification(${index}, 'stage', this.value)">
                            <option value="">🎨 Select Stage...</option>
                            ${this.processStages.map(stage => 
                                `<option value="${stage}">${stage.replace('_', ' ')}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    // Create all review HTML files
    async generateAllReviews() {
        console.log('🎨 Generating visual review HTML files...');
        
        // Load the latest batches
        const batches = this.loadLatestBatches();
        
        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        
        const generatedFiles = [];
        
        // Generate HTML for each batch
        for (const [batchName, batch] of Object.entries(batches)) {
            if (batch.length === 0) continue;
            
            console.log(`📝 Generating HTML for ${batchName} (${batch.length} images)...`);
            
            const html = this.generateAnimalClassificationHTML(batch, batchName);
            const filename = `${batchName}_review.html`;
            const filepath = path.join(this.outputDir, filename);
            
            fs.writeFileSync(filepath, html, 'utf8');
            generatedFiles.push(filename);
        }
        
        // Generate index page
        const indexHtml = this.generateIndexHTML(generatedFiles, batches);
        const indexPath = path.join(this.outputDir, 'index.html');
        fs.writeFileSync(indexPath, indexHtml, 'utf8');
        
        console.log('\n✅ Visual review files generated:');
        console.log(`📂 Output directory: ${this.outputDir}`);
        console.log(`🏠 Main page: ${indexPath}`);
        generatedFiles.forEach(file => {
            console.log(`   📄 ${file}`);
        });
        
        return {
            outputDir: this.outputDir,
            indexPath,
            generatedFiles
        };
    }

    // Generate index HTML with links to all reviews
    generateIndexHTML(files, batches) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔍 Animal Classification Hub</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .batch-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .batch-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .batch-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .batch-title {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: #fff;
        }
        .batch-stats {
            margin-bottom: 20px;
            opacity: 0.9;
        }
        .stat-item {
            margin-bottom: 8px;
        }
        .review-button {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 25px;
            display: inline-block;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .review-button:hover {
            background: linear-gradient(45deg, #ee5a24, #ff6b6b);
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .instructions {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .instructions h3 {
            margin-top: 0;
            color: #fff;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Animal Classification Hub</h1>
            <p class="subtitle">Manually categorize woodcarving images by animal type</p>
        </div>

        <div class="instructions">
            <h3>📋 How to Use This System:</h3>
            <ol>
                <li><strong>Choose a batch</strong> - Start with the batch that has the most images</li>
                <li><strong>Classify animals</strong> - Look at each image and select the correct animal type</li>
                <li><strong>Export results</strong> - When done, export the classifications as JSON</li>
                <li><strong>Create projects</strong> - Use the exported data to create separate animal projects</li>
            </ol>
            <p><strong>Note:</strong> Filenames are random camera names (IMG_001, etc.), so visual identification is required.</p>
        </div>

        <div class="batch-grid">
            ${Object.entries(batches).map(([batchName, batch]) => {
                if (batch.length === 0) return '';
                
                const filename = `${batchName}_review.html`;
                return `
                    <div class="batch-card">
                        <div class="batch-title">
                            ${this.getBatchIcon(batchName)} ${this.getBatchDisplayName(batchName)}
                        </div>
                        <div class="batch-stats">
                            <div class="stat-item">📊 <strong>${batch.length}</strong> images to classify</div>
                            <div class="stat-item">🎯 Need animal identification</div>
                            <div class="stat-item">⏱️ Est. ${Math.ceil(batch.length / 10)} minutes</div>
                        </div>
                        <a href="${filename}" class="review-button">
                            🚀 Start Classification
                        </a>
                    </div>
                `;
            }).join('')}
        </div>

        <div class="footer">
            <p>🎨 Woodcarving Animal Classification System</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    getBatchIcon(batchName) {
        const icons = {
            'bass_project': '🐟',
            'eagle_project': '🦅',
            'nature_folder': '🌿',
            'workshop_misc': '🔨'
        };
        return icons[batchName] || '📁';
    }

    getBatchDisplayName(batchName) {
        const names = {
            'bass_project': 'Bass Project Images',
            'eagle_project': 'Eagle Project Images',
            'nature_folder': 'Nature Folder Images',
            'workshop_misc': 'Workshop & Miscellaneous'
        };
        return names[batchName] || batchName.replace('_', ' ');
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new VisualReviewGenerator();
    generator.generateAllReviews()
        .then((result) => {
            console.log('\n🎉 Ready for visual review!');
            console.log('\n📋 Next steps:');
            console.log('1. Open the index.html file in your browser');
            console.log('2. Start with the largest batch first');
            console.log('3. Classify animals by looking at each image');
            console.log('4. Export the results when done');
            console.log('5. Use the exported JSON to create separate projects');
        })
        .catch(error => {
            console.error('❌ Failed to generate visual review:', error);
            process.exit(1);
        });
}

module.exports = VisualReviewGenerator;
