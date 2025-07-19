const fs = require('fs');
const path = require('path');

// Progress tracker and file organizer for batch review results
class ReviewProgressTracker {
    constructor() {
        this.batchReviewsDir = path.join(__dirname, '../batch-reviews');
        this.outputDir = path.join(__dirname, '../reorganization-results');
        this.inventoryPath = path.join(__dirname, '../master-inventory.json');
        this.inventory = null;
        this.allCategorizations = {};
        this.projectGroups = {};
        this.reorganizationPlan = {};
    }

    // Load inventory data
    loadInventory() {
        if (!fs.existsSync(this.inventoryPath)) {
            throw new Error('Master inventory not found. Run master-inventory-scanner.js first.');
        }
        this.inventory = JSON.parse(fs.readFileSync(this.inventoryPath, 'utf8'));
    }

    // Collect all categorizations from localStorage data
    collectCategorizations() {
        console.log('📊 Collecting categorizations from batch reviews...');
        
        // This would typically be run in a browser context to access localStorage
        // For now, we'll create a structure for manual input
        
        const categorizationTemplate = {
            timestamp: new Date().toISOString(),
            totalImages: this.inventory.totalImages,
            totalBatches: Math.ceil(this.inventory.totalImages / 50),
            reviewedBatches: 0,
            categorizedImages: 0,
            categorizations: {},
            projectSummary: {
                dragonfly: { count: 0, files: [] },
                butterfly: { count: 0, files: [] },
                fish: { count: 0, files: [] },
                duck: { count: 0, files: [] },
                eagle: { count: 0, files: [] },
                stcollen: { count: 0, files: [] },
                bass: { count: 0, files: [] },
                nessie: { count: 0, files: [] },
                nature: { count: 0, files: [] },
                tools: { count: 0, files: [] },
                process: { count: 0, files: [] },
                other: { count: 0, files: [] }
            },
            stagesSummary: {
                initial: { count: 0, files: [] },
                process: { count: 0, files: [] },
                final: { count: 0, files: [] },
                detail: { count: 0, files: [] }
            }
        };
        
        // Save template for manual data entry
        const templatePath = path.join(this.outputDir, 'categorization-template.json');
        fs.writeFileSync(templatePath, JSON.stringify(categorizationTemplate, null, 2));
        
        console.log(`📄 Categorization template saved to: ${templatePath}`);
        return categorizationTemplate;
    }

    // Generate reorganization plan based on categorizations
    generateReorganizationPlan(categorizations) {
        console.log('🗂️  Generating reorganization plan...');
        
        const plan = {
            timestamp: new Date().toISOString(),
            totalFiles: Object.keys(categorizations).length,
            newStructure: {
                'media/projects/': {
                    'dragonfly/': { process: [], final: [], detail: [] },
                    'butterfly/': { process: [], final: [], detail: [] },
                    'fish/': { process: [], final: [], detail: [] },
                    'duck/': { process: [], final: [], detail: [] },
                    'eagle/': { process: [], final: [], detail: [] },
                    'stcollen/': { process: [], final: [], detail: [] },
                    'bass/': { process: [], final: [], detail: [] },
                    'nessie/': { process: [], final: [], detail: [] }
                },
                'media/nature/': { wildlife: [], insects: [], landscapes: [] },
                'media/tools/': { workshop: [], equipment: [] },
                'media/process/': { documentation: [], techniques: [] },
                'media/other/': { misc: [] }
            },
            moveOperations: [],
            stats: {
                totalMoves: 0,
                projectFiles: 0,
                natureFiles: 0,
                toolFiles: 0,
                processFiles: 0,
                otherFiles: 0
            }
        };
        
        // Process categorizations and generate move operations
        Object.entries(categorizations).forEach(([fileIndex, cat]) => {
            const file = this.inventory.allFiles[parseInt(fileIndex)];
            if (!file) return;
            
            const category = cat.category;
            const stage = cat.stage || 'process';
            const notes = cat.notes || '';
            
            let newPath = '';
            
            // Determine new path based on category and stage
            if (['dragonfly', 'butterfly', 'fish', 'duck', 'eagle', 'stcollen', 'bass', 'nessie'].includes(category)) {
                newPath = `media/projects/${category}/${stage}/${file.fileName}`;
                plan.stats.projectFiles++;
            } else if (category === 'nature') {
                newPath = `media/nature/wildlife/${file.fileName}`;
                plan.stats.natureFiles++;
            } else if (category === 'tools') {
                newPath = `media/tools/workshop/${file.fileName}`;
                plan.stats.toolFiles++;
            } else if (category === 'process') {
                newPath = `media/process/documentation/${file.fileName}`;
                plan.stats.processFiles++;
            } else {
                newPath = `media/other/misc/${file.fileName}`;
                plan.stats.otherFiles++;
            }
            
            // Create move operation
            const moveOp = {
                sourceFile: file.relativePath,
                sourcePath: file.fullPath,
                targetPath: newPath,
                targetFullPath: path.join(path.dirname(file.fullPath), '../..', newPath),
                category: category,
                stage: stage,
                notes: notes,
                fileSize: file.size,
                fileName: file.fileName
            };
            
            plan.moveOperations.push(moveOp);
            plan.stats.totalMoves++;
        });
        
        this.reorganizationPlan = plan;
        return plan;
    }

