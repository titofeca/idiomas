import React, { useState, useEffect, useRef } from 'react';
import { DailyTopic, BotChatMessage } from '../types';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { Mic, MicOff, Send, Volume2, Sparkles, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

interface VoiceBotConversationProps {
  topic: DailyTopic;
  onClose: () => void;
}

export const VoiceBotConversation: React.FC<VoiceBotConversationProps> = ({ topic, onClose }) => {
  const { language, addMinutesTrained, addXp } = useGame();
  
  // Timer state (session tracking)
  const [secondsActive, setSecondsActive] = useState(0);

  // Messages in this conversation
  const [messages, setMessages] = useState<BotChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: topic.botRoleplay.openingMessage.text,
      pinyin: topic.botRoleplay.openingMessage.pinyin,
      translation: topic.botRoleplay.openingMessage.translation,
      suggestedResponses: topic.botRoleplay.openingMessage.suggestedResponses,
      timestamp: Date.now(),
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Play bot audio on mount
  useEffect(() => {
    speech.speak(topic.botRoleplay.openingMessage.text, language, { pace: 0.85 });
  }, [topic, language]);

  // Track session timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsActive((s) => {
        const next = s + 1;
        if (next > 0 && next % 60 === 0) {
          // Add 1 real minute of study to profile
          addMinutesTrained(1);
          addXp(10);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [addMinutesTrained, addXp]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Web Speech Recognition handler
  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'zh' ? 'zh-CN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      sound.playTap();

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setIsListening(false);
        handleSendMessage(spokenText);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      console.warn('Speech recognition error', e);
    }
  };

  const handleSendMessage = (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    sound.playTap();
    const userMsg: BotChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    addXp(15);

    // Formulate intelligent bot reply based on scenario
    setTimeout(() => {
      generateBotResponse(text);
    }, 700);
  };

  const generateBotResponse = (userText: string) => {
    const lower = userText.toLowerCase();
    
    // Find matching flow or fallback
    const matchedFlow = topic.botRoleplay.dialogueFlow.find((flow) =>
      flow.triggerUserContains.some((keyword) => lower.includes(keyword.toLowerCase()))
    );

    let botReplyText = '';
    let pinyinReply: string | undefined = undefined;
    let translationReply = '';
    let tip = '';
    let nextSuggestions: string[] = [];

    if (matchedFlow) {
      botReplyText = matchedFlow.botResponse;
      pinyinReply = matchedFlow.pinyin;
      translationReply = matchedFlow.translation;
      tip = matchedFlow.feedbackNote || '';
      nextSuggestions = matchedFlow.nextSuggestions;
    } else {
      // General dynamic conversational answer
      if (language === 'zh') {
        botReplyText = '我明白你的意思了！你说得非常自然，我们继续聊这个话题吧。';
        pinyinReply = 'Wǒ míngbai nǐ de yìsi le! Nǐ shuō de fēicháng zìrán, wǒmen jìxù liáo zhège huàtí ba.';
        translationReply = '¡Entiendo lo que quieres decir! Suena muy natural, continuemos con este tema.';
        tip = 'Has contestado con soltura. Procura fijarte en mantener los tonos limpios.';
        nextSuggestions = [
          '太好了，我想多练习一下！ (Tài hǎo le, wǒ xiǎng duō liànxí yíxià!)',
          '请问你可以再说慢一点吗？ (Qǐngwèn nǐ kěyǐ zài shuō màn yìdiǎn ma?)'
        ];
      } else {
        botReplyText = 'That makes total sense! Great way to phrase it. What would you do next in this situation?';
        translationReply = '¡Tiene todo el sentido! Muy bien formulado. ¿Qué harías a continuación en esta situación?';
        tip = 'Good fluency! Tu mensaje se ha entendido perfectamente sin pausas artificiales.';
        nextSuggestions = [
          'I would probably double check the plan first.',
          'Let’s move forward and see what happens!',
          'Could you repeat that a bit slower, please?'
        ];
      }
    }

    const botMsg: BotChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botReplyText,
      pinyin: pinyinReply,
      translation: translationReply,
      correctionTip: tip,
      suggestedResponses: nextSuggestions,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, botMsg]);
    sound.playCorrect();
    speech.speak(botReplyText, language, { pace: 0.85 });
  };

  const minutesPassed = Math.floor(secondsActive / 60);
  const secondsRemainder = secondsActive % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-pop">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col h-[92vh]">
        {/* Top Header & Session Timer */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="text-2xl p-2 rounded-2xl bg-slate-800 border border-slate-700">
              {topic.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-sm">{topic.botRoleplay.botPersona}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                {topic.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Active timer badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {String(minutesPassed).padStart(2, '0')}:{String(secondsRemainder).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => {
                speech.stop();
                sound.playTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} animate-pop`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isBot
                      ? 'bg-slate-800/95 border border-slate-700 text-slate-100'
                      : 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-semibold ${language === 'zh' ? 'text-sm font-serif' : 'text-xs'}`}>
                      {m.text}
                    </p>
                    {isBot && (
                      <button
                        onClick={() => speech.speak(m.text, language, { pace: 0.85 })}
                        className="p-1 rounded-full text-slate-400 hover:text-white shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {m.pinyin && (
                    <p className="text-[11px] text-amber-300 font-mono mt-0.5">{m.pinyin}</p>
                  )}

                  {m.translation && (
                    <p className="text-[11px] text-slate-400 mt-1 border-t border-slate-700/60 pt-1">
                      {m.translation}
                    </p>
                  )}
                </div>

                {/* Coaching tip from bot */}
                {m.correctionTip && (
                  <div className="mt-1 max-w-[85%] p-2 rounded-xl bg-amber-950/40 border border-amber-600/30 text-[11px] text-amber-200 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{m.correctionTip}</span>
                  </div>
                )}

                {/* Suggested prompt chips */}
                {isBot && m.suggestedResponses && m.suggestedResponses.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[88%]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Respuestas sugeridas (toca para decir):
                    </span>
                    {m.suggestedResponses.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-left p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500 text-[11px] text-indigo-300 hover:text-white transition-all active:scale-98"
                      >
                        💬 {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar with Voice & Keyboard */}
        <div className="pt-2 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="flex items-center gap-2"
          >
            {/* Voice microphone button */}
            <button
              type="button"
              onClick={startVoiceInput}
              className={`p-2.5 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-600/40'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={speechSupported ? 'Hablar por micrófono' : 'Micrófono no soportado en este navegador'}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5 text-indigo-400" />}
            </button>

            {/* Text input */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe o pulsa el micro...'}
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className={`p-2.5 rounded-2xl transition-all ${
                inputVal.trim()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1">
            <span>{isListening ? '🎙️ Habla con claridad al micrófono...' : '💡 Puedes hablar con el micro o elegir una sugerencia'}</span>
            <span>+15 XP por intervención</span>
          </div>
        </div>
      </div>
    </div>
  );
};
