import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from '../components/MangaAvatar';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { telegram } from '../services/telegramService';
import {
  Mic,
  Zap,
  Repeat,
  Volume2,
  Sparkles,
  Users,
  Keyboard,
  ChevronRight,
  Play,
  Layers,
  BookOpen
} from 'lucide-react';

interface VoiceDojoViewProps {
  onOpenConversation: (phrase?: string) => void;
  onOpenVoiceBlitz: () => void;
  onOpenShadowingLab: () => void;
  onOpenChineseKeyboard: () => void;
  onOpenCompanionSelector: () => void;
  onOpenAiModal: () => void;
}

export const VoiceDojoView: React.FC<VoiceDojoViewProps> = ({
  onOpenConversation,
  onOpenVoiceBlitz,
  onOpenShadowingLab,
  onOpenChineseKeyboard,
  onOpenCompanionSelector,
  onOpenAiModal,
}) => {
  const {
    language,
    currentProfile,
    selectedTopic,
    setSelectedTopicId,
    availableTopics,
    pace,
    aiConfig,
  } = useGame();

  const companion =
    MANGA_COMPANIONS.find((c) => c.id === currentProfile.selectedCompanionId) ||
    MANGA_COMPANIONS[0];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showVocabList, setShowVocabList] = useState(false);

  const categories = ['all', ...Array.from(new Set(availableTopics.map((t) => t.category)))];

  const filteredTopics = availableTopics.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const playTermAudio = (term: string) => {
    sound.playTap();
    speech.speak(term, language, {
      companionId: companion.id,
      pace,
      pitch: companion.voicePitch,
    });
  };

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* 1. Manga Hero Voice Arena Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                Tutor: {companion.name}
              </span>
              <button
                onClick={onOpenCompanionSelector}
                className="text-[11px] text-indigo-100 hover:text-white underline font-semibold"
              >
                Cambiar
              </button>
            </div>

            <h2 className="text-lg font-black mt-1.5 leading-snug">
              Dojo de Voz en Vivo
            </h2>
            <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed">
              Tema activo: <strong className="text-amber-300 font-extrabold">{selectedTopic.title}</strong>
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  sound.playTap();
                  telegram.haptic('medium');
                  onOpenConversation();
                }}
                className="px-4 py-2.5 rounded-2xl bg-white text-indigo-950 font-black text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all hover:bg-amber-300"
              >
                <Mic className="w-4 h-4 text-indigo-700" />
                <span>Hablar Ahora (Llamada IA)</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  onOpenVoiceBlitz();
                }}
                className="px-3 py-2.5 rounded-2xl bg-amber-400 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-amber-300"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-900" />
                <span>Blitz 60s</span>
              </button>
            </div>
          </div>

          <div
            onClick={onOpenCompanionSelector}
            className="w-18 h-18 rounded-3xl overflow-hidden border-2 border-white/40 shadow-lg shrink-0 cursor-pointer animate-manga-float hover:scale-105 transition-all"
            title="Cambiar compañero manga"
          >
            <MangaAvatar id={companion.id} size="md" className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* 2. Compact Horizontal Topic Selector */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Temas Disponibles ({availableTopics.length})</span>
          </span>
          <span className="text-[11px] text-indigo-600 font-bold">Desliza para elegir</span>
        </div>

        {/* Categories scroll */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>

        {/* Topics horizontal scroll bar */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  sound.playTap();
                  setSelectedTopicId(topic.id);
                }}
                className={`w-48 p-3 rounded-2xl border-2 text-left shrink-0 transition-all ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{topic.emoji}</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    ~{topic.estimatedMinutes}m
                  </span>
                </div>
                <div className="text-xs font-black text-slate-900 line-clamp-1">{topic.title}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{topic.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 3 Voice Training Arenas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Arena 1: Llamada Libre / Grupo */}
        <div
          onClick={() => {
            sound.playTap();
            onOpenConversation();
          }}
          className="p-4 rounded-3xl bg-white border border-indigo-200 hover:border-indigo-400 cursor-pointer shadow-xs active:scale-98 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs">Llamada Manga (3+)</h4>
              <p className="text-[11px] text-slate-500">Charla abierta con varios tutores.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400" />
        </div>

        {/* Arena 2: Eco & Shadowing Lab */}
        <div
          onClick={() => {
            sound.playTap();
            onOpenShadowingLab();
          }}
          className="p-4 rounded-3xl bg-white border border-emerald-200 hover:border-emerald-400 cursor-pointer shadow-xs active:scale-98 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs">Eco & Shadowing</h4>
              <p className="text-[11px] text-slate-500">Imita la entonación y acento nativo.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Arena 3: Teclado Pinyin Inteligente (Mandarin) or Blitz */}
        {language === 'zh' ? (
          <div
            onClick={() => {
              sound.playTap();
              onOpenChineseKeyboard();
            }}
            className="p-4 rounded-3xl bg-white border border-amber-200 hover:border-amber-400 cursor-pointer shadow-xs active:scale-98 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Teclado Pinyin & Tonos</h4>
                <p className="text-[11px] text-slate-500">Escribe hanzi con barra de 4 tonos.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </div>
        ) : (
          <div
            onClick={() => {
              sound.playTap();
              onOpenVoiceBlitz();
            }}
            className="p-4 rounded-3xl bg-white border border-amber-200 hover:border-amber-400 cursor-pointer shadow-xs active:scale-98 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Blitz 60s</h4>
                <p className="text-[11px] text-slate-500">Preguntas veloces por voz.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </div>
        )}
      </div>

      {/* 4. Active Topic Vocabulary & Structures Accordion */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedTopic.emoji}</span>
            <div>
              <h4 className="font-black text-slate-900 text-xs">Vocabulario Clave: {selectedTopic.title}</h4>
              <p className="text-[10px] text-slate-500">{selectedTopic.vocabulary.length} frases preparatorias</p>
            </div>
          </div>

          <button
            onClick={() => setShowVocabList(!showVocabList)}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl"
          >
            {showVocabList ? 'Ocultar' : 'Ver Frases'}
          </button>
        </div>

        {showVocabList && (
          <div className="space-y-2 pt-2 border-t border-slate-100 animate-pop">
            {selectedTopic.vocabulary.map((v, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-slate-900 text-xs">{v.term}</span>
                    {v.pinyinOrIpa && (
                      <span className="text-[11px] text-amber-700 font-mono font-bold">{v.pinyinOrIpa}</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{v.translation}</div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => playTermAudio(v.term)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50"
                    title="Escuchar locución"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenConversation(v.term)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-[10px] shadow-xs active:scale-95"
                    title="Hablar esta frase"
                  >
                    <Mic className="w-3 h-3" />
                    <span>Hablar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. AI Settings Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-slate-900 text-xs">Cerebro IA ({aiConfig.provider})</h4>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${aiConfig.apiKey ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                {aiConfig.apiKey ? 'Conectado' : 'Local'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Corrección de acento y charla infinita en directo.</p>
          </div>
        </div>

        <button
          onClick={onOpenAiModal}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 active:scale-95"
        >
          Ajustes IA
        </button>
      </div>
    </div>
  );
};
