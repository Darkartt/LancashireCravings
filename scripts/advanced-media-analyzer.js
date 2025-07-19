const fs = require('fs');
const path = require('path');

class AdvancedMediaAnalyzer {
    constructor() {
        this.mediaDir = path.join(__dirname, '..', 'public', 'media');
        this.results = {
            totalAnalyzed: 0,
            improvedProjects: [],
            natureProjectsSuggested: [],
            coverImageChanges: [],
            stageRefinements: [],
            sequenceImprovements: [],
            statistics: {
                betterCoversFound: 0,
                stagesRefined: 0,
                natureProjectsCreated: 0,
                sequencesImproved: 0
            }
        };
        
        // Enhanced animal/object detection with confidence scoring
        this.animalPatterns = {
            // Fish types with detailed patterns
            'bass': {
                keywords: ['bass', 'largemouth', 'smallmouth', 'striper', 'striped_bass'],
                aliases: ['bass_fish', 'largemouth_bass'],
                body_shape: 'elongated_torpedo',
                features: ['dorsal_fin', 'tail_fin', 'scales', 'gills', 'barbels'],
                size_variations: ['large_bass', 'small_bass'],
                multiple_detection: true // Can have multiple bass in nature
            },
            'trout': {
                keywords: ['trout', 'rainbow', 'brook', 'brown_trout', 'speckled'],
                aliases: ['rainbow_trout', 'brook_trout'],
                body_shape: 'streamlined',
                features: ['spots', 'adipose_fin', 'parr_marks'],
                multiple_detection: true
            },
            'salmon': {
                keywords: ['salmon', 'coho', 'chinook', 'atlantic', 'sockeye'],
                aliases: ['pacific_salmon', 'atlantic_salmon'],
                body_shape: 'torpedo_spawning',
                features: ['hooked_jaw', 'spawning_colors', 'kype'],
                multiple_detection: true
            },
            'pike': {
                keywords: ['pike', 'northern', 'muskie', 'musky', 'pickerel'],
                aliases: ['northern_pike', 'muskellunge'],
                body_shape: 'elongated_predator',
                features: ['sharp_teeth', 'long_snout', 'chain_pattern'],
                multiple_detection: true
            },
            'walleye': {
                keywords: ['walleye', 'yellow_perch', 'perch'],
                aliases: ['yellow_walleye'],
                body_shape: 'perch_like',
                features: ['glassy_eyes', 'dorsal_fins', 'yellow_sides'],
                multiple_detection: true
            },
            
            // Birds with variations
            'eagle': {
                keywords: ['eagle', 'bald_eagle', 'golden_eagle', 'american_eagle'],
                aliases: ['bald_eagle', 'golden_eagle'],
                body_shape: 'raptor_spread',
                features: ['hooked_beak', 'talons', 'spread_wings', 'white_head'],
                multiple_detection: true
            },
            'owl': {
                keywords: ['owl', 'barn_owl', 'great_horned', 'screech_owl'],
                aliases: ['barn_owl', 'horned_owl'],
                body_shape: 'round_compact',
                features: ['large_eyes', 'facial_disc', 'ear_tufts'],
                multiple_detection: true
            },
            'hawk': {
                keywords: ['hawk', 'red_tail', 'cooper', 'red_tailed'],
                aliases: ['red_tailed_hawk', 'coopers_hawk'],
                body_shape: 'raptor',
                features: ['hooked_beak', 'sharp_talons', 'barred_tail'],
                multiple_detection: true
            },
            'duck': {
                keywords: ['duck', 'mallard', 'wood_duck', 'teal'],
                aliases: ['mallard_duck', 'wood_duck'],
                body_shape: 'waterfowl',
                features: ['webbed_feet', 'bill', 'waterproof_feathers'],
                multiple_detection: true
            },
            
            // Other wildlife
            'deer': {
                keywords: ['deer', 'whitetail', 'buck', 'doe', 'antlers'],
                aliases: ['whitetail_deer', 'white_tailed_deer'],
                body_shape: 'quadruped_graceful',
                features: ['antlers', 'white_tail', 'hooves'],
                multiple_detection: true
            },
            'bear': {
                keywords: ['bear', 'black_bear', 'brown_bear', 'grizzly'],
                aliases: ['black_bear', 'brown_bear'],
                body_shape: 'large_mammal',
                features: ['claws', 'fur', 'powerful_build'],
                multiple_detection: true
            },
            'turtle': {
                keywords: ['turtle', 'sea_turtle', 'box_turtle', 'tortoise'],
                aliases: ['sea_turtle', 'box_turtle'],
                body_shape: 'shelled_reptile',
                features: ['shell', 'flippers', 'head'],
                multiple_detection: true
            },
            
            // Mythical/Special
            'nessie': {
                keywords: ['nessie', 'loch_ness', 'monster', 'serpent', 'dragon', 'sea_monster'],
                aliases: ['loch_ness_monster', 'lake_monster'],
                body_shape: 'serpentine_mythical',
                features: ['long_neck', 'humps', 'scales', 'prehistoric'],
                multiple_detection: false // Unique mythical creature
            },
            'st_collen': {
                keywords: ['stcollen', 'st_collen', 'saint_collen', 'celtic', 'cross', 'saint'],
                aliases: ['saint_collen', 'st_collen_statue'],
                body_shape: 'human_figure_religious',
                features: ['robes', 'staff', 'halo', 'religious_symbols', 'cross'],
                multiple_detection: false // Specific religious figure
            },
            
            // Abstract/Artistic
            'abstract_fish': {
                keywords: ['abstract', 'artistic', 'stylized', 'modern'],
                aliases: ['artistic_fish', 'stylized_fish'],
                body_shape: 'abstract_form',
                features: ['artistic_interpretation', 'stylized_features'],
                multiple_detection: true
            }
        };
        
        // Enhanced process stage detection with visual quality assessment
        this.processStages = {
            'raw_material': {
                keywords: ['log', 'raw', 'bark', 'unshaped', 'chainsaw', 'cut', 'blank'],
                visual_cues: ['rough_surface', 'natural_edge', 'bark_visible', 'chain_marks'],
                quality_indicators: ['initial_shape', 'material_prep'],
                confidence_threshold: 0.8,
                cover_suitability: 0.2 // Low suitability for cover images
            },
            'rough_carving': {
                keywords: ['rough', 'initial', 'blocked_out', 'basic_shape', 'outline'],
                visual_cues: ['tool_marks', 'basic_form', 'no_details', 'geometric_shapes'],
                quality_indicators: ['form_emerging', 'proportions_set'],
                confidence_threshold: 0.7,
                cover_suitability: 0.4
            },
            'detailed_carving': {
                keywords: ['detail', 'carving', 'progress', 'features', 'texture', 'working'],
                visual_cues: ['fine_details', 'texture_work', 'feature_definition', 'tool_precision'],
                quality_indicators: ['features_visible', 'texture_emerging', 'refinement'],
                confidence_threshold: 0.6,
                cover_suitability: 0.7
            },
            'finishing_work': {
                keywords: ['sanding', 'smooth', 'finish', 'polish', 'refinement', 'preparing'],
                visual_cues: ['smooth_surface', 'fine_texture', 'near_complete', 'polish_marks'],
                quality_indicators: ['surface_quality', 'preparation_complete'],
                confidence_threshold: 0.7,
                cover_suitability: 0.8
            },
            'final_complete': {
                keywords: ['final', 'complete', 'finished', 'done', 'painted', 'stained', 'display'],
                visual_cues: ['polished', 'complete_details', 'finished_surface', 'display_ready'],
                quality_indicators: ['masterpiece', 'exhibition_ready', 'client_ready'],
                confidence_threshold: 0.8,
                cover_suitability: 1.0 // Highest suitability for cover images
            }
        };
        
        // Cover image quality assessment criteria
        this.coverImageCriteria = {
            composition: {
                'full_view': 1.0,        // Shows entire piece
                'detail_shot': 0.7,      // Shows important detail
                'angle_view': 0.8,       // Good viewing angle
                'partial_view': 0.4      // Only shows part
            },
            lighting: {
                'professional': 1.0,     // Studio/professional lighting
                'natural': 0.8,          // Good natural light
                'adequate': 0.6,         // Acceptable lighting
                'poor': 0.2              // Poor lighting conditions
            },
            focus: {
                'sharp': 1.0,            // Crisp, clear focus
                'good': 0.8,             // Generally in focus
                'soft': 0.5,             // Slightly soft
                'blurry': 0.1            // Out of focus
            },
            stage_bonus: {
                'final_complete': 1.0,   // Completed work bonus
                'finishing_work': 0.8,   // Nearly complete bonus
                'detailed_carving': 0.6, // Good progress bonus
                'rough_carving': 0.3,    // Early stage penalty
                'raw_material': 0.1      // Raw material penalty
            }
        };
    }

