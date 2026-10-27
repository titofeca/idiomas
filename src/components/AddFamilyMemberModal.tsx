import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';
import { UserPlus, Sparkles, CheckCircle, Shield } from 'lucide-react';

interface AddFamilyMemberModalProps {
  onClose: () => void;
}

const AVATAR_OPTIONS = ['👦', '🧔', '👩', '👧', '👱', '🧒', '👴', '👵', '🚀', '⭐', '🐱', '🐶'];

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({ onClose }) => {
  const { addNewFamilyMember } = useGame();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👩');
  const [telegramId, setTelegramId] = useState('');
  const [ageDesc, setAgeDesc] = useState('Familiar');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    sound.playCorrect();
    telegram.haptic('success');

    const tgNum = telegramId.trim() ? Number(telegramId.trim()) : undefined;
    await addNewFamilyMember(name.trim(), tgNum, avatar, ageDesc);

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-md animate-pop"
    >
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Añadir Miembro Familiar</h3>
              <p className="text-xs text-slate-500">Para jugar juntos con su propio progreso</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Avatar selector */}
          <div>
            <label className="font-extrabold text-slate-700 block mb-1.5">Elige un Avatar</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    sound.playTap();
                    setAvatar(av);
                  }}
                  className={`p-2.5 rounded-2xl text-2xl border transition-all ${
                    avatar === av
                      ? 'bg-indigo-50 border-indigo-600 scale-105 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="font-extrabold text-slate-700 block mb-1">Nombre o Apodo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Mamá, Lucas, Amigo..."
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-600 font-bold text-sm bg-slate-50"
            />
          </div>

          {/* Relationship or Age desc */}
          <div>
            <label className="font-extrabold text-slate-700 block mb-1">Rol / Parentesco</label>
            <input
              type="text"
              value={ageDesc}
              onChange={(e) => setAgeDesc(e.target.value)}
              placeholder="Ej: Mamá • Competidora, Amigo • 13 años..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-xs bg-slate-50"
            />
          </div>

          {/* Optional Telegram ID */}
          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Telegram ID (Opcional, para entrar desde su móvil)
            </label>
            <input
              type="number"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="Ej: 123456789 (Opcional)"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-xs font-mono bg-slate-50"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Si se añade su Telegram ID, la app lo reconocerá automáticamente cuando abra el bot.
            </p>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando en la Nube...' : 'Crear y Guardar Perfil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
