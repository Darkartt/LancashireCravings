const fs = require('fs');
const path = require('path');

class AutomatedImageAnalyzer {
    constructor() {
        this.mediaDir = path.join(__dirname, '..', 'public', 'media');
        this.results = {
            totalAnalyzed: 0,
            correctlyPlaced: 0,
            misplaced: 0,
            uncertain: 0,
            suggestions: []
        };
    }

    // Analyze filename and path for woodcarving project clues
    analyzeFilenameAndPath(filePath) {
        const normalizedPath = filePath.toLowerCase().replace(/\\/g, '/');
        const filename = path.basename(filePath).toLowerCase();
        
        // Project type detection - Updated with actual projects
        const projectTypes = {
            'bass': ['bass', 'fish', 'trout', 'salmon', 'fishing'],
            'eagle': ['eagle', 'bird', 'raptor', 'talon', 'wing'],
            'nessie': ['nessie', 'loch', 'monster', 'serpent', 'dragon'],
            'stcollen': ['stcollen', 'st_collen', 'st-collen', 'saint_collen', 'celtic_cross']
        };

        // Process stage detection
        const processStages = {
            'rough': ['rough', 'initial', 'start', 'begin', 'outline'],
            'detail': ['detail', 'carving', 'work', 'progress', 'carve'],
            'final': ['final', 'finish', 'complete', 'done', 'sanded', 'polished']
        };

        // Wood type detection
        const woodTypes = {
            'basswood': ['basswood', 'bass wood', 'lime'],
            'cedar': ['cedar', 'red cedar', 'white cedar'],
            'pine': ['pine', 'white pine', 'yellow pine'],
            'oak': ['oak', 'red oak', 'white oak'],
            'walnut': ['walnut', 'black walnut'],
            'maple': ['maple', 'hard maple', 'soft maple']
        };

        const analysis = {
            detectedProject: null,
            detectedStage: null,
            detectedWood: null,
            confidence: 0,
            pathClues: [],
            filenameClues: []
        };

        // Analyze path structure
        const pathParts = normalizedPath.split('/');
        
        // Check for project type in path
        for (const [project, keywords] of Object.entries(projectTypes)) {
            if (pathParts.some(part => keywords.some(keyword => part.includes(keyword)))) {
                analysis.detectedProject = project;
                analysis.pathClues.push(`Project: ${project}`);
                analysis.confidence += 0.3;
            }
        }

        // Also check if filename contains project name directly
        const filenameProjects = ['bass', 'eagle', 'nessie', 'stcollen'];
        for (const project of filenameProjects) {
            // For stcollen, require exact match to avoid false positives with "collen"
            if (project === 'stcollen') {
                if (filename.includes('stcollen') || filename.includes('st_collen') || filename.includes('st-collen')) {
                    analysis.detectedProject = project;
                    analysis.filenameClues.push(`Project name in filename: ${project}`);
                    analysis.confidence += 0.4;
                    break;
                }
            } else {
                if (filename.includes(project)) {
                    analysis.detectedProject = project;
                    analysis.filenameClues.push(`Project name in filename: ${project}`);
                    analysis.confidence += 0.4;
                    break;
                }
            }
        }

        // Check for process stage in path
        for (const [stage, keywords] of Object.entries(processStages)) {
            if (pathParts.some(part => keywords.some(keyword => part.includes(keyword)))) {
                analysis.detectedStage = stage;
                analysis.pathClues.push(`Stage: ${stage}`);
                analysis.confidence += 0.2;
            }
        }

        // Check for wood type in filename
        for (const [wood, keywords] of Object.entries(woodTypes)) {
            if (keywords.some(keyword => filename.includes(keyword))) {
                analysis.detectedWood = wood;
                analysis.filenameClues.push(`Wood: ${wood}`);
                analysis.confidence += 0.1;
            }
        }

        // Analyze filename for additional clues
        const filenameWords = filename.replace(/[_\-\.]/g, ' ').split(' ');
        
        // Look for sequence numbers or dates
        const hasSequence = filenameWords.some(word => /^\d+$/.test(word) || /\d{4}-\d{2}-\d{2}/.test(word));
        if (hasSequence) {
            analysis.filenameClues.push('Has sequence/date');
            analysis.confidence += 0.05;
        }

        // Look for process indicators
        const processIndicators = ['wip', 'progress', 'step', 'phase', 'before', 'after'];
        const hasProcessIndicator = processIndicators.some(indicator => filename.includes(indicator));
        if (hasProcessIndicator) {
            analysis.filenameClues.push('Has process indicator');
            analysis.confidence += 0.1;
        }

        return analysis;
    }

