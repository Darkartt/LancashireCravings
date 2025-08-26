const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Analyze bundle size and identify optimization opportunities
function analyzeBundle() {
  console.log('🔍 Analyzing bundle for performance optimization...\n');

  // Check if .next directory exists
  const nextDir = path.join(__dirname, '..', '.next');
  if (!fs.existsSync(nextDir)) {
    console.log('❌ .next directory not found. Please run "npm run build" first.');
    return;
  }

  // Analyze static files
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log('📊 Static files analysis:');
    analyzeDirectory(staticDir, 'static');
  }

  // Analyze chunks
  const chunksDir = path.join(nextDir, 'static', 'chunks');
  if (fs.existsSync(chunksDir)) {
    console.log('\n📦 JavaScript chunks analysis:');
    analyzeDirectory(chunksDir, 'chunks');
  }

  // Analyze CSS files
  const cssFiles = findFilesByExtension(nextDir, '.css');
  if (cssFiles.length > 0) {
    console.log('\n🎨 CSS files analysis:');
    cssFiles.forEach(file => {
      const size = getFileSize(file);
      console.log(`  ${path.basename(file)}: ${size}KB`);
    });
  }

  // Generate optimization recommendations
  generateRecommendations();
}

function analyzeDirectory(dir, type) {
  const files = fs.readdirSync(dir);
  let totalSize = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const size = getFileSize(filePath);
      totalSize += size;
      
      if (size > 100) { // Only show files larger than 100KB
        console.log(`  ${file}: ${size}KB`);
      }
    }
  });

  console.log(`  Total ${type} size: ${totalSize}KB`);
}

function findFilesByExtension(dir, ext) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scan(itemPath);
      } else if (path.extname(item) === ext) {
        files.push(itemPath);
      }
    });
  }
  
  scan(dir);
  return files;
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

function generateRecommendations() {
  console.log('\n💡 Performance Optimization Recommendations:');
  console.log('\n1. Image Optimization:');
  console.log('   - Convert large images to WebP format');
  console.log('   - Implement responsive images with srcset');
  console.log('   - Use lazy loading for below-the-fold images');
  console.log('   - Compress images to 70-85% quality');
  
  console.log('\n2. JavaScript Optimization:');
  console.log('   - Enable code splitting for large components');
  console.log('   - Use dynamic imports for non-critical features');
  console.log('   - Implement tree shaking to remove unused code');
  console.log('   - Consider using React.lazy() for route-based splitting');
  
  console.log('\n3. CSS Optimization:');
  console.log('   - Inline critical CSS in <head>');
  console.log('   - Load non-critical CSS asynchronously');
  console.log('   - Remove unused CSS with PurgeCSS');
  console.log('   - Use CSS-in-JS with proper optimization');
  
  console.log('\n4. Network Optimization:');
  console.log('   - Enable gzip/brotli compression');
  console.log('   - Implement proper caching headers');
  console.log('   - Use CDN for static assets');
  console.log('   - Optimize font loading with font-display: swap');
  
  console.log('\n5. Core Web Vitals:');
  console.log('   - Target LCP < 2.5s');
  console.log('   - Target FID < 100ms');
  console.log('   - Target CLS < 0.1');
  console.log('   - Minimize layout shifts');
}

// Run bundle analysis
if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };
