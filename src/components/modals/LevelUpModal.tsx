import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getRankColor, getRankBadgeTitle } from '../../data/levels';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal } = useGame();

  if (!levelUpModal || !levelUpModal.isOpen) return null;

  const rankTheme = getRankColor(levelUpModal.newRank);
  const rankTitle = getRankBadgeTitle(levelUpModal.newRank);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md p-6 bg-gradient-to-b from-[#091530] via-[#050b1a] to-[#02050e] border-2 border-cyan-400 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.7)] text-slate-100 font-rajdhani"
        >
          {/* Glowing particle burst backdrop */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Sci-fi corners */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />

          {/* System Alert Header */}
          <div className="text-center">
            <span className="inline-block px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-xs font-mono tracking-widest uppercase">
              [ SYSTEM ALERT! ]
            </span>
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.9, 1.1, 1] }}
              transition={{ duration: 0.4 }}
              className="text-4xl md:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 tracking-wider mt-2 drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
            >
              LEVEL UP!
            </motion.h1>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-300 mt-1">
              NEW LEVEL UNLOCKED • YOUR POWER HAS INCREASED
            </p>
          </div>

          {/* Level Transition Badge */}
          <div className="my-6 p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex items-center justify-around relative">
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-mono">FROM</span>
              <span className="text-2xl font-orbitron font-bold text-slate-400">
                LVL {levelUpModal.oldLevel}
              </span>
            </div>

            <div className="flex items-center text-cyan-400 animate-pulse">
              <ArrowUpRight className="w-8 h-8" />
            </div>

            <div className="text-center">
              <span className="text-xs text-cyan-400 block font-mono">ASCENDED TO</span>
              <span className="text-3xl font-orbitron font-black text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.9)]">
                LVL {levelUpModal.newLevel}
              </span>
            </div>
          </div>

          {/* Current Rank Display */}
          <div className={`p-3 rounded-lg border ${rankTheme.border} ${rankTheme.bg} text-center mb-5`}>
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-300 block">
              HUNTER RANK DESIGNATION
            </span>
            <div className={`text-xl font-orbitron font-black ${rankTheme.text} mt-0.5`}>
              {levelUpModal.newRank}
            </div>
            <div className="text-xs text-slate-300 italic">{rankTitle}</div>
          </div>

          {/* Rewards Acquired */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between p-2.5 rounded bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-slate-200">Gold Coins Awarded</span>
              </div>
              <span className="text-base font-orbitron font-bold text-amber-300">
                +{levelUpModal.goldEarned}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-indigo-950/20 border border-indigo-500/30">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-medium text-slate-200">Attribute Points Gained</span>
              </div>
              <span className="text-base font-orbitron font-bold text-indigo-300">
                +{levelUpModal.statsEarned} STATS
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={closeLevelUpModal}
            className="w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-orbitron font-bold text-sm tracking-wider uppercase shadow-glow-blue-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            CLAIM HUNTER ASCENSION
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
