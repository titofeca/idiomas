import React from 'react';
import { useGame } from '../context/GameContext';
import { Flame, Shield, Gem } from 'lucide-react';
import { sound } from '../services/soundEffects';

interface StreakShieldModalProps {
  onClose: () => void;
}

export const StreakShieldModal: React.FC<StreakShieldModalProps> = ({ onClose }) => {
  const { currentProfile, buyStreakShield } = useGame();

  const handleBuy = () => {
    const success = buyStreakShield();
    if (!success) {
      sound.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-pop">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500">
              <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Racha y Escudos</h3>
              <p className="text-[11px] text-slate-400">Protege tu racha de días consecutivos</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Current streak showcase */}
        <div className="mt-4 p-5 bg-gradient-to-br from-amber-950/40 to-slate-800 rounded-2xl border border-amber-500/30 text-center">
          <div className="text-4xl font-black text-amber-400 flex items-center justify-center gap-2">
            <Flame className="w-8 h-8 fill-amber-500" />
            <span>{currentProfile.streakDays} Días</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">¡Récord personal: {currentProfile.personalBestStreak} días!</p>
          <div className="mt-2 text-[11px] text-slate-400">
            Haz al menos 1 lección diaria para no perder la llama.
          </div>
        </div>

        {/* Shield Status */}
        <div className="mt-4 p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Escudos Activos</div>
                <div className="text-[11px] text-slate-400">Te salvan si un día no puedes estudiar</div>
              </div>
            </div>
            <span className="text-lg font-black text-cyan-400">{currentProfile.streakShields}</span>
          </div>
        </div>

        {/* Buy Shield with Gems */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Tus gemas disponibles:</span>
            <span className="font-bold text-cyan-300 flex items-center gap-1">
              <Gem className="w-3.5 h-3.5 fill-cyan-400" /> {currentProfile.gems}
            </span>
          </div>

          <button
            onClick={handleBuy}
            disabled={currentProfile.gems < 50}
            className={`w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              currentProfile.gems >= 50
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30 hover:brightness-110 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Comprar 1 Escudo (50 Gemas)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
