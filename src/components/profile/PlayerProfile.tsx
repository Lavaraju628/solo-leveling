import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Zap,
  Coins,
  Flame,
  Plus,
  Edit2,
  Check,
  Award,
  Sparkles,
  Layers,
  Heart,
  Eye,
  Brain,
  Activity
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CharacterEvolution } from '../character/CharacterEvolution';
import { getRankColor, getRankBadgeTitle } from '../../data/levels';
import { StatPoints } from '../../types/game';
import { soundEngine } from '../../services/sound';

export const PlayerProfile: React.FC = () => {
  const { state, allocateStat, setPlayerName } = useGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);

  const rankTheme = getRankColor(state.rank);
  const rankTitle = getRankBadgeTitle(state.rank);

  const handleSaveName = () => {
    soundEngine.playClick();
    setPlayerName(nameInput);
    setIsEditingName(false);
  };

  const statConfig: {
    key: keyof Omit<StatPoints, 'unassigned'>;
    label: string;
    icon: typeof Zap;
    color: string;
    description: string;
  }[] = [
    {
      key: 'strength',
      label: 'STRENGTH (STR)',
      icon: Activity,
      color: 'text-red-400',
      description: 'Increases push-up power and explosive muscular force.',
    },
    {
      key: 'agility',
      label: 'AGILITY (AGI)',
      icon: Zap,
      color: 'text-cyan-400',
      description: 'Enhances running velocity, cadence, and sprint efficiency.',
    },
    {
      key: 'vitality',
      label: 'VITALITY (VIT)',
      icon: Heart,
      color: 'text-emerald-400',
      description: 'Accelerates muscular recovery, stamina endurance, and joint health.',
    },
    {
      key: 'intelligence',
      label: 'INTELLIGENCE (INT)',
      icon: Brain,
      color: 'text-indigo-400',
      description: 'Sharpened focus, discipline adherence, and mental resilience.',
    },
    {
      key: 'perception',
      label: 'PERCEPTION (PER)',
      icon: Eye,
      color: 'text-purple-400',
      description: 'Kinesthetic body awareness, balance, and posture precision.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>[ OFFICIAL HUNTER ASSOCIATION DOSSIER ]</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
          HUNTER STATUS & ATTRIBUTES
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Character Hologram & Rank Designation */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full p-6 rounded-2xl bg-gradient-to-b from-[#07132e] via-[#040817] to-[#02050e] border border-cyan-500/40 shadow-glow-blue flex flex-col items-center text-center">
            {/* Rank Designation Plaque */}
            <div className={`w-full py-2 px-4 rounded-xl border ${rankTheme.border} ${rankTheme.bg} mb-6 flex items-center justify-between`}>
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  HUNTER RANK
                </span>
                <span className={`text-xl font-orbitron font-black ${rankTheme.text}`}>
                  {state.rank}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  AWAKENING LEVEL
                </span>
                <span className="text-xl font-orbitron font-black text-cyan-300">
                  LVL {state.level}
                </span>
              </div>
            </div>

            {/* Character Evolution Model */}
            <CharacterEvolution size="lg" showDetails={true} />

            {/* Hunter Title */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 w-full">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                ACTIVE TITLE
              </span>
              <div className="text-lg font-cinzel font-bold text-slate-200">
                "{rankTitle}"
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Player Identity, XP, and Stat Allocator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity & Core Metrics */}
          <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              {/* Editable Hunter Name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    REGISTERED HUNTER
                  </span>
                  {isEditingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="px-3 py-1 rounded bg-slate-900 border border-cyan-400 text-white font-orbitron font-bold text-base focus:outline-none"
                        maxLength={24}
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-1.5 rounded bg-cyan-500 text-black hover:bg-cyan-400"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-orbitron font-extrabold text-white">
                        {state.name}
                      </span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 text-slate-500 hover:text-cyan-400 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gold & Streak Chips */}
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-[9px] font-mono text-amber-400 block leading-tight">GOLD</span>
                    <span className="text-sm font-orbitron font-bold text-amber-300">
                      {state.gold.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="px-3.5 py-2 rounded-xl bg-orange-950/40 border border-orange-500/40 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <div>
                    <span className="text-[9px] font-mono text-orange-400 block leading-tight">STREAK</span>
                    <span className="text-sm font-orbitron font-bold text-orange-300">
                      {state.streak} DAYS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total XP Bar */}
            <div className="pt-4">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-semibold uppercase">
                  CURRENT LEVEL RESONANCE
                </span>
                <span className="text-slate-300">
                  {state.currentXp} / {state.xpToNextLevel} XP ({Math.min(100, Math.round((state.currentXp / Math.max(1, state.xpToNextLevel)) * 100))}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 border border-cyan-500/30 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-glow-blue transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((state.currentXp / Math.max(1, state.xpToNextLevel)) * 100))}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                <span>LIFETIME XP ACCUMULATED: {state.totalXp.toLocaleString()} XP</span>
                <span>LEVEL 100 CAP: 18,000 XP</span>
              </div>
            </div>
          </div>

          {/* RPG Attribute Stat Points Allocation */}
          <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-orbitron font-bold text-lg text-white">
                  PHYSICAL & MANA ATTRIBUTES
                </h3>
                <p className="text-xs text-slate-400">
                  Leveling up grants +3 unassigned stat points to permanently strengthen your attributes.
                </p>
              </div>

              {/* Unassigned Stat Point Counter */}
              <div className="px-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-400/80 flex items-center gap-2 shadow-glow-purple">
                <Zap className="w-4 h-4 text-indigo-300 animate-pulse" />
                <div>
                  <span className="text-[9px] font-mono text-indigo-300 block leading-tight">UNASSIGNED</span>
                  <span className="text-base font-orbitron font-extrabold text-white">
                    {state.stats.unassigned} PTS
                  </span>
                </div>
              </div>
            </div>

            {/* Stat Rows */}
            <div className="divide-y divide-slate-800/80 mt-2">
              {statConfig.map((item) => {
                const Icon = item.icon;
                const value = state.stats[item.key];
                return (
                  <div key={item.key} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-orbitron font-bold text-sm text-white">
                            {item.label}
                          </span>
                          <span className="text-base font-orbitron font-black text-cyan-300">
                            {value}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block">{item.description}</span>
                      </div>
                    </div>

                    {/* Allocate Button */}
                    <button
                      onClick={() => allocateStat(item.key)}
                      disabled={state.stats.unassigned <= 0}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-glow-purple transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ALLOCATE</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
