const fs = require('fs').promises;
const path = require('path');

async function generateVisualReviewBatches() {
    try {
        console.log('🔍 Generating visual review batches for project separation...');
        
        const projectsToReview = ['bass', 'eagle', 'nessie', 'stcollen'];
        const outputDir = path.join(__dirname, '..', 'visual-project-review');
        
        // Create output directory
        await fs.mkdir(outputDir, { recursive: true });
        
        for (const project of projectsToReview) {
            console.log(`\n📁 Processing ${project} project...`);
            
            const projectPath = path.join(__dirname, '..', 'public', 'media', 'projects', project);
            const imagesPath = path.join(projectPath, 'images');
            
            // Collect all images from process and final folders
            const allImages = [];
            
            // Check process folder
            const processPath = path.join(imagesPath, 'process');
            if (await pathExists(processPath)) {
                const processFiles = await fs.readdir(processPath);
                for (const file of processFiles) {
                    if (isImageFile(file)) {
                        allImages.push({
                            filename: file,
                            path: `/media/projects/${project}/images/process/${file}`,
                            category: 'process',
                            fullPath: path.join(processPath, file)
                        });
                    }
                }
            }
            
            // Check final folder
            const finalPath = path.join(imagesPath, 'final');
            if (await pathExists(finalPath)) {
                const finalFiles = await fs.readdir(finalPath);
                for (const file of finalFiles) {
                    if (isImageFile(file)) {
                        allImages.push({
                            filename: file,
                            path: `/media/projects/${project}/images/final/${file}`,
                            category: 'final',
                            fullPath: path.join(finalPath, file)
                        });
                    }
                }
            }
            
            console.log(`  Found ${allImages.length} images for ${project}`);
            
            // Generate HTML review page
            await generateProjectReviewHTML(project, allImages, outputDir);
        }
        
        // Generate index page
        await generateIndexHTML(projectsToReview, outputDir);
        
        console.log(`\n✅ Visual review batches generated in: ${outputDir}`);
        console.log('🌐 Open the index.html file in your browser to start reviewing');
        
    } catch (error) {
        console.error('❌ Error generating visual review batches:', error);
        throw error;
    }
}

