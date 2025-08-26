const fs = require('fs');
const path = require('path');

// Function to get optimized image paths
function getOptimizedImagePaths(originalPath) {
  const dir = path.dirname(originalPath);
  const name = path.basename(originalPath, path.extname(originalPath));
  
  // Check if optimized versions exist
  const optimizedJpg = path.join(dir, `${name}_optimized.jpg`);
  const webp = path.join(dir, `${name}.webp`);
  const webp800w = path.join(dir, `${name}_800w.webp`);
  const webp1200w = path.join(dir, `${name}_1200w.webp`);
  const webp1600w = path.join(dir, `${name}_1600w.webp`);
  
  return {
    optimizedJpg: fs.existsSync(optimizedJpg) ? optimizedJpg.replace('public', '') : null,
    webp: fs.existsSync(webp) ? webp.replace('public', '') : null,
    webp800w: fs.existsSync(webp800w) ? webp800w.replace('public', '') : null,
    webp1200w: fs.existsSync(webp1200w) ? webp1200w.replace('public', '') : null,
    webp1600w: fs.existsSync(webp1600w) ? webp1600w.replace('public', '') : null
  };
}

// Function to generate OptimizedImage component usage
function generateOptimizedImageComponent(originalSrc, alt, className = '', onClick = null) {
  const optimizedPaths = getOptimizedImagePaths(`public${originalSrc}`);
  
  if (!optimizedPaths.webp) {
    // If no optimized version exists, return original img tag
    return `<img src="${originalSrc}" alt="${alt}" className="${className}" ${onClick ? `onClick={${onClick}}` : ''} />`;
  }
  
  // Generate picture element with WebP and fallback
  const pictureElement = `
    <picture>
      <source
        type="image/webp"
        srcSet="${optimizedPaths.webp800w || optimizedPaths.webp} 800w, ${optimizedPaths.webp1200w || optimizedPaths.webp} 1200w, ${optimizedPaths.webp1600w || optimizedPaths.webp} 1600w"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <img
        src="${optimizedPaths.optimizedJpg || originalSrc}"
        alt="${alt}"
        className="${className}"
        loading="lazy"
        ${onClick ? `onClick={${onClick}}` : ''}
      />
    </picture>
  `;
  
  return pictureElement.trim();
}

// Function to update a file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Find all img tags with src attributes
    const imgRegex = /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/g;
    
    content = content.replace(imgRegex, (match, beforeSrc, src, afterSrc) => {
      // Extract alt and className
      const altMatch = beforeSrc.match(/alt=["']([^"']+)["']/) || afterSrc.match(/alt=["']([^"']+)["']/);
      const classNameMatch = beforeSrc.match(/className=["']([^"']+)["']/) || afterSrc.match(/className=["']([^"']+)["']/);
      const onClickMatch = beforeSrc.match(/onClick=\{([^}]+)\}/) || afterSrc.match(/onClick=\{([^}]+)\}/);
      
      const alt = altMatch ? altMatch[1] : '';
      const className = classNameMatch ? classNameMatch[1] : '';
      const onClick = onClickMatch ? onClickMatch[1] : null;
      
      // Only optimize if it's a local image (starts with /)
      if (src.startsWith('/') && !src.includes('data:') && !src.includes('blob:')) {
        const optimizedComponent = generateOptimizedImageComponent(src, alt, className, onClick);
        updated = true;
        return optimizedComponent;
      }
      
      return match;
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('🔄 Updating image components to use optimized images...\n');
  
  const filesToUpdate = [
    'src/app/page.tsx',
    'src/app/shop/page.tsx',
    'src/app/projects/[slug]/ProjectPageClient.tsx',
    'src/components/BeforeAfterComparison.tsx',
    'src/components/EnhancedBeforeAfter.tsx',
    'src/components/WorkshopShowcase.tsx'
  ];
  
  let updatedCount = 0;
  
  filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      if (updateFile(filePath)) {
        updatedCount++;
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  });
  
  console.log(`\n🎉 Updated ${updatedCount} files with optimized images!`);
  console.log('\nNext steps:');
  console.log('1. Test the updated components');
  console.log('2. Verify WebP images are loading correctly');
  console.log('3. Check responsive image behavior');
  console.log('4. Monitor performance improvements');
}

if (require.main === module) {
  main();
}

module.exports = { updateFile, generateOptimizedImageComponent };
