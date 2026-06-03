import { useState } from 'react';
import BottomNav from './components/BottomNav';
import TodayTab from './components/today/TodayTab';
import WorkoutTab from './components/workout/WorkoutTab';
import ProgressTab from './components/progress/ProgressTab';
import ErrorBoundary from './components/ErrorBoundary';

const TAB_KEY = 'nh_last_tab';

// All three tabs are mounted at all times — only visibility changes.
// This preserves React state (inputs, scroll position, timers) across
// tab switches, eliminating the "unsaved set disappears on tab switch" bug.
const TABS = [
  { id: 'today',    Component: TodayTab    },
  { id: 'workout',  Component: WorkoutTab  },
  { id: 'progress', Component: ProgressTab },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem(TAB_KEY) ?? 'today'
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem(TAB_KEY, tab);
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full max-w-lg mx-auto bg-bg relative">
        <main className="flex-1 min-h-0 relative overflow-hidden">
          {TABS.map(({ id, Component }) => (
            // display:none keeps the component mounted (state preserved)
            // but removes it from layout and interaction when not active.
            <div
              key={id}
              className="h-full flex flex-col overflow-y-auto scrollbar-hide"
              style={{ display: activeTab === id ? 'flex' : 'none' }}
            >
              <Component />
            </div>
          ))}
        </main>
        <BottomNav active={activeTab} onSelect={handleTabChange} />
      </div>
    </ErrorBoundary>
  );
}
