import { BookOpen } from 'lucide-react';

const MOOD_EMOJI = ['', '😫', '😕', '😐', '🙂', '😄'];

export default function JournalReview({ entries }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-accent" />
        <h2 className="font-display text-sm font-bold text-text-secondary uppercase tracking-widest">
          Journal (last 7)
        </h2>
      </div>

      {entries.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-6">
          No journal entries yet — tap the "3-line journal entry" habit to start
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map(e => (
            <div key={e.id} className="bg-bg-elevated rounded-2xl p-4 space-y-2.5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-text-muted">{e.date}</span>
                {e.mood && (
                  <span className="text-xl leading-none" title={`Mood: ${e.mood}/5`}>
                    {MOOD_EMOJI[e.mood]}
                  </span>
                )}
              </div>
              {/* Fields */}
              {e.triggered && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted mb-0.5">
                    Triggered by
                  </p>
                  <p className="text-[13px] text-text-primary leading-snug">{e.triggered}</p>
                </div>
              )}
              {e.did_instead && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-success/70 mb-0.5">
                    Did instead
                  </p>
                  <p className="text-[13px] text-text-primary leading-snug">{e.did_instead}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
