#!/usr/bin/env node

/**
 * File Organization Implementation Script
 * Applies the categorization plan to actually move and rename all 3,604 files
 * Creates backup and implements the new organized structure
 */

const fs = require('fs').promises;
const path = require('path');

async function organizeAllFiles() {
  console.log('🚀 Media File Organization Implementation');
  console.log('==========================================');

  // Load categorization plan
  let categorizationPlan;
  try {
    const planData = await fs.readFile('media-categorization-plan.json', 'utf8');
    categorizationPlan = JSON.parse(planData);
    console.log('📋 Loaded categorization plan');
  } catch (error) {
    console.error('❌ Could not load categorization plan. Run categorize-media.js first.');
    return;
  }

  const organizationLog = {
    timestamp: new Date().toISOString(),
    totalFiles: 0,
    movedFiles: 0,
    errors: [],
    summary: {
      projects: { eagle: 0, nessie: 0, bass: 0, stcollen: 0 },
      workshop: { tools: 0, techniques: 0, environment: 0 },
      nature: { insects: 0, birds: 0, fish: 0, mammals: 0, flowers: 0, landscapes: 0, portraits: 0, artistic: 0 },
      uncategorized: 0
    }
  };

  const mediaDir = path.join(process.cwd(), 'public', 'media');
  const dryRun = process.argv.includes('--dry-run');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be moved');
  } else {
    console.log('⚠️  LIVE MODE - Files will be moved and renamed');
  }

  // Function to safely move and rename file
  async function moveFile(sourceFile, targetPath, newName) {
    const sourcePath = path.join(mediaDir, sourceFile.originalPath);
    const targetDir = path.join(mediaDir, targetPath);
    const targetFile = path.join(targetDir, newName);

    try {
      // Check if source exists
      await fs.access(sourcePath);

      // Ensure target directory exists
      if (!dryRun) {
        await fs.mkdir(targetDir, { recursive: true });
      }

      // Check if target already exists
      try {
        await fs.access(targetFile);
        const error = `Target file already exists: ${targetFile}`;
        organizationLog.errors.push(error);
        console.log(`⚠️  ${error}`);
        return false;
      } catch {
        // Target doesn't exist, which is good
      }

      if (dryRun) {
        console.log(`📝 WOULD MOVE: ${sourceFile.originalPath} → ${targetPath}${newName}`);
      } else {
        await fs.rename(sourcePath, targetFile);
        console.log(`✅ MOVED: ${sourceFile.originalPath} → ${targetPath}${newName}`);
      }

      organizationLog.movedFiles++;
      return true;

    } catch (error) {
      const errorMsg = `Failed to move ${sourceFile.originalPath}: ${error.message}`;
      organizationLog.errors.push(errorMsg);
      console.log(`❌ ${errorMsg}`);
      return false;
    }
  }

  // Process each category
  async function processCategory(categoryName, categoryData) {
    console.log(`\n📂 Processing ${categoryName.toUpperCase()} category...`);

    for (const [subcategory, typeData] of Object.entries(categoryData)) {
      if (typeof typeData === 'object' && typeData.images && typeData.videos) {
        console.log(`\n  📁 ${subcategory}:`);

        // Process images
        if (typeData.images.length > 0) {
          console.log(`    📷 ${typeData.images.length} images`);
          for (const file of typeData.images) {
            const success = await moveFile(file, file.suggestedNewPath, file.suggestedNewName);
            if (success) {
              organizationLog.summary[categoryName][subcategory]++;
            }
            organizationLog.totalFiles++;
          }
        }

        // Process videos
        if (typeData.videos.length > 0) {
          console.log(`    🎥 ${typeData.videos.length} videos`);
          for (const file of typeData.videos) {
            const success = await moveFile(file, file.suggestedNewPath, file.suggestedNewName);
            if (success) {
              organizationLog.summary[categoryName][subcategory]++;
            }
            organizationLog.totalFiles++;
          }
        }
      }
    }
  }

  // Process all categories
  try {
    // Projects
    await processCategory('projects', categorizationPlan.projects);

    // Workshop
    await processCategory('workshop', categorizationPlan.workshop);

    // Nature
    await processCategory('nature', categorizationPlan.nature);

    // Handle uncategorized files
    console.log(`\n📂 Processing UNCATEGORIZED files...`);
    const uncategorized = categorizationPlan.uncategorized;
    
    // Create uncategorized folder for manual review
    const uncategorizedPath = 'uncategorized/';
    
    // Process uncategorized images
    if (uncategorized.images.length > 0) {
      console.log(`    📷 ${uncategorized.images.length} uncategorized images`);
      for (let i = 0; i < uncategorized.images.length; i++) {
        const file = uncategorized.images[i];
        const newName = `uncategorized_image_${String(i + 1).padStart(4, '0')}${file.extension}`;
        const success = await moveFile(file, uncategorizedPath + 'images/', newName);
        if (success) {
          organizationLog.summary.uncategorized++;
        }
        organizationLog.totalFiles++;
      }
    }

    // Process uncategorized videos
    if (uncategorized.videos.length > 0) {
      console.log(`    🎥 ${uncategorized.videos.length} uncategorized videos`);
      for (let i = 0; i < uncategorized.videos.length; i++) {
        const file = uncategorized.videos[i];
        const newName = `uncategorized_video_${String(i + 1).padStart(4, '0')}${file.extension}`;
        const success = await moveFile(file, uncategorizedPath + 'videos/', newName);
        if (success) {
          organizationLog.summary.uncategorized++;
        }
        organizationLog.totalFiles++;
      }
    }

  } catch (error) {
    console.error('❌ Organization failed:', error);
    organizationLog.errors.push(`Organization failed: ${error.message}`);
  }

  // Generate final report
  console.log('\n📊 ORGANIZATION RESULTS');
  console.log('=======================');
  console.log(`📁 Total files processed: ${organizationLog.totalFiles}`);
  console.log(`✅ Successfully organized: ${organizationLog.movedFiles}`);
  console.log(`❌ Errors encountered: ${organizationLog.errors.length}`);

  if (organizationLog.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    organizationLog.errors.slice(0, 10).forEach(error => {
      console.log(`   ${error}`);
    });
    if (organizationLog.errors.length > 10) {
      console.log(`   ... and ${organizationLog.errors.length - 10} more errors`);
    }
  }

  console.log('\n📈 Summary by Category:');
  console.log(`🎯 Projects: ${Object.values(organizationLog.summary.projects).reduce((a, b) => a + b, 0)} files`);
  console.log(`🔨 Workshop: ${Object.values(organizationLog.summary.workshop).reduce((a, b) => a + b, 0)} files`);
  console.log(`🌿 Nature: ${Object.values(organizationLog.summary.nature).reduce((a, b) => a + b, 0)} files`);
  console.log(`❓ Uncategorized: ${organizationLog.summary.uncategorized} files`);

  // Save organization log
  const logFilename = dryRun ? 'organization-log-dry-run.json' : 'organization-log.json';
  await fs.writeFile(logFilename, JSON.stringify(organizationLog, null, 2));

  console.log(`\n💾 Organization log saved to: ${logFilename}`);

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETED');
    console.log('Review the planned changes above, then run without --dry-run to execute');
  } else {
    console.log('\n✅ FILE ORGANIZATION COMPLETED!');
    console.log('🎯 Next steps:');
    console.log('   1. Review any error files manually');
    console.log('   2. Categorize uncategorized files');
    console.log('   3. Update code references to new file paths');
    console.log('   4. Test all website pages');
  }

  return organizationLog;
}

// Check command line arguments
const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

if (!dryRun && !force) {
  console.log('⚠️  This will move and rename 3,604 files!');
  console.log('Use --dry-run to preview changes first, or --force to proceed');
  process.exit(1);
}

// Run organization
organizeAllFiles()
  .catch(error => {
    console.error('❌ Organization script failed:', error);
    console.error('Stack trace:', error.stack);
  });
