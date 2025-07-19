#!/usr/bin/env node

/**
 * Intelligent Media Categorization Script
 * Automatically categorizes all 3,604 files into specific nature/subject categories
 * Replaces generic "mixed" category with intelligent classification
 */

const fs = require('fs').promises;
const path = require('path');

async function categorizeAllMedia() {
  const mediaDir = path.join(process.cwd(), 'public', 'media');
  const categorization = {
    projects: {
      eagle: { images: [], videos: [] },
      nessie: { images: [], videos: [] },
      bass: { images: [], videos: [] },
      stcollen: { images: [], videos: [] }
    },
    workshop: {
      tools: { images: [], videos: [] },
      techniques: { images: [], videos: [] },
      environment: { images: [], videos: [] }
    },
    nature: {
      insects: { images: [], videos: [] },
      birds: { images: [], videos: [] },
      fish: { images: [], videos: [] },
      mammals: { images: [], videos: [] },
      flowers: { images: [], videos: [] },
      landscapes: { images: [], videos: [] },
      portraits: { images: [], videos: [] },
      artistic: { images: [], videos: [] }
    },
    uncategorized: { images: [], videos: [] },
    stats: {
      totalProcessed: 0,
      categorized: 0,
      uncategorized: 0
    }
  };

  console.log('🔍 Intelligent Media Categorization');
  console.log('====================================');

  // Load the enhanced file analysis
  let allFiles = [];
  try {
    const analysisData = await fs.readFile('enhanced-media-analysis-report.json', 'utf8');
    const analysis = JSON.parse(analysisData);
    allFiles = analysis.foundFiles;
    console.log(`📁 Loaded ${allFiles.length} files from analysis report`);
  } catch (error) {
    console.error('❌ Could not load enhanced analysis report. Run find-all-media.js first.');
    return;
  }

  // Categorization rules
  function categorizeFile(file) {
    const filename = file.fileName.toLowerCase();
    const dirPath = file.directory.toLowerCase();
    const ext = file.extension.toLowerCase();
    const isVideo = ['.mp4', '.mov'].includes(ext);
    const isImage = ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);

    // Project-specific categorization
    if (dirPath.includes('eagle') || filename.includes('eagle') || 
        (filename.includes('img_') && filename.match(/20[5-9]\d|3[0-2]\d\d/))) {
      return { category: 'projects', subcategory: 'eagle', type: isVideo ? 'videos' : 'images' };
    }
    
    if (dirPath.includes('nessie') || filename.includes('nessie') ||
        (filename.includes('img_') && filename.match(/14[5-9]\d|15[0-5]\d/))) {
      return { category: 'projects', subcategory: 'nessie', type: isVideo ? 'videos' : 'images' };
    }
    
    if (dirPath.includes('bass') || dirPath.includes('peacock') || filename.includes('bass')) {
      return { category: 'projects', subcategory: 'bass', type: isVideo ? 'videos' : 'images' };
    }
    
    if (dirPath.includes('collen') || dirPath.includes('statue') || filename.includes('collen')) {
      return { category: 'projects', subcategory: 'stcollen', type: isVideo ? 'videos' : 'images' };
    }

    // Workshop categorization
    if (dirPath.includes('workshop')) {
      if (filename.includes('tool') || filename.includes('equipment')) {
        return { category: 'workshop', subcategory: 'tools', type: isVideo ? 'videos' : 'images' };
      }
      if (filename.includes('technique') || filename.includes('carving') || filename.includes('method')) {
        return { category: 'workshop', subcategory: 'techniques', type: isVideo ? 'videos' : 'images' };
      }
      return { category: 'workshop', subcategory: 'environment', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Insects
    if (filename.includes('butterfly') || filename.includes('butterflies') ||
        filename.includes('dragonfly') || filename.includes('dragonflies') ||
        filename.includes('bee') || filename.includes('beetle') ||
        filename.includes('moth') || filename.includes('insect')) {
      return { category: 'nature', subcategory: 'insects', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Birds
    if (filename.includes('owl') || filename.includes('crow') || filename.includes('bird') ||
        filename.includes('eagle') && !dirPath.includes('eagle') || // Non-project eagles
        filename.includes('hawk') || filename.includes('falcon')) {
      return { category: 'nature', subcategory: 'birds', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Fish
    if (filename.includes('fish') || filename.includes('aquatic') ||
        filename.includes('water') && (filename.includes('life') || filename.includes('animal'))) {
      return { category: 'nature', subcategory: 'fish', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Mammals
    if (filename.includes('squirrel') || filename.includes('dog') ||
        filename.includes('cat') || filename.includes('mammal') ||
        filename.includes('holding') && (filename.includes('animal') || filename.includes('critter'))) {
      return { category: 'nature', subcategory: 'mammals', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Flowers
    if (filename.includes('flower') || filename.includes('floral') ||
        filename.includes('botanical') || filename.includes('plant') ||
        filename.includes('garden') || filename.includes('bloom')) {
      return { category: 'nature', subcategory: 'flowers', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Landscapes
    if (filename.includes('landscape') || filename.includes('scenery') ||
        filename.includes('outdoor') || filename.includes('nature') ||
        filename.includes('horizon') || filename.includes('vista')) {
      return { category: 'nature', subcategory: 'landscapes', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Portraits
    if (filename.includes('portrait') || filename.includes('person') ||
        filename.includes('holding') || filename.includes('me') ||
        filename.includes('craftsman') || filename.includes('artist') ||
        (filename.includes('img_') && (dirPath.includes('icloud') || dirPath.includes('christian')))) {
      return { category: 'nature', subcategory: 'portraits', type: isVideo ? 'videos' : 'images' };
    }

    // Nature categorization - Artistic
    if (filename.includes('artistic') || filename.includes('creative') ||
        filename.includes('composition') || filename.includes('abstract') ||
        filename.includes('painting') || filename.includes('art')) {
      return { category: 'nature', subcategory: 'artistic', type: isVideo ? 'videos' : 'images' };
    }

    // Default to uncategorized for manual review
    return { category: 'uncategorized', subcategory: 'uncategorized', type: isVideo ? 'videos' : 'images' };
  }

  // Process all files
  console.log('\n📊 Processing files...');
  for (const file of allFiles) {
    const cat = categorizeFile(file);
    
    const fileInfo = {
      originalPath: file.relativePath,
      originalName: file.fileName,
      extension: file.extension,
      suggestedNewPath: `${cat.category}/${cat.subcategory}/${cat.type}/`,
      category: cat,
      suggestedNewName: '' // Will be set after we add to array
    };

    // Add to appropriate category first
    if (cat.category === 'uncategorized') {
      categorization.uncategorized[cat.type].push(fileInfo);
      categorization.stats.uncategorized++;
    } else {
      categorization[cat.category][cat.subcategory][cat.type].push(fileInfo);
      categorization.stats.categorized++;
    }
    
    // Now generate filename with correct sequence number
    fileInfo.suggestedNewName = generateNewFilename(file, cat, fileInfo);
    
    categorization.stats.totalProcessed++;
  }

  // Generate new filename based on category
  function generateNewFilename(file, category, fileInfo) {
    const ext = file.extension;
    const basename = category.subcategory;
    
    // Get count for sequencing from current array
    let existingFiles;
    if (category.category === 'uncategorized') {
      existingFiles = categorization.uncategorized[category.type];
    } else {
      existingFiles = categorization[category.category][category.subcategory][category.type];
    }
    const sequence = String(existingFiles.length).padStart(3, '0');
    
    // Determine specific type from filename
    let specificType = 'general';
    const filename = file.fileName.toLowerCase();
    
    if (category.category === 'nature') {
      if (category.subcategory === 'insects') {
        if (filename.includes('butterfly')) specificType = 'butterfly';
        else if (filename.includes('dragonfly')) specificType = 'dragonfly';
        else if (filename.includes('bee')) specificType = 'bee';
        else specificType = 'insect';
      } else if (category.subcategory === 'birds') {
        if (filename.includes('owl')) specificType = 'owl';
        else if (filename.includes('crow')) specificType = 'crow';
        else specificType = 'bird';
      } else if (category.subcategory === 'fish') {
        if (filename.includes('display')) specificType = 'display';
        else if (filename.includes('door')) specificType = 'door';
        else if (filename.includes('front')) specificType = 'front';
        else specificType = 'aquatic';
      } else if (category.subcategory === 'mammals') {
        if (filename.includes('squirrel')) specificType = 'squirrel';
        else if (filename.includes('dog')) specificType = 'dog';
        else specificType = 'mammal';
      } else if (category.subcategory === 'portraits') {
        if (filename.includes('holding')) specificType = 'holding';
        else if (filename.includes('craftsman')) specificType = 'craftsman';
        else specificType = 'portrait';
      }
    } else if (category.category === 'projects') {
      if (filename.includes('final')) specificType = 'final';
      else specificType = 'process';
    }
    
    return `${basename}_${specificType}_${sequence}${ext}`;
  }

  // Generate report
  console.log('\n📈 CATEGORIZATION RESULTS');
  console.log('==========================');
  console.log(`📊 Total files processed: ${categorization.stats.totalProcessed}`);
  console.log(`✅ Successfully categorized: ${categorization.stats.categorized}`);
  console.log(`⚠️  Need manual review: ${categorization.stats.uncategorized}`);
  
  console.log('\n📁 Category Breakdown:');
  
  // Projects
  console.log('\n🎯 PROJECTS:');
  Object.entries(categorization.projects).forEach(([project, data]) => {
    const total = data.images.length + data.videos.length;
    if (total > 0) {
      console.log(`   ${project}: ${total} files (${data.images.length} images, ${data.videos.length} videos)`);
    }
  });
  
  // Workshop
  console.log('\n🔨 WORKSHOP:');
  Object.entries(categorization.workshop).forEach(([type, data]) => {
    const total = data.images.length + data.videos.length;
    if (total > 0) {
      console.log(`   ${type}: ${total} files (${data.images.length} images, ${data.videos.length} videos)`);
    }
  });
  
  // Nature
  console.log('\n🌿 NATURE:');
  Object.entries(categorization.nature).forEach(([type, data]) => {
    const total = data.images.length + data.videos.length;
    if (total > 0) {
      console.log(`   ${type}: ${total} files (${data.images.length} images, ${data.videos.length} videos)`);
    }
  });
  
  // Uncategorized
  const uncatTotal = categorization.uncategorized.images.length + categorization.uncategorized.videos.length;
  if (uncatTotal > 0) {
    console.log('\n⚠️  NEEDS MANUAL REVIEW:');
    console.log(`   uncategorized: ${uncatTotal} files (${categorization.uncategorized.images.length} images, ${categorization.uncategorized.videos.length} videos)`);
    
    console.log('\n📝 Sample uncategorized files for review:');
    categorization.uncategorized.images.slice(0, 10).forEach(file => {
      console.log(`   📷 ${file.originalPath}`);
    });
    if (categorization.uncategorized.images.length > 10) {
      console.log(`   ... and ${categorization.uncategorized.images.length - 10} more images`);
    }
  }

  // Save categorization plan
  console.log('\n💾 Saving categorization plan...');
  await fs.writeFile(
    'media-categorization-plan.json',
    JSON.stringify(categorization, null, 2)
  );

  console.log('\n✅ Categorization analysis complete!');
  console.log('📄 Detailed plan saved to: media-categorization-plan.json');
  console.log('\n🎯 Next steps:');
  console.log('   1. Review the categorization plan');
  console.log('   2. Manually categorize any uncategorized files');
  console.log('   3. Run the organization script to apply changes');
  
  return categorization;
}

// Run the categorization
categorizeAllMedia()
  .catch(error => {
    console.error('❌ Categorization failed:', error);
    console.error('Stack trace:', error.stack);
  });
