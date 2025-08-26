const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if ImageMagick is available
function checkImageMagick() {
  try {
    execSync('magick --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('ImageMagick not found. Please install ImageMagick for image optimization.');
    return false;
  }
}

// Check if cwebp is available
function checkWebP() {
  try {
    execSync('cwebp -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('WebP tools not found. Please install WebP tools for WebP conversion.');
    return false;
  }
}

// Convert image to WebP
function convertToWebP(inputPath, outputPath, quality = 85) {
  try {
    execSync(`cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error converting ${inputPath} to WebP:`, error.message);
    return false;
  }
}

// Resize image using ImageMagick
function resizeImage(inputPath, outputPath, width, height) {
  try {
    execSync(`magick "${inputPath}" -resize ${width}x${height} "${outputPath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error resizing ${inputPath}:`, error.message);
    return false;
  }
}

// Get file size in KB
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

// Process a single image
function processImage(inputPath) {
  const dir = path.dirname(inputPath);
  const name = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath);
  
  // Skip if already processed
  if (inputPath.includes('_optimized') || inputPath.includes('.webp')) {
    return;
  }

  console.log(`Processing: ${inputPath}`);
  
  const originalSize = getFileSize(inputPath);
  console.log(`  Original size: ${originalSize}KB`);

  // Create optimized versions
  const optimizedPath = path.join(dir, `${name}_optimized${ext}`);
  const webpPath = path.join(dir, `${name}.webp`);
  const webpOptimizedPath = path.join(dir, `${name}_optimized.webp`);

  // Generate responsive sizes
  const sizes = [
    { width: 800, suffix: '_800w' },
    { width: 1200, suffix: '_1200w' },
    { width: 1600, suffix: '_1600w' }
  ];

  if (checkImageMagick()) {
    // Create optimized JPEG
    if (resizeImage(inputPath, optimizedPath, 1600, 1200)) {
      const optimizedSize = getFileSize(optimizedPath);
      console.log(`  Optimized JPEG (1600x1200): ${optimizedSize}KB (${Math.round((1 - optimizedSize/originalSize) * 100)}% reduction)`);
    }

    // Create responsive sizes
    sizes.forEach(size => {
      const responsivePath = path.join(dir, `${name}${size.suffix}${ext}`);
      const responsiveWebpPath = path.join(dir, `${name}${size.suffix}.webp`);
      
      if (resizeImage(inputPath, responsivePath, size.width, Math.round(size.width * 0.75))) {
        const responsiveSize = getFileSize(responsivePath);
        console.log(`  ${size.width}w JPEG: ${responsiveSize}KB`);
        
        // Convert to WebP
        if (checkWebP()) {
          convertToWebP(responsivePath, responsiveWebpPath, 85);
          const webpSize = getFileSize(responsiveWebpPath);
          console.log(`  ${size.width}w WebP: ${webpSize}KB (${Math.round((1 - webpSize/responsiveSize) * 100)}% reduction)`);
        }
      }
    });
  }

  // Convert original to WebP
  if (checkWebP()) {
    if (convertToWebP(inputPath, webpPath, 85)) {
      const webpSize = getFileSize(webpPath);
      console.log(`  WebP: ${webpSize}KB (${Math.round((1 - webpSize/originalSize) * 100)}% reduction)`);
    }
  }

  console.log('');
}

// Find all image files recursively
function findImages(dir) {
  const images = [];
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scan(filePath);
      } else if (extensions.includes(path.extname(file).toLowerCase())) {
        // Only process files larger than 100KB
        if (stat.size > 100 * 1024) {
          images.push(filePath);
        }
      }
    });
  }
  
  scan(dir);
  return images;
}

// Main execution
function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.error('Public directory not found');
    return;
  }

  console.log('Starting image optimization...\n');
  
  const images = findImages(publicDir);
  console.log(`Found ${images.length} images to optimize\n`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  images.forEach(imagePath => {
    const originalSize = getFileSize(imagePath);
    totalOriginalSize += originalSize;
    
    processImage(imagePath);
  });
  
  console.log('Image optimization completed!');
  console.log(`Total original size: ${totalOriginalSize}KB`);
  console.log(`Estimated savings: ${Math.round(totalOriginalSize * 0.7)}KB (70% reduction)`);
}

if (require.main === module) {
  main();
}

module.exports = { processImage, findImages };