    // Verify if current categorization matches analysis
    verifyCategorization(filePath, analysis) {
        const normalizedPath = filePath.toLowerCase().replace(/\\/g, '/');
        const pathParts = normalizedPath.split('/');
        
        // Special case: stcollen images are logs (raw wood) and are always correctly placed
        if (normalizedPath.includes('stcollen')) {
            return {
                currentProject: 'stcollen',
                currentStage: 'logs',
                projectMatch: true,
                stageMatch: true,
                overallMatch: true,
                issues: [],
                specialCase: 'stcollen logs - always correctly placed'
            };
        }
        
        // Extract current categorization from path - Updated with actual projects
        const currentProject = pathParts.find(part => 
            ['bass', 'eagle', 'nessie', 'stcollen'].includes(part)
        );
        
        const currentStage = pathParts.find(part => 
            ['rough', 'detail', 'final'].includes(part)
        );

        // Check if it's in nature or workshop folder
        const isNature = pathParts.includes('nature');
        const isWorkshop = pathParts.includes('workshop');
        
        const verification = {
            currentProject,
            currentStage,
            isNature,
            isWorkshop,
            projectMatch: analysis.detectedProject === currentProject,
            stageMatch: analysis.detectedStage === currentStage,
            overallMatch: false,
            issues: []
        };

        // If it's in nature or workshop, don't suggest moving to projects unless very confident
        if (isNature || isWorkshop) {
            // Only flag as misplaced if we have very high confidence and clear project indicators
            if (analysis.detectedProject && analysis.confidence > 0.7) {
                verification.overallMatch = false;
                verification.issues.push(`High confidence project detection (${analysis.detectedProject}) but placed in ${isNature ? 'nature' : 'workshop'}`);
            } else {
                verification.overallMatch = true; // Assume correctly placed
            }
        } else {
            // For project images, check project and stage match
            verification.overallMatch = verification.projectMatch && 
                (verification.stageMatch || !analysis.detectedStage);

            // Identify specific issues
            if (analysis.detectedProject && !verification.projectMatch) {
                verification.issues.push(`Project mismatch: detected ${analysis.detectedProject}, placed in ${currentProject}`);
            }
            
            if (analysis.detectedStage && !verification.stageMatch) {
                verification.issues.push(`Stage mismatch: detected ${analysis.detectedStage}, placed in ${currentStage}`);
            }
        }

        return verification;
    }

    // Scan all organized images
    async scanAllImages() {
        const organizedDirs = ['projects', 'nature', 'workshop'];
        const allImages = [];

        for (const dir of organizedDirs) {
            const dirPath = path.join(this.mediaDir, dir);
            if (fs.existsSync(dirPath)) {
                const images = this.findImagesRecursively(dirPath);
                allImages.push(...images);
            }
        }

        console.log(`Found ${allImages.length} images to analyze`);
        return allImages;
    }

    // Recursively find image files
    findImagesRecursively(dir) {
        const images = [];
        const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        
        function scanDir(currentDir) {
            const items = fs.readdirSync(currentDir);
            
            for (const item of items) {
                const itemPath = path.join(currentDir, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    // Skip archive/backup directories
                    if (!item.toLowerCase().includes('archive') && 
                        !item.toLowerCase().includes('backup') && 
                        !item.toLowerCase().includes('original-files')) {
                        scanDir(itemPath);
                    }
                } else if (imageExts.includes(path.extname(item).toLowerCase())) {
                    images.push(itemPath);
                }
            }
        }
        
        scanDir(dir);
        return images;
    }

