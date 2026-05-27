import { useEffect, useState } from 'react';
import { ChevronDown, AlertTriangle, Award, Clock } from 'lucide-react';
import MuscleSVG from './MuscleSVG';

export default function ExerciseCard({
  exercise, todaySets, lastSets, lastDate, overload,
  onUpdateSet, fetchGif, gifCache,
}) {
  const [expanded, setExpanded]   = useState(false);
  const [gifError, setGifError]   = useState(false);

  const gifUrl = gifCache[exercise.name];

  // Fetch GIF lazily when card becomes visible
  useEffect(() => {
    if (expanded && gifUrl === undefined) fetchGif(exercise.name);
  }, [expanded, exercise.name, gifUrl, fetchGif]);

  // Summarise today's sets
  const todaySetsArr  = Object.entries(todaySets ?? {}).sort((a,b) => a[0]-b[0]);
  const lastSetsArr   = Object.entries(lastSets ?? {}).sort((a,b) => a[0]-b[0]);
  const loggedToday   = todaySetsArr.filter(([,v]) => v.weight || v.reps).length;

  return (
    <div className={`card overflow-hidden transition-all ${overload ? 'ring-1 ring-danger/40' : ''}`}>
      {/* ── Collapsed header ──────────────────────────── */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Thumbnail */}
        <div className="w-[52px] h-[52px] rounded-xl overflow-hidden flex-shrink-0 bg-bg-elevated">
          {gifUrl && !gifError ? (
            <img
              src={gifUrl}
              alt={exercise.name}
              className="w-full h-full object-cover"
              onError={() => setGifError(true)}
            />
          ) : (
            <MuscleSVG color={exercise.muscleColor} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="text-[14px] font-semibold text-text-primary leading-tight">{exercise.name}</p>
            {exercise.everySession && (
              <span className="badge bg-accent/15 text-accent text-[9px] font-bold tracking-wide">
                EVERY SESSION
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className="badge text-[10px] font-semibold text-white/90"
              style={{ backgroundColor: exercise.muscleColor + '30', border: `1px solid ${exercise.muscleColor}40` }}
            >
              {exercise.muscle}
            </span>
            <span className="text-xs text-text-muted">{exercise.sets} × {exercise.reps}</span>
            {loggedToday > 0 && (
              <span className="text-[10px] text-success font-medium">{loggedToday} sets logged ✓</span>
            )}
          </div>
        </div>

        {/* Badges + chevron */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {overload && (
            <span className="flex items-center gap-1 badge bg-danger/15 text-danger text-[9px] font-bold">
              <AlertTriangle size={9} /> UP WEIGHT
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* ── Expanded body ─────────────────────────────── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-bg-border pt-4 animate-fade-in">
          {/* Notes */}
          {exercise.notes && (
            <p className="text-xs text-text-secondary bg-bg-elevated rounded-xl px-3 py-2">
              💡 {exercise.notes}
            </p>
          )}

          {/* GIF (larger) */}
          {gifUrl && !gifError && (
            <div className="rounded-xl overflow-hidden w-full h-40 bg-bg-elevated">
              <img src={gifUrl} alt={exercise.name} className="w-full h-full object-contain" />
            </div>
          )}

          {/* Last session info */}
          {lastDate && lastSetsArr.length > 0 && (
            <div className="bg-bg-elevated rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-text-muted" />
                <span className="text-[11px] text-text-muted">Last session: {lastDate}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lastSetsArr.map(([idx, val]) => (
                  <span key={idx} className="badge bg-bg-card text-text-secondary text-[11px]">
                    Set {+idx+1}: {val.weight ?? '—'}kg × {val.reps ?? '—'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Set logger */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Log sets</p>
            {Array.from({ length: exercise.sets }, (_, i) => {
              const last = lastSets?.[i] ?? {};
              const curr = todaySets?.[i] ?? {};
              return (
                <SetRow
                  key={i}
                  setIndex={i}
                  exercise={exercise}
                  current={curr}
                  lastValues={last}
                  onUpdate={(field, val) => onUpdateSet(exercise.name, exercise.id, i, field, val)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SetRow({ setIndex, exercise, current, lastValues, onUpdate }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold text-text-muted w-12 flex-shrink-0">
        Set {setIndex + 1}
      </span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            inputMode="decimal"
            placeholder={lastValues.weight ? String(lastValues.weight) : 'kg'}
            value={current.weight ?? ''}
            onChange={e => onUpdate('weight', e.target.value)}
            className="input-field text-center"
          />
        </div>
        <span className="text-text-muted text-sm flex-shrink-0">×</span>
        <div className="flex-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder={lastValues.reps ? String(lastValues.reps) : exercise.reps.split('–')[0]}
            value={current.reps ?? ''}
            onChange={e => onUpdate('reps', e.target.value)}
            className="input-field text-center"
          />
        </div>
      </div>
      <span className="text-[10px] text-text-muted w-8 text-right flex-shrink-0">
        {current.weight && current.reps
          ? `${Math.round(current.weight * current.reps)}` : ''}
      </span>
    </div>
  );
}
