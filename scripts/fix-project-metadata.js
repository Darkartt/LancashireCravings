const fs = require('fs').promises;
const path = require('path');

async function fixProjectMetadata() {
    try {
        console.log('🔧 Fixing project metadata and cover images...');
        
        // Read the current media-organized.ts file
        const mediaFilePath = path.join(__dirname, '..', 'src', 'lib', 'media-organized.ts');
        const mediaContent = await fs.readFile(mediaFilePath, 'utf8');
        
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
        
        // Update the media-organized.ts content
        let updatedContent = mediaContent;
        
        // Fix Richard Peacock Bass project
        if (projectUpdates.bass) {
            const bass = projectUpdates.bass;
            updatedContent = updatedContent.replace(
                /"coverImage": "",(\s*)"coverVideo": "\/media\/projects\/bass\/videos\/bass_bass_001\.mov",(\s*)"mediaFolder": "\/media\/projects\/bass",(\s*)"mediaCount": \{\s*"images": 0,\s*"videos": 49\s*\}/,
                `"coverImage": "${bass.coverImage}",\n    "coverVideo": "/media/projects/bass/videos/bass_bass_001.mov",\n    "mediaFolder": "/media/projects/bass",\n    "mediaCount": {\n      "images": ${bass.imageCount},\n      "videos": ${bass.videoCount}\n    }`
            );
        }
        
        // Fix Golden Eagle project
        if (projectUpdates.eagle) {
            const eagle = projectUpdates.eagle;
            updatedContent = updatedContent.replace(
                /"coverImage": "",(\s*)"coverVideo": "\/media\/projects\/eagle\/videos\/eagle_eagle_001\.mov",(\s*)"mediaFolder": "\/media\/projects\/eagle",(\s*)"mediaCount": \{\s*"images": 0,\s*"videos": 13\s*\}/,
                `"coverImage": "${eagle.coverImage}",\n    "coverVideo": "/media/projects/eagle/videos/eagle_eagle_001.mov",\n    "mediaFolder": "/media/projects/eagle",\n    "mediaCount": {\n      "images": ${eagle.imageCount},\n      "videos": ${eagle.videoCount}\n    }`
            );
        }
        
        // Fix Nessie project
        if (projectUpdates.nessie) {
            const nessie = projectUpdates.nessie;
            updatedContent = updatedContent.replace(
                /"coverImage": "",(\s*)"coverVideo": "\/media\/projects\/nessie\/videos\/nessie_nessie_001\.mov",(\s*)"mediaFolder": "\/media\/projects\/nessie",(\s*)"mediaCount": \{\s*"images": 0,\s*"videos": 14\s*\}/,
                `"coverImage": "${nessie.coverImage}",\n    "coverVideo": "/media/projects/nessie/videos/nessie_nessie_001.mov",\n    "mediaFolder": "/media/projects/nessie",\n    "mediaCount": {\n      "images": ${nessie.imageCount},\n      "videos": ${nessie.videoCount}\n    }`
            );
        }
        
        // Fix St. Collen project
        if (projectUpdates.stcollen) {
            const stcollen = projectUpdates.stcollen;
            updatedContent = updatedContent.replace(
                /"coverImage": "",(\s*)"coverVideo": "\/media\/projects\/stcollen\/videos\/stcollen_stcollen_001\.mov",(\s*)"mediaFolder": "\/media\/projects\/stcollen",(\s*)"mediaCount": \{\s*"images": 0,\s*"videos": 38\s*\}/,
                `"coverImage": "${stcollen.coverImage}",\n    "coverVideo": "/media/projects/stcollen/videos/stcollen_stcollen_001.mov",\n    "mediaFolder": "/media/projects/stcollen",\n    "mediaCount": {\n      "images": ${stcollen.imageCount},\n      "videos": ${stcollen.videoCount}\n    }`
            );
        }
        
        // Save the updated file
        await fs.writeFile(mediaFilePath, updatedContent, 'utf8');
        
        console.log('✅ Project metadata updated successfully!');
        console.log('📋 Summary of changes:');
        for (const [projectId, data] of Object.entries(projectUpdates)) {
            console.log(`  • ${projectId}: ${data.imageCount} images, ${data.videoCount} videos`);
            console.log(`    Cover: ${data.coverImage || 'None'}`);
        }
        
    } catch (error) {
        console.error('❌ Error fixing project metadata:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    fixProjectMetadata()
        .then(() => {
            console.log('\n🎉 Project metadata fix complete!');
        })
        .catch(error => {
            console.error('💥 Failed to fix project metadata:', error);
            process.exit(1);
        });
}

module.exports = fixProjectMetadata;
