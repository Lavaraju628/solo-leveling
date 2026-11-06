import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Coins,
  Timer,
  Flame,
  Activity,
  Plus,
  Minus,
  ChevronRight,
  Heart,
  Dumbbell,
  Shield,
  Search,
  Bell,
  ChevronDown,
  Info,
  Sliders,
  HeartPulse,
  TrendingUp,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuidedWorkoutModal } from './GuidedWorkoutModal';
import { useGame } from '../../context/GameContext';
import { DailyMission, DifficultyLevel, ExerciseType } from '../../types/game';
import { EXERCISE_DEFINITIONS } from '../../data/exercises';
import { soundEngine } from '../../services/sound';

export const DailyMissions: React.FC = () => {
  const {
    state,
    setDifficulty,
    toggleRecoveryDay,
    claimDailyCompletion,
    updateMissionProgress,
    setMissionProgressManual,
    setMissionAlternative,
    triggerSystemAlert,
  } = useGame();

  const { dailyQuest, difficulty, level, rank, name, streak, gold } = state;

  // Active workout session modal
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [activeSessionMissions, setActiveSessionMissions] = useState<DailyMission[]>(dailyQuest.missions);

  // Selected filter in Trending Exercises
  const [selectedExerciseFilter, setSelectedExerciseFilter] = useState<string>('all');
  const [activeVariantDropdown, setActiveVariantDropdown] = useState<string | null>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<DailyMission | null>(null);

  const completedCount = dailyQuest.missions.filter((m) => m.isCompleted).length;
  const allCompleted = dailyQuest.missions.every((m) => m.isCompleted);

  const totalXpRewards = dailyQuest.missions.reduce((s, m) => s + m.xpReward, 0) + dailyQuest.bonusXp;
  const totalGoldRewards = dailyQuest.missions.reduce((s, m) => s + m.goldReward, 0) + dailyQuest.bonusGold;

  // Filter missions if category selected
  const displayMissions =
    selectedExerciseFilter === 'all'
      ? dailyQuest.missions
      : dailyQuest.missions.filter((m) => m.exerciseType === selectedExerciseFilter);

  const handleStartFullWorkout = () => {
    soundEngine.playLevelUp();
    setActiveSessionMissions(dailyQuest.missions);
    setIsGuidedOpen(true);
  };

  const handleStartSingleTimer = (mission: DailyMission) => {
    soundEngine.playClick();
    setActiveSessionMissions([mission]);
    setIsGuidedOpen(true);
  };

  const handleWorkoutCompleteBatch = (completedMap: Record<string, number>) => {
    Object.entries(completedMap).forEach(([missionId, reps]) => {
      setMissionProgressManual(missionId, reps);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 select-none font-rajdhani text-slate-100">
      {/* ================= 1. USER PROFILE HEADER (Like screenshot top bar) ================= */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          {/* Avatar Ring with Jin-Woo Artwork */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 p-[1px] shadow-glow-blue bg-slate-900">
              <img
                src="/sung.avif"
                alt="Sung Jin-Woo"
                className="w-full h-full object-cover"
                style={{ objectPosition: level < 10 ? '12% 40%' : '50% 35%' }}
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-lime-400 border-2 border-[#030712] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-bold text-lg text-white">
                Hey, {name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 uppercase font-bold">
                {rank}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Stay healthy & level up always.
            </p>
          </div>
        </div>

        {/* Right Status Actions */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-orbitron font-bold">{gold}</span>
          </div>

          <button
            onClick={() =>
              triggerSystemAlert({
                title: 'SYSTEM DIRECTIVE',
                subtitle: `DAILY CYCLE: ${dailyQuest.date}`,
                message:
                  'Daily Quest: Complete all 4 physical training missions before midnight to avoid penalty zone and claim awakening rewards.',
                type: 'quest',
              })
            }
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors relative"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            {!dailyQuest.isAllCompleted && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            )}
          </button>
        </div>
      </div>

      {/* ================= 2. HERO FEATURED WORKOUT BANNER (Like screenshot center card) ================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[28px] overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#0b1d44] via-[#091535] to-[#0d0a2b] border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(0,210,255,0.25)] mb-8"
      >
        {/* Soft background ambient gradient shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-pink-500/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-mono tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>DAY {level} HUNTER TRAINING</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white tracking-wide">
              {dailyQuest.isRecoveryDay ? 'Active Recovery Routine' : 'Daily Awakening Workout'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {dailyQuest.isRecoveryDay
                ? 'Light restorative stretching and low-intensity movements to repair fibers.'
                : 'Full body progressive workout: Pushups, Situps, Squats, and Cardio.'}
            </p>

            {/* Pill chips like screenshot: 25 Min • 240 Cal */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm">
                <Timer className="w-3.5 h-3.5 text-cyan-400" />
                <span>~6 - 8 Min</span>
              </span>

              <span className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-amber-300 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>~95 Cal</span>
              </span>

              <span className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-lime-400 flex items-center gap-1.5 shadow-sm">
                <Dumbbell className="w-3.5 h-3.5 text-lime-400" />
                <span>4 Exercises</span>
              </span>
            </div>
          </div>

          {/* Big Lime / Cyan Start Button & Character Silhouette */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Character Thumbnail like reference card */}
            <div className="hidden lg:block relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-glow-blue flex-shrink-0 bg-slate-950">
              <img
                src="/sung.avif"
                alt="Sung Jin-Woo Hero"
                className="w-full h-full object-cover"
                style={{ objectPosition: level < 10 ? '12% 40%' : '50% 35%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091535] via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartFullWorkout}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-400 via-lime-300 to-cyan-300 hover:from-lime-300 hover:to-cyan-200 text-slate-950 font-orbitron font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_0_25px_rgba(163,230,53,0.5)] flex items-center justify-center gap-3 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current text-slate-950 ml-0.5" />
                </div>
                <span>START DAY {level} TASK</span>
              </motion.button>
              <span className="text-[10px] font-mono text-slate-400">
                1-Minute Timers & Rest Intervals
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= 3. TRENDING / EXERCISE FILTER PILLS (Like screenshot "Trending Exercise") ================= */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="font-orbitron font-bold text-base text-white">
            Daily Workout Exercises
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {completedCount} / 4 Completed
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { id: 'pushups', label: 'Push-up', icon: '💪', time: '60s' },
            { id: 'situps', label: 'Sit-up', icon: '🧘', time: '60s' },
            { id: 'squats', label: 'Squat', icon: '🦵', time: '60s' },
            { id: 'running', label: 'Running', icon: '🏃', time: '90s' },
          ].map((item) => {
            const isSelected = selectedExerciseFilter === item.id;
            const mission = dailyQuest.missions.find((m) => m.exerciseType === item.id);
            const isDone = mission?.isCompleted;

            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedExerciseFilter(selectedExerciseFilter === item.id ? 'all' : item.id);
                }}
                className={`p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                  isSelected
                    ? 'bg-lime-400/15 border-lime-400 text-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                    : isDone
                    ? 'bg-slate-900/90 border-emerald-500/50 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-1">{item.icon}</div>
                <span className="font-orbitron font-bold text-xs truncate w-full">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {isDone ? '✓ Done' : item.time}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 4. INTENSITY & RECOVERY SETTINGS ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-400 uppercase">DIFFICULTY:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                  difficulty === d
                    ? 'bg-lime-400 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={toggleRecoveryDay}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-orbitron font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            dailyQuest.isRecoveryDay
              ? 'bg-teal-950 border border-teal-400 text-teal-300 shadow-sm'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <HeartPulse className={`w-3.5 h-3.5 ${dailyQuest.isRecoveryDay ? 'text-teal-300 animate-pulse' : 'text-slate-500'}`} />
          <span>{dailyQuest.isRecoveryDay ? 'RECOVERY ACTIVE' : 'RECOVERY DAY'}</span>
        </button>
      </div>

      {/* ================= 5. MY SCHEDULE / WORKOUT TASKS LIST (Like screenshot "My Schedule") ================= */}
      <div className="space-y-3.5 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron font-bold text-base text-white">
            Today's Schedule
          </h3>
          {allCompleted && !dailyQuest.isAllCompleted && (
            <button
              onClick={claimDailyCompletion}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-gold animate-bounce flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CLAIM ALL REWARDS</span>
            </button>
          )}
        </div>

        {displayMissions.map((mission) => {
          const def = EXERCISE_DEFINITIONS[mission.exerciseType];
          const isKm = mission.unit === 'km';
          const isDone = mission.isCompleted;
          const selectedAlt =
            def.alternatives.find((a) => a.id === mission.selectedAlternativeId) ||
            def.alternatives[0];

          const isDropdownOpen = activeVariantDropdown === mission.id;

          // Color theme per exercise
          const exerciseIcon =
            mission.exerciseType === 'pushups'
              ? '💪'
              : mission.exerciseType === 'situps'
              ? '🧘'
              : mission.exerciseType === 'squats'
              ? '🦵'
              : '🏃';

          return (
            <motion.div
              key={mission.id}
              whileHover={{ y: -1 }}
              className={`p-4 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-[#08182d]/90 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Exercise Info */}
                <div className="flex items-center gap-3.5">
                  {/* Round soft square icon badge */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                    {exerciseIcon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-orbitron font-bold text-base text-white">
                        {mission.exerciseName}
                      </h4>
                      {isDone && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CLEARED</span>
                        </span>
                      )}
                    </div>

                    {/* Variant & Sets subtext */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="relative">
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            setActiveVariantDropdown(isDropdownOpen ? null : mission.id);
                          }}
                          className="text-xs text-slate-400 hover:text-cyan-400 font-medium flex items-center gap-1"
                        >
                          <span>{selectedAlt.name}</span>
                          <ChevronDown className="w-3 h-3 text-slate-500" />
                        </button>

                        {/* Variant popup */}
                        {isDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 w-60 p-2 rounded-2xl bg-[#070e20] border border-cyan-500/50 shadow-glow-blue z-30 space-y-1">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block px-2 py-1">
                              Select Variant
                            </span>
                            {def.alternatives.map((alt) => (
                              <button
                                key={alt.id}
                                onClick={() => {
                                  setMissionAlternative(mission.id, alt.id);
                                  setActiveVariantDropdown(null);
                                }}
                                className={`w-full text-left p-2 rounded-xl text-xs transition-colors ${
                                  alt.id === selectedAlt.id
                                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40'
                                    : 'text-slate-300 hover:bg-slate-900'
                                }`}
                              >
                                {alt.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {isKm ? '~90s cardio' : '1 min timer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action: Clean Rep Pill Button + Counter */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Plus / Minus Quick Counter */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => updateMissionProgress(mission.id, isKm ? -0.1 : -1)}
                      disabled={mission.completed <= 0}
                      className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300 flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="px-2 text-center min-w-[50px]">
                      <span className="font-orbitron font-black text-sm text-white">
                        {mission.completed}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 block leading-none">
                        / {mission.target}
                      </span>
                    </div>

                    <button
                      onClick={() => updateMissionProgress(mission.id, isKm ? 0.1 : 1)}
                      className="w-7 h-7 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-glow-blue"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Start 1-Min Timer Pill Button (like screenshot lime badge) */}
                  <button
                    onClick={() => handleStartSingleTimer(mission)}
                    className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-orbitron font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(163,230,53,0.3)] transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-slate-950" />
                    <span>{mission.target} {mission.unit} in 1m</span>
                  </button>

                  {/* Form guide button */}
                  <button
                    onClick={() => setActiveInfoModal(activeInfoModal?.id === mission.id ? null : mission)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Guide Drawer */}
              {activeInfoModal?.id === mission.id && (
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                  <div className="font-orbitron font-bold text-cyan-400">
                    Form Guide: {selectedAlt.name}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    {selectedAlt.instructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ================= 6. ACTIVITY REPORT WIDGETS (Like screenshot Screen 3) ================= */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
        <h3 className="font-orbitron font-bold text-sm text-white mb-3">
          Activity Report
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Calories Ring Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset={88 * (1 - Math.min(1, completedCount / 4))}
                  strokeLinecap="round"
                />
              </svg>
              <Flame className="w-4 h-4 text-amber-400 absolute" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">CALORIES</span>
              <span className="text-base font-orbitron font-bold text-amber-300">
                {completedCount * 25} kcal
              </span>
            </div>
          </div>

          {/* Heart Rate Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">HEART RATE</span>
              <span className="text-base font-orbitron font-bold text-rose-300">
                118 bpm
              </span>
            </div>
          </div>

          {/* Daily Streak Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-950/40 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">STREAK</span>
              <span className="text-base font-orbitron font-bold text-orange-300">
                {streak} Days
              </span>
            </div>
          </div>

          {/* XP Gained Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">XP GAINS</span>
              <span className="text-base font-orbitron font-bold text-cyan-300">
                +{totalXpRewards} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7. GUIDED TIMER WORKOUT MODAL ================= */}
      <GuidedWorkoutModal
        isOpen={isGuidedOpen}
        onClose={() => setIsGuidedOpen(false)}
        missions={activeSessionMissions}
        dayLevel={level}
        onCompleteAll={handleWorkoutCompleteBatch}
      />
    </div>
  );
};
