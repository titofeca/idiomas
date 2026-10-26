# 🐉 LinguaQuest: Inglés & Chino Mandarín HSK 3.0

Aplicación móvil PWA ultra dinámica y gamificada para el aprendizaje de **Chino Mandarín (HSK 3.0)** e **Inglés Avanzado (LOMLOE & MCER B1/B2/C1)**, diseñada específicamente con bucles de recompensa y dopamina para un chico de 13 años y su padre.

---

## ⚡ Características Principales y Mecánicas de Dopamina

### 1. Sistema de Enganche y Dopamina (Teen & Self-Pique)
- **Récords Personales y Fantasma:** Tu hijo compite contra su mejor versión (máxima racha, récord de XP diario y cartas dominadas).
- **Rachas y Escudos Protectores (🛡️):** Sistema de fuego diario con escudos de protección canjeables con gemas para no perder la racha si un día tiene exámenes o no puede entrar.
- **Cofres Misteriosos de Recompensa (🎁):** Animaciones de apertura con botines variables (XP, Gemas, Escudos y Títulos).
- **Ligas y Rangos Competitivos:** Bronce 🥉 → Plata 🥈 → Oro 🥇 → Zafiro 💎 → Diamante 👑 → Leyenda 🐉.
- **Reto Jefe (Boss Battle ⚔️):** Combate arcade contrarreloj contra el Dragón Guardián con barra de vida (HP), rachas combo de daño crítico y botín épico.
- **Audio Procedural de Cero Latencia:** Sintetizador de efectos Web Audio API (fanfarria de victoria, chimes de acierto, thuds suaves y vibración háptica en móviles).

### 2. Chino Mandarín HSK 3.0 (Cumplimiento Riguroso GF0025-2021)
- **300 palabras acumuladas oficiales de Nivel 1** (sustituyendo el obsoleto HSK 2.0 de 150 palabras).
- **Resecuenciación Pedagógica en 4 Fases** (evitando el orden numérico oficial no pedagógico):
  - **Fase 1:** Identificación y Preguntas Básicas (`我`, `你`, `是`, `不`, `吗`, `什么`).
  - **Fase 2:** Cuantificación, Pertenencia y Clasificadores (`个`, `本`, `的`, `有/没有`).
  - **Fase 3:** Capacidades, Deseos y Modales (`会`, `想`, `要`, `很`, `都`).
  - **Fase 4:** Localización, Tiempo y Aspecto (`在`, `了`, `现在`).
- **Laboratorio de Discriminación Tonal ($F_0$ FastPitch):**
  - Curvas de tono visuales en tiempo real (Tono 1: 55 plano, Tono 2: 35 ascendente, Tono 3: 214 cóncavo, Tono 4: 51 descendente).
  - Control de velocidad prosódica (`--pace 0.5x`, `0.75x`, `1.0x`) y amplificación de tono (`--pitch-amplify`).
- **Escritura Manual Hanzi (书写字):**
  - Lienzo táctil con cuadrícula tradicional *Tián Zì Gé* (田字格).
  - Trazado guiado de la lista oficial de 100 caracteres desde Niveles 1 y 2.
- **Entrenador IME de Pinyin con Corrección Semántica de Radicales:**
  - Simulador de tecleado donde los errores de homófonos (ej. seleccionar `较` en vez de `叫`) activan alertas pedagógicas inmediatas explicando el radical (`口` boca vs `车` vehículo).

### 3. Inglés Avanzado (LOMLOE & Reto B2/C1 para destacar)
- **Alineación con RD 217/2022 (ESO) y RD 243/2022 (Bachillerato).**
- **Tarjetas de Mediación Real (Competencia Específica 4):**
  - Situaciones cotidianas auténticas con audio en inglés donde el alumno media, resume o sintetiza la información clave para terceros.
- **Phrasal Verbs y Expresiones de Fluidez Nativa:**
  - `Pull off`, `Hit the nail on the head`, `Figure out`, `On the spur of the moment`, `Call it a day`.
- **Historias Graduadas Interactivas:**
  - Micro-lecturas con más del 90% de vocabulario comprensible, locución por frases y mini-test de comprensión lectora.

### 4. PWA Móvil y Sincronización entre 2 Teléfonos
- **Instalable como App Nativa en iOS y Android:** Añadir a Pantalla de Inicio con icono y pantalla completa.
- **Sincronización Fácil:** Un botón genera un código seguro para compartir por WhatsApp entre los móviles del hijo y del padre, manteniendo los marcadores y piques actualizados sin necesidad de registrarse en servidores externos.

---

## 🚀 Cómo Ejecutar la App

En la terminal de Windows (PowerShell):

```powershell
cd C:\gITHUB\idiomas
npm run dev
```

Abre en el navegador:
- En tu PC: `http://localhost:5173`
- En el móvil (conectado a la misma red WiFi): abre la IP local que muestra Vite (ej. `http://192.168.1.X:5173`) y pulsa **"Añadir a pantalla de inicio"** para usarla a pantalla completa como una app nativa.
