# 📋 STRATEGIC MANUAL REVIEW PLAN

## Current Status
- **Total files**: 3,604 media files
- **Current structure**: Files organized by filename patterns (automated)
- **Problem**: Filenames don't always match actual content
- **Solution**: Manual visual review + strategic recategorization

## 🎯 IMMEDIATE NEXT STEPS

### Phase 1: Quick Spot Check (30 minutes)
**Goal**: Identify the most obvious misplacements to fix first

1. **Check St Collen folder first** (highest priority)
   - Path: `public/media/projects/stcollen/images/process/` and `/final/`
   - Look for: Fish, aquatic life, other non-statue content
   - Expected: Stone carving, religious statue, Saint Collen

2. **Check Nature/Fish folder**
   - Path: `public/media/nature/fish/`
   - Look for: Non-fish content (statues, other animals, tools)
   - Expected: Real fish, aquatic life, fishing scenes

3. **Check Eagle project**
   - Path: `public/media/projects/eagle/images/process/` and `/final/`
   - Look for: Non-eagle content
   - Expected: Eagle carving progress, eagle-related content

### Phase 2: Create Move List (1 hour)
Based on spot check, create a list of files to move:

```
FILES TO MOVE:
- stcollen_stcollen_XXX.jpg -> nature/fish (if it's actually fish)
- fish_fish_XXX.jpg -> projects/stcollen (if it's actually statue)
- eagle_eagle_XXX.jpg -> nature/birds (if it's real bird, not carving)
```

### Phase 3: Execute Strategic Moves (30 minutes)
- Use the SmartFileMover script to move the most obvious misplacements
- Update media-organized.ts with new structure
- Test website display

## 🔍 QUICK INSPECTION COMMANDS

Open Windows File Explorer and navigate to these folders:

**St Collen Project** (507 files - check for fish/aquatic content):
```
C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\stcollen\images\process
C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\stcollen\images\final
```

**Nature/Fish** (check for non-fish content):
```
C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\nature\fish
```

**Eagle Project** (314 files - check for non-eagle content):
```
C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\eagle\images\process
C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\eagle\images\final
```

## 📝 QUICK REVIEW CHECKLIST

For each folder, spend 5-10 minutes:

### St Collen Folder Review:
- [ ] Open folder in Windows Explorer
- [ ] Enable thumbnail view (large icons)
- [ ] Scroll through images quickly
- [ ] Note any obvious fish/aquatic images
- [ ] Note any obvious non-statue content
- [ ] Record problematic filenames

### Nature/Fish Folder Review:
- [ ] Open folder in Windows Explorer
- [ ] Look for non-fish content (statues, tools, other animals)
- [ ] Note any obvious statue/carving images
- [ ] Record problematic filenames

### Eagle Project Review:
- [ ] Open folder in Windows Explorer
- [ ] Look for non-eagle content
- [ ] Distinguish between eagle carvings vs. real eagles
- [ ] Note any obvious misplacements

## 🚚 MOVE EXECUTION TEMPLATE

After manual review, use this template:

```javascript
// Copy this into a new file: manual-moves.js
const { SmartFileMover } = require('./scripts/smart-file-mover');

async function executeManualMoves() {
    const mover = new SmartFileMover();
    
    // Add your moves here based on review
    // Example moves (replace with actual findings):
    
    // Fish images in St Collen folder
    mover.addMove('projects/stcollen/images/process/stcollen_stcollen_123.jpg', 'nature/fish', 'Actually shows fish, not statue');
    mover.addMove('projects/stcollen/images/final/stcollen_stcollen_456.jpg', 'nature/fish', 'Aquatic life, not statue');
    
    // Statue images in fish folder  
    mover.addMove('nature/fish/fish_fish_789.jpg', 'projects/stcollen', 'Actually shows statue carving');
    
    // Real birds in eagle project (if they're not carvings)
    mover.addMove('projects/eagle/images/process/eagle_eagle_321.jpg', 'nature/birds', 'Real eagle, not carving');
    
    // DRY RUN FIRST
    console.log('🔍 RUNNING DRY RUN...');
    mover.setDryRun(true);
    await mover.executeMoves();
    
    // Ask for confirmation
    const confirm = prompt('Execute moves for real? (y/n): ');
    if (confirm?.toLowerCase() === 'y') {
        mover.setDryRun(false);
        await mover.executeMoves();
        console.log('✅ Moves completed!');
    }
}

executeManualMoves().catch(console.error);
```

## 🎯 SUCCESS CRITERIA

After Phase 1-3, we should have:
- [ ] Most obvious misplacements fixed
- [ ] St Collen folder contains primarily statue/carving images
- [ ] Nature/Fish folder contains primarily fish/aquatic content
- [ ] Eagle project contains primarily eagle carving content
- [ ] Website displays correct images in each section
- [ ] Process/Final tabs show appropriate content

## 📊 TIME ESTIMATE

- **Phase 1 (Spot Check)**: 30 minutes
- **Phase 2 (Move List)**: 1 hour  
- **Phase 3 (Execute)**: 30 minutes
- **Total**: 2 hours for major cleanup

## 🚀 NEXT ACTIONS

1. **Start with St Collen folder** - open in Windows Explorer
2. **Look for obvious fish/aquatic images** - note filenames
3. **Create move list** using template above
4. **Execute moves** using SmartFileMover
5. **Update media-organized.ts** with new structure
6. **Test website** to verify improvements

---

*This strategic approach focuses on the most impactful fixes first, rather than trying to review all 3,604 files at once.*
