import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Shield, Zap, Flame, Award, ChevronRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CharacterEvolution } from '../character/CharacterEvolution';
import { soundEngine } from '../../services/sound';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const { state, startGame } = useGame();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartGame = () => {
    soundEngine.playLevelUp();
    setIsStarting(true);
    setTimeout(() => {
      startGame();
      onStart();
    }, 700);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none">
      {/* Dark fantasy aura rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/10 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center"
      >
        {/* Holographic System Notification Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#06122c]/90 border border-cyan-400/50 shadow-glow-blue text-cyan-300 text-xs sm:text-sm font-mono tracking-widest uppercase mb-4"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>[ SYSTEM DIRECTIVE DETECTED ]</span>
        </motion.div>

        {/* Main Title: SOLO LEVELING */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl sm:text-7xl md:text-8xl font-orbitron font-black tracking-tight uppercase"
        >
          <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
            SOLO
          </span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_35px_rgba(0,240,255,0.8)]">
            LEVELING
          </span>
        </motion.h1>

        {/* Subtitle: REAL LIFE SYSTEM */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-orbitron font-bold tracking-[0.35em] text-cyan-400 mt-2 uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
        >
          REAL LIFE SYSTEM
        </motion.h2>

        <p className="max-w-2xl text-slate-300 text-sm sm:text-base font-rajdhani font-medium mt-4 mb-8 leading-relaxed">
          Break through human limitations. Complete calibrated daily fitness missions to earn XP, gold coins, 
          ascend 100 levels from <span className="text-zinc-300 font-bold">E-Rank</span> to the legendary{' '}
          <span className="text-cyan-300 font-bold">Shadow Monarch</span>, and forge your transcendent physique.
        </p>

        {/* Center Character Hologram Stage */}
        <div className="relative my-4">
          <CharacterEvolution size="md" showDetails={false} />

          {/* Floating System HUD Stats */}
          <div className="absolute -left-6 top-10 hidden sm:flex flex-col items-start gap-1 p-3 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-left font-mono text-xs backdrop-blur-sm shadow-holo">
            <span className="text-slate-400 text-[10px]">CURRENT RANK</span>
            <span className="text-cyan-300 font-orbitron font-bold text-sm">
              {state.rank}
            </span>
            <span className="text-[10px] text-slate-500">LEVEL 1 / 100</span>
          </div>

          <div className="absolute -right-6 bottom-16 hidden sm:flex flex-col items-end gap-1 p-3 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-right font-mono text-xs backdrop-blur-sm shadow-holo">
            <span className="text-slate-400 text-[10px]">RESONANCE</span>
            <span className="text-amber-300 font-orbitron font-bold text-sm">
              0% UNLOCKED
            </span>
            <span className="text-[10px] text-emerald-400">DAILY QUEST READY</span>
          </div>
        </div>

        {/* Cinematic Start Game Action Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6"
        >
          <button
            onClick={handleStartGame}
            disabled={isStarting}
            className={`relative group px-10 py-5 rounded-xl font-orbitron font-black text-lg sm:text-xl tracking-widest uppercase transition-all duration-300 ${
              isStarting
                ? 'bg-cyan-400 text-black shadow-glow-blue-lg'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-glow-blue hover:shadow-glow-blue-lg hover:from-cyan-400 hover:to-indigo-500'
            }`}
          >
            {/* Inner Border Glow */}
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-300/80 pointer-events-none group-hover:border-white transition-colors" />

            <div className="flex items-center gap-3">
              <Play className="w-6 h-6 fill-current text-cyan-200 group-hover:text-white" />
              <span>{isStarting ? 'INITIALIZING AWAKENING...' : 'START GAME'}</span>
              <ChevronRight className="w-6 h-6 text-cyan-300 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Ambient scan shimmer */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl pointer-events-none" />
          </button>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mt-12 text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <Zap className="w-5 h-5 text-cyan-400 mb-1.5" />
            <h4 className="text-xs font-orbitron font-bold text-white uppercase">100 Game Levels</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Climb through 9 hunter rank tiers to Legendary Monarch.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <Flame className="w-5 h-5 text-amber-400 mb-1.5" />
            <h4 className="text-xs font-orbitron font-bold text-white uppercase">Progressive Quests</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Pushups, Sit-ups, Squats, and Cardio with safe overload.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <Sparkles className="w-5 h-5 text-purple-400 mb-1.5" />
            <h4 className="text-xs font-orbitron font-bold text-white uppercase">Hunter Evolution</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Visual character transformation at key milestone ranks.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
            <Shield className="w-5 h-5 text-emerald-400 mb-1.5" />
            <h4 className="text-xs font-orbitron font-bold text-white uppercase">Gate Boss Trials</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Defeat Kasaka, Cerberus, Kargalgan, and Ant King Beru.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