async function generateProjectReviewHTML(project, images, outputDir) {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.toUpperCase()} Project - Visual Review</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .project-title {
            font-size: 2em;
            color: #333;
            margin: 0 0 10px 0;
        }
        .instructions {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
        }
        .category-section {
            margin: 30px 0;
        }
        .category-title {
            font-size: 1.5em;
            color: #555;
            margin-bottom: 15px;
            padding: 10px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .image-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .image-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .image-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            cursor: pointer;
        }
        .image-info {
            padding: 15px;
        }
        .image-filename {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 0.9em;
        }
        .image-path {
            font-size: 0.8em;
            color: #666;
            font-family: monospace;
        }
        .analysis-form {
            background: #fff3e0;
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
        }
        .analysis-form label {
            display: block;
            margin: 5px 0;
            font-size: 0.9em;
        }
        .analysis-form select, .analysis-form input {
            margin-left: 10px;
            padding: 2px 5px;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
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
            margin-top: 5%;
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
        .navigation {
            text-align: center;
            margin: 20px 0;
        }
        .navigation a {
            display: inline-block;
            padding: 10px 20px;
            background: #2196f3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 10px;
        }
        .save-analysis {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 1.1em;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="project-title">${project.toUpperCase()} Project Visual Review</h1>
        <p>Review and categorize images to separate different animals/sculptures into individual projects.</p>
    </div>
    
    <div class="navigation">
        <a href="index.html">← Back to All Projects</a>
    </div>
    
    <div class="instructions">
        <h3>Instructions:</h3>
        <ol>
            <li><strong>Click on images</strong> to view them full-size</li>
            <li><strong>Identify different animals/sculptures</strong> - each should be a separate project</li>
            <li><strong>Determine the carving stage</strong> for each image:
                <ul>
                    <li><em>Raw/Log</em>: Uncarved wood, initial cutting</li>
                    <li><em>Rough</em>: Basic shape carved, rough details</li>
                    <li><em>Detailed</em>: Fine details being added</li>
                    <li><em>Finishing</em>: Sanding, final touches</li>
                    <li><em>Final</em>: Completed piece</li>
                </ul>
            </li>
            <li><strong>Use the dropdowns</strong> below each image to categorize</li>
            <li><strong>Save your analysis</strong> when done</li>
        </ol>
    </div>
`;

    // Group images by category
    const processImages = images.filter(img => img.category === 'process');
    const finalImages = images.filter(img => img.category === 'final');
    
    if (processImages.length > 0) {
        html += `
    <div class="category-section">
        <h2 class="category-title">Process Images (${processImages.length})</h2>
        <div class="image-grid">
`;
        processImages.forEach((image, index) => {
            html += generateImageCard(image, index, project);
        });
        html += `
        </div>
    </div>
`;
    }
    
    if (finalImages.length > 0) {
        html += `
    <div class="category-section">
        <h2 class="category-title">Final Images (${finalImages.length})</h2>
        <div class="image-grid">
`;
        finalImages.forEach((image, index) => {
            html += generateImageCard(image, index + processImages.length, project);
        });
        html += `
        </div>
    </div>
`;
    }
    
    html += `
    <!-- Modal for full-size images -->
    <div id="imageModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImage">
    </div>
    
    <button class="save-analysis" onclick="saveAnalysis()">💾 Save Analysis</button>
    
    <script>
        // Modal functionality
        function openModal(imageSrc) {
            document.getElementById('imageModal').style.display = 'block';
            document.getElementById('modalImage').src = imageSrc;
        }
        
        document.querySelector('.close').onclick = function() {
            document.getElementById('imageModal').style.display = 'none';
        }
        
        window.onclick = function(event) {
            if (event.target == document.getElementById('imageModal')) {
                document.getElementById('imageModal').style.display = 'none';
            }
        }
        
        // Analysis saving
        function saveAnalysis() {
            const analysis = {
                project: '${project}',
                timestamp: new Date().toISOString(),
                images: []
            };
            
            document.querySelectorAll('.analysis-form').forEach(form => {
                const filename = form.dataset.filename;
                const animal = form.querySelector('.animal-select').value;
                const stage = form.querySelector('.stage-select').value;
                const notes = form.querySelector('.notes-input').value;
                
                analysis.images.push({
                    filename,
                    animal,
                    stage,
                    notes,
                    originalPath: form.dataset.path
                });
            });
            
            // Save to localStorage for now
            localStorage.setItem('${project}_analysis', JSON.stringify(analysis));
            
            // Download as JSON
            const blob = new Blob([JSON.stringify(analysis, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '${project}_visual_analysis.json';
            a.click();
            
            alert('Analysis saved! Check your downloads folder.');
        }
        
        // Load existing analysis if available
        window.onload = function() {
            const saved = localStorage.getItem('${project}_analysis');
            if (saved) {
                const analysis = JSON.parse(saved);
                analysis.images.forEach(img => {
                    const form = document.querySelector(\`[data-filename="\${img.filename}"]\`);
                    if (form) {
                        form.querySelector('.animal-select').value = img.animal || '';
                        form.querySelector('.stage-select').value = img.stage || '';
                        form.querySelector('.notes-input').value = img.notes || '';
                    }
                });
            }
        }
    </script>
</body>
</html>
`;

    await fs.writeFile(path.join(outputDir, `${project}_review.html`), html, 'utf8');
}

function generateImageCard(image, index, project) {
    return `
            <div class="image-card">
                <img src="${image.path}" alt="${image.filename}" onclick="openModal('${image.path}')">
                <div class="image-info">
                    <div class="image-filename">${image.filename}</div>
                    <div class="image-path">${image.path}</div>
                    <div class="analysis-form" data-filename="${image.filename}" data-path="${image.path}">
                        <label>
                            Animal/Sculpture:
                            <select class="animal-select">
                                <option value="">Select...</option>
                                <option value="bass">Bass</option>
                                <option value="trout">Trout</option>
                                <option value="salmon">Salmon</option>
                                <option value="pike">Pike</option>
                                <option value="other_fish">Other Fish</option>
                                <option value="eagle">Eagle</option>
                                <option value="owl">Owl</option>
                                <option value="other_bird">Other Bird</option>
                                <option value="nessie">Nessie/Monster</option>
                                <option value="st_collen">St. Collen</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label>
                            Carving Stage:
                            <select class="stage-select">
                                <option value="">Select...</option>
                                <option value="raw">Raw/Log</option>
                                <option value="rough">Rough Carving</option>
                                <option value="detailed">Detailed Work</option>
                                <option value="finishing">Finishing</option>
                                <option value="final">Final/Complete</option>
                            </select>
                        </label>
                        <label>
                            Notes:
                            <input type="text" class="notes-input" placeholder="Additional notes...">
                        </label>
                    </div>
                </div>
            </div>
`;
}

async function generateIndexHTML(projects, outputDir) {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Visual Review - Index</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .header {
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        .project-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.2s;
        }
        .project-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .project-title {
            font-size: 1.5em;
            margin-bottom: 15px;
            color: #333;
        }
        .review-button {
            display: inline-block;
            padding: 12px 24px;
            background: #2196f3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background 0.2s;
        }
        .review-button:hover {
            background: #1976d2;
        }
        .instructions {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #4caf50;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Woodcarving Project Visual Review</h1>
        <p>Analyze and categorize images to separate different animals/sculptures into individual projects</p>
    </div>
    
    <div class="instructions">
        <h3>Goal:</h3>
        <p>Review each project's images to identify different animals/sculptures that should be separated into individual projects. Each unique carving should have its own project folder with properly categorized process stages.</p>
    </div>
    
    <div class="project-grid">
`;

    projects.forEach(project => {
        html += `
        <div class="project-card">
            <h2 class="project-title">${project.toUpperCase()}</h2>
            <p>Review and categorize images in this project</p>
            <a href="${project}_review.html" class="review-button">Start Review →</a>
        </div>
`;
    });

    html += `
    </div>
    
    <div style="text-align: center; margin-top: 40px; padding: 20px;">
        <p><strong>After completing all reviews:</strong></p>
        <p>Use the downloaded JSON files to reorganize the projects and update the media system.</p>
    </div>
</body>
</html>
`;

    await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
}

async function pathExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

function isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

// Run if called directly
if (require.main === module) {
    generateVisualReviewBatches()
        .then(() => {
            console.log('\n🎉 Visual review system ready!');
            console.log('📂 Open visual-project-review/index.html in your browser to start');
        })
        .catch(error => {
            console.error('💥 Failed to generate visual review batches:', error);
            process.exit(1);
        });
}

module.exports = generateVisualReviewBatches;
