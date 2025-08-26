const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Check if sharp is available
function checkSharp() {
  try {
    require.resolve('sharp');
    return true;
  } catch (error) {
    console.log('Sharp not found. Installing sharp for image optimization...');
    return false;
  }
}

// Get file size in KB
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

// Process a single image with sharp
async function processImage(inputPath) {
  const dir = path.dirname(inputPath);
  const name = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  
  // Skip if already processed or not a supported format
  if (inputPath.includes('_optimized') || inputPath.includes('.webp')) {
    return;
  }

  // Only process JPEG and PNG files
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  console.log(`Processing: ${inputPath}`);
  
  const originalSize = getFileSize(inputPath);
  console.log(`  Original size: ${originalSize}KB`);

  try {
    // Create optimized JPEG version
    const optimizedPath = path.join(dir, `${name}_optimized.jpg`);
    await sharp(inputPath)
      .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(optimizedPath);
    
    const optimizedSize = getFileSize(optimizedPath);
    console.log(`  Optimized JPEG: ${optimizedSize}KB (${Math.round((1 - optimizedSize/originalSize) * 100)}% reduction)`);

    // Create WebP version
    const webpPath = path.join(dir, `${name}.webp`);
    await sharp(inputPath)
      .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    const webpSize = getFileSize(webpPath);
    console.log(`  WebP: ${webpSize}KB (${Math.round((1 - webpSize/originalSize) * 100)}% reduction)`);

    // Create responsive sizes
    const sizes = [
      { width: 800, suffix: '_800w' },
      { width: 1200, suffix: '_1200w' },
      { width: 1600, suffix: '_1600w' }
    ];

    for (const size of sizes) {
      const responsivePath = path.join(dir, `${name}${size.suffix}.jpg`);
      const responsiveWebpPath = path.join(dir, `${name}${size.suffix}.webp`);
      
      // Create responsive JPEG
      await sharp(inputPath)
        .resize(size.width, Math.round(size.width * 0.75), { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(responsivePath);
      
      const responsiveSize = getFileSize(responsivePath);
      console.log(`  ${size.width}w JPEG: ${responsiveSize}KB`);
      
      // Create responsive WebP
      await sharp(inputPath)
        .resize(size.width, Math.round(size.width * 0.75), { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(responsiveWebpPath);
      
      const responsiveWebpSize = getFileSize(responsiveWebpPath);
      console.log(`  ${size.width}w WebP: ${responsiveWebpSize}KB (${Math.round((1 - responsiveWebpSize/responsiveSize) * 100)}% reduction)`);
    }

  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
  }

  console.log('');
}

// Find all image files recursively
function findImages(dir) {
  const images = [];
  const extensions = ['.jpg', '.jpeg', '.png'];
  
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
async function main() {
  if (!checkSharp()) {
    console.log('Please install sharp: npm install sharp');
    return;
  }

  const publicDir = path.join(__dirname, '..', 'public');
  
  if (!fs.existsSync(publicDir)) {
    console.error('Public directory not found');
    return;
  }

  console.log('Starting image optimization with Sharp...\n');
  
  const images = findImages(publicDir);
  console.log(`Found ${images.length} images to optimize\n`);
  
  let totalOriginalSize = 0;
  
  for (const imagePath of images) {
    const originalSize = getFileSize(imagePath);
    totalOriginalSize += originalSize;
    
    await processImage(imagePath);
  }
  
  console.log('Image optimization completed!');
  console.log(`Total original size: ${totalOriginalSize}KB`);
  console.log(`Estimated savings: ${Math.round(totalOriginalSize * 0.7)}KB (70% reduction)`);
  console.log('\nNext steps:');
  console.log('1. Update image components to use OptimizedImage');
  console.log('2. Replace image src attributes with optimized versions');
  console.log('3. Test responsive image loading');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processImage, findImages };
