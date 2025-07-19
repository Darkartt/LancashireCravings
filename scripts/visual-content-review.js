const fs = require('fs');
const path = require('path');

/**
 * Visual Content Review Tool
 * Creates a systematic review process for manually categorizing images
 * by their actual visual content rather than filename patterns
 */

async function createVisualReviewReport() {
    const mediaDir = path.join(__dirname, '../public/media');
    const reviewReport = {
        timestamp: new Date().toISOString(),
        totalFiles: 0,
        reviewSections: [],
        instructions: `
VISUAL CONTENT REVIEW INSTRUCTIONS:
1. Open each folder in file explorer
2. Look at thumbnail previews or open individual files
3. Categorize based on ACTUAL CONTENT, not filename
4. Use the categories below to organize files properly

CATEGORIES TO LOOK FOR:
- PROJECTS:
  * Eagle carvings (any stage)
  * Nessie/Loch Ness monster carvings
  * Bass fish carvings
  * St Collen statue carvings
  * Other specific carving projects

- NATURE SUBJECTS:
  * Insects: butterflies, dragonflies, bees, beetles
  * Birds: owls, crows, eagles (live birds, not carvings)
  * Fish: real fish, aquatic life
  * Mammals: squirrels, dogs, cats, etc.
  * Flowers: garden flowers, floral arrangements
  * Landscapes: outdoor scenes, nature views
  * Portraits: people, selfies, family photos
  * Artistic: creative compositions, abstract nature

- WORKSHOP:
  * Tools: carving tools, equipment closeups
  * Techniques: hands-on carving demonstrations
  * Environment: workshop setup, workspace views
        `
    };

    // Get all subdirectories that might contain misplaced files
    const dirsToReview = [
        'projects/eagle',
        'projects/nessie', 
        'projects/bass',
        'projects/stcollen',
        'nature/insects',
        'nature/birds',
        'nature/fish',
        'nature/mammals',
        'nature/flowers',
        'nature/landscapes',
        'nature/portraits',
        'nature/artistic',
        'workshop'
    ];

    for (const dir of dirsToReview) {
        const fullPath = path.join(mediaDir, dir);
        if (fs.existsSync(fullPath)) {
            const reviewSection = await createReviewSection(fullPath, dir);
            reviewReport.reviewSections.push(reviewSection);
            reviewReport.totalFiles += reviewSection.fileCount;
        }
    }

    // Save the review report
    const reportPath = path.join(__dirname, '../visual-content-review-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reviewReport, null, 2));
    
    // Create a simple text checklist for manual review
    const checklistPath = path.join(__dirname, '../VISUAL_REVIEW_CHECKLIST.md');
    createReviewChecklist(reviewReport, checklistPath);
    
    console.log(`\n🎯 VISUAL CONTENT REVIEW REPORT CREATED`);
    console.log(`📊 Total files to review: ${reviewReport.totalFiles}`);
    console.log(`📋 Review checklist: ${checklistPath}`);
    console.log(`📄 Detailed report: ${reportPath}`);
    
    return reviewReport;
}

async function createReviewSection(dirPath, categoryName) {
    const section = {
        category: categoryName,
        path: dirPath,
        fileCount: 0,
        sampleFiles: [],
        needsReview: true,
        possibleIssues: []
    };

    try {
        // Get all files in directory and subdirectories
        const files = getAllFilesRecursive(dirPath);
        const mediaFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|mov|mp4|avi|webm)$/i.test(file)
        );

        section.fileCount = mediaFiles.length;
        
        // Take sample files for review (first 5 and last 5)
        const sampleCount = Math.min(10, mediaFiles.length);
        const firstFive = mediaFiles.slice(0, 5);
        const lastFive = mediaFiles.slice(-5);
        section.sampleFiles = [...new Set([...firstFive, ...lastFive])];

        // Flag potential issues based on category and filenames
        section.possibleIssues = identifyPotentialIssues(categoryName, mediaFiles);

    } catch (error) {
        console.error(`Error processing ${dirPath}:`, error.message);
        section.error = error.message;
    }

    return section;
}

function getAllFilesRecursive(dir) {
    let files = [];
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                files = files.concat(getAllFilesRecursive(fullPath));
            } else {
                files.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }
    return files;
}

