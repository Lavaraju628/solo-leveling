import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Sliders,
  User,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  Check
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { DifficultyLevel } from '../../types/game';
import { soundEngine } from '../../services/sound';
import { exportPlayerSaveData } from '../../services/storage';

export const SettingsView: React.FC = () => {
  const {
    state,
    setPlayerName,
    setDifficulty,
    setSoundEnabled,
    setSoundVolume,
    resetGame,
    importState
  } = useGame();

  const [nameInput, setNameInput] = useState(state.name);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setPlayerName(nameInput);
  };

  const handleExport = () => {
    soundEngine.playClick();
    const json = exportPlayerSaveData(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solo-leveling-hunter-${state.name.toLowerCase().replace(/\s+/g, '-')}-lvl${state.level}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importState(content);
      if (success) {
        soundEngine.playLevelUp();
        setImportStatus('Save data restored successfully!');
      } else {
        soundEngine.playSystemAlert();
        setImportStatus('Error: Invalid save game file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-rajdhani">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono tracking-widest uppercase">
          <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>[ SYSTEM CONFIGURATION & PREFERENCES ]</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white mt-1">
          SYSTEM SETTINGS
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure player dossier, workout intensity, audio synthesize parameters, and backup archives.
        </p>
      </div>

      <div className="space-y-6">
        {/* Hunter Identity Configuration */}
        <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
          <h2 className="font-orbitron font-bold text-lg text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>HUNTER IDENTITY</span>
          </h2>

          <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-orbitron font-bold text-sm focus:outline-none focus:border-cyan-400"
              maxLength={28}
              placeholder="Enter hunter name..."
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-blue transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>SAVE NAME</span>
            </button>
          </form>
        </div>

        {/* Workout Difficulty Tier */}
        <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
          <h2 className="font-orbitron font-bold text-lg text-white mb-2 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>FITNESS DIFFICULTY CALIBRATION</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Adjust the baseline reps and target scaling across pushups, situps, squats, and distance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  state.difficulty === d
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-glow-blue text-cyan-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-orbitron font-bold text-sm uppercase">{d}</div>
                <div className="text-xs text-slate-500 mt-1 font-rajdhani">
                  {d === 'beginner' && 'Base: 10 reps / 0.5 km. Gentle scaling for newcomers.'}
                  {d === 'intermediate' && 'Base: 20 reps / 1.0 km. Balanced progressive overload.'}
                  {d === 'advanced' && 'Base: 35 reps / 2.0 km. High intensity athletic conditioning.'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Synthesizer Controls */}
        <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
          <h2 className="font-orbitron font-bold text-lg text-white mb-4 flex items-center gap-2">
            {state.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-cyan-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
            <span>AUDIO SYSTEM SYNTHESIZER</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">System Sound Effects</span>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setSoundEnabled(!state.soundEnabled);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                  state.soundEnabled
                    ? 'bg-cyan-500 text-black shadow-glow-blue'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {state.soundEnabled ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>MASTER SYNTH VOLUME</span>
                <span>{Math.round(state.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.soundVolume}
                onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Data Export & Import */}
        <div className="p-6 rounded-2xl bg-[#060c1d] border border-cyan-500/30 shadow-lg">
          <h2 className="font-orbitron font-bold text-lg text-white mb-2 flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <span>SAVE DATA & BACKUP ARCHIVES</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Export your 100-level player state as a JSON file, or restore progress onto any other device.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExport}
              className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-gold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT SAVE FILE (.JSON)</span>
            </button>

            <label className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>IMPORT SAVE FILE</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="mt-3 text-xs font-mono text-cyan-400">{importStatus}</p>
          )}
        </div>

        {/* Danger Zone: Reset Game */}
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 shadow-lg">
          <h2 className="font-orbitron font-bold text-lg text-red-400 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>DANGER ZONE // MEMORY PURGE</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Reset all hunter progress, levels, gold coins, and history back to Level 1. This action cannot be reversed.
          </p>

          {showConfirmReset ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetGame();
                  setShowConfirmReset(false);
                }}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-glow-red transition-colors"
              >
                YES, PURGE ALL PROGRESS
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-red-950/80 border border-red-500/50 text-red-300 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span>RESET SYSTEM TO LEVEL 1</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

