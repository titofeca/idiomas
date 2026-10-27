import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ENGLISH_PLACEMENT_TEST, CHINESE_PLACEMENT_TEST } from '../data/placementTests';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Volume2, Award, CheckCircle, ArrowRight, Compass } from 'lucide-react';

interface PlacementTestModalProps {
  onClose: () => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({ onClose }) => {
  const { language, currentProfile, completePlacement } = useGame();
  const questions = language === 'zh' ? CHINESE_PLACEMENT_TEST : ENGLISH_PLACEMENT_TEST;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [assignedLevel, setAssignedLevel] = useState('');

  const currentQ = questions[currentIndex];

  const playAudio = (text: string) => {
    sound.playTap();
    speech.speak(text, language, { pace: 0.85 });
  };

  const handleSelectOption = (optId: string, isCorrect: boolean, pts: number) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optId);

    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + pts);
    } else {
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
    } else {
      const finalScore = score + (selectedOptionId ? (currentQ.options.find(o => o.id === selectedOptionId)?.points || 0) : 0);
      let calculatedLevel = '';

      if (language === 'zh') {
        if (finalScore >= 80) calculatedLevel = 'HSK 3 (Intermedio)';
        else if (finalScore >= 50) calculatedLevel = 'HSK 2 (Elemental Sólido)';
        else calculatedLevel = 'HSK 1 (Iniciación y Tonos)';
      } else {
        if (finalScore >= 80) calculatedLevel = 'C1 (Avanzado & Fluidez)';
        else if (finalScore >= 50) calculatedLevel = 'B2 (Intermedio Alto)';
        else calculatedLevel = 'B1 (Intermedio Práctico)';
      }

      setAssignedLevel(calculatedLevel);
      setTestFinished(true);
      sound.playFanfare();
      completePlacement(calculatedLevel);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-md animate-pop"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-700">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Test de Nivel Diagnóstico</h3>
              <p className="text-xs text-slate-500">
                Perfil evaluado: <span className="font-bold text-slate-900">{currentProfile.name}</span>
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

        {!testFinished ? (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-bold">Pregunta {currentIndex + 1} de {questions.length}</span>
              <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Foco: {currentQ.targetLevel}
              </span>
            </div>

            <p className="text-xs font-bold text-indigo-700">
              {currentQ.instruction}
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative">
              {currentQ.audioText && (
                <button
                  onClick={() => playAudio(currentQ.audioText!)}
                  className="absolute right-3 top-3 p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 shadow-xs"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
              <div className="text-sm font-black text-slate-900 leading-relaxed font-serif pr-10">
                {currentQ.promptText}
              </div>
            </div>

            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';

                if (selectedOptionId !== null) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-50 border-red-500 text-red-900';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id, opt.isCorrect, opt.points)}
                    disabled={selectedOptionId !== null}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${btnStyle}`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOptionId === null}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                  selectedOptionId !== null
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{currentIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Nivel Asignado'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center py-4 space-y-4 animate-pop">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider">
                Diagnóstico Asignado
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-1">
                {assignedLevel}
              </h4>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Hemos ajustado las conversaciones de voz y el vocabulario a este nivel para que tu hijo y tú tengáis un avance constante sin frustraciones.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-200 transition-all"
            >
              Comenzar a Practicar por Voz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
