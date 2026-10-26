import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Language, DailyTopic, SrsCard, DailyQuest, League, AiConfig } from '../types';
import { DAILY_TOPICS } from '../data/dailyTopics';
import { CHINESE_SRS_CARDS } from '../data/chineseCurriculum';
import { ENGLISH_SRS_CARDS } from '../data/englishCurriculum';
import { INITIAL_DAILY_QUESTS } from '../data/dailyQuests';
import { sound } from '../services/soundEffects';
import { aiService } from '../services/aiService';
import { telegram } from '../services/telegramService';
import { TelegramUser } from '../types/telegram';

interface GameContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeProfileId: 'son' | 'father';
  switchProfile: (profileId: 'son' | 'father') => void;
  currentProfile: UserProfile;
  otherProfile: UserProfile;
  selectedTopic: DailyTopic;
  setSelectedTopicId: (topicId: string) => void;
  availableTopics: DailyTopic[];
  srsCards: SrsCard[];
  dailyQuests: DailyQuest[];
  pace: number;
  setPace: (p: number) => void;
  toneAmplify: boolean;
  setToneAmplify: (a: boolean) => void;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  buyStreakShield: () => boolean;
  addMinutesTrained: (mins: number) => void;
  setDailyGoalMinutes: (goal: number) => void;
  completePlacement: (assignedLevel: string) => void;
  selectCompanion: (companionId: string) => void;
  updateCardReview: (cardId: string, rating: 'easy' | 'good' | 'hard') => void;
  progressQuest: (type: DailyQuest['type'], count?: number) => void;
  claimQuestReward: (questId: string) => void;
  openMysteryChest: () => { xp: number; gems: number; shield: boolean; message: string };
  exportSyncData: () => string;
  importSyncData: (jsonStr: string) => boolean;
  aiConfig: AiConfig;
  updateAiConfig: (config: AiConfig) => void;
  isTelegram: boolean;
  telegramUser: TelegramUser | null;
  linkTelegramToProfile: () => void;
  showRoleBindingModal: boolean;
  setShowRoleBindingModal: (show: boolean) => void;
  assignTelegramRole: (role: 'son' | 'father', user: TelegramUser) => void;
  syncFamilyProgress: () => Promise<void>;
}

const defaultSonProfile: UserProfile = {
  id: 'son',
  name: 'Hijo (13 años)',
  avatar: '👦',
  ageDesc: '13 años • Secundaria',
  selectedCompanionId: 'kenji',
  placementCompleted: false,
  assignedLevelZh: 'Sin calibrar',
  assignedLevelEn: 'Sin calibrar',
  xp: 180,
  level: 3,
  league: 'Oro',
  gems: 120,
  streakDays: 4,
  streakShields: 2,
  todayMinutes: 18,
  goalMinutes: 45,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedTopicsCount: 2,
  historyTopics: ['en-gaming'],
  cardsMasteredZh: 8,
  cardsMasteredEn: 14,
  personalBestStreak: 7,
  personalBestDailyXp: 180,
  todayXp: 45,
  unlockedAchievements: ['first_lesson', 'tone_sniper'],
  openedChestsCount: 2,
};