    // Generate file mover script
    generateFileMoverScript(plan) {
        console.log('📜 Generating file mover script...');
        
        const script = `const fs = require('fs');
const path = require('path');

// Auto-generated file mover script
class FileMover {
    constructor() {
        this.basePath = path.join(__dirname, '../public');
        this.backupPath = path.join(__dirname, '../backup-before-reorganization');
        this.moveOperations = ${JSON.stringify(plan.moveOperations, null, 8)};
        this.dryRun = true; // Set to false to actually move files
    }

    // Create backup of all files
    createBackup() {
        console.log('📦 Creating backup...');
        
        if (!fs.existsSync(this.backupPath)) {
            fs.mkdirSync(this.backupPath, { recursive: true });
        }
        
        // Copy all files to backup
        this.moveOperations.forEach(op => {
            const backupFile = path.join(this.backupPath, op.sourceFile);
            const backupDir = path.dirname(backupFile);
            
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            if (fs.existsSync(op.sourcePath)) {
                fs.copyFileSync(op.sourcePath, backupFile);
            }
        });
        
        console.log('✅ Backup created successfully');
    }

    // Execute file moves
    executeMove() {
        console.log(\`🚀 Starting file reorganization (\${this.dryRun ? 'DRY RUN' : 'ACTUAL MOVE'})...\`);
        
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        
        this.moveOperations.forEach((op, index) => {
            try {
                const targetDir = path.dirname(op.targetFullPath);
                
                // Create target directory
                if (!this.dryRun) {
                    if (!fs.existsSync(targetDir)) {
                        fs.mkdirSync(targetDir, { recursive: true });
                    }
                    
                    // Move file
                    if (fs.existsSync(op.sourcePath)) {
                        fs.renameSync(op.sourcePath, op.targetFullPath);
                        successCount++;
                    } else {
                        throw new Error('Source file not found');
                    }
                } else {
                    // Dry run - just log what would happen
                    console.log(\`Would move: \${op.sourceFile} -> \${op.targetPath}\`);
                    successCount++;
                }
            } catch (error) {
                errorCount++;
                errors.push({
                    operation: op,
                    error: error.message
                });
                console.error(\`Error moving \${op.sourceFile}: \${error.message}\`);
            }
        });
        
        console.log(\`\n📊 REORGANIZATION COMPLETE!\`);
        console.log(\`✅ Successful moves: \${successCount}\`);
        console.log(\`❌ Errors: \${errorCount}\`);
        
        if (errors.length > 0) {
            const errorLogPath = path.join(__dirname, '../reorganization-errors.json');
            fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2));
            console.log(\`📄 Error log saved to: \${errorLogPath}\`);
        }
        
        return { successCount, errorCount, errors };
    }
}

// Run the file mover
if (require.main === module) {
    const mover = new FileMover();
    
    // Create backup first
    mover.createBackup();
    
    // Execute moves
    mover.executeMove();
}

module.exports = FileMover;`;
        
        const scriptPath = path.join(this.outputDir, 'execute-reorganization.js');
        fs.writeFileSync(scriptPath, script);
        
        console.log(`📄 File mover script saved to: ${scriptPath}`);
        return scriptPath;
    }

