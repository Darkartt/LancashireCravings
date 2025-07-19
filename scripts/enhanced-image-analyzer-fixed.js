const fs = require('fs');
const path = require('path');

class EnhancedImageAnalyzer {
    constructor() {
        this.mediaDir = path.join(__dirname, '..', 'public', 'media');
        this.results = {
            totalAnalyzed: 0,
            correctlyPlaced: 0,
            misplaced: 0,
            uncertain: 0,
            newProjectsSuggested: 0,
            uniqueAnimalsFound: new Set(),
            projectCreationSuggestions: [],
            animalSeparations: [],
            stageMismatches: [],
            suggestions: [],
            visualReviewNeeded: []
        };
        
        // Enhanced animal detection patterns - COMPREHENSIVE LIST
        this.animalPatterns = {
            // Fish types - SEPARATE EACH SPECIES
            'largemouth_bass': {
                keywords: ['largemouth', 'largemouth_bass', 'large_mouth', 'bigmouth'],
                body_shape: 'elongated',
                features: ['wide_mouth', 'dark_stripe', 'green_color']
            },
            'smallmouth_bass': {
                keywords: ['smallmouth', 'smallmouth_bass', 'small_mouth', 'bronzeback'],
                body_shape: 'elongated',
                features: ['smaller_mouth', 'bronze_color', 'vertical_bars']
            },
            'striped_bass': {
                keywords: ['striper', 'striped_bass', 'stripe', 'rockfish'],
                body_shape: 'elongated',
                features: ['horizontal_stripes', 'silver_body']
            },
            'bass_generic': {
                keywords: ['bass'],
                body_shape: 'elongated',
                features: ['fins', 'scales', 'gills']
            },
            'trout': {
                keywords: ['trout', 'rainbow', 'brook', 'brown_trout', 'speckled'],
                body_shape: 'streamlined',
                features: ['spots', 'fins', 'adipose_fin']
            },
            'salmon': {
                keywords: ['salmon', 'coho', 'chinook', 'atlantic_salmon'],
                body_shape: 'torpedo',
                features: ['hooked_jaw', 'spawning_colors']
            },
            'pike': {
                keywords: ['pike', 'northern_pike', 'jack'],
                body_shape: 'elongated_predator',
                features: ['sharp_teeth', 'long_snout', 'duck_bill']
            },
            'muskie': {
                keywords: ['muskie', 'musky', 'muskellunge'],
                body_shape: 'elongated_predator',
                features: ['large_size', 'sharp_teeth', 'spots_bars']
            },
            'walleye': {
                keywords: ['walleye', 'pickerel', 'glassy_eye'],
                body_shape: 'perch_like',
                features: ['glassy_eyes', 'dorsal_fins', 'white_tip']
            },
            'perch': {
                keywords: ['perch', 'yellow_perch'],
                body_shape: 'compact',
                features: ['vertical_bars', 'spiny_dorsal']
            },
            'catfish': {
                keywords: ['catfish', 'cat', 'whiskers', 'bullhead'],
                body_shape: 'bottom_feeder',
                features: ['whiskers', 'barbels', 'smooth_skin']
            },
            'sunfish': {
                keywords: ['sunfish', 'bluegill', 'pumpkinseed'],
                body_shape: 'round_flat',
                features: ['bright_colors', 'ear_flap']
            },
            
            // Birds - SEPARATE EACH SPECIES
            'bald_eagle': {
                keywords: ['bald_eagle', 'eagle', 'white_head'],
                body_shape: 'raptor',
                features: ['white_head', 'white_tail', 'yellow_beak']
            },
            'golden_eagle': {
                keywords: ['golden_eagle', 'golden'],
                body_shape: 'raptor',
                features: ['golden_head', 'dark_body']
            },
            'eagle_generic': {
                keywords: ['eagle'],
                body_shape: 'raptor',
                features: ['hooked_beak', 'talons', 'spread_wings']
            },
            'owl': {
                keywords: ['owl', 'barn_owl', 'great_horned', 'screech'],
                body_shape: 'round_compact',
                features: ['large_eyes', 'facial_disc', 'silent_flight']
            },
            'hawk': {
                keywords: ['hawk', 'red_tail', 'cooper', 'sharp_shin'],
                body_shape: 'raptor',
                features: ['hooked_beak', 'sharp_talons']
            },
            
            // Insects & Small Creatures
            'butterfly': {
                keywords: ['butterfly', 'monarch', 'swallowtail', 'admiral'],
                body_shape: 'flying_insect',
                features: ['colorful_wings', 'antennae', 'proboscis']
            },
            'dragonfly': {
                keywords: ['dragonfly', 'damselfly', 'darner'],
                body_shape: 'flying_insect',
                features: ['transparent_wings', 'large_eyes', 'long_body']
            },
            'bee': {
                keywords: ['bee', 'bumblebee', 'honey_bee'],
                body_shape: 'flying_insect',
                features: ['fuzzy_body', 'pollen_baskets', 'stinger']
            },
            'spider': {
                keywords: ['spider', 'web', 'arachnid'],
                body_shape: 'eight_legs',
                features: ['web_spinner', 'eight_legs', 'fangs']
            },
            'frog': {
                keywords: ['frog', 'toad', 'amphibian', 'tadpole'],
                body_shape: 'amphibian',
                features: ['smooth_skin', 'jumping_legs', 'bulging_eyes']
            },
            'turtle': {
                keywords: ['turtle', 'tortoise', 'terrapin', 'shell'],
                body_shape: 'shelled',
                features: ['shell', 'retractable_head', 'slow_movement']
            },
            
            // Mythical/Religious/Other
            'nessie': {
                keywords: ['nessie', 'loch_ness', 'monster', 'lake_monster'],
                body_shape: 'serpentine',
                features: ['long_neck', 'humps', 'scales']
            },
            'st_collen': {
                keywords: ['stcollen', 'st_collen', 'saint_collen', 'celtic', 'cross'],
                body_shape: 'human_figure',
                features: ['robes', 'staff', 'halo', 'religious_symbols']
            }
        };
        
        // Enhanced process stage detection
        this.processStages = {
            'raw_log': {
                keywords: ['log', 'raw', 'bark', 'unshaped', 'chainsaw', 'cut'],
                visual_cues: ['rough_surface', 'natural_edge', 'bark_visible'],
                confidence_threshold: 0.8
            },
            'rough_carving': {
                keywords: ['rough', 'initial', 'blocked_out', 'basic_shape'],
                visual_cues: ['tool_marks', 'basic_form', 'no_details'],
                confidence_threshold: 0.7
            },
            'detailed_work': {
                keywords: ['detail', 'carving', 'progress', 'features', 'texture'],
                visual_cues: ['fine_details', 'texture_work', 'feature_definition'],
                confidence_threshold: 0.6
            },
            'finishing': {
                keywords: ['sanding', 'smooth', 'finish', 'polish', 'refinement'],
                visual_cues: ['smooth_surface', 'fine_texture', 'near_complete'],
                confidence_threshold: 0.7
            },
            'final_complete': {
                keywords: ['final', 'complete', 'finished', 'done', 'painted', 'stained'],
                visual_cues: ['polished', 'complete_details', 'finished_surface'],
                confidence_threshold: 0.8
            }
        };
    }