const defaultFatherProfile: UserProfile = {
  id: 'father',
  name: 'Papá',
  avatar: '🧔',
  ageDesc: 'Adulto • Mentor',
  selectedCompanionId: 'arthur',
  placementCompleted: false,
  assignedLevelZh: 'Sin calibrar',
  assignedLevelEn: 'Sin calibrar',
  xp: 110,
  level: 2,
  league: 'Plata',
  gems: 70,
  streakDays: 3,
  streakShields: 1,
  todayMinutes: 12,
  goalMinutes: 30,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedTopicsCount: 1,
  historyTopics: ['en-travel-coffee'],
  cardsMasteredZh: 4,
  cardsMasteredEn: 8,
  personalBestStreak: 4,
  personalBestDailyXp: 110,
  todayXp: 25,
  unlockedAchievements: ['first_lesson'],
  openedChestsCount: 1,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeProfileId, setActiveProfileId] = useState<'son' | 'father'>('son');

  const [sonProfile, setSonProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lq_v2_profile_son');
    return saved ? JSON.parse(saved) : defaultSonProfile;
  });

  const [fatherProfile, setFatherProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lq_v2_profile_father');
    return saved ? JSON.parse(saved) : defaultFatherProfile;
  });

  const [selectedTopicId, setSelectedTopicIdState] = useState<string>(() => {
    return language === 'zh' ? 'zh-meeting-friends' : 'en-gaming';
  });

  const [srsCards, setSrsCards] = useState<SrsCard[]>(() => {
    const saved = localStorage.getItem('lq_srs_cards');
    return saved ? JSON.parse(saved) : [...CHINESE_SRS_CARDS, ...ENGLISH_SRS_CARDS];
  });

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem('lq_daily_quests');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_QUESTS;
  });

  const [pace, setPace] = useState<number>(0.85);
  const [toneAmplify, setToneAmplify] = useState<boolean>(true);

  const [aiConfig, setAiConfigState] = useState<AiConfig>(() => aiService.getConfig());
  const [isTelegram, setIsTelegram] = useState<boolean>(false);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [showRoleBindingModal, setShowRoleBindingModal] = useState<boolean>(false);

  // Sync with cloud server (Railway) to exchange minutes/streak between Father & Son across phones
  const syncFamilyProgress = async () => {
    try {
      const res = await fetch('/api/family');
      if (res.ok) {
        const data = await res.json();
        if (data.father && activeProfileId === 'son') {
          setFatherProfile((prev) => ({
            ...prev,
            name: data.father.name || prev.name,
            todayMinutes: typeof data.father.minutes === 'number' ? data.father.minutes : prev.todayMinutes,
            streakDays: typeof data.father.streak === 'number' ? data.father.streak : prev.streakDays,
            xp: typeof data.father.xp === 'number' ? data.father.xp : prev.xp,
            telegramUserId: data.father.telegramId || prev.telegramUserId,
          }));
        } else if (data.son && activeProfileId === 'father') {
          setSonProfile((prev) => ({
            ...prev,
            name: data.son.name || prev.name,
            todayMinutes: typeof data.son.minutes === 'number' ? data.son.minutes : prev.todayMinutes,
            streakDays: typeof data.son.streak === 'number' ? data.son.streak : prev.streakDays,
            xp: typeof data.son.xp === 'number' ? data.son.xp : prev.xp,
            telegramUserId: data.son.telegramId || prev.telegramUserId,
          }));
        }
      }
    } catch {
      // Offline fallback
    }
  };

  const pushFamilySync = async (roleOverride?: 'son' | 'father', tgId?: number, nameOverride?: string) => {
    try {
      const role = roleOverride || activeProfileId;
      const profile = role === 'son' ? sonProfile : fatherProfile;
      await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          telegramId: tgId || profile.telegramUserId,
          name: nameOverride || profile.name,
          minutes: profile.todayMinutes,
          streak: profile.streakDays,
          xp: profile.xp,
          avatar: profile.avatar,
        }),
      });
    } catch {
      // Offline fallback
    }
  };

  const assignTelegramRole = (role: 'son' | 'father', user: TelegramUser) => {
    localStorage.setItem(`lq_tg_role_${user.id}`, role);
    setActiveProfileId(role);
    const fullName = `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;

    if (role === 'son') {
      setSonProfile((prev) => ({
        ...prev,
        name: fullName || 'Hijo (13 años)',
        telegramUserId: user.id,
        telegramUsername: user.username,
        telegramPhotoUrl: user.photo_url,
      }));
    } else {
      setFatherProfile((prev) => ({
        ...prev,
        name: fullName || 'Papá',
        telegramUserId: user.id,
        telegramUsername: user.username,
        telegramPhotoUrl: user.photo_url,
      }));
    }

    pushFamilySync(role, user.id, fullName);
  };

  useEffect(() => {
    // Initialize Telegram WebApp
    telegram.init();
    const tgActive = telegram.isTelegram();
    setIsTelegram(tgActive);
    const tgUser = telegram.getUser();
    setTelegramUser(tgUser);

    if (tgUser && tgUser.id) {
      // Check if this Telegram ID already has a bound role
      const storedRole = localStorage.getItem(`lq_tg_role_${tgUser.id}`) as 'son' | 'father' | null;
      if (storedRole === 'son' || storedRole === 'father') {
        setActiveProfileId(storedRole);
      } else {
        const startParam = telegram.getStartParam();
        if (startParam === 'father') {
          assignTelegramRole('father', tgUser);
        } else if (startParam === 'son') {
          assignTelegramRole('son', tgUser);
        } else {
          // Open 1-tap onboarding modal so they can identify as Son or Father
          setShowRoleBindingModal(true);
        }
      }
    }

    // Initial family sync
    syncFamilyProgress();

    // Periodic family sync every 30 seconds
    const interval = setInterval(syncFamilyProgress, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateAiConfig = (newConfig: AiConfig) => {
    setAiConfigState(newConfig);
    aiService.saveConfig(newConfig);
  };

  const linkTelegramToProfile = () => {
    if (!telegramUser) return;
    updateCurrentProfile((prev) => ({
      ...prev,
      name: `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`,
      telegramUserId: telegramUser.id,
      telegramUsername: telegramUser.username,
      telegramPhotoUrl: telegramUser.photo_url,
    }));
    telegram.haptic('success');
    sound.playFanfare();
  };

  useEffect(() => {
    localStorage.setItem('lq_v2_profile_son', JSON.stringify(sonProfile));
  }, [sonProfile]);

  useEffect(() => {
    localStorage.setItem('lq_v2_profile_father', JSON.stringify(fatherProfile));
  }, [fatherProfile]);

  const currentProfile = activeProfileId === 'son' ? sonProfile : fatherProfile;
  const otherProfile = activeProfileId === 'son' ? fatherProfile : sonProfile;

  const updateCurrentProfile = (updater: (prev: UserProfile) => UserProfile) => {
    if (activeProfileId === 'son') {
      setSonProfile(updater);
    } else {
      setFatherProfile(updater);
    }
  };

  const switchProfile = (profileId: 'son' | 'father') => {
    sound.playTap();
    setActiveProfileId(profileId);
  };

  const availableTopics = DAILY_TOPICS.filter((t) => t.lang === language);
  const selectedTopic =
    availableTopics.find((t) => t.id === selectedTopicId) ||
    availableTopics[0] ||
    DAILY_TOPICS[0];

  const setSelectedTopicId = (tId: string) => {
    sound.playTap();
    setSelectedTopicIdState(tId);
  };

  const addXp = (amount: number) => {
    updateCurrentProfile((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const addGems = (amount: number) => {
    updateCurrentProfile((prev) => ({
      ...prev,
      gems: prev.gems + amount,
    }));
  };

  const buyStreakShield = (): boolean => {
    if (currentProfile.gems < 50) return false;
    sound.playCorrect();
    updateCurrentProfile((prev) => ({
      ...prev,
      gems: prev.gems - 50,
      streakShields: prev.streakShields + 1,
    }));
    return true;
  };

  const addMinutesTrained = (mins: number) => {
    updateCurrentProfile((prev) => ({
      ...prev,
      todayMinutes: prev.todayMinutes + mins,
    }));
  };

  const setDailyGoalMinutes = (goal: number) => {
    sound.playTap();
    updateCurrentProfile((prev) => ({
      ...prev,
      goalMinutes: goal,
    }));
  };

  const selectCompanion = (companionId: string) => {
    updateCurrentProfile((prev) => ({
      ...prev,
      selectedCompanionId: companionId,
    }));
  };

  const completePlacement = (assignedLevel: string) => {
    updateCurrentProfile((prev) => ({
      ...prev,
      placementCompleted: true,
      assignedLevelZh: language === 'zh' ? assignedLevel : prev.assignedLevelZh,
      assignedLevelEn: language === 'en' ? assignedLevel : prev.assignedLevelEn,
      xp: prev.xp + 50,
    }));
  };

  const updateCardReview = (cardId: string, rating: 'easy' | 'good' | 'hard') => {
    setSrsCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;
        let newInterval = card.srsInterval;
        if (rating === 'easy') newInterval = Math.max(24, card.srsInterval * 2);
        else if (rating === 'good') newInterval = Math.max(12, card.srsInterval * 1.5);
        else newInterval = 1;

        return {
          ...card,
          srsInterval: Math.round(newInterval),
          nextReviewDate: Date.now() + newInterval * 3600 * 1000,
        };
      })
    );
  };

  const progressQuest = (type: DailyQuest['type'], count: number = 1) => {
    setDailyQuests((prev) =>
      prev.map((q) =>
        q.type === type ? { ...q, progress: Math.min(q.target, q.progress + count) } : q
      )
    );
  };

  const claimQuestReward = (questId: string) => {
    const quest = dailyQuests.find((q) => q.id === questId);
    if (!quest) return;
    sound.playCorrect();
    addXp(quest.rewardXp);
    addGems(quest.rewardGems);
  };

  const openMysteryChest = () => {
    sound.playChestOpen();
    const xp = 60;
    const gems = 20;
    addXp(xp);
    addGems(gems);
    return {
      xp,
      gems,
      shield: true,
      message: `¡Cofre abierto! +${xp} XP, +${gems} Gemas y 1 Escudo de protección.`,
    };
  };

  const exportSyncData = (): string => {
    const data = {
      son: sonProfile,
      father: fatherProfile,
      time: Date.now(),
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  };

  const importSyncData = (base64Str: string): boolean => {
    try {
      const decoded = decodeURIComponent(escape(atob(base64Str)));
      const parsed = JSON.parse(decoded);
      if (parsed.son && parsed.father) {
        setSonProfile(parsed.son);
        setFatherProfile(parsed.father);
        sound.playFanfare();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <GameContext.Provider
      value={{
        language,
        setLanguage: (lang) => {
          sound.playTap();
          setLanguage(lang);
          const firstTopic = DAILY_TOPICS.find((t) => t.lang === lang);
          if (firstTopic) setSelectedTopicIdState(firstTopic.id);
        },
        activeProfileId,
        switchProfile,
        currentProfile,
        otherProfile,
        selectedTopic,
        setSelectedTopicId,
        availableTopics,
        srsCards,
        dailyQuests,
        pace,
        setPace,
        toneAmplify,
        setToneAmplify,
        addXp,
        addGems,
        buyStreakShield,
        addMinutesTrained,
        setDailyGoalMinutes,
        completePlacement,
        selectCompanion,
        updateCardReview,
        progressQuest,
        claimQuestReward,
        openMysteryChest,
        exportSyncData,
        importSyncData,
        aiConfig,
        updateAiConfig,
        isTelegram,
        telegramUser,
        linkTelegramToProfile,
        showRoleBindingModal,
        setShowRoleBindingModal,
        assignTelegramRole,
        syncFamilyProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
