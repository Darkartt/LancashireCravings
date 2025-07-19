#!/usr/bin/env node

/**
 * Quick diagnostic script to debug image scanning
 */

const fs = require('fs').promises;
const path = require('path');

async function debugImageScanning() {
  const mediaDir = path.join(process.cwd(), 'public', 'media');
  const projectsDir = path.join(mediaDir, 'projects');
  
  console.log('🔍 Debugging image scanning...');
  
  try {
    const projects = await fs.readdir(projectsDir);
    console.log('Projects found:', projects);
    
    for (const project of projects) {
      if (project.startsWith('.')) continue;
      
      const projectPath = path.join(projectsDir, project);
      const stat = await fs.stat(projectPath);
      if (!stat.isDirectory()) continue;
      
      console.log(`\n📁 Project: ${project}`);
      
      const imagesPath = path.join(projectPath, 'images');
      console.log(`  Looking for images in: ${imagesPath}`);
      
      try {
        await fs.access(imagesPath);
        console.log(`  ✅ Images directory exists`);
        
        const allFiles = await fs.readdir(imagesPath);
        console.log(`  📋 Found ${allFiles.length} items:`, allFiles.slice(0, 5), allFiles.length > 5 ? '...' : '');
        
        let imageCount = 0;
        let dirCount = 0;
        
        for (const file of allFiles) {
          const filePath = path.join(imagesPath, file);
          const fileStat = await fs.stat(filePath);
          
          if (fileStat.isDirectory()) {
            dirCount++;
            console.log(`    📁 Directory: ${file}`);
          } else {
            const ext = path.extname(file).toLowerCase();
            const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            if (isImage) {
              imageCount++;
              if (imageCount <= 3) {
                console.log(`    🖼️  Image: ${file}`);
              }
            }
          }
        }
        
        console.log(`  📊 Summary: ${imageCount} images, ${dirCount} directories`);
        
      } catch (err) {
        console.log(`  ❌ Images directory not accessible: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugImageScanning();
