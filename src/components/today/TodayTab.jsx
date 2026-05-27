import { useState } from 'react';
import { DAY_NAMES, MONTH_NAMES } from '../../data/habits';
import { useHabits } from '../../hooks/useHabits';
import ProgressRing from '../ui/ProgressRing';
import { HabitSkeleton } from '../ui/Skeleton';
import HabitSection from './HabitSection';
import JournalModal from './JournalModal';
import { CloudOff, Loader2 } from 'lucide-react';

export default function TodayTab() {
  const { sections, checks, streaks, loading, saving, toggle, done, total, pct } = useHabits();
  const [journalOpen, setJournalOpen] = useState(false);

  const now   = new Date();
  const dayName   = DAY_NAMES[now.getDay()];
  const monthName = MONTH_NAMES[now.getMonth()];
  const dateLabel = `${dayName}, ${monthName} ${now.getDate()}`;

  // Greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="tab-content flex-1 flex flex-col pb-24">
      {/* ── Hero header ─────────────────────────────────── */}
      <div className="px-4 pt-14 pb-6 bg-gradient-to-b from-bg-elevated/80 to-transparent">
        <p className="text-text-muted text-sm mb-0.5">{greeting}, Nitin</p>
        <h1 className="font-display text-2xl font-bold text-text-primary">{dateLabel}</h1>

        {/* Progress ring + stats */}
        <div className="flex items-center gap-6 mt-5">
          <ProgressRing pct={pct} size={110} stroke={9}>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-accent leading-none">{pct}%</p>
              <p className="text-[10px] text-text-muted mt-0.5">done</p>
            </div>
          </ProgressRing>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-3xl font-display font-bold text-text-primary">
                {done}
                <span className="text-text-muted text-lg font-normal">/{total}</span>
              </p>
              <p className="text-xs text-text-secondary">habits completed</p>
            </div>
            {pct === 100 && (
              <p className="text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full w-fit">
                🎉 Perfect day!
              </p>
            )}
            {pct > 0 && pct < 100 && (
              <p className="text-xs text-text-muted">{total - done} remaining</p>
            )}
          </div>
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-text-muted">
            <Loader2 size={11} className="animate-spin" /> Syncing…
          </div>
        )}
      </div>

      {/* Offline banner */}
      {!navigator.onLine && (
        <div className="mx-4 mb-3 flex items-center gap-2 bg-warn/10 border border-warn/30 rounded-xl px-3 py-2.5 text-xs text-warn">
          <CloudOff size={13} /> Working offline — changes save when reconnected
        </div>
      )}

      {/* ── Habits list ─────────────────────────────────── */}
      {loading ? (
        <HabitSkeleton />
      ) : (
        <div className="flex-1 space-y-1">
          {sections.map(section => (
            <HabitSection
              key={section.id}
              section={section}
              checks={checks}
              streaks={streaks}
              onToggle={toggle}
              onJournalClick={() => setJournalOpen(true)}
            />
          ))}
          <div className="h-4" />
        </div>
      )}

      {/* Journal modal */}
      {journalOpen && (
        <JournalModal
          onClose={() => setJournalOpen(false)}
          onSaved={() => toggle('night_journal', '3-line journal entry')}
        />
      )}
    </div>
  );
}