    // Generate HTML report
    generateHTMLReport(plan) {
        console.log('📊 Generating HTML report...');
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reorganization Plan - Woodcarving Media</title>
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
        .section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .section h3 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .file-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 10px;
        }
        .file-item {
            padding: 8px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
        }
        .file-item:last-child {
            border-bottom: none;
        }
        .file-source {
            color: #999;
        }
        .file-target {
            color: #667eea;
            font-weight: bold;
        }
        .category-section {
            margin-bottom: 20px;
        }
        .category-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #eee;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🗂️ Media Reorganization Plan</h1>
        <p>Comprehensive file restructuring based on visual analysis</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${plan.stats.totalMoves}</div>
            <div class="stat-label">Total Files to Move</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${plan.stats.projectFiles}</div>
            <div class="stat-label">Project Files</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${plan.stats.natureFiles}</div>
            <div class="stat-label">Nature Files</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${plan.stats.toolFiles}</div>
            <div class="stat-label">Tool Files</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${plan.stats.processFiles}</div>
            <div class="stat-label">Process Files</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${plan.stats.otherFiles}</div>
            <div class="stat-label">Other Files</div>
        </div>
    </div>

    <div class="section">
        <h3>📋 Reorganization Overview</h3>
        <p>This plan will reorganize ${plan.stats.totalMoves} files based on visual analysis and categorization.</p>
        
        <div class="progress-bar">
            <div class="progress-fill" style="width: 100%">
                Ready to Execute
            </div>
        </div>
        
        <h4>New Folder Structure:</h4>
        <ul>
            <li><strong>media/projects/</strong> - Individual woodcarving projects</li>
            <li><strong>media/nature/</strong> - Wildlife and nature photography</li>
            <li><strong>media/tools/</strong> - Workshop tools and equipment</li>
            <li><strong>media/process/</strong> - Process documentation</li>
            <li><strong>media/other/</strong> - Miscellaneous files</li>
        </ul>
    </div>

    <div class="section">
        <h3>🎨 Project Breakdown</h3>
        ${Object.entries(plan.newStructure['media/projects/']).map(([project, stages]) => `
            <div class="category-section">
                <div class="category-title">${project.charAt(0).toUpperCase() + project.slice(1)} Project</div>
                <div class="file-list">
                    ${plan.moveOperations
                        .filter(op => op.category === project)
                        .slice(0, 10)
                        .map(op => `
                            <div class="file-item">
                                <span class="file-source">${op.sourceFile}</span>
                                <span class="file-target">${op.targetPath}</span>
                            </div>
                        `).join('')}
                    ${plan.moveOperations.filter(op => op.category === project).length > 10 ? 
                        `<div class="file-item"><em>... and ${plan.moveOperations.filter(op => op.category === project).length - 10} more files</em></div>` : ''}
                </div>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h3>⚙️ Next Steps</h3>
        <ol>
            <li><strong>Review this plan</strong> - Verify the reorganization looks correct</li>
            <li><strong>Run backup</strong> - Execute the reorganization script in dry-run mode first</li>
            <li><strong>Execute moves</strong> - Set dryRun = false and run the script</li>
            <li><strong>Update code</strong> - Regenerate media-organized.ts with new structure</li>
            <li><strong>Test website</strong> - Verify all images display correctly</li>
        </ol>
    </div>

    <div class="section">
        <h3>📄 File Operations</h3>
        <div class="file-list">
            ${plan.moveOperations.slice(0, 50).map(op => `
                <div class="file-item">
                    <span class="file-source">${op.sourceFile}</span>
                    <span class="file-target">${op.targetPath}</span>
                </div>
            `).join('')}
            ${plan.moveOperations.length > 50 ? 
                `<div class="file-item"><em>... and ${plan.moveOperations.length - 50} more operations</em></div>` : ''}
        </div>
    </div>
</body>
</html>`;
        
        const reportPath = path.join(this.outputDir, 'reorganization-plan.html');
        fs.writeFileSync(reportPath, html);
        
        console.log(`📄 HTML report saved to: ${reportPath}`);
        return reportPath;
    }

    // Run the complete process
    async runAnalysis() {
        console.log('🔍 Starting review progress analysis...');
        
        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        
        // Load inventory
        this.loadInventory();
        
        // Collect categorizations (template for now)
        const categoryTemplate = this.collectCategorizations();
        
        console.log('\n🎯 ANALYSIS SYSTEM READY!');
        console.log(`📁 Output directory: ${this.outputDir}`);
        console.log(`📄 Categorization template: categorization-template.json`);
        console.log(`\n📋 Next steps:`);
        console.log(`1. Complete the batch reviews at batch-reviews/index.html`);
        console.log(`2. Export categorization data to categorization-template.json`);
        console.log(`3. Run this script again to generate reorganization plan`);
        console.log(`4. Execute the reorganization with the generated script`);
        
        return categoryTemplate;
    }
}

// Run the analysis
if (require.main === module) {
    const tracker = new ReviewProgressTracker();
    tracker.runAnalysis().catch(console.error);
}

module.exports = ReviewProgressTracker;
