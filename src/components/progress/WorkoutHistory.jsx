import { useState } from 'react';
import { Dumbbell, ChevronDown } from 'lucide-react';

export default function WorkoutHistory({ sessions }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? sessions : sessions.slice(0, 6);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Dumbbell size={16} className="text-info" />
        <h2 className="font-display text-sm font-bold text-text-secondary uppercase tracking-widest">
          Workout History
        </h2>
      </div>

      {sessions.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">No workouts logged yet</p>
      ) : (
        <>
          <div className="space-y-2">
            {shown.map((s, i) => (
              <div key={i} className="bg-bg-elevated rounded-xl px-3 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={16} className="text-info" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-text-primary truncate">{s.session}</p>
                    <span className="text-[11px] text-text-muted flex-shrink-0">{s.date}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-text-muted">{s.exercises.length} exercises</span>
                    <span className="text-[11px] text-text-muted">{s.sets} sets</span>
                    {s.volume > 0 && (
                      <span className="text-[11px] text-accent">{s.volume.toLocaleString()} kg vol</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sessions.length > 6 && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="flex items-center gap-1.5 mx-auto mt-3 text-xs text-text-secondary hover:text-text-primary"
            >
              <ChevronDown size={13} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
              {showAll ? 'Show less' : `Show ${sessions.length - 6} more`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
