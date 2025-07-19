const fs = require('fs');
const path = require('path');

class ProcessOrderUpdater {
    constructor() {
        this.enhancedResultsPath = this.getLatestAnalysisFile();
        this.mediaOrganizedPath = path.join(__dirname, '..', 'src', 'lib', 'media-organized.ts');
        
        if (!this.enhancedResultsPath) {
            throw new Error('No enhanced analysis results file found');
        }
        
        console.log(`Using analysis file: ${this.enhancedResultsPath}`);
    }

    getLatestAnalysisFile() {
        const files = fs.readdirSync('.')
            .filter(file => file.match(/^enhanced-analysis-results-.*\.json$/))
            .sort()
            .reverse();
        
        return files.length > 0 ? files[0] : null;
    }

    async updateProcessOrder() {
        console.log('Loading enhanced analysis results...');
        const analysisData = JSON.parse(fs.readFileSync(this.enhancedResultsPath, 'utf8'));
        
        console.log('Loading current media-organized.ts...');
        const mediaContent = fs.readFileSync(this.mediaOrganizedPath, 'utf8');
        
        // Extract project media items from the content
        const projectRegex = /export const ([a-zA-Z_][a-zA-Z0-9_]*Items): MediaItem\[\] = (\[[\s\S]*?\n\]);/g;
        let match;
        const updates = new Map();
        
        while ((match = projectRegex.exec(mediaContent)) !== null) {
            const projectVarName = match[1];
            const projectItemsJson = match[2];
            
            try {
                // Parse the project items
                const projectItems = eval(projectItemsJson);
                
                // Update order based on analysis
                const updatedItems = this.updateItemsOrder(projectItems, analysisData);
                
                // Store update
                updates.set(projectVarName, updatedItems);
                
                console.log(`Updated ${updatedItems.length} items for ${projectVarName}`);
            } catch (error) {
                console.warn(`Could not parse items for ${projectVarName}:`, error.message);
            }
        }
        
        // Apply updates to content
        let updatedContent = mediaContent;
        
        for (const [projectVarName, updatedItems] of updates.entries()) {
            const updatedJson = JSON.stringify(updatedItems, null, 2);
            const regex = new RegExp(
                `(export const ${projectVarName}: MediaItem\\[\\] = )\\[[\\s\\S]*?\\n\\];`,
                'g'
            );
            
            updatedContent = updatedContent.replace(regex, `$1${updatedJson};`);
        }
        
        // Write updated content
        const backupPath = this.mediaOrganizedPath + '.backup.' + Date.now();
        fs.writeFileSync(backupPath, mediaContent);
        fs.writeFileSync(this.mediaOrganizedPath, updatedContent);
        
        console.log(`Media-organized.ts updated successfully`);
        console.log(`Backup saved to: ${backupPath}`);
        
        return updates;
    }

    updateItemsOrder(items, analysisData) {
        // Create a lookup map from analysis data
        const pathToAnalysis = new Map();
        
        for (const result of analysisData) {
            const normalizedPath = result.relativePath.replace(/\\/g, '/');
            pathToAnalysis.set(normalizedPath, result);
        }
        
        // Update each item
        return items.map(item => {
            // Try to find matching analysis result
            const itemPath = item.src.replace(/^\/media\//, '');
            const analysis = pathToAnalysis.get(itemPath);
            
            if (analysis && analysis.analysis) {
                const analysisResult = analysis.analysis;
                let newOrder = item.order; // Keep existing if we can't determine new one
                
                // Use suggested order from analysis if available
                if (analysisResult.suggestedOrder !== undefined) {
                    newOrder = analysisResult.suggestedOrder;
                } else {
                    // Fallback: calculate order from stage and sequence
                    newOrder = this.calculateOrderFromAnalysis(analysisResult);
                }
                
                return {
                    ...item,
                    order: newOrder
                };
            }
            
            return item;
        });
    }

    calculateOrderFromAnalysis(analysis) {
        const stageOrder = {
            'raw_log': 1,
            'rough_carving': 3,
            'detailed_work': 5,
            'finishing': 8,
            'final_complete': 10
        };
        
        let baseOrder = 5; // Default
        
        if (analysis.detectedStage && stageOrder[analysis.detectedStage]) {
            baseOrder = stageOrder[analysis.detectedStage];
        }
        
        // Add sequence number if available
        if (analysis.sequenceNumber && analysis.sequenceNumber > 0) {
            // For process stages, spread sequence numbers within stage range
            if (['raw_log', 'rough_carving', 'detailed_work'].includes(analysis.detectedStage)) {
                // Keep within process range (1-7)
                const normalizedSeq = Math.min(analysis.sequenceNumber / 10, 1.5); // Scale down large sequence numbers
                return Math.max(1, Math.min(7, Math.round(baseOrder + normalizedSeq)));
            }
            // For final stages, start from 8
            else if (['finishing', 'final_complete'].includes(analysis.detectedStage)) {
                const normalizedSeq = Math.min(analysis.sequenceNumber / 10, 1.5);
                return Math.max(8, Math.min(10, Math.round(baseOrder + normalizedSeq)));
            }
        }
        
        return baseOrder;
    }
}

// Run the updater
async function main() {
    try {
        const updater = new ProcessOrderUpdater();
        await updater.updateProcessOrder();
        console.log('Process order update completed successfully!');
    } catch (error) {
        console.error('Error updating process order:', error);
        process.exit(1);
    }
}

main();
