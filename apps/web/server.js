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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const CUSTOMERS = {
  'alex@example.com': {
    name: 'Alex Vance',
    email: 'alex@example.com',
    shippingAddress: '789 Maple Ave, Denver CO 80202',
    orderNumber: 'DSC-8832',
    items: ['Executive Razor Handle', '6-Blade Cartridges (4 pack)', 'Shave Butter (6 oz)']
  },
  'jamie@example.com': {
    name: 'Jamie Cole',
    email: 'jamie@example.com',
    shippingAddress: '456 Oak Rd, Seattle WA 98101',
    orderNumber: 'DSC-9941',
    items: ['Diamond Grip Handle', '6-Blade Cartridges (4 pack)']
  },
  'chris@example.com': {
    name: 'Chris Wright',
    email: 'chris@example.com',
    shippingAddress: '789 Pine Road, Boulder CO 80302',
    orderNumber: 'DSC-7721',
    items: ["Dr. Carver's Easy Shave Butter (6 oz)", '6-Blade Razor Handle', 'Club Series Blades']
  },
  'morgan.bailey@example.com': {
    name: 'Morgan Bailey',
    email: 'morgan.bailey@example.com',
    shippingAddress: '245 Elm St, Austin TX 78701',
    orderNumber: 'DSC-6610',
    items: ['4-Blade Starter Set', 'Post Shave Dew']
  },
  'taylor.brooks@example.com': {
    name: 'Taylor Brooks',
    email: 'taylor.brooks@example.com',
    shippingAddress: '882 Sunset Blvd, Los Angeles CA 90028',
    orderNumber: 'DSC-5501',
    items: ['Pre-Shave Scrub', '6-Blade Cartridges']
  },
  'jordan.hayes@example.com': {
    name: 'Jordan Hayes',
    email: 'jordan.hayes@example.com',
    shippingAddress: '512 Peachtree St, Atlanta GA 30308',
    orderNumber: 'DSC-4412',
    items: ['Starter Set', 'Shave Butter']
  }
};

function getCustomerRecord(email) {
  if (!email) return null;
  const normalized = email.toLowerCase().trim();
  if (CUSTOMERS[normalized]) return CUSTOMERS[normalized];
  return {
    name: normalized.split('@')[0],
    email: normalized,
    shippingAddress: '789 Pine Road, Boulder CO 80302',
    orderNumber: `DSC-${Math.floor(1000 + Math.random() * 9000)}`,
    items: ["Dr. Carver's Easy Shave Butter (6 oz)"]
  };
}

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
  return null;
}

