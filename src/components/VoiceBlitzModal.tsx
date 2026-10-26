import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { MangaAvatar } from './MangaAvatar';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Zap, Clock, Mic, CheckCircle2, Flame, Trophy, Volume2 } from 'lucide-react';

interface VoiceBlitzModalProps {
  onClose: () => void;
}

interface BlitzQuestion {
  prompt: string;
  expectedKeywords: string[];
  optionsHint: string[];
  translation: string;
}

const EN_BLITZ_QUESTIONS: BlitzQuestion[] = [
  {
    prompt: 'How do you say "echarse el equipo a las espaldas" in gamer English?',
    expectedKeywords: ['carry', 'team'],
    optionsHint: ['Carry the team', 'Push alone', 'Lag out'],
    translation: 'Responde: "Carry the team"'
  },
  {
    prompt: 'How do you politely ask for a cappuccino in a London café?',
    expectedKeywords: ['could', 'have', 'please', 'cappuccino'],
    optionsHint: ['Could I have a cappuccino, please?', 'I want coffee', 'Give me tea'],
    translation: 'Responde: "Could I have a cappuccino, please?"'
  },
  {
    prompt: 'What do you call an unexpected plot turn in a movie or series?',
    expectedKeywords: ['plot', 'twist'],
    optionsHint: ['Plot twist', 'Spoiler', 'Cliffhanger'],
    translation: 'Responde: "Plot twist"'
  },
  {
    prompt: 'Which phrase means doing something spontaneously without prior planning?',
    expectedKeywords: ['spur', 'moment'],
    optionsHint: ['On the spur of the moment', 'By and large', 'Call it a day'],
    translation: 'Responde: "On the spur of the moment"'
  },
  {
    prompt: 'If you want to end today’s gaming session on a high note, you say let’s...',
    expectedKeywords: ['call', 'day'],
    optionsHint: ['Call it a day', 'Figure it out', 'Pull it off'],
    translation: 'Responde: "Call it a day"'
  }
];

const ZH_BLITZ_QUESTIONS: BlitzQuestion[] = [
  {
    prompt: '用汉语怎么说“¡Hola! Encantado de conocerte”？',
    expectedKeywords: ['你好', '高兴', '认识'],
    optionsHint: ['你好！很高兴认识你', '我是学生', '再见'],
    translation: 'Responde: "Nǐ hǎo! Hěn gāoxìng rènshi nǐ"'
  },
  {
    prompt: '在餐厅怎么问一道菜“¿Pica o no pica?”',
    expectedKeywords: ['辣', '不辣'],
    optionsHint: ['这个辣不辣？', '多少钱？', '买单'],
    translation: 'Responde: "Zhège là bú là?"'
  },
  {
    prompt: '在市场看到东西太贵，想让老板便宜点，怎么说？',
    expectedKeywords: ['贵', '便宜'],
    optionsHint: ['太贵了！便宜一点吧', '很好吃', '我有钱'],
    translation: 'Responde: "Tài guì le! Piányi yìdiǎn ba"'
  },
  {
    prompt: '去地铁站问路，“Disculpe, ¿cómo se va a la estación?”怎么说？',
    expectedKeywords: ['地铁', '怎么走'],
    optionsHint: ['请问，地铁站怎么走？', '换乘二号线', '买单'],
    translation: 'Responde: "Qǐngwèn, dìtiězhàn zěnme zǒu?"'
  }
];

export const VoiceBlitzModal: React.FC<VoiceBlitzModalProps> = ({ onClose }) => {
  const { language, currentProfile, addXp, addGems } = useGame();
  const companion =
    MANGA_COMPANIONS.find((c) => c.id === currentProfile.selectedCompanionId) ||
    MANGA_COMPANIONS[0];

  const questions = language === 'zh' ? ZH_BLITZ_QUESTIONS : EN_BLITZ_QUESTIONS;

  const [timeLeft, setTimeLeft] = useState(60);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [finished, setFinished] = useState(false);

  const currentQ = questions[qIndex % questions.length];

  // Timer countdown
  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setFinished(true);
          sound.playFanfare();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [finished]);

  // Read prompt aloud on question change
  useEffect(() => {
    if (!finished) {
      speech.speak(currentQ.prompt, language, { companionId: companion.id });
    }
  }, [qIndex, finished, currentQ, language, companion]);

  const handleStartMic = async () => {
    try {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        // Fallback for browsers without speech recognition
        handleAnswer(currentQ.optionsHint[0]);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language === 'zh' ? 'zh-CN' : 'en-US';
      recognition.interimResults = false;

      setIsListening(true);
      sound.playTap();

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setIsListening(false);
        setSpokenText(text);
        checkAnswer(text);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAnswer = (text: string) => {
    setSpokenText(text);
    checkAnswer(text);
  };

  const checkAnswer = (text: string) => {
    const lower = text.toLowerCase();
    const isCorrect = currentQ.expectedKeywords.some((kw) => lower.includes(kw.toLowerCase()));

    if (isCorrect) {
      sound.playCorrect();
      setScore((s) => s + 10 * combo);
      setCombo((c) => Math.min(5, c + 1));
      addXp(15 * combo);
    } else {
      sound.playWrong();
      setCombo(1);
    }

    setQIndex((i) => i + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-2xl shadow-sm">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Reto Voz Contrarreloj (60s)</h3>
              <p className="text-[11px] text-slate-500">Responde rápido al micro para multiplicar puntos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-mono text-xs font-black ${
              timeLeft <= 10 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>

            <button
              onClick={() => {
                speech.stop();
                sound.playTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {!finished ? (
          <div className="mt-4 space-y-4 text-center">
            {/* Score & Combo */}
            <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>COMBO x{combo}</span>
              </span>
              <span className="text-slate-900 font-mono text-sm">
                Puntos: <strong className="text-indigo-600 font-black">{score}</strong>
              </span>
            </div>

            {/* Question Card */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MangaAvatar id={companion.id} size="sm" className="w-7 h-7" />
                <span className="text-xs font-extrabold text-slate-700">{companion.name} pregunta:</span>
              </div>

              <div className="text-sm font-black text-slate-900 leading-snug font-serif my-2">
                "{currentQ.prompt}"
              </div>

              <p className="text-[11px] text-slate-500 font-medium">{currentQ.translation}</p>
            </div>

            {/* Big Mic Button */}
            <div className="py-2 flex flex-col items-center">
              <button
                onClick={handleStartMic}
                className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:scale-95 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                <Mic className="w-7 h-7" />
                <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">
                  {isListening ? '...' : 'Hablar'}
                </span>
              </button>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                {isListening ? '🎙️ Escuchando tu respuesta...' : 'Pulsa el micro para responder en voz alta'}
              </p>
            </div>

            {/* Quick Answer Buttons */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                O toca una opción rápida:
              </span>
              {currentQ.optionsHint.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-xs font-bold text-slate-800 transition-all text-left flex items-center justify-between shadow-xs"
                >
                  <span>{opt}</span>
                  <span className="text-[10px] text-indigo-600">Elegir</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="mt-6 text-center py-4 space-y-4 animate-pop">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-md">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-black text-amber-600 tracking-wider">
                ¡Tiempo Cumplido!
              </span>
              <h4 className="text-3xl font-black text-slate-900 mt-1">
                {score} Puntos
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                ¡Gran agilidad mental en respuestas rápidas por voz!
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-around text-xs font-bold">
              <span className="text-indigo-600">⭐ +{Math.round(score * 1.5)} XP</span>
              <span className="text-emerald-600">💎 +15 Gemas</span>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-200 transition-all"
            >
              Cerrar y Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
