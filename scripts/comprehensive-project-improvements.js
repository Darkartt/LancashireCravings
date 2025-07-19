const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Project Improvements Script
 * Implements all 4 requested improvements:
 * 1. Better cover image selection
 * 2. Process stage refinement (raw, rough, detailed, finishing, final)
 * 3. Nature collection split into individual projects
 * 4. Proper sequence ordering within projects/stages
 */

class ProjectImprover {
    constructor() {
        this.baseDir = process.cwd();
        this.mediaDir = path.join(this.baseDir, 'public', 'media');
        this.natureDir = path.join(this.mediaDir, 'nature');
        this.projectsDir = path.join(this.mediaDir, 'projects');
        
        // Process stage keywords and priorities
        this.stageKeywords = {
            raw: ['raw', 'start', 'begin', 'initial', 'block', 'log', 'wood', 'blank'],
            rough: ['rough', 'outline', 'shape', 'basic', 'sketch', 'layout'],
            detailed: ['detail', 'carve', 'carving', 'work', 'progress', 'develop'],
            finishing: ['finish', 'sand', 'smooth', 'refine', 'clean', 'polish'],
            final: ['final', 'done', 'complete', 'finish', 'result', 'end']
        };
        
        // Stage priority (higher = later stage)
        this.stagePriority = {
            raw: 1,
            rough: 2,
            detailed: 3,
            finishing: 4,
            final: 5
        };
    }

    async run() {
        console.log('🚀 Starting comprehensive project improvements...');
        
        // Load existing data
        const enhancedResults = await this.loadEnhancedResults();
        const natureAnalysis = await this.loadNatureAnalysis();
        
        console.log('📊 Loaded analysis data');
        
        // 1. Split nature collection into individual projects
        const natureProjects = await this.splitNatureCollection(natureAnalysis);
        console.log(`🌿 Created ${natureProjects.length} nature projects`);
        
        // 2. Analyze all projects (existing + new nature projects)
        const allProjects = await this.analyzeAllProjects(enhancedResults, natureProjects);
        console.log(`🔍 Analyzed ${allProjects.length} total projects`);
        
        // 3. Implement improvements for each project
        const improvedProjects = await this.improveAllProjects(allProjects);
        console.log(`✨ Improved ${improvedProjects.length} projects`);
        
        // 4. Generate final media file
        await this.generateFinalMediaFile(improvedProjects);
        console.log('📄 Generated final media-organized.ts file');
        
        // 5. Generate improvement report
        await this.generateImprovementReport(improvedProjects);
        console.log('📋 Generated improvement report');
        
        console.log('🎉 All improvements completed successfully!');
    }

    async loadEnhancedResults() {
        const files = fs.readdirSync('.').filter(f => f.startsWith('enhanced-analysis-results-'));
        if (files.length === 0) {
            throw new Error('No enhanced analysis results found');
        }
        
        const latestFile = files.sort().reverse()[0];
        console.log(`📂 Loading ${latestFile}`);
        return JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    }

    async loadNatureAnalysis() {
        const analysisFile = 'nature-categorization-log.json';
        if (!fs.existsSync(analysisFile)) {
            throw new Error('Nature analysis not found. Run analyze-nature-collection.js first.');
        }
        
        console.log(`📂 Loading ${analysisFile}`);
        return JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
    }

    async splitNatureCollection(natureAnalysis) {
        console.log('🌿 Splitting nature collection into individual projects...');
        
        const natureProjects = [];
        
        for (const [category, data] of Object.entries(natureAnalysis.categories)) {
            for (const [subcategory, files] of Object.entries(data.subcategories)) {
                // Each subcategory becomes its own project
                const projectName = this.formatProjectName(subcategory);
                
                const project = {
                    id: `nature-${subcategory.toLowerCase().replace(/\s+/g, '-')}`,
                    name: projectName,
                    type: 'nature',
                    category: category.toLowerCase().replace(/\s+/g, '_'),
                    subcategory: subcategory,
                    files: files,
                    originalPath: path.join(this.natureDir),
                    description: `${projectName} woodcarving project from nature collection`,
                    tags: ['nature', category.toLowerCase(), subcategory.toLowerCase()]
                };
                
                natureProjects.push(project);
            }
        }
        
        return natureProjects;
    }

