import React from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { Flame, Zap, Trophy, Gift, ArrowRight, Swords, Sparkles, CheckCircle2, Activity, PenTool, MessageSquareText } from 'lucide-react';
import { TabType } from '../components/BottomNav';

interface HomeViewProps {
  setActiveTab: (tab: any) => void;
  onOpenMysteryChest: () => void;
  onOpenToneLab: () => void;
  onOpenHanziDraw: () => void;
  onOpenMediation: () => void;
  onOpenBossBattle: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenMysteryChest,
  onOpenToneLab,
  onOpenHanziDraw,
  onOpenMediation,
  onOpenBossBattle,
}) => {
  const { currentProfile, dailyQuests, claimQuestReward, language } = useGame();

  const nextLevelXp = (currentProfile.level * currentProfile.level) * 20;
  const currentLevelStartXp = ((currentProfile.level - 1) * (currentProfile.level - 1)) * 20;
  const xpInCurrentLevel = Math.max(0, currentProfile.xp - currentLevelStartXp);
  const xpNeededForLevel = Math.max(1, nextLevelXp - currentLevelStartXp);
  const levelProgressPct = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Hero Daily Dopamine Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-purple-950 p-5 border border-indigo-500/30 shadow-xl">
        {/* Glow circles */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 shadow-inner">
              {currentProfile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base">{currentProfile.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  Liga {currentProfile.league}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">Nivel {currentProfile.level} • {currentProfile.xp} XP acumulados</p>
            </div>
          </div>

          {/* Quick Chest Button with pulsating glow */}
          <button
            onClick={() => {
              sound.playTap();
              onOpenMysteryChest();
            }}
            className="flex flex-col items-center p-2 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all shadow-lg animate-pulse"
            title="Abrir cofre diario"
          >
            <Gift className="w-5 h-5 text-amber-400" />
            <span className="text-[9px] font-bold mt-0.5">Cofre</span>
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-bold text-indigo-300 mb-1">
            <span>Progreso al Nivel {currentProfile.level + 1}</span>
            <span>{xpInCurrentLevel} / {xpNeededForLevel} XP</span>
          </div>
          <div className="w-full h-3 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-indigo-900">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
        </div>

        {/* Son's Personal Best Highlight */}
        <div className="mt-3.5 pt-3 border-t border-indigo-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Racha actual: {currentProfile.streakDays} días (Récord: {currentProfile.personalBestStreak}d)</span>
          </div>
          <div className="text-[11px] text-indigo-200">
            Hoy: <span className="font-bold text-white">+{currentProfile.todayXp} XP</span>
          </div>
        </div>
      </div>

      {/* Primary Call to Action: Start Lesson */}
      <button
        onClick={() => {
          sound.playTap();
          setActiveTab('learn');
        }}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:brightness-110 active:scale-98 text-white font-black text-sm flex items-center justify-between shadow-xl shadow-emerald-950/40 transition-all border border-emerald-400/30"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-black/20">
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <div className="text-left">
            <div className="text-sm font-extrabold">SESIÓN DE REPASO INTELIGENTE (SRS)</div>
            <div className="text-[11px] text-emerald-100 font-normal">
              {language === 'zh' ? 'Chino HSK 3.0: 4 Fases y Escritura' : 'Inglés LOMLOE: B1/B2/C1 y Phrasal Verbs'}
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-white" />
      </button>

      {/* Mini Arcade Quick Access Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {language === 'zh' ? (
          <>
            <button
              onClick={() => {
                sound.playTap();
                onOpenToneLab();
              }}
              className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-500 text-left transition-all active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Activity className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-amber-400">+25 XP</span>
              </div>
              <div className="text-xs font-bold text-white">Laboratorio de Tonos</div>
              <div className="text-[10px] text-slate-400">Discriminación $F_0$</div>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                onOpenHanziDraw();
              }}
              className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-500 text-left transition-all active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <PenTool className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-cyan-400">+30 XP</span>
              </div>
              <div className="text-xs font-bold text-white">Escritura Hanzi</div>
              <div className="text-[10px] text-slate-400">Trazado manual 100 caracteres</div>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                sound.playTap();
                onOpenMediation();
              }}
              className="p-3 rounded-2xl bg-slate-900 border border-blue-500/30 hover:border-blue-500 text-left transition-all active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <MessageSquareText className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-blue-400">+40 XP</span>
              </div>
              <div className="text-xs font-bold text-white">Mediación LOMLOE</div>
              <div className="text-[10px] text-slate-400">Casos reales en inglés</div>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('stories');
              }}
              className="p-3 rounded-2xl bg-slate-900 border border-purple-500/30 hover:border-purple-500 text-left transition-all active:scale-98"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold text-purple-400">+50 XP</span>
              </div>
              <div className="text-xs font-bold text-white">Historias Graduadas</div>
              <div className="text-[10px] text-slate-400">Comprensión 90%+</div>
            </button>
          </>
        )}
      </div>

      {/* Reto Jefe Banner (Boss Fight) */}
      <button
        onClick={() => {
          sound.playTap();
          onOpenBossBattle();
        }}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-red-950/80 to-slate-900 border border-red-500/40 text-left flex items-center justify-between hover:border-red-500 transition-all active:scale-98 shadow-md shadow-red-950/30"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
            <Swords className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <span>Reto Jefe: Dragón Guardián</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-600 text-white font-black">BOSS</span>
            </div>
            <div className="text-[11px] text-slate-400">Duelo de preguntas rápidas contrarreloj (+120 XP)</div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-red-400" />
      </button>

      {/* Daily Quests Hook Section */}
      <div className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-white text-sm">Retos Diarios de Dopamina</h3>
          </div>
          <span className="text-[10px] text-slate-400">Se reinicia cada 24h</span>
        </div>

        <div className="space-y-2.5">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`p-3 rounded-2xl border transition-all ${
                quest.completed
                  ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {quest.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 shrink-0" />
                    )}
                    <span>{quest.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{quest.description}</div>
                </div>

                {/* Claim or Progress Pill */}
                {quest.completed ? (
                  <button
                    onClick={() => claimQuestReward(quest.id)}
                    className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-[11px] shadow-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    ¡Reclamar!
                  </button>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400">
                      {quest.progress}/{quest.target}
                    </span>
                    <div className="text-[9px] text-slate-400">+{quest.rewardXp} XP</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
