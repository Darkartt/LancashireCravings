const fs = require('fs');
const path = require('path');

class NatureCollectionAnalyzer {
    constructor() {
        this.natureDir = path.join(__dirname, '..', 'public', 'media', 'nature');
        this.natureObjects = {
            // Wildlife
            'birds': {
                keywords: ['bird', 'owl', 'hawk', 'falcon', 'crow', 'raven', 'robin', 'cardinal', 'blue_jay', 'woodpecker', 'sparrow'],
                patterns: ['wing', 'beak', 'feather', 'nest', 'flight', 'perch']
            },
            'fish_wildlife': {
                keywords: ['fish', 'trout', 'salmon', 'pike', 'perch', 'catfish', 'bluegill', 'walleye', 'carp'],
                patterns: ['fin', 'scale', 'gill', 'swim', 'water', 'pond', 'lake', 'stream']
            },
            'mammals': {
                keywords: ['deer', 'bear', 'wolf', 'fox', 'rabbit', 'squirrel', 'raccoon', 'beaver', 'otter', 'moose', 'elk'],
                patterns: ['fur', 'antler', 'paw', 'tail', 'mammal']
            },
            'reptiles': {
                keywords: ['snake', 'turtle', 'lizard', 'gecko', 'iguana', 'alligator', 'crocodile'],
                patterns: ['scale', 'shell', 'reptile', 'cold_blood']
            },
            'insects': {
                keywords: ['butterfly', 'bee', 'beetle', 'dragonfly', 'moth', 'ant', 'spider', 'grasshopper'],
                patterns: ['wing', 'antenna', 'insect', 'bug', 'hive', 'web']
            },
            
            // Plants and Natural Elements
            'trees': {
                keywords: ['tree', 'oak', 'pine', 'maple', 'birch', 'cedar', 'willow', 'elm', 'aspen'],
                patterns: ['bark', 'leaf', 'branch', 'trunk', 'root', 'forest']
            },
            'flowers': {
                keywords: ['flower', 'rose', 'daisy', 'tulip', 'lily', 'sunflower', 'orchid', 'violet'],
                patterns: ['petal', 'bloom', 'bud', 'garden', 'bouquet']
            },
            'landscapes': {
                keywords: ['mountain', 'valley', 'river', 'lake', 'forest', 'meadow', 'sunset', 'sunrise'],
                patterns: ['horizon', 'sky', 'cloud', 'scenic', 'vista', 'landscape']
            },
            'water_elements': {
                keywords: ['water', 'wave', 'stream', 'waterfall', 'pond', 'ocean', 'sea'],
                patterns: ['splash', 'ripple', 'flow', 'current']
            },
            
            // Artistic and Abstract
            'wood_grain': {
                keywords: ['grain', 'wood', 'texture', 'pattern', 'ring', 'knot'],
                patterns: ['lumber', 'timber', 'plank', 'board']
            },
            'artistic': {
                keywords: ['art', 'sculpture', 'carving', 'craft', 'design', 'pattern'],
                patterns: ['creative', 'artistic', 'decorative']
            },
            'tools_workshop': {
                keywords: ['tool', 'chisel', 'hammer', 'saw', 'knife', 'workshop', 'workbench'],
                patterns: ['equipment', 'instrument', 'craft_tool']
            },
            
            // People and Portraits
            'portraits': {
                keywords: ['portrait', 'person', 'face', 'people', 'human', 'profile'],
                patterns: ['smile', 'expression', 'eye', 'hair']
            },
            
            // Logs and Raw Materials
            'logs_raw_wood': {
                keywords: ['log', 'lumber', 'timber', 'raw_wood', 'bark', 'stump'],
                patterns: ['cut', 'split', 'sawn', 'rough']
            }
        };
    }

    async analyzeNatureCollection() {
        console.log('🌿 Analyzing nature collection for different objects...');
        
        const allNatureFiles = [];
        await this.scanNatureDirectory(this.natureDir, allNatureFiles);
        
        console.log(`📊 Found ${allNatureFiles.length} nature files`);
        
        const categorizedObjects = {};
        const unmatched = [];
        
        // Analyze each file
        for (const file of allNatureFiles) {
            const analysis = this.analyzeNatureFile(file);
            
            if (analysis.detectedObjects.length > 0) {
                const primaryObject = analysis.detectedObjects[0];
                
                if (!categorizedObjects[primaryObject.object]) {
                    categorizedObjects[primaryObject.object] = {
                        files: [],
                        totalFiles: 0,
                        confidence: 0,
                        subCategories: {}
                    };
                }
                
                categorizedObjects[primaryObject.object].files.push({
                    ...file,
                    confidence: primaryObject.confidence,
                    detectedObjects: analysis.detectedObjects
                });
                categorizedObjects[primaryObject.object].totalFiles++;
                categorizedObjects[primaryObject.object].confidence += primaryObject.confidence;
                
                // Track subcategories
                const subCategory = analysis.subCategory || 'general';
                if (!categorizedObjects[primaryObject.object].subCategories[subCategory]) {
                    categorizedObjects[primaryObject.object].subCategories[subCategory] = 0;
                }
                categorizedObjects[primaryObject.object].subCategories[subCategory]++;
            } else {
                unmatched.push(file);
            }
        }
        
        // Calculate average confidence
        Object.values(categorizedObjects).forEach(category => {
            category.averageConfidence = category.confidence / category.totalFiles;
        });
        
        // Generate summary
        console.log('\n=== NATURE COLLECTION ANALYSIS ===\n');
        
        const sortedCategories = Object.entries(categorizedObjects)
            .sort(([,a], [,b]) => b.totalFiles - a.totalFiles);
        
        sortedCategories.forEach(([objectType, data]) => {
            console.log(`🌿 ${objectType.toUpperCase().replace(/_/g, ' ')}:`);
            console.log(`   Files: ${data.totalFiles}`);
            console.log(`   Avg Confidence: ${data.averageConfidence.toFixed(2)}`);
            console.log(`   Subcategories: ${Object.keys(data.subCategories).join(', ')}`);
            
            // Show top subcategories
            const topSubCats = Object.entries(data.subCategories)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);
            topSubCats.forEach(([subCat, count]) => {
                console.log(`     • ${subCat}: ${count} files`);
            });
            console.log('');
        });
        
