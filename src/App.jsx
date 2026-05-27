import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import TodayTab from './components/today/TodayTab';
import WorkoutTab from './components/workout/WorkoutTab';
import ProgressTab from './components/progress/ProgressTab';

const TABS = { today: TodayTab, workout: WorkoutTab, progress: ProgressTab };
const TAB_KEY = 'nh_last_tab';

export default function App() {
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem(TAB_KEY) ?? 'today'
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem(TAB_KEY, tab);
  };

  const ActiveTab = TABS[activeTab] ?? TodayTab;

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto bg-bg relative">
      {/* Tab content — key forces remount on tab switch for animation */}
      <main key={activeTab} className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        <ActiveTab />
      </main>
      <BottomNav active={activeTab} onSelect={handleTabChange} />
    </div>
  );
}
