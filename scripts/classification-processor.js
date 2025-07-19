const fs = require('fs');
const path = require('path');

class ClassificationProcessor {
    constructor() {
        this.mediaDir = path.join(__dirname, '..', 'public', 'media');
        this.backupDir = path.join(__dirname, '..', 'media-backup');
        this.results = {
            totalProcessed: 0,
            newProjectsCreated: 0,
            imagesMoved: 0,
            errors: []
        };
    }

    // Process exported visual classifications
    async processClassifications(classificationsFile) {
        console.log('🔄 Processing visual classifications...');
        
        if (!fs.existsSync(classificationsFile)) {
            throw new Error(`Classifications file not found: ${classificationsFile}`);
        }
        
        const data = JSON.parse(fs.readFileSync(classificationsFile, 'utf8'));
        console.log(`📊 Loaded classifications for ${Object.keys(data.classifications).length} batches`);
        
        // Flatten all classifications
        const allClassifications = [];
        for (const [batchId, batchData] of Object.entries(data.classifications)) {
            for (const [index, classification] of Object.entries(batchData)) {
                if (classification.animal && classification.stage) {
                    allClassifications.push({
                        batchId,
                        index,
                        ...classification
                    });
                }
            }
        }
        
        console.log(`📋 Total valid classifications: ${allClassifications.length}`);
        
        // Group by animal type
        const animalGroups = this.groupByAnimal(allClassifications);
        console.log(`🐾 Unique animals found: ${Object.keys(animalGroups).length}`);
        
        // Create backup
        await this.createBackup();
        
        // Process each animal group
        for (const [animal, images] of Object.entries(animalGroups)) {
            await this.processAnimalGroup(animal, images);
        }
        
        // Update media-organized.ts
        await this.updateMediaOrganizedFile();
        
        return this.results;
    }

    groupByAnimal(classifications) {
        const groups = {};
        
        classifications.forEach(classification => {
            const animal = classification.animal;
            if (!groups[animal]) {
                groups[animal] = [];
            }
            groups[animal].push(classification);
        });
        
        return groups;
    }

    async createBackup() {
        console.log('💾 Creating backup...');
        
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const backupPath = path.join(this.backupDir, `before-classification-${timestamp}`);
        
        // Copy media directory
        await this.copyDirectory(this.mediaDir, backupPath);
        
        console.log(`✅ Backup created: ${backupPath}`);
    }

    async copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const items = fs.readdirSync(src);
        
        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            const stat = fs.statSync(srcPath);
            
            if (stat.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    async processAnimalGroup(animal, images) {
        console.log(`🦋 Processing ${animal}: ${images.length} images`);
        
        // Determine project name and directory
        const projectName = this.getProjectName(animal);
        const projectDir = path.join(this.mediaDir, 'projects', projectName);
        
        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
            this.results.newProjectsCreated++;
            console.log(`📁 Created new project: ${projectName}`);
        }
        
        // Group images by process stage
        const stageGroups = this.groupByStage(images);
        
        // Process each stage
        for (const [stage, stageImages] of Object.entries(stageGroups)) {
            const stageDir = path.join(projectDir, stage);
            if (!fs.existsSync(stageDir)) {
                fs.mkdirSync(stageDir, { recursive: true });
            }
            
            // Move images to correct location
            for (const image of stageImages) {
                await this.moveImage(image, stageDir);
            }
        }
    }

