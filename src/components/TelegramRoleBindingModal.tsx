import React from 'react';
import { useGame } from '../context/GameContext';
import { MangaAvatar } from './MangaAvatar';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { TelegramUser } from '../types/telegram';
import { Sparkles, Shield, UserCheck, Smartphone } from 'lucide-react';

interface TelegramRoleBindingModalProps {
  telegramUser: TelegramUser;
  onClose: () => void;
}

export const TelegramRoleBindingModal: React.FC<TelegramRoleBindingModalProps> = ({
  telegramUser,
  onClose,
}) => {
  const { assignTelegramRole } = useGame();

  const handleSelectRole = (role: 'son' | 'father') => {
    sound.playFanfare();
    telegram.haptic('success');
    assignTelegramRole(role, telegramUser);
    onClose();
  };

  const displayName = telegramUser.first_name + (telegramUser.last_name ? ' ' + telegramUser.last_name : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-pop">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center">
        {/* Telegram User Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Telegram ID: {telegramUser.id}</span>
          {telegramUser.username && <span className="text-sky-600">(@{telegramUser.username})</span>}
        </div>

        <h3 className="text-xl font-black text-slate-900">
          ¡Hola, {displayName}! 👋
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
          Para que la app os reconozca de forma independiente en cada móvil, dinos quién eres:
        </p>

        {/* 2 Big Choice Cards */}
        <div className="grid grid-cols-1 gap-3 mt-5">
          {/* Son Option */}
          <button
            onClick={() => handleSelectRole('son')}
            className="p-4 rounded-3xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-white to-sky-50/50 hover:border-emerald-500 hover:shadow-md transition-all text-left flex items-center justify-between group active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-md shadow-emerald-200">
                👦
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">Soy el Hijo</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    13 años
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Tutor Kenji • Retos de videojuegos, vocabulario dinámico y duelos con papá.
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-white border border-slate-200 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-400 transition-colors">
              →
            </div>
          </button>

          {/* Father Option */}
          <button
            onClick={() => handleSelectRole('father')}
            className="p-4 rounded-3xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50 hover:border-indigo-500 hover:shadow-md transition-all text-left flex items-center justify-between group active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-md shadow-indigo-200">
                🧔
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">Soy el Papá</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full">
                    Mentor
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Tutor Sir Arthur • Conversación avanzada, viajes y seguimiento de progreso.
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-white border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-400 transition-colors">
              →
            </div>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Tu cuenta de Telegram recordará tu perfil automáticamente cada vez que entres.</span>
        </div>
      </div>
    </div>
  );
};
