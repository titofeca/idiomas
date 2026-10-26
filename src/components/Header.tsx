import React from 'react';
import { useGame } from '../context/GameContext';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from './MangaAvatar';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { Flame, Compass, UserCheck, Sparkles, Send, Bot } from 'lucide-react';

interface HeaderProps {
  onOpenPlacementTest: () => void;
  onOpenCompanionSelector: () => void;
  onOpenAiModal: () => void;
  onOpenTelegramModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPlacementTest,
  onOpenCompanionSelector,
  onOpenAiModal,
  onOpenTelegramModal,
}) => {
  const {
    language,
    setLanguage,
    currentProfile,
    activeProfileId,
    switchProfile,
    isTelegram,
    aiConfig,
  } = useGame();

  const companion =
    MANGA_COMPANIONS.find((c) => c.id === currentProfile.selectedCompanionId) ||
    MANGA_COMPANIONS[0];

  const assignedLevel =
    language === 'zh' ? currentProfile.assignedLevelZh : currentProfile.assignedLevelEn;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-sm">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
        {/* Language switch */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🇬🇧 Inglés
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              language === 'zh'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🇨🇳 Chino
          </button>
        </div>

        {/* Center / Right side buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Telegram Mini App & Sync Pill */}
          <button
            onClick={() => {
              sound.playTap();
              telegram.haptic('light');
              onOpenTelegramModal();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
              isTelegram
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Telegram Mini App & Compartir con mi hijo"
          >
            <Send className="w-3 h-3 text-sky-600 -rotate-12" />
            {isTelegram && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            <span className="hidden md:inline">Telegram</span>
          </button>

          {/* AI Settings Pill */}
          <button
            onClick={() => {
              sound.playTap();
              telegram.haptic('light');
              onOpenAiModal();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
              aiConfig.apiKey && aiConfig.apiKey.length > 4
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}
            title="Configurar IA (OpenRouter, DeepSeek)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden md:inline">IA</span>
          </button>

          {/* Active Manga Companion Pill */}
          <button
            onClick={() => {
              sound.playTap();
              onOpenCompanionSelector();
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100/70 text-xs font-bold text-indigo-900 transition-all shadow-xs"
            title="Cambiar tu tutor manga flotante"
          >
            <MangaAvatar id={companion.id} size="sm" className="w-6 h-6 rounded-lg" />
            <span className="hidden sm:inline">{companion.name}</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </button>

          {/* Placement level diagnostic */}
          <button
            onClick={() => {
              sound.playTap();
              onOpenPlacementTest();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
            title="Test diagnóstico de nivel"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span className="truncate max-w-[90px]">{assignedLevel}</span>
          </button>

          {/* Profile switch: Hijo vs Papá */}
          <button
            onClick={() => {
              switchProfile(activeProfileId === 'son' ? 'father' : 'son');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-all"
            title="Cambiar perfil"
          >
            <span className="text-sm">{currentProfile.avatar}</span>
            <span className="hidden sm:inline">{currentProfile.name.split(' ')[0]}</span>
            <UserCheck className="w-3 h-3 text-slate-400" />
          </button>

          {/* Streak Flame */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-600">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentProfile.streakDays}d</span>
          </div>
        </div>
      </div>
    </header>
  );
};
