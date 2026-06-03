import { useProgress } from '../../hooks/useProgress';
import { SkeletonCard } from '../ui/Skeleton';
import TodayStats from './TodayStats';
import StreakTable from './StreakTable';
import WeakSpots from './WeakSpots';
import ExerciseChart from './ExerciseChart';
import WorkoutHistory from './WorkoutHistory';
import JournalReview from './JournalReview';

export default function ProgressTab() {
  const {
    loading, habitStats, streakTable, weakSpots,
    workoutHistory, journalLog,
    exerciseNames, exerciseData, selectedEx, setSelectedEx,
  } = useProgress();

  return (
    <div className="tab-content flex-1 flex flex-col pb-24">
      {/* Header */}
      <div className="px-4 pt-14 pb-5">
        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">Your</p>
        <h1 className="font-display text-2xl font-bold text-text-primary">Progress</h1>
      </div>

      <div className="flex-1 px-3 space-y-4 overflow-y-auto">
        {loading ? (
          <>
            <SkeletonCard lines={4} />
            <SkeletonCard lines={6} />
            <SkeletonCard lines={3} />
          </>
        ) : (
          <>
            <TodayStats stats={habitStats} />
            {weakSpots.length > 0 && <WeakSpots spots={weakSpots} />}
            <StreakTable rows={streakTable} />
            <ExerciseChart
              exerciseNames={exerciseNames}
              data={exerciseData}
              selected={selectedEx}
              onSelect={setSelectedEx}
            />
            <WorkoutHistory sessions={workoutHistory} />
            <JournalReview entries={journalLog} />
          </>
        )}
        <div className="h-4" />
      </div>
    </div>
  );
}
