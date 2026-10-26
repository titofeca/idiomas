import React, { useState } from 'react';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { useGame } from '../context/GameContext';
import { Swords, Heart, Zap, Volume2 } from 'lucide-react';

interface BossBattleModalProps {
  onClose: () => void;
}

interface BattleQuestion {
  prompt: string;
  subPrompt?: string;
  lang: 'zh' | 'en';
  options: string[];
  correctIndex: number;
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    prompt: '你好，我是学生。',
    subPrompt: '¿Qué significa esta oración?',
    lang: 'zh',
    options: ['Hola, soy profesor.', 'Hola, soy estudiante.', 'Hola, tengo un libro.'],
    correctIndex: 1
  },
  {
    prompt: 'Pull off',
    subPrompt: '¿Cuál es el significado de este Phrasal Verb?',
    lang: 'en',
    options: ['Lograr algo difícil con éxito', 'Cancelar un evento', 'Subirse a un autobús'],
    correctIndex: 0
  },
  {
    prompt: '我叫李明。',
    subPrompt: '¿Qué radical identifica al verbo "叫" (llamarse)?',
    lang: 'zh',
    options: ['Radical Coche (车)', 'Radical Boca (口)', 'Radical Agua (氵)'],
    correctIndex: 1
  },
  {
    prompt: 'On the spur of the moment',
    subPrompt: '¿Qué expresa esta expresión nativa C1?',
    lang: 'en',
    options: ['Hacer algo con meses de antelación', 'De forma impulsiva y espontánea', 'Llegar tarde por culpa del tráfico'],
    correctIndex: 1
  },
  {
    prompt: '太好了！',
    subPrompt: '¿Qué indica la partícula 了 al final?',
    lang: 'zh',
    options: ['Pregunta de duda', 'Cambio de estado o consumación', 'Negación absoluta'],
    correctIndex: 1
  }
];

export const BossBattleModal: React.FC<BossBattleModalProps> = ({ onClose }) => {
  const { addXp, addGems } = useGame();
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [battleState, setBattleState] = useState<'playing' | 'victory' | 'defeat'>('playing');
  const [shake, setShake] = useState(false);

  const currentQ = BATTLE_QUESTIONS[currentQIndex % BATTLE_QUESTIONS.length];

  const handleAnswer = (optionIdx: number) => {
    if (battleState !== 'playing') return;

    if (optionIdx === currentQ.correctIndex) {
      sound.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const damage = 25 + newCombo * 5;

      const nextBossHp = Math.max(0, bossHp - damage);
      setBossHp(nextBossHp);

      if (nextBossHp <= 0) {
        setBattleState('victory');
        sound.playFanfare();
        addXp(120);
        addGems(35);
      } else {
        setCurrentQIndex((i) => i + 1);
      }
    } else {
      sound.playWrong();
      setCombo(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const nextPlayerHp = Math.max(0, playerHp - 25);
      setPlayerHp(nextPlayerHp);

      if (nextPlayerHp <= 0) {
        setBattleState('defeat');
      } else {
        setCurrentQIndex((i) => i + 1);
      }
    }
  };

  const playQuestionAudio = () => {
    speech.speak(currentQ.prompt, currentQ.lang, { pace: 0.9 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-pop">
      <div className={`w-full max-w-md bg-slate-900 border-2 border-red-500/50 rounded-3xl p-5 shadow-2xl flex flex-col ${shake ? 'animate-wiggle' : ''}`}>
        {/* Boss Banner */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
              <Swords className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">Reto Jefe: Dragón Guardián</h3>
              <p className="text-[11px] text-red-400 font-semibold">¡Vence al Titán del Conocimiento!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Health Bars */}
        <div className="mt-3 space-y-2">
          {/* Boss HP */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-red-400 flex items-center gap-1">🐉 Dragón Guardián</span>
              <span className="text-red-400 font-mono">{bossHp}/100 HP</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-red-900/50">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${bossHp}%` }}
              />
            </div>
          </div>

          {/* Player HP */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-emerald-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> Tu Salud
              </span>
              <span className="text-emerald-400 font-mono">{playerHp}/100 HP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-emerald-900/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combo Indicator */}
        {combo > 1 && (
          <div className="mt-2 text-center text-xs font-black text-amber-400 animate-pulse flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>¡RACHA COMBO x{combo}! (+{combo * 5} Daño Extra)</span>
          </div>
        )}

        {/* Battle Play State */}
        {battleState === 'playing' && (
          <div className="mt-4">
            <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 text-center relative">
              <button
                onClick={playQuestionAudio}
                className="absolute right-3 top-3 p-1.5 rounded-full bg-slate-700 text-slate-300 hover:text-white"
                title="Escuchar audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div className="text-2xl font-black text-white font-serif">{currentQ.prompt}</div>
              <div className="text-xs text-slate-400 mt-1">{currentQ.subPrompt}</div>
            </div>

            <div className="mt-3 space-y-2">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left text-xs font-bold text-white transition-all active:scale-98 flex items-center justify-between"
                >
                  <span>{opt}</span>
                  <span className="text-slate-500 text-[10px]">Ataque ⚔️</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {battleState === 'victory' && (
          <div className="mt-6 text-center p-6 bg-gradient-to-b from-amber-950/60 to-slate-900 rounded-3xl border border-amber-500/40 animate-pop">
            <div className="text-5xl mb-2 animate-bounce">🏆</div>
            <h4 className="text-xl font-black text-amber-400">¡VICTORIA ÉPICA!</h4>
            <p className="text-xs text-slate-300 mt-1">Has derrotado al Dragón Guardián y demostrado tu nivel avanzado.</p>
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-sm font-bold text-white">
              <span className="text-amber-400">⭐ +120 XP</span>
              <span className="text-cyan-400">💎 +35 Gemas</span>
            </div>
            <div className="mt-5">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Reclamar Botín del Jefe
              </button>
            </div>
          </div>
        )}

        {/* Defeat Screen */}
        {battleState === 'defeat' && (
          <div className="mt-6 text-center p-6 bg-slate-950 rounded-3xl border border-red-500/40 animate-pop">
            <div className="text-5xl mb-2">🛡️</div>
            <h4 className="text-lg font-black text-red-400">¡El Jefe resistió el asalto!</h4>
            <p className="text-xs text-slate-400 mt-1">Repasa tus tarjetas SRS en la pestaña Aprender y vuelve con más fuerza.</p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setBossHp(100);
                  setPlayerHp(100);
                  setBattleState('playing');
                  setCombo(0);
                }}
                className="px-5 py-2 rounded-full bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 mr-2"
              >
                Reintentar
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-500"
              >
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