    // Enhanced filename and PATH analysis - focusing on context clues since filenames are random
    analyzeFilenameAndPath(filePath) {
        const normalizedPath = filePath.toLowerCase().replace(/\\/g, '/');
        const filename = path.basename(filePath).toLowerCase();
        const pathParts = normalizedPath.split('/');
        
        const analysis = {
            detectedAnimals: [], // Can detect multiple animals
            detectedStage: null,
            detectedWood: null,
            confidence: 0,
            pathClues: [],
            filenameClues: [],
            visualCues: [],
            warnings: [],
            sequenceNumber: null,
            suggestedOrder: null,
            orderingClues: [],
            needsVisualReview: true // Since filenames are random, most need visual review
        };

        // ENHANCED PATH-BASED ANIMAL DETECTION
        // Look for project context and folder patterns
        if (pathParts.includes('bass')) {
            // Check if this might be a specific type of bass or different fish
            analysis.detectedAnimals.push({
                animal: 'bass_generic',
                confidence: 0.4,
                source: 'project_folder',
                notes: 'In bass project - could be largemouth, smallmouth, or other fish'
            });
            analysis.pathClues.push('In bass project folder');
            analysis.warnings.push('Bass project may contain multiple fish species - needs visual review');
        }
        
        if (pathParts.includes('eagle')) {
            // Check if this might be bald eagle, golden eagle, or other bird
            analysis.detectedAnimals.push({
                animal: 'eagle_generic',
                confidence: 0.4,
                source: 'project_folder',
                notes: 'In eagle project - could be bald eagle, golden eagle, or other bird'
            });
            analysis.pathClues.push('In eagle project folder');
            analysis.warnings.push('Eagle project may contain multiple bird species - needs visual review');
        }
        
        if (pathParts.includes('nessie')) {
            analysis.detectedAnimals.push({
                animal: 'nessie',
                confidence: 0.8,
                source: 'project_folder'
            });
            analysis.pathClues.push('In nessie project folder');
        }
        
        if (pathParts.includes('stcollen')) {
            analysis.detectedAnimals.push({
                animal: 'st_collen',
                confidence: 0.8,
                source: 'project_folder'
            });
            analysis.pathClues.push('In st_collen project folder');
        }
        
        // NATURE FOLDER ANALYSIS
        if (pathParts.includes('nature')) {
            analysis.pathClues.push('In nature folder - likely contains various animals');
            analysis.warnings.push('Nature folder likely contains multiple animal types - needs categorization');
            
            // Look for specific nature category hints in path
            const naturePaths = pathParts.join('/');
            if (naturePaths.includes('butterfly')) {
                analysis.detectedAnimals.push({ animal: 'butterfly', confidence: 0.7, source: 'nature_subfolder' });
            }
            if (naturePaths.includes('dragonfly')) {
                analysis.detectedAnimals.push({ animal: 'dragonfly', confidence: 0.7, source: 'nature_subfolder' });
            }
            if (naturePaths.includes('bee')) {
                analysis.detectedAnimals.push({ animal: 'bee', confidence: 0.7, source: 'nature_subfolder' });
            }
            if (naturePaths.includes('spider')) {
                analysis.detectedAnimals.push({ animal: 'spider', confidence: 0.7, source: 'nature_subfolder' });
            }
            if (naturePaths.includes('frog')) {
                analysis.detectedAnimals.push({ animal: 'frog', confidence: 0.7, source: 'nature_subfolder' });
            }
            // Add more nature categories as needed
        }

        // WORKSHOP ANALYSIS
        if (pathParts.includes('workshop')) {
            analysis.pathClues.push('In workshop folder - could be any type of carving');
            analysis.warnings.push('Workshop folder may contain various projects - needs review');
        }

        // Enhanced process stage detection - include folder-based detection
        const folderStageMap = {
            'final': 'final_complete',
            'process': 'detailed_work',
            'rough': 'rough_carving',
            'detail': 'detailed_work',
            'finish': 'finishing'
        };
        
        // Check folder structure for stage hints
        for (const [folder, stage] of Object.entries(folderStageMap)) {
            if (pathParts.includes(folder)) {
                analysis.detectedStage = stage;
                analysis.pathClues.push(`Folder-based stage: ${stage}`);
                analysis.confidence += 0.4;
                break;
            }
        }
        
        // Enhanced sequence number analysis for better ordering
        const sequencePatterns = [
            /(\d{3,4})/,           // Standard 3-4 digit numbers
            /step[_\-]?(\d+)/i,    // "step1", "step_2", "step-3"
            /process[_\-]?(\d+)/i, // "process1", "process_2"
            /img[_\-]?(\d+)/i,     // "img1", "img_2"
            /photo[_\-]?(\d+)/i,   // "photo1", "photo_2"
            /(\d+)[_\-]?(raw|rough|detail|finish|final)/i, // "1_rough", "2-detail"
            /(raw|rough|detail|finish|final)[_\-]?(\d+)/i  // "rough_1", "detail-2"
        ];

        for (const pattern of sequencePatterns) {
            const match = filename.match(pattern);
            if (match) {
                const numberMatch = match[1] || match[2];
                if (numberMatch) {
                    analysis.sequenceNumber = parseInt(numberMatch);
                    analysis.orderingClues.push(`Sequence number: ${analysis.sequenceNumber}`);
                    
                    // Suggest order based on stage and sequence
                    if (analysis.detectedStage) {
                        analysis.suggestedOrder = this.calculateSuggestedOrder(analysis.detectedStage, analysis.sequenceNumber);
                        analysis.orderingClues.push(`Suggested order: ${analysis.suggestedOrder}`);
                    }
                    break;
                }
            }
        }

        // If no sequence number found, try to infer from stage
        if (!analysis.sequenceNumber && analysis.detectedStage) {
            analysis.suggestedOrder = this.getDefaultOrderForStage(analysis.detectedStage);
            analysis.orderingClues.push(`Default order for ${analysis.detectedStage}: ${analysis.suggestedOrder}`);
        }

        return analysis;
    }

