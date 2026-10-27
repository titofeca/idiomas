import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { RoadmapQuestView } from './views/RoadmapQuestView';
import { ComicReaderView } from './views/ComicReaderView';
import { VoiceDojoView } from './views/VoiceDojoView';
import { SrsFlashcardsView } from './views/SrsFlashcardsView';
import { FamilyDuelView } from './views/FamilyDuelView';
import { FloatingMangaCompanion } from './components/FloatingMangaCompanion';
import { PlacementTestModal } from './components/PlacementTestModal';
import { VoiceSpeakingHub } from './components/VoiceSpeakingHub';
import { VoiceBlitzModal } from './components/VoiceBlitzModal';
import { ShadowingLabModal } from './components/ShadowingLabModal';
import { CompanionSelectorModal } from './components/CompanionSelectorModal';
import { ProfileSyncModal } from './components/ProfileSyncModal';
import { AiConfigModal } from './components/AiConfigModal';
import { TelegramSyncModal } from './components/TelegramSyncModal';
import { TelegramRoleBindingModal } from './components/TelegramRoleBindingModal';
import { BossBattleModal } from './components/BossBattleModal';
import { MysteryChestModal } from './components/MysteryChestModal';
import { AddFamilyMemberModal } from './components/AddFamilyMemberModal';
import { telegram } from './services/telegramService';

const MainScreen: React.FC = () => {
  const {
    selectedTopic,
    showRoleBindingModal,
    setShowRoleBindingModal,
    telegramUser,
  } = useGame();

  const [activeTab, setActiveTab] = useState<TabType>('roadmap');

  // Modals state
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [showVoiceSpeakingHub, setShowVoiceSpeakingHub] = useState(false);
  const [showVoiceBlitz, setShowVoiceBlitz] = useState(false);
  const [showShadowingLab, setShowShadowingLab] = useState(false);
  const [practicePhrase, setPracticePhrase] = useState<string | undefined>(undefined);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showBossBattle, setShowBossBattle] = useState(false);
  const [showMysteryChest, setShowMysteryChest] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const isAnyModalOpen =
    showPlacementModal ||
    showVoiceSpeakingHub ||
    showVoiceBlitz ||
    showShadowingLab ||
    showCompanionModal ||
    showSyncModal ||
    showAiModal ||
    showTelegramModal ||
    showRoleBindingModal ||
    showBossBattle ||
    showMysteryChest ||
    showAddMemberModal;

  const closeAllModals = () => {
    setShowPlacementModal(false);
    setShowVoiceSpeakingHub(false);
    setShowVoiceBlitz(false);
    setShowShadowingLab(false);
    setShowCompanionModal(false);
    setShowSyncModal(false);
    setShowAiModal(false);
    setShowTelegramModal(false);
    setShowRoleBindingModal(false);
    setShowBossBattle(false);
    setShowMysteryChest(false);
    setShowAddMemberModal(false);
    setPracticePhrase(undefined);
  };

  // Telegram Native BackButton Hook
  useEffect(() => {
    if (isAnyModalOpen) {
      telegram.showBackButton(closeAllModals);
    } else {
      telegram.hideBackButton();
    }
  }, [isAnyModalOpen]);

  // Keyboard Escape key to close any modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAllModals();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenVoice = (phrase?: string) => {
    setPracticePhrase(phrase);
    setShowVoiceSpeakingHub(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50/40 text-slate-800 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-x-hidden select-none">
      {/* Header */}
      <Header
        onOpenPlacementTest={() => setShowPlacementModal(true)}
        onOpenCompanionSelector={() => setShowCompanionModal(true)}
        onOpenAiModal={() => setShowAiModal(true)}
        onOpenTelegramModal={() => setShowTelegramModal(true)}
      />

      {/* Main Screen Content by Tab */}
      <main className="flex-1 px-3.5 pt-2">
        {activeTab === 'roadmap' && (
          <RoadmapQuestView
            onOpenMysteryChest={() => setShowMysteryChest(true)}
            onOpenBossBattle={() => setShowBossBattle(true)}
            onOpenVoiceRoom={handleOpenVoice}
            onOpenVoiceBlitz={() => setShowVoiceBlitz(true)}
            onOpenPlacementTest={() => setShowPlacementModal(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'comic' && (
          <ComicReaderView onOpenVoiceRoom={handleOpenVoice} />
        )}

        {activeTab === 'voice' && (
          <VoiceDojoView
            onOpenConversation={handleOpenVoice}
            onOpenVoiceBlitz={() => setShowVoiceBlitz(true)}
            onOpenShadowingLab={() => setShowShadowingLab(true)}
            onOpenChineseKeyboard={() => handleOpenVoice()}
            onOpenCompanionSelector={() => setShowCompanionModal(true)}
            onOpenAiModal={() => setShowAiModal(true)}
          />
        )}

        {activeTab === 'srs' && <SrsFlashcardsView />}

        {activeTab === 'duel' && (
          <FamilyDuelView
            onOpenMysteryChest={() => setShowMysteryChest(true)}
            onOpenShieldModal={() => setShowMysteryChest(true)}
            onOpenTelegramModal={() => setShowTelegramModal(true)}
            onOpenAddMemberModal={() => setShowAddMemberModal(true)}
          />
        )}
      </main>

      {/* Floating Animated Manga Tutor on Screen */}
      <FloatingMangaCompanion
        onOpenVoiceRoom={() => handleOpenVoice()}
        onOpenSelector={() => setShowCompanionModal(true)}
        onOpenComic={() => setActiveTab('comic')}
      />

      {/* Ergonomic Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals with seamless mobile back/close support */}
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

      {showBossBattle && (
        <BossBattleModal onClose={() => setShowBossBattle(false)} />
      )}

      {showMysteryChest && (
        <MysteryChestModal onClose={() => setShowMysteryChest(false)} />
      )}

      {showAddMemberModal && (
        <AddFamilyMemberModal onClose={() => setShowAddMemberModal(false)} />
      )}

      {showRoleBindingModal && telegramUser && (
        <TelegramRoleBindingModal
          telegramUser={telegramUser}
          onClose={() => setShowRoleBindingModal(false)}
        />
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
