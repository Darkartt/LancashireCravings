const fs = require('fs').promises;
const path = require('path');

/**
 * Analyze image content to detect misplaced files
 * This script will help identify what's actually in the images
 */

async function analyzeImageContent() {
  console.log('🔍 Starting image content analysis...\n');
  
  const projectFolders = [
    'public/media/projects/stcollen',
    'public/media/projects/eagle', 
    'public/media/projects/bass',
    'public/media/projects/nessie'
  ];

  const analysisReport = {
    totalFiles: 0,
    potentialIssues: [],
    recommendations: []
  };

  for (const projectFolder of projectFolders) {
    console.log(`\n📁 Analyzing ${projectFolder}...`);
    
    try {
      const imageFiles = await scanForImages(projectFolder);
      console.log(`   Found ${imageFiles.length} image files`);
      
      // Sample first 10 files for manual review
      const sampleFiles = imageFiles.slice(0, 10);
      console.log(`\n   📋 SAMPLE FILES FOR MANUAL REVIEW:`);
      
      for (let i = 0; i < sampleFiles.length; i++) {
        const file = sampleFiles[i];
        const relativePath = file.replace('public/', '');
        console.log(`   ${i + 1}. ${relativePath}`);
      }
      
      analysisReport.totalFiles += imageFiles.length;
      
      // Check for potential misplacement based on project context
      const projectName = path.basename(projectFolder);
      await analyzeProjectContent(projectName, imageFiles, analysisReport);
      
    } catch (error) {
      console.log(`   ❌ Error accessing ${projectFolder}: ${error.message}`);
    }
  }
  
  // Generate recommendations
  console.log(`\n\n🎯 ANALYSIS SUMMARY:`);
  console.log(`📊 Total files analyzed: ${analysisReport.totalFiles}`);
  console.log(`⚠️  Potential issues found: ${analysisReport.potentialIssues.length}`);
  
  if (analysisReport.potentialIssues.length > 0) {
    console.log(`\n🔍 POTENTIAL MISPLACED FILES:`);
    analysisReport.potentialIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  console.log(`\n💡 RECOMMENDATIONS:`);
  analysisReport.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
  
  // Save detailed report
  const reportPath = 'image-content-analysis-report.json';
  await fs.writeFile(reportPath, JSON.stringify(analysisReport, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

async function scanForImages(folderPath) {
  const imageFiles = [];
  
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(folderPath, item.name);
      
      if (item.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await scanForImages(fullPath);
        imageFiles.push(...subFiles);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          imageFiles.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Cannot access ${folderPath}: ${error.message}`);
  }
  
  return imageFiles;
}

async function analyzeProjectContent(projectName, imageFiles, report) {
  console.log(`\n   🔍 Analyzing content for ${projectName} project...`);
  
  const suspiciousKeywords = {
    stcollen: ['fish', 'aquatic', 'water', 'sea', 'ocean', 'bass', 'trout'],
    eagle: ['fish', 'water', 'statue', 'stone'],
    bass: ['eagle', 'bird', 'statue', 'stone'],
    nessie: ['fish', 'eagle', 'bird', 'statue']
  };
  
  const expectedKeywords = {
    stcollen: ['statue', 'stone', 'carving', 'church', 'religious'],
    eagle: ['eagle', 'bird', 'carving', 'wood'],
    bass: ['bass', 'fish', 'carving', 'wood'],
    nessie: ['nessie', 'monster', 'carving', 'wood', 'dragon']
  };
  
  // Check filenames for obvious misplacement indicators
  const suspicious = suspiciousKeywords[projectName] || [];
  const expected = expectedKeywords[projectName] || [];
  
  let suspiciousCount = 0;
  let expectedCount = 0;
  
  imageFiles.forEach(file => {
    const filename = path.basename(file).toLowerCase();
    
    // Check for suspicious content
    suspicious.forEach(keyword => {
      if (filename.includes(keyword)) {
        suspiciousCount++;
        report.potentialIssues.push(
          `${projectName}: File "${file}" contains suspicious keyword "${keyword}"`
        );
      }
    });
    
    // Check for expected content
    expected.forEach(keyword => {
      if (filename.includes(keyword)) {
        expectedCount++;
      }
    });
  });
  
  console.log(`   📊 Files with suspicious keywords: ${suspiciousCount}`);
  console.log(`   ✅ Files with expected keywords: ${expectedCount}`);
  
  // Generate recommendations based on analysis
  if (suspiciousCount > 0) {
    report.recommendations.push(
      `Review ${projectName} project - found ${suspiciousCount} potentially misplaced files`
    );
  }
  
  if (imageFiles.length > 0 && expectedCount === 0) {
    report.recommendations.push(
      `${projectName} project may have incorrectly categorized content - no expected keywords found`
    );
  }
}

// Manual content verification helper
function generateManualReviewScript() {
  console.log(`\n\n🔧 MANUAL REVIEW INSTRUCTIONS:`);
  console.log(`\nTo manually verify image content, check these sample files:`);
  console.log(`1. Open each file in an image viewer`);
  console.log(`2. Identify what the image actually contains`);
  console.log(`3. Note any misplacements:`);
  console.log(`   - St Collen should show: stone statue, church carving, religious sculpture`);
  console.log(`   - Eagle should show: wooden eagle carving, bird sculpture`);
  console.log(`   - Bass should show: wooden fish carving, bass sculpture`);
  console.log(`   - Nessie should show: wooden monster/dragon carving`);
  console.log(`\n4. Files showing wrong content need to be moved to correct project folders`);
}

// Run the analysis
analyzeImageContent()
  .then(() => {
    generateManualReviewScript();
    console.log(`\n✅ Image content analysis complete!`);
  })
  .catch(error => {
    console.error('❌ Error during analysis:', error);
  });
