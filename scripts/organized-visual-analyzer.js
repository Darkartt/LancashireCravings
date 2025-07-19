const fs = require('fs');
const path = require('path');

class OrganizedImageAnalyzer {
    constructor() {
        this.mediaDir = path.join(__dirname, '..', 'public', 'media');
        this.results = {
            totalAnalyzed: 0,
            visualReviewBatches: []
        };
    }

    // Create visual review batches for browser-based analysis - only organized media
    async createVisualReviewBatches() {
        console.log('🖼️ Creating visual review batches for organized media...');
        
        const allFiles = await this.scanOrganizedImages();
        
        // Group images by current project location for review
        const projectGroups = {
            'bass': [],
            'eagle': [],
            'nessie': [],
            'stcollen': [],
            'nature': [],
            'workshop': [],
            'richard_peacock_bass': [],
            'loose_eagle': [],
            'loose_nessie': [],
            'loose_stcollen': []
        };
        
        // Sort files into groups
        allFiles.forEach(file => {
            const pathLower = file.relativePath.toLowerCase().replace(/\\/g, '/');
            
            if (pathLower.includes('projects/bass/')) projectGroups.bass.push(file);
            else if (pathLower.includes('projects/eagle/')) projectGroups.eagle.push(file);
            else if (pathLower.includes('projects/nessie/')) projectGroups.nessie.push(file);
            else if (pathLower.includes('projects/stcollen/')) projectGroups.stcollen.push(file);
            else if (pathLower.includes('/nature/')) projectGroups.nature.push(file);
            else if (pathLower.includes('/workshop/')) projectGroups.workshop.push(file);
            else if (pathLower.includes('richard peacock bass/') || pathLower.includes('richard peacock bass\\')) projectGroups.richard_peacock_bass.push(file);
            else if ((pathLower.includes('/eagle/') || pathLower.includes('\\eagle\\')) && !pathLower.includes('projects/')) projectGroups.loose_eagle.push(file);
            else if ((pathLower.includes('/nessie/') || pathLower.includes('\\nessie\\')) && !pathLower.includes('projects/')) projectGroups.loose_nessie.push(file);
            else if (pathLower.includes('st collen') || pathLower.includes('stcollen')) projectGroups.loose_stcollen.push(file);
            else {
                // Add to a general group for any unmatched files
                if (!projectGroups.unmatched) projectGroups.unmatched = [];
                projectGroups.unmatched.push(file);
            }
        });
        
        // Debug output
        console.log('📊 Project group sizes:');
        for (const [project, files] of Object.entries(projectGroups)) {
            if (files.length > 0) {
                console.log(`  ${project}: ${files.length} images`);
            }
        }
        
        // Create batches (50 images per batch for manageable review)
        const batchSize = 50;
        const batches = [];
        
        for (const [project, files] of Object.entries(projectGroups)) {
            if (files.length === 0) continue;
            
            console.log(`📁 ${project}: ${files.length} images`);
            
            // Split into batches
            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                const batchNumber = Math.floor(i / batchSize) + 1;
                
                batches.push({
                    id: `${project}_batch_${batchNumber}`,
                    project: project,
                    batchNumber: batchNumber,
                    totalBatches: Math.ceil(files.length / batchSize),
                    images: batch,
                    status: 'pending'
                });
            }
        }
        
        console.log(`📊 Created ${batches.length} review batches`);
        
        // Save batch information
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const batchFile = path.join(__dirname, '..', `organized-visual-review-batches-${timestamp}.json`);
        
        fs.writeFileSync(batchFile, JSON.stringify(batches, null, 2), 'utf8');
        
        // Generate HTML files for each batch
        await this.generateBatchHTMLFiles(batches, timestamp);
        
        this.results.visualReviewBatches = batches;
        this.results.totalAnalyzed = allFiles.length;
        
