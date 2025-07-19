const fs = require('fs');
const path = require('path');

class VisualImageAnalyzer {
    constructor() {
        this.mediaDir = path.join(__dirname, '..', 'public', 'media');
        this.results = {
            totalAnalyzed: 0,
            visuallyReviewed: 0,
            needsManualReview: 0,
            autoClassified: 0,
            uniqueAnimalsFound: new Set(),
            projectCreationSuggestions: [],
            visualReviewBatches: []
        };
        
        // Animal/object detection patterns for visual analysis
        this.animalTypes = {
            // Fish categories
            'bass': ['largemouth_bass', 'smallmouth_bass', 'striped_bass', 'bass_generic'],
            'trout': ['rainbow_trout', 'brook_trout', 'brown_trout'],
            'salmon': ['atlantic_salmon', 'coho_salmon', 'chinook_salmon'],
            'pike': ['northern_pike', 'muskie'],
            'panfish': ['bluegill', 'sunfish', 'perch', 'crappie'],
            'catfish': ['channel_catfish', 'flathead_catfish', 'bullhead'],
            'other_fish': ['walleye', 'carp', 'gar', 'sucker'],
            
            // Birds
            'eagle': ['bald_eagle', 'golden_eagle'],
            'owl': ['barn_owl', 'great_horned_owl', 'screech_owl'],
            'hawk': ['red_tailed_hawk', 'coopers_hawk', 'sharp_shinned_hawk'],
            'waterfowl': ['duck', 'goose', 'swan'],
            'songbird': ['cardinal', 'robin', 'blue_jay', 'wren'],
            'woodpecker': ['pileated_woodpecker', 'downy_woodpecker', 'red_bellied_woodpecker'],
            'heron': ['great_blue_heron', 'green_heron'],
            
            // Insects & Small Creatures
            'butterfly': ['monarch', 'swallowtail', 'admiral', 'fritillary'],
            'dragonfly': ['common_darner', 'skimmer', 'clubtail'],
            'bee': ['honey_bee', 'bumblebee', 'carpenter_bee'],
            'spider': ['orb_weaver', 'jumping_spider', 'wolf_spider'],
            'beetle': ['ladybug', 'june_bug', 'ground_beetle'],
            
            // Amphibians & Reptiles
            'frog': ['bull_frog', 'tree_frog', 'leopard_frog'],
            'turtle': ['box_turtle', 'painted_turtle', 'snapping_turtle'],
            'lizard': ['gecko', 'skink', 'anole'],
            'snake': ['garter_snake', 'rat_snake', 'water_snake'],
            
            // Mammals
            'deer': ['whitetail_deer', 'mule_deer', 'elk'],
            'bear': ['black_bear', 'brown_bear'],
            'canine': ['wolf', 'coyote', 'fox'],
            'small_mammal': ['rabbit', 'squirrel', 'chipmunk', 'raccoon'],
            'livestock': ['horse', 'cow', 'pig', 'sheep', 'goat'],
            
            // Marine Life
            'marine_mammal': ['dolphin', 'whale', 'seal'],
            'shark': ['great_white', 'hammerhead', 'tiger_shark'],
            'octopus': ['common_octopus', 'giant_pacific_octopus'],
            
            // Mythical/Religious
            'mythical': ['dragon', 'phoenix', 'griffin'],
            'religious': ['angel', 'cross', 'st_collen'],
            'monster': ['nessie', 'lake_monster', 'sea_serpent']
        };
        
        // Process stages for visual identification
        this.processStages = {
            'raw_log': {
                visual_cues: ['bark_visible', 'rough_texture', 'natural_edge', 'chainsaw_marks'],
                description: 'Raw log with bark, natural edges, rough chainsaw cuts'
            },
            'rough_carving': {
                visual_cues: ['basic_shape', 'tool_marks', 'blocked_out', 'no_fine_details'],
                description: 'Basic animal shape roughed out, tool marks visible, no fine details'
            },
            'detailed_work': {
                visual_cues: ['features_defined', 'texture_work', 'fine_carving', 'progress_visible'],
                description: 'Features being defined, texture work, fine carving in progress'
            },
            'finishing': {
                visual_cues: ['smooth_surface', 'sanding_marks', 'refinement', 'near_complete'],
                description: 'Smooth surfaces, sanding marks, refinement work, nearly complete'
            },
            'final_complete': {
                visual_cues: ['polished_finish', 'complete_details', 'paint_stain', 'display_ready'],
                description: 'Polished finish, all details complete, possibly painted/stained'
            }
        };
    }

