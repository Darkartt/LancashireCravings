const fs = require('fs').promises;
const path = require('path');

async function fixProjectMetadataDirectly() {
    try {
        console.log('🔧 Fixing project metadata directly...');
        
        // Read the integration log to get actual media counts
        const logPath = path.join(__dirname, '..', 'media-integration-log.json');
        const logData = JSON.parse(await fs.readFile(logPath, 'utf8'));
        
        console.log('📊 Analyzing project media counts...');
        
        // Calculate correct counts and select cover images
        const projectUpdates = {};
        
        for (const [projectId, projectData] of Object.entries(logData.projects)) {
            const imageCount = (projectData.images.process?.length || 0) + (projectData.images.final?.length || 0);
            const videoCount = projectData.videos?.length || 0;
            
            // Select cover image - prefer final images, then process images
            let coverImage = '';
            if (projectData.images.final && projectData.images.final.length > 0) {
                coverImage = projectData.images.final[0].src;
            } else if (projectData.images.process && projectData.images.process.length > 0) {
                coverImage = projectData.images.process[0].src;
            }
            
            projectUpdates[projectId] = {
                imageCount,
                videoCount,
                coverImage
            };
            
            console.log(`  📁 ${projectId}: ${imageCount} images, ${videoCount} videos, cover: ${coverImage ? '✅' : '❌'}`);
        }
        
        // Read and parse the current media-organized.ts file
        const mediaFilePath = path.join(__dirname, '..', 'src', 'lib', 'media-organized.ts');
        let mediaContent = await fs.readFile(mediaFilePath, 'utf8');
        
        // Update each project individually with more specific replacements
        
        // Update Bass project
        if (projectUpdates.bass) {
            const bass = projectUpdates.bass;
            const bassPattern = /("id": "richard-peacock-bass"[\s\S]*?"coverImage": ")("")([^}]*?"mediaCount": \{\s*"images": )(\d+)(,\s*"videos": )(\d+)/;
            mediaContent = mediaContent.replace(bassPattern, `$1${bass.coverImage}$3$4${bass.imageCount}$5${bass.videoCount}`);
            console.log(`✅ Updated Bass project: ${bass.imageCount} images, ${bass.videoCount} videos`);
        }
        
        // Update Eagle project
        if (projectUpdates.eagle) {
            const eagle = projectUpdates.eagle;
            const eaglePattern = /("id": "golden-eagle"[\s\S]*?"coverImage": ")("")([^}]*?"mediaCount": \{\s*"images": )(\d+)(,\s*"videos": )(\d+)/;
            mediaContent = mediaContent.replace(eaglePattern, `$1${eagle.coverImage}$3$4${eagle.imageCount}$5${eagle.videoCount}`);
            console.log(`✅ Updated Eagle project: ${eagle.imageCount} images, ${eagle.videoCount} videos`);
        }
        
        // Update Nessie project
        if (projectUpdates.nessie) {
            const nessie = projectUpdates.nessie;
            const nessiePattern = /("id": "loch-ness-monster"[\s\S]*?"coverImage": ")("")([^}]*?"mediaCount": \{\s*"images": )(\d+)(,\s*"videos": )(\d+)/;
            mediaContent = mediaContent.replace(nessiePattern, `$1${nessie.coverImage}$3$4${nessie.imageCount}$5${nessie.videoCount}`);
            console.log(`✅ Updated Nessie project: ${nessie.imageCount} images, ${nessie.videoCount} videos`);
        }
        
        // Update St. Collen project
        if (projectUpdates.stcollen) {
            const stcollen = projectUpdates.stcollen;
            const stcollenPattern = /("id": "st-collen-statue"[\s\S]*?"coverImage": ")("")([^}]*?"mediaCount": \{\s*"images": )(\d+)(,\s*"videos": )(\d+)/;
            mediaContent = mediaContent.replace(stcollenPattern, `$1${stcollen.coverImage}$3$4${stcollen.imageCount}$5${stcollen.videoCount}`);
            console.log(`✅ Updated St. Collen project: ${stcollen.imageCount} images, ${stcollen.videoCount} videos`);
        }
        
        // Save the updated file
        await fs.writeFile(mediaFilePath, mediaContent, 'utf8');
        
        console.log('✅ Project metadata updated successfully!');
        console.log('📋 Summary of changes:');
        for (const [projectId, data] of Object.entries(projectUpdates)) {
            console.log(`  • ${projectId}: ${data.imageCount} images, ${data.videoCount} videos`);
            console.log(`    Cover: ${data.coverImage || 'None'}`);
        }
        
        // Verify changes
        console.log('\n🔍 Verifying changes...');
        const updatedContent = await fs.readFile(mediaFilePath, 'utf8');
        
        // Check if bass cover image was updated
        if (updatedContent.includes(projectUpdates.bass?.coverImage || '')) {
            console.log('✅ Bass cover image updated successfully');
        } else {
            console.log('❌ Bass cover image update failed');
        }
        
        // Check if image counts were updated
        const bassImageMatch = updatedContent.match(/"id": "richard-peacock-bass"[\s\S]*?"images": (\d+)/);
        if (bassImageMatch && parseInt(bassImageMatch[1]) > 0) {
            console.log(`✅ Bass image count updated: ${bassImageMatch[1]}`);
        } else {
            console.log('❌ Bass image count update failed');
        }
        
    } catch (error) {
        console.error('❌ Error fixing project metadata:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    fixProjectMetadataDirectly()
        .then(() => {
            console.log('\n🎉 Project metadata fix complete!');
        })
        .catch(error => {
            console.error('💥 Failed to fix project metadata:', error);
            process.exit(1);
        });
}

module.exports = fixProjectMetadataDirectly;
