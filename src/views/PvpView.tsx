import React from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { Swords, Activity, PenTool, Keyboard, MessageSquareText, Trophy, Zap, Flame, Award, ChevronRight } from 'lucide-react';

interface PvpViewProps {
  onOpenToneLab: () => void;
  onOpenHanziDraw: () => void;
  onOpenPinyinIme: () => void;
  onOpenMediation: () => void;
  onOpenBossBattle: () => void;
}

export const PvpView: React.FC<PvpViewProps> = ({
  onOpenToneLab,
  onOpenHanziDraw,
  onOpenPinyinIme,
  onOpenMediation,
  onOpenBossBattle,
}) => {
  const { currentProfile, language } = useGame();

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Son's Self-Competition / Pique Personal Showcase */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 border border-indigo-500/30 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">Récord Personal y Superación</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
            Pique Progresivo
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Compite contra tu mejor versión. Cada día que rompes tu propio récord ganas gemas y medallas exclusivas.
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-lg font-black text-white">{currentProfile.personalBestStreak}d</div>
            <div className="text-[10px] text-slate-400">Récord Racha</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">{currentProfile.personalBestDailyXp}</div>
            <div className="text-[10px] text-slate-400">Máx XP / Día</div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
            <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">
              {language === 'zh' ? currentProfile.cardsMasteredZh : currentProfile.cardsMasteredEn}
            </div>
            <div className="text-[10px] text-slate-400">Dominadas</div>
          </div>
        </div>
      </div>

      {/* Arcade Modules Catalog */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Arenas y Retos Especiales
        </div>

        {/* Boss Battle */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenBossBattle();
          }}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-red-950/90 to-amber-950/80 border-2 border-red-500/50 flex items-center justify-between text-left hover:border-red-400 transition-all active:scale-98 shadow-xl shadow-red-950/40"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600/30 border border-red-500 text-red-400">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-sm">Reto Jefe: Dragón Guardián</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 font-black text-white">BOSS</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Duelo con salud y combos contrarreloj (+120 XP)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-400" />
        </button>

        {/* Tone Lab */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenToneLab();
          }}
          className="w-full p-4 rounded-3xl bg-slate-900/90 border border-amber-500/40 flex items-center justify-between text-left hover:border-amber-400 transition-all active:scale-98 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-white text-sm">Laboratorio de Discriminación Tonal</span>
              <p className="text-xs text-slate-400 mt-0.5">Curvas $F_0$ FastPitch de los 4 tonos chinos (+25 XP)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </button>

        {/* Hanzi Stroke Writing */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenHanziDraw();
          }}
          className="w-full p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-between text-left hover:border-cyan-400 transition-all active:scale-98 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-white text-sm">Escritura Manual Hanzi (书写字)</span>
              <p className="text-xs text-slate-400 mt-0.5">Lienzo táctil con rejilla tradicional Tian Zi Ge (+30 XP)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Pinyin IME Simulator */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenPinyinIme();
          }}
          className="w-full p-4 rounded-3xl bg-slate-900/90 border border-purple-500/40 flex items-center justify-between text-left hover:border-purple-400 transition-all active:scale-98 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-white text-sm">Entrenador IME de Pinyin</span>
              <p className="text-xs text-slate-400 mt-0.5">Detección de errores y distinción de radicales (+30 XP)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-400" />
        </button>

        {/* Mediation Cards */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenMediation();
          }}
          className="w-full p-4 rounded-3xl bg-slate-900/90 border border-blue-500/40 flex items-center justify-between text-left hover:border-blue-400 transition-all active:scale-98 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-white text-sm">Tarjetas de Mediación LOMLOE</span>
              <p className="text-xs text-slate-400 mt-0.5">Casos reales de síntesis oral en inglés (+40 XP)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-400" />
        </button>
      </div>
    </div>
  );
};
