import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { telegram } from '../services/telegramService';
import { SrsCard } from '../types';
import {
  Volume2,
  RotateCw,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Volume1,
  Award
} from 'lucide-react';

export const SrsFlashcardsView: React.FC = () => {
  const { language, srsCards, updateCardReview, addXp, pace, toneAmplify, currentProfile } = useGame();

  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter cards by current language and phase
  const activeDeck = srsCards.filter((card) => {
    if (card.lang !== language) return false;
    if (language === 'zh' && selectedPhase !== 'all') {
      return card.phase === selectedPhase;
    }
    return true;
  });

  const currentCard: SrsCard | undefined = activeDeck[currentIndex % Math.max(1, activeDeck.length)];

  const playCardAudio = (text: string, slow: boolean = false) => {
    sound.playTap();
    telegram.haptic('light');
    speech.speak(text, language, {
      pace: slow ? 0.55 : pace,
      pitch: toneAmplify ? 1.15 : 1.0,
    });
  };

  const handleRating = (rating: 'easy' | 'good' | 'hard') => {
    if (!currentCard) return;

    if (rating === 'easy') {
      sound.playCorrect();
      telegram.haptic('success');
      addXp(15);
    } else if (rating === 'good') {
      sound.playCorrect();
      telegram.haptic('light');
      addXp(10);
    } else {
      sound.playWrong();
      telegram.haptic('warning');
      addXp(5);
    }

    updateCardReview(currentCard.id, rating);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  };

  if (!currentCard) {
    return (
      <div className="p-8 text-center text-slate-500 space-y-3">
        <Layers className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-sm font-bold">No hay tarjetas disponibles para este filtro.</p>
        <button
          onClick={() => setSelectedPhase('all')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Ver todas las tarjetas
        </button>
      </div>
    );
  }

  const masteredCount = language === 'zh' ? currentProfile.cardsMasteredZh : currentProfile.cardsMasteredEn;

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* 1. Header Info Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xs">
                {language === 'zh' ? 'Currículo Oficial HSK 3.0' : 'Marco LOMLOE & MCER B1-C1'}
              </h3>
              <p className="text-[10px] text-slate-500">Repaso espaciado de memoria a largo plazo</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-xl text-slate-700">
            <span>{currentIndex + 1}</span>
            <span className="text-slate-400">/</span>
            <span>{activeDeck.length}</span>
          </div>
        </div>

        {/* Phase Filter Chips (Mandarin) */}
        {language === 'zh' && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase('all');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas (1-4)
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase(1);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 1
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fase 1: Pinyin & Tonos
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase(2);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 2
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fase 2: Hanzi Inicial
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase(3);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 3
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fase 3: Frases Clave
            </button>
          </div>
        )}
      </div>

      {/* 2. Interactive 3D Flip Card */}
      <div
        onClick={() => {
          sound.playTap();
          telegram.haptic('light');
          setIsFlipped(!isFlipped);
        }}
        className="w-full min-h-[300px] p-6 rounded-3xl bg-white border-2 border-slate-200/90 shadow-xl flex flex-col justify-between cursor-pointer hover:border-indigo-400 active:scale-98 transition-all relative overflow-hidden group select-none"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-extrabold uppercase tracking-wider text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {language === 'zh' ? `Fase ${currentCard.phase || 1} • HSK 3.0` : `Nivel ${currentCard.level || 'B2'}`}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-indigo-600">
            <RotateCw className="w-3.5 h-3.5" /> Toca para girar
          </span>
        </div>

        {/* Card Body */}
        <div className="py-6 text-center space-y-3">
          {!isFlipped ? (
            /* FRONT */
            <div className="space-y-2">
              <div
                className={`font-black text-slate-900 tracking-wide ${
                  language === 'zh' ? 'text-4xl font-serif' : 'text-2xl'
                }`}
              >
                {currentCard.front}
              </div>

              {currentCard.pinyin && (
                <div className="text-base text-amber-700 font-mono font-bold">
                  {currentCard.pinyin}
                </div>
              )}
            </div>
          ) : (
            /* BACK */
            <div className="space-y-3 animate-pop">
              <div className="text-xl font-black text-indigo-950">
                {currentCard.back}
              </div>

              {currentCard.example && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
                  <div className="font-bold text-slate-800">{currentCard.example}</div>
                  <div className="text-slate-500 text-[11px]">{currentCard.exampleTranslation}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Audio buttons at bottom of card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100"
        >
          <button
            onClick={() => playCardAudio(currentCard.front, false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs shadow-xs active:scale-95"
            title="Escuchar locución normal"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>Locución (0.85x)</span>
          </button>

          <button
            onClick={() => playCardAudio(currentCard.front, true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs shadow-xs active:scale-95"
            title="Escuchar locución lenta"
          >
            <span>🐢</span>
            <span>Lento (0.55x)</span>
          </button>
        </div>
      </div>

      {/* 3. Rating & SRS Progression Buttons */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="text-xs font-black text-slate-700 text-center">
          ¿Cómo has recordado esta palabra?
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => handleRating('hard')}
            className="py-3 px-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-black text-xs text-center transition-all active:scale-95 shadow-xs"
          >
            <div className="text-sm mb-0.5">😰</div>
            <div>Difícil</div>
            <div className="text-[10px] text-rose-600 font-normal mt-0.5">+5 XP</div>
          </button>

          <button
            onClick={() => handleRating('good')}
            className="py-3 px-2 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-black text-xs text-center transition-all active:scale-95 shadow-xs"
          >
            <div className="text-sm mb-0.5">🙂</div>
            <div>Bien</div>
            <div className="text-[10px] text-sky-600 font-normal mt-0.5">+10 XP</div>
          </button>

          <button
            onClick={() => handleRating('easy')}
            className="py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-black text-xs text-center transition-all active:scale-95 shadow-xs"
          >
            <div className="text-sm mb-0.5">🚀</div>
            <div>Fácil</div>
            <div className="text-[10px] text-emerald-600 font-normal mt-0.5">+15 XP</div>
          </button>
        </div>
      </div>

      {/* 4. Mastery summary */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-slate-600">Palabras dominadas por {currentProfile.name}:</span>
        </div>
        <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200 font-mono">
          {masteredCount} {language === 'zh' ? 'HSK' : 'palabras'}
        </span>
      </div>
    </div>
  );
};
