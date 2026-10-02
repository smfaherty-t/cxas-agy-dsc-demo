import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT || '8080', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Healthcheck endpoint
  if (req.url === '/_healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Handle embedded API endpoints
  if (req.url && req.url.startsWith('/api/')) {
    let bodyStr = '';
    req.on('data', (chunk) => { bodyStr += chunk; });
    req.on('end', () => {
      let body = {};
      try {
        if (bodyStr) body = JSON.parse(bodyStr);
      } catch (_) {}

      if (req.url === '/api/damage/validate' && req.method === 'POST') {
        const item = body.item || "Dr. Carver's Easy Shave Butter (6 oz)";
        const desc = body.description || body.imageName || '';
        const isButter = item.toLowerCase().includes('butter') || desc.toLowerCase().includes('butter');
        const isHandle = item.toLowerCase().includes('handle') || desc.toLowerCase().includes('handle');
        const damageType = isButter ? 'EXPLODED_CONTAINER' : (isHandle ? 'BROKEN_HARDWARE' : 'TRANSIT_CRUSH_DAMAGE');
        const confidence = isButter ? 0.98 : 0.96;
        const summary = isButter
          ? 'Visual inspection verified: Shave Butter container rupture with pressurized seal failure and product discharge across package.'
          : 'Visual inspection verified: Mechanical collar fracture along razor cartridge mount.';

        const repId = `${body.originalOrderNumber || 'DSC-7721'}-R1`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          damageAnalysis: {
            isValidDamage: true,
            damageType,
            confidence,
            summary,
            recommendedAction: 'IMMEDIATE_REPLACEMENT'
          },
          replacement: {
            replacementId: repId,
            status: 'AUTHORIZED',
            shippingSpeed: 'RUSH_24HR',
            shippingAddress: '789 Pine Road, Boulder CO 80302',
            items: [item]
          }
        }));
        return;
      }

      if (req.url === '/api/subscriptions/cadence' && req.method === 'POST') {
        const cadence = body.newCadence || 'Every 2 Months';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Subscription cadence successfully updated to ${cadence}. Next box scheduled accordingly.`,
          subscription: {
            status: 'ACTIVE',
            cadence: cadence,
            nextBoxDate: '2026-12-01'
          }
        }));
        return;
      }

      // Default fallback for other /api routes
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, timestamp: new Date().toISOString() }));
    });
    return;
  }

  // Sanitize path to prevent directory traversal
  let reqPath = decodeURI(req.url?.split('?')[0] || '/');
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, reqPath);

  // If path is directory or doesn't exist, fallback to index.html (SPA)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Dollar Shave Club Demo server running on port ${PORT}`);
});
