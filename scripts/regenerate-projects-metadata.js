const fs = require('fs').promises;
const path = require('path');

async function regenerateProjectsWithCorrectMetadata() {
    try {
        console.log('🔄 Regenerating projects with correct metadata...');
        
        // Read the integration log to get actual media data
        const logPath = path.join(__dirname, '..', 'media-integration-log.json');
        const logData = JSON.parse(await fs.readFile(logPath, 'utf8'));
        
        // Define the correct project structure with proper metadata
        const projects = [
            {
                id: "richard-peacock-bass",
                title: "Richard Peacock Bass",
                slug: "richard-peacock-bass",
                description: "Commissioned bass carving featuring intricate scales and lifelike proportions.",
                category: "commissioned",
                client: "Richard Peacock",
                difficulty: "expert",
                completionTime: "8-10 weeks",
                materials: ["Premium Hardwood", "Detailed Scale Work", "Custom Finish"],
                tags: ["commissioned", "bass", "fish", "scales", "aquatic"],
                coverImage: logData.projects.bass?.images?.final?.[0]?.src || logData.projects.bass?.images?.process?.[0]?.src || "",
                coverVideo: "/media/projects/bass/videos/bass_bass_001.mov",
                mediaFolder: "/media/projects/bass",
                mediaCount: {
                    images: (logData.projects.bass?.images?.process?.length || 0) + (logData.projects.bass?.images?.final?.length || 0),
                    videos: logData.projects.bass?.videos?.length || 0
                },
                featured: true
            },
            {
                id: "golden-eagle",
                title: "Golden Eagle Masterpiece",
                slug: "golden-eagle", 
                description: "Majestic golden eagle carved with incredible detail, showcasing the power and grace of this magnificent bird of prey.",
                category: "wildlife",
                difficulty: "expert",
                completionTime: "6-8 weeks",
                materials: ["Premium Hardwood", "Natural Wood Stain", "Protective Finish"],
                tags: ["wildlife", "eagle", "detailed", "masterpiece"],
                coverImage: logData.projects.eagle?.images?.final?.[0]?.src || logData.projects.eagle?.images?.process?.[0]?.src || "",
                coverVideo: "/media/projects/eagle/videos/eagle_eagle_001.mov",
                mediaFolder: "/media/projects/eagle",
                mediaCount: {
                    images: (logData.projects.eagle?.images?.process?.length || 0) + (logData.projects.eagle?.images?.final?.length || 0),
                    videos: logData.projects.eagle?.videos?.length || 0
                },
                featured: true
            },
            {
                id: "loch-ness-monster",
                title: "Nessie - Loch Ness Monster",
                slug: "loch-ness-monster",
                description: "Bringing the legendary creature of Scottish folklore to life through masterful woodcarving techniques.",
                category: "mythical",
                difficulty: "expert",
                completionTime: "4-6 weeks",
                materials: ["Hardwood", "Natural Finish"],
                tags: ["mythical", "nessie", "scottish", "legend"],
                coverImage: logData.projects.nessie?.images?.final?.[0]?.src || logData.projects.nessie?.images?.process?.[0]?.src || "",
                coverVideo: "/media/projects/nessie/videos/nessie_nessie_001.mov",
                mediaFolder: "/media/projects/nessie",
                mediaCount: {
                    images: (logData.projects.nessie?.images?.process?.length || 0) + (logData.projects.nessie?.images?.final?.length || 0),
                    videos: logData.projects.nessie?.videos?.length || 0
                },
                featured: true
            },
            {
                id: "st-collen-statue",
                title: "St. Collen Statue",
                slug: "st-collen-statue",
                description: "Sacred religious statue carved with reverence and attention to spiritual detail.",
                category: "religious",
                client: "Religious Commission",
                difficulty: "expert",
                completionTime: "12-16 weeks",
                materials: ["Sacred Wood", "Traditional Techniques"],
                tags: ["religious", "statue", "spiritual", "traditional"],
                coverImage: logData.projects.stcollen?.images?.final?.[0]?.src || logData.projects.stcollen?.images?.process?.[0]?.src || "",
                coverVideo: "/media/projects/stcollen/videos/stcollen_stcollen_001.mov",
                mediaFolder: "/media/projects/stcollen",
                mediaCount: {
                    images: (logData.projects.stcollen?.images?.process?.length || 0) + (logData.projects.stcollen?.images?.final?.length || 0),
                    videos: logData.projects.stcollen?.videos?.length || 0
                },
                featured: true
            }
        ];
        
        console.log('📊 Project metadata:');
        projects.forEach(project => {
            console.log(`  • ${project.title}: ${project.mediaCount.images} images, ${project.mediaCount.videos} videos`);
            console.log(`    Cover: ${project.coverImage || 'No cover image'}`);
        });
        
        // Read the current file and replace just the projects section
        const mediaFilePath = path.join(__dirname, '..', 'src', 'lib', 'media-organized.ts');
        let content = await fs.readFile(mediaFilePath, 'utf8');
        
        // Find the projects array and replace it
        const projectsStartPattern = /export const projects: Project\[\] = \[/;
        const projectsEndPattern = /\];\s*\/\/ NATURE COLLECTION/;
        
        const startMatch = content.search(projectsStartPattern);
        const endMatch = content.search(projectsEndPattern);
        
        if (startMatch !== -1 && endMatch !== -1) {
            const before = content.substring(0, startMatch);
            const after = content.substring(endMatch);
            
            const newProjectsSection = `export const projects: Project[] = ${JSON.stringify(projects, null, 2)};

// NATURE COLLECTION`;
            
            const newContent = before + newProjectsSection + after.substring(after.indexOf('\n'));
            
            await fs.writeFile(mediaFilePath, newContent, 'utf8');
            console.log('✅ Projects section updated successfully!');
        } else {
            console.error('❌ Could not find projects section boundaries');
            return;
        }
        
        console.log('🎉 Project metadata regeneration complete!');
        
    } catch (error) {
        console.error('❌ Error regenerating project metadata:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    regenerateProjectsWithCorrectMetadata()
        .then(() => {
            console.log('\n✨ All done! Projects now have correct metadata and cover images.');
        })
        .catch(error => {
            console.error('💥 Failed to regenerate project metadata:', error);
            process.exit(1);
        });
}

module.exports = regenerateProjectsWithCorrectMetadata;
