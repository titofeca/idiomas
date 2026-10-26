import { DailyQuest } from '../types';

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest-reviews',
    title: 'Maestría SRS',
    description: 'Repasa al menos 5 tarjetas del mazo de memoria',
    progress: 0,
    target: 5,
    rewardXp: 50,
    rewardGems: 10,
    completed: false,
    type: 'reviews'
  },
  {
    id: 'quest-tones',
    title: 'Oído de Halcón',
    description: 'Acierta 3 ejercicios en el Laboratorio de Tonos',
    progress: 0,
    target: 3,
    rewardXp: 40,
    rewardGems: 10,
    completed: false,
    type: 'tones'
  },
  {
    id: 'quest-mediation',
    title: 'Mediador Estrella',
    description: 'Resuelve 1 reto de mediación real LOMLOE',
    progress: 0,
    target: 1,
    rewardXp: 60,
    rewardGems: 15,
    completed: false,
    type: 'mediation'
  },
  {
    id: 'quest-streak',
    title: 'Defensa de Racha',
    description: 'Mantén activa la llama del día',
    progress: 1,
    target: 1,
    rewardXp: 30,
    rewardGems: 5,
    completed: true,
    type: 'streak'
  }
];
