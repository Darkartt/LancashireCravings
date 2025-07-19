#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Cross-Contamination Detection Script');
console.log('=====================================');

// Define what each project should contain based on names/patterns
const projectPatterns = {
  'stcollen': ['saint', 'collen', 'statue', 'religious', 'church', 'carving', 'wood'],
  'eagle': ['eagle', 'bird', 'wings', 'feathers', 'predator'],
  'bass': ['bass', 'fish', 'fishing', 'water', 'angler'],
  'nessie': ['nessie', 'loch', 'monster', 'serpent', 'mythical']
};

// Keywords that indicate fish/sea creatures (shouldn't be in non-fish projects)
const fishKeywords = ['fish', 'bass', 'trout', 'salmon', 'sea', 'ocean', 'aquatic', 'water', 'fishing', 'angler'];

async function checkForCrossContamination() {
  const projectsDir = 'public/media/projects';
  const projects = ['stcollen', 'eagle', 'nessie', 'bass'];
  
  for (const project of projects) {
    console.log(`\n🔍 Checking ${project.toUpperCase()} project...`);
    
    const imagesDir = path.join(projectsDir, project, 'images');
    if (!fs.existsSync(imagesDir)) {
      console.log(`  ❌ Images directory not found: ${imagesDir}`);
      continue;
    }
    
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
    
    console.log(`  📁 Found ${imageFiles.length} images`);
    
    // Check for fish content in non-fish projects
    if (project !== 'bass') {
      const suspiciousFiles = imageFiles.filter(file => {
        const filename = file.toLowerCase();
        return fishKeywords.some(keyword => filename.includes(keyword));
      });
      
      if (suspiciousFiles.length > 0) {
        console.log(`  🚨 CROSS-CONTAMINATION DETECTED in ${project.toUpperCase()}:`);
        suspiciousFiles.forEach(file => {
          console.log(`    - ${file} (contains fish/water keywords)`);
        });
      }
    }
    
    // Show first few files for manual inspection
    console.log(`  📋 Sample files (first 5):`);
    imageFiles.slice(0, 5).forEach(file => {
      console.log(`    - ${file}`);
    });
  }
}

// Check specific patterns in St Collen
async function analyzeStCollenContent() {
  console.log('\n🔍 DETAILED ST COLLEN ANALYSIS');
  console.log('=============================');
  
  const stcollenDir = 'public/media/projects/stcollen/images';
  if (!fs.existsSync(stcollenDir)) {
    console.log('❌ St Collen directory not found');
    return;
  }
  
  const files = fs.readdirSync(stcollenDir);
  const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
  
  console.log(`📁 Total St Collen images: ${imageFiles.length}`);
  
  // Categorize by potential content type
  const categories = {
    fish: [],
    religious: [],
    carving: [],
    statue: [],
    unclear: []
  };
  
  imageFiles.forEach(file => {
    const filename = file.toLowerCase();
    
    if (fishKeywords.some(keyword => filename.includes(keyword))) {
      categories.fish.push(file);
    } else if (['saint', 'collen', 'religious', 'church'].some(keyword => filename.includes(keyword))) {
      categories.religious.push(file);
    } else if (['carving', 'wood', 'chisel', 'sculpture'].some(keyword => filename.includes(keyword))) {
      categories.carving.push(file);
    } else if (['statue', 'figure', 'form'].some(keyword => filename.includes(keyword))) {
      categories.statue.push(file);
    } else {
      categories.unclear.push(file);
    }
  });
  
  console.log('\n📊 Content Analysis:');
  Object.entries(categories).forEach(([category, files]) => {
    if (files.length > 0) {
      console.log(`  ${category.toUpperCase()}: ${files.length} files`);
      if (category === 'fish' && files.length > 0) {
        console.log('  🚨 FISH CONTENT DETECTED IN ST COLLEN PROJECT!');
        files.slice(0, 3).forEach(file => console.log(`    - ${file}`));
      }
    }
  });
  
  console.log('\n📝 RECOMMENDATION:');
  if (categories.fish.length > 0) {
    console.log(`  🔧 Move ${categories.fish.length} fish-related files to nature/fish or bass project`);
  }
  if (categories.unclear.length > 0) {
    console.log(`  👀 Manually review ${categories.unclear.length} unclear files`);
  }
}

checkForCrossContamination()
  .then(() => analyzeStCollenContent())
  .catch(console.error);
