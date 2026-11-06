import {
  PlayerState,
  DailyMission,
  DailyQuestStatus,
  DifficultyLevel,
  RankType,
  WorkoutHistoryRecord
} from '../types/game';
import { getRankForLevel, getXpRequiredForLevel, getGoldRewardForLevel } from '../data/levels';
import { calculateWorkoutTarget, EXERCISE_DEFINITIONS } from '../data/exercises';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_BOSS_CHALLENGES } from '../data/bossChallenges';

const STORAGE_KEY = 'SOLO_LEVELING_PLAYER_DATA_V1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate fresh missions for a specific level, difficulty, and recovery day flag.
 */
export function generateDailyMissions(
  level: number,
  difficulty: DifficultyLevel,
  isRecoveryDay: boolean
): DailyMission[] {
  const pushupTarget = calculateWorkoutTarget('pushups', level, difficulty, isRecoveryDay);
  const situpTarget = calculateWorkoutTarget('situps', level, difficulty, isRecoveryDay);
  const squatTarget = calculateWorkoutTarget('squats', level, difficulty, isRecoveryDay);
  const runningTarget = calculateWorkoutTarget('running', level, difficulty, isRecoveryDay);

  // Scaling rewards based on level
  const baseRewardXp = Math.round(25 + level * 5);
  const baseRewardGold = Math.round(30 + level * 6);

  return [
    {
      id: 'mission-pushups',
      exerciseType: 'pushups',
      exerciseName: EXERCISE_DEFINITIONS.pushups.name,
      target: pushupTarget,
      completed: 0,
      unit: 'reps',
      xpReward: baseRewardXp,
      goldReward: baseRewardGold,
      isCompleted: false,
    },
    {
      id: 'mission-situps',
      exerciseType: 'situps',
      exerciseName: EXERCISE_DEFINITIONS.situps.name,
      target: situpTarget,
      completed: 0,
      unit: 'reps',
      xpReward: baseRewardXp,
      goldReward: baseRewardGold,
      isCompleted: false,
    },
    {
      id: 'mission-squats',
      exerciseType: 'squats',
      exerciseName: EXERCISE_DEFINITIONS.squats.name,
      target: squatTarget,
      completed: 0,
      unit: 'reps',
      xpReward: baseRewardXp,
      goldReward: baseRewardGold,
      isCompleted: false,
    },
    {
      id: 'mission-running',
      exerciseType: 'running',
      exerciseName: EXERCISE_DEFINITIONS.running.name,
      target: runningTarget,
      completed: 0,
      unit: 'km',
      xpReward: Math.round(baseRewardXp * 1.5),
      goldReward: Math.round(baseRewardGold * 1.5),
      isCompleted: false,
    },
  ];
}

export function getEvolutionStageForLevel(level: number): number {
  if (level >= 100) return 100;
  if (level >= 75) return 75;
  if (level >= 50) return 50;
  if (level >= 25) return 25;
  if (level >= 10) return 10;
  return 1;
}

export function createInitialPlayerState(): PlayerState {
  const today = getTodayDateString();
  const initialLevel = 1;
  const initialDiff: DifficultyLevel = 'beginner';
  const missions = generateDailyMissions(initialLevel, initialDiff, false);

  const dailyQuest: DailyQuestStatus = {
    date: today,
    isRecoveryDay: false,
    isAllCompleted: false,
    missions,
    bonusXp: 100,
    bonusGold: 150,
  };

  return {
    hasStarted: false,
    name: 'Sung Jin-Woo',
    title: 'The Weakest Hunter',
    level: 1,
    rank: 'E-RANK',
    currentXp: 0,
    xpToNextLevel: getXpRequiredForLevel(1),
    totalXp: 0,
    gold: 0,
    streak: 0,
    lastActiveDate: today,
    difficulty: initialDiff,
    stats: {
      strength: 10,
      agility: 10,
      vitality: 10,
      intelligence: 10,
      perception: 10,
      unassigned: 0,
    },
    dailyQuest,
    history: {},
    inventory: ['shirt-gym-tee', 'pants-sweatpants', 'shoes-runners'],
    equipped: {
      shirt: 'shirt-gym-tee',
      pants: 'pants-sweatpants',
      shoes: 'shoes-runners',
    },
    achievements: INITIAL_ACHIEVEMENTS,
    bossChallenges: INITIAL_BOSS_CHALLENGES,
    evolutionStage: 1,
    soundEnabled: true,
    soundVolume: 0.6,
  };
}

