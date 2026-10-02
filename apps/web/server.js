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

async function getGcpAccessToken() {
  try {
    const metaRes = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
      headers: { 'Metadata-Flavor': 'Google' },
      signal: AbortSignal.timeout(1500)
    });
    if (metaRes.ok) {
      const data = await metaRes.json();
      if (data && data.access_token) return data.access_token;
    }
  } catch (_) {}

  try {
    const { execSync } = await import('child_process');
    const token = execSync('gcloud auth print-access-token', { encoding: 'utf8', timeout: 3000 }).trim();
    if (token && token.length > 20) return token;
  } catch (_) {}

  return null;
}

async function uploadToGcs(filename, mimeType, buffer) {
  const token = await getGcpAccessToken();
  const bucket = process.env.DAMAGE_BUCKET || 'sa-training-466722-damage-photos';
  const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(filename)}`;
  const headers = { 'Content-Type': mimeType || 'image/jpeg' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(uploadUrl, { method: 'POST', headers, body: buffer });
    if (res.ok) {
      return {
        gcsUri: `gs://${bucket}/${filename}`,
        publicUrl: `https://storage.googleapis.com/${bucket}/${filename}`
      };
    }
  } catch (err) {
    console.error('[GCS Upload Error]:', err);
  }
  return {
    gcsUri: `gs://${bucket}/${filename}`,
    publicUrl: `https://storage.googleapis.com/${bucket}/${filename}`
  };
}

async function inspectWithGemini(base64Data, mimeType, gcsUri) {
  const token = await getGcpAccessToken();
  if (!token) return null;

  const project = process.env.GCP_PROJECT || 'sa-training-466722';
  const location = process.env.GCP_LOCATION || 'us-central1';
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/gemini-2.5-flash:generateContent`;

  const part = gcsUri
    ? { fileData: { mimeType: mimeType || 'image/jpeg', fileUri: gcsUri } }
    : { inlineData: { mimeType: mimeType || 'image/jpeg', data: base64Data } };

  const promptText = `Analyze this photo of a customer product. Identify signs of damage (cracks, leaks, dents, cosmetic defects, ruptured packaging, spilled contents) and rate severity as Low, Medium, or High. Output strictly valid JSON matching this schema:
{
  "isValidDamage": boolean,
  "damageType": string,
  "severity": "Low" | "Medium" | "High",
  "confidence": number,
  "summary": string,
  "detectedItem": string
}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: promptText }, part]
        }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(cleaned);
      }
    }
  } catch (err) {
    console.error('[Gemini Vision Error]:', err);
  }
  return null;
}

      if (req.url === '/api/damage/validate' && req.method === 'POST') {
        (async () => {
          const item = body.item || "Dr. Carver's Easy Shave Butter (6 oz)";
          const desc = body.description || body.imageName || '';
          let damageType = 'EXPLODED_CONTAINER';
          let confidence = 0.98;
          let summary = 'Visual inspection verified: Shave Butter container rupture with pressurized seal failure and product discharge across package.';
          let severity = 'High';
          let detectedItem = item;
          let gcsUri = body.gcsUri || null;
          let imageUrl = body.imageUrl || null;

          if (body.imageBase64) {
            try {
              const matches = body.imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              const mimeType = matches ? matches[1] : 'image/jpeg';
              const rawBase64 = matches ? matches[2] : body.imageBase64;
              const buffer = Buffer.from(rawBase64, 'base64');
              const filename = `damage-${Date.now()}-${(body.imageName || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')}`;

              const gcsResult = await uploadToGcs(filename, mimeType, buffer);
              if (gcsResult) {
                gcsUri = gcsResult.gcsUri;
                imageUrl = gcsResult.publicUrl;
              }

              const geminiResult = await inspectWithGemini(rawBase64, mimeType, gcsUri);
              if (geminiResult) {
                damageType = geminiResult.damageType || damageType;
                confidence = geminiResult.confidence || confidence;
                summary = geminiResult.summary || summary;
                severity = geminiResult.severity || severity;
                if (geminiResult.detectedItem) detectedItem = geminiResult.detectedItem;
              }
            } catch (err) {
              console.error('[Damage Validation Error]:', err);
            }
          }

          const repId = `${body.originalOrderNumber || 'DSC-7721'}-R1`;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            imageUrl,
            gcsUri,
            damageAnalysis: {
              isValidDamage: true,
              damageType,
              severity,
              confidence,
              summary,
              detectedItem,
              recommendedAction: 'IMMEDIATE_REPLACEMENT'
            },
            replacement: {
              replacementId: repId,
              status: 'AUTHORIZED',
              shippingSpeed: 'RUSH_24HR',
              shippingAddress: '789 Pine Road, Boulder CO 80302',
              items: [item || detectedItem]
            }
          }));
        })().catch((err) => {
          console.error('[Damage Endpoint Error]:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        });
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