    getProjectName(animal) {
        // Handle custom animal types
        if (animal.startsWith('custom:')) {
            const customAnimal = animal.substring(7).toLowerCase()
                .replace(/[^a-z0-9]/g, '-')  // Replace non-alphanumeric with dashes
                .replace(/-+/g, '-')         // Replace multiple dashes with single dash
                .replace(/^-|-$/g, '');      // Remove leading/trailing dashes
            return customAnimal || 'custom-animal';
        }
        
        // Map animal names to project folder names
        const animalToProject = {
            // Fish - specific types get their own projects
            'largemouth_bass': 'largemouth-bass',
            'smallmouth_bass': 'smallmouth-bass',
            'striped_bass': 'striped-bass',
            'bass_generic': 'bass',
            'trout': 'trout',
            'salmon': 'salmon',
            'pike': 'pike',
            'muskie': 'muskie',
            'walleye': 'walleye',
            'perch': 'perch',
            'catfish': 'catfish',
            'sunfish': 'sunfish',
            'other_fish': 'other-fish',
            
            // Birds
            'bald_eagle': 'bald-eagle',
            'golden_eagle': 'golden-eagle',
            'eagle_generic': 'eagle',
            'owl': 'owl',
            'hawk': 'hawk',
            'duck': 'duck',
            'goose': 'goose',
            'heron': 'heron',
            'cardinal': 'cardinal',
            'woodpecker': 'woodpecker',
            'other_bird': 'other-bird',
            
            // Insects & Small Creatures
            'butterfly': 'butterfly',
            'dragonfly': 'dragonfly',
            'bee': 'bee',
            'spider': 'spider',
            'frog': 'frog',
            'turtle': 'turtle',
            'lizard': 'lizard',
            'snake': 'snake',
            
            // Mammals
            'deer': 'deer',
            'bear': 'bear',
            'wolf': 'wolf',
            'fox': 'fox',
            'rabbit': 'rabbit',
            'squirrel': 'squirrel',
            'horse': 'horse',
            'cow': 'cow',
            'other_mammal': 'other-mammal',
            
            // Marine Life
            'dolphin': 'dolphin',
            'whale': 'whale',
            'shark': 'shark',
            'octopus': 'octopus',
            
            // Mythical/Religious
            'nessie': 'nessie',
            'dragon': 'dragon',
            'st_collen': 'stcollen',
            'angel': 'angel',
            'cross': 'cross'
        };
        
        return animalToProject[animal] || animal.replace(/_/g, '-');
    }

    groupByStage(images) {
        const groups = {};
        
        images.forEach(image => {
            const stage = image.stage;
            if (!groups[stage]) {
                groups[stage] = [];
            }
            groups[stage].push(image);
        });
        
        return groups;
    }

    async moveImage(imageClassification, targetDir) {
        try {
            const sourcePath = path.join(__dirname, '..', 'public', imageClassification.relativePath);
            
            if (!fs.existsSync(sourcePath)) {
                console.warn(`⚠️ Source file not found: ${sourcePath}`);
                this.results.errors.push(`Source not found: ${imageClassification.relativePath}`);
                return;
            }
            
            // Generate new filename with sequence number
            const originalExt = path.extname(imageClassification.filename);
            const baseFilename = path.basename(imageClassification.filename, originalExt);
            
            // Find next available sequence number
            let sequence = 1;
            let newFilename;
            let targetPath;
            
            do {
                newFilename = `${String(sequence).padStart(3, '0')}${originalExt}`;
                targetPath = path.join(targetDir, newFilename);
                sequence++;
            } while (fs.existsSync(targetPath));
            
            // Move the file
            fs.renameSync(sourcePath, targetPath);
            
            console.log(`📁 Moved: ${imageClassification.filename} → ${path.relative(this.mediaDir, targetPath)}`);
            this.results.imagesMoved++;
            
        } catch (error) {
            console.error(`❌ Error moving ${imageClassification.filename}:`, error.message);
            this.results.errors.push(`Move failed: ${imageClassification.filename} - ${error.message}`);
        }
    }

    async updateMediaOrganizedFile() {
        console.log('📝 Updating media-organized.ts...');
        
        const mediaOrganizedPath = path.join(__dirname, '..', 'src', 'lib', 'media-organized.ts');
        
        // Scan all project directories to build new media data
        const projects = await this.scanProjectDirectories();
        
        // Generate new media-organized.ts content
        const content = this.generateMediaOrganizedContent(projects);
        
        // Write the file
        fs.writeFileSync(mediaOrganizedPath, content, 'utf8');
        
        console.log('✅ Updated media-organized.ts with new project structure');
    }

