export type RankType = 
  | 'E-RANK'
  | 'D-RANK'
  | 'C-RANK'
  | 'B-RANK'
  | 'A-RANK'
  | 'S-RANK'
  | 'NATIONAL LEVEL'
  | 'SHADOW MONARCH'
  | 'LEGENDARY MONARCH';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseType = 'pushups' | 'situps' | 'squats' | 'running';

export interface ExerciseAlternative {
  id: string;
  name: string;
  description: string;
  multiplier: number; // e.g. knee pushups count as 1x reps or scaled
  instructions: string[];
}

export interface ExerciseDefinition {
  id: ExerciseType;
  name: string;
  category: 'Strength' | 'Core' | 'Legs' | 'Cardio';
  unit: 'reps' | 'km';
  baseTarget: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  growthPerLevel: number;
  description: string;
  muscleGroups: string[];
  alternatives: ExerciseAlternative[];
}

export interface DailyMission {
  id: string;
  exerciseType: ExerciseType;
  exerciseName: string;
  selectedAlternativeId?: string;
  target: number;
  completed: number;
  unit: 'reps' | 'km';
  xpReward: number;
  goldReward: number;
  isCompleted: boolean;
}

export interface DailyQuestStatus {
  date: string; // YYYY-MM-DD
  isRecoveryDay: boolean;
  isAllCompleted: boolean;
  claimedAt?: string;
  missions: DailyMission[];
  bonusXp: number;
  bonusGold: number;
}

export interface StatPoints {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
  perception: number;
  unassigned: number;
}

export interface EquipmentSlot {
  shirt?: string;
  pants?: string;
  shoes?: string;
  hairstyle?: string;
  accessory?: string;
  armor?: string;
  skin?: string;
  specialEffect?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'shirt' | 'pants' | 'shoes' | 'hairstyle' | 'accessory' | 'armor' | 'skin' | 'specialEffect';
  price: number;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  icon: string;
  unlockedLevel?: number;
  visualData: {
    color?: string;
    secondaryColor?: string;
    glowColor?: string;
    effectType?: string;
    assetUrl?: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'level' | 'workout' | 'wealth' | 'boss';
  badgeIcon: string;
  targetCount: number;
  currentCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  goldReward: number;
  isClaimed: boolean;
}

export interface BossChallenge {
  id: string;
  title: string;
  subtitle: string;
  rankRequired: RankType;
  levelRequired: number;
  bossName: string;
  bossImage: string;
  lore: string;
  maxHp: number;
  currentHp: number;
  workoutTasks: {
    exercise: string;
    target: number;
    completed: number;
    damagePerUnit: number;
  }[];
  xpReward: number;
  goldReward: number;
  badgeReward: string;
  isDefeated: boolean;
  defeatedAt?: string;
}

export interface WorkoutHistoryRecord {
  date: string; // YYYY-MM-DD
  dayLevel: number;
  isRecoveryDay: boolean;
  isCompleted: boolean;
  totalXpEarned: number;
  totalGoldEarned: number;
  exercises: {
    name: string;
    completed: number;
    target: number;
    unit: string;
  }[];
  notes?: string;
}

export interface PlayerState {
  hasStarted: boolean;
  name: string;
  title: string;
  level: number;
  rank: RankType;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
  gold: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  difficulty: DifficultyLevel;
  stats: StatPoints;
  dailyQuest: DailyQuestStatus;
  history: Record<string, WorkoutHistoryRecord>; // keyed by date
  inventory: string[]; // purchased item IDs
  equipped: EquipmentSlot;
  achievements: Achievement[];
  bossChallenges: BossChallenge[];
  evolutionStage: number; // 1, 10, 25, 50, 75, 100
  soundEnabled: boolean;
  soundVolume: number;
}
