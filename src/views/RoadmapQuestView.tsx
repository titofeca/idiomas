import React from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { MANGA_COMPANIONS } from '../data/companionAvatars';
import { MangaAvatar } from '../components/MangaAvatar';
import {
  Flame,
  Zap,
  Gift,
  Swords,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Play,
  Award,
  Compass
} from 'lucide-react';
import { TabType } from '../components/BottomNav';

interface RoadmapQuestViewProps {
  onOpenMysteryChest: () => void;
  onOpenBossBattle: () => void;
  onOpenVoiceRoom: (phrase?: string) => void;
  onOpenVoiceBlitz: () => void;
  onOpenPlacementTest: () => void;
  setActiveTab: (tab: TabType) => void;
}

export const RoadmapQuestView: React.FC<RoadmapQuestViewProps> = ({
  onOpenMysteryChest,
  onOpenBossBattle,
  onOpenVoiceRoom,
  onOpenVoiceBlitz,
  onOpenPlacementTest,
  setActiveTab,
}) => {
  const { currentProfile, dailyQuests, claimQuestReward, language, selectedTopic } = useGame();

  const companion =
    MANGA_COMPANIONS.find((c) => c.id === currentProfile.selectedCompanionId) ||
    MANGA_COMPANIONS[0];

  const nextLevelXp = currentProfile.level * currentProfile.level * 25;
  const currentLevelStartXp = (currentProfile.level - 1) * (currentProfile.level - 1) * 25;
  const xpInCurrentLevel = Math.max(0, currentProfile.xp - currentLevelStartXp);
  const xpNeededForLevel = Math.max(1, nextLevelXp - currentLevelStartXp);
  const levelProgressPct = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));

  const assignedLevel =
    language === 'zh' ? currentProfile.assignedLevelZh : currentProfile.assignedLevelEn;
  const isLevelCalibrated = currentProfile.placementCompleted && assignedLevel !== 'Sin calibrar';

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* 1. Level & Dopamine Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-5 shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-md">
              {currentProfile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">{currentProfile.name}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                  Liga {currentProfile.league}
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Nivel {currentProfile.level} • {currentProfile.xp} XP acumulados
              </p>
            </div>
          </div>

          {/* Quick Mystery Chest */}
          <button
            onClick={() => {
              sound.playTap();
              telegram.haptic('medium');
              onOpenMysteryChest();
            }}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-amber-400 text-slate-900 font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all animate-bounce"
            title="Abrir cofre sorpresa diario"
          >
            <Gift className="w-5 h-5" />
            <span className="text-[9px] uppercase tracking-wide mt-0.5 font-black">Cofre</span>
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4 relative z-10">
          <div className="flex justify-between text-[11px] font-bold text-indigo-100 mb-1">
            <span>Progreso hacia Nivel {currentProfile.level + 1}</span>
            <span className="font-mono font-black">{xpInCurrentLevel} / {xpNeededForLevel} XP</span>
          </div>
          <div className="w-full h-3 bg-indigo-950/40 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
        </div>

        {/* Streak and Multiplier */}
        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Racha: {currentProfile.streakDays} días</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-md text-white font-extrabold">x1.5 XP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-300 font-bold flex items-center gap-1 text-[11px]">
              <Shield className="w-3.5 h-3.5" /> {currentProfile.streakShields} Escudos
            </span>
            <span className="text-amber-200 font-bold flex items-center gap-1 text-[11px]">
              💎 {currentProfile.gems}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Diagnostic Callout if not calibrated */}
      {!isLevelCalibrated && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-between gap-3 animate-pop">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Calibra el nivel de {currentProfile.name}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">Test de 5 preguntas por voz para ajustar la dificultad.</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onOpenPlacementTest();
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shrink-0 shadow-xs active:scale-95 transition-all"
          >
            Hacer Test
          </button>
        </div>
      )}

      {/* 3. Interactive Saga Roadmap / Camino de Aprendizaje */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
              Camino de Aventura
            </span>
            <h3 className="text-base font-extrabold text-slate-900">Mapa de Retos ({language === 'zh' ? '🇨🇳 Chino' : '🇬🇧 Inglés'})</h3>
          </div>
          <button
            onClick={() => setActiveTab('voice')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
          >
            Ver todos <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Map Nodes */}
        <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-100">
          {/* Node 1: Active Topic */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenVoiceRoom();
            }}
            className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-600 hover:bg-indigo-50 cursor-pointer shadow-sm active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-200 shrink-0">
                {selectedTopic.emoji}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
                    Etapa Activa
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">~{selectedTopic.estimatedMinutes} min</span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mt-0.5 leading-snug">{selectedTopic.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{selectedTopic.subtitle}</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Play className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* Node 2: Mystery Chest Node */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenMysteryChest();
            }}
            className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 hover:border-amber-400 cursor-pointer shadow-xs active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-xl shadow-md shadow-amber-200 shrink-0 animate-bounce">
                🎁
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase">
                    Botín Misterioso
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mt-0.5">Cofre de Recompensas</h4>
                <p className="text-[11px] text-slate-500">Consigue gemas, escudos de racha y bonus de XP.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">Abrir</span>
          </div>

          {/* Node 3: Voice Blitz Mini Game */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenVoiceBlitz();
            }}
            className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 cursor-pointer shadow-xs active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center text-xl shadow-md shadow-amber-200 shrink-0">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                    Reto Rápido
                  </span>
                  <span className="text-[10px] font-bold text-amber-600">60 Segundos</span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mt-0.5">Blitz Contrarreloj por Voz</h4>
                <p className="text-[11px] text-slate-500">Responde preguntas veloces por micrófono.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Node 4: Boss Battle */}
          <div
            onClick={() => {
              sound.playTap();
              onOpenBossBattle();
            }}
            className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-red-50 via-white to-amber-50 border-2 border-red-300 hover:border-red-500 cursor-pointer shadow-sm active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center text-xl shadow-md shadow-red-200 shrink-0">
                🐉
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white uppercase animate-pulse">
                    Jefe Final
                  </span>
                  <span className="text-[10px] font-bold text-red-600">+120 XP</span>
                </div>
                <h4 className="font-black text-slate-900 text-sm mt-0.5">El Dragón Guardián</h4>
                <p className="text-[11px] text-slate-500">Duelo de combate por voz con barra de vida.</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
              <Swords className="w-4 h-4" />
            </div>
          </div>

          {/* Node 5: Next Locked World */}
          <div className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/60 border border-dashed border-slate-200 text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center text-xl shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Próximo Mundo</span>
                <h4 className="font-black text-slate-600 text-sm mt-0.5">Nivel {currentProfile.level + 1}: Diálogo Fluido</h4>
                <p className="text-[11px] text-slate-400">Se desbloquea al alcanzar {nextLevelXp} XP.</p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-slate-300 mr-2" />
          </div>
        </div>
      </div>

      {/* 4. Daily Quests (Misiones con recompensas) */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm">Misiones Diarias de {currentProfile.name}</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Se reinician a medianoche</span>
        </div>

        <div className="space-y-2.5">
          {dailyQuests.map((quest) => {
            const isCompleted = quest.progress >= quest.target;
            const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  quest.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{quest.title}</div>
                      <div className="text-[10px] text-slate-500">{quest.description}</div>
                    </div>
                  </div>

                  {quest.completed ? (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      ✓ Reclamado
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        sound.playFanfare();
                        telegram.haptic('success');
                        claimQuestReward(quest.id);
                      }}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm animate-pulse active:scale-95"
                    >
                      Reclamar +{quest.rewardXp} XP
                    </button>
                  ) : (
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {quest.progress}/{quest.target}
                    </span>
                  )}
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
