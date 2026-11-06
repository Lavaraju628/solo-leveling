import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Shield,
  Zap,
  Coins,
  Lock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ALL_100_LEVELS, getRankColor, getRankBadgeTitle } from '../../data/levels';
import { RankType } from '../../types/game';
import { soundEngine } from '../../services/sound';

export const LevelProgression: React.FC = () => {
  const { state } = useGame();
  const currentLvl = state.level;
  const [selectedRankFilter, setSelectedRankFilter] = useState<string>('ALL');

  const rankList: { rank: RankType; range: string }[] = [
    { rank: 'E-RANK', range: 'Lv 1-10' },
    { rank: 'D-RANK', range: 'Lv 11-20' },
    { rank: 'C-RANK', range: 'Lv 21-30' },
    { rank: 'B-RANK', range: 'Lv 31-40' },
    { rank: 'A-RANK', range: 'Lv 41-50' },
    { rank: 'S-RANK', range: 'Lv 51-70' },
    { rank: 'NATIONAL LEVEL', range: 'Lv 71-90' },
    { rank: 'SHADOW MONARCH', range: 'Lv 91-99' },
    { rank: 'LEGENDARY MONARCH', range: 'Lv 100' },
  ];

  const filteredLevels =
    selectedRankFilter === 'ALL'
      ? ALL_100_LEVELS
      : ALL_100_LEVELS.filter((l) => l.rank === selectedRankFilter);

  const handleFilterClick = (filter: string) => {
    soundEngine.playClick();
    setSelectedRankFilter(filter);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>[ COMPLETE 100 LEVEL SYSTEM ROADMAP ]</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
            ROAD TO LEGENDARY MONARCH
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Every workout level increases resonance. Ascend from E-Rank to the sovereign throne of Level 100.
          </p>
        </div>

        {/* Current Level Status Chip */}
        <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/50 shadow-glow-blue flex items-center gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              CURRENT PROGRESSION
            </span>
            <span className="text-2xl font-orbitron font-black text-cyan-300">
              LEVEL {currentLvl} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </span>
          </div>
          <div className="h-10 w-[1px] bg-cyan-500/30" />
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              STATUS
            </span>
            <span className="text-sm font-orbitron font-bold text-amber-300">
              {state.rank}
            </span>
          </div>
        </div>
      </div>

      {/* Rank Filters Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => handleFilterClick('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase whitespace-nowrap transition-colors ${
            selectedRankFilter === 'ALL'
              ? 'bg-cyan-500 text-black shadow-glow-blue'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          ALL (100 LEVELS)
        </button>

        {rankList.map((item) => (
          <button
            key={item.rank}
            onClick={() => handleFilterClick(item.rank)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase whitespace-nowrap transition-colors ${
              selectedRankFilter === item.rank
                ? 'bg-cyan-500 text-black shadow-glow-blue'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {item.rank} ({item.range})
          </button>
        ))}
      </div>

      {/* 100 Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredLevels.map((lvl) => {
          const isCurrent = lvl.level === currentLvl;
          const isPassed = lvl.level < currentLvl;
          const isLocked = lvl.level > currentLvl;
          const rankTheme = getRankColor(lvl.rank);
          const rankTitle = getRankBadgeTitle(lvl.rank);

          return (
            <motion.div
              key={lvl.level}
              whileHover={{ scale: 1.02 }}
              className={`relative p-5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-gradient-to-b from-[#0b2144] to-[#040c1e] border-cyan-300 shadow-glow-blue-lg ring-2 ring-cyan-400/50'
                  : isPassed
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/80 border-slate-900 opacity-75'
              }`}
            >
              {/* Level Number & Rank Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-2xl font-orbitron font-black text-white">
                    LVL {lvl.level}
                  </span>
                  <div className={`text-xs font-orbitron font-bold ${rankTheme.text}`}>
                    {lvl.rank}
                  </div>
                </div>

                {/* Status Indicator */}
                <div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black font-mono font-bold text-[10px] uppercase shadow-glow-blue animate-pulse">
                      ACTIVE
                    </span>
                  )}
                  {isPassed && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASSED</span>
                    </div>
                  )}
                  {isLocked && (
                    <div className="flex items-center gap-1 text-slate-600 text-xs font-mono">
                      <Lock className="w-3.5 h-3.5" />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>
              </div>

              {/* XP Requirement & Gold Reward */}
              <div className="my-3 py-2 border-y border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1 text-cyan-300">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lvl.xpRequired} XP</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>+{lvl.goldReward} G</span>
                </div>
              </div>

              {/* Milestone Feature Unlocked */}
              {lvl.unlockedFeature ? (
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-[11px] text-cyan-300 font-medium">
                  <div className="flex items-center gap-1 text-cyan-400 font-bold mb-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>MILESTONE UNLOCK:</span>
                  </div>
                  {lvl.unlockedFeature}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  +3 Stat Points upon reaching this tier.
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
