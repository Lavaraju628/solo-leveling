import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Zap,
  Coins,
  CheckCircle2,
  Lock,
  Flame,
  Dumbbell,
  Crown,
  Sparkles,
  TrendingUp,
  Activity,
  Footprints,
  ShieldAlert,
  Swords
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Achievement } from '../../types/game';
import { soundEngine } from '../../services/sound';

export const AchievementsView: React.FC = () => {
  const { state, claimAchievement } = useGame();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Badges' },
    { id: 'workout', label: 'Workout Milestones' },
    { id: 'level', label: 'Rank Ascensions' },
    { id: 'streak', label: 'Hunter Streaks' },
    { id: 'wealth', label: 'Gold Hoards' },
    { id: 'boss', label: 'Gate Raids' },
  ];

  const filteredAchievements =
    selectedFilter === 'all'
      ? state.achievements
      : state.achievements.filter((a) => a.category === selectedFilter);

  const unlockedCount = state.achievements.filter((a) => a.isUnlocked).length;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Dumbbell': return Dumbbell;
      case 'Crown': return Crown;
      case 'Sparkles': return Sparkles;
      case 'TrendingUp': return TrendingUp;
      case 'Activity': return Activity;
      case 'Footprints': return Footprints;
      case 'ShieldAlert': return ShieldAlert;
      case 'Swords': return Swords;
      default: return Award;
    }
  };

  const handleClaim = (ach: Achievement) => {
    claimAchievement(ach.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-mono tracking-widest uppercase">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>[ SYSTEM FEATS & TROPHIES ]</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
            HUNTER ACHIEVEMENTS & MEDALS
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Break through barriers to unlock prestige badges, XP infusions, and gold rewards.
          </p>
        </div>

        {/* Total Badges Counter */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 shadow-glow-purple flex items-center gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              ACHIEVEMENTS UNLOCKED
            </span>
            <span className="text-2xl font-orbitron font-black text-purple-300">
              {unlockedCount} / {state.achievements.length}
            </span>
          </div>
          <div className="h-10 w-[1px] bg-purple-500/30" />
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              RESONANCE RATE
            </span>
            <span className="text-lg font-orbitron font-bold text-cyan-300">
              {Math.round((unlockedCount / state.achievements.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              soundEngine.playClick();
              setSelectedFilter(c.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase whitespace-nowrap transition-colors ${
              selectedFilter === c.id
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const Icon = getBadgeIcon(ach.badgeIcon);
          const percent = Math.min(
            100,
            Math.round((ach.currentCount / Math.max(1, ach.targetCount)) * 100)
          );

          return (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.01 }}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                ach.isUnlocked
                  ? 'bg-gradient-to-b from-[#130d24] to-[#070512] border-purple-500 shadow-glow-purple'
                  : 'bg-slate-950/70 border-slate-900 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      ach.isUnlocked
                        ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-glow-purple'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    {ach.isClaimed ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-mono uppercase font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>CLAIMED</span>
                      </span>
                    ) : ach.isUnlocked ? (
                      <button
                        onClick={() => handleClaim(ach)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-orbitron font-bold text-xs uppercase shadow-glow-gold animate-bounce transition-all"
                      >
                        CLAIM SPOILS
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-mono uppercase flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-orbitron font-bold text-base text-white">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Progress & Rewards */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">PROGRESS</span>
                  <span className="text-purple-300 font-bold">
                    {ach.currentCount} / {ach.targetCount} ({percent}%)
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden mb-3">
                  <div
                    className={`h-full ${
                      ach.isUnlocked
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
                  <div className="flex items-center gap-1 text-cyan-300">
                    <Zap className="w-3.5 h-3.5" />
                    <span>+{ach.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-300">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{ach.goldReward} GOLD</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

