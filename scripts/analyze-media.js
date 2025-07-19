#!/usr/bin/env node

/**
 * Media Analysis Script
 * Analyzes all media files in the project and generates organization recommendations
 */

const fs = require('fs').promises;
const path = require('path');

async function analyzeMediaFiles() {
  const mediaDir = path.join(process.cwd(), 'public', 'media');
  const analysisReport = {
    totalFiles: 0,
    fileTypes: {},
    directories: {},
    projects: {
      eagle: { files: [], images: 0, videos: 0 },
      nessie: { files: [], images: 0, videos: 0 },
      bass: { files: [], images: 0, videos: 0 },
      stcollen: { files: [], images: 0, videos: 0 },
      workshop: { files: [], images: 0, videos: 0 },
      nature: { files: [], images: 0, videos: 0 },
      mixed: { files: [], images: 0, videos: 0 }
    },
    recommendations: []
  };

  async function scanDirectory(dirPath, relativePath = '') {
    try {
      console.log(`\n🔍 Scanning directory: ${dirPath}`);
      
      let items;
      try {
        items = await fs.readdir(dirPath);
      } catch (readdirError) {
        console.error(`❌ Cannot read directory ${dirPath}:`, readdirError.message);
        return;
      }
      
      console.log(`📁 Found ${items.length} items in: ${path.basename(dirPath)}`);
      
      for (const item of items) {
        if (item === 'archive') {
          console.log('⏭️  Skipping archive folder');
          continue; // Skip backup folder
        }
        
        const fullPath = path.join(dirPath, item);
        const relativeItemPath = path.join(relativePath, item);
        
        let stats;
        try {
          stats = await fs.stat(fullPath);
        } catch (statError) {
          console.error(`❌ Error getting stats for "${item}":`, statError.message);
          continue;
        }

        if (stats.isDirectory()) {
          console.log(`📂 Processing directory: ${item}`);
          analysisReport.directories[relativeItemPath] = {
            path: relativeItemPath,
            filesCount: 0,
            subdirectories: []
          };
          
          // Recursively scan subdirectory
          await scanDirectory(fullPath, relativeItemPath);
        } else {
          // File analysis
          console.log(`📄 Processing file: ${item}`);
          analysisReport.totalFiles++;
          
          const ext = path.extname(item).toLowerCase();
          const fileType = getFileType(ext);
          
          if (!analysisReport.fileTypes[ext]) {
            analysisReport.fileTypes[ext] = 0;
          }
          analysisReport.fileTypes[ext]++;

          // Categorize by project
          const project = categorizeFile(item, relativePath);
          if (analysisReport.projects[project]) {
            analysisReport.projects[project].files.push({
              filename: item,
              path: relativeItemPath,
              type: fileType,
              extension: ext,
              size: stats.size,
              modified: stats.mtime
            });
            
            if (fileType === 'image') {
              analysisReport.projects[project].images++;
            } else if (fileType === 'video') {
              analysisReport.projects[project].videos++;
            }
          }

          // Update directory file count
          const dirKey = relativePath || 'root';
          if (analysisReport.directories[dirKey]) {
            analysisReport.directories[dirKey].filesCount++;
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error scanning directory ${dirPath}:`, error.message);
      console.error('Stack trace:', error.stack);
    }
  }

  function getFileType(extension) {
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    
    if (imageExts.includes(extension)) return 'image';
    if (videoExts.includes(extension)) return 'video';
    return 'other';
  }

  function categorizeFile(filename, dirPath) {
    const lowerFilename = filename.toLowerCase();
    const lowerDirPath = dirPath.toLowerCase();

    // Project-specific patterns
    if (lowerDirPath.includes('eagle') || 
        (lowerFilename.includes('img_') && 
         (lowerFilename.includes('205') || lowerFilename.includes('206') || 
          lowerFilename.includes('207') || lowerFilename.includes('3')))) {
      return 'eagle';
    }
    
    if (lowerDirPath.includes('nessie') || 
        (lowerFilename.includes('img_') && 
         (lowerFilename.includes('149') || lowerFilename.includes('15')))) {
      return 'nessie';
    }
    
    if (lowerDirPath.includes('bass') || lowerDirPath.includes('peacock')) {
      return 'bass';
    }
    
    if (lowerDirPath.includes('collen') || lowerDirPath.includes('statue')) {
      return 'stcollen';
    }
    
    if (lowerFilename.includes('workshop') || 
        lowerFilename.includes('tool') ||
        lowerDirPath.includes('icloud') && 
        (lowerFilename.includes('work') || lowerFilename.includes('craft'))) {
      return 'workshop';
    }
    
    if (lowerFilename.includes('butterfly') || 
        lowerFilename.includes('dragonfly') || 
        lowerFilename.includes('fish') ||
        lowerFilename.includes('nature')) {
      return 'nature';
    }
    
    return 'mixed';
  }

  // Start analysis
  console.log('🔍 Starting media file analysis...');
  await scanDirectory(mediaDir);

  // Generate recommendations
  analysisReport.recommendations = generateRecommendations(analysisReport);

  return analysisReport;
}

function generateRecommendations(report) {
  const recommendations = [];

  // Check for naming issues
  Object.values(report.projects).forEach(project => {
    const genericNames = project.files.filter(file => 
      file.filename.match(/^IMG_\d+\.(jpg|jpeg|mov|mp4)$/i)
    );
    
    if (genericNames.length > 0) {
      recommendations.push({
        type: 'naming',
        severity: 'medium',
        message: `Found ${genericNames.length} files with generic IMG_ names`,
        files: genericNames.map(f => f.path)
      });
    }
  });

  // Check for folder organization issues
  Object.keys(report.directories).forEach(dir => {
    if (dir.includes(' ')) {
      recommendations.push({
        type: 'structure',
        severity: 'high',
        message: `Folder "${dir}" contains spaces - should use hyphens or underscores`,
        path: dir
      });
    }
  });

  // Check file distribution
  const totalFiles = report.totalFiles;
  const unorganized = report.projects.mixed.files.length;
  if (unorganized > totalFiles * 0.2) {
    recommendations.push({
      type: 'organization',
      severity: 'high',
      message: `${unorganized} files (${Math.round(unorganized/totalFiles*100)}%) are uncategorized`,
      count: unorganized
    });
  }

  return recommendations;
}

function generateReport(analysis) {
  const report = [];
  
  report.push('# 📊 Media Analysis Report\n');
  report.push(`**Generated:** ${new Date().toLocaleString()}\n`);
  report.push(`**Total Files:** ${analysis.totalFiles}\n`);
  
  report.push('\n## 📁 Directory Structure\n');
  Object.values(analysis.directories).forEach(dir => {
    report.push(`- **${dir.path}**: ${dir.filesCount} files`);
  });
  
  report.push('\n## 📊 File Type Distribution\n');
  Object.entries(analysis.fileTypes).forEach(([ext, count]) => {
    const percentage = ((count / analysis.totalFiles) * 100).toFixed(1);
    report.push(`- **${ext}**: ${count} files (${percentage}%)`);
  });
  
  report.push('\n## 🎯 Project Categorization\n');
  Object.entries(analysis.projects).forEach(([project, data]) => {
    const total = data.images + data.videos;
    if (total > 0) {
      report.push(`- **${project}**: ${total} files (${data.images} images, ${data.videos} videos)`);
    }
  });
  
  report.push('\n## ⚠️ Issues & Recommendations\n');
  if (analysis.recommendations.length === 0) {
    report.push('✅ No major issues found!');
  } else {
    analysis.recommendations.forEach(rec => {
      const icon = rec.severity === 'high' ? '🔴' : rec.severity === 'medium' ? '🟡' : '🟢';
      report.push(`${icon} **${rec.type}**: ${rec.message}`);
    });
  }
  
  return report.join('\n');
}

// Run analysis
analyzeMediaFiles()
  .then(analysis => {
    console.log('\n✅ Analysis complete!');
    console.log(`\n📊 Total files found by script: ${analysis.totalFiles}`);
    
    // Validate file count using system command
    const { execSync } = require('child_process');
    try {
      const mediaDir = path.join(process.cwd(), 'public', 'media');
      const systemCount = execSync(`find "${mediaDir}" -type f | wc -l`, { encoding: 'utf8' }).trim();
      console.log(`📊 Total files found by system: ${systemCount}`);
      
      const difference = parseInt(systemCount) - analysis.totalFiles;
      if (difference > 0) {
        console.log(`⚠️  Missing ${difference} files in analysis - investigation needed!`);
      } else {
        console.log(`✅ File counts match!`);
      }
    } catch (cmdError) {
      console.log('ℹ️  Could not validate file count with system command');
    }
    
    console.log('\n' + generateReport(analysis));
    
    // Save detailed analysis to file
    const fs = require('fs').promises;
    fs.writeFile(
      'media-analysis-report.json', 
      JSON.stringify(analysis, null, 2)
    );
    
    console.log('\n📄 Detailed analysis saved to: media-analysis-report.json');
  })
  .catch(error => {
    console.error('❌ Analysis failed:', error);
  });
