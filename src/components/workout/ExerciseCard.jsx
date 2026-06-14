import { useEffect, useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, Clock, ChevronDown } from 'lucide-react';
import MuscleSVG from './MuscleSVG';

function playDoubleBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const beep = (at) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.25);
      osc.start(at);
      osc.stop(at + 0.25);
    };
    beep(ctx.currentTime);
    beep(ctx.currentTime + 0.35);
  } catch (_) {}
}

export default function ExerciseCard({
  exercise, todaySets, lastSets, lastDate, overload,
  onUpdateSet, fetchGif, gifCache,
}) {
  const [expanded, setExpanded] = useState(false);
  const [gifError, setGifError] = useState(false);

  const gifUrl = gifCache[exercise.name];

  useEffect(() => {
    if (expanded && gifUrl === undefined) fetchGif(exercise.name);
  }, [expanded, exercise.name, gifUrl, fetchGif]);

  const totalSets  = exercise.sets;
  const loggedSets = Array.from({ length: totalSets }, (_, i) => todaySets?.[i] ?? {})
    .filter(s => s.weight && s.reps).length;
  const allComplete = loggedSets === totalSets;

  const todaySetsArr = Object.entries(todaySets ?? {})
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

      {/* ── Expanded body ─────────────────────────────────── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-bg-border pt-4 animate-fade-in">
          {exercise.notes && (
            <p className="text-xs text-text-secondary bg-bg-elevated rounded-xl px-3 py-2">
              💡 {exercise.notes}
            </p>
          )}

          {gifUrl && !gifError && (
            <div className="rounded-xl overflow-hidden w-full h-40 bg-bg-elevated">
              <img src={gifUrl} alt={exercise.name} className="w-full h-full object-contain" />
            </div>
          )}

          {lastDate && Object.keys(lastSets ?? {}).length > 0 && (
            <div className="bg-bg-elevated rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock size={12} className="text-text-muted" />
                <span className="text-[11px] text-text-muted">Last: {lastDate}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(lastSets).sort((a, b) => +a[0] - +b[0]).map(([idx, val]) => (
                  <span key={idx} className="badge bg-bg-card text-text-secondary text-[11px]">
                    {+idx + 1}: {val.weight ?? '—'} lbs × {val.reps ?? '—'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Set logger ────────────────────────────────── */}
          <div>
            {/* Column headers */}
            <div className="flex items-center gap-2 px-2 mb-1">
              <span className="w-6 flex-shrink-0" />
              <span className="w-[52px] flex-shrink-0 text-[10px] text-text-muted">Prev</span>
              <span className="flex-1 text-[10px] text-text-muted text-center">Weight</span>
              <span className="w-3 flex-shrink-0" />
              <span className="flex-1 text-[10px] text-text-muted text-center">Reps</span>
              <span className="w-8 flex-shrink-0" />
            </div>

            <div className="space-y-1">
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
                    onUpdate={(field, val) =>
                      onUpdateSet(exercise.name, exercise.id, i, field, val)
                    }
                  />
                );
              })}
            </div>
          </div>

          {allComplete && (
            <div className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-2xl px-4 py-3">
              <CheckCircle2 size={20} className="text-success flex-shrink-0" strokeWidth={2} />
              <div>
                <p className="text-sm font-bold text-success">{exercise.name} complete!</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {totalSets} sets · {todaySetsArr.map(([, v]) => `${v.weight}×${v.reps}`).join(', ')}
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
  const [ticked, setTicked] = useState(false);
  const [secs,   setSecs]   = useState(null); // null = no active timer

  // Countdown: tick every second; beep + auto-dismiss at 0
  useEffect(() => {
    if (secs === null) return;
    if (secs <= 0) {
      playDoubleBeep();
      const id = setTimeout(() => setSecs(null), 400);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setSecs(s => (s !== null && s > 0 ? s - 1 : 0)), 1000);
    return () => clearTimeout(id);
  }, [secs]);

  const handleTick = () => {
    if (ticked) {
      setTicked(false);
      setSecs(null);
    } else {
      setTicked(true);
      setSecs(120);
    }
  };

  const prevLabel = (lastValues.weight && lastValues.reps)
    ? `${lastValues.weight}×${lastValues.reps}`
    : '—';

  const pct    = secs !== null ? Math.max(0, (secs / 120) * 100) : 0;
  const mins   = Math.floor((secs ?? 0) / 60);
  const secsStr = ((secs ?? 0) % 60).toString().padStart(2, '0');

  return (
    <div>
      {/* Row: [#] [prev] [weight] [×] [reps] [tick] */}
      <div className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors
                       ${ticked ? 'bg-success/8' : 'bg-transparent'}`}>
        {/* Set number */}
        <span className="text-[11px] font-bold text-text-muted w-6 flex-shrink-0 text-center">
          {setIndex + 1}
        </span>

        {/* Previous weight × reps — greyed out */}
        <span className="text-[11px] text-text-muted w-[52px] flex-shrink-0 tabular-nums truncate">
          {prevLabel}
        </span>

        {/* Weight input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              placeholder={lastValues.weight ? String(lastValues.weight) : 'lbs'}
              value={current.weight ?? ''}
              onChange={e => onUpdate('weight', e.target.value)}
              className="input-field text-center pr-7 py-1.5 text-sm"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted pointer-events-none">
              lb
            </span>
          </div>
        </div>

        <span className="text-text-muted text-xs flex-shrink-0 w-3 text-center">×</span>

        {/* Reps input */}
        <div className="flex-1">
          <input
            type="number"
            inputMode="numeric"
            placeholder={lastValues.reps ? String(lastValues.reps) : exercise.reps.split('–')[0]}
            value={current.reps ?? ''}
            onChange={e => onUpdate('reps', e.target.value)}
            className="input-field text-center py-1.5 text-sm"
          />
        </div>

        {/* Tick button */}
        <button
          onClick={handleTick}
          aria-label={ticked ? 'Unmark set done' : 'Mark set done'}
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                      border-2 transition-all duration-200
                      ${ticked
                        ? 'bg-success border-success shadow-[0_0_8px_rgba(34,197,94,0.35)]'
                        : 'border-bg-border hover:border-success/60 bg-transparent'}`}
        >
          <Check
            size={13}
            strokeWidth={3}
            className={ticked ? 'text-white' : 'text-transparent'}
          />
        </button>
      </div>

      {/* Inline blue countdown bar — tap to dismiss early */}
      {secs !== null && (
        <button
          onClick={() => setSecs(null)}
          className="w-full h-7 rounded-lg overflow-hidden relative mt-0.5 mb-1
                     bg-blue-950/60 border border-blue-500/20 block"
          aria-label="Dismiss rest timer"
        >
          {/* Shrinking fill bar */}
          <div
            className="absolute inset-y-0 left-0 bg-blue-600/75 rounded-lg"
            style={{ width: `${pct}%`, transition: 'width 1s linear' }}
          />
          {/* Time label */}
          <span className="absolute inset-0 flex items-center justify-center
                           text-xs font-bold text-white tabular-nums z-10 drop-shadow">
            {mins}:{secsStr}
          </span>
        </button>
      )}
    </div>
  );
}
