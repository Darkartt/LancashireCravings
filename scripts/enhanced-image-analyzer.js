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
            suggestions: []
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
            'falcon': {
                keywords: ['falcon', 'peregrine', 'kestrel'],
                body_shape: 'speed_raptor',
                features: ['pointed_wings', 'tear_marks']
            },
            'duck': {
                keywords: ['duck', 'mallard', 'wood_duck', 'teal'],
                body_shape: 'waterfowl',
                features: ['webbed_feet', 'bill', 'waterproof']
            },
            'goose': {
                keywords: ['goose', 'canada_goose', 'snow_goose'],
                body_shape: 'large_waterfowl',
                features: ['long_neck', 'webbed_feet']
            },
            'heron': {
                keywords: ['heron', 'blue_heron', 'great_heron'],
                body_shape: 'wading_bird',
                features: ['long_neck', 'long_legs', 'spear_bill']
            },
            'cardinal': {
                keywords: ['cardinal', 'red_bird'],
                body_shape: 'songbird',
                features: ['crest', 'thick_bill', 'red_color']
            },
            'woodpecker': {
                keywords: ['woodpecker', 'pileated', 'downy', 'hairy'],
                body_shape: 'tree_bird',
                features: ['strong_bill', 'tail_prop', 'drumming']
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
            'lizard': {
                keywords: ['lizard', 'gecko', 'iguana', 'salamander'],
                body_shape: 'reptile',
                features: ['scales', 'tail', 'cold_blooded']
            },
            'snake': {
                keywords: ['snake', 'serpent', 'viper', 'python'],
                body_shape: 'serpentine',
                features: ['no_legs', 'scales', 'forked_tongue']
            },
            
            // Mammals
            'deer': {
                keywords: ['deer', 'whitetail', 'buck', 'doe', 'antler'],
                body_shape: 'ungulate',
                features: ['antlers', 'hooves', 'white_tail']
            },
            'bear': {
                keywords: ['bear', 'black_bear', 'brown_bear', 'grizzly'],
                body_shape: 'large_mammal',
                features: ['fur', 'claws', 'powerful_build']
            },
            'wolf': {
                keywords: ['wolf', 'coyote', 'canine'],
                body_shape: 'canine',
                features: ['pack_animal', 'howling', 'sharp_teeth']
            },
            'fox': {
                keywords: ['fox', 'red_fox', 'kit_fox'],
                body_shape: 'small_canine',
                features: ['bushy_tail', 'pointed_ears', 'cunning']
            },
            'rabbit': {
                keywords: ['rabbit', 'bunny', 'hare'],
                body_shape: 'small_mammal',
                features: ['long_ears', 'cotton_tail', 'hopping']
            },
            'squirrel': {
                keywords: ['squirrel', 'chipmunk', 'ground_squirrel'],
                body_shape: 'rodent',
                features: ['bushy_tail', 'climbing', 'nut_gathering']
            },
            'horse': {
                keywords: ['horse', 'stallion', 'mare', 'pony'],
                body_shape: 'equine',
                features: ['mane', 'hooves', 'galloping']
            },
            'cow': {
                keywords: ['cow', 'bull', 'cattle', 'bovine'],
                body_shape: 'livestock',
                features: ['udder', 'horns', 'grazing']
            },
            'pig': {
                keywords: ['pig', 'hog', 'swine', 'boar'],
                body_shape: 'livestock',
                features: ['snout', 'curly_tail', 'wallowing']
            },
            'sheep': {
                keywords: ['sheep', 'lamb', 'ram', 'wool'],
                body_shape: 'livestock',
                features: ['wool', 'bleating', 'flock']
            },
            'goat': {
                keywords: ['goat', 'kid', 'billy', 'nanny'],
                body_shape: 'livestock',
                features: ['beard', 'horns', 'climbing']
            },
            
            // Mythical/Religious/Other
            'nessie': {
                keywords: ['nessie', 'loch_ness', 'monster', 'lake_monster'],
                body_shape: 'serpentine',
                features: ['long_neck', 'humps', 'scales']
            },
            'dragon': {
                keywords: ['dragon', 'wyrm', 'drake'],
                body_shape: 'mythical',
                features: ['wings', 'fire_breathing', 'scales', 'treasure']
            },
            'st_collen': {
                keywords: ['stcollen', 'st_collen', 'saint_collen', 'celtic', 'cross'],
                body_shape: 'human_figure',
                features: ['robes', 'staff', 'halo', 'religious_symbols']
            },
            'angel': {
                keywords: ['angel', 'cherub', 'seraph', 'heavenly'],
                body_shape: 'human_figure',
                features: ['wings', 'halo', 'robes']
            },
            'cross': {
                keywords: ['cross', 'crucifix', 'christian'],
                body_shape: 'religious_symbol',
                features: ['intersection', 'vertical_horizontal']
            },
            
            // Marine Life
            'dolphin': {
                keywords: ['dolphin', 'porpoise'],
                body_shape: 'marine_mammal',
                features: ['blowhole', 'intelligent', 'echolocation']
            },
            'whale': {
                keywords: ['whale', 'humpback', 'blue_whale'],
                body_shape: 'large_marine',
                features: ['massive_size', 'blowhole', 'baleen']
            },
            'shark': {
                keywords: ['shark', 'great_white', 'hammerhead'],
                body_shape: 'predator_fish',
                features: ['sharp_teeth', 'cartilage', 'fin']
            },
            'octopus': {
                keywords: ['octopus', 'squid', 'tentacle'],
                body_shape: 'cephalopod',
                features: ['eight_arms', 'ink', 'suction_cups']
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
            'process': 'detailed_work', // default for process folder
            'rough': 'rough_carving',
            'detail': 'detailed_work',
            'finish': 'finishing'
        };
        
        // Check folder structure for stage hints
        for (const [folder, stage] of Object.entries(folderStageMap)) {
            if (pathParts.includes(folder)) {
                analysis.detectedStage = stage;
                analysis.pathClues.push(`Folder-based stage: ${stage}`);
                analysis.confidence += 0.4; // Higher confidence for folder placement
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

    // Enhanced verification with stricter rules
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
            isNatureAnimal: false
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

        // Check if detected animals match current project or need their own project
        if (analysis.detectedAnimals.length > 0) {
            const primaryAnimal = analysis.detectedAnimals[0].animal;
            
            // Animals that should definitely have their own projects
            const specificAnimals = [
                'largemouth_bass', 'smallmouth_bass', 'striped_bass', 'trout', 'salmon', 
                'pike', 'muskie', 'walleye', 'perch', 'catfish', 'sunfish',
                'bald_eagle', 'golden_eagle', 'owl', 'hawk', 'falcon', 'duck', 'goose', 
                'heron', 'cardinal', 'woodpecker',
                'butterfly', 'dragonfly', 'bee', 'spider', 'frog', 'turtle', 'lizard', 'snake',
                'deer', 'bear', 'wolf', 'fox', 'rabbit', 'squirrel', 'horse', 'cow', 'pig', 'sheep', 'goat',
                'dolphin', 'whale', 'shark', 'octopus', 'dragon', 'angel', 'cross'
            ];
            
            // Nature animals that should be in nature folder or their own project
            const natureAnimals = [
                'butterfly', 'dragonfly', 'bee', 'spider', 'frog', 'turtle', 'lizard', 'snake',
                'deer', 'bear', 'wolf', 'fox', 'rabbit', 'squirrel'
            ];
            
            if (specificAnimals.includes(primaryAnimal)) {
                verification.shouldHaveOwnProject = true;
                
                // Check if this specific animal has its own project folder
                const hasOwnProject = pathParts.includes(primaryAnimal);
                
                if (!hasOwnProject) {
                    // This animal should have its own project
                    verification.isCorrectProject = false;
                    verification.issues.push(`${primaryAnimal} should have its own project folder`);
                    verification.suggestions.push(`Create new project: ${primaryAnimal}`);
                    verification.confidence = 'high';
                } else {
                    verification.isCorrectProject = true;
                    verification.confidence = 'high';
                }
            }
            
            // Handle nature animals
            if (natureAnimals.includes(primaryAnimal)) {
                verification.isNatureAnimal = true;
                if (verification.currentProject !== 'nature' && !pathParts.includes(primaryAnimal)) {
                    verification.issues.push(`Nature animal ${primaryAnimal} in wrong location`);
                    verification.suggestions.push(`Move to nature/${primaryAnimal} or create project/${primaryAnimal}`);
                }
            }
            
            // Special handling for generic types vs specific ones
            if (primaryAnimal === 'bass_generic' && verification.currentProject === 'bass') {
                // Only keep generic bass if no specific bass type was detected
                const hasSpecificBass = analysis.detectedAnimals.some(a => 
                    ['largemouth_bass', 'smallmouth_bass', 'striped_bass'].includes(a.animal));
                
                if (hasSpecificBass) {
                    verification.isCorrectProject = false;
                    verification.issues.push('Specific bass type detected, should be separated');
                } else {
                    verification.isCorrectProject = true;
                }
            }
            
            // Special handling for stcollen - always correct if detected
            if (primaryAnimal === 'st_collen' && verification.currentProject === 'stcollen') {
                verification.isCorrectProject = true;
                verification.confidence = 'high';
            }
            
            // Special handling for nessie
            if (primaryAnimal === 'nessie' && verification.currentProject === 'nessie') {
                verification.isCorrectProject = true;
                verification.confidence = 'high';
            }
            
            // Multiple animals detected - definitely needs separation
            if (analysis.detectedAnimals.length > 1) {
                verification.issues.push('Multiple animals detected - needs separation');
                verification.suggestions.push(`Separate into: ${analysis.detectedAnimals.map(a => a.animal).join(', ')}`);
                verification.confidence = 'high';
            }
        }

        // Check stage placement
        if (analysis.detectedStage) {
            const isProcessStage = ['raw_log', 'rough_carving', 'detailed_work'].includes(analysis.detectedStage);
            const isFinalStage = ['finishing', 'final_complete'].includes(analysis.detectedStage);
            
            if (isProcessStage && verification.currentStage === 'process') {
                verification.isCorrectStage = true;
            } else if (isFinalStage && verification.currentStage === 'final') {
                verification.isCorrectStage = true;
            } else {
                verification.isCorrectStage = false;
                verification.issues.push(`Stage mismatch: ${analysis.detectedStage} in ${verification.currentStage} folder`);
            }
        } else {
            verification.isCorrectStage = true;
        }

        return verification;
    }

    // Generate recommendations with specific actions for unique animal projects
    generateRecommendation(filePath, analysis, verification) {
        const recommendation = {
            action: 'keep', // keep, move, review, separate, create_project
            reason: '',
            suggestedPath: null,
            newProjectSuggestion: null,
            confidence: verification.confidence,
            priority: 'low', // low, medium, high
            uniqueAnimalsFound: analysis.detectedAnimals || [],
            createNewProjects: []
        };

        // HIGH PRIORITY: Create new projects for unique animals
        if (verification.shouldHaveOwnProject && analysis.detectedAnimals.length > 0) {
            const primaryAnimal = analysis.detectedAnimals[0].animal;
            
            // Check if the animal already has its own project folder
            const pathParts = filePath.toLowerCase().replace(/\\/g, '/').split('/');
            const hasOwnProject = pathParts.includes(primaryAnimal);
            
            if (!hasOwnProject) {
                recommendation.action = 'create_project';
                recommendation.newProjectSuggestion = primaryAnimal;
                recommendation.suggestedPath = filePath.replace(
                    /\/projects\/[^\/]+\//,
                    `/projects/${primaryAnimal}/`
                ).replace(
                    /\/nature\//,
                    `/projects/${primaryAnimal}/`
                ).replace(
                    /\/workshop\//,
                    `/projects/${primaryAnimal}/`
                );
                recommendation.reason = `${primaryAnimal} should have its own project folder`;
                recommendation.priority = 'high';
                recommendation.createNewProjects.push({
                    animalType: primaryAnimal,
                    sourceProject: verification.currentProject,
                    newProjectPath: `/projects/${primaryAnimal}/`
                });
            } else {
                recommendation.action = 'keep';
                recommendation.reason = `${primaryAnimal} correctly in its own project`;
                recommendation.confidence = 'high';
            }
        }

        // MULTIPLE ANIMALS: Separate into individual projects
        else if (analysis.detectedAnimals.length > 1) {
            recommendation.action = 'separate';
            recommendation.priority = 'high';
            recommendation.reason = `Multiple animals detected: ${analysis.detectedAnimals.map(a => a.animal).join(', ')}`;
            
            // Create suggestions for each animal
            analysis.detectedAnimals.forEach(animalData => {
                recommendation.createNewProjects.push({
                    animalType: animalData.animal,
                    sourceProject: verification.currentProject,
                    newProjectPath: `/projects/${animalData.animal}/`,
                    confidence: animalData.confidence
                });
            });
            
            // Suggest path for the primary (highest confidence) animal
            const primaryAnimal = analysis.detectedAnimals[0].animal;
            recommendation.suggestedPath = filePath.replace(
                /\/projects\/[^\/]+\//,
                `/projects/${primaryAnimal}/`
            );
        }

        // NATURE ANIMALS: Move to appropriate location
        else if (verification.isNatureAnimal && analysis.detectedAnimals.length > 0) {
            const primaryAnimal = analysis.detectedAnimals[0].animal;
            
            if (verification.currentProject !== 'nature' && !filePath.includes(`/${primaryAnimal}/`)) {
                recommendation.action = 'move';
                recommendation.priority = 'medium';
                recommendation.reason = `Nature animal ${primaryAnimal} should be in nature/${primaryAnimal} or projects/${primaryAnimal}`;
                
                // Suggest both nature and project options
                recommendation.suggestedPath = filePath.replace(
                    /\/projects\/[^\/]+\//,
                    `/nature/${primaryAnimal}/`
                ).replace(
                    /\/workshop\//,
                    `/nature/${primaryAnimal}/`
                );
                
                recommendation.createNewProjects.push({
                    animalType: primaryAnimal,
                    sourceProject: verification.currentProject,
                    newProjectPath: `/projects/${primaryAnimal}/`,
                    alternativePath: `/nature/${primaryAnimal}/`
                });
            }
        }

        // MISPLACED IN WRONG PROJECT
        else if (!verification.isCorrectProject && verification.confidence === 'high' && analysis.detectedAnimals.length > 0) {
            const targetAnimal = analysis.detectedAnimals[0].animal;
            recommendation.action = 'move';
            recommendation.suggestedPath = filePath.replace(
                `/projects/${verification.currentProject}/`,
                `/projects/${targetAnimal}/`
            );
            recommendation.reason = `Detected ${targetAnimal} in ${verification.currentProject} project`;
            recommendation.priority = 'high';
        }

        // STAGE MISPLACEMENT
        else if (!verification.isCorrectStage) {
            recommendation.action = 'review';
            recommendation.reason = `Stage mismatch: ${analysis.detectedStage} in ${verification.currentStage} folder`;
            recommendation.priority = 'medium';
        }

        // NO CLEAR ANIMAL DETECTED
        else if (analysis.detectedAnimals.length === 0 && verification.currentProject !== 'workshop') {
            recommendation.action = 'review';
            recommendation.reason = 'No clear animal detected - may need manual review';
            recommendation.priority = 'low';
        }

        // EVERYTHING LOOKS GOOD
        else if (verification.isCorrectProject && verification.isCorrectStage) {
            recommendation.action = 'keep';
            recommendation.reason = 'Correctly placed';
            recommendation.confidence = 'high';
        }

        // UNCERTAIN CASES
        else {
            recommendation.action = 'review';
            recommendation.reason = 'Uncertain placement - needs manual review';
            recommendation.priority = 'medium';
        }

        return recommendation;
    }

    // Visual analysis method using browser to detect animals in images
    async analyzeImageVisually(filePath) {
        try {
            // Convert file path to a format the browser can access
            const imageUrl = `file:///${filePath.replace(/\\/g, '/')}`;
            
            // Navigate to the image
            await this.navigateToBrowser(imageUrl);
            
            // Take a screenshot for analysis
            const screenshotResult = await this.takeScreenshot(`analysis_${Date.now()}`);
            
            // Analyze the image content using JavaScript in browser
            const analysisResult = await this.analyzeImageContent();
            
            return analysisResult;
        } catch (error) {
            console.warn(`Visual analysis failed for ${filePath}: ${error.message}`);
            return null;
        }
    }

    // Navigate to browser (initialize if needed)
    async navigateToBrowser(url) {
        try {
            // Use the browser MCP tool to navigate to the image
            return await mcp__automatalabs_browser_navigate({ url });
        } catch (error) {
            throw new Error(`Failed to navigate to image: ${error.message}`);
        }
    }

    // Take screenshot of the current image
    async takeScreenshot(name) {
        try {
            return await mcp__automatalabs_browser_screenshot({ name, fullPage: false });
        } catch (error) {
            throw new Error(`Failed to take screenshot: ${error.message}`);
        }
    }

    // Analyze image content using browser evaluation
    async analyzeImageContent() {
        try {
            const analysisScript = `
                function analyzeWoodcarvingImage() {
                    // Get the image element
                    const img = document.querySelector('img') || document.querySelector('body');
                    
                    if (!img) {
                        return { error: 'No image found' };
                    }
                    
                    // Analyze image characteristics
                    const analysis = {
                        description: '',
                        detectedAnimals: [],
                        stage: null,
                        confidence: 0,
                        characteristics: []
                    };
                    
                    // Get image dimensions and basic info
                    const rect = img.getBoundingClientRect();
                    analysis.characteristics.push(\`Image size: \${rect.width}x\${rect.height}\`);
                    
                    // Since we can't actually analyze image content with JavaScript alone,
                    // we'll need to use visual AI or manual classification
                    // For now, return basic structure that can be enhanced
                    
                    analysis.description = 'Woodcarving image detected';
                    analysis.confidence = 0.5;
                    
                    return analysis;
                }
                
                return analyzeWoodcarvingImage();
            `;
            
            const result = await mcp__automatalabs_browser_evaluate({ script: analysisScript });
            return result;
        } catch (error) {
            throw new Error(`Failed to analyze image content: ${error.message}`);
        }
    }

    // Enhanced animal detection using visual cues and AI
    async detectAnimalFromVisual(imagePath) {
        // This is where we would integrate with an AI vision service
        // For now, we'll analyze based on visual patterns we can detect
        
        const visualHints = {
            fish_characteristics: [
                'fins', 'scales', 'elongated body', 'tail fin', 'gills',
                'streamlined shape', 'water environment'
            ],
            bird_characteristics: [
                'wings', 'beak', 'feathers', 'talons', 'head crest',
                'spread wings', 'perched position'
            ],
            mammal_characteristics: [
                'fur', 'four legs', 'ears', 'snout', 'tail',
                'paws', 'realistic proportions'
            ],
            carving_stages: [
                'rough_cut', 'detailed_carving', 'smooth_finish',
                'tool_marks', 'texture_work', 'paint_stain'
            ]
        };
        
        // This would be enhanced with actual AI vision API
        return {
            detectedAnimals: [],
            stage: 'unknown',
            confidence: 0.1,
            needsManualReview: true
        };
    }

    // Scan all media directories more thoroughly
    async scanAllMedia() {
        console.log('🔍 Enhanced scanning for all media files...');
        const allFiles = [];
        
        // Scan projects directory
        const projectsDir = path.join(this.mediaDir, 'projects');
        await this.scanDirectory(projectsDir, allFiles, 'projects');
        
        // Scan nature directory (might contain misplaced project images)
        const natureDir = path.join(this.mediaDir, 'nature');
        await this.scanDirectory(natureDir, allFiles, 'nature');
        
        // Scan workshop directory
        const workshopDir = path.join(this.mediaDir, 'workshop');
        await this.scanDirectory(workshopDir, allFiles, 'workshop');
        
        // Scan any loose files in media root
        await this.scanDirectory(this.mediaDir, allFiles, 'root', 1); // Only 1 level deep
        
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
        
        const allFiles = await this.scanAllMedia();
        this.results.totalAnalyzed = allFiles.length;
        
        const detailedResults = [];
        
        for (let i = 0; i < allFiles.length; i++) {
            const file = allFiles[i];
            
            if (i % 100 === 0) {
                console.log(`Processed ${i}/${allFiles.length} images...`);
            }
            
            // Analyze the file
            const analysis = await this.analyzeFilenameAndPath(file.fullPath);
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
            
            // Track unique animals found
            if (analysis.detectedAnimals) {
                analysis.detectedAnimals.forEach(animal => {
                    this.results.uniqueAnimalsFound.add(animal.animal);
                });
            }
            
            // Track project creation suggestions
            if (recommendation.createNewProjects && recommendation.createNewProjects.length > 0) {
                this.results.newProjectsSuggested++;
                recommendation.createNewProjects.forEach(project => {
                    this.results.projectCreationSuggestions.push({
                        animalType: project.animalType,
                        sourceFile: file.relativePath,
                        sourceProject: project.sourceProject,
                        suggestedPath: project.newProjectPath,
                        confidence: project.confidence || 'unknown'
                    });
                });
            }
            
            // Track special cases
            if (recommendation.action === 'separate') {
                this.results.animalSeparations.push({
                    file: file.relativePath,
                    animals: analysis.detectedAnimals.map(a => a.animal),
                    currentProject: verification.currentProject
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
        console.log(`Uncertain: ${this.results.uncertain}`);
        console.log(`New projects suggested: ${this.results.newProjectsSuggested}`);
        console.log(`Unique animals found: ${this.results.uniqueAnimalsFound.size}`);
        
        if (this.results.projectCreationSuggestions.length > 0) {
            console.log('\n🆕 NEW PROJECT SUGGESTIONS:');
            const projectCounts = {};
            this.results.projectCreationSuggestions.forEach(suggestion => {
                if (!projectCounts[suggestion.animalType]) {
                    projectCounts[suggestion.animalType] = 0;
                }
                projectCounts[suggestion.animalType]++;
            });
            
            for (const [animal, count] of Object.entries(projectCounts)) {
                console.log(`  • Create project "${animal}" (${count} files)`);
            }
        }
        
        if (this.results.animalSeparations.length > 0) {
            console.log('\n🔍 Animal separation suggestions:');
            this.results.animalSeparations.forEach(sep => {
                console.log(`  • ${sep.file}: Found ${sep.animals.join(', ')} in ${sep.currentProject} project`);
            });
        }
        
        if (this.results.uniqueAnimalsFound.size > 0) {
            console.log('\n🐾 ALL UNIQUE ANIMALS DETECTED:');
            console.log(`  ${Array.from(this.results.uniqueAnimalsFound).sort().join(', ')}`);
        }
        
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
