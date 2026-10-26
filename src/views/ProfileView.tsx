import React from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { Trophy, Smartphone, Award, UserCheck } from 'lucide-react';

interface ProfileViewProps {
  onOpenSyncModal: () => void;
  onOpenShieldModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenSyncModal, onOpenShieldModal }) => {
  const { currentProfile, otherProfile, activeProfileId, switchProfile } = useGame();

  const achievements = [
    { id: 'first_lesson', name: 'Primer Paso', desc: 'Completaste tu primera sesión de estudio', icon: '🌱' },
    { id: 'tone_sniper', name: 'Oído Clínico', desc: 'Acertaste 10 tonos en el Laboratorio de Tonos', icon: '🎯' },
    { id: 'streak_3', name: 'Llama Encendida', desc: 'Mantén una racha de al menos 3 días', icon: '🔥' },
    { id: 'boss_slayer', name: 'Domador de Dragones', desc: 'Vence al Boss en el reto contrarreloj', icon: '🐉' },
    { id: 'mediation_pro', name: 'Mediador Nato', desc: 'Resuelve un caso de mediación LOMLOE sin errores', icon: '🗣️' },
  ];

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Current User Card */}
      <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl p-3 rounded-2xl bg-slate-800 border border-slate-700">
              {currentProfile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{currentProfile.name}</h2>
              </div>
              <p className="text-xs text-amber-400 font-bold">Liga {currentProfile.league} • Nivel {currentProfile.level}</p>
            </div>
          </div>

          <button
            onClick={() => {
              switchProfile(activeProfileId === 'son' ? 'father' : 'son');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white font-semibold"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cambiar Perfil</span>
          </button>
        </div>

        {/* Sync between 2 phones button */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenSyncModal();
          }}
          className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span>Sincronizar Datos con el Móvil de {activeProfileId === 'son' ? 'Papá' : 'tu Hijo'}</span>
        </button>
      </div>

      {/* Head to Head Comparison: Son vs Father */}
      <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-white text-sm">Marcador Familiar: Hijo vs Papá</h3>
          </div>
          <span className="text-[10px] text-slate-400">Pique Sano</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold">
              <tr>
                <th className="p-2.5">Métrica</th>
                <th className="p-2.5 text-center text-purple-300">⚡ Hijo</th>
                <th className="p-2.5 text-center text-emerald-300">🛡️ Papá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 font-semibold text-slate-200">
              <tr>
                <td className="p-2.5 text-slate-400">Nivel Actual</td>
                <td className="p-2.5 text-center font-bold text-white">
                  Lvl {activeProfileId === 'son' ? currentProfile.level : otherProfile.level}
                </td>
                <td className="p-2.5 text-center font-bold text-white">
                  Lvl {activeProfileId === 'father' ? currentProfile.level : otherProfile.level}
                </td>
              </tr>
              <tr>
                <td className="p-2.5 text-slate-400">XP Totales</td>
                <td className="p-2.5 text-center text-amber-300">
                  {activeProfileId === 'son' ? currentProfile.xp : otherProfile.xp} XP
                </td>
                <td className="p-2.5 text-center text-amber-300">
                  {activeProfileId === 'father' ? currentProfile.xp : otherProfile.xp} XP
                </td>
              </tr>
              <tr>
                <td className="p-2.5 text-slate-400">Racha Diaria</td>
                <td className="p-2.5 text-center text-orange-400">
                  {activeProfileId === 'son' ? currentProfile.streakDays : otherProfile.streakDays} días
                </td>
                <td className="p-2.5 text-center text-orange-400">
                  {activeProfileId === 'father' ? currentProfile.streakDays : otherProfile.streakDays} días
                </td>
              </tr>
              <tr>
                <td className="p-2.5 text-slate-400">Gemas Acumuladas</td>
                <td className="p-2.5 text-center text-cyan-300">
                  {activeProfileId === 'son' ? currentProfile.gems : otherProfile.gems} 💎
                </td>
                <td className="p-2.5 text-center text-cyan-300">
                  {activeProfileId === 'father' ? currentProfile.gems : otherProfile.gems} 💎
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-purple-400" />
          <h3 className="font-extrabold text-white text-sm">Medallas & Logros Desbloqueados</h3>
        </div>

        <div className="space-y-2.5">
          {achievements.map((ach) => {
            const unlocked = currentProfile.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  unlocked
                    ? 'bg-slate-800/80 border-purple-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-60'
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold">{ach.name}</div>
                  <div className="text-[11px] text-slate-400">{ach.desc}</div>
                </div>
                {unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800">
                    Conseguido
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500">Bloqueado</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
