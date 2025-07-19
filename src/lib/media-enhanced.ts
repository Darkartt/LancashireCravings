// Enhanced Media System with comprehensive file inclusion
// This file includes as many actual media files as possible from the media folders

import { MediaItem } from './media-organized';

// Extended media data including more files from each folder
export function getComprehensiveMediaItems(projectId: string): MediaItem[] {
  const mediaItems: MediaItem[] = [];

  // Golden Eagle Project - ALL 54 files
  if (projectId === 'golden-eagle') {
    // Main video
    mediaItems.push({
      id: 'eagle-main-video',
      type: 'video',
      src: '/media/Eagle/Golden eagle - By Christian Lancaster.MP4',
      alt: 'Golden Eagle - Complete carving process time-lapse by Christian Lancaster',
      category: 'final',
      project: projectId,
      order: 0,
      featured: true,
      duration: '8:45'
    });

    // Process videos
    mediaItems.push({
      id: 'eagle-process-video-1',
      type: 'video',
      src: '/media/Eagle/IMG_2703.mp4',
      alt: 'Golden Eagle - Detail carving process video',
      category: 'process',
      project: projectId,
      order: 1,
      duration: '2:15'
    });

    mediaItems.push({
      id: 'eagle-process-video-2',
      type: 'video',
      src: '/media/Eagle/IMG_2799.MOV',
      alt: 'Golden Eagle - Finishing techniques demonstration',
      category: 'process',
      project: projectId,
      order: 2,
      duration: '1:45'
    });

    // ALL Eagle photos (51 images)
    const eagleFiles = [
      'IMG_2056.JPG', 'IMG_2063.JPG', 'IMG_2075.JPG', 'IMG_2089.JPG', 'IMG_2095.JPG',
      'IMG_2130.JPG', 'IMG_2255.JPG', 'IMG_2256.JPG', 'IMG_2261.JPG', 'IMG_2284.JPG',
      'IMG_2285.JPG', 'IMG_2286.JPG', 'IMG_2287.JPG', 'IMG_2294.JPG', 'IMG_2297.JPG',
      'IMG_2298.JPG', 'IMG_2443.JPG', 'IMG_2444.JPG', 'IMG_2448.JPG', 'IMG_2450.JPG',
      'IMG_2452.JPG', 'IMG_2455.JPG', 'IMG_2457.JPG', 'IMG_2465.JPG', 'IMG_2466.JPG',
      'IMG_2497.JPG', 'IMG_2498.JPG', 'IMG_2501.JPG', 'IMG_2508.JPG', 'IMG_2516.JPG',
      'IMG_2523.JPG', 'IMG_2529.JPG', 'IMG_2547.JPG', 'IMG_2549.JPG', 'IMG_2594.JPG',
      'IMG_2679.JPG', 'IMG_2705.JPG', 'IMG_2715.JPG', 'IMG_2731.JPG', 'IMG_2733.JPG',
      'IMG_2736.JPG', 'IMG_2741.JPG', 'IMG_2770.JPG', 'IMG_2781.JPG', 'IMG_2787.JPG',
      'IMG_2790.JPG', 'IMG_2802.JPG', 'IMG_2803.JPG', 'IMG_2804.JPG', 'IMG_2805.JPG',
      'IMG_2806.JPG', 'IMG_2965.JPG', 'IMG_3177.JPG', 'IMG_3217.JPG'
    ];

    eagleFiles.forEach((file, index) => {
      const isFinished = index > 40 || file.includes('2965') || file.includes('3177') || file.includes('3217') || file.includes('2056');
      const isFeatured = file.includes('2056') || file.includes('2965') || file.includes('3217');
      
      mediaItems.push({
        id: `eagle-img-${index}`,
        type: 'image',
        src: `/media/Eagle/${file}`,
        alt: `Golden Eagle - ${isFinished ? 'Finished masterpiece' : 'Carving process'} step ${index + 1}`,
        category: isFinished ? 'final' : 'process',
        project: projectId,
        featured: isFeatured,
        order: index + 3,
        filename: file
      });
    });
  }

  // Nessie Project - ALL 39 files
  if (projectId === 'loch-ness-monster') {
    const nessieFiles = [
      'IMG_1498.JPG', 'IMG_1499.JPG', 'IMG_1500.JPG', 'IMG_1501.JPG', 'IMG_1504.JPG',
      'IMG_1505.JPG', 'IMG_1506.JPG', 'IMG_1507.JPG', 'IMG_1508.JPG', 'IMG_1509.JPG',
      'IMG_1510.JPG', 'IMG_1511.JPG', 'IMG_1512.JPG', 'IMG_1513.JPG', 'IMG_1514.JPG',
      'IMG_1515.JPG', 'IMG_1516.JPG', 'IMG_1517.JPG', 'IMG_1519.JPG', 'IMG_1521.JPG',
      'IMG_1522.JPG', 'IMG_1523.JPG', 'IMG_1524.JPG', 'IMG_1526.JPG', 'IMG_1527.JPG',
      'IMG_1528.JPG', 'IMG_1534.JPG', 'IMG_1536.JPG', 'IMG_1537.JPG', 'IMG_1538.JPG',
      'IMG_1539.JPG', 'IMG_1552.JPG', 'IMG_1553.JPG', 'IMG_1554.JPG', 'IMG_1555.JPG',
      'IMG_1556.JPG', 'IMG_1557.JPG', 'IMG_1558.JPG', 'IMG_1559.JPG'
    ];

    nessieFiles.forEach((file, index) => {
      const isFinished = index > 30 || file.includes('1555') || file.includes('1556') || file.includes('1557') || file.includes('1558') || file.includes('1559');
      const isFeatured = file.includes('1498') || file.includes('1556') || file.includes('1559');
      
      mediaItems.push({
        id: `nessie-img-${index}`,
        type: 'image',
        src: `/media/Nessie/${file}`,
        alt: `Nessie (Loch Ness Monster) - ${isFinished ? 'Finished sculpture' : 'Carving process'} step ${index + 1}`,
        category: isFinished ? 'final' : 'process',
        project: projectId,
        featured: isFeatured,
        order: index,
        filename: file
      });
    });
  }

  // Richard Peacock Bass - ALL 65 files (images and videos)
  if (projectId === 'richard-peacock-bass') {
    // Main video
    mediaItems.push({
      id: 'bass-main-video',
      type: 'video',
      src: '/media/Richard Peacock Bass/1080p.mov',
      alt: 'Richard Peacock Bass - High definition carving showcase',
      category: 'final',
      project: projectId,
      order: 0,
      featured: true,
      duration: '4:20'
    });

    // ALL image files
    const bassImageFiles = [
      '9A013949-A97C-4CBE-AE69-AF415505A823.jpg', 'IMG_1106.JPEG', 'IMG_1107.JPG', 'IMG_1111.JPG',
      'IMG_1180.JPG', 'IMG_1184.JPEG', 'IMG_1200.JPEG', 'IMG_1201.JPEG', 'IMG_1211.JPEG',
      'IMG_1220.JPEG', 'IMG_1228.JPEG', 'IMG_1229.JPEG', 'IMG_1230.JPEG', 'IMG_1232.JPG',
      'IMG_1234.JPG', 'IMG_1236.JPEG', 'IMG_1238.JPEG', 'IMG_1239.JPG', 'IMG_1257.JPEG',
      'IMG_1264.JPEG', 'IMG_1266.JPEG', 'IMG_1267.JPEG', 'IMG_1268.JPEG', 'IMG_1278.JPEG',
      'IMG_1279.JPEG', 'IMG_1284.JPEG', 'IMG_1286.JPEG', 'IMG_1287.JPEG', 'IMG_1288.JPEG',
      'IMG_1289.JPEG', 'IMG_1291.JPEG', 'IMG_1293.JPEG', 'IMG_1294.JPEG', 'IMG_1297.JPEG',
      'IMG_1298.JPEG', 'IMG_1305.JPEG', 'IMG_1306.JPG', 'IMG_1307.JPG', 'IMG_1308.JPEG',
      'IMG_1309.JPG', 'IMG_1310.JPEG', 'IMG_1311.JPG', 'IMG_1312.JPG', 'IMG_1313.JPG',
      'IMG_1314.JPEG', 'IMG_1347.JPEG', 'IMG_1358.JPEG', 'IMG_1363.JPEG', 'IMG_1366.JPEG',
      'IMG_1367.JPEG', 'IMG_1369.JPEG', 'IMG_1372.JPEG', 'IMG_1373.JPEG', 'IMG_1374.JPEG'
    ];

    bassImageFiles.forEach((file, index) => {
      const isFinished = index > 35 || file.includes('1347') || file.includes('1358') || file.includes('1374') || file.includes('1106');
      const isFeatured = file.includes('1106') || file.includes('1347') || file.includes('1374');
      
      mediaItems.push({
        id: `bass-img-${index}`,
        type: 'image',
        src: `/media/Richard Peacock Bass/${file}`,
        alt: `Richard Peacock Bass - ${isFinished ? 'Finished commission' : 'Carving process'} step ${index + 1}`,
        category: isFinished ? 'final' : 'process',
        project: projectId,
        featured: isFeatured,
        order: index + 1,
        filename: file
      });
    });

    // ALL video files
    const bassVideoFiles = [
      'IMG_1347.MOV', 'IMG_1358.MOV', 'IMG_1363.MOV', 'IMG_1366.MOV', 'IMG_1367.MOV',
      'IMG_1369.MOV', 'IMG_1372.MOV', 'IMG_1373.MOV', 'IMG_1374.MOV', 'IMG_1375.MP4'
    ];

    bassVideoFiles.forEach((file, index) => {
      mediaItems.push({
        id: `bass-video-${index}`,
        type: 'video',
        src: `/media/Richard Peacock Bass/${file}`,
        alt: `Richard Peacock Bass - Process video ${index + 1}`,
        category: 'process',
        project: projectId,
        order: index + bassImageFiles.length + 1,
        duration: '0:30-2:00',
        filename: file
      });
    });
  }

  return mediaItems.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Export enhanced function
export function getEnhancedMediaItems(projectId: string): MediaItem[] {
  // First try the comprehensive version with all files
  const comprehensiveItems = getComprehensiveMediaItems(projectId);
  if (comprehensiveItems.length > 0) {
    return comprehensiveItems;
  }
  
  // Fallback to original function if needed
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getMediaItemsForProject } = require('./media-new');
  return getMediaItemsForProject(projectId);
}
