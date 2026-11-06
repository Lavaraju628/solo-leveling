import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Coins,
  Flame,
  Dumbbell,
  Swords,
  ShoppingBag,
  Award,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Layers,
  HeartPulse
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CharacterEvolution } from '../character/CharacterEvolution';
import { getRankColor, getRankBadgeTitle } from '../../data/levels';
import { ActiveTab } from '../layout/Navbar';
import { soundEngine } from '../../services/sound';

interface GameDashboardProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ onNavigate }) => {
  const { state } = useGame();
  const { level, rank, currentXp, xpToNextLevel, gold, streak, dailyQuest, stats } = state;

  const rankTheme = getRankColor(rank);
  const rankTitle = getRankBadgeTitle(rank);

  const completedMissions = dailyQuest.missions.filter((m) => m.isCompleted).length;
  const xpPercent = Math.min(100, Math.round((currentXp / Math.max(1, xpToNextLevel)) * 100));

  const handleNav = (tab: ActiveTab) => {
    soundEngine.playClick();
    onNavigate(tab);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Top Holographic System Alert Announcement */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-5 rounded-2xl bg-gradient-to-r from-[#07132e] via-[#050b18] to-[#040813] border border-cyan-500/40 shadow-glow-blue mb-8 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-glow-blue">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/50 text-cyan-300 uppercase tracking-widest">
                  [ ACTIVE SYSTEM PROMPT ]
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  CYCLE: {dailyQuest.date}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-orbitron font-extrabold text-white mt-1">
                "THE SYSTEM CHOSE YOU. WILL YOU REMAIN AT THE BOTTOM, OR ASCEND TO THE SOVEREIGN THRONE?"
              </h2>
            </div>
          </div>

          <button
            onClick={() => handleNav('missions')}
            className="self-start md:self-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-blue flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <span>LAUNCH DAILY QUEST</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Main Grid: Status Cards & Character Hologram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Hunter Status Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg relative overflow-hidden">
            {/* Header: Player Name & Hunter License */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                  HUNTER LICENSE DESIGNATION
                </span>
                <h1 className="text-3xl font-orbitron font-black text-white">
                  {state.name}
                </h1>
                <p className="text-xs text-cyan-400 italic mt-0.5">
                  "{rankTitle}"
                </p>
              </div>

              {/* Rank Badge */}
              <div className={`px-4 py-2 rounded-xl border ${rankTheme.border} ${rankTheme.bg} text-right`}>
                <span className="text-[10px] font-mono uppercase text-slate-300 block">
                  OFFICIAL RANK
                </span>
                <span className={`text-2xl font-orbitron font-black ${rankTheme.text}`}>
                  {rank}
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">LEVEL</span>
                <span className="text-2xl font-orbitron font-bold text-cyan-300">
                  {level} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">TOTAL GOLD</span>
                <span className="text-2xl font-orbitron font-bold text-amber-300 flex items-center gap-1">
                  <Coins className="w-5 h-5 text-amber-400 inline" />
                  {gold}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">DAILY STREAK</span>
                <span className="text-2xl font-orbitron font-bold text-orange-400 flex items-center gap-1">
                  <Flame className="w-5 h-5 text-orange-400 inline" />
                  {streak} <span className="text-xs text-slate-500 font-normal">DAYS</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">QUESTS TODAY</span>
                <span className="text-2xl font-orbitron font-bold text-emerald-400">
                  {completedMissions} <span className="text-xs text-slate-500 font-normal">/ 4</span>
                </span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-bold uppercase">
                  PROGRESS TO LEVEL {Math.min(100, level + 1)}
                </span>
                <span className="text-slate-300">
                  {currentXp} / {xpToNextLevel} XP ({xpPercent}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 border border-cyan-500/30 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-glow-blue transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily Missions Quick Preview Bar */}
          <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-base text-white">
                  TODAY'S WORKOUT TARGETS
                </h3>
              </div>
              <button
                onClick={() => handleNav('missions')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>OPEN TRACKER</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {dailyQuest.missions.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleNav('missions')}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    m.isCompleted
                      ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 block uppercase truncate">
                    {m.exerciseName}
                  </span>
                  <div className="text-lg font-orbitron font-bold mt-0.5">
                    {m.completed} / {m.target} {m.unit}
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold block mt-1 ${
                      m.isCompleted ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {m.isCompleted ? '✓ CLEARED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Character Hologram Card */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                WARRIOR AVATAR
              </span>
              <button
                onClick={() => handleNav('profile')}
                className="text-xs text-slate-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>DETAILS</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <CharacterEvolution size="md" showDetails={false} />

            {/* Quick Stat Allocation Notice if points exist */}
            {stats.unassigned > 0 && (
              <button
                onClick={() => handleNav('profile')}
                className="mt-4 w-full py-2.5 px-3 rounded-lg bg-indigo-950 border border-indigo-400/80 text-indigo-300 font-orbitron font-bold text-xs uppercase tracking-wider animate-pulse flex items-center justify-center gap-1.5 shadow-glow-purple"
              >
                <Zap className="w-4 h-4" />
                <span>{stats.unassigned} STAT POINTS READY TO ASSIGN!</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launchpad Navigation Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => handleNav('levels')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-slate-900 shadow-md group"
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white">100 LEVEL ROADMAP</h4>
          <p className="text-xs text-slate-400 mt-1">Review rank requirements, milestones, and sovereign titles.</p>
        </div>

        <div
          onClick={() => handleNav('bosses')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-red-500/50 cursor-pointer transition-all hover:bg-slate-900 shadow-md group"
        >
          <div className="flex items-center justify-between text-red-400 mb-2">
            <Swords className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white">GATE BOSS CHALLENGES</h4>
          <p className="text-xs text-slate-400 mt-1">Defeat Kasaka, Cerberus, and Beru with physical strength.</p>
        </div>

        <div
          onClick={() => handleNav('shop')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:bg-slate-900 shadow-md group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white">HUNTER ARMORY SHOP</h4>
          <p className="text-xs text-slate-400 mt-1">Equip new armor, outfits, hairstyles, and glowing auras.</p>
        </div>

        <div
          onClick={() => handleNav('calendar')}
          className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:bg-slate-900 shadow-md group"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <HeartPulse className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </div>
          <h4 className="font-orbitron font-bold text-sm text-white">WORKOUT HISTORY & LOG</h4>
          <p className="text-xs text-slate-400 mt-1">Check past workout records, streak logs, and XP analytics.</p>
        </div>
      </div>
    </div>
  );
};
