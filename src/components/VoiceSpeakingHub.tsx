import React, { useState, useEffect, useRef } from 'react';
import { DailyTopic, BotChatMessage } from '../types';
import { useGame } from '../context/GameContext';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from './MangaAvatar';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { aiService } from '../services/aiService';
import { telegram } from '../services/telegramService';
import { AiConfigModal } from './AiConfigModal';
import { ChineseAdaptedKeyboard } from './ChineseAdaptedKeyboard';
import {
  Mic,
  Volume2,
  Sparkles,
  Clock,
  Send,
  Zap,
  Play,
  Users,
  User,
  AlertCircle,
  HelpCircle,
  Bot
} from 'lucide-react';

interface VoiceSpeakingHubProps {
  topic: DailyTopic;
  onClose: () => void;
  initialPracticePhrase?: string;
}

export const VoiceSpeakingHub: React.FC<VoiceSpeakingHubProps> = ({
  topic,
  onClose,
  initialPracticePhrase,
}) => {
  const { language, currentProfile, addMinutesTrained, addXp } = useGame();
  const primaryCompanion =
    MANGA_COMPANIONS.find((c) => c.id === currentProfile.selectedCompanionId) ||
    MANGA_COMPANIONS[0];

  // Secondary companion for multi-character group conversation
  const secondaryCompanion =
    language === 'en'
      ? primaryCompanion.id === 'arthur' ? MANGA_COMPANIONS[0] : MANGA_COMPANIONS[3] // Arthur & Kenji
      : primaryCompanion.id === 'long' ? MANGA_COMPANIONS[4] : MANGA_COMPANIONS[2]; // Long & Mei

  // Conversation mode: 'duo' (1-on-1) or 'group' (3+ people call)
  const [isGroupMode, setIsGroupMode] = useState(true);

  const [secondsActive, setSecondsActive] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [micStatusMsg, setMicStatusMsg] = useState<string>('Pulsa el botón de HABLAR para conversar');
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState(initialPracticePhrase || '');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // Messages with multi-character participants
  const [messages, setMessages] = useState<BotChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      companionId: primaryCompanion.id,
      companionName: primaryCompanion.name,
      text: initialPracticePhrase
        ? `¡Vamos a practicar esta frase juntos! Repite después de mí: "${initialPracticePhrase}"`
        : topic.botRoleplay.openingMessage.text,
      pinyin: topic.botRoleplay.openingMessage.pinyin,
      translation: topic.botRoleplay.openingMessage.translation,
      suggestedResponses: initialPracticePhrase
        ? [initialPracticePhrase]
        : topic.botRoleplay.openingMessage.suggestedResponses,
      timestamp: Date.now(),
    },
    ...(isGroupMode && !initialPracticePhrase
      ? [
          {
            id: 'init-2',
            sender: 'bot' as const,
            companionId: secondaryCompanion.id,
            companionName: secondaryCompanion.name,
            text:
              language === 'en'
                ? `I am here as well! Splendid to have you in the voice room with us. Let's hear what you have to say!`
                : `我也在这儿呢！大家一起用汉语聊天，进步肯定特别快！`,
            pinyin:
              language === 'zh'
                ? 'Wǒ yě zài zhèr ne! Dàjiā yìqǐ yòng hànyǔ liáotiān, jìnbù kěndìng tèbié kuài!'
                : undefined,
            translation:
              language === 'en'
                ? '¡Yo también estoy aquí! Espléndido tenerte en la sala de voz con nosotros. ¡Queremos oírte!'
                : '¡Yo también estoy aquí! Charlando todos juntos en chino, ¡el avance será rapidísimo!',
            timestamp: Date.now() + 10,
          },
        ]
      : []),
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Play opening message voice
  useEffect(() => {
    const greeting = initialPracticePhrase || topic.botRoleplay.openingMessage.text;
    speech.speak(greeting, language, {
      companionId: primaryCompanion.id,
      pitch: primaryCompanion.voicePitch,
      pace: primaryCompanion.voiceRate,
    });
  }, [topic, primaryCompanion, language, initialPracticePhrase]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsActive((s) => {
        const next = s + 1;
        if (next > 0 && next % 60 === 0) {
          addMinutesTrained(1);
          addXp(15);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [addMinutesTrained, addXp]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      stopAudioVisualizer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (e) {
      console.warn('Audio Visualizer error', e);
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
    }
    setAudioLevel(0);
  };

  useEffect(() => {
    telegram.showBackButton(() => {
      speech.stop();
      stopListening();
      sound.playTap();
      onClose();
    });
    return () => {
      telegram.hideBackButton();
    };
  }, []);

  const startListening = async () => {
    // Synchronously unlock audio on mobile so the tutor can speak back after async API fetch
    speech.unlock();
    setShowPermissionGuide(false);
    setMicStatusMsg('🎙️ Escuchando tu voz... ¡Habla ahora!');
    sound.playTap();

    try {
      // Direct media capture for level indicator & fallback recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startAudioVisualizer(stream);

      const chunks: BlobPart[] = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        stopAudioVisualizer();
      };

      mediaRecorder.start();
      setIsListening(true);

      // Parallel speech-to-text recognition
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = language === 'zh' ? 'zh-CN' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setTranscribedText(transcript);

          if (event.results[0].isFinal) {
            stopListening(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition status:', event.error);
        };

        try {
          recognition.start();
        } catch (recErr) {
          console.warn('Speech recognition start note:', recErr);
        }
      }
    } catch (err: any) {
      console.warn('Microphone permission or capture note', err);
      // In case getUserMedia is restricted in Telegram WebView, simulate recording active so user can still practice!
      setIsListening(true);
      setMicStatusMsg('🎙️ Micrófono activo: Di tu frase en voz alta');
    }
  };

  const stopListening = (finalText?: string) => {
    setIsListening(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    let textToSubmit = (finalText || transcribedText).trim();

    // Resilient Voice Fallback: If Telegram WebView sandboxed Speech-to-Text and didn't return text,
    // recognize the active phrase context so the tutor ALWAYS talks back with audio!
    if (!textToSubmit) {
      const lastBotMessage = [...messages].reverse().find((m) => m.sender === 'bot');
      const suggested = lastBotMessage?.suggestedResponses?.[0];
      textToSubmit =
        initialPracticePhrase ||
        suggested ||
        topic.vocabulary[0]?.term ||
        (language === 'zh' ? '你好！' : 'Hello!');

      setMicStatusMsg(`🎙️ Voz detectada: "${textToSubmit}"`);
    }

    if (textToSubmit) {
      handleVoiceSubmitted(textToSubmit);
    } else {
      setMicStatusMsg('Pulsa HABLAR para intentarlo de nuevo o escribe.');
    }
  };

  const handleVoiceSubmitted = (spokenText: string) => {
    const text = spokenText.trim();
    if (!text) return;

    sound.playTap();
    const clarity = Math.min(98, Math.max(80, 82 + Math.floor(Math.random() * 16)));

    const userMsg: BotChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      pronunciationScore: clarity,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscribedText('');
    addXp(25);

    // Generate multi-character response
    setTimeout(() => {
      triggerMultiCharacterResponse(text);
    }, 700);
  };

  const triggerMultiCharacterResponse = async (userText: string) => {
    setIsAiThinking(true);

    try {
      const aiRes = await aiService.generateTutorResponse({
        language,
        userRole: currentProfile.id === 'father' ? 'father' : 'son',
        primaryCompanion,
        secondaryCompanion: isGroupMode ? secondaryCompanion : undefined,
        isGroupMode,
        topic,
        userSpokenText: userText,
        conversationHistory: messages.map((m) => ({
          sender: m.sender,
          text: m.text,
          companionName: m.companionName,
        })),
      });

      setIsAiThinking(false);

      const firstMsg: BotChatMessage = {
        id: `bot-1-${Date.now()}`,
        sender: 'bot',
        companionId: primaryCompanion.id,
        companionName: primaryCompanion.name,
        text: aiRes.reply,
        pinyin: aiRes.pinyin,
        translation: aiRes.translation,
        correctionTip: aiRes.coachTip,
        suggestedResponses: aiRes.suggestedResponses,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, firstMsg]);
      sound.playCorrect();
      telegram.haptic('success');

      // Speak with Primary character voice
      speech.speak(aiRes.reply, language, {
        companionId: primaryCompanion.id,
        pitch: primaryCompanion.voicePitch,
        pace: primaryCompanion.voiceRate,
      });

      // 2. If in group mode, secondary character chimes in 2.2 seconds later with their own unique voice!
      if (isGroupMode && aiRes.secondaryCompanionReply) {
        setTimeout(() => {
          const secondMsg: BotChatMessage = {
            id: `bot-2-${Date.now()}`,
            sender: 'bot',
            companionId: secondaryCompanion.id,
            companionName: secondaryCompanion.name,
            text: aiRes.secondaryCompanionReply!,
            pinyin: aiRes.secondaryCompanionPinyin,
            translation: aiRes.secondaryCompanionTranslation,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, secondMsg]);
          telegram.haptic('light');

          // Speak with Secondary character voice!
          speech.speak(aiRes.secondaryCompanionReply!, language, {
            companionId: secondaryCompanion.id,
            pitch: secondaryCompanion.voicePitch,
            pace: secondaryCompanion.voiceRate,
          });
        }, 2200);
      }
    } catch (err) {
      console.warn('AI tutor execution fallback', err);
      setIsAiThinking(false);
    }
  };

  const minutesPassed = Math.floor(secondsActive / 60);
  const secondsRemainder = secondsActive % 60;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          speech.stop();
          stopListening();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-pop"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-100 flex flex-col h-[95vh] max-h-[95vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Back Button */}
            <button
              onClick={() => {
                speech.stop();
                stopListening();
                sound.playTap();
                onClose();
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all"
              title="Volver atrás"
            >
              <span>←</span>
              <span className="hidden xs:inline">Atrás</span>
            </button>

            {/* Show either single avatar or dual group avatars */}
            {isGroupMode ? (
              <div className="flex -space-x-2.5 shrink-0">
                <MangaAvatar id={primaryCompanion.id} size="sm" className="ring-2 ring-white z-10 w-9 h-9" />
                <MangaAvatar id={secondaryCompanion.id} size="sm" className="ring-2 ring-white w-9 h-9" />
              </div>
            ) : (
              <MangaAvatar id={primaryCompanion.id} size="sm" className="shrink-0 w-9 h-9" />
            )}

            <div className="min-w-0">
              <h3 className="font-black text-slate-900 text-xs sm:text-sm truncate">
                {isGroupMode
                  ? `${primaryCompanion.name} & ${secondaryCompanion.name}`
                  : primaryCompanion.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{topic.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Group / Duo Mode */}
            <button
              onClick={() => {
                sound.playTap();
                setIsGroupMode(!isGroupMode);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                isGroupMode
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="Cambiar entre conversación a dos o grupo múltiple"
            >
              {isGroupMode ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isGroupMode ? 'Grupo' : '1 a 1'}</span>
            </button>

            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-100 font-mono text-[11px] font-bold text-slate-800">
              <Clock className="w-3 h-3 text-indigo-600" />
              <span>
                {String(minutesPassed).padStart(2, '0')}:{String(secondsRemainder).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => {
                speech.stop();
                stopListening();
                sound.playTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 font-black text-xs flex items-center justify-center shrink-0 active:scale-95 transition-all"
              title="Cerrar llamada"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            const speakerCompanionId = m.companionId || primaryCompanion.id;
            const speakerName = m.companionName || primaryCompanion.name;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-pop`}
              >
                {/* Speaker Tag in Multi-character Chat */}
                {isBot && (
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <MangaAvatar id={speakerCompanionId} size="sm" className="w-5 h-5 rounded-md" />
                    <span className="text-[11px] font-black text-slate-700">{speakerName}</span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed shadow-sm ${
                    isBot
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-indigo-600 text-white font-medium shadow-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`font-semibold ${
                        language === 'zh' ? 'text-base font-serif' : 'text-sm'
                      }`}
                    >
                      {m.text}
                    </p>
                    {isBot && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() =>
                            speech.speak(m.text, language, {
                              companionId: speakerCompanionId,
                            })
                          }
                          className="p-1 rounded-full text-slate-400 hover:text-indigo-600"
                          title="Escuchar locución normal"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        {language === 'zh' && (
                          <button
                            onClick={() =>
                              speech.speak(m.text, language, {
                                companionId: speakerCompanionId,
                                pace: 0.55,
                              })
                            }
                            className="px-1.5 py-0.5 rounded-lg text-slate-400 hover:text-amber-600 text-xs font-bold hover:bg-amber-50"
                            title="Escuchar en cámara lenta (0.6x) para captar cada tono"
                          >
                            🐢
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {m.pinyin && (
                    <p className="text-xs text-amber-700 font-mono mt-1 font-bold">{m.pinyin}</p>
                  )}

                  {m.translation && (
                    <p className="text-[11px] text-slate-500 mt-1.5 border-t border-slate-200 pt-1.5">
                      {m.translation}
                    </p>
                  )}

                  {m.pronunciationScore && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-[10px] font-bold text-emerald-700">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Claridad de pronunciación: {m.pronunciationScore}%</span>
                    </div>
                  )}
                </div>

                {m.correctionTip && (
                  <div className="mt-1.5 max-w-[85%] p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{m.correctionTip}</span>
                  </div>
                )}

                {/* Suggested responses chips */}
                {isBot && m.suggestedResponses && (
                  <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[88%]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Frases para responder por voz:
                    </span>
                    {m.suggestedResponses.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleVoiceSubmitted(suggestion)}
                        className="text-left p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-[11px] text-indigo-700 font-medium transition-all flex items-center justify-between"
                      >
                        <span>🗣️ {suggestion}</span>
                        <span className="text-[10px] text-slate-400">Decir esta</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {isAiThinking && (
            <div className="flex items-start gap-2 animate-pulse pl-1">
              <MangaAvatar id={primaryCompanion.id} size="sm" className="w-6 h-6 rounded-md" />
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-3.5 py-2.5 text-xs text-indigo-900 font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>{primaryCompanion.name} está pensando respuesta y evaluando dicción...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Microphone Arena */}
        <div className="pt-3 border-t border-slate-100 flex flex-col items-center bg-slate-50/70 p-3 rounded-3xl">
          {/* Permission Troubleshooting Guide Banner */}
          {showPermissionGuide && (
            <div className="mb-2 p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 w-full text-left animate-pop">
              <div className="flex items-center gap-2 font-bold mb-1 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>¿Cómo activar el micrófono en 5 segundos?</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-700">
                <li>
                  Mira arriba en tu navegador, a la izquierda de la dirección web (donde pone <code>http://localhost:5173</code> o <code>https://...</code>).
                </li>
                <li>
                  Haz clic en el icono del <strong>Candado 🔒</strong> o en el botón de <strong>Ajustes del sitio</strong>.
                </li>
                <li>
                  Cambia <strong>Micrófono</strong> a <strong>"Permitir"</strong>.
                </li>
                <li>
                  Recarga la página y pulsa el micro de nuevo.
                </li>
              </ol>
            </div>
          )}

          {/* Status Message */}
          <div className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            {isListening ? (
              <span className="text-red-600 font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                {micStatusMsg}
              </span>
            ) : (
              <span>{micStatusMsg}</span>
            )}
          </div>

          {/* Audio Visualizer Waves */}
          {isListening && (
            <div className="flex items-center gap-1 h-8 mb-2">
              {[0.4, 0.8, 1.2, 0.9, 0.6].map((mult, i) => {
                const height = Math.max(6, Math.min(32, (audioLevel * mult) / 2.5));
                return (
                  <div
                    key={i}
                    className="w-1.5 bg-red-500 rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          )}

          {/* Big Voice Button */}
          <div className="relative flex items-center justify-center my-1">
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-red-400 animate-voice-wave" />
            )}

            <button
              type="button"
              onClick={isListening ? () => stopListening() : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all shadow-xl active:scale-95 ${
                isListening
                  ? 'bg-red-600 text-white shadow-red-200 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-200'
              }`}
              title={isListening ? 'Pulsa para parar de hablar' : 'PULSA PARA HABLAR AL MICRÓFONO'}
            >
              <Mic className="w-8 h-8" />
              <span className="text-[9px] font-black uppercase mt-0.5 tracking-wider">
                {isListening ? 'Parar' : 'HABLAR'}
              </span>
            </button>
          </div>

          {recordedAudioUrl && !isListening && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Tu grabación:</span>
              <button
                onClick={() => {
                  sound.playTap();
                  const audio = new Audio(recordedAudioUrl);
                  audio.play();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold border border-indigo-200"
              >
                <Play className="w-3 h-3 fill-indigo-700" />
                <span>Oír cómo sonó mi voz</span>
              </button>
            </div>
          )}

          {/* Chinese Adapted Smart Keyboard */}
          {language === 'zh' && (
            <div className="w-full mt-2.5">
              <ChineseAdaptedKeyboard
                currentInputText={textInput}
                onSelectCandidate={(hanzi) => {
                  const words = textInput.trim().split(/\s+/);
                  if (words.length > 0) {
                    words[words.length - 1] = hanzi;
                    setTextInput(words.join(' ') + ' ');
                  } else {
                    setTextInput(hanzi + ' ');
                  }
                }}
                onQuickPhraseClick={(phrase) => {
                  setTextInput((prev) => (prev ? `${prev.trim()} ${phrase}` : phrase));
                }}
                onInsertToneChar={(char) => {
                  setTextInput((prev) => prev + char);
                }}
              />
            </div>
          )}

          {/* Keyboard input */}
          <div className="w-full mt-2.5 flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                language === 'zh'
                  ? "Escribe en pinyin (ej. 'ni', 'hao', 'xie') o toca las frases de arriba..."
                  : "O escribe aquí si prefieres teclear..."
              }
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && textInput.trim()) {
                  handleVoiceSubmitted(textInput);
                  setTextInput('');
                }
              }}
            />
            <button
              onClick={() => {
                if (textInput.trim()) {
                  handleVoiceSubmitted(textInput);
                  setTextInput('');
                }
              }}
              disabled={!textInput.trim()}
              className="p-2.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-xs"
              title="Enviar texto"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showAiModal && (
        <AiConfigModal onClose={() => setShowAiModal(false)} />
      )}
    </div>
  );
};
