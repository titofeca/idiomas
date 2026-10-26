# LinguaQuest - Telegram Bot & Mini App (TMA)

Esta carpeta contiene el script para conectar LinguaQuest directamente a un Bot de Telegram para que tú y tu hijo podáis usar la app desde el móvil o desktop sin necesidad de instalar nada.

## Pasos para configurarlo en 2 minutos

### 1. Crear el bot en Telegram
1. En Telegram, busca `@BotFather`.
2. Escribe `/newbot`.
3. Dale un nombre (ej. `LinguaQuest Idiomas`) y un username (ej. `LinguaQuestFamiliaBot`).
4. Guarda el **Token** que te da `@BotFather`.

### 2. Configurar la Mini App
1. En el mismo chat con `@BotFather`, escribe `/newapp`.
2. Elige el bot que acabas de crear.
3. Ponle título y descripción.
4. Cuando te pida la **URL de la app Web**, pon la URL pública HTTPS de LinguaQuest (por ejemplo, si usas Vercel, Cloudflare Pages o un túnel ngrok `https://xxxx.ngrok-free.app`).

### 3. Opcional: Ejecutar el bot local con Node.js
Si quieres que el bot responda automáticamente a `/start` y añada botones de reto:

```bash
# En PowerShell:
$env:BOT_TOKEN="123456789:ABCDefgh..."
$env:APP_URL="https://tu-url-de-la-app.com"
node telegram-bot/bot.mjs
```

### 4. Compartir con tu hijo
Pásale el enlace de tu bot (`t.me/LinguaQuestFamiliaBot`) a tu hijo. Al hacer clic en "Abrir Mini App", la aplicación se abrirá a pantalla completa dentro de Telegram, reconociendo el usuario de cada uno de vosotros de forma independiente.
