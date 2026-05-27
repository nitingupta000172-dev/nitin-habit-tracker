import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import HabitItem from './HabitItem';

export default function HabitSection({ section, checks, streaks, onToggle, onJournalClick }) {
  const [collapsed, setCollapsed] = useState(false);
  const done  = section.items.filter(i => checks[i.id]).length;
  const total = section.items.length;
  const allDone = done === total && total > 0;

  return (
    <div className="mb-3">
      {/* Section header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-4 py-2 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{section.emoji}</span>
          <div>
            <span className={`text-[11px] font-bold tracking-widest uppercase
                              ${allDone ? 'text-success' : 'text-accent'}`}>
              {section.title}
            </span>
            <span className="ml-2 text-[11px] text-text-muted">{section.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold ${allDone ? 'text-success' : 'text-text-secondary'}`}>
            {done}/{total}
          </span>
          <ChevronDown
            size={14}
            className={`text-text-muted transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
          />
        </div>
      </button>

      {/* Items */}
      {!collapsed && (
        <div className="space-y-1.5 px-2 pb-2 animate-fade-in">
          {section.items.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              checked={!!checks[habit.id]}
              streak={streaks[habit.id]}
              onToggle={onToggle}
              onJournalClick={() => onJournalClick?.(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
