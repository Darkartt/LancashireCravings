const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Simple local web server to serve media files for visual inspection
 */

class MediaServer {
    constructor(port = 3001) {
        this.port = port;
        this.publicDir = path.join(__dirname, '../public');
        this.inspectionDir = path.join(__dirname, '../inspection-reports');
    }

    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log(`🌐 Media server running at http://localhost:${this.port}`);
            console.log(`📁 Serving from: ${this.publicDir}`);
            console.log(`📋 Inspection reports: ${this.inspectionDir}`);
        });

        return server;
    }

    handleRequest(req, res) {
        try {
            let filePath;
            
            // Handle inspection report requests
            if (req.url.startsWith('/inspection/')) {
                filePath = path.join(this.inspectionDir, req.url.replace('/inspection/', ''));
            }
            // Handle media file requests
            else if (req.url.startsWith('/media/')) {
                filePath = path.join(this.publicDir, req.url);
            }
            // Handle root inspection files
            else if (req.url.endsWith('.html')) {
                filePath = path.join(this.inspectionDir, req.url.substring(1));
            }
            // Default to public directory
            else {
                filePath = path.join(this.publicDir, req.url);
            }

            // Security check - ensure file is within allowed directories
            const resolvedPath = path.resolve(filePath);
            const allowedPaths = [
                path.resolve(this.publicDir),
                path.resolve(this.inspectionDir)
            ];
            
            const isAllowed = allowedPaths.some(allowedPath => 
                resolvedPath.startsWith(allowedPath)
            );

            if (!isAllowed) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            // Determine content type
            const ext = path.extname(filePath).toLowerCase();
            const contentTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.mp4': 'video/mp4',
                '.mov': 'video/quicktime'
            };

            const contentType = contentTypes[ext] || 'application/octet-stream';

            // Set headers
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });

            // Stream the file
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

        } catch (error) {
            console.error('Server error:', error);
            res.writeHead(500);
            res.end('Internal server error');
        }
    }
}

// Start server if run directly
if (require.main === module) {
    const server = new MediaServer();
    server.start();
    
    console.log('\n📋 Open these URLs in your browser:');
    console.log('   - St Collen: http://localhost:3001/stcollen-inspection.html');
    console.log('   - Eagle: http://localhost:3001/eagle-inspection.html');
    console.log('   - Bass: http://localhost:3001/bass-inspection.html');
    console.log('   - Nessie: http://localhost:3001/nessie-inspection.html');
    console.log('\n⏹️  Press Ctrl+C to stop the server');
}

module.exports = { MediaServer };
