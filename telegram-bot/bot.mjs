/**
 * LinguaQuest Telegram Bot Server
 * 
 * Este bot permite desplegar LinguaQuest como una Telegram Mini App (TMA).
 * No requiere librerías pesadas externas: utiliza el fetch nativo de Node.js v18/v20/v22.
 * 
 * Uso:
 * 1. Consigue tu token de bot en @BotFather (https://t.me/BotFather).
 * 2. Ejecuta:
 *      $env:BOT_TOKEN="TU_TOKEN_DE_BOTFATHER"
 *      $env:APP_URL="https://tu-url-de-la-app.com"  (ej. con ngrok, cloudflare tunnel o tu hosting)
 *      node telegram-bot/bot.mjs
 */

const BOT_TOKEN = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.APP_URL || 'https://localhost:5173';

if (!BOT_TOKEN) {
  console.log('================================================================');
  console.log('⚠️ AVISO: BOT_TOKEN no definido.');
  console.log('Para iniciar el bot de Telegram, asigna tu token de @BotFather:');
  console.log('  En PowerShell:');
  console.log('    $env:BOT_TOKEN="123456789:ABCDefgh..."');
  console.log('    $env:APP_URL="https://mi-dominio.com"');
  console.log('    node telegram-bot/bot.mjs');
  console.log('================================================================');
  console.log('Modo de prueba simulado activado para verificación del bot.');
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tgRequest(method, data = {}) {
  if (!BOT_TOKEN) return { ok: false, description: 'Missing BOT_TOKEN' };
  try {
    const res = await fetch(`${TELEGRAM_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error(`Error en tgRequest (${method}):`, err.message);
    return { ok: false, error: err.message };
  }
}

// Configura el botón permanente de menú de Telegram para abrir la Mini App
async function setupMenuButton() {
  console.log('Configurando botón de menú permanente de Telegram WebApp...');
  const res = await tgRequest('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🚀 Abrir LinguaQuest',
      web_app: {
        url: APP_URL,
      },
    },
  });
  if (res.ok) {
    console.log('✅ Botón de menú permanente configurado correctamente.');
  } else {
    console.warn('Nota sobre botón de menú:', res);
  }
}

// Responde a mensajes recibidos
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();
  const userName = msg.from.first_name || 'Estudiante';

  if (text.startsWith('/start')) {
    const welcome = `¡Hola ${userName}! 👋 Bienvenido a **LinguaQuest** 🌟\n\n` +
      `Tu app inmersiva para aprender **Inglés** y **Chino Mandarín (HSK 3.0)** por micrófono, con compañeros manga que dialogan contigo y retos diarios compartidos entre padre e hijo.\n\n` +
      `🎯 **Elige tu perfil y empieza hoy mismo:**`;

    await tgRequest('sendMessage', {
      chat_id: chatId,
      text: welcome,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚀 Abrir Mini App (LinguaQuest)',
              web_app: { url: APP_URL },
            },
          ],
          [
            {
              text: '👦 Modo Hijo (13 años)',
              web_app: { url: `${APP_URL}?startapp=son` },
            },
            {
              text: '🧔 Modo Papá (Mentor)',
              web_app: { url: `${APP_URL}?startapp=father` },
            },
          ],
        ],
      },
    });
  } else if (text.startsWith('/reto')) {
    await tgRequest('sendMessage', {
      chat_id: chatId,
      text: `⚔️ **¡Reto LinguaQuest Activado!**\n\n` +
        `Entrena 15 minutos de conversación por voz hoy y completa 1 Eco de pronunciación.\n` +
        `¿Podrá el hijo superar al padre hoy?`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎤 Entrar al Hub de Voz',
              web_app: { url: APP_URL },
            },
          ],
        ],
      },
    });
  }
}

// Polling simple para escuchar mensajes
let lastUpdateId = 0;

async function pollUpdates() {
  if (!BOT_TOKEN) return;
  try {
    const res = await tgRequest('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 30,
    });

    if (res.ok && Array.isArray(res.result)) {
      for (const update of res.result) {
        lastUpdateId = update.update_id;
        if (update.message) {
          await handleMessage(update.message);
        }
      }
    }
  } catch (err) {
    console.error('Error en polling:', err.message);
  }

  setTimeout(pollUpdates, 1000);
}

if (BOT_TOKEN) {
  console.log(`🤖 Iniciando LinguaQuest Bot con WebApp URL: ${APP_URL}`);
  setupMenuButton();
  pollUpdates();
} else {
  console.log('Para iniciar el bot en vivo con Telegram, añade tu token.');
}
