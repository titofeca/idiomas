import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { Gift, Gem, Shield, Zap } from 'lucide-react';

interface MysteryChestModalProps {
  onClose: () => void;
}

export const MysteryChestModal: React.FC<MysteryChestModalProps> = ({ onClose }) => {
  const { openMysteryChest, currentProfile } = useGame();
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState<{ xp: number; gems: number; shield: boolean; message: string } | null>(null);

  const handleOpen = () => {
    const res = openMysteryChest();
    setReward(res);
    setOpened(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-pop">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col text-center">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-white text-base">Cofre de Recompensa</h3>
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

        {/* Chest Animation Graphic */}
        <div className="my-6">
          {!opened ? (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-1 flex items-center justify-center shadow-xl shadow-amber-500/30 animate-bounce cursor-pointer"
                   onClick={handleOpen}>
                <span className="text-5xl">🎁</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-4">
                ¡Toca el cofre para descubrir tu botín secreto!
              </p>
              <div className="text-[11px] text-slate-500 mt-1">
                Cofres abiertos: {currentProfile.openedChestsCount}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-pop">
              <div className="text-6xl mb-2 animate-bounce">✨💎✨</div>
              <h4 className="text-lg font-black text-amber-400">¡RECOMPENSA OBTENIDA!</h4>
              <p className="text-xs text-slate-300 mt-1 px-4">{reward?.message}</p>

              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-600/50 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>+{reward?.xp} XP</span>
                </div>
                <div className="flex items-center gap-1 bg-cyan-950/80 border border-cyan-600/50 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-300">
                  <Gem className="w-4 h-4 text-cyan-400" />
                  <span>+{reward?.gems} Gemas</span>
                </div>
                {reward?.shield && (
                  <div className="flex items-center gap-1 bg-purple-950/80 border border-purple-600/50 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>+1 Escudo</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800">
          {!opened ? (
            <button
              onClick={handleOpen}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              ¡ABRIR COFRE AHORA!
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-all"
            >
              Cerrar y Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
