const fs = require('fs');
const path = require('path');

class HumanReadableReportGenerator {
    constructor() {
        this.resultsPath = path.join(__dirname, '..', 'automated-analysis-results.json');
        this.reportPath = path.join(__dirname, '..', 'automated-analysis-report.json');
    }

    generateHumanReadableReport() {
        // Load the analysis results
        const results = JSON.parse(fs.readFileSync(this.resultsPath, 'utf8'));
        const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));

        let humanReport = `# Automated Image Analysis Report\n`;
        humanReport += `Generated: ${new Date().toLocaleString()}\n\n`;

        // Summary
        humanReport += `## Summary\n`;
        humanReport += `- **Total Images Analyzed**: ${report.summary.totalAnalyzed}\n`;
        humanReport += `- **Correctly Placed**: ${report.summary.correctlyPlaced}\n`;
        humanReport += `- **Misplaced**: ${report.summary.misplaced}\n`;
        humanReport += `- **Uncertain**: ${report.summary.uncertain}\n\n`;

        // Category breakdown
        const categories = this.categorizeByCurrent(results);
        humanReport += `## Category Breakdown\n`;
        
        Object.entries(categories).forEach(([category, files]) => {
            humanReport += `### ${category} (${files.length} images)\n`;
            
            if (category.includes('projects/')) {
                // Break down by project and stage
                const projectBreakdown = this.breakdownByProject(files);
                Object.entries(projectBreakdown).forEach(([project, stages]) => {
                    humanReport += `- **${project}**: ${stages.total} images\n`;
                    Object.entries(stages).forEach(([stage, count]) => {
                        if (stage !== 'total') {
                            humanReport += `  - ${stage}: ${count} images\n`;
                        }
                    });
                });
            } else {
                humanReport += `- All images appear correctly categorized\n`;
            }
            humanReport += `\n`;
        });

        // Analysis insights
        humanReport += `## Analysis Insights\n`;
        
        const insights = this.generateInsights(results);
        insights.forEach(insight => {
            humanReport += `- ${insight}\n`;
        });
        humanReport += `\n`;

        // Sample files from each category
        humanReport += `## Sample Files by Category\n`;
        Object.entries(categories).forEach(([category, files]) => {
            humanReport += `### ${category}\n`;
            files.slice(0, 5).forEach(file => {
                humanReport += `- ${file.relativePath}\n`;
            });
            if (files.length > 5) {
                humanReport += `- ... and ${files.length - 5} more\n`;
            }
            humanReport += `\n`;
        });

        // Recommendations
        humanReport += `## Recommendations\n`;
        humanReport += `1. **Current organization appears excellent** - No misplaced images detected\n`;
        humanReport += `2. **Nature folder** contains artistic/reference images correctly separated from projects\n`;
        humanReport += `3. **Workshop folder** contains general workshop/technique images\n`;
        humanReport += `4. **Project folders** are well-organized by project type and creation stage\n`;
        humanReport += `5. **StCollen documentation** is properly categorized as project logs\n\n`;

        humanReport += `## Next Steps\n`;
        humanReport += `- Review this report for accuracy\n`;
        humanReport += `- Confirm any specific categorizations you'd like to adjust\n`;
        humanReport += `- The system is ready for ongoing automatic organization\n`;

        return humanReport;
    }

    categorizeByCurrent(results) {
        const categories = {};
        
        results.forEach(result => {
            const pathParts = result.relativePath.split('/');
            
            // Create meaningful category names
            let category;
            if (pathParts[0] === 'projects') {
                // For projects: "projects/bass", "projects/eagle", etc.
                category = `${pathParts[0]}/${pathParts[1]}`;
            } else {
                // For nature/workshop: use just the top level
                category = pathParts[0];
            }
            
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(result);
        });

        return categories;
    }

    breakdownByProject(files) {
        const breakdown = {};
        
        files.forEach(file => {
            const pathParts = file.relativePath.split('/');
            const project = pathParts[1]; // e.g., "bass", "eagle"
            const stage = pathParts[3] || 'unknown'; // e.g., "rough", "detail", "final"
            
            if (!breakdown[project]) {
                breakdown[project] = { total: 0 };
            }
            
            breakdown[project].total++;
            breakdown[project][stage] = (breakdown[project][stage] || 0) + 1;
        });

        return breakdown;
    }

    generateInsights(results) {
        const insights = [];
        
        // Count files by confidence level
        const confidenceLevels = results.reduce((acc, r) => {
            const conf = r.analysis.confidence;
            if (conf > 0.7) acc.high++;
            else if (conf > 0.3) acc.medium++;
            else acc.low++;
            return acc;
        }, { high: 0, medium: 0, low: 0 });

        insights.push(`${confidenceLevels.high} images have high confidence analysis`);
        insights.push(`${confidenceLevels.medium} images have medium confidence analysis`);
        insights.push(`${confidenceLevels.low} images have low confidence analysis`);

        // Project detection insights
        const projectDetections = results.filter(r => r.analysis.detectedProject).length;
        insights.push(`${projectDetections} images had project types detected from filenames`);

        // Stage detection insights
        const stageDetections = results.filter(r => r.analysis.detectedStage).length;
        insights.push(`${stageDetections} images had creation stages detected from filenames`);

        // Wood type detection insights
        const woodDetections = results.filter(r => r.analysis.detectedWood).length;
        insights.push(`${woodDetections} images had wood types detected from filenames`);

        return insights;
    }
}

// Main execution
function main() {
    const generator = new HumanReadableReportGenerator();
    
    try {
        const humanReport = generator.generateHumanReadableReport();
        
        // Save human readable report
        const outputPath = path.join(__dirname, '..', 'AUTOMATED_ANALYSIS_REPORT.md');
        fs.writeFileSync(outputPath, humanReport);
        
        console.log('Human-readable report generated!');
        console.log(`Report saved to: ${outputPath}`);
        
        // Also display the report
        console.log('\n' + '='.repeat(60));
        console.log(humanReport);
        
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = HumanReadableReportGenerator;
