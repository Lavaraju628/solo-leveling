import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  Coins,
  Timer,
  Volume2,
  VolumeX,
  Flame,
  Activity,
  Plus,
  Minus,
  ChevronRight,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyMission } from '../../types/game';
import { EXERCISE_DEFINITIONS } from '../../data/exercises';
import { soundEngine } from '../../services/sound';

interface GuidedWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: DailyMission[];
  dayLevel: number;
  onCompleteAll: (completedMap: Record<string, number>) => void;
}

type WorkoutPhase = 'countdown' | 'exercise' | 'rest' | 'summary';

export const GuidedWorkoutModal: React.FC<GuidedWorkoutModalProps> = ({
  isOpen,
  onClose,
  missions,
  dayLevel,
  onCompleteAll,
}) => {
  if (!isOpen) return null;

  // Workout state
  const [phase, setPhase] = useState<WorkoutPhase>('countdown');
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Default duration per exercise: exactly 60 seconds (1 minute) for reps, 90 seconds for running
  const getDurationForMission = (m: DailyMission): number => {
    if (m.unit === 'km') {
      return 90;
    }
    return 60; // 1 minute per exercise set!
  };

  const currentMission = missions[currentIndex] || missions[0];
  const initialDuration = getDurationForMission(currentMission);

  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Rest timer
  const [restTimeLeft, setRestTimeLeft] = useState<number>(20);

  // User actual recorded reps for each mission during the session
  const [repsDoneMap, setRepsDoneMap] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    missions.forEach((m) => {
      init[m.id] = m.target; // pre-populate with target so user doesn't have to mash if they hit target
    });
    return init;
  });

  const currentRepsDone = repsDoneMap[currentMission.id] ?? currentMission.target;

  // Sound triggers on 3-2-1
  const prevTimeRef = useRef<number>(timeLeft);

  // 1. Initial 3-2-1 Countdown before first workout starts
  useEffect(() => {
    if (phase !== 'countdown') return;

    soundEngine.playCountdownBeep(countdownNum === 1);
    const timer = setInterval(() => {
      setCountdownNum((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundEngine.playCountdownBeep(true);
          setPhase('exercise');
          setTimeLeft(getDurationForMission(missions[0]));
          return 0;
        }
        soundEngine.playCountdownBeep(false);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, countdownNum, missions]);

  // 2. Active Exercise Timer
  useEffect(() => {
    if (phase !== 'exercise' || isPaused) return;

    const timer = setInterval(() => {
      setTotalTimeSpent((t) => t + 1);
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          soundEngine.playCountdownBeep(false);
        } else if (prev === 1) {
          soundEngine.playCountdownBeep(true);
        }

        if (prev <= 1) {
          // Time is up! Move to rest or next
          handleExerciseTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, currentIndex]);

  // 3. Rest Timer
  useEffect(() => {
    if (phase !== 'rest' || isPaused) return;

    const timer = setInterval(() => {
      setTotalTimeSpent((t) => t + 1);
      setRestTimeLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          soundEngine.playCountdownBeep(false);
        } else if (prev === 1) {
          soundEngine.playCountdownBeep(true);
        }

        if (prev <= 1) {
          handleFinishRest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused]);

  const handleExerciseTimeUp = () => {
    soundEngine.playRestChime();
    if (currentIndex < missions.length - 1) {
      setRestTimeLeft(20);
      setPhase('rest');
    } else {
      // Completed last exercise!
      handleFinishWorkout();
    }
  };

  const handleFinishRest = () => {
    soundEngine.playClick();
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    setTimeLeft(getDurationForMission(missions[nextIdx]));
    setPhase('exercise');
  };

  const handleSkipToNext = () => {
    soundEngine.playClick();
    if (currentIndex < missions.length - 1) {
      setRestTimeLeft(20);
      setPhase('rest');
    } else {
      handleFinishWorkout();
    }
  };

  const handleFinishWorkout = () => {
    soundEngine.playQuestComplete();
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#38bdf8', '#fbbf24', '#a855f7'],
      });
    } catch {
      // fallback
    }
    setPhase('summary');
  };

  const handleClaimAndClose = () => {
    soundEngine.playLevelUp();
    onCompleteAll(repsDoneMap);
    onClose();
  };

  const updateCurrentReps = (delta: number) => {
    soundEngine.playClick();
    const isKm = currentMission.unit === 'km';
    setRepsDoneMap((prev) => {
      const current = prev[currentMission.id] ?? currentMission.target;
      const step = isKm ? 0.1 : 1;
      const nextVal = isKm
        ? Number(Math.max(0, current + (delta > 0 ? step : -step)).toFixed(1))
        : Math.max(0, current + delta);
      return { ...prev, [currentMission.id]: nextVal };
    });
  };

  // Circular progress calculations
  const totalDuration = getDurationForMission(currentMission);
  const exerciseProgressPercent = Math.min(
    100,
    Math.round(((totalDuration - timeLeft) / Math.max(1, totalDuration)) * 100)
  );

  const restProgressPercent = Math.min(
    100,
    Math.round(((20 - restTimeLeft) / 20) * 100)
  );

  const estimatedCalories = Math.round(totalTimeSpent * 0.22 + missions.length * 15);
  const def = EXERCISE_DEFINITIONS[currentMission.exerciseType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl select-none font-rajdhani text-slate-100 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#061026] via-[#040816] to-[#02040b] border-2 border-cyan-400 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,210,255,0.4)] my-auto">
        {/* Hologram Grid & Scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,240,255,0.04)_50%)] bg-[length:100%_4px] opacity-60" />

        {/* Top Header Bar */}
        <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-cyan-500/20 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 p-[1px] shadow-glow-blue bg-slate-900">
              <img
                src="/sung.avif"
                alt="Sung Jin-Woo"
                className="w-full h-full object-cover"
                style={{ objectPosition: dayLevel < 10 ? '12% 40%' : '50% 35%' }}
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block leading-tight">
                DAY {dayLevel} • GUIDED WORKOUT SESSION
              </span>
              <span className="font-orbitron font-bold text-sm text-white">
                SOLO LEVELING FITNESS SYSTEM
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= PHASE 1: COUNTDOWN (3... 2... 1...) ================= */}
        {phase === 'countdown' && (
          <div className="py-20 px-6 flex flex-col items-center justify-center text-center relative z-10">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
              GET IN POSITION • FIRST UP: {missions[0]?.exerciseName.toUpperCase()}
            </span>

            <motion.div
              key={countdownNum}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-36 h-36 rounded-full bg-cyan-950/80 border-4 border-cyan-400 shadow-glow-blue-lg flex items-center justify-center"
            >
              <span className="text-7xl font-orbitron font-black text-cyan-300 drop-shadow-[0_0_20px_#00f0ff]">
                {countdownNum}
              </span>
            </motion.div>

            <h3 className="text-2xl font-orbitron font-bold text-white mt-8 tracking-wider">
              PREPARE FOR BATTLE
            </h3>
            <p className="text-slate-400 text-sm max-w-md mt-1 font-medium">
              Target: {missions[0]?.target} {missions[0]?.unit} in ~{getDurationForMission(missions[0])}s
            </p>
          </div>
        )}

        {/* ================= PHASE 2: ACTIVE EXERCISE ================= */}
        {phase === 'exercise' && (
          <div className="p-6 sm:p-8 flex flex-col items-center relative z-10">
            {/* Step Progress Segments (Exercise X of Y) */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                EXERCISE {currentIndex + 1} OF {missions.length}
              </span>
              <span className="text-xs font-mono text-slate-400">
                TOTAL TIME: {Math.floor(totalTimeSpent / 60)}:
                {String(totalTimeSpent % 60).padStart(2, '0')}
              </span>
            </div>

            {/* Segmented Bar */}
            <div className="w-full grid grid-cols-4 gap-2 mb-6">
              {missions.map((m, idx) => (
                <div
                  key={m.id}
                  className={`h-2 rounded-full transition-all ${
                    idx < currentIndex
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      : idx === currentIndex
                      ? 'bg-cyan-400 shadow-glow-blue animate-pulse'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Exercise Title & Rep Goal */}
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-white tracking-wide">
                {currentMission.exerciseName}
              </h2>
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs sm:text-sm font-mono font-bold">
                <TargetIcon />
                <span>
                  TARGET: {currentMission.target} {currentMission.unit.toUpperCase()} IN {totalDuration}S
                </span>
              </div>
            </div>

            {/* Big Circular Countdown Timer with Animated Center */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-2 flex items-center justify-center">
              {/* SVG Ring Progress */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-800/80"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-cyan-400 transition-all duration-300"
                  strokeWidth="6"
                  strokeDasharray="276.46"
                  strokeDashoffset={276.46 * (1 - (totalDuration - timeLeft) / totalDuration)}
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.7))' }}
                />
              </svg>

              {/* Timer Center Values */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl sm:text-6xl font-orbitron font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  {timeLeft}
                  <span className="text-xl sm:text-2xl font-mono text-cyan-400 font-bold ml-1">
                    s
                  </span>
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">
                  {isPaused ? 'PAUSED' : 'COUNTDOWN'}
                </span>
              </div>
            </div>

            {/* Rep Counter / Adjuster for User Input */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between my-4">
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  REPS LOGGED
                </span>
                <span className="text-2xl font-orbitron font-black text-cyan-300">
                  {currentRepsDone} {currentMission.unit}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCurrentReps(-1)}
                  disabled={currentRepsDone <= 0}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 flex items-center justify-center disabled:opacity-30"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => updateCurrentReps(1)}
                  className="w-10 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-glow-blue"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Control Buttons (Pause / +10s / Next) */}
            <div className="flex items-center gap-3 w-full max-w-md pt-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setTimeLeft((t) => t + 10);
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 text-xs font-mono font-bold uppercase transition-colors"
              >
                +10s
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsPaused(!isPaused);
                }}
                className={`flex-1 py-3.5 px-6 rounded-xl font-orbitron font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isPaused
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-blue'
                }`}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>RESUME TIMER</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>PAUSE TIMER</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSkipToNext}
                className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono font-bold uppercase flex items-center gap-1 transition-colors"
                title="Finish exercise now"
              >
                <span>DONE</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 3: REST BETWEEN EXERCISES ================= */}
        {phase === 'rest' && (
          <div className="p-8 flex flex-col items-center justify-center text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-400 text-teal-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Heart className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>CATCH YOUR BREATH • ACTIVE RECOVERY</span>
            </div>

            <h2 className="text-3xl font-orbitron font-black text-white">
              REST INTERVAL
            </h2>

            {/* Circular Rest Timer */}
            <div className="relative w-48 h-48 my-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-800"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-teal-400 transition-all duration-300"
                  strokeWidth="6"
                  strokeDasharray="276.46"
                  strokeDashoffset={276.46 * (1 - (20 - restTimeLeft) / 20)}
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.7))' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-orbitron font-black text-teal-300">
                  {restTimeLeft}s
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  REMAINING
                </span>
              </div>
            </div>

            {/* Next Exercise Preview Box */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-left my-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                UP NEXT (EXERCISE {currentIndex + 2} OF {missions.length})
              </span>
              <div className="text-xl font-orbitron font-bold text-white mt-0.5">
                {missions[currentIndex + 1]?.exerciseName}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Target: {missions[currentIndex + 1]?.target} {missions[currentIndex + 1]?.unit}
              </div>
            </div>

            {/* Rest Actions */}
            <div className="flex items-center gap-3 w-full max-w-md mt-4">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setRestTimeLeft((r) => r + 15);
                }}
                className="py-3 px-5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold uppercase hover:border-slate-600"
              >
                +15s Rest
              </button>

              <button
                onClick={handleFinishRest}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>SKIP REST & BEGIN</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 4: WORKOUT COMPLETE SUMMARY ================= */}
        {phase === 'summary' && (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-cyan-950 border-2 border-cyan-400 shadow-glow-blue-lg flex items-center justify-center text-cyan-300 mb-3 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              [ SYSTEM NOTIFICATION // ALL OBJECTIVES CLEARED ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
              WORKOUT COMPLETED!
            </h2>
            <p className="text-slate-300 text-sm max-w-md mt-2">
              You completed Day {dayLevel}'s progressive training. The System has recognized your awakening discipline.
            </p>

            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md my-6">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">TIME</span>
                <span className="text-xl font-orbitron font-bold text-white">
                  {Math.floor(totalTimeSpent / 60)}m {totalTimeSpent % 60}s
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">CALORIES</span>
                <span className="text-xl font-orbitron font-bold text-amber-300">
                  ~{estimatedCalories} kcal
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">EXERCISES</span>
                <span className="text-xl font-orbitron font-bold text-emerald-400">
                  4 / 4
                </span>
              </div>
            </div>

            {/* Primary Action: Claim and Apply to System */}
            <button
              onClick={handleClaimAndClose}
              className="w-full max-w-md py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-orbitron font-black text-sm tracking-widest uppercase shadow-glow-blue-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              SAVE WORKOUT & CLAIM REWARDS
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TargetIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

