const fs = require('fs');
const path = require('path');

async function analyzeEnhancedResults() {
    try {
        // Find the latest enhanced results file
        const resultsFiles = fs.readdirSync(__dirname + '/../').filter(f => f.startsWith('enhanced-analysis-results-2025'));
        const latestFile = resultsFiles.sort().pop();
        
        if (!latestFile) {
            console.log('❌ No enhanced analysis results found');
            return;
        }
        
        console.log(`📊 Analyzing results from: ${latestFile}`);
        
        const results = JSON.parse(fs.readFileSync(path.join(__dirname, '..', latestFile), 'utf8'));
        
        const summary = {
            projectBreakdown: {},
            animalDetection: {},
            stageDistribution: {},
            issues: [],
            recommendations: []
        };
        
        // Analyze each result
        results.forEach(result => {
            const { analysis, verification, recommendation } = result;
            
            // Track project distribution
            if (verification.currentProject) {
                if (!summary.projectBreakdown[verification.currentProject]) {
                    summary.projectBreakdown[verification.currentProject] = {
                        total: 0,
                        correctly_placed: 0,
                        issues: 0,
                        animals_detected: {}
                    };
                }
                
                summary.projectBreakdown[verification.currentProject].total++;
                
                if (recommendation.action === 'keep') {
                    summary.projectBreakdown[verification.currentProject].correctly_placed++;
                } else {
                    summary.projectBreakdown[verification.currentProject].issues++;
                }
                
                // Track animals detected in each project
                analysis.detectedAnimals.forEach(animal => {
                    if (!summary.projectBreakdown[verification.currentProject].animals_detected[animal.animal]) {
                        summary.projectBreakdown[verification.currentProject].animals_detected[animal.animal] = 0;
                    }
                    summary.projectBreakdown[verification.currentProject].animals_detected[animal.animal]++;
                });
            }
            
            // Track overall animal detection
            analysis.detectedAnimals.forEach(animal => {
                if (!summary.animalDetection[animal.animal]) {
                    summary.animalDetection[animal.animal] = {
                        total: 0,
                        in_correct_project: 0,
                        in_wrong_project: 0
                    };
                }
                
                summary.animalDetection[animal.animal].total++;
                
                if (verification.isCorrectProject) {
                    summary.animalDetection[animal.animal].in_correct_project++;
                } else {
                    summary.animalDetection[animal.animal].in_wrong_project++;
                }
            });
            
            // Track stage distribution
            if (analysis.detectedStage) {
                if (!summary.stageDistribution[analysis.detectedStage]) {
                    summary.stageDistribution[analysis.detectedStage] = 0;
                }
                summary.stageDistribution[analysis.detectedStage]++;
            }
            
            // Collect issues and recommendations
            if (recommendation.action !== 'keep') {
                summary.issues.push({
                    file: result.relativePath,
                    action: recommendation.action,
                    reason: recommendation.reason,
                    priority: recommendation.priority
                });
            }
        });
        
        // Generate report
        console.log('\n=== ENHANCED ANALYSIS SUMMARY ===\n');
        
        console.log('📁 PROJECT BREAKDOWN:');
        Object.entries(summary.projectBreakdown).forEach(([project, data]) => {
            console.log(`\n  ${project.toUpperCase()}:`);
            console.log(`    Total images: ${data.total}`);
            console.log(`    Correctly placed: ${data.correctly_placed}`);
            console.log(`    Issues: ${data.issues}`);
            console.log(`    Animals detected:`);
            Object.entries(data.animals_detected).forEach(([animal, count]) => {
                const isCorrect = animal === project || (animal === 'st_collen' && project === 'stcollen');
                const status = isCorrect ? '✅' : '⚠️';
                console.log(`      ${status} ${animal}: ${count} images`);
            });
        });
        
        console.log('\n🐾 ANIMAL DETECTION SUMMARY:');
        Object.entries(summary.animalDetection).forEach(([animal, data]) => {
            console.log(`  ${animal}: ${data.total} total (${data.in_correct_project} correct, ${data.in_wrong_project} misplaced)`);
        });
        
        console.log('\n🎯 STAGE DISTRIBUTION:');
        Object.entries(summary.stageDistribution).forEach(([stage, count]) => {
            console.log(`  ${stage}: ${count} images`);
        });
        
        if (summary.issues.length > 0) {
            console.log('\n⚠️ ISSUES REQUIRING ATTENTION:');
            const highPriority = summary.issues.filter(i => i.priority === 'high');
            const mediumPriority = summary.issues.filter(i => i.priority === 'medium');
            const lowPriority = summary.issues.filter(i => i.priority === 'low');
            
            if (highPriority.length > 0) {
                console.log(`\n  HIGH PRIORITY (${highPriority.length}):`);
                highPriority.slice(0, 5).forEach(issue => {
                    console.log(`    ${issue.action}: ${issue.file} - ${issue.reason}`);
                });
                if (highPriority.length > 5) {
                    console.log(`    ... and ${highPriority.length - 5} more high priority issues`);
                }
            }
            
            if (mediumPriority.length > 0) {
                console.log(`\n  MEDIUM PRIORITY (${mediumPriority.length}):`);
                mediumPriority.slice(0, 3).forEach(issue => {
                    console.log(`    ${issue.action}: ${issue.file} - ${issue.reason}`);
                });
                if (mediumPriority.length > 3) {
                    console.log(`    ... and ${mediumPriority.length - 3} more medium priority issues`);
                }
            }
            
            console.log(`\n  LOW PRIORITY: ${lowPriority.length} items (mostly nature collection)`);
        }
        
        // Check for mixed animals in projects
        console.log('\n🔍 MIXED ANIMAL DETECTION:');
        Object.entries(summary.projectBreakdown).forEach(([project, data]) => {
            const animals = Object.keys(data.animals_detected);
            if (animals.length > 1) {
                console.log(`  ⚠️ ${project}: Contains ${animals.join(', ')} - consider separating`);
            } else if (animals.length === 1) {
                const detectedAnimal = animals[0];
                const expectedAnimal = project === 'stcollen' ? 'st_collen' : project;
                if (detectedAnimal !== expectedAnimal) {
                    console.log(`  ⚠️ ${project}: Expected ${expectedAnimal} but found ${detectedAnimal}`);
                }
            }
        });
        
        console.log('\n✅ Analysis complete! Use the batch review system to manually verify mixed projects.');
        
    } catch (error) {
        console.error('❌ Error analyzing enhanced results:', error);
    }
}

// Run the analysis
analyzeEnhancedResults();
