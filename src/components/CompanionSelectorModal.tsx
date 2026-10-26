import React from 'react';
import { useGame } from '../context/GameContext';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from './MangaAvatar';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Volume2, Sparkles, Check } from 'lucide-react';

interface CompanionSelectorModalProps {
  onClose: () => void;
}

export const CompanionSelectorModal: React.FC<CompanionSelectorModalProps> = ({ onClose }) => {
  const { currentProfile, selectCompanion, language } = useGame();

  const handlePick = (companionId: string) => {
    sound.playCorrect();
    selectCompanion(companionId);
    const chosen = MANGA_COMPANIONS.find((c) => c.id === companionId);
    if (chosen) {
      speech.speak(
        language === 'zh' ? chosen.greetingZh : chosen.greetingEn,
        language,
        { pitch: chosen.voicePitch, pace: chosen.voiceRate }
      );
    }
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-pop">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Elige tu Compañero / Tutor Manga
              </h3>
              <p className="text-xs text-slate-500">
                Te acompañará flotando en la app y hablará contigo por micrófono
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {MANGA_COMPANIONS.map((comp) => {
            const isSelected = currentProfile.selectedCompanionId === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => handlePick(comp.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MangaAvatar id={comp.id} size="md" />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{comp.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {comp.mangaStyle}
                      </span>
                    </div>

                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">{comp.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {comp.personality}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTap();
                      speech.speak(
                        language === 'zh' ? comp.greetingZh : comp.greetingEn,
                        language,
                        { pitch: comp.voicePitch, pace: comp.voiceRate }
                      );
                    }}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                    title="Escuchar su voz"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