    // Advanced filename and path analysis with multiple animal detection
    analyzeMediaFile(filePath) {
        const normalizedPath = filePath.toLowerCase().replace(/\\/g, '/');
        const filename = path.basename(filePath).toLowerCase();
        const pathParts = normalizedPath.split('/');
        
        const analysis = {
            detectedObjects: [], // Can detect multiple objects/animals
            detectedStage: null,
            detectedWood: null,
            sequenceNumber: null,
            qualityIndicators: [],
            coverImageScore: 0,
            confidence: 0,
            pathClues: [],
            filenameClues: [],
            visualCues: [],
            warnings: [],
            suggestedProject: null,
            isNatureCandidate: false
        };

        // Multi-object detection with confidence scoring
        for (const [objectType, patterns] of Object.entries(this.animalPatterns)) {
            let objectConfidence = 0;
            let detectionSources = [];
            
            // Check all keywords and aliases
            const allKeywords = [...patterns.keywords, ...(patterns.aliases || [])];
            for (const keyword of allKeywords) {
                if (filename.includes(keyword)) {
                    objectConfidence += 0.4;
                    detectionSources.push(`filename:${keyword}`);
                }
                if (pathParts.some(part => part.includes(keyword))) {
                    objectConfidence += 0.3;
                    detectionSources.push(`path:${keyword}`);
                }
            }
            
            // Bonus for exact matches
            if (pathParts.includes(objectType)) {
                objectConfidence += 0.5;
                detectionSources.push(`exact_path_match`);
            }
            
            if (objectConfidence > 0.2) { // Lowered threshold for detection
                analysis.detectedObjects.push({
                    type: objectType,
                    confidence: Math.min(objectConfidence, 1.0),
                    sources: detectionSources,
                    canHaveMultiple: patterns.multiple_detection
                });
                analysis.confidence += objectConfidence * 0.3; // Contribute to overall confidence
            }
        }

        // Enhanced process stage detection
        this.detectProcessStage(analysis, filename, pathParts);
        
        // Sequence number extraction with better patterns
        this.extractSequenceNumber(analysis, filename);
        
        // Cover image quality assessment
        this.assessCoverImageQuality(analysis, filename, pathParts);
        
        // Determine if this should be a separate nature project
        this.evaluateNatureProject(analysis, pathParts);
        
        return analysis;
    }

