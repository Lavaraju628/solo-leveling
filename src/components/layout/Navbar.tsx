import React, { useState } from 'react';
import {
  Shield,
  Coins,
  Flame,
  Volume2,
  VolumeX,
  Menu,
  X,
  Dumbbell,
  User,
  ShoppingBag,
  Award,
  Calendar,
  Settings,
  Swords,
  Layers,
  Home
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { getRankColor } from '../../data/levels';
import { soundEngine } from '../../services/sound';

export type ActiveTab =
  | 'home'
  | 'dashboard'
  | 'missions'
  | 'profile'
  | 'levels'
  | 'bosses'
  | 'shop'
  | 'achievements'
  | 'calendar'
  | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { state, setSoundEnabled } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const rankTheme = getRankColor(state.rank);

  const xpPercent = Math.min(
    100,
    Math.round((state.currentXp / Math.max(1, state.xpToNextLevel)) * 100)
  );

  interface NavItemDef {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const navItems: NavItemDef[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'missions', label: 'Daily Quests', icon: Dumbbell, badge: state.dailyQuest.isAllCompleted ? 'CLEARED' : `${state.dailyQuest.missions.filter(m => m.isCompleted).length}/4` },
    { id: 'profile', label: 'Hunter Status', icon: User },
    { id: 'levels', label: '100 Levels', icon: Layers },
    { id: 'bosses', label: 'Gate Bosses', icon: Swords },
    { id: 'shop', label: 'System Shop', icon: ShoppingBag },
    { id: 'achievements', label: 'Badges', icon: Award },
    { id: 'calendar', label: 'Log & History', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    soundEngine.playClick();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !state.soundEnabled;
    setSoundEnabled(next);
    if (next) {
      soundEngine.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030712]/90 backdrop-blur-md border-b border-cyan-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Rank Tag */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 shadow-glow-blue border border-cyan-300">
              <span className="font-orbitron font-black text-xl text-black">S</span>
              <div className="absolute -inset-0.5 rounded-lg border border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-extrabold text-base tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  SOLO LEVELING
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/50">
                  SYSTEM
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`font-orbitron font-bold text-xs ${rankTheme.text}`}>
                  {state.rank}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400 font-mono font-semibold">
                  LVL {state.level}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop HUD: XP, Gold, Streak */}
          <div className="hidden lg:flex items-center gap-6">
            {/* XP Bar Progress */}
            <div className="flex flex-col w-44">
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span className="text-cyan-400 font-semibold">XP RESONANCE</span>
                <span>
                  {state.currentXp} / {state.xpToNextLevel}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-500/30 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-glow-blue transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Gold Coins Display */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/30 border border-amber-500/40 shadow-glow-gold">
              <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-amber-400/80 leading-tight">GOLD</span>
                <span className="text-sm font-orbitron font-bold text-amber-300">
                  {state.gold.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-950/30 border border-orange-500/40">
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-orange-400/80 leading-tight">STREAK</span>
                <span className="text-sm font-orbitron font-bold text-orange-300">
                  {state.streak} {state.streak === 1 ? 'DAY' : 'DAYS'}
                </span>
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={state.soundEnabled ? 'Mute System Audio' : 'Unmute System Audio'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500 transition-colors"
            >
              {state.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>

          {/* Mobile Right Controls: Sound + Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
            >
              {state.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links Strip */}
        <nav className="hidden lg:flex items-center gap-1 py-1.5 border-t border-slate-800/80 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveTab)}
                className={`relative px-3 py-1.5 rounded text-xs font-rajdhani font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-150 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/50 shadow-glow-blue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded text-[9px] font-mono ${
                      item.badge === 'CLEARED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-cyan-900/70 text-cyan-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050b18] border-b border-cyan-500/30 px-4 py-4 space-y-3 font-rajdhani">
          {/* Mobile Status Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">LEVEL</span>
              <span className="text-sm font-orbitron font-bold text-cyan-300">
                LVL {state.level}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">GOLD</span>
              <span className="text-sm font-orbitron font-bold text-amber-300">
                {state.gold}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">STREAK</span>
              <span className="text-sm font-orbitron font-bold text-orange-300">
                {state.streak} D
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ActiveTab)}
                  className={`p-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border text-left ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-glow-blue'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
