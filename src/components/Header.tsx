import React from 'react';
import { useGame } from '../context/GameContext';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from './MangaAvatar';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { Flame, Sparkles, Send, UserCheck } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-3 py-2.5 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Language switch */}
        <div className="flex bg-slate-100 p-0.5 rounded-2xl border border-slate-200/90 shrink-0">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
              language === 'en'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🇬🇧 <span className="hidden xs:inline text-[11px]">EN</span>
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
              language === 'zh'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            🇨🇳 <span className="hidden xs:inline text-[11px]">ZH</span>
          </button>
        </div>

        {/* Center: Profile Switcher pill */}
        <button
          onClick={() => {
            sound.playTap();
            telegram.haptic('light');
            switchProfile(activeProfileId === 'son' ? 'father' : 'son');
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-bold text-slate-800 transition-all shrink-0 active:scale-95"
          title="Toca para alternar entre Mario y Tito"
        >
          <span className="text-sm">{currentProfile.avatar}</span>
          <span className="font-extrabold text-[11px] max-w-[65px] truncate">{currentProfile.name.split(' ')[0]}</span>
          <UserCheck className="w-3 h-3 text-slate-400" />
        </button>

        {/* Right side quick actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI Settings Pill */}
          <button
            onClick={() => {
              sound.playTap();
              telegram.haptic('light');
              onOpenAiModal();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-[11px] font-bold transition-all shadow-xs ${
              aiConfig.apiKey && aiConfig.apiKey.length > 4
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Configurar IA"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span className="hidden sm:inline">IA</span>
          </button>

          {/* Active Manga Companion Pill */}
          <button
            onClick={() => {
              sound.playTap();
              onOpenCompanionSelector();
            }}
            className="flex items-center gap-1 p-1 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-xs font-bold text-indigo-900 transition-all shadow-xs"
            title={`Tutor: ${companion.name}. Toca para cambiar.`}
          >
            <MangaAvatar id={companion.id} size="sm" className="w-5 h-5 rounded-md" />
          </button>

          {/* Telegram Sync Pill */}
          <button
            onClick={() => {
              sound.playTap();
              telegram.haptic('light');
              onOpenTelegramModal();
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-[11px] font-bold transition-all shadow-xs ${
              isTelegram
                ? 'bg-sky-50 border-sky-300 text-sky-800'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title="Telegram Mini App & Sincronizar"
          >
            <Send className="w-3 h-3 text-sky-600 -rotate-12" />
            {isTelegram && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>

          {/* Streak Flame */}
          <div className="flex items-center gap-0.5 px-2 py-1 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-black text-amber-600">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{currentProfile.streakDays}d</span>
          </div>
        </div>
      </div>
    </header>
  );
};