    detectProcessStage(analysis, filename, pathParts) {
        let bestStage = null;
        let bestConfidence = 0;
        
        // Folder-based stage detection (highest priority)
        const folderStageMap = {
            'final': 'final_complete',
            'process': 'detailed_carving',
            'rough': 'rough_carving',
            'detail': 'detailed_carving',
            'finish': 'finishing_work',
            'raw': 'raw_material'
        };
        
        for (const [folder, stage] of Object.entries(folderStageMap)) {
            if (pathParts.includes(folder)) {
                bestStage = stage;
                bestConfidence = 0.8;
                analysis.pathClues.push(`Folder indicates stage: ${stage}`);
                break;
            }
        }
        
        // Keyword-based detection (secondary)
        for (const [stage, patterns] of Object.entries(this.processStages)) {
            let stageConfidence = 0;
            
            for (const keyword of patterns.keywords) {
                if (filename.includes(keyword)) {
                    stageConfidence += 0.3;
                    analysis.filenameClues.push(`Stage keyword: ${keyword} -> ${stage}`);
                }
            }
            
            if (stageConfidence > bestConfidence) {
                bestStage = stage;
                bestConfidence = stageConfidence;
            }
        }
        
        if (bestStage) {
            analysis.detectedStage = bestStage;
            analysis.confidence += bestConfidence * 0.4;
        }
    }

