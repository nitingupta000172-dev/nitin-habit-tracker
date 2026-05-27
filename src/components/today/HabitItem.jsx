import { useState } from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';

export default function HabitItem({ habit, checked, streak, onToggle, onJournalClick }) {
  const [animating, setAnimating] = useState(false);

  const handleToggle = () => {
    if (habit.isJournal && !checked) {
      onJournalClick?.();
      return;
    }
    setAnimating(true);
    onToggle(habit.id, habit.label);
    setTimeout(() => setAnimating(false), 350);
  };

  return (
    <button
      onClick={handleToggle}
      className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.98]
                  ${checked
                    ? 'bg-accent/8 border border-accent/20'
                    : 'bg-bg-elevated/50 border border-transparent hover:border-bg-border'}`}
    >
      {/* Checkbox */}
      <span className="flex-shrink-0 mt-0.5">
        {checked ? (
          <CheckCircle2
            size={22}
            className={`text-accent ${animating ? 'animate-check' : ''}`}
            strokeWidth={2}
          />
        ) : (
          <span className="w-[22px] h-[22px] rounded-full border-2 border-bg-border block" />
        )}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-medium leading-snug
                       ${checked ? 'text-text-secondary line-through decoration-text-muted' : 'text-text-primary'}`}>
          {habit.label}
        </p>
        {habit.subtitle && (
          <p className={`text-xs mt-0.5 ${checked ? 'text-text-muted' : 'text-text-secondary'}`}>
            {habit.subtitle}
          </p>
        )}
        {habit.badge && (
          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                           bg-accent/15 text-accent tracking-wide">
            {habit.badge}
          </span>
        )}
        {/* Streak */}
        {streak?.current > 0 && (
          <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-warn">
            <Flame size={11} /> {streak.current}d streak
          </span>
        )}
      </div>
    </button>
  );
}
