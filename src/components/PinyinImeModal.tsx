import React, { useState } from 'react';
import { PINYIN_IME_EXERCISES } from '../data/chineseCurriculum';
import { sound } from '../services/soundEffects';
import { useGame } from '../context/GameContext';
import { Keyboard, AlertTriangle, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

interface PinyinImeModalProps {
  onClose: () => void;
}

export const PinyinImeModal: React.FC<PinyinImeModalProps> = ({ onClose }) => {
  const { addXp, addGems } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number | null>(null);
  const [semanticAlert, setSemanticAlert] = useState<{
    show: boolean;
    isCorrect: boolean;
    char: string;
    explanation: string;
    radicalNote: string;
  } | null>(null);

  const currentExercise = PINYIN_IME_EXERCISES[currentIndex];

  const handleCandidateClick = (candIndex: number) => {
    setSelectedCandidateIndex(candIndex);
    const candidate = currentExercise.candidates[candIndex];

    if (candidate.isCorrect) {
      sound.playCorrect();
      setSemanticAlert({
        show: true,
        isCorrect: true,
        char: candidate.char,
        explanation: `¡Correcto! ${candidate.meaning}. Corresponde perfectamente con el contexto de la oración.`,
        radicalNote: `Radical: ${candidate.radical} (${candidate.radicalMeaning})`
      });
      addXp(30);
    } else {
      sound.playWrong();
      setSemanticAlert({
        show: true,
        isCorrect: false,
        char: candidate.char,
        explanation: `Error Semántico: Has seleccionado "${candidate.char}" (${candidate.meaning}), que NO encaja aquí.`,
        radicalNote: `Pista del Radical: Fíjate en el radical "${candidate.radical}" (${candidate.radicalMeaning}). Para esta frase necesitas el radical "${currentExercise.targetRadical}" (${currentExercise.targetRadicalMeaning}).`
      });
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (currentIndex < PINYIN_IME_EXERCISES.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTypedInput('');
      setSelectedCandidateIndex(null);
      setSemanticAlert(null);
    } else {
      sound.playFanfare();
      addGems(20);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Entrenador IME de Pinyin</h3>
              <p className="text-[11px] text-slate-400">Discriminación de homófonos y radicales</p>
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

        {/* Target Sentence Context */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-center">
          <div className="text-xs uppercase tracking-wider text-purple-400 font-bold mb-1">
            Completa la oración
          </div>
          <div className="text-2xl font-bold text-white my-2 font-serif">
            {currentExercise.contextSentence}
          </div>
          <div className="text-xs text-slate-400">
            Objetivo: Teclea <span className="font-mono text-amber-300 font-bold">"{currentExercise.pinyinInput}"</span> y escoge el carácter correcto entre los homófonos.
          </div>
        </div>

        {/* Simulated Pinyin Input Box */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-300 mb-1 block">
            Entrada de Pinyin (Simulador IME):
          </label>
          <div className="relative">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value.toLowerCase())}
              placeholder={`Escribe "${currentExercise.pinyinInput}"...`}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-500 text-sm"
            />
            {typedInput === '' && (
              <button
                onClick={() => setTypedInput(currentExercise.pinyinInput)}
                className="absolute right-2 top-2 px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              >
                Autocompletar
              </button>
            )}
          </div>
        </div>

        {/* Candidate Bar (IME Bar) */}
        {typedInput.includes(currentExercise.pinyinInput.slice(0, 2)) && (
          <div className="mt-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 px-2 py-0.5 flex justify-between font-mono">
              <span>IME CANDIDATES [{typedInput}]</span>
              <span>Selecciona por radical</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-1">
              {currentExercise.candidates.map((cand, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCandidateClick(idx)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedCandidateIndex === idx
                      ? cand.isCorrect
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-red-950 border-red-500 text-red-200'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-white'
                  }`}
                >
                  <div className="text-xl font-bold font-serif">{cand.char}</div>
                  <div className="text-[10px] text-slate-400 truncate">{idx + 1}. {cand.radical}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Semantic Correction / Feedback Card */}
        {semanticAlert && (
          <div className={`mt-4 p-3.5 rounded-2xl border animate-pop ${
            semanticAlert.isCorrect
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-100'
              : 'bg-amber-950/70 border-amber-500/60 text-amber-100'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {semanticAlert.isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>¡Selección Semántica Impecable!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Alerta de Radical y Homófono</span>
                </>
              )}
            </div>
            <p className="text-xs mt-1.5">{semanticAlert.explanation}</p>
            <div className="mt-2 p-2 bg-black/40 rounded-lg text-xs font-mono text-slate-300 flex items-start gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{semanticAlert.radicalNote}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          {semanticAlert?.isCorrect ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition-all"
            >
              <span>{currentIndex < PINYIN_IME_EXERCISES.length - 1 ? 'Siguiente Caso' : 'Terminar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-slate-500">
              {currentIndex + 1} de {PINYIN_IME_EXERCISES.length} retos
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
