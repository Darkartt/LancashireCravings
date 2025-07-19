#!/usr/bin/env node

/**
 * Enhanced Media Discovery Script
 * Finds ALL media files in the project using multiple methods
 * Addresses the missing 1,492 files issue
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function findAllMediaFiles() {
  const mediaDir = path.join(process.cwd(), 'public', 'media');
  const report = {
    totalFiles: 0,
    foundFiles: [],
    directories: [],
    filesByExtension: {},
    filesByDirectory: {},
    systemCommandResults: {},
    issues: []
  };

  console.log('🔍 Enhanced Media File Discovery');
  console.log('================================');

  // Method 1: System find command (most reliable)
  console.log('\n📋 Method 1: System find command');
  try {
    const findResult = execSync(`find "${mediaDir}" -type f`, { encoding: 'utf8' });
    const systemFiles = findResult.trim().split('\n').filter(f => f.length > 0);
    report.systemCommandResults.findCommand = systemFiles.length;
    console.log(`✅ System find found: ${systemFiles.length} files`);
    
    // Process system files
    for (const filePath of systemFiles) {
      const relativePath = path.relative(mediaDir, filePath);
      const ext = path.extname(filePath).toLowerCase();
      const dir = path.dirname(relativePath);
      
      report.foundFiles.push({
        fullPath: filePath,
        relativePath: relativePath,
        fileName: path.basename(filePath),
        extension: ext,
        directory: dir,
        method: 'system-find'
      });
      
      // Count by extension
      if (!report.filesByExtension[ext]) {
        report.filesByExtension[ext] = 0;
      }
      report.filesByExtension[ext]++;
      
      // Count by directory
      if (!report.filesByDirectory[dir]) {
        report.filesByDirectory[dir] = 0;
      }
      report.filesByDirectory[dir]++;
    }
    
    report.totalFiles = systemFiles.length;
  } catch (error) {
    console.error('❌ System find command failed:', error.message);
    report.issues.push('System find command failed: ' + error.message);
  }

  // Method 2: Node.js recursive scan
  console.log('\n📋 Method 2: Node.js recursive scan');
  const nodejsFiles = [];
  
  async function scanRecursively(dirPath, relativePath = '') {
    try {
      const items = await fs.readdir(dirPath);
      
      for (const item of items) {
        if (item === 'archive') continue; // Skip backup folder
        
        const fullPath = path.join(dirPath, item);
        const itemRelativePath = path.join(relativePath, item);
        
        try {
          const stats = await fs.stat(fullPath);
          
          if (stats.isDirectory()) {
            report.directories.push(itemRelativePath);
            await scanRecursively(fullPath, itemRelativePath);
          } else {
            const ext = path.extname(item).toLowerCase();
            nodejsFiles.push({
              fullPath: fullPath,
              relativePath: itemRelativePath,
              fileName: item,
              extension: ext,
              directory: relativePath,
              method: 'nodejs-scan',
              size: stats.size,
              modified: stats.mtime
            });
          }
        } catch (statError) {
          console.error(`❌ Cannot access: ${itemRelativePath} - ${statError.message}`);
          report.issues.push(`Cannot access: ${itemRelativePath} - ${statError.message}`);
        }
      }
    } catch (error) {
      console.error(`❌ Cannot read directory: ${dirPath} - ${error.message}`);
      report.issues.push(`Cannot read directory: ${dirPath} - ${error.message}`);
    }
  }
  
  await scanRecursively(mediaDir);
  report.systemCommandResults.nodejsScan = nodejsFiles.length;
  console.log(`✅ Node.js scan found: ${nodejsFiles.length} files`);

  // Method 3: PowerShell method (Windows specific)
  console.log('\n📋 Method 3: PowerShell command');
  try {
    const psResult = execSync(`powershell -Command "Get-ChildItem -Path '${mediaDir}' -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count"`, { encoding: 'utf8' });
    const psCount = parseInt(psResult.trim());
    report.systemCommandResults.powershell = psCount;
    console.log(`✅ PowerShell found: ${psCount} files`);
  } catch (error) {
    console.log('⚠️  PowerShell command not available or failed');
  }

  // Method 4: Filter by media extensions only
  console.log('\n📋 Method 4: Media files only');
  const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.mp4', '.mov', '.avi', '.mkv', '.webm'];
  const mediaFiles = report.foundFiles.filter(file => 
    mediaExtensions.includes(file.extension)
  );
  report.systemCommandResults.mediaFilesOnly = mediaFiles.length;
  console.log(`✅ Media files only: ${mediaFiles.length} files`);

  // Analysis and comparison
  console.log('\n🔍 ANALYSIS RESULTS');
  console.log('==================');
  console.log(`📊 Total files found: ${report.totalFiles}`);
  console.log(`📊 Media files only: ${mediaFiles.length}`);
  console.log(`📊 Total directories: ${report.directories.length}`);
  console.log(`📊 Issues encountered: ${report.issues.length}`);

  // Show file extension breakdown
  console.log('\n📈 File Extension Breakdown:');
  Object.entries(report.filesByExtension)
    .sort(([,a], [,b]) => b - a)
    .forEach(([ext, count]) => {
      const percentage = ((count / report.totalFiles) * 100).toFixed(1);
      console.log(`   ${ext || '(no extension)'}: ${count} files (${percentage}%)`);
    });

  // Show directories with most files
  console.log('\n📁 Top Directories by File Count:');
  Object.entries(report.filesByDirectory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([dir, count]) => {
      console.log(`   ${dir || '(root)'}: ${count} files`);
    });

  // Show issues
  if (report.issues.length > 0) {
    console.log('\n⚠️  Issues Found:');
    report.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }

  // Compare with previous analysis
  console.log('\n🔄 Comparison with Previous Analysis:');
  console.log(`   Previous script found: 2,112 files`);
  console.log(`   This analysis found: ${report.totalFiles} files`);
  const difference = report.totalFiles - 2112;
  if (difference > 0) {
    console.log(`   ✅ Found ${difference} additional files!`);
  } else if (difference < 0) {
    console.log(`   ⚠️  Found ${Math.abs(difference)} fewer files than expected`);
  } else {
    console.log(`   ✅ File counts match!`);
  }

  return report;
}

// Run the analysis
findAllMediaFiles()
  .then(report => {
    console.log('\n💾 Saving complete analysis report...');
    
    // Save detailed report
    const fs = require('fs').promises;
    fs.writeFile(
      'enhanced-media-analysis-report.json', 
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ Enhanced analysis complete!');
    console.log('📄 Detailed report saved to: enhanced-media-analysis-report.json');
    console.log('\n🎯 Next steps:');
    console.log('   1. Review the enhanced-media-analysis-report.json file');
    console.log('   2. Investigate any files marked with issues');
    console.log('   3. Proceed with systematic file organization');
  })
  .catch(error => {
    console.error('❌ Enhanced analysis failed:', error);
    console.error('Stack trace:', error.stack);
  });