    extractSequenceNumber(analysis, filename) {
        // Multiple patterns for sequence detection
        const patterns = [
            /(\d{3,4})(?=\.|$)/,           // 3-4 digits at end
            /_(\d{3,4})(?=\.|_|$)/,       // 3-4 digits after underscore
            /(\d{3,4})_/,                 // 3-4 digits before underscore
            /(\d{2,3})(?=\.|$)/           // 2-3 digits at end (fallback)
        ];
        
        for (const pattern of patterns) {
            const match = filename.match(pattern);
            if (match) {
                analysis.sequenceNumber = parseInt(match[1]);
                analysis.filenameClues.push(`Sequence: ${analysis.sequenceNumber}`);
                break;
            }
        }
    }

    assessCoverImageQuality(analysis, filename, pathParts) {
        let score = 0.5; // Base score
        
        // Stage bonus/penalty
        if (analysis.detectedStage && this.coverImageCriteria.stage_bonus[analysis.detectedStage]) {
            score *= this.coverImageCriteria.stage_bonus[analysis.detectedStage];
        }
        
        // Filename quality indicators
        const qualityKeywords = {
            'high': ['final', 'complete', 'finished', 'beauty', 'showcase', 'display', 'hero'],
            'medium': ['detail', 'feature', 'close', 'angle', 'side'],
            'low': ['progress', 'work', 'rough', 'test', 'temp']
        };
        
        for (const [level, keywords] of Object.entries(qualityKeywords)) {
            for (const keyword of keywords) {
                if (filename.includes(keyword)) {
                    if (level === 'high') score += 0.3;
                    else if (level === 'medium') score += 0.1;
                    else score -= 0.1;
                    break;
                }
            }
        }
        
        // Path quality indicators
        if (pathParts.includes('final')) score += 0.2;
        if (pathParts.includes('hero') || pathParts.includes('showcase')) score += 0.3;
        
        analysis.coverImageScore = Math.max(0, Math.min(1, score));
    }

    evaluateNatureProject(analysis, pathParts) {
        // If in nature folder and has detected objects, consider for separation
        if (pathParts.includes('nature') && analysis.detectedObjects.length > 0) {
            analysis.isNatureCandidate = true;
            
            // Multiple objects = definitely should be separated
            if (analysis.detectedObjects.length > 1) {
                analysis.warnings.push('Multiple objects detected in nature collection');
            }
            
            // High confidence single object = good candidate for project
            const highConfidenceObjects = analysis.detectedObjects.filter(obj => obj.confidence > 0.6);
            if (highConfidenceObjects.length > 0) {
                analysis.suggestedProject = highConfidenceObjects[0].type;
            }
        }
    }

    // Generate improved project structure recommendations
    generateProjectRecommendations(allAnalysis) {
        const recommendations = {
            existingProjects: {},
            newNatureProjects: {},
            coverImageChanges: [],
            stageRefinements: [],
            sequenceImprovements: []
        };

        // Group analyses by current project/location
        const projectGroups = {};
        for (const analysis of allAnalysis) {
            const pathParts = analysis.filePath.toLowerCase().replace(/\\/g, '/').split('/');
            let projectKey = 'unknown';
            
            if (pathParts.includes('bass')) projectKey = 'bass';
            else if (pathParts.includes('eagle')) projectKey = 'eagle';
            else if (pathParts.includes('nessie')) projectKey = 'nessie';
            else if (pathParts.includes('stcollen')) projectKey = 'stcollen';
            else if (pathParts.includes('nature')) projectKey = 'nature';
            else if (pathParts.includes('workshop')) projectKey = 'workshop';
            
            if (!projectGroups[projectKey]) projectGroups[projectKey] = [];
            projectGroups[projectKey].push(analysis);
        }

        // Process each project group
        for (const [projectKey, analyses] of Object.entries(projectGroups)) {
            if (projectKey === 'nature') {
                this.processNatureCollection(analyses, recommendations);
            } else if (projectKey !== 'unknown' && projectKey !== 'workshop') {
                this.processExistingProject(projectKey, analyses, recommendations);
            }
        }

        return recommendations;
    }

