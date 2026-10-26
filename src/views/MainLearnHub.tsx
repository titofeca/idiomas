import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from '../components/MangaAvatar';
import { sound } from '../services/soundEffects';
import { speech } from '../services/speechService';
import { telegram } from '../services/telegramService';
import { aiService } from '../services/aiService';
import {
  Clock,
  Compass,
  Mic,
  Volume2,
  Sparkles,
  CheckCircle,
  Smartphone,
  Zap,
  Users,
  Repeat,
  Trophy,
  Filter,
  Flame,
  Send,
  Bot
} from 'lucide-react';

interface MainLearnHubProps {
  onOpenPlacementTest: () => void;
  onOpenConversation: (phrase?: string) => void;
  onOpenVoiceBlitz: () => void;
  onOpenShadowingLab: () => void;
  onOpenSyncModal: () => void;
  onOpenCompanionSelector: () => void;
  onOpenAiModal?: () => void;
  onOpenTelegramModal?: () => void;
}

export const MainLearnHub: React.FC<MainLearnHubProps> = ({
  onOpenPlacementTest,
  onOpenConversation,
  onOpenVoiceBlitz,
  onOpenShadowingLab,
  onOpenSyncModal,
  onOpenCompanionSelector,
  onOpenAiModal,
  onOpenTelegramModal,
}) => {
  const {
    language,
    currentProfile,
    otherProfile,
    selectedTopic,
    setSelectedTopicId,
    availableTopics,
    setDailyGoalMinutes,
    pace,
    isTelegram,
    aiConfig,
  } = useGame();

  const companion =
    MANGA_COMPANIONS.find((c) => c.id === currentProfile.selectedCompanionId) ||
    MANGA_COMPANIONS[0];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const assignedLevel =
    language === 'zh' ? currentProfile.assignedLevelZh : currentProfile.assignedLevelEn;
  const isLevelCalibrated = currentProfile.placementCompleted && assignedLevel !== 'Sin calibrar';

  const progressPercent = Math.min(
    100,
    Math.round((currentProfile.todayMinutes / currentProfile.goalMinutes) * 100)
  );

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
    <div className="space-y-6 pb-28 pt-4">
      {/* 1. Placement Test Diagnostic Callout */}
      {!isLevelCalibrated ? (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-200 shadow-sm flex items-center justify-between gap-4 animate-pop">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">
                Diagnóstico Inicial Recomendado
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">
                Calibra el nivel de {currentProfile.name}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                5 preguntas con audio para determinar el punto de partida exacto.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onOpenPlacementTest();
            }}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs whitespace-nowrap shadow-md shadow-indigo-200 active:scale-95 transition-all"
          >
            Hacer Test
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600">
              Nivel asignado a {currentProfile.name}:{' '}
              <strong className="text-slate-900">{assignedLevel}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onOpenPlacementTest();
            }}
            className="text-indigo-600 hover:text-indigo-800 font-bold"
          >
            Recalibrar
          </button>
        </div>
      )}

      {/* 2. Interactive Manga Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                {companion.mangaStyle}
              </span>
              <button
                onClick={onOpenCompanionSelector}
                className="text-[11px] text-indigo-100 hover:text-white underline font-semibold"
              >
                Cambiar tutor
              </button>
            </div>

            <h2 className="text-xl font-black mt-2 leading-snug">
              Habla con {companion.name} en directo
            </h2>
            <p className="text-xs text-indigo-100 mt-1 max-w-sm leading-relaxed">
              Tema activo: <strong className="text-amber-300 font-extrabold">{selectedTopic.title}</strong>. Puedes hablar a solas o activar el <strong>Modo Grupo (3+ personas)</strong> para una llamada animada.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  sound.playTap();
                  onOpenConversation();
                }}
                className="px-4 py-2.5 rounded-2xl bg-white text-indigo-900 hover:bg-amber-300 font-black text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4 text-indigo-700" />
                <span>Conversación Libre</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  onOpenVoiceBlitz();
                }}
                className="px-3.5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-slate-900" />
                <span>Blitz 60s</span>
              </button>
            </div>
          </div>

          <div
            onClick={onOpenCompanionSelector}
            className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white/40 shadow-lg shrink-0 cursor-pointer animate-manga-float hover:scale-105 transition-all"
            title="Haz clic para cambiar de tutor manga"
          >
            <MangaAvatar id={companion.id} size="lg" className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* 3. Daily 1-Hour Study Session Tracker with Multiplier */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-900 text-sm">Sesión de Práctica Diaria</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-600" /> x1.5 XP
            </span>
          </div>
          <span className="font-mono text-emerald-600 font-black text-sm">
            {currentProfile.todayMinutes} / {currentProfile.goalMinutes} min
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <p className="text-slate-500">
            {currentProfile.todayMinutes >= currentProfile.goalMinutes
              ? '🎉 ¡Objetivo diario cumplido con creces!'
              : `Llevas ${currentProfile.todayMinutes} min. Faltan ${Math.max(0, currentProfile.goalMinutes - currentProfile.todayMinutes)} min para tu meta.`}
          </p>

          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 mr-1">Meta:</span>
            {[30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setDailyGoalMinutes(mins)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  currentProfile.goalMinutes === mins
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PASO 1: Choose Daily Topic (Expanded Catalog & Categories) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">
              Paso 1: Catálogo de Temáticas ({availableTopics.length} disponibles)
            </span>
            <h3 className="text-base font-extrabold text-slate-900">¿De qué queréis hablar hoy?</h3>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'Todos los temas' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredTopics.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`p-4 rounded-3xl border-2 text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-50/60 border-indigo-600 text-slate-900 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{topic.emoji}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    ~{topic.estimatedMinutes} min
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900">{topic.title}</div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {topic.subtitle}
                </p>
                <div className="mt-2 text-[10px] font-bold text-indigo-600">
                  {topic.level}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. PASO 2: Essential Vocabulary with Direct "Oír" & "Hablar" Mic Buttons */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600">
            Paso 2: Vocabulario y Estructuras Clave
          </span>
          <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
            Estructuras preparatorias para hablar con {companion.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Pulsa <strong>"Oír"</strong> para escuchar la voz del tutor, o <strong>"Hablar"</strong> para probar tu micro con esa frase.
          </p>
        </div>

        <div className="space-y-2.5">
          {selectedTopic.vocabulary.map((v, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-black text-slate-900 ${language === 'zh' ? 'text-base font-serif' : 'text-sm'}`}>
                      {v.term}
                    </span>
                    {v.pinyinOrIpa && (
                      <span className="text-xs text-amber-700 font-mono font-bold">
                        {v.pinyinOrIpa}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 mt-0.5 font-medium">
                    {v.translation}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => playTermAudio(v.term)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-xs transition-all"
                    title="Escuchar locución del tutor (Altavoz)"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-bold">Oír</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playTap();
                      onOpenConversation(v.term);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold shadow-xs transition-all active:scale-95"
                    title="Hablar esta frase por el micrófono"
                  >
                    <Mic className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[10px] font-bold">Hablar</span>
                  </button>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs">
                <p className="font-semibold text-slate-800">{v.example}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{v.exampleTranslation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Practical Grammar tip */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Regla Práctica: {selectedTopic.keyGrammarRule.title}</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {selectedTopic.keyGrammarRule.explanation}
          </p>
          <p className="text-[11px] text-slate-600 italic pt-1">
            Ejemplo: "{selectedTopic.keyGrammarRule.sample}"
          </p>
        </div>
      </div>

      {/* 6. PASO 3: 3 Arenas de Entrenamiento por Voz (Multi-Modal Learning Variables) */}
      <div className="space-y-3">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600">
            Paso 3: Elige tu Modalidad de Práctica Oral
          </span>
          <h3 className="text-base font-extrabold text-slate-900">
            3 Modos de entrenamiento por voz
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Mode 1: Group Voice Chat */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenConversation();
            }}
            className="p-5 rounded-3xl bg-white border-2 border-indigo-200 hover:border-indigo-500 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-98 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-900 text-sm">Llamada de Grupo (3+)</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Charla abierta con varios tutores manga debatiendo juntos con voces distintas.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-600 pt-2 border-t border-slate-100">
              <span>Entrar a la Sala</span>
              <Mic className="w-4 h-4" />
            </div>
          </div>

          {/* Mode 2: Speed Voice Blitz 60s */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenVoiceBlitz();
            }}
            className="p-5 rounded-3xl bg-white border-2 border-amber-200 hover:border-amber-500 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-98 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <h4 className="font-black text-slate-900 text-sm">Reto Blitz (60s)</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Preguntas rápidas contrarreloj por voz. Gana combos de puntos y gemas.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-600 pt-2 border-t border-slate-100">
              <span>Iniciar Blitz</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>

          {/* Mode 3: Shadowing Lab */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenShadowingLab();
            }}
            className="p-5 rounded-3xl bg-white border-2 border-emerald-200 hover:border-emerald-500 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-98 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Repeat className="w-5 h-5" />
              </div>
              <h4 className="font-black text-slate-900 text-sm">Eco & Shadowing</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Escucha la melodía nativa, imítala al micro y recibe tu puntuación acústica.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-600 pt-2 border-t border-slate-100">
              <span>Entrenar Acento</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 7. AI Brain Integration Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-200 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-slate-900 text-xs">
                Cerebro IA ({aiConfig.provider === 'builtin' ? 'Modo Local' : aiConfig.provider})
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  aiConfig.apiKey && aiConfig.apiKey.length > 4
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {aiConfig.apiKey && aiConfig.apiKey.length > 4 ? 'Conectado' : 'Listo para Conectar'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Tus tutores corrigen errores al hablar, sugieren modismos y dialogan de forma infinita.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            if (onOpenAiModal) onOpenAiModal();
          }}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 active:scale-95"
        >
          Ajustes IA
        </button>
      </div>

      {/* 8. Comparison & Two-Phone Sync */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-black text-slate-900">Marcador Familiar: Mario vs Tito</span>
          </div>
          <span className="text-slate-500 text-[11px]">En dos móviles independientes</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl mb-1">{currentProfile.id === 'son' ? currentProfile.avatar : otherProfile.avatar}</div>
            <div className="font-bold text-slate-900">Mario (13 años)</div>
            <div className="text-emerald-700 font-mono font-black text-sm mt-0.5">
              {currentProfile.id === 'son' ? currentProfile.todayMinutes : otherProfile.todayMinutes} min hoy
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Racha: {currentProfile.id === 'son' ? currentProfile.streakDays : otherProfile.streakDays} días
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl mb-1">{currentProfile.id === 'father' ? currentProfile.avatar : otherProfile.avatar}</div>
            <div className="font-bold text-slate-900">Tito (Papá)</div>
            <div className="text-indigo-700 font-mono font-black text-sm mt-0.5">
              {currentProfile.id === 'father' ? currentProfile.todayMinutes : otherProfile.todayMinutes} min hoy
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Racha: {currentProfile.id === 'father' ? currentProfile.streakDays : otherProfile.streakDays} días
            </div>
          </div>
        </div>

        {/* Telegram Duel Share Button */}
        <button
          onClick={() => {
            sound.playTap();
            if (onOpenTelegramModal) onOpenTelegramModal();
            else onOpenSyncModal();
          }}
          className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm shadow-sky-200"
        >
          <Send className="w-4 h-4 -rotate-12" />
          <span>{currentProfile.id === 'son' ? '🚀 Retar a Tito (Papá) por Telegram' : '🚀 Retar a Mario por Telegram'}</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onOpenSyncModal();
          }}
          className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
          <span>Sincronización Manual por Código</span>
        </button>
      </div>
    </div>
  );
};
