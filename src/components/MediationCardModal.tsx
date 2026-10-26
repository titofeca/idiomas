import React, { useState } from 'react';
import { MEDIATION_CARDS } from '../data/englishCurriculum';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { useGame } from '../context/GameContext';
import { MessageSquareText, Volume2, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface MediationCardModalProps {
  onClose: () => void;
}

export const MediationCardModal: React.FC<MediationCardModalProps> = ({ onClose }) => {
  const { addXp, addGems, progressQuest } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentMediation = MEDIATION_CARDS[currentIndex];

  const playAudio = () => {
    sound.playTap();
    speech.speak(currentMediation.audioPromptEn, 'en', { pace: 0.88 });
  };

  const handleSelectOption = (optId: string) => {
    if (answered) return;
    setSelectedOptionId(optId);
    setAnswered(true);

    const option = currentMediation.options.find((o) => o.id === optId);
    if (!option) return;

    if (option.isCorrect) {
      sound.playCorrect();
      setFeedback({ isCorrect: true, text: option.feedback });
      addXp(40);
      progressQuest('mediation', 1);
    } else {
      sound.playWrong();
      setFeedback({ isCorrect: false, text: option.feedback });
    }
  };

  const handleNext = () => {
    sound.playTap();
    if (currentIndex < MEDIATION_CARDS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
      setAnswered(false);
      setFeedback(null);
    } else {
      sound.playFanfare();
      addGems(25);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Tarjetas de Mediación LOMLOE</h3>
              <p className="text-[11px] text-slate-400">Competencia Específica 4 (RD 217/2022)</p>
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

        {/* Level badge */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 font-semibold">
            {currentMediation.cefrLevel}
          </span>
          <span className="text-slate-400">Caso {currentIndex + 1} de {MEDIATION_CARDS.length}</span>
        </div>

        {/* Real-World Scenario */}
        <div className="mt-3 p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
            Situación Comunicativa Real:
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {currentMediation.realWorldScenario}
          </p>
        </div>

        {/* English Audio Trigger */}
        <div className="mt-3 p-4 bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/30 rounded-2xl text-center">
          <p className="text-xs text-slate-400 mb-2 font-mono italic">
            "{currentMediation.audioPromptEn}"
          </p>
          <button
            onClick={playAudio}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Escuchar Locución en Inglés</span>
          </button>
        </div>

        {/* Task question */}
        <div className="mt-3 text-xs font-bold text-slate-300">
          {currentMediation.taskInstruction}
        </div>

        {/* Options */}
        <div className="mt-2 space-y-2">
          {currentMediation.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let style = 'bg-slate-800/70 border-slate-700 hover:border-slate-600 text-slate-200';

            if (answered) {
              if (opt.isCorrect) {
                style = 'bg-emerald-950/80 border-emerald-500 text-emerald-100';
              } else if (isSelected) {
                style = 'bg-red-950/80 border-red-500 text-red-100';
              } else {
                style = 'bg-slate-800/30 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={answered}
                className={`w-full p-3 rounded-2xl border text-left text-xs font-medium transition-all ${style}`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className={`mt-3 p-3.5 rounded-2xl border animate-pop ${
            feedback.isCorrect
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-100'
              : 'bg-red-950/70 border-red-500/60 text-red-100'
          }`}>
            <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Excelente Mediación Lingüística! (+40 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>Matiz no alcanzado</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed">{feedback.text}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          {answered ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              <span>{currentIndex < MEDIATION_CARDS.length - 1 ? 'Siguiente Situación' : 'Finalizar Reto'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Escucha el audio y escoge la mediación</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
