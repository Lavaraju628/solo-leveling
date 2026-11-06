import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  HeartPulse,
  XCircle,
  Zap,
  Coins,
  Dumbbell,
  Clock,
  Info
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getTodayDateString } from '../../services/storage';
import { soundEngine } from '../../services/sound';

export const WorkoutCalendar: React.FC = () => {
  const { state } = useGame();
  const todayStr = getTodayDateString();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    soundEngine.playClick();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    soundEngine.playClick();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    soundEngine.playClick();
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(formattedDate);
  };

  // Determine history or today's active quest
  const selectedRecord = state.history[selectedDateStr] || (selectedDateStr === todayStr ? {
    date: todayStr,
    dayLevel: state.level,
    isRecoveryDay: state.dailyQuest.isRecoveryDay,
    isCompleted: state.dailyQuest.isAllCompleted,
    totalXpEarned: state.dailyQuest.missions.filter(m => m.isCompleted).reduce((s, m) => s + m.xpReward, 0) + (state.dailyQuest.isAllCompleted ? state.dailyQuest.bonusXp : 0),
    totalGoldEarned: state.dailyQuest.missions.filter(m => m.isCompleted).reduce((s, m) => s + m.goldReward, 0) + (state.dailyQuest.isAllCompleted ? state.dailyQuest.bonusGold : 0),
    exercises: state.dailyQuest.missions.map(m => ({
      name: m.exerciseName,
      completed: m.completed,
      target: m.target,
      unit: m.unit,
    })),
  } : null);

  // Total summary statistics
  const totalCompletedDays = Object.values(state.history).filter((h) => h.isCompleted).length + (state.dailyQuest.isAllCompleted ? 1 : 0);
  const totalRecoveryDays = Object.values(state.history).filter((h) => h.isRecoveryDay).length + (state.dailyQuest.isRecoveryDay ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>[ SYSTEM LOG // TIME ARCHIVES ]</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
            WORKOUT CALENDAR & HISTORY
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Permanent logs of completed quests, recovery cycles, and attribute gains.
          </p>
        </div>

        {/* Lifetime Summary Counters */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">WORKOUTS</span>
            <span className="text-xl font-orbitron font-bold text-cyan-300">
              {totalCompletedDays} DAYS
            </span>
          </div>

          <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/40 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">RECOVERY</span>
            <span className="text-xl font-orbitron font-bold text-teal-300">
              {totalRecoveryDays} DAYS
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Month Calendar */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h2 className="font-orbitron font-bold text-xl text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs text-slate-500 pb-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading days */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-xl bg-slate-950/40 opacity-20" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;

              // Check if history exists
              const hist = state.history[dateStr];
              const isDone = hist?.isCompleted || (isToday && state.dailyQuest.isAllCompleted);
              const isRecovery = hist?.isRecoveryDay || (isToday && state.dailyQuest.isRecoveryDay);

              return (
                <button
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`h-14 sm:h-16 rounded-xl p-1.5 flex flex-col justify-between border transition-all text-left relative ${
                    isSelected
                      ? 'bg-cyan-950/90 border-cyan-400 shadow-glow-blue'
                      : isToday
                      ? 'bg-slate-900 border-amber-400/80'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isToday ? 'text-amber-300 font-extrabold' : 'text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>

                  {/* Status Indicator Dots */}
                  <div className="flex items-center gap-1">
                    {isDone ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                    ) : isRecovery ? (
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-5 mt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-blue" />
              <span>Workout Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>Active Recovery Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Day Workout Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                DOSSIER LOG FOR DATE
              </span>
              <h3 className="font-orbitron font-bold text-lg text-white">
                {selectedDateStr}
              </h3>
            </div>
            {selectedDateStr === todayStr && (
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/50 text-amber-300 text-[10px] font-mono uppercase">
                TODAY'S MISSION
              </span>
            )}
          </div>

          {selectedRecord ? (
            <div className="space-y-4">
              {/* Status Header */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-400 uppercase">QUEST STATUS</span>
                <span
                  className={`text-xs font-mono font-bold uppercase flex items-center gap-1 ${
                    selectedRecord.isCompleted ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {selectedRecord.isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>CLEARED</span>
                    </>
                  ) : (
                    <span>INCOMPLETE / PENDING</span>
                  )}
                </span>
              </div>

              {/* Day Level & Rewards Gained */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">XP EARNED</span>
                    <span className="text-base font-orbitron font-bold text-cyan-300">
                      +{selectedRecord.totalXpEarned} XP
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">GOLD EARNED</span>
                    <span className="text-base font-orbitron font-bold text-amber-300">
                      +{selectedRecord.totalGoldEarned} G
                    </span>
                  </div>
                </div>
              </div>

              {/* Exercises Performed */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
                  EXERCISES RECORDED
                </span>
                <div className="space-y-2">
                  {selectedRecord.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-200">{ex.name}</span>
                      <span className="font-mono text-cyan-400">
                        {ex.completed} / {ex.target} {ex.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Info className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs font-mono">No workout logs registered for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

