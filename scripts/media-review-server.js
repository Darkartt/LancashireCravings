const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Simple static file server for the media review system
class MediaReviewServer {
    constructor() {
        this.port = 3002;
        this.publicDir = path.join(__dirname, '../public');
        this.reviewDir = path.join(__dirname, '../organized-batch-reviews');
        this.visualReviewDir = path.join(__dirname, '../visual-animal-review');
        this.organizedReviewDir = path.join(__dirname, '../organized-visual-review');
    }

    // Get MIME type for file extension
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
            '.mp4': 'video/mp4',
            '.mov': 'video/quicktime'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }

    // Handle file serving
    serveFile(filePath, response) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('File not found');
                return;
            }

            const mimeType = this.getMimeType(filePath);
            response.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=3600'
            });
            response.end(data);
        });
    }

    // Start the server
    start() {
        const server = http.createServer((request, response) => {
            const parsedUrl = url.parse(request.url, true);
            const pathname = parsedUrl.pathname;

            // Enable CORS for local development
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (request.method === 'OPTIONS') {
                response.writeHead(200);
                response.end();
                return;
            }

            console.log(`Request: ${request.method} ${pathname}`);

            // Serve organized visual review files (priority)
            if (pathname.startsWith('/organized-visual-review/')) {
                const fileName = pathname.substring('/organized-visual-review/'.length);
                const filePath = path.join(this.organizedReviewDir, fileName);
                if (fs.existsSync(filePath)) {
                    this.serveFile(filePath, response);
                    return;
                }
            }

            // Serve visual animal review files
            if (pathname.startsWith('/visual-animal-review/')) {
                const fileName = pathname.substring('/visual-animal-review/'.length);
                const filePath = path.join(this.visualReviewDir, fileName);
                if (fs.existsSync(filePath)) {
                    this.serveFile(filePath, response);
                    return;
                }
            }

            // Serve batch review HTML files
            if (pathname.startsWith('/batch-') && pathname.endsWith('.html')) {
                const filePath = path.join(this.reviewDir, pathname.substring(1));
                if (fs.existsSync(filePath)) {
                    this.serveFile(filePath, response);
                    return;
                }
            }

            // Serve index.html from review directory or visual review directory
            if (pathname === '/' || pathname === '/index.html') {
                // Try organized visual review first
                const organizedIndexPath = path.join(this.organizedReviewDir, 'index.html');
                if (fs.existsSync(organizedIndexPath)) {
                    this.serveFile(organizedIndexPath, response);
                    return;
                }
                
                // Try visual review next
                const visualIndexPath = path.join(this.visualReviewDir, 'index.html');
                if (fs.existsSync(visualIndexPath)) {
                    this.serveFile(visualIndexPath, response);
                    return;
                }
                
                // Fallback to batch review
                const indexPath = path.join(this.reviewDir, 'index.html');
                if (fs.existsSync(indexPath)) {
                    this.serveFile(indexPath, response);
                    return;
                }
            }

            // Serve media files
            if (pathname.startsWith('/media/')) {
                const filePath = path.join(this.publicDir, pathname);
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    this.serveFile(filePath, response);
                    return;
                }
            }

            // Serve any other static files from public directory
            if (pathname.startsWith('/public/')) {
                const filePath = path.join(__dirname, '..', pathname);
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    this.serveFile(filePath, response);
                    return;
                }
            }

            // Default 404
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end(`
                <html>
                    <head><title>404 - Not Found</title></head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file <code>${pathname}</code> was not found.</p>
                        <p><a href="/">Go to Media Review Index</a></p>
                    </body>
                </html>
            `);
        });

        server.listen(this.port, () => {
            console.log(`🌐 Media Review Server running at http://localhost:${this.port}`);
            console.log(`📁 Serving media from: ${this.publicDir}`);
            console.log(`📋 Serving reviews from: ${this.reviewDir}`);
            console.log(`\n🎯 Open http://localhost:${this.port} to start reviewing!`);
        });

        // Handle shutdown gracefully
        process.on('SIGINT', () => {
            console.log('\n🛑 Shutting down Media Review Server...');
            server.close(() => {
                console.log('✅ Server closed.');
                process.exit(0);
            });
        });
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const server = new MediaReviewServer();
    server.start();
}

module.exports = MediaReviewServer;
