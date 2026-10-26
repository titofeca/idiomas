// Production Server for Railway / Render / VPS
// Serves the Vite dist/ build with SPA fallback and optionally runs the Telegram Bot
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 5173;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

// In-memory + file-backed family scoreboard state for Father vs Son
const DATA_FILE = path.join(__dirname, 'family-data.json');
let familyState = {
  son: {
    role: 'son',
    telegramId: null,
    name: 'Mario',
    minutes: 0,
    streak: 0,
    xp: 0,
    avatar: '👦',
    updatedAt: Date.now(),
  },
  father: {
    role: 'father',
    telegramId: null,
    name: 'Tito',
    minutes: 0,
    streak: 0,
    xp: 0,
    avatar: '🧔',
    updatedAt: Date.now(),
  },
};

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    familyState = { ...familyState, ...JSON.parse(raw) };
  }
} catch (e) {
  console.warn('Could not load family-data.json:', e.message);
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // API endpoint for Father vs Son cloud synchronization
  if (urlPath === '/api/family') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(familyState));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const role = payload.role;
          if (role === 'son' || role === 'father') {
            familyState[role] = {
              ...familyState[role],
              ...payload,
              updatedAt: Date.now(),
            };
            try {
              fs.writeFileSync(DATA_FILE, JSON.stringify(familyState, null, 2));
            } catch (fsErr) {
              console.warn('Could not write family-data.json', fsErr.message);
            }
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, family: familyState }));
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }
  }

  let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback: serve index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Build not found. Run "npm run build" first.');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(content);
      });
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 LinguaQuest en producción escuchando en http://${HOST}:${PORT}`);
  console.log(`📁 Sirviendo archivos estáticos desde: ${DIST_DIR}`);

  // Optional: Start Telegram Bot in the same process if token is configured
  if (process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN) {
    import('./telegram-bot/bot.mjs').catch((err) => {
      console.warn('No se pudo inicializar el bot de Telegram en este proceso:', err.message);
    });
  }
});
