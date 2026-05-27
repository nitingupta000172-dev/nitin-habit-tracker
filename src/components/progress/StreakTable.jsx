import { Flame, Trophy } from 'lucide-react';

export default function StreakTable({ rows }) {
  if (!rows.length) {
    return (
      <div className="card p-4 text-center py-8">
        <p className="text-text-muted text-sm">No habit data yet — start checking habits!</p>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h2 className="font-display text-sm font-bold text-text-secondary uppercase tracking-widest mb-3">
        Habit Streaks
      </h2>
      <div className="space-y-2">
        {rows.map((h, i) => (
          <div
            key={h.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors
                        ${h.current === 0
                          ? 'bg-danger/8 border border-danger/20'
                          : 'bg-bg-elevated'}`}
          >
            {/* Rank */}
            <span className="text-[11px] font-bold text-text-muted w-5 text-center flex-shrink-0">
              {i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
            </span>

            {/* Label */}
            <p className={`flex-1 text-[13px] font-medium min-w-0 truncate
                           ${h.current === 0 ? 'text-danger/80' : 'text-text-primary'}`}>
              {h.label}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Current streak */}
              <div className="flex items-center gap-1 min-w-[36px] justify-end">
                {h.current > 0 && <Flame size={11} className="text-warn" />}
                <span className={`text-[12px] font-bold ${h.current === 0 ? 'text-danger' : 'text-warn'}`}>
                  {h.current}d
                </span>
              </div>
              {/* Best */}
              <div className="flex items-center gap-1 min-w-[36px] justify-end">
                <Trophy size={10} className="text-accent" />
                <span className="text-[11px] text-accent">{h.longest}d</span>
              </div>
              {/* Last */}
              <span className="text-[10px] text-text-muted w-16 text-right hidden sm:block">
                {h.lastDate ? h.lastDate.slice(5) : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-bg-border text-[10px] text-text-muted">
        <span className="flex items-center gap-1"><Flame size={9} className="text-warn" /> current streak</span>
        <span className="flex items-center gap-1"><Trophy size={9} className="text-accent" /> personal best</span>
        <span className="text-danger">red = 0-day streak</span>
      </div>
    </div>
  );
}
