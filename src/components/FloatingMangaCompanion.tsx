import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from './MangaAvatar';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Mic, Sparkles, RefreshCw, BookOpen } from 'lucide-react';

interface FloatingMangaCompanionProps {
  onOpenVoiceRoom: () => void;
  onOpenSelector: () => void;
  onOpenComic?: () => void;
}

export const FloatingMangaCompanion: React.FC<FloatingMangaCompanionProps> = ({
  onOpenVoiceRoom,
  onOpenSelector,
  onOpenComic,
}) => {
  const { currentProfile, language } = useGame();
  const companion =
    MANGA_COMPANIONS.find((c) => c.id === currentProfile.selectedCompanionId) ||
    MANGA_COMPANIONS[0];

  const [bubbleText] = useState<string>(
    language === 'zh' ? companion.greetingZh : companion.greetingEn
  );
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCompanionClick = () => {
    sound.playTap();
    setIsSpeaking(true);
    speech.speak(bubbleText, language, {
      pitch: companion.voicePitch,
      pace: companion.voiceRate,
    });
    setTimeout(() => setIsSpeaking(false), 2500);
  };

  return (
    <aside aria-label="Compañero Manga de Voz" className="fixed bottom-20 right-4 z-40 flex flex-col items-end pointer-events-none">
      {/* Speech Bubble */}
      {bubbleVisible && (
        <div className="mb-2 max-w-[220px] p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-indigo-100 shadow-xl text-slate-800 text-xs pointer-events-auto animate-pop relative">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-100">
            <span className="font-extrabold text-[11px] text-indigo-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {companion.name}
            </span>
            <button
              onClick={() => onOpenSelector()}
              className="text-[10px] text-slate-400 hover:text-indigo-600 font-semibold flex items-center gap-0.5"
              title="Cambiar personaje manga"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Cambiar
            </button>
          </div>

          <p className="font-medium text-[11px] leading-tight text-slate-700 cursor-pointer" onClick={handleCompanionClick}>
            "{bubbleText}"
          </p>

          <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sound.playTap();
                  onOpenVoiceRoom();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-[10px] shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <Mic className="w-3 h-3 text-white" />
                <span>Hablar</span>
              </button>

              {onOpenComic && (
                <button
                  onClick={() => {
                    sound.playTap();
                    onOpenComic();
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-[10px] shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <BookOpen className="w-3 h-3 text-white" />
                  <span>Cómic</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setBubbleVisible(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600 ml-1"
            >
              ✕
            </button>
          </div>

          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-indigo-100 transform rotate-45" />
        </div>
      )}

      {/* Floating Animated Avatar Button with Handcrafted Manga Illustration */}
      <button
        onClick={handleCompanionClick}
        className="pointer-events-auto relative group flex items-center justify-center w-16 h-16 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all animate-manga-float cursor-pointer border-2 border-white ring-4 ring-indigo-500/20"
        title={`Tu tutor manga: ${companion.name}. Haz clic para escucharle o hablar.`}
      >
        <MangaAvatar
          id={companion.id}
          size="md"
          expression={isSpeaking ? 'talking' : 'idle'}
          isSpeaking={isSpeaking}
          className="w-full h-full"
        />

        {/* Mic badge */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            sound.playTap();
            onOpenVoiceRoom();
          }}
          className="absolute -top-1.5 -left-1.5 p-1.5 rounded-full bg-indigo-600 text-white border-2 border-white shadow-md hover:scale-110 active:scale-90"
          title="Hablar por micrófono con tu compañero"
        >
          <Mic className="w-3 h-3" />
        </div>
      </button>
    </aside>
  );
};
