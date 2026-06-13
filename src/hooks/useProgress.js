import { useState, useEffect, useCallback } from 'react';
import { supabase, toDateStr, offsetDate } from '../lib/supabase';
import { SESSION_BY_DAY } from '../data/workouts';
import { getHabitsForDay } from '../data/habits';

export function useProgress() {
  const [habitStats,    setHabitStats]    = useState(null);
  const [streakTable,   setStreakTable]   = useState([]);
  const [weakSpots,     setWeakSpots]     = useState([]);
  const [workoutHistory,setWorkoutHistory]= useState([]);
  const [journalLog,    setJournalLog]    = useState([]);
  const [exerciseNames, setExerciseNames] = useState([]);
  const [exerciseData,  setExerciseData]  = useState([]);   // for selected exercise chart
  const [selectedEx,    setSelectedEx]    = useState('');
  const [loading,       setLoading]       = useState(true);

  // ── Today stats ───────────────────────────────────────────
  const fetchTodayStats = useCallback(async () => {
    const today = toDateStr();
    const day   = new Date().getDay();
    const sections = getHabitsForDay(day);
    const allIds = sections.flatMap(s => s.items.map(i => i.id));
    const total = allIds.length;

    const { data } = await supabase
      .from('habit_checks')
      .select('habit_id')
      .eq('date', today)
      .eq('checked', true);
    const done = (data ?? []).filter(r => allIds.includes(r.habit_id)).length;

    const { data: sets } = await supabase
      .from('workout_sets')
      .select('exercise_name')
      .eq('date', today);
    const uniqueEx = new Set((sets ?? []).map(r => r.exercise_name)).size;
    setHabitStats({ done, total, pct: total ? Math.round((done/total)*100) : 0, exercises: uniqueEx,
                    session: SESSION_BY_DAY[day] });
  }, []);

  // ── Streak table ──────────────────────────────────────────
  const fetchStreaks = useCallback(async () => {
    const today = toDateStr();
    const since = offsetDate(-365);
    const { data } = await supabase
      .from('habit_checks')
      .select('habit_id, habit_label, date, checked')
      .gte('date', since)
      .order('date', { ascending: true });

    if (!data?.length) { setStreakTable([]); setWeakSpots([]); return; }

    // Group by habit_id
    const map = {};
    data.forEach(r => {
      if (!map[r.habit_id]) map[r.habit_id] = { label: r.habit_label ?? r.habit_id, dates: [], checked: [] };
      map[r.habit_id].dates.push(r.date);
      map[r.habit_id].checked.push(r.checked);
    });

    const table = [];
    const earliest = data[0]?.date;
    const daysSince = earliest ? Math.max(1, Math.ceil((new Date(today) - new Date(earliest)) / 86400000) + 1) : 1;

    Object.entries(map).forEach(([id, { label, dates, checked }]) => {
      const checkedSet = new Set(dates.filter((_, i) => checked[i]));
      const sorted = [...checkedSet].sort();

      // Current streak
      let current = 0;
      let d = offsetDate(-1);
      while (checkedSet.has(d)) {
        current++;
        const dt = new Date(d + 'T00:00:00'); dt.setDate(dt.getDate() - 1); d = toDateStr(dt);
      }
      if (checkedSet.has(today)) current++;

      // Longest streak
      let longest = 0, run = 0, prev = null;
      sorted.forEach(ds => {
        if (prev) {
          const gap = (new Date(ds) - new Date(prev)) / 86400000;
          run = gap === 1 ? run + 1 : 1;
        } else { run = 1; }
        longest = Math.max(longest, run);
        prev = ds;
      });
      longest = Math.max(longest, current);

      // Consistency %
      const totalChecked = sorted.length;
      const consistency = Math.round((totalChecked / daysSince) * 100);

      table.push({ id, label, current, longest, lastDate: sorted[sorted.length - 1] ?? null, consistency });
    });

    table.sort((a, b) => b.current - a.current);
    setStreakTable(table);

    // Weak spots: consistency < 60% with at least 7 appearances
    const weak = table.filter(h => h.consistency < 60 && (h.current + h.longest) > 0);
    setWeakSpots(weak);
  }, []);

  // ── Workout history ───────────────────────────────────────
  const fetchWorkoutHistory = useCallback(async () => {
    const { data } = await supabase
      .from('workout_sets')
      .select('date, session_type, exercise_name, weight, reps')
      .order('date', { ascending: false })
      .limit(300);

    if (!data?.length) { setWorkoutHistory([]); return; }

    const byDate = {};
    data.forEach(r => {
      if (!byDate[r.date]) byDate[r.date] = { date: r.date, session: r.session_type, exercises: new Set(), sets: 0, volume: 0 };
      byDate[r.date].exercises.add(r.exercise_name);
      byDate[r.date].sets++;
      byDate[r.date].volume += (r.weight ?? 0) * (r.reps ?? 0);
    });

    const history = Object.values(byDate).map(d => ({
      ...d, exercises: [...d.exercises], volume: Math.round(d.volume)
    }));
    setWorkoutHistory(history);

    // Exercise names for chart dropdown
    const names = [...new Set(data.map(r => r.exercise_name))].sort();
    setExerciseNames(names);
    if (!selectedEx && names.length) setSelectedEx(names[0]);
  }, [selectedEx]);

  // ── Exercise chart data ───────────────────────────────────
  const fetchExerciseChart = useCallback(async (name) => {
    if (!name) return;
    const { data } = await supabase
      .from('workout_sets')
      .select('date, weight, reps')
      .eq('exercise_name', name)
      .order('date', { ascending: true });

    // Max weight per date
    const byDate = {};
    (data ?? []).forEach(r => {
      if (!byDate[r.date] || (r.weight ?? 0) > byDate[r.date].weight)
        byDate[r.date] = { date: r.date, weight: r.weight ?? 0, reps: r.reps ?? 0 };
    });
    setExerciseData(Object.values(byDate));
  }, []);

  useEffect(() => {
    if (selectedEx) fetchExerciseChart(selectedEx);
  }, [selectedEx, fetchExerciseChart]);

  // ── Journal log ───────────────────────────────────────────
  const fetchJournal = useCallback(async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);
    setJournalLog(data ?? []);
  }, []);

  // ── Init ─────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTodayStats(), fetchStreaks(), fetchWorkoutHistory(), fetchJournal()]);
      setLoading(false);
    };
    init();
  }, [fetchTodayStats, fetchStreaks, fetchWorkoutHistory, fetchJournal]);

  return {
    loading, habitStats, streakTable, weakSpots, workoutHistory,
    journalLog, exerciseNames, exerciseData, selectedEx, setSelectedEx,
  };
}
