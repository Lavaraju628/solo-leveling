import { RankType } from '../types/game';

export interface LevelInfo {
  level: number;
  rank: RankType;
  title: string;
  xpRequired: number;
  goldReward: number;
  unlockedFeature?: string;
  description: string;
}

export function getRankForLevel(level: number): RankType {
  if (level >= 100) return 'LEGENDARY MONARCH';
  if (level >= 91) return 'SHADOW MONARCH';
  if (level >= 71) return 'NATIONAL LEVEL';
  if (level >= 51) return 'S-RANK';
  if (level >= 41) return 'A-RANK';
  if (level >= 31) return 'B-RANK';
  if (level >= 21) return 'C-RANK';
  if (level >= 11) return 'D-RANK';
  return 'E-RANK';
}

export function getRankColor(rank: RankType): {
  text: string;
  border: string;
  bg: string;
  glow: string;
} {
  switch (rank) {
    case 'E-RANK':
      return {
        text: 'text-zinc-400',
        border: 'border-zinc-500/50',
        bg: 'bg-zinc-800/40',
        glow: 'shadow-[0_0_15px_rgba(161,161,170,0.3)]',
      };
    case 'D-RANK':
      return {
        text: 'text-emerald-400',
        border: 'border-emerald-500/50',
        bg: 'bg-emerald-950/40',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      };
    case 'C-RANK':
      return {
        text: 'text-cyan-400',
        border: 'border-cyan-500/50',
        bg: 'bg-cyan-950/40',
        glow: 'shadow-[0_0_18px_rgba(6,182,212,0.4)]',
      };
    case 'B-RANK':
      return {
        text: 'text-blue-400',
        border: 'border-blue-500/50',
        bg: 'bg-blue-950/40',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      };
    case 'A-RANK':
      return {
        text: 'text-indigo-400',
        border: 'border-indigo-500/50',
        bg: 'bg-indigo-950/40',
        glow: 'shadow-[0_0_25px_rgba(99,102,241,0.5)]',
      };
    case 'S-RANK':
      return {
        text: 'text-purple-400',
        border: 'border-purple-500/60',
        bg: 'bg-purple-950/40',
        glow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
      };
    case 'NATIONAL LEVEL':
      return {
        text: 'text-amber-400',
        border: 'border-amber-500/70',
        bg: 'bg-amber-950/40',
        glow: 'shadow-[0_0_35px_rgba(245,158,11,0.7)]',
      };
    case 'SHADOW MONARCH':
      return {
        text: 'text-fuchsia-400',
        border: 'border-fuchsia-500/80',
        bg: 'bg-fuchsia-950/50',
        glow: 'shadow-[0_0_40px_rgba(217,70,239,0.8)]',
      };
    case 'LEGENDARY MONARCH':
      return {
        text: 'text-sky-300 font-black tracking-wider animate-pulse',
        border: 'border-cyan-300',
        bg: 'bg-gradient-to-r from-blue-950 via-purple-950 to-indigo-950',
        glow: 'shadow-[0_0_50px_rgba(0,240,255,0.9)]',
      };
  }
}

export function getRankBadgeTitle(rank: RankType): string {
  switch (rank) {
    case 'E-RANK': return 'The Weakest Hunter';
    case 'D-RANK': return 'Apprentice Warrior';
    case 'C-RANK': return 'Dungeon Vanguard';
    case 'B-RANK': return 'Elite Striker';
    case 'A-RANK': return 'Guild Champion';
    case 'S-RANK': return 'Calamity Class';
    case 'NATIONAL LEVEL': return 'Living Fortress';
    case 'SHADOW MONARCH': return 'Ruler of the Dead';
    case 'LEGENDARY MONARCH': return 'Transcendent Sovereign';
  }
}

/**
 * Calculates XP required for a given level:
 * Base 100 XP at Level 1, scaling smoothly so Level 100 is an epic achievement.
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 100;
  if (level <= 10) return Math.round(100 + (level - 1) * 35); // 100 to 415
  if (level <= 20) return Math.round(420 + (level - 10) * 55); // 475 to 970
  if (level <= 30) return Math.round(1000 + (level - 20) * 75);
  if (level <= 40) return Math.round(1800 + (level - 30) * 95);
  if (level <= 50) return Math.round(2800 + (level - 40) * 120);
  if (level <= 70) return Math.round(4100 + (level - 50) * 150);
  if (level <= 90) return Math.round(7200 + (level - 70) * 200);
  if (level <= 99) return Math.round(11400 + (level - 90) * 350);
  return 18000; // Level 100 Sovereign Cap
}

/**
 * Gold reward awarded on achieving each level
 */
export function getGoldRewardForLevel(level: number): number {
  const base = 50 + level * 25;
  // Milestone bonuses
  if (level === 10) return base + 500;
  if (level === 25) return base + 1000;
  if (level === 50) return base + 2500;
  if (level === 75) return base + 5000;
  if (level === 100) return base + 10000;
  return base;
}

/**
 * Pre-generated list of all 100 levels with lore and milestones
 */
export const ALL_100_LEVELS: LevelInfo[] = Array.from({ length: 100 }, (_, index) => {
  const lvl = index + 1;
  const rank = getRankForLevel(lvl);
  const xpRequired = getXpRequiredForLevel(lvl);
  const goldReward = getGoldRewardForLevel(lvl);

  let unlockedFeature: string | undefined;
  if (lvl === 1) unlockedFeature = 'Daily Training System Initialized';
  else if (lvl === 10) unlockedFeature = 'Rank Advancement: D-RANK & Kasaka Boss Challenge';
  else if (lvl === 20) unlockedFeature = 'Stat Point Bonus & Advanced Gear Tier';
  else if (lvl === 21) unlockedFeature = 'Rank Advancement: C-RANK';
  else if (lvl === 25) unlockedFeature = 'Evolution Stage 2: Cerberus Red Gate';
  else if (lvl === 31) unlockedFeature = 'Rank Advancement: B-RANK & Guild Pass';
  else if (lvl === 41) unlockedFeature = 'Rank Advancement: A-RANK';
  else if (lvl === 50) unlockedFeature = 'Evolution Stage 3: Kargalgan Boss Challenge & Shadow Aura';
  else if (lvl === 51) unlockedFeature = 'Rank Advancement: S-RANK (Calamity)';
  else if (lvl === 71) unlockedFeature = 'Rank Advancement: NATIONAL LEVEL HUNTER';
  else if (lvl === 75) unlockedFeature = 'Evolution Stage 4: Ant King Beru Boss Challenge';
  else if (lvl === 91) unlockedFeature = 'Rank Advancement: SHADOW MONARCH (Domain of the Monarch)';
  else if (lvl === 100) unlockedFeature = 'FINAL EVOLUTION: LEGENDARY MONARCH (Kamish Sovereign)';

  return {
    level: lvl,
    rank,
    title: `Level ${lvl} ${rank}`,
    xpRequired,
    goldReward,
    unlockedFeature,
    description: `Hunter training milestone ${lvl} of 100. Overcome physical limits to raise resonance.`,
  };
});