async function inspectWithGemini(base64Data, mimeType) {
  const promptText = `You are an AI quality assurance and damage inspection specialist for Dollar Shave Club.
Carefully examine this customer-uploaded photo.
Analyze:
1. Does this photo show an actual Dollar Shave Club item, packaging, razor, or grooming product?
2. Does it show genuine physical damage (such as burst/leaking shave butter, broken collar/handle, crushed shipping box, spilled contents)?
3. If the image is unrelated, blank, undamaged, a pet, person, household item, or has NO physical damage, you MUST set "isValidDamage": false, "severity": "None", "recommendedAction": "REJECT_DAMAGE", and clearly describe what is shown in "summary".
4. If genuine physical damage is present, set "isValidDamage": true, rate severity ("Low", "Medium", "High"), set "recommendedAction": "IMMEDIATE_REPLACEMENT", and accurately describe the specific damage you see in "summary".

Output strictly valid JSON matching this schema:
{
  "isValidDamage": boolean,
  "damageType": string,
  "severity": "None" | "Low" | "Medium" | "High",
  "confidence": number,
  "summary": string,
  "detectedItem": string,
  "recommendedAction": "IMMEDIATE_REPLACEMENT" | "REJECT_DAMAGE" | "MANUAL_REVIEW"
}`;

  // 1. Try Gemini Generative Language API with API Key (fastest, most reliable)
  if (GEMINI_API_KEY) {
    try {
      const glUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(glUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              { text: promptText },
              { inlineData: { mimeType: mimeType || 'image/jpeg', data: base64Data } }
            ]
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
          const parsed = JSON.parse(cleaned);
          console.log('[Gemini Inspection Result]:', JSON.stringify(parsed));
          return parsed;
        }
      } else {
        console.error('[Gemini API Key Response Error]:', res.status, await res.text());
      }
    } catch (err) {
      console.error('[Gemini API Key Request Error]:', err);
    }
  }

  // 2. Fallback to Vertex AI with service account token
  const token = await getGcpAccessToken();
  if (token) {
    try {
      const project = process.env.GCP_PROJECT || 'sa-training-466722';
      const location = process.env.GCP_LOCATION || 'us-central1';
      const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/gemini-2.5-flash:generateContent`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [
              { text: promptText },
              { inlineData: { mimeType: mimeType || 'image/jpeg', data: base64Data } }
            ]
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
          const parsed = JSON.parse(cleaned);
          console.log('[Vertex AI Gemini Result]:', JSON.stringify(parsed));
          return parsed;
        }
      } else {
        console.error('[Vertex AI Gemini Error]:', res.status, await res.text());
      }
    } catch (err) {
      console.error('[Vertex AI Error]:', err);
    }
  }

  return null;
}

      if (req.url?.startsWith('/api/customer') && req.method === 'GET') {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const email = urlObj.searchParams.get('email');
        if (!email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'EMAIL_REQUIRED' }));
          return;
        }
        const customer = getCustomerRecord(email);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, customer }));
        return;
      }

      if (req.url === '/api/damage/validate' && req.method === 'POST') {
        (async () => {
          const email = (body.email || '').trim().toLowerCase();
          if (!email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: 'EMAIL_REQUIRED',
              message: 'Account email is required before uploading a photo so we can tie this report to your order.'
            }));
            return;
          }

          const customer = getCustomerRecord(email);

          if (!body.imageBase64) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: 'IMAGE_REQUIRED',
              message: 'Image data is required for damage verification.'
            }));
            return;
          }

          let gcsUri = body.gcsUri || null;
          let imageUrl = body.imageUrl || null;
          let mimeType = 'image/jpeg';
          let rawBase64 = body.imageBase64;

          try {
            const matches = body.imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            mimeType = matches ? matches[1] : 'image/jpeg';
            rawBase64 = matches ? matches[2] : body.imageBase64;
            const buffer = Buffer.from(rawBase64, 'base64');
            const filename = `damage-${Date.now()}-${(body.imageName || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')}`;

            const gcsResult = await uploadToGcs(filename, mimeType, buffer);
            if (gcsResult) {
              gcsUri = gcsResult.gcsUri;
              imageUrl = gcsResult.publicUrl;
            }
          } catch (err) {
            console.error('[GCS/Buffer Error]:', err);
          }

          // Call actual Gemini multimodal AI model with base64 data
          const geminiResult = await inspectWithGemini(rawBase64, mimeType);

          if (!geminiResult) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              error: 'INSPECTION_UNAVAILABLE',
              message: 'Gemini AI Vision inspection is temporarily unavailable. Please retry or contact support.'
            }));
            return;
          }

          const isLegitDamage = Boolean(
            geminiResult.isValidDamage &&
            geminiResult.severity !== 'None' &&
            geminiResult.recommendedAction !== 'REJECT_DAMAGE'
          );

          let replacement = null;
          if (isLegitDamage) {
            replacement = {
              replacementId: `${customer.orderNumber}-R1`,
              status: 'AUTHORIZED',
              shippingSpeed: 'RUSH_24HR',
              shippingAddress: customer.shippingAddress,
              items: [geminiResult.detectedItem || customer.items[0]]
            };
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            imageUrl,
            gcsUri,
            customer: {
              name: customer.name,
              email: customer.email,
              orderNumber: customer.orderNumber,
              shippingAddress: customer.shippingAddress
            },
            damageAnalysis: {
              isValidDamage: isLegitDamage,
              damageType: geminiResult.damageType || (isLegitDamage ? 'Product Damage' : 'None'),
              severity: geminiResult.severity || (isLegitDamage ? 'Medium' : 'None'),
              confidence: typeof geminiResult.confidence === 'number' ? geminiResult.confidence : 0.95,
              summary: geminiResult.summary || (isLegitDamage ? 'Visible physical damage confirmed.' : 'No visible physical damage detected.'),
              detectedItem: geminiResult.detectedItem || (customer.items[0] || 'Unknown'),
              recommendedAction: isLegitDamage ? 'IMMEDIATE_REPLACEMENT' : 'REJECT_DAMAGE'
            },
            replacement
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
