import React, { useState } from 'react';
import { TONE_LAB_EXERCISES } from '../data/chineseCurriculum';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { useGame } from '../context/GameContext';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, Activity } from 'lucide-react';

interface ToneLabModalProps {
  onClose: () => void;
}

export const ToneLabModal: React.FC<ToneLabModalProps> = ({ onClose }) => {
  const { pace, toneAmplify, addXp, addGems, progressQuest } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const currentExercise = TONE_LAB_EXERCISES[currentIndex];

  const playToneAudio = (tone: 1 | 2 | 3 | 4, pinyin: string) => {
    // Play both speech and amplified pitch contour
    sound.playMandarinToneCurve(tone, pace, toneAmplify);
    setTimeout(() => {
      speech.speak(pinyin, 'zh', { pace, pitch: toneAmplify ? 1.2 : 1.0 });
    }, 120);
  };

  const handleSelectOption = (chosenTone: 1 | 2 | 3 | 4) => {
    if (answered) return;
    setSelectedTone(chosenTone);
    setAnswered(true);

    const correct = chosenTone === currentExercise.targetTone;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      setScore((s) => s + 1);
      addXp(25);
      progressQuest('tones', 1);
    } else {
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (currentIndex < TONE_LAB_EXERCISES.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedTone(null);
      setAnswered(false);
    } else {
      // Completed all
      sound.playFanfare();
      addGems(15);
      onClose();
    }
  };

  // Tone contours representation for visual pitch feedback (F0 trajectory)
  const renderToneSvg = (tone: 1 | 2 | 3 | 4) => {
    switch (tone) {
      case 1:
        return (
          <svg className="w-12 h-6" viewBox="0 0 100 50">
            <line x1="10" y1="15" x2="90" y2="15" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 2:
        return (
          <svg className="w-12 h-6" viewBox="0 0 100 50">
            <line x1="15" y1="40" x2="85" y2="12" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 3:
        return (
          <svg className="w-12 h-6" viewBox="0 0 100 50">
            <path d="M 10 20 Q 50 48 90 12" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 4:
        return (
          <svg className="w-12 h-6" viewBox="0 0 100 50">
            <line x1="15" y1="12" x2="85" y2="40" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Laboratorio de Tonos HSK</h3>
              <p className="text-[11px] text-slate-400">Discriminación acústica y curvas $F_0$</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Progress & Score */}
        <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
          <span>Pregunta {currentIndex + 1} de {TONE_LAB_EXERCISES.length}</span>
          <span className="font-bold text-amber-400">Aciertos: {score}</span>
        </div>

        {/* Main Audio Target Card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-indigo-950/40 border border-indigo-500/30 text-center relative overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-1">
            Escucha la sílaba y detecta el tono exacto
          </div>
          <div className="text-4xl font-black text-white my-2 tracking-wide font-mono">
            [{currentExercise.syllable}]
          </div>

          <button
            onClick={() => playToneAudio(currentExercise.targetTone, currentExercise.pinyin)}
            className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>Reproducir Tono ({pace}x)</span>
          </button>

          <div className="mt-2 text-[11px] text-slate-400">
            {toneAmplify ? '⚡ Curva prosódica amplificada (--pitch-amplify)' : 'Curva estándar'}
          </div>
        </div>

        {/* Tones Options Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {currentExercise.options.map((opt) => {
            const isSelected = selectedTone === opt.tone;
            let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200';

            if (answered) {
              if (opt.tone === currentExercise.targetTone) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/30';
              } else if (isSelected) {
                btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
              } else {
                btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.tone}
                onClick={() => handleSelectOption(opt.tone)}
                disabled={answered}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${btnStyle}`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tono {opt.tone}
                  </span>
                  {renderToneSvg(opt.tone)}
                </div>

                <div className="text-2xl font-black my-1 text-white">
                  {opt.pinyin}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {opt.hanzi} - {opt.meaning.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {answered && (
          <div className={`mt-4 p-3.5 rounded-2xl border animate-pop ${
            isCorrect ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-red-950/60 border-red-500/50 text-red-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>¡Exacto! +25 XP</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Era el Tono {currentExercise.targetTone}: {currentExercise.meaning}</span>
                </>
              )}
            </div>
            <p className="text-xs mt-1 text-slate-300">
              Caracter: <span className="text-lg font-bold text-white">{currentExercise.hanzi}</span> ({currentExercise.pinyin})
            </p>
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          {answered ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <span>{currentIndex < TONE_LAB_EXERCISES.length - 1 ? 'Siguiente Tono' : 'Finalizar Reto'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pulsa una tarjeta para responder</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
