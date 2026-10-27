import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { telegram } from '../services/telegramService';
import { sound } from '../services/soundEffects';
import {
  Send,
  Smartphone,
  Share2,
  Users,
  CheckCircle,
  Copy,
  ExternalLink,
  Bot,
  Sparkles,
  Shield,
  ArrowRight
} from 'lucide-react';

interface TelegramSyncModalProps {
  onClose: () => void;
}

export const TelegramSyncModal: React.FC<TelegramSyncModalProps> = ({ onClose }) => {
  const {
    isTelegram,
    telegramUser,
    activeProfileId,
    currentProfile,
    otherProfile,
    linkTelegramToProfile,
    exportSyncData,
    importSyncData,
    setShowRoleBindingModal,
  } = useGame();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const handleShareTelegram = (targetRole: 'son' | 'father') => {
    sound.playTap();
    telegram.haptic('medium');
    telegram.shareInvite(
      targetRole,
      targetRole === 'son'
        ? `¡Mario! He completado mi entrenamiento de hoy en LinguaQuest con ${currentProfile.todayMinutes} min. 🏆 ¿Podrás superarme hoy? Entra aquí:`
        : `¡Tito (Papá)! Llevo una racha de ${currentProfile.streakDays} días en LinguaQuest. 🚀 ¿Aceptas el reto de idiomas de hoy? Entra aquí:`
    );
  };

  const handleCopyLink = () => {
    sound.playTap();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExport = () => {
    sound.playTap();
    const code = exportSyncData();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleImport = () => {
    sound.playTap();
    if (!importCode.trim()) return;
    const ok = importSyncData(importCode.trim());
    if (ok) {
      setImportMsg('¡Datos sincronizados correctamente entre ambos móviles!');
      setImportCode('');
    } else {
      setImportMsg('Código de sincronización no válido.');
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-md animate-pop"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-200">
              <Send className="w-5 h-5 -rotate-12" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Telegram Mini App & Compartir</h3>
              <p className="text-xs text-slate-500 font-medium">Aprende con tu hijo en dos móviles</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center transition-all text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 mt-4 text-xs">
          {/* Status Banner */}
          {isTelegram ? (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <div className="font-black text-xs text-sky-900">
                      Identificado como: {activeProfileId === 'son' ? '👦 Hijo (13 años)' : '🧔 Papá'}
                    </div>
                    <div className="text-[11px] text-sky-700">
                      Telegram ID: {telegramUser?.id} {telegramUser?.username ? `(@${telegramUser.username})` : ''}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playTap();
                    setShowRoleBindingModal(true);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-sky-300 text-sky-900 font-extrabold text-[11px] transition-all shadow-xs"
                >
                  Cambiar Rol
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200">
              <div className="flex items-center gap-2 text-sky-800 font-extrabold text-xs mb-1">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>Compatible 100% como Telegram Mini App (TMA)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tanto tú como tu hijo podéis abrir esta aplicación directamente dentro de Telegram con un solo botón, recibiendo recordatorios diarios de vuestros compañeros manga y compitiendo en directo.
              </p>
            </div>
          )}

          {/* Quick Telegram Challenge Share */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Enviar Reto a tu Hijo / Padre por Telegram</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Genera un mensaje directo con el enlace para que lo abra en su Telegram al instante:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleShareTelegram('son')}
                className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold flex flex-col items-center justify-center gap-1 transition-all active:scale-98 shadow-xs"
              >
                <span className="text-xl">👦</span>
                <span className="text-xs">Retar a Mario</span>
                <span className="text-[10px] text-sky-600 font-bold">13 años • Telegram</span>
              </button>

              <button
                type="button"
                onClick={() => handleShareTelegram('father')}
                className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold flex flex-col items-center justify-center gap-1 transition-all active:scale-98 shadow-xs"
              >
                <span className="text-xl">🧔</span>
                <span className="text-xs">Retar a Tito</span>
                <span className="text-[10px] text-sky-600 font-bold">Papá • Telegram</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedLink ? '¡Enlace copiado al portapapeles!' : 'Copiar Enlace Directo de la App'}</span>
            </button>
          </div>

          {/* How to add to a Telegram Bot Guide */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Cómo conectar LinguaQuest a tu Bot de Telegram</span>
            </h4>

            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  Abre <b>@BotFather</b> en Telegram y envía el comando <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">/newbot</code> para crear tu bot (ejemplo: <code className="text-indigo-600">@MiFamiliaIdiomasBot</code>).
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  Escribe <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">/newapp</code> en @BotFather, selecciona tu bot e introduce el título, descripción y la URL HTTPS de tu app.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>
                  ¡Listo! En el chat del bot aparecerá el botón permanente <b>"🚀 Abrir LinguaQuest"</b> a pantalla completa. Hemos incluido un script <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">telegram-bot/bot.mjs</code> listo para ejecutar con Node.js.
                </span>
              </div>
            </div>
          </div>

          {/* Manual Offline Sync Code Backup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sincronización Manual entre Dispositivos</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Si queréis transferir rachas y minutos sin conexión o entre navegadores distintos:
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                <span>{copiedCode ? '¡Copiado!' : 'Copiar Código de Mis Datos'}</span>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Pega el código recibido del otro móvil..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleImport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs"
              >
                Importar
              </button>
            </div>

            {importMsg && (
              <div className="text-[11px] font-bold text-indigo-700 mt-1">{importMsg}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
