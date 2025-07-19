const fs = require('fs');
const path = require('path');

class SmartProcessOrderer {
    constructor() {
        this.enhancedResultsPath = this.getLatestAnalysisFile();
        this.mediaOrganizedPath = path.join(__dirname, '..', 'src', 'lib', 'media-organized.ts');
        
        if (!this.enhancedResultsPath) {
            throw new Error('No enhanced analysis results file found');
        }
        
        console.log(`Using analysis file: ${this.enhancedResultsPath}`);
    }

    getLatestAnalysisFile() {
        const files = fs.readdirSync('.')
            .filter(file => file.match(/^enhanced-analysis-results-.*\.json$/))
            .sort()
            .reverse();
        
        return files.length > 0 ? files[0] : null;
    }

    async reorderProjectImages() {
        console.log('Loading enhanced analysis results...');
        const analysisData = JSON.parse(fs.readFileSync(this.enhancedResultsPath, 'utf8'));
        
        console.log('Processing image ordering by project...');
        
        // Group by project
        const projectGroups = this.groupByProject(analysisData);
        
        // Create ordering report
        const report = {
            timestamp: new Date().toISOString(),
            projects: {},
            summary: {
                totalProjects: Object.keys(projectGroups).length,
                totalImages: analysisData.length,
                imagesWithSequence: 0,
                imagesWithStage: 0
            }
        };
        
        for (const [projectName, images] of Object.entries(projectGroups)) {
            console.log(`\nProcessing project: ${projectName} (${images.length} images)`);
            
            const projectReport = this.processProjectOrder(projectName, images);
            report.projects[projectName] = projectReport;
            
            // Update summary
            report.summary.imagesWithSequence += projectReport.imagesWithSequence;
            report.summary.imagesWithStage += projectReport.imagesWithStage;
        }
        
        // Save the ordering report
        const reportPath = `process-ordering-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\n=== ORDERING REPORT ===`);
        console.log(`Total projects: ${report.summary.totalProjects}`);
        console.log(`Total images: ${report.summary.totalImages}`);
        console.log(`Images with sequence numbers: ${report.summary.imagesWithSequence}`);
        console.log(`Images with detected stages: ${report.summary.imagesWithStage}`);
        console.log(`Report saved to: ${reportPath}`);
        
        return report;
    }

    groupByProject(analysisData) {
        const groups = {};
        
        for (const result of analysisData) {
            if (result.verification && result.verification.currentProject) {
                const project = result.verification.currentProject;
                if (!groups[project]) {
                    groups[project] = [];
                }
                groups[project].push(result);
            }
        }
        
        return groups;
    }

    processProjectOrder(projectName, images) {
        const report = {
            projectName,
            totalImages: images.length,
            imagesWithSequence: 0,
            imagesWithStage: 0,
            stageBreakdown: {},
            sequenceRange: { min: null, max: null },
            suggestedOrder: []
        };
        
        // Analyze stage distribution
        const stageGroups = {};
        
        for (const image of images) {
            const analysis = image.analysis;
            
            // Count sequence numbers
            if (analysis.sequenceNumber !== undefined) {
                report.imagesWithSequence++;
                
                if (report.sequenceRange.min === null || analysis.sequenceNumber < report.sequenceRange.min) {
                    report.sequenceRange.min = analysis.sequenceNumber;
                }
                if (report.sequenceRange.max === null || analysis.sequenceNumber > report.sequenceRange.max) {
                    report.sequenceRange.max = analysis.sequenceNumber;
                }
            }
            
            // Count stages
            if (analysis.detectedStage) {
                report.imagesWithStage++;
                
                const stage = analysis.detectedStage;
                if (!report.stageBreakdown[stage]) {
                    report.stageBreakdown[stage] = 0;
                }
                report.stageBreakdown[stage]++;
                
                if (!stageGroups[stage]) {
                    stageGroups[stage] = [];
                }
                stageGroups[stage].push(image);
            }
        }
        
        // Create suggested ordering
        const stageOrder = ['raw_log', 'rough_carving', 'detailed_work', 'finishing', 'final_complete'];
        let globalOrder = 1;
        
        for (const stage of stageOrder) {
            if (stageGroups[stage]) {
                // Sort images within stage by sequence number
                const stageImages = stageGroups[stage].sort((a, b) => {
                    const seqA = a.analysis.sequenceNumber || 0;
                    const seqB = b.analysis.sequenceNumber || 0;
                    return seqA - seqB;
                });
                
                for (const image of stageImages) {
                    report.suggestedOrder.push({
                        relativePath: image.relativePath,
                        originalSequence: image.analysis.sequenceNumber,
                        detectedStage: image.analysis.detectedStage,
                        suggestedOrder: globalOrder++,
                        confidence: image.analysis.confidence
                    });
                }
            }
        }
        
        console.log(`  - Stage breakdown:`, report.stageBreakdown);
        console.log(`  - Sequence range: ${report.sequenceRange.min} to ${report.sequenceRange.max}`);
        console.log(`  - Images with sequence: ${report.imagesWithSequence}/${report.totalImages}`);
        
        return report;
    }
}

// Run the smart orderer
async function main() {
    try {
        const orderer = new SmartProcessOrderer();
        await orderer.reorderProjectImages();
        console.log('Smart process ordering analysis completed successfully!');
    } catch (error) {
        console.error('Error in smart process ordering:', error);
        process.exit(1);
    }
}

main();