        if (unmatched.length > 0) {
            console.log(`❓ UNMATCHED FILES: ${unmatched.length}`);
            console.log('Sample unmatched files:');
            unmatched.slice(0, 5).forEach(file => {
                console.log(`   • ${file.relativePath}`);
            });
            console.log('');
        }
        
        // Save detailed analysis
        const analysisResult = {
            totalFiles: allNatureFiles.length,
            categorizedObjects,
            unmatched: unmatched.map(f => f.relativePath),
            timestamp: new Date().toISOString()
        };
        
        const outputPath = path.join(__dirname, '..', 'nature-categorization-log.json');
        fs.writeFileSync(outputPath, JSON.stringify(analysisResult, null, 2), 'utf8');
        
        console.log(`✅ Nature analysis complete! Saved to: ${outputPath}`);
        console.log(`📈 Summary: ${Object.keys(categorizedObjects).length} object types found`);
        
        return analysisResult;
    }

    analyzeNatureFile(file) {
        const filename = file.filename.toLowerCase();
        const pathParts = file.relativePath.toLowerCase().split(/[\\\/]/);
        
        const analysis = {
            detectedObjects: [],
            subCategory: null,
            confidence: 0
        };
        
        // Check each nature object type
        for (const [objectType, patterns] of Object.entries(this.natureObjects)) {
            let objectConfidence = 0;
            let matchedKeywords = [];
            
            // Check keywords in filename and path
            patterns.keywords.forEach(keyword => {
                if (filename.includes(keyword) || pathParts.some(part => part.includes(keyword))) {
                    objectConfidence += 0.3;
                    matchedKeywords.push(keyword);
                }
            });
            
            // Check pattern words
            patterns.patterns.forEach(pattern => {
                if (filename.includes(pattern) || pathParts.some(part => part.includes(pattern))) {
                    objectConfidence += 0.2;
                    matchedKeywords.push(pattern);
                }
            });
            
            // Check folder structure for additional clues
            if (pathParts.includes(objectType) || pathParts.includes(objectType.split('_')[0])) {
                objectConfidence += 0.4;
                matchedKeywords.push(`folder:${objectType}`);
            }
            
            if (objectConfidence > 0) {
                analysis.detectedObjects.push({
                    object: objectType,
                    confidence: objectConfidence,
                    matchedKeywords
                });
            }
        }
        
        // Sort by confidence
        analysis.detectedObjects.sort((a, b) => b.confidence - a.confidence);
        
        // Determine subcategory
        if (analysis.detectedObjects.length > 0) {
            const primaryObject = analysis.detectedObjects[0];
            analysis.subCategory = this.determineSubCategory(filename, pathParts, primaryObject);
        }
        
        return analysis;
    }

    determineSubCategory(filename, pathParts, primaryObject) {
        // Extract more specific subcategories based on the primary object
        const subCategoryMap = {
            'birds': ['owl', 'hawk', 'eagle', 'crow', 'robin', 'cardinal'],
            'fish_wildlife': ['trout', 'salmon', 'bass', 'pike', 'walleye'],
            'mammals': ['deer', 'bear', 'wolf', 'fox', 'rabbit', 'squirrel'],
            'trees': ['oak', 'pine', 'maple', 'birch', 'cedar'],
            'flowers': ['rose', 'daisy', 'tulip', 'lily', 'sunflower'],
            'insects': ['butterfly', 'bee', 'beetle', 'dragonfly', 'moth']
        };
        
        const possibleSubCats = subCategoryMap[primaryObject.object] || [];
        
        for (const subCat of possibleSubCats) {
            if (filename.includes(subCat) || pathParts.some(part => part.includes(subCat))) {
                return subCat;
            }
        }
        
        // Fallback to folder-based subcategory
        for (const part of pathParts) {
            if (part !== 'nature' && part !== 'images' && part !== 'videos' && part.length > 2) {
                return part;
            }
        }
        
        return 'general';
    }

    async scanNatureDirectory(dir, files, currentDepth = 0, maxDepth = 5) {
        if (currentDepth >= maxDepth) return;
        
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    await this.scanNatureDirectory(fullPath, files, currentDepth + 1, maxDepth);
                } else if (this.isMediaFile(item)) {
                    files.push({
                        fullPath,
                        relativePath: path.relative(path.join(__dirname, '..', 'public', 'media'), fullPath),
                        filename: item,
                        category: 'nature'
                    });
                }
            }
        } catch (error) {
            console.warn(`⚠️ Could not scan ${dir}: ${error.message}`);
        }
    }

    isMediaFile(filename) {
        const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.mp4', '.mov', '.avi', '.mkv'];
        return mediaExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }
}

// Run the analyzer
if (require.main === module) {
    const analyzer = new NatureCollectionAnalyzer();
    analyzer.analyzeNatureCollection()
        .then(() => {
            console.log('\n🎉 Nature collection analysis complete!');
        })
        .catch(error => {
            console.error('❌ Analysis failed:', error);
            process.exit(1);
        });
}

module.exports = NatureCollectionAnalyzer;
