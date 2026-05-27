import { Sun, Dumbbell, BarChart2 } from 'lucide-react';

const TABS = [
  { id: 'today',    label: 'Today',   Icon: Sun },
  { id: 'workout',  label: 'Workout', Icon: Dumbbell },
  { id: 'progress', label: 'Progress',Icon: BarChart2 },
];

export default function BottomNav({ active, onSelect }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-bg-card/90 backdrop-blur-xl border-t border-bg-border safe-bottom">
      <div className="flex items-stretch max-w-lg mx-auto">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all active:scale-90
                          ${isActive ? 'text-accent' : 'text-text-muted hover:text-text-secondary'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </span>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-accent' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