    // Calculate suggested order based on stage and sequence number
    calculateSuggestedOrder(stage, sequenceNumber) {
        const stageBaseOrders = {
            'raw_log': 1,
            'rough_carving': 3,
            'detailed_work': 5,
            'finishing': 8,
            'final_complete': 10
        };

        const baseOrder = stageBaseOrders[stage] || 5;
        
        // For process stages, use sequence number more directly
        if (['raw_log', 'rough_carving', 'detailed_work'].includes(stage)) {
            return Math.min(baseOrder + (sequenceNumber - 1), 7); // Cap at 7 for process
        }
        
        // For final stages, start from 8
        return Math.max(8, Math.min(baseOrder + (sequenceNumber - 1), 10));
    }

    // Get default order for stage when no sequence number is found
    getDefaultOrderForStage(stage) {
        const defaultOrders = {
            'raw_log': 1,
            'rough_carving': 3,
            'detailed_work': 5,
            'finishing': 8,
            'final_complete': 10
        };
        
        return defaultOrders[stage] || 5;
    }

    // Enhanced verification with focus on visual review needs
    verifyPlacement(filePath, analysis) {
        const pathParts = filePath.toLowerCase().replace(/\\/g, '/').split('/');
        const filename = path.basename(filePath).toLowerCase();
        
        const verification = {
            currentProject: null,
            currentStage: null,
            isCorrectProject: false,
            isCorrectStage: false,
            issues: [],
            suggestions: [],
            confidence: 'low',
            detectedAnimals: analysis.detectedAnimals || [],
            shouldHaveOwnProject: false,
            isNatureAnimal: false,
            needsVisualReview: analysis.needsVisualReview || false
        };

        // Determine current project from path
        if (pathParts.includes('bass')) verification.currentProject = 'bass';
        else if (pathParts.includes('eagle')) verification.currentProject = 'eagle';
        else if (pathParts.includes('nessie')) verification.currentProject = 'nessie';
        else if (pathParts.includes('stcollen')) verification.currentProject = 'stcollen';
        else if (pathParts.includes('nature')) verification.currentProject = 'nature';
        else if (pathParts.includes('workshop')) verification.currentProject = 'workshop';

        // Determine current stage from path
        if (pathParts.includes('process')) verification.currentStage = 'process';
        else if (pathParts.includes('final')) verification.currentStage = 'final';

        // Since filenames are random, we need visual analysis to determine true animal type
        if (verification.currentProject === 'bass' || verification.currentProject === 'eagle') {
            verification.needsVisualReview = true;
            verification.issues.push(`Random filename "${filename}" in ${verification.currentProject} project needs visual review`);
            verification.suggestions.push(`Create visual review batch for ${verification.currentProject} project`);
        }

        // Check if detected animals match current project
        if (analysis.detectedAnimals.length > 0) {
            const primaryAnimal = analysis.detectedAnimals[0].animal;
            
            // Animals that should definitely have their own projects
            const specificAnimals = [
                'largemouth_bass', 'smallmouth_bass', 'striped_bass', 'trout', 'salmon', 
                'pike', 'muskie', 'walleye', 'perch', 'catfish', 'sunfish',
                'bald_eagle', 'golden_eagle', 'owl', 'hawk', 
                'butterfly', 'dragonfly', 'bee', 'spider', 'frog', 'turtle'
            ];
            
            // Nature animals that should be in nature folder or their own project
            const natureAnimals = [
                'butterfly', 'dragonfly', 'bee', 'spider', 'frog', 'turtle'
            ];
            
            if (specificAnimals.includes(primaryAnimal)) {
                verification.shouldHaveOwnProject = true;
                verification.needsVisualReview = true;
                verification.suggestions.push(`Create separate project for ${primaryAnimal}`);
            }
            
            // Handle nature animals
            if (natureAnimals.includes(primaryAnimal)) {
                verification.isNatureAnimal = true;
                if (verification.currentProject !== 'nature' && !pathParts.includes(primaryAnimal)) {
                    verification.issues.push(`Nature animal ${primaryAnimal} in wrong location`);
                    verification.suggestions.push(`Move to nature/${primaryAnimal} or create project/${primaryAnimal}`);
                }
            }
        }

        return verification;
    }

