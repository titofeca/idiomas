import React from 'react';
import { Home, BookOpen, ScrollText, Swords, Trophy } from 'lucide-react';
import { sound } from '../services/soundEffects';

export type TabType = 'home' | 'learn' | 'stories' | 'challenges' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { id: 'learn', label: 'Aprender', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'stories', label: 'Historias', icon: <ScrollText className="w-5 h-5" /> },
    { id: 'challenges', label: 'Retos', icon: <Swords className="w-5 h-5" /> },
    { id: 'profile', label: 'Piques', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-[env(safe-area-inset-bottom,8px)] pt-1 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playTap();
                setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-indigo-950/80 text-indigo-400 shadow-sm shadow-indigo-500/20' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