    formatProjectName(subcategory) {
        return subcategory
            .split(/[-_\s]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async analyzeAllProjects(enhancedResults, natureProjects) {
        console.log('🔍 Analyzing all projects...');
        
        const allProjects = [];
        
        // Add existing projects from enhanced results
        const existingProjects = this.extractExistingProjects(enhancedResults);
        allProjects.push(...existingProjects);
        
        // Add new nature projects
        allProjects.push(...natureProjects);
        
        return allProjects;
    }

    extractExistingProjects(enhancedResults) {
        const projects = [];
        const projectGroups = {};
        
        // Group files by project
        for (const file of enhancedResults.files) {
            if (file.analysis.category === 'project' && file.analysis.project) {
                const projectKey = file.analysis.project.toLowerCase();
                
                if (!projectGroups[projectKey]) {
                    projectGroups[projectKey] = {
                        id: projectKey,
                        name: this.formatProjectName(file.analysis.project),
                        type: 'project',
                        files: [],
                        originalPath: path.dirname(file.path)
                    };
                }
                
                projectGroups[projectKey].files.push(file);
            }
        }
        
        return Object.values(projectGroups);
    }

    async improveAllProjects(allProjects) {
        console.log('✨ Implementing improvements for all projects...');
        
        const improvedProjects = [];
        
        for (const project of allProjects) {
            console.log(`   Processing: ${project.name}`);
            
            const improved = await this.improveProject(project);
            improvedProjects.push(improved);
        }
        
        return improvedProjects;
    }

    async improveProject(project) {
        // 1. Analyze and categorize files by process stage
        const stageAnalysis = this.analyzeProcessStages(project.files);
        
        // 2. Select best cover image
        const coverImage = this.selectBestCoverImage(project.files, stageAnalysis);
        
        // 3. Organize files by stage with proper sequencing
        const organizedStages = this.organizeFilesByStage(project.files, stageAnalysis);
        
        // 4. Calculate project statistics
        const stats = this.calculateProjectStats(project.files, organizedStages);
        
        return {
            ...project,
            coverImage,
            stages: organizedStages,
            stats,
            improved: true,
            improvementDate: new Date().toISOString()
        };
    }

    analyzeProcessStages(files) {
        console.log(`     Analyzing process stages for ${files.length} files...`);
        
        const stageAnalysis = {};
        
        for (const file of files) {
            const stage = this.detectProcessStage(file);
            stageAnalysis[file.path || file.relativePath] = {
                stage,
                confidence: this.calculateStageConfidence(file, stage),
                sequence: this.calculateSequenceOrder(file)
            };
        }
        
        return stageAnalysis;
    }

    detectProcessStage(file) {
        const filePath = (file.path || file.relativePath || '').toLowerCase();
        const fileName = path.basename(filePath).toLowerCase();
        
        // Check filename and path for stage keywords
        let bestStage = 'detailed'; // default
        let bestScore = 0;
        
        for (const [stage, keywords] of Object.entries(this.stageKeywords)) {
            let score = 0;
            
            for (const keyword of keywords) {
                if (fileName.includes(keyword) || filePath.includes(keyword)) {
                    score += 1;
                    
                    // Bonus for exact keyword match
                    if (fileName.includes(`_${keyword}_`) || fileName.includes(`-${keyword}-`)) {
                        score += 0.5;
                    }
                }
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestStage = stage;
            }
        }
        
        return bestStage;
    }

    calculateStageConfidence(file, stage) {
        const filePath = (file.path || file.relativePath || '').toLowerCase();
        const keywords = this.stageKeywords[stage] || [];
        
        let matches = 0;
        for (const keyword of keywords) {
            if (filePath.includes(keyword)) {
                matches++;
            }
        }
        
        return Math.min(matches / keywords.length, 1.0);
    }

    calculateSequenceOrder(file) {
        const fileName = path.basename(file.path || file.relativePath || '');
        
        // Look for numbers in filename
        const numberMatch = fileName.match(/(\d+)/);
        if (numberMatch) {
            return parseInt(numberMatch[1]);
        }
        
        // Use file timestamp or modification time as fallback
        if (file.stats && file.stats.mtime) {
            return new Date(file.stats.mtime).getTime();
        }
        
        return 0;
    }

    selectBestCoverImage(files, stageAnalysis) {
        console.log(`     Selecting best cover image from ${files.length} files...`);
        
        const imageFiles = files.filter(f => this.isImageFile(f));
        
        if (imageFiles.length === 0) {
            return null;
        }
        
        // Score each image for cover potential
        let bestImage = null;
        let bestScore = 0;
        
        for (const file of imageFiles) {
            const score = this.calculateCoverScore(file, stageAnalysis);
            
            if (score > bestScore) {
                bestScore = score;
                bestImage = file;
            }
        }
        
        return bestImage ? this.getRelativeImagePath(bestImage) : null;
    }

    calculateCoverScore(file, stageAnalysis) {
        let score = 0;
        const filePath = file.path || file.relativePath || '';
        const fileName = path.basename(filePath).toLowerCase();
        const analysis = stageAnalysis[filePath] || {};
        
        // Prefer final stage images
        if (analysis.stage === 'final') score += 10;
        else if (analysis.stage === 'finishing') score += 8;
        else if (analysis.stage === 'detailed') score += 5;
        
        // Prefer images with "final", "complete", "done" in name
        if (fileName.includes('final')) score += 8;
        if (fileName.includes('complete')) score += 8;
        if (fileName.includes('done')) score += 6;
        if (fileName.includes('result')) score += 6;
        
        // Avoid work-in-progress indicators
        if (fileName.includes('wip')) score -= 3;
        if (fileName.includes('progress')) score -= 2;
        if (fileName.includes('start')) score -= 4;
        
        // Prefer higher resolution (rough estimate from file size)
        if (file.stats && file.stats.size) {
            if (file.stats.size > 1000000) score += 2; // > 1MB
            if (file.stats.size > 2000000) score += 1; // > 2MB
        }
        
        return score;
    }

    organizeFilesByStage(files, stageAnalysis) {
        console.log(`     Organizing files by stage...`);
        
        const stages = {
            raw: [],
            rough: [],
            detailed: [],
            finishing: [],
            final: []
        };
        
        for (const file of files) {
            const analysis = stageAnalysis[file.path || file.relativePath] || {};
            const stage = analysis.stage || 'detailed';
            
            if (stages[stage]) {
                stages[stage].push({
                    ...file,
                    stageAnalysis: analysis,
                    relativePath: this.getRelativeImagePath(file)
                });
            }
        }
        
        // Sort files within each stage by sequence
        for (const stage of Object.keys(stages)) {
            stages[stage].sort((a, b) => {
                const seqA = a.stageAnalysis?.sequence || 0;
                const seqB = b.stageAnalysis?.sequence || 0;
                return seqA - seqB;
            });
        }
        
        return stages;
    }

    calculateProjectStats(files, stages) {
        const imageFiles = files.filter(f => this.isImageFile(f));
        const videoFiles = files.filter(f => this.isVideoFile(f));
        
        const stageStats = {};
        for (const [stage, stageFiles] of Object.entries(stages)) {
            stageStats[stage] = {
                total: stageFiles.length,
                images: stageFiles.filter(f => this.isImageFile(f)).length,
                videos: stageFiles.filter(f => this.isVideoFile(f)).length
            };
        }
        
        return {
            totalFiles: files.length,
            images: imageFiles.length,
            videos: videoFiles.length,
            stages: stageStats,
            completionLevel: this.calculateCompletionLevel(stages)
        };
    }

    calculateCompletionLevel(stages) {
        const stageWeights = { raw: 1, rough: 2, detailed: 3, finishing: 4, final: 5 };
        let totalWeight = 0;
        let maxWeight = 0;
        
        for (const [stage, files] of Object.entries(stages)) {
            if (files.length > 0) {
                const weight = stageWeights[stage] || 1;
                totalWeight += weight;
                maxWeight = Math.max(maxWeight, weight);
            }
        }
        
        return Math.round((maxWeight / 5) * 100); // Percentage based on highest stage reached
    }

    isImageFile(file) {
        const ext = path.extname(file.path || file.relativePath || '').toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
    }

    isVideoFile(file) {
        const ext = path.extname(file.path || file.relativePath || '').toLowerCase();
        return ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].includes(ext);
    }

    getRelativeImagePath(file) {
        const fullPath = file.path || file.relativePath || '';
        
        // Convert to relative path from public/media
        if (fullPath.includes('public/media/')) {
            return fullPath.substring(fullPath.indexOf('public/media/') + 'public/media/'.length);
        }
        
        return fullPath;
    }

    async generateFinalMediaFile(improvedProjects) {
        console.log('📄 Generating final media-organized.ts file...');
        
        const mediaData = {
            projects: improvedProjects.filter(p => p.type === 'project'),
            nature: improvedProjects.filter(p => p.type === 'nature'),
            stats: this.calculateOverallStats(improvedProjects),
            lastUpdated: new Date().toISOString(),
            version: '2.0.0',
            improvements: [
                'Enhanced cover image selection',
                'Process stage refinement (raw, rough, detailed, finishing, final)',
                'Nature collection split into individual projects',
                'Proper sequence ordering within stages'
            ]
        };
        
        const tsContent = `// Auto-generated media organization file
// Generated: ${new Date().toISOString()}
// Version: 2.0.0 - Comprehensive Improvements

export interface MediaFile {
  path: string;
  relativePath: string;
  stage?: string;
  sequence?: number;
  confidence?: number;
}

export interface ProjectStage {
  total: number;
  images: number;
  videos: number;
}

export interface ProjectStats {
  totalFiles: number;
  images: number;
  videos: number;
  stages: Record<string, ProjectStage>;
  completionLevel: number;
}

export interface Project {
  id: string;
  name: string;
  type: 'project' | 'nature';
  category?: string;
  subcategory?: string;
  description?: string;
  tags?: string[];
  coverImage?: string;
  stages: {
    raw: MediaFile[];
    rough: MediaFile[];
    detailed: MediaFile[];
    finishing: MediaFile[];
    final: MediaFile[];
  };
  stats: ProjectStats;
  improved: boolean;
  improvementDate: string;
}

export const mediaData = ${JSON.stringify(mediaData, null, 2)};

export default mediaData;
`;
        
        fs.writeFileSync('src/data/media-organized.ts', tsContent);
        console.log('✅ Generated src/data/media-organized.ts');
    }

    calculateOverallStats(projects) {
        let totalFiles = 0;
        let totalImages = 0;
        let totalVideos = 0;
        
        const categoryStats = {};
        const stageDistribution = { raw: 0, rough: 0, detailed: 0, finishing: 0, final: 0 };
        
        for (const project of projects) {
            totalFiles += project.stats.totalFiles;
            totalImages += project.stats.images;
            totalVideos += project.stats.videos;
            
            // Category stats
            const category = project.category || project.type;
            if (!categoryStats[category]) {
                categoryStats[category] = { projects: 0, files: 0 };
            }
            categoryStats[category].projects++;
            categoryStats[category].files += project.stats.totalFiles;
            
            // Stage distribution
            for (const [stage, stageData] of Object.entries(project.stats.stages)) {
                stageDistribution[stage] += stageData.total;
            }
        }
        
        return {
            totalProjects: projects.length,
            projectTypes: {
                regular: projects.filter(p => p.type === 'project').length,
                nature: projects.filter(p => p.type === 'nature').length
            },
            totalFiles,
            totalImages,
            totalVideos,
            categoryStats,
            stageDistribution,
            averageCompletionLevel: Math.round(
                projects.reduce((sum, p) => sum + p.stats.completionLevel, 0) / projects.length
            )
        };
    }

    async generateImprovementReport(improvedProjects) {
        console.log('📋 Generating improvement report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalProjects: improvedProjects.length,
                regularProjects: improvedProjects.filter(p => p.type === 'project').length,
                natureProjects: improvedProjects.filter(p => p.type === 'nature').length,
                improvementsApplied: [
                    'Enhanced cover image selection',
                    'Process stage refinement (raw, rough, detailed, finishing, final)',
                    'Nature collection split into individual projects',
                    'Proper sequence ordering within stages'
                ]
            },
            projects: improvedProjects.map(p => ({
                id: p.id,
                name: p.name,
                type: p.type,
                coverImage: p.coverImage,
                stats: p.stats,
                stageBreakdown: Object.entries(p.stages).map(([stage, files]) => ({
                    stage,
                    fileCount: files.length
                }))
            })),
            overallStats: this.calculateOverallStats(improvedProjects)
        };
        
        // Save JSON report
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = `comprehensive-improvements-${timestamp}.json`;
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        
        // Generate markdown summary
        const markdownReport = this.generateMarkdownReport(report);
        fs.writeFileSync('COMPREHENSIVE_IMPROVEMENTS_REPORT.md', markdownReport);
        
        console.log(`✅ Generated reports: ${reportFile} and COMPREHENSIVE_IMPROVEMENTS_REPORT.md`);
    }