    // Generate recommendations focusing on visual review needs
    generateRecommendation(filePath, analysis, verification) {
        const recommendation = {
            action: 'review', // Default to review since filenames are random
            reason: '',
            suggestedPath: null,
            newProjectSuggestion: null,
            confidence: verification.confidence,
            priority: 'medium', // Higher priority due to need for visual review
            uniqueAnimalsFound: analysis.detectedAnimals || [],
            createNewProjects: [],
            needsVisualReview: true
        };

        // Since filenames are random, most images need visual review
        if (verification.needsVisualReview) {
            recommendation.action = 'review';
            recommendation.reason = `Random filename "${path.basename(filePath)}" needs visual analysis to determine animal type`;
            recommendation.priority = 'high';
            
            // Suggest creating batches for visual review
            if (verification.currentProject === 'bass') {
                recommendation.suggestions = [
                    'Create visual review batch for bass project',
                    'Look for largemouth bass, smallmouth bass, striped bass, or other fish',
                    'Check if any images contain non-fish animals'
                ];
            } else if (verification.currentProject === 'eagle') {
                recommendation.suggestions = [
                    'Create visual review batch for eagle project',
                    'Look for bald eagle, golden eagle, or other birds',
                    'Check if any images contain non-bird animals'
                ];
            } else if (verification.currentProject === 'nature') {
                recommendation.suggestions = [
                    'Create visual review batch for nature folder',
                    'Categorize into butterfly, dragonfly, bee, spider, frog, turtle, etc.',
                    'Consider creating individual projects for each animal type'
                ];
            }
        }

        // Special cases for well-identified projects
        if (verification.currentProject === 'nessie' || verification.currentProject === 'stcollen') {
            recommendation.action = 'keep';
            recommendation.reason = `${verification.currentProject} project is well-defined`;
            recommendation.needsVisualReview = false;
        }

        return recommendation;
    }

