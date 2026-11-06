import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Sparkles,
  Coins,
  Zap,
  Info,
  ChevronDown,
  Activity
} from 'lucide-react';
import { DailyMission, ExerciseType } from '../../types/game';
import { EXERCISE_DEFINITIONS } from '../../data/exercises';
import { useGame } from '../../context/GameContext';
import { soundEngine } from '../../services/sound';

interface DailyMissionCardProps {
  mission: DailyMission;
}

export const DailyMissionCard: React.FC<DailyMissionCardProps> = ({ mission }) => {
  const { updateMissionProgress, setMissionAlternative } = useGame();
  const [showGuide, setShowGuide] = useState(false);
  const [showAltDropdown, setShowAltDropdown] = useState(false);

  const def = EXERCISE_DEFINITIONS[mission.exerciseType];
  const isKm = mission.unit === 'km';
  const progressPercent = Math.min(
    100,
    Math.round((mission.completed / Math.max(1, mission.target)) * 100)
  );

  const selectedAlt =
    def.alternatives.find((a) => a.id === mission.selectedAlternativeId) ||
    def.alternatives[0];

  const handleAdjust = (delta: number) => {
    updateMissionProgress(mission.id, delta);
  };

  return (
    <div
      className={`relative p-5 rounded-xl border transition-all duration-300 font-rajdhani overflow-hidden ${
        mission.isCompleted
          ? 'bg-[#081a2e]/90 border-cyan-400 shadow-glow-blue'
          : 'bg-[#060c1d]/90 border-slate-800 hover:border-cyan-500/50 shadow-lg'
      }`}
    >
      {/* Background Holographic Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,240,255,0.03)_50%)] bg-[length:100%_4px] opacity-40" />

      {/* Top Card Header */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-orbitron font-bold text-lg text-white">
              {mission.exerciseName}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 uppercase">
              {def.category}
            </span>
          </div>

          {/* Current Alternative Selection */}
          <div className="relative mt-1">
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowAltDropdown(!showAltDropdown);
              }}
              className="text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1 font-medium py-0.5 transition-colors"
            >
              <span className="text-cyan-400">Variant:</span>
              <span className="underline decoration-cyan-500/50">
                {selectedAlt.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* Alternative Dropdown */}
            {showAltDropdown && (
              <div className="absolute left-0 top-full mt-1 w-64 p-2 rounded-lg bg-[#050b1a] border border-cyan-500/60 shadow-glow-blue z-30 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block px-2 py-1">
                  Select Safe Alternative
                </span>
                {def.alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => {
                      setMissionAlternative(mission.id, alt.id);
                      setShowAltDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-colors flex flex-col ${
                      alt.id === selectedAlt.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span>{alt.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {alt.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completion Status Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            title="Exercise Info & Form Guide"
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              mission.isCompleted
                ? 'bg-emerald-950/80 border border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 border border-slate-700 text-slate-400'
            }`}
          >
            {mission.isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>CLEARED</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5 text-slate-500" />
                <span>IN PROGRESS</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Target vs Completed Numbers */}
      <div className="my-4 flex items-baseline justify-between relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-orbitron font-black text-white">
            {mission.completed}
          </span>
          <span className="text-slate-400 font-orbitron font-bold text-lg">
            / {mission.target} {mission.unit}
          </span>
        </div>
        <div className="text-right">
          <span className="text-base font-orbitron font-bold text-cyan-400">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Animated Glowing Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-950 border border-cyan-500/30 overflow-hidden relative z-10 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`h-full ${
            mission.isCompleted
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]'
              : 'bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-500 shadow-glow-blue'
          }`}
        />
      </div>

      {/* Interactive +/- Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 relative z-10">
        {/* Minus Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleAdjust(isKm ? -0.1 : -1)}
            disabled={mission.completed <= 0}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>{isKm ? '0.1' : '1'}</span>
          </button>
          {!isKm && (
            <button
              onClick={() => handleAdjust(-5)}
              disabled={mission.completed < 5}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>5</span>
            </button>
          )}
        </div>

        {/* Rewards Tag */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-cyan-300">
            <Zap className="w-3.5 h-3.5" />
            <span>+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300">
            <Coins className="w-3.5 h-3.5" />
            <span>+{mission.goldReward} G</span>
          </div>
        </div>

        {/* Plus Controls */}
        <div className="flex items-center gap-1.5">
          {!isKm && (
            <button
              onClick={() => handleAdjust(5)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-mono text-xs flex items-center gap-1 shadow-glow-blue transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>5</span>
            </button>
          )}
          <button
            onClick={() => handleAdjust(isKm ? 0.1 : 1)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-glow-blue transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isKm ? '+0.1 km' : '+1'}</span>
          </button>
        </div>
      </div>

      {/* Guide & Form Instructions Collapsible */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-3 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-xs text-slate-300 space-y-2 relative z-10"
        >
          <div className="flex items-center justify-between text-cyan-400 font-mono font-bold">
            <span className="uppercase tracking-wider">Form Execution Guide: {selectedAlt.name}</span>
            <Activity className="w-3.5 h-3.5" />
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {selectedAlt.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
          <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="font-semibold text-cyan-300">Target Muscles:</span>
            <span>{def.muscleGroups.join(', ')}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