    // Create visual review batches for browser-based analysis
    async createVisualReviewBatches() {
        console.log('🖼️ Creating visual review batches for browser analysis...');
        
        const allFiles = await this.scanAllImages();
        
        // Group images by current project location for review
        const projectGroups = {
            'bass': [],
            'eagle': [],
            'nessie': [],
            'stcollen': [],
            'nature': [],
            'workshop': [],
            'unorganized': []
        };
        
        // Sort files into groups
        allFiles.forEach(file => {
            const pathLower = file.relativePath.toLowerCase();
            
            if (pathLower.includes('projects/bass/') || pathLower.includes('richard peacock bass')) {
                projectGroups.bass.push(file);
            } else if (pathLower.includes('projects/eagle/') || pathLower.includes('/eagle/')) {
                projectGroups.eagle.push(file);
            } else if (pathLower.includes('projects/nessie/') || pathLower.includes('/nessie/')) {
                projectGroups.nessie.push(file);
            } else if (pathLower.includes('projects/stcollen/') || pathLower.includes('st collen')) {
                projectGroups.stcollen.push(file);
            } else if (pathLower.includes('/nature/') || pathLower.includes('nature-collection')) {
                projectGroups.nature.push(file);
            } else if (pathLower.includes('/workshop/')) {
                projectGroups.workshop.push(file);
            } else {
                projectGroups.unorganized.push(file);
            }
        });
        
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
        const batchFile = path.join(__dirname, '..', `visual-review-batches-${timestamp}.json`);
        
        fs.writeFileSync(batchFile, JSON.stringify(batches, null, 2), 'utf8');
        
        // Generate HTML files for each batch
        await this.generateBatchHTMLFiles(batches, timestamp);
        
        this.results.visualReviewBatches = batches;
        this.results.totalAnalyzed = allFiles.length;
        this.results.needsManualReview = allFiles.length; // All need visual review
        
        return batches;
    }

