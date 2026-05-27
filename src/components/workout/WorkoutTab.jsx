import { useState } from 'react';
import { ChevronDown, Zap } from 'lucide-react';
import { useWorkout } from '../../hooks/useWorkout';
import { SkeletonCard } from '../ui/Skeleton';
import ExerciseCard from './ExerciseCard';
import RestDay from './RestDay';

export default function WorkoutTab() {
  const {
    sessionType, session, todaySets, lastSession, lastDate,
    overload, loading, gifCache, fetchGif, updateSet,
  } = useWorkout();

  const [warmupOpen, setWarmupOpen] = useState(false);

  if (sessionType === 'Rest') return <RestDay sessionType="Rest Day" />;

  return (
    <div className="tab-content flex-1 flex flex-col pb-24">
      {/* ── Header ────────────────────────────────────── */}
      <div className="px-4 pt-14 pb-5 bg-gradient-to-b from-bg-elevated/80 to-transparent">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">
              Today's Session
            </p>
            <h1 className="font-display text-2xl font-bold text-text-primary">{sessionType}</h1>
            <p className="text-sm text-accent mt-0.5">{session?.focus}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-accent/15 border border-accent/30 rounded-full px-3 py-1.5">
            <Zap size={13} className="text-accent" />
            <span className="text-xs font-semibold text-accent">{session?.exercises.length} exercises</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 space-y-3 overflow-y-auto">
        {/* ── Warm-up ───────────────────────────────── */}
        {session?.warmup?.length > 0 && (
          <div className="card overflow-hidden">
            <button
              onClick={() => setWarmupOpen(o => !o)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <span className="font-semibold text-[15px] text-text-primary">Warm-up</span>
                <span className="text-xs text-text-muted">{session.warmup.length} exercises</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-text-muted transition-transform ${warmupOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {warmupOpen && (
              <div className="px-4 pb-4 space-y-2 animate-fade-in border-t border-bg-border pt-3">
                {session.warmup.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold
                                     flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Exercise cards ────────────────────────── */}
        {loading ? (
          <>
            <SkeletonCard lines={4} />
            <SkeletonCard lines={4} />
            <SkeletonCard lines={3} />
          </>
        ) : (
          session?.exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              todaySets={todaySets[ex.name] ?? {}}
              lastSets={lastSession[ex.name] ?? {}}
              lastDate={lastDate}
              overload={!!overload[ex.id]}
              onUpdateSet={updateSet}
              fetchGif={fetchGif}
              gifCache={gifCache}
            />
          ))
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