/**
 * Loads player state and ensures date synchronization without losing progress.
 */
export function loadPlayerState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialPlayerState();
    }
    const state: PlayerState = JSON.parse(raw);

    // Verify day transitions
    const today = getTodayDateString();
    if (state.dailyQuest.date !== today) {
      // Archive yesterday or past day into history if not already recorded
      const pastDate = state.dailyQuest.date;
      if (!state.history[pastDate]) {
        const completedCount = state.dailyQuest.missions.filter(m => m.isCompleted).length;
        state.history[pastDate] = {
          date: pastDate,
          dayLevel: state.level,
          isRecoveryDay: state.dailyQuest.isRecoveryDay,
          isCompleted: state.dailyQuest.isAllCompleted || (completedCount === state.dailyQuest.missions.length),
          totalXpEarned: state.dailyQuest.isAllCompleted ? state.dailyQuest.bonusXp : 0,
          totalGoldEarned: state.dailyQuest.isAllCompleted ? state.dailyQuest.bonusGold : 0,
          exercises: state.dailyQuest.missions.map(m => ({
            name: m.exerciseName,
            completed: m.completed,
            target: m.target,
            unit: m.unit,
          })),
        };
      }

      // Check streak continuity:
      const yesterday = getYesterdayDateString();
      if (state.lastActiveDate !== yesterday && state.lastActiveDate !== today) {
        // If inactive for more than a day, streak resets to 0 unless streak was 0
        if (state.lastActiveDate && state.lastActiveDate < yesterday) {
          state.streak = 0;
        }
      }

      // Initialize brand new daily quest for today!
      state.dailyQuest = {
        date: today,
        isRecoveryDay: false,
        isAllCompleted: false,
        missions: generateDailyMissions(state.level, state.difficulty, false),
        bonusXp: Math.round(100 + state.level * 10),
        bonusGold: Math.round(150 + state.level * 15),
      };
      state.lastActiveDate = today;
    }

    // Ensure backwards compatibility for any newly added achievements or boss challenges
    if (!state.achievements || state.achievements.length < INITIAL_ACHIEVEMENTS.length) {
      const existingIds = new Set((state.achievements || []).map(a => a.id));
      const missing = INITIAL_ACHIEVEMENTS.filter(a => !existingIds.has(a.id));
      state.achievements = [...(state.achievements || []), ...missing];
    }

    if (!state.bossChallenges || state.bossChallenges.length < INITIAL_BOSS_CHALLENGES.length) {
      const existingBossIds = new Set((state.bossChallenges || []).map(b => b.id));
      const missingBosses = INITIAL_BOSS_CHALLENGES.filter(b => !existingBossIds.has(b.id));
      state.bossChallenges = [...(state.bossChallenges || []), ...missingBosses];
    }

    savePlayerState(state);
    return state;
  } catch (err) {
    console.error('Failed to load player state from localStorage', err);
    return createInitialPlayerState();
  }
}

export function savePlayerState(state: PlayerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save player state', err);
  }
}

export function exportPlayerSaveData(state: PlayerState): string {
  return JSON.stringify(state, null, 2);
}

export function importPlayerSaveData(jsonString: string): PlayerState | null {
  try {
    const parsed = JSON.parse(jsonString) as PlayerState;
    if (parsed && typeof parsed.level === 'number' && parsed.dailyQuest) {
      savePlayerState(parsed);
      return parsed;
    }
  } catch (e) {
    console.error('Invalid save file format', e);
  }
  return null;
}
