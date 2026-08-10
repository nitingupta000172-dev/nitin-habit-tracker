import { useState, useEffect } from 'react';
import { ChevronDown, Zap, CheckCircle2, History, ArrowRight } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { useWorkoutRotation } from '../../hooks/useWorkoutRotation';
import { ROTATION, WORKOUTS, SESSION_BY_DAY } from '../../data/workouts';
import { SkeletonCard } from '../ui/Skeleton';
import ExerciseCard from './ExerciseCard';
import RestTimer from './RestTimer';
import SaveDot from '../ui/SaveDot';

/** 'YYYY-MM-DD' → "today" / "yesterday" / "3d ago" */
function relDay(dateStr, today) {
  if (!dateStr) return null;
  const diff = Math.round((new Date(today + 'T00:00:00') - new Date(dateStr + 'T00:00:00')) / 86400000);
  if (diff <= 0) return 'today';
  if (diff === 1) return 'yesterday';
  if (diff < 7)  return `${diff}d ago`;
  if (diff < 14) return 'last week';
  return `${Math.floor(diff / 7)}w ago`;
}

export default function WorkoutTab() {
  const rotation = useWorkoutRotation();
  const { lastDone, lastDoneBySession, recommendedNext, today } = rotation;

  // Selected session — defaults to the rotation's recommendation once known.
  const [selected, setSelected] = useState(null);
  const [userPicked, setUserPicked] = useState(false);
  useEffect(() => {
    if (!userPicked && recommendedNext) setSelected(recommendedNext);
  }, [recommendedNext, userPicked]);

  const sessionType = selected ?? recommendedNext ?? ROTATION[0];
  const {
    session, todaySets, lastSession, lastDate,
    overload, loading, saveStatus, gifCache, fetchGif, updateSet,
  } = useWorkout(sessionType);

  const [warmupOpen,   setWarmupOpen]   = useState(false);
  const [finisherOpen, setFinisherOpen] = useState(false);
  const [timerActive,  setTimerActive]  = useState(false);

  const completedExercises = session?.exercises.filter(ex => {
    const sets = todaySets[ex.name] ?? {};
    return Array.from({ length: ex.sets }, (_, i) => sets[i] ?? {})
      .every(s => s.weight && s.reps);
  }).length ?? 0;

  const todayHint = SESSION_BY_DAY[new Date().getDay()];
  const isNext = sessionType === recommendedNext;

  return (
    <div className="tab-content flex-1 flex flex-col pb-24">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-4 pt-14 pb-4 bg-gradient-to-b from-bg-elevated/80 to-transparent">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">
              {isNext ? 'Next in your rotation' : 'Workout'}
            </p>
            <h1 className="font-display text-2xl font-bold text-text-primary">{sessionType}</h1>
            <p className="text-sm text-accent mt-0.5">{session?.focus}</p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 bg-accent/15 border border-accent/30 rounded-full px-3 py-1.5">
              <Zap size={13} className="text-accent" />
              <span className="text-xs font-semibold text-accent">
                {session?.exercises.length} exercises
              </span>
            </div>
            {completedExercises > 0 && (
              <div className="flex items-center gap-1.5 bg-success/15 border border-success/30 rounded-full px-3 py-1.5">
                <CheckCircle2 size={12} className="text-success" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-success">
                  {completedExercises}/{session?.exercises.length} done
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Last-done context */}
        {lastDone && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-text-muted">
            <History size={12} />
            <span>
              Last workout: <span className="text-text-secondary font-medium">{lastDone.session}</span>
              {' · '}{relDay(lastDone.date, today)}
            </span>
            <ArrowRight size={11} className="mx-0.5" />
            <span className="text-accent font-medium">{recommendedNext} next</span>
          </div>
        )}

        <SaveDot status={saveStatus} className="mt-2" />
      </div>

      {/* ── Session picker: open ANY plan ──────────────────── */}
      <div className="px-3 pb-1">
        <div className="grid grid-cols-4 gap-1.5">
          {ROTATION.map(s => {
            const active = s === sessionType;
            const rel = relDay(lastDoneBySession[s], today);
            const nextDot = s === recommendedNext;
            return (
              <button
                key={s}
                onClick={() => { setSelected(s); setUserPicked(true); }}
                className={`relative flex flex-col items-center justify-center rounded-xl px-1 py-2 border transition-all active:scale-95
                  ${active
                    ? 'bg-accent/15 border-accent/50 text-accent'
                    : 'bg-bg-card border-bg-border text-text-secondary hover:border-accent/30'}`}
              >
                {nextDot && !active && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
                <span className="text-[12px] font-bold leading-none">{s}</span>
                <span className={`text-[9px] mt-1 leading-none ${active ? 'text-accent/80' : 'text-text-muted'}`}>
                  {WORKOUTS[s].focus.split(' ')[0]}
                </span>
                <span className="text-[9px] mt-0.5 leading-none text-text-muted">
                  {rel ?? 'not yet'}
                </span>
              </button>
            );
          })}
        </div>
        {todayHint === 'Rest' && (
          <p className="text-[10px] text-text-muted text-center mt-1.5">
            Today is a scheduled rest day — or pick a session to catch up.
          </p>
        )}
      </div>

      <div className="flex-1 px-3 space-y-3 overflow-y-auto mt-2">
        {/* ── Warm-up ──────────────────────────────────────── */}
        {session?.warmup?.length > 0 && (
          <div className="card overflow-hidden">
            <button
              onClick={() => setWarmupOpen(o => !o)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <span className="font-semibold text-[15px] text-text-primary">Warm-up</span>
                <span className="text-xs text-text-muted">{session.warmup.length} items</span>
              </div>
              <ChevronDown size={16} className={`text-text-muted transition-transform ${warmupOpen ? 'rotate-180' : ''}`} />
            </button>
            {warmupOpen && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in border-t border-bg-border pt-3">
                {session.warmup.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* mandatory/optional hint */}
        <p className="text-[10px] text-text-muted px-1">
          Exercises 1–4 are mandatory · 5–7 are optional if you're short on time.
        </p>

        {/* ── Exercise cards ───────────────────────────────── */}
        {loading ? (
          <>
            <SkeletonCard lines={4} />
            <SkeletonCard lines={4} />
            <SkeletonCard lines={3} />
          </>
        ) : (
          session?.exercises.map((ex, i) => (
            <ExerciseCard
              key={ex.id}
              index={i + 1}
              exercise={ex}
              todaySets={todaySets[ex.name] ?? {}}
              lastSets={lastSession[ex.name] ?? {}}
              lastDate={lastDate}
              overload={!!overload[ex.id]}
              onUpdateSet={updateSet}
              fetchGif={fetchGif}
              gifCache={gifCache}
              onSetComplete={() => setTimerActive(true)}
            />
          ))
        )}

        {/* ── Finisher ─────────────────────────────────────── */}
        {session?.finisher?.length > 0 && (
          <div className="card overflow-hidden">
            <button
              onClick={() => setFinisherOpen(o => !o)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🧘</span>
                <span className="font-semibold text-[15px] text-text-primary">Finisher</span>
                <span className="text-xs text-text-muted">{session.finisher.length} items</span>
              </div>
              <ChevronDown size={16} className={`text-text-muted transition-transform ${finisherOpen ? 'rotate-180' : ''}`} />
            </button>
            {finisherOpen && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in border-t border-bg-border pt-3">
                {session.finisher.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* ── Rest timer overlay ───────────────────────────────── */}
      {timerActive && <RestTimer onDismiss={() => setTimerActive(false)} />}
    </div>
  );
}
