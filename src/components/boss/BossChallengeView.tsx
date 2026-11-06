import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Shield,
  Zap,
  Coins,
  Award,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Skull,
  Flame,
  Plus,
  Minus
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BossChallenge } from '../../types/game';
import { soundEngine } from '../../services/sound';

export const BossChallengeView: React.FC = () => {
  const { state, updateBossProgress } = useGame();
  const [selectedBossId, setSelectedBossId] = useState<string>(
    state.bossChallenges[0]?.id || 'boss-level-10'
  );

  const selectedBoss =
    state.bossChallenges.find((b) => b.id === selectedBossId) ||
    state.bossChallenges[0];

  const isUnlocked = state.level >= selectedBoss.levelRequired;
  const hpPercent = Math.max(
    0,
    Math.round((selectedBoss.currentHp / Math.max(1, selectedBoss.maxHp)) * 100)
  );

  const handleAdjustProgress = (taskIndex: number, delta: number) => {
    updateBossProgress(selectedBoss.id, taskIndex, delta);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono tracking-widest uppercase">
          <Skull className="w-3.5 h-3.5 text-red-400" />
          <span>[ DUNGEON GATE ANOMALY // MILESTONE BOSS RAIDS ]</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
          DUNGEON GATE BOSS TRIALS
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Conquer high-rank dimensional gate bosses through physical conditioning trials. 
          Each repetition strikes the monster's core.
        </p>
      </div>

      {/* Boss Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {state.bossChallenges.map((boss) => {
          const unlocked = state.level >= boss.levelRequired;
          const isSelected = boss.id === selectedBossId;

          return (
            <button
              key={boss.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedBossId(boss.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-b from-red-950/80 to-[#100609] border-red-500 shadow-glow-red'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  LVL {boss.levelRequired} GATE
                </span>
                {boss.isDefeated ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : !unlocked ? (
                  <Lock className="w-3 h-3 text-slate-600" />
                ) : (
                  <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                )}
              </div>
              <div className="font-orbitron font-bold text-xs text-white mt-1 truncate">
                {boss.bossName}
              </div>
              <span
                className={`text-[9px] font-mono block mt-1 ${
                  boss.isDefeated
                    ? 'text-emerald-400'
                    : unlocked
                    ? 'text-red-400'
                    : 'text-slate-600'
                }`}
              >
                {boss.isDefeated ? 'SUBJUGATED' : unlocked ? 'AVAILABLE' : 'LOCKED'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Boss Fight Arena */}
      <div className="p-6 rounded-2xl bg-[#090b14] border-2 border-red-900/60 shadow-2xl relative overflow-hidden">
        {/* Background Demonic Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Boss Information & HP Bar */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest">
                {selectedBoss.subtitle} (REQ. LEVEL {selectedBoss.levelRequired})
              </span>
              <h2 className="text-3xl font-orbitron font-black text-white">
                {selectedBoss.bossName}
              </h2>
              <p className="text-xs text-slate-400 italic">{selectedBoss.lore}</p>
            </div>

            {/* Boss Health Bar */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-red-500/30">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-red-400 font-bold uppercase flex items-center gap-1.5">
                  <Skull className="w-4 h-4 text-red-500" />
                  BOSS HIT POINTS (HP)
                </span>
                <span className="text-white font-orbitron font-bold">
                  {selectedBoss.currentHp} / {selectedBoss.maxHp} HP ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-5 rounded-full bg-slate-900 border border-red-500/40 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hpPercent}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-glow-red"
                />
              </div>

              {selectedBoss.isDefeated && (
                <div className="mt-3 p-2.5 rounded bg-emerald-950/70 border border-emerald-400 text-emerald-300 font-orbitron font-bold text-xs text-center">
                  GATE DEFEATED! MONSTER SUBJUGATED BY HUNTER.
                </div>
              )}
            </div>

            {/* Rewards Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                VICTORY SPOILS
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">+{selectedBoss.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Coins className="w-4 h-4" />
                  <span className="text-sm font-bold">+{selectedBoss.goldReward} GOLD</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-300">
                  <Award className="w-4 h-4" />
                  <span>TITLE: {selectedBoss.badgeReward}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combat Actions: Workout Reps Damage */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-orbitron font-bold text-base text-white flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-400" />
              <span>STRIKE PROTOCOLS (EXERCISE TO INFLICT DAMAGE)</span>
            </h3>

            {!isUnlocked ? (
              <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800 text-center space-y-3">
                <Lock className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="font-orbitron font-bold text-sm text-slate-400">
                  DIMENSIONAL GATE SEALED
                </h4>
                <p className="text-xs text-slate-500">
                  You must reach <span className="text-cyan-400 font-bold">Level {selectedBoss.levelRequired}</span> to access this gate.
                  Continue your daily missions to raise your rank!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedBoss.workoutTasks.map((task, idx) => {
                  const taskPercent = Math.min(
                    100,
                    Math.round((task.completed / Math.max(1, task.target)) * 100)
                  );
                  const isTaskDone = task.completed >= task.target;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-200">{task.exercise}</span>
                        <span className="font-mono text-red-400">
                          {task.completed} / {task.target}
                        </span>
                      </div>

                      {/* Small progress bar */}
                      <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-amber-500"
                          style={{ width: `${taskPercent}%` }}
                        />
                      </div>

                      {/* Rep Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] font-mono text-slate-500">
                          Deals {task.damagePerUnit} DMG / unit
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAdjustProgress(idx, -1)}
                            disabled={task.completed <= 0 || selectedBoss.isDefeated}
                            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-slate-300"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAdjustProgress(idx, 1)}
                            disabled={selectedBoss.isDefeated}
                            className="px-3 py-1.5 rounded bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-glow-red"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>INFLICT STRIKE (+1)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
