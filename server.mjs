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

// In-memory + file-backed family scoreboard state for Father vs Son and dynamic members
const DATA_FILE = path.join(__dirname, 'family-data.json');
let familyDb = {
  users: {
    son: {
      id: 'son',
      role: 'son',
      telegramId: null,
      name: 'Mario',
      avatar: '👦',
      ageDesc: '13 años • Secundaria',
      level: 3,
      league: 'Oro',
      xp: 180,
      gems: 120,
      streak: 4,
      minutes: 18,
      todayMinutes: 18,
      goalMinutes: 45,
      streakShields: 2,
      historyTopics: ['en-gaming'],
      unlockedAchievements: ['first_lesson', 'tone_sniper'],
      updatedAt: Date.now(),
    },
    father: {
      id: 'father',
      role: 'father',
      telegramId: null,
      name: 'Tito',
      avatar: '🧔',
      ageDesc: 'Papá • Mentor',
      level: 2,
      league: 'Plata',
      xp: 110,
      gems: 70,
      streak: 3,
      minutes: 12,
      todayMinutes: 12,
      goalMinutes: 30,
      streakShields: 1,
      historyTopics: ['en-travel-coffee'],
      unlockedAchievements: ['first_lesson'],
      updatedAt: Date.now(),
    },
  },
  members: ['son', 'father'],
};

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.users) {
      familyDb = { ...familyDb, ...parsed, users: { ...familyDb.users, ...parsed.users } };
    } else {
      // Migrate legacy flat state
      if (parsed.son) familyDb.users.son = { ...familyDb.users.son, ...parsed.son };
      if (parsed.father) familyDb.users.father = { ...familyDb.users.father, ...parsed.father };
    }
  }
} catch (e) {
  console.warn('Could not load family-data.json:', e.message);
}

const saveDb = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(familyDb, null, 2));
  } catch (fsErr) {
    console.warn('Could not write family-data.json', fsErr.message);
  }
};

const server = http.createServer((req, res) => {
  const [urlPath, queryString] = req.url.split('?');
  const params = new URLSearchParams(queryString || '');

  // Enable CORS for API routes
  if (urlPath.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // GET /api/family - returns full scoreboard and members
    if (urlPath === '/api/family' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        son: familyDb.users.son,
        father: familyDb.users.father,
        users: familyDb.users,
        members: familyDb.members,
      }));
      return;
    }

    // POST /api/family - updates any user/role profile with full persistence
    if (urlPath === '/api/family' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const userId = payload.id || payload.role || (payload.telegramId ? `tg_${payload.telegramId}` : null);
          if (userId) {
            const existing = familyDb.users[userId] || {};
            familyDb.users[userId] = {
              ...existing,
              ...payload,
              id: userId,
              updatedAt: Date.now(),
            };
            if (!familyDb.members.includes(userId)) {
              familyDb.members.push(userId);
            }
            saveDb();
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            son: familyDb.users.son,
            father: familyDb.users.father,
            users: familyDb.users,
            members: familyDb.members,
          }));
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    // POST /api/family/add-member - Add a new family member (Mom, Brother, Friend)
    if (urlPath === '/api/family/add-member' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const name = (payload.name || 'Nuevo Miembro').trim();
          const memberId = payload.id || `member_${Date.now()}`;
          const newMember = {
            id: memberId,
            role: payload.role || 'member',
            telegramId: payload.telegramId || null,
            name,
            avatar: payload.avatar || '⭐',
            ageDesc: payload.ageDesc || 'Familiar',
            level: 1,
            league: 'Bronce',
            xp: 0,
            gems: 50,
            streak: 1,
            minutes: 0,
            todayMinutes: 0,
            goalMinutes: 30,
            streakShields: 1,
            historyTopics: [],
            unlockedAchievements: ['first_lesson'],
            updatedAt: Date.now(),
          };
          familyDb.users[memberId] = newMember;
          if (!familyDb.members.includes(memberId)) {
            familyDb.members.push(memberId);
          }
          saveDb();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, member: newMember, users: familyDb.users, members: familyDb.members }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid request' }));
        }
      });
      return;
    }

    // GET /api/user - fetch single user by id or telegramId
    if (urlPath === '/api/user' && req.method === 'GET') {
      const targetId = params.get('id');
      const tgId = params.get('telegramId');
      let foundUser = null;

      if (targetId && familyDb.users[targetId]) {
        foundUser = familyDb.users[targetId];
      } else if (tgId) {
        const numTg = Number(tgId);
        foundUser = Object.values(familyDb.users).find((u) => u.telegramId === numTg);
      }

      if (foundUser) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: foundUser }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
      }
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
      
      // Hashed assets can be cached aggressively; index.html and sw.js should never be cached
      if (urlPath.startsWith('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (ext === '.html' || urlPath === '/sw.js') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // If the request points to an asset with a file extension that does not exist, return 404
      // This prevents the browser from treating 404 HTML responses as valid JavaScript files
      if (path.extname(urlPath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`Asset not found: ${urlPath}`);
        return;
      }

      // SPA Fallback: serve index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Build not found. Run "npm run build" first.');
          return;
        }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