    // Generate visual review batches for manual categorization
    generateVisualReviewBatches() {
        console.log('\n🔍 GENERATING VISUAL REVIEW BATCHES...');
        
        const batches = {
            bass_project: [],
            eagle_project: [],
            nature_folder: [],
            workshop_misc: []
        };

        this.results.visualReviewNeeded.forEach(item => {
            if (item.currentProject === 'bass') {
                batches.bass_project.push(item);
            } else if (item.currentProject === 'eagle') {
                batches.eagle_project.push(item);
            } else if (item.currentProject === 'nature') {
                batches.nature_folder.push(item);
            } else {
                batches.workshop_misc.push(item);
            }
        });

        // Save visual review batches
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        
        fs.writeFileSync(
            path.join(__dirname, '..', `visual-review-batches-${timestamp}.json`),
            JSON.stringify(batches, null, 2),
            'utf8'
        );

        console.log(`📊 Visual review batches created:`);
        console.log(`  • Bass project: ${batches.bass_project.length} images`);
        console.log(`  • Eagle project: ${batches.eagle_project.length} images`);
        console.log(`  • Nature folder: ${batches.nature_folder.length} images`);
        console.log(`  • Workshop/misc: ${batches.workshop_misc.length} images`);

        return batches;
    }

    // Scan all media directories
    async scanAllMedia() {
        console.log('🔍 Enhanced scanning for all media files...');
        const allFiles = [];
        
        // Scan projects directory
        const projectsDir = path.join(this.mediaDir, 'projects');
        await this.scanDirectory(projectsDir, allFiles, 'projects');
        
        // Scan nature directory
        const natureDir = path.join(this.mediaDir, 'nature');
        await this.scanDirectory(natureDir, allFiles, 'nature');
        
        // Scan workshop directory
        const workshopDir = path.join(this.mediaDir, 'workshop');
        await this.scanDirectory(workshopDir, allFiles, 'workshop');
        
        console.log(`📊 Found ${allFiles.length} total media files`);
        return allFiles;
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

    async runEnhancedAnalysis() {
        console.log('🚀 Starting enhanced automated image analysis...');
        console.log('📝 Note: Since filenames are random (camera names), visual review will be needed for accurate animal detection');
        
        const allFiles = await this.scanAllMedia();
        this.results.totalAnalyzed = allFiles.length;
        
        const detailedResults = [];
        
        for (let i = 0; i < allFiles.length; i++) {
            const file = allFiles[i];
            
            if (i % 100 === 0) {
                console.log(`Processed ${i}/${allFiles.length} images...`);
            }
            
            // Analyze the file
            const analysis = this.analyzeFilenameAndPath(file.fullPath);
            const verification = this.verifyPlacement(file.fullPath, analysis);
            const recommendation = this.generateRecommendation(file.fullPath, analysis, verification);
            
            // Count results
            switch (recommendation.action) {
                case 'keep':
                    this.results.correctlyPlaced++;
                    break;
                case 'move':
                case 'separate':
                case 'create_project':
                    this.results.misplaced++;
                    break;
                case 'review':
                    this.results.uncertain++;
                    break;
            }
            
            // Track unique animals found (based on path context)
            if (analysis.detectedAnimals) {
                analysis.detectedAnimals.forEach(animal => {
                    this.results.uniqueAnimalsFound.add(animal.animal);
                });
            }
            
            // Track files that need visual review
            if (recommendation.needsVisualReview) {
                this.results.visualReviewNeeded.push({
                    file: file.relativePath,
                    currentProject: verification.currentProject,
                    suggestions: recommendation.suggestions || [],
                    detectedAnimals: analysis.detectedAnimals
                });
            }
            
            // Store detailed result
            detailedResults.push({
                filePath: file.fullPath,
                relativePath: file.relativePath,
                analysis,
                verification,
                recommendation
            });
        }
        
        // Generate visual review batches
        this.generateVisualReviewBatches();
        
        // Save results
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        
        // Convert Set to Array for JSON serialization
        const resultsForSaving = {
            ...this.results,
            uniqueAnimalsFound: Array.from(this.results.uniqueAnimalsFound)
        };
        
        fs.writeFileSync(
            path.join(__dirname, '..', `enhanced-analysis-results-${timestamp}.json`),
            JSON.stringify(detailedResults, null, 2),
            'utf8'
        );
        
        fs.writeFileSync(
            path.join(__dirname, '..', `enhanced-analysis-summary-${timestamp}.json`),
            JSON.stringify(resultsForSaving, null, 2),
            'utf8'
        );
        
        console.log('\n=== ENHANCED ANALYSIS COMPLETE ===');
        console.log(`Total images analyzed: ${this.results.totalAnalyzed}`);
        console.log(`Correctly placed: ${this.results.correctlyPlaced}`);
        console.log(`Misplaced: ${this.results.misplaced}`);
        console.log(`Need review: ${this.results.uncertain}`);
        console.log(`Need visual review: ${this.results.visualReviewNeeded.length}`);
        console.log(`Unique animals found (context): ${this.results.uniqueAnimalsFound.size}`);
        
        if (this.results.uniqueAnimalsFound.size > 0) {
            console.log('\n🐾 ANIMALS DETECTED FROM PATH CONTEXT:');
            console.log(`  ${Array.from(this.results.uniqueAnimalsFound).sort().join(', ')}`);
        }
        
        console.log('\n📋 NEXT STEPS:');
        console.log('  1. Review the visual-review-batches JSON file');
        console.log('  2. Create HTML galleries for manual animal identification');
        console.log('  3. Use browser tools to view and categorize images');
        console.log('  4. Create separate projects for each unique animal found');
        
        return detailedResults;
    }
}

// Run if called directly
if (require.main === module) {
    const analyzer = new EnhancedImageAnalyzer();
    analyzer.runEnhancedAnalysis()
        .then(() => {
            console.log('\n✅ Enhanced analysis complete! Check the generated JSON files for detailed results.');
        })
        .catch(error => {
            console.error('❌ Analysis failed:', error);
            process.exit(1);
        });
}

module.exports = EnhancedImageAnalyzer;