    processNatureCollection(analyses, recommendations) {
        // Group by detected objects for potential project creation
        const objectGroups = {};
        
        for (const analysis of analyses) {
            for (const detectedObj of analysis.detectedObjects) {
                if (detectedObj.confidence > 0.5) { // Only high-confidence detections
                    const objType = detectedObj.type;
                    if (!objectGroups[objType]) objectGroups[objType] = [];
                    objectGroups[objType].push({
                        analysis,
                        confidence: detectedObj.confidence
                    });
                }
            }
        }
        
        // Create new project recommendations for objects with enough images
        for (const [objectType, items] of Object.entries(objectGroups)) {
            if (items.length >= 3) { // Minimum 3 images to create a project
                const projectName = `nature_${objectType}`;
                
                // Find best cover image
                const sortedItems = items.sort((a, b) => {
                    const scoreA = a.analysis.coverImageScore * a.confidence;
                    const scoreB = b.analysis.coverImageScore * b.confidence;
                    return scoreB - scoreA;
                });
                
                recommendations.newNatureProjects[projectName] = {
                    name: projectName,
                    title: this.formatProjectTitle(objectType),
                    description: `Collection of ${objectType} carvings and references from nature studies`,
                    category: 'nature',
                    suggestedCover: sortedItems[0].analysis.relativePath,
                    mediaItems: items.map(item => ({
                        path: item.analysis.relativePath,
                        stage: item.analysis.detectedStage,
                        sequence: item.analysis.sequenceNumber,
                        coverScore: item.analysis.coverImageScore
                    })),
                    confidence: items.reduce((sum, item) => sum + item.confidence, 0) / items.length
                };
                
                this.results.statistics.natureProjectsCreated++;
            }
        }
    }

    processExistingProject(projectKey, analyses, recommendations) {
        // Find better cover images
        const finalStageImages = analyses.filter(a => 
            a.detectedStage === 'final_complete' || 
            (a.relativePath && a.relativePath.includes('final'))
        );
        
        if (finalStageImages.length > 0) {
            const bestCover = finalStageImages.reduce((best, current) => 
                current.coverImageScore > best.coverImageScore ? current : best
            );
            
            if (bestCover.coverImageScore > 0.7) {
                recommendations.coverImageChanges.push({
                    project: projectKey,
                    currentCover: '', // Would need to get from existing config
                    suggestedCover: bestCover.relativePath,
                    score: bestCover.coverImageScore,
                    reason: `Higher quality final stage image (score: ${bestCover.coverImageScore.toFixed(2)})`
                });
                this.results.statistics.betterCoversFound++;
            }
        }
        
        // Process stage refinements
        this.processStageRefinements(projectKey, analyses, recommendations);
        
        // Process sequence improvements
        this.processSequenceImprovements(projectKey, analyses, recommendations);
        
        recommendations.existingProjects[projectKey] = {
            totalImages: analyses.length,
            stageDistribution: this.getStageDistribution(analyses),
            qualityMetrics: this.calculateQualityMetrics(analyses)
        };
    }

