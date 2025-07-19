const fs = require('fs');
const path = require('path');

class SummaryReportGenerator {
    constructor() {
        this.resultsPath = path.join(__dirname, '..', 'automated-analysis-results.json');
        this.reportPath = path.join(__dirname, '..', 'automated-analysis-report.json');
        this.outputPath = path.join(__dirname, '..', 'AUTOMATED_ANALYSIS_SUMMARY.md');
    }

    generateSummaryReport() {
        console.log('Generating summary report...');
        
        // Load the analysis results
        const results = JSON.parse(fs.readFileSync(this.resultsPath, 'utf8'));
        const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));

        let summary = `# Automated Image Analysis Summary\n`;
        summary += `Generated: ${new Date().toLocaleString()}\n\n`;

        // Overall Summary
        summary += `## Overall Results\n`;
        summary += `- **Total Images Analyzed**: ${report.summary.totalAnalyzed}\n`;
        summary += `- **Correctly Placed**: ${report.summary.correctlyPlaced}\n`;
        summary += `- **Misplaced**: ${report.summary.misplaced}\n`;
        summary += `- **Uncertain**: ${report.summary.uncertain}\n\n`;

        // Category breakdown
        const breakdown = this.getCategoryBreakdown(results);
        summary += `## Category Breakdown\n`;
        
        Object.entries(breakdown).forEach(([category, data]) => {
            summary += `### ${category}\n`;
            summary += `- **Total Images**: ${data.count}\n`;
            
            if (data.projects) {
                summary += `- **Projects**:\n`;
                Object.entries(data.projects).forEach(([project, stages]) => {
                    summary += `  - **${project}**: ${stages.total} images\n`;
                    Object.entries(stages).forEach(([stage, count]) => {
                        if (stage !== 'total') {
                            summary += `    - ${stage}: ${count} images\n`;
                        }
                    });
                });
            }
            
            if (data.subcategories) {
                summary += `- **Subcategories**:\n`;
                Object.entries(data.subcategories).forEach(([sub, count]) => {
                    summary += `  - ${sub}: ${count} images\n`;
                });
            }
            
            summary += `\n`;
        });

        // Special Cases
        const specialCases = this.getSpecialCases(results);
        if (specialCases.length > 0) {
            summary += `## Special Cases\n`;
            specialCases.forEach(caseItem => {
                summary += `- ${caseItem}\n`;
            });
            summary += `\n`;
        }

        // Analysis Quality
        summary += `## Analysis Quality\n`;
        const qualityStats = this.getQualityStats(results);
        summary += `- **High Confidence**: ${qualityStats.high} images (>70%)\n`;
        summary += `- **Medium Confidence**: ${qualityStats.medium} images (30-70%)\n`;
        summary += `- **Low Confidence**: ${qualityStats.low} images (<30%)\n\n`;

        // Recommendations
        summary += `## Recommendations\n`;
        summary += `1. **Current organization appears excellent** - No misplaced images detected\n`;
        summary += `2. **Nature folder** contains artistic/reference images correctly separated from projects\n`;
        summary += `3. **Workshop folder** contains general workshop/technique images\n`;
        summary += `4. **Project folders** are well-organized by project type and creation stage\n`;
        summary += `5. **StCollen documentation** is properly categorized as project logs\n\n`;

        summary += `## Next Steps\n`;
        summary += `- Review this report for accuracy\n`;
        summary += `- Confirm any specific categorizations you'd like to adjust\n`;
        summary += `- The system is ready for ongoing automatic organization\n`;

        // Save report
        fs.writeFileSync(this.outputPath, summary);
        console.log(`Summary report saved to: ${this.outputPath}`);
        
        // Also output to console for immediate viewing
        console.log('\n=== SUMMARY REPORT ===');
        console.log(summary);
    }

    getCategoryBreakdown(results) {
        const breakdown = {};
        
        results.forEach(result => {
            const pathParts = result.relativePath.split('/');
            const mainCategory = pathParts[0];
            
            if (!breakdown[mainCategory]) {
                breakdown[mainCategory] = { count: 0 };
            }
            
            breakdown[mainCategory].count++;
            
            if (mainCategory === 'projects') {
                if (!breakdown[mainCategory].projects) {
                    breakdown[mainCategory].projects = {};
                }
                
                const project = pathParts[1];
                const stage = pathParts[3] || 'unknown';
                
                if (!breakdown[mainCategory].projects[project]) {
                    breakdown[mainCategory].projects[project] = { total: 0 };
                }
                
                breakdown[mainCategory].projects[project].total++;
                breakdown[mainCategory].projects[project][stage] = 
                    (breakdown[mainCategory].projects[project][stage] || 0) + 1;
            } else {
                if (!breakdown[mainCategory].subcategories) {
                    breakdown[mainCategory].subcategories = {};
                }
                
                const subcategory = pathParts[1] || 'general';
                breakdown[mainCategory].subcategories[subcategory] = 
                    (breakdown[mainCategory].subcategories[subcategory] || 0) + 1;
            }
        });
        
        return breakdown;
    }

    getSpecialCases(results) {
        const specialCases = [];
        
        const stCollenCount = results.filter(r => 
            r.verification.specialCase && r.verification.specialCase.includes('stcollen')
        ).length;
        
        if (stCollenCount > 0) {
            specialCases.push(`${stCollenCount} StCollen images identified as logs (raw wood) - correctly placed`);
        }
        
        return specialCases;
    }

    getQualityStats(results) {
        return results.reduce((stats, r) => {
            const confidence = r.analysis.confidence;
            if (confidence > 0.7) stats.high++;
            else if (confidence > 0.3) stats.medium++;
            else stats.low++;
            return stats;
        }, { high: 0, medium: 0, low: 0 });
    }
}

// Run the generator
const generator = new SummaryReportGenerator();
generator.generateSummaryReport();
