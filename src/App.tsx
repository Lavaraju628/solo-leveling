import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ParticleBackground } from './components/layout/ParticleBackground';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { HomePage } from './components/home/HomePage';
import { GameDashboard } from './components/dashboard/GameDashboard';
import { DailyMissions } from './components/missions/DailyMissions';
import { PlayerProfile } from './components/profile/PlayerProfile';
import { LevelProgression } from './components/levels/LevelProgression';
import { BossChallengeView } from './components/boss/BossChallengeView';
import { GameShop } from './components/shop/GameShop';
import { AchievementsView } from './components/achievements/AchievementsView';
import { WorkoutCalendar } from './components/calendar/WorkoutCalendar';
import { SettingsView } from './components/settings/SettingsView';
import { SystemAlertModal } from './components/modals/SystemAlertModal';
import { LevelUpModal } from './components/modals/LevelUpModal';

const GameContainer: React.FC = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    state.hasStarted ? 'missions' : 'home'
  );

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col overflow-x-hidden">
      {/* Dynamic Cyber Particle Field */}
      <ParticleBackground />

      {/* Navigation Bar (hidden on Home screen) */}
      {state.hasStarted && activeTab !== 'home' && (
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {/* Main View Router */}
      <main className="relative z-10 flex-1">
        {(!state.hasStarted || activeTab === 'home') && (
          <HomePage onStart={() => setActiveTab('missions')} />
        )}

        {state.hasStarted && activeTab === 'dashboard' && (
          <GameDashboard onNavigate={setActiveTab} />
        )}

        {state.hasStarted && activeTab === 'missions' && (
          <DailyMissions />
        )}

        {state.hasStarted && activeTab === 'profile' && (
          <PlayerProfile />
        )}

        {state.hasStarted && activeTab === 'levels' && (
          <LevelProgression />
        )}

        {state.hasStarted && activeTab === 'bosses' && (
          <BossChallengeView />
        )}

        {state.hasStarted && activeTab === 'shop' && (
          <GameShop />
        )}

        {state.hasStarted && activeTab === 'achievements' && (
          <AchievementsView />
        )}

        {state.hasStarted && activeTab === 'calendar' && (
          <WorkoutCalendar />
        )}

        {state.hasStarted && activeTab === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Holographic System Modals */}
      <SystemAlertModal />
      <LevelUpModal />

      {/* Footer System Telemetry */}
      {state.hasStarted && activeTab !== 'home' && (
        <footer className="relative z-10 border-t border-slate-900 bg-[#02050c]/80 py-4 px-6 text-center text-xs font-mono text-slate-500">
          <p>
            SOLO LEVELING: REAL LIFE SYSTEM • REAWAKENED EDITION • 100 LEVELS ACTIVE
          </p>
        </footer>
      )}
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;

