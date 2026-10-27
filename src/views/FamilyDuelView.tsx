import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import {
  Trophy,
  Swords,
  Send,
  UserPlus,
  Shield,
  Gift,
  CheckCircle,
  Smartphone,
  Flame,
  Zap,
  Users,
  Award
} from 'lucide-react';

interface FamilyDuelViewProps {
  onOpenMysteryChest: () => void;
  onOpenShieldModal: () => void;
  onOpenTelegramModal: () => void;
  onOpenAddMemberModal: () => void;
}

export const FamilyDuelView: React.FC<FamilyDuelViewProps> = ({
  onOpenMysteryChest,
  onOpenShieldModal,
  onOpenTelegramModal,
  onOpenAddMemberModal,
}) => {
  const {
    currentProfile,
    otherProfile,
    activeProfileId,
    switchProfile,
    allProfiles,
    buyStreakShield,
    syncFamilyProgress,
    telegramUser,
  } = useGame();

  const handleSendDuel = () => {
    sound.playTap();
    telegram.haptic('medium');
    telegram.shareInvite(
      activeProfileId,
      activeProfileId === 'son'
        ? `¡Papá Tito! Hoy llevo ${currentProfile.todayMinutes} min y racha de ${currentProfile.streakDays} días en LinguaQuest. ¿Superas mi marca? 🚀`
        : `¡Mario! He completado mi entrenamiento de ${currentProfile.todayMinutes} min hoy en LinguaQuest. ¡Te toca a ti! 📚`
    );
  };

  const handleBuyShield = () => {
    const success = buyStreakShield();
    if (success) {
      sound.playFanfare();
      telegram.haptic('success');
    } else {
      sound.playWrong();
      telegram.haptic('error');
    }
  };

  return (
    <div className="space-y-4 pb-28 pt-2">
      {/* 1. Header Trophy Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white shadow-xl shadow-orange-200 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-amber-200" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-100">
                Pique Familiar Diario
              </span>
            </div>
            <h2 className="text-xl font-black mt-1">Mario vs Tito</h2>
            <p className="text-xs text-amber-100 mt-0.5">
              El que más minutos entrena hoy custodia el Trofeo de la Casa 🏆
            </p>
          </div>

          <div className="text-4xl p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-md">
            ⚔️
          </div>
        </div>

        {/* Telegram Duel Challenge Button */}
        <button
          onClick={handleSendDuel}
          className="w-full mt-4 py-3 rounded-2xl bg-white text-slate-900 hover:bg-amber-300 font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <Send className="w-4 h-4 text-sky-600 -rotate-12" />
          <span>🚀 Enviar Reto Directo por Telegram</span>
        </button>
      </div>

      {/* 2. Side-by-Side Dual Scoreboard */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mario Card */}
        <div
          onClick={() => {
            if (activeProfileId !== 'son') switchProfile('son');
          }}
          className={`p-4 rounded-3xl border-2 text-center transition-all cursor-pointer ${
            activeProfileId === 'son'
              ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
              : 'bg-white border-slate-200 hover:border-slate-300 opacity-90'
          }`}
        >
          <div className="text-3xl mb-1">👦</div>
          <div className="font-black text-slate-900 text-sm">Mario (13 años)</div>
          <div className="text-[10px] text-slate-500">
            {activeProfileId === 'son' ? 'Perfil Activo' : 'Toca para cambiar'}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
            <div className="text-emerald-700 font-mono font-black text-base">
              {activeProfileId === 'son' ? currentProfile.todayMinutes : otherProfile.todayMinutes} min
            </div>
            <div className="text-[11px] text-slate-500">
              Racha: <strong className="text-slate-800">{activeProfileId === 'son' ? currentProfile.streakDays : otherProfile.streakDays}d</strong>
            </div>
            <div className="text-[10px] font-bold text-indigo-600">
              {activeProfileId === 'son' ? currentProfile.xp : otherProfile.xp} XP
            </div>
          </div>
        </div>

        {/* Tito Card */}
        <div
          onClick={() => {
            if (activeProfileId !== 'father') switchProfile('father');
          }}
          className={`p-4 rounded-3xl border-2 text-center transition-all cursor-pointer ${
            activeProfileId === 'father'
              ? 'bg-indigo-50/70 border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
              : 'bg-white border-slate-200 hover:border-slate-300 opacity-90'
          }`}
        >
          <div className="text-3xl mb-1">🧔</div>
          <div className="font-black text-slate-900 text-sm">Tito (Papá)</div>
          <div className="text-[10px] text-slate-500">
            {activeProfileId === 'father' ? 'Perfil Activo' : 'Toca para cambiar'}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
            <div className="text-indigo-700 font-mono font-black text-base">
              {activeProfileId === 'father' ? currentProfile.todayMinutes : otherProfile.todayMinutes} min
            </div>
            <div className="text-[11px] text-slate-500">
              Racha: <strong className="text-slate-800">{activeProfileId === 'father' ? currentProfile.streakDays : otherProfile.streakDays}d</strong>
            </div>
            <div className="text-[10px] font-bold text-indigo-600">
              {activeProfileId === 'father' ? currentProfile.xp : otherProfile.xp} XP
            </div>
          </div>
        </div>
      </div>

      {/* 3. Multi-Member Management: Add Mom, Brother, Friend by Telegram ID */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-sm">Miembros Familiares y Amigos</h3>
          </div>
          <button
            onClick={onOpenAddMemberModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs active:scale-95 transition-all shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>➕ Añadir Miembro</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Cada persona puede entrar por su propio Telegram ID para tener su progreso, racha y estadísticas independientes.
        </p>

        {/* Member list chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {allProfiles.map((p) => {
            const isSelected = p.id === currentProfile.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  sound.playTap();
                  telegram.haptic('light');
                  switchProfile(p.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{p.avatar}</span>
                <span>{p.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Streak Shield & Mystery Chest Store */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mystery Chest */}
        <div
          onClick={() => {
            sound.playTap();
            onOpenMysteryChest();
          }}
          className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-400 cursor-pointer shadow-xs active:scale-98 transition-all text-center space-y-1.5"
        >
          <div className="text-3xl animate-bounce">🎁</div>
          <div className="font-black text-slate-900 text-xs">Cofre Sorpresa</div>
          <div className="text-[11px] text-amber-800 font-medium">Recompensas y gemas</div>
          <button className="w-full mt-2 py-1.5 rounded-xl bg-amber-400 text-slate-900 font-extrabold text-[11px]">
            Abrir Cofre
          </button>
        </div>

        {/* Streak Shield */}
        <div
          onClick={handleBuyShield}
          className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-400 cursor-pointer shadow-xs active:scale-98 transition-all text-center space-y-1.5"
        >
          <div className="text-3xl">🛡️</div>
          <div className="font-black text-slate-900 text-xs">Escudo de Racha</div>
          <div className="text-[11px] text-emerald-800 font-medium">Protege tu racha si fallas</div>
          <button className="w-full mt-2 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-[11px]">
            {currentProfile.gems >= 50 ? 'Comprar (50 💎)' : `${currentProfile.streakShields} activos`}
          </button>
        </div>
      </div>

      {/* 5. Achievements List */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <h3 className="font-black text-slate-900 text-sm">Medallas Desbloqueadas</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <span className="text-2xl">🌱</span>
            <div>
              <div className="font-bold text-slate-900">Primer Paso</div>
              <div className="text-[10px] text-slate-500">Completada 1ª sesión</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-bold text-slate-900">Llama Viva</div>
              <div className="text-[10px] text-slate-500">Racha de 3 días</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-bold text-slate-900">Oído Clínico</div>
              <div className="text-[10px] text-slate-500">Dominio de tonos</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <span className="text-2xl">🐉</span>
            <div>
              <div className="font-bold text-slate-900">Mata-Jefes</div>
              <div className="text-[10px] text-slate-500">Vencido Boss Dragón</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