    generateMarkdownReport(report) {
        const projects = report.projects;
        const stats = report.overallStats;
        
        return `# Comprehensive Project Improvements Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}

## Summary

🎯 **Total Projects:** ${report.summary.totalProjects}
- Regular Projects: ${report.summary.regularProjects}
- Nature Projects: ${report.summary.natureProjects}

## Improvements Applied

${report.summary.improvementsApplied.map(imp => `✅ ${imp}`).join('\n')}

## Overall Statistics

📊 **Media Files:**
- Total Files: ${stats.totalFiles.toLocaleString()}
- Images: ${stats.totalImages.toLocaleString()}
- Videos: ${stats.totalVideos.toLocaleString()}

📈 **Stage Distribution:**
${Object.entries(stats.stageDistribution).map(([stage, count]) => 
  `- ${stage.charAt(0).toUpperCase() + stage.slice(1)}: ${count} files`
).join('\n')}

🎯 **Average Completion Level:** ${stats.averageCompletionLevel}%

## Project Breakdown

### Regular Projects (${report.summary.regularProjects})

${projects.filter(p => p.type === 'project').map(p => `
**${p.name}**
- Files: ${p.stats.totalFiles} (${p.stats.images} images, ${p.stats.videos} videos)
- Completion: ${p.stats.completionLevel}%
- Cover: ${p.coverImage || 'None selected'}
- Stages: ${p.stageBreakdown.filter(s => s.fileCount > 0).map(s => `${s.stage}(${s.fileCount})`).join(', ')}
`).join('\n')}

### Nature Projects (${report.summary.natureProjects})

${projects.filter(p => p.type === 'nature').map(p => `
**${p.name}**
- Category: ${p.category || 'General'}
- Files: ${p.stats.totalFiles} (${p.stats.images} images, ${p.stats.videos} videos)
- Completion: ${p.stats.completionLevel}%
- Cover: ${p.coverImage || 'None selected'}
- Stages: ${p.stageBreakdown.filter(s => s.fileCount > 0).map(s => `${s.stage}(${s.fileCount})`).join(', ')}
`).join('\n')}

## Next Steps

1. ✅ Review the generated \`src/data/media-organized.ts\` file
2. ✅ Test the updated website with new project organization
3. ✅ Verify cover images are displaying correctly
4. ✅ Check that process stages are properly categorized
5. ✅ Confirm nature objects are now separate projects

---
*Report generated by comprehensive-project-improvements.js*
`;
    }
}

// Run the improvements
if (require.main === module) {
    const improver = new ProjectImprover();
    improver.run().catch(console.error);
}

module.exports = ProjectImprover;