    // Generate HTML files for visual review
    async generateBatchHTMLFiles(batches, timestamp) {
        console.log('🌐 Generating HTML review interfaces...');
        
        const outputDir = path.join(__dirname, '..', 'visual-animal-review');
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
        
        // Generate classification template
        const templateHTML = this.generateClassificationTemplate();
        fs.writeFileSync(path.join(outputDir, 'classification-template.html'), templateHTML, 'utf8');
        
        console.log(`✅ Generated HTML files in: ${outputDir}`);
        console.log('🌐 Start the review server with: node scripts/media-review-server.js');
        console.log(`📖 Open: http://localhost:3001/visual-animal-review/index.html`);
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
    <title>Visual Animal Classification Review</title>
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
        .animal-guide { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .export-section { background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Visual Animal Classification Review</h1>
            <p>Review and classify woodcarving images by animal type and process stage. Since filenames are random camera names, each image must be visually examined.</p>
        </div>

        <div class="instructions">
            <h3>📋 Instructions:</h3>
            <ol>
                <li><strong>Open each batch</strong> - Click the batch links below to review images</li>
                <li><strong>Classify animals</strong> - For each image, identify the specific animal being carved</li>
                <li><strong>Note process stage</strong> - Identify if it's raw log, rough carving, detailed work, finishing, or final</li>
                <li><strong>Export results</strong> - Use browser tools to export your classifications</li>
                <li><strong>Create new projects</strong> - Each unique animal should get its own project folder</li>
            </ol>
        </div>

        <div class="project-grid">
            ${Object.entries(projectStats).map(([project, stats]) => `
                <div class="project-card">
                    <div class="project-title">📁 ${project.toUpperCase()}</div>
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

        <div class="animal-guide">
            <h3>🐾 Animal Categories to Look For:</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                <div><strong>Fish:</strong> Bass, Trout, Salmon, Pike, Catfish, etc.</div>
                <div><strong>Birds:</strong> Eagle, Owl, Duck, Cardinal, etc.</div>
                <div><strong>Insects:</strong> Butterfly, Dragonfly, Bee, etc.</div>
                <div><strong>Mammals:</strong> Deer, Bear, Rabbit, etc.</div>
                <div><strong>Reptiles:</strong> Turtle, Snake, Lizard, etc.</div>
                <div><strong>Marine:</strong> Dolphin, Whale, Shark, etc.</div>
                <div><strong>Mythical:</strong> Dragon, Nessie, etc.</div>
                <div><strong>Religious:</strong> Angel, Cross, St. Collen, etc.</div>
            </div>
        </div>

        <div class="export-section">
            <h3>📤 After Review:</h3>
            <p>Once you've classified the animals in each batch, use your browser's developer tools (F12) to run this script in the console to export your classifications:</p>
            <code style="display: block; padding: 10px; background: white; border-radius: 4px; font-family: monospace;">
                // Export all classifications
                console.log(JSON.stringify(window.animalClassifications || {}, null, 2));
            </code>
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
        
        <button onclick="exportClassifications()" class="export-button">📤 Export Classifications</button>
        <button onclick="importClassifications()" class="export-button">📥 Import Classifications</button>
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
                            <select id="animal-${index}" onchange="updateClassification(${index})">
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
                                    <option value="unknown">Unknown/Unclear</option>
                                    <option value="not_animal">Not an Animal</option>
                                    <option value="multiple">Multiple Animals</option>
                                </optgroup>
                            </select>
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

        function updateClassification(index) {
            const animal = document.getElementById('animal-' + index).value;
            const stage = document.getElementById('stage-' + index).value;
            const notes = document.getElementById('notes-' + index).value;
            
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
            saveClassifications();
        }

        function updateProgress() {
            const total = ${batch.images.length};
            const classified = Object.values(window.animalClassifications[batchId] || {})
                .filter(c => c.animal && c.stage).length;
            
            const percentage = (classified / total) * 100;
            document.getElementById('progressFill').style.width = percentage + '%';
            document.getElementById('progressText').textContent = classified + '/' + total + ' images classified';
        }

        function saveClassifications() {
            localStorage.setItem('animalClassifications_' + batchId, 
                JSON.stringify(window.animalClassifications[batchId]));
        }

        function loadSavedClassifications() {
            const classifications = window.animalClassifications[batchId] || {};
            
            for (const [index, data] of Object.entries(classifications)) {
                if (data.animal) document.getElementById('animal-' + index).value = data.animal;
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

        function importClassifications() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            const data = JSON.parse(e.target.result);
                            if (data.classifications) {
                                window.animalClassifications[batchId] = data.classifications;
                                loadSavedClassifications();
                                alert('Classifications imported successfully!');
                            }
                        } catch (err) {
                            alert('Error importing file: ' + err.message);
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
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
    </script>
</body>
</html>`;
    }

    generateClassificationTemplate() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Classification Export Template</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        code { background: #e9ecef; padding: 2px 4px; border-radius: 4px; }
        pre { background: #e9ecef; padding: 15px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Classification Export Instructions</h1>
        
        <div class="section">
            <h3>📤 Exporting All Classifications</h3>
            <p>After classifying images in the review batches, use your browser's developer tools to export all data:</p>
            <ol>
                <li>Press <code>F12</code> to open developer tools</li>
                <li>Go to the <strong>Console</strong> tab</li>
                <li>Paste and run this script:</li>
            </ol>
            <pre>
// Export all classifications from all batches
const allClassifications = {};
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('animalClassifications_')) {
        const batchId = key.replace('animalClassifications_', '');
        try {
            allClassifications[batchId] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.warn('Could not parse:', key);
        }
    }
}

// Create export data
const exportData = {
    exportTimestamp: new Date().toISOString(),
    totalBatches: Object.keys(allClassifications).length,
    totalClassifications: Object.values(allClassifications).reduce((sum, batch) => sum + Object.keys(batch).length, 0),
    classifications: allClassifications
};

// Download as JSON
const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'all_animal_classifications_' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.json';
a.click();
URL.revokeObjectURL(url);

console.log('Export complete!', exportData);
            </pre>
        </div>
        
        <div class="section">
            <h3>📊 Classification Summary</h3>
            <p>To get a summary of your classifications:</p>
            <pre>
// Get classification summary
const summary = {};
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('animalClassifications_')) {
        const batchId = key.replace('animalClassifications_', '');
        try {
            const batch = JSON.parse(localStorage.getItem(key));
            Object.values(batch).forEach(classification => {
                if (classification.animal) {
                    if (!summary[classification.animal]) {
                        summary[classification.animal] = 0;
                    }
                    summary[classification.animal]++;
                }
            });
        } catch (e) {
            console.warn('Could not parse:', key);
        }
    }
}

console.table(summary);
            </pre>
        </div>
        
        <div class="section">
            <h3>🔄 Processing Classifications</h3>
            <p>Once you have the exported JSON file, you can process it with a Node.js script to:</p>
            <ul>
                <li>Create new project folders for each unique animal</li>
                <li>Move images to their correct locations</li>
                <li>Organize by process stage</li>
                <li>Update the media-organized.ts file</li>
            </ul>
            <p>Save your exported JSON file and run the processing script to apply all classifications.</p>
        </div>
    </div>
</body>
</html>`;
    }

    async scanAllImages() {
        const allFiles = [];
        
        // Scan organized projects directory (images are in subdirectories)
        const projectsDir = path.join(this.mediaDir, 'projects');
        await this.scanProjectsDirectory(projectsDir, allFiles);
        
        // Scan unorganized directories that might need classification
        const unorganizedDirs = [
            'nature',
            'workshop', 
            'Eagle',
            'Nessie',
            'St Collen statue',
            'Richard Peacock Bass',
            'mixed',
            'nature-collection',
            'archive',
            '1', '2', '3', '4', '5', '6',
            'iCloud Photos from Christian Lancaster',
            'iCloud Photos from Christian Lancaster (1)'
        ];
        
        for (const dirName of unorganizedDirs) {
            const dirPath = path.join(this.mediaDir, dirName);
            if (fs.existsSync(dirPath)) {
                await this.scanDirectory(dirPath, allFiles, dirName);
            }
        }
        
        return allFiles;
    }

    async scanProjectsDirectory(projectsDir, files) {
        if (!fs.existsSync(projectsDir)) return;
        
        const projects = fs.readdirSync(projectsDir).filter(name => {
            return fs.statSync(path.join(projectsDir, name)).isDirectory();
        });
        
        for (const project of projects) {
            const projectPath = path.join(projectsDir, project);
            
            // Check for images directly in project folder
            await this.scanDirectory(projectPath, files, `projects_${project}`, 1);
            
            // Check for organized structure (project/images/stage/)
            const imagesDir = path.join(projectPath, 'images');
            if (fs.existsSync(imagesDir)) {
                await this.scanDirectory(imagesDir, files, `projects_${project}`, 3);
            }
        }
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

    async runVisualAnalysis() {
        console.log('🚀 Starting visual analysis system...');
        
        const batches = await this.createVisualReviewBatches();
        
        console.log('\n=== VISUAL ANALYSIS SETUP COMPLETE ===');
        console.log(`📊 Total images to review: ${this.results.totalAnalyzed}`);
        console.log(`📦 Review batches created: ${batches.length}`);
        console.log('\n🌐 Next steps:');
        console.log('1. Start the review server: node scripts/media-review-server.js');
        console.log('2. Open: http://localhost:3001/visual-animal-review/index.html');
        console.log('3. Review and classify each image batch');
        console.log('4. Export classifications using browser tools');
        console.log('5. Process classifications to create new projects');
        
        return batches;
    }
}

// Run if called directly
if (require.main === module) {
    const analyzer = new VisualImageAnalyzer();
    analyzer.runVisualAnalysis()
        .then(() => {
            console.log('\n✅ Visual analysis system ready! Start the review server and begin classifying.');
        })
        .catch(error => {
            console.error('❌ Setup failed:', error);
            process.exit(1);
        });
}

module.exports = VisualImageAnalyzer;
