import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { MainLearnHub } from './views/MainLearnHub';
import { FloatingMangaCompanion } from './components/FloatingMangaCompanion';
import { PlacementTestModal } from './components/PlacementTestModal';
import { VoiceSpeakingHub } from './components/VoiceSpeakingHub';
import { VoiceBlitzModal } from './components/VoiceBlitzModal';
import { ShadowingLabModal } from './components/ShadowingLabModal';
import { CompanionSelectorModal } from './components/CompanionSelectorModal';
import { ProfileSyncModal } from './components/ProfileSyncModal';
import { AiConfigModal } from './components/AiConfigModal';
import { TelegramSyncModal } from './components/TelegramSyncModal';

const MainScreen: React.FC = () => {
  const { selectedTopic } = useGame();
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [showVoiceSpeakingHub, setShowVoiceSpeakingHub] = useState(false);
  const [showVoiceBlitz, setShowVoiceBlitz] = useState(false);
  const [showShadowingLab, setShowShadowingLab] = useState(false);
  const [practicePhrase, setPracticePhrase] = useState<string | undefined>(undefined);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  const handleOpenVoice = (phrase?: string) => {
    setPracticePhrase(phrase);
    setShowVoiceSpeakingHub(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col max-w-xl mx-auto relative shadow-xl overflow-x-hidden">
      {/* Header */}
      <Header
        onOpenPlacementTest={() => setShowPlacementModal(true)}
        onOpenCompanionSelector={() => setShowCompanionModal(true)}
        onOpenAiModal={() => setShowAiModal(true)}
        onOpenTelegramModal={() => setShowTelegramModal(true)}
      />

      {/* Main Learning Hub */}
      <main className="flex-1 px-4">
        <MainLearnHub
          onOpenPlacementTest={() => setShowPlacementModal(true)}
          onOpenConversation={handleOpenVoice}
          onOpenVoiceBlitz={() => setShowVoiceBlitz(true)}
          onOpenShadowingLab={() => setShowShadowingLab(true)}
          onOpenSyncModal={() => setShowSyncModal(true)}
          onOpenCompanionSelector={() => setShowCompanionModal(true)}
          onOpenAiModal={() => setShowAiModal(true)}
          onOpenTelegramModal={() => setShowTelegramModal(true)}
        />
      </main>

      {/* Floating Animated Manga Tutor on Screen */}
      <FloatingMangaCompanion
        onOpenVoiceRoom={() => handleOpenVoice()}
        onOpenSelector={() => setShowCompanionModal(true)}
      />

      {/* Modals */}
      {showPlacementModal && (
        <PlacementTestModal onClose={() => setShowPlacementModal(false)} />
      )}

      {showVoiceSpeakingHub && (
        <VoiceSpeakingHub
          topic={selectedTopic}
          initialPracticePhrase={practicePhrase}
          onClose={() => {
            setShowVoiceSpeakingHub(false);
            setPracticePhrase(undefined);
          }}
        />
      )}

      {showVoiceBlitz && (
        <VoiceBlitzModal onClose={() => setShowVoiceBlitz(false)} />
      )}

      {showShadowingLab && (
        <ShadowingLabModal onClose={() => setShowShadowingLab(false)} />
      )}

      {showCompanionModal && (
        <CompanionSelectorModal onClose={() => setShowCompanionModal(false)} />
      )}

      {showSyncModal && (
        <ProfileSyncModal onClose={() => setShowSyncModal(false)} />
      )}

      {showAiModal && (
        <AiConfigModal onClose={() => setShowAiModal(false)} />
      )}

      {showTelegramModal && (
        <TelegramSyncModal onClose={() => setShowTelegramModal(false)} />
      )}
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <MainScreen />
    </GameProvider>
  );
}

export default App;
