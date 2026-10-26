export type Language = 'zh' | 'en';

export type UserRole = 'son' | 'father';

export type League = 'Bronce' | 'Plata' | 'Oro' | 'Zafiro' | 'Diamante' | 'Leyenda';

export type AiProvider = 'openrouter' | 'deepseek' | 'gemini' | 'builtin';

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
  temperature: number;
  enabled: boolean;
}

export interface AiChatResponse {
  reply: string;
  pinyin?: string;
  translation: string;
  coachTip?: string;
  pronunciationScore?: number;
  suggestedResponses?: string[];
  secondaryCompanionReply?: string;
  secondaryCompanionPinyin?: string;
  secondaryCompanionTranslation?: string;
  isAiGenerated: boolean;
}

export interface MangaCompanion {
  id: string;
  name: string;
  title: string;
  role: 'gamer' | 'sensei' | 'traveler' | 'scholar';
  avatar: string; // Emoji or SVG character representation
  color: string;
  mangaStyle: string;
  tagline: string;
  greetingZh: string;
  greetingEn: string;
  voicePitch: number;
  voiceRate: number;
  personality: string;
}

export interface UserProfile {
  id: UserRole;
  name: string;
  avatar: string;
  ageDesc: string;
  selectedCompanionId: string;
  placementCompleted: boolean;
  assignedLevelZh: string;
  assignedLevelEn: string;
  xp: number;
  level: number;
  league: League;
  gems: number;
  streakDays: number;
  streakShields: number;
  todayMinutes: number;
  goalMinutes: number;
  lastActiveDate: string;
  completedTopicsCount: number;
  historyTopics: string[];
  cardsMasteredZh: number;
  cardsMasteredEn: number;
  personalBestStreak: number;
  personalBestDailyXp: number;
  todayXp: number;
  unlockedAchievements: string[];
  openedChestsCount: number;
  telegramUserId?: number;
  telegramUsername?: string;
  telegramPhotoUrl?: string;
}

export interface PlacementQuestion {
  id: string;
  lang: Language;
  targetLevel: string;
  instruction: string;
  promptText: string;
  audioText?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    points: number;
  }[];
}

export interface TopicVocabulary {
  term: string;
  pinyinOrIpa?: string;
  translation: string;
  example: string;
  exampleTranslation: string;
}

export interface BotChatMessage {
  id: string;
  sender: 'bot' | 'user';
  companionId?: string;
  companionName?: string;
  text: string;
  pinyin?: string;
  translation?: string;
  correctionTip?: string;
  pronunciationScore?: number; // 0-100
  suggestedResponses?: string[];
  timestamp: number;
}

export interface DailyTopic {
  id: string;
  lang: Language;
  level: string;
  category: string;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  estimatedMinutes: number;
  vocabulary: TopicVocabulary[];
  keyGrammarRule: {
    title: string;
    explanation: string;
    sample: string;
  };
  botRoleplay: {
    botPersona: string;
    scenarioContext: string;
    openingMessage: {
      text: string;
      pinyin?: string;
      translation: string;
      suggestedResponses: string[];
    };
    dialogueFlow: {
      triggerUserContains: string[];
      botResponse: string;
      pinyin?: string;
      translation: string;
      feedbackNote?: string;
      nextSuggestions: string[];
    }[];
  };
}

export interface SrsCard {
  id: string;
  lang: Language;
  front: string;
  pinyin?: string;
  phonetic?: string;
  back: string;
  example: string;
  exampleTranslation: string;
  category: string;
  level: string;
  phase?: 1 | 2 | 3 | 4;
  isHandwritingCandidate?: boolean;
  srsInterval: number;
  nextReviewDate: number;
  consecutiveSuccess: number;
  easeFactor: number;
}

export interface ToneLabExercise {
  id: string;
  syllable: string;
  targetTone: 1 | 2 | 3 | 4;
  pinyin: string;
  hanzi: string;
  meaning: string;
  options: { tone: 1 | 2 | 3 | 4; pinyin: string; hanzi: string; meaning: string }[];
}

export interface HanziWritingCard {
  char: string;
  pinyin: string;
  meaning: string;
  radical: string;
  radicalMeaning: string;
  strokesCount: number;
  hintStrokes: string[];
}

export interface PinyinImeExercise {
  id: string;
  pinyinInput: string;
  contextSentence: string;
  targetChar: string;
  targetMeaning: string;
  targetRadical: string;
  targetRadicalMeaning: string;
  candidates: {
    char: string;
    meaning: string;
    radical: string;
    radicalMeaning: string;
    isCorrect: boolean;
  }[];
}

export interface MediationCard {
  id: string;
  title: string;
  cefrLevel: string;
  realWorldScenario: string;
  audioPromptEn: string;
  taskInstruction: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface GraduatedStory {
  id: string;
  lang: Language;
  title: string;
  level: string;
  targetNewWords: string[];
  paragraphs: { text: string; pinyin?: string; translation: string }[];
  comprehensionQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardXp: number;
  rewardGems: number;
  completed: boolean;
  type: 'reviews' | 'tones' | 'mediation' | 'streak';
}