    async scanProjectDirectories() {
        const projects = {};
        const projectsDir = path.join(this.mediaDir, 'projects');
        
        if (!fs.existsSync(projectsDir)) {
            return projects;
        }
        
        const projectNames = fs.readdirSync(projectsDir).filter(name => {
            return fs.statSync(path.join(projectsDir, name)).isDirectory();
        });
        
        for (const projectName of projectNames) {
            const projectPath = path.join(projectsDir, projectName);
            const stages = {};
            
            // Scan each stage directory
            const items = fs.readdirSync(projectPath);
            
            for (const item of items) {
                const itemPath = path.join(projectPath, item);
                const stat = fs.statSync(itemPath);
                
                if (stat.isDirectory()) {
                    // This is a stage directory
                    const images = fs.readdirSync(itemPath)
                        .filter(file => this.isImageFile(file))
                        .sort()
                        .map(file => `projects/${projectName}/${item}/${file}`);
                    
                    if (images.length > 0) {
                        stages[item] = images;
                    }
                } else if (this.isImageFile(item)) {
                    // This is a loose image file
                    if (!stages['misc']) stages['misc'] = [];
                    stages['misc'].push(`projects/${projectName}/${item}`);
                }
            }
            
            if (Object.keys(stages).length > 0) {
                projects[projectName] = {
                    stages,
                    cover: this.findBestCoverImage(stages),
                    totalImages: Object.values(stages).flat().length
                };
            }
        }
        
        return projects;
    }

    findBestCoverImage(stages) {
        // Prefer final_complete, then finishing, then detailed_work, etc.
        const stageOrder = ['final_complete', 'finishing', 'detailed_work', 'rough_carving', 'raw_log', 'misc'];
        
        for (const stage of stageOrder) {
            if (stages[stage] && stages[stage].length > 0) {
                return stages[stage][0]; // First image in the stage
            }
        }
        
        // Fallback to first available image
        const allImages = Object.values(stages).flat();
        return allImages.length > 0 ? allImages[0] : null;
    }

    generateMediaOrganizedContent(projects) {
        return `// Auto-generated media organization file
// Generated on: ${new Date().toISOString()}
// Total projects: ${Object.keys(projects).length}

export interface MediaStage {
  images: string[];
}

export interface MediaProject {
  cover: string;
  stages: Record<string, string[]>;
  totalImages: number;
}

export const mediaProjects: Record<string, MediaProject> = ${JSON.stringify(projects, null, 2)};

export const getProjectImages = (projectName: string): string[] => {
  const project = mediaProjects[projectName];
  if (!project) return [];
  
  return Object.values(project.stages).flat();
};

export const getProjectStages = (projectName: string): Record<string, string[]> => {
  const project = mediaProjects[projectName];
  return project?.stages || {};
};

export const getAllProjects = (): string[] => {
  return Object.keys(mediaProjects);
};

export const getProjectCover = (projectName: string): string | null => {
  const project = mediaProjects[projectName];
  return project?.cover || null;
};

export const getProjectImageCount = (projectName: string): number => {
  const project = mediaProjects[projectName];
  return project?.totalImages || 0;
};

// Nature and workshop media (separate from projects)
export const natureMeida = {
  // Scan nature directory separately if needed
};

export const workshopMedia = {
  // Scan workshop directory separately if needed
};
`;
    }

    isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'];
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    // Generate summary report
    generateReport() {
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        const reportFile = path.join(__dirname, '..', `classification-processing-report-${timestamp}.json`);
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results,
            details: {
                processingComplete: true,
                backupLocation: this.backupDir,
                mediaOrganizedUpdated: true
            }
        };
        
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
        
        console.log('\n=== CLASSIFICATION PROCESSING COMPLETE ===');
        console.log(`📊 Total images processed: ${this.results.totalProcessed}`);
        console.log(`📁 New projects created: ${this.results.newProjectsCreated}`);
        console.log(`📁 Images moved: ${this.results.imagesMoved}`);
        console.log(`❌ Errors: ${this.results.errors.length}`);
        console.log(`📄 Report saved: ${reportFile}`);
        
        if (this.results.errors.length > 0) {
            console.log('\n⚠️ Errors encountered:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        return report;
    }
}

// Command line usage
if (require.main === module) {
    const classificationsFile = process.argv[2];
    
    if (!classificationsFile) {
        console.error('❌ Usage: node classification-processor.js <classifications-file.json>');
        console.error('Example: node classification-processor.js all_animal_classifications_2025-01-12T10-30-00.json');
        process.exit(1);
    }
    
    const processor = new ClassificationProcessor();
    
    processor.processClassifications(classificationsFile)
        .then(() => {
            processor.generateReport();
            console.log('\n✅ Classification processing complete!');
            console.log('🌐 Your images are now organized by animal type and process stage.');
            console.log('📝 The media-organized.ts file has been updated.');
        })
        .catch(error => {
            console.error('❌ Processing failed:', error);
            process.exit(1);
        });
}

module.exports = ClassificationProcessor;