        return batches;
    }

    async scanOrganizedImages() {
        const allFiles = [];
        
        // Scan organized projects directory
        const projectsDir = path.join(this.mediaDir, 'projects');
        if (fs.existsSync(projectsDir)) {
            await this.scanDirectory(projectsDir, allFiles, 'projects');
        }
        
        // Scan nature directory
        const natureDir = path.join(this.mediaDir, 'nature');
        if (fs.existsSync(natureDir)) {
            await this.scanDirectory(natureDir, allFiles, 'nature');
        }
        
        // Scan workshop directory
        const workshopDir = path.join(this.mediaDir, 'workshop');
        if (fs.existsSync(workshopDir)) {
            await this.scanDirectory(workshopDir, allFiles, 'workshop');
        }
        
        // Scan loose directories that contain project images
        const looseDirs = ['Richard Peacock Bass', 'Eagle', 'Nessie', 'St Collen statue'];
        for (const dirName of looseDirs) {
            const dirPath = path.join(this.mediaDir, dirName);
            if (fs.existsSync(dirPath)) {
                await this.scanDirectory(dirPath, allFiles, dirName);
            }
        }
        
        console.log(`📊 Found ${allFiles.length} organized images`);
        return allFiles;
    }

    async scanDirectory(dir, files, category, maxDepth = 10, currentDepth = 0) {
        if (currentDepth >= maxDepth) return;
        
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    await this.scanDirectory(fullPath, files, category, maxDepth, currentDepth + 1);
                } else if (this.isImageFile(item)) {
                    files.push({
                        fullPath,
                        relativePath: path.relative(this.mediaDir, fullPath),
                        category,
                        filename: item
                    });
                }
            }
        } catch (error) {
            console.warn(`⚠️ Could not scan ${dir}: ${error.message}`);
        }
    }

    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'];
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    // Generate HTML files for visual review
    async generateBatchHTMLFiles(batches, timestamp) {
        console.log('🌐 Generating HTML review interfaces...');
        
        const outputDir = path.join(__dirname, '..', 'organized-visual-review');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Create main index file
        const indexHTML = this.generateIndexHTML(batches);
        fs.writeFileSync(path.join(outputDir, 'index.html'), indexHTML, 'utf8');
        
        // Generate individual batch files
        for (const batch of batches) {
            const batchHTML = this.generateBatchHTML(batch);
            fs.writeFileSync(
                path.join(outputDir, `${batch.id}.html`),
                batchHTML,
                'utf8'
            );
        }
        
        console.log(`✅ Generated HTML files in: ${outputDir}`);
        console.log('🌐 Start the review server and navigate to: http://localhost:3001/organized-visual-review/index.html');
    }

    generateIndexHTML(batches) {
        const projectStats = {};
        batches.forEach(batch => {
            if (!projectStats[batch.project]) {
                projectStats[batch.project] = { batches: 0, images: 0 };
            }
            projectStats[batch.project].batches++;
            projectStats[batch.project].images += batch.images.length;
        });

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organized Media Visual Classification</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .project-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .project-title { font-size: 1.5em; font-weight: bold; margin-bottom: 10px; color: #333; }
        .stats { color: #666; margin-bottom: 15px; }
        .batch-list { list-style: none; padding: 0; }
        .batch-item { margin: 5px 0; }
        .batch-link { display: inline-block; padding: 8px 12px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 0.9em; }
        .batch-link:hover { background: #0056b3; }
        .instructions { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Organized Media Visual Classification</h1>
            <p>Review and classify woodcarving images from organized media directories.</p>
        </div>

        <div class="instructions">
            <h3>📋 Instructions:</h3>
            <ol>
                <li><strong>Open each batch</strong> - Click the batch links below to review images</li>
                <li><strong>Classify animals</strong> - For each image, identify the specific animal being carved</li>
                <li><strong>Note process stage</strong> - Identify if it's raw log, rough carving, detailed work, finishing, or final</li>
                <li><strong>Export results</strong> - Use browser tools to export your classifications</li>
            </ol>
        </div>

        <div class="project-grid">
            ${Object.entries(projectStats).map(([project, stats]) => `
                <div class="project-card">
                    <div class="project-title">📁 ${project.toUpperCase().replace(/_/g, ' ')}</div>
                    <div class="stats">
                        ${stats.images} images in ${stats.batches} batches
                    </div>
                    <ul class="batch-list">
                        ${batches.filter(b => b.project === project).map(batch => `
                            <li class="batch-item">
                                <a href="${batch.id}.html" class="batch-link">
                                    Batch ${batch.batchNumber}/${batch.totalBatches} (${batch.images.length} images)
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
    }

    generateBatchHTML(batch) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review: ${batch.project.toUpperCase()} - Batch ${batch.batchNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .navigation { margin-bottom: 20px; }
        .nav-button { display: inline-block; padding: 10px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px; }
        .nav-button:hover { background: #0056b3; }
        .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .image-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .image-container { position: relative; height: 250px; overflow: hidden; }
        .image-container img { width: 100%; height: 100%; object-fit: cover; cursor: pointer; }
        .image-info { padding: 15px; }
        .filename { font-weight: bold; color: #333; margin-bottom: 10px; word-break: break-all; }
        .classification-form { margin-top: 10px; }
        .form-group { margin-bottom: 10px; }
        .form-group label { display: block; font-weight: bold; margin-bottom: 5px; color: #555; }
        .form-group select, .form-group input { width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px; }
        .status-indicator { position: absolute; top: 10px; right: 10px; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
        .status-pending { background: #ffc107; color: #333; }
        .status-classified { background: #28a745; color: white; }
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); }
        .modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 90%; max-height: 90%; }
        .modal-content img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .close-modal { position: absolute; top: 10px; right: 25px; color: white; font-size: 35px; font-weight: bold; cursor: pointer; }
        .progress-bar { background: #e9ecef; border-radius: 4px; height: 20px; margin: 10px 0; }
        .progress-fill { background: #28a745; height: 100%; border-radius: 4px; transition: width 0.3s; }
        .export-button { background: #17a2b8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
        .export-button:hover { background: #138496; }
        .save-button { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 10px 5px; }
        .save-button:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 ${batch.project.toUpperCase()} - Batch ${batch.batchNumber}/${batch.totalBatches}</h1>
        <p>Classify each image by animal type and process stage. Click images to enlarge.</p>
        
        <div class="progress-bar">
            <div id="progressFill" class="progress-fill" style="width: 0%"></div>
        </div>
        <p id="progressText">0/${batch.images.length} images classified</p>
        
        <div style="margin: 10px 0;">
            <button onclick="saveClassifications()" class="save-button">💾 Save Progress</button>
            <button onclick="exportClassifications()" class="export-button">📤 Export Classifications</button>
            <span id="saveStatus" style="margin-left: 10px; color: #28a745;"></span>
        </div>
    </div>

    <div class="navigation">
        <a href="index.html" class="nav-button">← Back to Index</a>
        ${batch.batchNumber > 1 ? `<a href="${batch.project}_batch_${batch.batchNumber - 1}.html" class="nav-button">← Previous Batch</a>` : ''}
        ${batch.batchNumber < batch.totalBatches ? `<a href="${batch.project}_batch_${batch.batchNumber + 1}.html" class="nav-button">Next Batch →</a>` : ''}
    </div>

    <div class="image-grid" id="imageGrid">
        ${batch.images.map((image, index) => `
            <div class="image-card" data-index="${index}">
                <div class="image-container">
                    <img src="/media/${image.relativePath}" alt="${image.filename}" onclick="openModal(this.src)">
                    <div class="status-indicator status-pending" id="status-${index}">Pending</div>
                </div>
                <div class="image-info">
                    <div class="filename">${image.filename}</div>
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 10px;">${image.relativePath}</div>
                    
                    <div class="classification-form">
                        <div class="form-group">
                            <label for="animal-${index}">Animal Type:</label>
                            <select id="animal-${index}" onchange="handleAnimalSelection(${index})">
                                <option value="">-- Select Animal --</option>
                                <optgroup label="Fish">
                                    <option value="largemouth_bass">Largemouth Bass</option>
                                    <option value="smallmouth_bass">Smallmouth Bass</option>
                                    <option value="striped_bass">Striped Bass</option>
                                    <option value="bass_generic">Bass (Generic)</option>
                                    <option value="trout">Trout</option>
                                    <option value="salmon">Salmon</option>
                                    <option value="pike">Pike</option>
                                    <option value="muskie">Muskie</option>
                                    <option value="walleye">Walleye</option>
                                    <option value="perch">Perch</option>
                                    <option value="catfish">Catfish</option>
                                    <option value="sunfish">Sunfish</option>
                                    <option value="other_fish">Other Fish</option>
                                </optgroup>
                                <optgroup label="Birds">
                                    <option value="bald_eagle">Bald Eagle</option>
                                    <option value="golden_eagle">Golden Eagle</option>
                                    <option value="eagle_generic">Eagle (Generic)</option>
                                    <option value="owl">Owl</option>
                                    <option value="hawk">Hawk</option>
                                    <option value="duck">Duck</option>
                                    <option value="goose">Goose</option>
                                    <option value="heron">Heron</option>
                                    <option value="cardinal">Cardinal</option>
                                    <option value="woodpecker">Woodpecker</option>
                                    <option value="other_bird">Other Bird</option>
                                </optgroup>
                                <optgroup label="Insects & Small Creatures">
                                    <option value="butterfly">Butterfly</option>
                                    <option value="dragonfly">Dragonfly</option>
                                    <option value="bee">Bee</option>
                                    <option value="spider">Spider</option>
                                    <option value="frog">Frog</option>
                                    <option value="turtle">Turtle</option>
                                    <option value="lizard">Lizard</option>
                                    <option value="snake">Snake</option>
                                </optgroup>
                                <optgroup label="Mammals">
                                    <option value="deer">Deer</option>
                                    <option value="bear">Bear</option>
                                    <option value="wolf">Wolf</option>
                                    <option value="fox">Fox</option>
                                    <option value="rabbit">Rabbit</option>
                                    <option value="squirrel">Squirrel</option>
                                    <option value="horse">Horse</option>
                                    <option value="cow">Cow</option>
                                    <option value="other_mammal">Other Mammal</option>
                                </optgroup>
                                <optgroup label="Marine Life">
                                    <option value="dolphin">Dolphin</option>
                                    <option value="whale">Whale</option>
                                    <option value="shark">Shark</option>
                                    <option value="octopus">Octopus</option>
                                </optgroup>
                                <optgroup label="Mythical/Religious">
                                    <option value="nessie">Nessie/Lake Monster</option>
                                    <option value="dragon">Dragon</option>
                                    <option value="st_collen">St. Collen</option>
                                    <option value="angel">Angel</option>
                                    <option value="cross">Cross</option>
                                </optgroup>
                                <optgroup label="Other">
                                    <option value="other_custom">Other (specify below)</option>
                                    <option value="unknown">Unknown/Unclear</option>
                                    <option value="not_animal">Not an Animal</option>
                                    <option value="multiple">Multiple Animals</option>
                                </optgroup>
                            </select>
                        </div>
                        
                        <div class="form-group" id="custom-animal-group-${index}" style="display: none;">
                            <label for="custom-animal-${index}">Custom Animal Type:</label>
                            <input type="text" id="custom-animal-${index}" placeholder="Enter animal type..." onchange="updateClassification(${index})">
                        </div>
                        
                        <div class="form-group">
                            <label for="stage-${index}">Process Stage:</label>
                            <select id="stage-${index}" onchange="updateClassification(${index})">
                                <option value="">-- Select Stage --</option>
                                <option value="raw_log">Raw Log (with bark)</option>
                                <option value="rough_carving">Rough Carving (basic shape)</option>
                                <option value="detailed_work">Detailed Work (features defined)</option>
                                <option value="finishing">Finishing (sanding, refinement)</option>
                                <option value="final_complete">Final Complete (painted/stained)</option>
                                <option value="unknown_stage">Unknown Stage</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="notes-${index}">Notes (optional):</label>
                            <input type="text" id="notes-${index}" placeholder="Any additional notes..." onchange="updateClassification(${index})">
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>

    <!-- Image Modal -->
    <div id="imageModal" class="modal" onclick="closeModal()">
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <div class="modal-content">
            <img id="modalImage" src="" alt="">
        </div>
    </div>

    <script>
        // Store classifications
        window.animalClassifications = window.animalClassifications || {};
        const batchId = '${batch.id}';
        
        if (!window.animalClassifications[batchId]) {
            window.animalClassifications[batchId] = {};
        }

        // Load saved classifications
        const savedData = localStorage.getItem('animalClassifications_' + batchId);
        if (savedData) {
            try {
                const saved = JSON.parse(savedData);
                window.animalClassifications[batchId] = saved;
                loadSavedClassifications();
            } catch (e) {
                console.warn('Could not load saved classifications:', e);
            }
        }

        function handleAnimalSelection(index) {
            const animalSelect = document.getElementById('animal-' + index);
            const customGroup = document.getElementById('custom-animal-group-' + index);
            
            if (animalSelect.value === 'other_custom') {
                customGroup.style.display = 'block';
            } else {
                customGroup.style.display = 'none';
                document.getElementById('custom-animal-' + index).value = '';
            }
            
            updateClassification(index);
        }

        function updateClassification(index) {
            const animalSelect = document.getElementById('animal-' + index);
            const customAnimal = document.getElementById('custom-animal-' + index);
            const stage = document.getElementById('stage-' + index).value;
            const notes = document.getElementById('notes-' + index).value;
            
            // Determine the actual animal value
            let animal = animalSelect.value;
            if (animal === 'other_custom' && customAnimal.value.trim()) {
                animal = 'custom:' + customAnimal.value.trim();
            }
            
            const imageCard = document.querySelector('[data-index="' + index + '"]');
            const filename = imageCard.querySelector('.filename').textContent;
            const relativePath = imageCard.querySelector('.image-info > div:nth-child(2)').textContent;
            
            window.animalClassifications[batchId][index] = {
                filename: filename,
                relativePath: relativePath,
                animal: animal,
                stage: stage,
                notes: notes,
                timestamp: new Date().toISOString()
            };
            
            // Update status indicator
            const statusEl = document.getElementById('status-' + index);
            if (animal && stage) {
                statusEl.textContent = 'Classified';
                statusEl.className = 'status-indicator status-classified';
            } else {
                statusEl.textContent = 'Pending';
                statusEl.className = 'status-indicator status-pending';
            }
            
            updateProgress();
            autoSave();
        }

        function updateProgress() {
            const total = ${batch.images.length};
            const classified = Object.values(window.animalClassifications[batchId] || {})
                .filter(c => c.animal && c.stage).length;
            
            const percentage = (classified / total) * 100;
            document.getElementById('progressFill').style.width = percentage + '%';
            document.getElementById('progressText').textContent = classified + '/' + total + ' images classified';
        }

        function autoSave() {
            saveClassifications();
            showSaveStatus('Auto-saved');
        }

        function saveClassifications() {
            try {
                localStorage.setItem('animalClassifications_' + batchId, 
                    JSON.stringify(window.animalClassifications[batchId]));
                showSaveStatus('Saved successfully');
                return true;
            } catch (e) {
                console.error('Save failed:', e);
                showSaveStatus('Save failed', true);
                return false;
            }
        }

        function showSaveStatus(message, isError = false) {
            const statusEl = document.getElementById('saveStatus');
            statusEl.textContent = message;
            statusEl.style.color = isError ? '#dc3545' : '#28a745';
            
            setTimeout(() => {
                statusEl.textContent = '';
            }, 3000);
        }

        function loadSavedClassifications() {
            const classifications = window.animalClassifications[batchId] || {};
            
            for (const [index, data] of Object.entries(classifications)) {
                if (data.animal) {
                    if (data.animal.startsWith('custom:')) {
                        // Handle custom animal type
                        document.getElementById('animal-' + index).value = 'other_custom';
                        document.getElementById('custom-animal-group-' + index).style.display = 'block';
                        document.getElementById('custom-animal-' + index).value = data.animal.substring(7);
                    } else {
                        document.getElementById('animal-' + index).value = data.animal;
                    }
                }
                if (data.stage) document.getElementById('stage-' + index).value = data.stage;
                if (data.notes) document.getElementById('notes-' + index).value = data.notes;
                
                const statusEl = document.getElementById('status-' + index);
                if (data.animal && data.stage) {
                    statusEl.textContent = 'Classified';
                    statusEl.className = 'status-indicator status-classified';
                }
            }
            
            updateProgress();
        }

        function exportClassifications() {
            const data = {
                batchId: batchId,
                project: '${batch.project}',
                batchNumber: ${batch.batchNumber},
                classifications: window.animalClassifications[batchId] || {},
                exportTimestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = batchId + '_classifications.json';
            a.click();
            URL.revokeObjectURL(url);
        }

        function openModal(src) {
            document.getElementById('modalImage').src = src;
            document.getElementById('imageModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('imageModal').style.display = 'none';
        }

        // Initialize
        updateProgress();
        
        // Set up periodic auto-save every 30 seconds
        setInterval(autoSave, 30000);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveClassifications();
                showSaveStatus('Manual save complete');
            }
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                exportClassifications();
            }
        });
        
        // Show initial save status
        showSaveStatus('Data loaded from browser storage');
    </script>
</body>
</html>`;
    }

    async runVisualAnalysis() {
        console.log('🚀 Starting organized media visual analysis...');
        
        const batches = await this.createVisualReviewBatches();
        
        console.log('\n=== ORGANIZED VISUAL ANALYSIS SETUP COMPLETE ===');
        console.log(`📊 Total images to review: ${this.results.totalAnalyzed}`);
        console.log(`📦 Review batches created: ${batches.length}`);
        console.log('\n🌐 Next steps:');
        console.log('1. Navigate to: http://localhost:3001/organized-visual-review/index.html');
        console.log('2. Review and classify each image batch');
        console.log('3. Export classifications using browser tools');
        console.log('4. Process classifications to create new projects');
        
        return batches;
    }
}

// Run if called directly
if (require.main === module) {
    const analyzer = new OrganizedImageAnalyzer();
    analyzer.runVisualAnalysis()
        .then(() => {
            console.log('\n✅ Organized visual analysis system ready!');
        })
        .catch(error => {
            console.error('❌ Setup failed:', error);
            process.exit(1);
        });
}

module.exports = OrganizedImageAnalyzer;