    processStageRefinements(projectKey, analyses, recommendations) {
        const stageIssues = [];
        
        for (const analysis of analyses) {
            const pathParts = analysis.relativePath.toLowerCase().split('/');
            const currentFolder = pathParts.includes('final') ? 'final' : 
                                 pathParts.includes('process') ? 'process' : 'unknown';
            
            if (analysis.detectedStage) {
                const expectedFolder = ['finishing_work', 'final_complete'].includes(analysis.detectedStage) ? 'final' : 'process';
                
                if (currentFolder !== expectedFolder && currentFolder !== 'unknown') {
                    stageIssues.push({
                        file: analysis.relativePath,
                        currentFolder,
                        detectedStage: analysis.detectedStage,
                        suggestedFolder: expectedFolder,
                        confidence: analysis.confidence
                    });
                }
            }
        }
        
        if (stageIssues.length > 0) {
            recommendations.stageRefinements.push({
                project: projectKey,
                issues: stageIssues
            });
            this.results.statistics.stagesRefined += stageIssues.length;
        }
    }

    processSequenceImprovements(projectKey, analyses, recommendations) {
        // Group by stage and check sequence consistency
        const stageGroups = {};
        for (const analysis of analyses) {
            const stage = analysis.detectedStage || 'unclassified';
            if (!stageGroups[stage]) stageGroups[stage] = [];
            stageGroups[stage].push(analysis);
        }
        
        for (const [stage, items] of Object.entries(stageGroups)) {
            const sequencedItems = items.filter(item => item.sequenceNumber);
            if (sequencedItems.length > 1) {
                // Sort by sequence number and check for gaps or issues
                sequencedItems.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                
                const sequences = sequencedItems.map(item => item.sequenceNumber);
                const gaps = this.findSequenceGaps(sequences);
                const duplicates = this.findSequenceDuplicates(sequences);
                
                if (gaps.length > 0 || duplicates.length > 0) {
                    recommendations.sequenceImprovements.push({
                        project: projectKey,
                        stage: stage,
                        gaps: gaps,
                        duplicates: duplicates,
                        items: sequencedItems.map(item => ({
                            path: item.relativePath,
                            sequence: item.sequenceNumber
                        }))
                    });
                    this.results.statistics.sequencesImproved++;
                }
            }
        }
    }

    findSequenceGaps(sequences) {
        const gaps = [];
        for (let i = 0; i < sequences.length - 1; i++) {
            const gap = sequences[i + 1] - sequences[i];
            if (gap > 1) {
                gaps.push({
                    after: sequences[i],
                    before: sequences[i + 1],
                    size: gap - 1
                });
            }
        }
        return gaps;
    }

    findSequenceDuplicates(sequences) {
        const seen = new Set();
        const duplicates = [];
        for (const seq of sequences) {
            if (seen.has(seq)) {
                duplicates.push(seq);
            }
            seen.add(seq);
        }
        return duplicates;
    }

    getStageDistribution(analyses) {
        const distribution = {};
        for (const analysis of analyses) {
            const stage = analysis.detectedStage || 'unclassified';
            distribution[stage] = (distribution[stage] || 0) + 1;
        }
        return distribution;
    }

    calculateQualityMetrics(analyses) {
        const totalImages = analyses.length;
        const withSequence = analyses.filter(a => a.sequenceNumber).length;
        const withStage = analyses.filter(a => a.detectedStage).length;
        const highQuality = analyses.filter(a => a.coverImageScore > 0.7).length;
        
        return {
            sequenceCompletion: withSequence / totalImages,
            stageClassification: withStage / totalImages,
            highQualityRatio: highQuality / totalImages,
            averageCoverScore: analyses.reduce((sum, a) => sum + a.coverImageScore, 0) / totalImages
        };
    }

    formatProjectTitle(objectType) {
        const titleMap = {
            'bass': 'Bass Collection',
            'trout': 'Trout Studies',
            'salmon': 'Salmon Carvings',
            'pike': 'Pike Collection',
            'walleye': 'Walleye Studies',
            'eagle': 'Eagle Collection',
            'owl': 'Owl Studies',
            'hawk': 'Hawks and Raptors',
            'duck': 'Duck Collection',
            'deer': 'Deer Studies',
            'bear': 'Bear Collection',
            'turtle': 'Turtle Carvings'
        };
        
        return titleMap[objectType] || objectType.charAt(0).toUpperCase() + objectType.slice(1) + ' Collection';
    }

