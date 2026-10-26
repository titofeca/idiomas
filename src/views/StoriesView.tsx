import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GRADUATED_STORIES } from '../data/storiesData';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Volume2, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { GraduatedStory } from '../types';

export const StoriesView: React.FC = () => {
  const { language, addXp, addGems } = useGame();
  
  const stories = GRADUATED_STORIES.filter((s) => s.lang === language);
  const [selectedStory, setSelectedStory] = useState<GraduatedStory>(stories[0] || GRADUATED_STORIES[0]);
  const [revealedTranslations, setRevealedTranslations] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const toggleTranslation = (idx: number) => {
    sound.playTap();
    setRevealedTranslations((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const playStoryAudio = (text: string) => {
    sound.playTap();
    speech.speak(text, language, { pace: 0.85 });
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    sound.playTap();
    setQuizAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    selectedStory.comprehensionQuiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    setQuizSubmitted(true);
    if (correctCount === selectedStory.comprehensionQuiz.length) {
      sound.playFanfare();
      addXp(60);
      addGems(15);
    } else {
      sound.playCorrect();
      addXp(30);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Story Title Card */}
      <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-bold">
            {selectedStory.level}
          </span>
          <span className="text-slate-400">Lectura Graduada (90%+ Input Comprensible)</span>
        </div>

        <h2 className="text-lg font-black text-white">{selectedStory.title}</h2>

        {/* Target new words */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Términos Clave Nuevos:
          </span>
          {selectedStory.targetNewWords.map((word, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Paragraphs Interactive List */}
      <div className="space-y-3">
        {selectedStory.paragraphs.map((p, idx) => {
          const isRevealed = !!revealedTranslations[idx];
          return (
            <div
              key={idx}
              className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white leading-relaxed font-serif">
                    {p.text}
                  </p>
                  {p.pinyin && (
                    <p className="text-xs text-amber-400 font-mono mt-1">{p.pinyin}</p>
                  )}
                </div>

                <button
                  onClick={() => playStoryAudio(p.text)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white shrink-0"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Reveal translation button */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleTranslation(idx)}
                  className="text-slate-400 hover:text-indigo-400 font-medium"
                >
                  {isRevealed ? 'Ocultar traducción' : 'Toca para ver traducción en castellano'}
                </button>
              </div>

              {isRevealed && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-pop">
                  {p.translation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comprehension Quiz */}
      <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl mt-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h3 className="font-black text-white text-sm">Mini-Test de Comprensión</h3>
        </div>

        <div className="space-y-4">
          {selectedStory.comprehensionQuiz.map((q, qIdx) => (
            <div key={qIdx} className="space-y-2">
              <p className="text-xs font-bold text-slate-200">{qIdx + 1}. {q.question}</p>
              <div className="space-y-1.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = quizAnswers[qIdx] === optIdx;
                  let style = 'bg-slate-800/80 border-slate-700 text-slate-300';

                  if (quizSubmitted) {
                    if (optIdx === q.correctIndex) {
                      style = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      style = 'bg-red-950 border-red-500 text-red-200';
                    }
                  } else if (isSelected) {
                    style = 'bg-indigo-950 border-indigo-500 text-indigo-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectQuizOption(qIdx, optIdx)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <p className="text-[11px] text-slate-400 italic mt-1">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < selectedStory.comprehensionQuiz.length}
              className={`px-5 py-2.5 rounded-full font-bold text-xs ${
                Object.keys(quizAnswers).length >= selectedStory.comprehensionQuiz.length
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Comprobar Respuestas (+60 XP)
            </button>
          ) : (
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Historia completada con éxito!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
