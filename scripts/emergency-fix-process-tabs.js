const fs = require('fs').promises;
const path = require('path');

/**
 * Emergency fix for empty process tabs
 * Temporarily moves first 50% of images to process folder and rest to final folder
 * This gives immediate functionality while we work on proper content-based organization
 */

async function emergencyProcessTabFix() {
  console.log('🚑 EMERGENCY FIX: Populating process/final tabs...\n');

  const projects = ['stcollen', 'eagle', 'bass', 'nessie'];
  
  for (const project of projects) {
    console.log(`📁 Processing ${project} project...`);
    
    const mainImagesPath = `public/media/projects/${project}/images`;
    const processPath = `public/media/projects/${project}/images/process`;
    const finalPath = `public/media/projects/${project}/images/final`;
    
    try {
      // Ensure process and final folders exist
      await fs.mkdir(processPath, { recursive: true });
      await fs.mkdir(finalPath, { recursive: true });
      
      // Get all image files from main folder (not subfolders)
      const allItems = await fs.readdir(mainImagesPath, { withFileTypes: true });
      const imageFiles = allItems
        .filter(item => item.isFile())
        .filter(item => {
          const ext = path.extname(item.name).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
        })
        .map(item => item.name)
        .sort(); // Sort to get consistent ordering
      
      console.log(`   Found ${imageFiles.length} images in main folder`);
      
      if (imageFiles.length === 0) {
        console.log(`   ⚠️  No images found in main folder`);
        continue;
      }
      
      // Split files: first 70% to process, last 30% to final
      const splitPoint = Math.floor(imageFiles.length * 0.7);
      const processFiles = imageFiles.slice(0, splitPoint);
      const finalFiles = imageFiles.slice(splitPoint);
      
      console.log(`   📊 Moving ${processFiles.length} to process, ${finalFiles.length} to final`);
      
      // Move process files
      for (const fileName of processFiles) {
        const sourcePath = path.join(mainImagesPath, fileName);
        const targetPath = path.join(processPath, fileName);
        
        try {
          await fs.rename(sourcePath, targetPath);
        } catch (error) {
          console.log(`   ⚠️  Error moving ${fileName}: ${error.message}`);
        }
      }
      
      // Move final files
      for (const fileName of finalFiles) {
        const sourcePath = path.join(mainImagesPath, fileName);
        const targetPath = path.join(finalPath, fileName);
        
        try {
          await fs.rename(sourcePath, targetPath);
        } catch (error) {
          console.log(`   ⚠️  Error moving ${fileName}: ${error.message}`);
        }
      }
      
      console.log(`   ✅ ${project} files moved to process/final folders`);
      
    } catch (error) {
      console.log(`   ❌ Error processing ${project}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 Emergency fix complete! Process and Final tabs should now show content.`);
  console.log(`\n📋 NEXT STEPS:`);
  console.log(`1. Regenerate media-organized.ts to reflect new folder structure`);
  console.log(`2. Test website to verify tabs now show content`);
  console.log(`3. Manually verify image content matches project expectations`);
  console.log(`4. Plan content-based recategorization for any misplaced images`);
}

// Run the emergency fix
emergencyProcessTabFix()
  .then(() => {
    console.log(`\n🔄 To regenerate media file, run:`);
    console.log(`node scripts/generate-updated-media-file.js`);
  })
  .catch(error => {
    console.error('❌ Emergency fix failed:', error);
  });
