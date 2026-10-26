import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Volume2, RotateCw, BookOpen } from 'lucide-react';
import { SrsCard } from '../types';

export const LearnView: React.FC = () => {
  const { language, srsCards, updateCardReview, addXp, pace, toneAmplify } = useGame();
  
  // Filters
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

  const playCardAudio = (text: string) => {
    sound.playTap();
    speech.speak(text, language, { pace, pitch: toneAmplify ? 1.15 : 1.0 });
  };

  const handleRating = (rating: 'easy' | 'good' | 'hard') => {
    if (!currentCard) return;

    if (rating === 'easy') {
      sound.playCorrect();
      addXp(15);
    } else if (rating === 'good') {
      sound.playCorrect();
      addXp(10);
    } else {
      sound.playWrong();
      addXp(5);
    }

    updateCardReview(currentCard.id, rating);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  };

  if (!currentCard) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>No hay tarjetas disponibles para este filtro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Top Deck Info & Phase Filters */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            {language === 'zh' ? 'Currículo Oficial HSK 3.0 (300 Palabras N1)' : 'Marco LOMLOE & MCER B1-C1'}
          </span>
          <span className="text-slate-400">
            {currentIndex + 1} de {activeDeck.length}
          </span>
        </div>

        {/* 4 Phases Selector for Mandarin as mandated in Section 3.2 */}
        {language === 'zh' && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-[11px]">
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase('all');
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todas (1-4)
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase(1);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 1
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fase 1: Identificación
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase(2);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 2
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fase 2: Cuantificadores
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase(3);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 3
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fase 3: Modales
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setSelectedPhase(4);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap font-bold transition-all ${
                selectedPhase === 4
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Fase 4: Aspecto & Tiempo
            </button>
          </div>
        )}
      </div>

      {/* Main Flashcard Container */}
      <div
        onClick={() => {
          sound.playTap();
          setIsFlipped(!isFlipped);
        }}
        className="w-full min-h-[340px] rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 border-2 border-indigo-500/30 shadow-2xl relative flex flex-col justify-between cursor-pointer transition-all hover:border-indigo-400 select-none"
      >
        {/* Card Header badges */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/90 border border-indigo-700/60 text-indigo-300 font-semibold">
            {currentCard.level}
          </span>
          {currentCard.isHandwritingCandidate && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-[10px] font-bold">
              ✍️ Carácter de Escritura (书写字)
            </span>
          )}
          <span className="text-slate-400 text-[11px] font-medium">{currentCard.category}</span>
        </div>

        {/* Card Center Content */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="my-auto text-center py-4">
            <div className={`font-black text-white ${language === 'zh' ? 'text-6xl font-serif' : 'text-3xl'}`}>
              {currentCard.front}
            </div>

            {currentCard.pinyin && (
              <div className="text-lg font-bold text-amber-400 mt-2 font-mono">
                {currentCard.pinyin}
              </div>
            )}

            {currentCard.phonetic && (
              <div className="text-sm font-semibold text-indigo-300 mt-1 font-mono">
                {currentCard.phonetic}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                playCardAudio(currentCard.front);
              }}
              className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-full bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-900/40"
            >
              <Volume2 className="w-4 h-4" />
              <span>Escuchar ({pace}x)</span>
            </button>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="my-auto text-center py-2 animate-pop">
            <div className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">
              Traducción & Significado
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {currentCard.back}
            </div>

            {/* Contextual Sentence as required by Rule 6: Contextualization */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
              <div className="text-[10px] uppercase font-bold text-amber-400 mb-1 flex items-center justify-between">
                <span>Oración de Ejemplo Real:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playCardAudio(currentCard.example);
                  }}
                  className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm font-bold text-white font-serif">{currentCard.example}</p>
              <p className="text-xs text-slate-400 mt-0.5">{currentCard.exampleTranslation}</p>
            </div>
          </div>
        )}

        {/* Card Footer prompt */}
        <div className="text-center text-[11px] text-slate-500 pt-2 flex items-center justify-center gap-1">
          <RotateCw className="w-3 h-3" />
          <span>{isFlipped ? 'Toca para volver al anverso' : 'Toca la tarjeta para ver traducción y contexto'}</span>
        </div>
      </div>

      {/* SRS Rating Actions (Dopamine Spaced Repetition Buttons) */}
      {isFlipped && (
        <div className="grid grid-cols-3 gap-2 animate-pop">
          <button
            onClick={() => handleRating('hard')}
            className="p-3 rounded-2xl bg-red-950/70 border border-red-600/50 hover:bg-red-900/50 text-center text-red-200 transition-all active:scale-95"
          >
            <div className="text-xs font-black">DIFÍCIL</div>
            <div className="text-[10px] text-red-300 mt-0.5">En 1h (+5 XP)</div>
          </button>

          <button
            onClick={() => handleRating('good')}
            className="p-3 rounded-2xl bg-amber-950/70 border border-amber-600/50 hover:bg-amber-900/50 text-center text-amber-200 transition-all active:scale-95"
          >
            <div className="text-xs font-black">BUENO</div>
            <div className="text-[10px] text-amber-300 mt-0.5">En 12h (+10 XP)</div>
          </button>

          <button
            onClick={() => handleRating('easy')}
            className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 hover:bg-emerald-900/50 text-center text-emerald-200 transition-all active:scale-95"
          >
            <div className="text-xs font-black">FÁCIL</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">En 1-3d (+15 XP)</div>
          </button>
        </div>
      )}
    </div>
  );
};
