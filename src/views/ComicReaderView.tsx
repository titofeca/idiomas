import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { COMIC_CHAPTERS } from '../data/comicChaptersData';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { ComicChapter, ComicVignette, AvatarExpression } from '../types';
import { MangaAvatar } from '../components/MangaAvatar';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { telegram } from '../services/telegramService';
import {
  Volume2,
  Mic,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  Trophy,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Eye,
  EyeOff,
  Share2,
} from 'lucide-react';

interface ComicReaderViewProps {
  onOpenVoiceRoom?: (phrase?: string) => void;
}

export const ComicReaderView: React.FC<ComicReaderViewProps> = ({ onOpenVoiceRoom }) => {
  const { language, addXp, addGems, currentProfile } = useGame();

  // Filter chapters by selected language or show all
  const filteredChapters = COMIC_CHAPTERS.filter((c) => c.lang === language);
  const initialChapter = filteredChapters[0] || COMIC_CHAPTERS[0];

  const [activeChapter, setActiveChapter] = useState<ComicChapter>(initialChapter);
  const [currentVignetteIndex, setCurrentVignetteIndex] = useState(0);
  const [avatarExpression, setAvatarExpression] = useState<AvatarExpression>('talking');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showPinyin, setShowPinyin] = useState(true);

  // Mic & Roleplay evaluation state
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isPanelCompleted, setIsPanelCompleted] = useState(false);
  const [showChapterVictory, setShowChapterVictory] = useState(false);

  // Avatar Showcase mode (Tocar personaje para interactuar libremente)
  const [showcaseAvatarId, setShowcaseAvatarId] = useState<string>(activeChapter.vignettes[0]?.characterId || 'kenji');
  const [showcaseDialogue, setShowcaseDialogue] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentVignette: ComicVignette = activeChapter.vignettes[currentVignetteIndex] || activeChapter.vignettes[0];
  const activeCompanion =
    MANGA_COMPANIONS.find((c) => c.id === currentVignette.characterId) || MANGA_COMPANIONS[0];

  // When chapter or vignette changes, auto-speak character dialogue
  useEffect(() => {
    setIsPanelCompleted(false);
    setPronunciationScore(null);
    setFeedbackMessage(null);
    setAvatarExpression(currentVignette.expression || 'talking');
    setShowTranslation(false);

    // Speak character line with their custom pitch and pace
    playCharacterLine(currentVignette.text, 0.9);
  }, [activeChapter.id, currentVignetteIndex]);

  // Clean up mic streams
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setAudioLevel(0);
  };

  const playCharacterLine = (text: string, pace = 0.9) => {
    sound.playTap();
    setIsAvatarSpeaking(true);
    setAvatarExpression('talking');

    speech.speak(text, activeChapter.lang, {
      pitch: activeCompanion.voicePitch,
      pace: pace,
    });

    // Reset speaking animation after duration estimate
    const durationMs = Math.max(1800, (text.length / 12) * 1000);
    setTimeout(() => {
      setIsAvatarSpeaking(false);
      setAvatarExpression(isPanelCompleted ? 'happy' : 'idle');
    }, durationMs);
  };

  // User roleplay mic recording
  const startRoleplayRecording = async () => {
    if (isRecording) {
      stopRecordingCleanup();
      return;
    }

    sound.playTap();
    speech.unlock();
    telegram.haptic('medium');
    setIsRecording(true);
    setFeedbackMessage('¡Te escucho! Habla alto y claro...');
    setAvatarExpression('thinking');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    let recognizedText = '';
    let speechRecognitionFailed = false;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = activeChapter.lang === 'zh' ? 'zh-CN' : 'en-US';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          recognizedText = currentTranscript;
        };

        recognition.onerror = () => {
          speechRecognitionFailed = true;
        };

        recognition.onend = () => {
          evaluateSpokenRoleplay(recognizedText, speechRecognitionFailed);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (e) {
        speechRecognitionFailed = true;
      }
    } else {
      speechRecognitionFailed = true;
    }

    // Audio energy visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!mediaStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round(avg * 1.8)));

        if (mediaStreamRef.current) {
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();

      // Automatically stop after 4.5 seconds of roleplay speech
      setTimeout(() => {
        if (mediaStreamRef.current) {
          stopRecordingCleanup();
          if (speechRecognitionFailed) {
            evaluateSpokenRoleplay(recognizedText, true);
          }
        }
      }, 4200);
    } catch (err) {
      setIsRecording(false);
      setFeedbackMessage('Permiso de micrófono no disponible. ¡Puedes usar las opciones de texto abajo!');
    }
  };

  const evaluateSpokenRoleplay = (spokenText: string, isFallback: boolean) => {
    stopRecordingCleanup();
    const prompt = currentVignette.userRoleplayPrompt;
    if (!prompt) return;

    let score = 92;
    if (!isFallback && spokenText) {
      const targetWords = prompt.targetPhrase.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean);
      const spokenWords = spokenText.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean);
      let matches = 0;
      targetWords.forEach((tw) => {
        if (spokenWords.some((sw) => sw.includes(tw) || tw.includes(sw))) {
          matches++;
        }
      });
      score = targetWords.length > 0 ? Math.min(100, Math.max(75, Math.round((matches / targetWords.length) * 100))) : 90;
    } else {
      score = 88 + Math.floor(Math.random() * 10);
    }

    setPronunciationScore(score);
    setIsPanelCompleted(true);
    setAvatarExpression('celebrating');
    sound.playFanfare();
    telegram.haptic('success');
    addXp(25);
    addGems(5);

    setFeedbackMessage(
      score >= 90
        ? `⭐ ¡Pronunciación Legendaria! (${score}%) ¡${activeCompanion.name} está eufórico!`
        : `👍 ¡Muy bien! (${score}%) Has completado la línea de cómic.`
    );
  };

  const handleSelectOptionText = (optionText: string) => {
    sound.playTap();
    telegram.haptic('light');
    setPronunciationScore(95);
    setIsPanelCompleted(true);
    setAvatarExpression('happy');
    sound.playCorrect();
    addXp(15);
    addGems(2);
    setFeedbackMessage(`✨ ¡Excelente respuesta! Has hecho avanzar la historia.`);
    speech.speak(optionText, activeChapter.lang);
  };

  const handleNextVignette = () => {
    sound.playTap();
    telegram.haptic('light');
    if (currentVignetteIndex < activeChapter.vignettes.length - 1) {
      setCurrentVignetteIndex((prev) => prev + 1);
    } else {
      // Finished Chapter
      sound.playFanfare();
      telegram.haptic('success');
      addXp(activeChapter.rewardXp);
      addGems(activeChapter.rewardGems);
      setShowChapterVictory(true);
    }
  };

  const handlePrevVignette = () => {
    sound.playTap();
    if (currentVignetteIndex > 0) {
      setCurrentVignetteIndex((prev) => prev - 1);
    }
  };

  const handleSwitchChapter = (chapter: ComicChapter) => {
    sound.playTap();
    telegram.haptic('medium');
    setActiveChapter(chapter);
    setCurrentVignetteIndex(0);
    setShowChapterVictory(false);
  };

  // Avatar Showcase tap reaction
  const handleShowcaseTap = (companionId: string) => {
    sound.playTap();
    telegram.haptic('medium');
    setShowcaseAvatarId(companionId);
    const companion = MANGA_COMPANIONS.find((c) => c.id === companionId) || MANGA_COMPANIONS[0];
    const greeting = activeChapter.lang === 'zh' ? companion.greetingZh : companion.greetingEn;
    setShowcaseDialogue(greeting);

    speech.speak(greeting, activeChapter.lang, {
      pitch: companion.voicePitch,
      pace: companion.voiceRate,
    });
  };

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-md mx-auto">
      {/* Chapter Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
        {COMIC_CHAPTERS.map((ch) => {
          const isSelected = ch.id === activeChapter.id;
          return (
            <button
              key={ch.id}
              onClick={() => handleSwitchChapter(ch)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-gradient-to-r ' + ch.coverGradient + ' text-white font-extrabold shadow-md scale-102 border-transparent'
                  : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">{ch.coverEmoji}</span>
              <div className="text-left">
                <p className="text-[11px] font-black leading-none line-clamp-1">{ch.title}</p>
                <p className={`text-[9px] font-medium leading-none mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {ch.lang === 'zh' ? 'Mandarín' : 'Inglés'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Comic Header Info */}
      <div className="bg-white rounded-3xl p-3.5 border border-slate-200/90 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
            {activeChapter.level}
          </span>
          <h2 className="text-base font-black text-slate-900 mt-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            {activeChapter.title}
          </h2>
        </div>

        {/* Panel Stepper */}
        <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
          <span>Viñeta {currentVignetteIndex + 1}/{activeChapter.vignettes.length}</span>
        </div>
      </div>

      {/* Main Manga Comic Frame (Viñeta Manga Interactiva) */}
      <div className="relative rounded-3xl overflow-hidden border-3 border-slate-900 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950 p-4 shadow-xl text-white">
        {/* Onomatopoeia Badge */}
        {currentVignette.onomatopoeia && (
          <div
            className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-xl shadow-lg font-black text-xs uppercase tracking-wider transform transition-transform ${
              currentVignette.onomatopoeia.rotation || ''
            } ${currentVignette.onomatopoeia.color} animate-pop`}
          >
            <div>{currentVignette.onomatopoeia.text}</div>
            {currentVignette.onomatopoeia.subtext && (
              <div className="text-[8px] opacity-90">{currentVignette.onomatopoeia.subtext}</div>
            )}
          </div>
        )}

        {/* Character Stage: Interactive Animated Avatar */}
        <div className="flex items-center gap-4 pt-2">
          <div className="relative shrink-0 flex flex-col items-center">
            <MangaAvatar
              id={currentVignette.characterId}
              size="2xl"
              expression={avatarExpression}
              isSpeaking={isAvatarSpeaking}
              onClick={() => playCharacterLine(currentVignette.text)}
              className="ring-4 ring-white/20 shadow-2xl"
            />
            <span className="mt-1 text-[11px] font-black text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-400/30">
              {currentVignette.characterName}
            </span>
          </div>

          {/* Manga Speech Balloon */}
          <div className="flex-1 bg-white text-slate-900 rounded-3xl p-3.5 shadow-xl relative animate-pop border-2 border-slate-900">
            {/* Balloon Tail */}
            <div className="absolute top-6 -left-2.5 w-4 h-4 bg-white border-l-2 border-b-2 border-slate-900 transform rotate-45" />

            <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-100">
              <span className="text-[10px] font-extrabold text-indigo-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Línea de Cómic
              </span>

              {/* Audio Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => playCharacterLine(currentVignette.text, 0.9)}
                  className="p-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  title="Escuchar audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => playCharacterLine(currentVignette.text, 0.55)}
                  className="px-1.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] font-bold"
                  title="Modo lento 0.55x"
                >
                  🐢 0.55x
                </button>
              </div>
            </div>

            {/* Character Dialogue Text */}
            <p className="text-xs font-bold leading-relaxed text-slate-800">
              "{currentVignette.text}"
            </p>

            {/* Chinese Pinyin */}
            {currentVignette.pinyin && showPinyin && (
              <p className="text-[11px] font-medium text-amber-700 mt-1 italic">
                {currentVignette.pinyin}
              </p>
            )}

            {/* Translation Eye */}
            <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-slate-500 hover:text-indigo-600 font-semibold flex items-center gap-1"
              >
                {showTranslation ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showTranslation ? 'Ocultar' : 'Ver traducción'}</span>
              </button>
            </div>

            {showTranslation && (
              <p className="text-[11px] font-medium text-slate-600 mt-1 bg-slate-50 p-2 rounded-xl">
                {currentVignette.translation}
              </p>
            )}
          </div>
        </div>

        {/* Player Interactive Roleplay Panel (Tu turno en el cómic) */}
        {currentVignette.userRoleplayPrompt && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                🎯 {currentVignette.userRoleplayPrompt.instruction}
              </span>
              {pronunciationScore !== null && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  {pronunciationScore}% Acertado
                </span>
              )}
            </div>

            {/* Target line to speak */}
            <div className="bg-slate-900/90 rounded-2xl p-3 border border-amber-400/40 relative">
              <p className="text-sm font-extrabold text-white text-center">
                "{currentVignette.userRoleplayPrompt.targetPhrase}"
              </p>
              {currentVignette.userRoleplayPrompt.pinyin && (
                <p className="text-xs font-semibold text-amber-300 text-center mt-0.5">
                  {currentVignette.userRoleplayPrompt.pinyin}
                </p>
              )}
              <p className="text-[10px] text-slate-300 text-center mt-1 italic">
                {currentVignette.userRoleplayPrompt.translation}
              </p>

              {currentVignette.userRoleplayPrompt.coachTip && (
                <p className="text-[10px] text-sky-300 mt-2 text-center bg-sky-950/60 py-1 px-2 rounded-lg border border-sky-800">
                  💡 {currentVignette.userRoleplayPrompt.coachTip}
                </p>
              )}
            </div>

            {/* Voice Mic Button */}
            <div className="mt-3 flex flex-col items-center">
              <button
                onClick={startRoleplayRecording}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm shadow-xl transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300 scale-105'
                    : 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 hover:scale-105 active:scale-95'
                }`}
              >
                <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-slate-950'}`} />
                <span>{isRecording ? '¡Te escucho! Habla ahora...' : '🎤 Habla al micrófono'}</span>
              </button>

              {/* Sound wave visualizer while recording */}
              {isRecording && (
                <div className="flex items-center gap-1 mt-2">
                  <div
                    className="h-1.5 bg-amber-400 rounded-full transition-all duration-75"
                    style={{ width: `${Math.max(15, audioLevel * 1.5)}px` }}
                  />
                  <span className="text-[10px] text-amber-300 font-bold">Nivel de voz: {audioLevel}%</span>
                </div>
              )}

              {/* Feedback Alert */}
              {feedbackMessage && (
                <p className="text-xs font-bold text-amber-200 mt-2 text-center animate-pop">
                  {feedbackMessage}
                </p>
              )}
            </div>

            {/* Alternate Text Options if microphone is quiet */}
            {currentVignette.userRoleplayPrompt.options && (
              <div className="mt-3">
                <p className="text-[10px] text-slate-400 text-center mb-1.5">
                  ¿En un lugar con ruido? Pulsa tu respuesta:
                </p>
                <div className="space-y-1.5">
                  {currentVignette.userRoleplayPrompt.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOptionText(opt)}
                      className="w-full text-left text-xs font-semibold p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all flex items-center justify-between"
                    >
                      <span>"{opt}"</span>
                      <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panel Navigation Buttons */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handlePrevVignette}
            disabled={currentVignetteIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
              currentVignetteIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-500'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            onClick={handleNextVignette}
            className={`flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-black shadow-lg transition-all ${
              isPanelCompleted
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 scale-105 ring-2 ring-emerald-300 animate-bounce'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            <span>{currentVignetteIndex < activeChapter.vignettes.length - 1 ? 'Siguiente Viñeta' : '¡Completar Cómic!'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Virtual Avatar Showcase & Free Voice Interaction Stage */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🎭</span>
            <h3 className="text-sm font-black text-slate-900">Escenario de Avatares Virtuales</h3>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            Toca para interactuar
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Toca a cualquier personaje para escuchar su saludo con voz personalizada y cambiar su humor:
        </p>

        {/* Avatar Horizontal Selector */}
        <div className="grid grid-cols-5 gap-2">
          {MANGA_COMPANIONS.map((companion) => {
            const isSelected = companion.id === showcaseAvatarId;
            return (
              <button
                key={companion.id}
                onClick={() => handleShowcaseTap(companion.id)}
                className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-2 border-indigo-500 scale-105 shadow-sm'
                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MangaAvatar
                  id={companion.id}
                  size="md"
                  expression={isSelected ? 'happy' : 'idle'}
                  isSpeaking={isSelected && isAvatarSpeaking}
                />
                <span className="text-[10px] font-bold text-slate-800 mt-1 line-clamp-1">
                  {companion.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Avatar Greeting Bubble */}
        {showcaseDialogue && (
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/70 text-slate-800 animate-pop flex items-start gap-2.5">
            <span className="text-lg">💬</span>
            <div className="flex-1">
              <p className="text-xs font-bold leading-relaxed">
                "{showcaseDialogue}"
              </p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    const comp = MANGA_COMPANIONS.find((c) => c.id === showcaseAvatarId);
                    if (comp) speech.speak(showcaseDialogue, activeChapter.lang, { pitch: comp.voicePitch, pace: 0.88 });
                  }}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  <Volume2 className="w-3 h-3" /> Repetir voz
                </button>
                {onOpenVoiceRoom && (
                  <button
                    onClick={() => onOpenVoiceRoom(showcaseDialogue)}
                    className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                  >
                    <Mic className="w-3 h-3" /> Conversar en Sala de Voz
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chapter Victory Modal */}
      {showChapterVictory && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center border-4 border-amber-400 shadow-2xl animate-pop relative">
            <span className="text-5xl mb-2 inline-block animate-bounce">🏆</span>
            <h3 className="text-xl font-black text-slate-900">¡Capítulo de Cómic Superado!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Has completado todas las viñetas y desafíos de rol de "{activeChapter.title}".
            </p>

            <div className="my-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-around">
              <div>
                <span className="text-xs text-amber-700 font-bold block">XP Ganados</span>
                <span className="text-xl font-black text-amber-900">+{activeChapter.rewardXp} XP</span>
              </div>
              <div className="w-px h-8 bg-amber-200" />
              <div>
                <span className="text-xs text-amber-700 font-bold block">Gemas</span>
                <span className="text-xl font-black text-amber-900">+{activeChapter.rewardGems} 💎</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  sound.playTap();
                  setShowChapterVictory(false);
                  setCurrentVignetteIndex(0);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm shadow-md hover:scale-102 active:scale-98 transition-all"
              >
                Volver a Leer el Cómic
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  // Switch to next chapter
                  const currentIdx = COMIC_CHAPTERS.findIndex((c) => c.id === activeChapter.id);
                  const nextCh = COMIC_CHAPTERS[(currentIdx + 1) % COMIC_CHAPTERS.length];
                  handleSwitchChapter(nextCh);
                }}
                className="w-full py-2.5 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold text-xs hover:bg-indigo-100 transition-all"
              >
                Siguiente Capítulo Manga
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
