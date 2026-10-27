import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { Gift, Gem, Shield, Zap } from 'lucide-react';

interface MysteryChestModalProps {
  onClose: () => void;
}

export const MysteryChestModal: React.FC<MysteryChestModalProps> = ({ onClose }) => {
  const { openMysteryChest, currentProfile } = useGame();
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState<{ xp: number; gems: number; shield: boolean; message: string } | null>(null);

  const handleOpen = () => {
    sound.playFanfare();
    telegram.haptic('success');
    const res = openMysteryChest();
    setReward(res);
    setOpened(true);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-md animate-pop"
    >
      <div className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl flex flex-col text-center max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-slate-900 text-sm">Cofre de Recompensas</h3>
              <p className="text-[10px] text-slate-500">Botín de {currentProfile.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Chest Animation Graphic */}
        <div className="my-6">
          {!opened ? (
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 p-1 flex items-center justify-center shadow-xl shadow-amber-200 animate-bounce cursor-pointer hover:scale-105 active:scale-95 transition-all"
                onClick={handleOpen}
              >
                <span className="text-5xl">🎁</span>
              </div>
              <p className="text-xs text-slate-800 font-extrabold mt-4">
                ¡Toca el cofre para descubrir tu botín secreto!
              </p>
              <div className="text-[11px] text-slate-400 mt-1">
                Cofres abiertos: {currentProfile.openedChestsCount}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-pop space-y-2">
              <div className="text-6xl mb-1 animate-bounce">✨💎✨</div>
              <h4 className="text-lg font-black text-amber-600">¡RECOMPENSA OBTENIDA!</h4>
              <p className="text-xs text-slate-600 mt-1 px-4">{reward?.message}</p>

              <div className="flex items-center justify-center gap-2.5 mt-4">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-black text-amber-800 shadow-xs">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>+{reward?.xp} XP</span>
                </div>
                <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-black text-sky-800 shadow-xs">
                  <Gem className="w-4 h-4 text-sky-500" />
                  <span>+{reward?.gems} Gemas</span>
                </div>
                {reward?.shield && (
                  <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-black text-purple-800 shadow-xs">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>+1 Escudo</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100">
          {!opened ? (
            <button
              onClick={handleOpen}
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm shadow-md shadow-amber-200 active:scale-95 transition-all"
            >
              ¡ABRIR COFRE AHORA!
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playTap();
                onClose();
              }}
              className="w-full py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 active:scale-95 transition-all"
            >
              Cerrar y Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
