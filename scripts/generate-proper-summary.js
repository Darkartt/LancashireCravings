const fs = require('fs').promises;
const path = require('path');

async function generateProperSummary() {
    try {
        console.log('Loading analysis results...');
        
        // Load the detailed analysis results
        const resultsPath = path.join(__dirname, '..', 'automated-analysis-results.json');
        const resultsData = await fs.readFile(resultsPath, 'utf8');
        const results = JSON.parse(resultsData);
        
        console.log(`Loaded ${results.length} analysis records`);
        
        // Group by meaningful categories
        const categoryStats = {};
        const projectStats = {};
        const stageStats = {};
        const typeStats = {};
        const statusStats = {
            correctly_placed: 0,
            misplaced: 0,
            uncertain: 0
        };
        
        for (const result of results) {
            // Determine status from recommendation
            let status = 'correctly_placed';
            if (result.recommendation.action === 'move') {
                status = 'misplaced';
            } else if (result.recommendation.action === 'review') {
                status = 'uncertain';
            }
            
            // Count status
            statusStats[status] = (statusStats[status] || 0) + 1;
            
            // Parse path to get meaningful categories
            const pathParts = result.relativePath.split(/[\\\/]/);
            const mainCategory = pathParts[0]; // projects, nature, workshop
            
            // Initialize category if needed
            if (!categoryStats[mainCategory]) {
                categoryStats[mainCategory] = {
                    total: 0,
                    correctly_placed: 0,
                    misplaced: 0,
                    uncertain: 0,
                    subcategories: {}
                };
            }
            
            categoryStats[mainCategory].total++;
            categoryStats[mainCategory][status]++;
            
            if (mainCategory === 'projects' && pathParts.length > 1) {
                const projectName = pathParts[1];
                
                // Project stats
                if (!projectStats[projectName]) {
                    projectStats[projectName] = {
                        total: 0,
                        correctly_placed: 0,
                        misplaced: 0,
                        uncertain: 0,
                        stages: {}
                    };
                }
                
                projectStats[projectName].total++;
                projectStats[projectName][status]++;
                
                // Stage stats within project
                if (pathParts.length > 3) {
                    const stage = pathParts[3]; // rough, detailed, final, etc.
                    
                    if (!projectStats[projectName].stages[stage]) {
                        projectStats[projectName].stages[stage] = {
                            total: 0,
                            correctly_placed: 0,
                            misplaced: 0,
                            uncertain: 0
                        };
                    }
                    
                    projectStats[projectName].stages[stage].total++;
                    projectStats[projectName].stages[stage][status]++;
                    
                    // Global stage stats
                    if (!stageStats[stage]) {
                        stageStats[stage] = {
                            total: 0,
                            correctly_placed: 0,
                            misplaced: 0,
                            uncertain: 0
                        };
                    }
                    
                    stageStats[stage].total++;
                    stageStats[stage][status]++;
                }
            }
            
            // Wood type stats from detected info
            if (result.analysis.detectedWood) {
                const woodType = result.analysis.detectedWood;
                if (!typeStats[woodType]) {
                    typeStats[woodType] = {
                        total: 0,
                        correctly_placed: 0,
                        misplaced: 0,
                        uncertain: 0
                    };
                }
                
                typeStats[woodType].total++;
                typeStats[woodType][status]++;
            }
        }
        
        // Generate the summary report
        const timestamp = new Date().toLocaleString();
        let report = `# Woodcarving Media Analysis Summary
Generated: ${timestamp}

## Overall Results
- **Total Images Analyzed**: ${results.length}
- **Correctly Placed**: ${statusStats.correctly_placed}
- **Misplaced**: ${statusStats.misplaced}
- **Uncertain**: ${statusStats.uncertain}

## Main Categories

`;

        // Main categories breakdown
        for (const [category, stats] of Object.entries(categoryStats)) {
            report += `### ${category.charAt(0).toUpperCase() + category.slice(1)}
- **Total Images**: ${stats.total}
- **Correctly Placed**: ${stats.correctly_placed}
- **Misplaced**: ${stats.misplaced}
- **Uncertain**: ${stats.uncertain}

`;
        }
        
        report += `## Project Breakdown

`;

        // Project breakdown
        for (const [project, stats] of Object.entries(projectStats)) {
            report += `### ${project.charAt(0).toUpperCase() + project.slice(1)} Project
- **Total Images**: ${stats.total}
- **Correctly Placed**: ${stats.correctly_placed}
- **Misplaced**: ${stats.misplaced}
- **Uncertain**: ${stats.uncertain}

`;
            
            // Stage breakdown for this project
            const stageEntries = Object.entries(stats.stages);
            if (stageEntries.length > 0) {
                report += `#### Stages:\n`;
                for (const [stage, stageStats] of stageEntries) {
                    report += `- **${stage}**: ${stageStats.total} images (${stageStats.correctly_placed} correct, ${stageStats.misplaced} misplaced, ${stageStats.uncertain} uncertain)\n`;
                }
                report += `\n`;
            }
        }
        
        report += `## Stage Distribution

`;

        // Global stage stats
        for (const [stage, stats] of Object.entries(stageStats)) {
            report += `### ${stage.charAt(0).toUpperCase() + stage.slice(1)} Stage
- **Total Images**: ${stats.total}
- **Correctly Placed**: ${stats.correctly_placed}
- **Misplaced**: ${stats.misplaced}
- **Uncertain**: ${stats.uncertain}

`;
        }
        
        report += `## Wood Types Detected

`;

        // Wood type stats
        const sortedTypes = Object.entries(typeStats).sort(([,a], [,b]) => b.total - a.total);
        for (const [type, stats] of sortedTypes) {
            report += `### ${type.charAt(0).toUpperCase() + type.slice(1)}
- **Total Images**: ${stats.total}
- **Correctly Placed**: ${stats.correctly_placed}
- **Misplaced**: ${stats.misplaced}
- **Uncertain**: ${stats.uncertain}

`;
        }
        
        // Add recommendations section
        report += `## Summary & Recommendations

`;

        if (statusStats.correctly_placed === results.length) {
            report += `✅ **Excellent Organization**: All ${results.length} images are correctly categorized and placed in appropriate folders.

`;
        }
        
        if (statusStats.misplaced > 0) {
            report += `⚠️ **Images Requiring Attention**: ${statusStats.misplaced} images appear to be misplaced and may need reorganization.

`;
        }
        
        if (statusStats.uncertain > 0) {
            report += `🔍 **Images Requiring Review**: ${statusStats.uncertain} images need manual review to determine correct placement.

`;
        }
        
        // Special note about stcollen images
        report += `### Special Cases
- **Stcollen Images**: All images containing "stcollen" in the filename are treated as logs (raw wood) and are always marked as correctly placed per your specification.

`;
        
        // Save the report
        const reportPath = path.join(__dirname, '..', 'PROPER_ANALYSIS_SUMMARY.md');
        await fs.writeFile(reportPath, report, 'utf8');
        
        console.log(`✅ Proper summary report generated: ${reportPath}`);
        console.log(`📊 Summary: ${results.length} images analyzed, ${statusStats.correctly_placed} correctly placed, ${statusStats.misplaced} misplaced, ${statusStats.uncertain} uncertain`);
        
        return {
            totalImages: results.length,
            correctlyPlaced: statusStats.correctly_placed,
            misplaced: statusStats.misplaced,
            uncertain: statusStats.uncertain,
            categories: categoryStats,
            projects: projectStats,
            stages: stageStats,
            woodTypes: typeStats
        };
        
    } catch (error) {
        console.error('Error generating proper summary:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    generateProperSummary()
        .then(summary => {
            console.log('\n📋 Analysis Complete!');
            console.log(`Total categories: ${Object.keys(summary.categories).length}`);
            console.log(`Total projects: ${Object.keys(summary.projects).length}`);
            console.log(`Total stages: ${Object.keys(summary.stages).length}`);
            console.log(`Total wood types detected: ${Object.keys(summary.woodTypes).length}`);
        })
        .catch(error => {
            console.error('❌ Failed to generate summary:', error);
            process.exit(1);
        });
}

module.exports = generateProperSummary;