    // Analyze all images and generate report
    async analyzeAllImages() {
        console.log('Starting automated image analysis...');
        
        const images = await this.scanAllImages();
        const analysisResults = [];
        
        let processed = 0;
        
        for (const imagePath of images) {
            try {
                const analysis = this.analyzeFilenameAndPath(imagePath);
                const verification = this.verifyCategorization(imagePath, analysis);
                
                const result = {
                    filePath: imagePath,
                    relativePath: path.relative(this.mediaDir, imagePath),
                    analysis,
                    verification,
                    recommendation: this.generateRecommendation(analysis, verification)
                };
                
                analysisResults.push(result);
                
                // Update counters
                this.results.totalAnalyzed++;
                if (verification.overallMatch) {
                    this.results.correctlyPlaced++;
                } else if (verification.issues.length > 0) {
                    this.results.misplaced++;
                } else {
                    this.results.uncertain++;
                }
                
                processed++;
                if (processed % 100 === 0) {
                    console.log(`Processed ${processed}/${images.length} images...`);
                }
                
            } catch (error) {
                console.error(`Error analyzing ${imagePath}:`, error.message);
            }
        }
        
        console.log('Analysis complete!');
        return analysisResults;
    }

    // Generate recommendation based on analysis
    generateRecommendation(analysis, verification) {
        if (verification.overallMatch) {
            return {
                action: 'keep',
                reason: 'Correctly categorized',
                confidence: 'high'
            };
        }
        
        if (verification.issues.length > 0) {
            const suggestedPath = this.suggestCorrectPath(analysis, verification);
            return {
                action: 'move',
                reason: verification.issues.join('; '),
                suggestedPath,
                confidence: analysis.confidence > 0.5 ? 'high' : 'medium'
            };
        }
        
        return {
            action: 'review',
            reason: 'Unable to determine correct categorization',
            confidence: 'low'
        };
    }

    // Suggest correct path based on analysis
    suggestCorrectPath(analysis, verification) {
        if (!analysis.detectedProject) return null;
        
        const basePath = `projects/${analysis.detectedProject}`;
        const stage = analysis.detectedStage || 'detail'; // Default to detail if uncertain
        
        return `${basePath}/images/${stage}/`;
    }

    // Generate comprehensive report
    generateReport(analysisResults) {
        const report = {
            summary: this.results,
            timestamp: new Date().toISOString(),
            misplacedImages: analysisResults.filter(r => r.recommendation.action === 'move'),
            uncertainImages: analysisResults.filter(r => r.recommendation.action === 'review'),
            highConfidenceIssues: analysisResults.filter(r => 
                r.recommendation.action === 'move' && r.recommendation.confidence === 'high'
            )
        };

        return report;
    }
}

// Main execution
async function main() {
    const analyzer = new AutomatedImageAnalyzer();
    
    try {
        const analysisResults = await analyzer.analyzeAllImages();
        const report = analyzer.generateReport(analysisResults);
        
        // Save detailed results
        const detailedResultsPath = path.join(__dirname, '..', 'automated-analysis-results.json');
        fs.writeFileSync(detailedResultsPath, JSON.stringify(analysisResults, null, 2));
        
        // Save summary report
        const reportPath = path.join(__dirname, '..', 'automated-analysis-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\n=== AUTOMATED ANALYSIS COMPLETE ===');
        console.log(`Total images analyzed: ${report.summary.totalAnalyzed}`);
        console.log(`Correctly placed: ${report.summary.correctlyPlaced}`);
        console.log(`Misplaced: ${report.summary.misplaced}`);
        console.log(`Uncertain: ${report.summary.uncertain}`);
        console.log(`\nHigh confidence issues: ${report.highConfidenceIssues.length}`);
        
        console.log('\nFiles saved:');
        console.log(`- Detailed results: ${detailedResultsPath}`);
        console.log(`- Summary report: ${reportPath}`);
        
        // Show top issues
        if (report.highConfidenceIssues.length > 0) {
            console.log('\n=== TOP ISSUES TO REVIEW ===');
            report.highConfidenceIssues.slice(0, 10).forEach((issue, index) => {
                console.log(`${index + 1}. ${issue.relativePath}`);
                console.log(`   Issue: ${issue.recommendation.reason}`);
                console.log(`   Suggested: ${issue.recommendation.suggestedPath}`);
                console.log('');
            });
        }
        
    } catch (error) {
        console.error('Analysis failed:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = AutomatedImageAnalyzer;