function identifyPotentialIssues(categoryName, files) {
    const issues = [];
    
    // Look for files that might be misplaced based on patterns
    const patterns = {
        'projects/stcollen': {
            suspicious: ['fish', 'aquatic', 'water', 'bass', 'trout'],
            expected: ['statue', 'stone', 'carving', 'religious', 'saint']
        },
        'projects/eagle': {
            suspicious: ['fish', 'water', 'aquatic', 'statue'],
            expected: ['bird', 'eagle', 'carving', 'wood']
        },
        'nature/fish': {
            suspicious: ['statue', 'carving', 'wood', 'tool'],
            expected: ['fish', 'aquatic', 'water', 'bass', 'trout']
        },
        'nature/portraits': {
            suspicious: ['fish', 'carving', 'wood', 'tool'],
            expected: ['person', 'face', 'portrait', 'selfie']
        }
    };

    const categoryPatterns = patterns[categoryName];
    if (categoryPatterns) {
        const filenames = files.map(f => path.basename(f).toLowerCase());
        
        for (const filename of filenames) {
            for (const suspicious of categoryPatterns.suspicious) {
                if (filename.includes(suspicious)) {
                    issues.push(`File "${filename}" contains suspicious keyword "${suspicious}" for category ${categoryName}`);
                }
            }
        }
    }

    return issues;
}

function createReviewChecklist(report, checklistPath) {
    let checklist = `# 📋 VISUAL CONTENT REVIEW CHECKLIST

## Overview
- **Total files to review**: ${report.totalFiles}
- **Review sections**: ${report.reviewSections.length}
- **Created**: ${new Date(report.timestamp).toLocaleString()}

## 🎯 REVIEW INSTRUCTIONS

### For Each Section Below:
1. **Open the folder** in Windows File Explorer
2. **Look at image thumbnails** (enable preview mode)
3. **Check if content matches the folder name**
4. **Note any misplaced files** that need to be moved
5. **Mark section as ✅ REVIEWED** when complete

---

`;

    for (const section of report.reviewSections) {
        checklist += `## ${section.category.toUpperCase()} - ${section.fileCount} files

**📁 Folder**: \`${section.path}\`

**❓ Questions to ask while reviewing:**
- Do these images/videos actually show ${section.category.split('/').pop()}?
- Are there any files that clearly belong in a different category?
- Are the file names descriptive enough or completely random?

**🔍 Sample files to check:**
${section.sampleFiles.map(file => `- \`${path.basename(file)}\``).join('\n')}

**⚠️ Potential issues detected:**
${section.possibleIssues.length > 0 ? 
    section.possibleIssues.map(issue => `- ${issue}`).join('\n') : 
    '- No automatic issues detected'}

**📝 Manual review notes:**
- [ ] Content matches folder category
- [ ] No obvious misplaced files
- [ ] File names are appropriate
- [ ] ✅ SECTION REVIEWED

**🚚 Files to move (if any):**
\`\`\`
# List any files that need to be moved to different categories
# Format: filename.jpg -> correct/category/folder/
\`\`\`

---

`;
    }

    checklist += `## 📊 REVIEW SUMMARY

**Sections completed**: __ / ${report.reviewSections.length}

**Total files that need moving**: ____

**Next steps after review:**
1. Create a file moving script based on your notes
2. Update the media-organized.ts file with correct categorizations
3. Test the website to ensure all images display properly

---

## 🚀 WHEN REVIEW IS COMPLETE

After completing this manual review, you'll have a clear list of:
- Files that are correctly categorized
- Files that need to be moved to different categories
- Actual content types for proper website integration

This will allow us to create accurate categorization and ensure the website displays the right content in each section.
`;

    fs.writeFileSync(checklistPath, checklist);
}

// Run the visual review report creation
if (require.main === module) {
    createVisualReviewReport()
        .then(() => {
            console.log('\n✅ Visual content review setup complete!');
            console.log('📋 Next step: Open VISUAL_REVIEW_CHECKLIST.md and start reviewing folders');
        })
        .catch(error => {
            console.error('❌ Error creating visual review:', error);
        });
}

module.exports = { createVisualReviewReport };
