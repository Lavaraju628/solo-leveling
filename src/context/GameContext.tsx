import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  PlayerState,
  DifficultyLevel,
  RankType,
  StatPoints,
  DailyMission,
  DailyQuestStatus,
  Achievement
} from '../types/game';
import {
  loadPlayerState,
  savePlayerState,
  createInitialPlayerState,
  getTodayDateString,
  getEvolutionStageForLevel,
  generateDailyMissions
} from '../services/storage';
import { getRankForLevel, getXpRequiredForLevel, getGoldRewardForLevel } from '../data/levels';
import { SHOP_ITEMS } from '../data/shopItems';
import { soundEngine } from '../services/sound';

interface SystemAlertInfo {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  message: string;
  type?: 'quest' | 'alert' | 'danger' | 'success';
  rewards?: { xp?: number; gold?: number };
  onConfirm?: () => void;
}

interface LevelUpModalInfo {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  newRank: RankType;
  goldEarned: number;
  statsEarned: number;
}

interface GameContextType {
  state: PlayerState;
  startGame: () => void;
  updateMissionProgress: (missionId: string, delta: number) => void;
  setMissionProgressManual: (missionId: string, val: number) => void;
  setMissionAlternative: (missionId: string, altId: string) => void;
  setDifficulty: (diff: DifficultyLevel) => void;
  toggleRecoveryDay: () => void;
  claimDailyCompletion: () => void;
  addXp: (amount: number) => void;
  addGold: (amount: number) => void;
  allocateStat: (stat: keyof Omit<StatPoints, 'unassigned'>) => void;
  buyShopItem: (itemId: string) => boolean;
  equipShopItem: (itemId: string) => void;
  claimAchievement: (achievementId: string) => void;
  updateBossProgress: (bossId: string, taskIndex: number, delta: number) => void;
  setPlayerName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  resetGame: () => void;
  importState: (json: string) => boolean;
  systemAlert: SystemAlertInfo | null;
  closeSystemAlert: () => void;
  levelUpModal: LevelUpModalInfo | null;
  closeLevelUpModal: () => void;
  triggerSystemAlert: (alert: Omit<SystemAlertInfo, 'isOpen'>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>(() => loadPlayerState());
  const [systemAlert, setSystemAlert] = useState<SystemAlertInfo | null>(null);
  const [levelUpModal, setLevelUpModal] = useState<LevelUpModalInfo | null>(null);

  // Sync sound settings with sound engine on mount and changes
  useEffect(() => {
    soundEngine.setEnabled(state.soundEnabled);
    soundEngine.setVolume(state.soundVolume);
  }, [state.soundEnabled, state.soundVolume]);

  // Persist state changes
  useEffect(() => {
    savePlayerState(state);
  }, [state]);

  const triggerSystemAlert = useCallback((alert: Omit<SystemAlertInfo, 'isOpen'>) => {
    soundEngine.playSystemAlert();
    setSystemAlert({ ...alert, isOpen: true });
  }, []);

  const closeSystemAlert = useCallback(() => {
    soundEngine.playClick();
    setSystemAlert(null);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    soundEngine.playClick();
    setLevelUpModal(null);
  }, []);

  /**
   * Evaluates achievements condition and triggers unlocks
   */
  const checkAchievements = useCallback((currentState: PlayerState): Achievement[] => {
    let changed = false;
    const updated = currentState.achievements.map((ach) => {
      if (ach.isUnlocked) return ach;
      let count = ach.currentCount;
      let shouldUnlock = false;

      switch (ach.id) {
        case 'first-mission': {
          const completedMissions = currentState.dailyQuest.missions.filter((m) => m.isCompleted).length;
          count = completedMissions > 0 ? 1 : 0;
          shouldUnlock = count >= ach.targetCount;
          break;
        }
        case 'first-level-up': {
          count = currentState.level;
          shouldUnlock = count >= ach.targetCount;
          break;
        }
        case 'streak-3-days':
        case 'streak-7-days':
        case 'streak-30-days': {
          count = currentState.streak;
          shouldUnlock = count >= ach.targetCount;
          break;
        }
        case 'level-10-milestone':
        case 'level-50-milestone':
        case 'legendary-monarch': {
          count = currentState.level;
          shouldUnlock = count >= ach.targetCount;
          break;
        }
        case 'gold-collector': {
          count = currentState.gold;
          shouldUnlock = count >= ach.targetCount;
          break;
        }
        case 'boss-slayer': {
          const defeated = currentState.bossChallenges.filter((b) => b.isDefeated).length;
          count = defeated;
          shouldUnlock = count >= ach.targetCount;
          break;
        }
        case 'century-pushups': {
          const pushupTotal = Object.values(currentState.history).reduce((sum, h) => {
            const p = h.exercises.find((e) => e.name.toLowerCase().includes('push'));
            return sum + (p ? p.completed : 0);
          }, 0) + (currentState.dailyQuest.missions.find((m) => m.exerciseType === 'pushups')?.completed || 0);
          count = pushupTotal;
          shouldUnlock = count >= ach.targetCount;
          break;
        }
        case 'marathon-spirit': {
          const runTotal = Object.values(currentState.history).reduce((sum, h) => {
            const r = h.exercises.find((e) => e.name.toLowerCase().includes('run'));
            return sum + (r ? r.completed : 0);
          }, 0) + (currentState.dailyQuest.missions.find((m) => m.exerciseType === 'running')?.completed || 0);
          count = Math.floor(runTotal);
          shouldUnlock = count >= ach.targetCount;
          break;
        }
      }

      if (shouldUnlock && !ach.isUnlocked) {
        changed = true;
        return {
          ...ach,
          currentCount: count,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }
      return { ...ach, currentCount: count };
    });

    return changed ? updated : currentState.achievements;
  }, []);

  /**
   * Adds XP and handles Level Up progression through 100 levels
   */
  const addXp = useCallback((amount: number) => {
    setState((prev) => {
      let currentXp = prev.currentXp + amount;
      let totalXp = prev.totalXp + amount;
      let level = prev.level;
      let unassignedStats = prev.stats.unassigned;
      let goldEarned = 0;
      let hasLeveledUp = false;
      const oldLevel = level;

      // Handle level up loop (supports multi-level jumps if massive XP awarded)
      while (level < 100 && currentXp >= prev.xpToNextLevel) {
        currentXp -= prev.xpToNextLevel;
        level += 1;
        hasLeveledUp = true;
        const rewardGold = getGoldRewardForLevel(level);
        goldEarned += rewardGold;
        unassignedStats += 3; // +3 stat points per level!
      }

      const newRank = getRankForLevel(level);
      const newEvolution = getEvolutionStageForLevel(level);
      const newXpTarget = getXpRequiredForLevel(level);

      const nextState: PlayerState = {
        ...prev,
        level,
        rank: newRank,
        evolutionStage: newEvolution,
        currentXp: level === 100 ? newXpTarget : currentXp,
        xpToNextLevel: newXpTarget,
        totalXp,
        gold: prev.gold + goldEarned,
        stats: {
          ...prev.stats,
          unassigned: unassignedStats,
        },
      };

      nextState.achievements = checkAchievements(nextState);

      if (hasLeveledUp) {
        soundEngine.playLevelUp();
        // Fire celebration particles
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#38bdf8', '#8b5cf6', '#fbbf24'],
          });
        } catch {
          // fallback if canvas not available
        }

        setLevelUpModal({
          isOpen: true,
          oldLevel,
          newLevel: level,
          newRank,
          goldEarned,
          statsEarned: (level - oldLevel) * 3,
        });
      }

      return nextState;
    });
  }, [checkAchievements]);

  const addGold = useCallback((amount: number) => {
    soundEngine.playCoin();
    setState((prev) => {
      const nextState: PlayerState = {
        ...prev,
        gold: prev.gold + amount,
      };
      nextState.achievements = checkAchievements(nextState);
      return nextState;
    });
  }, [checkAchievements]);

  const startGame = useCallback(() => {
    soundEngine.playSystemAlert();
    setState((prev) => ({
      ...prev,
      hasStarted: true,
    }));
  }, []);

  const updateMissionProgress = useCallback((missionId: string, delta: number) => {
    soundEngine.playClick();
    setState((prev) => {
      let newlyCompletedXp = 0;
      let newlyCompletedGold = 0;

      const updatedMissions = prev.dailyQuest.missions.map((mission) => {
        if (mission.id !== missionId) return mission;

        const isKm = mission.unit === 'km';
        const rawNewVal = isKm ? mission.completed + delta : mission.completed + delta;
        const clampedVal = isKm 
          ? Number(Math.max(0, Math.min(mission.target * 2, rawNewVal)).toFixed(1))
          : Math.max(0, Math.min(mission.target * 2, rawNewVal));

        const newlyCompleted = !mission.isCompleted && clampedVal >= mission.target;

        if (newlyCompleted) {
          soundEngine.playCoin();
          newlyCompletedXp += mission.xpReward;
          newlyCompletedGold += mission.goldReward;
        }

        return {
          ...mission,
          completed: clampedVal,
          isCompleted: clampedVal >= mission.target,
        };
      });

      let nextState: PlayerState = {
        ...prev,
        dailyQuest: {
          ...prev.dailyQuest,
          missions: updatedMissions,
        },
      };

      if (newlyCompletedXp > 0 || newlyCompletedGold > 0) {
        nextState.gold += newlyCompletedGold;
        nextState = {
          ...nextState,
          currentXp: nextState.currentXp + newlyCompletedXp,
          totalXp: nextState.totalXp + newlyCompletedXp,
        };
      }

      nextState.achievements = checkAchievements(nextState);
      return nextState;
    });
  }, [checkAchievements]);

  const setMissionProgressManual = useCallback((missionId: string, val: number) => {
    setState((prev) => {
      const updatedMissions = prev.dailyQuest.missions.map((mission) => {
        if (mission.id !== missionId) return mission;
        const clamped = Math.max(0, val);
        return {
          ...mission,
          completed: clamped,
          isCompleted: clamped >= mission.target,
        };
      });

      const nextState: PlayerState = {
        ...prev,
        dailyQuest: {
          ...prev.dailyQuest,
          missions: updatedMissions,
        },
      };
      nextState.achievements = checkAchievements(nextState);
      return nextState;
    });
  }, [checkAchievements]);

  const setMissionAlternative = useCallback((missionId: string, altId: string) => {
    soundEngine.playClick();
    setState((prev) => ({
      ...prev,
      dailyQuest: {
        ...prev.dailyQuest,
        missions: prev.dailyQuest.missions.map((m) =>
          m.id === missionId ? { ...m, selectedAlternativeId: altId } : m
        ),
      },
    }));
  }, []);

  const setDifficulty = useCallback((diff: DifficultyLevel) => {
    soundEngine.playClick();
    setState((prev) => {
      const refreshedMissions = generateDailyMissions(prev.level, diff, prev.dailyQuest.isRecoveryDay);
      // Retain current completed reps on each exercise
      const mergedMissions = refreshedMissions.map((m) => {
        const existing = prev.dailyQuest.missions.find((old) => old.exerciseType === m.exerciseType);
        const completed = existing ? existing.completed : 0;
        return {
          ...m,
          completed,
          isCompleted: completed >= m.target,
        };
      });

      return {
        ...prev,
        difficulty: diff,
        dailyQuest: {
          ...prev.dailyQuest,
          missions: mergedMissions,
        },
      };
    });
  }, []);

  const toggleRecoveryDay = useCallback(() => {
    soundEngine.playClick();
    setState((prev) => {
      const nextRecovery = !prev.dailyQuest.isRecoveryDay;
      const newMissions = generateDailyMissions(prev.level, prev.difficulty, nextRecovery);

      return {
        ...prev,
        dailyQuest: {
          ...prev.dailyQuest,
          isRecoveryDay: nextRecovery,
          missions: newMissions.map((m) => {
            const existing = prev.dailyQuest.missions.find((old) => old.exerciseType === m.exerciseType);
            const completed = existing ? existing.completed : 0;
            return {
              ...m,
              completed,
              isCompleted: completed >= m.target,
            };
          }),
        },
      };
    });
  }, []);

  /**
   * Final Claim when all daily missions are finished
   */
  const claimDailyCompletion = useCallback(() => {
    if (state.dailyQuest.isAllCompleted) {
      return; // Prevent duplicate daily rewards!
    }

    const allFinished = state.dailyQuest.missions.every((m) => m.isCompleted);
    if (!allFinished) return;

    soundEngine.playQuestComplete();

    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#00f0ff', '#38bdf8', '#fbbf24', '#ffffff'],
      });
    } catch {
      // fallback
    }

    setState((prev) => {
      const today = getTodayDateString();
      const bonusXp = prev.dailyQuest.bonusXp;
      const bonusGold = prev.dailyQuest.bonusGold;
      const newStreak = prev.streak + 1;

      // Archive today in history
      const historyRecord: { [key: string]: typeof prev.history[string] } = {
        ...prev.history,
        [today]: {
          date: today,
          dayLevel: prev.level,
          isRecoveryDay: prev.dailyQuest.isRecoveryDay,
          isCompleted: true,
          totalXpEarned: bonusXp,
          totalGoldEarned: bonusGold,
          exercises: prev.dailyQuest.missions.map((m) => ({
            name: m.exerciseName,
            completed: m.completed,
            target: m.target,
            unit: m.unit,
          })),
        },
      };

      const updatedQuest: DailyQuestStatus = {
        ...prev.dailyQuest,
        isAllCompleted: true,
        claimedAt: new Date().toISOString(),
      };

      let nextState: PlayerState = {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
        dailyQuest: updatedQuest,
        history: historyRecord,
      };

      nextState.achievements = checkAchievements(nextState);
      return nextState;
    });

    // Award the grand bonus XP and Gold
    addXp(state.dailyQuest.bonusXp);
    addGold(state.dailyQuest.bonusGold);

    triggerSystemAlert({
      title: 'SYSTEM MESSAGE',
      subtitle: 'DAILY QUEST CLEARED',
      message: 'ALL DAILY MISSIONS COMPLETED! Physical capacity recalibrated. The System has granted awakening rewards.',
      rewards: {
        xp: state.dailyQuest.bonusXp,
        gold: state.dailyQuest.bonusGold,
      },
      type: 'quest',
    });
  }, [state.dailyQuest, addXp, addGold, checkAchievements, triggerSystemAlert]);

  const allocateStat = useCallback((stat: keyof Omit<StatPoints, 'unassigned'>) => {
    setState((prev) => {
      if (prev.stats.unassigned <= 0) return prev;
      soundEngine.playStatUp();
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: prev.stats[stat] + 1,
          unassigned: prev.stats.unassigned - 1,
        },
      };
    });
  }, []);

  const buyShopItem = useCallback((itemId: string): boolean => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return false;

    if (state.gold < item.price) {
      soundEngine.playClick();
      return false;
    }

    if (state.inventory.includes(itemId)) {
      return true;
    }

    soundEngine.playCoin();
    setState((prev) => {
      const nextInv = [...prev.inventory, itemId];
      const nextEquipped = {
        ...prev.equipped,
        [item.category]: itemId,
      };
      return {
        ...prev,
        gold: prev.gold - item.price,
        inventory: nextInv,
        equipped: nextEquipped,
      };
    });
    return true;
  }, [state.gold, state.inventory]);

  const equipShopItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return;

    soundEngine.playClick();
    setState((prev) => {
      const currentEquipped = prev.equipped[item.category];
      const isEquipping = currentEquipped !== itemId;

      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [item.category]: isEquipping ? itemId : undefined,
        },
      };
    });
  }, []);

  const claimAchievement = useCallback((achievementId: string) => {
    soundEngine.playCoin();
    setState((prev) => {
      let rewardXp = 0;
      let rewardGold = 0;

      const updated = prev.achievements.map((ach) => {
        if (ach.id !== achievementId || !ach.isUnlocked || ach.isClaimed) return ach;
        rewardXp = ach.xpReward;
        rewardGold = ach.goldReward;
        return {
          ...ach,
          isClaimed: true,
        };
      });

      return {
        ...prev,
        achievements: updated,
      };
    });

    const ach = state.achievements.find((a) => a.id === achievementId);
    if (ach) {
      addXp(ach.xpReward);
      addGold(ach.goldReward);
    }
  }, [state.achievements, addXp, addGold]);

  const updateBossProgress = useCallback((bossId: string, taskIndex: number, delta: number) => {
    soundEngine.playBossAttack();
    setState((prev) => {
      let bossDefeatedNow = false;
      let xpToAward = 0;
      let goldToAward = 0;

      const updatedBosses = prev.bossChallenges.map((boss) => {
        if (boss.id !== bossId || boss.isDefeated) return boss;

        const task = boss.workoutTasks[taskIndex];
        if (!task) return boss;

        const newCompleted = Math.max(0, Math.min(task.target * 2, task.completed + delta));
        const diff = newCompleted - task.completed;
        const damage = Math.round(diff * task.damagePerUnit);

        const newHp = Math.max(0, boss.currentHp - damage);
        const defeated = newHp <= 0;

        const updatedTasks = boss.workoutTasks.map((t, idx) =>
          idx === taskIndex ? { ...t, completed: newCompleted } : t
        );

        if (defeated && !boss.isDefeated) {
          bossDefeatedNow = true;
          xpToAward = boss.xpReward;
          goldToAward = boss.goldReward;
        }

        return {
          ...boss,
          currentHp: newHp,
          workoutTasks: updatedTasks,
          isDefeated: defeated,
          defeatedAt: defeated ? new Date().toISOString() : undefined,
        };
      });

      let nextState: PlayerState = {
        ...prev,
        bossChallenges: updatedBosses,
      };

      if (bossDefeatedNow) {
        soundEngine.playLevelUp();
        try {
          confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: ['#ef4444', '#dc2626', '#fbbf24', '#00f0ff'],
          });
        } catch {
          // fallback
        }
      }

      nextState.achievements = checkAchievements(nextState);
      return nextState;
    });
  }, [checkAchievements]);

  const setPlayerName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      name: name.trim() || 'Sung Jin-Woo',
    }));
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      soundEnabled: enabled,
    }));
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    setState((prev) => ({
      ...prev,
      soundVolume: volume,
    }));
  }, []);

  const resetGame = useCallback(() => {
    soundEngine.playClick();
    const fresh = createInitialPlayerState();
    setState(fresh);
    savePlayerState(fresh);
  }, []);

  const importState = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as PlayerState;
      if (parsed && typeof parsed.level === 'number') {
        setState(parsed);
        savePlayerState(parsed);
        return true;
      }
    } catch {
      // invalid json
    }
    return false;
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        updateMissionProgress,
        setMissionProgressManual,
        setMissionAlternative,
        setDifficulty,
        toggleRecoveryDay,
        claimDailyCompletion,
        addXp,
        addGold,
        allocateStat,
        buyShopItem,
        equipShopItem,
        claimAchievement,
        updateBossProgress,
        setPlayerName,
        setSoundEnabled,
        setSoundVolume,
        resetGame,
        importState,
        systemAlert,
        closeSystemAlert,
        levelUpModal,
        closeLevelUpModal,
        triggerSystemAlert,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
