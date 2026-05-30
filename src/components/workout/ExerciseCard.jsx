import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ChevronDown } from 'lucide-react';
import MuscleSVG from './MuscleSVG';

export default function ExerciseCard({
  exercise, todaySets, lastSets, lastDate, overload,
  onUpdateSet, fetchGif, gifCache, onSetComplete,
}) {
  // Start expanded so exercises are never hidden after completion
  const [expanded,  setExpanded]  = useState(false);
  const [gifError,  setGifError]  = useState(false);

  const gifUrl = gifCache[exercise.name];

  useEffect(() => {
    if (expanded && gifUrl === undefined) fetchGif(exercise.name);
  }, [expanded, exercise.name, gifUrl, fetchGif]);

  // Count how many sets have BOTH weight AND reps filled
  const totalSets  = exercise.sets;
  const loggedSets = Array.from({ length: totalSets }, (_, i) => todaySets?.[i] ?? {})
    .filter(s => s.weight && s.reps).length;
  const allComplete = loggedSets === totalSets;

  const todaySetsArr = Object.entries(todaySets ?? {})
    .sort((a, b) => Number(a[0]) - Number(b[0]));
  const lastSetsArr  = Object.entries(lastSets  ?? {})
    .sort((a, b) => Number(a[0]) - Number(b[0]));

  return (
    <div
      className={`card overflow-hidden transition-all
        ${overload    ? 'ring-1 ring-danger/40'  : ''}
        ${allComplete ? 'ring-1 ring-success/30' : ''}`}
    >
      {/* ── Collapsed header ─────────────────────────────── */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        {/* Thumbnail */}
        <div className="w-[52px] h-[52px] rounded-xl overflow-hidden flex-shrink-0 bg-bg-elevated">
          {gifUrl && !gifError ? (
            <img
              src={gifUrl} alt={exercise.name}
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
            <p className="text-[14px] font-semibold text-text-primary leading-tight">
              {exercise.name}
            </p>
            {exercise.everySession && (
              <span className="badge bg-accent/15 text-accent text-[9px] font-bold tracking-wide">
                EVERY SESSION
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className="badge text-[10px] font-semibold text-white/90"
              style={{
                backgroundColor: exercise.muscleColor + '30',
                border: `1px solid ${exercise.muscleColor}40`,
              }}
            >
              {exercise.muscle}
            </span>
            <span className="text-xs text-text-muted">{exercise.sets} × {exercise.reps}</span>
          </div>

          {/* Completion status — always visible */}
          {allComplete ? (
            <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-success">
              <CheckCircle2 size={12} strokeWidth={2.5} />
              Completed — {loggedSets} of {totalSets} sets
            </span>
          ) : loggedSets > 0 ? (
            <span className="text-[11px] text-accent font-medium mt-1 block">
              {loggedSets}/{totalSets} sets logged
            </span>
          ) : null}
        </div>

        {/* Right badges + chevron */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {overload && (
            <span className="flex items-center gap-1 badge bg-danger/15 text-danger text-[9px] font-bold">
              <AlertTriangle size={9} /> UP WEIGHT
            </span>
          )}
          {allComplete && (
            <CheckCircle2 size={18} className="text-success" strokeWidth={2} />
          )}
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform duration-200
                        ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* ── Expanded body — always shows when expanded; completed exercises
           stay visible and expanded so user can review their work ──── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-bg-border pt-4 animate-fade-in">
          {/* Notes */}
          {exercise.notes && (
            <p className="text-xs text-text-secondary bg-bg-elevated rounded-xl px-3 py-2">
              💡 {exercise.notes}
            </p>
          )}

          {/* GIF larger */}
          {gifUrl && !gifError && (
            <div className="rounded-xl overflow-hidden w-full h-40 bg-bg-elevated">
              <img src={gifUrl} alt={exercise.name} className="w-full h-full object-contain" />
            </div>
          )}

          {/* Last session */}
          {lastDate && lastSetsArr.length > 0 && (
            <div className="bg-bg-elevated rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-text-muted" />
                <span className="text-[11px] text-text-muted">Last session: {lastDate}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lastSetsArr.map(([idx, val]) => (
                  <span key={idx} className="badge bg-bg-card text-text-secondary text-[11px]">
                    Set {+idx + 1}: {val.weight ?? '—'} lbs × {val.reps ?? '—'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Set logger */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Log sets
            </p>
            {Array.from({ length: totalSets }, (_, i) => {
              const curr = todaySets?.[i] ?? {};
              const last = lastSets?.[i]  ?? {};
              return (
                <SetRow
                  key={i}
                  setIndex={i}
                  exercise={exercise}
                  current={curr}
                  lastValues={last}
                  onUpdate={(field, val) => {
                    onUpdateSet(exercise.name, exercise.id, i, field, val);
                    // Trigger rest timer when this set becomes complete
                    const after = { ...curr, [field]: val };
                    if (after.weight && after.reps) onSetComplete?.();
                  }}
                />
              );
            })}
          </div>

          {/* Completed summary banner */}
          {allComplete && (
            <div className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-2xl px-4 py-3">
              <CheckCircle2 size={20} className="text-success flex-shrink-0" strokeWidth={2} />
              <div>
                <p className="text-sm font-bold text-success">
                  {exercise.name} complete!
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {totalSets} sets · {
                    todaySetsArr.map(([, v]) =>
                      `${v.weight}×${v.reps}`).join(', ')
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SetRow({ setIndex, exercise, current, lastValues, onUpdate }) {
  const isComplete = current.weight && current.reps;
  return (
    <div
      className={`flex items-center gap-2 rounded-xl p-2 transition-colors
                  ${isComplete ? 'bg-success/8' : 'bg-transparent'}`}
    >
      <span className="text-[11px] font-bold text-text-muted w-12 flex-shrink-0">
        Set {setIndex + 1}
        {isComplete && (
          <CheckCircle2 size={10} className="text-success inline ml-1" strokeWidth={2.5} />
        )}
      </span>

      <div className="flex-1 flex items-center gap-2">
        {/* Weight in lbs */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder={lastValues.weight ? String(lastValues.weight) : 'lbs'}
              value={current.weight ?? ''}
              onChange={e => onUpdate('weight', e.target.value)}
              className="input-field text-center pr-8"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-text-muted pointer-events-none">
              lbs
            </span>
          </div>
        </div>

        <span className="text-text-muted text-sm flex-shrink-0">×</span>

        {/* Reps */}
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

      {/* Volume */}
      <span className="text-[10px] text-text-muted w-10 text-right flex-shrink-0 tabular-nums">
        {isComplete ? `${Math.round(current.weight * current.reps)}` : ''}
      </span>
    </div>
  );
}