    // Main execution method
    async executeAdvancedAnalysis() {
        console.log('🚀 Starting Advanced Media Analysis with Four Key Improvements...');
        console.log('1. Better cover image selection');
        console.log('2. Process stage refinement');
        console.log('3. Nature collection splitting (each object as project)');
        console.log('4. Improved sequence ordering');
        console.log('');
        
        const startTime = Date.now();
        
        // Scan all media files
        const allFiles = await this.scanAllMedia();
        console.log(`📊 Found ${allFiles.length} media files to analyze`);
        
        // Analyze each file
        const allAnalysis = [];
        for (let i = 0; i < allFiles.length; i++) {
            const file = allFiles[i];
            const analysis = this.analyzeMediaFile(file.fullPath);
            analysis.relativePath = file.relativePath;
            analysis.filePath = file.fullPath;
            allAnalysis.push(analysis);
            
            if ((i + 1) % 500 === 0) {
                console.log(`📈 Processed ${i + 1}/${allFiles.length} files...`);
            }
        }
        
        this.results.totalAnalyzed = allFiles.length;
        
        // Generate comprehensive recommendations
        console.log('🔍 Generating project recommendations...');
        const recommendations = this.generateProjectRecommendations(allAnalysis);
        
        // Save detailed results
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const resultsFile = path.join(__dirname, '..', `advanced-analysis-results-${timestamp}.json`);
        const summaryFile = path.join(__dirname, '..', `advanced-analysis-summary-${timestamp}.json`);
        
        const detailedResults = {
            timestamp: new Date().toISOString(),
            executionTime: Date.now() - startTime,
            totalFiles: allFiles.length,
            analysis: allAnalysis,
            recommendations: recommendations,
            statistics: this.results.statistics
        };
        
        const summary = {
            timestamp: new Date().toISOString(),
            executionTime: Date.now() - startTime,
            totalFiles: allFiles.length,
            improvements: {
                betterCoversFound: this.results.statistics.betterCoversFound,
                stagesRefined: this.results.statistics.stagesRefined,
                natureProjectsCreated: this.results.statistics.natureProjectsCreated,
                sequencesImproved: this.results.statistics.sequencesImproved
            },
            newNatureProjects: Object.keys(recommendations.newNatureProjects).length,
            existingProjectsAnalyzed: Object.keys(recommendations.existingProjects).length,
            recommendations: recommendations
        };
        
        fs.writeFileSync(resultsFile, JSON.stringify(detailedResults, null, 2));
        fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
        
        console.log('');
        console.log('✅ Advanced Analysis Complete!');
        console.log(`⏱️  Execution time: ${Math.round((Date.now() - startTime) / 1000)}s`);
        console.log(`📊 Files analyzed: ${allFiles.length}`);
        console.log(`🖼️  Better covers found: ${this.results.statistics.betterCoversFound}`);
        console.log(`🎭 Stages refined: ${this.results.statistics.stagesRefined}`);
        console.log(`🌿 Nature projects created: ${this.results.statistics.natureProjectsCreated}`);
        console.log(`🔢 Sequences improved: ${this.results.statistics.sequencesImproved}`);
        console.log(`📁 Results saved to: ${resultsFile}`);
        console.log(`📋 Summary saved to: ${summaryFile}`);
        
        return summary;
    }

    // Utility methods
    async scanAllMedia() {
        const allFiles = [];
        
        const projectsDir = path.join(this.mediaDir, 'projects');
        await this.scanDirectory(projectsDir, allFiles, 'projects');
        
        const natureDir = path.join(this.mediaDir, 'nature');
        await this.scanDirectory(natureDir, allFiles, 'nature');
        
        const workshopDir = path.join(this.mediaDir, 'workshop');
        await this.scanDirectory(workshopDir, allFiles, 'workshop');
        
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
}

// Execute if run directly
if (require.main === module) {
    const analyzer = new AdvancedMediaAnalyzer();
    analyzer.executeAdvancedAnalysis()
        .then(results => {
            console.log('\n🎉 Analysis completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Analysis failed:', error);
            process.exit(1);
        });
}

module.exports = AdvancedMediaAnalyzer;
