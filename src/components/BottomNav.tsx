import React from 'react';
import { MapPin, BookOpen, Mic, Layers, Swords } from 'lucide-react';
import { sound } from '../services/soundEffects';
import { telegram } from '../services/telegramService';

export type TabType = 'roadmap' | 'comic' | 'voice' | 'srs' | 'duel';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'roadmap', label: 'Aventura', icon: <MapPin className="w-5 h-5" /> },
    { id: 'comic', label: 'Cómic', icon: <BookOpen className="w-5 h-5" />, badge: 'MANGA' },
    { id: 'voice', label: 'Dojo Voz', icon: <Mic className="w-5 h-5" />, badge: 'IA' },
    { id: 'srs', label: 'Tarjetas', icon: <Layers className="w-5 h-5" /> },
    { id: 'duel', label: 'Duelo', icon: <Swords className="w-5 h-5" />, badge: 'VS' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 pb-[max(env(safe-area-inset-bottom,10px),10px)] pt-1.5 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTap();
                telegram.haptic('light');
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center py-1 px-2 rounded-2xl transition-all relative ${
                isActive
                  ? 'text-indigo-600 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-700 active:scale-95'
              }`}
            >
              <div
                className={`p-1.5 rounded-2xl transition-all relative ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100 ring-2 ring-indigo-500/10'
                    : 'text-slate-400'
                }`}
              >
                {tab.icon}
                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-2 text-[7px] font-black px-1 py-0.2 rounded-full uppercase ${
                      isActive
                        ? 'bg-amber-400 text-slate-900 shadow-xs'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
