import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Zap, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const SystemAlertModal: React.FC = () => {
  const { systemAlert, closeSystemAlert } = useGame();

  if (!systemAlert || !systemAlert.isOpen) return null;

  const isDanger = systemAlert.type === 'danger';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full max-w-lg p-6 bg-[#060e22]/95 border-2 ${
            isDanger ? 'border-red-500 shadow-glow-red' : 'border-cyan-400 shadow-glow-blue-lg'
          } rounded-lg overflow-hidden font-rajdhani text-slate-100`}
        >
          {/* Hologram scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] opacity-60" />

          {/* Corner brackets */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />

          {/* Close button */}
          <button
            onClick={closeSystemAlert}
            className="absolute top-3 right-3 text-cyan-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center pb-3 border-b border-cyan-500/30">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
              <span>[ SYSTEM NOTIFICATION ]</span>
            </div>
            <h2 className="text-2xl font-orbitron font-extrabold tracking-wider mt-2 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
              {systemAlert.title}
            </h2>
            {systemAlert.subtitle && (
              <p className="text-xs uppercase tracking-widest text-slate-400 mt-0.5">
                {systemAlert.subtitle}
              </p>
            )}
          </div>

          {/* Body message */}
          <div className="my-5 text-center">
            <p className="text-base text-slate-200 leading-relaxed font-medium">
              {systemAlert.message}
            </p>

            {/* Rewards section if present */}
            {systemAlert.rewards && (
              <div className="mt-5 p-4 rounded-lg bg-cyan-950/40 border border-cyan-500/40">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>REWARDS UNLOCKED</span>
                </div>
                <div className="flex items-center justify-center gap-6">
                  {systemAlert.rewards.xp !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-cyan-300" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs text-slate-400 block font-mono">EXPERIENCE</span>
                        <span className="text-lg font-orbitron font-bold text-cyan-300">
                          +{systemAlert.rewards.xp} XP
                        </span>
                      </div>
                    </div>
                  )}

                  {systemAlert.rewards.gold !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
                        <Coins className="w-4 h-4 text-amber-300" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs text-slate-400 block font-mono">GOLD REWARD</span>
                        <span className="text-lg font-orbitron font-bold text-amber-300">
                          +{systemAlert.rewards.gold} COINS
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => {
                if (systemAlert.onConfirm) systemAlert.onConfirm();
                closeSystemAlert();
              }}
              className="w-full py-3 px-6 rounded bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-orbitron font-bold text-sm tracking-wider uppercase shadow-glow-blue transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ACCEPT SYSTEM DIRECTIVE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
